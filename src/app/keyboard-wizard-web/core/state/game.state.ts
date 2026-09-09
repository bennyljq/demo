import { Injectable, computed, signal } from '@angular/core';
import type { ActiveTarget, Artifact } from '../artifacts/artifact.interface';

export type ProjectileModifier = 'HYDRA' | 'EVIL' | 'OMINOUS' | 'MOTHERSHIP';

export interface PlayerState {
  maxHp: number;
  currentHp: number;
  maxMana: number;
  currentMana: number;
  gold: number;
  kineticPlatingCharges: number;
}

export interface EnemyState {
  id: string;
  name: string;
  maxHp: number;
  currentHp: number;
  phase: number;
  isInvulnerable?: boolean;
}

export interface Projectile {
  id: string;
  word: string;
  x: number;
  y: number;
  speed: number;
  modifiers: ProjectileModifier[];
  isShieldGenerator?: boolean;
  spawnTime?: number;
}

export interface SpellInstance {
  id: string;
  word: string;
  baseDamage: number;
  manaCost: number;
  isAffordable: boolean;
}

export interface GameState {
  player: PlayerState;
  enemy: EnemyState;
  activeProjectiles: Projectile[];
  activeSpells: SpellInstance[];
  lockedTarget: ActiveTarget | null;
  artifacts: Artifact[];
  globalModifiers: {
    damageMultiplier: number;
    projectileSpeedFactor: number;
  };
}

export interface LaserBeam {
  id: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  opacity: number;
  createdAt: number;
}

export interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  radius: number;
  opacity: number;
}

export interface BossMeltdownWall {
  x: number;
  fullWord: string;
  typedIndex: number;
  speed: number;
}

export type RunPhase = 'MAP' | 'COMBAT' | 'SHOP' | 'CRAFTING' | 'EVENT' | 'REST' | 'GAME_OVER' | 'VICTORY';

export interface MapNode {
  index: number;
  type: 'NORMAL_COMBAT' | 'EVENT_SHOP' | 'ELITE' | 'EVENT_LORE' | 'HARD_COMBAT' | 'FINAL_SHOP' | 'REST' | 'FINAL_BOSS';
  title: string;
  description: string;
  enemyHp: number;
  enemyName: string;
  modifiers: ProjectileModifier[];
  completed: boolean;
  active: boolean;
  branchChoice?: 'LEFT' | 'RIGHT' | 'SINGLE';
}

@Injectable({
  providedIn: 'root',
})
export class GameStateManager {
  // --- Central Game State Signals ---
  public readonly player = signal<PlayerState>({
    maxHp: 100,
    currentHp: 100,
    maxMana: 100,
    currentMana: 50,
    gold: 50,
    kineticPlatingCharges: 2,
  });

  public readonly enemy = signal<EnemyState>({
    id: 'countermeasure-1',
    name: 'INTRUSION COUNTERMEASURE v1.0',
    maxHp: 100,
    currentHp: 100,
    phase: 1,
    isInvulnerable: false,
  });

  public readonly activeProjectiles = signal<Projectile[]>([]);
  public readonly activeSpells = signal<SpellInstance[]>([]);
  public readonly lockedTarget = signal<ActiveTarget | null>(null);
  public readonly artifacts = signal<Artifact[]>([]);
  public readonly globalModifiers = signal<{
    damageMultiplier: number;
    projectileSpeedFactor: number;
  }>({
    damageMultiplier: 1.0,
    projectileSpeedFactor: 1.0,
  });

  // --- Synergies & Meta-Economy Signals ---
  public readonly shieldStacks = signal<number>(0);
  public readonly scrabbleXp = signal<number>(0);
  public readonly letterOverrides = signal<Record<string, number>>({});
  public readonly kineticPlatingMax = signal<number>(2);

  // --- Visuals & VFX Signals ---
  public readonly lasers = signal<LaserBeam[]>([]);
  public readonly particles = signal<Particle[]>([]);
  public readonly screenShake = signal<boolean>(false);
  public readonly targetMistypeFlash = signal<boolean>(false);

  // --- Boss Mechanics Signals ---
  public readonly isBossEncounter = signal<boolean>(false);
  public readonly bossInitiationWords = signal<string[]>([]);
  public readonly bossInitiationIndex = signal<number>(0);
  public readonly bossMeltdownWall = signal<BossMeltdownWall | null>(null);

  // --- Narrative Environmental Lore Terminal ---
  private readonly fullLoreText = 
    "MERLIN PROTOCOL SEC_LOG 0x7F: CRYPTOMANCER KERNEL INITIALIZED. CLASSICAL SPELLCASTING CONVERTED TO CRYPTOGRAPHIC HASH INVERSION. ANOMALOUS ARCHITECT COUNTERMEASURES DETECTED IN DEEP MEMORY CHANNELS. MAINTAIN HIGHEST APM FOR INTEGRITY.";
  public readonly decryptedCharsCount = signal<number>(0);

  public readonly loreLog = computed(() => {
    const total = this.fullLoreText.length;
    const revealed = Math.min(this.decryptedCharsCount(), total);
    const chars = this.fullLoreText.split('');
    const glyphs = '$%#*!@&?~^/|\\01XZQ';
    
    return chars.map((char, index) => {
      if (index < revealed) {
        return { char, decrypted: true };
      }
      // Pseudo-random glitch glyph based on index and seed
      const g = glyphs[(index * 7 + 13) % glyphs.length];
      return { char: g, decrypted: false };
    });
  });

  // --- Run Structure & Navigation ---
  public readonly runPhase = signal<RunPhase>('COMBAT');
  public readonly currentNodeIndex = signal<number>(0);

  // --- Performance & Typing Metrics ---
  public readonly totalKeystrokes = signal<number>(0);
  public readonly validKeystrokes = signal<number>(0);
  public readonly runStartTime = signal<number>(Date.now());

  public readonly wpm = computed(() => {
    const elapsedMinutes = Math.max(0.1, (Date.now() - this.runStartTime()) / 60000);
    const words = this.validKeystrokes() / 5;
    return Math.round(words / elapsedMinutes);
  });

  /**
   * Returns a snapshot conforming to the exact GameState interface for artifact hooks.
   */
  public getSnapshot(): GameState {
    return {
      player: this.player(),
      enemy: this.enemy(),
      activeProjectiles: this.activeProjectiles(),
      activeSpells: this.activeSpells(),
      lockedTarget: this.lockedTarget(),
      artifacts: this.artifacts(),
      globalModifiers: this.globalModifiers(),
    };
  }

  // --- State Mutators ---

  public updatePlayer(updater: (prev: PlayerState) => PlayerState): void {
    this.player.update(updater);
  }

  public updateEnemy(updater: (prev: EnemyState) => EnemyState): void {
    this.enemy.update(updater);
  }

  public setProjectiles(projectiles: Projectile[]): void {
    this.activeProjectiles.set(projectiles);
  }

  public addProjectile(projectile: Projectile): void {
    this.activeProjectiles.update(list => [...list, projectile]);
  }

  public removeProjectile(id: string): void {
    this.activeProjectiles.update(list => list.filter(p => p.id !== id));
  }

  public setSpells(spells: SpellInstance[]): void {
    this.activeSpells.set(spells);
  }

  public addSpell(spell: SpellInstance): void {
    this.activeSpells.update(list => [...list, spell]);
  }

  public setLockedTarget(target: ActiveTarget | null): void {
    this.lockedTarget.set(target);
  }

  public addArtifact(artifact: Artifact): void {
    this.artifacts.update(list => [...list, artifact]);
  }

  public setDamageMultiplier(val: number): void {
    this.globalModifiers.update(m => ({ ...m, damageMultiplier: Math.max(0.1, val) }));
  }

  public addDamageMultiplier(delta: number): void {
    this.globalModifiers.update(m => ({ ...m, damageMultiplier: Math.max(0.1, m.damageMultiplier + delta) }));
  }

  public triggerScreenShake(durationMs = 250): void {
    this.screenShake.set(true);
    setTimeout(() => this.screenShake.set(false), durationMs);
  }

  public triggerMistypeFlash(): void {
    this.targetMistypeFlash.set(true);
    setTimeout(() => this.targetMistypeFlash.set(false), 200);
  }

  public addLaser(laser: LaserBeam): void {
    this.lasers.update(l => [...l, laser]);
  }

  public removeLaser(id: string): void {
    this.lasers.update(l => l.filter(item => item.id !== id));
  }

  public addParticles(newParticles: Particle[]): void {
    this.particles.update(p => [...p, ...newParticles]);
  }

  public stepDecryption(): void {
    this.decryptedCharsCount.update(c => Math.min(this.fullLoreText.length, c + 1));
  }

  public healPlayer(amount: number): void {
    this.player.update(p => ({
      ...p,
      currentHp: Math.min(p.maxHp, p.currentHp + amount)
    }));
  }

  public addMana(amount: number): void {
    this.player.update(p => ({
      ...p,
      currentMana: Math.min(p.maxMana, p.currentMana + amount)
    }));
  }

  public spendMana(amount: number): boolean {
    if (this.player().currentMana >= amount) {
      this.player.update(p => ({ ...p, currentMana: p.currentMana - amount }));
      return true;
    }
    return false;
  }

  public addShield(amount = 1): void {
    this.shieldStacks.update(s => s + amount);
  }

  public consumeShield(): boolean {
    if (this.shieldStacks() > 0) {
      this.shieldStacks.update(s => s - 1);
      return true;
    }
    return false;
  }

  public addScrabbleXp(amount: number): void {
    this.scrabbleXp.update(xp => xp + amount);
  }

  public damageEnemy(amount: number): void {
    if (this.enemy().isInvulnerable) {
      return;
    }
    this.enemy.update(e => {
      const newHp = Math.max(0, e.currentHp - amount);
      return { ...e, currentHp: newHp };
    });
  }

  public damagePlayer(rawDamage: number): void {
    // Artifact onDamageTaken pipeline
    let finalDamage = rawDamage;
    for (const art of this.artifacts()) {
      if (art.onDamageTaken) {
        finalDamage = art.onDamageTaken(finalDamage, this.getSnapshot());
      }
    }

    if (finalDamage <= 0) return;

    this.player.update(p => {
      const newHp = Math.max(0, p.currentHp - finalDamage);
      return { ...p, currentHp: newHp };
    });
    this.triggerScreenShake(300);
  }
}

