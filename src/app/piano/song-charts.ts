import type { XmlPhrase } from './piano-chart';
import { GREENSLEEVES_CHART } from './greensleeves-chart';
import { TURKISH_CHART } from './turkish-chart';
import { TWINKLE_THEME_CHART } from './twinkle-theme-chart';
import { SONGS } from './song-manifest.generated';

export type ChartCoverage = 'full' | 'opening' | 'listen';
export interface SongChart { readonly unitsPerQuarter: number; readonly phrases: readonly XmlPhrase[]; readonly coverage: ChartCoverage }

const charts: Readonly<Record<string, SongChart>> = {
  greensleeves: { unitsPerQuarter: 2, phrases: GREENSLEEVES_CHART, coverage: 'full' },
  'wa-mozart-marche-turque-turkish-march-fingered': { unitsPerQuarter: 2, phrases: TURKISH_CHART, coverage: 'opening' },
  'twinkle-theme': { unitsPerQuarter: 2, phrases: TWINKLE_THEME_CHART, coverage: 'full' },
};

export function songChartFor(id: string): SongChart {
  if (!SONGS.some(song => song.id === id)) throw new Error(`Unknown song ${id}.`);
  return charts[id] ?? { unitsPerQuarter: 2, phrases: [], coverage: 'listen' };
}

export function chartForSong(id: string): readonly XmlPhrase[] { return songChartFor(id).phrases; }
