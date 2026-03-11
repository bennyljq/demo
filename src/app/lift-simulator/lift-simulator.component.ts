import { Component, inject } from '@angular/core';
import { ElevatorService } from './elevator.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lift-simulator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lift-simulator.component.html',
  styleUrl: './lift-simulator.component.scss'
})
export class LiftSimulatorComponent {
  // Injecting our logic service
  readonly elevator = inject(ElevatorService);
  
  // Floor configuration (Top to Bottom)
  readonly floors = [5, 4, 3, 2, 1, 0];

  /**
   * Dispatches a floor request to the service
   * @param floor The target floor number
   */
  handleFloorRequest(floor: number): void {
    this.elevator.requestFloor(floor);
  }
}