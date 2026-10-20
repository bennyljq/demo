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
    expect(result).toEqual(jasmine.objectContaining({ total: 116, available: 232.5, raw: 155,
      perfect: 1, miss: 1, sustain: 100, sustainAvailable: 100, speed: 0.75 }));
    expect(result.grade).toBe('C');
    expect(result.gradeRatio).toBeCloseTo(116.25 / 232.5, 8);
    expect(result.earnedFinalScore).toBe(116.25);
    expect(result.notesHitPercent).toBe(50);
    expect(result.perfectNotesPercent).toBe(50);
    expect(Object.isFrozen(result)).toBeTrue();
    expect(Object.isFrozen(result.letters)).toBeTrue();
    expect(result.letters.map(letter => letter.result)).toEqual(['perfect', 'miss']);
    expect(result.letters[0].sustainPoints).toBe(100);
    round.reset();
    expect(result.total).toBe(116);
    expect(result.miss).toBe(1);
    expect(result.letters[0].result).toBe('perfect');
    expect(result.grade).toBe('C');
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
    expect(result.raw).toBe(55);
    expect(result.wrongPenalty).toBe(-50);
    expect(result.startPosition).toBe(1.5);
    expect(result.grade).toBe('C');
    expect(result.gradeRatio).toBeCloseTo(55 / 105, 8);
    expect(result.eligible).toBe(1);
    expect(result.notesHitPercent).toBe(100);
    expect(result.perfectNotesPercent).toBe(100);
    round.reset(0, 3);
    expect(result.startPosition).toBe(1.5);
    expect(result.speed).toBe(1);
    expect(result.grade).toBe('C');
    expect(result.earnedFinalScore).toBe(55);
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

  it('retains its mode and copied pattern after the source chart changes', () => {
    const pattern = [{ ...targets[0], letter: 'Q', word: 'Q' }];
    const round = new TypingRound(pattern, undefined, 'eight-keys', 'ASDFJKLZ');
    round.key('a', 1);
    round.keyUp('a', 2);
    round.advance(2.2);
    const result = captureRunResult(round, 'example', 'Example', 'full', 0)!;
    pattern[0].letter = 'W';
    expect(result.mode).toBe('eight-keys');
    expect(result.eightKeyBindings).toBe('ASDFJKLZ');
    expect(result.chart[0].letter).toBe('Q');
    expect(result.letters[0].letter).toBe('Q');
    expect(Object.isFrozen(result.chart[0])).toBeTrue();
  });

  it('does not award a zero-target victory after seeking beyond the chart', () => {
    const round = new TypingRound(targets);
    round.reset(4);
    expect(round.complete).toBeTrue();
    expect(captureRunResult(round, 'example', 'Example', 'full', 4)).toBeNull();
  });

  it('freezes tuning and calculates both percentages from eligible attacks', () => {
    const tuning = { ...new TypingRound(targets).settings, perfectPoints: 120, goodPoints: 80,
      maxHoldPoints: 40, comboPoints: 7, speedBonusStrength: 0 };
    const round = new TypingRound(targets, tuning);
    round.reset(0, 2);
    round.key('a', 1);
    round.keyUp('a', 2);
    round.key('b', 3.1);
    round.advance(3.3);
    const result = captureRunResult(round, 'example', 'Example', 'full', 0)!;
    expect(result.perfect).toBe(1);
    expect(result.good).toBe(1);
    expect(result.notesHitPercent).toBe(100);
    expect(result.perfectNotesPercent).toBe(50);
    expect(result.multiplier).toBe(1);
    expect(result.scoring.maxHoldPoints).toBe(40);
    expect(result.available).toBe(294);
    round.settings = { ...tuning, perfectPoints: 500, maxHoldPoints: 200 };
    expect(result.scoring.perfectPoints).toBe(120);
    expect(result.scoring.maxHoldPoints).toBe(40);
  });
});
