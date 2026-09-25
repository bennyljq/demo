import type { XmlPhrase } from '../gameplay/piano-chart';

/** Manually selected upper-staff attacks from all 33 written measures; measure 1 is listen-only. */
export const GREENSLEEVES_CHART: readonly XmlPhrase[] = [
  { id: 'phrase-1', word: 'MY', letters: [
    { start: { measure: 2, beat: 0 }, end: { measure: 2, beat: 3.6 } },
    { start: { measure: 2, beat: 4 } },
  ] },
  { id: 'phrase-2', word: 'GREEN', letters: [
    { start: { measure: 3, beat: 0 } },
    { start: { measure: 3, beat: 3 } },
    { start: { measure: 3, beat: 4 } },
    { start: { measure: 4, beat: 0 }, end: { measure: 4, beat: 3.6 } },
    { start: { measure: 4, beat: 4 } },
  ] },
  { id: 'phrase-3', word: 'SLEEVES', letters: [
    { start: { measure: 5, beat: 0 } },
    { start: { measure: 5, beat: 3 } },
    { start: { measure: 5, beat: 4 } },
    { start: { measure: 6, beat: 0 }, end: { measure: 6, beat: 3.6 } },
    { start: { measure: 6, beat: 4 } },
    { start: { measure: 7, beat: 0 } },
    { start: { measure: 7, beat: 3 } },
  ] },
  { id: 'phrase-4', word: 'WAS', letters: [
    { start: { measure: 7, beat: 4 } },
    { start: { measure: 8, beat: 0 }, end: { measure: 8, beat: 3.6 } },
    { start: { measure: 8, beat: 4 } },
  ] },
  { id: 'phrase-5', word: 'MY', letters: [
    { start: { measure: 9, beat: 0 } },
    { start: { measure: 9, beat: 4 } },
  ] },
  { id: 'phrase-6', word: 'DELIGHT', letters: [
    { start: { measure: 10, beat: 0 }, end: { measure: 10, beat: 3.6 } },
    { start: { measure: 10, beat: 4 } },
    { start: { measure: 11, beat: 0 } },
    { start: { measure: 11, beat: 3 } },
    { start: { measure: 11, beat: 4 } },
    { start: { measure: 12, beat: 0 }, end: { measure: 12, beat: 3.6 } },
    { start: { measure: 12, beat: 4 } },
  ] },
  { id: 'phrase-7', word: 'I', letters: [
    { start: { measure: 13, beat: 0 } },
  ] },
  { id: 'phrase-8', word: 'LOVE', letters: [
    { start: { measure: 13, beat: 4 } },
    { start: { measure: 13, beat: 4.666666 } },
    { start: { measure: 13, beat: 5.333334 } },
    { start: { measure: 14, beat: 0 } },
  ] },
  { id: 'phrase-9', word: 'YOU', letters: [
    { start: { measure: 14, beat: 3 } },
    { start: { measure: 14, beat: 4 } },
    { start: { measure: 15, beat: 0 } },
  ] },
  { id: 'phrase-10', word: 'NOW', letters: [
    { start: { measure: 15, beat: 3 } },
    { start: { measure: 15, beat: 4 } },
    { start: { measure: 16, beat: 0 }, end: { measure: 16, beat: 5.4 } },
  ] },
  { id: 'phrase-11', word: 'MY', letters: [
    { start: { measure: 17, beat: 0 }, end: { measure: 17, beat: 5.4 } },
    { start: { measure: 18, beat: 0 }, end: { measure: 18, beat: 5.4 } },
  ] },
  { id: 'phrase-12', word: 'GREEN', letters: [
    { start: { measure: 19, beat: 0 } },
    { start: { measure: 19, beat: 3 } },
    { start: { measure: 19, beat: 4 } },
    { start: { measure: 20, beat: 0 }, end: { measure: 20, beat: 3.6 } },
    { start: { measure: 20, beat: 4 } },
  ] },
  { id: 'phrase-13', word: 'SLEEVES', letters: [
    { start: { measure: 21, beat: 0 } },
    { start: { measure: 21, beat: 3 } },
    { start: { measure: 21, beat: 4 } },
    { start: { measure: 22, beat: 0 }, end: { measure: 22, beat: 3.6 } },
    { start: { measure: 22, beat: 4 } },
    { start: { measure: 23, beat: 0 } },
    { start: { measure: 23, beat: 3 } },
  ] },
  { id: 'phrase-14', word: 'WAS', letters: [
    { start: { measure: 23, beat: 4 } },
    { start: { measure: 24, beat: 0 }, end: { measure: 24, beat: 3.6 } },
    { start: { measure: 24, beat: 4 } },
  ] },
  { id: 'phrase-15', word: 'MY', letters: [
    { start: { measure: 25, beat: 0 }, end: { measure: 25, beat: 5.4 } },
    { start: { measure: 26, beat: 0 }, end: { measure: 26, beat: 5.4 } },
  ] },
  { id: 'phrase-16', word: 'HEART', letters: [
    { start: { measure: 27, beat: 0 } },
    { start: { measure: 27, beat: 3 } },
    { start: { measure: 27, beat: 4 } },
    { start: { measure: 28, beat: 0 }, end: { measure: 28, beat: 3.6 } },
    { start: { measure: 28, beat: 4 } },
  ] },
  { id: 'phrase-17', word: 'OF', letters: [
    { start: { measure: 29, beat: 0 } },
    { start: { measure: 29, beat: 4 } },
  ] },
  { id: 'phrase-18', word: 'GOLD', letters: [
    { start: { measure: 29, beat: 4.666666 } },
    { start: { measure: 29, beat: 5.333334 } },
    { start: { measure: 30, beat: 0 } },
    { start: { measure: 30, beat: 3 } },
  ] },
  { id: 'phrase-19', word: 'ALWAYS', letters: [
    { start: { measure: 30, beat: 4 } },
    { start: { measure: 31, beat: 0 } },
    { start: { measure: 31, beat: 3 } },
    { start: { measure: 31, beat: 4 } },
    { start: { measure: 32, beat: 0 }, end: { measure: 32, beat: 5.4 } },
    { start: { measure: 33, beat: 0 }, end: { measure: 33, beat: 5.4 } },
  ] },
];
