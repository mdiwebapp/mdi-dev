import { Component, OnInit } from '@angular/core';
import { orderBy, process, SortDescriptor } from '@progress/kendo-data-query';
import { VehicleService } from '../vehicle.service';
import { ModuleNames, ErrorMessages } from 'src/app/core/constant';
import { ErrorHandlerService } from 'src/app/core/services';

@Component({
  selector: 'app-vehicle-activity',
  templateUrl: './vehicle-activity.component.html',
  styleUrls: ['./vehicle-activity.component.scss'],
})
export class VehicleActivityComponent implements OnInit {
  filterText: string;

  constructor(
    public service: VehicleService,
    public errorHandler: ErrorHandlerService
  ) {}

  data: any = [];
  tempData: any = [];
  dataJob: any = [];
  tempDataJob: any = [];
  dataDrivers: any = [];
  tempDataDrivers: any = [];
  vendor: any;
  jobId: any;
  driverId: any;

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
    this.service.GetActivityList(data).subscribe(
      (res) => {
        this.data = res.mileages;
        this.tempData = res.mileages;

        this.dataJob = res.jobs;
        this.tempDataJob = res.jobs;
        this.dataDrivers = res.drivers;
        this.tempDataDrivers = res.drivers;
      },
      (error) => {
        this.errorHandler.handleError(
          error,
          ModuleNames.vehicle_activity,
          ErrorMessages.vehicle.get_activity_list
        );
      }
    );
  }
  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.data = {
      data: orderBy(this.data, this.sort),
      total: this.data.length,
    };
    this.data = this.data.data;
  }
  public changeJob() {
    this.data = this.tempData;
    if (this.jobId) {
      this.data = this.data.filter((c) => c.job == this.jobId);
    }
    if (this.driverId) {
      this.data = this.data.filter((c) => c.employeeDriver == this.driverId);
    }
    // this.data = process(this.tempData, {
    //   filter: {
    //     logic: 'and',
    //     filters: [
    //       {
    //         field: 'job',
    //         operator: 'contains',
    //         value: this.jobId,
    //       },
    //       {
    //         field: 'employeeDriver',
    //         operator: 'contains',
    //         value: this.driverId,
    //       },
    //     ],
    //   },
    // }).data;
  }
  public changeDriver() {
    this.data = this.tempData;

    if (this.jobId) {
      this.data = this.data.filter((c) => c.job == this.jobId);
    }
    if (this.driverId) {
      this.data = this.data.filter((c) => c.employeeDriver == this.driverId);
    }
    // this.data = process(this.tempData, {
    //   filter: {
    //     logic: 'and',
    //     filters: [
    //       {
    //         field: 'job',
    //         operator: 'contains',
    //         value: this.jobId,
    //       },
    //       {
    //         field: 'employeeDriver',
    //         operator: 'contains',
    //         value: this.driverId,
    //       },
    //     ],
    //   },
    // }).data;
  }
  public onFilter(inputValue: string): void {
    this.filterText = inputValue;
    this.mySelection = [];
    this.data = process(this.tempData, {
      filter: {
        logic: 'or',
        filters: [
          {
            field: 'vehicleDate',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'job',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'employeeDriver',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'startMileage',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'endMileage',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'miles',
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
