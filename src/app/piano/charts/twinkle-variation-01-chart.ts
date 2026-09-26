import type { XmlPhrase } from '../gameplay/piano-chart';

// Beats are eighth-note musical units (two per quarter). Each fast written
// bar is one word; the compiler expands repeat visits and endings.
const fastBars = [25, 26, 27, 28, 29, 30, 34, 35, 36, 37, 38, 39, 40,
  42, 43, 44, 45, 46, 47];
const tiedContinuationBars = new Set([29, 30, 46, 47]);
const eighths = (measure: number): XmlPhrase => {
  const tiedContinuation = tiedContinuationBars.has(measure);
  return {
    id: `variation-01-${measure}`,
    word: tiedContinuation ? 'RAINBOW' : 'SUNSHINE', occurrence: 'all',
    letters: Array.from({ length: tiedContinuation ? 7 : 8 }, (_, index) => ({
      start: { measure, beat: (index + (tiedContinuation ? 1 : 0)) * 0.5 },
    })),
  };
};

/** Complete upper-staff attack chart, including both repeat visits and endings. */
export const TWINKLE_VARIATION_01_CHART: readonly XmlPhrase[] = [
  ...fastBars.map(eighths),
  { id: 'variation-01-31', word: 'STAR', occurrence: 'all', letters: [0, 1, 2, 3].map(beat => ({ start: { measure: 31, beat } })) },
  { id: 'variation-01-32', word: 'I', occurrence: 'all', letters: [
    { start: { measure: 32, beat: 0 }, end: { measure: 32, beat: 2 } },
  ] },
  { id: 'variation-01-33', word: 'A', occurrence: 'all', letters: [
    { start: { measure: 33, beat: 0 }, end: { measure: 33, beat: 2 } },
  ] },
  { id: 'variation-01-41', word: 'SUN', occurrence: 'all', letters: [
    { start: { measure: 41, beat: 0 }, end: { measure: 41, beat: 1.5 } },
    { start: { measure: 41, beat: 1.5 } },
    { start: { measure: 41, beat: 2 }, end: { measure: 42, beat: 0 } },
  ] },
  { id: 'variation-01-48', word: 'MOON', occurrence: 'all', letters: [0, 1, 2, 3].map(beat => ({ start: { measure: 48, beat } })) },
  { id: 'variation-01-49', word: 'I', occurrence: 'all', letters: [
    { start: { measure: 49, beat: 0 }, end: { measure: 49, beat: 2 } },
  ] },
];
