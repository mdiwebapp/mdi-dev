import {
  Component,
  Directive,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

import {
  ColumnChooserComponent,
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
import { BranchModel } from './branch.model';
import { BranchService } from './branch.service';
import { BasicsettingService } from '../../../core/services/basicsetting.service';
import { ajax } from 'jquery';
import {
  SavedGridColumnAddUpdateRequestModel,
  SavedMenuAddRequestModel,
} from 'src/app/core/models/basicsetting.model';
import { DomSanitizer } from '@angular/platform-browser';
import { UserPreferenceModel } from 'src/app/core/models/preference.model';
import { UserPreferenceService } from 'src/app/core/services/user-preference.service';
import { ModuleNames, ErrorMessages } from '../../../core/constant';
import { ErrorHandlerService } from '../../../core/services';

@Component({
  selector: 'app-branchlist',
  templateUrl: './branchlist.component.html',
  styleUrls: ['./branchlist.component.scss'],
})
export class BranchlistComponent implements OnInit {
  @ViewChild(DataBindingDirective) dataBinding: DataBindingDirective;
  @Output() EditClick = new EventEmitter<number>();
  @Input() gridList: any;
  @Output() backButtonEvent = new EventEmitter();
  settingStatus: boolean = false;
  multiple: boolean = false;

  status: boolean = true;
  public pageSize = 5;
  public gridSize = '70vh';
  public skip = 0;
  loader: any;
  public columns: any = [
    {
      Name: 'branchName',
      isCheck: true,
      Text: 'Branch Name',
      isDisable: false,
    },
    {
      Name: 'branchCode',
      isCheck: true,
      Text: 'Branch Code',
      isDisable: false,
    },
    { Name: 'inactive', isCheck: true, Text: 'Active', isDisable: false },
  ];
  public viewColumns = [
    {
      Name: 'branchName',
      isCheck: true,
      Text: 'Name',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'branchCode',
      isCheck: true,
      Text: 'Code',
      isDisable: true,
      index: 1,
      width: 100,
    },
    {
      Name: 'inactive',
      isCheck: true,
      Text: 'Active',
      isDisable: false,
      index: 2,
      width: 100,
    },
  ];
  public hiddenColumns: string[] = [];
  public temphiddenColumns: string[] = [];
  public mySelection: number[] = [0];

  public sort: SortDescriptor[] = [
    {
      field: 'branchName',
      dir: 'asc',
    },
  ];
  data: any;
  brach: BranchModel[];
  @Input() onChange;
  @Input() branchId: number;
  @Input() isEdit: boolean;
  filterinput: string;
  brach1: any;
  fileUrl: any;
  resID: number;
  isAdd: boolean = true;
  id: number;
  show: boolean;
  toggleText: string;
  userPreferenceModel: UserPreferenceModel;
  constructor(
    public service: BranchService,
    public settingService: BasicsettingService,
    public preference: UserPreferenceService,
    private sanitizer: DomSanitizer,
    public errorHandler: ErrorHandlerService
  ) {}

  ngOnInit() {
    // $(".dropdown-menu .custom-dropdown").click(function (e) {
    //   e.stopPropagation();
    // });

    this.onChange.subscribe((res) => {
      if (res) this.resID = res;

      this.loadItems();
    });
    //this.loadGridColumn();
    this.loadItems();
    const data = 'some text';
    const blob = new Blob([data], { type: 'application/octet-stream' });

    this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      window.URL.createObjectURL(blob)
    );
  }
  ngOnDestroy() {
    this.savePreference();
    console.log('Goodbye Vendor!');
  }
  // loadGridColumn() {
  //   this.settingService.GetGridColumnsByModule("Branch").subscribe((res) => {
  //     if (res) {
  //       this.temphiddenColumns = res["result"].split(",");

  //       this.columns.forEach(element => {
  //         let data = this.temphiddenColumns.find(x => x == element.Name)
  //         if (data)
  //           element.isCheck = true;
  //         else
  //           element.isCheck = false;
  //       });
  //       this.hideColumn();
  //       this.hiddenColumns = this.temphiddenColumns;

  //     }
  //   });
  // }

  columnApply() {
    $('.dropdown-menu.custom-dropdown').removeClass('show');
    this.hiddenColumns = this.temphiddenColumns;
    this.temphiddenColumns = [];

    let filteredData = [];
    this.columns.forEach((element) => {
      let data = this.hiddenColumns.find((x) => x == element.Name);
      if (!data) filteredData.push(element.Name);
    });
    this.show = !this.show;
  }
  public isHidden(columnName: string): boolean {
    return this.hiddenColumns.indexOf(columnName) > -1;
  }

  public isHiddenTemp(columnName: string): boolean {
    return this.temphiddenColumns.indexOf(columnName) > -1;
  }

  public isDisabled(columnName: string): boolean {
    return (
      this.columns.length - this.temphiddenColumns.length === 1 &&
      !this.isHiddenTemp(columnName)
    );
  }

  public hideColumn(): void {
    // this.temphiddenColumns = [];
    // this.columns.forEach(element => {
    //   if (!element.isCheck)
    //     this.temphiddenColumns.push(element.Name);
    // });
    this.columns.forEach((element) => {
      if (element.isCheck) {
        var inde = this.viewColumns.find((c) => c.Name == element.Name);
        if (!inde) {
          this.viewColumns.push(element);
        }
      } else {
        var index = this.viewColumns.findIndex((c) => c.Name == element.Name);
        if (index > 0) {
          this.viewColumns.splice(index, 1);
        }
      }
    });
  }

  public onToggle(): void {
    this.show = !this.show;
    this.toggleText = this.show ? 'Hidе' : 'Show';

    let aaa = this.columns.filter((x) => x.isCheck == true);
    if (aaa.length == 1) {
      this.columns.forEach((element) => {
        if (element.Name != aaa[0].Name) {
          this.temphiddenColumns.push(element.Name);
        }
      });
      this.isDisabled(aaa[0].Name);
    }
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
      data: orderBy(this.brach1, this.sort),
      total: this.brach1.length,
    };
    this.data = this.data.data;
    this.editClick(this.data[this.mySelection[0]]?.id);
  }
  private loadItems(): void {
    this.loader = true;
    this.service.GetList(this.status).subscribe(
      (res) => {
        this.brach = res;
        this.data = res;
        this.brach1 = res;

        // this.getPreference();
        if (this.filterinput) this.onFilter(this.filterinput);

        if (this.resID) {
          let ind = this.data.findIndex((c) => c.id == this.resID);
          this.mySelection = [ind];
          this.editClick(this.resID);
        } else {
          this.mySelection = [0];
          this.editClick(this.brach[0].id);
        }
        this.loader = false;
        var length = this.data.length;
        var rowHeight = 40; // your row height
        var headerHeight = 40; // your header height
        var filterHeight = 40; // your filter height

        this.gridSize = length * rowHeight + headerHeight + filterHeight + 'px';
      },
      (error) => this.onError(error, ErrorMessages.branch.list)
    );
  }

  public onFilter(inputValue: string): void {
    this.filterinput = inputValue;
    this.mySelection = [];
    this.data = process(this.brach, {
      filter: {
        logic: 'or',
        filters: [
          {
            field: 'branchName',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'branchCode',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'employer',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'address',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'address2',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'city',
            operator: 'contains',
            value: inputValue,
          },

          {
            field: 'zip',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'qbBranch',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'qbName',
            operator: 'contains',
            value: inputValue,
          },

          {
            field: 'nickName',
            operator: 'contains',
            value: inputValue,
          },
        ],
      },
    }).data;
    this.mySelection = [0];
    this.brach1 = this.data;

    if (this.data.length > 0) {
      this.editClick(this.data[0].id);
    } else this.editClick(0);
  }

  BranchInActive(event) {
    this.status = event;
    this.backButtonEvent.emit(this.status);
    this.loadItems();
  }

  public state: State = {
    skip: 0,
    take: 5,

    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: [{ field: 'branchName', operator: 'contains', value: 'Chef' }],
    },
  };

  public dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    this.data = process(this.brach, this.state);
  }
  expandHeight() {
    this.gridSize = 'auto';
  }
  collspanHeight() {
    this.gridSize = '70vh';
  }
  savePreference() {
    var usr = JSON.parse(localStorage.getItem('currentUser'));
    // var obj = {
    //   "id": 0,
    //   "userName": usr.userId,
    //   "userId": usr.id,
    //   "page": "Vehicle",
    //   "preference": "[{columns:" + this.hiddenColumns + ",order:desc,width:100px,sortBy:filedname}]"
    // }
    this.userPreferenceModel = new UserPreferenceModel();
    this.userPreferenceModel.userName = usr.userId;
    this.userPreferenceModel.id = 0;
    this.userPreferenceModel.userId = 0;
    this.userPreferenceModel.page = 'Branch';
    var objd = {
      columns: this.hiddenColumns,
      order: this.viewColumns,
      width: this.columnWidths,
      sortBy: this.sort,
    };
    this.userPreferenceModel.preference = objd; //'{ columns: ' + this.hiddenColumns + ', order: ' + this.sort[0].dir + ', width: "", sortBy: ' + this.sort[0].field + '}';
    this.preference
      .SaveUserPreference(this.userPreferenceModel)
      .subscribe((res) => {});
  }
  getPreference() {
    try {
      this.preference.GetUserPreference('Branch').subscribe((res) => {
        if (res.result) {
          var userPref = res.result.preference;
          this.viewColumns = userPref.order.filter((c) => c.isCheck == true);
          this.viewColumns.forEach((element) => {
            let col = this.columns.findIndex((c) => c.Name == element.Name);
            this.columns[col].isCheck = true;
          });
          this.sort = userPref.sortBy;
          this.data = {
            data: orderBy(this.brach, this.sort),
            total: this.brach.length,
          };
        } else {
          this.viewColumns.forEach((element) => {
            let col = this.columns.findIndex((c) => c.Name == element.Name);
            this.columns[col].isCheck = true;
          });
        }
        this.data = this.data.data;
        this.mySelection = [0];
        this.id = this.data[0].id;
        this.editClick(this.id);
      });
    } catch (error) {
      this.viewColumns.forEach((element) => {
        let col = this.columns.findIndex((c) => c.Name == element.Name);
        this.columns[col].isCheck = true;
      });
    }
  }
  reorderColumns(event) {
    var newIndx = event.newIndex;
    var oldIndx = event.oldIndex;
    var column = event.column.field;

    let cutOut = this.viewColumns.splice(oldIndx, 1)[0]; // cut the element at index 'from'
    this.viewColumns.splice(newIndx, 0, cutOut); // insert it at index 'to'

    //this.savePreference();
  }
  closepopup() {
    this.show = !this.show;
  }
  resetpopup() {
    this.columns = [
      {
        Name: 'branchName',
        isCheck: true,
        Text: 'Branch Name',
        isDisable: false,
      },
      {
        Name: 'branchCode',
        isCheck: true,
        Text: 'Branch Code',
        isDisable: false,
      },
      { Name: 'inactive', isCheck: true, Text: 'Active', isDisable: false },
    ];
  }

  columnWidths: any = [];
  resizeColumns(eventData) {
    let col = this.viewColumns.findIndex(
      (c) => c.Name == eventData[0].column.field
    );
    this.viewColumns[col].width = eventData[0].newWidth;
  }

  private onError(error: any, customMessage?: string) {
    this.errorHandler.handleError(error, ModuleNames.branch, customMessage);
  }
}

@Directive({
  selector: '[click-stop-propagation]',
})
export class ClickStopPropagation {
  @HostListener('click', ['$event'])
  public onClick(event: any): void {
    event.stopPropagation();
  }
}
