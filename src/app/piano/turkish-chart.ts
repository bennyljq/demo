import type { XmlPhrase } from './piano-chart';

/** The first score traversal only. Locations are authoritative, independent of sounded notes. */
export const TURKISH_CHART: readonly XmlPhrase[] = [
  { id: 'apple', word: 'APPLE', letters: [
    { start: { measure: 1, beat: 1.5 } }, { start: { measure: 1, beat: 1.875 } },
    { start: { measure: 1, beat: 2.25 } }, { start: { measure: 1, beat: 2.625 } },
    { start: { measure: 2, beat: 0 }, end: { measure: 2, beat: 0.75 } },
  ] },
  { id: 'fish', word: 'FISH', letters: [
    { start: { measure: 2, beat: 1.5 } }, { start: { measure: 2, beat: 1.875 } },
    { start: { measure: 2, beat: 2.25 } }, { start: { measure: 2, beat: 2.625 } },
  ] },
  { id: 'bird', word: 'BIRD', letters: [
    { start: { measure: 3, beat: 0 } }, { start: { measure: 3, beat: 0.375 } },
    { start: { measure: 3, beat: 0.75 } }, { start: { measure: 3, beat: 1.125 } },
  ] },
  { id: 'house', word: 'HOUSE', letters: [
    { start: { measure: 3, beat: 1.5 } }, { start: { measure: 3, beat: 1.875 } },
    { start: { measure: 3, beat: 2.25 } }, { start: { measure: 3, beat: 2.625 } },
    { start: { measure: 4, beat: 0 }, end: { measure: 4, beat: 0.75 } },
  ] },
  { id: 'star', word: 'STAR', letters: [
    { start: { measure: 4, beat: 1.5 } }, { start: { measure: 4, beat: 2.25 } },
    // This A stays on the written beat even if the grace-note performance policy changes.
    { start: { measure: 5, beat: 0 } }, { start: { measure: 5, beat: 0.75 } },
  ] },
  { id: 'moon', word: 'MOON', letters: [
    { start: { measure: 5, beat: 1.5 } }, { start: { measure: 5, beat: 2.25 } },
    { start: { measure: 6, beat: 0 } }, { start: { measure: 6, beat: 0.75 } },
  ] },
  { id: 'tree', word: 'TREE', letters: [
    { start: { measure: 6, beat: 1.5 } }, { start: { measure: 6, beat: 2.25 } },
    { start: { measure: 7, beat: 0 } }, { start: { measure: 7, beat: 0.75 } },
  ] },
  { id: 'sun', word: 'SUN', letters: [
    { start: { measure: 7, beat: 1.5 } }, { start: { measure: 7, beat: 2.25 } },
    { start: { measure: 8, beat: 0 } },
  ] },
];

