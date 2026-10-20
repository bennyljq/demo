import { readMxlRootfile } from '../music/mxl-container';
import { importMusicXml } from '../music/musicxml-import';
import { buildXmlTypingChart } from '../gameplay/piano-chart';
import { buildEightKeysChart } from './eight-keys-chart';
import { NOCTURNE_CHART } from './nocturne-chart';
import { coupleNocturneMelody } from './nocturne-coupling';
import { prepareTwinkleRun } from './prepare-twinkle-run';
import { PlayerPerformance, PlayerNoteSink } from '../audio/player-performance';

describe('Nocturne provisional principal voice chart', () => {
  it('couples all selected attacks once and preserves the explicit decorative accompaniment', async () => {
    const response = await fetch('/assets/piano/tracks/Chopin_-_Nocturne_Op_9_No_2_E_Flat_Major.mxl');
    const score = importMusicXml(await readMxlRootfile(await response.arrayBuffer()));
    const base = coupleNocturneMelody(score, buildXmlTypingChart(score, NOCTURNE_CHART, 2));
    expect(score.measureCount).toBe(38);
    expect(score.measures.length).toBe(38); // No encoded repeats.
    expect(score.measures[33].durationQuarter).toBe(3);
    expect(score.measures[34].durationQuarter).toBe(3);
    expect(score.measures[35].durationQuarter).toBe(2);
    expect(score.controllerEvents.length).toBe(12);
    expect(base.targets.length).toBe(331);
    expect(base.coupling.length).toBe(331);
    expect(base.targets.filter(target => target.holdEnd !== undefined).length).toBe(7);
    const ids = base.coupling.flatMap(target => target.notes.map(note => note.id));
    const uncovered = score.soundingNotes.filter(note => note.staff === 1 && note.voice === '1' && !ids.includes(note.id));
    const excludedByMeasure = new Map<number, number>();
    for (const note of uncovered) {
      const written = score.writtenNotes.find(item => item.id === note.id)!;
      if (written.grace) continue;
      const measure = Number(written.measure);
      excludedByMeasure.set(measure, (excludedByMeasure.get(measure) ?? 0) + 1);
    }
    expect(Object.fromEntries(excludedByMeasure)).toEqual({ 12: 22, 20: 22, 33: 21, 34: 21, 35: 13 });
    expect(uncovered.filter(note => score.writtenNotes.find(item => item.id === note.id)?.grace).length).toBe(15);
    expect(ids.length).toBe(357);
    expect(uncovered.length).toBe(114);
    expect(new Set(ids).size).toBe(ids.length);
    const bundle = base.coupling.find(target => target.notes.length > 1 && !target.hold)!;
    let channel = 16;
    const sink: PlayerNoteSink = { now: () => 10, newChannel: () => channel++, noteOn: () => {}, noteOff: () => {} };
    const performance = new PlayerPerformance(base.coupling, sink);
    expect(performance.perform(bundle.targetIndex, 'perfect', 'KeyA', bundle.start, 1)).toBeTrue();
    expect(performance.snapshot(bundle.start + 0.01).length).toBe(bundle.notes.length);
    expect(base.targets[0].source?.start.measure).toBe(0);
    expect(base.targets.at(-1)?.source?.start.measure).toBe(37);
    const eightKeys = coupleNocturneMelody(score, buildEightKeysChart(score, 'chopin-nocturne-op-9-no-2'));
    expect(eightKeys.targets.map(target => target.time)).toEqual(base.targets.map(target => target.time));
    expect(eightKeys.coupling.flatMap(target => target.notes.map(note => note.id))).toEqual(ids);
    const first = prepareTwinkleRun(score, [], 17, 'chopin-nocturne-op-9-no-2');
    const second = prepareTwinkleRun(score, first.words, 18, 'chopin-nocturne-op-9-no-2');
    expect(first.targets.map(target => target.time)).toEqual(base.targets.map(target => target.time));
    expect(second.words).not.toEqual(first.words);
    expect(second.coupling.flatMap(target => target.notes.map(note => note.id))).toEqual(ids);
  });
});
