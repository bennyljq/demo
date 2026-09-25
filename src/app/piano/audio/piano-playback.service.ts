import { DOCUMENT, inject, Injectable, OnDestroy, signal } from '@angular/core';
import { Sequencer, WorkletSynthesizer } from 'spessasynth_lib';
import { PianoTimeline } from '../music/piano-timeline';
import { ImportedScore, buildScoreMidi, importMusicXml } from '../music/musicxml-import';
import { readMxlRootfile } from '../music/mxl-container';
import { preparePulsePlan, scoreBeatGrid, BeatPulse, PreparedPulsePlan } from './piano-metronome';
import { SONGS } from '../song-manifest.generated';
import { buildXmlTypingChart, TypingTarget } from '../gameplay/piano-chart';
import { songChartFor } from '../charts/song-charts';
import { CoupledTarget, coupleTwinkleMelody } from '../gameplay/twinkle-coupling';
import { PerformedBar, PerformanceKind, PlayerPerformance } from './player-performance';

type PlaybackStatus = 'loading' | 'enable-audio' | 'ready' | 'starting' | 'count-in' | 'playing' | 'error';
type EngineStatus = 'idle' | 'preparing' | 'ready' | 'error';
export type PianoSource = string;
export interface CountInVisual {
  readonly songStart: number;
  readonly barStart: number;
  readonly position: number;
  readonly pulsePositions: readonly number[];
  readonly pulseTimes: readonly number[];
}

@Injectable()
export class PianoPlaybackService implements OnDestroy {
  private readonly document = inject(DOCUMENT);
  private readonly lifetime = new AbortController();
  private readonly statusValue = signal<PlaybackStatus>('loading');
  private readonly naturalEndValue = signal(0);
  readonly naturalEnd = this.naturalEndValue.asReadonly();
  private readonly errorValue = signal('');
  readonly status = this.statusValue.asReadonly();
  readonly error = this.errorValue.asReadonly();
  private readonly engineStatusValue = signal<EngineStatus>('idle');
  readonly engineStatus = this.engineStatusValue.asReadonly();
  private readonly engineErrorValue = signal('');
  readonly engineError = this.engineErrorValue.asReadonly();
  private readonly timelineValue = signal<PianoTimeline>({ tracks: [], notes: [] });
  readonly timeline = this.timelineValue.asReadonly();
  readonly songs = SONGS.slice(0, 1);
  private readonly sourceValue = signal<PianoSource>(SONGS[0]?.id ?? '');
  readonly source = this.sourceValue.asReadonly();
  private readonly scores = new Map<PianoSource, ImportedScore>();
  private selectionVersion = 0;
  private selectionAbort?: AbortController;
  private sequenceQueue: Promise<void> = Promise.resolve();
  private readonly scoreValue = signal<ImportedScore | null>(null);
  readonly score = this.scoreValue.asReadonly();
  private readonly chartValue = signal<readonly TypingTarget[]>([]);
  readonly chart = this.chartValue.asReadonly();
  private readonly couplingValue = signal<readonly CoupledTarget[]>([]);
  readonly melodyCoupling = this.couplingValue.asReadonly();
  private playerPerformance?: PlayerPerformance;
  private twinklePerformance?: PlayerPerformance;
  readonly speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2, 2.5, 3] as const;
  private readonly rateValue = signal(1);
  readonly playbackRate = this.rateValue.asReadonly();
  private readonly volumeValue = signal(100);
  readonly volume = this.volumeValue.asReadonly();
  private readonly metronomeValue = signal(true);
  private readonly clickVolumeValue = signal(100);
  readonly metronomeVolume = this.clickVolumeValue.asReadonly();
  readonly metronome = this.metronomeValue.asReadonly();
  private readonly metronomeErrorValue = signal('');
  readonly metronomeError = this.metronomeErrorValue.asReadonly();
  private readonly countInValue = signal<number | null>(null);
  readonly countIn = this.countInValue.asReadonly();
  private preparedPulsePlan?: PreparedPulsePlan;
  private countInPlan?: { firstAt: number; songAt: number; plan: PreparedPulsePlan };
  private readonly positionValue = signal(0);
  private readonly durationValue = signal(0);
  readonly duration = this.durationValue.asReadonly();
  private scrubPreview: number | null = null;
  private pendingSeek: number | null = null;
  private resumeAfterScrub = false;
  private clickBuffer?: AudioBuffer;
  private clickGain?: GainNode;
  private clickPromise?: Promise<void>;
  private readonly clickSources = new Set<AudioBufferSourceNode>();
  private beatGrid: BeatPulse[] = [];
  private nextBeat = 0;
  private clockTimer?: ReturnType<typeof setTimeout>;
  private naturalEndTimer?: ReturnType<typeof setTimeout>;
  private ending = false;
  private endingAt = 0;
  private transportRun = 0;
  
  setVolume(percent: number): void {
    if (!Number.isFinite(percent)) return;
    const level = Math.max(0, Math.min(500, percent));
    this.volumeValue.set(level);
    if (this.context && this.output && (this.status() === 'playing' || this.status() === 'count-in')) {
      const at = this.context.currentTime;
      this.output.gain.cancelScheduledValues(at);
      this.output.gain.setValueAtTime(this.output.gain.value, at);
      this.output.gain.linearRampToValueAtTime(level / 100, at + 0.015);
    }
  }
  
  setMetronomeVolume(percent: number): void {
    if (!Number.isFinite(percent)) return;
    const value = Math.max(0, Math.min(150, percent));
    this.clickVolumeValue.set(value);
    if (this.context && this.clickGain) {
      const at = this.context.currentTime;
      this.clickGain.gain.cancelScheduledValues(at);
      this.clickGain.gain.setValueAtTime(this.clickGain.gain.value, at);
      this.clickGain.gain.linearRampToValueAtTime(0.16 * value / 100, at + 0.015);
    }
  }

  setPlaybackRate(rate: number): void {
    if (this.status() !== 'playing' && this.status() !== 'starting' && this.status() !== 'count-in' &&
        this.speedOptions.some(option => option === rate)) {
      this.rateValue.set(rate);
      this.prepareVisualPlan();
    }
  }
  
  /** Shared time source for Canvas and typing; no independent visual/game clock. */
  get playbackPosition(): number {
    return this.scrubPreview ?? this.pendingSeek ?? (this.ending && this.context
      ? this.duration() + Math.max(0, this.context.currentTime - this.endingAt) * this.playbackRate()
      : this.status() === 'playing' ? Math.max(0, this.sequencer?.currentTime ?? this.positionValue()) : this.positionValue());
  }
  /** The audio-clock source position before a coupled melody attack's downbeat. */
  get leadInPosition(): number | null {
    const run = this.countInPlan, context = this.context;
    if (this.status() !== 'count-in' || !run || !context ||
        !this.songs.find(song => song.id === this.source())?.playerPerformedMelody ||
        !this.melodyCoupling().some(target => Math.abs(target.start - run.plan.songStart) < 1e-8)) return null;
    return Math.min(run.plan.songStart,
      run.plan.songStart + (context.currentTime - run.songAt) * this.playbackRate());
  }
  get gameplayInputPosition(): number { return this.leadInPosition ?? this.playbackPosition; }
  
  async setMetronome(enabled: boolean): Promise<void> {
    if (this.status() === 'playing' || this.status() === 'count-in' || this.status() === 'starting') return;
    this.metronomeValue.set(enabled);
    this.metronomeErrorValue.set('');
    if (enabled && !this.clickBuffer && this.context) {
      const songWasReady = this.status() === 'ready';
      if (songWasReady) this.statusValue.set('loading');
      try { await this.prepareClick(); }
      catch (error) {
        this.metronomeValue.set(false);
        this.metronomeErrorValue.set(error instanceof Error ? error.message : String(error));
      }
      if (songWasReady && !this.lifetime.signal.aborted && this.status() === 'loading') this.statusValue.set('ready');
    }
  }
  get countInVisual(): CountInVisual | null {
    const plan = this.countInPlan?.plan ?? this.preparedPulsePlan;
    if (!plan || (this.status() !== 'ready' && this.status() !== 'count-in')) return null;
    const runtime = this.countInPlan, context = this.context;
    if (this.status() === 'count-in' && (!runtime || !context)) return null;
    const position = runtime && context
      ? Math.min(plan.songStart, plan.barStart + Math.max(0, context.currentTime - runtime.firstAt) * this.playbackRate())
      : plan.barStart;
    return { songStart: plan.songStart, barStart: plan.barStart, position,
      pulsePositions: plan.countInPositions,
      pulseTimes: runtime ? [...plan.offsets.map(offset => runtime.firstAt + offset), runtime.songAt] : [] };
  }
  get visualPosition(): number { return this.countInVisual?.position ?? this.playbackPosition; }
  get songBeatPositions(): readonly number[] { return this.metronome() ? this.preparedPulsePlan?.songPositions ?? [] : []; }
  get performedBars(): readonly PerformedBar[] { return this.playerPerformance?.snapshot(this.gameplayInputPosition) ?? []; }

  performMelodyInput(targetIndex: number, kind: PerformanceKind, physical: string, position: number): void {
    if (this.status() === 'playing' || this.leadInPosition !== null)
      this.playerPerformance?.perform(targetIndex, kind, physical, position, this.playbackRate());
  }
  releasePlayerKey(physical: string): void { this.playerPerformance?.releasePhysical(physical, this.gameplayInputPosition); }
  releasePlayerVoices(): void { this.playerPerformance?.releaseAll(this.gameplayInputPosition); }
  
  private async prepareClick(): Promise<void> {
    if (this.clickBuffer) return;
    this.clickPromise ??= (async () => {
        this.context ??= new AudioContext();
        const response = await fetch(this.assetUrl('metronome.mp3'), { signal: this.lifetime.signal });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        this.clickBuffer = await this.context.decodeAudioData(await response.arrayBuffer());
        if (!this.clickBuffer.duration) throw new Error('empty audio sample');
    })();
    try { await this.clickPromise; }
    catch (error) {
      this.clickPromise = undefined;
      throw new Error(`Could not load local metronome.mp3: ${error instanceof Error ? error.message : error}`);
    }
  }
  
  beginScrub(): void {
    if (this.status() !== 'ready' && this.status() !== 'playing' && this.status() !== 'count-in') return;
    this.resumeAfterScrub = this.status() === 'playing' || this.status() === 'count-in';
    this.scrubPreview = this.playbackPosition;
    this.releasePlayerVoices();
    this.cancelClicks();
    this.mute();
    this.sequencer?.pause();
    this.synth?.stopAll(true);
  }
  
  previewSeek(seconds: number): void {
    if (!Number.isFinite(seconds)) return;
    this.scrubPreview = Math.max(0, Math.min(this.duration(), seconds));
  }
  
  commitSeek(seconds: number): void {
    if (this.status() !== 'ready' && this.status() !== 'playing' && this.status() !== 'count-in') return;
    clearTimeout(this.naturalEndTimer);
    this.naturalEndTimer = undefined;
    this.ending = false;
    this.cancelClicks();
    const destination = Math.max(0, Math.min(Math.max(0, this.duration() - 0.001), Number(seconds) || 0));
    this.playerPerformance?.releaseAll(destination, true);
    const resume = this.scrubPreview !== null ? this.resumeAfterScrub : this.status() === 'playing';
    this.mute();
    this.sequencer?.pause();
    this.synth?.stopAll(true);
    if (this.sequencer) {
      this.pendingSeek = destination;
      this.sequencer.currentTime = destination;
    }
    this.positionValue.set(destination);
    this.prepareVisualPlan();
    this.scrubPreview = null;
    this.resumeAfterScrub = false;
    if (resume && this.sequencer && this.context && this.output) {
      this.startCountIn();
    } else this.statusValue.set('ready');
  }
  
  private soundFont?: ArrayBuffer;
  private context?: AudioContext;
  private output?: GainNode;
  private synth?: WorkletSynthesizer;
  private sequencer?: Sequencer;
  private enginePromise?: Promise<void>;
  private loadedSongId = '';

  /** Call from Start or How to Play click: context creation/resume runs before any await. */
  activateAudio(): void {
    if (this.lifetime.signal.aborted) return;
    try {
      this.context ??= new AudioContext();
      const resume = this.context.resume();
      this.engineStatusValue.set('preparing');
      this.engineErrorValue.set('');
      if (this.sequencer) {
        void resume.then(() => this.engineStatusValue.set('ready'), error => {
          this.engineErrorValue.set(`Could not resume audio: ${error instanceof Error ? error.message : error}`);
          this.engineStatusValue.set('error');
        });
        return;
      }
      this.enginePromise ??= (async () => {
        await this.waitFor(resume, 'Could not enable browser audio.');
        this.soundFont ??= await this.fetchAsset('SalC5Light2.sf2', 'RIFF');
        await this.prepareClick();
        await this.initialiseAudio();
        this.soundFont = undefined;
        this.engineStatusValue.set('ready');
      })().catch(error => {
        if (this.lifetime.signal.aborted) return;
        this.engineErrorValue.set(error instanceof Error ? error.message : String(error));
        this.engineStatusValue.set('error');
        this.releaseAudio();
        this.enginePromise = undefined;
        throw error;
      });
      // A homepage entry need not await this promise; selection does await it.
      void this.enginePromise.catch(() => {});
    } catch (error) {
      this.engineErrorValue.set(error instanceof Error ? error.message : String(error));
      this.engineStatusValue.set('error');
    }
  }

  async selectSong(id: string): Promise<void> {
    const song = SONGS.find(entry => entry.id === id);
    if (!song || this.lifetime.signal.aborted) return;
    if (!this.enginePromise && !this.sequencer) this.activateAudio();
    const version = ++this.selectionVersion;
    clearTimeout(this.naturalEndTimer);
    this.naturalEndTimer = undefined;
    this.ending = false;
    this.selectionAbort?.abort();
    const controller = new AbortController();
    this.selectionAbort = controller;
    this.cancelClicks();
    this.silenceAndRewind();
    this.sourceValue.set(id);
    this.statusValue.set('loading');
    this.errorValue.set('');
    this.scoreValue.set(null);
    this.couplingValue.set([]);
    this.playerPerformance = undefined;
    this.preparedPulsePlan = undefined;
    this.chartValue.set([]);
    this.timelineValue.set({ tracks: [], notes: [] });
    this.durationValue.set(0);
    this.positionValue.set(0);
    this.pendingSeek = null;
    this.scrubPreview = null;
    try {
      let score = this.scores.get(id);
      if (!score) {
        const compressed = song.file.toLowerCase().endsWith('.mxl');
        const buffer = await this.fetchAsset(`tracks/${song.file}`, compressed ? 'PK' : '<?xml', controller.signal);
        const xml = compressed ? await readMxlRootfile(buffer) : new TextDecoder().decode(buffer);
        if (version !== this.selectionVersion || controller.signal.aborted) return;
        score = importMusicXml(xml);
        this.scores.set(id, score);
      }
      if (version !== this.selectionVersion || controller.signal.aborted) return;
      const chart = songChartFor(id);
      const targets = buildXmlTypingChart(score, chart.phrases, chart.unitsPerQuarter);
      const coupling = song.playerPerformedMelody ? coupleTwinkleMelody(score, targets) : [];
      const playbackMidi = song.playerPerformedMelody
        ? buildScoreMidi(score, new Set(coupling.flatMap(target => target.notes.map(note => note.id)))) : score.midi;
      this.chartValue.set(targets);
      this.couplingValue.set(coupling);
      this.scoreValue.set(score);
      this.timelineValue.set(score.timeline);
      this.durationValue.set(score.duration);
      this.beatGrid = scoreBeatGrid(score);
      this.prepareVisualPlan();
      if (this.enginePromise) await this.enginePromise;
      if (!this.sequencer) throw new Error(this.engineError() || 'Audio engine is not ready. Return home and retry Start.');
      if (version !== this.selectionVersion || controller.signal.aborted) return;
      if (this.loadedSongId !== id) await this.queueSequence(playbackMidi, id);
      if (version !== this.selectionVersion || controller.signal.aborted) return;
      if (song.playerPerformedMelody) {
        this.twinklePerformance ??= this.createPlayerPerformance(score, coupling);
        this.playerPerformance = this.twinklePerformance;
        this.playerPerformance.releaseAll(0, true);
      }
      this.statusValue.set('ready');
    } catch (error) {
      if (version === this.selectionVersion && !controller.signal.aborted && !this.lifetime.signal.aborted) {
        this.errorValue.set(`Could not load ${song.title}: ${error instanceof Error ? error.message : error}`);
        this.statusValue.set('error');
      }
    }
  }

  async play(): Promise<void> {
    if (this.status() !== 'ready' || this.lifetime.signal.aborted) return;
    const version = this.selectionVersion;
    if (!this.sequencer || !this.context || this.loadedSongId !== this.source()) return;
    // Set synchronously: double clicks cannot create a second engine.
    this.statusValue.set('starting');
    try {
      // Before any await so browser audio is unlocked by the user's click.
      await this.waitFor(this.context.resume(), 'Could not start browser audio.');
      this.lifetime.signal.throwIfAborted();
      if (version !== this.selectionVersion || this.status() !== 'starting') return;
      this.sequencer.playbackRate = this.playbackRate();
      this.startCountIn();
    } catch (error) {
      if (version === this.selectionVersion && this.status() === 'starting') this.fail(error);
    }
  }
  
  stop(): void {
    if (this.status() !== 'playing' && this.status() !== 'count-in' && this.status() !== 'starting' && this.status() !== 'ready') return;
    clearTimeout(this.naturalEndTimer);
    this.naturalEndTimer = undefined;
    this.ending = false;
    this.cancelClicks();
    this.scrubPreview = null;
    this.pendingSeek = null;
    this.resumeAfterScrub = false;
    this.silenceAndRewind();
    this.positionValue.set(0);
    this.prepareVisualPlan();
    this.statusValue.set('ready');
  }

  /** Return to an armed beginning without rebuilding the audio engine or song. */
  restart(): void {
    if (this.lifetime.signal.aborted) return;
    if (this.status() === 'loading' || this.status() === 'enable-audio' || this.status() === 'error') {
      void this.selectSong(this.source());
      return;
    }
    this.stop();
  }

  /** Fade an opening-passage ending on the audio clock before transport cleanup. */
  async fadeOutAndStop(milliseconds = 180): Promise<void> {
    if (this.status() !== 'playing' || !this.context || !this.output) return;
    const run = this.transportRun;
    const at = this.context.currentTime;
    this.output.gain.cancelScheduledValues(at);
    this.output.gain.setValueAtTime(this.output.gain.value, at);
    this.output.gain.linearRampToValueAtTime(0, at + milliseconds / 1000);
    await new Promise(resolve => setTimeout(resolve, milliseconds + 15));
    if (run === this.transportRun && this.status() === 'playing') this.stop();
  }
  
  ngOnDestroy(): void {
    this.selectionAbort?.abort();
    this.lifetime.abort();
    this.releaseAudio();
  }
  
  private async initialiseAudio(): Promise<void> {
    const context = this.context;
    if (!context.audioWorklet) {
      throw new Error('This browser needs AudioWorklet support and HTTPS or localhost.');
    }
    await this.waitFor(
      context.audioWorklet.addModule(this.assetUrl('runtime/spessasynth_processor.min.js')),
      'Could not load the piano audio worklet.',
    );
    this.output = context.createGain();
    this.output.gain.value = 0;
    this.output.connect(context.destination);
    this.clickGain = context.createGain();
    this.clickGain.gain.value = 0.16 * this.metronomeVolume() / 100;
    this.clickGain.connect(this.output);
    this.synth = new WorkletSynthesizer(context, {
      audioNodeCreators: {
        worklet: (audioContext, name, options) => {
          const node = new AudioWorkletNode(audioContext, name, options);
          node.onprocessorerror = () => this.fail(new Error('The piano audio engine stopped unexpectedly. Reload to try again.'));
          return node;
        },
      },
    });
    this.synth.connect(this.output);
    await this.waitFor(this.synth.isReady, 'The piano audio engine did not initialise.');
    await this.waitFor(
      this.synth.soundBankManager.addSoundBank(this.soundFont!, 'supplied-piano'),
      'Could not initialise the supplied SF2 piano.',
    );
    // Bank 0 / program 0 is the supplied SF2's complete piano. The other
    // presets are velocity layers. The supplied MIDI has no program changes.
    for (let channel = 0; channel < this.synth.channelCount; channel++) {
      this.synth.programChange(channel, 0);
    }
    const sequencer = new Sequencer(this.synth, { skipToFirstNoteOn: false });
    this.sequencer = sequencer;
    sequencer.loopCount = 0;
    sequencer.eventHandler.addEvent('timeChange', 'piano-seek', at => {
      if (this.pendingSeek !== null && Math.abs(at - this.pendingSeek) < 0.05) this.pendingSeek = null;
    });
    sequencer.eventHandler.addEvent('songEnded', 'piano-ended', () => {
      if (this.status() !== 'playing' || this.naturalEndTimer) return;
      this.ending = true;
      this.endingAt = this.context.currentTime;
      // Leave the last real-time attack/release window available after the
      // sequencer finishes; the audio tail is not cut by the results screen.
      this.naturalEndTimer = setTimeout(() => {
        this.naturalEndTimer = undefined;
        if (this.status() !== 'playing') return;
        this.stop();
        this.naturalEndValue.update(value => value + 1);
      }, 220);
    });
  }
  
  private mute(): void {
    if (!this.output || !this.context) return;
    const at = this.context.currentTime;
    this.output.gain.cancelScheduledValues(at);
    this.output.gain.setValueAtTime(0, at);
  }
  
  private startSequence(fromCountIn = false): void {
    if (!this.sequencer) return;
    this.pendingSeek = this.positionValue();
    this.sequencer.currentTime = this.positionValue();
    if (!fromCountIn) this.rampVolume();
    this.sequencer.play();
    this.countInValue.set(null);
    this.countInPlan = undefined;
    this.statusValue.set('playing');
    if (this.metronome() && this.clickBuffer) this.scheduleBeatGrid();
  }
  
  private startCountIn(): void {
    const score = this.score(), context = this.context;
    if (!score || !context || !this.clickBuffer) { this.fail(new Error('The count-in click is unavailable. Retry audio preparation.')); return; }
    this.cancelClicks();
    this.prepareVisualPlan();
    const plan = this.preparedPulsePlan!;
    const { offsets } = plan;
    const spacing = plan.beatSeconds;
    const firstAt = context.currentTime + 0.055;
    const songAt = firstAt + offsets.length * spacing;
    const run = ++this.transportRun;
    this.countInPlan = { firstAt, songAt, plan };
    this.countInValue.set(offsets.length);
    this.statusValue.set('count-in');
    this.rampVolume();
    offsets.forEach(offset => this.scheduleClick(firstAt + offset));
    this.scheduleClick(songAt); // downbeat coincides with the song start
    const wake = () => {
      if (run !== this.transportRun || this.status() !== 'count-in') return;
      const remaining = Math.min(offsets.length, Math.max(1, Math.ceil((songAt - context.currentTime) / spacing)));
      if (remaining !== this.countIn()) this.countInValue.set(remaining);
      if (context.currentTime >= songAt - 0.004) {
        this.startSequence(true);
      } else this.clockTimer = setTimeout(wake, Math.max(1, Math.min(10, (songAt - context.currentTime) * 500)));
    };
    wake();
  }
  
  private scheduleClick(at: number): void {
    if (!this.clickBuffer || !this.clickGain || !this.context) return;
    
    const offset = 0.04; // Skip the first 40 ms
    const duration = Math.min(0.12, this.clickBuffer.duration - offset);
    if (duration <= 0) return;
    
    const source = this.context.createBufferSource();
    source.buffer = this.clickBuffer;
    source.connect(this.clickGain);
    source.onended = () => {
      this.clickSources.delete(source);
      source.disconnect();
    };
    
    source.start(at, offset, duration);
    this.clickSources.add(source);
  }

  private prepareVisualPlan(): void {
    const score = this.score();
    this.preparedPulsePlan = score ? preparePulsePlan(score, this.positionValue(), this.playbackRate(), this.beatGrid) : undefined;
  }
  
  private scheduleBeatGrid(): void {
    if (!this.context || !this.sequencer || !this.metronome()) return;
    const run = ++this.transportRun;
    this.nextBeat = this.beatGrid.findIndex(pulse => pulse.sourceTime > this.positionValue() + 1e-7);
    if (this.nextBeat < 0) this.nextBeat = this.beatGrid.length;
    const fill = () => {
      if (run !== this.transportRun || this.status() !== 'playing' || !this.sequencer) return;
      const now = this.context.currentTime;
      const position = this.sequencer.currentTime;
      const horizon = position + 0.3 * this.playbackRate();
      while (this.nextBeat < this.beatGrid.length && this.beatGrid[this.nextBeat].sourceTime <= horizon) {
        const beat = this.beatGrid[this.nextBeat++];
        const at = now + (beat.sourceTime - position) / this.playbackRate();
        if (at > now + 0.004) this.scheduleClick(at);
      }
      this.clockTimer = setTimeout(fill, 50);
    };
    fill();
  }
  
  private cancelClicks(): void {
    this.transportRun++;
    clearTimeout(this.clockTimer);
    this.clockTimer = undefined;
    for (const source of this.clickSources) {
      source.onended = null;
      try { source.stop(); } catch {}
      source.disconnect();
    }
    this.clickSources.clear();
    this.countInValue.set(null);
    this.countInPlan = undefined;
  }
  private rampVolume(): void {
    if (!this.output || !this.context) return;
    const at = this.context.currentTime;
    this.output.gain.cancelScheduledValues(at);
    this.output.gain.setValueAtTime(0, at);
    this.output.gain.linearRampToValueAtTime(this.volume() / 100, at + 0.015);
  }
  
  private async loadSequence(buffer: ArrayBuffer, source: PianoSource): Promise<void> {
    const sequencer = this.sequencer;
    await this.waitFor(new Promise<void>((resolve, reject) => {
      sequencer.eventHandler.addEvent('songChange', 'piano-loaded', () => resolve());
      sequencer.eventHandler.addEvent('midiError', 'piano-error', error => {
        reject(error);
      });
      sequencer.loadNewSongList([{ binary: buffer, fileName: `${source}.mid` }]);
    }), 'Could not prepare the supplied MIDI for playback.');
    this.loadedSongId = source;
  }

  private async queueSequence(buffer: ArrayBuffer, source: PianoSource): Promise<void> {
    const operation = this.sequenceQueue.catch(() => {}).then(() => this.loadSequence(buffer, source));
    this.sequenceQueue = operation;
    await operation;
  }
  
  private silenceAndRewind(): void {
    // Mute immediately, including effect tails; rewind resets MIDI controllers.
    this.playerPerformance?.releaseAll(this.playbackPosition, true);
    this.mute();
    this.sequencer?.pause();
    this.synth?.stopAll(true);
    this.synth?.reset();
    if (this.sequencer) this.sequencer.currentTime = 0;
  }
  
  private releaseAudio(): void {
    clearTimeout(this.naturalEndTimer);
    this.cancelClicks();
    this.silenceAndRewind();
    this.synth?.destroy();
    this.output?.disconnect();
    this.clickGain?.disconnect();
    if (this.context) void this.context.close().catch(() => {});
    this.sequencer = undefined;
    this.synth = undefined;
    this.output = undefined;
    this.clickGain = undefined;
    this.context = undefined;
    this.soundFont = undefined;
    this.playerPerformance = undefined;
    this.twinklePerformance = undefined;
  }

  private createPlayerPerformance(score: ImportedScore, targets: readonly CoupledTarget[]): PlayerPerformance {
    const synth = this.synth!, context = this.context!;
    // The sequencer uses one channel per staff/voice track. Reserve only channels
    // outside that set: the worklet's initial 16 channels already exist on both
    // sides, whereas dynamically adding one is not synchronous in this version.
    const sequencerChannels = new Set(
      [...new Set(score.soundingNotes.map(note => `${note.staff}:${note.voice}`))].sort()
        .map((_, index) => index),
    );
    const playerChannels = Array.from({ length: Math.min(16, synth.channelCount) }, (_, index) => index)
      .filter(channel => channel !== 9 && !sequencerChannels.has(channel));
    let nextChannel = 0;
    return new PlayerPerformance(targets, {
      now: () => context.currentTime,
      newChannel: () => {
        const channel = playerChannels[nextChannel++];
        if (channel === undefined) return -1;
        synth.programChange(channel, 0);
        synth.controllerChange(channel, 64, 0);
        return channel;
      },
      noteOn: (channel, pitch, velocity, at) => synth.noteOn(channel, pitch, velocity, { time: at }),
      noteOff: (channel, pitch, at) => synth.noteOff(channel, pitch, { time: at }),
    });
  }
  
  private fail(error: unknown): void {
    if (this.lifetime.signal.aborted) return;
    this.errorValue.set(error instanceof Error ? error.message : String(error));
    this.statusValue.set('error');
    this.selectionAbort?.abort();
    this.lifetime.abort();
    this.releaseAudio();
  }
  
  private assetUrl(fileName: string): string {
    return new URL(`assets/piano/${fileName}`, this.document.baseURI).href;
  }
  
  private async fetchAsset(fileName: string, signature: string, signal = this.lifetime.signal): Promise<ArrayBuffer> {
    const response = await fetch(this.assetUrl(fileName), { signal });
    if (!response.ok) throw new Error(`Could not load ${fileName}: HTTP ${response.status}.`);
    const buffer = await response.arrayBuffer();
    if (!new TextDecoder().decode(buffer.slice(0, signature.length)).startsWith(signature)) {
      throw new Error(`Invalid ${fileName} response. Check that Angular serves the supplied file.`);
    }
    return buffer;
  }
  
  // Only initialisation uses a timeout. MIDI scheduling uses the audio clock.
  private async waitFor<T>(operation: Promise<T>, message: string): Promise<T> {
    const signal = this.lifetime.signal;
    signal.throwIfAborted();
    let timer: ReturnType<typeof setTimeout>;
    let abort: () => void;
    try {
      const result = await Promise.race([
        operation,
        new Promise<never>((_, reject) => {
          abort = () => reject(signal.reason);
          timer = setTimeout(() => reject(new Error(message)), 60_000);
          signal.addEventListener('abort', abort, { once: true });
        }),
      ]);
      signal.throwIfAborted();
      return result;
    } catch (error) {
      throw new Error(`${message} ${error instanceof Error ? error.message : error}`);
    } finally {
      clearTimeout(timer);
      signal.removeEventListener('abort', abort);
    }
  }
}
