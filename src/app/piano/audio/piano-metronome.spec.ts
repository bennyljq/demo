import { TestBed } from '@angular/core/testing';
import type { ImportedScore } from '../music/musicxml-import';
import { countInBeatSeconds, preparePulsePlan, scoreBeatGrid } from './piano-metronome';
import { PianoPlaybackService } from './piano-playback.service';

const score = {
  tempos: [{ quarter: 0, value: 120 }, { quarter: 4, value: 60 }],
  measures: [
    { id: 'pickup', sourceIndex: 0, number: '0', occurrence: 1, quarter: 0, durationQuarter: 1,
      start: 0, meterBeats: 4, meterBeatType: 4 },
    { id: 'one', sourceIndex: 1, number: '1', occurrence: 1, quarter: 1, durationQuarter: 3,
      start: 0.5, meterBeats: 4, meterBeatType: 4 },
    { id: 'two', sourceIndex: 2, number: '2', occurrence: 1, quarter: 4, durationQuarter: 3,
      start: 2, meterBeats: 6, meterBeatType: 8 },
  ],
} as unknown as ImportedScore;

describe('full-bar count-in', () => {
  it('uses full metre for a pickup and current metre/tempo/rate at a seek', () => {
    expect(countInBeatSeconds(score, 0, 1)).toEqual([0, 0.5, 1, 1.5]);
    expect(countInBeatSeconds(score, 0.7, 2)).toEqual([0, 0.25, 0.5, 0.75]);
    expect(countInBeatSeconds(score, 2.2, 2)).toEqual([0, 0.75]);
  });

  it('prepares count-in and later song positions before scheduling audio', () => {
    const plan = preparePulsePlan(score, 0, 1);
    expect(plan.barStart).toBe(-2);
    expect(plan.countInPositions).toEqual([-2, -1.5, -1, -0.5, 0]);
    expect(plan.songPositions).toEqual([0, 0.5, 1, 1.5, 2, 3.5]);
    const seek = preparePulsePlan(score, 2.2, 2);
    expect(seek.countInPositions.at(-1)).toBe(2.2);
    expect(seek.songPositions).toEqual([2.2, 3.5]);
  });

  it('schedules one bar plus one downbeat with in-song clicks on or off, then cancels them', async () => {
    for (const enabled of [false, true]) {
    const service = TestBed.runInInjectionContext(() => new PianoPlaybackService());
    const internal = service as any;
    let clock = 10;
    internal.context = { get currentTime() { return clock; }, resume: async () => {}, close: async () => {} };
    internal.output = { gain: { cancelScheduledValues: () => {}, setValueAtTime: () => {}, linearRampToValueAtTime: () => {} }, disconnect: () => {} };
    internal.sequencer = { currentTime: 0, playbackRate: 1, pause: () => {}, play: () => {} };
    internal.loadedSongId = service.source();
    internal.clickBuffer = { duration: 0.2 };
    internal.scoreValue.set(score);
    internal.beatGrid = scoreBeatGrid(score);
    internal.prepareVisualPlan();
    internal.durationValue.set(6);
    internal.statusValue.set('ready');
    internal.metronomeValue.set(enabled);
    const clicks = spyOn(internal, 'scheduleClick');
    try {
      expect(service.countInVisual?.position).toBe(-2);
      expect(service.countInVisual?.pulsePositions).toEqual([-2, -1.5, -1, -0.5, 0]);
      expect(service.songBeatPositions.length > 0).toBe(enabled);
      await service.play();
      expect(service.status()).toBe('count-in');
      expect(clicks).toHaveBeenCalledTimes(5);
      const times = clicks.calls.allArgs().map(args => args[0]);
      expect(times).toEqual([10.055, 10.555, 11.055, 11.555, 12.055]);
      expect(service.countInVisual?.barStart).toBe(-2);
      clock = 11;
      expect(service.visualPosition).toBeCloseTo(-1.055, 5);
      expect(service.playbackPosition).toBe(0);
      expect(service.songBeatPositions.length > 0).toBe(enabled);
      if (enabled) {
        internal.beatGrid = scoreBeatGrid(score);
        clock = Number(times.at(-1));
        internal.startSequence(true);
        expect(internal.nextBeat).toBe(1);
        expect(clicks).toHaveBeenCalledTimes(5); // No second click on the song downbeat.
      }
      service.stop();
      expect(service.countInVisual?.position).toBe(-2);
      expect(service.status()).toBe('ready');
    } finally { service.ngOnDestroy(); }
    }
  });

  it('leaves the selected downbeat to count-in, with only later beats eligible in-song', () => {
    const beats = scoreBeatGrid(score);
    const at = 2;
    expect(beats.filter(beat => beat.sourceTime > at + 1e-7).map(beat => beat.sourceTime)).toEqual([3.5]);
  });

  it('cancels a running count-in and rewinds a seek without unloading the engine', async () => {
    const service = TestBed.runInInjectionContext(() => new PianoPlaybackService());
    const internal = service as any;
    let clock = 4;
    internal.context = { get currentTime() { return clock; }, resume: async () => {}, close: async () => {} };
    internal.output = { gain: { value: 1, cancelScheduledValues: () => {}, setValueAtTime: () => {}, linearRampToValueAtTime: () => {} }, disconnect: () => {} };
    const pause = jasmine.createSpy('pause');
    internal.sequencer = { currentTime: 0, playbackRate: 1, pause, play: () => {} };
    internal.synth = { stopAll: jasmine.createSpy('stopAll'), reset: () => {}, destroy: () => {} };
    internal.loadedSongId = service.source();
    internal.clickBuffer = { duration: 0.2 };
    internal.scoreValue.set(score);
    internal.durationValue.set(6);
    internal.beatGrid = scoreBeatGrid(score);
    internal.statusValue.set('ready');
    spyOn(internal, 'scheduleClick');
    try {
      service.commitSeek(2.2);
      expect(service.countInVisual?.songStart).toBe(2.2);
      await service.play();
      expect(service.status()).toBe('count-in');
      const run = internal.transportRun;
      service.restart();
      expect(internal.transportRun).toBeGreaterThan(run);
      expect(service.status()).toBe('ready');
      expect(service.countInVisual?.songStart).toBe(0);
      expect(service.playbackPosition).toBe(0);
      expect(internal.sequencer.currentTime).toBe(0);
      expect(internal.synth.stopAll).toHaveBeenCalled();
      expect(internal.clickSources.size).toBe(0);
      clock = 10;
      await service.play();
      expect(service.status()).toBe('count-in');
    } finally { service.ngOnDestroy(); }
  });
});
