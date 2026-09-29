export type PianoMode = 'rhythm' | 'eight-keys' | 'word-concert';

export const PIANO_MODES: readonly { id: PianoMode; name: string; description: string }[] = [
  { id: 'rhythm', name: 'Rhythm Only', description: 'Play each note on time with any letter key.' },
  { id: 'eight-keys', name: 'Eight Keys', description: 'Follow a two-hand QWER and UIOP finger pattern.' },
  { id: 'word-concert', name: 'Word Concert', description: 'Type changing words in time with the melody.' },
];

export const EIGHT_KEYS = 'QWERUIOP';
export const EIGHT_KEY_SLOTS = [
  { index: 0, name: 'L5' }, { index: 1, name: 'L4' }, { index: 2, name: 'L3' }, { index: 3, name: 'L2' },
  { index: 4, name: 'R2' }, { index: 5, name: 'R3' }, { index: 6, name: 'R4' }, { index: 7, name: 'R5' },
] as const;

export function eightKeyNumber(slot: string): string {
  const index = EIGHT_KEYS.indexOf(slot.toUpperCase());
  const mapper = { 0: '5', 1: '4', 2: '3', 3: '2', 4: '2', 5: '3', 6: '4', 7: '5' };
  return index < 0 ? slot : mapper[index];
}

export function modeName(mode: PianoMode): string {
  return PIANO_MODES.find(item => item.id === mode)!.name;
}
