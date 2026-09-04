import { AppSettings } from '../../data/models/UserProfile';

export type AmbientMood = 'NORMAL' | 'URGENCY' | 'HIGH_COMBO';

export class WebAudioEngine {
  private static instance: WebAudioEngine;
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;

  private isAmbientPlaying: boolean = false;
  private ambientOscillators: OscillatorNode[] = [];
  private ambientFilter: BiquadFilterNode | null = null;
  private ambientLfo: OscillatorNode | null = null;

  private settings: AppSettings = {
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

  private constructor() {}

  public static getInstance(): WebAudioEngine {
    if (!WebAudioEngine.instance) {
      WebAudioEngine.instance = new WebAudioEngine();
    }
    return WebAudioEngine.instance;
  }

  public updateSettings(settings: AppSettings) {
    this.settings = { ...settings };
    this.applyVolumes();
    if (!this.settings.ambientSoundEnabled || !this.settings.masterAudioEnabled) {
      this.stopAmbient();
    } else if (this.isAmbientPlaying) {
      // Keep playing with updated volume
    }
  }

  private initContext() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.ambientGain = this.ctx.createGain();
      this.sfxGain = this.ctx.createGain();

      this.ambientGain.connect(this.masterGain);
      this.sfxGain.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);

      this.applyVolumes();
    } catch (err) {
      console.warn('AudioContext init error:', err);
    }
  }

  public ensureUnlocked() {
    this.initContext();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  private applyVolumes() {
    if (!this.ctx || !this.masterGain || !this.ambientGain || !this.sfxGain) return;
    const now = this.ctx.currentTime;

    const master = this.settings.masterAudioEnabled ? this.settings.masterVolume : 0.0;
    const ambient = this.settings.ambientSoundEnabled ? this.settings.ambientVolume : 0.0;
    const sfx = this.settings.soundEffectsEnabled ? this.settings.soundEffectsVolume : 0.0;

    this.masterGain.gain.setTargetAtTime(master, now, 0.05);
    this.ambientGain.gain.setTargetAtTime(ambient, now, 0.05);
    this.sfxGain.gain.setTargetAtTime(sfx, now, 0.05);
  }

  // --- AMBIENT SYNTHESIS ---

  public startAmbient(mood: AmbientMood = 'NORMAL') {
    if (!this.settings.masterAudioEnabled || !this.settings.ambientSoundEnabled) return;
    this.ensureUnlocked();
    if (!this.ctx || !this.ambientGain || this.isAmbientPlaying) return;

    this.isAmbientPlaying = true;
    const now = this.ctx.currentTime;

    // Peaceful celestial pad chords: Root D (146.8Hz), A (220Hz), D (293.66Hz), F# (369.99Hz)
    const freqs = [146.83, 220.00, 293.66, 369.99];
    this.ambientFilter = this.ctx.createBiquadFilter();
    this.ambientFilter.type = 'lowpass';
    this.ambientFilter.frequency.setValueAtTime(450, now);
    this.ambientFilter.Q.setValueAtTime(2.0, now);
    this.ambientFilter.connect(this.ambientGain);

    // LFO for gentle breathing swell
    this.ambientLfo = this.ctx.createOscillator();
    this.ambientLfo.frequency.setValueAtTime(0.12, now); // slow 8-second cycle
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(120, now);
    this.ambientLfo.connect(lfoGain);
    lfoGain.connect(this.ambientFilter.frequency);
    this.ambientLfo.start();

    this.ambientOscillators = freqs.map((freq, i) => {
      const osc = this.ctx!.createOscillator();
      osc.type = i === 0 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, now);

      const oscGain = this.ctx!.createGain();
      oscGain.gain.setValueAtTime(0.08 / (i + 1), now);
      osc.connect(oscGain);
      oscGain.connect(this.ambientFilter!);
      osc.start();
      return osc;
    });

    this.setAmbientMood(mood);
  }

  public setAmbientMood(mood: AmbientMood) {
    if (!this.ctx || !this.ambientFilter || !this.ambientGain) return;
    const now = this.ctx.currentTime;

    if (mood === 'URGENCY') {
      // Increase filter frequency and brightness for tension
      this.ambientFilter.frequency.setTargetAtTime(850, now, 0.4);
    } else if (mood === 'HIGH_COMBO') {
      // Golden shimmer
      this.ambientFilter.frequency.setTargetAtTime(1100, now, 0.3);
    } else {
      // Normal calm contemplation
      this.ambientFilter.frequency.setTargetAtTime(450, now, 0.5);
    }
  }

  public stopAmbient() {
    if (!this.isAmbientPlaying) return;
    this.isAmbientPlaying = false;

    this.ambientOscillators.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {}
    });
    this.ambientOscillators = [];

    if (this.ambientLfo) {
      try {
        this.ambientLfo.stop();
        this.ambientLfo.disconnect();
      } catch {}
      this.ambientLfo = null;
    }
  }

  // --- SOUND EFFECTS ---

  public playButtonTap() {
    if (!this.settings.masterAudioEnabled || !this.settings.soundEffectsEnabled) return;
    this.ensureUnlocked();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(540, now);
    osc.frequency.exponentialRampToValueAtTime(280, now + 0.06);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.06);
  }

  public playCorrectAnswer() {
    if (!this.settings.masterAudioEnabled || !this.settings.soundEffectsEnabled) return;
    this.ensureUnlocked();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    // Major chord arpeggio: C5 (523Hz), E5 (659Hz), G5 (783Hz), C6 (1046Hz)
    const notes = [523.25, 659.25, 783.99, 1046.50];

    notes.forEach((freq, idx) => {
      const noteTime = now + idx * 0.05;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.001, noteTime);
      gain.gain.linearRampToValueAtTime(0.28, noteTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.35);

      osc.connect(gain);
      gain.connect(this.sfxGain!);
      osc.start(noteTime);
      osc.stop(noteTime + 0.35);
    });
  }

  public playIncorrectAnswer() {
    if (!this.settings.masterAudioEnabled || !this.settings.soundEffectsEnabled) return;
    this.ensureUnlocked();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(95, now + 0.28);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.28);
  }

  public playSpeedBonus() {
    if (!this.settings.masterAudioEnabled || !this.settings.soundEffectsEnabled) return;
    this.ensureUnlocked();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(700, now);
    osc.frequency.exponentialRampToValueAtTime(1400, now + 0.12);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.15);
  }

  public playComboStreak(comboCount: number) {
    if (!this.settings.masterAudioEnabled || !this.settings.soundEffectsEnabled) return;
    this.ensureUnlocked();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const baseFreq = 880 + Math.min(comboCount * 40, 600);

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.15);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.25);
  }

  public playHintDisclosure() {
    if (!this.settings.masterAudioEnabled || !this.settings.soundEffectsEnabled) return;
    this.ensureUnlocked();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const freqs = [659.25, 987.77]; // E5, B5 crystalline bell

    freqs.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0.2, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.4);

      osc.connect(gain);
      gain.connect(this.sfxGain!);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.4);
    });
  }

  public playTimerWarning() {
    if (!this.settings.masterAudioEnabled || !this.settings.soundEffectsEnabled) return;
    this.ensureUnlocked();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, now);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.05);
  }

  public playChallengeStart() {
    if (!this.settings.masterAudioEnabled || !this.settings.soundEffectsEnabled) return;
    this.ensureUnlocked();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(440, now + 0.2);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.6);
  }

  public playVictoryFanfare() {
    if (!this.settings.masterAudioEnabled || !this.settings.soundEffectsEnabled) return;
    this.ensureUnlocked();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    // Triumphant fanfare: C5, E5, G5, C6 held
    const notes = [
      { f: 523.25, d: 0.12 },
      { f: 659.25, d: 0.12 },
      { f: 783.99, d: 0.12 },
      { f: 1046.50, d: 0.60 }
    ];

    let t = now;
    notes.forEach((note) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.f, t);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.3, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + note.d);

      osc.connect(gain);
      gain.connect(this.sfxGain!);
      osc.start(t);
      osc.stop(t + note.d);
      t += 0.14;
    });
  }
}
