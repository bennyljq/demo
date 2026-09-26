import type { ImportedScore, SoundingNote } from '../music/musicxml-import';
import type { TypingTarget } from './piano-chart';

export interface CoupledTarget {
  readonly targetId: string;
  readonly targetIndex: number;
  readonly occurrence: number;
  readonly start: number;
  readonly hold: boolean;
  readonly notes: readonly SoundingNote[];
}

/** One chart letter per performed staff-1 attack, including each repeat visit. */
export function coupleStaffMelody(score: ImportedScore, targets: readonly TypingTarget[]): CoupledTarget[] {
  const attacks = new Map<number, SoundingNote[]>();
  for (const note of score.soundingNotes.filter(note => note.staff === 1)) {
    const at = Math.round(note.start * 1e8);
    const group = attacks.get(at) ?? [];
    group.push(note);
    attacks.set(at, group);
  }
  const used = new Set<string>();
  const coupled = targets.map(target => {
    const group = attacks.get(Math.round(target.time * 1e8));
    if (!group?.length || !target.source) throw new Error(`Twinkle target ${target.id} has no staff-1 sounding attack.`);
    const visitIndex = score.measures.findIndex(measure => measure.number === String(target.source!.start.measure) &&
      measure.occurrence === target.source!.occurrence && target.time >= measure.start - 1e-8 &&
      target.time < (score.measures[score.measures.indexOf(measure) + 1]?.start ?? score.duration) - 1e-8);
    const visit = score.measures[visitIndex];
    if (!visit || group.some(note => {
      const prefix = `${score.part}:${visit.sourceIndex + 1}:`;
      if (!note.id.startsWith(prefix)) return true;
      const parts = note.id.slice(prefix.length).split(':');
      return parts.length !== (visit.occurrence === 1 ? 1 : 2) ||
        (visit.occurrence > 1 && Number(parts[1]) !== visit.occurrence);
    })) {
      throw new Error(`Twinkle target ${target.id} does not match its performed source visit.`);
    }
    if (target.holdEnd !== undefined && group.some(note => Math.abs(note.start + note.duration - target.holdEnd!) > 1e-7))
      throw new Error(`Twinkle hold ${target.id} does not end with its sounding note.`);
    for (const note of group) {
      if (used.has(note.id)) throw new Error(`Twinkle sounding note ${note.id} is mapped twice.`);
      used.add(note.id);
    }
    return { targetId: target.id, targetIndex: target.index, occurrence: target.source.occurrence,
      start: target.time, hold: target.holdEnd !== undefined, notes: group };
  });
  const missing = score.soundingNotes.filter(note => note.staff === 1 && !used.has(note.id));
  if (missing.length) throw new Error(`Chart has ${missing.length} unmapped staff-1 sounding attacks, first ${missing[0].id}.`);
  return coupled;
}

export const coupleTwinkleMelody = coupleStaffMelody;
