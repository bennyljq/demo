import { applyCommands, buyHeadway, createRun, DIRECTIONS, headwayTicks, Run, step } from './simulation';

function accounted(run: Run): number {
  return run.completed + run.crossing.length + run.exiting.length +
    DIRECTIONS.reduce((sum, direction) => sum + run.queues[direction].length + run.backlog[direction].length, 0);
}

describe('traffic simulation', () => {
  it('replays seeded arrivals and preserves every vehicle', () => {
    const a = createRun(42);
    const b = createRun(42);
    for (let tick = 0; tick < 1200; tick++) {
      const commands = tick % 110 === 0 ? [{ type: 'switch' as const, phase: tick % 220 ? 'ns' as const : 'ew' as const }] : [];
      step(a, commands);
      step(b, commands);
      expect(accounted(a)).toBe(a.arrivals);
    }
    expect(a).toEqual(b);
    expect(a.completed).toBeGreaterThan(0);
    expect(a.credits).toBe(a.completed);
  });

  it('holds minimum green and all-red clearance before conflicting cars enter', () => {
    const run = createRun(7);
    run.queues.north.push({ id: 1000, direction: 'north', entered: 0, progress: 0 });
    run.queues.east.push({ id: 1001, direction: 'east', entered: 0, progress: 0 });
    for (let tick = 0; tick < 89; tick++) step(run, [{ type: 'switch', phase: 'ew' }]);
    expect(run.phase).toBe('ns');
    expect(run.clearing).toBeFalse();
    step(run, [{ type: 'switch', phase: 'ew' }]);
    expect(run.clearing).toBeTrue();
    for (let tick = 0; tick < 28; tick++) {
      step(run, [{ type: 'switch', phase: 'ew' }]);
      expect(run.crossing.some(car => car.direction === 'east' || car.direction === 'west')).toBeFalse();
    }
    step(run);
    expect(run.phase).toBe('ew');
    expect(run.crossing.every(car => car.direction === 'east' || car.direction === 'west')).toBeTrue();
  });

  it('earns on exit once and purchases only when affordable', () => {
    const run = createRun(1);
    expect(buyHeadway(run)).toBeFalse();
    expect(run.headwayLevel).toBe(0);
    run.queues.north.push({ id: 1000, direction: 'north', entered: 0, progress: 0 });
    const startingArrivals = run.arrivals;
    for (let tick = 0; tick < 36; tick++) step(run);
    expect(run.completed).toBeGreaterThanOrEqual(1);
    expect(run.credits).toBe(run.completed);
    expect(run.arrivals).toBeGreaterThanOrEqual(startingArrivals);
    run.credits = 12;
    const before = headwayTicks(run);
    applyCommands(run, [{ type: 'buy-headway' }]);
    expect(run.credits).toBe(0);
    expect(run.headwayLevel).toBe(1);
    expect(headwayTicks(run)).toBeLessThan(before);
    expect(buyHeadway(run)).toBeFalse();
    expect(run.headwayLevel).toBe(1);
    run.credits = 100;
    expect(buyHeadway(run)).toBeTrue();
    expect(buyHeadway(run)).toBeTrue();
    const cappedCredits = run.credits;
    expect(buyHeadway(run)).toBeFalse();
    expect(run.credits).toBe(cappedCredits);
  });
});
