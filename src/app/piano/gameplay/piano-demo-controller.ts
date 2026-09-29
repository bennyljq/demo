import type { TypingTarget } from './piano-chart';
import { TypingRound } from './piano-judgement';
import { EIGHT_KEYS, PianoMode } from './piano-mode';

export interface DemoAction {
  readonly time: number;
  readonly key: string;
  readonly targetIndex: number;
  readonly release: boolean;
  readonly hold: boolean;
}

/** One ordered event plan feeds both audio scheduling and clock-sampled UI judgement. */
export class PianoDemoController {
  readonly actions: readonly DemoAction[];
  private next = 0;
  private cancelled = false;

  constructor(targets: readonly TypingTarget[], private readonly round: TypingRound, private readonly rate: number,
    private readonly onAction?: (action: DemoAction) => void, mode: PianoMode = round.mode,
    eightKeyBindings = round.eightKeyBindings) {
    const heldUntil = new Map<string, number>();
    const keys = targets.map((target, index) => {
      if (mode === 'eight-keys') return eightKeyBindings[EIGHT_KEYS.indexOf(target.letter)];
      if (mode !== 'rhythm') return target.letter;
      const choices = index % 2 ? ['J', 'F', 'K', 'D', 'L', 'S'] : ['F', 'J', 'D', 'K', 'S', 'L'];
      const key = choices.find(candidate => (heldUntil.get(candidate) ?? -Infinity) <= target.time) ?? choices[0];
      if (target.holdEnd !== undefined) heldUntil.set(key, target.holdEnd);
      return key;
    });
    this.actions = targets.flatMap((target, index) => [
      { time: target.time, key: keys[index], targetIndex: target.index, release: false, hold: target.holdEnd !== undefined },
      { time: target.holdEnd ?? Math.min(target.time + 0.13 * rate,
          targets.find((next, nextIndex) => nextIndex > index && next.time > target.time + 1e-9 && keys[nextIndex] === keys[index])?.time ?? Infinity), key: keys[index],
        targetIndex: target.index, release: true, hold: target.holdEnd !== undefined },
    ]).sort((a, b) => a.time - b.time || Number(b.release) - Number(a.release) || a.targetIndex - b.targetIndex);
  }

  step(position: number): void {
    if (this.cancelled) return;
    while (this.next < this.actions.length && this.actions[this.next].time <= position + 1e-9) {
      const action = this.actions[this.next++];
      if (this.onAction) this.onAction(action);
      else if (action.release) this.round.keyUp(action.key, action.time, this.rate);
      else this.round.key(action.key, action.time, this.rate, action.time / this.rate);
    }
  }

  cancel(): void { this.cancelled = true; this.round.blur(); }
}
