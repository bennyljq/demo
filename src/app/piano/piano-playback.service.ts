import { DOCUMENT, inject, Injectable, OnDestroy, signal } from '@angular/core';
import { Sequencer, WorkletSynthesizer } from 'spessasynth_lib';
import { PianoTimeline } from './piano-timeline';
import { ImportedScore, importMusicXml } from './musicxml-import';
import { readMxlRootfile } from './mxl-container';
import { countInBeatSeconds, scoreBeatGrid, BeatPulse } from './piano-metronome';
import { SONGS } from './song-manifest.generated';

type PlaybackStatus = 'loading' | 'ready' | 'count-in' | 'playing' | 'error';
export type PianoSource = string;

@Injectable()
export class PianoPlaybackService implements OnDestroy {
  private readonly document = inject(DOCUMENT);
  private readonly lifetime = new AbortController();
  private readonly statusValue = signal<PlaybackStatus>('loading');
  private readonly errorValue = signal('');
  readonly status = this.statusValue.asReadonly();
  readonly error = this.errorValue.asReadonly();
  private readonly timelineValue = signal<PianoTimeline>({ tracks: [], notes: [] });
  readonly timeline = this.timelineValue.asReadonly();
  readonly songs = SONGS;
  private readonly sourceValue = signal<PianoSource>(SONGS[0]?.id ?? '');
  readonly source = this.sourceValue.asReadonly();
  private readonly scores = new Map<PianoSource, ImportedScore>();
  private selectionVersion = 0;
  private selectionAbort?: AbortController;
  private sequenceQueue: Promise<void> = Promise.resolve();
  private readonly scoreValue = signal<ImportedScore | null>(null);
  readonly score = this.scoreValue.asReadonly();
  readonly speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2, 2.5, 3] as const;
  private readonly rateValue = signal(1);
  readonly playbackRate = this.rateValue.asReadonly();
  private readonly volumeValue = signal(500);
  readonly volume = this.volumeValue.asReadonly();
  private readonly metronomeValue = signal(true);
  private readonly clickVolumeValue = signal(50);
  readonly metronomeVolume = this.clickVolumeValue.asReadonly();
  readonly metronome = this.metronomeValue.asReadonly();
  private readonly metronomeErrorValue = signal('');
  readonly metronomeError = this.metronomeErrorValue.asReadonly();
  private readonly countInValue = signal<number | null>(null);
  readonly countIn = this.countInValue.asReadonly();
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
    if (this.status() === 'ready' && this.speedOptions.some(option => option === rate)) this.rateValue.set(rate);
  }
  
  /** Shared time source for Canvas and typing; no independent visual/game clock. */
  get playbackPosition(): number {
    return this.scrubPreview ?? this.pendingSeek ?? (this.status() === 'playing' ? Math.max(0, this.sequencer?.currentTime ?? this.positionValue()) : this.positionValue());
  }
  
  setMetronome(enabled: boolean): void {
    if (this.status() !== 'ready') return;
    this.metronomeValue.set(enabled);
    this.metronomeErrorValue.set('');
    if (enabled) void this.prepareClick();
  }
  
  private async prepareClick(): Promise<void> {
    if (this.clickBuffer) return;
    this.clickPromise ??= (async () => {
      try {
        this.context ??= new AudioContext();
        const response = await fetch(this.assetUrl('metronome.mp3'), { signal: this.lifetime.signal });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        this.clickBuffer = await this.context.decodeAudioData(await response.arrayBuffer());
        if (!this.clickBuffer.duration) throw new Error('empty audio sample');
      } catch (error) {
        if (!this.lifetime.signal.aborted) {
          this.metronomeValue.set(false);
          this.metronomeErrorValue.set(`Could not load local metronome.mp3: ${error instanceof Error ? error.message : error}`);
        }
      }
    })();
    await this.clickPromise;
    if (!this.clickBuffer) this.clickPromise = undefined;
  }
  
  beginScrub(): void {
    if (this.status() !== 'ready' && this.status() !== 'playing' && this.status() !== 'count-in') return;
    this.resumeAfterScrub = this.status() === 'playing' || this.status() === 'count-in';
    this.scrubPreview = this.playbackPosition;
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
    const destination = Math.max(0, Math.min(Math.max(0, this.duration() - 0.001), Number(seconds) || 0));
    const resume = this.scrubPreview !== null ? this.resumeAfterScrub : this.status() === 'playing';
    this.mute();
    this.sequencer?.pause();
    this.synth?.stopAll(true);
    if (this.sequencer) {
      this.pendingSeek = destination;
      this.sequencer.currentTime = destination;
    }
    this.positionValue.set(destination);
    this.scrubPreview = null;
    this.resumeAfterScrub = false;
    if (resume && this.sequencer && this.context && this.output) {
      if (this.metronome() && this.clickBuffer && this.score()) this.startCountIn();
      else this.startSequence();
    } else this.statusValue.set('ready');
  }
  
  private soundFont?: ArrayBuffer;
  private context?: AudioContext;
  private output?: GainNode;
  private synth?: WorkletSynthesizer;
  private sequencer?: Sequencer;
  private loadedSongId = '';
  private loadStarted = false;

  async load(): Promise<void> {
    if (this.loadStarted) return;
    this.loadStarted = true;
    try {
      this.soundFont = await this.fetchAsset('acoustic_grand_piano_ydp_20080910.sf2', 'RIFF');
      if (!this.lifetime.signal.aborted) await this.selectSong(this.source());
    } catch (error) { this.fail(error); }
  }

  async selectSong(id: string): Promise<void> {
    const song = SONGS.find(entry => entry.id === id);
    if (!song || this.lifetime.signal.aborted) return;
    if (!this.soundFont && !this.synth) {
      // A selection made while the shared SF2 is still downloading becomes
      // the initial song; the normal load path will fetch only that score.
      this.sourceValue.set(id);
      return;
    }
    const version = ++this.selectionVersion;
    this.selectionAbort?.abort();
    const controller = new AbortController();
    this.selectionAbort = controller;
    this.cancelClicks();
    this.silenceAndRewind();
    this.sourceValue.set(id);
    this.statusValue.set('loading');
    this.errorValue.set('');
    this.scoreValue.set(null);
    this.timelineValue.set({ tracks: [], notes: [] });
    this.durationValue.set(0);
    this.positionValue.set(0);
    this.pendingSeek = null;
    this.scrubPreview = null;
    try {
      let score = this.scores.get(id);
      if (!score) {
        const buffer = await this.fetchAsset(`tracks/${song.file}`, 'PK', controller.signal);
        const xml = await readMxlRootfile(buffer);
        if (version !== this.selectionVersion || controller.signal.aborted) return;
        score = importMusicXml(xml);
        this.scores.set(id, score);
      }
      if (version !== this.selectionVersion || controller.signal.aborted) return;
      if (this.sequencer) {
        const selectedScore = score;
        const operation = this.sequenceQueue.catch(() => {}).then(async () => {
          if (version === this.selectionVersion) await this.loadSequence(selectedScore.midi, id);
        });
        this.sequenceQueue = operation;
        await operation;
      }
      if (version !== this.selectionVersion || controller.signal.aborted) return;
      this.scoreValue.set(score);
      this.timelineValue.set(score.timeline);
      this.durationValue.set(score.duration);
      this.beatGrid = scoreBeatGrid(score);
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
    const selected = this.score();
    if (!selected) return;
    // Set synchronously: double clicks cannot create a second engine.
    this.statusValue.set('loading');
    try {
      this.context ??= new AudioContext();
      // Before any await so browser audio is unlocked by the user's click.
      await this.waitFor(this.context.resume(), 'Could not start browser audio.');
      if (!this.sequencer) await this.initialiseAudio(selected.midi, this.source());
      else if (this.loadedSongId !== this.source()) await this.queueSequence(selected.midi, this.source());
      if (this.metronome()) await this.prepareClick();
      this.lifetime.signal.throwIfAborted();
      if (version !== this.selectionVersion) return;
      this.sequencer.playbackRate = this.playbackRate();
      if (this.metronome() && this.clickBuffer && this.score()) this.startCountIn();
      else this.startSequence();
    } catch (error) {
      this.fail(error);
    }
  }
  
  stop(): void {
    if (this.status() !== 'playing' && this.status() !== 'count-in' && this.status() !== 'ready') return;
    this.cancelClicks();
    this.scrubPreview = null;
    this.pendingSeek = null;
    this.resumeAfterScrub = false;
    this.silenceAndRewind();
    this.positionValue.set(0);
    this.statusValue.set('ready');
  }
  
  ngOnDestroy(): void {
    this.selectionAbort?.abort();
    this.lifetime.abort();
    this.releaseAudio();
  }
  
  private async initialiseAudio(midi: ArrayBuffer, id: string): Promise<void> {
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
      if (this.status() === 'playing') this.stop();
    });
    await this.queueSequence(midi, id);
    this.soundFont = undefined;
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
    this.statusValue.set('playing');
    if (this.metronome() && this.clickBuffer) this.scheduleBeatGrid();
  }
  
  private startCountIn(): void {
    const score = this.score(), context = this.context;
    if (!score || !context || !this.clickBuffer) { this.startSequence(); return; }
    this.cancelClicks();
    const offsets = countInBeatSeconds(score, this.positionValue(), this.playbackRate());
    const spacing = offsets.length > 1 ? offsets[1] - offsets[0] : 60 / 120 / this.playbackRate();
    const firstAt = context.currentTime + 0.055;
    const songAt = firstAt + offsets.length * spacing;
    const run = ++this.transportRun;
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
    this.mute();
    this.sequencer?.pause();
    this.synth?.stopAll(true);
    this.synth?.reset();
    if (this.sequencer) this.sequencer.currentTime = 0;
  }
  
  private releaseAudio(): void {
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
    if (!new TextDecoder().decode(buffer.slice(0, 4)).startsWith(signature)) {
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
