import { Component, OnInit } from '@angular/core';
import { GridDataResult, GroupKey } from '@progress/kendo-angular-grid';
import {
  orderBy,
  process,
  SortDescriptor,
  State,
} from '@progress/kendo-data-query';
import { historyData } from 'src/data/employee-data';

@Component({
  selector: 'app-employee-history',
  templateUrl: './employee-history.component.html',
  styleUrls: ['./employee-history.component.scss'],
})
export class EmployeeHistoryComponent implements OnInit {
  state: State = {
    group: [],
  };
  history: GridDataResult;
  historyColumns: any = [
    {
      Name: 'date',
      isCheck: true,
      Text: 'Date',
      isDisable: false,
      index: 0,
      width: 100,
      hide: true,
    },
    {
      Name: 'user',
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

  constructor() {
    // this.history = process(historyData, this.state);
  }

  ngOnInit(): void {}

  onResizeColumn(event) {}

  onSelectionChange(event) {}

  onSortChange(sort: SortDescriptor[]) {
    this.historySort = sort;
    this.history = process(orderBy(historyData, sort), this.state);
  }

  onReOrderColumns(event) {}

  onDataStateChange(event) {
    this.state = event;
    // this.history = process(historyData, this.state);
  }

  groupChange() {
    this.expandedGroupKeys = [];
  }
}
