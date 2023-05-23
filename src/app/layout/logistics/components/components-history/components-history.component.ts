import { Component, OnInit } from '@angular/core';
import {
  orderBy,
  process,
  SortDescriptor,
  State,
} from '@progress/kendo-data-query';
import { ErrorMessages, ModuleNames } from 'src/app/core/constant';
import { ErrorHandlerService } from 'src/app/core/services';
import { ComponentsService } from '../components/components.service';

@Component({
  selector: 'app-components-history',
  templateUrl: './components-history.component.html',
  styleUrls: ['./components-history.component.scss'],
})
export class ComponentsHistoryComponent implements OnInit {

  history: any[];
  temphistory: any[];
  data: any;
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
  public mySelection: number[] = [0];
  constructor(public service: ComponentsService, public errorHandler: ErrorHandlerService) { }

  ngOnInit(): void { }

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
        this.errorHandler.handleError(
          error,
          ModuleNames.components,
          ErrorMessages.components.save_info
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
