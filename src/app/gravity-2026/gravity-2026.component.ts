import { Component, ElementRef, ViewChild, AfterViewInit, HostListener, NgZone, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-gravity2026',
  standalone: true,
  templateUrl: './gravity-2026.component.html',
  styleUrl: './gravity-2026.component.scss'
})
export class Gravity2026Component implements AfterViewInit, OnDestroy {
  @ViewChild('vortexCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('uiContainer', { static: true }) uiContainerRef!: ElementRef<HTMLDivElement>;
  @ViewChild('chargeBar', { static: true }) chargeBarRef!: ElementRef<HTMLDivElement>;
  
  private ctx!: CanvasRenderingContext2D;
  private width = 0;
  private height = 0;
  private animationFrameId = 0;
  
  // Timing State
  private readonly TARGET_FPS = 120;
  private readonly FPS_INTERVAL = 1000 / this.TARGET_FPS;
  private then = 0;
  
  // Physics & Particle State
  private particles: Particle[] = [];
  private readonly REPULSION_STRENGTH = 1;
  private readonly FRICTION = 0.98;
  private readonly DRIFT_STRENGTH = 0.3;
  
  // Dynamic Scaling State
  private numParticles = 0;
  private readonly TARGET_DENSITY = 5000 / (1920 * 1080); 
  private readonly BASE_AREA = 1920 * 1080;
  
  // Dynamic Physics Variables
  private repulsionRadius = 150;
  private gravityConstant = 1500;
  private blastRadiusBase = 500;
  private blastForceBase = 45;
  private swirlStrength = 0.015;
  private minOrbitRadius = 60; 
  
  // Multi-Touch Interaction State
  private pointers = new Map<number, { x: number, y: number, downTime: number }>();
  private hover = { x: -1000, y: -1000, active: false };
  
  // Visual Theme
  private readonly COLOR_CYAN = { r: 0, g: 243, b: 255, shadow: '#00f3ff' };
  
  constructor(private ngZone: NgZone) {}
  
  ngAfterViewInit(): void {
    this.initCanvas();
    
    this.ngZone.runOutsideAngular(() => {
      this.then = performance.now();
      this.animate(this.then);
    });
  }
  
  ngOnDestroy(): void {
    cancelAnimationFrame(this.animationFrameId);
  }
  
  private initCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.resizeCanvas();
  }
  
  @HostListener('window:resize')
  resizeCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    canvas.width = this.width;
    canvas.height = this.height;
    
    this.updatePhysicsScale();
    this.adjustParticleCount();
  }
  
  private updatePhysicsScale(): void {
    const currentArea = this.width * this.height;
    
    const radiusScaleFactor = Math.max(currentArea / this.BASE_AREA, 0.5); 
    const forceScaleFactor = Math.max(Math.sqrt(currentArea / this.BASE_AREA), 0.6); 
    const inverseScale = Math.min(this.BASE_AREA / currentArea, 0.5);
    
    this.repulsionRadius = 200 * radiusScaleFactor;
    this.blastRadiusBase = 500 * radiusScaleFactor;
    this.minOrbitRadius = 100 * radiusScaleFactor;
    
    this.gravityConstant = 1500 * forceScaleFactor;
    this.blastForceBase = 45 * forceScaleFactor;
    this.swirlStrength = 0.015 * inverseScale;
  }
  
  private adjustParticleCount(): void {
    const area = this.width * this.height;
    const targetCount = Math.floor(area * this.TARGET_DENSITY);
    
    this.numParticles = Math.min(Math.max(targetCount, 800), 8000); 
    
    if (this.particles.length < this.numParticles) {
      const particlesToAdd = this.numParticles - this.particles.length;
      for (let i = 0; i < particlesToAdd; i++) {
        this.particles.push(new Particle(Math.random() * this.width, Math.random() * this.height));
      }
    } else if (this.particles.length > this.numParticles) {
      this.particles.splice(this.numParticles);
    }
  }
  
  // --- MULTI-TOUCH LISTENERS ---
  
  @HostListener('pointerdown', ['$event'])
  onPointerDown(e: PointerEvent): void {
    // Lock the pointer to the canvas to prevent mobile scrolling interference
    if (e.target instanceof HTMLElement) {
      e.target.setPointerCapture(e.pointerId);
    }
    
    this.pointers.set(e.pointerId, {
      x: e.clientX,
      y: e.clientY,
      downTime: performance.now()
    });
    
    this.hover.active = false;
    this.uiContainerRef.nativeElement.classList.add('active');
  }
  
  @HostListener('pointermove', ['$event'])
  onPointerMove(e: PointerEvent): void {
    if (this.pointers.has(e.pointerId)) {
      // Update an active gravity well
      const p = this.pointers.get(e.pointerId)!;
      p.x = e.clientX;
      p.y = e.clientY;
    } else {
      // Passive mouse hover (repulsion)
      this.hover.x = e.clientX;
      this.hover.y = e.clientY;
      this.hover.active = true;
    }
  }
  
  @HostListener('pointerup', ['$event'])
  @HostListener('pointercancel', ['$event'])
  onPointerUp(e: PointerEvent): void {
    if (this.pointers.has(e.pointerId)) {
      const p = this.pointers.get(e.pointerId)!;
      this.triggerBlast(p.x, p.y, p.downTime); // Detonate only this specific well
      this.pointers.delete(e.pointerId);
    }
    
    // Only hide the UI if ALL fingers are lifted
    if (this.pointers.size === 0) {
      this.uiContainerRef.nativeElement.classList.remove('active');
      this.chargeBarRef.nativeElement.style.transform = `scaleX(0)`;
    }
  }
  
  @HostListener('pointerleave', ['$event'])
  onPointerLeave(e: PointerEvent): void {
    if (!this.pointers.has(e.pointerId)) {
      this.hover.active = false; // Stop passive repulsion when mouse leaves canvas
    }
  }
  
  // --- CORE PHYSICS LOOP ---
  
  private animate = (now: DOMHighResTimeStamp): void => {
    this.animationFrameId = requestAnimationFrame(this.animate);
    
    const elapsed = now - this.then;
    
    if (elapsed > this.FPS_INTERVAL) {
      this.then = now - (elapsed % this.FPS_INTERVAL);
      
      this.ctx.fillStyle = 'rgba(5, 5, 5, 0.25)';
      this.ctx.fillRect(0, 0, this.width, this.height);
      
      const cyanFill = `rgba(${this.COLOR_CYAN.r}, ${this.COLOR_CYAN.g}, ${this.COLOR_CYAN.b}, 1)`;
      
      // 1. Pre-calculate active gravity wells & max charge for the UI
      let maxChargeRatio = 0;
      const activeWells: { x: number, y: number, charge: number, blastRad: number, coreRadSq: number }[] = [];
      
      for (const well of this.pointers.values()) {
        const chargeRatio = Math.min((now - well.downTime) / 3000, 1.0);
        maxChargeRatio = Math.max(maxChargeRatio, chargeRatio);
        
        const blastRad = this.blastRadiusBase * Math.max(chargeRatio * 1.5, 0.1);
        activeWells.push({
          x: well.x, 
          y: well.y, 
          charge: chargeRatio, 
          blastRad: blastRad, 
          coreRadSq: blastRad * blastRad
        });
        
        // Draw individual expanding indicator ring for each finger
        if (blastRad > 5) {
          this.ctx.beginPath();
          this.ctx.arc(well.x, well.y, blastRad, 0, Math.PI * 2);
          this.ctx.strokeStyle = this.COLOR_CYAN.shadow;
          this.ctx.lineWidth = 1 + (chargeRatio * 2);
          this.ctx.globalAlpha = 0.03 + (chargeRatio * 0.005); 
          this.ctx.stroke();
        }
      }
      this.ctx.globalAlpha = 1.0; // Reset alpha
      
      // 2. Update shared UI Bar
      if (this.pointers.size > 0) {
        const barNative = this.chargeBarRef.nativeElement;
        barNative.style.transform = `scaleX(${maxChargeRatio})`;
        barNative.style.background = cyanFill;
        barNative.style.boxShadow = `0 0 10px ${this.COLOR_CYAN.shadow}`;
        if (maxChargeRatio >= 1.0) barNative.classList.add('maxed');
        else barNative.classList.remove('maxed');
      }
      
      const driftPath = new Path2D();
      const corePath = new Path2D();
      const repelRadiusSq = this.repulsionRadius * this.repulsionRadius;
      
      // 3. Multi-body Physics Logic
      for (let i = 0; i < this.numParticles; i++) {
        const p = this.particles[i];
        let isTrappedByAny = false;
        
        if (activeWells.length > 0) {
          // Accumulate forces from ALL active gravity wells
          for (const well of activeWells) {
            const dx = p.x - well.x;
            const dy = p.y - well.y;
            const distSq = dx * dx + dy * dy;
            
            if (distSq < (well.coreRadSq / 10)) {
              isTrappedByAny = true;
            }
            
            const safeDistSq = Math.max(distSq, 10); 
            const dist = Math.sqrt(safeDistSq);
            
            // A. Newtonian Gravity Pull (Inverse Square)
            const gravityForce = this.gravityConstant / safeDistSq;
            p.vx -= (dx / dist) * gravityForce;
            p.vy -= (dy / dist) * gravityForce;
            
            // B. Soft Exponential Core Repulsion
            if (dist < this.minOrbitRadius) {
              // Calculate how deep the particle has pierced the event horizon
              const penetration = this.minOrbitRadius - dist;
              
              // The stiffness dictates how "squishy" the core is. 
              // 0.05 = highly compressible (soft), 0.2 = nearly rigid.
              const stiffness = 0.05;
              
              // Repulsion equals gravity at the boundary, then scales exponentially
              const pushForce = gravityForce * Math.exp(penetration * stiffness);
              
              p.vx += (dx / dist) * pushForce;
              p.vy += (dy / dist) * pushForce;
            }
            
            // C. Tangential Swirl (Applied locally per-well)
            if (distSq < (well.coreRadSq / 10)) {
              p.vx += (-dy / dist) * this.swirlStrength;
              p.vy += (dx / dist) * this.swirlStrength;
            }
          }
        } else if (this.hover.active) {
          // Passive Repulsion (Hover state)
          const dx = p.x - this.hover.x;
          const dy = p.y - this.hover.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < repelRadiusSq) {
            const dist = Math.sqrt(distSq);
            const force = (this.repulsionRadius - dist) / this.repulsionRadius;
            p.vx += (dx / dist) * force * this.REPULSION_STRENGTH;
            p.vy += (dy / dist) * force * this.REPULSION_STRENGTH;
          }
        } 
        
        // --- MOMENTUM RESOLUTION ---
        if (!isTrappedByAny) {
          // Free particles: apply atmospheric drag and random drift
          p.vx += (Math.random() - 0.5) * this.DRIFT_STRENGTH;
          p.vy += (Math.random() - 0.5) * this.DRIFT_STRENGTH;
          p.vx *= this.FRICTION;
          p.vy *= this.FRICTION;
        } else {
          // Trapped particles: vacuum preservation (micro-friction prevents math explosions)
          p.vx *= 0.995;
          p.vy *= 0.995;
        }
        
        p.x += p.vx;
        p.y += p.vy;
        
        // Canvas Boundaries
        if (p.x < 0) { p.x = 0; p.vx *= -1; }
        else if (p.x > this.width) { p.x = this.width; p.vx *= -1; }
        if (p.y < 0) { p.y = 0; p.vy *= -1; }
        else if (p.y > this.height) { p.y = this.height; p.vy *= -1; }
        
        // Assign to Rendering Buffers
        if (isTrappedByAny) {
          corePath.moveTo(p.x, p.y);
          corePath.arc(p.x, p.y, p.radius * 1.3, 0, Math.PI * 2); 
        } else {
          driftPath.moveTo(p.x, p.y);
          driftPath.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        }
      }
      
      // --- EXECUTION OF DRAWING ---
      this.ctx.fillStyle = cyanFill;
      
      // Draw standard field
      this.ctx.fill(driftPath);
      
      // Draw energized core particles
      this.ctx.fill(corePath);
      
      // Dynamic energized glow around trapped particles
      if (this.pointers.size > 0 && maxChargeRatio > 0.5) {
        this.ctx.globalAlpha = 0.5 * maxChargeRatio; 
        this.ctx.lineWidth = 3 * maxChargeRatio;
        this.ctx.strokeStyle = this.COLOR_CYAN.shadow;
        this.ctx.stroke(corePath);
        this.ctx.globalAlpha = 1.0; 
      }
    }
  };
  
  private triggerBlast(x: number, y: number, downTime: number): void {
    const holdDuration = performance.now() - downTime;
    const chargeRatio = Math.min(Math.max(holdDuration / 3000, 0.1), 1.0);
    
    const dynamicBlastRadius = this.blastRadiusBase * chargeRatio; 
    const dynamicBlastForce = this.blastForceBase * chargeRatio;   
    
    for (let i = 0; i < this.numParticles; i++) {
      const p = this.particles[i];
      let dx = p.x - x;
      let dy = p.y - y;
      const distSq = dx * dx + dy * dy;
      
      if (distSq < dynamicBlastRadius * dynamicBlastRadius) {
        const dist = Math.sqrt(distSq);
        const safeDist = Math.max(dist, 1);
        
        if (dist < 0.1) {
          const randomAngle = Math.random() * Math.PI * 2;
          dx = Math.cos(randomAngle) * safeDist;
          dy = Math.sin(randomAngle) * safeDist;
        }
        
        const forceMultiplier = (dynamicBlastRadius - safeDist) / dynamicBlastRadius;
        const appliedForce = dynamicBlastForce * forceMultiplier;
        
        p.vx += (dx / safeDist) * appliedForce;
        p.vy += (dy / safeDist) * appliedForce;
      }
    }
  }
}

// --- Particle Data Structure ---
class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 1.5;
    this.vy = (Math.random() - 0.5) * 1.5;
    this.radius = Math.random() * 1.2 + 0.5;
  }
}