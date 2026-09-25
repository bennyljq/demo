import type { CoupledTarget } from '../gameplay/twinkle-coupling';

export type PerformanceKind = 'perfect' | 'good' | 'wrong';
export interface PerformedBar {
  readonly id: number;
  readonly targetIndex: number;
  readonly pitch: number;
  readonly start: number;
  readonly kind: PerformanceKind;
  readonly plannedEnd?: number;
  end?: number;
}
export interface PlayerNoteSink {
  now(): number;
  newChannel(): number;
  noteOn(channel: number, pitch: number, velocity: number, at: number): void;
  noteOff(channel: number, pitch: number, at: number): void;
}
interface Voice {
  id: number;
  targetIndex: number;
  physical: string;
  hold: boolean;
  channel: number;
  untilAt?: number;
  bars: PerformedBar[];
}

const WRONG_OFFSETS = [-2, -1, 1, 2] as const;
export function wrongPitchOffset(targetIndex: number, attempt: number): number {
  return WRONG_OFFSETS[(targetIndex + attempt) % WRONG_OFFSETS.length];
}

/** Player voices share the existing synth but use channels without accompaniment pedal state. */
export class PlayerPerformance {
  private readonly active = new Map<number, Voice>();
  private readonly physical = new Map<string, Voice>();
  private readonly channels: { number: number; busyUntil: number }[] = [];
  private readonly wrongAttempts = new Map<number, number>();
  private bars: PerformedBar[] = [];
  private serial = 0;

  constructor(private readonly targets: readonly CoupledTarget[], private readonly sink: PlayerNoteSink) {}

  get intendedNoteIds(): ReadonlySet<string> {
    return new Set(this.targets.flatMap(target => target.notes.map(note => note.id)));
  }

  perform(targetIndex: number, kind: PerformanceKind, physical: string, position: number, rate: number): boolean {
    const target = this.targets[targetIndex];
    if (!target || !Number.isFinite(position) || rate <= 0) return false;
    const now = this.sink.now();
    this.reap(now);
    const old = this.active.get(targetIndex);
    if (old) this.releaseVoice(old, position, now);
    const offset = kind === 'wrong' ? wrongPitchOffset(targetIndex, this.wrongAttempts.get(targetIndex) ?? 0) : 0;
    if (kind === 'wrong') this.wrongAttempts.set(targetIndex, (this.wrongAttempts.get(targetIndex) ?? 0) + 1);
    const notes = target.notes.map(note => ({ note, pitch: note.pitch + offset,
      end: note.start + note.duration,
      endAt: now + (note.start + note.duration - position) / rate }))
      .filter(entry => target.hold || entry.endAt > now + 1e-6);
    if (!notes.length) return false; // An accepted late attack after its source endpoint stays silent.
    const channel = this.acquire(now);
    if (channel < 0) return false;
    const voice: Voice = { id: ++this.serial, targetIndex, physical, hold: target.hold, channel,
      untilAt: target.hold ? undefined : Math.max(...notes.map(entry => entry.endAt)), bars: [] };
    for (const entry of notes) {
      const bar: PerformedBar = { id: voice.id, targetIndex, pitch: entry.pitch, start: position, kind,
        plannedEnd: target.hold ? undefined : entry.end };
      voice.bars.push(bar);
      this.bars.push(bar);
      this.sink.noteOn(channel, entry.pitch, entry.note.velocity, now);
      if (!target.hold) this.sink.noteOff(channel, entry.pitch, entry.endAt);
    }
    this.active.set(targetIndex, voice);
    if (target.hold) this.physical.set(physical, voice);
    this.channels.find(item => item.number === channel)!.busyUntil = voice.untilAt ?? Infinity;
    return true;
  }

  releasePhysical(physical: string, position: number): void {
    const voice = this.physical.get(physical);
    if (voice && this.active.get(voice.targetIndex)?.id === voice.id)
      this.releaseVoice(voice, position, this.sink.now());
  }

  releaseAll(position: number, clearBars = false): void {
    const now = this.sink.now();
    for (const voice of [...this.active.values()]) this.releaseVoice(voice, position, now);
    this.physical.clear();
    this.wrongAttempts.clear();
    if (clearBars) this.bars = [];
  }

  snapshot(position: number): readonly PerformedBar[] {
    this.reap(this.sink.now());
    return this.bars.map(bar => ({ ...bar, end: bar.end ?? Math.min(position, bar.plannedEnd ?? position) }));
  }

  private acquire(now: number): number {
    const reusable = this.channels.find(channel => channel.busyUntil <= now);
    if (reusable) return reusable.number;
    const number = this.sink.newChannel();
    if (number < 0) return -1;
    this.channels.push({ number, busyUntil: now });
    return number;
  }

  private releaseVoice(voice: Voice, position: number, now: number): void {
    if (this.active.get(voice.targetIndex)?.id !== voice.id) return;
    for (const bar of voice.bars) {
      if (voice.hold || !voice.untilAt || now < voice.untilAt) this.sink.noteOff(voice.channel, bar.pitch, now);
      bar.end = Math.max(bar.start, Math.min(position, bar.plannedEnd ?? position));
    }
    this.active.delete(voice.targetIndex);
    if (this.physical.get(voice.physical)?.id === voice.id) this.physical.delete(voice.physical);
    const channel = this.channels.find(item => item.number === voice.channel)!;
    channel.busyUntil = voice.untilAt === undefined ? now + 0.05 : Math.max(voice.untilAt, now + 0.05);
  }

  private reap(now: number): void {
    for (const voice of [...this.active.values()]) {
      if (voice.untilAt === undefined || now < voice.untilAt) continue;
      for (const bar of voice.bars) bar.end = bar.plannedEnd;
      this.active.delete(voice.targetIndex);
      this.channels.find(item => item.number === voice.channel)!.busyUntil = now;
    }
  }
}
