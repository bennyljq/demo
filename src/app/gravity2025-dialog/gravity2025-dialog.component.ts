import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-gravity2025-dialog',
    templateUrl: './gravity2025-dialog.component.html',
    styleUrls: ['./gravity2025-dialog.component.scss'],
    standalone: false
})
export class Gravity2025DialogComponent {
  
  dataChanges$ = new Subject<any>();

  constructor(
    public dialogRef: MatDialogRef<Gravity2025DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onSave() {
    this.dialogRef.close(this.data);
  }

  onCancel() {
    this.dialogRef.close(null);
  }

  sendUpdate(preset?: number) {
    this.dataChanges$.next({
      showAxes: this.data.showAxes,
      showStars: this.data.showStars,
      rotateStars: this.data.rotateStars,
      drawTrails: this.data.drawTrails,
      drawVelocityArrow: this.data.drawVelocityArrow,
      drawAccelerationArrow: this.data.drawAccelerationArrow,
      preset: preset
    });
  }
}