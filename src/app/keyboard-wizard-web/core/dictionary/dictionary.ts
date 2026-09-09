/**
 * Scrabble point distribution as defined by the Merlin Protocol:
 * 1 Point: A, E, I, O, U, L, N, S, T, R
 * 2 Points: D, G
 * 3 Points: B, C, M, P
 * 4 Points: F, H, V, W, Y
 * 5 Points: K
 * 8 Points: J, X
 * 10 Points: Q, Z
 */
export const SCRABBLE_LETTER_VALUES: Readonly<Record<string, number>> = {
  A: 1, E: 1, I: 1, O: 1, U: 1, L: 1, N: 1, S: 1, T: 1, R: 1,
  D: 2, G: 2,
  B: 3, C: 3, M: 3, P: 3,
  F: 4, H: 4, V: 4, W: 4, Y: 4,
  K: 5,
  J: 8, X: 8,
  Q: 10, Z: 10
};

export function getScrabbleValue(word: string, letterOverrides?: Partial<Record<string, number>>): number {
  return word.toUpperCase().split('').reduce((sum, char) => {
    const val = letterOverrides?.[char] ?? SCRABBLE_LETTER_VALUES[char] ?? 1;
    return sum + val;
  }, 0);
}

export function hasVowel(word: string): boolean {
  return /[AEIOU]/i.test(word);
}

/** Vowel-less words explicitly designed for Consonant Blitz synergies */
export const VOWEL_LESS_WORDS: readonly string[] = [
  'CRYPT', 'LYNX', 'RHYTHM', 'GLYPH', 'PSYCH', 'MYTH', 'SPHYNX',
  'NYMPH', 'GYPSY', 'TRYST', 'FLYBY', 'DRYLY', 'SHH', 'TSK', 'BYRL'
];

/** Short 3-letter words for rapid-fire combat (Node 6) */
export const SHORT_WORDS: readonly string[] = [
  'ARC', 'BIT', 'BYTE', 'CPU', 'NET', 'KEY', 'HEX', 'RAM', 'LOG', 'RAW',
  'RUN', 'SYS', 'BUS', 'TAG', 'BUG', 'VOW', 'ZAP', 'FOX', 'ICE', 'VOID',
  'RAD', 'SYN', 'ACK', 'FIN', 'DEV', 'OPS', 'CLI', 'CMD', 'HAL', 'HUB'
];

/** Standard combat words (3-6 letters) */
export const STANDARD_WORDS: readonly string[] = [
  'CIPHER', 'MATRIX', 'BUFFER', 'DAEMON', 'KERNEL', 'SECTOR', 'PACKET',
  'SOCKET', 'PROXY', 'SYNAPSE', 'ROUTER', 'VECTOR', 'BINARY', 'SYNTAX',
  'PORTAL', 'THREAD', 'STREAM', 'MODULE', 'ENGINE', 'PARSER', 'STATIC',
  'MEMORY', 'SIGNAL', 'DRIVER', 'SYSTEM', 'SERVER', 'BEACON', 'FILTER',
  'ACCESS', 'ATTACK', 'DEFEND', 'BRANCH', 'CRACK', 'DECODE', 'ENCODE',
  'SHIELD', 'TARGET', 'UPDATE', 'SWITCH', 'BYPASS', 'TROJAN', 'WORM',
  'EXPLOIT', 'CORRUPT', 'FIREWALL', 'OVERRIDE', 'TERMINAL', 'PROTOCOL'
];

/** Elite and high-tier threat words */
export const ELITE_WORDS: readonly string[] = [
  'CRYPTO', 'QUANTUM', 'OVERCLOCK', 'DECRYPT', 'INTRUSION', 'ALGORITHM',
  'MAINFRAME', 'EXECUTION', 'HYDRAULIC', 'ANOMALY', 'CORRUPTION', 'SHADOW'
];

/** High-Scrabble Shield Generator words for Boss Phase 2 */
export const SHIELD_GENERATOR_WORDS: readonly string[] = [
  'MAXIM', 'JAZZY', 'VOXES', 'QUIRK', 'ZEBRA', 'KUDOS', 'PIXEL', 'WHISK', 'FIZZY', 'QUALM'
];

/** Three-word sequence for boss initiation */
export const BOSS_INITIATION_SEQUENCE: readonly string[] = [
  'INITIATE', 'AEGIS', 'OVERRIDE'
];

/** 12-letter sequence for Final Boss Core Meltdown Wall */
export const BOSS_CORE_MELTDOWN_WORDS: readonly string[] = [
  'KINETICAEGIS', 'CRYPTOMANCER', 'PERFECTIONST', 'OVERRIDECORE'
];

/** Spell crafting dictionary (valid 3 to 5 letter words) */
export const CRAFTABLE_SPELL_WORDS: readonly string[] = [
  'BOLT', 'FIRE', 'NOVA', 'ICE', 'VOID', 'HEAL', 'DART', 'BEAM', 'GALE',
  'SPARK', 'FLASH', 'SHOCK', 'BURST', 'STORM', 'BLAST', 'PULSE', 'SURGE',
  'CHAOS', 'LIGHT', 'FORCE', 'FROST', 'EMBER', 'PRISM', 'RAZOR', 'FLAME',
  'SOLAR', 'LUNAR', 'DRAIN', 'SHRED', 'SMITE', 'FLARE', 'TITAN', 'METEOR',
  'WAVE', 'RUNE', 'AURA', 'WARP', 'FURY', 'HAIL', 'BANE', 'DOOM', 'WARD'
];

/** Complete dictionary combining words for spawner filtering */
export const ALL_DICTIONARY_WORDS: readonly string[] = Array.from(new Set([
  ...SHORT_WORDS,
  ...STANDARD_WORDS,
  ...ELITE_WORDS,
  ...VOWEL_LESS_WORDS,
  ...CRAFTABLE_SPELL_WORDS
]));

