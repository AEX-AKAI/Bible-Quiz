import { ChallengeConfig, ChallengeResult } from '../models/ChallengeModels';
import { SeedPrng } from '../../core/challenge/SeedPrng';

export interface LeaderboardEntry {
  rank: number;
  playerName: string;
  score: number;
  accuracy: number;
  bestCombo: number;
  platform: string;
  isUser?: boolean;
}

export class OnlineChallengeService {
  private static instance: OnlineChallengeService;

  private constructor() {}

  public static getInstance(): OnlineChallengeService {
    if (!OnlineChallengeService.instance) {
      OnlineChallengeService.instance = new OnlineChallengeService();
    }
    return OnlineChallengeService.instance;
  }

  /**
   * Generates deterministic competitors for the lobby/leaderboard based on the challenge seed.
   * This guarantees that regardless of whether a player is on Android, iPhone, Windows, Mac, or Web,
   * they see the exact same challenge lobby and standings!
   */
  public generateLobbyCompetitors(config: ChallengeConfig, userResult?: ChallengeResult): LeaderboardEntry[] {
    const prng = new SeedPrng(config.seed);
    const names = [
      'Priscilla_Acts',
      'Barnabas_Seeker',
      'Caleb_Faith',
      'Deborah_Lead',
      'Timothy_Disciple',
      'Gideon_300',
      'Esther_Brave',
      'Peter_Fisher',
      'Lydia_Purple',
      'Silas_Praise'
    ];

    const platforms = ['Android', 'iOS', 'Web', 'Windows', 'macOS'];
    const count = 6;
    const entries: LeaderboardEntry[] = [];

    for (let i = 0; i < count; i++) {
      const name = names[i % names.length];
      const platform = platforms[prng.nextInt(0, platforms.length - 1)];
      const targetQuestions = Math.floor(config.timeLimitSeconds / 3.8) + prng.nextInt(-2, 4);
      const safeQuestions = Math.max(8, targetQuestions);
      const accuracy = 75 + prng.nextInt(0, 22);
      const correct = Math.floor((safeQuestions * accuracy) / 100);
      const fastCount = Math.floor(correct * 0.7);
      const basePts = correct * 10;
      const speedBonus = fastCount * 3.5;
      const finalScore = Math.round((basePts + speedBonus * 1.1) * 10) / 10;
      const bestCombo = Math.min(correct, Math.floor(correct * 0.4) + prng.nextInt(1, 3));

      entries.push({
        rank: 0,
        playerName: name,
        score: finalScore,
        accuracy,
        bestCombo,
        platform,
      });
    }

    if (userResult) {
      entries.push({
        rank: 0,
        playerName: `${userResult.playerName} (You)`,
        score: userResult.finalScore,
        accuracy: userResult.accuracyPercentage,
        bestCombo: userResult.bestCombo,
        platform: 'Current Device',
        isUser: true,
      });
    }

    // Sort descending by score
    entries.sort((a, b) => b.score - a.score);
    entries.forEach((e, idx) => {
      e.rank = idx + 1;
    });

    return entries;
  }
}
