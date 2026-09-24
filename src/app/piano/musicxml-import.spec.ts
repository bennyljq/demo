import { BasicMIDI } from 'spessasynth_core';
import { importMusicXml } from './musicxml-import';
import { readMxlRootfile } from './mxl-container';

describe('four-measure MusicXML import', () => {
  let xml: string;
  beforeAll(async () => {
    const response = await fetch('/assets/piano/how-to-piano-poc.musicxml');
    expect(response.ok).toBeTrue();
    xml = await response.text();
  });

  it('aligns treble, bass and a chord while the rest advances time', () => {
    const score = importMusicXml(xml);
    expect(score.measureCount).toBe(4);
    expect(score.writtenNotes.length).toBe(22);
    expect(score.soundingNotes.length).toBe(20);
    expect(score.timeline.tracks.map(group => group.name)).toEqual(['Staff 1, voice 1', 'Staff 2, voice 2']);
    const atZero = score.soundingNotes.filter(note => note.start === 0);
    expect(atZero.map(note => note.pitch).sort((a, b) => a - b)).toEqual([48, 52, 72]);
    expect(score.writtenNotes.find(note => note.measure === '2' && note.pitch === null)?.onsetQuarter).toBe(6);
    expect(score.soundingNotes.find(note => note.id === 'P1:2:2')?.start).toBe(3.5);
  });

  it('keeps both written tie identities but sounds one sustained attack', () => {
    const score = importMusicXml(xml);
    const tied = score.soundingNotes.find(note => note.id === 'P1:2:2');
    expect(tied.sourceNoteIds).toEqual(['P1:2:2', 'P1:3:0']);
    expect(tied.durationQuarter).toBe(2);
    expect(tied.duration).toBeCloseTo(1.1666667, 5);
    expect(score.soundingNotes.filter(note => note.pitch === 81).length).toBe(1);
  });

  it('converts explicit tempo and dynamic units into sequencer events', () => {
    const score = importMusicXml(xml);
    expect(score.tempos).toEqual([{ quarter: 0, value: 120 }, { quarter: 8, value: 90 }]);
    expect(score.dynamics).toEqual([{ quarter: 0, value: 72 }, { quarter: 8, value: 108 }]);
    expect(score.measures.map(measure => measure.start)).toEqual([0, 2, 4, 4 + 4 * 60 / 90]);
    expect(score.annotations.find(mark => mark.kind === 'tempo' && mark.label === '90 BPM')?.start).toBe(4);
    expect(score.annotations.find(mark => mark.kind === 'dynamic' && mark.label === 'f')?.start).toBe(4);
    const later = score.soundingNotes.find(note => note.id === 'P1:3:1');
    expect(later.start).toBeCloseTo(4.6666667, 5);
    expect(later.velocity).toBe(108);
    const midi = BasicMIDI.fromArrayBuffer(score.midi);
    expect(midi.tracks.length).toBe(3); // Conductor plus two score groups.
    expect(midi.tempoChanges.some(event => Math.abs(event.tempo - 90) < 0.001)).toBeTrue();
    expect(midi.getNoteTimes().flat().length).toBe(20);
  });

  it('rejects broken navigation and unpaired wedges explicitly', () => {
    expect(() => importMusicXml(xml.replace('<measure number="1">', '<measure number="1"><barline><repeat direction="backward"/></barline>')))
      .toThrowError(/backward repeat.*no start/);
    expect(() => importMusicXml(xml.replace('</attributes>', '</attributes><direction><direction-type><wedge type="crescendo"/></direction-type></direction>')))
      .toThrowError(/wedge has no stop/);
  });

  it('fits added grace notes inside the principal without moving barlines or the bass', () => {
    const grace = '<note><grace/><pitch><step>B</step><octave>4</octave></pitch><voice>1</voice><staff>1</staff></note>';
    const modified = xml.replace('<note><pitch><step>C</step><octave>5</octave></pitch>', `${grace}<note><pitch><step>C</step><octave>5</octave></pitch>`);
    const score = importMusicXml(modified);
    const original = importMusicXml(xml);
    expect(score.measures.map(measure => measure.start)).toEqual(original.measures.map(measure => measure.start));
    expect(score.timeline.tracks.find(track => track.name === 'Staff 2, voice 2')?.notes.map(note => note.start))
      .toEqual(original.timeline.tracks.find(track => track.name === 'Staff 2, voice 2')?.notes.map(note => note.start));
    expect(score.soundingNotes.find(note => note.id === 'P1:1:0')?.duration).toBeGreaterThan(0);
    expect(score.soundingNotes.find(note => note.id === 'P1:1:1')?.start).toBeGreaterThan(0);
  });

  it('honours explicit grace make-time across both staves and later measures', () => {
    const grace = '<note><grace make-time="120"/><pitch><step>B</step><octave>4</octave></pitch><voice>1</voice><staff>1</staff></note>';
    const modified = xml.replace('<note><pitch><step>C</step><octave>5</octave></pitch>', `${grace}<note><pitch><step>C</step><octave>5</octave></pitch>`);
    const score = importMusicXml(modified);
    const original = importMusicXml(xml);
    expect(score.measures[1].start - original.measures[1].start).toBeCloseTo(0.125, 6);
    expect(score.timeline.tracks.find(track => track.name === 'Staff 2, voice 2')?.notes[0].start).toBeCloseTo(0.125, 6);
    expect(score.soundingNotes.find(note => note.id === 'P1:1:0')?.start).toBe(0);
  });
});

describe('supplied compressed Turkish March', () => {
  let score: ReturnType<typeof importMusicXml>;
  let sourceXml: string;
  beforeAll(async () => {
    const response = await fetch('/assets/piano/tracks/WA_Mozart_Marche_Turque_Turkish_March_fingered.mxl');
    expect(response.ok).toBeTrue();
    sourceXml = await readMxlRootfile(await response.arrayBuffer());
    expect(sourceXml).toContain('<score-partwise'); // Rootfile is score.xml, not the first ZIP entry.
    score = importMusicXml(sourceXml);
  });

  it('counts source note elements including rests and grace notes separately', () => {
    const doc = new DOMParser().parseFromString(sourceXml, 'application/xml');
    expect(doc.getElementsByTagName('note').length).toBe(1651);
    expect(doc.getElementsByTagName('rest').length).toBe(36);
    expect(doc.getElementsByTagName('grace').length).toBe(189);
    expect(doc.getElementsByTagName('arpeggiate').length).toBe(24);
    expect(score.writtenNotes.some(note => note.fingerings.length > 0)).toBeTrue();
  });

  it('retains source measures and traverses repeats and first/second endings', () => {
    expect(score.measureCount).toBe(137);
    expect(score.measures.length).toBe(241);
    expect(score.measures.filter(measure => measure.number === '0').map(measure => measure.occurrence)).toEqual([1, 2]);
    expect(score.measures.filter(measure => measure.number === '104').length).toBe(1);
    expect(score.measures.filter(measure => measure.number === '105').length).toBe(1);
    expect(score.measures.at(-1)?.number).toBe('136');
  });

  it('keeps grace notes, barlines, dynamics and wedges aligned to the performance clock', () => {
    expect(score.writtenNotes.filter(note => note.grace).length).toBeGreaterThan(189);
    expect(score.soundingNotes.filter(note => note.sourceNoteIds.some(id => score.writtenNotes.find(n => n.id === id)?.grace)).length).toBeGreaterThan(189);
    expect(score.annotations.some(mark => mark.kind === 'wedge' && mark.measure === '38' && mark.end! > mark.start)).toBeTrue();
    expect(score.annotations.some(mark => mark.kind === 'dynamic' && mark.label === 'p')).toBeTrue();
    expect(score.measures.every((measure, index) => !index || measure.start > score.measures[index - 1].start)).toBeTrue();
    expect(score.duration).toBeGreaterThan(200);
    expect(BasicMIDI.fromArrayBuffer(score.midi).getNoteTimes().flat().length).toBe(score.soundingNotes.length);
  });

  it('spreads a marked arpeggio without moving its following barline', () => {
    const marked = score.writtenNotes.filter(note => note.arpeggiate && note.pitch !== null);
    const group = score.writtenNotes.filter(note => note.pitch !== null && note.measure === marked[0].measure &&
      note.onsetQuarter === marked[0].onsetQuarter && note.staff === marked[0].staff);
    expect(group.length).toBeGreaterThan(1);
    const attacks = group.map(note => score.soundingNotes.find(attack => attack.id === note.id)!).sort((a, b) => a.pitch - b.pitch);
    expect(attacks.every((attack, index) => !index || attack.start > attacks[index - 1].start)).toBeTrue();
    const nextMeasure = score.measures.find(measure => measure.start > attacks[0].start)!;
    expect(attacks.at(-1)!.start).toBeLessThan(nextMeasure.start);
  });
});
