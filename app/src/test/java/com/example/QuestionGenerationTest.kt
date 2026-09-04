package com.example

import com.example.data.db.MasterQuestionBankSeeder
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class QuestionGenerationTest {

    @Test
    fun verifyQuestionGenerationIntegrityAndNoCitations() {
        // Generate a sample of 1,000 questions
        val catalog = MasterQuestionBankSeeder.generateMasterCatalog(1000)
        assertEquals(1000, catalog.size)

        // Regex patterns for verse/chapter citations that MUST NOT appear in query text
        val chapterPattern = Regex("""(?i)\b(chapter|ch\.)\s*\d+""")
        val versePattern = Regex("""(?i)\b(verse|verses|v\.)\s*\d+""")
        val citationColonPattern = Regex("""\b\d+:\d+\b""")

        var whoSaidCount = 0

        val uniqueIds = mutableSetOf<String>()

        for (q in catalog) {
            // Check unique ID
            assertTrue("Duplicate question ID: ${q.questionId}", uniqueIds.add(q.questionId))

            // Query text MUST NOT contain specific chapter or verse citations
            assertFalse(
                "Query contains chapter citation: '${q.question}'",
                chapterPattern.containsMatchIn(q.question)
            )
            assertFalse(
                "Query contains verse citation: '${q.question}'",
                versePattern.containsMatchIn(q.question)
            )
            assertFalse(
                "Query contains colon reference (e.g. 3:16): '${q.question}'",
                citationColonPattern.containsMatchIn(q.question)
            )

            // Must have 4 options
            assertEquals("Question ${q.questionId} does not have 4 options", 4, q.options.size)

            // Correct answer must be in options
            assertTrue(
                "Question ${q.questionId} correct answer '${q.correctAnswer}' not in options ${q.options}",
                q.options.contains(q.correctAnswer)
            )

            // Explanation must be non-empty and thematic
            assertTrue(
                "Question ${q.questionId} has short explanation",
                q.explanation.length > 25
            )

            // Track 'Who said to whom' style questions
            if (q.question.contains("Who said to whom", ignoreCase = true) ||
                q.question.contains("To whom did", ignoreCase = true) ||
                q.question.contains("spoke these words to", ignoreCase = true) ||
                q.question.contains("Who spoke these memorable words", ignoreCase = true)
            ) {
                whoSaidCount++
            }
        }

        // Verify prioritized "Who said to whom" style questions (>50%)
        val percentage = (whoSaidCount.toDouble() / catalog.size) * 100.0
        assertTrue(
            "Expected 'Who said to whom' percentage > 50%, found $percentage% ($whoSaidCount / ${catalog.size})",
            percentage >= 50.0
        )
    }
}
