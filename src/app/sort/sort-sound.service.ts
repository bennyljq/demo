import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SortSoundService {
  private audioCtx: AudioContext | null = null;
  private plinkBuffer: AudioBuffer | null = null;
  private successBuffer: AudioBuffer | null = null;
  private _enabled = true;
  private lastToneTime = 0;
  private readonly MIN_INTERVAL = 16; // ms

  async init(): Promise<void> {
    if (this.audioCtx) return;
    this.audioCtx = new AudioContext();
    this.plinkBuffer  = await this.loadBuffer('assets/pachinko/plink.mp3');
    this.successBuffer = await this.loadBuffer('assets/shef/sounds/success.mp3');
  }

  private async loadBuffer(url: string): Promise<AudioBuffer | null> {
    try {
      const res = await fetch(url);
      const ab  = await res.arrayBuffer();
      return await this.audioCtx!.decodeAudioData(ab);
    } catch (e) {
      console.warn('[SortSound] Could not load', url, e);
      return null;
    }
  }

  get enabled(): boolean { return this._enabled; }
  set enabled(v: boolean) { this._enabled = v; }

  resume(): void { this.audioCtx?.resume(); }

  /** Play a short synthesised tone proportional to bar value. */
  playTone(value: number, maxValue: number, duration = 0.08): void {
    if (!this._enabled || !this.audioCtx) return;
    const now = Date.now();
    if (now - this.lastToneTime < this.MIN_INTERVAL) return;
    this.lastToneTime = now;

    const ctx = this.audioCtx;
    const t   = ctx.currentTime;
    const freq = 160 + (value / Math.max(maxValue, 1)) * 1500;

    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + duration + 0.01);
  }

  /** Play the plink sample at a pitch that reflects the bar value. */
  playSwap(value: number, maxValue: number): void {
    if (!this._enabled || !this.audioCtx) return;
    if (this.plinkBuffer) {
      const src  = this.audioCtx.createBufferSource();
      const gain = this.audioCtx.createGain();
      src.buffer = this.plinkBuffer;
      src.playbackRate.value = 0.4 + (value / Math.max(maxValue, 1)) * 2.0;
      gain.gain.value = 0.35;
      src.connect(gain);
      gain.connect(this.audioCtx.destination);
      src.start();
    } else {
      this.playTone(value, maxValue, 0.05);
    }
  }

  /** Play the success chime when sorting completes. */
  playSuccess(): void {
    if (!this._enabled || !this.audioCtx) return;
    if (this.successBuffer) {
      const src  = this.audioCtx.createBufferSource();
      const gain = this.audioCtx.createGain();
      src.buffer = this.successBuffer;
      gain.gain.value = 0.5;
      src.connect(gain);
      gain.connect(this.audioCtx.destination);
      src.start();
    }
  }
}

