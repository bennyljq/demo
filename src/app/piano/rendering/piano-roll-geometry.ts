export const ROLL_PLAYHEAD_X = 72;
export function timeToX(attack: number, position: number, width: number, lookAhead: number): number {
  return ROLL_PLAYHEAD_X + (attack - position) * Math.max(1, width - ROLL_PLAYHEAD_X - 12) / lookAhead;
}
