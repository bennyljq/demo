import type { ImportedScore, ScoreMeasure } from './musicxml-import';
import { secondsAtQuarter } from './piano-chart-time';

export interface BeatPulse { readonly sourceTime: number; readonly measureId: string; readonly beat: number }

/** Compound 6/4 and 6/8 use two groups of three; other metres use denominator beats. */
export function metricGrouping(beats: number, beatType: number): { count: number; quarterStep: number } {
  const group = beats > 3 && beats % 3 === 0 ? 3 : 1;
  return { count: beats / group, quarterStep: group * 4 / beatType };
}

export function scoreBeatGrid(score: ImportedScore): BeatPulse[] {
  const pulses: BeatPulse[] = [];
  for (const measure of score.measures) {
    const { quarterStep: step } = metricGrouping(measure.meterBeats, measure.meterBeatType);
    for (let offset = 0, beat = 0; offset < measure.durationQuarter - 1e-8; offset += step, beat++) {
      pulses.push({ sourceTime: offset === 0 ? measure.start : secondsAtQuarter(score.tempos, measure.quarter + offset),
        measureId: measure.id, beat });
    }
  }
  return pulses;
}

export function measureAt(score: ImportedScore, sourceTime: number): ScoreMeasure {
  return [...score.measures].reverse().find(measure => measure.start <= sourceTime + 1e-9) ?? score.measures[0];
}

/** A full metric bar of count-in at the tempo active at the selected position. */
export function countInBeatSeconds(score: ImportedScore, sourceTime: number, rate: number): number[] {
  const measure = measureAt(score, sourceTime);
  const currentTempo = [...score.tempos].reverse().find(event =>
    secondsAtQuarter(score.tempos, event.quarter) <= sourceTime + 1e-9)?.value ?? score.tempos[0].value;
  const { count, quarterStep } = metricGrouping(measure.meterBeats, measure.meterBeatType);
  const beatSeconds = quarterStep * 60 / currentTempo / rate;
  return Array.from({ length: count }, (_, beat) => beat * beatSeconds);
}
