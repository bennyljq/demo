import { SONGS } from './song-manifest.generated';
import { chartForSong } from './song-charts';
import { readMxlRootfile } from './mxl-container';
import { importMusicXml } from './musicxml-import';
import { buildXmlTypingChart } from './piano-chart';
import { metricGrouping, scoreBeatGrid } from './piano-metronome';

describe('generated song library', () => {
  it('discovers all three supplied MXL files with independent charts', async () => {
    expect(SONGS.length).toBe(3);
    expect(SONGS.map(song => song.id)).toEqual(['greensleeves', 'liebestraum-no-3-in-a-major',
      'wa-mozart-marche-turque-turkish-march-fingered']);
    for (const song of SONGS) {
      const response = await fetch(`/assets/piano/tracks/${encodeURIComponent(song.file)}`);
      expect(response.ok).withContext(song.file).toBeTrue();
      let score: ReturnType<typeof importMusicXml>;
      try { score = importMusicXml(await readMxlRootfile(await response.arrayBuffer())); }
      catch (error) { throw new Error(`${song.file}: ${error}`); }
      expect(score.duration).withContext(song.file).toBeGreaterThan(0);
      const chart = buildXmlTypingChart(score, chartForSong(song.id));
      if (song.id === 'greensleeves') {
        expect(score.measureCount).toBe(33);
        expect(chart.length).toBe(73);
        expect(chart.filter(target => target.holdEnd !== undefined).length).toBe(17);
        expect(chart[0].source?.start.measure).toBe(2);
        expect(chart.at(-1)?.source?.start.measure).toBe(33);
      } else if (song.id.startsWith('liebestraum')) expect(chart).toEqual([]);
      else expect(chart.length).toBeGreaterThan(0);
      expect(scoreBeatGrid(score).length).toBeGreaterThan(0);
    }
  });

  it('groups 6/4 into two dotted-half clicks', () => {
    expect(metricGrouping(6, 4)).toEqual({ count: 2, quarterStep: 3 });
    expect(metricGrouping(3, 4)).toEqual({ count: 3, quarterStep: 1 });
  });
});
