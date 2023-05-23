import { Component, OnInit } from '@angular/core';

import { VendorHistoryService } from './vendor-history.service';
import {
  orderBy,
  process,
  SortDescriptor,
  State,
} from '@progress/kendo-data-query';
import { ModuleNames, ErrorMessages } from 'src/app/core/constant';
import { ErrorHandlerService } from 'src/app/core/services';
@Component({
  selector: 'app-vendor-history',
  templateUrl: './vendor-history.component.html',
  styleUrls: ['./vendor-history.component.scss'],
})
export class VendorHistoryComponent implements OnInit {
  history: any;
  temphistory: any;
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

  constructor(
    public service: VendorHistoryService,
    public errorHandler: ErrorHandlerService
  ) {}

  public data: any;

  ngOnInit() {}

  historyList(data) {
    this.history = [];
    this.temphistory = [];
    this.service.GetHistoryByVendorId(data.id).subscribe(
      (res) => {
        if (res && res.length > 0) {
          this.history = res;
          this.temphistory = res;
        }
      },
      (error) => {
        this.errorHandler.handleError(
          error,
          ModuleNames.vendor_history,
          ErrorMessages.vendor.get_history_by_vendor_id
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
