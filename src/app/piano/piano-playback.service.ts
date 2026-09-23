import { DOCUMENT, inject, Injectable, OnDestroy, signal } from '@angular/core';
import { Sequencer, WorkletSynthesizer } from 'spessasynth_lib';
import { extractPianoTimeline, PianoTimeline } from './piano-timeline';

type PlaybackStatus = 'loading' | 'ready' | 'playing' | 'error';

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
  readonly speedOptions = [1, 1.25, 1.5, 2] as const;
  private readonly rateValue = signal(1);
  readonly playbackRate = this.rateValue.asReadonly();

  setPlaybackRate(rate: number): void {
    if (this.status() === 'ready' && this.speedOptions.some(option => option === rate)) this.rateValue.set(rate);
  }

  /** Shared time source for Canvas and typing; no independent visual/game clock. */
  get playbackPosition(): number {
    return this.status() === 'playing' ? Math.max(0, this.sequencer?.currentTime ?? 0) : 0;
  }

  private assets?: { soundFont: ArrayBuffer; midi: ArrayBuffer };
  private context?: AudioContext;
  private output?: GainNode;
  private synth?: WorkletSynthesizer;
  private sequencer?: Sequencer;
  private loadStarted = false;

  async load(): Promise<void> {
    if (this.loadStarted) return;
    this.loadStarted = true;
    try {
      const [soundFont, midi] = await Promise.all([
        this.fetchAsset('acoustic_grand_piano_ydp_20080910.sf2', 'RIFF'),
        this.fetchAsset('marche-turque.mid', 'MThd'),
      ]);
      this.lifetime.signal.throwIfAborted();
      this.assets = { soundFont, midi };
      this.timelineValue.set(extractPianoTimeline(midi));
      this.statusValue.set('ready');
    } catch (error) {
      this.fail(error);
    }
  }

  async play(): Promise<void> {
    if (this.status() !== 'ready' || this.lifetime.signal.aborted) return;
    // Set synchronously: double clicks cannot create a second engine.
    this.statusValue.set('loading');
    try {
      this.context ??= new AudioContext();
      // Before any await so browser audio is unlocked by the user's click.
      await this.waitFor(this.context.resume(), 'Could not start browser audio.');
      if (!this.sequencer) await this.initialiseAudio();
      this.lifetime.signal.throwIfAborted();
      this.sequencer.playbackRate = this.playbackRate();
      this.sequencer.currentTime = 0;
      this.output.gain.setValueAtTime(1, this.context.currentTime);
      this.sequencer.play();
      this.statusValue.set('playing');
    } catch (error) {
      this.fail(error);
    }
  }

  stop(): void {
    if (this.status() !== 'playing') return;
    this.silenceAndRewind();
    this.statusValue.set('ready');
  }

  ngOnDestroy(): void {
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
      this.synth.soundBankManager.addSoundBank(this.assets.soundFont, 'supplied-piano'),
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
    sequencer.eventHandler.addEvent('songEnded', 'piano-ended', () => {
      if (this.status() === 'playing') this.stop();
    });
    await this.waitFor(new Promise<void>((resolve, reject) => {
      sequencer.eventHandler.addEvent('songChange', 'piano-loaded', () => resolve());
      sequencer.eventHandler.addEvent('midiError', 'piano-error', error => {
        reject(error);
        this.fail(error);
      });
      sequencer.loadNewSongList([{ binary: this.assets.midi, fileName: 'marche-turque.mid' }]);
    }), 'Could not prepare the supplied MIDI for playback.');
    this.assets = undefined;
  }

  private silenceAndRewind(): void {
    // Mute immediately, including effect tails; rewind resets MIDI controllers.
    this.output?.gain.setValueAtTime(0, this.context.currentTime);
    this.sequencer?.pause();
    this.synth?.stopAll(true);
    this.synth?.reset();
    if (this.sequencer) this.sequencer.currentTime = 0;
  }

  private releaseAudio(): void {
    this.silenceAndRewind();
    this.synth?.destroy();
    this.output?.disconnect();
    if (this.context) void this.context.close().catch(() => {});
    this.sequencer = undefined;
    this.synth = undefined;
    this.output = undefined;
    this.context = undefined;
    this.assets = undefined;
  }

  private fail(error: unknown): void {
    if (this.lifetime.signal.aborted) return;
    this.errorValue.set(error instanceof Error ? error.message : String(error));
    this.statusValue.set('error');
    this.lifetime.abort();
    this.releaseAudio();
  }

  private assetUrl(fileName: string): string {
    return new URL(`assets/piano/${fileName}`, this.document.baseURI).href;
  }

  private async fetchAsset(fileName: string, signature: string): Promise<ArrayBuffer> {
    const response = await fetch(this.assetUrl(fileName), { signal: this.lifetime.signal });
    if (!response.ok) throw new Error(`Could not load ${fileName}: HTTP ${response.status}.`);
    const buffer = await response.arrayBuffer();
    if (new TextDecoder().decode(buffer.slice(0, 4)) !== signature) {
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
