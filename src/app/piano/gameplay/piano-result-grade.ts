export type ScoreGrade = 'S' | 'A' | 'B' | 'C' | 'D';

export const SCORE_GRADE_THRESHOLDS: readonly { readonly grade: ScoreGrade; readonly minimum: number }[] = [
  { grade: 'S', minimum: 0.95 },
  { grade: 'A', minimum: 0.85 },
  { grade: 'B', minimum: 0.70 },
  { grade: 'C', minimum: 0.50 },
  { grade: 'D', minimum: 0 },
];

export interface ScoreGradeResult {
  readonly grade: ScoreGrade;
  readonly ratio: number;
  readonly earned: number;
}

/** Use the unrounded, zero-floored attempt score; display rounding does not affect a boundary. */
export function calculateScoreGrade(rawPoints: number, speed: number, maximum: number): ScoreGradeResult | null {
  if (!Number.isFinite(rawPoints) || !Number.isFinite(speed) || !Number.isFinite(maximum) || speed <= 0 || maximum <= 0)
    return null;
  const earned = Math.max(0, rawPoints * speed);
  const ratio = Math.max(0, Math.min(1, earned / maximum));
  return { grade: SCORE_GRADE_THRESHOLDS.find(threshold => ratio >= threshold.minimum)!.grade, ratio, earned };
}
