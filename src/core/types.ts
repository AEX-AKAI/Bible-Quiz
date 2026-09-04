/**
 * Shared Core Type Definitions for Bible Quiz Cross-Platform Engine
 */

export type PlatformType = 'web' | 'android' | 'ios' | 'windows' | 'macos' | 'linux';

export type ChallengeDuration = 30 | 60 | 180 | 300 | 600; // seconds

export type ChallengeDifficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT' | 'MIXED';

export type QuestionDifficultyStage = 
  | 'EASY'
  | 'EASY_MEDIUM'
  | 'MEDIUM'
  | 'MEDIUM_HARD'
  | 'HARD'
  | 'HARD_EXPERT'
  | 'EXPERT';

export type ReadingComplexity = 
  | 'VERY_SHORT'
  | 'SHORT'
  | 'NORMAL'
  | 'LONG'
  | 'ADVANCED';

export type QuestionType = 'TEXT' | 'IMAGE' | 'IMAGE_TEXT';

export type SpeedFeedbackType = 
  | 'PERFECT_SPEED'
  | 'FAST_SPEED'
  | 'GREAT_SPEED'
  | 'GOOD_SPEED'
  | 'NORMAL_SPEED'
  | 'NO_SPEED_BONUS'
  | 'COMBO_BREAK';

export interface QuestionScoreResult {
  isCorrect: Boolean;
  baseScore: number;
  rawSpeedBonus: number;
  comboMultiplier: number;
  adjustedSpeedBonus: number;
  totalQuestionScore: number;
  currentCombo: number;
  bestCombo: number;
  feedbackType: SpeedFeedbackType;
  message: string;
}

export type NetworkStatus = 'ONLINE' | 'OFFLINE' | 'CONNECTING' | 'RECONNECTING' | 'NETWORK_ERROR';
