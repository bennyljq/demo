import { TestBed } from '@angular/core/testing';
import { PianoPlaybackService } from './piano-playback.service';

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
});
