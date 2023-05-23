import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SortDescriptor } from '@progress/kendo-data-query';
import { usersData } from 'src/data/call-logs-data';

@Component({
  selector: 'app-call-log-web-info',
  templateUrl: './call-log-web-info.component.html',
  styleUrls: ['./call-log-web-info.component.scss'],
})
export class CallLogWebInfoComponent implements OnInit, OnChanges {
  @Input() disable: boolean;
  @Input() selectedLog: any = null;
  @Input() form: FormGroup;
  @Input() allEmployees: any = [];
  employee_btn: string = 'Select Employee';
  isEmployeeVisible: boolean = false;
  skip: number = 0;
  sort: SortDescriptor[] = [];
  selections: Array<number> = [0];
  employees: any = usersData;
  employeeColumn = [
    {
      Name: 'id',
      isCheck: true,
      Text: 'EE#',
      isDisable: false,
      index: 0,
      width: 50,
    },
    {
      Name: 'value',
      isCheck: true,
      Text: 'Name',
      isDisable: false,
      index: 0,
      width: 100,
    },
  ];
  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {}

  handleEmployeeDialog() {
    this.isEmployeeVisible = !this.isEmployeeVisible;
  }

  onResizeColumn(event) {}

  onSelectionChange(event) {
    this.form.setValue({
      ...this.form.value,
      assignTo: event.selectedRows[0].dataName,
    });
    this.isEmployeeVisible = false;
  }

  onSortChange(event) {}

  onReOrderColumns(event) {}

  onDataStateChange(event) {}
}
