import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { BasicsettingService } from '../../../../core/services/basicsetting.service';
import { TitlesService } from '../titles.service';
import { TitlesModel } from '../titles.model';
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
import { ModuleNames, ErrorMessages } from 'src/app/core/constant';
import { ErrorHandlerService } from 'src/app/core/services';
import { UtilityService } from 'src/app/core/services/utility.service';
import { MenuService } from 'src/app/core/helper/menu.service';

@Component({
  selector: 'app-titleslist',
  templateUrl: './titleslist.component.html',
  styleUrls: ['./titleslist.component.scss'],
})
export class TitleslistComponent implements OnInit {
  @ViewChild(DataBindingDirective) dataBinding: DataBindingDirective;
  @Output() EditClick = new EventEmitter<number>();
  @Input() gridList: any;
  @Input() titleId: number;
  @Input() isEdit: boolean;
  public pageSize = 5;
  public skip = 0;
  public mySelection: number[] = [0];
  status: boolean = true;
  loader: any;
  data: any;
  titles: TitlesModel[];
  public sort: SortDescriptor[] = [
    {
      field: 'name',
      dir: 'asc',
    },
  ];
  @Input() onChange;
  filterinput: any;
  resID: any;
  titles1: any;
  constructor(
    public service: TitlesService,
    public settingService: BasicsettingService,
    public errorHandler: ErrorHandlerService,public menuService: MenuService,
    private utility: UtilityService,
  ) {
    // if (localStorage.getItem('isAdmin') == 'true') {

    // } else {
    //   let acc = this.menuService.checkUserViewRights('Titles');
    //   if (acc) {
    //     //this.utils.toast.error("User does not have rights to access " + name + " module.");Z
    //   } else {
    //     this.utility.toast.error(
    //       'You do not have permissions to access this part of the system. Please contact your supervisor so they can request them from IT.'
    //     );
    //     setTimeout(() => {
    //       var url = '/dashboard';
    //       location.href = url;
    //     }, 1000);
    //   }
    //   this.menuService.checkUserBySubmoduleRights('Titles');
    // }

  }

  ngOnInit(): void {
    this.onChange.subscribe((res) => {
      if (res) this.resID = res;

      this.loadItems();
    });
    this.loadItems();
  }

  TitlesInActive(event) {
    this.status = event;
    this.loadItems();
  }
  private loadItems(): void {
    this.loader = true;
    this.service.GetList(this.status).subscribe(
      (res) => {
        this.titles = res;
        this.titles1 = res;
        this.data = res;
        this.loader = false;
        if (this.filterinput) this.onFilter(this.filterinput);

        if (this.resID) {
          let ind = this.data.findIndex((c) => c.id == this.resID);
          this.mySelection = [ind];
          this.editClick(this.resID);
        } else {
          this.mySelection = [0];
          this.editClick(this.titles[0].id);
        }
      },
      (error) => {
        this.errorHandler.handleError(
          error,
          ModuleNames.titles,
          ErrorMessages.titles.get_list
        );
      }
    );
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
    this.data = {
      data: orderBy(this.titles1, this.sort),
      total: this.titles1.length,
    };
    this.data = this.data.data;
  }
  public onFilter(inputValue: string): void {
    this.filterinput = inputValue;
    this.mySelection = [];
    this.data = process(this.titles, {
      filter: {
        logic: 'or',
        filters: [
          {
            field: 'name',
            operator: 'contains',
            value: inputValue,
          },
        ],
      },
    }).data;
    this.mySelection = [0];
    this.titles1 = this.data;

    if (this.data.length > 0) {
      this.editClick(this.data[0].id);
    } else this.editClick(0);

    //this.dataBinding.skip = 0;
  }

  public state: State = {
    skip: 0,
    take: 5,

    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: [{ field: 'name', operator: 'contains', value: 'Chef' }],
    },
  };

  public dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    this.data = process(this.titles, this.state);
  }

  titleInActive(event) {
    this.status = event;
    this.loadItems();
  }
}
