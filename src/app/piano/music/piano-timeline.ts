import { BasicMIDI } from 'spessasynth_core';

export interface PianoNote {
  readonly id: string;
  readonly trackIndex: number;
  /** Zero-based MIDI channel (0–15). */
  readonly channel: number;
  readonly pitch: number;
  readonly velocity: number;
  readonly start: number;
  readonly duration: number;
}

export interface PianoTrack {
  readonly index: number;
  readonly name: string;
  readonly channels: readonly number[];
  readonly notes: readonly PianoNote[];
}

export interface PianoTimeline {
  readonly tracks: readonly PianoTrack[];
  readonly notes: readonly PianoNote[];
}

/** Adapt library-parsed events; all binary parsing and tempo conversion stay in SpessaSynth. */
export function extractPianoTimeline(buffer: ArrayBuffer): PianoTimeline {
  const midi = BasicMIDI.fromArrayBuffer(buffer, 'marche-turque.mid');
  const tracks = midi.tracks.map((track, trackIndex): PianoTrack => {
    const notes: PianoNote[] = [];
    const pending = new Map<number, Omit<PianoNote, 'duration'>[]>();
    track.events.forEach((event, eventIndex) => {
      const kind = event.statusByte & 0xf0;
      if (kind !== 0x90 && kind !== 0x80) return;
      const channel = event.statusByte & 0x0f;
      const [pitch, velocity] = event.data;
      const key = channel * 128 + pitch;
      const time = midi.midiTicksToSeconds(event.ticks);
      if (kind === 0x90 && velocity > 0) {
        const queue = pending.get(key) ?? [];
        queue.push({ id: `${trackIndex}:${eventIndex}`, trackIndex, channel, pitch, velocity, start: time });
        pending.set(key, queue);
      } else {
        // Zero-velocity note-on is note-off. FIFO pairs overlapping same-pitch
        // notes without overwriting their starts; channels and tracks stay separate.
        const start = pending.get(key)?.shift();
        if (start) notes.push({ ...start, duration: Math.max(0, time - start.start) });
      }
    });
    // Unmatched note-offs are ignored; unmatched starts have no defined note-off
    // duration and are omitted. Controllers (including sustain) do not extend bars.
    notes.sort((a, b) => a.start - b.start || a.pitch - b.pitch);
    return {
      index: trackIndex,
      name: track.name.trim(),
      channels: [...new Set(notes.map(note => note.channel))].sort((a, b) => a - b),
      notes,
    };
  });
  return { tracks, notes: tracks.flatMap(track => track.notes).sort((a, b) => a.start - b.start || a.pitch - b.pitch) };
}
