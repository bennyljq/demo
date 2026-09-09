import { Injectable } from '@angular/core';
import { GameStateManager, Projectile, ProjectileModifier } from '../state/game.state';
import { PrngService } from '../state/prng.service';
import {
  ALL_DICTIONARY_WORDS,
  SHORT_WORDS,
  STANDARD_WORDS,
  ELITE_WORDS,
  VOWEL_LESS_WORDS,
  SHIELD_GENERATOR_WORDS
} from '../dictionary/dictionary';

@Injectable({
  providedIn: 'root',
})
export class SpawnerService {
  public static readonly PLAYER_ANCHOR_X = 192;
  public static readonly PLAYER_ANCHOR_Y = 540;

  public static readonly SPAWN_MIN_X = 1440;
  public static readonly SPAWN_MAX_X = 1728;
  public static readonly SPAWN_MIN_Y = 108;
  public static readonly SPAWN_MAX_Y = 972;
  public static readonly MIN_EUCLIDEAN_DISTANCE = 120;

  private spawnTimer = 0;
  private idCounter = 0;

  constructor(
    private state: GameStateManager,
    private prng: PrngService
  ) {}

  /**
   * Resets internal timers for a new node.
   */
  public reset(): void {
    this.spawnTimer = 0;
  }

  /**
   * Evaluates logic ticks to spawn projectiles based on node settings.
   */
  public update(deltaTimeSec: number, spawnIntervalSec: number, defaultSpeed = 40, allowedModifiers: readonly ProjectileModifier[] = []): void {
    if (this.state.runPhase() !== 'COMBAT') return;

    // Check if enemy dead
    if (this.state.enemy().currentHp <= 0) return;

    // Boss Phase 3 stops standard spawning
    if (this.state.isBossEncounter() && this.state.enemy().phase === 3) return;

    this.spawnTimer += deltaTimeSec;
    if (this.spawnTimer >= spawnIntervalSec) {
      this.spawnTimer = 0;
      this.spawnProjectile(defaultSpeed, allowedModifiers);
    }
  }

  /**
   * Generates a spatially aware candidate and injects an active projectile adhering to the Initial Letter Rule.
   */
  public spawnProjectile(
    speed = 40,
    allowedModifiers: readonly ProjectileModifier[] = [],
    forcedWord?: string
  ): Projectile | null {
    const activeProjectiles = this.state.activeProjectiles();

    // 1. Spatially aware candidate generation (up to 10 iterations)
    let candidateX = 0;
    let candidateY = 0;
    let validPositionFound = false;

    for (let attempt = 0; attempt < 10; attempt++) {
      candidateX = this.prng.nextInt(SpawnerService.SPAWN_MIN_X, SpawnerService.SPAWN_MAX_X);
      candidateY = this.prng.nextInt(SpawnerService.SPAWN_MIN_Y, SpawnerService.SPAWN_MAX_Y);

      let collision = false;
      for (const p of activeProjectiles) {
        const dx = candidateX - p.x;
        const dy = candidateY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < SpawnerService.MIN_EUCLIDEAN_DISTANCE) {
          collision = true;
          break;
        }
      }

      if (!collision) {
        validPositionFound = true;
        break;
      }
    }

    if (!validPositionFound) {
      // Spatial buffer constraint: defer spawn to next tick
      return null;
    }

    // 2. Initial Letter Rule Constraint
    let chosenWord = forcedWord;
    if (!chosenWord) {
      // Collect forbidden initial letters from active projectiles and affordable spells
      const forbiddenLetters = new Set<string>();

      for (const p of activeProjectiles) {
        if (p.word && p.word.length > 0) {
          forbiddenLetters.add(p.word[0].toUpperCase());
        }
      }

      for (const s of this.state.activeSpells()) {
        if (s.isAffordable && s.word && s.word.length > 0) {
          forbiddenLetters.add(s.word[0].toUpperCase());
        }
      }

      // Filter dictionary
      const currentNode = this.state.currentNodeIndex();
      let pool = ALL_DICTIONARY_WORDS;
      if (currentNode === 5) {
        // High density of short 3-letter words (Node 6, 0-indexed = 5)
        pool = SHORT_WORDS;
      } else if (currentNode >= 9) {
        pool = [...STANDARD_WORDS, ...ELITE_WORDS];
      }

      const availableWords = pool.filter(w => !forbiddenLetters.has(w[0].toUpperCase()));

      if (availableWords.length === 0) {
        // No letter slot available right now, defer
        return null;
      }

      chosenWord = this.prng.choice(availableWords);
    }

    // 3. Assign Modifiers
    const modifiers: ProjectileModifier[] = [];
    if (allowedModifiers.length > 0 && this.prng.nextFloat() < 0.6) {
      const mod = this.prng.choice(allowedModifiers);
      modifiers.push(mod);
    }

    const projectile: Projectile = {
      id: `proj-${++this.idCounter}-${Date.now()}`,
      word: chosenWord.toUpperCase(),
      x: candidateX,
      y: candidateY,
      speed,
      modifiers,
      spawnTime: Date.now(),
    };

    this.state.addProjectile(projectile);
    return projectile;
  }

  /**
   * Spawns two child projectiles for the HYDRA modifier upon mistype.
   */
  public splitHydraProjectile(parent: Projectile): void {
    this.state.removeProjectile(parent.id);

    const activeProjectiles = this.state.activeProjectiles();
    const forbidden = new Set<string>();
    for (const p of activeProjectiles) {
      forbidden.add(p.word[0].toUpperCase());
    }

    const shortCandidates = SHORT_WORDS.filter(w => !forbidden.has(w[0].toUpperCase()));
    if (shortCandidates.length < 2) return;

    const wordA = this.prng.choice(shortCandidates);
    forbidden.add(wordA[0].toUpperCase());
    const remainingCandidates = shortCandidates.filter(w => !forbidden.has(w[0].toUpperCase()));
    const wordB = remainingCandidates.length > 0 ? this.prng.choice(remainingCandidates) : 'RAW';

    const childA: Projectile = {
      id: `hydra-child-${++this.idCounter}-a`,
      word: wordA,
      x: Math.min(SpawnerService.SPAWN_MAX_X, parent.x + 40),
      y: Math.max(SpawnerService.SPAWN_MIN_Y, parent.y - 60),
      speed: parent.speed * 1.15,
      modifiers: [],
    };

    const childB: Projectile = {
      id: `hydra-child-${++this.idCounter}-b`,
      word: wordB,
      x: Math.min(SpawnerService.SPAWN_MAX_X, parent.x + 40),
      y: Math.min(SpawnerService.SPAWN_MAX_Y, parent.y + 60),
      speed: parent.speed * 1.15,
      modifiers: [],
    };

    this.state.addProjectile(childA);
    this.state.addProjectile(childB);
  }

  /**
   * Spawns Boss Phase 2 Aegis Shield Generators along the Y-axis.
   */
  public spawnAegisShieldGenerators(): void {
    const yPositions = [300, 540, 780];
    const xPos = 1400;

    const usedWords = new Set<string>();
    for (let i = 0; i < 3; i++) {
      const candidates = SHIELD_GENERATOR_WORDS.filter(w => !usedWords.has(w));
      const word = candidates.length > 0 ? this.prng.choice(candidates) : `SHLD${i}`;
      usedWords.add(word);

      const generator: Projectile = {
        id: `boss-shield-gen-${i}`,
        word,
        x: xPos,
        y: yPositions[i],
        speed: 0, // Static shield generator
        modifiers: [],
        isShieldGenerator: true,
      };

      this.state.addProjectile(generator);
    }
  }
}

