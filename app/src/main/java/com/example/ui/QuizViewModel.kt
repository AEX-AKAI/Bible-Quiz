package com.example.ui

import android.app.Application
import android.os.SystemClock
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.core.audio.GameAudioEngine
import com.example.core.audio.HapticEngine
import com.example.core.challenge.AnswerValidationResult
import com.example.core.challenge.LiveChallengeSimulator
import com.example.core.challenge.ServerScoringValidator
import com.example.core.scoring.QuestionScoreResult
import com.example.core.scoring.ScoringEngine
import com.example.core.scoring.SpeedFeedbackType
import com.example.data.db.AppDatabase
import com.example.data.model.AnswerReviewItem
import com.example.data.model.AnswerSubmissionEvent
import com.example.data.model.ChallengeConfig
import com.example.data.model.ChallengeDifficulty
import com.example.data.model.ChallengeResult
import com.example.data.model.Question
import com.example.data.repository.QuizRepository
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

enum class ScreenState {
    LOBBY,
    CREATE_CHALLENGE,
    JOIN_CHALLENGE,
    IN_GAME,
    RESULTS,
    LEADERBOARD,
    QUESTION_EXPLORER
}

data class SpeedFeedbackVisual(
    val pointsText: String,
    val title: String,
    val comboText: String,
    val type: SpeedFeedbackType,
    val isCorrect: Boolean,
    val speedBonusPoints: Int = 0,
    val timestamp: Long = System.currentTimeMillis()
)

data class QuizUiState(
    val currentScreen: ScreenState = ScreenState.LOBBY,
    val masterQuestionCount: Int = 0,
    val isPopulatingBank: Boolean = false,
    val currentConfig: ChallengeConfig = ChallengeConfig(),

    // In-game state
    val questions: List<Question> = emptyList(),
    val currentQuestionIndex: Int = 0,
    val currentQuestion: Question? = null,
    val score: Double = 0.0,
    val currentCombo: Int = 0,
    val bestCombo: Int = 0,
    val correctCount: Int = 0,
    val incorrectCount: Int = 0,
    val fastAnswersCount: Int = 0,
    val timeRemainingSeconds: Int = 180,
    val totalTimeSeconds: Int = 180,
    val isTimerActive: Boolean = false,
    val lastFeedback: SpeedFeedbackVisual? = null,
    val lastResponseTimeSeconds: Double = 0.0,
    val difficultyTransition: Pair<String, String>? = null,
    val particleTrigger: Long = 0L,
    val isMilestoneParticle: Boolean = false,
    val selectedOptionFeedback: String? = null,
    val isEvaluatingAnswer: Boolean = false,
    val answerHistory: List<AnswerReviewItem> = emptyList(),

    // Post-game results
    val latestResult: ChallengeResult? = null,
    val matchLeaderboard: List<ChallengeResult> = emptyList(),

    // Explorer search query
    val searchQuery: String = "",
    val searchResults: List<Question> = emptyList()
)

class QuizViewModel(application: Application) : AndroidViewModel(application) {

    private val repository: QuizRepository = QuizRepository(AppDatabase.getInstance(application))
    private val audioEngine: GameAudioEngine = GameAudioEngine.getInstance(application)
    private val hapticEngine: HapticEngine = HapticEngine.getInstance(application)

    private val _uiState = MutableStateFlow(QuizUiState())
    val uiState: StateFlow<QuizUiState> = _uiState.asStateFlow()

    val leaderboard: StateFlow<List<ChallengeResult>> = repository.leaderboard
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val recentMatches: StateFlow<List<ChallengeResult>> = repository.recentMatches
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val allCategories: StateFlow<List<String>> = repository.allCategories
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    private var timerJob: Job? = null
    private var questionStartTimeRealtime: Long = 0L
    private var serverValidator: ServerScoringValidator? = null

    init {
        // Collect question count
        viewModelScope.launch {
            repository.activeQuestionCount.collect { count ->
                _uiState.update { it.copy(masterQuestionCount = count) }
            }
        }

        // Initialize question bank if needed
        viewModelScope.launch {
            ensureQuestionBankReady()
        }
    }

    fun ensureQuestionBankReady(force10k: Boolean = false) {
        viewModelScope.launch {
            _uiState.update { it.copy(isPopulatingBank = true) }
            val target = if (force10k) 10000 else 1000 // fast initial seed, full 10k expandable
            repository.ensureMasterBankPopulated(target)
            _uiState.update { it.copy(isPopulatingBank = false) }
        }
    }

    fun populateFull10k() {
        viewModelScope.launch {
            _uiState.update { it.copy(isPopulatingBank = true) }
            repository.ensureMasterBankPopulated(10000, forceReload = true)
            _uiState.update { it.copy(isPopulatingBank = false) }
        }
    }

    fun navigateTo(screen: ScreenState) {
        if (screen == ScreenState.LOBBY) {
            audioEngine.startAmbientMusic(inQuiz = false)
        }
        _uiState.update { it.copy(currentScreen = screen) }
    }

    fun clearDifficultyTransition() {
        _uiState.update { it.copy(difficultyTransition = null) }
    }

    fun startChallenge(config: ChallengeConfig) {
        audioEngine.playChallengeStarted()
        audioEngine.startAmbientMusic(inQuiz = true)

        viewModelScope.launch {
            _uiState.update { it.copy(isPopulatingBank = true) }
            val sequence = repository.getDeterministicQuestionSequence(config, requestedBatchSize = 300)

            if (sequence.isEmpty()) {
                // Ensure at least core questions
                repository.ensureMasterBankPopulated(100)
            }

            val validSequence = if (sequence.isEmpty()) {
                repository.getDeterministicQuestionSequence(config, requestedBatchSize = 100)
            } else sequence

            val now = System.currentTimeMillis()
            val endTime = now + (config.timeLimitSeconds * 1000L)
            serverValidator = ServerScoringValidator(
                challengeId = config.challengeId,
                startTimeMillis = now,
                endTimeMillis = endTime,
                officialSequence = validSequence
            )

            questionStartTimeRealtime = SystemClock.elapsedRealtime()

            _uiState.update {
                it.copy(
                    currentScreen = ScreenState.IN_GAME,
                    isPopulatingBank = false,
                    currentConfig = config,
                    questions = validSequence,
                    currentQuestionIndex = 0,
                    currentQuestion = validSequence.firstOrNull(),
                    score = 0.0,
                    currentCombo = 0,
                    bestCombo = 0,
                    correctCount = 0,
                    incorrectCount = 0,
                    fastAnswersCount = 0,
                    timeRemainingSeconds = config.timeLimitSeconds,
                    totalTimeSeconds = config.timeLimitSeconds,
                    isTimerActive = true,
                    lastFeedback = null,
                    lastResponseTimeSeconds = 0.0,
                    difficultyTransition = null,
                    particleTrigger = 0L,
                    isMilestoneParticle = false,
                    selectedOptionFeedback = null,
                    isEvaluatingAnswer = false,
                    answerHistory = emptyList(),
                    latestResult = null
                )
            }

            startTimer(config.timeLimitSeconds)
        }
    }

    private fun startTimer(durationSeconds: Int) {
        timerJob?.cancel()
        timerJob = viewModelScope.launch {
            var remaining = durationSeconds
            val total = durationSeconds
            val warn25 = (total * 0.25).toInt()
            val warn10 = (total * 0.10).toInt()

            while (remaining > 0 && _uiState.value.isTimerActive) {
                delay(1000L)
                remaining--
                _uiState.update { it.copy(timeRemainingSeconds = remaining) }

                if (remaining in 1..5) {
                    audioEngine.playCountdownTick()
                } else if (remaining == warn25 || remaining == warn10) {
                    audioEngine.playTimerWarning()
                }
            }
            if (_uiState.value.isTimerActive) {
                finishChallenge()
            }
        }
    }

    fun submitAnswer(selectedAnswer: String) {
        val state = _uiState.value
        if (!state.isTimerActive || state.timeRemainingSeconds <= 0 || state.isEvaluatingAnswer) return

        val currentQ = state.currentQuestion ?: return
        val nowRealtime = SystemClock.elapsedRealtime()
        val responseTimeMs = maxOf(nowRealtime - questionStartTimeRealtime, 60L)
        val responseTimeSeconds = responseTimeMs / 1000.0

        audioEngine.playAnswerSelected()

        // Anti-cheat authoritative validation
        val event = AnswerSubmissionEvent(
            challengeId = state.currentConfig.challengeId,
            playerId = state.currentConfig.playerName,
            questionId = currentQ.questionId,
            selectedAnswer = selectedAnswer,
            sequencePosition = state.currentQuestionIndex,
            clientTimestamp = System.currentTimeMillis(),
            responseTimeMs = responseTimeMs
        )

        val validator = serverValidator
        val scoreResult: QuestionScoreResult = if (validator != null) {
            val validation = validator.validateAndScore(event)
            when (validation) {
                is AnswerValidationResult.Valid -> validation.scoreResult
                is AnswerValidationResult.Rejected -> {
                    // Fallback to local evaluation if rejection was network/test mock
                    ScoringEngine.scoreAnswer(
                        isCorrect = selectedAnswer == currentQ.correctAnswer,
                        responseTimeSeconds = responseTimeSeconds,
                        previousCombo = state.currentCombo,
                        previousBestCombo = state.bestCombo
                    )
                }
            }
        } else {
            ScoringEngine.scoreAnswer(
                isCorrect = selectedAnswer == currentQ.correctAnswer,
                responseTimeSeconds = responseTimeSeconds,
                previousCombo = state.currentCombo,
                previousBestCombo = state.bestCombo
            )
        }

        // Trigger Audio & Haptic Feedback immediately
        if (scoreResult.isCorrect) {
            audioEngine.playCorrect()
            hapticEngine.vibrateCorrect()
            if (responseTimeSeconds <= ScoringEngine.SPEED_WINDOW_SECONDS) {
                audioEngine.playSpeedBonus()
                hapticEngine.vibrateSpeedBonus()
            }
            if (scoreResult.currentCombo > 0 && scoreResult.currentCombo % 5 == 0) {
                audioEngine.playComboMilestone(scoreResult.currentCombo)
                hapticEngine.vibrateComboMilestone()
            } else if (scoreResult.currentCombo > 1) {
                audioEngine.playCombo(scoreResult.currentCombo)
            }
        } else {
            audioEngine.playIncorrect()
            hapticEngine.vibrateIncorrect()
        }

        // Prepare visual feedback
        val pointsStr = if (scoreResult.isCorrect) "+${scoreResult.totalQuestionScore.toInt()}" else "0"
        val comboStr = if (scoreResult.currentCombo > 0) "COMBO ×${scoreResult.currentCombo}" else "COMBO BREAK"
        val feedbackVisual = SpeedFeedbackVisual(
            pointsText = pointsStr,
            title = scoreResult.message,
            comboText = comboStr,
            type = scoreResult.feedbackType,
            isCorrect = scoreResult.isCorrect,
            speedBonusPoints = scoreResult.adjustedSpeedBonus.toInt()
        )

        val newHistoryItem = AnswerReviewItem(
            sequenceNumber = state.currentQuestionIndex + 1,
            question = currentQ,
            selectedAnswer = selectedAnswer,
            isCorrect = scoreResult.isCorrect,
            responseTimeSeconds = responseTimeSeconds,
            pointsEarned = scoreResult.totalQuestionScore,
            comboAtTime = scoreResult.currentCombo
        )

        val nextIndex = state.currentQuestionIndex + 1
        val nextQuestion = state.questions.getOrNull(nextIndex)

        // Check difficulty increase transition every 5 questions
        val hasDifficultyIncreased = (nextIndex > 0 && nextIndex % 5 == 0)
        val diffTransition = if (hasDifficultyIncreased) {
            audioEngine.playDifficultyIncrease()
            val oldDiff = currentQ.difficulty
            val newDiff = nextQuestion?.difficulty ?: oldDiff
            Pair(oldDiff, newDiff)
        } else null

        val isMilestone = scoreResult.isCorrect && (scoreResult.currentCombo % 5 == 0 || responseTimeSeconds <= 1.0)
        val particleTrigger = if (scoreResult.isCorrect) System.currentTimeMillis() else 0L

        val updatedHistory = state.answerHistory + newHistoryItem
        val updatedCorrect = if (scoreResult.isCorrect) state.correctCount + 1 else state.correctCount
        val updatedIncorrect = if (!scoreResult.isCorrect) state.incorrectCount + 1 else state.incorrectCount
        val updatedFast = if (scoreResult.isCorrect && responseTimeSeconds <= ScoringEngine.SPEED_WINDOW_SECONDS) {
            state.fastAnswersCount + 1
        } else state.fastAnswersCount

        // Show fast feedback on selected button, then transition
        _uiState.update { cur ->
            cur.copy(
                selectedOptionFeedback = selectedAnswer,
                isEvaluatingAnswer = true,
                lastFeedback = feedbackVisual,
                lastResponseTimeSeconds = responseTimeSeconds,
                particleTrigger = particleTrigger,
                isMilestoneParticle = isMilestone
            )
        }

        viewModelScope.launch {
            delay(280L)
            questionStartTimeRealtime = SystemClock.elapsedRealtime()

            _uiState.update { cur ->
                cur.copy(
                    score = cur.score + scoreResult.totalQuestionScore,
                    currentCombo = scoreResult.currentCombo,
                    bestCombo = scoreResult.bestCombo,
                    correctCount = updatedCorrect,
                    incorrectCount = updatedIncorrect,
                    fastAnswersCount = updatedFast,
                    difficultyTransition = diffTransition,
                    selectedOptionFeedback = null,
                    isEvaluatingAnswer = false,
                    answerHistory = updatedHistory,
                    currentQuestionIndex = nextIndex,
                    currentQuestion = nextQuestion
                )
            }
        }

        // If ran out of buffered questions in memory, fetch next chunk
        if (nextQuestion == null) {
            viewModelScope.launch {
                val moreQuestions = repository.getDeterministicQuestionSequence(
                    state.currentConfig,
                    requestedBatchSize = 100
                )
                _uiState.update { cur ->
                    val combined = cur.questions + moreQuestions
                    cur.copy(
                        questions = combined,
                        currentQuestion = combined.getOrNull(nextIndex)
                    )
                }
            }
        }
    }

    fun finishChallenge() {
        timerJob?.cancel()
        audioEngine.playChallengeCompleted()
        hapticEngine.vibrateChallengeCompleted()
        audioEngine.setQuizMusicDucking(false)

        val state = _uiState.value
        val totalAnswered = state.correctCount + state.incorrectCount
        val accuracy = if (totalAnswered > 0) {
            Math.round((state.correctCount.toDouble() / totalAnswered * 100.0) * 10.0) / 10.0
        } else 0.0

        val avgResponseTime = if (state.answerHistory.isNotEmpty()) {
            val avg = state.answerHistory.map { it.responseTimeSeconds }.average()
            Math.round(avg * 10.0) / 10.0
        } else 0.0

        val finalScore = ScoringEngine.roundScorePrecision(state.score)

        val result = ChallengeResult(
            challengeId = state.currentConfig.challengeId,
            seed = state.currentConfig.seed,
            playerName = state.currentConfig.playerName,
            finalScore = finalScore,
            questionsAnswered = totalAnswered,
            correctAnswers = state.correctCount,
            incorrectAnswers = state.incorrectCount,
            accuracyPercentage = accuracy,
            fastAnswersCount = state.fastAnswersCount,
            bestCombo = state.bestCombo,
            averageResponseTimeSeconds = avgResponseTime,
            durationSeconds = state.totalTimeSeconds,
            difficulty = state.currentConfig.difficulty.name,
            isOnline = state.currentConfig.isOnline
        )

        viewModelScope.launch {
            repository.saveResult(result)
            val matchLobby = LiveChallengeSimulator.generateCompetitorsForChallenge(
                config = state.currentConfig,
                userResult = result
            )

            val userRank = matchLobby.indexOfFirst { it.resultId == result.resultId } + 1
            if (userRank == 1) {
                audioEngine.playVictory()
            } else if (matchLobby.size > 1 && matchLobby[0].finalScore == result.finalScore) {
                audioEngine.playDraw()
            } else {
                audioEngine.playDefeat()
            }

            _uiState.update {
                it.copy(
                    isTimerActive = false,
                    currentScreen = ScreenState.RESULTS,
                    latestResult = result,
                    matchLeaderboard = matchLobby
                )
            }
        }
    }

    fun restartChallengeSameSeed() {
        val config = _uiState.value.currentConfig
        startChallenge(config)
    }

    fun restartChallengeNewSeed() {
        val old = _uiState.value.currentConfig
        val newConfig = old.copy(
            challengeId = ChallengeConfig.generateChallengeId(),
            seed = System.currentTimeMillis() xor (1L shl 30)
        )
        startChallenge(newConfig)
    }

    fun searchMasterBank(query: String) {
        _uiState.update { it.copy(searchQuery = query) }
        viewModelScope.launch {
            if (query.isBlank()) {
                _uiState.update { it.copy(searchResults = emptyList()) }
            } else {
                val results = repository.searchQuestions(query)
                _uiState.update { it.copy(searchResults = results) }
            }
        }
    }
}
