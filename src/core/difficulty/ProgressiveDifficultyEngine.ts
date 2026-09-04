import { QuestionDifficultyStage, ReadingComplexity } from '../types';

export interface DifficultyStageInfo {
  stage: QuestionDifficultyStage;
  displayName: string;
  level: number;
}

export const DIFFICULTY_STAGES: Record<QuestionDifficultyStage, DifficultyStageInfo> = {
  EASY: { stage: 'EASY', displayName: 'Easy', level: 1 },
  EASY_MEDIUM: { stage: 'EASY_MEDIUM', displayName: 'Easy / Medium', level: 2 },
  MEDIUM: { stage: 'MEDIUM', displayName: 'Medium', level: 3 },
  MEDIUM_HARD: { stage: 'MEDIUM_HARD', displayName: 'Medium / Hard', level: 4 },
  HARD: { stage: 'HARD', displayName: 'Hard', level: 5 },
  HARD_EXPERT: { stage: 'HARD_EXPERT', displayName: 'Hard / Expert', level: 6 },
  EXPERT: { stage: 'EXPERT', displayName: 'Expert', level: 7 },
};

export class ProgressiveDifficultyEngine {
  /**
   * Calculates the progressive difficulty stage for a 1-based question number:
   * 1-5   -> EASY
   * 6-10  -> EASY_MEDIUM
   * 11-15 -> MEDIUM
   * 16-20 -> MEDIUM_HARD
   * 21-25 -> HARD
   * 26-30 -> HARD_EXPERT
   * 31+   -> EXPERT
   */
  public static calculateDifficulty(questionNumber: number): QuestionDifficultyStage {
    const qNum = Math.max(1, questionNumber);
    if (qNum <= 5) return 'EASY';
    if (qNum <= 10) return 'EASY_MEDIUM';
    if (qNum <= 15) return 'MEDIUM';
    if (qNum <= 20) return 'MEDIUM_HARD';
    if (qNum <= 25) return 'HARD';
    if (qNum <= 30) return 'HARD_EXPERT';
    return 'EXPERT';
  }

  /**
   * Determines allowed reading complexities based on challenge duration and stage.
   * 30s: VERY_SHORT
   * 60s: VERY_SHORT, SHORT
   * 180s: SHORT, NORMAL
   * 300s: NORMAL, some LONG
   * 600s: NORMAL, LONG, ADVANCED
   */
  public static getAllowedComplexities(
    durationSeconds: number,
    stage: QuestionDifficultyStage
  ): Set<ReadingComplexity> {
    const level = DIFFICULTY_STAGES[stage].level;

    if (durationSeconds <= 30) {
      return new Set(['VERY_SHORT']);
    }
    if (durationSeconds <= 60) {
      return new Set(['VERY_SHORT', 'SHORT']);
    }
    if (durationSeconds <= 180) {
      return new Set(['VERY_SHORT', 'SHORT', 'NORMAL']);
    }
    if (durationSeconds <= 300) {
      if (level >= 5) {
        return new Set(['SHORT', 'NORMAL', 'LONG']);
      }
      return new Set(['VERY_SHORT', 'SHORT', 'NORMAL']);
    }
    // 600s (10m)
    if (level >= 5) {
      return new Set(['NORMAL', 'LONG', 'ADVANCED']);
    }
    return new Set(['SHORT', 'NORMAL', 'LONG']);
  }
}
