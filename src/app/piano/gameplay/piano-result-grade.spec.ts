import { calculateScoreGrade } from './piano-result-grade';

describe('score grades', () => {
  it('uses the unrounded floored score at every threshold', () => {
    expect(calculateScoreGrade(95, 1, 100)?.grade).toBe('S');
    expect(calculateScoreGrade(94.999, 1, 100)?.grade).toBe('A');
    expect(calculateScoreGrade(85, 1, 100)?.grade).toBe('A');
    expect(calculateScoreGrade(84.999, 1, 100)?.grade).toBe('B');
    expect(calculateScoreGrade(70, 1, 100)?.grade).toBe('B');
    expect(calculateScoreGrade(69.999, 1, 100)?.grade).toBe('C');
    expect(calculateScoreGrade(50, 1, 100)?.grade).toBe('C');
    expect(calculateScoreGrade(49.999, 1, 100)?.grade).toBe('D');
    expect(calculateScoreGrade(-20, 1, 100)).toEqual({ grade: 'D', ratio: 0, earned: 0 });
  });

  it('does not award a grade for zero-target or invalid attempts', () => {
    expect(calculateScoreGrade(0, 1, 0)).toBeNull();
    expect(calculateScoreGrade(100, 0, 100)).toBeNull();
  });

  it('keeps the same grade when speed multiplies both score and maximum', () => {
    expect(calculateScoreGrade(84.99, 1, 100)?.grade).toBe('B');
    expect(calculateScoreGrade(84.99, 3, 300)?.grade).toBe('B');
    expect(calculateScoreGrade(94.7, 1, 100)?.grade).toBe('A'); // Display rounds to 95.
  });
});
