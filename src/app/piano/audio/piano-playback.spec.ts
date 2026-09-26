import { TestBed } from '@angular/core/testing';
import { PianoPlaybackService } from './piano-playback.service';
import { importMusicXml } from '../music/musicxml-import';
import { SONGS } from '../song-manifest.generated';

describe('song selection', () => {
  it('starts with the first visible song selected for loading', () => {
    const service = TestBed.runInInjectionContext(() => new PianoPlaybackService());
    try {
      expect(service.source()).toBe(service.songs[0].id);
      expect(service.source()).toBe('twinkle-theme');
    } finally { service.ngOnDestroy(); }
  });

  it('accepts a speed choice before any song is loaded', () => {
    const service = TestBed.runInInjectionContext(() => new PianoPlaybackService());
    try {
      service.setPlaybackRate(0.75);
      expect(service.playbackRate()).toBe(0.75);
    } finally { service.ngOnDestroy(); }
  });

  it('restarts preparation and ignores a late audio-resume callback from the old run', async () => {
    const service = TestBed.runInInjectionContext(() => new PianoPlaybackService());
    const internal = service as any;
    const selection = spyOn(service, 'selectSong').and.resolveTo();
    try {
      service.restart();
      expect(selection).toHaveBeenCalledOnceWith(service.source());
      let finishResume!: () => void;
      internal.context = { resume: () => new Promise<void>(resolve => { finishResume = resolve; }), close: async () => {} };
      internal.sequencer = { currentTime: 0, pause: () => {} };
      internal.loadedSongId = service.source();
      internal.statusValue.set('ready');
      const start = spyOn(internal, 'startCountIn');
      const playing = service.play();
      expect(service.status()).toBe('starting');
      service.restart();
      finishResume();
      await playing;
      expect(service.status()).toBe('ready');
      expect(start).not.toHaveBeenCalled();
    } finally { service.ngOnDestroy(); }
  });

  it('does not let a stale score request replace the latest selection', async () => {
    const service = TestBed.runInInjectionContext(() => new PianoPlaybackService());
    let finishPreparation!: () => void;
    const preparation = new Promise<void>(resolve => { finishPreparation = resolve; });
    (service as any).enginePromise = preparation;
    (service as any).sequencer = { pause: () => {}, currentTime: 0 };
    spyOn(service as any, 'queueSequence').and.callFake(async (_midi: ArrayBuffer, id: string) => {
      (service as any).loadedSongId = id;
    });
    const originalFetch = globalThis.fetch.bind(globalThis);
    const fetchSpy = spyOn(globalThis, 'fetch').and.callFake(async (input: RequestInfo | URL, init?: RequestInit) => {
      if (String(input).includes('Greensleeves.mxl')) await new Promise(resolve => setTimeout(resolve, 30));
      return originalFetch(input, init);
    });
    try {
      const stale = service.selectSong('greensleeves');
      const latest = service.selectSong('liebestraum-no-3-in-a-major');
      await new Promise(resolve => setTimeout(resolve, 10));
      expect(service.status()).toBe('loading');
      finishPreparation();
      await Promise.all([stale, latest]);
      expect(service.source()).toBe('liebestraum-no-3-in-a-major');
      expect(service.score()?.measureCount).toBe(88);
      expect(service.status()).toBe('ready');
      expect(fetchSpy.calls.count()).toBe(2);
    } finally { service.ngOnDestroy(); }
  });

  it('queues the untouched imported MIDI and no player voices for other songs', async () => {
    const service = TestBed.runInInjectionContext(() => new PianoPlaybackService());
    const internal = service as any;
    internal.enginePromise = Promise.resolve();
    internal.sequencer = { pause: () => {}, currentTime: 0 };
    let queued: ArrayBuffer | undefined;
    spyOn(internal, 'queueSequence').and.callFake(async (midi: ArrayBuffer, id: string) => {
      queued = midi;
      internal.loadedSongId = id;
    });
    try {
      for (const song of SONGS.filter(song => !song.playerPerformedMelody)) {
        await service.selectSong(song.id);
        expect(service.status()).withContext(song.id).toBe('ready');
        expect(queued).withContext(song.id).toBe(service.score()?.midi);
        expect(service.melodyCoupling()).withContext(song.id).toEqual([]);
        expect(service.performedBars).withContext(song.id).toEqual([]);
      }
    } finally { service.ngOnDestroy(); }
  });

  it('releases player voices and bars on restart and committed seek', () => {
    const service = TestBed.runInInjectionContext(() => new PianoPlaybackService());
    const internal = service as any;
    const releaseAll = jasmine.createSpy('releaseAll');
    internal.playerPerformance = { releaseAll };
    internal.sequencer = { pause: () => {}, currentTime: 0 };
    internal.synth = { stopAll: () => {}, reset: () => {}, destroy: () => {} };
    internal.statusValue.set('ready');
    internal.durationValue.set(10);
    try {
      service.restart();
      expect(releaseAll).toHaveBeenCalledWith(0, true);
      releaseAll.calls.reset();
      service.commitSeek(2);
      expect(releaseAll).toHaveBeenCalledWith(2, true);
    } finally { service.ngOnDestroy(); }
  });

  it('uses audio-clock lead-in time for Twinkle input before the sequencer starts', () => {
    const service = TestBed.runInInjectionContext(() => new PianoPlaybackService());
    const internal = service as any;
    const perform = jasmine.createSpy('perform');
    const releasePhysical = jasmine.createSpy('releasePhysical');
    internal.context = { currentTime: 9.88, close: async () => {} };
    internal.countInPlan = { songAt: 10, plan: { songStart: 0 } };
    internal.couplingValue.set([{ start: 0 }]);
    internal.playerPerformance = { perform, releasePhysical, releaseAll: () => {}, snapshot: (at: number) => [{ start: at }] };
    internal.statusValue.set('count-in');
    try {
      expect(service.leadInPosition).toBeCloseTo(-0.12, 8);
      expect(service.gameplayInputPosition).toBeCloseTo(-0.12, 8);
      expect(service.performedBars[0].start).toBeCloseTo(-0.12, 8);
      service.performMelodyInput(0, 'good', 'KeyT', service.gameplayInputPosition);
      expect(perform.calls.mostRecent().args.slice(0, 3)).toEqual([0, 'good', 'KeyT']);
      expect(perform.calls.mostRecent().args[3]).toBeCloseTo(-0.12, 8);
      expect(perform.calls.mostRecent().args[4]).toBe(1);
      service.releasePlayerKey('KeyT');
      expect(releasePhysical.calls.mostRecent().args[0]).toBe('KeyT');
      expect(releasePhysical.calls.mostRecent().args[1]).toBeCloseTo(-0.12, 8);
      internal.sourceValue.set('greensleeves');
      expect(service.leadInPosition).toBeNull();
    } finally { service.ngOnDestroy(); }
  });

  it('does not reset the synth at the downbeat after an early first-note attack', () => {
    const service = TestBed.runInInjectionContext(() => new PianoPlaybackService());
    const internal = service as any;
    let seekCount = 0;
    let firstVoiceActive = false;
    const perform = jasmine.createSpy('perform').and.callFake(() => { firstVoiceActive = true; });
    internal.context = { currentTime: 9.8, close: async () => {} };
    internal.scoreValue.set({});
    internal.clickBuffer = {};
    internal.couplingValue.set([{ start: 0 }]);
    internal.playerPerformance = { perform, releaseAll: () => {} };
    internal.sequencer = {
      get currentTime() { return 0; },
      set currentTime(_time: number) { seekCount++; firstVoiceActive = false; },
      play: jasmine.createSpy('play'), pause: () => {},
    };
    spyOn(internal, 'prepareVisualPlan').and.callFake(() => {
      internal.preparedPulsePlan = { songStart: 0, barStart: -2, beatSeconds: 0.5, offsets: [0, 0.5, 1, 1.5] };
    });
    spyOn(internal, 'scheduleClick');
    try {
      internal.startCountIn();
      expect(seekCount).toBe(1);
      internal.context.currentTime = internal.countInPlan.songAt - 0.05;
      service.performMelodyInput(0, 'perfect', 'KeyT', service.leadInPosition!);
      expect(firstVoiceActive).toBeTrue();
      internal.startSequence();
      expect(internal.sequencer.play).toHaveBeenCalled();
      expect(seekCount).toBe(1);
      expect(firstVoiceActive).toBeTrue();
    } finally { service.ngOnDestroy(); }
  });

  it('prepares fresh words on request without fetching audio or changing score locations', async () => {
    const service = TestBed.runInInjectionContext(() => new PianoPlaybackService());
    const internal = service as any;
    const score = importMusicXml(await (await fetch('/assets/piano/tracks/Twinkle_Theme.musicxml')).text());
    internal.scoreValue.set(score);
    internal.statusValue.set('ready');
    try {
      expect(service.prepareRunChart(42)).toBeTrue();
      const first = service.chart();
      expect(service.prepareRunChart(42)).toBeTrue();
      expect(service.chart().map(target => target.letter)).not.toEqual(first.map(target => target.letter));
      expect(service.chart().map(target => target.time)).toEqual(first.map(target => target.time));
      expect(service.score()).toBe(score);
      expect(service.status()).toBe('ready');
    } finally { service.ngOnDestroy(); }
  });

  it('queues the complete demo on the audio clock and retires pending channels on Stop', () => {
    const service = TestBed.runInInjectionContext(() => new PianoPlaybackService());
    const internal = service as any;
    const perform = jasmine.createSpy('perform');
    const releaseAll = jasmine.createSpy('releaseAll');
    internal.context = { currentTime: 9.8, close: async () => {} };
    internal.countInPlan = { songAt: 10, plan: { songStart: 0 } };
    const retireUntil = jasmine.createSpy('retireUntil').and.returnValue([3]);
    internal.playerPerformance = { perform, releaseAll, retireUntil };
    internal.sequencer = { pause: () => {}, currentTime: 0 };
    const controllerChange = jasmine.createSpy('controllerChange');
    internal.synth = { stopAll: () => {}, reset: () => {}, destroy: () => {}, controllerChange };
    internal.statusValue.set('count-in');
    try {
      service.startDemo([
        { time: 0, key: 'A', targetIndex: 0, release: false, hold: false },
        { time: 0.13, key: 'A', targetIndex: 0, release: true, hold: false },
        { time: 1, key: 'B', targetIndex: 1, release: false, hold: false },
      ]);
      expect(perform.calls.allArgs()).toEqual([
        [0, 'perfect', 'demo:A', 0, 1, 10],
        [1, 'perfect', 'demo:B', 1, 1, 11],
      ]);
      service.stop();
      expect(releaseAll).toHaveBeenCalled();
      expect(retireUntil).toHaveBeenCalled();
      expect(controllerChange).toHaveBeenCalledWith(3, 7, 0);
      expect(internal.demoActions).toEqual([]);
    } finally { service.ngOnDestroy(); }
  });
});
