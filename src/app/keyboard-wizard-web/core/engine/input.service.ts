import { Injectable } from '@angular/core';
import { GameStateManager, Projectile, SpellInstance, Particle } from '../state/game.state';
import { Trie } from '../state/trie';
import { AudioService } from '../audio/audio.service';
import { SpawnerService } from './spawner.service';
import { getScrabbleValue, hasVowel } from '../dictionary/dictionary';
import type { ActiveTarget, TypingContext, WordMetrics } from '../artifacts/artifact.interface';

@Injectable({
  providedIn: 'root',
})
export class InputService {
  private trie = new Trie();
  private isListening = false;

  constructor(
    private state: GameStateManager,
    private audio: AudioService,
    private spawner: SpawnerService
  ) {}

  public initGlobalListener(): void {
    if (this.isListening || typeof window === 'undefined') return;
    this.isListening = true;
    window.addEventListener('keydown', this.handleKeyDown);
  }

  public destroyGlobalListener(): void {
    if (!this.isListening || typeof window === 'undefined') return;
    this.isListening = false;
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  /**
   * Rebuilds the Trie prefix tree with all active projectiles, affordable spells,
   * boss initiation sequences, and meltdown walls.
   */
  public rebuildTrie(): void {
    this.trie.clear();

    // 1. Boss Meltdown Wall takes highest priority
    const wall = this.state.bossMeltdownWall();
    if (wall) {
      this.trie.insert(wall.fullWord, {
        id: 'meltdown-wall',
        type: 'PROJECTILE',
        fullWord: wall.fullWord,
        typedIndex: wall.typedIndex,
        x: wall.x,
        y: 540,
      });
      return;
    }

    // 2. Boss Initiation Sequence
    if (this.state.isBossEncounter() && this.state.bossInitiationWords().length > 0) {
      const idx = this.state.bossInitiationIndex();
      const words = this.state.bossInitiationWords();
      if (idx < words.length) {
        const word = words[idx];
        this.trie.insert(word, {
          id: `boss-initiation-${idx}`,
          type: 'PROJECTILE',
          fullWord: word,
          typedIndex: 0,
          x: 960,
          y: 540,
        });
      }
      return;
    }

    // 3. Active Projectiles
    const projectiles = this.state.activeProjectiles();
    for (const p of projectiles) {
      this.trie.insert(p.word, {
        id: p.id,
        type: 'PROJECTILE',
        fullWord: p.word,
        typedIndex: 0,
        x: p.x,
        y: p.y,
      });
    }

    // 4. Affordable Spells
    const spells = this.state.activeSpells();
    for (const s of spells) {
      if (s.isAffordable) {
        this.trie.insert(s.word, {
          id: s.id,
          type: 'SPELL',
          fullWord: s.word,
          typedIndex: 0,
          x: 192,
          y: 216,
        });
      }
    }
  }

  private handleKeyDown = (e: KeyboardEvent): void => {
    // Only capture during COMBAT phase
    if (this.state.runPhase() !== 'COMBAT') return;

    // Ignore modifier keys alone
    if (e.metaKey || e.ctrlKey || e.altKey) return;

    // 1. Escape key: Aborts lock-on and drops typing buffer
    if (e.key === 'Escape') {
      e.preventDefault();
      this.abortLockOn();
      return;
    }

    // Capture single A-Z keys
    if (/^[a-zA-Z]$/.test(e.key)) {
      e.preventDefault();
      this.processCharInput(e.key.toUpperCase());
    }
  };

  public abortLockOn(): void {
    const currentTarget = this.state.lockedTarget();
    if (currentTarget) {
      this.state.setLockedTarget(null);
      this.audio.playFileSound('button-click');
    }
  }

  private processCharInput(char: string): void {
    this.state.totalKeystrokes.update(k => k + 1);
    let target = this.state.lockedTarget();

    // IDLE STATE: No target locked yet
    if (!target) {
      this.rebuildTrie();
      const matched = this.trie.findByFirstChar(char);
      if (!matched) {
        // First-letter miss in idle state - no lock established
        return;
      }

      // Lock onto target
      target = { ...matched, typedIndex: 0 };
      this.state.setLockedTarget(target);
      this.audio.playTargetLock();

      // Trigger onTargetLocked hook
      for (const art of this.state.artifacts()) {
        art.onTargetLocked?.(target, this.state.getSnapshot());
      }
    }

    // LOCKED TARGET STATE: Process keystroke against expected character
    const expectedChar = target.fullWord[target.typedIndex];

    if (char === expectedChar) {
      // VALID KEYSTROKE
      this.onValidKeystroke(char, target);
    } else {
      // MISTYPE TRAP
      this.onMistype(char, target);
    }
  }

  private onValidKeystroke(char: string, target: ActiveTarget): void {
    this.state.validKeystrokes.update(k => k + 1);

    // 1. Kinetic Laser Beam from Player (192, 540) to Target dynamic coordinates
    const targetCoords = this.getCurrentTargetCoords(target);
    this.spawnLaserBeam(192, 540, targetCoords.x, targetCoords.y);
    this.audio.playLaserChirp();

    // 2. Advance Narrative Decryption Terminal
    this.state.stepDecryption();

    // 3. Artifact onKeystrokeValid Hook Lifecycle
    const typingContext: TypingContext = {
      wpm: this.state.wpm(),
      consecutiveHits: this.state.validKeystrokes(),
      currentMana: this.state.player().currentMana,
    };

    const hasVowelVow = this.state.artifacts().some(a => a.id === 'vowel-vow');
    if (hasVowelVow && ['A', 'E', 'I', 'O', 'U'].includes(char)) {
      this.state.addShield(1);
    }

    const hasZIndex = this.state.artifacts().some(a => a.id === 'the-z-index');
    const isZExecution = hasZIndex && char === 'Z';

    for (const art of this.state.artifacts()) {
      art.onKeystrokeValid?.(char, typingContext, this.state.getSnapshot());
    }

    // Check Z-Index execution bypass
    if (isZExecution) {
      // Immediately execute target, deal 10% enemy max HP as true damage
      const trueDamage = Math.round(this.state.enemy().maxHp * 0.1);
      this.state.damageEnemy(trueDamage);
      this.completeTarget(target);
      return;
    }

    // 4. Increment typedIndex
    const nextIndex = target.typedIndex + 1;
    target.typedIndex = nextIndex;
    this.state.setLockedTarget({ ...target });

    // 5. Check if word is fully typed
    if (nextIndex >= target.fullWord.length) {
      this.completeTarget(target);
    }
  }

  private onMistype(char: string, target: ActiveTarget): void {
    // Check Kinetic Plating forgiveness charges
    const currentCharges = this.state.player().kineticPlatingCharges;
    if (currentCharges > 0) {
      this.state.updatePlayer(p => ({ ...p, kineticPlatingCharges: p.kineticPlatingCharges - 1 }));
      this.audio.playFileSound('drip');
      return; // Mistype absorbed, trap suppressed!
    }

    // Execute Mistype Penalty Sequence
    this.audio.playMistypeBuzzer();
    this.state.triggerScreenShake(250);
    this.state.triggerMistypeFlash();

    // Fire onKeystrokeMistype across artifacts
    for (const art of this.state.artifacts()) {
      art.onKeystrokeMistype?.(char, target, this.state.getSnapshot());
    }

    // Check Projectile Modifiers
    if (target.type === 'PROJECTILE') {
      const activeProjectiles = this.state.activeProjectiles();
      const proj = activeProjectiles.find(p => p.id === target.id);
      if (proj) {
        if (proj.modifiers.includes('EVIL')) {
          this.state.damagePlayer(8);
        }
        if (proj.modifiers.includes('HYDRA')) {
          this.spawner.splitHydraProjectile(proj);
          this.state.setLockedTarget(null); // Hydra split breaks current lock
          return;
        }
      }
    }

    // CRUCIAL: Lock-on is NOT cleared. Player is trapped.
  }

  private completeTarget(target: ActiveTarget): void {
    const coords = this.getCurrentTargetCoords(target);

    // 1. Mana reward (+5 Mana baseline)
    this.state.addMana(5);

    // 2. Particle burst at target coordinates
    this.spawnParticleExplosion(coords.x, coords.y, target.type === 'SPELL' ? '#B026FF' : '#00FFCC');

    // 3. Calculate metrics
    const scrabbleVal = getScrabbleValue(target.fullWord, this.state.letterOverrides());
    const metrics: WordMetrics = {
      word: target.fullWord,
      length: target.fullWord.length,
      scrabbleValue: scrabbleVal,
      containsVowel: hasVowel(target.fullWord),
    };

    // Scrabble XP reward
    this.state.addScrabbleXp(scrabbleVal);

    // 4. Fire onWordCompleted across artifacts
    for (const art of this.state.artifacts()) {
      art.onWordCompleted?.(target, metrics, this.state.getSnapshot());
    }

    // Consonant Blitz EMP check
    const hasConsonantBlitz = this.state.artifacts().some(a => a.id === 'consonant-blitz');
    if (hasConsonantBlitz && !metrics.containsVowel) {
      this.triggerEmpPulse();
    }

    // 5. Route resolution by target type
    if (target.type === 'SPELL') {
      this.resolveSpellCast(target);
    } else {
      this.resolveProjectileDefeat(target);
    }

    // Clear lock-on
    this.state.setLockedTarget(null);
  }

  private resolveSpellCast(target: ActiveTarget): void {
    const spell = this.state.activeSpells().find(s => s.id === target.id);
    if (!spell) return;

    // Deduct mana
    this.state.spendMana(spell.manaCost);

    // Calculate base damage
    let damage = spell.baseDamage * this.state.globalModifiers().damageMultiplier;

    // Astral Multiplier check: 400% if projectile within 200px of player anchor (X < 392)
    const hasAstral = this.state.artifacts().some(a => a.id === 'astral-multiplier');
    if (hasAstral) {
      const dangerClose = this.state.activeProjectiles().some(p => p.x < 392);
      if (dangerClose) {
        damage *= 4.0;
      }
    }

    // Fire onSpellCast across artifacts
    for (const art of this.state.artifacts()) {
      art.onSpellCast?.(spell.id, spell.manaCost, this.state.getSnapshot());
    }

    // Apply damage to enemy
    this.state.damageEnemy(Math.round(damage));
    this.audio.playFileSound('success');
  }

  private resolveProjectileDefeat(target: ActiveTarget): void {
    // 1. Boss Meltdown Wall
    if (target.id === 'meltdown-wall') {
      this.state.bossMeltdownWall.set(null);
      this.state.damageEnemy(9999); // Instant defeat!
      this.audio.playFileSound('success');
      return;
    }

    // 2. Boss Initiation sequence
    if (target.id.startsWith('boss-initiation-')) {
      const nextIdx = this.state.bossInitiationIndex() + 1;
      this.state.bossInitiationIndex.set(nextIdx);
      if (nextIdx >= this.state.bossInitiationWords().length) {
        // Boss initiates!
        this.audio.playFileSound('success');
      }
      return;
    }

    // 3. Standard projectile / shield generator
    const activeProjectiles = this.state.activeProjectiles();
    const proj = activeProjectiles.find(p => p.id === target.id);
    if (proj?.isShieldGenerator) {
      this.state.removeProjectile(target.id);
      // Check if all shield generators destroyed
      const remainingGenerators = this.state.activeProjectiles().filter(p => p.isShieldGenerator && p.id !== target.id);
      if (remainingGenerators.length === 0) {
        this.state.updateEnemy(e => ({ ...e, isInvulnerable: false }));
        this.audio.playFileSound('kaching');
      }
      return;
    }

    // Regular projectile defeat
    this.state.removeProjectile(target.id);
    this.audio.playFileSound('kaching');
  }

  private triggerEmpPulse(): void {
    this.audio.playEmpBlast();
    this.state.triggerScreenShake(350);
    // Deal 50 damage to all active projectiles
    const active = this.state.activeProjectiles();
    for (const p of active) {
      this.spawnParticleExplosion(p.x, p.y, '#00FFCC');
    }
    this.state.setProjectiles([]);
    if (this.state.lockedTarget()?.type === 'PROJECTILE') {
      this.state.setLockedTarget(null);
    }
  }

  private getCurrentTargetCoords(target: ActiveTarget): { x: number; y: number } {
    if (target.type === 'PROJECTILE') {
      if (target.id === 'meltdown-wall') {
        return { x: this.state.bossMeltdownWall()?.x ?? 960, y: 540 };
      }
      const p = this.state.activeProjectiles().find(item => item.id === target.id);
      if (p) return { x: p.x, y: p.y };
    }
    return { x: target.x, y: target.y };
  }

  private spawnLaserBeam(startX: number, startY: number, endX: number, endY: number): void {
    const laser = {
      id: `laser-${Date.now()}-${Math.random()}`,
      startX,
      startY,
      endX,
      endY,
      opacity: 1.0,
      createdAt: Date.now(),
    };
    this.state.addLaser(laser);
  }

  private spawnParticleExplosion(x: number, y: number, color: string): void {
    const count = 16;
    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5);
      const speed = 80 + Math.random() * 140;
      newParticles.push({
        id: `particle-${Date.now()}-${i}`,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        radius: 2 + Math.random() * 3,
        opacity: 1.0,
      });
    }
    this.state.addParticles(newParticles);
  }
}

