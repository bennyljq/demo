export interface ScoringSettings {
  readonly perfectMs: number;
  readonly goodMs: number;
  readonly holdReleaseMs: number;
  readonly showAttackWindows: boolean;
  readonly showHoldBuffer: boolean;
}
export const DEFAULT_SCORING_SETTINGS: ScoringSettings = {
  perfectMs: 80, goodMs: 160, holdReleaseMs: 120,
  showAttackWindows: false, showHoldBuffer: false,
};
export function validateScoringSettings(value: ScoringSettings): string {
  for (const key of ['perfectMs', 'goodMs', 'holdReleaseMs'] as const) {
    if (!Number.isFinite(value[key]) || value[key] < 0) return `${key} must be a finite, nonnegative number.`;
  }
  if (value.perfectMs > value.goodMs) return 'Perfect tolerance cannot exceed Good tolerance.';
  return '';
}
export function attackWindowSeconds(ms: number, rate: number): number { return ms * rate / 1000; }
export function holdBufferSeconds(ms: number, rate: number, duration: number): number {
  return Math.min(attackWindowSeconds(ms, rate), duration / 2);
}
