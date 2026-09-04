package com.example.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey
import androidx.room.TypeConverter
import androidx.room.TypeConverters

enum class QuestionType {
    TEXT,
    IMAGE,
    IMAGE_TEXT
}

@Entity(tableName = "questions")
@TypeConverters(QuestionTypeConverters::class)
data class Question(
    @PrimaryKey val questionId: String,
    val question: String,
    val options: List<String>,
    val correctAnswer: String,
    val book: String,
    val chapter: Int,
    val verse: Int,
    val category: String,
    val difficulty: String, // "EASY", "EASY_MEDIUM", "MEDIUM", "MEDIUM_HARD", "HARD", "HARD_EXPERT", "EXPERT"
    val readingComplexity: String? = null, // "VERY_SHORT", "SHORT", "NORMAL", "LONG", "ADVANCED"
    val language: String = "en",
    val explanation: String = "",
    val active: Boolean = true,

    // Visual Question System Metadata (Sections #1, #4, #27)
    val questionType: String = "TEXT", // "TEXT", "IMAGE", "IMAGE_TEXT"
    val imageId: String? = null,
    val imageUrl: String? = null,
    val thumbnailUrl: String? = null,
    val localAssetPath: String? = null,
    val imageCredit: String? = null,
    val imageLicense: String? = null,
    val imageSource: String? = null,
    val imageAltText: String? = null,
    val audioHint: String? = null
) {
    val isVisualQuestion: Boolean
        get() = questionType == "IMAGE" || questionType == "IMAGE_TEXT" || !imageUrl.isNullOrBlank() || !localAssetPath.isNullOrBlank()

    val scriptureReference: String
        get() = "$book $chapter:$verse"

    val hintText: String
        get() = when {
            !audioHint.isNullOrBlank() -> audioHint
            explanation.isNotBlank() -> explanation.substringBefore(".").take(100).trim()
            else -> "Scripture context: $scriptureReference"
        }

    val readingComplexityEnum: com.example.core.challenge.ReadingComplexity
        get() = if (!readingComplexity.isNullOrBlank()) {
            try {
                com.example.core.challenge.ReadingComplexity.valueOf(readingComplexity)
            } catch (_: Exception) {
                calculateReadingComplexityFromLength(question)
            }
        } else {
            calculateReadingComplexityFromLength(question)
        }

    companion object {
        fun calculateReadingComplexityFromLength(text: String): com.example.core.challenge.ReadingComplexity {
            return when {
                text.length <= 65 -> com.example.core.challenge.ReadingComplexity.VERY_SHORT
                text.length <= 95 -> com.example.core.challenge.ReadingComplexity.SHORT
                text.length <= 140 -> com.example.core.challenge.ReadingComplexity.NORMAL
                text.length <= 210 -> com.example.core.challenge.ReadingComplexity.LONG
                else -> com.example.core.challenge.ReadingComplexity.ADVANCED
            }
        }
    }
}

class QuestionTypeConverters {
    @TypeConverter
    fun fromListToString(list: List<String>): String {
        return list.joinToString(SEPARATOR)
    }

    @TypeConverter
    fun fromStringToList(data: String): List<String> {
        if (data.isEmpty()) return emptyList()
        return data.split(SEPARATOR)
    }

    companion object {
        private const val SEPARATOR = "||"
    }
}
