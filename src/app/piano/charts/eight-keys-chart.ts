import type { ImportedScore } from '../music/musicxml-import';
import { buildXmlTypingChart, TypingTarget } from '../gameplay/piano-chart';
import { songChartFor } from './song-charts';

// One editable finger pattern per authored phrase. Repeat visits reuse it.
// Keys describe melodic contour within a hand, not fixed pitches or piano fingering.
export const EIGHT_KEY_PATTERNS: Readonly<Record<string, string>> = {
  'theme-1': 'QQEE', 'theme-2': 'RREE', 'theme-3': 'EEWW', 'theme-4': 'WWEQ',
  'theme-5': 'PPOO', 'theme-6': 'IIUU', 'theme-7': 'PPOO', 'theme-8': 'IIOIU',
  'theme-9': 'QQEE', 'theme-10': 'RREE', 'theme-11': 'EEWW', 'theme-12': 'WWEQ',
  'variation-01-25': 'EWQWQWQW', 'variation-01-26': 'REWEWEWE',
  'variation-01-27': 'UIOPPOIU', 'variation-01-28': 'POPOIUIU',
  'variation-01-29': 'PPOIIUU', 'variation-01-30': 'PPOIIUU',
  'variation-01-31': 'WROQ', 'variation-01-32': 'Q', 'variation-01-33': 'Q',
  'variation-01-34': 'POIOIOPO', 'variation-01-35': 'OIUIUIOI',
  'variation-01-36': 'OIUIUIOI', 'variation-01-37': 'OIUIUIOI',
  'variation-01-38': 'POIOPOIU', 'variation-01-39': 'OIUIPOIU',
  'variation-01-40': 'OIUIPOIU', 'variation-01-41': 'PIU',
  'variation-01-42': 'EWQWQWQW', 'variation-01-43': 'REWEWEWE',
  'variation-01-44': 'UIOPPOIU', 'variation-01-45': 'POPOIUIU',
  'variation-01-46': 'PPOIIUU', 'variation-01-47': 'PPOIIUU',
  'variation-01-48': 'WROQ', 'variation-01-49': 'Q',
};

export function buildEightKeysChart(score: ImportedScore, songId: string): TypingTarget[] {
  const chart = songChartFor(songId);
  const phrases = chart.phrases.map(phrase => {
    const pattern = EIGHT_KEY_PATTERNS[phrase.id ?? ''];
    if (!pattern || pattern.length !== phrase.letters.length || /[^QWERUIOP]/.test(pattern))
      throw new Error(`Missing or invalid Eight Keys pattern for ${phrase.id ?? phrase.word}.`);
    return { ...phrase, word: pattern };
  });
  return buildXmlTypingChart(score, phrases, chart.unitsPerQuarter);
}
