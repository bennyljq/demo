import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';

type KeyCap =
  | { kind: 'char'; label: string; value: string }
  | { kind: 'action'; label: string; action: 'shift' | 'backspace' | 'space' | 'enter' };

@Component({
  selector: 'app-typing-homepage',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './typing-homepage.component.html',
  styleUrl: './typing-homepage.component.scss',
})
export class TypingHomepageComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  private rafId: number | null = null;

  private cssWidth = 0;
  private cssHeight = 0;
  private dpr = 1;

  // Keystroke buffer (render last 10)
  private readonly maxKeysToRender = 10;
  private keys: string[] = [];

  // On-screen keyboard state
  showKeyboard = this.isCoarsePointerDevice(); // auto-show on mobile; still toggle-able
  shiftOn = false;

  // Letters only (simple, predictable layout)
  readonly keyboardRows: string[][] = [
    'qwertyuiop'.split(''),
    'asdfghjkl'.split(''),
    'zxcvbnm'.split(''),
  ];

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) throw new Error('Canvas 2D context not available');

    this.ctx = ctx;
    this.resizeCanvas();
    this.startLoop();
  }

  ngOnDestroy(): void {
    if (this.rafId != null) cancelAnimationFrame(this.rafId);
    this.rafId = null;
  }

  // ---- Window listeners ----

  @HostListener('window:resize')
  onResize(): void {
    this.resizeCanvas();
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (event.repeat) return;

    // Optional: ignore typing fields
    const target = event.target as HTMLElement | null;
    const tag = target?.tagName?.toLowerCase();
    const isTypingField =
      tag === 'input' || tag === 'textarea' || (target as any)?.isContentEditable;
    if (isTypingField) return;

    this.pushKey(this.formatKey(event));
  }

  // ---- UI actions ----

  toggleKeyboard(): void {
    this.showKeyboard = !this.showKeyboard;
  }

  pressKey(letter: string): void {
    // Always lowercase or uppercase – choose one.
    // For typing games, lowercase is usually cleaner.
    this.pushKey(letter);
  }

  // ---- Canvas ----

  private resizeCanvas(): void {
    const canvas = this.canvasRef.nativeElement;

    this.cssWidth = window.innerWidth;
    this.cssHeight = window.innerHeight;

    this.dpr = Math.max(1, window.devicePixelRatio || 1);

    canvas.style.width = `${this.cssWidth}px`;
    canvas.style.height = `${this.cssHeight}px`;

    canvas.width = Math.floor(this.cssWidth * this.dpr);
    canvas.height = Math.floor(this.cssHeight * this.dpr);

    // draw in CSS pixels
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  private startLoop(): void {
    const tick = () => {
      this.render();
      this.rafId = requestAnimationFrame(tick);
    };
    tick();
  }

  private render(): void {
    const ctx = this.ctx;

    // Background
    ctx.fillStyle = '#0b1020';
    ctx.fillRect(0, 0, this.cssWidth, this.cssHeight);

    // Header
    ctx.fillStyle = 'rgba(255,255,255,0.92)';
    ctx.font = '16px system-ui, -apple-system, Segoe UI, Roboto, Arial';
    ctx.fillText('Global keystrokes (last 10):', 24, 36);

    // Keystrokes
    ctx.font =
      '14px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';

    const lines = this.keys.length ? this.keys.slice().reverse() : ['—'];
    for (let i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], 24, 64 + i * 18);
    }
  }

  // ---- Keystroke buffer / formatting ----

  private pushKey(display: string): void {
    this.keys.push(display);
    if (this.keys.length > this.maxKeysToRender) this.keys.shift();
  }

  private formatKey(e: KeyboardEvent): string {
    const mods = [
      e.ctrlKey ? 'Ctrl' : null,
      e.altKey ? 'Alt' : null,
      e.metaKey ? 'Meta' : null,
      e.shiftKey ? 'Shift' : null,
    ].filter(Boolean) as string[];

    const key = e.key === ' ' ? 'Space' : e.key;

    if (key === 'Shift' || key === 'Control' || key === 'Alt' || key === 'Meta') return key;

    return mods.length ? `${mods.join('+')}+${key}` : key;
  }

  private formatSynthetic(key: string, mods: { shift?: boolean } = {}): string {
    // Keep it consistent with physical formatting
    const m = [mods.shift ? 'Shift' : null].filter(Boolean) as string[];
    const k = key === ' ' ? 'Space' : key;
    return m.length ? `${m.join('+')}+${k}` : k;
  }

  private isCoarsePointerDevice(): boolean {
    if (typeof window === 'undefined') return false;
    return window.matchMedia?.('(pointer: coarse)').matches ?? false;
  }
}
