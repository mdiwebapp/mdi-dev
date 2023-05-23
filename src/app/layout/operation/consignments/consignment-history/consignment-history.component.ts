import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { GroupKey } from '@progress/kendo-angular-grid';
import {
  orderBy,
  process,
  SortDescriptor,
  State,
} from '@progress/kendo-data-query';
import { DataService } from 'src/app/core/services';
import { historyData } from 'src/data/employee-data';

@Component({
  selector: 'app-consignment-history',
  templateUrl: './consignment-history.component.html',
  styleUrls: ['./consignment-history.component.scss'],
})
export class ConsignmentHistoryComponent implements OnInit, OnChanges {
  @Input() jobNumber: any;
  histories: any = [];
  state: State = {
    group: [],
  };
  history: any = [];
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
  expandedGroupKeys: Array<GroupKey> = [];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    this.onLoadHistory();
  }

  onSelectionChange(event) {
    this.onLoadHistory();
  }

  onResizeColumn(event) {}

  onSortChange(sort: SortDescriptor[]) {
    this.historySort = sort;
    this.history = process(orderBy(historyData, sort), this.state);
  }

  onReOrderColumns(event) {}

  onDataStateChange(event) {
    this.state = event;
  }
  groupChange() {
    this.expandedGroupKeys = [];
  }

  onLoadHistory() {
    this.dataService
      .get(`Project/${this.jobNumber}/History`)
      .subscribe((result: any) => {
        if (result) {
          this.histories = result;
        } else {
          this.histories = [];
        }
      });
  }
}
