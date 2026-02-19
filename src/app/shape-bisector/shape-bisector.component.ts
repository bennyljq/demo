import { Component, signal, computed, ElementRef, viewChild } from '@angular/core';

interface Point {
  x: number;
  y: number;
}

@Component({
  selector: 'app-shape-bisector',
  standalone: true,
  templateUrl: './shape-bisector.component.html',
  styleUrls: ['./shape-bisector.component.scss']
})
export class ShapeBisectorComponent {
  readonly VIEWBOX_SIZE = 1000;
  readonly polygonPoints = signal<Point[]>([]);
  
  // We use this to force Angular to re-render the element and re-trigger CSS animations
  readonly shapeId = signal<number>(0);
  
  ngAfterViewInit() {
    this.generateRandomShape();
  }
  
  generateRandomShape() {
    const points: Point[] = [];
    const numPoints = 150; // Increased for even smoother warping
    const center = { x: 500, y: 500 };
    const baseRadius = 200;
    
    // 1. The Harmonics (Same as before, but slightly wilder)
    const numHarmonics = Math.floor(Math.random() * 5) + 4;
    const harmonics = [];
    for (let i = 0; i < numHarmonics; i++) {
      const freq = Math.floor(Math.random() * 8) + 1;
      const amp = (Math.random() * 60 + 20) / Math.sqrt(freq); 
      const phase = Math.random() * Math.PI * 2;
      harmonics.push({ freq, amp, phase });
    }
    
    // --- 🚨 NEW: SYMMETRY BREAKERS 🚨 ---
    
    // 2. The Lopsided Bias
    // This picks a random direction (0 to 360 degrees) and makes the shape 
    // physically heavier/fatter in that direction, and skinnier on the opposite side.
    const biasAngle = Math.random() * Math.PI * 2;
    const biasIntensity = 0.15 + Math.random() * 0.25; // 15% to 40% thicker on one side
    
    // 3. Angle Warping (Domain Distortion)
    // We bend the spatial fabric itself. A shape will "accelerate" its curves 
    // on one side and "decelerate" them on the other.
    const warpFreq = Math.floor(Math.random() * 2) + 1;
    const warpAmp = Math.random() * 0.35; 
    const warpPhase = Math.random() * Math.PI * 2;
    
    // 4. Axis Squish
    const squishX = 0.7 + Math.random() * 0.5; 
    const squishY = 0.7 + Math.random() * 0.5;
    
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
    
    // --- 🚨 NEW: RE-CENTER THE MASS 🚨 ---
    // Calculate where the center of mass currently is
    const stats = this.getPolygonAreaAndCentroid(points);
    
    // 1. Calculate the offset to bring it dead center (500, 500)
    const baseOffsetX = center.x - stats.centroid.x;
    const baseOffsetY = center.y - stats.centroid.y;
    
    // 2. Generate ONE random shift for the entire shape 
    // e.g., anywhere between -100 and +100 pixels on both axes
    const randomShiftX = (Math.random() * 200) - 100; 
    const randomShiftY = (Math.random() * 200) - 100;
    
    // 3. Apply the exact same combined offset to every point
    const shiftedPoints = points.map(p => ({
      x: p.x + baseOffsetX + randomShiftX,
      y: p.y + baseOffsetY + randomShiftY
    }));
    // --------------------------------------
    
    // Set the newly centered points instead of the original ones
    this.polygonPoints.set(shiftedPoints);
    this.shapeId.update(id => id + 1); 
    
    this.splitPieces.set(null);
    this.startPoint.set(null);
    this.currentPoint.set(null);
    this.cutCompleted.set(false);
    
    if (this.celebrationTimer) {
      clearTimeout(this.celebrationTimer);
      this.celebrationTimer = null;
    }
    this.showCelebration.set(false);
    this.particles.set([]);
  }
  
  // --- Add these new properties at the top of your class ---
  private readonly STORAGE_KEY = 'potong_stats';
  
  // Celebration signals
  showCelebration = signal(false);
  particles = signal<any[]>([]);
  celebrationText = signal<string>('');
  celebrationTier = signal<'great' | 'perfect' | null>(null);
  
  constructor() {
    this.loadStats(); // Load saved data when the game boots up
    this.generateRandomShape();
  }
  
  // --- PERSISTENCE METHODS ---
  private loadStats() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        this.roundsPlayed.set(parsed.roundsPlayed || 0);
        this.totalScore.set(parsed.totalScore || 0);
        
        if (this.roundsPlayed() > 0) {
          this.avgScore.set(Math.round(this.totalScore() / this.roundsPlayed()));
        }
      }
    } catch (e) {
      console.error('Could not load stats', e);
    }
  }
  
  private saveStats() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify({
      roundsPlayed: this.roundsPlayed(),
      totalScore: this.totalScore()
    }));
  }
  
  resetStats() {
    localStorage.removeItem(this.STORAGE_KEY);
    this.roundsPlayed.set(0);
    this.totalScore.set(0);
    this.avgScore.set(null);
    this.lastCutText.set('--');
    this.lastScore.set(null);
  }
  
  // --- CELEBRATION METHOD ---
  private triggerCelebration(tier: 'great' | 'perfect') {
    if (this.celebrationTimer) {
      clearTimeout(this.celebrationTimer);
    }
    
    this.celebrationTier.set(tier);
    this.celebrationText.set(tier === 'perfect' ? 'PERFECT POTONG!' : 'GREAT POTONG!');
    
    const isPerfect = tier === 'perfect';
    const particleCount = isPerfect ? 140 : 40; // Massive burst for perfect
    
    const newParticles = Array.from({ length: particleCount }).map(() => {
      // VIGOROUS UPGRADE: Double the spread distance if perfect
      const spread = isPerfect ? 1500 : 800; 
      
      const tx = (Math.random() - 0.5) * spread; 
      const ty = (Math.random() - 0.5) * spread - (isPerfect ? 400 : 200); 
      
      const rot = Math.random() * 1080; // More violent tumbling
      const scale = Math.random() * 0.8 + 0.4;
      
      const colors = ['#22d3ee', '#a855f7', '#d8b4fe', '#ffffff'];
      if (isPerfect) {
        colors.push('#fbbf24', '#f59e0b', '#fb923c'); // Add hot orange/gold
      }
      
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      // Perfect particles fly faster and more aggressively
      const duration = isPerfect ? (1.2 + Math.random() * 1.5) : 2.5; 
      
      return { 
        tx, ty, rot, scale, color, 
        delay: Math.random() * (isPerfect ? 0.05 : 0.2), // Near-instant explosion
        duration 
      };
    });
    
    this.particles.set(newParticles);
    this.showCelebration.set(true);
    
    this.celebrationTimer = setTimeout(() => {
      this.showCelebration.set(false);
    }, isPerfect ? 3500 : 2500);
  }
  
  pointsString = computed(() => {
    return this.polygonPoints().map(p => `${p.x},${p.y}`).join(' ');
  });
  
  // Grab the SVG element from the template to calculate responsive coordinates
  svgElement = viewChild.required<ElementRef<SVGSVGElement>>('gameCanvas');
  
  // Drawing State Signals
  isDrawing = signal(false);
  startPoint = signal<Point | null>(null);
  currentPoint = signal<Point | null>(null);
  
  // Did they just finish a cut? (Used to trigger the flash animation)
  cutCompleted = signal(false);
  
  pieceStats = signal<{
    pieceA: { percent: string, centroid: Point },
    pieceB: { percent: string, centroid: Point }
  } | null>(null);
  
  roundsPlayed = signal<number>(0);
  lastCutText = signal<string>('--');
  lastScore = signal<number | null>(null);
  totalScore = signal<number>(0);
  avgScore = signal<number | null>(null);
  private celebrationTimer: ReturnType<typeof setTimeout> | null = null;
  private sliceAudio = new Audio('assets/potong/shing.m4a');
  
  private playSliceSound() {
    // We clone the audio node every time it plays.
    // This allows multiple slash sounds to overlap perfectly 
    // if the player resets and cuts extremely fast.
    const soundClone = this.sliceAudio.cloneNode() as HTMLAudioElement;
    
    // Browsers block audio unless the user has interacted with the page,
    // so we add a quick catch to prevent console errors on the very first load.
    soundClone.play().catch(err => {
      console.warn("Browser blocked audio playback until user interaction.", err);
    });
  }
  
  
  // --- Pointer Event Handlers ---
  
  onPointerDown(event: PointerEvent) {
    if (this.splitPieces()) return;
    
    // Capture the mouse/touch so it doesn't get interrupted if they drag outside slightly
    (event.target as Element).setPointerCapture(event.pointerId);
    
    const svgPoint = this.getSvgPoint(event.clientX, event.clientY);
    this.startPoint.set(svgPoint);
    this.currentPoint.set(svgPoint);
    this.isDrawing.set(true);
    this.cutCompleted.set(false);
  }
  
  onPointerMove(event: PointerEvent) {
    if (!this.isDrawing()) return;
    this.currentPoint.set(this.getSvgPoint(event.clientX, event.clientY));
  }
  
  splitPieces = signal<{ pieceA: Point[], pieceB: Point[] } | null>(null);
  cutScores = signal<{ scoreA: number, scoreB: number } | null>(null);
  driftOffsets = signal<{ offsetA: Point, offsetB: Point }>({ offsetA: {x: 0, y: 0}, offsetB: {x: 0, y: 0} });
  
  async onPointerUp(event: PointerEvent) {
    if (!this.isDrawing()) return;
    this.isDrawing.set(false);
    this.cutCompleted.set(true);
    (event.target as Element).releasePointerCapture(event.pointerId);
    
    const start = this.startPoint();
    const end = this.currentPoint();
    
    if (!start || !end) return;
    
    const currentShape = this.polygonPoints();
    
    // --- 🚨 THE ROBUST VALIDATION BLOCK 🚨 ---
    
    // Rule 1: The start and end points MUST be outside the shape.
    const isStartInside = this.isPointInPolygon(start, currentShape);
    const isEndInside = this.isPointInPolygon(end, currentShape);
    
    // Rule 2: The physical swipe segment MUST cross the shape's edges.
    const didIntersect = this.doesCutIntersectShape(start, end, currentShape);
    
    if (isStartInside || isEndInside || !didIntersect) {
      console.log("Invalid Cut: Must start/end outside AND slice through the shape.");
      
      // Reset state so they can try again
      this.startPoint.set(null);
      this.currentPoint.set(null);
      this.cutCompleted.set(false);
      return; // Stop here!
    }
    
    // If we passed the check, proceed with the split
    const result = this.splitPolygon(this.polygonPoints(), start, end);
    
    if (result) {
      // 1. Calculate Area and Centroids for both new pieces
      const statsA = this.getPolygonAreaAndCentroid(result.pieceA);
      const statsB = this.getPolygonAreaAndCentroid(result.pieceB);
      
      const totalArea = statsA.area + statsB.area;
      
      // 2. Convert to exactly 1 decimal place (e.g., "50.1")
      const percentA = ((statsA.area / totalArea) * 100).toFixed(1);
      const percentB = ((statsB.area / totalArea) * 100).toFixed(1);
      
      // --- 🚨 NEW: PROCESS THE SCORE 🚨 ---
      const score = this.calculateScore(parseFloat(percentA));
      
      this.roundsPlayed.update(r => r + 1);
      this.lastCutText.set(`${percentA} / ${percentB}`); 
      this.lastScore.set(score);
      this.totalScore.update(t => t + score);
      this.avgScore.set(Math.round(this.totalScore() / this.roundsPlayed()));
      
      this.saveStats(); 
      this.playSliceSound();
      
      const diff = Math.abs(50 - parseFloat(percentA));
      
      // Trigger celebrations and specific haptic feedback
      if (diff <= 1) {
        this.triggerCelebration('perfect');
        this.triggerHaptics('perfect');
      } else if (diff <= 5) {
        this.triggerCelebration('great');
        this.triggerHaptics('great');
      } else {
        // Just a standard cut vibration
        this.triggerHaptics();
      }
      // ------------------------------------
      
      // 3. Save the stats to our signal
      this.pieceStats.set({
        pieceA: { percent: percentA, centroid: statsA.centroid },
        pieceB: { percent: percentB, centroid: statsB.centroid }
      });
      
      // 4. Trigger the drift logic (same as before)
      this.driftOffsets.set({ offsetA: { x: 0, y: 0 }, offsetB: { x: 0, y: 0 } });
      this.splitPieces.set({ pieceA: result.pieceA, pieceB: result.pieceB });
      
      await this.waitForNextFrame(); 
      
      const targetOffsets = this.calculateDriftOffsets(start, end, -60);
      this.driftOffsets.set(targetOffsets);
    } else {
      this.startPoint.set(null);
      this.currentPoint.set(null);
      this.cutCompleted.set(false);
    }
  }
  
  // --- The Magic Responsive Coordinate Converter ---
  private getSvgPoint(clientX: number, clientY: number): Point {
    const svg = this.svgElement().nativeElement;
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    // Transforms the screen pixel to the 1000x1000 viewBox coordinate
    const ctm = svg.getScreenCTM();
    if (!ctm) return { x: 0, y: 0 };
    const svgPt = pt.matrixTransform(ctm.inverse());
    return { x: svgPt.x, y: svgPt.y };
  }
  
  // Add this helper function to your TypeScript logic
  calculatePolygonArea(points: Point[]): number {
    let area = 0;
    const n = points.length;
    if (n < 3) return 0;
    
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n; // Wraps around to the first point
      area += points[i].x * points[j].y;
      area -= points[j].x * points[i].y;
    }
    return Math.abs(area / 2);
  }
  
  calculateDriftOffsets(p1: Point, p2: Point, driftDistance: number = 80) {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    
    // Calculate the length of the cut line
    const length = Math.sqrt(dx * dx + dy * dy);
    if (length === 0) return { offsetA: {x: 0, y: 0}, offsetB: {x: 0, y: 0} };
    
    // Normalize the vector (make its length exactly 1)
    const nx = dx / length;
    const ny = dy / length;
    
    // The two orthogonal (perpendicular) vectors
    return {
      offsetA: { x: -ny * driftDistance, y: nx * driftDistance },
      offsetB: { x: ny * driftDistance, y: -nx * driftDistance }
    };
  }
  
  getPointsString(points: Point[] | undefined): string {
    if (!points) return '';
    return points.map(p => `${p.x},${p.y}`).join(' ');
  }
  
  /**
  * Splits a polygon into two pieces using an infinite line defined by two points.
  * Returns null if the line misses the shape or doesn't cut completely through it.
  */
  splitPolygon(polygon: Point[], lineStart: Point, lineEnd: Point): { pieceA: Point[], pieceB: Point[] } | null {
    const pieceA: Point[] = [];
    const pieceB: Point[] = [];
    
    // 1. Calculate the Line Equation for the cut (A*x + B*y = C)
    const A = lineEnd.y - lineStart.y;
    const B = lineStart.x - lineEnd.x;
    const C = A * lineStart.x + B * lineStart.y;
    
    // Helper to determine which side of the line a point is on
    const getSide = (p: Point) => {
      const value = A * p.x + B * p.y - C;
      // Add a tiny tolerance for floating point math inaccuracies
      if (Math.abs(value) < 1e-9) return 0; 
      return value > 0 ? 1 : -1;
    };
    
    let intersectionCount = 0;
    
    // 2. Walk the edges of the polygon
    for (let i = 0; i < polygon.length; i++) {
      const currentPoint = polygon[i];
      const nextPoint = polygon[(i + 1) % polygon.length]; // Wraps back to 0 at the end
      
      const sideCurrent = getSide(currentPoint);
      const sideNext = getSide(nextPoint);
      
      // Push the current vertex into the correct bucket based on its side
      if (sideCurrent >= 0) pieceA.push(currentPoint);
      if (sideCurrent <= 0) pieceB.push(currentPoint);
      
      // 3. Check if the edge crosses the cut line
      if (sideCurrent !== 0 && sideNext !== 0 && sideCurrent !== sideNext) {
        // Find the exact coordinate where the edge hits the laser
        const intersection = this.getLineIntersection(lineStart, lineEnd, currentPoint, nextPoint);
        
        if (intersection) {
          // The intersection point belongs to both new pieces
          pieceA.push(intersection);
          pieceB.push(intersection);
          intersectionCount++;
        }
      }
    }
    
    // 4. Validate the cut
    // A valid slice through a convex polygon will always intersect exactly 2 edges.
    if (intersectionCount < 2) {
      return null; // The player completely missed or only grazed the shape
    }
    
    return { pieceA, pieceB };
  }
  
  /**
  * Calculates the exact (x, y) intersection of an infinite line (p1-p2) 
  * and a finite line segment (p3-p4).
  */
  private getLineIntersection(p1: Point, p2: Point, p3: Point, p4: Point): Point | null {
    const denominator = (p1.x - p2.x) * (p3.y - p4.y) - (p1.y - p2.y) * (p3.x - p4.x);
    
    // If denominator is 0, lines are parallel
    if (Math.abs(denominator) < 1e-9) return null;
    
    // Calculate position along the polygon edge segment (p3-p4)
    const u = -((p1.x - p2.x) * (p1.y - p3.y) - (p1.y - p2.y) * (p1.x - p3.x)) / denominator;
    
    // If u is between 0 and 1, the intersection happens within the bounds of the polygon edge
    if (u >= 0 && u <= 1) {
      const px = p3.x + u * (p4.x - p3.x);
      const py = p3.y + u * (p4.y - p3.y);
      return { x: px, y: py };
    }
    
    return null;
  }
  
  /**
  * Determines if a point is inside a polygon using the Ray Casting algorithm.
  */
  isPointInPolygon(point: Point, polygon: Point[]): boolean {
    let isInside = false;
    
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].x, yi = polygon[i].y;
      const xj = polygon[j].x, yj = polygon[j].y;
      
      // Check if the horizontal ray intersects the edge
      const intersect = ((yi > point.y) !== (yj > point.y)) &&
      (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
      
      if (intersect) {
        isInside = !isInside;
      }
    }
    
    return isInside;
  }
  
  private ccw(a: Point, b: Point, c: Point): boolean {
    return (c.y - a.y) * (b.x - a.x) > (b.y - a.y) * (c.x - a.x);
  }
  
  private doSegmentsIntersect(p1: Point, p2: Point, p3: Point, p4: Point): boolean {
    return (this.ccw(p1, p3, p4) !== this.ccw(p2, p3, p4)) && 
    (this.ccw(p1, p2, p3) !== this.ccw(p1, p2, p4));
  }
  
  private doesCutIntersectShape(start: Point, end: Point, polygon: Point[]): boolean {
    for (let i = 0; i < polygon.length; i++) {
      const p3 = polygon[i];
      const p4 = polygon[(i + 1) % polygon.length]; // Wraps to start
      
      // If the swipe segment intersects ANY edge segment of the polygon, it's a hit!
      if (this.doSegmentsIntersect(start, end, p3, p4)) {
        return true;
      }
    }
    return false;
  }
  
  /**
  * Calculates the exact Area and the Centroid (Center of Mass) of a polygon.
  */
  private getPolygonAreaAndCentroid(points: Point[]): { area: number, centroid: Point } {
    let signedArea = 0;
    let cx = 0;
    let cy = 0;
    
    for (let i = 0; i < points.length; i++) {
      const p1 = points[i];
      const p2 = points[(i + 1) % points.length]; // Wraps to the first point
      
      // Shoelace cross-multiplication
      const a = p1.x * p2.y - p2.x * p1.y;
      signedArea += a;
      
      // Accumulate centroid coordinates
      cx += (p1.x + p2.x) * a;
      cy += (p1.y + p2.y) * a;
    }
    
    signedArea *= 0.5;
    
    // Calculate final centroid coordinates
    cx = cx / (6 * signedArea);
    cy = cy / (6 * signedArea);
    
    return {
      area: Math.abs(signedArea),
      centroid: { x: cx, y: cy }
    };
  }
  
  calculateScore(percentA: number): number {
    // Find the absolute difference from exactly 50%
    const d = Math.abs(50 - percentA);
    
    // The linear falloff (Max 80 points)
    const linear = 80 - (1.6 * d);
    
    // The exponential precision bonus (Max 20 points)
    const exponential = 20 * Math.exp(-0.8 * d);
    
    const rawScore = linear + exponential;
    
    // Return a clean, rounded integer between 0 and 100
    return Math.max(0, Math.round(rawScore));
  }
  
  private triggerHaptics(tier?: 'great' | 'perfect') {
    // Check if the device supports physical vibration
    if (!navigator.vibrate) return;
    
    if (tier === 'perfect') {
      // A celebratory double-pulse: vibrate 50ms, pause 50ms, vibrate 100ms
      navigator.vibrate([50, 50, 100]); 
    } else if (tier === 'great') {
      navigator.vibrate([40, 30, 40]);
    } else {
      // A single, sharp snap for a normal cut
      navigator.vibrate(40);
    }
  }
  
  /**
  * Forces the browser to wait for the next physical paint frame.
  * This guarantees CSS transitions have a "before" state to animate from.
  */
  private waitForNextFrame(): Promise<void> {
    return new Promise(resolve => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => resolve());
      });
    });
  }
}