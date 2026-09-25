import { PianoDemoController } from './piano-demo-controller';
import { TypingRound } from './piano-judgement';

describe('tutorial demo controller', () => {
  it('hits each attack and releases an authored hold once even when a frame is late', () => {
    const targets = [
      { index: 0, id: 'one', word: 'AB', letter: 'A', time: 0, wordIndex: 0 },
      { index: 1, id: 'two', word: 'AB', letter: 'B', time: 0.5, holdEnd: 1, wordIndex: 0 },
    ];
    const round = new TypingRound(targets);
    const demo = new PianoDemoController(targets, round, 1);
    demo.step(1.5); // Delayed frame must process the entire queue in order.
    demo.step(1.5);
    round.advance(1.5);
    expect(round.results).toEqual(['perfect', 'perfect']);
    expect(round.earnedSustainPoints).toBe(100);
    expect(round.combo).toBe(2);
    demo.cancel();
    demo.step(3);
    expect(round.combo).toBe(2);
  });
});
