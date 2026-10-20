import type { TypingTarget } from './piano-chart';
import { attackWindowSeconds, DEFAULT_SCORING_SETTINGS, holdBufferSeconds, ScoringSettings, speedMultiplier } from './piano-scoring-settings';
import { EIGHT_KEYS, PianoMode } from './piano-mode';

export const TIMING_WINDOWS = { perfect: 0.080, good: 0.160, wrongFeedback: 0.5 } as const;
export type LetterResult = 'pending' | 'holding' | 'skipped' | 'perfect' | 'good' | 'miss';
type Grade = 'perfect' | 'good';
const EPSILON = 1e-9;

/** Musical intervals and points use source-song time; tolerances use real milliseconds. */
export class TypingRound {
  private scoring!: ScoringSettings;
  get attemptSettings(): ScoringSettings { return this.scoring; }
  results: LetterResult[] = [];
  attackGrades: (Grade | undefined)[] = [];
  sustainPoints: number[] = [];
  complete = false;
  listening = true;
  wrongUntil = -Infinity;
  wrong = false;
  wrongCount = 0;
  speed = 1;
  combo = 0;
  bestCombo = 0;
  get comboBonus(): number { return this.bestCombo * this.scoring.comboPoints; }
  get multiplier(): number { return speedMultiplier(this.speed, this.scoring); }
  revision = 0;
  feedbackSerial = 0;
  feedbackKind: Grade | 'miss' | 'wrong' | undefined;
  feedbackIndex = -1;
  feedbackLetter = '';
  private readonly held = new Map<number, { key: string; lastPosition: number }>();
  private readonly down = new Set<string>();

  constructor(readonly targets: readonly TypingTarget[], public settings: ScoringSettings = DEFAULT_SCORING_SETTINGS,
    readonly mode: PianoMode = 'word-concert', readonly eightKeyBindings = EIGHT_KEYS) { this.reset(); }

  get availablePoints(): number {
    const eligible = this.targets.filter(target => this.results[target.index] !== 'skipped');
    const holds = eligible.filter(target => target.holdEnd !== undefined).length;
    return this.multiplier * (this.scoring.perfectPoints * eligible.length + this.scoring.maxHoldPoints * holds +
      this.scoring.comboPoints * eligible.length);
  }
  get availableSustainPoints(): number {
    return this.targets.reduce((sum, target) => sum + (target.holdEnd !== undefined && this.results[target.index] !== 'skipped' ? this.scoring.maxHoldPoints : 0), 0);
  }
  get earnedSustainPoints(): number { return this.sustainPoints.reduce((sum, points) => sum + points, 0); }
  get attackPoints(): number {
    return this.attackGrades.reduce<number>((sum, grade) => sum +
      (grade === 'perfect' ? this.scoring.perfectPoints : grade === 'good' ? this.scoring.goodPoints : 0), 0);
  }
  get missCount(): number { return this.results.filter(result => result === 'miss').length; }
  get missPenalty(): number { return -this.missCount * this.scoring.missPenalty; }
  get wrongPenalty(): number { return -this.wrongCount * this.scoring.wrongPenalty; }
  get rawPoints(): number {
    return this.attackPoints + this.earnedSustainPoints + this.comboBonus + this.missPenalty + this.wrongPenalty;
  }
  get totalPoints(): number { return Math.round(Math.max(0, this.rawPoints * this.multiplier)); }

  reset(destination = 0, speed = this.speed): void {
    this.scoring = Object.freeze({ ...this.settings });
    this.speed = speed;
    this.results = this.targets.map(target => target.time < destination ? 'skipped' : 'pending');
    this.attackGrades = this.targets.map(() => undefined);
    this.sustainPoints = this.targets.map(() => 0);
    this.held.clear(); this.down.clear();
    this.complete = false; this.listening = true; this.wrong = false;
    this.wrongUntil = -Infinity; this.wrongCount = 0; this.combo = 0; this.bestCombo = 0;
    this.feedbackKind = undefined; this.feedbackIndex = -1; this.feedbackLetter = '';
    this.revision++;
    this.advance(destination);
  }

  advance(time: number, rate = 1, cosmeticTime = time): void {
    const good = attackWindowSeconds(this.scoring.goodMs, rate);
    let lastMissed = -1;
    for (const target of this.targets) {
      const index = target.index;
      if (this.results[index] === 'pending' && time > target.time + good + EPSILON) {
        this.results[index] = 'miss'; this.combo = 0; lastMissed = index; this.revision++;
      }
      const held = this.held.get(index);
      if (held && target.holdEnd !== undefined) {
        held.lastPosition = Math.max(held.lastPosition, Math.min(time, target.holdEnd));
        this.sustainPoints[index] = this.proportional(target, held.lastPosition);
        if (time >= target.holdEnd - EPSILON) this.finishHold(index, true);
      }
    }
    if (lastMissed >= 0) this.setFeedback('miss', lastMissed);
    const first = this.targets.find(target => this.results[target.index] !== 'skipped');
    const listening = !!first && time < first.time - good - EPSILON;
    const last = [...this.targets].reverse().find(target => this.results[target.index] !== 'skipped');
    const complete = !last || (time > Math.max(last.time + good, last.holdEnd ?? 0) + EPSILON && !this.held.size);
    const wrong = cosmeticTime < this.wrongUntil;
    if (listening !== this.listening || complete !== this.complete || wrong !== this.wrong) this.revision++;
    this.listening = listening; this.complete = complete; this.wrong = wrong;
  }

  key(key: string, time: number, rate = 1, cosmeticTime = time, physical = key): void {
    const upper = key.toUpperCase();
    const slot = this.mode === 'eight-keys' ? EIGHT_KEYS[this.eightKeyBindings.indexOf(upper)] : upper;
    if (!slot) return;
    if (this.down.has(physical)) return;
    this.advance(time, rate, cosmeticTime);
    const good = attackWindowSeconds(this.scoring.goodMs, rate);
    const eligible = this.targets.filter(target => this.results[target.index] !== 'skipped');
    const first = eligible[0], last = eligible.at(-1);
    if (!first || !last || time < first.time - good - EPSILON ||
        time > Math.max(last.time + good, last.holdEnd ?? 0) + EPSILON || this.complete) return;
    this.down.add(physical);
    let nearest: TypingTarget | undefined;
    let distance = Infinity;
    for (const target of this.targets) {
      const delta = Math.abs(time - target.time);
      if (this.results[target.index] === 'pending' && delta <= good + EPSILON && delta < distance - EPSILON) {
        nearest = target; distance = delta;
      }
    }
    if (!nearest || (this.mode !== 'rhythm' && slot !== nearest.letter)) {
      this.wrongCount++; this.combo = 0;
      this.wrongUntil = cosmeticTime + TIMING_WINDOWS.wrongFeedback;
      this.wrong = true;
      this.setFeedback('wrong', nearest?.index ?? -1, upper);
    } else {
      const grade: Grade = distance <= attackWindowSeconds(this.scoring.perfectMs, rate) + EPSILON ? 'perfect' : 'good';
      this.attackGrades[nearest.index] = grade;
      this.combo++; this.bestCombo = Math.max(this.bestCombo, this.combo);
      if (nearest.holdEnd !== undefined) {
        this.results[nearest.index] = 'holding';
        this.held.set(nearest.index, { key: physical, lastPosition: Math.max(nearest.time, time) });
        this.sustainPoints[nearest.index] = this.proportional(nearest, time);
      } else this.results[nearest.index] = grade;
      this.setFeedback(grade, nearest.index);
      this.wrongUntil = -Infinity; this.wrong = false;
    }
    this.revision++;
  }

  keyUp(key: string, time: number, rate = 1, physical = key): void {
    this.down.delete(physical);
    for (const [index, held] of [...this.held]) {
      if (held.key !== physical) continue;
      const target = this.targets[index], end = target.holdEnd!;
      const buffer = holdBufferSeconds(this.scoring.holdReleaseMs, rate, end - target.time);
      const full = time >= end - buffer - EPSILON;
      this.sustainPoints[index] = full ? this.scoring.maxHoldPoints : this.proportional(target, time);
      this.finishHold(index, full);
    }
  }

  blur(): void {
    this.down.clear();
    for (const [index, held] of [...this.held]) {
      this.sustainPoints[index] = this.proportional(this.targets[index], held.lastPosition);
      this.finishHold(index, false);
    }
  }

  private proportional(target: TypingTarget, time: number): number {
    if (target.holdEnd === undefined) return 0;
    return this.scoring.maxHoldPoints * Math.max(0, Math.min(target.holdEnd, time) - target.time) / (target.holdEnd - target.time);
  }
  private finishHold(index: number, full: boolean): void {
    const held = this.held.get(index);
    if (!held) return;
    this.held.delete(index);
    this.results[index] = this.attackGrades[index]!;
    if (full) this.sustainPoints[index] = this.scoring.maxHoldPoints;
    this.revision++;
  }
  private setFeedback(kind: Grade | 'miss' | 'wrong', index: number, letter = this.targets[index]?.letter ?? ''): void {
    this.feedbackKind = kind; this.feedbackIndex = index; this.feedbackLetter = letter; this.feedbackSerial++;
  }
}

export function isGameplayKey(event: KeyboardEvent): boolean {
  if (event.repeat || event.ctrlKey || event.altKey || event.metaKey || event.isComposing || !/^[a-z]$/i.test(event.key)) return false;
  return !event.composedPath().some(target => target instanceof HTMLElement &&
    (target.isContentEditable || target.matches('input, textarea, select, [role="textbox"]')));
}
