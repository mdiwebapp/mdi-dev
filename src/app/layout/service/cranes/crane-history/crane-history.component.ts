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
import { historyData } from 'src/data/employee-data';
import { DataService } from 'src/app/core/services';

@Component({
  selector: 'app-crane-history',
  templateUrl: './crane-history.component.html',
  styleUrls: ['./crane-history.component.scss'],
})
export class CraneHistoryComponent implements OnInit, OnChanges {
  @Input() selectedCrane: any;
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

  ngOnInit(): void {
    // this.onLoadHistory();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.onLoadHistory();
  }

  // ngOnChange() {
  //   this.onLoadHistory();
  // }

  onResizeColumn(event) {}

  onSelectionChange(event) {
    this.onLoadHistory();
  }

  onSortChange(sort: SortDescriptor[]) {
    this.historySort = sort;
    this.history = orderBy(historyData, sort);
    // this.history = process(orderBy(historyData, sort), this.state);
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
      .get(`Crane/${this.selectedCrane?.pk}/History`)
      .subscribe((result: any) => {
        if (result) {
          this.histories = result;
        } else {
          this.histories = [];
        }
      });
  }
}
