import type { PianoNote } from '../music/piano-timeline';
import type { TypingTarget } from '../gameplay/piano-chart';
import type { LetterResult } from '../gameplay/piano-judgement';
import type { ImportedScore } from '../music/musicxml-import';
import type { CountInVisual } from '../audio/piano-playback.service';
import { pitchName } from '../music/piano-pitch';
import { ROLL_PLAYHEAD_X, timeToX } from './piano-roll-geometry';
import { attackWindowSeconds, holdBufferSeconds, ScoringSettings } from '../gameplay/piano-scoring-settings';
import type { CoupledTarget } from '../gameplay/twinkle-coupling';
import type { PerformedBar } from '../audio/player-performance';

export interface JudgementFeedback {
  kind: 'perfect' | 'good' | 'miss' | 'wrong';
  label: string;
  letter: string;
  targetId?: string;
  started: number;
  until: number;
}

interface HitBurst { readonly x: number; readonly y: number; readonly letter: string;
  readonly kind: 'perfect' | 'good'; readonly started: number }

const LETTER_LINE_Y = 82;
const STAGGERED_LETTER_Y = [67, 96] as const;

/** RAF only paints the score position supplied by the sequencer. */
export class PianoRoll {
  private readonly ctx: CanvasRenderingContext2D;
  private readonly observer: ResizeObserver;
  private frame = 0;
  private width = 0;
  private height = 0;
  private dpr = 0;
  private notes?: readonly PianoNote[];
  private low = 48;
  private high = 84;
  private readonly reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  private hitBursts: HitBurst[] = [];

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly readNotes: () => readonly PianoNote[],
    private readonly readPosition: () => number,
    private readonly readTargets: () => readonly (TypingTarget & { result: LetterResult; attackGrade?: 'perfect' | 'good' })[],
    private readonly onFrame: (time: number) => void,
    private readonly readScore: () => ImportedScore | null,
    private readonly readLookAhead: () => number,
    private readonly readSettings: () => ScoringSettings,
    private readonly readStaggerLetters: () => boolean,
    private readonly readRate: () => number,
    private readonly readCountIn: () => CountInVisual | null,
    private readonly readSongBeats: () => readonly number[],
    private readonly readCoupling: () => readonly CoupledTarget[],
    private readonly readPerformedBars: () => readonly PerformedBar[],
  ) {
    this.ctx = canvas.getContext('2d');
    this.observer = new ResizeObserver(() => this.resize());
    this.observer.observe(canvas);
    this.resize();
    this.frame = requestAnimationFrame(this.draw);
  }

  destroy(): void {
    cancelAnimationFrame(this.frame);
    this.observer.disconnect();
  }

  flashHit(target: TypingTarget, kind: 'perfect' | 'good', position: number, lookAhead: number): void {
    this.hitBursts.push({ x: timeToX(target.time, position, this.width, lookAhead),
      y: this.letterY(target.index), letter: target.letter, kind, started: performance.now() });
    if (this.hitBursts.length > 8) this.hitBursts.shift();
  }

  clearEffects(): void { this.hitBursts = []; }

  private letterY(index: number): number {
    return this.readStaggerLetters() ? STAGGERED_LETTER_Y[index % 2] : LETTER_LINE_Y;
  }

  private resize(): void {
    const box = this.canvas.getBoundingClientRect();
    this.width = box.width;
    this.height = box.height;
    this.dpr = window.devicePixelRatio || 1;
    this.canvas.width = Math.round(this.width * this.dpr);
    this.canvas.height = Math.round(this.height * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  private readonly draw = (): void => {
    if (this.dpr !== (window.devicePixelRatio || 1)) this.resize();
    const notes = this.readNotes();
    const coupled = this.readCoupling();
    const melodyIds = new Set(coupled.flatMap(target => target.notes.map(note => note.id)));
    const showMelody = notes.some(note => melodyIds.has(note.id));
    if (notes !== this.notes) {
      this.notes = notes;
      this.low = notes.length ? Math.max(0, Math.min(...notes.map(n => n.pitch)) - (showMelody ? 4 : 2)) : 48;
      this.high = notes.length ? Math.min(127, Math.max(...notes.map(n => n.pitch)) + (showMelody ? 4 : 2)) : 84;
    }
    const position = this.readPosition();
    const countIn = this.readCountIn();
    this.onFrame(position);
    const ahead = this.readLookAhead();
    const x = (time: number) => timeToX(time, position, this.width, ahead);
    const css = getComputedStyle(this.canvas);
    const color = (name: string) => css.getPropertyValue(name).trim();
    const c = this.ctx;
    const top = 145, bottom = this.height - 18;
    const row = (bottom - top) / (this.high - this.low + 1);
    const y = (pitch: number) => top + (this.high - pitch) * row;
    const targets = this.readTargets();
    const settings = this.readSettings();
    const rate = this.readRate();

    c.fillStyle = color('--roll-surface');
    c.fillRect(0, 0, this.width, this.height);
    c.font = '12px sans-serif';
    c.textBaseline = 'middle';
    c.fillStyle = color('--roll-muted');
    c.fillText(countIn ? 'Count-in' : `${position.toFixed(1)} s`, ROLL_PLAYHEAD_X - 14, 13);
    c.fillText(`+${ahead} s`, Math.max(ROLL_PLAYHEAD_X + 36, this.width - 46), 13);
    c.fillStyle = color('--roll-lane');
    c.fillRect(42, 34, Math.max(0, this.width - 42), 78);
    c.strokeStyle = color('--roll-grid-strong');
    c.beginPath(); c.moveTo(42, 122); c.lineTo(this.width, 122); c.stroke();

    for (let pitch = this.low; pitch <= this.high; pitch++) {
      c.strokeStyle = pitch % 12 === 0 ? color('--roll-grid-strong') : color('--roll-grid');
      c.beginPath(); c.moveTo(42, y(pitch)); c.lineTo(this.width, y(pitch)); c.stroke();
      if (pitch % 12 === 0 || pitch === this.low || pitch === this.high) {
        c.fillStyle = color('--roll-muted');
        c.fillText(pitchName(pitch), 4, y(pitch) + row / 2);
      }
    }

    const score = this.readScore();
    if (score) {
      for (const measure of score.measures) {
        if (countIn && measure.start < countIn.songStart - 1e-7) continue;
        const at = x(measure.start);
        if (at < 42 || at > this.width - 2) continue;
        c.strokeStyle = color('--roll-barline');
        c.beginPath(); c.moveTo(at, 118); c.lineTo(at, bottom); c.stroke();
        c.fillStyle = color('--roll-text');
        c.textAlign = 'left';
        const label = `${measure.number}${measure.occurrence > 1 ? `×${measure.occurrence}` : ''}`;
        c.fillText(label, Math.max(42, Math.min(at + 3, this.width - c.measureText(label).width - 3)), 134);
      }
      c.save();
      c.beginPath(); c.rect(42, 19, Math.max(0, this.width - 42), 14); c.clip();
      c.fillStyle = color('--roll-annotation');
      const annotationGroups = new Map<number, string[]>();
      for (const annotation of score.annotations) {
        const at = x(annotation.start);
        if (annotation.kind === 'wedge') {
          const end = x(annotation.end ?? annotation.start);
          if (end < 42 || at > this.width) continue;
          const from = Math.max(42, at), to = Math.min(this.width, end);
          const wideAtStart = annotation.label === 'diminuendo';
          c.strokeStyle = color('--roll-annotation');
          c.beginPath();
          c.moveTo(from, wideAtStart ? 28 : 31); c.lineTo(to, wideAtStart ? 31 : 28);
          c.moveTo(from, wideAtStart ? 32 : 29); c.lineTo(to, wideAtStart ? 29 : 32);
          c.stroke();
          continue;
        }
        if (at < 42 || at > this.width - 15) continue;
        if (!annotationGroups.has(annotation.start)) annotationGroups.set(annotation.start, []);
        annotationGroups.get(annotation.start)!.push(annotation.label);
      }
      for (const [at, labels] of annotationGroups) {
        c.fillText([...new Set(labels)].join(' · '), x(at) + 3, 26);
      }
      c.restore();
    }

    if (countIn) {
      const left = x(countIn.barStart), right = x(countIn.songStart);
      c.strokeStyle = color('--roll-barline'); c.lineWidth = 2;
      for (const at of [left, right]) {
        if (at < 42 || at > this.width) continue;
        c.beginPath(); c.moveTo(at, 34); c.lineTo(at, bottom); c.stroke();
      }
      c.fillStyle = color('--roll-annotation'); c.textAlign = 'left'; c.font = 'bold 12px sans-serif';
      c.fillText('Count-in', Math.max(46, Math.min(left + 6, this.width - 72)), 134);
    }

    c.save();
    c.beginPath(); c.rect(42, top, Math.max(0, this.width - 42), bottom - top); c.clip();
    for (const note of notes) {
      if (countIn && note.start < countIn.songStart - 1e-7) continue;
      if (note.start > position + ahead) break;
      const at = x(note.start);
      const end = x(note.start + note.duration);
      if (end < 42) continue;
      const noteY = y(note.pitch) + 1;
      const height = Math.max(1, row - 2), width = Math.max(1, end - at);
      if (melodyIds.has(note.id)) {
        c.strokeStyle = color('--roll-shadow-note');
        c.lineWidth = 1.4;
        c.setLineDash([4, 3]);
        c.strokeRect(at + 0.5, noteY + 0.5, Math.max(1, width - 1), Math.max(1, height - 1));
        c.setLineDash([]);
        continue;
      }
      const active = note.start <= position && position < note.start + note.duration;
      c.fillStyle = active
        ? color('--roll-active-note') : color('--roll-note');
      c.fillRect(at, noteY, width, height);
      c.strokeStyle = color(active ? '--roll-active-note-edge' : '--roll-note-edge');
      c.lineWidth = active ? 1.6 : 1.2;
      c.strokeRect(at + 0.5, noteY + 0.5, Math.max(1, width - 1), Math.max(1, height - 1));
    }
    if (showMelody) for (const bar of this.readPerformedBars()) {
      const at = x(bar.start), end = x(bar.end ?? position);
      if (at > this.width || end < 42) continue;
      c.fillStyle = color(`--roll-played-${bar.kind}`);
      c.fillRect(at, y(bar.pitch) + 1, Math.max(2, end - at), Math.max(2, row - 2));
      c.strokeStyle = color('--roll-active-note-edge');
      c.lineWidth = 1;
      c.strokeRect(at + 0.5, y(bar.pitch) + 1.5, Math.max(1, end - at - 1), Math.max(1, row - 3));
    }
    c.restore();

    c.save();
    c.beginPath(); c.rect(42, 34, Math.max(0, this.width - 42), 78); c.clip();
    for (const target of targets) {
      if (countIn && target.time < countIn.songStart - 1e-7) continue;
      const at = x(target.time);
      const end = target.holdEnd === undefined ? at : x(target.holdEnd);
      if (at > this.width + 12 || end < 30) continue;
      const center = this.letterY(target.index);
      if (settings.showAttackWindows) {
        const good = attackWindowSeconds(settings.goodMs, rate);
        const perfect = attackWindowSeconds(settings.perfectMs, rate);
        c.fillStyle = color('--roll-good-window');
        c.fillRect(x(target.time - good), center - 13, x(target.time + good) - x(target.time - good), 26);
        c.fillStyle = color('--roll-perfect-window');
        c.fillRect(x(target.time - perfect), center - 13, x(target.time + perfect) - x(target.time - perfect), 26);
      }
      if (target.holdEnd !== undefined) {
        c.strokeStyle = color('--roll-hold');
        c.lineWidth = 5;
        c.beginPath(); c.moveTo(at, center); c.lineTo(end, center); c.stroke();
        if (target.result === 'holding') {
          c.strokeStyle = color('--roll-hold-progress');
          c.lineWidth = 5;
          c.beginPath(); c.moveTo(at, center); c.lineTo(Math.max(at, Math.min(x(position), end)), center); c.stroke();
        }
        c.fillStyle = color('--roll-hold');
        c.fillRect(end - 2, center - 10, 4, 20);
        if (settings.showHoldBuffer) {
          const buffer = holdBufferSeconds(settings.holdReleaseMs, rate, target.holdEnd - target.time);
          c.fillStyle = color('--roll-hold-buffer');
          c.fillRect(x(target.holdEnd - buffer), center - 12, end - x(target.holdEnd - buffer), 24);
        }
      }
      c.save();
      c.translate(at, center);
      c.fillStyle = target.wordIndex % 2 === 0 ? color('--roll-word-a') : color('--roll-word-b');
      c.strokeStyle = { pending: color('--roll-letter-edge'), holding: color(`--roll-${target.attackGrade ?? 'hold'}`),
        skipped: color('--roll-muted'), perfect: color('--roll-perfect'), good: color('--roll-good'),
        miss: color('--roll-miss') }[target.result];
      c.lineWidth = target.result === 'pending' ? 1 : 2.5;
      c.beginPath(); c.roundRect(-12, -12, 24, 24, 5); c.fill(); c.stroke();
      c.fillStyle = color('--roll-letter-text');
      c.font = 'bold 15px sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText(target.letter, 0, 0);
      c.restore();
    }
    c.restore();

    const markerTimes = new Set([...(countIn?.pulsePositions ?? []), ...this.readSongBeats()]);
    for (const beat of markerTimes) {
      const at = x(beat);
      if (at < 43 || at > this.width + 8) continue;
      const active = Math.abs(beat - position) / rate < 0.09;
      this.drawBell(c, at, 42, color('--roll-annotation'), active);
    }

    const now = performance.now();
    this.hitBursts = this.hitBursts.filter(burst => now - burst.started < 560);
    for (const burst of this.hitBursts) {
      const age = (now - burst.started) / 560;
      const strong = burst.kind === 'perfect';
      const hue = color(strong ? '--roll-perfect' : '--roll-good');
      c.save();
      c.globalAlpha = Math.max(0, 1 - age);
      c.translate(burst.x, burst.y);
      if (!this.reducedMotion.matches) c.scale(1 + (strong ? 0.28 : 0.15) * Math.sin(Math.PI * Math.min(1, age * 2)),
        1 + (strong ? 0.28 : 0.15) * Math.sin(Math.PI * Math.min(1, age * 2)));
      c.fillStyle = color('--roll-surface'); c.strokeStyle = hue; c.lineWidth = strong ? 4 : 3;
      c.beginPath(); c.roundRect(-14, -14, 28, 28, 6); c.fill(); c.stroke();
      c.fillStyle = hue; c.font = 'bold 17px sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText(burst.letter, 0, 0);
      if (!this.reducedMotion.matches) {
        c.strokeStyle = hue; c.lineWidth = strong ? 3 : 2;
        c.beginPath(); c.arc(0, 0, 17 + age * (strong ? 21 : 14), 0, Math.PI * 2); c.stroke();
      }
      c.restore();
    }
    c.strokeStyle = color('--roll-playhead');
    c.lineWidth = 2;
    c.beginPath(); c.moveTo(ROLL_PLAYHEAD_X, 34); c.lineTo(ROLL_PLAYHEAD_X, bottom); c.stroke();
    c.lineWidth = 1;
    if (!notes.length) {
      c.fillStyle = color('--roll-muted');
      c.fillText('No notes in this group.', ROLL_PLAYHEAD_X + 16, this.height / 2);
    }
    this.frame = requestAnimationFrame(this.draw);
  };

  private drawBell(c: CanvasRenderingContext2D, x: number, y: number, color: string, active: boolean): void {
    c.save(); c.translate(x, y);
    if (active && !this.reducedMotion.matches) c.scale(1.2, 1.2);
    c.strokeStyle = color; c.fillStyle = color; c.lineWidth = active ? 2.5 : 1.5;
    c.beginPath(); c.moveTo(-5, 4); c.lineTo(-3, 2); c.lineTo(-3, -2);
    c.arc(0, -2, 3, Math.PI, 0); c.lineTo(3, 2); c.lineTo(5, 4); c.closePath(); c.stroke();
    c.beginPath(); c.arc(0, 6, 1.5, 0, Math.PI * 2); c.fill();
    if (active) { c.beginPath(); c.arc(0, 0, 8, 0, Math.PI * 2); c.stroke(); }
    c.restore();
  }
}
