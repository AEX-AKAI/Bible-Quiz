package com.example.core.challenge

import com.example.data.model.ChallengeConfig
import com.example.data.model.ChallengeResult
import java.util.Random

object LiveChallengeSimulator {

    /**
     * Generates simulated online competitors for a given challenge seed,
     * so players can experience real-time leaderboards and competitive stakes.
     */
    fun generateCompetitorsForChallenge(
        config: ChallengeConfig,
        userResult: ChallengeResult? = null
    ): List<ChallengeResult> {
        val random = Random(config.seed + 9999L)
        val competitors = mutableListOf<ChallengeResult>()

        val names = listOf(
            "Priscilla_Acts", "Barnabas_Seeker", "Caleb_Faith", "Deborah_Lead",
            "Timothy_Disciple", "Gideon_300", "Esther_Brave", "Peter_Fisher"
        ).shuffled(random).take(4)

        for (name in names) {
            // Speed and accuracy simulation based on difficulty and time limit
            val questions = (config.timeLimitSeconds / 3.5).toInt() + random.nextInt(10) - 4
            val safeQuestions = maxOf(questions, 10)
            val accuracy = 0.78 + (random.nextDouble() * 0.18) // 78% to 96%
            val correct = (safeQuestions * accuracy).toInt()
            val incorrect = safeQuestions - correct
            val bestCombo = minOf(correct, (correct * (0.2 + random.nextDouble() * 0.3)).toInt())
            val avgTime = 1.6 + (random.nextDouble() * 1.8) // 1.6s to 3.4s
            val fastCount = (correct * (0.6 + random.nextDouble() * 0.3)).toInt()

            // Calculate approximate score
            val basePts = correct * 10.0
            val speedBonusPortion = fastCount * 3.5
            val finalScore = (basePts + speedBonusPortion * 1.1).let {
                Math.round(it * 10.0) / 10.0
            }

            competitors.add(
                ChallengeResult(
                    challengeId = config.challengeId,
                    seed = config.seed,
                    playerName = name,
                    finalScore = finalScore,
                    questionsAnswered = safeQuestions,
                    correctAnswers = correct,
                    incorrectAnswers = incorrect,
                    accuracyPercentage = Math.round(accuracy * 1000.0) / 10.0,
                    fastAnswersCount = fastCount,
                    bestCombo = bestCombo,
                    averageResponseTimeSeconds = Math.round(avgTime * 10.0) / 10.0,
                    durationSeconds = config.timeLimitSeconds,
                    difficulty = config.difficulty.name,
                    isOnline = true
                )
            )
        }

        if (userResult != null) {
            competitors.add(userResult)
        }

        // Return sorted strictly by Section #16 Tie-Breaker
        return competitors.sortedDescending()
    }
}
