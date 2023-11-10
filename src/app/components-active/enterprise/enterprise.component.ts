import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom, timer } from 'rxjs';

@Component({
  selector: 'app-enterprise',
  templateUrl: './enterprise.component.html',
  styleUrls: ['./enterprise.component.scss']
})
export class EnterpriseComponent implements OnInit {

  constructor(private router: Router){}

  innerWidth: any;
  numCols: any;

  ngOnInit(): void {
    hideElem("ent-container", 1)
    this.innerWidth = window.innerWidth;
    this.setNumCols()
  }
  
  async goHome() {
    this.router.navigate(['/main']);
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.innerWidth = window.innerWidth;
    this.setNumCols()
  }
  setNumCols() {
    let minWidth = 150
    let total = this.innerWidth*0.96 + 40
    if (total >= 900) {
      this.numCols = 6
    } else if (total >= 450) {
      this.numCols = 3
    } else if (total >= 300) {
      this.numCols = 2
    }
    // this.numCols = Math.floor(total/minWidth)
  }

  buttonSizes = [
    `<app-button text="Hello There" size="small"></app-button>`,
    `<app-button text="Hello There" size="medium"></app-button>`,
    `<app-button text="Hello There" size="large"></app-button>`
  ]
  buttonSizeHtml = this.buttonSizes[0]
  buttonTypes = [
    `<app-button text="Hello There" type="primary"></app-button>`,
    `<app-button text="Hello There" type="secondary"></app-button>`,
    `<app-button text="Hello There" type="tertiary"></app-button>`,
    `<app-button text="Hello There" type="minimal"></app-button>`,
    `<app-button text="Hello There" type="important"></app-button>`,
    `<app-button text="Hello There" type="importantAlt"></app-button>`
  ]
  buttonTypeHtml = this.buttonTypes[0]
}

export async function hideElem(id: string, delay: number, endOpacity?: string) { // delay in seconds
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
