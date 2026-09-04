import { ChallengeDifficulty, ChallengeDuration } from '../../core/types';
import { Question } from './Question';

export interface ChallengeConfig {
  challengeId: string;
  seed: number | string;
  timeLimitSeconds: ChallengeDuration;
  difficulty: ChallengeDifficulty;
  isOnline: boolean;
  totalQuestions: number;
}

export interface AnswerSubmissionEvent {
  eventId: string;
  challengeId: string;
  questionId: string;
  sequencePosition: number;
  selectedAnswer: string;
  responseTimeMs: number;
  clientTimestamp: number;
}

export interface AnswerReviewItem {
  questionNumber: number;
  questionText: string;
  options: string[];
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  responseTimeSeconds: number;
  pointsEarned: number;
  scriptureReference: string;
  explanation: string;
  isVisual: boolean;
  imageUrl?: string;
}

export interface ChallengeResult {
  resultId: string;
  challengeId: string;
  seed: number | string;
  playerName: string;
  finalScore: number;
  questionsAnswered: number;
  correctAnswers: number;
  incorrectAnswers: number;
  accuracyPercentage: number;
  fastAnswersCount: number;
  bestCombo: number;
  averageResponseTimeSeconds: number;
  durationSeconds: number;
  difficulty: string;
  timestamp: number;
  isOnline: boolean;
  answerReviews: AnswerReviewItem[];
}
