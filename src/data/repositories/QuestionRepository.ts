import { IQuestionRepository } from './IQuestionRepository';
import { Question } from '../models/Question';
import { ChallengeConfig } from '../models/ChallengeModels';
import { MasterQuestionBankSeeder } from '../database/MasterQuestionBankSeeder';
import { CURATED_VISUAL_QUESTIONS } from '../database/CuratedVisualQuestions';
import { SeedPrng } from '../../core/challenge/SeedPrng';
import { ProgressiveDifficultyEngine } from '../../core/difficulty/ProgressiveDifficultyEngine';
import { IndexedDBStorage } from '../database/IndexedDBStorage';

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

    // Search visual list
    const visual = CURATED_VISUAL_QUESTIONS.find(q => q.questionId === questionId);
    if (visual) return visual;

    // Generate by index if bib ID
    if (questionId.startsWith('BIB-')) {
      const idx = parseInt(questionId.replace('BIB-', ''), 10) - 1;
      if (!isNaN(idx) && idx >= 0) {
        return MasterQuestionBankSeeder.generateProceduralQuestion(idx);
      }
    }
    return null;
  }

  public async getQuestionsForChallenge(config: ChallengeConfig): Promise<Question[]> {
    const prng = new SeedPrng(config.seed);
    const questions: Question[] = [];
    const usedIds = new Set<string>();

    const targetCount = config.totalQuestions || 35;

    for (let i = 1; i <= targetCount; i++) {
      const stage = ProgressiveDifficultyEngine.calculateDifficulty(i);
      
      // Inject curated visual question periodically (e.g., question 3, 8, 14, 22)
      if ((i === 3 || i === 8 || i === 14 || i === 22) && CURATED_VISUAL_QUESTIONS.length > 0) {
        const visualCandidate = CURATED_VISUAL_QUESTIONS[(i + prng.nextInt(0, 10)) % CURATED_VISUAL_QUESTIONS.length];
        if (!usedIds.has(visualCandidate.questionId)) {
          // Shuffle options with seed
          const shuffledOptions = prng.shuffle(visualCandidate.options);
          questions.push({ ...visualCandidate, options: shuffledOptions });
          usedIds.add(visualCandidate.questionId);
          continue;
        }
      }

      // Generate or retrieve procedural question matching the progressive difficulty
      let attempts = 0;
      let selectedQ: Question | null = null;

      while (attempts < 20) {
        attempts++;
        const candidateIndex = prng.nextInt(0, MasterQuestionBankSeeder.TARGET_COUNT - 1);
        const q = MasterQuestionBankSeeder.generateProceduralQuestion(candidateIndex);

        if (!usedIds.has(q.questionId)) {
          selectedQ = { ...q, difficulty: stage, options: prng.shuffle(q.options) };
          usedIds.add(q.questionId);
          break;
        }
      }

      if (selectedQ) {
        questions.push(selectedQ);
      }
    }

    return questions;
  }

  public async getQuestionCount(): Promise<number> {
    return MasterQuestionBankSeeder.TARGET_COUNT;
  }

  public async saveCustomQuestion(question: Question): Promise<void> {
    await this.storage.set('questions', question.questionId, question);
  }
}
