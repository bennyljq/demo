import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-gravity2025-dialog-gallery',
    templateUrl: './gravity2025-dialog-gallery.component.html',
    styleUrls: ['./gravity2025-dialog-gallery.component.scss'],
    standalone: false
})
export class Gravity2025DialogGalleryComponent {
  dataChanges$ = new Subject<any>();

  constructor(
    public dialogRef: MatDialogRef<Gravity2025DialogGalleryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onCancel() {
    this.dialogRef.close(null);
  }

  sendUpdate(preset?: number) {
    this.dataChanges$.next({
      preset: preset
    });
  }
}
