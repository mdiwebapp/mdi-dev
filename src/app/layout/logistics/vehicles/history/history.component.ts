import { Component, OnInit } from '@angular/core';
import { orderBy, process, SortDescriptor } from '@progress/kendo-data-query';
import { VehicleService } from '../vehicle.service';
import { ModuleNames, ErrorMessages } from 'src/app/core/constant';
import { ErrorHandlerService } from 'src/app/core/services';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
})
export class HistoryComponent implements OnInit {
  history: any[];
  temphistory: any[];
  constructor(
    public service: VehicleService,
    public errorHandler: ErrorHandlerService
  ) { }

  data: any;
  vendor: any;
  branchId: any;
  branch: any;
  public skip = 0;
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

  ngOnInit(): void { }

  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.data = {
      data: orderBy(this.temphistory, this.sort),
      total: this.temphistory.length,
    };
    this.history = this.data.data;
  }
  historyList(data) {
    this.history = [];
    this.temphistory = [];
    this.service.GetHistoryByVehicleId(data.id).subscribe(
      (res) => {
        if (res && res.length > 0) {
          this.history = res;
          this.temphistory = res;
        }
      },
      (error) => {
        this.errorHandler.handleError(
          error,
          ModuleNames.vehicle_history,
          ErrorMessages.vehicle.get_history_by_vehicle_id
        );
      }
    );
  }
  public onFilter(inputValue: string): void {
    this.data = process(this.temphistory, {
      filter: {
        logic: 'or',
        filters: [
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
          {
            field: 'createdDate',
            operator: 'contains',
            value: inputValue,
          },
        ],
      },
    }).data;

    this.history = this.data;
    // this.editContactClick(this.data[0].id);
  }
}
