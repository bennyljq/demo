import { BasicMIDI } from 'spessasynth_core';
import { buildScoreMidi, importMusicXml } from '../music/musicxml-import';
import { extractPianoTimeline } from '../music/piano-timeline';
import { buildXmlTypingChart } from './piano-chart';
import { TWINKLE_THEME_CHART } from '../charts/twinkle-theme-chart';
import { randomizeTwinkleWords } from '../charts/twinkle-word-randomizer';
import { coupleTwinkleMelody } from './twinkle-coupling';
import { prepareTwinkleRun } from '../charts/prepare-twinkle-run';
import { TypingRound } from './piano-judgement';
import { captureRunResult } from './piano-run-result';

describe('Twinkle player melody coupling', () => {
  it('maps every performed staff-1 attack across both repeat visits and removes only those notes from MIDI', async () => {
    const xml = await (await fetch('/assets/piano/tracks/Twinkle_Theme.musicxml')).text();
    const score = importMusicXml(xml);
    const chart = buildXmlTypingChart(score, TWINKLE_THEME_CHART, 2);
    const mapped = coupleTwinkleMelody(score, chart);
    expect(mapped.length).toBe(98);
    expect(new Set(mapped.flatMap(target => target.notes.map(note => note.id))).size).toBe(98);
    expect(mapped.filter(target => target.occurrence === 2).length).toBe(49);
    expect(mapped.filter(target => target.hold).length).toBe(6);
    expect(mapped.filter(target => !target.hold && target.notes[0].duration < 0.16).length).toBe(6);
    expect(mapped.filter(target => !target.hold && target.notes[0].duration < 0.48).length).toBe(12);
    expect(mapped.flatMap(target => target.notes).every(note => note.staff === 1)).toBeTrue();
    const filtered = buildScoreMidi(score, new Set(mapped.flatMap(target => target.notes.map(note => note.id))));
    const originalNotes = extractPianoTimeline(score.midi).notes;
    const remaining = extractPianoTimeline(filtered).notes;
    expect(originalNotes.length - remaining.length).toBe(98);
    expect(remaining).toEqual(originalNotes.filter(note => note.trackIndex !== 1));
    const fullMidi = BasicMIDI.fromArrayBuffer(score.midi, 'full.mid');
    const filteredMidi = BasicMIDI.fromArrayBuffer(filtered, 'accompaniment.mid');
    const controllers = (midi: BasicMIDI) => midi.tracks.flatMap(track => track.events.filter(event => (event.statusByte & 0xf0) === 0xb0));
    expect(controllers(filteredMidi).length).toBe(controllers(fullMidi).length);
    expect(score.controllerEvents.length).toBeGreaterThanOrEqual(0);
  });

  it('rejects missing or duplicate chart attacks instead of dropping notes silently', async () => {
    const score = importMusicXml(await (await fetch('/assets/piano/tracks/Twinkle_Theme.musicxml')).text());
    const chart = buildXmlTypingChart(score, TWINKLE_THEME_CHART, 2);
    expect(() => coupleTwinkleMelody(score, chart.slice(1))).toThrowError(/unmapped/);
    expect(() => coupleTwinkleMelody(score, [...chart, chart[0]])).toThrowError(/mapped twice/);
  });

  it('keeps note coordinates and repeats while assigning distinct words of the authored lengths', () => {
    const randomized = randomizeTwinkleWords(TWINKLE_THEME_CHART, () => 0);
    expect(randomized.map(phrase => phrase.id)).toEqual(TWINKLE_THEME_CHART.map(phrase => phrase.id));
    expect(randomized.map(phrase => phrase.letters)).toEqual(TWINKLE_THEME_CHART.map(phrase => phrase.letters));
    expect(randomized.map(phrase => phrase.occurrence)).toEqual(TWINKLE_THEME_CHART.map(phrase => phrase.occurrence));
    expect(randomized.every(phrase => phrase.word.length === phrase.letters.length && /^[A-Z]+$/.test(phrase.word))).toBeTrue();
    expect(new Set(randomized.map(phrase => phrase.word)).size).toBe(randomized.length);
    expect(randomized.filter(phrase => phrase.word.length === 5).length).toBe(1);
  });

  it('prepares seeded, playable words without changing coupling or an earlier result snapshot', async () => {
    const score = importMusicXml(await (await fetch('/assets/piano/tracks/Twinkle_Theme.musicxml')).text());
    const first = prepareTwinkleRun(score, [], 42);
    const again = prepareTwinkleRun(score, [], 42);
    const next = prepareTwinkleRun(score, first.words, 42);
    expect(again.words).toEqual(first.words);
    expect(next.words).not.toEqual(first.words);
    expect(new Set(next.words).size).toBe(12);
    expect(first.targets.map(target => [target.id, target.time, target.holdEnd]))
      .toEqual(next.targets.map(target => [target.id, target.time, target.holdEnd]));
    expect(first.coupling.map(target => target.notes.map(note => note.id)))
      .toEqual(next.coupling.map(target => target.notes.map(note => note.id)));
    const round = new TypingRound(first.targets);
    round.advance(score.duration + 1);
    const snapshot = captureRunResult(round, 'twinkle-theme', 'Twinkle Twinkle Little Star', 'full', 1, 0)!;
    expect(snapshot.letters.map(letter => letter.word)).toEqual(first.targets.map(target => target.word));
    expect(snapshot.letters.map(letter => letter.word)).not.toEqual(next.targets.map(target => target.word));
    for (let seed = 0; seed < 32; seed++) {
      const prepared = prepareTwinkleRun(score, [], seed);
      expect(new Set(prepared.words).size).withContext(`seed ${seed}`).toBe(12);
      expect(prepared.targets.length).withContext(`seed ${seed}`).toBe(98);
      expect(prepared.coupling.length).withContext(`seed ${seed}`).toBe(98);
    }
  });
});
