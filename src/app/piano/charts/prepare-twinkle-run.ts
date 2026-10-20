import type { ImportedScore } from '../music/musicxml-import';
import { buildXmlTypingChart, TypingTarget } from '../gameplay/piano-chart';
import { CoupledTarget, coupleStaffMelody } from '../gameplay/twinkle-coupling';
import { songChartFor } from './song-charts';
import { randomizeTwinkleWords, seededWordRandom } from './twinkle-word-randomizer';
import { coupleNocturneMelody } from './nocturne-coupling';

export interface PreparedTwinkleRun {
  readonly targets: readonly TypingTarget[];
  readonly coupling: readonly CoupledTarget[];
  readonly words: readonly string[];
}

/** Compile before publication so invalid cross-phrase held-key conflicts never reach Ready. */
export function prepareTwinkleRun(score: ImportedScore, previousWords: readonly string[], seed: number,
  songId = 'twinkle-theme'): PreparedTwinkleRun {
  const chart = songChartFor(songId);
  let lastError: unknown;
  for (let attempt = 0; attempt < 64; attempt++) {
    const phrases = randomizeTwinkleWords(chart.phrases, seededWordRandom(seed + attempt));
    const words = phrases.map(phrase => phrase.word);
    if (words.every((word, index) => word === previousWords[index])) continue;
    try {
      const targets = buildXmlTypingChart(score, phrases, chart.unitsPerQuarter);
      const prepared = songId === 'chopin-nocturne-op-9-no-2'
        ? coupleNocturneMelody(score, targets) : { targets, coupling: coupleStaffMelody(score, targets) };
      return { ...prepared, words };
    } catch (error) { lastError = error; }
  }
  throw new Error(`Could not prepare a playable word chart after 64 tries. ${lastError instanceof Error ? lastError.message : 'Check the word bank and held-key constraints.'}`);
}
