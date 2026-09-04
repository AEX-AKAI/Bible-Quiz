import { ScoringEngine } from '../scoring/ScoringEngine';

export interface ComboState {
  currentCombo: number;
  bestCombo: number;
  multiplier: number;
  isHotStreak: boolean;
}

export class ComboEngine {
  private currentCombo: number = 0;
  private bestCombo: number = 0;

  constructor(initialBestCombo: number = 0) {
    this.bestCombo = initialBestCombo;
  }

  public registerSuccess(): ComboState {
    this.currentCombo += 1;
    if (this.currentCombo > this.bestCombo) {
      this.bestCombo = this.currentCombo;
    }
    return this.getState();
  }

  public registerBreak(): ComboState {
    this.currentCombo = 0;
    return this.getState();
  }

  public getState(): ComboState {
    return {
      currentCombo: this.currentCombo,
      bestCombo: this.bestCombo,
      multiplier: ScoringEngine.getComboMultiplier(this.currentCombo),
      isHotStreak: this.currentCombo >= 5,
    };
  }

  public reset() {
    this.currentCombo = 0;
    this.bestCombo = 0;
  }
}
