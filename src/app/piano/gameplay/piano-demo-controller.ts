import type { TypingTarget } from './piano-chart';
import { TypingRound } from './piano-judgement';

interface DemoAction { readonly time: number; readonly key: string; readonly release: boolean; readonly order: number }

/** Deterministic authored-chart input, advanced only by the existing audio-clock RAF. */
export class PianoDemoController {
  private readonly actions: readonly DemoAction[];
  private next = 0;
  private cancelled = false;

  constructor(targets: readonly TypingTarget[], private readonly round: TypingRound, private readonly rate: number,
    private readonly onAction?: (key: string, time: number, release: boolean) => void) {
    this.actions = targets.flatMap((target, order) => [
      { time: target.time, key: target.letter, release: false, order },
      { time: target.holdEnd ?? target.time + 0.01, key: target.letter, release: true, order },
    ]).sort((a, b) => a.time - b.time || Number(b.release) - Number(a.release) || a.order - b.order);
  }

  step(position: number): void {
    if (this.cancelled) return;
    while (this.next < this.actions.length && this.actions[this.next].time <= position + 1e-9) {
      const action = this.actions[this.next++];
      if (this.onAction) this.onAction(action.key, action.time, action.release);
      else if (action.release) this.round.keyUp(action.key, action.time, this.rate);
      else this.round.key(action.key, action.time, this.rate, action.time / this.rate);
    }
  }

  cancel(): void { this.cancelled = true; this.round.blur(); }
}
