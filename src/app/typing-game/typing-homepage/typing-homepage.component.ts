import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { THEMED_WORDS_BY_SECRET } from './word-dict'

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

  // Keystroke buffer
  public keys: string[] = [];
  public readonly maxKeysToRender = 20;

  // On-screen keyboard state
  showKeyboard = this.isCoarsePointerDevice(); // auto-show on mobile; still toggle-able
  shiftOn = false;

  // Letters only (simple, predictable layout)
  readonly keyboardRows: string[][] = [
    'qwertyuiop'.split(''),
    'asdfghjkl'.split(''),
    'zxcvbnm'.split(''),
  ];

  // Game states
  public isGameStarted = false;
  private isGameOver = false;
  private readonly startWord = 'start';
  private wordBank = ['hello', 'there', 'general', 'kenobi'];
  private isWin = false;
  // --- Secret-word run config ---
  private secretWord = ''; // chosen per run

  // Minimal themed dictionary (extend later)
  private readonly themedWordsBySecret = THEMED_WORDS_BY_SECRET

  private currentWordIndex = 0;
  private currentWord = this.wordBank[0];

  private roundStartMs: number | null = null;
  private readonly baseRoundMs = 10_000;   // start at 10s
  private readonly minRoundMs = 2_000;     // never go below this
  private readonly speedUp = 0.85;         // 10% faster each word

  private getRoundMs(): number {
    // word 0 => 10000ms, word 1 => 9000ms, word 2 => 8100ms, ...
    const ms = this.baseRoundMs * Math.pow(this.speedUp, this.currentWordIndex);
    return Math.max(this.minRoundMs, Math.round(ms));
  }

  private lastInputMs = 0;
  private lastInputWasCorrect = true;

  private readonly wrongFlashMs = 150;

  private hintCount = 1;
  private get totalHints(): number {
    return this.wordBank.length;
  }


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

    const target = event.target as HTMLElement | null;
    const tag = target?.tagName?.toLowerCase();
    const isTypingField =
      tag === 'input' || tag === 'textarea' || (target as any)?.isContentEditable;
    if (isTypingField) return;

    // Space clears instead of being recorded
    if (event.key === ' ') {
      event.preventDefault();
      this.pressSpace()
      return;
    }

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

  pressSpace(): void {
    // this.clearKeys();
    if (this.isGameOver || this.isWin) {
      this.restartGame()
    }
  }

  private clearKeys(): void {
    this.keys = [];
  }

  public restartGame(): void {
    this.isWin = false;
    this.isGameOver = false;
    this.isGameStarted = false;
    this.clearKeys();
    this.currentWordIndex = 0;
    this.currentWord = this.wordBank[0];
    this.roundStartMs = null;
    this.lastInputWasCorrect = true;
    this.hintCount = 1;
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

  private getStartProgress(): number {
    // How many of the last N keystrokes match "start" from the beginning.
    // Examples:
    // keys end with "s"     => 1
    // keys end with "st"    => 2
    // keys end with "sta"   => 3
    // keys end with "xst"   => 0 (not in-order)
    const joined = this.keys.join('');

    for (let n = this.startWord.length; n >= 1; n--) {
      if (joined.endsWith(this.startWord.slice(0, n))) return n;
    }
    return 0;
  }
  private renderStartWord(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number
  ): void {
    const word = 'start';
    const progress = this.getStartProgress(); // 0..5

    // Slight letter spacing for readability
    const spacing = 32;

    const startX = x - ((word.length - 1) * spacing) / 2;

    ctx.save()
    ctx.font = '700 56px ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace';
    for (let i = 0; i < word.length; i++) {
      ctx.fillStyle = i < progress ? 'gold' : '#ffffff';
      ctx.fillText(
        word[i],
        Math.round(startX + i * spacing),
        y
      );
    }
    ctx.restore();
  }

  private render(): void {
    const ctx = this.ctx;

    // Background
    ctx.fillStyle = 'CornflowerBlue';
    ctx.fillRect(0, 0, this.cssWidth, this.cssHeight);

    const centerX = Math.round(this.cssWidth / 2);
    const centerY = Math.round(this.cssHeight / 2);

    if (!this.isGameStarted) {
      ctx.save();

      ctx.font = '700 18px Inter, system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      let lineHeight = 28;

      ctx.fillStyle = 'black';
      ctx.fillText('1. type the words before the timer runs out', centerX, centerY - 8 * lineHeight);
      ctx.fillText('2. each word is a hint to a secret word', centerX, centerY - 7 * lineHeight);
      ctx.fillText('3. to win, type the secret word', centerX, centerY - 6 * lineHeight);
      ctx.fillText('WHILE the game is ongoing', centerX, centerY - 5 * lineHeight);
      ctx.fillText('4. you lose if the hints run out', centerX, centerY - 4 * lineHeight);

      ctx.font = '600 32px Inter, system-ui, sans-serif';
      lineHeight = 44;
      ctx.fillStyle = 'MidnightBlue';
      ctx.fillText('type', centerX, centerY - lineHeight);

      this.renderStartWord(ctx, centerX, centerY);

      ctx.fillStyle = 'MidnightBlue';
      ctx.fillText('to begin', centerX, centerY + lineHeight);

      ctx.restore();
      return;
    }

    if (this.isWin) {
      ctx.save();

      ctx.globalAlpha = 0.35;
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, this.cssWidth, this.cssHeight);
      ctx.globalAlpha = 1;

      const cx = Math.round(this.cssWidth / 2);
      const cy = Math.round(this.cssHeight / 2);

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#fff';

      ctx.font = '900 64px ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace';
      ctx.fillText('YOU WIN', cx, cy - 40);

      // Secret word reveal
      ctx.font = '600 28px ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace';
      ctx.fillText(`secret word was "${this.secretWord}"`, cx, cy + 10);

      // Restart hint
      ctx.font = '500 22px ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace';
      ctx.fillText('press space to restart', cx, cy + 56);

      ctx.restore();
      return;
    }

    if (this.isGameOver) {
      ctx.save();

      // Dim overlay
      ctx.globalAlpha = 0.35;
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, this.cssWidth, this.cssHeight);
      ctx.globalAlpha = 1;

      const cx = Math.round(this.cssWidth / 2);
      const cy = Math.round(this.cssHeight / 2);

      // Title
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#fff';
      ctx.font = '800 64px ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace';
      ctx.fillText('GAME OVER', cx, cy - 24);

      // Subtitle
      ctx.font = '600 24px ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace';
      ctx.fillText('Press space to restart', cx, cy + 36);

      ctx.restore();
      return;
    }

    // ---- Game started: render current word + timer bar ----
    if (this.roundStartMs == null) this.roundStartMs = performance.now();

    const now = performance.now();
    const elapsed = now - this.roundStartMs;
    const roundMs = this.getRoundMs();
    const t = Math.min(1, Math.max(0, elapsed / roundMs));
    const remainingFrac = 1 - t;

    if (elapsed >= roundMs && !this.isWin) {
      this.isGameOver = true;
    }

    ctx.save();

    // Word
    ctx.font = '700 56px ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';
    this.renderCurrentWord(ctx, centerX, centerY);

    // Timer bar (below word)
    const barWidth = Math.min(520, Math.round(this.cssWidth * 0.7));
    const barHeight = 12;
    const barY = centerY + 54; // tuned for 56px font; adjust if needed
    const barX = Math.round(centerX - barWidth / 2);

    // Track
    ctx.globalAlpha = 0.35;
    ctx.fillRect(barX, barY, barWidth, barHeight);

    // Fill (remaining time)
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(barX, barY, Math.round(barWidth * remainingFrac), barHeight);

    ctx.restore();

    // Hint counter
    ctx.save();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';
    ctx.font = '500 18px ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace';

    ctx.fillText(
      `hints: ${this.hintCount}/${this.totalHints}`, centerX, centerY - 100
    );

    ctx.restore();

  }

  // ---- Keystroke buffer / formatting ----

  private checkSecretWordWin(): void {
    const len = this.secretWord.length;
    const tail = this.keys.slice(-len).join('');

    if (tail === this.secretWord) {
      this.isWin = true;
      this.isGameOver = false;     // ensure win overrides lose
    }
  }

  private pushKey(display: string): void {
    if (this.isWin || this.isGameOver) return;

    // Pre-game: buffer + check for "start"
    if (!this.isGameStarted) {
      this.keys.push(display);
      if (this.keys.length > this.maxKeysToRender) this.keys.shift();

      this.checkStrings();
      return;
    }

    // --- Game started: expected-next-letter validation (before push) ---
    const progress = this.getWordProgress();
    const expected = (progress < this.currentWord.length) ? this.currentWord[progress] : null;

    this.keys.push(display);
    if (this.keys.length > this.maxKeysToRender) this.keys.shift();

    // SILENT WIN CHECK (happens regardless of correctness for currentWord)
    this.checkSecretWordWin();
    if (this.isWin) return;

    const isCorrect = expected !== null && display === expected;
    this.lastInputMs = performance.now();
    this.lastInputWasCorrect = isCorrect;

    this.checkWordCompletion();
  }

  private shuffle<T>(arr: T[]): T[] {
    const a = [...arr]; // copy – do NOT mutate dictionary
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  private startNewRun(): void {
    const secrets = Object.keys(this.themedWordsBySecret);
    const i = Math.floor(Math.random() * secrets.length);
    this.secretWord = secrets[i];

    this.wordBank = this.shuffle(this.themedWordsBySecret[this.secretWord]);

    this.currentWordIndex = 0;
    this.currentWord = this.wordBank[0];

    this.isGameStarted = true;
    this.isGameOver = false;
    this.isWin = false;

    this.clearKeys();
    this.roundStartMs = performance.now();
    this.lastInputWasCorrect = true;
  }

  private checkStrings(): void {
    if (!this.isGameStarted && this.keys.slice(-5).join('') === 'start') {
      this.startNewRun();
    }
  }

  private getWordProgress(): number {
    const len = this.currentWord.length;

    // Only look at the last N keys (tail) instead of joining the whole buffer
    const tail = this.keys.slice(-len).join('');

    for (let n = len; n >= 1; n--) {
      if (tail.endsWith(this.currentWord.slice(0, n))) return n;
    }
    return 0;
  }

  private checkWordCompletion(): void {
    const len = this.currentWord.length;
    const tail = this.keys.slice(-len).join('');

    if (tail === this.currentWord) {
      this.hintCount++;          // player typed a hint word
      this.advanceToNextWord();
    }
  }

  private advanceToNextWord(): void {
    this.clearKeys();

    this.currentWordIndex++;

    // LOSE if we ran out of words
    if (this.currentWordIndex >= this.wordBank.length) {
      this.isGameOver = true;
      return;
    }

    this.currentWord = this.wordBank[this.currentWordIndex];
    this.roundStartMs = performance.now();
    this.lastInputWasCorrect = true;
  }

  private renderCurrentWord(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number
  ): void {
    const word = this.currentWord;
    const progress = this.getWordProgress(); // 0..word.length

    const spacing = 32;
    const startX = x - ((word.length - 1) * spacing) / 2;

    const now = performance.now();

    // SIMPLE FIX: flash only when the last keystroke was wrong
    const flashWrong =
      !this.lastInputWasCorrect &&
      (now - this.lastInputMs) <= this.wrongFlashMs;

    const nextIndex = Math.min(progress, word.length - 1);

    for (let i = 0; i < word.length; i++) {
      let colour = i < progress ? 'gold' : '#ffffff';

      if (flashWrong && i === nextIndex) {
        colour = 'tomato';
      }

      ctx.fillStyle = colour;
      ctx.fillText(word[i], Math.round(startX + i * spacing), y);
    }
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

    return mods.length ? `${mods.join('+')}+${key}` : key.toLowerCase();
  }

  private isCoarsePointerDevice(): boolean {
    if (typeof window === 'undefined') return false;
    return window.matchMedia?.('(pointer: coarse)').matches ?? false;
  }
}
