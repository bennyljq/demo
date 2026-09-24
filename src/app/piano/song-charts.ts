import type { XmlPhrase } from './piano-chart';
import { GREENSLEEVES_CHART } from './greensleeves-chart';
import { TURKISH_CHART } from './turkish-chart';
import { SONGS } from './song-manifest.generated';

const charts: Readonly<Record<string, readonly XmlPhrase[]>> = {
  greensleeves: GREENSLEEVES_CHART,
  'liebestraum-no-3-in-a-major': [],
  'wa-mozart-marche-turque-turkish-march-fingered': TURKISH_CHART,
};

export function chartForSong(id: string): readonly XmlPhrase[] {
  if (!SONGS.some(song => song.id === id)) throw new Error(`Unknown song ${id}.`);
  if (!Object.prototype.hasOwnProperty.call(charts, id)) throw new Error(`No chart registry entry for ${id}.`);
  return charts[id];
}
