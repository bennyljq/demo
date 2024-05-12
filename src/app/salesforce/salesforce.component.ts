import { Component } from '@angular/core';
import * as moment from 'moment';
import { lastValueFrom, timer } from 'rxjs';

@Component({
  selector: 'app-salesforce',
  templateUrl: './salesforce.component.html',
  styleUrls: ['./salesforce.component.scss']
})
export class SalesforceComponent {

  bgColor =  Array(5).fill('maroon');
  size = Array(5).fill('120px');
  animDuration: any = []
  showDemo: boolean = false
  showHexagons: boolean = false
  sides: number = 3
  showCircle: boolean = false
  showPolygon: boolean = false
  showWhiteboard: boolean = true
  polygonNames = [
    'triangle', 
    'square', 
    'pentagon',
    'hexagon',
    'heptagon/septagon',
    'octagon',
    'enneagon/nonagon',
    'decagon',
    'hendecagon/undecagon',
    'dodecagon',
    'tridecagon/triskaidecagon',
    'tetradecagon/tetrakaidecagon',
    'pentadecagon/pentakaidecagon',
    'hexadecagon/hexakaidecagon',
    'heptadecagon/heptakaidecagon',
    'octadecagon/octakaidecagon',
    'enneadecagon/enneakaidecagon',
    'icosagon'
  ]
  
  ngOnInit() {
    for (let i=0; i<5; i++) {
      this.animDuration.push(`${6 - i}s`)
    }
    // let iso = moment("2024-06-01", "YYYY-MM-DD").toISOString()
    // this.getTimer(iso)
    this.calcVertices(true)
  }

  demoOnClick(i: number) {
    if (this.bgColor[i] == 'maroon') {
      this.bgColor[i] = "green"
      this.size[i] = '150px'
    } else {
      this.bgColor[i] = "maroon"
      this.size[i] = '120px'
    }
  }

  getTimer(isoDate: any) {
    let today = moment()
    let target = moment(isoDate)
    let hours = target.diff(today, 'hours')
    target = target.subtract(hours, 'hours')
    let mins = target.diff(today, 'minutes')
    target = target.subtract(mins, 'minutes')
    let secs = target.diff(today, 'seconds')
    let out = {
      hours: hours,
      minutes: mins,
      seconds: secs
    }
    console.log(out)
    return out
  }

  async calcVertices(delay?: boolean) {
    if (delay) {
      await lastValueFrom(timer(0)) // frameskip
    }
    let angle = 2*Math.PI / this.sides
    let startingAngle = (3/2)*Math.PI - (angle/2)
    let posArray = []
    for (let i=0; i<this.sides; i++) {
      let tempAngle = startingAngle + (i*angle)
      posArray.push([
        ((Math.cos(tempAngle) + 1) * 50).toFixed(2),
        (100 - (Math.sin(tempAngle) + 1) * 50).toFixed(2)
      ])
    }
    let polygon = "polygon("
    posArray.forEach(x => {
      polygon += `${x[0]}% ${x[1]}%, `
    })
    polygon = polygon.substring(0, polygon.length - 2);
    polygon += ")"
    let nGon = document.getElementsByClassName('n-gon')[0] as HTMLElement
    nGon.style.background = 'tomato'
    nGon.style.clipPath = polygon
  }

}
