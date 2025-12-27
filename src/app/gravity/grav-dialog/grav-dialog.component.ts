import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as eq from '../grav-equations'
import { lastValueFrom, timer } from 'rxjs';

@Component({
    selector: 'app-grav-dialog',
    templateUrl: './grav-dialog.component.html',
    styleUrls: ['./grav-dialog.component.scss'],
    standalone: false
})
export class GravDialogComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<GravDialogComponent>
    ) { }

  eq = eq

  async ngOnInit() {
    await lastValueFrom(timer(0.1))
    let panel = document.getElementsByTagName("mat-expansion-panel-header")[0] as HTMLElement
    console.log(panel)
    panel.click()
  }

  log(x: any) {
    console.log(x)
  }

  confirm() {
    this.convertNum()
    this.dialogRef.close({
      action: 'confirm',
      bodies: this.data.bodies
    })
  }

  discard() {
    this.convertNum()
    this.dialogRef.close({
      action: 'discard'
    })
  }

  convertNum() {
    try {
      for (let body of this.data.bodies) {
        body.position_x = Number(body.position_x)
        body.position_y = Number(body.position_y)
        body.velocity_x = Number(body.velocity_x)
        body.velocity_y = Number(body.velocity_y)
      }
    } catch {
      return false
    }
    return true
  }

  addEarth() {
    let count = this.data.bodies.filter((x: any) => x.type=='earth').length
    let temp = 
    {
      id: `earth-${count+1}`,
      type: 'earth',
      position_x: 0.66,
      position_y: 0,
      velocity_x: 0,
      velocity_y: -1,
      mass: eq.m_earth
    }
    this.data.bodies.push(temp)
    this.clickLastPanel()
  }

  addSun() {
    let count = this.data.bodies.filter((x: any) => x.type=='sun').length
    let temp = 
    {
      id: `sun-${count+1}`,
      type: 'sun',
      position_x: -1,
      position_y: 0,
      velocity_x: 1,
      velocity_y: -1,
      mass: eq.m_sun
    }
    this.data.bodies.push(temp)
    this.clickLastPanel()
  }

  async clickLastPanel() {
    await lastValueFrom(timer(0.1))
    let panel = document.getElementsByTagName("mat-expansion-panel-header")[this.data.bodies.length - 1] as HTMLElement
    console.log(panel)
    panel.click()
  }

}
