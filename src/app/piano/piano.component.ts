import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, effect, ElementRef, inject, NgZone, OnDestroy, signal, untracked, ViewChild } from '@angular/core';
import { PianoPlaybackService } from './audio/piano-playback.service';
import { PianoRoll, JudgementFeedback } from './rendering/piano-roll';
import { TypingTarget } from './gameplay/piano-chart';
import { attackWindowSeconds, DEFAULT_SCORING_SETTINGS, ScoringSettings, validateScoringSettings } from './gameplay/piano-scoring-settings';
import { isGameplayKey, LetterResult, SCORING_POINTS, TypingRound } from './gameplay/piano-judgement';
import { captureRunResult, ResultLetter, RunResult } from './gameplay/piano-run-result';
import { ChartCoverage, songChartFor } from './charts/song-charts';
import { DemoAction, PianoDemoController } from './gameplay/piano-demo-controller';
import { isStartKey } from './gameplay/piano-start-key';
import { DEMO_KEYBOARD_ROWS, DemoKeyboardPresenter, DemoKeyVisual } from './rendering/demo-keyboard';

type PianoStage = 'home' | 'library' | 'play' | 'results';

@Component({
  selector: 'app-piano',
  standalone: true,
  templateUrl: './piano.component.html',
  styleUrl: './piano.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.dark]': "theme() === 'dark'" },
  providers: [PianoPlaybackService],
})
export class PianoComponent implements AfterViewInit, OnDestroy {
  readonly playback = inject(PianoPlaybackService);
  readonly scoringPoints = SCORING_POINTS;
  readonly stage = signal<PianoStage>('home');
  readonly settingsOpen = signal(false);
  readonly runStarted = signal(false);
  readonly demoActive = signal(false);
  readonly demoKeyboardRows = DEMO_KEYBOARD_ROWS;
  readonly demoKeyStates = signal<Readonly<Record<string, DemoKeyVisual>>>({});
  private readonly demoKeyboard = new DemoKeyboardPresenter();
  readonly result = signal<RunResult | null>(null);
  readonly reviewDetail = signal('');
  readonly reviewWords = computed(() => {
    const words: ResultLetter[][] = [];
    for (const letter of this.result()?.letters ?? []) (words[letter.wordIndex] ??= []).push(letter);
    return words.filter(word => word?.length);
  });
  readonly finishedListening = signal(false);
  readonly selectedSong = computed(() => this.playback.songs.find(song => song.id === this.playback.source()));
  readonly coverage = computed(() => this.selectedSong() ? songChartFor(this.playback.source()).coverage : 'listen');
  readonly runStartPosition = signal(0);
  readonly runContext = computed(() => this.runStartPosition() > 0.001 ? 'Practice segment' : this.coverageLabel(this.coverage()));
  readonly chartedRun = signal(false);
  readonly progress = computed(() => {
    const chart = this.chart();
    const last = chart.at(-1);
    const end = this.coverage() === 'opening' && last ? Math.max(last.holdEnd ?? 0, last.time + 0.16) : this.playback.duration();
    return end > 0 ? Math.min(100, Math.max(0, this.displayedTime() / end * 100)) : 0;
  });
  readonly librarySongs = this.playback.songs;
  readonly selectedTrack = signal(-1);
  readonly lookAhead = signal(6);
  readonly theme = signal<'light' | 'dark'>('dark');
  readonly statusLabel = computed(() => ({
    loading: 'Preparing', 'enable-audio': 'Enable audio to prepare', ready: 'Ready',
    starting: 'Starting', 'count-in': 'Count in', playing: 'Playing', error: 'Error',
  })[this.playback.status()]);
  readonly currentMarkings = signal('');
  readonly visibleNotes = computed(() => {
    const timeline = this.playback.timeline();
    return this.selectedTrack() === -1 ? timeline.notes : timeline.tracks[this.selectedTrack()]?.notes ?? [];
  });
  private readonly zone = inject(NgZone);
  private readonly changeDetector = inject(ChangeDetectorRef);
  @ViewChild('roll', { static: true }) private canvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('passage', { static: true }) private passage: ElementRef<HTMLElement>;
  @ViewChild('gameplay', { static: true }) private gameplay: ElementRef<HTMLElement>;
  @ViewChild('settingsDialog') private settingsDialog?: ElementRef<HTMLElement>;
  @ViewChild('settingsTrigger', { static: true }) private settingsTrigger: ElementRef<HTMLButtonElement>;
  private focusBeforeSettings: HTMLElement | null = null;
  private passageObserver?: ResizeObserver;
  readonly passageWidth = signal(800);
  readonly settings = signal<ScoringSettings>(DEFAULT_SCORING_SETTINGS);
  readonly settingsError = signal('');
  private pianoRoll?: PianoRoll;
  readonly chart = signal<readonly TypingTarget[]>([]);
  readonly chartError = signal('');
  readonly attempt = signal({ results: [] as LetterResult[], attackGrades: [] as ('perfect' | 'good' | undefined)[], sustainPoints: [] as number[], current: -1, wordIndex: 0, listening: true, complete: false, wrong: false, wrongCount: 0, combo: 0, bestCombo: 0, total: 0, available: 0, sustain: 0, sustainAvailable: 0 });
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
  private runVersion = 0;
  private completionPending = false;
  private lastNaturalEnd = 0;
  private demo?: PianoDemoController;
  private readonly suppressedStartKeys = new Set<string>();

  constructor() {
    effect(() => {
      const score = this.playback.score();
      const targets = this.playback.chart();
      if (!score) {
        this.chart.set([]); this.round = undefined; this.publishedRevision = -1;
        this.chartError.set('');
        return;
      }
      try {
        this.chart.set(targets);
        this.round = new TypingRound(targets, untracked(() => this.settings()));
        this.round.reset(untracked(() => this.runStartPosition()));
        this.chartedRun.set(targets.length > 0);
        this.chartError.set('');
        this.publishedRevision = -1;
        this.publishAttempt();
      } catch (error) {
        this.chart.set([]); this.round = undefined;
        this.chartError.set(error instanceof Error ? error.message : String(error));
      }
    });
    effect(() => {
      const ended = this.playback.naturalEnd();
      if (ended === this.lastNaturalEnd) return;
      this.lastNaturalEnd = ended;
      if (this.stage() === 'play' && this.runStarted()) this.finishNaturalRun();
    });
    effect(() => {
      if (this.playback.status() !== 'error' || !this.demoActive()) return;
      this.cancelDemo();
      this.runStarted.set(false);
      this.resetAttempt(0);
    });
  }

  ngAfterViewInit(): void {
    this.passageObserver = new ResizeObserver(entries => this.zone.run(() => this.passageWidth.set(entries[0].contentRect.width)));
    this.passageObserver.observe(this.passage.nativeElement);
    this.zone.runOutsideAngular(() => {
      this.pianoRoll = new PianoRoll(this.canvas.nativeElement, this.visibleNotes, () => this.playback.visualPosition,
        () => this.chart().map(target => ({ ...target, result: this.round?.results[target.index] ?? 'pending', attackGrade: this.round?.attackGrades[target.index] })),
        () => this.updateAttempt(this.playback.playbackPosition), () => this.playback.score(), () => this.lookAhead(),
        () => this.settings(), () => this.playback.playbackRate(), () => this.playback.countInVisual,
        () => this.playback.songBeatPositions, () => this.playback.melodyCoupling(), () => this.playback.performedBars);
      document.addEventListener('keydown', this.onKey);
      document.addEventListener('keyup', this.onKeyUp);
      window.addEventListener('blur', this.onBlur);
    });
  }

  coverageLabel(coverage: ChartCoverage): string {
    return { full: 'Full chart', opening: 'Opening passage', listen: 'Listen only' }[coverage];
  }
  coverageLabelFor(id: string): string { return this.coverageLabel(songChartFor(id).coverage); }

  enterLibrary(): void {
    this.playback.activateAudio();
    this.stage.set('library');
  }

  retryAudio(): void { this.playback.activateAudio(); }

  retryPreparation(): void {
    this.playback.activateAudio();
    void this.playback.selectSong(this.playback.source());
  }

  chooseSong(id: string): void {
    this.cancelDemo();
    this.playback.stop();
    this.feedback.set(null);
    this.round?.blur();
    this.selectedTrack.set(-1);
    this.displayedTime.set(0);
    this.runStartPosition.set(0);
    this.runStarted.set(false);
    this.result.set(null);
    this.reviewDetail.set('');
    this.finishedListening.set(false);
    this.stage.set('play');
    void this.playback.selectSong(id);
  }

  setScoringNumber(key: 'perfectMs' | 'goodMs' | 'holdReleaseMs', event: Event): void {
    if (this.runStarted()) return;
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
  toggleTheme(): void { this.theme.update(theme => theme === 'light' ? 'dark' : 'light'); }
  setMetronome(event: Event): void { void this.playback.setMetronome((event.target as HTMLInputElement).checked); }

  ngOnDestroy(): void {
    this.cancelDemo();
    this.playback.releasePlayerVoices();
    this.feedback.set(null);
    this.pianoRoll?.destroy();
    this.passageObserver?.disconnect();
    document.removeEventListener('keydown', this.onKey);
    document.removeEventListener('keyup', this.onKeyUp);
    window.removeEventListener('blur', this.onBlur);
  }

  play(): void {
    if (this.playback.status() !== 'ready' || this.runStarted()) return;
    this.runVersion++;
    this.completionPending = false;
    this.runStartPosition.set(this.playback.playbackPosition);
    this.resetAttempt(this.runStartPosition());
    this.chartedRun.set(!!this.round?.results.some(result => result !== 'skipped'));
    this.result.set(null);
    this.reviewDetail.set('');
    this.finishedListening.set(false);
    this.runStarted.set(true);
    void this.playback.play();
    this.changeDetector.detectChanges();
    this.gameplay.nativeElement.focus({ preventScroll: true });
  }

  startDemo(): void {
    if (this.stage() !== 'play' || this.playback.status() !== 'ready' || !this.round || !this.chart().length) return;
    this.playback.commitSeek(0);
    this.play();
    if (!this.runStarted()) return;
    this.demoActive.set(true);
    this.demoKeyboard.clear();
    this.demoKeyStates.set({});
    this.demo = new PianoDemoController(this.chart(), this.round, this.playback.playbackRate(), action => this.applyDemoAction(action));
    this.playback.startDemo(this.demo.actions);
  }

  reroll(): void {
    if (this.stage() !== 'play' || this.runStarted() || this.playback.status() !== 'ready') return;
    this.feedback.set(null);
    this.pianoRoll?.clearEffects();
    this.playback.prepareRunChart();
  }

  stop(): void {
    this.playback.stop();
    this.resetAttempt();
  }

  restart(): void {
    if (this.stage() !== 'play') return;
    const wasDemo = this.demoActive();
    this.runVersion++;
    this.completionPending = false;
    this.cancelDemo();
    this.round?.blur();
    this.playback.restart();
    this.runStartPosition.set(0);
    this.displayedTime.set(0);
    this.lastTimePublish = -1;
    if (!wasDemo) this.playback.prepareRunChart();
    this.resetAttempt(0);
    this.chartedRun.set(!!this.round?.results.some(result => result !== 'skipped'));
    this.runStarted.set(false);
    this.result.set(null);
    this.reviewDetail.set('');
    this.finishedListening.set(false);
  }

  resultDetail(letter: ResultLetter): string {
    const attack = letter.result === 'skipped' ? 'Skipped by seek' : letter.attack ? `${letter.attack === 'perfect' ? 'Perfect' : 'Good'} attack` :
      letter.result === 'miss' ? 'Missed attack' : 'Unresolved attack';
    return letter.hasHold ? `${attack} · Sustain ${letter.sustainPoints.toFixed(0)} / ${this.scoringPoints.hold}` : attack;
  }

  exitRun(): void {
    if (this.stage() !== 'play') return;
    this.runVersion++;
    this.cancelDemo();
    this.round?.blur();
    this.stop();
    this.runStarted.set(false);
    this.stage.set('library');
  }

  retry(): void {
    if (this.stage() !== 'results') return;
    this.reviewDetail.set('');
    this.playback.commitSeek(this.runStartPosition());
    this.playback.prepareRunChart();
    this.resetAttempt(this.runStartPosition());
    this.chartedRun.set(!!this.round?.results.some(result => result !== 'skipped'));
    this.runStarted.set(false);
    this.stage.set('play');
  }

  chooseLibrary(): void {
    this.runVersion++;
    this.cancelDemo();
    this.round?.blur();
    this.playback.stop();
    this.runStarted.set(false);
    this.stage.set('library');
  }

  goHome(): void {
    this.chooseLibrary();
    this.stage.set('home');
  }

  private cancelDemo(): void {
    this.demo?.cancel(); this.demo = undefined;
    this.playback.clearDemo();
    this.demoActive.set(false);
    this.demoKeyboard.clear();
    this.demoKeyStates.set({});
  }

  openSettings(): void {
    if (this.settingsOpen()) return;
    if (this.demoActive()) this.restart();
    this.focusBeforeSettings = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    this.playback.releasePlayerVoices();
    this.round?.blur();
    this.publishAttempt();
    this.settingsOpen.set(true);
    this.changeDetector.detectChanges();
    this.settingsDialog?.nativeElement.focus({ preventScroll: true });
  }

  closeSettings(): void {
    if (!this.settingsOpen()) return;
    this.settingsOpen.set(false);
    this.changeDetector.detectChanges();
    const target = this.focusBeforeSettings?.isConnected ? this.focusBeforeSettings : this.settingsTrigger.nativeElement;
    target.focus({ preventScroll: true });
    this.focusBeforeSettings = null;
  }

  onBackdropMouseDown(event: MouseEvent): void {
    if (event.target === event.currentTarget) this.closeSettings();
  }

  onModalKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault(); event.stopPropagation(); this.closeSettings(); return;
    }
    if (event.key !== 'Tab' || !this.settingsDialog) return;
    const items = Array.from(this.settingsDialog.nativeElement.querySelectorAll<HTMLElement>(
      'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex="0"]',
    )).filter(item => item.getClientRects().length > 0);
    if (!items.length) { event.preventDefault(); return; }
    const first = items[0], last = items[items.length - 1];
    if (event.shiftKey && (document.activeElement === first || document.activeElement === this.settingsDialog.nativeElement)) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && (document.activeElement === last || document.activeElement === this.settingsDialog.nativeElement)) {
      event.preventDefault(); first.focus();
    }
  }

  private finishNaturalRun(): void {
    if (this.stage() !== 'play' || !this.runStarted()) return;
    if (this.demoActive()) {
      this.demo?.step(this.playback.duration() + 1);
      this.round?.advance(this.playback.duration() + 1, this.playback.playbackRate());
      this.cancelDemo();
      this.runStarted.set(false);
      this.runStartPosition.set(0);
      this.displayedTime.set(0);
      this.resetAttempt(0);
      return;
    }
    this.playback.releasePlayerVoices();
    if (this.chartedRun() && this.round) {
      this.round.advance(this.playback.duration() + 1, this.playback.playbackRate());
      this.publishAttempt();
      const result = this.captureResult();
      if (result) { this.result.set(result); this.runStarted.set(false); this.stage.set('results'); return; }
    }
    this.finishedListening.set(true);
    this.runStarted.set(false);
    this.stage.set('results');
  }

  private captureResult(): RunResult | null {
    const song = this.selectedSong();
    const coverage = this.coverage();
    if (!song || !this.round || coverage === 'listen') return null;
    return captureRunResult(this.round, song.id, song.title, coverage, this.playback.playbackRate(), this.runStartPosition());
  }

  private maybeCompleteOpening(): void {
    if (this.stage() !== 'play' || !this.runStarted() || this.completionPending || !this.chartedRun() ||
      this.coverage() !== 'opening' || !this.round?.complete || this.playback.status() !== 'playing') return;
    const result = this.captureResult();
    if (!result) return;
    this.completionPending = true;
    const version = this.runVersion;
    void this.playback.fadeOutAndStop().then(() => {
      if (this.stage() !== 'play' || version !== this.runVersion) return;
      this.result.set(result);
      this.runStarted.set(false);
      this.stage.set('results');
    });
  }

  private resetAttempt(destination = 0): void {
    this.feedback.set(null);
    this.pianoRoll?.clearEffects();
    this.round?.reset(destination);
    this.feedbackSerial = this.round?.feedbackSerial ?? 0;
    this.publishAttempt();
  }

  private updateAttempt(time: number): void {
    if (this.stage() !== 'play' || !this.runStarted()) return;
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
    if (this.demoActive()) {
      this.demo?.step(time);
      const keys = this.demoKeyboard.snapshot(performance.now());
      if (keys !== this.demoKeyStates()) this.zone.run(() => this.demoKeyStates.set(keys));
    }
    this.round.advance(time, this.playback.playbackRate(), performance.now() / 1000);
    this.publishAttempt();
    this.maybeCompleteOpening();
  }

  private applyDemoAction(action: DemoAction): void {
    if (!this.demoActive() || !this.round) return;
    if (action.release) {
      this.round.keyUp(action.key, action.time, this.playback.playbackRate());
    } else {
      this.round.key(action.key, action.time, this.playback.playbackRate(), action.time / this.playback.playbackRate());
    }
    this.demoKeyboard.apply(action, this.playback.playbackPosition, this.playback.playbackRate(), performance.now());
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
    if (this.settingsOpen()) { if (event.key === 'Escape') { event.preventDefault(); this.zone.run(() => this.closeSettings()); } return; }
    if (event.key === 'Escape' && this.stage() === 'play') {
      event.preventDefault();
      if (!event.repeat) this.zone.run(() => this.restart());
      return;
    }
    if (this.suppressedStartKeys.has(event.key.toUpperCase())) return;
    const armed = this.stage() === 'play';
    if (armed && !this.runStarted() && this.playback.status() === 'ready' && this.playback.score() && isStartKey(event)) {
      event.preventDefault();
      this.suppressedStartKeys.add(event.key.toUpperCase());
      this.zone.run(() => this.play());
      return;
    }
    const accepting = this.stage() === 'play' && !this.demoActive();
    if (!accepting || !this.runStarted() || !this.round || !isGameplayKey(event)) return;
    const leadIn = this.playback.leadInPosition;
    const earlyFirst = leadIn !== null && this.round.targets.some(target =>
      this.round!.results[target.index] === 'pending' &&
      Math.abs(target.time - this.runStartPosition()) < 1e-8 &&
      leadIn >= target.time - attackWindowSeconds(this.settings().goodMs, this.playback.playbackRate()) - 1e-9);
    const playing = this.playback.status() === 'playing';
    if (!playing && !earlyFirst) return;
    const position = playing ? this.playback.playbackPosition : leadIn!;
    this.acceptGameplayKey(event.key, event.code || `Key${event.key.toUpperCase()}`, position, position);
  };

  private readonly onKeyUp = (event: KeyboardEvent): void => {
    if (this.suppressedStartKeys.delete(event.key.toUpperCase())) return;
    const accepting = this.stage() === 'play' && !this.demoActive();
    if (!accepting || this.settingsOpen() || !this.runStarted() ||
      !/^[a-z]$/i.test(event.key) || !this.round) return;
    const playing = this.playback.status() === 'playing';
    const leadIn = this.playback.leadInPosition;
    if (!playing && leadIn === null) return;
    this.releaseGameplayKey(event.key, event.code || `Key${event.key.toUpperCase()}`,
      playing ? this.playback.playbackPosition : leadIn!);
  };
  private readonly onBlur = (): void => {
    this.suppressedStartKeys.clear();
    if (this.demoActive()) { this.zone.run(() => this.restart()); return; }
    this.playback.releasePlayerVoices();
    this.round?.blur();
    this.publishAttempt();
  };

  private acceptGameplayKey(key: string, physical: string, judgementTime: number, audioPosition: number): void {
    const round = this.round;
    if (!round) return;
    const before = round.feedbackSerial;
    round.key(key, judgementTime, this.playback.playbackRate(), performance.now() / 1000);
    if (round.feedbackSerial !== before && round.feedbackIndex >= 0 &&
        (round.feedbackKind === 'perfect' || round.feedbackKind === 'good' || round.feedbackKind === 'wrong')) {
      this.playback.performMelodyInput(round.feedbackIndex, round.feedbackKind, physical, audioPosition);
    }
    this.publishAttempt();
  }

  private releaseGameplayKey(key: string, physical: string, position: number): void {
    this.playback.releasePlayerKey(physical);
    this.round?.keyUp(key, position, this.playback.playbackRate());
    this.publishAttempt();
  }

  beginSeek(): void { if (!this.demoActive()) this.playback.beginScrub(); }
  previewSeek(event: Event): void {
    if (this.demoActive()) return;
    const time = Number((event.target as HTMLInputElement).value);
    this.playback.previewSeek(time);
    this.displayedTime.set(time);
  }
  commitSeek(event: Event): void {
    if (this.demoActive()) return;
    const time = Number((event.target as HTMLInputElement).value);
    this.playback.commitSeek(time);
    this.resetAttempt(time);
    if (this.stage() === 'play') {
      this.runVersion++;
      this.completionPending = false;
      this.runStartPosition.set(time);
      this.chartedRun.set(!!this.round?.results.some(result => result !== 'skipped'));
    }
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
      const target = round.targets[round.feedbackIndex];
      if (target && (kind === 'perfect' || kind === 'good'))
        this.pianoRoll?.flashHit(target, kind, this.playback.visualPosition, this.lookAhead());
      this.zone.run(() => this.feedback.set({ kind, started: now, until: now + 500,
        letter: round.feedbackLetter,
        targetId: kind === 'perfect' || kind === 'good' ? target?.id : undefined,
        label: { perfect: 'Perfect', good: 'Good', miss: 'Miss', wrong: 'Wrong key' }[kind] }));
    }
    const pending = round.results.findIndex(r => r === 'pending' || r === 'holding');
    const current = pending < 0 ? -1 : pending;
    const wordIndex = round.targets[current < 0 ? round.targets.length - 1 : current]?.wordIndex ?? 0;
    // Only judgement/phrase changes enter Angular, not each animation frame.
    this.zone.run(() => this.attempt.set({ results: [...round.results], attackGrades: [...round.attackGrades], sustainPoints: [...round.sustainPoints], current, wordIndex,
      listening: round.listening, complete: round.complete, wrong: round.wrong,
      wrongCount: round.wrongCount, combo: round.combo, bestCombo: round.bestCombo,
      total: round.totalPoints, available: round.availablePoints, sustain: round.earnedSustainPoints, sustainAvailable: round.availableSustainPoints }));
  }
}
