import { Component, Input, OnInit } from '@angular/core';
import { process, SortDescriptor } from '@progress/kendo-data-query';
import { EmployeeService } from '../employee/employee.service';
import { ModuleNames, ErrorMessages } from 'src/app/core/constant';
import { ErrorHandlerService } from 'src/app/core/services';

@Component({
  selector: 'app-employee-history',
  templateUrl: './employee-history.component.html',
  styleUrls: ['./employee-history.component.scss'],
})
export class EmployeeHistoryComponent implements OnInit {
  history: any;
  @Input() onChange;
  data: any;
  historyFilter: any;
  constructor(
    public employeeService: EmployeeService,
    public errorHandler: ErrorHandlerService
  ) {}

  ngOnInit(): void {}
  GetHistory(id) {
    this.employeeService.GetHistory(id).subscribe(
      (res) => {
        if (res) {
          this.history = res;
          this.historyFilter = res;
        }
      },
      (error) => {
        this.errorHandler.handleError(
          error,
          ModuleNames.employee_history,
          ErrorMessages.employee.get_history
        );
      }
    );
  }

  public onFilter(inputValue: string): void {
    this.history = process(this.historyFilter, {
      filter: {
        logic: 'or',
        filters: [
          {
            field: 'createdDate',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'createdBy',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'field',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'oldValue',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'newValue',
            operator: 'contains',
            value: inputValue,
          },
        ],
      },
    }).data;
  }
}
