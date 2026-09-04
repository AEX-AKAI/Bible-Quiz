package com.example.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey
import java.util.UUID

enum class ChallengeDifficulty {
    PROGRESSIVE, // Progressive Difficulty: increases every 5 questions from Easy up to Expert
    EASY,
    MEDIUM,
    HARD,
    MIXED // 40% Easy, 40% Medium, 20% Hard
}

data class ChallengeConfig(
    val challengeId: String = generateChallengeId(),
    val seed: Long = System.currentTimeMillis() xor (1L shl 32),
    val timeLimitSeconds: Int = 180, // Default 3 minutes
    val difficulty: ChallengeDifficulty = ChallengeDifficulty.PROGRESSIVE,
    val categoryFilter: String? = null,
    val isOnline: Boolean = false,
    val playerName: String = "Player 1"
) {
    companion object {
        fun generateChallengeId(): String {
            val allowed = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"
            val random = (1..6).map { allowed.random() }.joinToString("")
            return "QUIZ-$random"
        }
    }
}

/**
 * Answer event sent for validation.
 * Anti-cheat validation verifies this on server or authoritative engine.
 */
data class AnswerSubmissionEvent(
    val eventId: String = UUID.randomUUID().toString(),
    val challengeId: String,
    val playerId: String,
    val questionId: String,
    val selectedAnswer: String,
    val sequencePosition: Int,
    val clientTimestamp: Long = System.currentTimeMillis(),
    val responseTimeMs: Long
)

/**
 * Persisted Challenge Result for local storage, Leaderboard, and stats.
 */
@Entity(tableName = "challenge_results")
data class ChallengeResult(
    @PrimaryKey val resultId: String = UUID.randomUUID().toString(),
    val challengeId: String,
    val seed: Long = 12345L,
    val playerName: String,
    val finalScore: Double,
    val questionsAnswered: Int = 0,
    val correctAnswers: Int = 0,
    val incorrectAnswers: Int = 0,
    val accuracyPercentage: Double = 0.0,
    val fastAnswersCount: Int = 0,
    val bestCombo: Int = 0,
    val averageResponseTimeSeconds: Double = 0.0,
    val durationSeconds: Int = 180,
    val difficulty: String = "MIXED",
    val completedAt: Long = System.currentTimeMillis(),
    val isOnline: Boolean = false
) : Comparable<ChallengeResult> {

    /**
     * Tie-breaker logic strictly adhering to Section #16 of specification:
     * 1. Higher Final Score
     * 2. Higher number of correct answers
     * 3. Higher accuracy
     * 4. Higher best combo
     * 5. Lower average answer time
     * 6. Draw
     */
    override fun compareTo(other: ChallengeResult): Int {
        // 1. Final Score (descending)
        val scoreCmp = this.finalScore.compareTo(other.finalScore)
        if (scoreCmp != 0) return scoreCmp

        // 2. Higher number of correct answers (descending)
        val correctCmp = this.correctAnswers.compareTo(other.correctAnswers)
        if (correctCmp != 0) return correctCmp

        // 3. Higher accuracy (descending)
        val accCmp = this.accuracyPercentage.compareTo(other.accuracyPercentage)
        if (accCmp != 0) return accCmp

        // 4. Higher best combo (descending)
        val comboCmp = this.bestCombo.compareTo(other.bestCombo)
        if (comboCmp != 0) return comboCmp

        // 5. Lower average answer time (ascending: lower is better)
        val timeCmp = other.averageResponseTimeSeconds.compareTo(this.averageResponseTimeSeconds)
        if (timeCmp != 0) return timeCmp

        // 6. Draw
        return 0
    }
}

/**
 * Question answer review item for the post-match breakdown.
 */
data class AnswerReviewItem(
    val sequenceNumber: Int,
    val question: Question,
    val selectedAnswer: String,
    val isCorrect: Boolean,
    val responseTimeSeconds: Double,
    val pointsEarned: Double,
    val comboAtTime: Int
)
