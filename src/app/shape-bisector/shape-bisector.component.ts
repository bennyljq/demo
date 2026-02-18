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
    const numPoints = Math.floor(Math.random() * 15) + 5;
    const center = { x: 500, y: 500 };
    const radius = 350;

    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * 2 * Math.PI;
      const randomRadius = radius * (0.5 + Math.random() * 0.5);
      points.push({
        x: center.x + Math.cos(angle) * randomRadius,
        y: center.y + Math.sin(angle) * randomRadius
      });
    }
    
    this.polygonPoints.set(points);
    this.shapeId.update(id => id + 1); // Increments to trigger re-animation
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

  // --- Pointer Event Handlers ---
  
  onPointerDown(event: PointerEvent) {
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

  onPointerUp(event: PointerEvent) {
    if (!this.isDrawing()) return;
    this.isDrawing.set(false);
    this.cutCompleted.set(true);
    
    (event.target as Element).releasePointerCapture(event.pointerId);

    // TODO for your TS model: 
    // Pass this.startPoint() and this.currentPoint() to your math logic
    // to calculate the polygon bisection!
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
}