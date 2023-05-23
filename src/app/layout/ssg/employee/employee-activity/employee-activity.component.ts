import { Component, OnInit } from '@angular/core';
import { process } from '@progress/kendo-data-query';
import { EmployeeService } from '../employee/employee.service';
import { ModuleNames, ErrorMessages } from 'src/app/core/constant';
import { ErrorHandlerService } from 'src/app/core/services';
@Component({
  selector: 'app-employee-activity',
  templateUrl: './employee-activity.component.html',
  styleUrls: ['./employee-activity.component.scss'],
})
export class EmployeeActivityComponent implements OnInit {
  activity: any=[];
  otherActivity: any;
  otherActivityFilter: any;
  activityFilter: any=[];
  used: number = 0;
  beginning: number = 25;
  multiple: boolean = false;
  isbeginningVisible: boolean = true;
  isEdit: boolean = true;
  remaining: number = 25;
  constructor(
    public employeeService: EmployeeService,
    public errorHandler: ErrorHandlerService
  ) { }

  ngOnInit(): void { }
  btnEdit() {
    this.isbeginningVisible = false;
    this.isEdit = false;
  }
  btnCancel() {
    this.isbeginningVisible = true;
    this.isEdit = true
  }
  EmployeeActivity(id) {
    this.employeeService.GetEmployeeActivity(id).subscribe((res) => {
      if (res) {
        this.activity = res.ptoList;
        this.activityFilter = res.ptoList;
        this.beginning = res.start == null ? 0 : res.start;
        this.used = res.used == null ? 0 : res.end;
        this.remaining = res.end == null ? 0 : res.end;
      }
    },
      (error) => {
        this.errorHandler.handleError(
          error,
          ModuleNames.employee_activity,
          ErrorMessages.employee.get_activity
        );
      });
  }
  onSave(){
    this.isbeginningVisible = true;
    this.isEdit = true
  }
  OtherGridActivity(id) {
    this.employeeService.GetOtherGridActivity(id).subscribe((res) => {
      if (res) {
        this.otherActivity = res;
        this.otherActivityFilter = res;
      }
    }, (error) => {
      this.errorHandler.handleError(
        error,
        ModuleNames.employee_activity,
        ErrorMessages.employee.get_activity
      );
    });
  }
  beginningChange() {
    this.remaining = this.beginning - this.used;
  }

  public onFilter(inputValue: string): void {

    this.activity = process(this.activityFilter, {
      filter: {
        logic: 'or',
        filters: [
          {
            field: 'workDate',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'approvedBy',
            operator: 'contains',
            value: inputValue,
          }
        ],
      },
    }).data;
  }
  public onFilterOther(inputValue: string): void {

    this.otherActivity = process(this.otherActivityFilter, {
      filter: {
        logic: 'or',
        filters: [
          {
            field: 'date',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'type',
            operator: 'contains',
            value: inputValue,
          }
        ],
      },
    }).data;
  }
}
