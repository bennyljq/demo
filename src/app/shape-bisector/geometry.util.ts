export interface Point {
  x: number;
  y: number;
}

export function generateRandomBlob(
  numPoints = 150, 
  center: Point = { x: 500, y: 500 }, 
  baseRadius = 200, 
  rng: () => number = Math.random // Defaults to true random for sandbox
): Point[] {
  const points: Point[] = [];
  const harmonics = [];
  const numHarmonics = Math.floor(rng() * 5) + 4;
  
  for (let i = 0; i < numHarmonics; i++) {
    const freq = Math.floor(rng() * 8) + 1;
    const amp = (rng() * 60 + 20) / Math.sqrt(freq); 
    const phase = rng() * Math.PI * 2;
    harmonics.push({ freq, amp, phase });
  }
  
  const biasAngle = rng() * Math.PI * 2;
  const biasIntensity = 0.15 + rng() * 0.25; 
  const warpFreq = Math.floor(rng() * 2) + 1;
  const warpAmp = rng() * 0.35; 
  const warpPhase = rng() * Math.PI * 2;
  const squishX = 0.7 + rng() * 0.5; 
  const squishY = 0.7 + rng() * 0.5;
  
  for (let i = 0; i < numPoints; i++) {
    const trueAngle = (i / numPoints) * 2 * Math.PI;
    const warpedAngle = trueAngle + Math.sin(warpFreq * trueAngle + warpPhase) * warpAmp;
    
    let radiusOffset = 0;
    for (const h of harmonics) {
      radiusOffset += Math.sin(h.freq * warpedAngle + h.phase) * h.amp;
    }
    
    const lopsidedMultiplier = 1 + Math.cos(trueAngle - biasAngle) * biasIntensity;
    const finalRadius = (baseRadius + radiusOffset) * lopsidedMultiplier;
    
    points.push({
      x: center.x + (Math.cos(trueAngle) * finalRadius) * squishX,
      y: center.y + (Math.sin(trueAngle) * finalRadius) * squishY
    });
  }
  
  const stats = getPolygonAreaAndCentroid(points);
  const baseOffsetX = center.x - stats.centroid.x;
  const baseOffsetY = center.y - stats.centroid.y;
  const randomShiftX = (rng() * 200) - 100; 
  const randomShiftY = (rng() * 200) - 100;
  
  return points.map(p => ({
    x: p.x + baseOffsetX + randomShiftX,
    y: p.y + baseOffsetY + randomShiftY
  }));
}

export function splitPolygon(polygon: Point[], lineStart: Point, lineEnd: Point): { pieceA: Point[], pieceB: Point[] } | null {
  const pieceA: Point[] = [];
  const pieceB: Point[] = [];
  
  const A = lineEnd.y - lineStart.y;
  const B = lineStart.x - lineEnd.x;
  const C = A * lineStart.x + B * lineStart.y;
  
  const getSide = (p: Point) => {
    const value = A * p.x + B * p.y - C;
    if (Math.abs(value) < 1e-9) return 0; 
    return value > 0 ? 1 : -1;
  };
  
  let intersectionCount = 0;
  
  for (let i = 0; i < polygon.length; i++) {
    const currentPoint = polygon[i];
    const nextPoint = polygon[(i + 1) % polygon.length];
    
    const sideCurrent = getSide(currentPoint);
    const sideNext = getSide(nextPoint);
    
    if (sideCurrent >= 0) pieceA.push(currentPoint);
    if (sideCurrent <= 0) pieceB.push(currentPoint);
    
    if (sideCurrent !== 0 && sideNext !== 0 && sideCurrent !== sideNext) {
      const intersection = getLineIntersection(lineStart, lineEnd, currentPoint, nextPoint);
      if (intersection) {
        pieceA.push(intersection);
        pieceB.push(intersection);
        intersectionCount++;
      }
    }
  }
  
  if (intersectionCount < 2) return null;
  return { pieceA, pieceB };
}

export function getLineIntersection(p1: Point, p2: Point, p3: Point, p4: Point): Point | null {
  const denominator = (p1.x - p2.x) * (p3.y - p4.y) - (p1.y - p2.y) * (p3.x - p4.x);
  if (Math.abs(denominator) < 1e-9) return null;
  const u = -((p1.x - p2.x) * (p1.y - p3.y) - (p1.y - p2.y) * (p1.x - p3.x)) / denominator;
  if (u >= 0 && u <= 1) {
    return {
      x: p3.x + u * (p4.x - p3.x),
      y: p3.y + u * (p4.y - p3.y)
    };
  }
  return null;
}

export function isPointInPolygon(point: Point, polygon: Point[]): boolean {
  let isInside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x, yi = polygon[i].y;
    const xj = polygon[j].x, yj = polygon[j].y;
    const intersect = ((yi > point.y) !== (yj > point.y)) && (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
    if (intersect) isInside = !isInside;
  }
  return isInside;
}

export function doesCutIntersectShape(start: Point, end: Point, polygon: Point[]): boolean {
  for (let i = 0; i < polygon.length; i++) {
    const p3 = polygon[i];
    const p4 = polygon[(i + 1) % polygon.length];
    if (doSegmentsIntersect(start, end, p3, p4)) return true;
  }
  return false;
}

function doSegmentsIntersect(p1: Point, p2: Point, p3: Point, p4: Point): boolean {
  return (ccw(p1, p3, p4) !== ccw(p2, p3, p4)) && (ccw(p1, p2, p3) !== ccw(p1, p2, p4));
}

function ccw(a: Point, b: Point, c: Point): boolean {
  return (c.y - a.y) * (b.x - a.x) > (b.y - a.y) * (c.x - a.x);
}

export function getPolygonAreaAndCentroid(points: Point[]): { area: number, centroid: Point } {
  let signedArea = 0;
  let cx = 0, cy = 0;
  
  for (let i = 0; i < points.length; i++) {
    const p1 = points[i];
    const p2 = points[(i + 1) % points.length];
    const a = p1.x * p2.y - p2.x * p1.y;
    signedArea += a;
    cx += (p1.x + p2.x) * a;
    cy += (p1.y + p2.y) * a;
  }
  
  signedArea *= 0.5;
  return {
    area: Math.abs(signedArea),
    centroid: { x: cx / (6 * signedArea), y: cy / (6 * signedArea) }
  };
}

export function calculateDriftOffsets(p1: Point, p2: Point, driftDistance: number = 80) {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const length = Math.sqrt(dx * dx + dy * dy);
  
  if (length === 0) return { offsetA: {x: 0, y: 0}, offsetB: {x: 0, y: 0} };
  
  const nx = dx / length;
  const ny = dy / length;
  
  return {
    offsetA: { x: -ny * driftDistance, y: nx * driftDistance },
    offsetB: { x: ny * driftDistance, y: -nx * driftDistance }
  };
}

// --- PRNG UTILITIES ---
// Generates a 32-bit hash from a string
function xmur3(str: string) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = h << 13 | h >>> 19;
  }
  return function() {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^= h >>> 16) >>> 0;
  }
}

// Generates a predictable float between 0 and 1 based on a seed
function mulberry32(a: number) {
  return function() {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}

export function createPRNG(seedString: string): () => number {
  const seed = xmur3(seedString)();
  return mulberry32(seed);
}

export function getSingaporeDateString(): string {
  // 1. Get the current exact moment in time
  const now = new Date();
  
  // 2. Force the browser to translate that moment into SGT (GMT+8)
  const sgtString = now.toLocaleString("en-US", { timeZone: "Asia/Singapore" });
  const sgtDate = new Date(sgtString);
  
  // 3. Format it safely as YYYY-MM-DD
  const year = sgtDate.getFullYear();
  const month = String(sgtDate.getMonth() + 1).padStart(2, '0');
  const day = String(sgtDate.getDate()).padStart(2, '0');
  
  // Example output: "2026-02-22"
  return `${year}-${month}-${day}`;
}