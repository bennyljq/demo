export interface ScoringSettings {
  readonly perfectMs: number;
  readonly goodMs: number;
  readonly holdReleaseMs: number;
  readonly showAttackWindows: boolean;
  readonly showHoldBuffer: boolean;
  readonly perfectPoints: number;
  readonly goodPoints: number;
  readonly missPenalty: number;
  readonly wrongPenalty: number;
  readonly maxHoldPoints: number;
  readonly comboPoints: number;
  readonly speedBonusStrength: number;
}
export const DEFAULT_SCORING_SETTINGS: ScoringSettings = {
  perfectMs: 80, goodMs: 160, holdReleaseMs: 120,
  showAttackWindows: false, showHoldBuffer: false,
  perfectPoints: 100, goodPoints: 70, missPenalty: 50, wrongPenalty: 50,
  maxHoldPoints: 100, comboPoints: 5, speedBonusStrength: 1,
};
export function validateScoringSettings(value: ScoringSettings): string {
  for (const key of ['perfectMs', 'goodMs', 'holdReleaseMs', 'goodPoints', 'missPenalty',
    'wrongPenalty', 'maxHoldPoints', 'comboPoints', 'speedBonusStrength'] as const) {
    if (!Number.isFinite(value[key]) || value[key] < 0) return `${key} must be a finite, nonnegative number.`;
  }
  if (value.perfectMs > value.goodMs) return 'Perfect tolerance cannot exceed Good tolerance.';
  if (!Number.isFinite(value.perfectPoints) || value.perfectPoints <= 0) return 'Perfect points must be positive.';
  if (value.goodPoints > value.perfectPoints) return 'Good points cannot exceed Perfect points.';
  if (value.speedBonusStrength > 3) return 'Speed-bonus strength must be between 0 and 3.';
  return '';
}
export function speedMultiplier(rate: number, settings: ScoringSettings): number {
  return rate ** settings.speedBonusStrength;
}
export function holdProgressPercent(earned: number, maximum: number): number {
  return maximum > 0 ? Math.max(0, Math.min(100, earned / maximum * 100)) : 0;
}
export function attackWindowSeconds(ms: number, rate: number): number { return ms * rate / 1000; }
export function holdBufferSeconds(ms: number, rate: number, duration: number): number {
  return Math.min(attackWindowSeconds(ms, rate), duration / 2);
}
