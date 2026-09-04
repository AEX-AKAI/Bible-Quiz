package com.example.data.db

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import com.example.data.model.ChallengeResult
import com.example.data.model.Question
import kotlinx.coroutines.flow.Flow

@Dao
interface QuestionDao {

    @Query("SELECT COUNT(*) FROM questions WHERE active = 1")
    suspend fun getActiveQuestionCount(): Int

    @Query("SELECT COUNT(*) FROM questions WHERE active = 1")
    fun getActiveQuestionCountFlow(): Flow<Int>

    @Query("SELECT * FROM questions WHERE active = 1")
    suspend fun getAllActiveQuestions(): List<Question>

    @Query("SELECT * FROM questions WHERE active = 1 AND difficulty = :difficulty")
    suspend fun getQuestionsByDifficulty(difficulty: String): List<Question>

    @Query("SELECT * FROM questions WHERE active = 1 AND category = :category")
    suspend fun getQuestionsByCategory(category: String): List<Question>

    @Query("SELECT * FROM questions WHERE questionId = :questionId LIMIT 1")
    suspend fun getQuestionById(questionId: String): Question?

    @Query("SELECT * FROM questions WHERE questionId IN (:questionIds)")
    suspend fun getQuestionsByIds(questionIds: List<String>): List<Question>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertQuestions(questions: List<Question>)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertQuestion(question: Question)

    @Query("SELECT DISTINCT category FROM questions WHERE active = 1 ORDER BY category ASC")
    fun getAllCategories(): Flow<List<String>>

    @Query("SELECT * FROM questions WHERE active = 1 AND (question LIKE '%' || :query || '%' OR book LIKE '%' || :query || '%') LIMIT 50")
    suspend fun searchQuestions(query: String): List<Question>

    @Query("DELETE FROM questions")
    suspend fun clearAllQuestions()
}

@Dao
interface ChallengeResultDao {

    @Query("SELECT * FROM challenge_results ORDER BY completedAt DESC")
    fun getAllResults(): Flow<List<ChallengeResult>>

    @Query("SELECT * FROM challenge_results WHERE challengeId = :challengeId")
    suspend fun getResultsForChallenge(challengeId: String): List<ChallengeResult>

    @Query("SELECT * FROM challenge_results ORDER BY finalScore DESC, correctAnswers DESC, accuracyPercentage DESC, bestCombo DESC LIMIT :limit")
    fun getTopLeaderboard(limit: Int = 50): Flow<List<ChallengeResult>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertResult(result: ChallengeResult)

    @Query("DELETE FROM challenge_results")
    suspend fun clearAllResults()
}
