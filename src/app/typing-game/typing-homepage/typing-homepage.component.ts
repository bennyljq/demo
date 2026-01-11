import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { THEMED_WORDS_BY_SECRET } from '../word-dict';
import { renderSplashScreen } from '../splash-screen';

@Component({
  selector: 'app-typing-homepage',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './typing-homepage.component.html',
  styleUrl: './typing-homepage.component.scss',
})
export class TypingHomepageComponent implements AfterViewInit, OnDestroy {
  // ===========================================================================
  // View / render infrastructure
  // ===========================================================================

  @ViewChild('canvas', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  private rafId: number | null = null;

  /** Canvas logical size in CSS pixels (render space). */
  private cssWidth = 0;
  private cssHeight = 0;

  /** Device pixel ratio for crisp rendering. */
  private dpr = 1;

  // ===========================================================================
  // Input / HUD (latest keystrokes)
  // ===========================================================================

  /** Latest keystrokes shown in the HUD. */
  public keys: string[] = [];
  public readonly maxKeysToRender = 25;

  private clearKeys(): void {
    this.keys = [];
  }

  // ===========================================================================
  // Game content (secret + themed word bank)
  // ===========================================================================

  /** Theming dictionary (secret -> themed word list). */
  private readonly themedWordsBySecret = THEMED_WORDS_BY_SECRET;

  /** Secret word (not rendered); chosen per run. */
  private secretWord = '';

  /** Visible word bank for the run (scrambled from theme list). */
  private wordBank: string[] = [];

  private shuffle<T>(arr: T[]): T[] {
    const a = [...arr]; // copy – do NOT mutate dictionary
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // ===========================================================================
  // Game state
  // ===========================================================================

  public isGameStarted = false;
  private isGameOver = false;
  private isWin = false;
  public showSplashScreen = true;

  /** Tutorial gate word. */
  private readonly startWord = 'start';

  /** Current visible word index within this.wordBank. */
  private currentWordIndex = 0;

  /** Current visible word to type. */
  private currentWord = this.wordBank[0];

  /** “Hints used” equals number of completed visible words. */
  private hintCount = 1;

  private get totalHints(): number {
    return this.wordBank.length;
  }

  // ===========================================================================
  // Timing / difficulty
  // ===========================================================================

  private roundStartMs: number | null = null;

  /** Round time shrinks as currentWordIndex increases. */
  private readonly baseRoundMs = 10_000; // start at 10s
  private readonly minRoundMs = 2_000; // never go below this
  private readonly speedUp = 0.85; // faster each word

  private getRoundMs(): number {
    const ms = this.baseRoundMs * Math.pow(this.speedUp, this.currentWordIndex);
    return Math.max(this.minRoundMs, Math.round(ms));
  }

  // ===========================================================================
  // Per-letter visual feedback (current word)
  // ===========================================================================

  private lastInputMs = 0;
  private lastInputWasCorrect = true;

  private readonly wrongFlashMs = 150;

  // ===========================================================================
  // Angular lifecycle
  // ===========================================================================

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

  // ===========================================================================
  // Window listeners
  // ===========================================================================

  @HostListener('window:resize')
  onResize(): void {
    this.resizeCanvas();
  }

  /**
   * Primary input path (physical keyboard).
   * Note: this game intentionally does not support soft keyboards.
   */
  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (event.repeat) return;

    const target = event.target as HTMLElement | null;
    const tag = target?.tagName?.toLowerCase();
    const isTypingField =
      tag === 'input' || tag === 'textarea' || (target as any)?.isContentEditable;
    if (isTypingField) return;

    // Space is a control action (never recorded).
    if (event.key === ' ') {
      event.preventDefault();
      this.pressSpace();
    }

    this.pushKey(this.formatKey(event));
  }

  /** Space is reserved: used to restart after win/lose. */
  pressSpace(): void {
    if (this.isGameOver || this.isWin) {
      this.restartGame();
    }
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

  // ===========================================================================
  // Canvas loop / sizing
  // ===========================================================================

  private resizeCanvas(): void {
    const canvas = this.canvasRef.nativeElement;

    this.cssWidth = window.innerWidth;
    this.cssHeight = window.innerHeight;

    this.dpr = Math.max(1, window.devicePixelRatio || 1);

    canvas.style.width = `${this.cssWidth}px`;
    canvas.style.height = `${this.cssHeight}px`;

    canvas.width = Math.floor(this.cssWidth * this.dpr);
    canvas.height = Math.floor(this.cssHeight * this.dpr);

    // Draw in CSS pixels.
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  private startLoop(): void {
    const tick = () => {
      this.render();
      this.rafId = requestAnimationFrame(tick);
    };
    tick();
  }

  // ===========================================================================
  // Pre-game: "type start to begin"
  // ===========================================================================

  private getStartProgress(): number {
    // Prefix-progress of the last N keystrokes vs "start".
    const joined = this.keys.join('');
    for (let n = this.startWord.length; n >= 1; n--) {
      if (joined.endsWith(this.startWord.slice(0, n))) return n;
    }
    return 0;
  }

  private renderStartWord(ctx: CanvasRenderingContext2D, x: number, y: number): void {
    const word = 'start';
    const progress = this.getStartProgress();
    const spacing = 32;
    const startX = x - ((word.length - 1) * spacing) / 2;

    ctx.save();
    ctx.font =
      '700 56px ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace';

    for (let i = 0; i < word.length; i++) {
      ctx.fillStyle = i < progress ? 'gold' : '#ffffff';
      ctx.fillText(word[i], Math.round(startX + i * spacing), y);
    }

    ctx.restore();
  }

  // ===========================================================================
  // Game loop: rendering
  // ===========================================================================

  private render(): void {
    const ctx = this.ctx;

    // Background
    ctx.fillStyle = 'CornflowerBlue';
    ctx.fillRect(0, 0, this.cssWidth, this.cssHeight);

    const centerX = Math.round(this.cssWidth / 2);
    const centerY = Math.round(this.cssHeight / 2);

    // --- Splash Screen ---
    if (this.showSplashScreen) {
      renderSplashScreen(ctx, centerX, centerY, this.cssWidth, this.cssHeight)
      return;
    }

    // --- Title / instructions ---
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

    // --- Win screen ---
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

      ctx.font =
        '900 64px ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace';
      ctx.fillText('YOU WIN', cx, cy - 40);

      ctx.font =
        '600 28px ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace';
      ctx.fillText(`secret word was "${this.secretWord}"`, cx, cy + 10);

      ctx.font =
        '500 22px ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace';
      ctx.fillText('press space to restart', cx, cy + 56);

      ctx.restore();
      return;
    }

    // --- Game over screen ---
    if (this.isGameOver) {
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

      ctx.font =
        '800 64px ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace';
      ctx.fillText('GAME OVER', cx, cy - 24);

      ctx.font =
        '600 24px ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace';
      ctx.fillText('Press space to restart', cx, cy + 36);

      ctx.restore();
      return;
    }

    // --- Active gameplay: word + timer ---
    if (this.roundStartMs == null) this.roundStartMs = performance.now();

    const now = performance.now();
    const elapsed = now - this.roundStartMs;

    const roundMs = this.getRoundMs();
    const t = Math.min(1, Math.max(0, elapsed / roundMs));
    const remainingFrac = 1 - t;

    // Timeout -> lose (unless already won).
    if (elapsed >= roundMs && !this.isWin) {
      this.isGameOver = true;
    }

    ctx.save();

    // Word
    ctx.font =
      '700 56px ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';
    this.renderCurrentWord(ctx, centerX, centerY);

    // Timer bar
    const barWidth = Math.min(520, Math.round(this.cssWidth * 0.7));
    const barHeight = 12;
    const barY = centerY + 54;
    const barX = Math.round(centerX - barWidth / 2);

    ctx.globalAlpha = 0.35;
    ctx.fillRect(barX, barY, barWidth, barHeight);

    ctx.globalAlpha = 1;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(barX, barY, Math.round(barWidth * remainingFrac), barHeight);

    ctx.restore();

    // Hint counter (used / total)
    ctx.save();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';
    ctx.font =
      '500 18px ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace';
    ctx.fillText(`hints: ${this.hintCount}/${this.totalHints}`, centerX, centerY - 100);

    ctx.restore();
  }

  // ===========================================================================
  // Gameplay: win/loss checks + progression
  // ===========================================================================

  /**
   * Silent win condition: if the last N keystrokes equal the secret word,
   * the player wins immediately (secret is never shown during play).
   */
  private checkSecretWordWin(): void {
    const len = this.secretWord.length;
    const tail = this.keys.slice(-len).join('');
    if (tail === this.secretWord) {
      this.isWin = true;
      this.isGameOver = false; // win overrides loss
    }
  }

  private pushKey(display: string): void {
    if (this.isWin || this.isGameOver) return;

    // Pre-game: buffer and look for "start".
    if (!this.isGameStarted) {
      this.keys.push(display);
      if (this.keys.length > this.maxKeysToRender) this.keys.shift();
      this.checkStrings();
      return;
    }

    // Expected-next-letter validation (computed before push).
    const progress = this.getWordProgress();
    const expected = progress < this.currentWord.length ? this.currentWord[progress] : null;

    this.keys.push(display);
    if (this.keys.length > this.maxKeysToRender) this.keys.shift();

    // Secret word can be typed at any time during the run.
    this.checkSecretWordWin();
    if (this.isWin) return;

    const isCorrect = expected !== null && display === expected;
    this.lastInputMs = performance.now();
    this.lastInputWasCorrect = isCorrect;

    this.checkWordCompletion();
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

    this.hintCount = 1;
  }

  private checkStrings(): void {
    if (!this.isGameStarted && this.keys.slice(-5).join('') === 'start') {
      this.startNewRun();
    }
  }

  /** Prefix-progress of tail keystrokes vs the current visible word. */
  private getWordProgress(): number {
    const len = this.currentWord.length;
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
      this.hintCount++; // completed visible word => used one hint
      this.advanceToNextWord();
    }
  }

  /** Lose immediately if the bank runs out of visible words. */
  private advanceToNextWord(): void {
    this.clearKeys();

    this.currentWordIndex++;

    if (this.currentWordIndex >= this.wordBank.length) {
      this.isGameOver = true;
      return;
    }

    this.currentWord = this.wordBank[this.currentWordIndex];
    this.roundStartMs = performance.now();
    this.lastInputWasCorrect = true;
  }

  // ===========================================================================
  // Rendering helpers (current word)
  // ===========================================================================

  private renderCurrentWord(ctx: CanvasRenderingContext2D, x: number, y: number): void {
    const word = this.currentWord;
    const progress = this.getWordProgress();

    const spacing = 32;
    const startX = x - ((word.length - 1) * spacing) / 2;

    const now = performance.now();
    const flashWrong = !this.lastInputWasCorrect && now - this.lastInputMs <= this.wrongFlashMs;
    const nextIndex = Math.min(progress, word.length - 1);

    for (let i = 0; i < word.length; i++) {
      let colour = i < progress ? 'gold' : '#ffffff';

      // Intentionally disabled (kept as-is to preserve current behavior).
      // if (flashWrong && i === nextIndex) colour = 'tomato';

      ctx.fillStyle = colour;
      ctx.fillText(word[i], Math.round(startX + i * spacing), y);
    }
  }

  // ===========================================================================
  // Key formatting
  // ===========================================================================

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
}
