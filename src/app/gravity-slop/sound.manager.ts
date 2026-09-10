// ─────────────────────────────────────────────────────────────────────────────
// sound.manager.ts
//
// Lightweight Web Audio API–based sound manager.
// Uses HTMLAudioElement pools for low-latency polyphonic playback
// (avoids the one-instance limitation of a single Audio object).
//
// Sound mapping for Gravity Slop:
//   'explosion' → explosion.mp3  (large collision / sun absorption)
//   'crack'     → drip.mp3       (debris-on-debris small impact)
//   'laser'     → laser.ogg      (planet throw)
//   'combo'     → success.mp3    (combo ×3+)
//   'save'      → kaching.mp3    (score saved to leaderboard)
//   'click'     → button-click.mp3 (UI button)
//   'shop'      → shop.mp3       (leaderboard open)
// ─────────────────────────────────────────────────────────────────────────────

export type SoundKey = 'explosion' | 'crack' | 'laser' | 'combo' | 'save' | 'click' | 'shop';

const ASSET_BASE = '/assets/shef/sounds/';

const SOUND_MAP: Record<SoundKey, { file: string; poolSize: number; volume: number }> = {
  explosion: { file: 'explosion.mp3', poolSize: 4,  volume: 0.7 },
  crack:     { file: 'drip.mp3',      poolSize: 6,  volume: 0.35 },
  laser:     { file: 'laser.ogg',     poolSize: 3,  volume: 0.5 },
  combo:     { file: 'success.mp3',   poolSize: 2,  volume: 0.6 },
  save:      { file: 'kaching.mp3',   poolSize: 1,  volume: 0.65 },
  click:     { file: 'button-click.mp3', poolSize: 2, volume: 0.5 },
  shop:      { file: 'shop.mp3',      poolSize: 1,  volume: 0.55 },
};

interface Pool {
  elements: HTMLAudioElement[];
  next: number;
}

export class SoundManager {
  private pools   = new Map<SoundKey, Pool>();
  private muted   = false;
  private volume  = 1.0;
  private loaded  = false;

  /**
   * Pre-load all sounds via an HTMLAudioElement per pool slot.
   * Call once from ngAfterViewInit on first user interaction (autoplay policy).
   */
  init(): void {
    if (this.loaded) return;
    this.loaded = true;

    for (const [key, cfg] of Object.entries(SOUND_MAP) as [SoundKey, typeof SOUND_MAP[SoundKey]][]) {
      const pool: Pool = { elements: [], next: 0 };
      for (let i = 0; i < cfg.poolSize; i++) {
        const audio = new Audio(ASSET_BASE + cfg.file);
        audio.volume  = cfg.volume * this.volume;
        audio.preload = 'auto';
        pool.elements.push(audio);
      }
      this.pools.set(key, pool);
    }
  }

  /**
   * Play a sound with an optional pitch-shift (playbackRate).
   * Picks the next idle slot from the pool (round-robin).
   */
  play(key: SoundKey, pitchVariance = 0): void {
    if (this.muted) return;
    const pool = this.pools.get(key);
    if (!pool) return;
    const el = pool.elements[pool.next % pool.elements.length];
    pool.next++;
    try {
      el.currentTime = 0;
      if (pitchVariance > 0) {
        el.playbackRate = 1 + (Math.random() - 0.5) * pitchVariance;
      }
      el.play().catch(() => { /* autoplay blocked — silently ignore */ });
    } catch (_) { /* ignore any playback errors */ }
  }

  /** Toggle mute on/off. Returns the new muted state. */
  toggleMute(): boolean {
    this.muted = !this.muted;
    return this.muted;
  }

  get isMuted(): boolean { return this.muted; }

  /** Set global volume 0-1. Applies to all future plays. */
  setVolume(v: number): void {
    this.volume = Math.max(0, Math.min(1, v));
    for (const [key, pool] of this.pools) {
      const cfg = SOUND_MAP[key];
      for (const el of pool.elements) {
        el.volume = cfg.volume * this.volume;
      }
    }
  }
}

