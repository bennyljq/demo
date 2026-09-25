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
});
