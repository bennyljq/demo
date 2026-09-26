import { DEMO_KEYBOARD_ROWS, DemoKeyboardPresenter } from './demo-keyboard';
import type { DemoAction } from '../gameplay/piano-demo-controller';

const action = (time: number, key: string, targetIndex: number, release = false, hold = false): DemoAction =>
  ({ time, key, targetIndex, release, hold });

describe('QWERTY demo keyboard presentation', () => {
  it('keeps three stable QWERTY rows containing only the 26 letters', () => {
    expect(DEMO_KEYBOARD_ROWS.length).toBe(3);
    const ids = DEMO_KEYBOARD_ROWS.flat().map(key => key.id);
    expect(DEMO_KEYBOARD_ROWS.map(row => row.map(key => key.id).join(''))).toEqual(['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM']);
    expect(ids.length).toBe(26);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('keeps a tap visible for 180 real milliseconds at different playback rates, then fades', () => {
    for (const rate of [1, 3]) {
      const keys = new DemoKeyboardPresenter();
      keys.apply(action(1, 'a', 0), 1, rate, 1000);
      keys.apply(action(1 + 0.13 * rate, 'A', 0, true), 1 + 0.13 * rate, rate, 1130);
      expect(keys.snapshot(1179)['A']?.phase).toBe('pressed');
      expect(keys.snapshot(1180)['A']?.phase).toBe('fading');
      expect(keys.snapshot(1289)['A']?.phase).toBe('fading');
      expect(keys.snapshot(1290)['A']).toBeUndefined();
    }
  });

  it('holds one key while another is tapped, and retains a short hold for the minimum visibility', () => {
    const keys = new DemoKeyboardPresenter();
    keys.apply(action(1, 'A', 0, false, true), 1, 1, 1000);
    keys.apply(action(1.1, 'B', 1), 1.1, 1, 1100);
    expect(keys.snapshot(1110)['A']?.phase).toBe('held');
    expect(keys.snapshot(1110)['B']?.phase).toBe('pressed');
    keys.apply(action(1.15, 'A', 0, true, true), 1.15, 1, 1150);
    expect(keys.snapshot(1179)['A']?.phase).toBe('pressed');
    expect(keys.snapshot(1180)['A']?.phase).toBe('fading');
  });

  it('reconstructs event age after a delayed frame instead of flashing expired keys', () => {
    const keys = new DemoKeyboardPresenter();
    keys.apply(action(1, 'A', 0), 1.5, 1, 1500);
    keys.apply(action(1.13, 'A', 0, true), 1.5, 1, 1500);
    expect(keys.snapshot(1500)).toEqual({});
    keys.apply(action(2, 'B', 1, false, true), 2.7, 1, 2700);
    keys.apply(action(2.5, 'B', 1, true, true), 2.7, 1, 2700);
    expect(keys.snapshot(2700)).toEqual({});
  });

  it('retriggers a repeated key without allowing an old release to clear it', () => {
    const keys = new DemoKeyboardPresenter();
    keys.apply(action(1, 'A', 0), 1, 1, 1000);
    const first = keys.snapshot(1000)['A'].serial;
    keys.apply(action(1.1, 'a', 1), 1.1, 1, 1100);
    keys.apply(action(1.13, 'A', 0, true), 1.13, 1, 1130);
    const repeated = keys.snapshot(1130);
    expect(repeated['A'].phase).toBe('pressed');
    expect(repeated['A'].serial).toBeGreaterThan(first);
    expect(keys.snapshot(1140)).toBe(repeated); // no per-frame Angular update without a state change
    keys.clear();
    expect(keys.snapshot(1140)).toEqual({});
  });
});
