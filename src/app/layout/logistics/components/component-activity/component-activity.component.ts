import { Component, OnInit } from '@angular/core';

import {
  orderBy,
  process,
  SortDescriptor,
  State,
} from '@progress/kendo-data-query';
import { ErrorMessages, ModuleNames } from 'src/app/core/constant';
import { ErrorHandlerService } from 'src/app/core/services';
import { ViewColumnsActivityList } from 'src/data/fleet-data';
import { ComponentsService } from '../components/components.service';

@Component({
  selector: 'app-component-activity',
  templateUrl: './component-activity.component.html',
  styleUrls: ['./component-activity.component.scss'],
})
export class ComponentActivityComponent implements OnInit {
  filterText: string;
  fromData: any;
  toData: any;
  daysData: any;
  customerData: any;
  jobData: any;
  hoursData: any;
  userData: any;
  activityGridColumn: any;
  strTransfers: string = '';
total:number=0;
  history: any;
  temphistory: any;
  public data: any;
  public tempData: any;
  public sort: SortDescriptor[] = [
    {
      field: 'createdDate',
      dir: 'asc',
    },
    {
      field: 'createdBy',
      dir: 'asc',
    },
    {
      field: 'field',
      dir: 'asc',
    },
    {
      field: 'oldValue',
      dir: 'asc',
    },
    {
      field: 'newValue',
      dir: 'asc',
    },
  ];

  public mySelection: number[] = [0];
  constructor(
    public service: ComponentsService,
    public errorHandler: ErrorHandlerService
  ) {
    this.activityGridColumn = ViewColumnsActivityList;
  }

  ngOnInit() { }

  activityList(data) {
    this.data = [];
    this.tempData = [];
    this.service.GetFleetHistory(data).subscribe(
      (res) => {
        this.data=res;
        this.total=this.data.length;
        // var adorsFH = res;
        // res.forEach((element) => {
        //   var date1 = new Date(element.tranDate);
        //   var date2 = new Date(element.tranDate);
        //   switch (element.location) {
        //     case 'YARD':
        //       if (this.strTransfers == '') {
        //         if (element.tranDirection == '+') {
        //           this.fromData = element.tranDate;
        //         }
        //         if (element.tranDirection == '-') {
        //           this.toData = element.tranDate;
        //         }
        //         if (element.tranDirection == '-') {
        //           this.daysData = Math.floor(
        //             (this.fromData.getTime() - this.toData.getTime()) /
        //             1000 /
        //             60 /
        //             60 /
        //             24
        //           );
        //         } else {
        //           this.daysData = Math.floor(
        //             (this.fromData.getTime() - this.toData.getTime()) /
        //             1000 /
        //             60 /
        //             60 /
        //             24
        //           );
        //         }
        //         if (element.description == 'ansfer') {
        //           this.customerData = '';
        //         } else {
        //           this.customerData = element.description;
        //         }
        //         if (element.tranDirection == '-') {
        //           this.jobData =
        //             element.branchLocation + '>>' + element.branchLocation;
        //         } else {
        //           this.jobData =
        //             element.branchLocation + '>>' + element.branchLocation;
        //         }
        //         this.hoursData = element.hours;
        //         this.userData = element.userID;
        //       } else {
        //         if (element.description == 'ansfer') {
        //           if (element.tranDirection == '+') {
        //             this.fromData = null;
        //             this.toData = element.tranDate;
        //             this.daysData = null;
        //             this.customerData = 'Transfer';
        //             this.jobData = '>>' + element.branchLocation;
        //             this.hoursData = element.hours;
        //             this.userData = element.userID;
        //           } else {
        //             this.fromData = null;
        //             this.toData = element.tranDate;
        //             this.daysData = 0;
        //             this.customerData = 'TRANSFER INCOMPLETE';
        //             this.jobData = element.branchLocation + '>> ???';
        //             this.hoursData = element.hours;
        //             this.userData = element.userID;
        //           }
        //         }
        //       }
        //       break;
        //     // case 'employees':
        //     //   this.isEmployeeVisible = !this.isEmployeeVisible;
        //     //   break;
        //     // case 'branch':
        //     //   this.isBranchVisible = !this.isBranchVisible;
        //     //   break;
        //     // case 'status':
        //     //   this.isStatusVisible = !this.isStatusVisible;
        //     //   break;
        //     default:
        //       if (element.tranDirection == '+') {
        //         this.fromData = element.tranDate;
        //       }
        //       if (element.tranDirection == '-') {
        //         this.toData = element.tranDate;
        //       }
        //       if (element.tranDirection == '-') {
        //         // if (this.fromData.getTime()) {
        //         //   this.daysData = Math.floor(
        //         //     (this.fromData.getTime() - this.toData.getTime()) /
        //         //     1000 /
        //         //     60 /
        //         //     60 /
        //         //     24
        //         //   );
        //         // } else {
        //         this.daysData = 0;
        //         //}
        //       } else {
        //         // if (this.fromData.getTime()) {
        //         //   this.daysData = Math.floor(
        //         //     (this.fromData.getTime() - this.toData.getTime()) /
        //         //     1000 /
        //         //     60 /
        //         //     60 /
        //         //     24
        //         //   );
        //         // } else {
        //         this.daysData = 0;
        //         //}
        //       }
        //       if (element.description == 'ansfer') {
        //         this.customerData = '';
        //       } else {
        //         this.customerData = element.description;
        //       }
        //       if (element.tranDirection == '-') {
        //         this.jobData =
        //           element.branchLocation + '>>' + element.branchLocation;
        //       } else {
        //         this.jobData =
        //           element.branchLocation + '>>' + element.branchLocation;
        //       }
        //       this.hoursData = element.hours;
        //       this.userData = element.userID;
        //       break;
        //   }
        //   this.data.push({
        //     from: this.fromData,
        //     to: this.toData,
        //     days: this.daysData,
        //     customer: this.customerData,
        //     job: this.jobData,
        //     hours: this.hoursData,
        //     user: this.userData,
        //   });
        // });
        // this.tempData = this.data;

        // this.dataJob = res.jobs;
        // this.tempDataJob = res.jobs;
        // this.dataDrivers = res.drivers;
        // this.tempDataDrivers = res.drivers;
      },
      (error) => {
        this.errorHandler.handleError(
          error,
          ModuleNames.components,
          ErrorMessages.components.save_info
        );
      }
    );
  }

  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.data = {
      data: orderBy(this.temphistory, this.sort),
      total: this.temphistory.length,
    };
    this.history = this.data.data;
  }
  public onFilter(inputValue: string): void {
    this.filterText = inputValue;
    this.mySelection = [];
    this.data = process(this.tempData, {
      filter: {
        logic: 'or',
        filters: [
          {
            field: 'from',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'to',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'days',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'customer',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'job',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'hours',
            operator: 'contains',
            value: inputValue,
          },
        ],
      },
    }).data;
  }
}
