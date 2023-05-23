import { Component, Input, OnInit } from '@angular/core';
import { process } from '@progress/kendo-data-query';
import { CustomerService } from '../customer/customer.service';
import { ModuleNames, ErrorMessages } from 'src/app/core/constant';
import { ErrorHandlerService } from 'src/app/core/services';

@Component({
  selector: 'app-customer-history',
  templateUrl: './customer-history.component.html',
  styleUrls: ['./customer-history.component.scss'],
})
export class CustomerHistoryComponent implements OnInit {
  history: any;
  @Input() onChange;
  data: any;
  historyFilter: any;
  constructor(
    public customerService: CustomerService,
    public errorHandler: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    this.onChange.subscribe((res) => {
      if (res) {
        this.data = res;
        this.GetHistory(this.data.id);
      }
    });
  }
  GetHistory(id) {
    debugger;
    this.customerService.GetHistoryByCustomerId(id).subscribe(
      (res) => {
        if (res) {
          this.history = res;
          this.historyFilter = res;
        }
      },
      (error) => {
        this.errorHandler.handleError(
          error,
          ModuleNames.customer_history,
          ErrorMessages.customer.get_history_by_customer_id
        );
      }
    );
  }

  public onFilter(inputValue: string): void {
    this.history = process(this.historyFilter, {
      filter: {
        logic: 'or',
        filters: [
          {
            field: 'createdDate',
            operator: 'contains',
            value: inputValue,
          },
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
        ],
      },
    }).data;
  }
}
