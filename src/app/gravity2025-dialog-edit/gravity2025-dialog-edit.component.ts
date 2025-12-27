import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-gravity2025-dialog-edit',
    templateUrl: './gravity2025-dialog-edit.component.html',
    styleUrls: ['./gravity2025-dialog-edit.component.scss'],
    standalone: false
})
export class Gravity2025DialogEditComponent {
  
  dataChanges$ = new Subject<any>();

  constructor(
    public dialogRef: MatDialogRef<Gravity2025DialogEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onSave() {
    this.dialogRef.close(this.data);
  }

  onCancel() {
    this.dialogRef.close(null);
  }

  sendUpdate() {
    this.dataChanges$.next({
      celestialBodies: this.data.celestialBodies,
    });
  }
}
