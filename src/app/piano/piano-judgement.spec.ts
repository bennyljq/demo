import { buildTypingChart, TypingTarget } from './piano-chart';
import { isGameplayKey, TypingRound } from './piano-judgement';
import { extractPianoTimeline } from './piano-timeline';

const targets = (times = [1, 1.25, 2]): TypingTarget[] => times.map((time, index) => ({
  time, index, wordIndex: 0, letter: 'ABC'[index], noteId: `test:${index}`,
}));

describe('typing judgement', () => {
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
    round.key('A', 1.01);
    expect(round.results[0]).toBe('perfect');
    expect(round.wrong).toBeFalse();
    round.key('z', 1.25);
    round.advance(1.76);
    expect(round.wrong).toBeFalse();
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
    expect(chart.every((target, i) => !i || target.time > chart[i - 1].time)).toBeTrue();
    expect(() => buildTypingChart(timeline, [{ word: 'A', noteIds: ['missing'] }])).toThrowError(/missing note/);
    expect(() => buildTypingChart(timeline, [{ word: 'AB', noteIds: ['1:11'] }])).toThrowError(/letter count/);
    expect(() => buildTypingChart(timeline, [{ word: 'AB', noteIds: ['1:11', '1:11'] }])).toThrowError(/strictly increasing/);
  });
});
