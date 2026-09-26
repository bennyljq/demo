import { TypingRound } from './piano-judgement';
import { captureRunResult } from './piano-run-result';

describe('run result snapshot', () => {
  const targets = [
    { index: 0, id: 'a', word: 'AB', letter: 'A', time: 1, holdEnd: 2, wordIndex: 0 },
    { index: 1, id: 'b', word: 'AB', letter: 'B', time: 3, wordIndex: 0 },
  ];

  it('retains the completed score and sustain after the round is reset for retry', () => {
    const round = new TypingRound(targets);
    round.reset(0, 0.75);
    round.key('a', 1);
    round.keyUp('a', 2);
    round.advance(3.2);
    expect(round.complete).toBeTrue();
    const result = captureRunResult(round, 'example', 'Example', 'opening', 0)!;
    expect(result).toEqual(jasmine.objectContaining({ total: 113, available: 226.5, raw: 150,
      perfect: 1, miss: 1, sustain: 100, sustainAvailable: 100, speed: 0.75 }));
    expect(Object.isFrozen(result)).toBeTrue();
    expect(Object.isFrozen(result.letters)).toBeTrue();
    expect(result.letters.map(letter => letter.result)).toEqual(['perfect', 'miss']);
    expect(result.letters[0].sustainPoints).toBe(100);
    round.reset();
    expect(result.total).toBe(113);
    expect(result.miss).toBe(1);
    expect(result.letters[0].result).toBe('perfect');
  });

  it('keeps skipped targets and a wrong-key penalty in the snapshot', () => {
    const round = new TypingRound(targets);
    round.reset(1.5);
    round.key('z', 3);
    round.keyUp('z', 3);
    round.key('b', 3);
    round.advance(3.2);
    const result = captureRunResult(round, 'example', 'Example', 'full', 1.5)!;
    expect(result.letters.map(letter => letter.result)).toEqual(['skipped', 'perfect']);
    expect(result.raw).toBe(50);
    expect(result.wrongPenalty).toBe(-50);
  });

  it('freezes partial hold credit before a later replay resets the round', () => {
    const round = new TypingRound(targets);
    round.key('a', 1);
    round.keyUp('a', 1.4);
    round.advance(3.2);
    const result = captureRunResult(round, 'example', 'Example', 'full', 0)!;
    expect(result.letters[0].attack).toBe('perfect');
    expect(result.letters[0].sustainPoints).toBeCloseTo(40, 6);
    round.reset();
    expect(result.letters[0].sustainPoints).toBeCloseTo(40, 6);
  });

  it('does not award a zero-target victory after seeking beyond the chart', () => {
    const round = new TypingRound(targets);
    round.reset(4);
    expect(round.complete).toBeTrue();
    expect(captureRunResult(round, 'example', 'Example', 'full', 4)).toBeNull();
  });
});
