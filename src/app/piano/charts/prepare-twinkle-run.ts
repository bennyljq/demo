import type { ImportedScore } from '../music/musicxml-import';
import { buildXmlTypingChart, TypingTarget } from '../gameplay/piano-chart';
import { CoupledTarget, coupleStaffMelody } from '../gameplay/twinkle-coupling';
import { TWINKLE_THEME_CHART } from './twinkle-theme-chart';
import { TWINKLE_VARIATION_01_CHART } from './twinkle-variation-01-chart';
import { randomizeTwinkleWords, seededWordRandom } from './twinkle-word-randomizer';

export interface PreparedTwinkleRun {
  readonly targets: readonly TypingTarget[];
  readonly coupling: readonly CoupledTarget[];
  readonly words: readonly string[];
}

/** Compile before publication so invalid cross-phrase held-key conflicts never reach Ready. */
export function prepareTwinkleRun(score: ImportedScore, previousWords: readonly string[], seed: number,
  songId = 'twinkle-theme'): PreparedTwinkleRun {
  const template = songId === 'twinkle-variation-01' ? TWINKLE_VARIATION_01_CHART : TWINKLE_THEME_CHART;
  let lastError: unknown;
  for (let attempt = 0; attempt < 64; attempt++) {
    const phrases = randomizeTwinkleWords(template, seededWordRandom(seed + attempt));
    const words = phrases.map(phrase => phrase.word);
    if (words.every((word, index) => word === previousWords[index])) continue;
    try {
      const targets = buildXmlTypingChart(score, phrases, 2);
      return { targets, coupling: coupleStaffMelody(score, targets), words };
    } catch (error) { lastError = error; }
  }
  throw new Error(`Could not prepare a playable Twinkle word chart after 64 tries. ${lastError instanceof Error ? lastError.message : 'Check the word bank and held-key constraints.'}`);
}
