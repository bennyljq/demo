import { buildTypingChart, TypingTarget } from './piano-chart';
import { isGameplayKey, TypingRound } from './piano-judgement';
import { extractPianoTimeline } from '../music/piano-timeline';

const targets = (times = [1, 1.25, 2]): TypingTarget[] => times.map((time, index) => ({
  time, index, wordIndex: 0, word: 'ABC', letter: 'ABC'[index], id: `test:${index}`,
}));

describe('typing judgement', () => {
  it('judges equal real-time errors equally at normal, slow and fast playback rates', () => {
    for (const rate of [0.5, 0.75, 1, 1.25, 1.5, 2, 2.5, 3]) {
      for (const [realError, expected] of [[0.08, 'perfect'], [0.10, 'good'], [0.16, 'good']] as const) {
        const round = new TypingRound(targets([1]));
        round.key('a', 1 + realError * rate, rate);
        expect(round.results[0]).withContext(`rate ${rate}, error ${realError}`).toBe(expected);
      }
    }
  });

  it('scales miss and completion boundaries into source-song time', () => {
    for (const rate of [0.5, 1, 2, 3]) {
      const round = new TypingRound(targets([1]));
      round.advance(1 + 0.16 * rate, rate);
      expect(round.results[0]).toBe('pending');
      expect(round.complete).toBeFalse();
      round.advance(1 + 0.161 * rate, rate);
      expect(round.results[0]).toBe('miss');
      expect(round.complete).toBeTrue();
    }
  });

  it('resolves just one nearest target in overlapping windows at 2×', () => {
    const round = new TypingRound(targets([1, 1.25]));
    round.key('b', 1.126, 2);
    expect(round.results).toEqual(['pending', 'perfect']);
    round.key('a', 1.126, 2);
    expect(round.results).toEqual(['perfect', 'perfect']);
  });

  it('uses cosmetic time for wrong-key feedback independent of rate', () => {
    const round = new TypingRound(targets([1]));
    round.key('z', 1, 2, 10);
    round.advance(1.2, 2, 10.49);
    expect(round.wrong).toBeTrue();
    round.advance(1.2, 2, 10.5);
    expect(round.wrong).toBeFalse();
  });

  it('includes both Perfect/Good boundaries and excludes times outside the window', () => {
    for (const delta of [-0.16, -0.080001, -0.08, 0, 0.08, 0.080001, 0.16]) {
      const round = new TypingRound(targets([1]));
      round.key('a', 1 + delta);
      expect(round.results[0]).toBe(Math.abs(delta) <= 0.08 ? 'perfect' : 'good');
    }
    const round = new TypingRound(targets([1]));
    round.key('a', 0.839);
    expect(round.results[0]).toBe('pending');
    round.key('a', 1.161);
    expect(round.results[0]).toBe('miss');
  });

  it('leaves wrong targets unresolved and expires brief wrong-key feedback using song time', () => {
    const round = new TypingRound(targets());
    round.key('z', 1);
    expect(round.results).toEqual(['pending', 'pending', 'pending']);
    expect(round.wrong).toBeTrue();
    expect(round.rawPoints).toBe(-100);
    round.key('A', 1.01);
    expect(round.results[0]).toBe('perfect');
    expect(round.wrong).toBeFalse();
    round.key('z', 1.25);
    round.advance(1.76);
    expect(round.wrong).toBeFalse();
  });

  it('penalises extra and gap keys while preserving negative score debt', () => {
    const round = new TypingRound(targets([1, 1.5, 2]));
    round.key('z', 1);
    round.keyUp('z', 1);
    round.key('x', 1.01);
    round.keyUp('x', 1.01);
    round.key('a', 1.02);
    expect(round.results[0]).toBe('perfect');
    expect(round.rawPoints).toBe(-100);
    expect(round.totalPoints).toBe(0);
    round.keyUp('a', 1.02);
    round.key('a', 1.03); // The nearby target is already resolved.
    expect(round.wrongCount).toBe(3);
    round.keyUp('a', 1.03);
    round.key('q', 1.25); // No attack window in this chart gap.
    expect(round.wrongCount).toBe(4);
    round.keyUp('q', 1.25);
    round.key('b', 1.5);
    round.keyUp('b', 1.5);
    round.key('c', 2);
    expect(round.rawPoints).toBe(-100);
    expect(round.totalPoints).toBe(0);
  });

  it('ignores alphabetic input outside the active chart interval', () => {
    const round = new TypingRound(targets([1]));
    round.key('z', 0.83);
    expect(round.wrongCount).toBe(0);
    round.key('z', 1);
    expect(round.wrongCount).toBe(1);
    round.keyUp('z', 1);
    round.advance(1.161);
    round.key('z', 1.17);
    expect(round.wrongCount).toBe(1);
  });

  it('charges alphabet smashing once per physical keydown and keeps simultaneous different keys valid', () => {
    const round = new TypingRound(targets([1, 1.05, 1.1]));
    for (const key of 'xyzqwerty') { round.key(key, 1); round.keyUp(key, 1); }
    expect(round.wrongCount).toBe(9);
    round.key('a', 1);
    round.key('b', 1.05);
    round.key('c', 1.1);
    expect(round.results).toEqual(['perfect', 'perfect', 'perfect']);
    expect(round.rawPoints).toBe(-600);
    expect(round.totalPoints).toBe(0);
    round.key('c', 1.1); // Still held: no second penalty.
    expect(round.wrongCount).toBe(9);
  });

  it('expires missed letters without blocking later input, including a delayed update', () => {
    const round = new TypingRound(targets());
    round.key('c', 2);
    expect(round.results).toEqual(['miss', 'miss', 'perfect']);
    expect(round.complete).toBeFalse();
    round.advance(2.16);
    expect(round.complete).toBeFalse();
    round.advance(2.161);
    expect(round.complete).toBeTrue();
    round.reset();
    round.advance(20);
    expect(round.results).toEqual(['miss', 'miss', 'miss']);
  });

  it('chooses by timing first, ties earlier, and resolves at most one target', () => {
    const round = new TypingRound(targets());
    round.key('b', 1.125);
    expect(round.results).toEqual(['pending', 'pending', 'pending']);
    round.key('a', 1.125);
    expect(round.results).toEqual(['good', 'pending', 'pending']);
    round.reset();
    round.key('b', 1.14);
    expect(round.results).toEqual(['pending', 'good', 'pending']);
  });

  it('resets all attempt state for replay', () => {
    const round = new TypingRound(targets());
    round.key('a', 1);
    round.key('z', 1.25);
    round.advance(3);
    round.reset();
    expect(round.results).toEqual(['pending', 'pending', 'pending']);
    expect(round.complete).toBeFalse();
    expect(round.wrong).toBeFalse();
    expect(round.listening).toBeTrue();
  });

  it('filters repeat, shortcuts, composition, and editable-field input', () => {
    expect(isGameplayKey(new KeyboardEvent('keydown', { key: 'A', shiftKey: true }))).toBeTrue();
    for (const options of [{ repeat: true }, { ctrlKey: true }, { altKey: true }, { metaKey: true }, { isComposing: true }]) {
      expect(isGameplayKey(new KeyboardEvent('keydown', { key: 'a', ...options }))).toBeFalse();
    }
    const event = new KeyboardEvent('keydown', { key: 'a' });
    spyOn(event, 'composedPath').and.returnValue([document.createElement('input')]);
    expect(isGameplayKey(event)).toBeFalse();
  });
});

describe('authored opening chart', () => {
  it('validates the actual MIDI IDs, words and increasing attacks', async () => {
    const response = await fetch('/assets/piano/marche-turque.mid');
    expect(response.ok).toBeTrue();
    const timeline = extractPianoTimeline(await response.arrayBuffer());
    const chart = buildTypingChart(timeline);
    expect(chart.length).toBe(33);
    expect(chart[0].time).toBe(2);
    expect(chart[32].time).toBe(15);
    expect(chart.map(t => t.time)).toEqual([2,2.25,2.5,2.75,3,4,4.25,4.5,4.75,5,5.25,5.5,5.75,
      6,6.25,6.5,6.75,7,8,8.5,9,9.5,10,10.5,11,11.5,12,12.5,13,13.5,14,14.5,15]);
    expect(chart.every((target, i) => !i || target.time > chart[i - 1].time)).toBeTrue();
    expect(() => buildTypingChart(timeline, [{ word: 'A', track: 1, groups: [999] }])).toThrowError(/missing track 1, group 999/);
    expect(() => buildTypingChart(timeline, [{ word: 'AB', track: 1, groups: [5] }])).toThrowError(/letter count/);
    expect(() => buildTypingChart(timeline, [{ word: 'AB', track: 1, groups: [5, 5] }])).toThrowError(/strictly increasing/);
  });
});
