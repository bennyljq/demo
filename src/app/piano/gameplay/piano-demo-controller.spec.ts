import { PianoDemoController } from './piano-demo-controller';
import { TypingRound } from './piano-judgement';
import { importMusicXml } from '../music/musicxml-import';
import { prepareTwinkleRun } from '../charts/prepare-twinkle-run';

describe('full-song demo controller', () => {
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

  it('scores every performed Twinkle attack and full hold credit despite delayed visual frames', async () => {
    const score = importMusicXml(await (await fetch('/assets/piano/tracks/Twinkle_Theme.musicxml')).text());
    const prepared = prepareTwinkleRun(score, [], 1234);
    const round = new TypingRound(prepared.targets);
    const demo = new PianoDemoController(prepared.targets, round, 1);
    expect(prepared.targets.length).toBe(98);
    expect(demo.actions.length).toBe(196);
    for (let time = 0; time <= score.duration + 2; time += 5) {
      demo.step(time); // Five-second frame gaps must still judge at event times, before expiry.
      round.advance(time);
    }
    demo.step(score.duration + 2);
    round.advance(score.duration + 2);
    expect(round.results.every(result => result === 'perfect')).toBeTrue();
    expect(round.wrongCount).toBe(0);
    expect(round.earnedSustainPoints).toBe(round.availableSustainPoints);
    expect(round.availableSustainPoints).toBe(600);
    expect(round.totalPoints).toBe(round.availablePoints);
    for (const target of prepared.targets.filter(entry => entry.source?.occurrence === 2)) {
      const firstId = target.id.replace(':2:', ':1:');
      expect(target.letter).toBe(prepared.targets.find(entry => entry.id === firstId)?.letter);
    }
  });
});
