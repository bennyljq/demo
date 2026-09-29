import { PianoDemoController } from './piano-demo-controller';
import { TypingRound } from './piano-judgement';
import { importMusicXml } from '../music/musicxml-import';
import { prepareTwinkleRun } from '../charts/prepare-twinkle-run';
import { buildEightKeysChart } from '../charts/eight-keys-chart';
import { buildXmlTypingChart } from './piano-chart';
import { songChartFor } from '../charts/song-charts';
import type { PianoMode } from './piano-mode';

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

  it('completes both songs in all three modes with one ordered audio-clock action plan', async () => {
    for (const [id, file, count] of [
      ['twinkle-theme', 'Twinkle_Theme.musicxml', 98],
      ['twinkle-variation-01', 'Twinkle_Variation_01.musicxml', 322],
    ] as const) {
      const score = importMusicXml(await (await fetch(`/assets/piano/tracks/${file}`)).text());
      const authored = songChartFor(id);
      for (const mode of ['rhythm', 'eight-keys', 'word-concert'] as PianoMode[]) {
        const targets = mode === 'rhythm' ? buildXmlTypingChart(score, authored.phrases, authored.unitsPerQuarter) :
          mode === 'eight-keys' ? buildEightKeysChart(score, id) : prepareTwinkleRun(score, [], 1234, id).targets;
        const round = new TypingRound(targets, undefined, mode);
        const demo = new PianoDemoController(targets, round, 1, undefined, mode);
        expect(targets.length).withContext(`${id} ${mode}`).toBe(count);
        expect(demo.actions.length).toBe(count * 2);
        for (let time = 0; time <= score.duration + 2; time += 5) { demo.step(time); round.advance(time); }
        demo.step(score.duration + 2);
        round.advance(score.duration + 2);
        expect(round.results.every(result => result === 'perfect')).withContext(`${id} ${mode}`).toBeTrue();
        expect(round.earnedSustainPoints).withContext(`${id} ${mode}`).toBe(round.availableSustainPoints);
        expect(round.wrongCount).withContext(`${id} ${mode}`).toBe(0);
      }
    }
  });

  it('schedules the custom physical bindings for an Eight Keys demo', () => {
    const targets = [
      { index: 0, id: 'left', word: 'QU', letter: 'Q', time: 0, holdEnd: 0.5, wordIndex: 0 },
      { index: 1, id: 'right', word: 'QU', letter: 'U', time: 1, wordIndex: 0 },
    ];
    const round = new TypingRound(targets, undefined, 'eight-keys', 'ASDFJKLZ');
    const demo = new PianoDemoController(targets, round, 1);
    expect(demo.actions.filter(action => !action.release).map(action => action.key)).toEqual(['A', 'J']);
    demo.step(2);
    round.advance(2);
    expect(round.results).toEqual(['perfect', 'perfect']);
    expect(round.sustainPoints[0]).toBe(100);
  });
});
