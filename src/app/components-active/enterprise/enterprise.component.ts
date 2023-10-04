import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom, timer } from 'rxjs';

@Component({
  selector: 'app-enterprise',
  templateUrl: './enterprise.component.html',
  styleUrls: ['./enterprise.component.scss']
})
export class EnterpriseComponent implements OnInit {

  constructor(private router: Router){}

  ngOnInit(): void {
    this.hideElem("ent-container", 1)
  }
  
  async goHome() {
    this.router.navigate(['/main']);
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

}
