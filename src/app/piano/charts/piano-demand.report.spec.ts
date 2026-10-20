import { importMusicXml } from '../music/musicxml-import';
import { buildXmlTypingChart } from '../gameplay/piano-chart';
import { coupleStaffMelody } from '../gameplay/twinkle-coupling';
import { calculateDemand, DemandMetrics } from '../gameplay/piano-wpm';
import { prepareTwinkleRun } from './prepare-twinkle-run';
import { buildEightKeysChart } from './eight-keys-chart';
import { songChartFor } from './song-charts';
import type { PianoMode } from '../gameplay/piano-mode';
import { readMxlRootfile } from '../music/mxl-container';
import { coupleNocturneMelody } from './nocturne-coupling';

describe('generated Library demand', () => {
  it('computes visible scores through the existing importer and chart builders', async () => {
    const report: Record<string, Record<PianoMode, DemandMetrics>> = {};
    for (const [id, file] of [
      ['twinkle-theme', 'Twinkle_Theme.musicxml'],
      ['twinkle-variation-01', 'Twinkle_Variation_01.musicxml'],
      ['chopin-nocturne-op-9-no-2', 'Chopin_-_Nocturne_Op_9_No_2_E_Flat_Major.mxl'],
    ] as const) {
      const response = await fetch(`/assets/piano/tracks/${file}`);
      const score = importMusicXml(file.endsWith('.mxl') ? await readMxlRootfile(await response.arrayBuffer()) : await response.text());
      const chart = songChartFor(id);
      const authored = buildXmlTypingChart(score, chart.phrases, chart.unitsPerQuarter);
      const word = prepareTwinkleRun(score, [], 2100, id);
      const eight = buildEightKeysChart(score, id);
      const rhythm = id === 'chopin-nocturne-op-9-no-2' ? coupleNocturneMelody(score, authored) :
        { targets: authored, coupling: coupleStaffMelody(score, authored) };
      const eightPrepared = id === 'chopin-nocturne-op-9-no-2' ? coupleNocturneMelody(score, eight) :
        { targets: eight, coupling: coupleStaffMelody(score, eight) };
      const rhythmDemand = calculateDemand(rhythm.targets, rhythm.coupling);
      const wordDemand = calculateDemand(word.targets, word.coupling);
      const eightDemand = calculateDemand(eightPrepared.targets, eightPrepared.coupling);
      expect(rhythmDemand).not.toBeNull();
      expect(wordDemand).not.toBeNull();
      expect(eightDemand).not.toBeNull();
      report[id] = { rhythm: rhythmDemand!, 'eight-keys': eightDemand!, 'word-concert': wordDemand! };
    }
    console.log(`PIANO_DEMAND_BASE64=${btoa(JSON.stringify(report))}`);
  });
});
