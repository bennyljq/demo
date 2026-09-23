import { BasicMIDI, MIDIMessage, MIDIMessageType, MIDITrack } from 'spessasynth_core';
import { extractPianoTimeline } from './piano-timeline';

function midiFile(tracks: number[][][]): ArrayBuffer {
  const midi = new BasicMIDI();
  midi.timeDivision = 480;
  midi.tracks = tracks.map(events => {
    const track = new MIDITrack();
    for (const [ticks, status, ...data] of events) {
      track.pushEvent(new MIDIMessage(ticks, status as MIDIMessageType, new Uint8Array(data)));
    }
    return track;
  });
  midi.flush();
  return midi.writeMIDI();
}

describe('piano note timeline', () => {
  it('uses the global tempo map across a note and keeps chord starts simultaneous', () => {
    const timeline = extractPianoTimeline(midiFile([
      [[0, 0x51, 0x07, 0xa1, 0x20], [480, 0x51, 0x0f, 0x42, 0x40]],
      [[240, 0x90, 60, 100], [240, 0x90, 64, 75], [960, 0x80, 60, 0], [960, 0x80, 64, 0]],
    ]));
    expect(timeline.tracks[0].notes.length).toBe(0);
    expect(timeline.notes.map(note => note.start)).toEqual([0.25, 0.25]);
    expect(timeline.notes.map(note => note.duration)).toEqual([1.25, 1.25]);
    expect(timeline.notes.map(note => note.velocity)).toEqual([100, 75]);
  });

  it('recognises zero-velocity note-offs and ignores sustain for visual durations', () => {
    const timeline = extractPianoTimeline(midiFile([
      [[0, 0x90, 60, 90], [120, 0xb0, 64, 127], [480, 0x90, 60, 0], [960, 0xb0, 64, 0]],
    ]));
    expect(timeline.notes.length).toBe(1);
    expect(timeline.notes[0].duration).toBe(0.5);
  });

  it('keeps repeated pitches, channels, tracks and stable IDs distinct', () => {
    const buffer = midiFile([
      [[0, 0x90, 60, 80], [120, 0x90, 60, 90], [120, 0x91, 60, 70],
        [240, 0x80, 60, 0], [480, 0x80, 60, 0], [720, 0x81, 60, 0]],
      [[0, 0x90, 60, 50], [960, 0x80, 60, 0]],
      [],
    ]);
    const timeline = extractPianoTimeline(buffer);
    expect(timeline.tracks[0].notes.map(note => note.duration)).toEqual([0.25, 0.375, 0.625]);
    expect(timeline.tracks[0].channels).toEqual([0, 1]);
    expect(timeline.tracks[1].notes[0].duration).toBe(1);
    expect(timeline.tracks[2].notes).toEqual([]);
    expect(new Set(timeline.notes.map(note => note.id)).size).toBe(4);
    expect(extractPianoTimeline(buffer)).toEqual(timeline);
  });
});
