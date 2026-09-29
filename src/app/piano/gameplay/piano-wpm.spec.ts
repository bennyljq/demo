import { calculateDemand, calculateLiveWpm } from './piano-wpm';

describe('piano WPM', () => {
  const targets = (times: number[]) => times.map((time, index) => ({
    id: `t${index}`, index, wordIndex: 0, word: 'A', letter: 'A', time,
  }));

  it('uses the sounding end and a half-open five-second peak window', () => {
    const chart = targets([2, 3, 6.999, 7, 9]);
    const coupling = [{ targetIndex: 4, notes: [{ start: 9, duration: 1 }] }] as any;
    const demand = calculateDemand(chart, coupling)!;
    expect(demand.attackCount).toBe(5);
    expect(demand.activeSpanSeconds).toBe(8);
    expect(demand.averageWpm).toBe(7.5);
    expect(demand.peakAttacks).toBe(3); // 7 is outside [2, 7).
    expect(demand.peakWpm).toBe(7.2);
  });

  it('uses the active span for a chart shorter than five seconds and includes holds', () => {
    const chart = [{ ...targets([1])[0], holdEnd: 3 }, targets([2])[0]];
    const demand = calculateDemand(chart, [])!;
    expect(demand.activeSpanSeconds).toBe(2);
    expect(demand.averageWpm).toBe(12);
    expect(demand.peakWpm).toBe(12);
  });

  it('waits one observed second and uses actual successful real-time attacks', () => {
    expect(calculateLiveWpm([0], 0.99)).toBeNull();
    expect(calculateLiveWpm([0, 0.5], 1)).toBe(24);
    expect(calculateLiveWpm([0, 0.5, 9.5], 10)).toBe(3.6);
    expect(calculateLiveWpm([0, 0.5, 9.5], 10.5)).toBe(2.4);
  });
});
