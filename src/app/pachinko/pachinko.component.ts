import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, HostListener, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PachinkoEngineService } from './pachinko-engine.service';
import * as THREE from 'three';

@Component({
  selector: 'app-pachinko',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pachinko.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './pachinko.component.css'
})
export class PachinkoComponent implements AfterViewInit, OnDestroy {
  @ViewChild('gameCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  
  private raycaster = new THREE.Raycaster();
  private pointer = new THREE.Vector2();
  
  private dropInterval: any = null;
  private currentPointerWorldX: number = 0;

  constructor(public engine: PachinkoEngineService) {}

  ngAfterViewInit() {
    this.engine.init(this.canvasRef.nativeElement);
  }

  ngOnDestroy() {
    this.stopDropping();
    this.engine.destroy();
  }

  @HostListener('window:resize')
  onResize() {
    const parent = this.canvasRef.nativeElement.parentElement;
    if (parent) {
      this.engine.resize(parent.clientWidth, parent.clientHeight);
    } else {
      this.engine.resize(window.innerWidth, window.innerHeight);
    }
  }

  @HostListener('window:pointerup')
  @HostListener('window:pointercancel')
  stopDropping() {
    if (this.dropInterval) {
      clearInterval(this.dropInterval);
      this.dropInterval = null;
    }
  }

  onPointerDown(event: PointerEvent) {
    // Prevent dragging from starting a drop if clicking a button
    if ((event.target as HTMLElement).tagName === 'BUTTON') return;

    this.updatePointerX(event);
    this.engine.dropBall(this.currentPointerWorldX);
    
    this.dropInterval = setInterval(() => {
      this.engine.dropBall(this.currentPointerWorldX);
    }, 100); 
  }

  onPointerMove(event: PointerEvent) {
    if (this.dropInterval) {
      this.updatePointerX(event);
    }
  }

  private updatePointerX(event: PointerEvent) {
    this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.pointer, this.engine.getCamera());
    const intersects = this.raycaster.intersectObject(this.engine.getDropPlane());

    if (intersects.length > 0) {
      this.currentPointerWorldX = intersects[0].point.x;
    }
  }
}