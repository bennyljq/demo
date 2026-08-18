import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameEngineService } from './game-engine.service';

@Component({
  selector: 'app-rock-stacker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rock-stacker.component.html',
  styleUrl: './rock-stacker.component.css' // Angular 17+ uses styleUrl (singular)
})
export class RockStackerComponent implements AfterViewInit, OnDestroy {
  @ViewChild('gameCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  constructor(public engine: GameEngineService) {}

  ngAfterViewInit() {
    this.engine.init(this.canvasRef.nativeElement);
    this.engine.setupInteractions(this.canvasRef.nativeElement);
    
    // Spawn initial pool
    for (let i = 0; i < 5; i++) {
      this.spawnRock();
    }
  }

  ngOnDestroy() {
    this.engine.destroy(this.canvasRef.nativeElement);
  }

  @HostListener('window:resize')
  onResize() {
    const parentContainer = this.canvasRef.nativeElement.parentElement;
    if (parentContainer) {
      this.engine.resize(parentContainer.clientWidth, parentContainer.clientHeight);
    } else {
      this.engine.resize(window.innerWidth, window.innerHeight);
    }
  }

  spawnRock() {
    const x = (Math.random() - 0.5) * 6;
    const z = (Math.random() - 0.5) * 6;
    this.engine.spawnProceduralRock(x, 5, z);
  }
}