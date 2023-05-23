import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  ViewColumns,
  ServiceHistoryData,
  ViewSubColumns,
  ServiceSubHistoryData,
} from '../../../../../data/service-history-data';
import {
  orderBy,
  process,
  SortDescriptor,
  State,
} from '@progress/kendo-data-query';
import { ErrorMessages, ModuleNames } from 'src/app/core/constant';
import { ErrorHandlerService } from 'src/app/core/services';
import { ComponentsService } from 'src/app/layout/logistics/components/components/components.service';

@Component({
  selector: 'app-service-history',
  templateUrl: './service-history.component.html',
  styleUrls: ['./service-history.component.scss'],
})
export class ServiceHistoryComponent implements OnInit {
  form: FormGroup;
  public viewColumns: any;
  serviceHistoryData: any;
  public viewSubColumns: any;
  serviceSubHistoryData: any;
  data: any;
  serviceNote: any;
  filterText: string;
  filterDetailText: string;

  tempData: any = [];
  dataServiceDetail: any = [];
  tempDataServiceDetail: any = [];
  vehicleNumber: string;
  public skip = 0;

  public mySelection: number[] = [0];

  public sort: SortDescriptor[] = [
    {
      field: 'branch',
      dir: 'asc',
    },
    {
      field: 'serialNumber',
      dir: 'asc',
    },
    {
      field: 'mechanic',
      dir: 'asc',
    },
    {
      field: 'dateRepaired',
      dir: 'asc',
    },
    {
      field: 'status',
      dir: 'asc',
    },
  ];

  data1: any;
  public sort1: SortDescriptor[] = [
    {
      field: 'partNumber',
      dir: 'asc',
    },
    {
      field: 'description',
      dir: 'asc',
    },
    {
      field: 'qty',
      dir: 'asc',
    },
    {
      field: 'price',
      dir: 'asc',
    },
    {
      field: 'total',
      dir: 'asc',
    },
  ];
  public mySelection1: number[] = [0];

  public defaultSort: SortDescriptor[] = [
    {
      field: 'dateRepaired',
      dir: 'desc',
    },
  ];
  constructor(
    private formBuilder: FormBuilder,
    public errorHandler: ErrorHandlerService,
    public service: ComponentsService
  ) {}

  ngOnInit() {
    this.viewColumns = ViewColumns;
    //this.serviceHistoryData = ServiceHistoryData;
    this.viewSubColumns = ViewSubColumns;
    //this.serviceSubHistoryData = ServiceSubHistoryData;
    this.initForm();
  }
  serviceHistoryList(vehicleNum) {
    this.data = [];
    this.tempData = [];
    this.vehicleNumber = vehicleNum;
    this.service.GetServiceHistory(vehicleNum).subscribe(
      (res) => {
        if (res && res.length > 0) {
          // this.serviceHistoryData = res;
          // this.tempData = res;
          this.sort = this.defaultSort;
          this.data = {
          data: orderBy(res, this.sort),
          total: res.length,
          };
          this.serviceHistoryData = this.data.data;
          this.tempData = this.serviceHistoryData;
          this.mySelection = [0];
          this.dataServiceDetail = [];
          this.tempDataServiceDetail = [];
          this.serviceSubHistoryData = [];
          this.serviceNote = this.serviceHistoryData[0].note;
          this.service
            .GetServiceDetail(this.vehicleNumber, this.serviceHistoryData[0].serviceNumber)
            .subscribe(
              (x) => {
                if (x && x.length > 0) {
                  this.serviceSubHistoryData = x;
                  this.tempDataServiceDetail = x;
                } else {
                  this.serviceSubHistoryData = [];
                  this.tempDataServiceDetail = [];
                }
              },
              (error) => {
                this.onError(error, ErrorMessages.vehicle.get_service_detail);
              }
            );
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
            this.serviceSubHistoryData = res;
            this.tempDataServiceDetail = res;
          } else {
            this.serviceSubHistoryData = [];
            this.tempDataServiceDetail = [];
          }
        },
        (error) => {
          this.onError(error, ErrorMessages.vehicle.get_service_detail);
        }
      );
  }

  initForm(): void {
    // this.form = this.formBuilder.group({
    //   reason: [],
    // });
  }
  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.data = {
      data: orderBy(this.serviceHistoryData, this.sort),
      total: this.serviceHistoryData.length,
    };
    this.serviceHistoryData = this.data.data;
  }
  public sortChange1(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.data1 = {
      data: orderBy(this.serviceSubHistoryData, this.sort),
      total: this.serviceSubHistoryData.length,
    };
    this.serviceSubHistoryData = this.data1.data;
  }

  public onFilter(data: any) {
    this.serviceHistoryData = process(this.tempData, {
      filter: {
        logic: 'or',
        filters: [
          {
            field: 'serviceNumber',
            operator: 'contains',
            value: data,
          },
          {
            field: 'dateRepaired',
            operator: 'contains',
            value: data,
          },
          {
            field: 'status',
            operator: 'contains',
            value: data,
          },
          {
            field: 'employeeName',
            operator: 'contains',
            value: data,
          },
        ],
      },
    }).data;
  }

  public onFilterDetail(data: any) {
    this.serviceSubHistoryData = process(this.tempDataServiceDetail, {
      filter: {
        logic: 'or',
        filters: [
          {
            field: 'serviceNumber',
            operator: 'contains',
            value: data,
          },
          {
            field: 'inventoryType',
            operator: 'contains',
            value: data,
          },
          {
            field: 'partsMemo',
            operator: 'contains',
            value: data,
          },
          {
            field: 'quantity',
            operator: 'contains',
            value: data,
          },
          {
            field: 'listPrice',
            operator: 'contains',
            value: data,
          },
          {
            field: 'total',
            operator: 'contains',
            value: data,
          },
        ],
      },
    }).data;
  }

  private onError(error: any, customMessage?: string) {
    this.errorHandler.handleError(
      error,
      ModuleNames.vehicle_history,
      customMessage
    );
  }
}
