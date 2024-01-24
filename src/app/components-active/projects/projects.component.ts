import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { lastValueFrom, timer } from 'rxjs';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent {

  constructor(
    private router: Router,
    private titleService: Title
  ) {
    this.titleService.setTitle("Benny's Projects");
  }
  
  fadeOutLeft: any;
  historyExit: any;
  unblur: any;

  async ngOnInit(): Promise<any> {
    this.hideElem("title", 1)
    this.hideElem("history", 1.5)
  }

  async hideElem(id: string, delay: number, endOpacity?: string) { // delay in seconds
    try {
      let elem = document.getElementById(id) as HTMLElement
      elem.style.opacity = "0"
      await lastValueFrom(timer(delay*1000))
      elem.style.opacity = "100%"
      if (endOpacity) {
        elem.style.opacity = endOpacity
      }
    } catch(error) {
      console.log("hideElem error:", error)
      console.log("ID", id)
    }
  }
  
  async goHome() {
    this.fadeOutLeft = "fade-out-left"
    this.historyExit = "history-exit"
    this.unblur = "unblur-image"
    await lastValueFrom(timer(666))
    this.router.navigate(['/main']);
  }
  
}
