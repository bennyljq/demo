const names = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];

/** Scientific pitch notation, using sharp spellings on the piano-roll axis. */
export function pitchName(midi: number): string {
  if (!Number.isInteger(midi) || midi < 0 || midi > 127) throw new Error(`Invalid MIDI pitch ${midi}.`);
  return `${names[midi % 12]}${Math.floor(midi / 12) - 1}`;
}
