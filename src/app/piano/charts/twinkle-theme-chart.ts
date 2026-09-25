import type { XmlPhrase } from '../gameplay/piano-chart';
import { randomizeTwinkleWords } from './twinkle-word-randomizer';

/** Explicit upper-staff Theme locations. Words are picked once per page load for both repeat visits. */
export const TWINKLE_THEME_CHART: readonly XmlPhrase[] = randomizeTwinkleWords([
  { id: 'theme-1', word: 'FROG', occurrence: 'all', letters: [ // twinkle twinkle
    { start: { measure: 1, beat: 0 } },
    { start: { measure: 1, beat: 2 } },
    { start: { measure: 2, beat: 0 } },
    { start: { measure: 2, beat: 2 } },
  ] },
  { id: 'theme-2', word: 'BALL', occurrence: 'all', letters: [ // little star
    { start: { measure: 3, beat: 0 } },
    { start: { measure: 3, beat: 2 } },
    { start: { measure: 4, beat: 0 } },
    { start: { measure: 4, beat: 2 } },
  ] },
  { id: 'theme-3', word: 'STAR', occurrence: 'all', letters: [ // how I wonder
    { start: { measure: 5, beat: 0 } },
    { start: { measure: 5, beat: 2 } },
    { start: { measure: 6, beat: 0 } },
    { start: { measure: 6, beat: 2 } },
  ] },
  { id: 'theme-4', word: 'FISH', occurrence: 'all', letters: [ // what you are
    { start: { measure: 7, beat: 0 } },
    { start: { measure: 7, beat: 2 } },
    { start: { measure: 7, beat: 3.5 } },
    { start: { measure: 8, beat: 0 }, end: { measure: 8, beat: 2 } },
  ] },
  // End of first movement, start of second movement
  { id: 'theme-5', word: 'HIGH', occurrence: 'all', letters: [ // up above the
    { start: { measure: 9, beat: 0 } },
    { start: { measure: 9, beat: 2 } },
    { start: { measure: 10, beat: 0 } },
    { start: { measure: 10, beat: 2 } },
  ] },
  { id: 'theme-6', word: 'RATS', occurrence: 'all', letters: [ // world so high
    { start: { measure: 11, beat: 0 } },
    { start: { measure: 11, beat: 2 } },
    { start: { measure: 12, beat: 0 } },
    { start: { measure: 12, beat: 2 } },
  ] },
  { id: 'theme-7', word: 'POOP', occurrence: 'all', letters: [ // like a diamond
    { start: { measure: 13, beat: 0 } },
    { start: { measure: 13, beat: 2 } },
    { start: { measure: 14, beat: 0 } },
    { start: { measure: 14, beat: 2 } },
  ] },
  { id: 'theme-8', word: 'BREAD', occurrence: 'all', letters: [ // in the sky
    { start: { measure: 15, beat: 0 } },
    { start: { measure: 15, beat: 2 } },
    { start: { measure: 15, beat: 3.5 } },
    { start: { measure: 16, beat: 0 } },
    { start: { measure: 16, beat: 2 }, end: { measure: 16, beat: 4 } },
  ] },
  { id: 'theme-9', word: 'FART', occurrence: 'all', letters: [ // twinkle twinkle
    { start: { measure: 17, beat: 0 } },
    { start: { measure: 17, beat: 2 } },
    { start: { measure: 18, beat: 0 } },
    { start: { measure: 18, beat: 2 } },
  ] },
  { id: 'theme-10', word: 'RICE', occurrence: 'all', letters: [ // little star
    { start: { measure: 19, beat: 0 } },
    { start: { measure: 19, beat: 2 } },
    { start: { measure: 20, beat: 0 } },
    { start: { measure: 20, beat: 2 } },
  ] },
  { id: 'theme-11', word: 'CATS', occurrence: 'all', letters: [ // how I wonder
    { start: { measure: 21, beat: 0 } },
    { start: { measure: 21, beat: 2 } },
    { start: { measure: 22, beat: 0 } },
    { start: { measure: 22, beat: 2 } },
  ] },
  { id: 'theme-12', word: 'DOGS', occurrence: 'all', letters: [ // what you are
    { start: { measure: 23, beat: 0 } },
    { start: { measure: 23, beat: 2 } },
    { start: { measure: 23, beat: 3.5 } },
    { start: { measure: 24, beat: 0 }, end: { measure: 24, beat: 2 } },
  ] },
]);
