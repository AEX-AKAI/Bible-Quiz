package com.example.core.scoring

import kotlin.math.roundToInt

/**
 * Result of scoring an answered question.
 */
data class QuestionScoreResult(
    val isCorrect: Boolean,
    val baseScore: Double,
    val rawSpeedBonus: Double,
    val comboMultiplier: Double,
    val adjustedSpeedBonus: Double,
    val totalQuestionScore: Double,
    val currentCombo: Int,
    val bestCombo: Int,
    val feedbackType: SpeedFeedbackType,
    val message: String
)

enum class SpeedFeedbackType {
    PERFECT_SPEED,    // <= 1.0s (+5)
    FAST_SPEED,       // <= 2.0s (+4)
    GREAT_SPEED,      // <= 3.0s (+3)
    GOOD_SPEED,       // <= 4.0s (+2)
    NORMAL_SPEED,     // <= 5.0s (+1)
    NO_SPEED_BONUS,   // > 5.0s (+0)
    COMBO_BREAK       // Incorrect (0)
}

/**
 * Competitive Scoring Engine strictly implementing the prompt rules:
 *
 * Base Score: 10 points for correct answer.
 * Response Speed Window: 5.0 seconds.
 * 0–1 second: +5
 * >1–2 seconds: +4
 * >2–3 seconds: +3
 * >3–4 seconds: +2
 * >4–5 seconds: +1
 * >5 seconds: +0
 *
 * Combo Multipliers (applied ONLY to speed bonus portion):
 * 1–4: ×1.0
 * 5–9: ×1.1
 * 10–14: ×1.2
 * 15–19: ×1.3
 * 20+: ×1.5 maximum cap
 *
 * Total = Base (10) + (Speed Bonus * Combo Multiplier)
 * Incorrect: 0 points, combo reset to 0.
 * Answering after 5s: 10 base, speed bonus 0, combo reset to 0.
 */
object ScoringEngine {

    const val BASE_SCORE = 10.0
    const val SPEED_WINDOW_SECONDS = 5.0

    /**
     * Determines raw speed bonus based on response time in seconds.
     * Boundary conditions strictly respected:
     * <= 1.0 -> 5
     * <= 2.0 -> 4
     * <= 3.0 -> 3
     * <= 4.0 -> 2
     * <= 5.0 -> 1
     * > 5.0  -> 0
     */
    fun calculateRawSpeedBonus(responseTimeSeconds: Double): Double {
        return when {
            responseTimeSeconds <= 1.0 -> 5.0
            responseTimeSeconds <= 2.0 -> 4.0
            responseTimeSeconds <= 3.0 -> 3.0
            responseTimeSeconds <= 4.0 -> 2.0
            responseTimeSeconds <= 5.0 -> 1.0
            else -> 0.0
        }
    }

    /**
     * Calculates combo multiplier based on the active combo count.
     * Multiplier is capped at 1.5 maximum.
     */
    fun getComboMultiplier(combo: Int): Double {
        return when {
            combo < 1 -> 1.0
            combo in 1..4 -> 1.0
            combo in 5..9 -> 1.1
            combo in 10..14 -> 1.2
            combo in 15..19 -> 1.3
            else -> 1.5 // 20+
        }
    }

    /**
     * Categorizes feedback message and type based on response speed and correctness.
     */
    fun getSpeedFeedback(isCorrect: Boolean, responseTimeSeconds: Double): Pair<SpeedFeedbackType, String> {
        if (!isCorrect) {
            return SpeedFeedbackType.COMBO_BREAK to "COMBO BREAK"
        }
        return when {
            responseTimeSeconds <= 1.0 -> SpeedFeedbackType.PERFECT_SPEED to "PERFECT SPEED!"
            responseTimeSeconds <= 2.0 -> SpeedFeedbackType.FAST_SPEED to "BLAZING FAST!"
            responseTimeSeconds <= 3.0 -> SpeedFeedbackType.GREAT_SPEED to "GREAT SPEED!"
            responseTimeSeconds <= 4.0 -> SpeedFeedbackType.GOOD_SPEED to "GOOD SPEED!"
            responseTimeSeconds <= 5.0 -> SpeedFeedbackType.NORMAL_SPEED to "SPEED BONUS"
            else -> SpeedFeedbackType.NO_SPEED_BONUS to "NO SPEED BONUS"
        }
    }

    /**
     * Evaluates an answer submission given the previous combo state.
     */
    fun scoreAnswer(
        isCorrect: Boolean,
        responseTimeSeconds: Double,
        previousCombo: Int,
        previousBestCombo: Int = previousCombo
    ): QuestionScoreResult {
        if (!isCorrect) {
            return QuestionScoreResult(
                isCorrect = false,
                baseScore = 0.0,
                rawSpeedBonus = 0.0,
                comboMultiplier = 1.0,
                adjustedSpeedBonus = 0.0,
                totalQuestionScore = 0.0,
                currentCombo = 0,
                bestCombo = previousBestCombo,
                feedbackType = SpeedFeedbackType.COMBO_BREAK,
                message = "COMBO BREAK"
            )
        }

        val rawSpeed = calculateRawSpeedBonus(responseTimeSeconds)
        val (feedbackType, message) = getSpeedFeedback(true, responseTimeSeconds)

        val newCombo: Int
        val multiplier: Double
        val adjustedSpeedBonus: Double

        if (rawSpeed > 0) {
            // Correct within 5.0s -> continue combo
            newCombo = previousCombo + 1
            multiplier = getComboMultiplier(newCombo)
            // Multiplier applies only to the speed bonus portion
            adjustedSpeedBonus = roundScorePrecision(rawSpeed * multiplier)
        } else {
            // Correct after 5.0s -> gives normal 10 points, resets combo
            newCombo = 0
            multiplier = 1.0
            adjustedSpeedBonus = 0.0
        }

        val totalScore = roundScorePrecision(BASE_SCORE + adjustedSpeedBonus)
        val newBestCombo = maxOf(newCombo, previousBestCombo)

        return QuestionScoreResult(
            isCorrect = true,
            baseScore = BASE_SCORE,
            rawSpeedBonus = rawSpeed,
            comboMultiplier = multiplier,
            adjustedSpeedBonus = adjustedSpeedBonus,
            totalQuestionScore = totalScore,
            currentCombo = newCombo,
            bestCombo = newBestCombo,
            feedbackType = feedbackType,
            message = message
        )
    }

    /**
     * Helper to round to 1 decimal place to prevent floating point inaccuracies.
     */
    fun roundScorePrecision(value: Double): Double {
        return (value * 10.0).roundToInt() / 10.0
    }
}
