import { Component, HostListener, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button'; // Needed for mat-mini-fab

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Default,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule
  ],
})
export class TableComponent implements OnInit {
  
  constructor(private _snackBar: MatSnackBar) {}

  tableData: any = [];
  columns: any = [];
  editing = false;
  tableArchive: any;
  innerWidth: any;

  // Track sorting state natively
  sortColumn: string = 'ID';
  sortAscending: boolean = true;

  ngOnInit() {
    this.dummyTable();
    this.onResize();
  }
  
  @HostListener('window:resize', [])
  onResize() {
    this.innerWidth = window.innerWidth;
  }

  dummyTable() {
    this.tableData = [];
    this.columns = ["ID"];
    for (let i = 1; i <= 5; i++) {
      let row: any = {};
      row.ID = i;
      row.colour = "white";
      for (let j = 1; j <= 7; j++) {
        let colName = `Column ${j}`;
        row[colName] = (Math.random() * 100).toFixed(2);
        if (!this.columns.includes(colName)) {
          this.columns.push(colName);
        }
      }
      this.tableData.push(row);
    }
  }

  // Native sorting logic
  sortTable(colName: string) {
    if (this.sortColumn === colName) {
      this.sortAscending = !this.sortAscending;
    } else {
      this.sortColumn = colName;
      this.sortAscending = true;
    }

    this.tableData.sort((a: any, b: any) => {
      let valA = a[colName];
      let valB = b[colName];
      
      // Attempt numeric sort if possible
      if (!isNaN(Number(valA)) && !isNaN(Number(valB))) {
        valA = Number(valA);
        valB = Number(valB);
      }

      if (valA < valB) return this.sortAscending ? -1 : 1;
      if (valA > valB) return this.sortAscending ? 1 : -1;
      return 0;
    });
  }

  edit(row: any) {
    this.tableArchive = JSON.parse(JSON.stringify(this.tableData));
    this.editing = true;
    row.edit = true;
    for (let r of this.tableData) {
      r.colour = "#f5f5f5"; // Native lightgrey
    }
    row.colour = "white";
  }

  cancel() {
    this.editing = false;
    this.tableData = JSON.parse(JSON.stringify(this.tableArchive));
  }

  save() {
    this._snackBar.open("Row Saved!", "", { duration: 2000 });
    this.editing = false;
    for (let r of this.tableData) {
      r.colour = "white";
      r.edit = false;
    }
  }

  delete(row: any) {
    this.tableData = this.tableData.filter((r: any) => r.ID !== row.ID);
    if (this.tableData.length == 0) {
      this.dummyTable();
      this._snackBar.open("Table Repopulated!", "", { duration: 2000 });
    } else {
      this._snackBar.open("Row Deleted!", "", { duration: 2000 });
    }
  }
}