import { TestBed } from '@angular/core/testing';
import { PianoPlaybackService } from './piano-playback.service';

describe('song selection', () => {
  it('starts with the first visible song selected for loading', () => {
    const service = TestBed.runInInjectionContext(() => new PianoPlaybackService());
    try {
      expect(service.source()).toBe(service.songs[0].id);
      expect(service.source()).toBe('greensleeves');
    } finally { service.ngOnDestroy(); }
  });

  it('does not let a stale score request replace the latest selection', async () => {
    const service = TestBed.runInInjectionContext(() => new PianoPlaybackService());
    (service as any).soundFont = new ArrayBuffer(1); // Selection needs no synth until Play.
    const originalFetch = globalThis.fetch.bind(globalThis);
    const fetchSpy = spyOn(globalThis, 'fetch').and.callFake(async (input: RequestInfo | URL, init?: RequestInit) => {
      if (String(input).includes('Greensleeves.mxl')) await new Promise(resolve => setTimeout(resolve, 30));
      return originalFetch(input, init);
    });
    try {
      const stale = service.selectSong('greensleeves');
      const latest = service.selectSong('liebestraum-no-3-in-a-major');
      await Promise.all([stale, latest]);
      expect(service.source()).toBe('liebestraum-no-3-in-a-major');
      expect(service.score()?.measureCount).toBe(88);
      expect(service.status()).toBe('ready');
      expect(fetchSpy.calls.count()).toBe(2);
    } finally { service.ngOnDestroy(); }
  });
});
