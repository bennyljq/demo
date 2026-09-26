import type { DemoAction } from '../gameplay/piano-demo-controller';

export interface DemoKeyboardKey { readonly id: string; readonly label: string; readonly units: number }
export type DemoKeyPhase = 'pressed' | 'held' | 'fading';
export interface DemoKeyVisual { readonly phase: DemoKeyPhase; readonly serial: number }

const key = (id: string, label = id, units = 1): DemoKeyboardKey => ({ id, label, units });

/** The main desktop typing block; wider leading keys give the rows their familiar offsets. */
export const DEMO_KEYBOARD_ROWS: readonly (readonly DemoKeyboardKey[])[] = [
  [...'QWERTYUIOP'.split('').map(value => key(value))],
  [...'ASDFGHJKL'.split('').map(value => key(value))],
  [...'ZXCVBNM'.split('').map(value => key(value))]
];

export interface DemoKeyVisibility { readonly minimumMs: number; readonly fadeMs: number }
export const DEMO_KEY_VISIBILITY: DemoKeyVisibility = { minimumMs: 180, fadeMs: 110 };

interface KeyState {
  readonly targetIndex: number;
  readonly serial: number;
  readonly hold: boolean;
  readonly startedAt: number;
  releasedAt?: number;
}

/** Cosmetic state only. Existing Canvas frames sample it; it never schedules music or judgement. */
export class DemoKeyboardPresenter {
  private readonly keys = new Map<string, KeyState>();
  private serial = 0;
  private lastSignature = '';
  private lastSnapshot: Readonly<Record<string, DemoKeyVisual>> = {};

  constructor(private readonly visibility: DemoKeyVisibility = DEMO_KEY_VISIBILITY) {}

  apply(action: DemoAction, observedSourceTime: number, rate: number, nowMs: number): void {
    const id = action.key.toUpperCase();
    if (!/^[A-Z]$/.test(id) || rate <= 0) return;
    // Source-position age reconstructs the event's real time when a visual frame is late.
    const eventAt = nowMs - Math.max(0, observedSourceTime - action.time) / rate * 1000;
    if (action.release) {
      const current = this.keys.get(id);
      if (current?.targetIndex === action.targetIndex) current.releasedAt = eventAt;
      return;
    }
    if (!action.hold && nowMs >= eventAt + this.visibility.minimumMs + this.visibility.fadeMs) return;
    this.keys.set(id, { targetIndex: action.targetIndex, serial: ++this.serial,
      hold: action.hold, startedAt: eventAt });
  }

  snapshot(nowMs: number): Readonly<Record<string, DemoKeyVisual>> {
    const visuals: Record<string, DemoKeyVisual> = {};
    const signature: string[] = [];
    for (const [id, state] of this.keys) {
      const fadeAt = state.releasedAt === undefined ? Infinity : Math.max(state.startedAt + this.visibility.minimumMs, state.releasedAt);
      if (nowMs >= fadeAt + this.visibility.fadeMs) { this.keys.delete(id); continue; }
      const phase: DemoKeyPhase = nowMs >= fadeAt ? 'fading' : state.hold && state.releasedAt === undefined ? 'held' : 'pressed';
      visuals[id] = { phase, serial: state.serial };
      signature.push(`${id}:${phase}:${state.serial}`);
    }
    const nextSignature = signature.join('|');
    if (nextSignature === this.lastSignature) return this.lastSnapshot;
    this.lastSignature = nextSignature;
    this.lastSnapshot = visuals;
    return visuals;
  }

  clear(): void {
    this.keys.clear();
    this.lastSignature = '';
    this.lastSnapshot = {};
  }
}
