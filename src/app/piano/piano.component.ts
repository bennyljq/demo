import { AfterViewInit, ChangeDetectionStrategy, Component, computed, effect, ElementRef, inject, NgZone, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { PianoPlaybackService } from './piano-playback.service';
import { PianoRoll, JudgementFeedback } from './piano-roll';
import { buildTypingChart, TypingTarget } from './piano-chart';
import { isGameplayKey, LetterResult, TypingRound } from './piano-judgement';

@Component({
  selector: 'app-piano',
  standalone: true,
  templateUrl: './piano.component.html',
  styleUrl: './piano.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [PianoPlaybackService],
})
export class PianoComponent implements OnInit, AfterViewInit, OnDestroy {
  readonly playback = inject(PianoPlaybackService);
  readonly selectedTrack = signal(-1);
  readonly visibleNotes = computed(() => {
    const timeline = this.playback.timeline();
    return this.selectedTrack() === -1 ? timeline.notes : timeline.tracks[this.selectedTrack()]?.notes ?? [];
  });
  private readonly zone = inject(NgZone);
  @ViewChild('roll', { static: true }) private canvas: ElementRef<HTMLCanvasElement>;
  private pianoRoll?: PianoRoll;
  readonly chart = signal<readonly TypingTarget[]>([]);
  readonly chartError = signal('');
  readonly attempt = signal({ results: [] as LetterResult[], current: 0, wordIndex: 0, listening: true, complete: false, wrong: false });
  readonly preview = computed(() => {
    const first = this.attempt().wordIndex;
    return Array.from({ length: 5 }, (_, offset) => first + offset).map(index => this.chart().filter(target => target.wordIndex === index)).filter(word => word.length);
  });
  readonly counts = computed(() => {
    const results = this.attempt().results;
    return { perfect: results.filter(r => r === 'perfect').length, good: results.filter(r => r === 'good').length, miss: results.filter(r => r === 'miss').length };
  });
  private round?: TypingRound;
  private publishedRevision = -1;
  readonly feedback = signal<JudgementFeedback | null>(null);
  private feedbackSerial = 0;

  constructor() {
    effect(() => {
      const timeline = this.playback.timeline();
      if (!timeline.notes.length) return;
      try {
        const targets = buildTypingChart(timeline);
        this.chart.set(targets);
        this.round = new TypingRound(targets);
        this.publishedRevision = -1;
        this.publishAttempt();
      } catch (error) {
        this.chartError.set(error instanceof Error ? error.message : String(error));
      }
    });
  }

  ngOnInit(): void {
    void this.playback.load();
  }

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      this.pianoRoll = new PianoRoll(this.canvas.nativeElement, this.visibleNotes, () => this.playback.playbackPosition,
        () => this.chart().map(target => ({ ...target, result: this.round?.results[target.index] ?? 'pending' })),
        time => this.updateAttempt(time), () => this.feedback());
      document.addEventListener('keydown', this.onKey);
    });
  }

  selectTrack(event: Event): void {
    this.selectedTrack.set(Number((event.target as HTMLSelectElement).value));
  }

  ngOnDestroy(): void {
    this.feedback.set(null);
    this.pianoRoll?.destroy();
    document.removeEventListener('keydown', this.onKey);
  }

  play(): void {
    if (this.playback.status() !== 'ready') return;
    // A disabled speed selector must not retain keyboard input focus.
    if (document.activeElement?.id === 'piano-speed') (document.activeElement as HTMLElement).blur();
    this.resetAttempt();
    void this.playback.play();
  }

  stop(): void {
    this.playback.stop();
    this.resetAttempt();
  }

  private resetAttempt(): void {
    this.feedback.set(null);
    this.round?.reset();
    this.feedbackSerial = this.round?.feedbackSerial ?? 0;
    this.publishAttempt();
  }

  private updateAttempt(time: number): void {
    if (this.feedback() && performance.now() >= this.feedback().until) this.zone.run(() => this.feedback.set(null));
    if (this.playback.status() !== 'playing' || !this.round) return;
    this.round.advance(time, this.playback.playbackRate(), performance.now() / 1000);
    this.publishAttempt();
  }

  private readonly onKey = (event: KeyboardEvent): void => {
    if (this.playback.status() !== 'playing' || !this.round || !isGameplayKey(event)) return;
    this.round.key(event.key, this.playback.playbackPosition, this.playback.playbackRate(), performance.now() / 1000);
    this.publishAttempt();
  };

  private publishAttempt(): void {
    const round = this.round;
    if (!round || this.publishedRevision === round.revision) return;
    this.publishedRevision = round.revision;
    if (round.feedbackKind && round.feedbackSerial !== this.feedbackSerial) {
      this.feedbackSerial = round.feedbackSerial;
      const now = performance.now();
      const kind = round.feedbackKind;
      this.zone.run(() => this.feedback.set({ kind, started: now, until: now + 500,
        label: { perfect: 'Perfect', good: 'Good', miss: 'Miss', wrong: 'Wrong key' }[kind] }));
    }
    const pending = round.results.indexOf('pending');
    const current = pending < 0 ? -1 : pending;
    const wordIndex = round.targets[current < 0 ? round.targets.length - 1 : current].wordIndex;
    // Only judgement/phrase changes enter Angular, not each animation frame.
    this.zone.run(() => this.attempt.set({ results: [...round.results], current, wordIndex,
      listening: round.listening, complete: round.complete, wrong: round.wrong }));
  }
}
