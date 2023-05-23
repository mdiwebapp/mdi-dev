import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { orderBy, SortDescriptor } from '@progress/kendo-data-query';
import { otherColumns, personalTimecolumns } from 'src/data/employee-data';

@Component({
  selector: 'app-employee-activity-pto',
  templateUrl: './employee-activity-pto.component.html',
  styleUrls: ['./employee-activity-pto.component.scss'],
})
export class EmployeeActivityPtoComponent implements OnInit {
  @Input() employee: FormGroup;
  @Output('onSaveForm') onSaveForm: EventEmitter<any> = new EventEmitter();
  data: any = [];
  sort: SortDescriptor[] = [{ field: 'workDate', dir: 'asc' }];
  selections: any = [];
  skip: number = 0;
  multiple: any = [];
  personalTimecolumns: any = [];
  otherColumns: any = [];
  personalTimeSort: SortDescriptor[] = [];
  otherSort: SortDescriptor[] = [];
  otherSelection: number[] = [0];
  personalTimeSelection: number[] = [0];
  activityForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.personalTimecolumns = personalTimecolumns;
    this.otherColumns = otherColumns;
  }

  ngOnInit(): void {}

  onResizeColumn(event) {}

  onSelectionChange(event) {}

  onSortChange(sort: SortDescriptor[], type) {
    switch (type) {
      case 'personalTime':
        this.personalTimeSort = sort;
        this.personalTimecolumns = orderBy(this.personalTimecolumns, sort);
        break;
      case 'other':
        this.otherSort = sort;
        this.otherColumns = orderBy(this.otherColumns, sort);
        break;
      default:
        break;
    }
  }
  onReOrderColumns(event) {}

  onDataStateChange(event) {}

  onInitActivityForm(form) {
    this.activityForm = this.formBuilder.group({
      beginning: form?.beginning || '',
    });
  }
}
