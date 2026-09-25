import type { XmlPhrase } from '../gameplay/piano-chart';

/** Explicit upper-staff Theme locations. Both encoded repeat visits use the same words. */
export const TWINKLE_THEME_CHART: readonly XmlPhrase[] = [
  { id: 'theme-1', word: 'TWINKLE', occurrence: 'all', letters: [
    { start: { measure: 1, beat: 0 } },
    { start: { measure: 1, beat: 2 } },
    { start: { measure: 2, beat: 0 } },
    { start: { measure: 2, beat: 2 } },
    { start: { measure: 3, beat: 0 } },
    { start: { measure: 3, beat: 2 } },
    { start: { measure: 4, beat: 0 } },
  ] },
  { id: 'theme-2', word: 'STAR', occurrence: 'all', letters: [
    { start: { measure: 4, beat: 2 }, end: { measure: 4, beat: 4 } },
    { start: { measure: 5, beat: 0 } },
    { start: { measure: 5, beat: 2 } },
    { start: { measure: 6, beat: 0 } },
  ] },
  { id: 'theme-3', word: 'SHINE', occurrence: 'all', letters: [
    { start: { measure: 6, beat: 2 } },
    { start: { measure: 7, beat: 0 } },
    { start: { measure: 7, beat: 2 } },
    { start: { measure: 7, beat: 3.5 } },
    { start: { measure: 8, beat: 0 }, end: { measure: 8, beat: 2 } },
  ] },
  { id: 'theme-4', word: 'HIGH', occurrence: 'all', letters: [
    { start: { measure: 9, beat: 0 } },
    { start: { measure: 9, beat: 2 } },
    { start: { measure: 10, beat: 0 } },
    { start: { measure: 10, beat: 2 } },
  ] },
  { id: 'theme-5', word: 'ABOVE', occurrence: 'all', letters: [
    { start: { measure: 11, beat: 0 } },
    { start: { measure: 11, beat: 2 } },
    { start: { measure: 12, beat: 0 } },
    { start: { measure: 12, beat: 2 } },
    { start: { measure: 13, beat: 0 } },
  ] },
  { id: 'theme-6', word: 'THE', occurrence: 'all', letters: [
    { start: { measure: 13, beat: 2 } },
    { start: { measure: 14, beat: 0 } },
    { start: { measure: 14, beat: 2 } },
  ] },
  { id: 'theme-7', word: 'WORLD', occurrence: 'all', letters: [
    { start: { measure: 15, beat: 0 } },
    { start: { measure: 15, beat: 2 } },
    { start: { measure: 15, beat: 3.5 } },
    { start: { measure: 16, beat: 0 } },
    { start: { measure: 16, beat: 2 }, end: { measure: 16, beat: 4 } },
  ] },
  { id: 'theme-8', word: 'TWINKLE', occurrence: 'all', letters: [
    { start: { measure: 17, beat: 0 } },
    { start: { measure: 17, beat: 2 } },
    { start: { measure: 18, beat: 0 } },
    { start: { measure: 18, beat: 2 } },
    { start: { measure: 19, beat: 0 } },
    { start: { measure: 19, beat: 2 } },
    { start: { measure: 20, beat: 0 } },
  ] },
  { id: 'theme-9', word: 'STAR', occurrence: 'all', letters: [
    { start: { measure: 20, beat: 2 }, end: { measure: 20, beat: 4 } },
    { start: { measure: 21, beat: 0 } },
    { start: { measure: 21, beat: 2 } },
    { start: { measure: 22, beat: 0 } },
  ] },
  { id: 'theme-10', word: 'SHINE', occurrence: 'all', letters: [
    { start: { measure: 22, beat: 2 } },
    { start: { measure: 23, beat: 0 } },
    { start: { measure: 23, beat: 2 } },
    { start: { measure: 23, beat: 3.5 } },
    { start: { measure: 24, beat: 0 }, end: { measure: 24, beat: 2 } },
  ] },
];
