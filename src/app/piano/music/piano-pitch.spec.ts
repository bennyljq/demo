import { pitchName } from './piano-pitch';

describe('piano roll pitch labels', () => {
  it('uses scientific octaves and sharps', () => {
    expect(pitchName(60)).toBe('C4');
    expect(pitchName(66)).toBe('F♯4');
    expect(pitchName(83)).toBe('B5');
    expect(pitchName(21)).toBe('A0');
  });
});
