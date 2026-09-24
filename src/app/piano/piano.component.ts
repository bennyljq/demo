import { AfterViewInit, ChangeDetectionStrategy, Component, computed, effect, ElementRef, inject, NgZone, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { PianoPlaybackService } from './piano-playback.service';
import { PianoRoll, JudgementFeedback } from './piano-roll';
import { buildXmlTypingChart, TypingTarget } from './piano-chart';
import { chartForSong } from './song-charts';
import { DEFAULT_SCORING_SETTINGS, ScoringSettings, validateScoringSettings } from './piano-scoring-settings';
import { isGameplayKey, LetterResult, TypingRound } from './piano-judgement';

@Component({
  selector: 'app-piano',
  standalone: true,
  templateUrl: './piano.component.html',
  styleUrl: './piano.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.dark]': "theme() === 'dark'" },
  providers: [PianoPlaybackService],
})
export class PianoComponent implements OnInit, AfterViewInit, OnDestroy {
  readonly playback = inject(PianoPlaybackService);
  readonly selectedTrack = signal(-1);
  readonly lookAhead = signal(6);
  readonly theme = signal<'light' | 'dark'>('dark');
  readonly currentMarkings = signal('');
  readonly visibleNotes = computed(() => {
    const timeline = this.playback.timeline();
    return this.selectedTrack() === -1 ? timeline.notes : timeline.tracks[this.selectedTrack()]?.notes ?? [];
  });
  private readonly zone = inject(NgZone);
  @ViewChild('roll', { static: true }) private canvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('passage', { static: true }) private passage: ElementRef<HTMLElement>;
  private passageObserver?: ResizeObserver;
  readonly passageWidth = signal(800);
  readonly settings = signal<ScoringSettings>(DEFAULT_SCORING_SETTINGS);
  readonly settingsError = signal('');
  private pianoRoll?: PianoRoll;
  readonly chart = signal<readonly TypingTarget[]>([]);
  readonly chartError = signal('');
  readonly attempt = signal({ results: [] as LetterResult[], current: -1, wordIndex: 0, listening: true, complete: false, wrong: false, wrongCount: 0, combo: 0, bestCombo: 0, total: 0, available: 0, sustain: 0, sustainAvailable: 0 });
  readonly displayedTime = signal(0);
  private lastTimePublish = -1;
  readonly words = computed(() => {
    const words: TypingTarget[][] = [];
    for (const target of this.chart()) (words[target.wordIndex] ??= []).push(target);
    return words;
  });
  readonly passageLines = computed(() => {
    const lines: TypingTarget[][][] = [[]];
    const maxWidth = Math.max(100, this.passageWidth() - 12);
    let used = 0;
    for (const word of this.words()) {
      const width = word.length * 14.5 + (used ? 19 : 0);
      if (used && used + width > maxWidth) { lines.push([]); used = 0; }
      lines[lines.length - 1].push(word);
      used += word.length * 14.5 + 19;
    }
    return lines;
  });
  readonly visibleLines = computed(() => {
    const lines = this.passageLines();
    const currentWord = this.attempt().wordIndex;
    const currentLine = Math.max(0, lines.findIndex(line => line.some(word => word[0].wordIndex === currentWord)));
    const start = Math.min(Math.max(0, currentLine - 1), Math.max(0, lines.length - 3));
    return lines.slice(start, start + 3);
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
      const score = this.playback.score();
      const id = this.playback.source();
      if (!score) {
        this.chart.set([]); this.round = undefined; this.publishedRevision = -1;
        this.chartError.set('');
        return;
      }
      try {
        const targets = buildXmlTypingChart(score, chartForSong(id));
        this.chart.set(targets);
        this.round = new TypingRound(targets, this.settings());
        this.chartError.set('');
        this.publishedRevision = -1;
        this.publishAttempt();
      } catch (error) {
        this.chart.set([]); this.round = undefined;
        this.chartError.set(error instanceof Error ? error.message : String(error));
      }
    });
  }

  ngOnInit(): void {
    void this.playback.load();
  }

  ngAfterViewInit(): void {
    this.passageObserver = new ResizeObserver(entries => this.zone.run(() => this.passageWidth.set(entries[0].contentRect.width)));
    this.passageObserver.observe(this.passage.nativeElement);
    this.zone.runOutsideAngular(() => {
      this.pianoRoll = new PianoRoll(this.canvas.nativeElement, this.visibleNotes, () => this.playback.playbackPosition,
        () => this.chart().map(target => ({ ...target, result: this.round?.results[target.index] ?? 'pending' })),
        time => this.updateAttempt(time), () => this.feedback(), () => this.playback.score(), () => this.lookAhead(),
        () => this.settings(), () => this.playback.playbackRate());
      document.addEventListener('keydown', this.onKey);
      document.addEventListener('keyup', this.onKeyUp);
      window.addEventListener('blur', this.onBlur);
    });
  }

  selectSong(event: Event): void {
    this.feedback.set(null);
    this.round?.blur();
    this.selectedTrack.set(-1);
    this.displayedTime.set(0);
    void this.playback.selectSong((event.target as HTMLSelectElement).value);
  }

  setScoringNumber(key: 'perfectMs' | 'goodMs' | 'holdReleaseMs', event: Event): void {
    if (this.playback.status() !== 'ready') return;
    const input = event.target as HTMLInputElement;
    const value = input.value.trim() ? Number(input.value) : NaN;
    const next = { ...this.settings(), [key]: value };
    const error = validateScoringSettings(next);
    this.settingsError.set(error);
    if (error) { input.value = String(this.settings()[key]); return; }
    this.settings.set(next);
    if (this.round) this.round.settings = next;
  }
  setScoringOverlay(key: 'showAttackWindows' | 'showHoldBuffer', event: Event): void {
    const next = { ...this.settings(), [key]: (event.target as HTMLInputElement).checked };
    this.settings.set(next);
    if (this.round) this.round.settings = next;
  }

  selectTrack(event: Event): void {
    this.selectedTrack.set(Number((event.target as HTMLSelectElement).value));
  }

  setLookAhead(event: Event): void { this.lookAhead.set(Number((event.target as HTMLInputElement).value)); }
  volumeMarkPosition(percent: number): string {
    return `calc(${percent / 5}% + ${8 - 16 * percent / 500}px)`;
  }
  toggleTheme(): void { this.theme.update(theme => theme === 'light' ? 'dark' : 'light'); }
  setMetronome(event: Event): void { this.playback.setMetronome((event.target as HTMLInputElement).checked); }

  ngOnDestroy(): void {
    this.feedback.set(null);
    this.pianoRoll?.destroy();
    this.passageObserver?.disconnect();
    document.removeEventListener('keydown', this.onKey);
    document.removeEventListener('keyup', this.onKeyUp);
    window.removeEventListener('blur', this.onBlur);
  }

  play(): void {
    if (this.playback.status() !== 'ready') return;
    // A disabled speed selector must not retain keyboard input focus.
    if (document.activeElement?.id === 'piano-speed') (document.activeElement as HTMLElement).blur();
    this.resetAttempt(this.playback.playbackPosition);
    void this.playback.play();
  }

  stop(): void {
    this.playback.stop();
    this.resetAttempt();
  }

  private resetAttempt(destination = 0): void {
    this.feedback.set(null);
    this.round?.reset(destination);
    this.feedbackSerial = this.round?.feedbackSerial ?? 0;
    this.publishAttempt();
  }

  private updateAttempt(time: number): void {
    const tenth = Math.floor(time * 10);
    if (tenth !== this.lastTimePublish) {
      this.lastTimePublish = tenth;
      this.zone.run(() => this.displayedTime.set(time));
      if (this.round?.results.includes('holding')) this.publishedRevision = -1;
    }
    this.updateMarkings(time);
    const feedback = this.feedback();
    if (feedback && performance.now() >= feedback.until) this.zone.run(() => this.feedback.set(null));
    if (this.playback.status() !== 'playing' || !this.round) return;
    this.round.advance(time, this.playback.playbackRate(), performance.now() / 1000);
    this.publishAttempt();
  }

  private visibleStaff(): number | null {
    const track = this.playback.timeline().tracks[this.selectedTrack()];
    return track ? Number(/^Staff (\d+)/.exec(track.name)?.[1]) : null;
  }

  private updateMarkings(time: number): void {
    const score = this.playback.score();
    if (!score) {
      if (this.currentMarkings()) this.zone.run(() => this.currentMarkings.set(''));
      return;
    }
    const staff = this.visibleStaff();
    const labels: string[] = [];
    for (const currentStaff of staff === null ? [1, 2] : [staff]) {
      const latest = (kind: 'dynamic' | 'clef') => score.annotations.filter(mark => mark.staff === currentStaff &&
        mark.kind === kind && mark.start <= time).at(-1)?.label;
      const dynamic = latest('dynamic');
      const clef = latest('clef');
      const text = score.annotations.filter(mark => mark.staff === currentStaff && mark.kind === 'text' && mark.start <= time).at(-1)?.label;
      const tempo = score.annotations.filter(mark => mark.staff === currentStaff && mark.kind === 'tempo' && mark.start <= time).at(-1)?.label;
      const wedge = score.annotations.find(mark => mark.staff === currentStaff && mark.kind === 'wedge' &&
        mark.start <= time && time < (mark.end ?? mark.start));
      if (dynamic || clef || wedge || text || tempo) labels.push(`Staff ${currentStaff}: ${[clef, dynamic, text, tempo, wedge?.label].filter(Boolean).join(', ')}`);
    }
    const next = labels.join(' · ');
    if (next !== this.currentMarkings()) this.zone.run(() => this.currentMarkings.set(next));
  }

  private readonly onKey = (event: KeyboardEvent): void => {
    if (this.playback.status() !== 'playing' || !this.round || !isGameplayKey(event)) return;
    this.round.key(event.key, this.playback.playbackPosition, this.playback.playbackRate(), performance.now() / 1000);
    this.publishAttempt();
  };

  private readonly onKeyUp = (event: KeyboardEvent): void => {
    if (!/^[a-z]$/i.test(event.key) || !this.round) return;
    this.round.keyUp(event.key, this.playback.playbackPosition, this.playback.playbackRate());
    this.publishAttempt();
  };
  private readonly onBlur = (): void => {
    this.round?.blur();
    this.publishAttempt();
  };

  beginSeek(): void { this.playback.beginScrub(); }
  previewSeek(event: Event): void {
    const time = Number((event.target as HTMLInputElement).value);
    this.playback.previewSeek(time);
    this.displayedTime.set(time);
  }
  commitSeek(event: Event): void {
    const time = Number((event.target as HTMLInputElement).value);
    this.playback.commitSeek(time);
    this.resetAttempt(time);
    this.displayedTime.set(time);
  }

  private publishAttempt(): void {
    const round = this.round;
    if (!round || this.publishedRevision === round.revision) return;
    this.publishedRevision = round.revision;
    if (round.feedbackKind && round.feedbackSerial !== this.feedbackSerial) {
      this.feedbackSerial = round.feedbackSerial;
      const now = performance.now();
      const kind = round.feedbackKind;
      this.zone.run(() => this.feedback.set({ kind, started: now, until: now + 500,
        letter: round.targets[round.feedbackIndex].letter,
        targetId: round.targets[round.feedbackIndex].id,
        label: { perfect: 'Perfect', good: 'Good', miss: 'Miss', wrong: 'Wrong key' }[kind] }));
    }
    const pending = round.results.findIndex(r => r === 'pending' || r === 'holding');
    const current = pending < 0 ? -1 : pending;
    const wordIndex = round.targets[current < 0 ? round.targets.length - 1 : current]?.wordIndex ?? 0;
    // Only judgement/phrase changes enter Angular, not each animation frame.
    this.zone.run(() => this.attempt.set({ results: [...round.results], current, wordIndex,
      listening: round.listening, complete: round.complete, wrong: round.wrong,
      wrongCount: round.wrongCount, combo: round.combo, bestCombo: round.bestCombo,
      total: round.totalPoints, available: round.availablePoints, sustain: round.earnedSustainPoints, sustainAvailable: round.availableSustainPoints }));
  }
}
