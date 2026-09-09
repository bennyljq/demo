import type { GameState } from '../state/game.state';

export interface TypingContext {
  wpm: number;
  consecutiveHits: number;
  currentMana: number;
}

export interface WordMetrics {
  word: string;
  length: number;
  scrabbleValue: number;
  containsVowel: boolean;
}

export interface ActiveTarget {
  id: string;
  type: 'PROJECTILE' | 'SPELL';
  fullWord: string;
  typedIndex: number;
  x: number;
  y: number;
}

export interface Artifact {
  id: string;
  name: string;
  description: string;
  rarity: 'COMMON' | 'RARE' | 'LEGENDARY' | 'CURSED';
  
  onKeystrokeValid?: (char: string, context: TypingContext, state: GameState) => void;
  onKeystrokeMistype?: (char: string, target: ActiveTarget, state: GameState) => void;
  onTargetLocked?: (target: ActiveTarget, state: GameState) => void;
  onWordCompleted?: (target: ActiveTarget, metrics: WordMetrics, state: GameState) => void;
  onSpellCast?: (spellId: string, cost: number, state: GameState) => void;
  onDamageTaken?: (incomingDamage: number, state: GameState) => number;
}

