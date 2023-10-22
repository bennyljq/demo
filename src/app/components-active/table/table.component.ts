import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

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
    this.editing = false
    for (let r of this.tableData) {
      r.colour = "white"
      r.edit = false
    }
  }

  delete(row: any) {
    for (let i in this.tableData) {
      if (this.tableData[i].ID == row.ID) {
        this.tableData.splice(i, 1)
      }
    }
    if (this.tableData.length == 0) {
      this.dummyTable()
    }
  }

}
