import { Question } from '../models/Question';
import { CURATED_VISUAL_QUESTIONS } from './CuratedVisualQuestions';
import { MASTER_CURATED_QUESTIONS } from './MasterCuratedQuestions';
import { ProceduralQuestionEngine } from './ProceduralQuestionEngine';
import { QuestionDifficultyStage } from '../../core/types';

export class MasterQuestionBankSeeder {
  public static readonly TARGET_COUNT = 50000;

  /**
   * Returns combined curated foundational questions (visual + textual).
   */
  public static getCuratedQuestions(): Question[] {
    return [...CURATED_VISUAL_QUESTIONS, ...MASTER_CURATED_QUESTIONS];
  }

  /**
   * Retrieves a question by its 0-based global index.
   * If within curated range, returns curated; otherwise generates algorithmically.
   */
  public static getQuestionByIndex(index: number): Question {
    const curated = this.getCuratedQuestions();
    if (index < curated.length) {
      return curated[index];
    }
    return ProceduralQuestionEngine.generate(index - curated.length);
  }

  /**
   * Retrieves paginated questions for administration, exploration, or local caching.
   */
  public static getQuestions(
    offset: number = 0,
    limit: number = 50,
    difficulty?: QuestionDifficultyStage
  ): Question[] {
    const questions: Question[] = [];
    for (let i = 0; i < limit; i++) {
      const idx = offset + i;
      if (idx >= this.TARGET_COUNT) break;
      const q = this.getQuestionByIndex(idx);
      if (!difficulty || q.difficulty === difficulty) {
        questions.push(q);
      }
    }
    return questions;
  }

  /**
   * Looks up a question by ID across curated items and procedural ranges.
   */
  public static getQuestionById(questionId: string): Question | null {
    const curated = this.getCuratedQuestions();
    const foundCurated = curated.find((q) => q.questionId === questionId);
    if (foundCurated) return foundCurated;

    // Handle BIB procedural patterns (e.g. BIB-LMK-000001, BIB-CHR-000001, etc.)
    const match = questionId.match(/BIB-(?:LMK|CHR|NUM|LOC|PRP|NAM)-(\d+)/) || questionId.match(/BIB-(\d+)/);
    if (match) {
      const num = parseInt(match[1], 10);
      if (!isNaN(num) && num > 0) {
        return ProceduralQuestionEngine.generate(num - 1);
      }
    }
    return null;
  }
}
