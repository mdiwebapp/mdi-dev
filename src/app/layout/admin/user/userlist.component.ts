import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  DataBindingDirective,
  DataStateChangeEvent,
  PageChangeEvent,
} from '@progress/kendo-angular-grid';
import {
  orderBy,
  process,
  SortDescriptor,
  State,
} from '@progress/kendo-data-query';
import { UserModel } from './user.model';
import { UserService } from './user.service';
import { PaginationRequest } from 'src/app/core/models/pagination.model';
import { ErrorHandlerService, PagerService } from 'src/app/core/services';
import { ModuleNames, ErrorMessages } from './../../../core/constant';

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.scss'],
})
export class UserlistComponent implements OnInit {
  @ViewChild(DataBindingDirective) dataBinding: DataBindingDirective;
  @Output() EditClick = new EventEmitter<number>();
  @Input() gridList: any;
  @Input() userId: number;
  @Input() isEdit: boolean;
  status: boolean = true;
  public pageSize = 5;
  public skip = 0;
  filterText: any;
  resID: number;
  totalUsers: number = 0;
  filterCollection: any = {
    status: true,
  };
  public mySelection: number[] = [0];
  loader: any;
  public sort: SortDescriptor[] = [
    {
      field: 'name',
      dir: 'asc',
    },
  ];
  data: any;
  user: UserModel[];
  searchValue: string = '';

  @Input() onChange;
  tempuser: any;
  constructor(
    public service: UserService,
    public pagerService: PagerService,
    public errorHandler: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    this.pagerService.load();
    this.onChange.subscribe((res) => {
      if (res) this.resID = res;
      this.loadItems();
    });
    this.loadItems();
  }

  editClick(id: number) {
    this.EditClick.emit(id);
  }

  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.loadItems();
  }
  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.data = orderBy([...this.user], sort);
    this.editClick(this.data[this.mySelection[0]]?.id);
  }
  private loadItems(mergeData?: boolean): void {
    this.loader = true;
    var request = new PaginationRequest<any>();
    request.start = this.pagerService.start;
    request.end = this.pagerService.end;
    request.pageSize = this.pagerService.pageSize;
    request.request = this.filterCollection;
    this.service.GetList(request).subscribe(
      (res) => {
        if (res != null && res.data.length > 0) {
          this.totalUsers = res.totalRecords;
          // this.pagerService.setHasMore(res.hasMore);
          // this.data = mergeData ? this.data.concat(res.data) : res.data;
          this.data = res.data; // this.data;
          this.user = [...this.data];
          if (this.filterText) this.onFilter(this.filterText);
          if (this.resID) {
            let ind = this.data.findIndex((c) => c.id == this.resID);
            this.mySelection = [ind];
            this.editClick(this.resID);
          } else {
            this.mySelection = [0];
            this.editClick(this.user[0].id);
          }
          ///this.editClick(this.user[0].id);
          //this.mySelection = [0];
          //this.filterText = "";
          this.loader = false;
        } else {
          this.data = [];

          this.loader = false;
          this.editClick(0);
        }
        var handleEvent = (event) => {
          this.handleScroll(event);
        };
        this.pagerService.registerScrollEvent(handleEvent);
      },
      (error) => {
        this.errorHandler.handleError(
          error,
          ModuleNames.user_list,
          ErrorMessages.user_list.list
        );
      }
    );
  }
  public handleScroll(event) {
    if (this.pagerService.enableLoadMoreItems(event)) {
      // the element reach the end of vertical scroll
      this.loadMoreItems();
    }
  }

  public loadMoreItems() {
    if (this.pagerService.hasMore) {
      this.pagerService.loadMore();
      this.loadItems(true);
    }
  }
  public onFilter(inputValue: string): void {
    this.filterText = inputValue;
    this.data = process(this.user, {
      filter: {
        logic: 'or',
        filters: [
          {
            field: 'name',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'userId',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'userName',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'department',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'domainAccount',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'email',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'phoneNumber',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'newFeature',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'branchName',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'employeeName',
            operator: 'contains',
            value: inputValue,
          },
        ],
      },
    }).data;
    this.searchValue = inputValue;
    this.mySelection = [0];
    this.tempuser = this.data;
    this.totalUsers = this.data.length;
    if (this.data.length > 0) this.editClick(this.data[0].id);
    else this.editClick(0);
  }

  public state: State = {
    skip: 0,
    take: 5,

    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: [{ field: 'vendorName', operator: 'contains', value: 'Chef' }],
    },
  };

  public dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    this.data = process(this.user, this.state);
  }

  UserInActive(event) {
    this.filterCollection.status = event;
    this.status = event;
    this.loadItems();
  }
}
