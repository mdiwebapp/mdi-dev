import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  DataBindingDirective,
  DataStateChangeEvent,
} from '@progress/kendo-angular-grid';
import { BehaviorSubject } from 'rxjs';
import { MenuService } from 'src/app/core/helper/menu.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { GowtamaService } from '../gowtama/gowtama.service';
import {
  orderBy,
  process,
  SortDescriptor,
  State,
} from '@progress/kendo-data-query';
import { BranchService } from 'src/app/layout/admin/branch/branch.service';
import { BranchModel } from 'src/app/layout/admin/branch/branch.model';
import { ModuleNames, ErrorMessages } from 'src/app/core/constant';
import { ErrorHandlerService } from 'src/app/core/services';

@Component({
  selector: 'app-gowtama',
  templateUrl: './gowtama.component.html',
  styleUrls: ['./gowtama.component.scss'],
})
export class GowtamaComponent implements OnInit {
  @ViewChild(DataBindingDirective) dataBinding: DataBindingDirective;

  @Input() gridList: any;
  public pageSize = 5;
  public skip = 0;
  loader: any;
  branchList: any;
  temptransfer: any;

  public settings: Array<any> = [
    {
      text: 'All Status',
    },
    {
      text: 'Open Status',
    },
  ];

  public settings2: Array<any> = [
    {
      text: 'All Branches',
    },
    {
      text: 'Open Branch',
    },
  ];

  public sort: SortDescriptor[] = [
    {
      field: 'InvTransferNumber',
      dir: 'asc',
    },
  ];
  public mySelection: number[] = [0];

  isSave: boolean = true;
  isCancel: boolean = true;
  isAdd: boolean = false;
  isAddRight: boolean = false;
  isUpdateRight: boolean = false;

  data: any;
  @Input() onChange;
  trasfer: any;
  id: number;
  branchId: number;
  cdate: any;
  status: boolean = true;
  trucksStatus: boolean = true;
  dotStatus: boolean = true;
  inactive: boolean = true;
  isDisable: boolean = true;
  cInfos: any;
  selectedTab = 0;
  branch: BranchModel[];
  branchData: any;
  filterText: string;

  constructor(
    public branchService: BranchService,
    public transferService: GowtamaService,
    public menuService: MenuService,
    public utils: UtilityService,
    public router: Router,
    public errorHandler: ErrorHandlerService
  ) {}
  SaveChange: BehaviorSubject<any> = new BehaviorSubject(null);
  ngOnInit(): void {
    this.loadItems();
    this.GetBranch();
  }
  GetBranch() {
    this.branchService.GetBranchDropdown().subscribe(
      (res) => {
        if (res) {
          this.branch = res;
          this.branchData = res;
        }
      },
      (error) => this.onError(error, ErrorMessages.branch.dropdown)
    );
  }
  private loadItems(): void {
    this.loader = true;
    this.transferService.GetList(true).subscribe(
      (res) => {
        if (res.length > 0) {
          this.data = res;
          // console.log(res);
          this.trasfer = res;
          this.loader = false;
          this.editClick(this.trasfer[0].id);
        }
      },
      (error) => this.onError(error, ErrorMessages.transfer.transfer_list)
    );
  }
  onButtonClick() {}

  editClick(id: number) {}
  btnAdd() {
    this.enableBtn();
    this.isAdd = true;
  }
  btnCancel() {
    this.isCancel = true;
    this.isAdd = false;
    this.isSave = true;
  }
  enableBtn() {
    this.isSave = false;
    this.isCancel = false;
    this.isAdd = true;
  }
  disbaleBtn() {
    this.isSave = true;
    this.isCancel = true;
    this.isAdd = false;
  }

  public onFilter(inputValue: string): void {
    this.filterText = inputValue;
    this.mySelection = [];
    this.data = process(this.trasfer, {
      filter: {
        logic: 'or',
        filters: [
          {
            field: 'InvTransferNumber',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'Status',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'FromBranch',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'ToBranch',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'CreatedDate',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'CreatedBy',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'SentDate',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'SentBy',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'ReceivedDate',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'ReceivedBy',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'InvTransferHFieldOverride',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'SigneeName',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'SigneePhone',
            operator: 'contains',
            value: inputValue,
          },
        ],
      },
    }).data;
    this.mySelection = [0];
    this.temptransfer = this.data;
  }
  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.data = {
      data: orderBy(this.trasfer, this.sort),
      total: this.trasfer.length,
    };
    this.data = this.data.data;
  }
  onSave() {
    this.disbaleBtn();
  }
  public dataStateChange(state: DataStateChangeEvent): void {}

  private onError(error: any, customMessage?: string) {
    this.errorHandler.handleError(error, ModuleNames.transfer, customMessage);
  }
}
