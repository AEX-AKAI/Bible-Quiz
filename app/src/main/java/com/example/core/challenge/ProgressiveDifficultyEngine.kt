package com.example.core.challenge

enum class QuestionDifficultyStage(val displayName: String, val level: Int) {
    EASY("Easy", 1),
    EASY_MEDIUM("Easy / Medium", 2),
    MEDIUM("Medium", 3),
    MEDIUM_HARD("Medium / Hard", 4),
    HARD("Hard", 5),
    HARD_EXPERT("Hard / Expert", 6),
    EXPERT("Expert", 7);

    companion object {
        /**
         * Calculates the difficulty stage for a 1-based question position:
         * Questions 1–5   -> EASY
         * Questions 6–10  -> EASY_MEDIUM
         * Questions 11–15 -> MEDIUM
         * Questions 16–20 -> MEDIUM_HARD
         * Questions 21–25 -> HARD
         * Questions 26–30 -> HARD_EXPERT
         * Questions 31+   -> EXPERT (capped, never exceeds EXPERT)
         */
        fun calculateDifficulty(questionNumber: Int): QuestionDifficultyStage {
            val qNum = maxOf(1, questionNumber)
            return when (qNum) {
                in 1..5 -> EASY
                in 6..10 -> EASY_MEDIUM
                in 11..15 -> MEDIUM
                in 16..20 -> MEDIUM_HARD
                in 21..25 -> HARD
                in 26..30 -> HARD_EXPERT
                else -> EXPERT
            }
        }
    }
}

enum class ReadingComplexity(val maxCharacters: Int) {
    VERY_SHORT(65),
    SHORT(95),
    NORMAL(140),
    LONG(210),
    ADVANCED(320);

    companion object {
        /**
         * Determines the allowed reading complexity profile for a given challenge duration (seconds)
         * and difficulty stage.
         *
         * 30 seconds (Rapid Fire):
         * Questions remain VERY SHORT even when difficulty increases.
         *
         * 1 minute (60 seconds, Quick Quiz):
         * Keep questions SHORT even as difficulty increases.
         *
         * 3 minutes (180 seconds, Challenge):
         * Use SHORT and NORMAL questions.
         *
         * 5 minutes (300 seconds, Bible Battle):
         * Use NORMAL questions, with some LONG questions at higher difficulty.
         *
         * 10 minutes (600 seconds, Bible Marathon):
         * NORMAL, LONG, and ADVANCED questions can be used at higher difficulty.
         */
        fun getAllowedComplexities(durationSeconds: Int, stage: QuestionDifficultyStage): Set<ReadingComplexity> {
            return when {
                durationSeconds <= 30 -> {
                    // Rapid Fire: Strictly VERY_SHORT
                    setOf(VERY_SHORT)
                }
                durationSeconds <= 60 -> {
                    // 1 Minute: VERY_SHORT, SHORT
                    setOf(VERY_SHORT, SHORT)
                }
                durationSeconds <= 180 -> {
                    // 3 Minutes: SHORT and NORMAL
                    setOf(VERY_SHORT, SHORT, NORMAL)
                }
                durationSeconds <= 300 -> {
                    // 5 Minutes: NORMAL, with some LONG at higher difficulty
                    if (stage.level >= QuestionDifficultyStage.HARD.level) {
                        setOf(SHORT, NORMAL, LONG)
                    } else {
                        setOf(VERY_SHORT, SHORT, NORMAL)
                    }
                }
                else -> {
                    // 10 Minutes+: NORMAL, LONG, and ADVANCED can be used at higher difficulty
                    if (stage.level >= QuestionDifficultyStage.HARD.level) {
                        setOf(NORMAL, LONG, ADVANCED)
                    } else {
                        setOf(SHORT, NORMAL, LONG)
                    }
                }
            }
        }
    }
}
