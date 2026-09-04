export interface UserProfile {
  playerId: string;
  displayName: string;
  avatarSeed: string;
  totalChallengesPlayed: number;
  totalQuestionsAnswered: number;
  totalCorrectAnswers: number;
  highestScore: number;
  bestComboRecord: number;
  totalSpeedBonuses: number;
  favoriteBook: string;
  createdTimestamp: number;
  lastActiveTimestamp: number;
}

export interface AppSettings {
  masterAudioEnabled: boolean;
  ambientSoundEnabled: boolean;
  soundEffectsEnabled: boolean;
  hapticFeedbackEnabled: boolean;
  reduceAnimations: boolean;
  darkMode: boolean;
  notificationsEnabled: boolean;
  masterVolume: number;
  ambientVolume: number;
  soundEffectsVolume: number;
}

export const DEFAULT_SETTINGS: AppSettings = {
  masterAudioEnabled: true,
  ambientSoundEnabled: true,
  soundEffectsEnabled: true,
  hapticFeedbackEnabled: true,
  reduceAnimations: false,
  darkMode: true,
  notificationsEnabled: true,
  masterVolume: 0.85,
  ambientVolume: 0.40,
  soundEffectsVolume: 0.85,
};
