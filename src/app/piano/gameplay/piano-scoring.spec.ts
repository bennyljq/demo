import { TypingRound } from './piano-judgement';
import type { TypingTarget } from './piano-chart';
import { attackWindowSeconds, DEFAULT_SCORING_SETTINGS, holdBufferSeconds, holdProgressPercent, validateScoringSettings } from './piano-scoring-settings';

const hold: TypingTarget = { id: 'hold', word: 'A', letter: 'A', time: 1, holdEnd: 2, wordIndex: 0, index: 0 };

describe('hold score', () => {
  it('uses one best-combo bonus, separate miss/wrong debt and an attempt-fixed speed', () => {
    const targets: TypingTarget[] = [0, 1, 2, 3].map(index => ({
      id: `hit-${index}`, word: 'ABCD', letter: 'ABCD'[index], time: index + 1, index, wordIndex: 0,
    }));
    const round = new TypingRound(targets);
    round.reset(0, 1.5);
    expect(round.availablePoints).toBe(1.5 * (400 + 20));
    round.key('a', 1); round.keyUp('a', 1);
    round.key('b', 2); round.keyUp('b', 2);
    round.key('c', 3); round.keyUp('c', 3);
    expect(round.comboBonus).toBe(15);
    round.key('x', 4); round.keyUp('x', 4);
    round.advance(4.161);
    expect(round.combo).toBe(0);
    expect(round.missPenalty).toBe(-50);
    expect(round.wrongPenalty).toBe(-50);
    expect(round.rawPoints).toBe(215);
    expect(round.totalPoints).toBe(323);
    round.settings = { ...round.settings, goodMs: 200, perfectPoints: 500,
      maxHoldPoints: 300, comboPoints: 50, speedBonusStrength: 0 };
    expect(round.speed).toBe(1.5);
    expect(round.totalPoints).toBe(323);
    expect(round.availablePoints).toBe(630);
  });

  it('does not count hold progress as another attack or combo bonus', () => {
    const round = new TypingRound([hold]);
    round.key('a', 1);
    round.advance(1.5);
    round.keyUp('a', 2);
    round.advance(3);
    expect(round.combo).toBe(1);
    expect(round.comboBonus).toBe(5);
    expect(round.missPenalty).toBe(0);
    expect(round.rawPoints).toBe(205);
  });
  it('retains a judged attack and combo after partial release', () => {
    const round = new TypingRound([hold]);
    round.key('a', 1);
    expect(round.results[0]).toBe('holding');
    expect(round.combo).toBe(1);
    expect(round.totalPoints).toBe(105);
    round.keyUp('a', 1.4);
    expect(round.results[0]).toBe('perfect');
    expect(round.combo).toBe(1);
    expect(round.earnedSustainPoints).toBeCloseTo(40, 6);
    expect(round.totalPoints).toBeCloseTo(145, 6);
    round.keyUp('a', 2);
    round.advance(3);
    expect(round.totalPoints).toBeCloseTo(145, 6);
  });

  it('credits accepted late attacks back to authored start, independent of frame rate', () => {
    for (const frames of [[1.3, 1.6], [1.1, 1.2, 1.4, 1.6]]) {
      const round = new TypingRound([hold]);
      round.key('a', 1.1);
      for (const frame of frames) round.advance(frame);
      round.keyUp('a', 1.6);
      expect(round.attackGrades[0]).toBe('good');
      expect(round.earnedSustainPoints).toBeCloseTo(60, 6);
      expect(round.totalPoints).toBeCloseTo(135, 6);
    }
  });

  it('gives full credit at the release buffer boundary at every speed', () => {
    for (const rate of [0.5, 1, 2, 3]) {
      const round = new TypingRound([hold]);
      round.key('a', 1, rate);
      round.keyUp('a', 2 - 0.12 * rate, rate);
      expect(round.earnedSustainPoints).withContext(`rate ${rate}`).toBe(100);
    }
    expect(holdBufferSeconds(120, 3, 0.2)).toBe(0.1);
    const round = new TypingRound([{ ...hold, holdEnd: 1.2 }]);
    round.key('a', 1);
    round.keyUp('a', 1.099);
    expect(round.earnedSustainPoints).toBeLessThan(100);
  });

  it('does not add forgiveness on blur, or duplicate points on reset and seek', () => {
    const round = new TypingRound([hold]);
    round.key('a', 1);
    round.advance(1.5);
    round.blur();
    expect(round.earnedSustainPoints).toBe(50);
    expect(round.results[0]).toBe('perfect');
    round.keyUp('a', 2);
    expect(round.earnedSustainPoints).toBe(50);
    round.reset(1.5);
    expect(round.availablePoints).toBe(0);
    expect(round.totalPoints).toBe(0);
    round.reset();
    expect(round.availablePoints).toBe(205);
  });

  it('keeps the attack grade through hold progress and never credits wrong or missed attacks', () => {
    const perfect = new TypingRound([hold]);
    perfect.key('a', 1);
    perfect.advance(1.5);
    expect(perfect.results[0]).toBe('holding');
    expect(perfect.attackGrades[0]).toBe('perfect');
    expect(perfect.earnedSustainPoints).toBe(50);
    const good = new TypingRound([hold]);
    good.key('a', 1.1);
    good.advance(1.5);
    expect(good.results[0]).toBe('holding');
    expect(good.attackGrades[0]).toBe('good');
    expect(good.earnedSustainPoints).toBe(50);
    const wrong = new TypingRound([hold]);
    wrong.key('b', 1);
    wrong.advance(1.4);
    expect(wrong.results[0]).toBe('miss');
    expect(wrong.attackGrades[0]).toBeUndefined();
    expect(wrong.earnedSustainPoints).toBe(0);
    expect(wrong.wrongCount).toBe(1);
  });

  it('validates shared tolerances and scales overlay geometry', () => {
    expect(validateScoringSettings({ ...DEFAULT_SCORING_SETTINGS, goodMs: -1 })).toMatch(/nonnegative/);
    expect(validateScoringSettings({ ...DEFAULT_SCORING_SETTINGS, perfectMs: Infinity })).toMatch(/finite/);
    expect(validateScoringSettings({ ...DEFAULT_SCORING_SETTINGS, perfectMs: 200 })).toMatch(/cannot exceed/);
    expect(validateScoringSettings({ ...DEFAULT_SCORING_SETTINGS, goodPoints: 101 })).toMatch(/cannot exceed/);
    expect(validateScoringSettings({ ...DEFAULT_SCORING_SETTINGS, speedBonusStrength: 4 })).toMatch(/between 0 and 3/);
    expect(attackWindowSeconds(80, 2)).toBe(0.16);
    expect(holdBufferSeconds(120, 2, 1)).toBe(0.24);
  });

  it('keeps the achieved bonus after a break and raises it only beyond the old best', () => {
    const targets: TypingTarget[] = 'ABCDE'.split('').map((letter, index) =>
      ({ id: letter, word: 'ABCDE', letter, time: index + 1, index, wordIndex: 0 }));
    const round = new TypingRound(targets);
    round.key('a', 1); round.keyUp('a', 1);
    round.key('b', 2); round.keyUp('b', 2);
    expect(round.comboBonus).toBe(10);
    round.key('z', 2.5); round.keyUp('z', 2.5);
    expect(round.comboBonus).toBe(10);
    round.key('c', 3); round.keyUp('c', 3);
    round.key('d', 4); round.keyUp('d', 4);
    expect(round.comboBonus).toBe(10);
    round.key('e', 5);
    expect(round.comboBonus).toBe(15);
  });

  it('uses nondefault hold points and speed strength without assuming 100 means full', () => {
    const settings = { ...DEFAULT_SCORING_SETTINGS, maxHoldPoints: 40, speedBonusStrength: 0 };
    const round = new TypingRound([hold], settings);
    round.reset(0, 3);
    expect(round.availablePoints).toBe(145);
    round.key('a', 1);
    round.advance(1.5);
    expect(round.earnedSustainPoints).toBe(20);
    round.keyUp('a', 2);
    expect(round.earnedSustainPoints).toBe(40);
    expect(round.totalPoints).toBe(145);
    expect(holdProgressPercent(20, 40)).toBe(50);
    expect(holdProgressPercent(0, 0)).toBe(0);
  });
});
