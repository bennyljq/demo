import { importMusicXml } from '../music/musicxml-import';
import { buildXmlTypingChart } from '../gameplay/piano-chart';
import { coupleStaffMelody } from '../gameplay/twinkle-coupling';
import { calculateDemand, DemandMetrics } from '../gameplay/piano-wpm';
import { prepareTwinkleRun } from './prepare-twinkle-run';
import { buildEightKeysChart } from './eight-keys-chart';
import { songChartFor } from './song-charts';
import type { PianoMode } from '../gameplay/piano-mode';

describe('generated Library demand', () => {
  it('computes both visible scores through the existing importer and chart builders', async () => {
    const report: Record<string, Record<PianoMode, DemandMetrics>> = {};
    for (const [id, file] of [
      ['twinkle-theme', 'Twinkle_Theme.musicxml'],
      ['twinkle-variation-01', 'Twinkle_Variation_01.musicxml'],
    ] as const) {
      const score = importMusicXml(await (await fetch(`/assets/piano/tracks/${file}`)).text());
      const chart = songChartFor(id);
      const authored = buildXmlTypingChart(score, chart.phrases, chart.unitsPerQuarter);
      const word = prepareTwinkleRun(score, [], 2100, id);
      const eight = buildEightKeysChart(score, id);
      const rhythmDemand = calculateDemand(authored, coupleStaffMelody(score, authored));
      const wordDemand = calculateDemand(word.targets, word.coupling);
      const eightDemand = calculateDemand(eight, coupleStaffMelody(score, eight));
      expect(rhythmDemand).not.toBeNull();
      expect(wordDemand).not.toBeNull();
      expect(eightDemand).not.toBeNull();
      report[id] = { rhythm: rhythmDemand!, 'eight-keys': eightDemand!, 'word-concert': wordDemand! };
    }
    console.log(`PIANO_DEMAND_BASE64=${btoa(JSON.stringify(report))}`);
  });
});
