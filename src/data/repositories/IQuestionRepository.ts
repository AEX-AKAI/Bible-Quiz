import { Question } from '../models/Question';
import { ChallengeConfig } from '../models/ChallengeModels';

export interface IQuestionRepository {
  initialize(): Promise<void>;
  getQuestionById(questionId: string): Promise<Question | null>;
  getQuestionsForChallenge(config: ChallengeConfig, count?: number): Promise<Question[]>;
  getStreamQuestion(
    sequenceIndex: number,
    config: ChallengeConfig,
    usedIds: Set<string>,
    recentIds?: Set<string>
  ): Question;
  getQuestionCount(): Promise<number>;
  saveCustomQuestion(question: Question): Promise<void>;
  getAllCustomQuestions(): Promise<Question[]>;
}
