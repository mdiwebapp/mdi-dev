import { Component, OnInit } from '@angular/core';
import { SortDescriptor } from '@progress/kendo-data-query';

@Component({
  selector: 'app-employee-notes',
  templateUrl: './employee-notes.component.html',
  styleUrls: ['./employee-notes.component.scss'],
})
export class EmployeeNotesComponent implements OnInit {
  notes: any = [];
  notesSort: SortDescriptor[] = [];
  notesSelection: number[] = [];
  isNewNotes: boolean = false;

  skip: number = 0;
  multiple: boolean = false;

  constructor() {
    this.notes = [
      {
        createdDate: new Date(),
        userName: 'Kevin Abernathy',
        subject: 'Test',
        note: 'Test',
      },
    ];
  }

  ngOnInit(): void {}

  onResizeColumn(event) {}

  onSelectionChange(event) {}

  onSortChange(event) {}

  onReOrderColumns(event) {}

  onDataStateChange(event) {}

  onNewNote() {
    this.isNewNotes = !this.isNewNotes;
  }
}
