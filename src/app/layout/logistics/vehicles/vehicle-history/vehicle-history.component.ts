import { Component, OnInit } from '@angular/core';
import { orderBy, process, SortDescriptor } from '@progress/kendo-data-query';
import { VehicleService } from '../vehicle.service';
import { ModuleNames, ErrorMessages } from 'src/app/core/constant';
import { ErrorHandlerService } from 'src/app/core/services';

@Component({
  selector: 'app-vehicle-history',
  templateUrl: './vehicle-history.component.html',
  styleUrls: ['./vehicle-history.component.scss'],
})
export class VehicleHistoryComponent implements OnInit {
  serviceNote: any;
  filterText: string;
  filterDetailText: string;

  constructor(
    public service: VehicleService,
    public errorHandler: ErrorHandlerService
  ) {}

  data: any = [];
  tempData: any = [];
  dataServiceDetail: any = [];
  tempDataServiceDetail: any = [];
  vehicleNumber: string;
  public skip = 0;
  public sort: SortDescriptor[] = [
    {
      field: 'date',
      dir: 'asc',
    },
  ];
  public mySelection: number[] = [0];

  ngOnInit(): void {}

  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.data = {
      data: orderBy(this.data, this.sort),
      total: this.data.length,
    };
    this.data = this.data.data;
  }
  public sortChangeDetail(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.dataServiceDetail = {
      data: orderBy(this.dataServiceDetail, this.sort),
      total: this.dataServiceDetail.length,
    };
    this.dataServiceDetail = this.dataServiceDetail.data;
  }
  serviceHistoryList(vehicleNum) {
    this.data = [];
    this.tempData = [];
    this.vehicleNumber = vehicleNum;
    this.service.GetServiceHistory(vehicleNum).subscribe(
      (res) => {
        if (res && res.length > 0) {
          this.data = res;
          this.tempData = res;
          this.mySelection = [0];
          this.dataServiceDetail = [];
          this.tempDataServiceDetail = [];
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.vehicle.get_service_history);
      }
    );
  }

  editClick(row) {
    this.dataServiceDetail = [];
    this.tempDataServiceDetail = [];
    var rowData = row.selectedRows[0].dataItem;
    this.serviceNote = rowData.note;
    this.service
      .GetServiceDetail(this.vehicleNumber, rowData.serviceNumber)
      .subscribe(
        (res) => {
          if (res && res.length > 0) {
            this.dataServiceDetail = res;
            this.tempDataServiceDetail = res;
          }
        },
        (error) => {
          this.onError(error, ErrorMessages.vehicle.get_service_detail);
        }
      );
  }

  public onFilter(inputValue: string): void {
    this.filterText = inputValue;
    this.mySelection = [];
    this.data = process(this.tempData, {
      filter: {
        logic: 'or',
        filters: [
          {
            field: 'dateRepaired',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'serviceNumber',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'employeeName',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'status',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'note',
            operator: 'contains',
            value: inputValue,
          },
        ],
      },
    }).data;
    this.mySelection = [0];
  }

  public onFilterDetail(inputValue: string): void {
    this.filterDetailText = inputValue;
    this.mySelection = [];
    this.dataServiceDetail = process(this.tempDataServiceDetail, {
      filter: {
        logic: 'or',
        filters: [
          {
            field: 'serviceNumber',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'Inventory Type',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'partNumber',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'quantity',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'listPrice',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'total',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'partsMemo',
            operator: 'contains',
            value: inputValue,
          },
        ],
      },
    }).data;
    this.mySelection = [0];
  }

  private onError(error: any, customMessage?: string) {
    this.errorHandler.handleError(
      error,
      ModuleNames.vehicle_history,
      customMessage
    );
  }
}
