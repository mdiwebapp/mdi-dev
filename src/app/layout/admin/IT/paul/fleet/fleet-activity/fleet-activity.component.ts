import { Component, OnInit } from '@angular/core';

import { FleetActivityService } from './fleet-activity.service';
import { orderBy, process, SortDescriptor } from '@progress/kendo-data-query';
import { ErrorHandlerService } from 'src/app/core/services';
import { ModuleNames, ErrorMessages } from 'src/app/core/constant';
import { ViewColumnsActivityList } from './../../../../../../../data/fleet-data';

@Component({
  selector: 'app-fleet-activity',
  templateUrl: './fleet-activity.component.html',
  styleUrls: ['./fleet-activity.component.scss'],
})
export class FleetActivityComponent implements OnInit {
  filterText: string;
  fromData: Date;
  toData: any;
  daysData: any;
  customerData: any;
  jobData: any;
  hoursData: any;
  userData: any;
  activityGridColumn: any;
  strTransfers: string = '';
  blFirst: boolean = false;
  strLastDate: string = '';
  strEndHours: string = '';
  iRow: number = 0;
  constructor(
    public service: FleetActivityService,
    public errorHandler: ErrorHandlerService
  ) {
    this.activityGridColumn = ViewColumnsActivityList;
  }
  intTranRow: number;
  blTransfer: boolean;
  data: any = [];
  history: any = [];
  multiple: boolean = false;
  tempData: any = [];
  dataJob: any = [];
  tempDataJob: any = [];
  dataDrivers: any = [];
  tempDataDrivers: any = [];
  vendor: any;
  jobId: any;
  driverId: any;
  FHData: any = [];
  TransferData: any = [];
  public skip = 0;
  public sort: SortDescriptor[] = [
    {
      field: 'date',
      dir: 'asc',
    },
  ];

  public mySelection: number[] = [0];
  ngOnInit(): void {}
  activityList(data) {
    this.data = [];
    this.tempData = [];
    this.FHData=[];
    this.service.GetFleetHistory(data).subscribe(
      (res) => {
        if(res.length > 0) {
        this.FHData = res.map((x) => {return {"intdays": Math.floor(x.days),...x}});
        }
        else {
          this.FHData = [];
        }
      },
      (error) => {
        this.errorHandler.handleError(
          error,
          ModuleNames.fleet,
          ErrorMessages.fleet.get_activity_list
        );
      }
    );
  }
  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.data = {
      data: orderBy(this.FHData, this.sort),
      total: this.FHData.length,
    };
    this.FHData = this.data.data;
  }
  public changeJob() {
    this.data = this.tempData;
    if (this.jobId) {
      this.data = this.data.filter((c) => c.job == this.jobId);
    }
    if (this.driverId) {
      this.data = this.data.filter((c) => c.employeeDriver == this.driverId);
    }
  }
  public changeDriver() {
    this.data = this.tempData;

    if (this.jobId) {
      this.data = this.data.filter((c) => c.job == this.jobId);
    }
    if (this.driverId) {
      this.data = this.data.filter((c) => c.employeeDriver == this.driverId);
    }
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

  jobToFilter(value) {
    this.dataJob = this.tempDataJob.filter(
      (s) => s.value.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }
  driverToFilter(value) {
    this.dataDrivers = this.tempDataDrivers.filter(
      (s) => s.value.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }
}
