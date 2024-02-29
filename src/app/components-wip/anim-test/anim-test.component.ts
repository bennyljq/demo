import { Component } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

@Component({
  selector: 'app-anim-test',
  templateUrl: './anim-test.component.html',
  styleUrls: ['./anim-test.component.scss'],
  animations: [
    trigger('fadeIn', [
      state('void', style({
        opacity: 0,
        transform: 'translateY(-5vh)'
      })),
      transition('void => *', [
        animate('0.5s 1s ease-in-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class AnimTestComponent {
  
  isOpen = true;

  toggle() {
    this.isOpen = !this.isOpen;
  }

}
