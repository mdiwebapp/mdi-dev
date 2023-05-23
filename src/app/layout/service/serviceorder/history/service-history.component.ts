import { Component, OnInit } from '@angular/core';
import { orderBy, process, SortDescriptor } from '@progress/kendo-data-query';
import { ErrorHandlerService } from '../../../../core/services';
import { ServiceOrderService } from '../service-order/service-order.service';
import { ErrorMessages, ModuleNames } from 'src/app/core/constant';

@Component({
  selector: 'app-service-common-history',
  templateUrl: './service-history.component.html',
  styleUrls: ['./service-history.component.scss'],
})
export class ServiceCommmonHistoryComponent implements OnInit {
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

  constructor(public errorHandler: ErrorHandlerService, public service: ServiceOrderService) { }

  public data: any;

  ngOnInit() { }

  historyList(data) {
    this.history = [];
    this.temphistory = [];
    this.service.GetHistoryList(data).subscribe(
      (res) => {
        if (res && res.length > 0) {
          this.history = res;
          this.temphistory = res;
        }
      },
      (error) => {
        // this.errorHandler.handleError(
        //   error,
        //   ModuleNames.parts_history,
        //   ErrorMessages.parts.get_history_list
        // );
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
