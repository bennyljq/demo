import { buildXmlTypingChart } from './piano-chart';
import { importMusicXml } from '../music/musicxml-import';
import { readMxlRootfile } from '../music/mxl-container';
import { TypingRound } from './piano-judgement';
import { resolveChartLocation } from '../music/piano-chart-time';
import { scoreBeatGrid, countInBeatSeconds } from '../audio/piano-metronome';
import { timeToX } from '../rendering/piano-roll-geometry';
import { PHASE9_CHART_TIMES } from '../charts/chart-times.phase9';
import { songChartFor } from '../charts/song-charts';

describe('readable score chart', () => {
  it('keeps every migrated Turkish and Greensleeves attack and hold time', async () => {
    for (const id of ['greensleeves', 'wa-mozart-marche-turque-turkish-march-fingered']) {
      const file = id === 'greensleeves' ? 'Greensleeves.mxl' : 'WA_Mozart_Marche_Turque_Turkish_March_fingered.mxl';
      const response = await fetch(`/assets/piano/tracks/${file}`);
      const score = importMusicXml(await readMxlRootfile(await response.arrayBuffer()));
      const definition = songChartFor(id);
      const actual = buildXmlTypingChart(score, definition.phrases, definition.unitsPerQuarter);
      const baseline = PHASE9_CHART_TIMES[id];
      expect(actual.length).toBe(baseline.length);
      actual.forEach((target, index) => {
        expect(target.id).toBe(baseline[index].id);
        expect(target.time).withContext(`${id} attack ${index}`).toBeCloseTo(baseline[index].time, 7);
        if (target.holdEnd !== undefined)
          expect(target.holdEnd).withContext(`${id} hold ${index}`).toBeCloseTo(baseline[index].holdEnd!, 7);
        else expect(baseline[index].holdEnd).toBeNull();
      });
    }
  });

  it('selects the first-pass upper line and a musical hold endpoint', async () => {
    const response = await fetch('/assets/piano/tracks/WA_Mozart_Marche_Turque_Turkish_March_fingered.mxl');
    expect(response.ok).toBeTrue();
    const score = importMusicXml(await readMxlRootfile(await response.arrayBuffer()));
    const targets = buildXmlTypingChart(score);
    expect(targets.length).toBe(33);
    expect(targets.map(t => t.letter).join('')).toBe('APPLEFISHBIRDHOUSESTARMOONTREESUN');
    expect(targets[4].holdEnd).toBeGreaterThan(targets[4].time);
    expect(targets.at(-1)!.time).toBeLessThan(score.measures.find(m => m.occurrence === 2)!.start);
    expect(() => buildXmlTypingChart(score, [{ word: 'A', letters: [{ start: { measure: 1, beat: 99 } }] }])).toThrowError(/measure 1.*beat/);
    const starA = targets.find(t => t.wordIndex === 4 && t.letter === 'A')!;
    expect(starA.time).toBe(resolveChartLocation(score, { measure: 5, beat: 0 }).time);
    const changedOrnaments = { ...score, soundingNotes: score.soundingNotes.map(n => ({ ...n, start: n.start + 0.2 })) };
    expect(buildXmlTypingChart(changedOrnaments).map(t => t.time)).toEqual(targets.map(t => t.time));
  });

  it('resolves a requested repeat occurrence to a distinct performed note', async () => {
    const response = await fetch('/assets/piano/tracks/WA_Mozart_Marche_Turque_Turkish_March_fingered.mxl');
    const score = importMusicXml(await readMxlRootfile(await response.arrayBuffer()));
    const repeated = score.measures.find(m => m.occurrence === 2)!;
    const phrase = { word: 'A', letters: [{ start: { measure: repeated.number, beat: 0 } }] };
    const first = buildXmlTypingChart(score, [{ ...phrase, occurrence: 1 }]);
    const second = buildXmlTypingChart(score, [{ ...phrase, occurrence: 2 }]);
    expect(first[0].id).not.toBe(second[0].id);
    expect(first[0].time).toBeLessThan(second[0].time);
    const both = buildXmlTypingChart(score, [{ ...phrase, occurrence: 'all' }]);
    expect(both.map(t => t.id)).toEqual([first[0].id, second[0].id]);
    expect(() => buildXmlTypingChart(score, [{ word: 'A', occurrence: 2, letters: [{
      start: { measure: repeated.number, beat: 0 }, end: { measure: repeated.number, beat: 2, occurrence: 1 },
    }] }])).toThrowError(/hold end must follow start/);
    const beforeJump = score.measures[score.measures.indexOf(repeated) - 1];
    expect(resolveChartLocation(score, { measure: beforeJump.number, beat: beforeJump.durationQuarter * 2, occurrence: beforeJump.occurrence }).time)
      .toBe(resolveChartLocation(score, { measure: repeated.number, beat: 0, occurrence: repeated.occurrence }).time);
  });

  it('allows a target between sounded notes and a full-measure hold', async () => {
    const response = await fetch('/assets/piano/tracks/WA_Mozart_Marche_Turque_Turkish_March_fingered.mxl');
    const score = importMusicXml(await readMxlRootfile(await response.arrayBuffer()));
    const target = buildXmlTypingChart(score, [{ word: 'A', letters: [{ start: { measure: 5, beat: 0.2 }, end: { measure: 6, beat: 0 } }] }])[0];
    expect(score.soundingNotes.some(note => Math.abs(note.start - target.time) < 1e-8)).toBeFalse();
    expect(target.holdEnd).toBe(resolveChartLocation(score, { measure: 6, beat: 0 }).time);
    expect(() => buildXmlTypingChart(score, [{ word: 'AA', letters: [
      { start: { measure: 5, beat: 0 }, end: { measure: 6, beat: 0 } },
      { start: { measure: 5, beat: 2 } },
    ] }])).toThrowError(/same-key target/);
    expect(() => buildXmlTypingChart(score, [{ word: 'A', letters: [
      { start: { measure: 5, beat: Number.NaN } },
    ] }])).toThrowError(/finite/);
  });

  it('uses partial-measure duration and tempo changes without second interpolation', async () => {
    const response = await fetch('/assets/piano/how-to-piano-poc.musicxml');
    const fixture = importMusicXml(await response.text());
    const third = fixture.measures[2];
    expect(resolveChartLocation(fixture, { measure: third.number, beat: third.durationQuarter * 2 }).time).toBe(fixture.measures[3].start);
    const fourth = fixture.measures[3];
    const middle = resolveChartLocation(fixture, { measure: fourth.number, beat: fourth.durationQuarter });
    expect(middle.time).toBeCloseTo(fourth.start + fourth.durationQuarter / 2 * 60 / 90, 6);
    const changedInside = { ...fixture, tempos: [...fixture.tempos, { quarter: fourth.quarter + 1, value: 60 }]
      .sort((a, b) => a.quarter - b.quarter) };
    const integrated = resolveChartLocation(changedInside, { measure: fourth.number, beat: fourth.durationQuarter });
    expect(integrated.time).toBeCloseTo(fourth.start + 60 / 90 + 60 / 60, 6);
    expect(scoreBeatGrid(fixture).find(beat => beat.measureId === fourth.id && beat.beat === 1)!.sourceTime)
      .toBeCloseTo(fourth.start + 60 / 90, 6);
    expect(countInBeatSeconds(fixture, fourth.start, 1)).toEqual([0, 2 / 3, 4 / 3, 2]);
    const scoreResponse = await fetch('/assets/piano/tracks/WA_Mozart_Marche_Turque_Turkish_March_fingered.mxl');
    const score = importMusicXml(await readMxlRootfile(await scoreResponse.arrayBuffer()));
    expect(score.measures[0].durationQuarter).toBe(1);
    expect(resolveChartLocation(score, { measure: 0, beat: 1 }).quarter).toBe(score.measures[0].quarter + 0.5);
    expect(resolveChartLocation(score, { measure: 0, beat: 2 }).time).toBe(score.measures[1].start);
    expect(() => resolveChartLocation(score, { measure: 0, beat: 2.01 })).toThrowError(/0-2 musical units/);
    expect(scoreBeatGrid(score).filter(beat => beat.measureId === score.measures[0].id).length).toBe(1);
    const repeated = score.measures.find(measure => measure.occurrence === 2)!;
    expect(scoreBeatGrid(score).find(beat => beat.measureId === repeated.id && beat.beat === 0)?.sourceTime)
      .toBe(repeated.start);
    expect(countInBeatSeconds(score, 0, 1)).toEqual([0, 0.5]);
    expect(countInBeatSeconds(score, 0, 3)[1]).toBeCloseTo(1 / 6, 8);
  });

  it('extends musical units through Liebestraum cadenza bars', async () => {
    const response = await fetch('/assets/piano/tracks/Liebestraum_No._3_in_A_Major.mxl');
    const score = importMusicXml(await readMxlRootfile(await response.arrayBuffer()));
    for (const [label, length] of [['25', 15], ['26', 21]] as const) {
      const measure = score.measures.find(item => item.number === label)!;
      expect(measure.durationQuarter).toBe(length);
      const atEnd = resolveChartLocation(score, { measure: label, beat: length * 2 });
      expect(atEnd.time).toBe(score.measures[score.measures.indexOf(measure) + 1].start);
      expect(resolveChartLocation(score, { measure: label, beat: 6 }).quarter).toBe(measure.quarter + 3);
    }
  });

  it('changes only roll geometry when look-ahead changes', () => {
    expect(timeToX(2, 0, 1000, 4)).toBeGreaterThan(timeToX(2, 0, 1000, 10));
    expect(timeToX(0, 0, 1000, 4)).toBe(timeToX(0, 0, 1000, 10));
  });
});

describe('hold, counters and seeking', () => {
  const targets = [
    { index: 0, id: 'a', word: 'AB', letter: 'A', time: 1, holdEnd: 2, wordIndex: 0 },
    { index: 1, id: 'b', word: 'AB', letter: 'B', time: 1.5, wordIndex: 0 },
    { index: 2, id: 'c', word: 'C', letter: 'C', time: 3, wordIndex: 1 },
  ];
  it('scores attack immediately and scales the full-credit release buffer', () => {
    for (const rate of [0.5, 1, 2, 3]) {
      const round = new TypingRound(targets);
      round.key('a', 1, rate);
      expect(round.results[0]).toBe('holding');
      round.key('a', 1.1, rate); // auto-repeat-like duplicate
      expect(round.combo).toBe(1);
      round.keyUp('a', 2 - 0.12 * rate, rate);
      expect(round.results[0]).toBe('perfect');
      expect(round.combo).toBe(1);
      expect(round.earnedSustainPoints).toBe(100);
      round.reset();
      round.key('a', 1, rate);
      round.keyUp('a', 2 - 0.17 * rate, rate);
      expect(round.results[0]).toBe('perfect');
      expect(round.combo).toBe(1);
      expect(round.earnedSustainPoints).toBeLessThan(100);
    }
  });
  it('allows a different-key tap during a hold and retains attack on blur', () => {
    const round = new TypingRound(targets);
    round.key('a', 1);
    round.key('b', 1.5);
    expect(round.results.slice(0, 2)).toEqual(['holding', 'perfect']);
    expect(round.combo).toBe(2);
    round.advance(2);
    expect(round.results[0]).toBe('perfect');
    expect(round.combo).toBe(2);
    round.reset();
    round.key('a', 1);
    round.blur();
    round.advance(2);
    expect(round.results[0]).toBe('perfect');
    expect(round.combo).toBe(0); // The still-unplayed B attack expires independently.
  });
  it('counts wrong presses and later misses separately, then resets by seek', () => {
    const round = new TypingRound(targets);
    round.key('z', 1);
    expect(round.wrongCount).toBe(1);
    round.advance(1.2);
    expect(round.results[0]).toBe('miss');
    round.key('b', 1.5);
    expect(round.combo).toBe(1);
    round.reset(1.75);
    expect(round.results.slice(0, 2)).toEqual(['skipped', 'skipped']);
    expect(round.wrongCount).toBe(0);
    expect(round.combo).toBe(0);
    round.reset(0);
    expect(round.results).toEqual(['pending', 'pending', 'pending']);
  });
});
