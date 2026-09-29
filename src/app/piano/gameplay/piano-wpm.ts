import type { TypingTarget } from './piano-chart';
import type { CoupledTarget } from './twinkle-coupling';

export interface DemandMetrics {
  readonly attackCount: number;
  readonly activeSpanSeconds: number;
  readonly averageWpm: number;
  readonly peakWpm: number;
  readonly peakAttacks: number;
}

/** A five-source-second window is [first attack, first attack + 5), including its left edge. */
export function calculateDemand(targets: readonly TypingTarget[], coupling: readonly CoupledTarget[]): DemandMetrics | null {
  if (!targets.length) return null;
  const last = targets.at(-1)!;
  const soundingEnd = coupling.find(item => item.targetIndex === last.index)?.notes
    .reduce((end, note) => Math.max(end, note.start + note.duration), last.time) ?? last.time;
  const end = Math.max(soundingEnd, ...targets.map(target => target.holdEnd ?? target.time));
  const span = end - targets[0].time;
  if (span <= 0) return null;
  const window = Math.min(5, span);
  let peak = 0, right = 0;
  for (let left = 0; left < targets.length; left++) {
    right = Math.max(right, left);
    while (right < targets.length && targets[right].time < targets[left].time + window) right++;
    peak = Math.max(peak, right - left);
  }
  return { attackCount: targets.length, activeSpanSeconds: span,
    averageWpm: 12 * targets.length / span, peakWpm: 12 * peak / window, peakAttacks: peak };
}

/** Playback elapsed time excludes count-in and suspension because source position does not advance then. */
export function calculateLiveWpm(successSeconds: readonly number[], observedSeconds: number): number | null {
  if (observedSeconds < 1) return null;
  const window = Math.min(10, observedSeconds);
  const count = successSeconds.filter(time => time >= Math.max(0, observedSeconds - 10) && time <= observedSeconds).length;
  return 12 * count / window;
}
