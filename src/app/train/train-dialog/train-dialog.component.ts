import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-train-dialog',
    templateUrl: './train-dialog.component.html',
    styleUrls: ['./train-dialog.component.scss'],
    standalone: false
})
export class TrainDialogComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<TrainDialogComponent>
    ) { }


  async ngOnInit() {
  }

  log(x: any) {
    console.log(x)
  }

  confirm() {
    this.dialogRef.close({
      action: 'confirm'
    })
  }

}
