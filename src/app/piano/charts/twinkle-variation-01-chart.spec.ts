import { importMusicXml, buildScoreMidi } from '../music/musicxml-import';
import { BasicMIDI } from 'spessasynth_core';
import { extractPianoTimeline } from '../music/piano-timeline';
import { prepareTwinkleRun } from './prepare-twinkle-run';
import { TWINKLE_VARIATION_01_CHART } from './twinkle-variation-01-chart';

describe('Variation I complete performed melody', () => {
  it('covers every upper-staff sounding attack and excludes only those notes from autoplay', async () => {
    const xml = await (await fetch('/assets/piano/tracks/Twinkle_Variation_01.musicxml')).text();
    const score = importMusicXml(xml);
    const melody = score.soundingNotes.filter(note => note.staff === 1);
    const accompaniment = score.soundingNotes.filter(note => note.staff !== 1);
    const run = prepareTwinkleRun(score, [], 18, 'twinkle-variation-01');
    const silentLateAt = (rate: number) => run.coupling.filter(target => !target.hold &&
      target.notes.every(note => note.duration < 0.160 * rate - 1e-9)).length;
    expect(run.targets.length).toBe(melody.length);
    expect(score.measures.length).toBe(48);
    expect(score.duration).toBeCloseTo(48, 6);
    expect(melody.length).toBe(322);
    expect(run.coupling.length).toBe(run.targets.length);
    expect(new Set(run.coupling.flatMap(target => target.notes.map(note => note.id))))
      .toEqual(new Set(melody.map(note => note.id)));
    expect(score.measures.length).toBeGreaterThan(score.measureCount);
    expect(run.targets.filter(target => target.holdEnd !== undefined).length).toBe(8);
    expect(silentLateAt(0.5)).toBe(0);
    expect(silentLateAt(1)).toBe(290);
    expect(silentLateAt(3)).toBe(314);
    const filtered = buildScoreMidi(score, new Set(run.coupling.flatMap(target => target.notes.map(note => note.id))));
    expect(filtered.byteLength).toBeGreaterThan(0);
    expect(accompaniment.length).toBeGreaterThan(0);
    const originalNotes = extractPianoTimeline(score.midi).notes;
    const remaining = extractPianoTimeline(filtered).notes;
    expect(originalNotes.length - remaining.length).toBe(melody.length);
    expect(remaining).toEqual(originalNotes.filter(note => note.trackIndex !== 1));
    const controllers = (buffer: ArrayBuffer) => BasicMIDI.fromArrayBuffer(buffer, 'variation.mid').tracks
      .flatMap(track => track.events.filter(event => (event.statusByte & 0xf0) === 0xb0)).length;
    expect(controllers(filtered)).toBe(controllers(score.midi));
    // The template stays tied to written musical units, not random words.
    expect(TWINKLE_VARIATION_01_CHART.every(phrase => phrase.occurrence === 'all')).toBeTrue();
    expect(run.words.length).toBe(25);
    expect(accompaniment.length).toBe(108);
  });

  it('groups each fast bar into one easy-word slot without typing tied continuations', () => {
    const fastWords = TWINKLE_VARIATION_01_CHART.filter(phrase => phrase.word.length >= 7);
    expect(fastWords.length).toBe(19);
    expect(fastWords.filter(phrase => phrase.word.length === 8).length).toBe(15);
    expect(fastWords.filter(phrase => phrase.word.length === 7).map(phrase => phrase.letters[0].start.measure))
      .toEqual([29, 30, 46, 47]);
    for (const phrase of fastWords) {
      const firstBeat = phrase.word.length === 7 ? 0.5 : 0;
      expect(phrase.letters.map(letter => letter.start.beat))
        .toEqual(Array.from({ length: phrase.word.length }, (_, index) => firstBeat + index * 0.5));
      expect(phrase.letters.every(letter => letter.start.measure === phrase.letters[0].start.measure)).toBeTrue();
    }
  });

  it('rerolls words without changing times, notes, repeat visits or holds', async () => {
    const score = importMusicXml(await (await fetch('/assets/piano/tracks/Twinkle_Variation_01.musicxml')).text());
    const first = prepareTwinkleRun(score, [], 10, 'twinkle-variation-01');
    const longWords = first.words.filter(word => word.length >= 7);
    expect(new Set(longWords).size).toBe(longWords.length);
    for (const seed of [11, 12, 13]) {
      const next = prepareTwinkleRun(score, first.words, seed, 'twinkle-variation-01');
      expect(next.words).not.toEqual(first.words);
      expect(next.targets.map(target => [target.time, target.holdEnd])).toEqual(first.targets.map(target => [target.time, target.holdEnd]));
      expect(next.coupling.map(target => target.notes.map(note => note.id)))
        .toEqual(first.coupling.map(target => target.notes.map(note => note.id)));
    }
  });
});
