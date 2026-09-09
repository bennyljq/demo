import { Injectable, signal } from '@angular/core';

/**
 * Deterministic Mulberry32 Pseudo-Random Number Generator.
 * Converted from a 10-character alphanumeric seed string with 32-bit avalanche hashing.
 * Pull order mandated: Node Generation -> Enemy Spawning -> Artifact Rewards.
 */
@Injectable({
  providedIn: 'root',
})
export class PrngService {
  private initialSeedString = 'MERLIN2026';
  public readonly seed = signal<string>(this.initialSeedString);
  private state = 0;

  constructor() {
    this.reseed(this.initialSeedString);
  }

  /**
   * Generates a 32-bit hash with high avalanche effect from an alphanumeric string.
   * Utilizes bitwise XOR, shifts, and 32-bit multiplication (Murmur-style avalanche).
   */
  public hashSeed(seedStr: string): number {
    let h = 0x811c9dc5;
    for (let i = 0; i < seedStr.length; i++) {
      h ^= seedStr.charCodeAt(i);
      h = Math.imul(h, 0x01000193);
      h ^= h >>> 16;
      h = Math.imul(h, 0x85ebca6b);
      h ^= h >>> 13;
      h = Math.imul(h, 0xc2b2ae35);
      h ^= h >>> 16;
    }
    return h >>> 0;
  }

  /**
   * Re-initializes the Mulberry32 generator with a new 10-char seed.
   */
  public reseed(seedStr: string): void {
    const cleanSeed = (seedStr || 'MERLIN2026').slice(0, 10).toUpperCase();
    this.initialSeedString = cleanSeed;
    this.seed.set(cleanSeed);
    this.state = this.hashSeed(cleanSeed);
  }

  /**
   * Generates a random 10-character alphanumeric seed string.
   */
  public static generateRandomSeed(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < 10; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Generates the next pseudo-random float in [0, 1) using Mulberry32.
   */
  public nextFloat(): number {
    let t = (this.state += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /**
   * Generates an integer in range [min, max] inclusive.
   */
  public nextInt(min: number, max: number): number {
    return Math.floor(this.nextFloat() * (max - min + 1)) + min;
  }

  /**
   * Picks an element deterministically from an array.
   */
  public choice<T>(array: readonly T[]): T {
    if (!array || array.length === 0) {
      throw new Error('Cannot pick from empty array');
    }
    const index = Math.floor(this.nextFloat() * array.length);
    return array[index];
  }

  /**
   * Shuffles an array deterministically using Fisher-Yates.
   */
  public shuffle<T>(array: T[]): T[] {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(this.nextFloat() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }
}

