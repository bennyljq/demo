import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-gravity2025-dialog-velocity',
  templateUrl: './gravity2025-dialog-velocity.component.html',
  styleUrls: ['./gravity2025-dialog-velocity.component.scss']
})
export class Gravity2025DialogVelocityComponent {
  dataChanges$ = new Subject<any>();

  constructor(
    public dialogRef: MatDialogRef<Gravity2025DialogVelocityComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onCancel() {
    this.dialogRef.close(null);
  }

}
