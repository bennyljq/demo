import type { PianoNote } from './piano-timeline';
import type { TypingTarget } from './piano-chart';
import type { LetterResult } from './piano-judgement';

export interface JudgementFeedback {
  kind: 'perfect' | 'good' | 'miss' | 'wrong';
  label: string;
  started: number;
  until: number;
}

/** Canvas-only view: RAF samples the sequencer position; it never advances time. */
export class PianoRoll {
  private readonly context: CanvasRenderingContext2D;
  private readonly resizeObserver: ResizeObserver;
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
    private readonly readTargets: () => readonly (TypingTarget & { result: LetterResult })[] = () => [],
    private readonly onFrame: (time: number) => void = () => {},
    private readonly readFeedback: () => JudgementFeedback | null = () => null,
  ) {
    this.context = canvas.getContext('2d');
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(canvas);
    this.resize();
    this.frame = requestAnimationFrame(this.draw);
  }

  destroy(): void {
    cancelAnimationFrame(this.frame);
    this.resizeObserver.disconnect();
  }

  private resize(): void {
    const { width, height } = this.canvas.getBoundingClientRect();
    this.width = width;
    this.height = height;
    this.dpr = window.devicePixelRatio || 1;
    this.canvas.width = Math.round(width * this.dpr);
    this.canvas.height = Math.round(height * this.dpr);
    this.context.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  private readonly draw = (): void => {
    if (this.dpr !== (window.devicePixelRatio || 1)) this.resize();
    const notes = this.readNotes();
    if (notes !== this.notes) {
      this.notes = notes;
      this.low = notes.length ? Math.max(0, Math.min(...notes.map(note => note.pitch)) - 2) : 48;
      this.high = notes.length ? Math.min(127, Math.max(...notes.map(note => note.pitch)) + 2) : 84;
    }
    const time = this.readPosition();
    this.onFrame(time);
    const ctx = this.context;
    const playhead = 72;
    const top = 90;
    const bottom = this.height - 20;
    const row = (bottom - top) / (this.high - this.low + 1);
    const scale = Math.max(1, this.width - playhead - 12) / 4;
    const y = (pitch: number) => top + (this.high - pitch) * row;

    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, this.width, this.height);
    ctx.font = '12px sans-serif';
    ctx.textBaseline = 'middle';
    ctx.save();
    ctx.beginPath();
    ctx.rect(42, 28, Math.max(0, this.width - 42), 42);
    ctx.clip();
    for (const target of this.readTargets()) {
      const x = playhead + (target.time - time) * scale;
      if (x < 42 || x > this.width) continue;
      ctx.fillStyle = { pending: '#334155', perfect: '#15803d', good: '#a16207', miss: '#b42318' }[target.result];
      ctx.textAlign = 'center';
      ctx.fillText(target.letter, x, 39);
      ctx.fillRect(x - 1, 50, 2, 12);
    }
    ctx.restore();
    ctx.strokeStyle = '#cbd5e1';
    ctx.beginPath();
    ctx.moveTo(42, 70);
    ctx.lineTo(this.width, 70);
    ctx.stroke();
    for (let pitch = this.low; pitch <= this.high; pitch++) {
      ctx.strokeStyle = pitch % 12 === 0 ? '#cbd5e1' : '#e8edf3';
      ctx.beginPath();
      ctx.moveTo(42, y(pitch));
      ctx.lineTo(this.width, y(pitch));
      ctx.stroke();
      if (pitch % 12 === 0 || pitch === this.low || pitch === this.high) {
        ctx.fillStyle = '#475569';
        ctx.fillText(String(pitch), 8, y(pitch) + row / 2);
      }
    }
    ctx.save();
    ctx.beginPath();
    ctx.rect(42, top, Math.max(0, this.width - 42), bottom - top);
    ctx.clip();
    for (const note of notes) {
      if (note.start > time + 4) break;
      const x = playhead + (note.start - time) * scale;
      const width = Math.max(1, note.duration * scale);
      if (x + width < 42) continue;
      ctx.fillStyle = note.start <= time && time < note.start + note.duration ? '#15803d' : '#2563eb';
      ctx.fillRect(x, y(note.pitch) + 1, width, Math.max(1, row - 2));
    }
    ctx.restore();
    ctx.strokeStyle = '#111827';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(playhead, 28);
    ctx.lineTo(playhead, bottom);
    ctx.stroke();
    ctx.lineWidth = 1;
    const feedback = this.readFeedback();
    const age = feedback ? performance.now() - feedback.started : Infinity;
    if (feedback?.kind === 'perfect' && age < 300 && !this.reducedMotion.matches) {
      ctx.save();
      ctx.strokeStyle = '#15803d';
      ctx.globalAlpha = 1 - age / 300;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(playhead, 53, 5 + 14 * age / 300, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
    ctx.fillStyle = '#334155';
    ctx.fillText(`${time.toFixed(1)} s`, playhead - 12, 14);
    ctx.fillText('+4 s', Math.max(playhead + 36, this.width - 40), 14);
    if (!notes.length) ctx.fillText('No notes in this track.', playhead + 16, this.height / 2);
    this.frame = requestAnimationFrame(this.draw);
  };
}
