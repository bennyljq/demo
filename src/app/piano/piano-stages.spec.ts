import { TestBed } from '@angular/core/testing';
import { PianoComponent } from './piano.component';
import { TypingRound } from './gameplay/piano-judgement';

describe('piano stages', () => {
  it('arms a selected song before Play and returns to Library on Exit', () => {
    TestBed.configureTestingModule({ imports: [PianoComponent] });
    const fixture = TestBed.createComponent(PianoComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance;
    const playback = component.playback;
    const select = spyOn(playback, 'selectSong').and.resolveTo();
    spyOn(playback, 'activateAudio');
    const play = spyOn(playback, 'play').and.resolveTo();
    const stop = spyOn(playback, 'stop');
    try {
      expect(component.stage()).toBe('home');
      component.enterLibrary();
      expect(component.stage()).toBe('library');
      component.chooseSong('twinkle-theme');
      expect(component.stage()).toBe('play');
      expect(select).toHaveBeenCalledOnceWith('twinkle-theme');
      expect(play).not.toHaveBeenCalled();
      component.openSettings();
      expect(component.settingsOpen()).toBeTrue();
      component.closeSettings();
      (playback as any).statusValue.set('ready');
      component.play();
      expect(component.stage()).toBe('play');
      expect(play).toHaveBeenCalledTimes(1);
      component.exitRun();
      expect(component.stage()).toBe('library');
      expect(stop).toHaveBeenCalledTimes(2);
      expect(component.playback).toBe(playback);
    } finally { fixture.destroy(); }
  });

  it('releases an active hold when a control is opened', () => {
    TestBed.configureTestingModule({ imports: [PianoComponent] });
    const fixture = TestBed.createComponent(PianoComponent);
    fixture.detectChanges();
    try {
      const component = fixture.componentInstance;
      const round = new TypingRound([{ index: 0, id: 'a', word: 'A', letter: 'A', time: 1, holdEnd: 2, wordIndex: 0 }]);
      round.key('a', 1);
      expect(round.results[0]).toBe('holding');
      (component as any).round = round;
      const trigger = fixture.nativeElement.querySelector('.settings-shortcut') as HTMLButtonElement;
      trigger.focus();
      component.openSettings();
      expect(round.results[0]).toBe('perfect');
      expect(round.earnedSustainPoints).toBe(0);
      expect(component.settingsOpen()).toBeTrue();
      expect(document.activeElement?.getAttribute('role')).toBe('dialog');
      component.closeSettings();
      expect(component.settingsOpen()).toBeFalse();
      expect(document.activeElement).toBe(trigger);
    } finally { fixture.destroy(); }
  });

  it('consumes keyboard start and suppresses its held key until keyup', () => {
    TestBed.configureTestingModule({ imports: [PianoComponent] });
    const fixture = TestBed.createComponent(PianoComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance;
    spyOn(component.playback, 'selectSong').and.resolveTo();
    const play = spyOn(component.playback, 'play').and.resolveTo();
    spyOn(component.playback, 'stop');
    const stage = fixture.nativeElement.querySelector('.play-stage') as HTMLElement;
    try {
      component.chooseSong('twinkle-theme');
      (component.playback as any).scoreValue.set({ measures: [], annotations: [] });
      (component.playback as any).statusValue.set('ready');
      fixture.detectChanges();
      const target = { index: 0, id: 'a', word: 'A', letter: 'A', time: 0, wordIndex: 0 };
      component.chart.set([target]);
      const round = new TypingRound([target]);
      (component as any).round = round;
      stage.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', bubbles: true }));
      expect(play).toHaveBeenCalledTimes(1);
      expect(component.runStarted()).toBeTrue();
      (component.playback as any).statusValue.set('playing');
      stage.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', bubbles: true }));
      expect(round.results[0]).toBe('pending');
      expect(round.wrongCount).toBe(0);
      stage.dispatchEvent(new KeyboardEvent('keyup', { key: 'a', bubbles: true }));
      stage.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', bubbles: true }));
      expect(round.results[0]).toBe('perfect');
      expect(play).toHaveBeenCalledTimes(1);
    } finally { fixture.destroy(); }
  });

  it('uses Escape for one silent restart, while Settings consumes it first', () => {
    TestBed.configureTestingModule({ imports: [PianoComponent] });
    const fixture = TestBed.createComponent(PianoComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance;
    spyOn(component.playback, 'selectSong').and.resolveTo();
    const restart = spyOn(component.playback, 'restart');
    try {
      component.chooseSong('twinkle-theme');
      component.runStartPosition.set(5);
      component.runStarted.set(true);
      fixture.detectChanges();
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, repeat: true }));
      expect(restart).toHaveBeenCalledTimes(1);
      expect(component.stage()).toBe('play');
      expect(component.runStarted()).toBeFalse();
      expect(component.runStartPosition()).toBe(0);
      component.openSettings();
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      expect(component.settingsOpen()).toBeFalse();
      expect(restart).toHaveBeenCalledTimes(1);
    } finally { fixture.destroy(); }
  });

  it('dispatches accepted input immediately and releases player voices on controls and blur', () => {
    TestBed.configureTestingModule({ imports: [PianoComponent] });
    const fixture = TestBed.createComponent(PianoComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance;
    spyOn(component.playback, 'selectSong').and.resolveTo();
    spyOn(component.playback, 'stop');
    const perform = spyOn(component.playback, 'performMelodyInput');
    const release = spyOn(component.playback, 'releasePlayerKey');
    const releaseAll = spyOn(component.playback, 'releasePlayerVoices');
    try {
      component.chooseSong('twinkle-theme');
      const target = { index: 0, id: 'a', word: 'A', letter: 'A', time: 0, holdEnd: 1, wordIndex: 0 };
      (component as any).round = new TypingRound([target]);
      component.runStarted.set(true);
      (component.playback as any).statusValue.set('playing');
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', code: 'KeyA', bubbles: true }));
      expect(perform).toHaveBeenCalledOnceWith(0, 'perfect', 'KeyA', 0);
      document.dispatchEvent(new KeyboardEvent('keyup', { key: 'a', code: 'KeyA', bubbles: true }));
      expect(release).toHaveBeenCalledOnceWith('KeyA');
      component.openSettings();
      expect(releaseAll).toHaveBeenCalled();
      component.closeSettings();
      window.dispatchEvent(new Event('blur'));
      expect(releaseAll.calls.count()).toBeGreaterThanOrEqual(2);
      component.restart();
      expect(component.runStarted()).toBeFalse();
    } finally { fixture.destroy(); }
  });

  it('accepts Twinkle first-letter Good and Perfect hits during the final count-in window', () => {
    TestBed.configureTestingModule({ imports: [PianoComponent] });
    const fixture = TestBed.createComponent(PianoComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance;
    spyOn(component.playback, 'selectSong').and.resolveTo();
    const perform = spyOn(component.playback, 'performMelodyInput');
    try {
      component.chooseSong('twinkle-theme');
      const target = { index: 0, id: 'first', word: 'T', letter: 'T', time: 0, wordIndex: 0 };
      const round = new TypingRound([target]);
      (component as any).round = round;
      component.runStarted.set(true);
      const playback = component.playback as any;
      playback.context = { currentTime: 9.83, close: async () => {} };
      playback.countInPlan = { firstAt: 9, songAt: 10, plan: {
        songStart: 0, barStart: -1, beatSeconds: 0.5, offsets: [0, 0.5],
        countInPositions: [-1, -0.5, 0], songPositions: [0],
      } };
      playback.couplingValue.set([{ start: 0 }]);
      playback.statusValue.set('count-in');
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 't', code: 'KeyT', bubbles: true }));
      expect(round.results[0]).toBe('pending');
      expect(perform).not.toHaveBeenCalled();
      playback.context.currentTime = 9.88;
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 't', code: 'KeyT', bubbles: true }));
      expect(round.results[0]).toBe('good');
      expect(perform.calls.mostRecent().args.slice(0, 3)).toEqual([0, 'good', 'KeyT']);
      expect(perform.calls.mostRecent().args[3]).toBeCloseTo(-0.12, 8);
      document.dispatchEvent(new KeyboardEvent('keyup', { key: 't', code: 'KeyT', bubbles: true }));
      round.reset();
      perform.calls.reset();
      playback.context.currentTime = 9.95;
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 't', code: 'KeyT', bubbles: true }));
      expect(round.results[0]).toBe('perfect');
      expect(perform.calls.mostRecent().args.slice(0, 3)).toEqual([0, 'perfect', 'KeyT']);
      expect(perform.calls.mostRecent().args[3]).toBeCloseTo(-0.05, 8);
    } finally { fixture.destroy(); }
  });

  it('keeps prepared words for Start and Demo, but rerolls human Restart and Results Replay', () => {
    TestBed.configureTestingModule({ imports: [PianoComponent] });
    const fixture = TestBed.createComponent(PianoComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance;
    const playback = component.playback as any;
    spyOn(component.playback, 'selectSong').and.resolveTo();
    spyOn(component.playback, 'play').and.resolveTo();
    spyOn(component.playback, 'restart');
    spyOn(component.playback, 'stop');
    spyOn(component.playback, 'commitSeek');
    spyOn(component.playback, 'startDemo');
    const prepare = spyOn(component.playback, 'prepareRunChart').and.returnValue(true);
    try {
      component.chooseSong('twinkle-theme');
      playback.scoreValue.set({ measures: [], annotations: [] });
      playback.statusValue.set('ready');
      const target = { index: 0, id: 'a', word: 'A', letter: 'A', time: 0, wordIndex: 0 };
      component.chart.set([target]);
      (component as any).round = new TypingRound([target]);
      component.play();
      expect(prepare).not.toHaveBeenCalled();
      component.restart();
      expect(prepare).toHaveBeenCalledTimes(1);
      component.reroll();
      expect(prepare).toHaveBeenCalledTimes(2);
      component.startDemo();
      expect(component.demoActive()).toBeTrue();
      expect(component.playback.startDemo).toHaveBeenCalled();
      expect(prepare).toHaveBeenCalledTimes(2);
      component.restart();
      expect(component.demoActive()).toBeFalse();
      expect(prepare).toHaveBeenCalledTimes(2);
      component.stage.set('results');
      component.retry();
      expect(prepare).toHaveBeenCalledTimes(3);
    } finally { fixture.destroy(); }
  });

  it('ignores physical typing during a demo and cancels it when Settings opens', () => {
    TestBed.configureTestingModule({ imports: [PianoComponent] });
    const fixture = TestBed.createComponent(PianoComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance;
    const playback = component.playback as any;
    spyOn(component.playback, 'selectSong').and.resolveTo();
    spyOn(component.playback, 'play').and.resolveTo();
    spyOn(component.playback, 'commitSeek');
    spyOn(component.playback, 'startDemo');
    spyOn(component.playback, 'restart');
    const perform = spyOn(component.playback, 'performMelodyInput');
    try {
      component.chooseSong('twinkle-theme');
      playback.scoreValue.set({ measures: [], annotations: [] });
      playback.statusValue.set('ready');
      const target = { index: 0, id: 'a', word: 'A', letter: 'A', time: 0, wordIndex: 0 };
      component.chart.set([target]);
      const round = new TypingRound([target]);
      (component as any).round = round;
      component.startDemo();
      playback.statusValue.set('playing');
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', code: 'KeyA', bubbles: true }));
      expect(round.results[0]).toBe('pending');
      expect(perform).not.toHaveBeenCalled();
      component.openSettings();
      expect(component.demoActive()).toBeFalse();
      expect(component.runStarted()).toBeFalse();
      expect(component.settingsOpen()).toBeTrue();
    } finally { fixture.destroy(); }
  });
});
