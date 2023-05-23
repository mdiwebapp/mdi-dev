import { Component, OnInit } from '@angular/core';
import { ErrorMessages, ModuleNames } from 'src/app/core/constant';
import { ErrorHandlerService } from 'src/app/core/services';
import { DevicesService } from '../devices/devices.service';
import { orderBy, process, SortDescriptor, State } from '@progress/kendo-data-query';
@Component({
  selector: 'app-devices-history',
  templateUrl: './devices-history.component.html',
  styleUrls: ['./devices-history.component.scss']
})
export class DevicesHistoryComponent implements OnInit {
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
  public data: any;
  constructor(public service: DevicesService,
    public errorHandler: ErrorHandlerService) { }

  ngOnInit(): void {
  }

  historyList(data) {
    this.history = [];
    this.temphistory = [];
    this.service.GetHistoryList(data.id).subscribe(
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
      dir: "asc"
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
