import { TestBed } from '@angular/core/testing';
import { PianoComponent } from './piano.component';
import { TypingRound } from './piano-judgement';

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
});
