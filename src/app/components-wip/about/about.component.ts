import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom, timer } from 'rxjs';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {

  constructor(private router: Router){}
  
  years = [
    {
      year: 2099,
      text: "Template",
      entries: [
        {
          month: "Mar",
          text: "Template"
        }
      ]
    },
    {
      year: 2018,
      entries: [
        {
          month: "Dec",
          text: 'Published "Prime Numbers Generated From Highly Composite Numbers" in Parabola, University of New South Wales'
        },
        {
          month: "Aug",
          text: "Software Engineer at DBS Bank"
        },
        {
          month: "Feb",
          text: "Editor at World Scientific Publishing"
        },
      ]
    },
    {
      year: 2013,
      text: "National University of Singapore - B.Sc. Physics"
    },
    {
      year: 2011,
      text: "National Service - Served as an Officer in the Singapore Armed Forces"
    },
    {
      year: 2009,
      text: "Nanyang Junior College - Placed on honour roll for A Levels examination"
    },
    {
      year: 2005,
      text: "Secondary School (fun times!)"
    },
    {
      year: 1999,
      text: "Primary School (fun times!)"
    },
    {
      year: 1998,
      text: "Repressed childhood memories"
    },
    {
      year: 1997,
      text: "Repressed childhood memories"
    },
    {
      year: 1996,
      text: "Repressed childhood memories"
    },
    {
      year: 1995,
      text: "Repressed childhood memories"
    },
    {
      year: 1994,
      text: "Repressed childhood memories"
    },
    {
      year: 1993,
      text: "Repressed childhood memories"
    },
    {
      year: 1992,
      text: "Born into this cruel world"
    },
  ]
  fadeOutLeft: any;
  historyExit: any;

  async ngOnInit(): Promise<any> {
    this.hideElem("hes-me", 1)
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
    await lastValueFrom(timer(666))
    this.router.navigate(['']);
  }
  
}
