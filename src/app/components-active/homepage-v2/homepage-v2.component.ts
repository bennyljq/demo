import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { lastValueFrom, timer } from 'rxjs';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

@Component({
  selector: 'app-homepage-v2',
  templateUrl: './homepage-v2.component.html',
  styleUrls: ['./homepage-v2.component.scss'],
  animations: [
    trigger('fadeIn1', [
      state('void', style({
        opacity: 0,
        transform: 'translateY(-5vh)'
      })),
      transition('void => *', [
        animate('0.5s 1.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('fadeIn2', [
      state('void', style({
        opacity: 0,
        transform: 'translateY(-5vh)'
      })),
      transition('void => *', [
        animate('0.5s 1.75s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('fadeIn3', [
      state('void', style({
        opacity: 0,
        transform: 'translateY(-5vh)'
      })),
      transition('void => *', [
        animate('0.5s 2s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class HomepageV2Component implements OnInit {

  constructor(
    private router: Router,
    private titleService: Title
  ) {
    this.titleService.setTitle("Benny's Site");
  }

  name = "Benny"
  descLine1 = [
    "Physicist",
    "Mathematician",
  ]
  descLine2 = [
    "Software Engineer",
    "Web Developer"
  ]
  descLine3 = [
    "Data Scientist",
    "Pianist",
    "Godfather",
    "Baker",
    "Gamer",
    "Existentialist"
  ]
  contentClass: any;
  circleStyle: any;
  linksClass: any;
  projectsClass = "hidden"

  async ngOnInit(): Promise<any> {
    this.hideElem("hello-there", 0.5)
    this.hideElem("my-name", 1)
    this.hideElem("i-am", 2)
    for (let i=1; i<=10; i++) {
      this.hideElem(`desc${i}`, 4 + (i - 1) * 0.25)
      await lastValueFrom(timer(0))
    }
    // this.hideElem("about", 1.75)
    // this.hideElem("projects", 2)
    // this.hideElem("contact", 2.25)
  }

  async hideElem(id: string, delay: number) { // delay in seconds
    try {
      let elem = document.getElementById(id) as HTMLElement
      elem.style.opacity = "0"
      await lastValueFrom(timer(delay*1000))
      elem.style.opacity = "100%"
    } catch(error) {
      console.log("hideElem error:", error)
      console.log("ID", id)
    }
  }

  async goToRoute(route: string) {
    this.contentClass = "fade-out-left"
    await lastValueFrom(timer(666))
    this.router.navigate([`/${route}`]);
  }

  async showProjects() {
    this.linksClass = "fade-out-left"
    this.projectsClass = 'fade-in-left'
  }

  async resetProjects() {
    this.linksClass = "fade-in-left"
    this.projectsClass = 'fade-out-left'
    await lastValueFrom(timer(666))
    this.projectsClass = 'hidden'
  }

}
