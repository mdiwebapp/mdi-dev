import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { orderBy, process, SortDescriptor } from '@progress/kendo-data-query';
import { PagerService } from 'src/app/core/services';
import { TimegridService } from '../time-grid/timegrid.service';
import { PageChangeEvent } from '@progress/kendo-angular-grid';
import { RowClassArgs } from "@progress/kendo-angular-grid";
import { PaginationWithSortRequest } from 'src/app/core/models/pagination.model';
import { UtilityService } from 'src/app/core/services/utility.service';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { Observable, interval, Subscription } from 'rxjs';
import { MenuService } from 'src/app/core/helper/menu.service';

@Component({
  selector: 'app-time-grid',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './time-grid.component.html',
  styleUrls: ['./time-grid.component.scss'],
})
export class TimeGridComponent implements OnInit {
  private updateSubscription: Subscription;
  selectedLog: any = new Date();
  sort: SortDescriptor[] = [{
    field: 'ee',
    dir: 'asc',
  },
  ];
  selections: any = [];
  skip: number = 0;
  multiple: boolean = false;
  visible: boolean = false;
  timeGridSort: SortDescriptor[] = [];
  timecolumns = [
    {
      Name: 'ee',
      isCheck: true,
      Text: 'Employee Name ',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'timeIn',
      isCheck: true,
      Text: 'Time In',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'timeOut',
      isCheck: true,
      Text: 'Time Out',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'job',
      isCheck: true,
      Text: 'Job',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'description',
      isCheck: true,
      Text: 'Description',
      isDisable: false,
      index: 0,
      width: 150,
    },
    {
      Name: 'status',
      isCheck: true,
      Text: 'Status',
      isDisable: false,
      index: 0,
      width: 50,
    }
  ];
  timeData = [];
  tempTimeData = [];
  timeTotal: number = 0;
  public pageSize = 15;
  filterCollection: any = {
    branch: 'GPC',
    searchText: '',
  };
  branchList = [];
  branchAll = [
    // {
    //   id: 0,
    //   value: 'All Branch',
    //   code: null,
    // },
  ];
  constructor(public service: TimegridService, public pagerService: PagerService,
    public menuService: MenuService, private utility: UtilityService, private sanitizer: DomSanitizer) { 
    if (localStorage.getItem('isAdmin') == 'true') {
     
    } else {
      let acc = this.menuService.checkUserViewRights('Time Grid');
        if (acc) {
          //this.utils.toast.error("User does not have rights to access " + name + " module.");Z
        } else {
          this.utility.toast.error(
            'You do not have permissions to access this part of the system. Please contact your supervisor so they can request them from IT.'
          );
          setTimeout(() => {
            var url = '/dashboard';
            location.href = url;
          }, 1000);
        }
      
    }
  }

  ngOnInit(): void {
    this.updateSubscription = interval(300000).subscribe(
      (val) => { this.getAllData();
    });
    this.pagerService.start = 1;
    this.pagerService.pageSize = 15;
    this.GetBranch();
    this.getAllData();
  }
  GetBranch() {
    this.branchList = this.branchAll.concat(
      this.utility.storage.CurrentUser.userBranch
    );
  }
  onSortChange(sort: SortDescriptor[]) {
    this.sort = sort;
    //this.getAllData();
    this.timeData = orderBy(this.timeData, sort);
  }
  getAllData() {
    this.visible = true;

    var request = new PaginationWithSortRequest<any>();
    request.pageSize = this.pagerService.pageSize;
    request.sortColumn = this.sort[0].field;
    request.sortDesc = this.sort[0].dir == 'desc' ? true : false;
    request.request = this.filterCollection;
    if (this.filterCollection.searchText) {
      request.pageNumber = 1;
    } else {
      request.pageNumber = this.pagerService.start;
    }
    this.service.GetTimeGridData(request).subscribe((res) => {
      this.visible = false;this.selectedLog = new Date();
      this.timeData = res.data;
      this.tempTimeData = res.data;
      this.timeTotal = res.totalRecords;
      this.timeData = orderBy(this.timeData, this.sort);
    });
  }
  public onPageChange(e: PageChangeEvent): void {
    this.skip = e.skip;
    this.pageSize = e.take;
    this.pagerService.start = this.skip == 0 ? 1 : (this.skip / this.pageSize) + 1;
    this.getAllData();
  }
  public rowCallback = (context: RowClassArgs) => {
    if (context.dataItem.overhead == 1) {
      return { gold: true };
    }
  };
  data: any;
  public onFilter(inputValue: string): void {

    this.data = process(this.tempTimeData, {
      filter: {
        logic: 'or',
        filters: [
          {
            field: 'ee',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'timeIn',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'timeOut',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'job',
            operator: 'contains',
            value: inputValue,
          }, {
            field: 'description',
            operator: 'contains',
            value: inputValue,
          }, {
            field: 'status',
            operator: 'contains',
            value: inputValue,
          }
        ],
      },
    }).data;

    this.timeData = this.data;

  }

  public colorCode(code: any): SafeStyle {
    let result;
    if(code.overhead == 1)
    {result = "#ff000044";}

    return this.sanitizer.bypassSecurityTrustStyle(result);
  }
  onResizeColumn(event) { }

  onSelectionChange(event) { }

  onReOrderColumns(event) { }

  onDataStateChange(event) { }
}
