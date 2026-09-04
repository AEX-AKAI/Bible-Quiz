package com.example

import com.example.core.challenge.AntiCheatViolation
import com.example.core.challenge.AnswerValidationResult
import com.example.core.challenge.ServerScoringValidator
import com.example.core.scoring.ScoringEngine
import com.example.data.model.AnswerSubmissionEvent
import com.example.data.model.ChallengeResult
import com.example.data.model.Question
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class ScoringEngineUnitTest {

    @Test
    fun testBaseScoreAndSpeedBonuses() {
        // 0.5s answer -> 15 points (10 base + 5 speed bonus)
        val res05 = ScoringEngine.scoreAnswer(
            isCorrect = true,
            responseTimeSeconds = 0.5,
            previousCombo = 0
        )
        assertEquals(15.0, res05.totalQuestionScore, 0.001)

        // 1.5s answer -> 14 points (10 base + 4 speed bonus)
        val res15 = ScoringEngine.scoreAnswer(
            isCorrect = true,
            responseTimeSeconds = 1.5,
            previousCombo = 0
        )
        assertEquals(14.0, res15.totalQuestionScore, 0.001)

        // 2.5s answer -> 13 points (10 base + 3 speed bonus)
        val res25 = ScoringEngine.scoreAnswer(
            isCorrect = true,
            responseTimeSeconds = 2.5,
            previousCombo = 0
        )
        assertEquals(13.0, res25.totalQuestionScore, 0.001)

        // 3.5s answer -> 12 points (10 base + 2 speed bonus)
        val res35 = ScoringEngine.scoreAnswer(
            isCorrect = true,
            responseTimeSeconds = 3.5,
            previousCombo = 0
        )
        assertEquals(12.0, res35.totalQuestionScore, 0.001)

        // 4.5s answer -> 11 points (10 base + 1 speed bonus)
        val res45 = ScoringEngine.scoreAnswer(
            isCorrect = true,
            responseTimeSeconds = 4.5,
            previousCombo = 0
        )
        assertEquals(11.0, res45.totalQuestionScore, 0.001)

        // 5.5s answer -> 10 points (10 base + 0 speed bonus)
        val res55 = ScoringEngine.scoreAnswer(
            isCorrect = true,
            responseTimeSeconds = 5.5,
            previousCombo = 0
        )
        assertEquals(10.0, res55.totalQuestionScore, 0.001)

        // 10.0s answer -> 10 points (10 base + 0 speed bonus)
        val res10 = ScoringEngine.scoreAnswer(
            isCorrect = true,
            responseTimeSeconds = 10.0,
            previousCombo = 0
        )
        assertEquals(10.0, res10.totalQuestionScore, 0.001)

        // Incorrect answer -> 0 points
        val resIncorrect = ScoringEngine.scoreAnswer(
            isCorrect = false,
            responseTimeSeconds = 0.5,
            previousCombo = 4
        )
        assertEquals(0.0, resIncorrect.totalQuestionScore, 0.001)
        assertEquals(0, resIncorrect.currentCombo)
    }

    @Test
    fun testComboMultiplierTransitions() {
        // Multiplier applies to speed bonus only!
        // 1-4: 1.0x
        // 5-9: 1.1x
        // 10-14: 1.2x
        // 15-19: 1.3x
        // 20+: 1.5x
        assertEquals(1.0, ScoringEngine.getComboMultiplier(1), 0.001)
        assertEquals(1.0, ScoringEngine.getComboMultiplier(4), 0.001)
        assertEquals(1.1, ScoringEngine.getComboMultiplier(5), 0.001)
        assertEquals(1.1, ScoringEngine.getComboMultiplier(9), 0.001)
        assertEquals(1.2, ScoringEngine.getComboMultiplier(10), 0.001)
        assertEquals(1.2, ScoringEngine.getComboMultiplier(14), 0.001)
        assertEquals(1.3, ScoringEngine.getComboMultiplier(15), 0.001)
        assertEquals(1.3, ScoringEngine.getComboMultiplier(19), 0.001)
        assertEquals(1.5, ScoringEngine.getComboMultiplier(20), 0.001)
        assertEquals(1.5, ScoringEngine.getComboMultiplier(50), 0.001)

        // Transition from combo 4 to 5:
        // previousCombo = 4 -> new combo becomes 5
        // responseTime = 0.8s (base speed bonus = 5.0)
        // With 1.1x multiplier: 10 base + (5.0 * 1.1) = 10 + 5.5 = 15.5
        val to5 = ScoringEngine.scoreAnswer(
            isCorrect = true,
            responseTimeSeconds = 0.8,
            previousCombo = 4
        )
        assertEquals(5, to5.currentCombo)
        assertEquals(1.1, to5.comboMultiplier, 0.001)
        assertEquals(15.5, to5.totalQuestionScore, 0.001)

        // Transition to 10: previous = 9 -> new = 10 (1.2x multiplier)
        // 10 base + (5.0 * 1.2) = 16.0
        val to10 = ScoringEngine.scoreAnswer(
            isCorrect = true,
            responseTimeSeconds = 0.8,
            previousCombo = 9
        )
        assertEquals(10, to10.currentCombo)
        assertEquals(1.2, to10.comboMultiplier, 0.001)
        assertEquals(16.0, to10.totalQuestionScore, 0.001)

        // Transition to 15: previous = 14 -> new = 15 (1.3x multiplier)
        // 10 base + (5.0 * 1.3) = 16.5
        val to15 = ScoringEngine.scoreAnswer(
            isCorrect = true,
            responseTimeSeconds = 0.8,
            previousCombo = 14
        )
        assertEquals(15, to15.currentCombo)
        assertEquals(1.3, to15.comboMultiplier, 0.001)
        assertEquals(16.5, to15.totalQuestionScore, 0.001)

        // Transition to 20: previous = 19 -> new = 20 (1.5x multiplier)
        // 10 base + (5.0 * 1.5) = 17.5
        val to20 = ScoringEngine.scoreAnswer(
            isCorrect = true,
            responseTimeSeconds = 0.8,
            previousCombo = 19
        )
        assertEquals(20, to20.currentCombo)
        assertEquals(1.5, to20.comboMultiplier, 0.001)
        assertEquals(17.5, to20.totalQuestionScore, 0.001)
    }

    @Test
    fun testComboResetOnIncorrect() {
        val result = ScoringEngine.scoreAnswer(
            isCorrect = false,
            responseTimeSeconds = 1.0,
            previousCombo = 18,
            previousBestCombo = 18
        )
        assertEquals(0, result.currentCombo)
        assertEquals(18, result.bestCombo)
        assertEquals(0.0, result.totalQuestionScore, 0.001)
    }

    @Test
    fun testTieBreakerLogic() {
        // Section 16 Tie-Breakers:
        // 1. Higher score wins
        // 2. Higher number of correct answers wins
        // 3. Higher accuracy wins
        // 4. Higher best combo wins
        // 5. Lower average answer time wins
        val p1 = ChallengeResult(
            challengeId = "TEST",
            playerName = "Player A",
            finalScore = 1200.0,
            correctAnswers = 80,
            accuracyPercentage = 95.0,
            bestCombo = 20,
            averageResponseTimeSeconds = 2.0
        )
        val p2 = ChallengeResult(
            challengeId = "TEST",
            playerName = "Player B",
            finalScore = 1200.0,
            correctAnswers = 78,
            accuracyPercentage = 95.0,
            bestCombo = 20,
            averageResponseTimeSeconds = 2.0
        )
        // p1 wins because correctAnswers 80 > 78
        assertTrue(p1 > p2)

        val p3 = p1.copy(correctAnswers = 80, accuracyPercentage = 92.0)
        // p1 (95% accuracy) > p3 (92% accuracy)
        assertTrue(p1 > p3)

        val p4 = p1.copy(bestCombo = 15)
        // p1 (combo 20) > p4 (combo 15)
        assertTrue(p1 > p4)

        val p5 = p1.copy(averageResponseTimeSeconds = 2.5)
        // p1 (avg time 2.0s) > p5 (avg time 2.5s)
        assertTrue(p1 > p5)
    }

    @Test
    fun testServerAntiCheatValidation() {
        val questions = listOf(
            Question(
                questionId = "Q1",
                question = "Who led Israel out of Egypt?",
                options = listOf("Moses", "Aaron", "David", "Solomon"),
                correctAnswer = "Moses",
                book = "Exodus",
                chapter = 3,
                verse = 10,
                category = "Pentateuch",
                difficulty = "Easy",
                explanation = "God spoke to Moses at the burning bush."
            ),
            Question(
                questionId = "Q2",
                question = "Who was the mother of Samuel?",
                options = listOf("Hannah", "Peninnah", "Ruth", "Rachel"),
                correctAnswer = "Hannah",
                book = "1 Samuel",
                chapter = 1,
                verse = 20,
                category = "Old Testament",
                difficulty = "Medium",
                explanation = "Hannah prayed earnestly at Shiloh."
            )
        )

        val now = 1_000_000L
        val validator = ServerScoringValidator(
            challengeId = "CH-001",
            startTimeMillis = now,
            endTimeMillis = now + 60_000L,
            officialSequence = questions
        )

        // 1. Valid answer within time
        val ev1 = AnswerSubmissionEvent(
            eventId = "EV-1",
            challengeId = "CH-001",
            playerId = "P1",
            questionId = "Q1",
            selectedAnswer = "Moses",
            sequencePosition = 0,
            clientTimestamp = now + 1000L,
            responseTimeMs = 1200L
        )
        val res1 = validator.validateAndScore(ev1, serverTimestamp = now + 1200L)
        assertTrue(res1 is AnswerValidationResult.Valid)
        assertEquals(1, validator.correctCount)

        // 2. Replay attack rejection
        val replayRes = validator.validateAndScore(ev1, serverTimestamp = now + 1300L)
        assertTrue(replayRes is AnswerValidationResult.Rejected)
        assertEquals(AntiCheatViolation.REPLAY_DETECTED, (replayRes as AnswerValidationResult.Rejected).reason)

        // 3. Duplicate question rejection with different eventId
        val dupEv = ev1.copy(eventId = "EV-DUP")
        val dupRes = validator.validateAndScore(dupEv, serverTimestamp = now + 1400L)
        assertTrue(dupRes is AnswerValidationResult.Rejected)
        assertEquals(AntiCheatViolation.DUPLICATE_QUESTION_SUBMISSION, (dupRes as AnswerValidationResult.Rejected).reason)

        // 4. Impossible response time rejection (< 50ms)
        val botEv = AnswerSubmissionEvent(
            eventId = "EV-BOT",
            challengeId = "CH-001",
            playerId = "P1",
            questionId = "Q2",
            selectedAnswer = "Hannah",
            sequencePosition = 1,
            clientTimestamp = now + 2000L,
            responseTimeMs = 15L // 15ms is superhuman bot speed
        )
        val botRes = validator.validateAndScore(botEv, serverTimestamp = now + 2015L)
        assertTrue(botRes is AnswerValidationResult.Rejected)
        assertEquals(AntiCheatViolation.IMPOSSIBLE_RESPONSE_TIME, (botRes as AnswerValidationResult.Rejected).reason)

        // 5. Challenge expiration rejection
        val expiredEv = AnswerSubmissionEvent(
            eventId = "EV-EXPIRED",
            challengeId = "CH-001",
            playerId = "P1",
            questionId = "Q2",
            selectedAnswer = "Hannah",
            sequencePosition = 1,
            clientTimestamp = now + 65_000L,
            responseTimeMs = 1000L
        )
        val expiredRes = validator.validateAndScore(expiredEv, serverTimestamp = now + 65_000L)
        assertTrue(expiredRes is AnswerValidationResult.Rejected)
        assertEquals(AntiCheatViolation.CHALLENGE_EXPIRED, (expiredRes as AnswerValidationResult.Rejected).reason)
    }
}
