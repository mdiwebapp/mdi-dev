import { Component, OnInit } from '@angular/core';
import { orderBy, process, SortDescriptor } from '@progress/kendo-data-query';
import { ModuleNames, ErrorMessages } from 'src/app/core/constant';
import { ErrorHandlerService } from 'src/app/core/services';
import { ProjectService } from './../projects.service';
@Component({
  selector: 'app-project-history',
  templateUrl: './project-history.component.html',
  styleUrls: ['./project-history.component.scss'],
})
export class ProjectHistoryComponent implements OnInit {
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

  constructor(public errorHandler: ErrorHandlerService, public projectService: ProjectService) { }

  public data: any;

  ngOnInit() { }

  historyList(data) {
    this.history = [];
    this.temphistory = [];
  }
  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.data = {
      data: orderBy(this.temphistory, this.sort),
      total: this.temphistory.length,
    };
    this.history = this.data.data;
  }

  //#region Bind History 
  getHistoryList(data) {
    this.history = [];
    this.temphistory = [];
    if (data) {
      this.projectService.getHistoryByJobNumber(data).subscribe(
        (res) => {
          if (res && res.length > 0) {
            this.history = res;
            this.temphistory = res;
          }
        },
        (error) => {
          this.errorHandler.handleError(
            error,
            ModuleNames.project_history,
            // ErrorMessage.
          )
        }
      )
    }
  }
  //#endregion

  //#region Search 
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
  //#endregion
}
