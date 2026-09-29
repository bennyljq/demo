import { Car, Direction, DIRECTIONS, Run } from './simulation';

export interface Palette {
  bg: string; surface: string; road: string; marking: string;
  flow: string; wait: string; text: string; danger: string;
}

const SIZE = 600;
const CENTER = SIZE / 2;
const HALF_ROAD = 72;

function carPosition(car: Car, distance: number): [number, number, number] {
  switch (car.direction) {
    case 'north': return [CENTER - 22, CENTER - distance, Math.PI / 2];
    case 'south': return [CENTER + 22, CENTER + distance, Math.PI / 2];
    case 'east': return [CENTER + distance, CENTER - 22, 0];
    case 'west': return [CENTER - distance, CENTER + 22, 0];
  }
}

function drawCar(ctx: CanvasRenderingContext2D, car: Car, distance: number, color: string): void {
  const [x, y, angle] = carPosition(car, distance);
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.fillStyle = color;
  ctx.fillRect(-9, -5, 18, 10);
  ctx.fillStyle = '#19303b';
  ctx.fillRect(-1, -4, 5, 8);
  ctx.restore();
}

export function renderBoard(ctx: CanvasRenderingContext2D, run: Run, palette: Palette): void {
  ctx.clearRect(0, 0, SIZE, SIZE);
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, SIZE, SIZE);
  ctx.fillStyle = palette.surface;
  ctx.fillRect(0, 0, 214, 214);
  ctx.fillRect(386, 0, 214, 214);
  ctx.fillRect(0, 386, 214, 214);
  ctx.fillRect(386, 386, 214, 214);
  ctx.fillStyle = palette.road;
  ctx.fillRect(CENTER - HALF_ROAD, 0, HALF_ROAD * 2, SIZE);
  ctx.fillRect(0, CENTER - HALF_ROAD, SIZE, HALF_ROAD * 2);

  ctx.strokeStyle = palette.marking;
  ctx.lineWidth = 2;
  ctx.setLineDash([12, 12]);
  ctx.beginPath();
  ctx.moveTo(CENTER, 0); ctx.lineTo(CENTER, 216);
  ctx.moveTo(CENTER, 384); ctx.lineTo(CENTER, SIZE);
  ctx.moveTo(0, CENTER); ctx.lineTo(216, CENTER);
  ctx.moveTo(384, CENTER); ctx.lineTo(SIZE, CENTER);
  ctx.stroke();
  ctx.setLineDash([]);
  for (const [x1, y1, x2, y2] of [[228, 216, 372, 216], [228, 384, 372, 384], [216, 228, 216, 372], [384, 228, 384, 372]]) {
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  }

  for (const direction of DIRECTIONS) {
    const queue = run.queues[direction];
    queue.forEach((car, i) => drawCar(ctx, car, 95 + i * 18, palette.wait));
  }
  for (const car of run.crossing) drawCar(ctx, car, 88 - car.progress * 5, palette.flow);
  for (const car of run.exiting) drawCar(ctx, car, -12 - car.progress * 5, palette.flow);

  ctx.font = '600 16px system-ui';
  ctx.textAlign = 'center';
  ctx.fillStyle = palette.text;
  ctx.fillText('N', 300, 34);
  ctx.fillText('S', 300, 585);
  ctx.fillText('W', 22, 305);
  ctx.fillText('E', 578, 305);
  ctx.font = '600 13px system-ui';
  ctx.fillStyle = run.clearing ? palette.wait : palette.flow;
  ctx.fillText(run.clearing ? 'ALL RED · CLEARING' : `${run.phase.toUpperCase()} FLOW`, 300, 306);
  if (DIRECTIONS.some((direction: Direction) => run.backlog[direction].length)) {
    ctx.fillStyle = palette.danger;
    ctx.fillText('ARRIVALS WAITING OFF MAP', 300, 332);
  }
}
