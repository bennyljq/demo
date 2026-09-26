import { SONGS } from './song-manifest.generated';
import { songChartFor } from './charts/song-charts';
import { readMxlRootfile } from './music/mxl-container';
import { importMusicXml } from './music/musicxml-import';
import { buildXmlTypingChart } from './gameplay/piano-chart';
import { metricGrouping, scoreBeatGrid } from './audio/piano-metronome';

describe('generated song library', () => {
  it('keeps the curated scores in order while loading both score formats', async () => {
    expect(SONGS.map(song => song.id)).toEqual([
      'twinkle-theme', 'twinkle-variation-01', 'greensleeves',
      'wa-mozart-marche-turque-turkish-march-fingered', 'liebestraum-no-3-in-a-major',
    ]);
    expect(SONGS.map(song => song.difficulty)).toEqual(['Beginner', 'Intermediate', 'Intermediate', 'Advanced', 'Not rated']);
    expect(SONGS.map(song => song.defaultLookAhead)).toEqual([6, 4, 6, 6, 6]);
    expect(SONGS.map(song => song.composer)).toEqual([
      'Wolfgang Amadeus Mozart', 'Wolfgang Amadeus Mozart', 'Traditional', 'Wolfgang Amadeus Mozart', 'Franz Liszt',
    ]);
    for (const song of SONGS) {
      const response = await fetch(`/assets/piano/tracks/${encodeURIComponent(song.file)}`);
      expect(response.ok).withContext(song.file).toBeTrue();
      let score: ReturnType<typeof importMusicXml>;
      try {
        const xml = song.file.endsWith('.mxl')
          ? await readMxlRootfile(await response.arrayBuffer()) : await response.text();
        score = importMusicXml(xml);
      }
      catch (error) { throw new Error(`${song.file}: ${error}`); }
      expect(score.duration).withContext(song.file).toBeGreaterThan(0);
      const definition = songChartFor(song.id);
      const chart = buildXmlTypingChart(score, definition.phrases, definition.unitsPerQuarter);
      if (song.id === 'greensleeves') {
        expect(score.measureCount).toBe(33);
        expect(chart.length).toBe(73);
        expect(chart.filter(target => target.holdEnd !== undefined).length).toBe(17);
        expect(chart[0].source?.start.measure).toBe(2);
        expect(chart.at(-1)?.source?.start.measure).toBe(33);
      } else if (song.id === 'twinkle-variation-01') {
        expect(score.measureCount).toBe(25);
        expect(score.measures.length).toBe(48);
        expect(chart.length).toBe(322);
      } else if (song.id === 'twinkle-theme') {
        expect(score.measureCount).toBe(24);
        expect(score.duration).toBeCloseTo(48, 5);
        expect(chart.length).toBe(98);
        expect(chart.filter(target => target.holdEnd !== undefined).length).toBe(6);
        expect(score.measures.length).toBe(48); // encoded repeats, not extraction duplication
      } else if (song.id.startsWith('liebestraum')) {
        expect(chart).toEqual([]);
      } else expect(chart.length).toBeGreaterThan(0);
      expect(scoreBeatGrid(score).length).toBeGreaterThan(0);
    }
  });

  it('partitions the collection at its printed headings without losing musical measures', async () => {
    const sourceXml = await readMxlRootfile(await (await fetch('/assets/piano/tracks/12_Variations_of_Twinkle_Twinkle_Little_Star.mxl')).arrayBuffer());
    const source = new DOMParser().parseFromString(sourceXml, 'application/xml');
    const sourceMeasures = Array.from(source.querySelectorAll('part > measure'));
    const headings = sourceMeasures.flatMap((measure, index) => {
      const labels = Array.from(measure.querySelectorAll('words'), node => node.textContent?.trim() ?? '');
      return labels.some(label => label === 'THEME.' || /^VAR\. (?:I|II|III|IV|V|VI|VII|VIII|IX|X|XI|XII)\.$/.test(label)) ? [index] : [];
    });
    expect(headings.length).toBe(13);
    expect(headings[0]).toBe(0);
    let total = 0;
    for (let index = 0; index < 13; index++) {
      const file = index === 0 ? 'Twinkle_Theme.musicxml' : `Twinkle_Variation_${String(index).padStart(2, '0')}.musicxml`;
      const xml = await (await fetch(`/assets/piano/tracks/${file}`)).text();
      const section = new DOMParser().parseFromString(xml, 'application/xml');
      const measures = Array.from(section.querySelectorAll('part > measure'));
      const originals = sourceMeasures.slice(headings[index], headings[index + 1] ?? sourceMeasures.length);
      total += measures.length;
      expect(measures.length).withContext(file).toBe(originals.length);
      expect(measures.map(measure => measure.getAttribute('number'))).toEqual(originals.map(measure => measure.getAttribute('number')));
      measures.forEach((measure, at) => {
        const sourceMeasure = originals[at];
        for (const element of ['note', 'backup', 'forward', 'barline']) {
          expect(Array.from(measure.querySelectorAll(element), node => node.outerHTML))
            .withContext(`${file} measure ${at + 1} ${element}`)
            .toEqual(Array.from(sourceMeasure.querySelectorAll(element), node => node.outerHTML));
        }
      });
      if (index > 0) {
        const attributes = measures[0].querySelector('attributes');
        for (const name of ['divisions', 'key', 'time', 'clef'])
          expect(attributes?.querySelector(name)).withContext(`${file} inherited ${name}`).not.toBeNull();
        const prior = sourceMeasures.slice(0, headings[index]);
        for (const selector of ['divisions', 'key > fifths', 'time > beats', 'time > beat-type']) {
          const previous = prior.flatMap(measure => Array.from(measure.querySelectorAll(`attributes > ${selector}`))).at(-1);
          expect(attributes?.querySelector(selector)?.textContent).withContext(`${file} ${selector}`)
            .toBe(previous?.textContent);
        }
        const priorTempo = prior.flatMap(measure => Array.from(measure.querySelectorAll('sound[tempo]'))).at(-1);
        if (priorTempo) expect(measures[0].querySelector('sound[tempo]')?.getAttribute('tempo'))
          .withContext(`${file} inherited tempo`).toBe(priorTempo.getAttribute('tempo'));
      }
    }
    expect(total).toBe(sourceMeasures.length);
    expect(total).toBe(325);
  });

  it('groups 6/4 into two dotted-half clicks', () => {
    expect(metricGrouping(6, 4)).toEqual({ count: 2, quarterStep: 3 });
    expect(metricGrouping(3, 4)).toEqual({ count: 3, quarterStep: 1 });
  });
});
