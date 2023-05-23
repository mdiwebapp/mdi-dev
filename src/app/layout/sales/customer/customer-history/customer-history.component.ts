import {
  Component,
  OnInit,
  OnChanges,
  SimpleChanges,
  Input,
} from '@angular/core';
import { orderBy, SortDescriptor } from '@progress/kendo-data-query';
import { DataService } from 'src/app/core/services';

@Component({
  selector: 'app-customer-history',
  templateUrl: './customer-history.component.html',
  styleUrls: ['./customer-history.component.scss'],
})
export class CustomerHistoryComponent implements OnInit, OnChanges {
  @Input() selectedCustomer: any;
  histories: any = [];
  historyColumns: any = [
    {
      Name: 'createdBy',
      isCheck: true,
      Text: 'User',
      isDisable: false,
      index: 0,
      width: 100,
      hide: true,
    },
    {
      Name: 'field',
      isCheck: true,
      Text: 'Field',
      isDisable: false,
      index: 0,
      width: 100,
      hide: true,
    },
    {
      Name: 'oldValue',
      isCheck: true,
      Text: 'Old Value',
      isDisable: false,
      index: 0,
      width: 100,
      hide: true,
    },
    {
      Name: 'newValue',
      isCheck: true,
      Text: 'New Value',
      isDisable: false,
      index: 0,
      width: 100,
      hide: true,
    },
  ];
  historySelection: number[] = [];
  historySort: SortDescriptor[] = [];
  skip: number = 0;
  multiple: boolean = false;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    this.getCustomerHistory();
  }

  onResizeColumn(event) {}

  onSelectionChange(event) {}

  onSortChange(sort: SortDescriptor[]) {
    this.historySort = sort;
    this.histories = orderBy(this.histories, sort);
  }

  onReOrderColumns(event) {}

  onDataStateChange(event) {}

  getCustomerHistory() {
    this.dataService
      .get(`Customer/${this.selectedCustomer?.id}/History`)
      .subscribe((result: any) => {
        if (result?.length) {
          this.histories = result;
        } else {
          this.histories = [];
        }
      });
  }
}
