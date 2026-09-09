import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  public readonly muted = signal<boolean>(false);
  public readonly volume = signal<number>(0.7);

  private audioCtx: AudioContext | null = null;
  private soundCache: Map<string, HTMLAudioElement> = new Map();

  private soundPaths = {
    click: 'assets/shef/sounds/button-click.mp3',
    'button-click': 'assets/shef/sounds/button-click.mp3',
    drip: 'assets/shef/sounds/drip.mp3',
    fail: 'assets/shef/sounds/fail.mp3',
    kaching: 'assets/shef/sounds/kaching.mp3',
    shop: 'assets/shef/sounds/shop.mp3',
    success: 'assets/shef/sounds/success.mp3',
  };

  constructor() {
    // Pre-cache HTML audio elements
    if (typeof window !== 'undefined') {
      for (const [key, path] of Object.entries(this.soundPaths)) {
        try {
          const audio = new Audio(path);
          audio.preload = 'auto';
          this.soundCache.set(key, audio);
        } catch {
          // Audio loading will be deferred to user interaction
        }
      }
    }
  }

  private ensureAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  public toggleMute(): void {
    this.muted.update(m => !m);
  }

  public playFileSound(key: keyof typeof this.soundPaths): void {
    if (this.muted()) return;
    try {
      const original = this.soundCache.get(key);
      if (original) {
        const clone = original.cloneNode() as HTMLAudioElement;
        clone.volume = Math.min(1, Math.max(0, this.volume()));
        clone.play().catch(() => {});
      }
    } catch {
      // Ignore audio autoplay restrictions gracefully
    }
  }

  /**
   * Procedural Kinetic Laser chirp: fast frequency sweep mirroring APM.
   */
  public playLaserChirp(): void {
    if (this.muted()) return;
    const ctx = this.ensureAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(980, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.12);

      gain.gain.setValueAtTime(0.15 * this.volume(), now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch {
      // Audio context fall-through
    }
  }

  /**
   * Procedural Target Lock blip.
   */
  public playTargetLock(): void {
    if (this.muted()) return;
    const ctx = this.ensureAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.exponentialRampToValueAtTime(1800, now + 0.08);

      gain.gain.setValueAtTime(0.2 * this.volume(), now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch {
      // Fallback
    }
  }

  /**
   * Procedural Mistype Buzz.
   */
  public playMistypeBuzzer(): void {
    this.playFileSound('fail');
    if (this.muted()) return;
    const ctx = this.ensureAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(110, now);
      osc.frequency.setValueAtTime(80, now + 0.08);

      gain.gain.setValueAtTime(0.25 * this.volume(), now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.2);
    } catch {
      // Audio context fall-through
    }
  }

  /**
   * Procedural EMP Blast for Consonant Blitz.
   */
  public playEmpBlast(): void {
    if (this.muted()) return;
    const ctx = this.ensureAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.5);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(3000, now);
      filter.frequency.exponentialRampToValueAtTime(100, now + 0.5);

      gain.gain.setValueAtTime(0.4 * this.volume(), now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.5);
    } catch {
      // Fallback
    }
  }

  /**
   * Procedural Klaxon for Meltdown Wall or Boss Spawn.
   */
  public playMeltdownAlarm(): void {
    if (this.muted()) return;
    const ctx = this.ensureAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(660, now);
      osc.frequency.setValueAtTime(440, now + 0.15);

      gain.gain.setValueAtTime(0.2 * this.volume(), now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch {
      // Fallback
    }
  }
}

