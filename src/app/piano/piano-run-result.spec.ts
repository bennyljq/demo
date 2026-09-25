import { TypingRound } from './piano-judgement';
import { captureRunResult } from './piano-run-result';

describe('run result snapshot', () => {
  const targets = [
    { index: 0, id: 'a', word: 'AB', letter: 'A', time: 1, holdEnd: 2, wordIndex: 0 },
    { index: 1, id: 'b', word: 'AB', letter: 'B', time: 3, wordIndex: 0 },
  ];

  it('retains the completed score and sustain after the round is reset for retry', () => {
    const round = new TypingRound(targets);
    round.key('a', 1);
    round.keyUp('a', 2);
    round.advance(3.2);
    expect(round.complete).toBeTrue();
    const result = captureRunResult(round, 'example', 'Example', 'opening', 0.75, 0)!;
    expect(result).toEqual(jasmine.objectContaining({ total: 200, available: 300,
      perfect: 1, miss: 1, sustain: 100, sustainAvailable: 100, speed: 0.75 }));
    expect(Object.isFrozen(result)).toBeTrue();
    round.reset();
    expect(result.total).toBe(200);
    expect(result.miss).toBe(1);
  });

  it('does not award a zero-target victory after seeking beyond the chart', () => {
    const round = new TypingRound(targets);
    round.reset(4);
    expect(round.complete).toBeTrue();
    expect(captureRunResult(round, 'example', 'Example', 'full', 1, 4)).toBeNull();
  });
});
