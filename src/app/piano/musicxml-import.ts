import { MIDIBuilder } from 'spessasynth_core';
import type { PianoNote, PianoTimeline, PianoTrack } from './piano-timeline';

export interface WrittenNote {
  readonly id: string;
  readonly part: string;
  readonly staff: number;
  readonly voice: string;
  readonly measure: string;
  readonly sourceMeasureIndex: number;
  readonly pitch: number | null;
  readonly spelling: string | null;
  readonly writtenType?: string;
  readonly dots: number;
  readonly accidental?: string;
  readonly fingerings: readonly string[];
  readonly onsetQuarter: number;
  readonly durationQuarter: number;
  readonly tieStart: boolean;
  readonly tieStop: boolean;
  readonly grace: boolean;
  readonly arpeggiate: boolean;
  readonly notation: readonly string[];
}
export interface ScoreEvent { readonly quarter: number; readonly value: number; }
export interface SoundingNote {
  readonly id: string;
  readonly sourceNoteIds: readonly string[];
  readonly part: string;
  readonly staff: number;
  readonly voice: string;
  readonly pitch: number;
  readonly onsetQuarter: number;
  readonly durationQuarter: number;
  readonly start: number;
  readonly duration: number;
  readonly velocity: number;
}
export interface ScoreMeasure {
  readonly id: string;
  readonly sourceIndex: number;
  readonly number: string;
  readonly occurrence: number;
  readonly quarter: number;
  readonly durationQuarter: number;
  readonly start: number;
  readonly meterBeats: number;
  readonly meterBeatType: number;
}
export interface ScoreAnnotation {
  readonly id: string;
  readonly kind: 'dynamic' | 'tempo' | 'text' | 'clef' | 'wedge';
  readonly part: string;
  readonly staff: number;
  readonly label: string;
  readonly quarter: number;
  readonly start: number;
  readonly end?: number;
  readonly measure: string;
}
export interface ImportedScore {
  readonly part: string;
  readonly measureCount: number;
  readonly writtenNotes: readonly WrittenNote[];
  readonly soundingNotes: readonly SoundingNote[];
  readonly measures: readonly ScoreMeasure[];
  readonly annotations: readonly ScoreAnnotation[];
  readonly tempos: readonly ScoreEvent[];
  readonly dynamics: readonly ScoreEvent[];
  readonly duration: number;
  readonly timeline: PianoTimeline;
  readonly midi: ArrayBuffer;
}

interface SourceNote extends Omit<WrittenNote, 'onsetQuarter' | 'id'> {
  readonly localQuarter: number;
  readonly chord: boolean;
  readonly graceAttributes?: { previous?: number; following?: number; make?: number };
  readonly localIndex: number;
}
interface SourceDirection {
  readonly localQuarter: number;
  readonly staff: number;
  readonly kind: ScoreAnnotation['kind'] | 'pedal';
  readonly label: string;
  readonly value?: number;
  readonly wedgeNumber?: string;
  readonly wedgeType?: string;
}
interface SourceMeasure {
  readonly number: string;
  readonly index: number;
  readonly notes: SourceNote[];
  readonly directions: SourceDirection[];
  readonly duration: number;
  readonly meterBeats: number;
  readonly meterBeatType: number;
  readonly forward: boolean;
  readonly backward: boolean;
  readonly repeatTimes: number;
  readonly ending?: string;
}
interface PerformedNote { note: WrittenNote; onset: number; end: number; chord: boolean; graceAttributes?: SourceNote['graceAttributes']; }

const child = (element: Element, name: string): Element | undefined =>
  Array.from(element.children).find(node => node.localName === name);
const children = (element: Element, name: string): Element[] =>
  Array.from(element.children).filter(node => node.localName === name);
const value = (element: Element, name: string): string | undefined => child(element, name)?.textContent?.trim();
const fail = (message: string): never => { throw new Error(`MusicXML: ${message}`); };
const number = (text: string | null | undefined, label: string): number => {
  const result = Number(text);
  if (text == null || text === '' || !Number.isFinite(result)) fail(`${label} must be numeric.`);
  return result;
};
const positive = (text: string | null | undefined, label: string): number => {
  const result = number(text, label);
  if (result <= 0) fail(`${label} must be positive.`);
  return result;
};
const staffNumber = (element: Element): number => value(element, 'staff') ? positive(value(element, 'staff'), 'staff') : 1;
const clampVelocity = (velocity: number): number => Math.max(1, Math.min(127, Math.round(velocity)));
// MusicXML sound dynamics is percent of forte (MIDI velocity 90). Written-only marks
// use a fixed estimate, not a claim about how a pianist would interpret the score.
export const WRITTEN_DYNAMICS: Readonly<Record<string, number>> = {
  ppp: 32, pp: 40, p: 49, mp: 64, mf: 80, f: 96, ff: 112, fff: 120,
};

function parseMeasure(measure: Element, index: number, state: { divisions: number; expected: number; meterBeats: number; meterBeatType: number }): SourceMeasure {
  const numberLabel = measure.getAttribute('number') || String(index + 1);
  const notes: SourceNote[] = [];
  const directions: SourceDirection[] = [];
  let cursor = 0;
  let maximum = 0;
  let lastNoteStart = 0;
  let forward = false;
  let backward = false;
  let repeatTimes = 2;
  let ending: string | undefined;
  const notationOnly = new Set(['slur', 'articulations', 'technical', 'ornaments', 'fermata', 'tied', 'tuplet']);
  for (const item of Array.from(measure.children)) {
    switch (item.localName) {
      case 'attributes': {
        if (value(item, 'divisions')) state.divisions = positive(value(item, 'divisions'), 'divisions');
        const time = child(item, 'time');
        if (time) {
          state.meterBeats = positive(value(time, 'beats'), 'beats');
          state.meterBeatType = positive(value(time, 'beat-type'), 'beat-type');
          state.expected = state.meterBeats * 4 / state.meterBeatType;
        }
        for (const clef of children(item, 'clef')) {
          const staff = clef.hasAttribute('number') ? positive(clef.getAttribute('number'), 'clef staff') : 1;
          const sign = value(clef, 'sign');
          const label = sign === 'G' ? 'Treble clef' : sign === 'F' ? 'Bass clef' : sign === 'C' ? 'Alto clef' : `${sign || '?'} clef`;
          directions.push({ localQuarter: cursor, staff, kind: 'clef', label });
        }
        break;
      }
      case 'direction': {
        if (!state.divisions) fail(`measure ${numberLabel} has direction before divisions.`);
        const offset = value(item, 'offset') ? number(value(item, 'offset'), 'direction offset') / state.divisions : 0;
        const at = cursor + offset;
        const staff = staffNumber(item);
        for (const type of children(item, 'direction-type')) for (const mark of Array.from(type.children)) {
          if (mark.localName === 'dynamics') {
            const symbol = mark.firstElementChild?.localName;
            if (symbol) directions.push({ localQuarter: at, staff, kind: 'dynamic', label: symbol });
          } else if (mark.localName === 'wedge') {
            directions.push({ localQuarter: at, staff, kind: 'wedge', label: mark.getAttribute('type') || '',
              wedgeNumber: mark.getAttribute('number') || '1', wedgeType: mark.getAttribute('type') || '' });
          } else if (mark.localName === 'words' || mark.localName === 'rehearsal') {
            const label = mark.textContent?.trim();
            if (label) directions.push({ localQuarter: at, staff, kind: 'text', label });
          } else if (mark.localName === 'metronome') {
            const unit = value(mark, 'beat-unit');
            const bpm = positive(value(mark, 'per-minute'), 'metronome tempo');
            const quarters: Record<string, number> = { whole: 4, half: 2, quarter: 1, eighth: 0.5, '16th': 0.25 };
            if (!unit || quarters[unit] === undefined) fail(`unsupported metronome unit ${unit} in measure ${numberLabel}.`);
            const quarterBpm = bpm * quarters[unit] * (children(mark, 'beat-unit-dot').length ? 1.5 : 1);
            directions.push({ localQuarter: at, staff, kind: 'tempo', label: `${quarterBpm} BPM`, value: quarterBpm });
          } else if (mark.localName === 'pedal') {
            const type = mark.getAttribute('type');
            if (type !== 'start' && type !== 'stop') fail(`unsupported pedal ${type} in measure ${numberLabel}.`);
            directions.push({ localQuarter: at, staff, kind: 'pedal', label: '', value: type === 'start' ? 127 : 0 });
          } else if (mark.localName === 'octave-shift') {
            const type = mark.getAttribute('type'), size = mark.getAttribute('size');
            if (!['up', 'down', 'stop'].includes(type || '') || size !== '8') fail(`unsupported octave shift in measure ${numberLabel}.`);
            // MusicXML pitch values are the sounding pitch; this is engraving only.
          } else fail(`unsupported direction ${mark.localName} in measure ${numberLabel}.`);
        }
        const sound = child(item, 'sound');
        if (sound) addSound(sound, at, staff, directions, numberLabel);
        break;
      }
      case 'sound': addSound(item, cursor, 1, directions, numberLabel); break;
      case 'backup': cursor -= positive(value(item, 'duration'), 'backup duration') / state.divisions;
        if (cursor < -1e-8) fail(`backup moves before measure ${numberLabel}.`);
        break;
      case 'forward': cursor += positive(value(item, 'duration'), 'forward duration') / state.divisions;
        maximum = Math.max(maximum, cursor); break;
      case 'note': {
        if (!state.divisions) fail(`measure ${numberLabel} has notes before divisions.`);
        const grace = child(item, 'grace');
        const duration = grace ? 0 : positive(value(item, 'duration'), 'note duration') / state.divisions;
        const chord = !!child(item, 'chord');
        const start = chord ? lastNoteStart : cursor;
        if (!chord) lastNoteStart = start;
        const pitchNode = child(item, 'pitch');
        const rest = !!child(item, 'rest');
        if (rest === !!pitchNode) fail(`note in measure ${numberLabel} needs exactly one pitch or rest.`);
        let pitch: number | null = null;
        let spelling: string | null = null;
        if (pitchNode) {
          const steps: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
          const stepName = value(pitchNode, 'step') || '';
          const alter = value(pitchNode, 'alter') ? number(value(pitchNode, 'alter'), 'pitch alteration') : 0;
          const octave = number(value(pitchNode, 'octave'), 'pitch octave');
          if (steps[stepName] === undefined || !Number.isInteger(alter) || !Number.isInteger(octave)) fail(`unsupported pitch in measure ${numberLabel}.`);
          pitch = (octave + 1) * 12 + steps[stepName] + alter;
          if (pitch < 0 || pitch > 127) fail(`pitch outside MIDI range in measure ${numberLabel}.`);
          spelling = `${stepName}${alter === 1 ? '♯' : alter === -1 ? '♭' : alter ? `(${alter})` : ''}${octave}`;
        }
        const ties = children(item, 'tie').map(tie => tie.getAttribute('type'));
        if (ties.some(tie => tie !== 'start' && tie !== 'stop')) fail(`invalid tie in measure ${numberLabel}.`);
        const notationNodes = children(item, 'notations').flatMap(node => Array.from(node.children));
        const notation = notationNodes.map(mark => mark.localName);
        for (const mark of notation) if (mark !== 'arpeggiate' && !notationOnly.has(mark)) fail(`unsupported note notation ${mark} in measure ${numberLabel}.`);
        const fingerings = notationNodes.filter(mark => mark.localName === 'technical')
          .flatMap(mark => children(mark, 'fingering').map(finger => finger.textContent?.trim() || '').filter(Boolean));
        const graceAttributes = grace ? {
          previous: grace.hasAttribute('steal-time-previous') ? number(grace.getAttribute('steal-time-previous'), 'grace previous percent') : undefined,
          following: grace.hasAttribute('steal-time-following') ? number(grace.getAttribute('steal-time-following'), 'grace following percent') : undefined,
          make: grace.hasAttribute('make-time') ? number(grace.getAttribute('make-time'), 'grace make-time') / state.divisions : undefined,
        } : undefined;
        if (graceAttributes && Object.values(graceAttributes).some(v => v !== undefined && v < 0)) fail(`negative grace timing in measure ${numberLabel}.`);
        notes.push({ part: measure.parentElement?.getAttribute('id') || 'P1', staff: staffNumber(item), voice: value(item, 'voice') || '1',
          measure: numberLabel, sourceMeasureIndex: index, localQuarter: start, durationQuarter: duration,
          pitch, spelling, writtenType: value(item, 'type'), dots: children(item, 'dot').length,
          accidental: value(item, 'accidental'), fingerings,
          tieStart: ties.includes('start'), tieStop: ties.includes('stop'), grace: !!grace,
          arpeggiate: notation.includes('arpeggiate'), notation, chord, graceAttributes, localIndex: notes.length });
        if (!chord && !grace) cursor += duration;
        maximum = Math.max(maximum, start + duration, cursor);
        break;
      }
      case 'barline': {
        for (const repeat of children(item, 'repeat')) {
          const direction = repeat.getAttribute('direction');
          if (direction === 'forward') forward = true;
          else if (direction === 'backward') {
            backward = true;
            repeatTimes = repeat.hasAttribute('times') ? positive(repeat.getAttribute('times'), 'repeat times') : 2;
          } else fail(`unsupported repeat in measure ${numberLabel}.`);
        }
        for (const mark of children(item, 'ending')) {
          if (mark.getAttribute('type') === 'start') ending = mark.getAttribute('number') || undefined;
          else if (!['stop', 'discontinue'].includes(mark.getAttribute('type') || '')) fail(`invalid ending in measure ${numberLabel}.`);
        }
        break;
      }
      case 'print': break;
      default: fail(`unsupported measure element ${item.localName} in measure ${numberLabel}.`);
    }
  }
  if (!state.divisions || !Number.isFinite(maximum) || maximum <= 0) fail(`invalid timing in measure ${numberLabel}.`);
  // The Liebestraum cadenza has measured notation inside bars longer than 6/4.
  // Its actual note/forward duration, rather than a fabricated regular bar, wins.
  if (maximum < state.expected - 1e-7 && index !== 0 && !forward && !backward && !ending && measure.getAttribute('implicit') !== 'yes') {
    fail(`measure ${numberLabel} is underfull without a pickup or repeat boundary.`);
  }
  // make-time creates real score time, unlike grace notes that steal from a
  // neighbour. Insert it for every staff at the grace anchor, so both hands
  // and all later measure boundaries remain aligned.
  const insertions = new Map<number, number>();
  for (const note of notes) if (note.graceAttributes?.make) {
    insertions.set(note.localQuarter, Math.max(insertions.get(note.localQuarter) || 0, note.graceAttributes.make));
  }
  let inserted = 0;
  let adjustedNotes = notes;
  let adjustedDirections = directions;
  for (const [at, extra] of [...insertions].sort((a, b) => a[0] - b[0])) {
    const shiftedAt = at + inserted;
    adjustedNotes = adjustedNotes.map(note => ({ ...note, localQuarter: note.localQuarter > shiftedAt ||
      note.localQuarter === shiftedAt && !note.grace ? note.localQuarter + extra : note.localQuarter }));
    adjustedDirections = adjustedDirections.map(direction => ({ ...direction,
      localQuarter: direction.localQuarter > shiftedAt ? direction.localQuarter + extra : direction.localQuarter }));
    inserted += extra;
  }
  return { number: numberLabel, index, notes: adjustedNotes, directions: adjustedDirections,
    duration: maximum + inserted, meterBeats: state.meterBeats, meterBeatType: state.meterBeatType,
    forward, backward, repeatTimes, ending };
}

function addSound(sound: Element, localQuarter: number, staff: number, directions: SourceDirection[], measure: string): void {
  for (const attribute of Array.from(sound.attributes)) {
    if (!['tempo', 'dynamics'].includes(attribute.name)) fail(`unsupported sound ${attribute.name} in measure ${measure}.`);
  }
  if (sound.hasAttribute('tempo')) directions.push({ localQuarter, staff, kind: 'tempo',
    label: `${positive(sound.getAttribute('tempo'), 'tempo')} BPM`, value: positive(sound.getAttribute('tempo'), 'tempo') });
  if (sound.hasAttribute('dynamics')) {
    const percent = number(sound.getAttribute('dynamics'), 'dynamics');
    if (percent < 0) fail(`negative dynamics in measure ${measure}.`);
    directions.push({ localQuarter, staff, kind: 'dynamic', label: '', value: clampVelocity(90 * percent / 100) });
  }
}

/** The supplied score uses non-nested repeats; first ending 104 is skipped on pass 2. */
function traversal(measures: readonly SourceMeasure[]): number[] {
  const order: number[] = [];
  let forward: number | undefined;
  for (const measure of measures) {
    if (measure.forward) {
      if (forward !== undefined) fail(`nested repeat at measure ${measure.number} is unsupported.`);
      forward = measure.index;
    }
    order.push(measure.index);
    if (measure.backward) {
      if (forward === undefined) fail(`backward repeat at measure ${measure.number} has no start.`);
      if (!Number.isInteger(measure.repeatTimes) || measure.repeatTimes > 8) fail(`invalid repeat count in measure ${measure.number}.`);
      const firstEnding = measures.slice(forward, measure.index + 1).find(item => item.ending?.split(',').includes('1'))?.index;
      if (firstEnding !== undefined && firstEnding !== measure.index) fail(`complex first ending near measure ${measure.number} is unsupported.`);
      const end = firstEnding === undefined ? measure.index : firstEnding - 1;
      for (let pass = 1; pass < measure.repeatTimes; pass++) {
        for (let index = forward; index <= end; index++) order.push(index);
      }
      forward = undefined;
    }
  }
  if (forward !== undefined) fail(`repeat at measure ${measures[forward].number} has no end.`);
  for (const measure of measures) if (measure.ending && !['1', '2'].includes(measure.ending)) fail(`unsupported ending ${measure.ending}.`);
  if (order.length > 1000) fail('score traversal is too long.');
  return order;
}

function secondsConverter(tempos: readonly ScoreEvent[]): (quarter: number) => number {
  return quarter => {
    let seconds = 0;
    for (const [index, event] of tempos.entries()) {
      if (event.quarter >= quarter) break;
      seconds += (Math.min(quarter, tempos[index + 1]?.quarter ?? quarter) - event.quarter) * 60 / event.value;
    }
    return seconds;
  };
}

export function importMusicXml(xml: string): ImportedScore {
  const doc = new DOMParser().parseFromString(xml, 'application/xml');
  if (doc.getElementsByTagName('parsererror').length) fail('invalid XML document.');
  const root = doc.documentElement;
  if (root.localName !== 'score-partwise') fail(`unsupported root ${root.localName}.`);
  const parts = children(root, 'part');
  if (parts.length !== 1) fail('this piano importer needs exactly one part.');
  const part = parts[0];
  const partId = part.getAttribute('id') || 'P1';
  const sourceElements = children(part, 'measure');
  if (!sourceElements.length) fail('score has no measures.');
  const state = { divisions: 0, expected: 4, meterBeats: 4, meterBeatType: 4 };
  const source = sourceElements.map((measure, index) => parseMeasure(measure, index, state));
  const order = traversal(source);
  const written: WrittenNote[] = [];
  const performed: PerformedNote[] = [];
  const rawAnnotations: Omit<ScoreAnnotation, 'start' | 'end'>[] = [];
  const rawWedges: { annotation: Omit<ScoreAnnotation, 'start' | 'end'>; number: string; type: string }[] = [];
  const tempos: ScoreEvent[] = [];
  const dynamics: ScoreEvent[] = [];
  const pedals: { quarter: number; staff: number; value: number }[] = [];
  const visits: Omit<ScoreMeasure, 'start'>[] = [];
  const counts = new Map<number, number>();
  let quarter = 0;
  for (const sourceIndex of order) {
    const measure = source[sourceIndex];
    const occurrence = (counts.get(sourceIndex) || 0) + 1;
    counts.set(sourceIndex, occurrence);
    const visitId = `${partId}:${sourceIndex + 1}:${occurrence}`;
    visits.push({ id: visitId, sourceIndex, number: measure.number, occurrence, quarter, durationQuarter: measure.duration,
      meterBeats: measure.meterBeats, meterBeatType: measure.meterBeatType });
    for (const note of measure.notes) {
      const id = `${partId}:${sourceIndex + 1}:${note.localIndex}${occurrence === 1 ? '' : `:${occurrence}`}`;
      const at = quarter + note.localQuarter;
      const writtenNote: WrittenNote = { id, part: note.part, staff: note.staff, voice: note.voice, measure: note.measure,
        sourceMeasureIndex: sourceIndex, pitch: note.pitch, spelling: note.spelling,
        writtenType: note.writtenType, dots: note.dots, accidental: note.accidental, fingerings: note.fingerings,
        onsetQuarter: at,
        durationQuarter: note.durationQuarter, tieStart: note.tieStart, tieStop: note.tieStop, grace: note.grace,
        arpeggiate: note.arpeggiate, notation: note.notation };
      written.push(writtenNote);
      if (writtenNote.pitch !== null) performed.push({ note: writtenNote, onset: at, end: at + note.durationQuarter,
        chord: note.chord, graceAttributes: note.graceAttributes });
    }
    for (const [index, direction] of measure.directions.entries()) {
      const at = quarter + direction.localQuarter;
      if (direction.kind === 'pedal') {
        pedals.push({ quarter: at, staff: direction.staff, value: direction.value! });
        continue;
      }
      const annotation = { id: `${visitId}:direction:${index}`, kind: direction.kind, part: partId,
        staff: direction.staff, label: direction.label, quarter: at, measure: measure.number };
      if (direction.kind === 'wedge') rawWedges.push({ annotation, number: direction.wedgeNumber || '1', type: direction.wedgeType || '' });
      else if (direction.label) rawAnnotations.push(annotation);
      if (direction.kind === 'tempo' && direction.value !== undefined) tempos.push({ quarter: at, value: direction.value });
      if (direction.kind === 'dynamic') {
        const hasNumericAtSamePosition = measure.directions.some(other => other.kind === 'dynamic' && other.value !== undefined &&
          other.localQuarter === direction.localQuarter && other.staff === direction.staff);
        const velocity = direction.value ?? (hasNumericAtSamePosition ? undefined : WRITTEN_DYNAMICS[direction.label]);
        if (velocity !== undefined) dynamics.push({ quarter: at, value: velocity });
      }
    }
    quarter += measure.duration;
  }
  if (!tempos.some(event => event.quarter === 0)) tempos.unshift({ quarter: 0, value: 120 });
  if (!dynamics.some(event => event.quarter === 0)) dynamics.unshift({ quarter: 0, value: 90 });
  tempos.sort((a, b) => a.quarter - b.quarter);
  dynamics.sort((a, b) => a.quarter - b.quarter);
  const toSeconds = secondsConverter(tempos);
  const measures: ScoreMeasure[] = visits.map(visit => ({ ...visit, start: toSeconds(visit.quarter) }));
  const annotations: ScoreAnnotation[] = rawAnnotations.map(annotation => ({ ...annotation, start: toSeconds(annotation.quarter) }));
  const activeWedges = new Map<string, typeof rawWedges[number]>();
  for (const wedge of rawWedges) {
    const key = `${wedge.annotation.part}:${wedge.annotation.staff}:${wedge.number}`;
    if (wedge.type === 'stop') {
      const start = activeWedges.get(key);
      if (!start) fail(`unmatched wedge stop in measure ${wedge.annotation.measure}.`);
      annotations.push({ ...start.annotation, label: start.type, start: toSeconds(start.annotation.quarter),
        end: toSeconds(wedge.annotation.quarter) });
      activeWedges.delete(key);
    } else if (wedge.type === 'crescendo' || wedge.type === 'diminuendo') {
      if (activeWedges.has(key)) fail(`overlapping wedge ${wedge.number} in measure ${wedge.annotation.measure}.`);
      activeWedges.set(key, wedge);
    } else fail(`unsupported wedge ${wedge.type} in measure ${wedge.annotation.measure}.`);
  }
  if (activeWedges.size) fail('wedge has no stop.');

  // Grace notes occupy a bounded slot inside their principal note. No measure
  // length changes or accumulated hand drift. Explicit previous/following
  // percentages select the donor; absent attributes use 25% of the principal,
  // capped at 1/4 quarter. Grace chords share a slot.
  const graceGroups = new Map<string, PerformedNote[]>();
  for (const item of performed.filter(item => item.note.grace)) {
    const key = `${item.note.part}:${item.note.staff}:${item.note.voice}:${item.onset}`;
    if (!graceGroups.has(key)) graceGroups.set(key, []);
    graceGroups.get(key)!.push(item);
  }
  for (const group of graceGroups.values()) {
    const first = group[0];
    const anchor = first.onset;
    const make = first.graceAttributes?.make;
    const principalAt = anchor + (make || 0);
    const principals = performed.filter(item => !item.note.grace && item.note.part === first.note.part &&
      item.note.staff === first.note.staff && item.note.voice === first.note.voice && Math.abs(item.onset - principalAt) < 1e-7);
    if (!principals.length) fail(`grace notes have no principal in measure ${first.note.measure}.`);
    const principalDuration = Math.min(...principals.map(item => item.end - item.onset));
    const attributes = first.graceAttributes;
    const steps = group.filter(item => !item.chord).length;
    if (!steps) fail(`grace group has no first note in measure ${first.note.measure}.`);
    const previous = attributes?.previous;
    const donors = previous === undefined ? [] : performed.filter(item => !item.note.grace && item.note.part === first.note.part &&
      item.note.staff === first.note.staff && item.note.voice === first.note.voice && Math.abs(item.end - anchor) < 1e-7);
    if (previous !== undefined && !donors.length) fail(`grace notes have no previous donor in measure ${first.note.measure}.`);
    const donorDuration = donors.length ? Math.min(...donors.map(item => item.end - item.onset)) : 0;
    const requested = make !== undefined ? make : previous !== undefined ? donorDuration * previous / 100 :
      attributes?.following !== undefined ? principalDuration * attributes.following / 100 : Math.min(0.25, principalDuration * 0.25);
    const slot = make !== undefined ? make : Math.min(Math.max(0.001, requested),
      (previous !== undefined ? donorDuration : principalDuration) * 0.5, 0.5);
    if (make === undefined && previous !== undefined) {
      if (anchor < slot) fail(`grace previous timing falls before score start in measure ${first.note.measure}.`);
      let step = -1;
      for (const item of group) {
        if (!item.chord) step++;
        item.onset = anchor - slot + step * slot / steps;
        item.end = item.onset + slot / steps * 0.9;
      }
      for (const donor of donors) donor.end -= slot;
    } else {
      let step = -1;
      for (const item of group) {
        if (!item.chord) step++;
        item.onset = anchor + step * slot / steps;
        item.end = item.onset + slot / steps * 0.9;
      }
      if (make === undefined) for (const principal of principals) principal.onset += slot;
    }
  }
  // Arpeggiate marked notes low to high, max 0.04 quarter between attacks.
  // Keep the original note ends and following beat positions unchanged.
  const arpeggioKeys = new Set(performed.filter(item => item.note.arpeggiate && !item.note.grace)
    .map(item => `${item.note.part}:${item.note.staff}:${item.onset}`));
  const arpeggios = new Map<string, PerformedNote[]>();
  for (const item of performed.filter(item => !item.note.grace)) {
    const key = `${item.note.part}:${item.note.staff}:${item.onset}`;
    if (!arpeggioKeys.has(key)) continue;
    if (!arpeggios.has(key)) arpeggios.set(key, []);
    arpeggios.get(key)!.push(item);
  }
  for (const chord of arpeggios.values()) {
    chord.sort((a, b) => a.note.pitch! - b.note.pitch!);
    const shortest = Math.min(...chord.map(item => item.end - item.onset));
    const spread = Math.min(0.04, shortest * 0.35 / Math.max(1, chord.length - 1));
    chord.forEach((item, index) => { item.onset += index * spread; });
  }
  const tied = new Map<string, { ids: string[]; item: PerformedNote; end: number }>();
  const attacks: { ids: string[]; item: PerformedNote; end: number }[] = [];
  for (const item of performed) {
    const note = item.note;
    const key = `${note.part}:${note.staff}:${note.voice}:${note.pitch}`;
    if (note.tieStop) {
      const previous = tied.get(key);
      if (!previous || Math.abs(previous.end - item.onset) > 1e-6) fail(`unmatched tie at ${note.id}.`);
      previous.ids.push(note.id);
      previous.end = item.end;
      tied.delete(key);
      if (note.tieStart) tied.set(key, previous);
    } else {
      const attack = { ids: [note.id], item, end: item.end };
      attacks.push(attack);
      if (note.tieStart) tied.set(key, attack);
    }
  }
  if (tied.size) fail('tie has no continuation.');
  const velocityAt = (at: number) => [...dynamics].reverse().find(event => event.quarter <= at)?.value ?? 90;
  const soundingNotes: SoundingNote[] = attacks.map(({ ids, item, end }) => ({
    id: item.note.id, sourceNoteIds: ids, part: item.note.part, staff: item.note.staff, voice: item.note.voice,
    pitch: item.note.pitch!, onsetQuarter: item.onset, durationQuarter: end - item.onset,
    start: toSeconds(item.onset), duration: toSeconds(end) - toSeconds(item.onset), velocity: clampVelocity(velocityAt(item.onset)),
  }));
  if (soundingNotes.some(note => note.duration <= 0 || note.start < 0)) fail('invalid performed note timing.');
  const groups = [...new Set(soundingNotes.map(note => `${note.staff}:${note.voice}`))].sort();
  if (groups.length > 15) fail('too many staff/voice groups for MIDI channels.');
  const tracks: PianoTrack[] = groups.map((group, index) => {
    const notes: PianoNote[] = soundingNotes.filter(note => `${note.staff}:${note.voice}` === group)
      .map(note => ({ id: note.id, trackIndex: index, channel: index, pitch: note.pitch,
        velocity: note.velocity, start: note.start, duration: note.duration }))
      .sort((a, b) => a.start - b.start || a.pitch - b.pitch);
    const [staff, voice] = group.split(':');
    return { index, name: `Staff ${staff}, voice ${voice}`, channels: [index], notes };
  });
  const timeline = { tracks, notes: tracks.flatMap(track => track.notes).sort((a, b) => a.start - b.start || a.pitch - b.pitch) };
  const builder = new MIDIBuilder({ format: 1, timeDivision: 480, initialTempo: tempos[0].value, name: 'Turkish March MusicXML' });
  for (const group of groups) builder.addTrack(group);
  for (const tempo of tempos.slice(1)) builder.setTempo(Math.round(tempo.quarter * 480), tempo.value);
  for (const note of soundingNotes) {
    const track = groups.indexOf(`${note.staff}:${note.voice}`) + 1;
    builder.noteOn(Math.round(note.onsetQuarter * 480), track, track - 1, note.pitch, note.velocity);
    builder.noteOff(Math.round((note.onsetQuarter + note.durationQuarter) * 480), track, track - 1, note.pitch);
  }
  for (const pedal of pedals) groups.forEach((group, index) => {
    if (Number(group.split(':')[0]) === pedal.staff)
      builder.controllerChange(Math.round(pedal.quarter * 480), index + 1, index, 64, pedal.value);
  });
  builder.flush();
  return { part: partId, measureCount: source.length, writtenNotes: written, soundingNotes, measures, annotations,
    tempos, dynamics, duration: toSeconds(quarter), timeline, midi: builder.writeMIDI() };
}
