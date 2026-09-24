import type { ImportedScore } from './musicxml-import';
import type { PianoTimeline } from './piano-timeline';
import { ChartLocation, resolveChartLocation } from './piano-chart-time';
import { TURKISH_CHART } from './turkish-chart';
export { TURKISH_CHART as XML_CHART } from './turkish-chart';

export interface TypingTarget {
  readonly id: string;
  readonly word: string;
  readonly letter: string;
  readonly time: number;
  readonly holdEnd?: number;
  readonly wordIndex: number;
  readonly index: number;
  readonly source?: { readonly start: ChartLocation; readonly end?: ChartLocation; readonly occurrence: number };
}
export interface MidiPhrase { word: string; track: number; groups: readonly number[]; pitches?: Readonly<Record<number, number>> }
export interface XmlLetter { start: ChartLocation; end?: ChartLocation }
export interface XmlPhrase { word: string; letters: readonly XmlLetter[]; occurrence?: number | 'all'; id?: string }

/** Zero-based distinct note-on groups in MIDI track 1; retained for regression checks. */
export const MIDI_CHART: readonly MidiPhrase[] = [
  { word: 'APPLE', track: 1, groups: [5, 6, 7, 8, 9] },
  { word: 'FISH', track: 1, groups: [10, 11, 12, 13] },
  { word: 'BIRD', track: 1, groups: [14, 15, 16, 17] },
  { word: 'HOUSE', track: 1, groups: [18, 19, 20, 21, 22] },
  { word: 'STAR', track: 1, groups: [23, 24, 27, 28] },
  { word: 'MOON', track: 1, groups: [29, 30, 33, 34] },
  { word: 'TREE', track: 1, groups: [35, 36, 39, 40] },
  { word: 'SUN', track: 1, groups: [41, 42, 43] },
];

function validate(targets: TypingTarget[]): TypingTarget[] {
  if (!targets.length) return targets;
  const where = (target: TypingTarget) => target.source
    ? `${target.word} ${target.id} at measure ${target.source.start.measure}, beat ${target.source.start.beat}, occurrence ${target.source.occurrence}`
    : `${target.word} ${target.id}`;
  for (let i = 1; i < targets.length; i++) if (targets[i].time <= targets[i - 1].time + 1e-9)
    throw new Error(`Chart ${where(targets[i])}: starts must be strictly increasing.`);
  for (const hold of targets) if (hold.holdEnd !== undefined)
    for (const other of targets) if (hold !== other && hold.letter === other.letter &&
      other.time > hold.time && other.time < hold.holdEnd)
      throw new Error(`Chart ${where(hold)}: same-key target ${where(other)} overlaps the hold.`);
  return targets;
}

export function buildTypingChart(timeline: PianoTimeline, definition: readonly MidiPhrase[] = MIDI_CHART): TypingTarget[] {
  const targets: TypingTarget[] = [];
  definition.forEach((phrase, wordIndex) => {
    if (!/^[A-Z]+$/i.test(phrase.word) || phrase.word.length !== phrase.groups.length)
      throw new Error(`Chart ${phrase.word}: letter count mismatch.`);
    const notes = timeline.tracks[phrase.track]?.notes;
    if (!notes) throw new Error(`Chart ${phrase.word}: missing track ${phrase.track}.`);
    const times = [...new Set(notes.map(note => note.start))].sort((a, b) => a - b);
    phrase.groups.forEach((group, letterIndex) => {
      const candidates = notes.filter(note => Math.abs(note.start - times[group]) < 1e-7 &&
        (phrase.pitches?.[letterIndex] === undefined || phrase.pitches[letterIndex] === note.pitch));
      if (!candidates.length) throw new Error(`Chart ${phrase.word}: missing track ${phrase.track}, group ${group}.`);
      const high = Math.max(...candidates.map(note => note.pitch));
      const selected = candidates.filter(note => note.pitch === high);
      if (selected.length !== 1) throw new Error(`Chart ${phrase.word}: ambiguous track ${phrase.track}, group ${group}.`);
      targets.push({ id: `midi:${selected[0].id}`, word: phrase.word, letter: phrase.word[letterIndex], time: selected[0].start,
        wordIndex, index: targets.length });
    });
  });
  return validate(targets);
}

export function buildXmlTypingChart(score: ImportedScore, definition: readonly XmlPhrase[] = TURKISH_CHART): TypingTarget[] {
  const phrases = definition.flatMap((phrase, authoredIndex) => {
    const occurrences = phrase.occurrence === 'all'
      ? [...new Set(score.measures.filter(measure => measure.number === String(phrase.letters[0]?.start.measure))
        .map(measure => measure.occurrence))]
      : [phrase.occurrence ?? 1];
    if (!occurrences.length) throw new Error(`Chart ${phrase.word}: no occurrence of measure ${phrase.letters[0]?.start.measure}.`);
    return occurrences.map(occurrence => ({ phrase, occurrence, authoredIndex }));
  });
  const groups = phrases.map(({ phrase, occurrence, authoredIndex }) => {
    if (!/^[A-Z]+$/i.test(phrase.word) || phrase.word.length !== phrase.letters.length)
      throw new Error(`Chart ${phrase.word}: letter count mismatch.`);
    const group = phrase.letters.map((entry, letterIndex) => {
      const id = `xml:${phrase.id ?? authoredIndex}:${occurrence}:${letterIndex}`;
      try {
        const start = resolveChartLocation(score, entry.start, occurrence);
        const end = entry.end ? resolveChartLocation(score, entry.end, occurrence) : undefined;
        if (end && end.time <= start.time) throw new Error(`hold end must follow start at measure ${entry.end!.measure}, beat ${entry.end!.beat}.`);
        return { id, word: phrase.word, letter: phrase.word[letterIndex], time: start.time, holdEnd: end?.time,
          wordIndex: 0, index: 0, source: { start: entry.start, end: entry.end, occurrence } } satisfies TypingTarget;
      } catch (error) {
        throw new Error(`Chart ${phrase.word} letter ${letterIndex + 1} at measure ${entry.start.measure}, beat ${entry.start.beat}, occurrence ${occurrence}: ${error instanceof Error ? error.message : error}`);
      }
    });
    return group;
  });
  groups.sort((a, b) => a[0].time - b[0].time);
  const targets = groups.flatMap((group, wordIndex) => group.map(target => ({ ...target, wordIndex })))
    .map((target, index) => ({ ...target, index }));
  return validate(targets);
}
