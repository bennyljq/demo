import type { TypingTarget } from './piano-chart';

export const TIMING_WINDOWS = { perfect: 0.080, good: 0.160, wrongFeedback: 0.5 } as const;
export type LetterResult = 'pending' | 'perfect' | 'good' | 'miss';
const EPSILON = 1e-9; // Inclusive decimal boundaries despite floating-point subtraction.

/** Pure judgement: every operation receives sequencer time, never wall-clock time. */
export class TypingRound {
  results: LetterResult[];
  complete = false;
  listening = true;
  wrongUntil = -Infinity;
  wrong = false;
  revision = 0;
  feedbackSerial = 0;
  feedbackKind: 'perfect' | 'good' | 'miss' | 'wrong' | undefined;

  constructor(readonly targets: readonly TypingTarget[]) { this.reset(); }

  reset(): void {
    this.results = this.targets.map(() => 'pending');
    this.complete = false;
    this.listening = true;
    this.wrong = false;
    this.wrongUntil = -Infinity;
    this.feedbackKind = undefined;
    this.revision++;
  }

  advance(time: number, rate = 1, cosmeticTime = time): void {
    let missed = false;
    for (const target of this.targets) {
      if (this.results[target.index] === 'pending' && (time - target.time) / rate > TIMING_WINDOWS.good + EPSILON) {
        this.results[target.index] = 'miss';
        this.revision++;
        missed = true;
      }
    }
    if (missed) this.setFeedback('miss');
    const listening = (time - this.targets[0].time) / rate < -TIMING_WINDOWS.good;
    const complete = (time - this.targets[this.targets.length - 1].time) / rate > TIMING_WINDOWS.good + EPSILON;
    const wrong = cosmeticTime < this.wrongUntil;
    if (listening !== this.listening || complete !== this.complete || wrong !== this.wrong) this.revision++;
    this.listening = listening;
    this.complete = complete;
    this.wrong = wrong;
  }

  key(key: string, time: number, rate = 1, cosmeticTime = time): void {
    this.advance(time, rate, cosmeticTime);
    if (this.complete || this.listening) return;
    let nearest: TypingTarget | undefined;
    let distance = Infinity;
    for (const target of this.targets) {
      const delta = Math.abs(time - target.time) / rate;
      if (this.results[target.index] === 'pending' && delta <= TIMING_WINDOWS.good + EPSILON && delta < distance - EPSILON) {
        nearest = target;
        distance = delta;
      }
    }
    if (!nearest) return;
    if (key.toUpperCase() !== nearest.letter) {
      this.wrongUntil = cosmeticTime + TIMING_WINDOWS.wrongFeedback;
      this.wrong = true;
      this.setFeedback('wrong');
    } else {
      this.results[nearest.index] = distance <= TIMING_WINDOWS.perfect + EPSILON ? 'perfect' : 'good';
      this.setFeedback(this.results[nearest.index] as 'perfect' | 'good');
      this.wrongUntil = -Infinity;
      this.wrong = false;
    }
    this.revision++;
  }

  private setFeedback(kind: 'perfect' | 'good' | 'miss' | 'wrong'): void {
    this.feedbackKind = kind;
    this.feedbackSerial++;
  }
}

export function isGameplayKey(event: KeyboardEvent): boolean {
  if (event.repeat || event.ctrlKey || event.altKey || event.metaKey || event.isComposing || !/^[a-z]$/i.test(event.key)) return false;
  return !event.composedPath().some(target => target instanceof HTMLElement &&
    (target.isContentEditable || target.matches('input, textarea, select, [role="textbox"]')));
}
