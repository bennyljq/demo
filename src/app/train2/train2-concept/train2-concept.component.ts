import { Component, EventEmitter, Output } from '@angular/core';
import { ThemeService } from 'src/app/physics/theme.service';

@Component({
  selector: 'app-train2-concept',
  templateUrl: './train2-concept.component.html',
  styleUrls: ['./train2-concept.component.scss', '../train2-home/train2-home.component.scss']
})
export class Train2ConceptComponent {

  constructor (
    public themeService: ThemeService
  ) {}
  
  @Output() setPage = new EventEmitter
  exit = false
}
