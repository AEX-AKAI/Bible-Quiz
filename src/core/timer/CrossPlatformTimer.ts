export interface TimerState {
  totalSeconds: number;
  remainingSeconds: number;
  isExpired: boolean;
  isActive: boolean;
  elapsedSeconds: number;
}

export class CrossPlatformTimer {
  private totalDurationSeconds: number;
  private onTickCallback?: (state: TimerState) => void;
  private onExpireCallback?: () => void;

  private isRunning: boolean = false;
  private intervalId: any = null;

  // Server-authoritative timestamps (if online)
  private serverEndTimeMillis: number | null = null;

  // Monotonic local timing (if offline)
  private startPerformanceNow: number = 0;
  private elapsedBeforePauseMs: number = 0;

  constructor(totalDurationSeconds: number) {
    this.totalDurationSeconds = totalDurationSeconds;
  }

  /**
   * Initializes server-authoritative timer with synchronized timestamps.
   */
  public initServerAuthoritative(endTimeMillis: number, serverClockDeltaMs: number = 0) {
    this.serverEndTimeMillis = endTimeMillis;
  }

  public start(
    onTick: (state: TimerState) => void,
    onExpire: () => void
  ) {
    this.onTickCallback = onTick;
    this.onExpireCallback = onExpire;
    this.isRunning = true;
    this.startPerformanceNow = performance.now();

    this.tick();
    this.intervalId = setInterval(() => {
      this.tick();
    }, 200); // 200ms precision loop
  }

  private tick() {
    if (!this.isRunning) return;

    let remainingSeconds = 0;
    let elapsedSeconds = 0;

    if (this.serverEndTimeMillis !== null) {
      const now = Date.now();
      const remainingMs = Math.max(0, this.serverEndTimeMillis - now);
      remainingSeconds = Math.ceil(remainingMs / 1000);
      elapsedSeconds = Math.max(0, this.totalDurationSeconds - remainingSeconds);
    } else {
      const now = performance.now();
      const elapsedMs = (now - this.startPerformanceNow) + this.elapsedBeforePauseMs;
      elapsedSeconds = Math.floor(elapsedMs / 1000);
      remainingSeconds = Math.max(0, this.totalDurationSeconds - elapsedSeconds);
    }

    const isExpired = remainingSeconds <= 0;

    if (this.onTickCallback) {
      this.onTickCallback({
        totalSeconds: this.totalDurationSeconds,
        remainingSeconds,
        isExpired,
        isActive: this.isRunning && !isExpired,
        elapsedSeconds,
      });
    }

    if (isExpired) {
      this.stop();
      if (this.onExpireCallback) {
        this.onExpireCallback();
      }
    }
  }

  public pause() {
    if (!this.isRunning) return;
    this.isRunning = false;
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    const now = performance.now();
    this.elapsedBeforePauseMs += (now - this.startPerformanceNow);
  }

  public resume() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.startPerformanceNow = performance.now();
    this.tick();
    this.intervalId = setInterval(() => {
      this.tick();
    }, 200);
  }

  public stop() {
    this.isRunning = false;
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  public getRemainingSeconds(): number {
    if (this.serverEndTimeMillis !== null) {
      const remainingMs = Math.max(0, this.serverEndTimeMillis - Date.now());
      return Math.ceil(remainingMs / 1000);
    }
    const now = performance.now();
    const elapsedMs = (now - this.startPerformanceNow) + this.elapsedBeforePauseMs;
    const elapsedSec = Math.floor(elapsedMs / 1000);
    return Math.max(0, this.totalDurationSeconds - elapsedSec);
  }
}
