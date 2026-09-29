export const TICKS_PER_SECOND = 30;
export const HEADWAY_COSTS = [12, 24, 48] as const;
export type Direction = 'north' | 'south' | 'east' | 'west';
export type Phase = 'ns' | 'ew';
export type Command = { type: 'switch'; phase: Phase } | { type: 'buy-headway' };

export interface Car {
  id: number;
  direction: Direction;
  entered: number;
  progress: number;
}

export interface Run {
  tick: number;
  rng: number;
  nextId: number;
  phase: Phase;
  pending: Phase | null;
  clearing: boolean;
  phaseTicks: number;
  clearanceTicks: number;
  queues: Record<Direction, Car[]>;
  backlog: Record<Direction, Car[]>;
  crossing: Car[];
  exiting: Car[];
  lastRelease: Record<Direction, number>;
  arrivals: number;
  completed: number;
  credits: number;
  headwayLevel: number;
}

export const DIRECTIONS: Direction[] = ['north', 'south', 'east', 'west'];
const CAPACITY = 12;
const MIN_GREEN = 3 * TICKS_PER_SECOND;
const CYCLE = 8 * TICKS_PER_SECOND;
const CLEARANCE = TICKS_PER_SECOND;
const CROSS_TICKS = 18;
const EXIT_TICKS = 18;

export function createRun(seed = 12345): Run {
  return {
    tick: 0, rng: seed >>> 0, nextId: 1, phase: 'ns', pending: null,
    clearing: false, phaseTicks: 0, clearanceTicks: 0,
    queues: { north: [], south: [], east: [], west: [] },
    backlog: { north: [], south: [], east: [], west: [] },
    crossing: [], exiting: [],
    lastRelease: { north: -100, south: -100, east: -100, west: -100 },
    arrivals: 0, completed: 0, credits: 0, headwayLevel: 0,
  };
}

function random(run: Run): number {
  run.rng = (Math.imul(run.rng, 1664525) + 1013904223) >>> 0;
  return run.rng / 0x100000000;
}

export function headwayTicks(run: Run): number {
  return Math.max(12, Math.ceil(0.8 * 0.9 ** run.headwayLevel * TICKS_PER_SECOND));
}

export function buyHeadway(run: Run): boolean {
  const cost = HEADWAY_COSTS[run.headwayLevel];
  if (cost === undefined || run.credits < cost) return false;
  run.credits -= cost;
  run.headwayLevel++;
  return true;
}

export function applyCommands(run: Run, commands: readonly Command[]): void {
  for (const command of commands) {
    if (command.type === 'buy-headway') buyHeadway(run);
    else if (command.phase !== run.phase) run.pending = command.phase;
  }
}

export function step(run: Run, commands: readonly Command[] = []): void {
  // Commands, signal, arrivals, travel, rewards, then queue admission.
  applyCommands(run, commands);
  run.tick++;
  run.phaseTicks++;
  if (!run.clearing && !run.pending && run.phaseTicks >= CYCLE) {
    run.pending = run.phase === 'ns' ? 'ew' : 'ns';
  }
  if (!run.clearing && run.pending && run.phaseTicks >= MIN_GREEN) {
    run.clearing = true;
    run.clearanceTicks = 0;
  }
  if (run.clearing) {
    run.clearanceTicks++;
    if (run.clearanceTicks >= CLEARANCE && run.crossing.length === 0) {
      run.phase = run.pending ?? (run.phase === 'ns' ? 'ew' : 'ns');
      run.pending = null;
      run.clearing = false;
      run.phaseTicks = 0;
    }
  }

  // A fixed seeded Bernoulli stream gives 1.2 expected arrivals per second.
  if (random(run) < 1.2 / TICKS_PER_SECOND) {
    const direction = DIRECTIONS[Math.floor(random(run) * DIRECTIONS.length)];
    const car: Car = { id: run.nextId++, direction, entered: run.tick, progress: 0 };
    run.arrivals++;
    if (run.queues[direction].length < CAPACITY && run.backlog[direction].length === 0) {
      run.queues[direction].push(car);
    } else {
      run.backlog[direction].push(car);
    }
  }

  for (const car of run.crossing) car.progress++;
  const finishedCrossing = run.crossing.filter(car => car.progress >= CROSS_TICKS);
  run.crossing = run.crossing.filter(car => car.progress < CROSS_TICKS);
  for (const car of finishedCrossing) {
    car.progress = 0;
    run.exiting.push(car);
  }
  for (const car of run.exiting) car.progress++;
  const finished = run.exiting.filter(car => car.progress >= EXIT_TICKS);
  run.exiting = run.exiting.filter(car => car.progress < EXIT_TICKS);
  run.completed += finished.length;
  run.credits += finished.length;

  if (!run.clearing) {
    for (const direction of DIRECTIONS) {
      const served = run.phase === 'ns' ? direction === 'north' || direction === 'south' : direction === 'east' || direction === 'west';
      if (!served || !run.queues[direction].length) continue;
      if (run.tick - run.lastRelease[direction] < headwayTicks(run)) continue;
      if (run.crossing.some(car => car.direction === direction)) continue;
      const car = run.queues[direction].shift()!;
      car.progress = 0;
      run.crossing.push(car);
      run.lastRelease[direction] = run.tick;
    }
  }
  for (const direction of DIRECTIONS) {
    while (run.queues[direction].length < CAPACITY && run.backlog[direction].length) {
      run.queues[direction].push(run.backlog[direction].shift()!);
    }
  }
}
