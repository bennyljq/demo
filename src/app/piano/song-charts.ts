import type { XmlPhrase } from './piano-chart';
import { GREENSLEEVES_CHART } from './greensleeves-chart';
import { TURKISH_CHART } from './turkish-chart';
import { TWINKLE_THEME_CHART } from './twinkle-theme-chart';
import { SONGS } from './song-manifest.generated';

export interface SongChart { readonly unitsPerQuarter: number; readonly phrases: readonly XmlPhrase[] }

const charts: Readonly<Record<string, SongChart>> = {
  greensleeves: { unitsPerQuarter: 2, phrases: GREENSLEEVES_CHART },
  'liebestraum-no-3-in-a-major': { unitsPerQuarter: 2, phrases: [] },
  'wa-mozart-marche-turque-turkish-march-fingered': { unitsPerQuarter: 2, phrases: TURKISH_CHART },
  'twinkle-theme': { unitsPerQuarter: 2, phrases: TWINKLE_THEME_CHART },
};

export function songChartFor(id: string): SongChart {
  if (!SONGS.some(song => song.id === id)) throw new Error(`Unknown song ${id}.`);
  return charts[id] ?? { unitsPerQuarter: 2, phrases: [] };
}

export function chartForSong(id: string): readonly XmlPhrase[] { return songChartFor(id).phrases; }
