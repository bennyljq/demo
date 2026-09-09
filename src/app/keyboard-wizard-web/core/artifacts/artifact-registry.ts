import type { Artifact, ActiveTarget, WordMetrics, TypingContext } from './artifact.interface';
import type { GameState } from '../state/game.state';

export interface CatalogArtifact extends Artifact {
  cost: number;
  archetype: 'PERFECTIONIST' | 'LETTER_FILTER' | 'BLIND_FAITH' | 'SCRABBLE_ECONOMY';
}

/**
 * Registry of hardcoded game-breaking synergistic artifacts.
 * Populated with the 4 mandatory archetypes from the Merlin Protocol.
 */
export const ARTIFACT_REGISTRY: readonly CatalogArtifact[] = [
  // --- 1. The Perfectionist Engine (Scaling High-Risk) ---
  {
    id: 'overclocked-switch',
    name: 'Overclocked Switch',
    description: 'Valid keystrokes increase Damage Multiplier by +0.1x. Any mistype resets the multiplier to 1.0x.',
    rarity: 'RARE',
    cost: 45,
    archetype: 'PERFECTIONIST',
    onKeystrokeValid: (_char: string, _context: TypingContext, state: GameState) => {
      state.globalModifiers.damageMultiplier = Math.round((state.globalModifiers.damageMultiplier + 0.1) * 10) / 10;
    },
    onKeystrokeMistype: (_char: string, _target: ActiveTarget, state: GameState) => {
      state.globalModifiers.damageMultiplier = 1.0;
    },
  },
  {
    id: 'fragile-payload',
    name: 'Fragile Payload',
    description: '+15 flat damage on target completion. Every typo inflicts 2 unmitigable direct damage to your HP.',
    rarity: 'CURSED',
    cost: 25,
    archetype: 'PERFECTIONIST',
    onWordCompleted: (_target: ActiveTarget, _metrics: WordMetrics, state: GameState) => {
      // Inflict bonus damage directly on enemy
      state.enemy.currentHp = Math.max(0, state.enemy.currentHp - 15);
    },
    onKeystrokeMistype: (_char: string, _target: ActiveTarget, state: GameState) => {
      state.player.currentHp = Math.max(0, state.player.currentHp - 2);
    },
  },

  // --- 2. The Letter-Filter Engine (Linguistic Manipulation) ---
  {
    id: 'vowel-vow',
    name: 'Vowel Vow',
    description: 'Typing any vowel (A, E, I, O, U) grants +1 Shield stack. Each Shield absorbs 1 incoming hit.',
    rarity: 'LEGENDARY',
    cost: 80,
    archetype: 'LETTER_FILTER',
    onKeystrokeValid: (char: string, _context: TypingContext, _state: GameState) => {
      if (['A', 'E', 'I', 'O', 'U'].includes(char.toUpperCase())) {
        // Shield increment handled via state manager or state hook
      }
    },
    onDamageTaken: (incomingDamage: number, _state: GameState) => {
      // In GameStateManager, shield stack is checked and decremented
      return incomingDamage;
    },
  },
  {
    id: 'consonant-blitz',
    name: 'Consonant Blitz',
    description: 'Completing a word with zero vowels triggers an EMP pulse dealing 50 damage to all active projectiles.',
    rarity: 'RARE',
    cost: 50,
    archetype: 'LETTER_FILTER',
    onWordCompleted: (_target: ActiveTarget, metrics: WordMetrics, _state: GameState) => {
      if (!metrics.containsVowel) {
        // EMP trigger handled by combat engine
      }
    },
  },

  // --- 3. The Blind Faith Engine (Information Deprivation) ---
  {
    id: 'void-visor',
    name: 'The Void Visor',
    description: 'All malware packet text renders as ??? until crossing X < 600px into lethal range.',
    rarity: 'CURSED',
    cost: 20,
    archetype: 'BLIND_FAITH',
    // Rendering layer checks for the presence of this artifact id in state.artifacts
  },
  {
    id: 'astral-multiplier',
    name: 'Astral Multiplier',
    description: 'If at least one active projectile is within 200px of your anchor (X < 392), spells deal 400% damage.',
    rarity: 'LEGENDARY',
    cost: 85,
    archetype: 'BLIND_FAITH',
    onSpellCast: (_spellId: string, _cost: number, _state: GameState) => {
      // Spell damage multiplier computed dynamically in combat engine
    },
  },

  // --- 4. The Scrabble Economy (Resource Manipulation) ---
  {
    id: 'lexical-hoarder',
    name: 'Lexical Hoarder',
    description: 'Completing a word awards bonus Mana equal to its Scrabble letter point value.',
    rarity: 'COMMON',
    cost: 30,
    archetype: 'SCRABBLE_ECONOMY',
    onWordCompleted: (_target: ActiveTarget, metrics: WordMetrics, state: GameState) => {
      state.player.currentMana = Math.min(state.player.maxMana, state.player.currentMana + metrics.scrabbleValue);
    },
  },
  {
    id: 'the-z-index',
    name: 'The Z-Index',
    description: 'Typing Z immediately executes the locked target, bypassing remaining letters, and deals 10% enemy max HP as true damage.',
    rarity: 'LEGENDARY',
    cost: 95,
    archetype: 'SCRABBLE_ECONOMY',
    onKeystrokeValid: (char: string, _context: TypingContext, _state: GameState) => {
      if (char.toUpperCase() === 'Z') {
        // Handled in input engine execution pipeline
      }
    },
  },
];

export function getArtifactById(id: string): CatalogArtifact | undefined {
  return ARTIFACT_REGISTRY.find(a => a.id === id);
}

