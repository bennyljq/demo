import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom, timer } from 'rxjs';

@Component({
  selector: 'app-homepage-v2',
  templateUrl: './homepage-v2.component.html',
  styleUrls: ['./homepage-v2.component.scss']
})
export class HomepageV2Component implements OnInit {

  constructor(private router: Router){}

  name = "Benny"
  descLine1 = [
    "Physicist",
    "Mathematician",
  ]
  descLine2 = [
    "UX Engineer",
    "UI Developer",
    "Software Engineer",
  ]
  descLine3 = [
    "Data Scientist",
    "Pianist",
    "Godfather",
    "Swiftie",
    "Baker",
    "DOTA Enjoyer",
  ]
  contentClass: any;
  circleStyle: any;
  linksClass: any;
  projectsClass = "hidden"
  preload_kenobi = false

  async ngOnInit(): Promise<any> {
    this.hideElem("hello-there", 0.5)
    this.hideElem("my-name", 1)
    this.hideElem("i-am", 2)
    for (let i=1; i<=10; i++) {
      this.hideElem(`desc${i}`, 4 + (i - 1) * 0.25)
      await lastValueFrom(timer(0))
    }
    this.hideElem("about", 1.75)
    this.hideElem("projects", 2)
    this.hideElem("contact", 2.25)

    // preload
    this.preload_kenobi = true
    await lastValueFrom(timer(1))
    this.preload_kenobi = false
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
