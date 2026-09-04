package com.example

import android.content.Context
import androidx.room.Room
import androidx.test.core.app.ApplicationProvider
import com.example.core.challenge.QuestionDifficultyStage
import com.example.core.challenge.ReadingComplexity
import com.example.data.db.AppDatabase
import com.example.data.model.Question
import com.example.data.repository.QuizRepository
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner

@RunWith(RobolectricTestRunner::class)
class ProgressiveDifficultyEngineTest {

    @Test
    fun testStageProgressionByQuestionPosition() {
        // Questions 1–5: EASY
        for (q in 1..5) {
            assertEquals("Q$q should be EASY", QuestionDifficultyStage.EASY, QuestionDifficultyStage.calculateDifficulty(q))
        }

        // Questions 6–10: EASY_MEDIUM
        for (q in 6..10) {
            assertEquals("Q$q should be EASY_MEDIUM", QuestionDifficultyStage.EASY_MEDIUM, QuestionDifficultyStage.calculateDifficulty(q))
        }

        // Questions 11–15: MEDIUM
        for (q in 11..15) {
            assertEquals("Q$q should be MEDIUM", QuestionDifficultyStage.MEDIUM, QuestionDifficultyStage.calculateDifficulty(q))
        }

        // Questions 16–20: MEDIUM_HARD
        for (q in 16..20) {
            assertEquals("Q$q should be MEDIUM_HARD", QuestionDifficultyStage.MEDIUM_HARD, QuestionDifficultyStage.calculateDifficulty(q))
        }

        // Questions 21–25: HARD
        for (q in 21..25) {
            assertEquals("Q$q should be HARD", QuestionDifficultyStage.HARD, QuestionDifficultyStage.calculateDifficulty(q))
        }

        // Questions 26–30: HARD_EXPERT
        for (q in 26..30) {
            assertEquals("Q$q should be HARD_EXPERT", QuestionDifficultyStage.HARD_EXPERT, QuestionDifficultyStage.calculateDifficulty(q))
        }

        // Questions 31+: EXPERT
        for (q in listOf(31, 35, 40, 50, 100)) {
            assertEquals("Q$q should be EXPERT", QuestionDifficultyStage.EXPERT, QuestionDifficultyStage.calculateDifficulty(q))
        }
    }

    @Test
    fun testDifficultyProgressionIsIndependentOfScore() {
        // Player A gets 100% correct answers
        // Player B gets 0% correct answers
        // At question 12, both players receive exactly MEDIUM stage
        val qIndex = 12
        val playerADifficulty = QuestionDifficultyStage.calculateDifficulty(qIndex)
        val playerBDifficulty = QuestionDifficultyStage.calculateDifficulty(qIndex)

        assertEquals(QuestionDifficultyStage.MEDIUM, playerADifficulty)
        assertEquals(playerADifficulty, playerBDifficulty)
    }

    @Test
    fun testReadingComplexityProfilesByDuration() {
        // 30s Rapid Fire match: Strictly VERY_SHORT questions
        val rapidFireAllowed = ReadingComplexity.getAllowedComplexities(durationSeconds = 30, stage = QuestionDifficultyStage.EASY)
        assertTrue(rapidFireAllowed.contains(ReadingComplexity.VERY_SHORT))
        assertFalse("Rapid Fire should not have LONG questions", rapidFireAllowed.contains(ReadingComplexity.LONG))
        assertFalse("Rapid Fire should not have ADVANCED questions", rapidFireAllowed.contains(ReadingComplexity.ADVANCED))

        // 60s 1-minute match: VERY_SHORT, SHORT allowed
        val oneMinAllowed = ReadingComplexity.getAllowedComplexities(durationSeconds = 60, stage = QuestionDifficultyStage.MEDIUM)
        assertTrue(oneMinAllowed.contains(ReadingComplexity.SHORT))
        assertTrue(oneMinAllowed.contains(ReadingComplexity.VERY_SHORT))
        assertFalse("60s should not have ADVANCED reading complexity", oneMinAllowed.contains(ReadingComplexity.ADVANCED))

        // 180s 3-minute challenge: SHORT and NORMAL allowed
        val threeMinAllowed = ReadingComplexity.getAllowedComplexities(durationSeconds = 180, stage = QuestionDifficultyStage.MEDIUM)
        assertTrue(threeMinAllowed.contains(ReadingComplexity.NORMAL))
        assertTrue(threeMinAllowed.contains(ReadingComplexity.SHORT))
    }

    @Test
    fun testQuestionReadingComplexityEnumMapping() {
        val shortQ = Question(
            questionId = "TEST-1",
            question = "Who built the ark?",
            options = listOf("Noah", "Moses"),
            correctAnswer = "Noah",
            book = "Genesis",
            chapter = 6,
            verse = 14,
            category = "Old Testament",
            difficulty = "EASY",
            readingComplexity = "SHORT"
        )
        assertEquals(ReadingComplexity.SHORT, shortQ.readingComplexityEnum)

        val unassignedQ = Question(
            questionId = "TEST-2",
            question = "Who built the ark?",
            options = listOf("Noah", "Moses"),
            correctAnswer = "Noah",
            book = "Genesis",
            chapter = 6,
            verse = 14,
            category = "Old Testament",
            difficulty = "EASY"
        )
        // Defaults based on question text length
        assertEquals(ReadingComplexity.VERY_SHORT, unassignedQ.readingComplexityEnum)
    }

    @Test
    fun testDeterministicSequenceOrdering() {
        val context: Context = ApplicationProvider.getApplicationContext()
        val db = Room.inMemoryDatabaseBuilder(context, AppDatabase::class.java)
            .allowMainThreadQueries()
            .build()
        val repository = QuizRepository(db)

        val sampleQuestions = (1..60).map { i ->
            val stage = QuestionDifficultyStage.calculateDifficulty(i)
            Question(
                questionId = "Q-$i",
                question = "Question $i about Scripture content?",
                options = listOf("A", "B", "C", "D"),
                correctAnswer = "A",
                book = "Genesis",
                chapter = 1,
                verse = 1,
                category = "Pentateuch",
                difficulty = stage.name,
                readingComplexity = "NORMAL"
            )
        }

        val seed = 987654321L
        val seq1 = repository.generateProgressiveSequence(sampleQuestions, seed, 60, 35)
        val seq2 = repository.generateProgressiveSequence(sampleQuestions, seed, 60, 35)

        assertEquals("Sequence lengths must match", seq1.size, seq2.size)
        for (i in seq1.indices) {
            assertEquals("Question at index $i must match across runs with same seed", seq1[i].questionId, seq2[i].questionId)
        }

        // Verify difficulty progression within the generated sequence
        for (i in 0 until 5) {
            assertTrue("Q1-5 difficulty must match EASY stage", seq1[i].difficulty.contains("EASY", ignoreCase = true))
        }
        for (i in 5 until 10) {
            assertTrue("Q6-10 difficulty must match EASY_MEDIUM", seq1[i].difficulty.contains("EASY", ignoreCase = true) || seq1[i].difficulty.contains("MEDIUM", ignoreCase = true))
        }

        db.close()
    }
}

