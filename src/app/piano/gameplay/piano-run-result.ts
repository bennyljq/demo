import { LetterResult, TypingRound } from './piano-judgement';
import { ChartCoverage } from '../charts/song-charts';

export interface ResultLetter {
  readonly id: string;
  readonly letter: string;
  readonly word: string;
  readonly wordIndex: number;
  readonly result: LetterResult;
  readonly attack: 'perfect' | 'good' | null;
  readonly sustainPoints: number;
  readonly hasHold: boolean;
}

export interface RunResult {
  readonly songId: string;
  readonly songTitle: string;
  readonly coverage: Exclude<ChartCoverage, 'listen'>;
  readonly speed: number;
  readonly startPosition: number;
  readonly total: number;
  readonly raw: number;
  readonly available: number;
  readonly perfect: number;
  readonly good: number;
  readonly miss: number;
  readonly wrong: number;
  readonly wrongPenalty: number;
  readonly missPenalty: number;
  readonly comboBonus: number;
  readonly attackPoints: number;
  readonly bestCombo: number;
  readonly sustain: number;
  readonly sustainAvailable: number;
  readonly letters: readonly ResultLetter[];
}

/** Copy primitive values before transport cleanup resets the active round. */
export function captureRunResult(round: TypingRound, songId: string, songTitle: string,
  coverage: Exclude<ChartCoverage, 'listen'>, startPosition: number): RunResult | null {
  if (!round.complete || !round.results.some(result => result !== 'skipped')) return null;
  const letters = Object.freeze(round.targets.map(target => Object.freeze({
    id: target.id, letter: target.letter, word: target.word, wordIndex: target.wordIndex,
    result: round.results[target.index],
    attack: round.attackGrades[target.index] ?? null,
    sustainPoints: round.sustainPoints[target.index], hasHold: target.holdEnd !== undefined,
  })));
  return Object.freeze({
    songId, songTitle, coverage, speed: round.speed, startPosition,
    total: round.totalPoints, raw: round.rawPoints, available: round.availablePoints,
    perfect: round.results.filter(result => result === 'perfect').length,
    good: round.results.filter(result => result === 'good').length,
    miss: round.missCount, missPenalty: round.missPenalty, attackPoints: round.attackPoints,
    wrong: round.wrongCount, wrongPenalty: round.wrongPenalty, comboBonus: round.comboBonus, bestCombo: round.bestCombo,
    sustain: round.earnedSustainPoints, sustainAvailable: round.availableSustainPoints,
    letters,
  });
}
