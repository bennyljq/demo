import type { PianoNote } from './piano-timeline';
import type { TypingTarget } from './piano-chart';
import type { LetterResult } from './piano-judgement';
import type { ImportedScore } from './musicxml-import';
import { pitchName } from './piano-pitch';
import { ROLL_PLAYHEAD_X, timeToX } from './piano-roll-geometry';
import { attackWindowSeconds, holdBufferSeconds, ScoringSettings } from './piano-scoring-settings';

export interface JudgementFeedback {
  kind: 'perfect' | 'good' | 'miss' | 'wrong';
  label: string;
  letter: string;
  targetId?: string;
  started: number;
  until: number;
}

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

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly readNotes: () => readonly PianoNote[],
    private readonly readPosition: () => number,
    private readonly readTargets: () => readonly (TypingTarget & { result: LetterResult })[],
    private readonly onFrame: (time: number) => void,
    private readonly readFeedback: () => JudgementFeedback | null,
    private readonly readScore: () => ImportedScore | null,
    private readonly readLookAhead: () => number,
    private readonly readSettings: () => ScoringSettings,
    private readonly readRate: () => number,
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
    if (notes !== this.notes) {
      this.notes = notes;
      this.low = notes.length ? Math.max(0, Math.min(...notes.map(n => n.pitch)) - 2) : 48;
      this.high = notes.length ? Math.min(127, Math.max(...notes.map(n => n.pitch)) + 2) : 84;
    }
    const position = this.readPosition();
    this.onFrame(position);
    const ahead = this.readLookAhead();
    const x = (time: number) => timeToX(time, position, this.width, ahead);
    const css = getComputedStyle(this.canvas);
    const color = (name: string) => css.getPropertyValue(name).trim();
    const c = this.ctx;
    const top = 120, bottom = this.height - 18;
    const row = (bottom - top) / (this.high - this.low + 1);
    const y = (pitch: number) => top + (this.high - pitch) * row;
    const laneRows = [57, 82];
    const targets = this.readTargets();
    const settings = this.readSettings();
    const rate = this.readRate();
    const feedback = this.readFeedback();
    const feedbackAge = feedback ? performance.now() - feedback.started : Infinity;

    c.fillStyle = color('--roll-surface');
    c.fillRect(0, 0, this.width, this.height);
    c.font = '12px sans-serif';
    c.textBaseline = 'middle';
    c.fillStyle = color('--roll-muted');
    c.fillText(`${position.toFixed(1)} s`, ROLL_PLAYHEAD_X - 14, 13);
    c.fillText(`+${ahead} s`, Math.max(ROLL_PLAYHEAD_X + 36, this.width - 46), 13);
    c.fillStyle = color('--roll-lane');
    c.fillRect(42, 34, Math.max(0, this.width - 42), 62);
    c.strokeStyle = color('--roll-grid-strong');
    c.beginPath(); c.moveTo(42, 104); c.lineTo(this.width, 104); c.stroke();

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
        const at = x(measure.start);
        if (at < 42 || at > this.width - 2) continue;
        c.strokeStyle = color('--roll-barline');
        c.beginPath(); c.moveTo(at, 98); c.lineTo(at, bottom); c.stroke();
        c.fillStyle = color('--roll-text');
        c.textAlign = 'left';
        const label = `${measure.number}${measure.occurrence > 1 ? `×${measure.occurrence}` : ''}`;
        c.fillText(label, Math.max(42, Math.min(at + 3, this.width - c.measureText(label).width - 3)), 109);
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

    c.save();
    c.beginPath(); c.rect(42, top, Math.max(0, this.width - 42), bottom - top); c.clip();
    for (const note of notes) {
      if (note.start > position + ahead) break;
      const at = x(note.start);
      const end = x(note.start + note.duration);
      if (end < 42) continue;
      const noteY = y(note.pitch) + 1;
      const height = Math.max(1, row - 2), width = Math.max(1, end - at);
      c.fillStyle = note.start <= position && position < note.start + note.duration
        ? color('--roll-active-note') : color('--roll-note');
      c.fillRect(at, noteY, width, height);
      c.strokeStyle = color('--roll-note-edge');
      c.lineWidth = 1;
      c.strokeRect(at + 0.5, noteY + 0.5, Math.max(1, width - 1), Math.max(1, height - 1));
    }
    c.restore();

    c.save();
    c.beginPath(); c.rect(42, 34, Math.max(0, this.width - 42), 62); c.clip();
    for (const target of targets) {
      const at = x(target.time);
      const end = target.holdEnd === undefined ? at : x(target.holdEnd);
      if (at > this.width + 12 || end < 30) continue;
      const center = laneRows[target.index % 2];
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
      const hit = feedback?.targetId === target.id && feedbackAge < 400;
      const pulse = hit && !this.reducedMotion.matches
        ? 1 + (feedback.kind === 'perfect' ? 0.24 : 0.12) * (1 - feedbackAge / 400) : 1;
      c.save();
      c.translate(at, center); c.scale(pulse, pulse);
      c.fillStyle = target.wordIndex % 2 === 0 ? color('--roll-word-a') : color('--roll-word-b');
      c.strokeStyle = { pending: color('--roll-letter-edge'), holding: color('--roll-hold'),
        skipped: color('--roll-muted'), perfect: color('--roll-perfect'), good: color('--roll-good'),
        miss: color('--roll-miss') }[target.result];
      c.lineWidth = target.result === 'pending' ? 1 : 2.5;
      c.beginPath(); c.roundRect(-12, -12, 24, 24, 5); c.fill(); c.stroke();
      c.fillStyle = color('--roll-letter-text');
      c.font = 'bold 15px sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText(target.letter, 0, 0);
      c.restore();
      if (hit && !this.reducedMotion.matches && feedback.kind !== 'wrong') {
        c.strokeStyle = feedback.kind === 'perfect' ? color('--roll-perfect') : color('--roll-good');
        c.globalAlpha = 1 - feedbackAge / 400;
        c.lineWidth = 2;
        c.beginPath(); c.arc(ROLL_PLAYHEAD_X, center, 5 + 12 * feedbackAge / 400, 0, Math.PI * 2); c.stroke();
        c.globalAlpha = 1;
      }
    }
    c.restore();
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
}
