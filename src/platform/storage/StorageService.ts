import { AppSettings, DEFAULT_SETTINGS, UserProfile } from '../../data/models/UserProfile';
import { ChallengeResult } from '../../data/models/ChallengeModels';
import { IndexedDBStorage } from '../../data/database/IndexedDBStorage';

export class StorageService {
  private static instance: StorageService;
  private db: IndexedDBStorage;
  private isInitialized: boolean = false;

  private constructor() {
    this.db = new IndexedDBStorage('BibleQuizAppStorage', 1);
  }

  public static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  public async init(): Promise<void> {
    if (this.isInitialized) return;
    await this.db.init();
    this.isInitialized = true;
  }

  public async getSettings(): Promise<AppSettings> {
    await this.init();
    const stored = await this.db.get<AppSettings>('kv', 'settings');
    return stored ? { ...DEFAULT_SETTINGS, ...stored } : DEFAULT_SETTINGS;
  }

  public async saveSettings(settings: AppSettings): Promise<void> {
    await this.init();
    await this.db.set('kv', 'settings', settings);
  }

  public async getUserProfile(): Promise<UserProfile> {
    await this.init();
    const stored = await this.db.get<UserProfile>('kv', 'profile');
    if (stored) return stored;

    const newProfile: UserProfile = {
      playerId: `player_${Math.random().toString(36).substring(2, 9)}`,
      displayName: 'FaithSeeker',
      avatarSeed: 'cross_gold',
      totalChallengesPlayed: 0,
      totalQuestionsAnswered: 0,
      totalCorrectAnswers: 0,
      highestScore: 0,
      bestComboRecord: 0,
      totalSpeedBonuses: 0,
      favoriteBook: 'Psalms',
      createdTimestamp: Date.now(),
      lastActiveTimestamp: Date.now(),
    };
    await this.db.set('kv', 'profile', newProfile);
    return newProfile;
  }

  public async saveUserProfile(profile: UserProfile): Promise<void> {
    await this.init();
    await this.db.set('kv', 'profile', profile);
  }

  public async saveChallengeResult(result: ChallengeResult): Promise<void> {
    await this.init();
    await this.db.set('results', result.resultId, result);

    // Update aggregate stats on user profile
    const profile = await this.getUserProfile();
    profile.totalChallengesPlayed += 1;
    profile.totalQuestionsAnswered += result.questionsAnswered;
    profile.totalCorrectAnswers += result.correctAnswers;
    profile.highestScore = Math.max(profile.highestScore, result.finalScore);
    profile.bestComboRecord = Math.max(profile.bestComboRecord, result.bestCombo);
    profile.totalSpeedBonuses += result.fastAnswersCount;
    profile.lastActiveTimestamp = Date.now();
    await this.saveUserProfile(profile);
  }

  public async getRecentResults(): Promise<ChallengeResult[]> {
    await this.init();
    const all = await this.db.getAll<ChallengeResult>('results');
    return all.sort((a, b) => b.timestamp - a.timestamp).slice(0, 20);
  }
}
