import { Injectable, signal, computed, effect } from '@angular/core';

export enum LiftState {
  IDLE = 'IDLE',
  MOVING_UP = 'MOVING_UP',
  MOVING_DOWN = 'MOVING_DOWN',
  DOORS_OPENING = 'DOORS_OPENING'
}

@Injectable({ providedIn: 'root' })
export class ElevatorService {
  // State Signals
  readonly currentFloor = signal<number>(0);
  readonly targetQueue = signal<number[]>([]);
  readonly state = signal<LiftState>(LiftState.IDLE);
  
  // Constants
  readonly travelTimePerFloor = 1000; // ms

  constructor() {
    // Effect to process the queue whenever it changes or state becomes IDLE
    effect(() => {
      if (this.state() === LiftState.IDLE && this.targetQueue().length > 0) {
        this.processNextRequest();
      }
    });
  }

  requestFloor(floor: number) {
    if (this.currentFloor() === floor) return;
    
    this.targetQueue.update(q => {
      if (q.includes(floor)) return q;
      return [...q, floor].sort((a, b) => a - b); // Simple sorting for basic logic
    });
  }

  private async processNextRequest() {
    const queue = this.targetQueue();
    if (queue.length === 0) return;

    const nextFloor = queue[0];
    const direction = nextFloor > this.currentFloor() ? LiftState.MOVING_UP : LiftState.MOVING_DOWN;
    
    this.state.set(direction);

    // Simulate travel time
    await this.delay(Math.abs(nextFloor - this.currentFloor()) * this.travelTimePerFloor);

    this.currentFloor.set(nextFloor);
    this.state.set(LiftState.DOORS_OPENING);
    
    // Simulate door hold
    await this.delay(1500);

    this.targetQueue.update(q => q.filter(f => f !== nextFloor));
    this.state.set(LiftState.IDLE);
  }

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}