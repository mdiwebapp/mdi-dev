import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
  ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ErrorMessages, ModuleNames } from 'src/app/core/constant';
import { ErrorHandlerService, PagerService } from 'src/app/core/services';
import { UtilityService } from 'src/app/core/services/utility.service';
import { ComponetSwapService } from '../componet-swap.service';
import {
  orderBy,
  process,
  SortDescriptor,
  State,
} from '@progress/kendo-data-query';
import { DropdownService } from 'src/app/core/services/dropdown.service';
import { Subscription } from 'rxjs';
import { UserPreferenceModel } from 'src/app/core/models/preference.model';
import { UserPreferenceService } from 'src/app/core/services/user-preference.service';
import { ignoreElements } from 'rxjs/operators';
import {
  DataBindingDirective,
  PageChangeEvent,
} from '@progress/kendo-angular-grid';
import {
  PaginationRequest,
  PaginationWithSortRequest,
} from 'src/app/core/models/pagination.model';
import { MenuService } from 'src/app/core/helper/menu.service';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

@Component({
  selector: 'app-component-swap',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './component-swap.component.html',
  styleUrls: ['./component-swap.component.scss'],
})
export class ComponentSwapComponent implements OnInit {
  @ViewChild(DataBindingDirective) dataBinding: DataBindingDirective;

  public totalData = 0;
  public pageSize = 100;
  public skip = 0;
  pageSizeList: any = [
    { id: 0, value: 100 },
    { id: 0, value: 300 },
    { id: 0, value: 500 },
  ];
  form: FormGroup;
  branchList: [];
  screenList: [];
  swapDataList2: any[] = [];
  tempswapDataList2: any[] = [];
  selectedRow: any;
  selectedRowRemove: any;
  componentStatus: boolean = true;
  displayUnit: boolean = false;
  show: boolean = false;
  show1: boolean = false;
  viewMissingComp: boolean = false;
  isConfirmDialogVisible: boolean = false;
  toggleText: string;
  branchCode: string = null;
  componentType: string = 'All';
  listCompType: any = [];
  crossSwap: boolean = false;
  branch: any[] = [];
  branchData: any;
  gridView: any[];
  gridViewItems: any[];
  mySelection: any[];
  mySelectionList1: any[];
  mySelectionitem: any[];
  branchAll = [
    {
      id: 0,
      value: 'All',
      code: 'All',
    },
  ];
  listCompTypeAll = [
    {
      id: 0,
      value: 'All',
    },
  ];
  public viewColumns = [
    {
      Name: 'branchLocation',
      isCheck: true,
      Text: 'Branch',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'invType',
      isCheck: true,
      Text: 'Component Type',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'invNumber',
      isCheck: true,
      Text: 'Inventory Number',
      isDisable: false,
      index: 1,
      width: 100,
    },
  ];

  swapDataList1 = [];

  invenNumber: string = '';
  tempUnits: any = [];
  public sort: SortDescriptor[] = [
    {
      field: 'invType',
      dir: 'asc',
    },
  ];
  userPreferenceModel: UserPreferenceModel;
  clickEventsubscription: Subscription;
  message: any;
  filterCollection: any = {
    inventoryType: '',
    brach: '',
    isCrossSwap: false,
    searchText: '',
  };
  tempPageNo: number;
  showAddRemove: boolean = true;
  showCrossBranch: boolean = true;
  visible: boolean;
selectedUnitBranch: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private utility: UtilityService,
    public service: ComponetSwapService,
    public errorHandler: ErrorHandlerService,
    public dropdownservice: DropdownService,
    public preference: UserPreferenceService,
    public pagerService: PagerService,
    public menuService: MenuService,
    private sanitizer: DomSanitizer
  ) {
    if (localStorage.getItem('isAdmin') == 'true') {
      this.showAddRemove = true;
    } else {
      let acc = this.menuService.checkUserViewRights('component swap');
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
        //this.router.navigate(['/dashboard']);
        // this.utility.toast.error(
        //   'You do not have permissions to access this part of the system. Please contact your supervisor so they can request them from IT.'
        // );
      }
      const rights = JSON.parse(localStorage.getItem('Rights'));
      if (rights) {
        let crossBranch = rights.some(
          (c) =>
            c.subModuleName == 'Maintain Component Swap' &&
            c.moduleName == 'Component Swap' &&
            c.tabName == 'Cross Branch Swap'
        );
        let primaryBranch = rights.some(
          (c) =>
            c.subModuleName == 'Maintain Component Swap' &&
            c.moduleName == 'Component Swap' &&
            c.tabName == 'VIEW'
        );
        if (primaryBranch) {
          this.showAddRemove = true;
        } else {
          this.showAddRemove = false;
        }
        if (crossBranch) {
          this.showCrossBranch = true;
        } else {
          this.showCrossBranch = false;
        }
      }
    }
  }

  ngOnInit() {
    this.clickEventsubscription = this.utility
      .getClickEvent()
      .subscribe((a) => {
        this.message = a;
        this.callBack(this.message);
      });
    //this.branchCode = 'All';
    this.branch = JSON.parse(this.utility.storage.getItem('selectedBranch'));
    if (this.branch[0].id == 0) {
      this.GetBranch();
    }
    this.componentType = 'All';
    this.getPreference();
    //this.GetBranch();
    this.initForm();
    this.GetComponentType();

    //this.loadItems();
    var lsData = localStorage.getItem('InvNumber');
    if (lsData) {
      this.invenNumber = lsData.split('_')[0].toString();
      this.branchCode = lsData.split('_')[1].toString() ?? 'All';
      ///this.loadSelectedItems(this.invenNumber);
      this.loadUnits();
    } else {
      this.loadUnits();
    }
  }
  ngOnDestroy() {
    localStorage.removeItem('InvNumber');
    this.savePreference();
  }
  callBack(value) {
    var valueId = [];
    var valueId1 = [];
    this.branchData = value;
    this.branch = value;
    // value.forEach((element) => {
    //   valueId.push(element.id);
    //   valueId1.push(element.userId);
    // });
    if (value.length > 0) {
      if (value[0].id == 0) {
        this.GetBranch();
      } else {
        this.branchCode = value[value.length - 1].code;
      }
    }
    this.loadUnits();
    this.loadItems();
  }
  initForm(): void {
    this.form = this.formBuilder.group({
      componentStatus: ['All'],
      branch: [],
      componentType: [null],
      componentTypeSearch: [],
      screen: [],
      viewMissingComp: [false],
    });
  }
  GetComponentType() {
    this.dropdownservice.GetLookupList('ComponentType').subscribe(
      (res) => {
        if (res) {
          this.listCompType = res;
          this.listCompType.unshift({
            id: 0,
            value: 'All',
          });
        }
      },
      (error) => this.onError(error, ErrorMessages.drop_down.component_type)
    );
  }
  GetBranch() {
    this.branch = this.branchAll.concat(
      this.utility.storage.CurrentUser.userBranch
    );
    this.branchData = this.branch;
  }
  onGridSelectionChange($event) {
    this.selectedRow = $event.selectedRows[0].dataItem;
  }
  onGridSelectionChangeRemove($event) {
    this.selectedRowRemove = $event.selectedRows[0].dataItem;
  }

  addSwap() {
    if (!this.selectedRow) {
      this.utility.toast.error('You must select a Component to add.');
      return;
    }
    var objData = {
      inventoryId: this.selectedRow.id,
      selectedUnit: this.invenNumber,
      branch: this.branchCode,
      add: true,
      crossSwap: this.crossSwap,
      unitBranch: this.selectedUnitBranch
    };
    var data = this.swapDataList2.find(
      (c) => c.invType == this.selectedRow.invType
    );
    if (data) {
      this.utility.toast.error(
        'Inventory type is already added please try other.'
      );
      return;
    }
    this.visible = true;
    this.service.AddRemoveComponent(objData).subscribe(
      (res) => {
        this.visible = false;
        if (res) {
          this.selectedRow = null;
          this.loadSelectedItems(this.invenNumber);
          this.loadItems();
        }
      },
      (error) => this.onError(error, ErrorMessages.component_swap.add_component)
    );
  }

  removeSwap() {
    if (!this.selectedRowRemove) {
      this.utility.toast.error('Please select a Component to remove.');
      return;
    }
    var objData = {
      inventoryId: this.selectedRowRemove.id,
      selectedUnit: this.invenNumber,
      branch: this.branchCode,
      add: false,
      crossSwap: this.crossSwap,
      unitBranch: this.selectedUnitBranch
    };
    this.visible = true;
    this.service.AddRemoveComponent(objData).subscribe(
      (res) => {
        this.visible = false;
        if (res) {
          this.selectedRowRemove = null;
          this.loadSelectedItems(this.invenNumber);
          this.loadItems();
        }
      },
      (error) =>
        this.onError(error, ErrorMessages.component_swap.remove_component)
    );
    // var indexToSwap = this.swapDataList2.findIndex(
    //   (s) =>
    //     s.invType === this.selectedRowRemove.invType &&
    //     s.invNumber === this.selectedRowRemove.invNumber
    // );

    // if (indexToSwap !== -1) {
    //   this.swapDataList1.push(this.selectedRowRemove);
    //   this.swapDataList2.splice(indexToSwap, 1);
    //   this.removeSelectionOfRowRemove();
    // }
  }

  removeSelectionOfRowRemove() {
    var rows = document.getElementsByClassName('k-state-selected');
    if (rows && rows.length) {
      for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        row.classList.remove('k-state-selected');
      }
    }
    this.selectedRowRemove = null;
  }
  removeSelectionOfRow() {
    var rows = document.getElementsByClassName('k-state-selected');
    if (rows && rows.length) {
      for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        row.classList.remove('k-state-selected');
      }
    }
    this.selectedRow = null;
  }
  onUnit() {
    this.displayUnit = !this.displayUnit;
  }
  public onToggle(): void {
    if (this.branchCode) {
      this.gridView = this.tempUnits;
      this.show = !this.show;
      this.toggleText = this.show ? 'Hidе' : 'Show';
    } else {
      this.utility.toast.error('Please select branch');
    }
  }

  closepopup() {
    this.show = !this.show;
    this.toggleText = this.show ? 'Hidе' : 'Show';
  }

  loadUnits() {
    if (!this.branchCode) {
      this.branchCode = 'All';
    } else if (this.branchCode == '%') {
      this.branchCode = 'All';
    }
    this.service.GetUnits(this.branchCode).subscribe(
      (res) => {
        if (res) {
          this.gridView = res;
          this.tempUnits = res;
          this.mySelection = [];
          var lsData = localStorage.getItem('InvNumber');
          if (!lsData) {
            this.invenNumber = '';
            this.swapDataList2 = [];
            this.tempswapDataList2 = [];
            this.loadItems();
          } else {
            this.invenNumber = lsData.split('_')[0].toString();
            this.loadSelectedItems(this.invenNumber);
            this.loadItems();
          }
          // this.loadSelectedItems(this.gridView[0].invNumber);
          //this.templstVendors = res;
        }
      },
      (error) => this.onError(error, ErrorMessages.component_swap.get_unit_list)
    );
  }
  filterbyStatus() {
    this.loadSelectedItems(this.invenNumber);
  }
  loadSelectedItems(val) {
    this.invenNumber = val;
    var obj = {
      invNumber: val,
      branch: this.branchCode,
      activeComponents: this.componentStatus, // == 'Active' ? true : false
    };
    this.service.LoadInventories(obj).subscribe(
      (res) => {
        if (res) {
          this.swapDataList2 = res;
          this.tempswapDataList2 = res;
          //this.getPreference();
          this.mySelectionitem = [0];
          this.selectedRowRemove = this.swapDataList2[0];

          //this.templstVendors = res;
        }
      },
      (error) =>
        this.onError(error, ErrorMessages.component_swap.get_selecteditem_list)
    );
  }

  OnChangeUnit(event) {
    this.invenNumber = event.selectedRows[0].dataItem.invNumber;
    this.selectedUnitBranch = event.selectedRows[0].dataItem.branchLocation;
    var obj = {
      invNumber: event.selectedRows[0].dataItem.invNumber,
      branch: event.selectedRows[0].dataItem.branchLocation,
      activeComponents: this.componentStatus, // == 'Active' ? true : false
    };
    this.service.LoadInventories(obj).subscribe(
      (res) => {
        if (res) {
          this.swapDataList2 = res;
          this.tempswapDataList2 = res;
          //this.getPreference();
          this.mySelectionitem = [0];
          this.selectedRowRemove = this.swapDataList2[0];
          this.branchCode =  event.selectedRows[0].dataItem.branchLocation;
          this.loadItems();
          //this.templstVendors = res;
        }
      },
      (error) =>
        this.onError(error, ErrorMessages.component_swap.get_selecteditem_list)
    );
  }

  filterText: string;
  loadItems() {
    var request = new PaginationWithSortRequest<any>();
    request.pageNumber = this.pagerService.start;
    request.pageSize = this.pageSize;
    request.sortColumn = this.sort[0].field;
    request.sortDesc = this.sort[0].dir == 'asc' ? false : true;
    this.filterCollection.inventoryType = this.componentType;
    this.filterCollection.brach = this.branchCode;
    this.filterCollection.isCrossSwap = this.crossSwap;

    request.request = this.filterCollection;
    this.visible = true;
    this.service.GetItems(request).subscribe(
      (res) => {
        this.visible = false;
        if (res) {
          this.totalData = res.totalRecords;
          this.swapDataList1 = res.data;
          this.gridViewItems = res.data;
          this.mySelectionList1 = [];
          //this.selectedRow = this.swapDataList1[0];
          // if (this.filterText) { this.onItemFilter(this.filterText); }
          //this.mySelection = [0];
          //this.templstVendors = res;
        }
      },
      (error) =>
        this.onError(error, ErrorMessages.component_swap.get_items_list)
    );
  }

  data: any;
  public onFilter(inputValue: string): void {
    this.filterText = inputValue;
    this.mySelection = [];

    this.gridView = process(this.tempUnits, {
      filter: {
        logic: 'or',
        filters: [
          {
            field: 'invNumber',
            operator: 'contains',
            value: inputValue,
          },
        ],
      },
    }).data;
    this.dataBinding.skip = 0;
  }
  public onItemFilter(inputValue: string): void {
    this.filterText = inputValue;
    this.mySelection = [];
    this.pagerService.start = inputValue ? 0 : this.tempPageNo;
    this.filterCollection.searchText = inputValue;
    this.loadItems();
    // this.swapDataList1 = process(this.gridViewItems, {
    //   filter: {
    //     logic: 'or',
    //     filters: [
    //       {
    //         field: 'invNumber',
    //         operator: 'contains',
    //         value: inputValue,
    //       },
    //       {
    //         field: 'branchLocation',
    //         operator: 'contains',
    //         value: inputValue,
    //       },
    //       {
    //         field: 'invType',
    //         operator: 'contains',
    //         value: inputValue,
    //       }]
    //   }
    // }).data;
    /// this.swapDataList1 = this.data;
  }
  public sortChangeList2(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.data = {
      data: orderBy(this.tempswapDataList2, this.sort),
      total: this.tempswapDataList2.length,
    };
    this.swapDataList2 = this.data.data;
    // this.loadProducts();
  }
  public sortChangeList1(sort: SortDescriptor[]): void {
    this.sort = sort;

    // this.data = {
    //   data: orderBy(this.gridViewItems, this.sort),
    //   total: this.gridViewItems.length,
    // };
    // this.swapDataList1 = this.data.data;
    this.loadItems();
    // this.loadProducts();
  }
  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.data = {
      data: orderBy(this.tempUnits, this.sort),
      total: this.tempUnits.length,
    };
    this.gridView = this.data.data;
    // this.loadProducts();
  }
  hiddenColumns = [];
  columnWidths: any = [];
  public columns: any = [
    {
      Name: 'branchLocation',
      isCheck: false,
      Text: 'Branch',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'invType',
      isCheck: false,
      Text: 'Inventory Type',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'invNumber',
      isCheck: false,
      Text: 'Inventory Number',
      isDisable: false,
      index: 0,
      width: 100,
    },
  ];
  savePreference() {
    var usr = JSON.parse(localStorage.getItem('currentUser'));

    this.userPreferenceModel = new UserPreferenceModel();
    this.userPreferenceModel.userName = usr.userId;
    this.userPreferenceModel.id = 0;
    this.userPreferenceModel.userId = 0;
    this.userPreferenceModel.page = 'ComponentSwap';
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
      this.preference.GetUserPreference('ComponentSwap').subscribe((res) => {
        if (res.result) {
          var userPref = res.result.preference;
          this.viewColumns = userPref.order.filter((c) => c.isCheck == true);
          this.viewColumns.forEach((element) => {
            let col = this.columns.findIndex((c) => c.Name == element.Name);
            this.columns[col].isCheck = true;
          });
          this.sort = userPref.sortBy;
          this.data = {
            data: orderBy(this.tempswapDataList2, this.sort),
            total: this.tempswapDataList2.length,
          };
        } else {
          this.viewColumns.forEach((element) => {
            let col = this.columns.findIndex((c) => c.Name == element.Name);
            this.columns[col].isCheck = true;
          });
        }
        this.swapDataList2 = this.data.data;
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
  resizeColumns(eventData) {
    let col = this.viewColumns.findIndex(
      (c) => c.Name == eventData[0].column.field
    );
    this.viewColumns[col].width = eventData[0].newWidth;
  }
  public onPageChange(e: PageChangeEvent): void {
    this.skip = e.skip;
    this.pageSize = e.take;
    this.pagerService.start = this.skip == 0 ? 0 : this.skip / this.pageSize;
    this.filterCollection.pageSize = this.pageSize;
    this.tempPageNo = this.pagerService.start;
    //this.skip = event.skip;
    this.loadItems();
  }
  onPageSizechange(pagesize) {
    this.pageSize = pagesize;
    this.loadItems();
  }
  private onError(error: any, customMessage?: string) {
    this.errorHandler.handleError(
      error,
      ModuleNames.components_swap,
      customMessage
    );
  }
  branchChange() {
    localStorage.removeItem('InvNumber');
    this.invenNumber = '';
    this.swapDataList2 = [];
    this.loadUnits();
    this.loadItems();
  }
  public colorCode(code: any): SafeStyle {
    let result;
    if (code.isSameBranch == 0) {
      result = '#ff000044';
    }

    return this.sanitizer.bypassSecurityTrustStyle(result);
  }
  confirm_message: string;
  type: string;
  confirmSwap(type) {
    if (this.selectedRow.branch != this.branchCode) {
      this.confirm_message =
        'Are you sure you want to ' +
        type +
        ' inventory to this ' +
        this.branchCode +
        ' branch.';
      this.type = type;
      this.isConfirmDialogVisible = true;
    } else {
      this.addSwap();
    }
  }
  onHandleOperation(type) {
    switch (type) {
      case 'confirm':
        if (this.type == 'add') {
          this.addSwap();
        } else if (this.type == 'remove') {
          this.removeSwap();
        } else {
          this.type = '';
        }
        this.isConfirmDialogVisible = !this.isConfirmDialogVisible;
        break;
      case 'close':
        this.type = '';
        this.isConfirmDialogVisible = !this.isConfirmDialogVisible;
        break;
      default:
        break;
    }
  }
}
