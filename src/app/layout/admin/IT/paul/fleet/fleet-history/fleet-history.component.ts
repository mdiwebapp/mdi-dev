import { Component, OnInit } from '@angular/core';

import { FleetHistoryService } from './fleet-history.service';
import {
  orderBy,
  process,
  SortDescriptor,
  State,
} from '@progress/kendo-data-query';

@Component({
  selector: 'app-fleet-history',
  templateUrl: './fleet-history.component.html',
  styleUrls: ['./fleet-history.component.scss'],
})
export class FleetHistoryComponent implements OnInit {
  multiple: boolean = false;
  history: any;
  temphistory: any;
  totalCount: any = 0;
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

  constructor(public service: FleetHistoryService) {}

  public data: any;

  ngOnInit() {}
  historyList(data) {
    this.history = [];
    this.service.GetHistoryByFleetId(data).subscribe((res) => {
      if (res.length > 0) {
        this.history = res;
        this.totalCount = res.length;
        this.temphistory = res;
      }
    });
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
