import { IQuestionRepository } from './IQuestionRepository';
import { Question } from '../models/Question';
import { ChallengeConfig } from '../models/ChallengeModels';
import { MasterQuestionBankSeeder } from '../database/MasterQuestionBankSeeder';
import { CURATED_VISUAL_QUESTIONS } from '../database/CuratedVisualQuestions';
import { MASTER_CURATED_QUESTIONS } from '../database/MasterCuratedQuestions';
import { ProceduralQuestionEngine } from '../database/ProceduralQuestionEngine';
import { QuestionValidationService } from '../database/QuestionValidationService';
import { SeedPrng } from '../../core/challenge/SeedPrng';
import { ProgressiveDifficultyEngine } from '../../core/difficulty/ProgressiveDifficultyEngine';
import { IndexedDBStorage } from '../database/IndexedDBStorage';
import { StorageService } from '../../platform/storage/StorageService';

export class QuestionRepository implements IQuestionRepository {
  private static instance: QuestionRepository;
  private storage: IndexedDBStorage;
  private isReady: boolean = false;

  private constructor() {
    this.storage = new IndexedDBStorage();
  }

  public static getInstance(): QuestionRepository {
    if (!QuestionRepository.instance) {
      QuestionRepository.instance = new QuestionRepository();
    }
    return QuestionRepository.instance;
  }

  public async initialize(): Promise<void> {
    if (this.isReady) return;
    await this.storage.init();
    this.isReady = true;
  }

  public async getQuestionById(questionId: string): Promise<Question | null> {
    const cached = await this.storage.get<Question>('questions', questionId);
    if (cached) return cached;

    return MasterQuestionBankSeeder.getQuestionById(questionId);
  }

  /**
   * Generates or selects a question for sequence position `sequenceIndex` (1-based),
   * ensuring zero duplicates against `usedIds` and prioritizing non-recent questions.
   */
  public getStreamQuestion(
    sequenceIndex: number,
    config: ChallengeConfig,
    usedIds: Set<string>,
    recentIds?: Set<string>
  ): Question {
    // Unique seed per question sequence derived deterministically from challenge seed
    const prng = new SeedPrng(`${config.seed}_q_${sequenceIndex}`);
    const stage = ProgressiveDifficultyEngine.calculateDifficulty(sequenceIndex);
    const allowedComplexities = ProgressiveDifficultyEngine.getAllowedComplexities(
      config.timeLimitSeconds,
      stage
    );

    // Visual injection pattern (e.g. sequence 4, 11, 18, 25, 33...) if visual questions available
    const isVisualSlot = sequenceIndex % 7 === 4 && CURATED_VISUAL_QUESTIONS.length > 0;

    if (isVisualSlot) {
      const visualCandidates = CURATED_VISUAL_QUESTIONS.filter(
        (q) => !usedIds.has(q.questionId)
      );
      if (visualCandidates.length > 0) {
        const visualChoice = visualCandidates[prng.nextInt(0, visualCandidates.length - 1)];
        usedIds.add(visualChoice.questionId);
        return {
          ...visualChoice,
          options: prng.shuffle(visualChoice.options),
        };
      }
    }

    // Curated bank matching
    const curatedMatches = MASTER_CURATED_QUESTIONS.filter((q) => {
      if (usedIds.has(q.questionId)) return false;
      if (q.difficulty !== stage) return false;
      if (q.readingComplexity && !allowedComplexities.has(q.readingComplexity)) return false;
      return true;
    });

    // If matching curated questions exist that are not recently seen:
    const freshCurated = curatedMatches.filter((q) => !recentIds?.has(q.questionId));
    const curatedPool = freshCurated.length > 0 ? freshCurated : curatedMatches;

    if (curatedPool.length > 0 && prng.next() < 0.65) {
      const choice = curatedPool[prng.nextInt(0, curatedPool.length - 1)];
      usedIds.add(choice.questionId);
      return {
        ...choice,
        options: prng.shuffle(choice.options),
      };
    }

    // Procedural generation fallback loop
    let attempts = 0;
    while (attempts < 50) {
      attempts++;
      const candidateIndex = prng.nextInt(0, ProceduralQuestionEngine.GENERATED_CAPACITY - 1);
      const generated = ProceduralQuestionEngine.generate(candidateIndex);

      if (usedIds.has(generated.questionId)) continue;
      if (recentIds && recentIds.has(generated.questionId) && attempts < 25) continue;

      usedIds.add(generated.questionId);
      return {
        ...generated,
        difficulty: stage,
        options: prng.shuffle(generated.options),
      };
    }

    // Fallback if loop finishes: generate with guaranteed unique ID
    const fallbackId = `BIB-FLB-${sequenceIndex}-${prng.nextInt(1000, 9999)}`;
    const fallback = ProceduralQuestionEngine.generate(sequenceIndex * 13);
    usedIds.add(fallbackId);
    return {
      ...fallback,
      questionId: fallbackId,
      difficulty: stage,
      options: prng.shuffle(fallback.options),
    };
  }

  /**
   * Generates a batch of questions for a challenge with zero repeats.
   */
  public async getQuestionsForChallenge(
    config: ChallengeConfig,
    count?: number
  ): Promise<Question[]> {
    const targetCount = count ?? (config.totalQuestions > 0 ? config.totalQuestions : 35);
    const recentList = await StorageService.getInstance().getRecentQuestionIds();
    const recentIds = new Set<string>(recentList);

    const questions: Question[] = [];
    const usedIds = new Set<string>();

    for (let i = 1; i <= targetCount; i++) {
      const q = this.getStreamQuestion(i, config, usedIds, recentIds);
      questions.push(q);
    }

    return questions;
  }

  public async getQuestionCount(): Promise<number> {
    return MasterQuestionBankSeeder.TARGET_COUNT;
  }

  public async saveCustomQuestion(question: Question): Promise<void> {
    await this.storage.set('questions', question.questionId, question);
  }

  public async getAllCustomQuestions(): Promise<Question[]> {
    await this.initialize();
    return this.storage.getAll<Question>('questions');
  }
}
