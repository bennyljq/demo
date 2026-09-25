import type { ImportedScore, ScoreMeasure, ScoreEvent } from './musicxml-import';

/** Chart beats are zero-based musical units, independent of measure metre. */
export interface ChartLocation { readonly measure: string | number; readonly beat: number; readonly occurrence?: number }

export function secondsAtQuarter(tempos: readonly ScoreEvent[], quarter: number): number {
  let seconds = 0;
  const sorted = [...tempos].sort((a, b) => a.quarter - b.quarter);
  if (!sorted.length || sorted[0].quarter !== 0) throw new Error('Chart timing: missing initial tempo.');
  for (let i = 0; i < sorted.length; i++) {
    const from = sorted[i].quarter;
    if (quarter <= from) break;
    const to = Math.min(quarter, sorted[i + 1]?.quarter ?? quarter);
    seconds += (to - from) * 60 / sorted[i].value;
  }
  return seconds;
}

export function resolveChartLocation(score: ImportedScore, location: ChartLocation, defaultOccurrence = 1, unitsPerQuarter = 2):
  { time: number; quarter: number; measure: ScoreMeasure } {
  const occurrence = location.occurrence ?? defaultOccurrence;
  const label = String(location.measure);
  const found = score.measures.filter(measure => measure.number === label && measure.occurrence === occurrence);
  if (found.length !== 1) throw new Error(`measure ${label}, occurrence ${occurrence} ${found.length ? 'is ambiguous' : 'does not exist'}.`);
  if (!Number.isFinite(unitsPerQuarter) || unitsPerQuarter <= 0)
    throw new Error('Chart timing: unitsPerQuarter must be positive and finite.');
  const measure = found[0];
  const endpoint = measure.durationQuarter * unitsPerQuarter;
  if (!Number.isFinite(location.beat) || location.beat < 0 || location.beat > endpoint + 1e-8)
    throw new Error(`measure ${label}, occurrence ${occurrence}: beat must be finite and within 0-${endpoint} musical units.`);
  const index = score.measures.indexOf(measure);
  if (location.beat === 0) return { time: measure.start, quarter: measure.quarter, measure };
  if (Math.abs(location.beat - endpoint) <= 1e-8) {
    const next = score.measures[index + 1];
    return { time: next?.start ?? score.duration, quarter: next?.quarter ?? measure.quarter + measure.durationQuarter, measure };
  }
  const quarter = measure.quarter + location.beat / unitsPerQuarter;
  return { time: secondsAtQuarter(score.tempos, quarter), quarter, measure };
}
