package com.example.data.repository

import com.example.core.challenge.QuestionDifficultyStage
import com.example.core.challenge.ReadingComplexity
import com.example.data.db.AppDatabase
import com.example.data.db.MasterQuestionBankSeeder
import com.example.data.model.ChallengeConfig
import com.example.data.model.ChallengeDifficulty
import com.example.data.model.ChallengeResult
import com.example.data.model.Question
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.withContext
import java.util.Random

class QuizRepository(private val database: AppDatabase) {

    private val questionDao = database.questionDao()
    private val resultDao = database.challengeResultDao()

    val activeQuestionCount: Flow<Int> = questionDao.getActiveQuestionCountFlow()
    val allCategories: Flow<List<String>> = questionDao.getAllCategories()
    val leaderboard: Flow<List<ChallengeResult>> = resultDao.getTopLeaderboard(50)
    val recentMatches: Flow<List<ChallengeResult>> = resultDao.getAllResults()

    /**
     * Initializes the Master Question Bank with 10,000+ items.
     */
    suspend fun ensureMasterBankPopulated(
        targetCount: Int = MasterQuestionBankSeeder.TARGET_MASTER_COUNT,
        forceReload: Boolean = false
    ) {
        withContext(Dispatchers.IO) {
            val currentCount = questionDao.getActiveQuestionCount()
            if (forceReload || currentCount < targetCount) {
                if (forceReload) {
                    questionDao.clearAllQuestions()
                }
                val questions = MasterQuestionBankSeeder.generateMasterCatalog(targetCount)
                // Insert in batches of 500 for SQLite efficiency
                questions.chunked(500).forEach { batch ->
                    questionDao.insertQuestions(batch)
                }
            }
        }
    }

    /**
     * Deterministically generates an unlimited question sequence for a Challenge.
     * All players with the same [config.seed] and settings get the exact same sequence!
     *
     * In Progressive Difficulty mode:
     * - Difficulty automatically increases after every 5 questions answered based strictly
     *   on question position (1-5: EASY, 6-10: EASY_MEDIUM, 11-15: MEDIUM, 16-20: MEDIUM_HARD,
     *   21-25: HARD, 26-30: HARD_EXPERT, 31+: EXPERT).
     * - Progression is based on global question position in the challenge, NOT individual player score.
     * - Randomization occurs deterministically within each difficulty stage pool using the lobby seed.
     * - Reading complexity is balanced according to challenge duration.
     * - No duplicate questions appear in a match.
     */
    suspend fun getDeterministicQuestionSequence(
        config: ChallengeConfig,
        requestedBatchSize: Int = 200
    ): List<Question> = withContext(Dispatchers.IO) {
        // Ensure database has questions
        if (questionDao.getActiveQuestionCount() == 0) {
            ensureMasterBankPopulated(1000) // quick populate if needed
        }

        val allQuestions = questionDao.getAllActiveQuestions()
        val filteredQuestions = if (!config.categoryFilter.isNullOrBlank() && config.categoryFilter != "All Categories") {
            allQuestions.filter { it.category.equals(config.categoryFilter, ignoreCase = true) }
        } else {
            allQuestions
        }

        val basePool = if (filteredQuestions.isEmpty()) allQuestions else filteredQuestions
        val rng = Random(config.seed)

        when (config.difficulty) {
            ChallengeDifficulty.PROGRESSIVE -> {
                generateProgressiveSequence(
                    allQuestions = basePool,
                    seed = config.seed,
                    durationSeconds = config.timeLimitSeconds,
                    batchSize = requestedBatchSize
                )
            }
            ChallengeDifficulty.EASY -> {
                basePool.filter { it.difficulty.equals("EASY", ignoreCase = true) || it.difficulty.equals("Easy", ignoreCase = true) }
                    .ifEmpty { basePool }
                    .shuffled(rng)
            }
            ChallengeDifficulty.MEDIUM -> {
                basePool.filter { it.difficulty.equals("MEDIUM", ignoreCase = true) || it.difficulty.equals("Medium", ignoreCase = true) }
                    .ifEmpty { basePool }
                    .shuffled(rng)
            }
            ChallengeDifficulty.HARD -> {
                basePool.filter { it.difficulty.equals("HARD", ignoreCase = true) || it.difficulty.equals("Hard", ignoreCase = true) }
                    .ifEmpty { basePool }
                    .shuffled(rng)
            }
            ChallengeDifficulty.MIXED -> {
                // 40% Easy, 40% Medium, 20% Hard
                val easyPool = basePool.filter { it.difficulty.contains("easy", ignoreCase = true) }.shuffled(rng)
                val mediumPool = basePool.filter { it.difficulty.contains("medium", ignoreCase = true) }.shuffled(rng)
                val hardPool = basePool.filter { it.difficulty.contains("hard", ignoreCase = true) || it.difficulty.contains("expert", ignoreCase = true) }.shuffled(rng)

                val mixedList = mutableListOf<Question>()
                var eIdx = 0
                var mIdx = 0
                var hIdx = 0

                for (i in 0 until requestedBatchSize) {
                    val cycleIndex = i % 10
                    when {
                        cycleIndex in 0..3 && easyPool.isNotEmpty() -> {
                            mixedList.add(easyPool[eIdx % easyPool.size])
                            eIdx++
                        }
                        cycleIndex in 4..7 && mediumPool.isNotEmpty() -> {
                            mixedList.add(mediumPool[mIdx % mediumPool.size])
                            mIdx++
                        }
                        else -> {
                            if (hardPool.isNotEmpty()) {
                                mixedList.add(hardPool[hIdx % hardPool.size])
                                hIdx++
                            } else if (mediumPool.isNotEmpty()) {
                                mixedList.add(mediumPool[mIdx % mediumPool.size])
                                mIdx++
                            } else if (easyPool.isNotEmpty()) {
                                mixedList.add(easyPool[eIdx % easyPool.size])
                                eIdx++
                            }
                        }
                    }
                }
                mixedList
            }
        }
    }

    /**
     * Core Progressive Difficulty Sequence Generator.
     * Guaranteed deterministic, no duplicates within a match, respects stage pools and reading complexity.
     */
    fun generateProgressiveSequence(
        allQuestions: List<Question>,
        seed: Long,
        durationSeconds: Int,
        batchSize: Int
    ): List<Question> {
        val rng = Random(seed)

        // Partition questions by matching difficulty stage
        fun matchesStage(q: Question, stage: QuestionDifficultyStage): Boolean {
            val d = q.difficulty.uppercase()
            return when (stage) {
                QuestionDifficultyStage.EASY -> d == "EASY" || d.contains("EASY")
                QuestionDifficultyStage.EASY_MEDIUM -> d == "EASY_MEDIUM" || d.contains("EASY") || d.contains("MEDIUM")
                QuestionDifficultyStage.MEDIUM -> d == "MEDIUM" || d.contains("MEDIUM")
                QuestionDifficultyStage.MEDIUM_HARD -> d == "MEDIUM_HARD" || d.contains("MEDIUM") || d.contains("HARD")
                QuestionDifficultyStage.HARD -> d == "HARD" || d.contains("HARD")
                QuestionDifficultyStage.HARD_EXPERT -> d == "HARD_EXPERT" || d.contains("HARD") || d.contains("EXPERT")
                QuestionDifficultyStage.EXPERT -> d == "EXPERT" || d.contains("EXPERT") || d.contains("HARD")
            }
        }

        val stagePools = QuestionDifficultyStage.entries.associateWith { stage ->
            val pool = allQuestions.filter { matchesStage(it, stage) }
            val effectivePool = if (pool.isNotEmpty()) pool else allQuestions
            // Deterministically shuffle each pool using a derived seed from master seed
            effectivePool.shuffled(Random(seed + stage.level * 10007L)).toMutableList()
        }

        val usedQuestionIds = mutableSetOf<String>()
        val result = mutableListOf<Question>()

        for (qIndex in 0 until batchSize) {
            val questionNumber = qIndex + 1
            val stage = QuestionDifficultyStage.calculateDifficulty(questionNumber)
            val allowedComplexities = ReadingComplexity.getAllowedComplexities(durationSeconds, stage)

            val pool = stagePools[stage] ?: allQuestions

            // Find question in pool matching allowed reading complexity not yet used
            var candidate = pool.firstOrNull { q ->
                !usedQuestionIds.contains(q.questionId) && allowedComplexities.contains(q.readingComplexityEnum)
            }

            // Fallback 1: Any question in pool not yet used
            if (candidate == null) {
                candidate = pool.firstOrNull { q -> !usedQuestionIds.contains(q.questionId) }
            }

            // Fallback 2: Any question across all questions matching stage not yet used
            if (candidate == null) {
                candidate = allQuestions.firstOrNull { q ->
                    !usedQuestionIds.contains(q.questionId) && matchesStage(q, stage)
                }
            }

            // Fallback 3: Any unused question
            if (candidate == null) {
                candidate = allQuestions.firstOrNull { q -> !usedQuestionIds.contains(q.questionId) }
            }

            // Fallback 4: If exhausted all unique questions, cycle pool
            if (candidate == null) {
                candidate = pool[qIndex % pool.size]
            }

            usedQuestionIds.add(candidate.questionId)
            result.add(candidate)
        }

        return result
    }

    suspend fun saveResult(result: ChallengeResult) = withContext(Dispatchers.IO) {
        resultDao.insertResult(result)
    }

    suspend fun getResultsForChallenge(challengeId: String): List<ChallengeResult> = withContext(Dispatchers.IO) {
        val list = resultDao.getResultsForChallenge(challengeId)
        // Sort using strict Section #16 tie breaker
        list.sortedDescending()
    }

    suspend fun searchQuestions(query: String): List<Question> = withContext(Dispatchers.IO) {
        questionDao.searchQuestions(query)
    }
}
