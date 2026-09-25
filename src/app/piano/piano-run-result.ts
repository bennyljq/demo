import { TypingRound } from './piano-judgement';
import { ChartCoverage } from './song-charts';

export interface RunResult {
  readonly songId: string;
  readonly songTitle: string;
  readonly coverage: Exclude<ChartCoverage, 'listen'>;
  readonly speed: number;
  readonly startPosition: number;
  readonly total: number;
  readonly available: number;
  readonly perfect: number;
  readonly good: number;
  readonly miss: number;
  readonly wrong: number;
  readonly bestCombo: number;
  readonly sustain: number;
  readonly sustainAvailable: number;
}

/** Copy primitive values before transport cleanup resets the active round. */
export function captureRunResult(round: TypingRound, songId: string, songTitle: string,
  coverage: Exclude<ChartCoverage, 'listen'>, speed: number, startPosition: number): RunResult | null {
  if (!round.complete || !round.results.some(result => result !== 'skipped')) return null;
  return Object.freeze({
    songId, songTitle, coverage, speed, startPosition,
    total: round.totalPoints, available: round.availablePoints,
    perfect: round.results.filter(result => result === 'perfect').length,
    good: round.results.filter(result => result === 'good').length,
    miss: round.results.filter(result => result === 'miss').length,
    wrong: round.wrongCount, bestCombo: round.bestCombo,
    sustain: round.earnedSustainPoints, sustainAvailable: round.availableSustainPoints,
  });
}
