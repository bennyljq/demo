import { importMusicXml } from '../music/musicxml-import';
import { coupleStaffMelody } from '../gameplay/twinkle-coupling';
import { EIGHT_KEY_PATTERNS, buildEightKeysChart } from './eight-keys-chart';

describe('Eight Keys authored patterns', () => {
  for (const [id, file, count, holds] of [
    ['twinkle-theme', 'Twinkle_Theme.musicxml', 98, 6],
    ['twinkle-variation-01', 'Twinkle_Variation_01.musicxml', 322, 8],
  ] as const) {
    it(`maps every ${id} melody attack across repeats without conflicting holds`, async () => {
      const score = importMusicXml(await (await fetch(`/assets/piano/tracks/${file}`)).text());
      const targets = buildEightKeysChart(score, id);
      expect(targets.length).toBe(count);
      expect(targets.filter(target => target.holdEnd !== undefined).length).toBe(holds);
      expect(coupleStaffMelody(score, targets).length).toBe(count);
      expect(targets.every(target => 'QWERUIOP'.includes(target.letter))).toBeTrue();
      const repeated = targets.filter(target => target.source?.occurrence === 2);
      expect(repeated.length).toBeGreaterThan(0);
      for (const target of repeated) {
        const first = targets.find(other => other.source?.occurrence === 1 &&
          other.source.start.measure === target.source!.start.measure &&
          other.source.start.beat === target.source!.start.beat);
        expect(target.letter).withContext(target.id).toBe(first?.letter);
      }
    });
  }

  it('reuses recognizable themes while retaining tied-continuation exceptions', () => {
    expect(EIGHT_KEY_PATTERNS['theme-1']).toBe(EIGHT_KEY_PATTERNS['theme-9']);
    expect(EIGHT_KEY_PATTERNS['variation-01-25']).toBe(EIGHT_KEY_PATTERNS['variation-01-42']);
    expect(EIGHT_KEY_PATTERNS['variation-01-29'].length).toBe(7);
    expect(EIGHT_KEY_PATTERNS['variation-01-41'].length).toBe(3);
  });
});
