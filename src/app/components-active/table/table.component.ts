import { Component, HostListener, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss'],
    standalone: false
})
export class TableComponent implements OnInit {
  
  constructor(private _snackBar: MatSnackBar) {}

  tableData: any = []
  columns: any = []
  editing = false
  tableArchive: any;
  innerWidth: any;

  ngOnInit() {
    this.dummyTable()
    this.onResize()
  }
  
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.innerWidth = window.innerWidth;
  }

  dummyTable() {
    this.tableData = []
    this.columns = ["ID"]
    for (let i=1; i <= 5; i++) { // rows
      let row: any = {}
      row.ID = i
      row.colour = "white"
      for (let j=1; j <= 7; j++) { // columns
        let colName = `Column ${j}`
        row[colName] = (Math.random()*100).toFixed(2)
        if (!this.columns.includes(colName)) {
          this.columns.push(colName)
        }
      }
      this.tableData.push(row)
    }
  }

  edit(row: any) {
    this.tableArchive = JSON.parse(JSON.stringify(this.tableData))
    this.editing = true
    row.edit = true
    for (let r of this.tableData) {
      r.colour = "lightgrey"
    }
    row.colour = "white"
  }

  cancel() {
    this.editing = false
    this.tableData = JSON.parse(JSON.stringify(this.tableArchive))
  }

  save() {
    this._snackBar.open("Row Saved!", "", {
      duration: 2000,
    });
    this.editing = false
    for (let r of this.tableData) {
      r.colour = "white"
      r.edit = false
    }
  }

  delete(row: any) {
    console.log(row)
    for (let i in this.tableData) {
      if (this.tableData[i].ID == row.ID) {
        this.tableData.splice(i, 1)
      }
    }
    this.tableData = [...this.tableData]
    if (this.tableData.length == 0) {
      this.dummyTable()
      this._snackBar.open("Table Repopulated!", "", {
        duration: 2000,
      });
    } else {
      this._snackBar.open("Row Deleted!", "", {
        duration: 2000,
      });
    }
  }

}
