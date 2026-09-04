package com.example.core.challenge

import com.example.core.scoring.QuestionScoreResult
import com.example.core.scoring.ScoringEngine
import com.example.core.scoring.SpeedFeedbackType
import com.example.data.model.AnswerSubmissionEvent
import com.example.data.model.Question

sealed class AnswerValidationResult {
    data class Valid(val scoreResult: QuestionScoreResult) : AnswerValidationResult()
    data class Rejected(val reason: AntiCheatViolation) : AnswerValidationResult()
}

enum class AntiCheatViolation {
    CHALLENGE_EXPIRED,
    DUPLICATE_QUESTION_SUBMISSION,
    SEQUENCE_MISMATCH,
    INVALID_QUESTION_ID,
    IMPOSSIBLE_RESPONSE_TIME,
    REPLAY_DETECTED
}

/**
 * Server-authoritative Scoring & Anti-Cheat Validator.
 * Prevents client-side manipulation of score, sequence, and timestamps.
 */
class ServerScoringValidator(
    val challengeId: String,
    val startTimeMillis: Long,
    val endTimeMillis: Long,
    private val officialSequence: List<Question>
) {
    private val answeredQuestionIds = mutableSetOf<String>()
    private val processedEventIds = mutableSetOf<String>()
    var verifiedScore: Double = 0.0
        private set
    var currentCombo: Int = 0
        private set
    var bestCombo: Int = 0
        private set
    var totalAnswered: Int = 0
        private set
    var correctCount: Int = 0
        private set
    var fastAnswersCount: Int = 0
        private set
    private val responseTimes = mutableListOf<Double>()

    /**
     * Authoritatively validates and scores an incoming AnswerSubmissionEvent.
     */
    fun validateAndScore(
        event: AnswerSubmissionEvent,
        serverTimestamp: Long = System.currentTimeMillis()
    ): AnswerValidationResult {
        // 1. Check replay attack
        if (processedEventIds.contains(event.eventId)) {
            return AnswerValidationResult.Rejected(AntiCheatViolation.REPLAY_DETECTED)
        }
        processedEventIds.add(event.eventId)

        // 2. Check challenge expiration
        if (serverTimestamp > endTimeMillis) {
            return AnswerValidationResult.Rejected(AntiCheatViolation.CHALLENGE_EXPIRED)
        }

        // 3. Check duplicate question submission
        if (answeredQuestionIds.contains(event.questionId)) {
            return AnswerValidationResult.Rejected(AntiCheatViolation.DUPLICATE_QUESTION_SUBMISSION)
        }

        // 4. Validate sequence position
        if (event.sequencePosition < 0 || event.sequencePosition >= officialSequence.size) {
            return AnswerValidationResult.Rejected(AntiCheatViolation.SEQUENCE_MISMATCH)
        }
        val expectedQuestion = officialSequence[event.sequencePosition]
        if (expectedQuestion.questionId != event.questionId) {
            return AnswerValidationResult.Rejected(AntiCheatViolation.SEQUENCE_MISMATCH)
        }

        // 5. Check impossible response time (< 50ms human reflex floor)
        if (event.responseTimeMs < 50) {
            return AnswerValidationResult.Rejected(AntiCheatViolation.IMPOSSIBLE_RESPONSE_TIME)
        }

        // Mark answered
        answeredQuestionIds.add(event.questionId)
        totalAnswered++

        val responseSeconds = event.responseTimeMs / 1000.0
        responseTimes.add(responseSeconds)

        val isCorrect = event.selectedAnswer == expectedQuestion.correctAnswer

        val scoreResult = ScoringEngine.scoreAnswer(
            isCorrect = isCorrect,
            responseTimeSeconds = responseSeconds,
            previousCombo = currentCombo,
            previousBestCombo = bestCombo
        )

        // Update server authoritative state
        verifiedScore += scoreResult.totalQuestionScore
        currentCombo = scoreResult.currentCombo
        bestCombo = scoreResult.bestCombo
        if (isCorrect) {
            correctCount++
            if (responseSeconds <= ScoringEngine.SPEED_WINDOW_SECONDS) {
                fastAnswersCount++
            }
        }

        return AnswerValidationResult.Valid(scoreResult)
    }

    val averageResponseTimeSeconds: Double
        get() = if (responseTimes.isEmpty()) 0.0 else responseTimes.average()

    val accuracyPercentage: Double
        get() = if (totalAnswered == 0) 0.0 else (correctCount.toDouble() / totalAnswered * 100.0)
}
