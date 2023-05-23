import { Component, OnInit } from '@angular/core';
import { orderBy, process, SortDescriptor } from '@progress/kendo-data-query';
import { ModuleNames, ErrorMessages } from './../../../../../../core/constant';
import { ErrorHandlerService } from '../../../../../../core/services';
import { FleetInfoService } from '../fleet-info/fleet-info.service';

@Component({
  selector: 'app-fleet-service-history',
  templateUrl: './fleet-service-history.component.html',
  styleUrls: ['./fleet-service-history.component.scss'],
})
export class FleetServiceHistoryComponent implements OnInit {
  multiple: Boolean = false;
  serviceNote: string = '';
  filterText: string;
  filterDetailText: string;

  constructor(
    public errorHandler: ErrorHandlerService,
    private service: FleetInfoService
  ) {}

  data: any = [];
  searviceHeaderParts: any = [];
  tempServiceHeaderParts: any = [];
  tempData: any = [];
  dataServiceDetail: any = [];
  tempDataServiceDetail: any = [];
  inventoryNumber: string;
  public skip = 0;
  public sort: SortDescriptor[] = [
    {
      field: 'date',
      dir: 'asc',
    },
  ];

  public defaultsort: SortDescriptor[] = [
    {
      field: 'repairedDate',
      dir: 'desc',
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
  serviceHistoryList(invNum) {
    this.data = [];
    this.tempData = [];this.searviceHeaderParts=[];this.tempServiceHeaderParts=[];
    this.inventoryNumber = invNum;
    this.service.GetServiceHistory(invNum).subscribe(
      (res) => {
        debugger;
        if (res && res.length > 0) {
          this.tempData = res;
          this.editClick();
          this.mySelection = [0];
          this.dataServiceDetail = [];
          this.tempDataServiceDetail = [];

          this.data = {
            data: orderBy(res, this.defaultsort),
            total: this.data.length,
          };
          this.data = this.data.data;
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.fleet.get_service_history);
      }
    );
  }

  editClick() {
    this.service.GetServiceHistoryHeaderParts(this.inventoryNumber).subscribe(     
      (res) => { this.searviceHeaderParts=[];this.tempServiceHeaderParts=[];
        if (res && res.length > 0) {
          this.searviceHeaderParts = res;
          this.tempServiceHeaderParts = res;
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.fleet.get_service_history);
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
            field: 'repairedDate',
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
    this.searviceHeaderParts = process(this.tempServiceHeaderParts, {
      filter: {
        logic: 'or',
        filters: [
          {
            field: 'partNumber',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'description',
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
        ],
      },
    }).data;
    this.mySelection = [0];
  }

  private onError(error: any, customMessage?: string) {
    this.errorHandler.handleError(error, ModuleNames.fleet, customMessage);
  }
}
