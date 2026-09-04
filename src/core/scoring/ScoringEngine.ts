import { QuestionScoreResult, SpeedFeedbackType } from '../types';

export class ScoringEngine {
  public static readonly BASE_SCORE = 10.0;
  public static readonly SPEED_WINDOW_SECONDS = 5.0;

  /**
   * Calculates maximum speed bonus allowed for a given challenge duration:
   * 30s: +5
   * 60s (1m): +7
   * 180s (3m): +10
   * 300s (5m): +12
   * 600s (10m): +15
   */
  public static getMaxSpeedBonusForDuration(durationSeconds: number): number {
    if (durationSeconds <= 30) return 5.0;
    if (durationSeconds <= 60) return 7.0;
    if (durationSeconds <= 180) return 10.0;
    if (durationSeconds <= 300) return 12.0;
    return 15.0;
  }

  /**
   * Calculates raw speed bonus based on response time in seconds.
   * Standard 5-tier graduation scaled to the mode's max bonus.
   */
  public static calculateRawSpeedBonus(responseTimeSeconds: number, durationSeconds: number = 180): number {
    if (responseTimeSeconds > this.SPEED_WINDOW_SECONDS) {
      return 0.0;
    }

    const maxBonus = this.getMaxSpeedBonusForDuration(durationSeconds);
    const standardMax = 5.0;
    const scaleFactor = maxBonus / standardMax;

    let baseTier = 0.0;
    if (responseTimeSeconds <= 1.0) {
      baseTier = 5.0;
    } else if (responseTimeSeconds <= 2.0) {
      baseTier = 4.0;
    } else if (responseTimeSeconds <= 3.0) {
      baseTier = 3.0;
    } else if (responseTimeSeconds <= 4.0) {
      baseTier = 2.0;
    } else if (responseTimeSeconds <= 5.0) {
      baseTier = 1.0;
    } else {
      baseTier = 0.0;
    }

    return this.roundToOneDecimal(baseTier * scaleFactor);
  }

  /**
   * Calculates combo multiplier based on active combo streak.
   * Multiplier applies ONLY to the speed bonus portion.
   * Capped strictly at 1.5 maximum.
   */
  public static getComboMultiplier(combo: number): number {
    if (combo < 5) return 1.0;
    if (combo <= 9) return 1.1;
    if (combo <= 14) return 1.2;
    if (combo <= 19) return 1.3;
    return 1.5; // 20+ cap
  }

  /**
   * Categorizes feedback message and type based on response speed and correctness.
   */
  public static getSpeedFeedback(
    isCorrect: boolean,
    responseTimeSeconds: number
  ): { feedbackType: SpeedFeedbackType; message: string } {
    if (!isCorrect) {
      return { feedbackType: 'COMBO_BREAK', message: 'COMBO BREAK' };
    }
    if (responseTimeSeconds <= 1.0) {
      return { feedbackType: 'PERFECT_SPEED', message: 'PERFECT SPEED!' };
    }
    if (responseTimeSeconds <= 2.0) {
      return { feedbackType: 'FAST_SPEED', message: 'BLAZING FAST!' };
    }
    if (responseTimeSeconds <= 3.0) {
      return { feedbackType: 'GREAT_SPEED', message: 'GREAT SPEED!' };
    }
    if (responseTimeSeconds <= 4.0) {
      return { feedbackType: 'GOOD_SPEED', message: 'GOOD SPEED!' };
    }
    if (responseTimeSeconds <= 5.0) {
      return { feedbackType: 'NORMAL_SPEED', message: 'SPEED BONUS' };
    }
    return { feedbackType: 'NO_SPEED_BONUS', message: 'NO SPEED BONUS' };
  }

  /**
   * Core scoring function: evaluates answer submission.
   */
  public static scoreAnswer(
    isCorrect: boolean,
    responseTimeSeconds: number,
    previousCombo: number,
    previousBestCombo: number = previousCombo,
    durationSeconds: number = 180
  ): QuestionScoreResult {
    if (!isCorrect) {
      return {
        isCorrect: false,
        baseScore: 0.0,
        rawSpeedBonus: 0.0,
        comboMultiplier: 1.0,
        adjustedSpeedBonus: 0.0,
        totalQuestionScore: 0.0,
        currentCombo: 0,
        bestCombo: previousBestCombo,
        feedbackType: 'COMBO_BREAK',
        message: 'COMBO BREAK',
      };
    }

    const rawSpeed = this.calculateRawSpeedBonus(responseTimeSeconds, durationSeconds);
    const { feedbackType, message } = this.getSpeedFeedback(true, responseTimeSeconds);

    let newCombo: number;
    let multiplier: number;
    let adjustedSpeedBonus: number;

    if (rawSpeed > 0) {
      newCombo = previousCombo + 1;
      multiplier = this.getComboMultiplier(newCombo);
      adjustedSpeedBonus = this.roundToOneDecimal(rawSpeed * multiplier);
    } else {
      // Answering after 5s: 10 base points, combo reset to 0
      newCombo = 0;
      multiplier = 1.0;
      adjustedSpeedBonus = 0.0;
    }

    const totalScore = this.roundToOneDecimal(this.BASE_SCORE + adjustedSpeedBonus);
    const newBestCombo = Math.max(newCombo, previousBestCombo);

    return {
      isCorrect: true,
      baseScore: this.BASE_SCORE,
      rawSpeedBonus: rawSpeed,
      comboMultiplier: multiplier,
      adjustedSpeedBonus,
      totalQuestionScore: totalScore,
      currentCombo: newCombo,
      bestCombo: newBestCombo,
      feedbackType,
      message,
    };
  }

  public static roundToOneDecimal(val: number): number {
    return Math.round(val * 10) / 10;
  }
}
