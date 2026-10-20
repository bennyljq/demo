import type { ImportedScore } from '../music/musicxml-import';
import type { TypingTarget } from '../gameplay/piano-chart';
import type { CoupledTarget } from '../gameplay/twinkle-coupling';

/** Match the notated principal voice by source attack. Grace slots can shift its sounding time. */
export function coupleNocturneMelody(score: ImportedScore, targets: readonly TypingTarget[]):
  { targets: TypingTarget[]; coupling: CoupledTarget[] } {
  const written = new Map(score.writtenNotes.map(note => [note.id, note]));
  const used = new Set<string>();
  const adjusted = targets.map(target => {
    if (!target.source) throw new Error(`Nocturne target ${target.id} has no source location.`);
    const visit = score.measures.find(measure => measure.number === String(target.source!.start.measure) &&
      measure.occurrence === target.source!.occurrence);
    if (!visit) throw new Error(`Nocturne target ${target.id} has no performed measure.`);
    const quarter = visit.quarter + target.source.start.beat / 2;
    const sourceIds = new Set(score.writtenNotes.filter(note => note.sourceMeasureIndex === visit.sourceIndex &&
      note.staff === 1 && note.voice === '1' && !note.grace && !note.tieStop &&
      Math.abs(note.onsetQuarter - quarter) < 1e-5).map(note => note.id));
    const notes = score.soundingNotes.filter(note => note.staff === 1 && note.voice === '1' &&
      note.sourceNoteIds.some(id => sourceIds.has(id)));
    if (!notes.length) throw new Error(`Nocturne target ${target.id} has no principal sounding attack.`);
    for (const note of notes) {
      if (used.has(note.id)) throw new Error(`Nocturne note ${note.id} is coupled twice.`);
      used.add(note.id);
    }
    if (target.holdEnd !== undefined && notes.some(note => Math.abs(note.start + note.duration - target.holdEnd!) > 1e-6))
      throw new Error(`Nocturne hold ${target.id} does not match its sounding end.`);
    return { ...target, time: Math.min(...notes.map(note => note.start)), notes };
  });
  for (let index = 1; index < adjusted.length; index++)
    if (adjusted[index].time <= adjusted[index - 1].time + 1e-8)
      throw new Error(`Nocturne targets ${adjusted[index - 1].id} and ${adjusted[index].id} overlap.`);
  for (const note of score.soundingNotes.filter(note => note.staff === 1 && note.voice === '1' && !used.has(note.id))) {
    const origin = written.get(note.sourceNoteIds[0]);
    if (!origin) throw new Error(`Nocturne note ${note.id} has no written origin.`);
    const measure = Number(origin.measure);
    const visit = score.measures.find(item => item.sourceIndex === origin.sourceMeasureIndex &&
      item.quarter <= origin.onsetQuarter + 1e-8 && item.quarter + item.durationQuarter > origin.onsetQuarter - 1e-8);
    const offset = origin.onsetQuarter - (visit?.quarter ?? 0);
    const decorative = origin.grace || measure === 12 || measure === 20 ||
      (measure === 33 || measure === 34) && ![0, 1, 2].some(q => Math.abs(offset - q) < 1e-7) ||
      measure === 35 && ![0, 1, 1.5].some(q => Math.abs(offset - q) < 1e-7);
    if (!decorative) throw new Error(`Nocturne principal note ${note.id} was left in backing playback.`);
  }
  return {
    targets: adjusted.map(({ notes: _notes, ...target }) => target),
    coupling: adjusted.map((target, index) => ({ targetId: target.id, targetIndex: index,
      occurrence: target.source!.occurrence, start: target.time, hold: target.holdEnd !== undefined, notes: target.notes })),
  };
}
