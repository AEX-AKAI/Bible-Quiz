import { Question } from '../models/Question';
import { ChallengeConfig } from '../models/ChallengeModels';
import { QuestionDifficultyStage } from '../../core/types';

export interface IQuestionRepository {
  initialize(): Promise<void>;
  getQuestionById(questionId: string): Promise<Question | null>;
  getQuestionsForChallenge(config: ChallengeConfig): Promise<Question[]>;
  getQuestionCount(): Promise<number>;
  saveCustomQuestion(question: Question): Promise<void>;
}
