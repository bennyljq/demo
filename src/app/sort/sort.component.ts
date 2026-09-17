import {
  Component, OnDestroy, OnInit,
  signal, computed
} from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SortEngineService, ALGORITHMS, ALGORITHM_GROUPS } from './sort-engine.service';
import { SortSoundService } from './sort-sound.service';
import { AlgorithmGroup, AlgorithmMeta, Bar, BarState, SortStep } from './sort.types';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sort',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './sort.component.html',
  styleUrl:    './sort.component.scss'
  // Default change detection — signals drive reactive re-renders automatically.
})
export class SortComponent implements OnInit, OnDestroy {

  // ── Static / reference data ───────────────────────────────────────────────
  readonly algorithmGroups: AlgorithmGroup[] = ALGORITHM_GROUPS;

  // ── Reactive signals (all template reads are `signal()` calls) ─────────────
  readonly bars             = signal<Bar[]>([]);
  readonly comparisons      = signal(0);
  readonly swaps            = signal(0);
  readonly auxiliarySize    = signal(0);
  readonly elapsedMs        = signal(0);
  readonly jokeMessage      = signal('');
  readonly isRunning        = signal(false);
  readonly isPaused         = signal(false);
  readonly isSorted         = signal(false);
  readonly soundEnabled     = signal(true);
  readonly selectedCategory = signal<'comparison' | 'non-comparison' | 'joke'>('comparison');
  readonly selectedAlgorithm = signal<AlgorithmMeta>(ALGORITHMS[0]);

  // Derived signal: updates automatically when selectedCategory changes
  readonly filteredAlgorithms = computed(() =>
    ALGORITHMS.filter(a => a.category === this.selectedCategory()));

  // ── Plain properties (ngModel-bound sliders, not high-frequency) ───────────
  arrayLength = 60;
  speed       = 5;

  get maxValue(): number { return this.arrayLength; }

  get speedLabel(): string {
    return ['Glacial','Very Slow','Slow','Moderate','Normal',
            'Fast','Very Fast','Rapid','Ultra','Ludicrous'][this.speed - 1];
  }

  get barTransition(): string {
    if (this.speed >= 5) return 'none';
    const durations = [280, 160, 90, 45];
    return `height ${durations[this.speed - 1]}ms ease, background-color ${durations[this.speed - 1]}ms ease`;
  }

  // ── Private (not reactive) ────────────────────────────────────────────────
  private generator:    Generator<SortStep> | null = null;
  private originalArr:  number[] = [];
  private rafId:        number | null = null;
  private lastStepTime  = 0;
  private startTime     = 0;
  private pausedElapsed = 0;

  constructor(
    private engine:   SortEngineService,
    private sound:    SortSoundService,
    private location: Location
  ) {}

  ngOnInit(): void {
    const firstInCat = ALGORITHMS.find(a => a.category === this.selectedCategory());
    if (firstInCat) this.selectedAlgorithm.set(firstInCat);
    this.generateArray();
  }

  ngOnDestroy(): void { this.stopLoop(); }

  goHome(): void { this.location.back(); }

  // ── Algorithm / category selection ────────────────────────────────────────

  selectCategory(cat: 'comparison' | 'non-comparison' | 'joke'): void {
    this.selectedCategory.set(cat);
    const first = ALGORITHMS.find(a => a.category === cat);
    if (first) this.selectAlgorithm(first);
  }

  selectAlgorithm(algo: AlgorithmMeta): void {
    this.selectedAlgorithm.set(algo);
    this.selectedCategory.set(algo.category);
    this.reset();
  }

  // ── Array generation ──────────────────────────────────────────────────────

  generateArray(): void {
    this.reset();
    this.originalArr = Array.from({ length: this.arrayLength }, (_, i) => i + 1);
    for (let i = this.originalArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.originalArr[i], this.originalArr[j]] = [this.originalArr[j], this.originalArr[i]];
    }
    this.bars.set(this.originalArr.map(v => ({ value: v, state: 'default' as BarState })));
  }

  onArrayLengthChange(): void { this.generateArray(); }

  // ── Playback controls ─────────────────────────────────────────────────────

  play(): void {
    try { this.sound.init().catch(() => {}); this.sound.resume(); } catch (_) {}

    if (this.isSorted()) this.generateArray();

    if (this.isPaused()) {
      this.isPaused.set(false);
      this.isRunning.set(true);
      this.startTime = Date.now() - this.pausedElapsed;
      this.startLoop();
      return;
    }

    if (this.isRunning()) return;

    this.isRunning.set(true);
    this.isPaused.set(false);
    this.isSorted.set(false);
    this.comparisons.set(0);
    this.swaps.set(0);
    this.auxiliarySize.set(0);
    this.jokeMessage.set('');
    this.generator     = this.engine.createGenerator(this.selectedAlgorithm().key, [...this.originalArr]);
    this.startTime     = Date.now();
    this.pausedElapsed = 0;
    this.elapsedMs.set(0);
    this.startLoop();
  }

  pause(): void {
    if (!this.isRunning() || this.isPaused()) return;
    this.isPaused.set(true);
    this.pausedElapsed = Date.now() - this.startTime;
    this.stopLoop();
  }

  step(): void {
    if (this.isRunning() && !this.isPaused()) return;
    if (!this.generator) {
      this.generator     = this.engine.createGenerator(this.selectedAlgorithm().key, [...this.originalArr]);
      this.startTime     = Date.now();
      this.pausedElapsed = 0;
      this.isPaused.set(true);
      this.isRunning.set(true);
    }
    this.runStep();
  }

  reset(): void {
    this.stopLoop();
    this.generator = null;
    this.isRunning.set(false);
    this.isPaused.set(false);
    this.isSorted.set(false);
    this.comparisons.set(0);
    this.swaps.set(0);
    this.auxiliarySize.set(0);
    this.elapsedMs.set(0);
    this.pausedElapsed = 0;
    this.jokeMessage.set('');
    if (this.originalArr.length) {
      this.bars.set(this.originalArr.map(v => ({ value: v, state: 'default' as BarState })));
    }
  }

  toggleSound(): void {
    const next = !this.soundEnabled();
    this.soundEnabled.set(next);
    this.sound.enabled = next;
  }

  onSpeedChange(): void {
    if (this.isRunning() && !this.isPaused()) {
      this.stopLoop();
      this.startLoop();
    }
  }

  // ── Core step ─────────────────────────────────────────────────────────────

  private runStep(): void {
    if (!this.generator) return;
    try {
      const result = this.generator.next();
      if (result.done) { this.onSortComplete(undefined); return; }

      const step = result.value as SortStep;
      // Signal updates are batched by Angular's scheduler and trigger a single render.
      this.bars.set(step.bars);
      this.comparisons.set(step.comparisons);
      this.swaps.set(step.swaps);
      this.auxiliarySize.set(step.auxiliarySize);
      if (step.message) this.jokeMessage.set(step.message);

      if (step.done) { this.onSortComplete(step); return; }

      this.playStepSound(step);
    } catch (err) {
      console.error('[Sort] runStep error:', err);
      this.isRunning.set(false);
      this.stopLoop();
    }
  }

  private playStepSound(step: SortStep): void {
    if (!this.soundEnabled()) return;
    try {
      const swapping  = step.bars.find(b => b.state === 'swapping');
      const comparing = step.bars.find(b => b.state === 'comparing');
      if (swapping)       this.sound.playSwap(swapping.value,  this.maxValue);
      else if (comparing) this.sound.playTone(comparing.value, this.maxValue);
    } catch (_) { /* audio errors must never interrupt animation */ }
  }

  private onSortComplete(step: SortStep | undefined): void {
    this.stopLoop();
    this.isRunning.set(false);
    this.isSorted.set(true);
    this.generator = null;
    if (step?.bars)    this.bars.set(step.bars);
    if (step?.message) this.jokeMessage.set(step.message);
    this.elapsedMs.set(Date.now() - this.startTime);
    try { this.sound.playSuccess(); } catch (_) {}
  }

  // ── Animation loop ────────────────────────────────────────────────────────
  //
  // Signal updates (bars.set, comparisons.set, …) notify Angular's reactive
  // scheduler directly, so the view re-renders after each RAF tick without
  // needing detectChanges(), markForCheck(), or NgZone wrappers.

  private startLoop(): void {
    this.stopLoop();
    this.lastStepTime = performance.now();

    const frame = (now: number) => {
      if (!this.isRunning() || this.isPaused()) return;

      // Keep live timer ticking every frame.
      this.elapsedMs.set(Date.now() - this.startTime);

      if (this.speed <= 5) {
        // Time-gated: step only once per configured interval.
        const delays = [800, 400, 180, 80, 30];
        if (now - this.lastStepTime >= delays[this.speed - 1]) {
          this.lastStepTime = now;
          this.runStep();
        }
      } else {
        // High-speed: batch multiple steps per animation frame.
        const stepsPerFrame = [2, 6, 18, 60, 200];
        const count = stepsPerFrame[this.speed - 6];
        for (let i = 0; i < count; i++) {
          this.runStep();
          if (!this.isRunning() || this.isPaused()) break;
        }
      }

      if (this.isRunning() && !this.isPaused()) {
        this.rafId = requestAnimationFrame(frame);
      }
    };

    this.rafId = requestAnimationFrame(frame);
  }

  private stopLoop(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  // ── Template helpers ──────────────────────────────────────────────────────

  formatTime(ms: number): string {
    if (ms < 1000)  return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(2)}s`;
    const m = Math.floor(ms / 60000);
    const s = ((ms % 60000) / 1000).toFixed(2).padStart(5, '0');
    return `${m}:${s}`;
  }
}
