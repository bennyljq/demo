import type { PianoTimeline } from './piano-timeline';

/** Manually selected upper line, track 1. First phrase (0–2s) is listen-only.
 * Chords use one upper voice; rapid grace notes before 9/11/13s are omitted. */
export const PIANO_CHART = [
  { word: 'APPLE', noteIds: ['1:11', '1:13', '1:15', '1:17', '1:19'] },
  { word: 'FISH', noteIds: ['1:21', '1:23', '1:25', '1:27'] },
  { word: 'BIRD', noteIds: ['1:29', '1:31', '1:33', '1:35'] },
  { word: 'HOUSE', noteIds: ['1:37', '1:39', '1:41', '1:43', '1:45'] },
  { word: 'STAR', noteIds: ['1:47', '1:49', '1:55', '1:58'] },
  { word: 'MOON', noteIds: ['1:62', '1:66', '1:73', '1:75'] },
  { word: 'TREE', noteIds: ['1:80', '1:84', '1:91', '1:94'] },
  { word: 'SUN', noteIds: ['1:98', '1:101', '1:105'] },
] as const;

export interface TypingTarget {
  readonly noteId: string;
  readonly letter: string;
  readonly time: number;
  readonly wordIndex: number;
  readonly index: number;
}

export function buildTypingChart(timeline: PianoTimeline,
  definition: readonly { word: string; noteIds: readonly string[] }[] = PIANO_CHART,
): TypingTarget[] {
  const notes = new Map(timeline.notes.map(note => [note.id, note]));
  const targets: TypingTarget[] = [];
  for (const [wordIndex, group] of definition.entries()) {
    if (!/^[A-Z]+$/i.test(group.word) || group.word.length !== group.noteIds.length) {
      throw new Error(`Invalid typing chart: letter count for ${group.word}.`);
    }
    group.noteIds.forEach((noteId, letterIndex) => {
      const note = notes.get(noteId);
      if (!note) throw new Error(`Invalid typing chart: missing note ${noteId}.`);
      if (targets.length && note.start <= targets[targets.length - 1].time) {
        throw new Error('Invalid typing chart: attacks must be strictly increasing.');
      }
      targets.push({ noteId, letter: group.word[letterIndex].toUpperCase(), time: note.start, wordIndex, index: targets.length });
    });
  }
  if (!targets.length) throw new Error('Invalid typing chart: no attacks.');
  return targets;
}
