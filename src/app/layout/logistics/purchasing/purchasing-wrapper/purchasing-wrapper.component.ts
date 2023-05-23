import { Component, OnInit, ViewChild } from '@angular/core';
import { PurchaseTabs } from 'src/app/core/models/enum-model';
import { MenuService } from '../../../../core/helper/menu.service';
import {
  ViewColumns,
  ViewData,
  columns,
} from '../../../../../data/purchase-order-data';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  orderBy,
  process,
  SortDescriptor,
  State,
} from '@progress/kendo-data-query';
import { PurchasingService } from '../purchasing.service';
import { PurchaseOrderViewFilterModel } from './purchasing-wrapper.model';
import { PagerService } from 'src/app/core/services/pager.service';
import { PageChangeEvent } from '@progress/kendo-angular-grid';
import { DropdownService } from 'src/app/core/services/dropdown.service';
import { ErrorHandlerService } from 'src/app/core/services';
import { ModuleNames, ErrorMessages } from 'src/app/core/constant';
import { BranchService } from 'src/app/layout/admin/branch/branch.service';
import { UserPreferenceModel } from 'src/app/core/models/preference.model';
import { UserPreferenceService } from 'src/app/core/services/user-preference.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { Subscription } from 'rxjs';
import { PurchaseOrderComponent } from '../purchase-order/purchase-order.component';
import { LineItemsComponent } from '../lineitems/lineitems.component';
import { PurchasingNotesComponent } from '../purchasing-notes/purchasing-notes.component';
import { PurchaseOrderHistoryComponent } from '../history/PurchaseOrderhistory.component';
import { PartsModel } from '../../parts/partlist/parts.model';
import * as fileSaver from 'file-saver';
import { PurchaseOrderExcelFileViewResultModel } from '../purchase-order/purchase-orderRequestModel.model';
@Component({
  selector: 'app-purchasing-wrapper',
  templateUrl: './purchasing-wrapper.component.html',
  styleUrls: ['./purchasing-wrapper.component.scss'],
})
export class PurchasingWrapperComponent implements OnInit {
  @ViewChild(PurchaseOrderComponent) purchaseOrder: PurchaseOrderComponent;
  @ViewChild(LineItemsComponent) lineitems: LineItemsComponent;
  @ViewChild(PurchasingNotesComponent) notes: PurchasingNotesComponent;
  @ViewChild(PurchaseOrderHistoryComponent)
  PurchaseOrderHistory: PurchaseOrderHistoryComponent;
  form: FormGroup;
  temphiddenColumns: any;
  columnWidths: any = [];
  columns: any;
  hiddenColumns: any;
  isPrint: boolean = true;
  isSave: boolean = false;
  isCancel: boolean = false;
  isEdit: boolean = false;
  isAdd: boolean = false;
  isAddRight: boolean = false;
  isUpdateRight: boolean = false;

  show: boolean;
  selectedTab: 'Purchase Order';
  receivedPOItems: any = [];
  tabs = PurchaseTabs;
  openedPOR: boolean;
  viewColumns: any;
  viewData: any;
  poNumberList: any = [];
  toggleText: string;
  displayCopy: boolean = false;
  displayCopyClose: boolean = false;
  showActive: boolean = false;
  showAll: boolean = false;
  data: any;
  purchasingFilterModel: PurchaseOrderViewFilterModel;
  userPreferenceModel: UserPreferenceModel;
  purchaseOrderViewData: any = [];
  Search: string;
  visible: boolean;
  branchCode: any = [];
  public pageSize = 100;
  public pageNumber = 1;
  public skip = 0;
  public currentPage = 1;
  public totalData = 0;
  tempPageNo: number;
  branch: any[] = [];
  clickEventsubscription: Subscription;
  message: any;
  isDisableGrid: boolean;
  displaySubmitPOR: boolean;
  displayClosePOR: boolean;
  displayReceivePOR: boolean;
  isReceiveConfirmDialog: boolean = false;
  isReceiveDialog: boolean = false;
  isNegative: boolean = false;
  isGreaterQuantity: boolean = false;
  poStatus: string = 'Partially Received';
  isErrorDialog: boolean = false;
  errorMessage: string = '';
  receivePORData: any = [];
  isDisableReceiveAll: boolean = false;
  PORNumber: string;
  isInvalidCopy: boolean = false;
  selectedRow: any;
  printCount: number = 0;
  validateQtyPK: number;
  closePoMessage: string = '';
  pageSizeList: any = [
    { id: 0, value: 100 },
    { id: 0, value: 300 },
    { id: 0, value: 500 },
  ];
  filterCollection: any = {
    id: 0,
    status: 1,
  };

  receivingInvColumns = [
    {
      Name: 'poNumber',
      isCheck: true,
      Text: 'PO Number',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'branchName',
      isCheck: true,
      Text: 'Branch',
      isDisable: false,
      index: 0,
      width: 50,
    },
    {
      Name: 'invType',
      isCheck: true,
      Text: 'Item Code',
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
      width: 200,
    },
    {
      Name: 'uom',
      isCheck: true,
      Text: 'UOM',
      isDisable: false,
      index: 0,
      width: 50,
    },
    {
      Name: 'quantity',
      isCheck: true,
      Text: 'Order Quantity',
      isDisable: false,
      index: 0,
      width: 50,
    },
    {
      Name: 'recdQty',
      isCheck: true,
      Text: 'Received Quantity',
      isDisable: false,
      index: 0,
      width: 50,
    },
  ];
  public sort: SortDescriptor[] = [
    {
      field: 'poNumber',
      dir: 'asc',
    },
    {
      field: 'branch',
      dir: 'asc',
    },
    {
      field: 'createdDate',
      dir: 'asc',
    },
    {
      field: 'status',
      dir: 'asc',
    },
    {
      field: 'vendor',
      dir: 'asc',
    },
  ];
  poNumberType: any;
  PONumberList: any = [];
  branchData: any;
  PONumber: string;
  vendorNumber: any;
  Purchasedata: any;
  isDisableTab: boolean = false;
  isDisablePOTab: boolean = false;
  isDisableLineItemsTab: boolean = false;
  public mySelection: number[] = [0];
  public receiveSelection: number[] = [0];
  isTab1: boolean = false;
  isTab2: boolean = false;
  isTab3: boolean = false;
  isTab4: boolean = false;
  purchaseDetail: any;

  constructor(
    public menuService: MenuService,
    private formBuilder: FormBuilder,
    public purchasingService: PurchasingService,
    public pagerService: PagerService,
    public dropdownservice: DropdownService,
    public errorHandler: ErrorHandlerService,
    public branchService: BranchService,
    public preference: UserPreferenceService,
    private utility: UtilityService
  ) {
    this.isAddRight = false;
    this.isUpdateRight = false;
    if (localStorage.getItem('isAdmin') == 'true') {
      this.isTab1 = true;
      this.isTab2 = true;
      this.isTab3 = true;
      this.isTab4 = true;
    } else {
      this.menuService.checkUserBySubmoduleRights('Purchase Order');
      const rights = JSON.parse(localStorage.getItem('Rights'));
      if (rights) {
        this.isTab1 = rights.some(
          (c) =>
            c.subModuleName == 'Purchase Order' &&
            c.moduleName == 'Maintain POR' &&
            c.tabName == 'VIEW'
        );
        this.isTab2 = rights.some(
          (c) =>
            c.subModuleName == 'Line Items' &&
            c.moduleName == 'Maintain POR' &&
            c.tabName == 'VIEW'
        );
        this.isTab3 = rights.some(
          (c) =>
            c.subModuleName == 'Notes' &&
            c.moduleName == 'Maintain POR' &&
            c.tabName == 'VIEW'
        );
        this.isTab4 = rights.some(
          (c) =>
            c.subModuleName == 'History' &&
            c.moduleName == 'Maintain POR' &&
            c.tabName == 'VIEW'
        );
      }
    }
  }

  ngOnInit(): void {
    this.isAdd = false;
    this.isEdit = false;
    this.viewColumns = ViewColumns;
    this.columns = columns;
    this.initForm();
    this.Search = '';
    this.pageSize = 100;
    this.purchasingFilterModel = new PurchaseOrderViewFilterModel();
    this.showActive = true;
    this.purchasingFilterModel.showActive = this.showActive;
    this.purchasingFilterModel.Search = this.Search;
    this.purchasingFilterModel.sortColumn = this.sort[0].field;
    this.purchasingFilterModel.sortDesc =
      this.sort[0].dir == 'asc' ? false : true;
    this.selectedTab = 'Purchase Order';
    this.clickEventsubscription = this.utility
      .getClickEvent()
      .subscribe((a) => {
        this.message = a;
        this.callBack(this.message);
      });

    this.branch = JSON.parse(this.utility.storage.getItem('selectedBranch'));

    if (this.branch.length > 0 && this.branch[0].id == 0) {
      this.branch.forEach((element) => {
        this.branchCode.push(element.code);
      });
    } else {
      this.branch.forEach((e) => {
        this.branchCode.push(this.branch.find((c) => c.id == e.id).code);
      });
    }
    this.purchasingFilterModel.Branches = this.branchCode;
    if (this.branchCode == 'All') {
      this.showAll = true;
    }
    this.purchasingFilterModel.sortDesc = true;
    this.GetPurchaseOrderView(this.purchasingFilterModel);
   
  }

  initForm(): void {
    this.form = this.formBuilder.group({
      poNumberType: [],
      showOpenPos: [true],
      showAll: [true],
      description: [],
      Receive: [],
      poNumber: [],
      txtPONumer: [],
    });
    this.form.controls['txtPONumer'].setValue(null);
  }
  callBack(value) {
    var valueId = [];
    var valueId1 = [];
    value.forEach((element) => {
      valueId.push(element.code);
      valueId1.push(element.userId);
    });
    this.branchCode = valueId;

    this.purchasingFilterModel.Branches = this.branchCode;
    if (this.branchCode == 'All') {
      this.showAll = true;
      this.purchasingFilterModel.showAll = this.showAll;
    } else {
      this.showAll = false;
      this.purchasingFilterModel.showAll = this.showAll;
    }
    this.GetPurchaseOrderView(this.purchasingFilterModel);
  }
  public onToggle(): void {
    this.show = !this.show;
    this.toggleText = this.show ? 'Hidе' : 'Show';
  }
  submitReason(type) {}
  onSwitchChange() {}
  public hideColumn(): void {
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
  public isHiddenTemp(columnName: string): boolean {
    return this.temphiddenColumns.indexOf(columnName) > -1;
  }
  public isHidden(columnName: string): boolean {
    return this.hiddenColumns.indexOf(columnName) > -1;
  }
  changeShowAll(val) {
    this.showAll = val;

    if (this.branchCode != 'All') {
      this.showAll = val;
      this.purchasingFilterModel.showAll = this.showAll;
      this.GetPurchaseOrderView(this.purchasingFilterModel);
    } else {
      this.showAll = true;
      this.purchasingFilterModel.showAll = this.showAll;
    }
  }
  changePOAll(val) {
    this.PONumber = '';
    this.purchasingFilterModel.showActive = val;
    this.showActive = val;
    this.GetPurchaseOrderView(this.purchasingFilterModel);
  }
  public onTabSelect(e) {
    this.selectedTab = e.title;
    this.isPrint = true;
    this.isAdd = false;
    this.isEdit = false;
    this.isCancel = false;
    this.isSave = false;
    if (this.selectedTab == this.tabs.tab1) {
      //this.editClick(this.PONumber);
      this.purchaseOrder.editclick(this.purchaseDetail);
    } else if (this.selectedTab == this.tabs.tab2) {
      const rights = JSON.parse(localStorage.getItem('Rights'));
      if (rights) {
        var pageModuleRights = rights.filter(
          (x) =>
            x.subModuleName == 'Line Items' && x.moduleName == 'Maintain POR'
        );
        this.menuService.isEditRight = pageModuleRights.find(
          (x) => x.tabName.toLowerCase() == 'edit'
        );
      } else {
        this.menuService.isEditRight = true;
      }
      this.lineitems.editclick(this.PONumber, this.purchaseDetail);
      //this.editClick(this.PONumber);
    } else if (this.selectedTab == this.tabs.tab3) {
      //this.editClick(this.PONumber);
      this.notes.editNoteClick(this.PONumber);
    } else if (this.selectedTab == this.tabs.tab4) {
      //this.editClick(this.PONumber);
      this.PurchaseOrderHistory.historyList(this.PONumber);
    } else {
    }
  }
  resetPopup1() {}
  closePopup1() {
    this.show = !this.show;
  }
  onCopy() {
    this.displayCopy = !this.displayCopy;
    this.PORNumber = '';
    this.form.controls['txtPONumer'].setValue(null);
  }
  onCopyClose(status) {
    if (status == 'Copy') {
      this.displayCopy = !this.displayCopy;
      this.displayCopyClose = !this.displayCopyClose;
    } else {
      this.displayCopy = !this.displayCopy;
    }
  }
  onCloseCopy() {
    this.isInvalidCopy = false;
    this.displayCopy = !this.displayCopy;
  }
  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.purchaseOrderViewData = {
      data: orderBy(this.purchaseOrderViewData, this.sort),
      total: this.purchaseOrderViewData.length,
    };
    this.purchaseOrderViewData = this.purchaseOrderViewData.data;
    this.mySelection = [0];
    this.purchaseOrderViewData.SortColumn = this.sort[0].field;
    this.purchaseOrderViewData.SortDesc =
      this.sort[0].dir == 'asc' ? false : true;
    this.purchasingFilterModel.sortColumn =
      this.purchaseOrderViewData.SortColumn;
    this.purchasingFilterModel.sortDesc = this.purchaseOrderViewData.SortDesc;
    this.savePreference();
    this.GetPurchaseOrderView(this.purchasingFilterModel);
  }
  GetPurchaseOrderView(data) {
    if (this.branchCode == 'All') {
      this.showAll = true;
      this.purchasingFilterModel.showAll = this.showAll;
    } else {
      this.purchasingFilterModel.showAll = this.showAll;
    }
    this.purchasingFilterModel.pageNumber = this.pageNumber;
    this.purchasingFilterModel.pageSize = this.pageSize;

    this.purchaseOrderViewData = [];
    this.visible = false;
    this.visible = true;
    this.purchasingService
      .GetPurchasingOrder(this.purchasingFilterModel)
      .subscribe(
        (res) => {
          if (res.length > 0) {
            this.totalData = res[0].totalRecords;
            this.purchaseOrderViewData = res;
            total: this.purchaseOrderViewData.length;
            this.getPreference();
            this.visible = true;
            this.visible = false;
            // if (
            //   this.PONumber == '' ||
            //   this.PONumber === undefined ||
            //   this.PONumber == null
            // ) {
            //   this.editClick(this.purchaseOrderViewData[0].poNumber);
            // } else {
            //   this.editClick(this.PONumber);
            // }
          } else {
            this.visible = true;
            this.visible = false;
          }
        },
        (error) => {
          // this.onError(error, ErrorMessages.inventory.load_invenotry);
        }
      );
  }
  public onPageChange(e: PageChangeEvent): void {
    this.skip = e.skip;
    this.pageSize = e.take;
    this.purchasingFilterModel.pageNumber =
      this.skip == 0 ? 0 : this.skip / this.pageSize + 1;
    if (this.purchasingFilterModel.pageNumber == 0) {
      this.purchasingFilterModel.pageNumber = 1;
    }
    this.filterCollection.pageSize = this.pageSize;
    this.tempPageNo = this.pagerService.start;
    this.pageNumber = this.purchasingFilterModel.pageNumber;
    // this.currentPage = this.pageNumber;
    //this.skip = event.skip;
    this.GetPurchaseOrderView(this.purchasingFilterModel);
  }
  onPageSizechange(pagesize) {
    this.pageSize = pagesize;
    this.GetPurchaseOrderView(this.purchasingFilterModel);
  }
  GetPO() {
    // this.visible = false;
    // this.visible = true;
    this.dropdownservice.GetPONumberList(this.showActive).subscribe(
      (res) => {
        if (res) {
          this.poNumberList = res;

          // this.visible = true;
          // this.visible = false;
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.Purchase_Order.dropdown_PO_Number);
      }
    );
  }
  private onError(error: any, customMessage?: string) {
    this.errorHandler.handleError(
      error,
      ModuleNames.purchase_order,
      customMessage
    );
  }
  savePreference() {
    var usr = JSON.parse(localStorage.getItem('currentUser'));
    if (usr) {
      this.userPreferenceModel = new UserPreferenceModel();
      this.userPreferenceModel.userName = usr.userId;
      this.userPreferenceModel.id = 0;
      this.userPreferenceModel.userId = 0;
      this.userPreferenceModel.page = 'Purchase';
      var objd = {
        order: this.viewColumns,
        width: this.columnWidths,
        sortBy: this.sort,
      };
      this.userPreferenceModel.preference = objd; //'{ columns: ' + this.hiddenColumns + ', order: ' + this.sort[0].dir + ', width: "", sortBy: ' + this.sort[0].field + '}';
      this.preference
        .SaveUserPreference(this.userPreferenceModel)
        .subscribe((res) => {});
    }
  }
  getPreference() {
    try {
      this.preference.GetUserPreference('Purchase').subscribe((res) => {
        if (res.result) {
          var userPref = res.result.preference;
          this.viewColumns = userPref.order.filter((c) => c.isCheck == true);
          this.viewColumns.forEach((element) => {
            let col = this.viewColumns.findIndex((c) => c.Name == element.Name);
            this.viewColumns[col].isCheck = true;
          });
          this.sort = userPref.sortBy;
          this.purchaseOrderViewData = {
            data: orderBy(this.purchaseOrderViewData, this.sort),
            total: this.purchaseOrderViewData.length,
          };
          this.purchaseOrderViewData = this.purchaseOrderViewData.data;
          this.totalData = this.purchaseOrderViewData.total;
        } else {
          this.viewColumns.forEach((element) => {
            let col = this.viewColumns.findIndex((c) => c.Name == element.Name);
            this.viewColumns[col].isCheck = true;
          });
          this.purchaseOrderViewData = this.purchaseOrderViewData;
        }

        this.viewColumns = this.viewColumns.filter((x) => x.isDisable == false);
        // this.editClick(this.purchaseOrderViewData[0].poNumber);
        if (
          this.PONumber == '' ||
          this.PONumber === undefined ||
          this.PONumber == null
        ) {
          this.editClick(this.purchaseOrderViewData[0].poNumber);
        } else {
          this.editClick(this.PONumber);
        }
      });
    } catch (error) {
      this.viewColumns.forEach((element) => {
        let col = this.viewColumns.findIndex((c) => c.Name == element.Name);
        this.viewColumns[col].isCheck = true;
      });
      // this.GetPurchaseOrderView(this.purchaseOrderViewData[0].id);
      if (
        this.PONumber == '' ||
        this.PONumber === undefined ||
        this.PONumber == null
      ) {
        this.editClick(this.purchaseOrderViewData[0].poNumber);
      } else {
        this.editClick(this.PONumber);
      }
    }
  }
  GetBranch() {
    this.branch = this.utility.storage.CurrentUser.userBranch;
    var index = this.branch.findIndex((c) => c.value == 'SSG');
    this.branch.splice(index, 1);
    this.branchData = this.branch;
  }
  editClick(PONumber: string) {
    this.isDisableGrid = false;
    this.PONumber = PONumber;
    this.GetReceivePOR(); this.GetPrintCount();
    this.purchasingService.GetPODetails(PONumber).subscribe((res) => {
      this.purchaseDetail =res;
      if (this.PONumber != null && this.PONumber !== undefined) {
        if (this.selectedTab == this.tabs.tab1) {
          this.purchaseOrder.editclick(res);
        } else if (this.selectedTab == this.tabs.tab2) {
          this.isAdd = true;
          this.isEdit = false;
          this.lineitems.editclick(PONumber, res);
        } else if (this.selectedTab == this.tabs.tab3) {
          this.isAdd = true;
          this.isEdit = true;
          this.notes.editNoteClick(PONumber);
        } else if (this.selectedTab == this.tabs.tab4) {
          this.isAdd = true;
          this.isEdit = true;
          this.PurchaseOrderHistory.historyList(PONumber);
        }
      } else {
      }
    });
  }
  onSearchFilter() {
    this.Search = this.form.get('description').value;
    if (this.Search == '') {
      this.purchasingFilterModel.pageNumber = 1;
      this.pageNumber = this.purchasingFilterModel.pageNumber;
      this.skip = 0;
      this.purchasingFilterModel.Search = this.Search;
      this.GetPurchaseOrderView(this.purchasingFilterModel);
    }
  }
  onSearchClick() {
    this.Search = this.form.get('description').value;
    this.PONumber = '';
    this.purchasingFilterModel.pageNumber = 1;
    this.pageNumber = this.purchasingFilterModel.pageNumber;
    this.skip = 0;
    this.purchasingFilterModel.Search = this.Search;
    this.GetPurchaseOrderView(this.purchasingFilterModel);
  }
  btnAdd() {
    if (this.selectedTab == this.tabs.tab1) {
      this.isAdd = true;
      this.isEdit = true;
      this.isCancel = true;
      this.isSave = true;
      this.isDisableTab = true;
      this.isDisableGrid = true;
      this.isDisableLineItemsTab = true;
      this.purchaseOrder.btnAdd();
    } else if (this.selectedTab == this.tabs.tab2) {
      this.isDisableTab = true;
      this.isDisableGrid = true;
      this.isDisablePOTab = true;
    }
  }
  btnCancel() {
    // this.isCancel = true;
    this.isAdd = false;
    this.isEdit = false;
    this.isSave = false;
    this.isCancel = false;
    this.isDisableTab = false;
    this.isDisableGrid = false;
    this.isDisablePOTab = false;
    this.isDisableLineItemsTab = false;
    if (this.selectedTab == this.tabs.tab1) {
      this.purchaseOrder.btnCancel();
    } else if (this.selectedTab == this.tabs.tab2) {
      this.isAdd = false;
      this.isSave = false;
      this.lineitems.btnCancel();
    }
    this.editClick(this.PONumber);
  }
  btnEdit() {
    if (this.selectedTab == this.tabs.tab1) {
      this.isAdd = true;
      this.isEdit = true;
      this.isCancel = true;
      this.isSave = true;
      this.isDisableGrid = true;
      this.purchaseOrder.btnEdit();
    } else if (this.selectedTab == this.tabs.tab2) {
      this.isAdd = true;
      this.isEdit = true;
      this.isCancel = true;
      this.isSave = true;
      this.isDisableTab = true;
      this.isDisablePOTab = true;
      this.isDisableGrid = true;
      this.lineitems.btnEdit();
    }
  }
  onSave() {
    if (this.selectedTab == this.tabs.tab1) {
      this.purchaseOrder.OnSave();
      this.btnCancel();
      setTimeout(() => {
        this.GetPurchaseOrderView(this.purchasingFilterModel);
      }, 1500);
    } else if (this.selectedTab == this.tabs.tab2) {
      this.lineitems.OnSave();
      this.btnCancel();
    }
  }
  onSubmitPOR() {
    this.displaySubmitPOR = !this.displaySubmitPOR;
  }
  onReceivePOR() {
    this.displayReceivePOR = !this.displayReceivePOR;
    this.receivePORData.forEach((element) => {
      let exist = this.form.contains(element.pk);
      if (exist) {
        this.form.controls[element.pk].setValue(null);
      }
    });
  }
  onClosePOR() {
    this.displayClosePOR = !this.displayClosePOR;
    this.purchasingService.GetPODetails(this.PONumber).subscribe((res) => {
      if (res != null) {
        if (res.vendorId == 3733) {
          if (res.status != 'SHIPPED') {
            this.closePoMessage =
              'You have not shipped all Line Items. Continuing will void out the rest of the POR, Proceed?';
          } else {
            this.closePoMessage = 'Closing POR, Proceed?';
          }
        } else {
          if (res.status != 'RECEIVED') {
            this.closePoMessage =
              'You have not received all Line Items. Continuing will void out the rest of the POR, Proceed?';
          } else {
            this.closePoMessage = 'Closing POR, Proceed?';
          }
        }
      } else {
        this.closePoMessage =
          'You are attempting to close a POR without any line items, Proceed?';
      }
    });
  }

  GetReceivePOR() {
    this.purchasingService
      .GetPurchaseOrderReceivePOR(this.PONumber)
      .subscribe((res) => {
        this.receivePORData = res;
        if (this.receivePORData.length > 0) {
          if (this.receivePORData[0].status == 'CLOSED') {
            this.isDisableReceiveAll = true;
          } else if (
            this.receivePORData[0].status != 'CLOSED' ||
            this.receivePORData[0].status === undefined
          ) {
            this.isDisableReceiveAll = false;
          }
          // this.initForm();

          this.receivePORData.forEach((element) => {
            let exist = this.form.contains(element.pk);
            if (exist) {
              this.form.removeControl(element.pk);
            }
            this.form.addControl(element.pk, new FormControl(''));
          });
        }
      });
  }
  onHandleReceiveDialog() {
    this.isReceiveDialog = !this.isReceiveDialog;
    this.poStatus = 'Partially Received';
  }
  onHandleErrorDialog() {
    if (this.isNegative) {
      this.form.controls[this.validateQtyPK].setValue(null);
      this.isNegative = !this.isNegative;
      this.isNegative = false;
    }
    if (this.isGreaterQuantity) {
      this.form.controls[this.validateQtyPK].setValue(null);
      this.isGreaterQuantity = !this.isGreaterQuantity;
      this.isGreaterQuantity = false;
    }
  }
  onHandleReceiveAllDialog() {
    this.receivedPOItems = [];
    this.poStatus = 'CLOSED';
    this.receivePORData.forEach((element) => {
      var receivePO = {
        poNumber: this.PONumber,
        poDetailId: element.pk,
        totalReceivedQty: element.quantity,
        receivedQty: element.quantity,
        partNumber: element.partNumber,
        poStatus: this.poStatus,
        userId: 0,
      };
      this.receivedPOItems.push(receivePO);
    });
    this.saveRecievePO(this.receivedPOItems);
  }
  onReceiveValueChange(data, event, id) {
    var bla = $('#demo' + id).val();
    this.validateQtyPK = id;
    console.log(data);
    console.log('rec qty' + event);
    if (event == '') {
      let existingItem = this.receivedPOItems.find(
        (i) => i.poDetailId == data.pk
      );
      if (existingItem != null && existingItem != undefined) {
        let index = this.receivedPOItems.indexOf(existingItem);
        if (index !== -1) {
          this.receivedPOItems.splice(index, 1);
        }
      }
    } else {
      let mainQty = data.quantity;
      let recQty = data.recdQty;
      let newQty = parseInt(event);
      if (newQty < 0) {
        this.isNegative = true;

        return;
      }
      if (recQty == null) {
        if (newQty > data.quantity) {
          this.isGreaterQuantity = true;

          return;
        }
      } else {
        if (newQty > data.quantity - data.recdQty) {
          this.isGreaterQuantity = true;

          return;
        }
      }

      let existingItem = this.receivedPOItems.find(
        (i) => i.poDetailId == data.pk
      );
      let totalQty = 0;
      if (data.recdQty == null) {
        totalQty = parseInt(event);
      } else {
        totalQty = data.recdQty + parseInt(event);
      }
      if (existingItem == null || existingItem == undefined) {
        var receivePO = {
          poNumber: this.PONumber,
          poDetailId: data.pk,
          totalReceivedQty: totalQty,
          receivedQty: parseInt(event),
          partNumber: data.partNumber,
          poStatus: this.poStatus,
          userId: 0,
        };
        this.receivedPOItems.push(receivePO);
      } else {
        let index = this.receivedPOItems.indexOf(existingItem);
        var receivePO = {
          poNumber: this.PONumber,
          poDetailId: data.pk,
          totalReceivedQty: totalQty,
          receivedQty: parseInt(event),
          partNumber: data.partNumber,
          poStatus: this.poStatus,
          userId: 0,
        };
        this.receivedPOItems[index] = receivePO;
      }
    }
  }
  onHandleReceiveConfirmDialog() {
    this.isReceiveDialog = false;

    if (this.receivedPOItems.length > 0) {
      this.saveRecievePO(this.receivedPOItems);
    }
  }
  saveRecievePO(data) {
    this.purchasingService.saveRecievePO(data).subscribe(
      (res) => {
        if (res['status'] == 200) {
          this.utility.toast.success(res['message']);
          this.receivedPOItems = [];
          this.displayReceivePOR = !this.displayReceivePOR;
          setTimeout(() => {
            this.GetPurchaseOrderView(this.purchasingFilterModel);
          }, 1500);
          this.mySelection = [0];
        } else {
          this.isReceiveConfirmDialog = false;
          this.onReceivePOR();
        }
        this.receivedPOItems = [];
      },
      (error) => {
        this.onError(error, ErrorMessages.fleet.save_note);
      }
    );
  }
  ReceivePOR() {
    this.purchasingService.ReceivePOR(this.PONumber).subscribe(
      (res) => {
        this.receivePORData = res;
      },
      (error) => {}
    );
  }
  onCopyPOR() {
    let txtPONumber = this.form.get('txtPONumer').value;
    if (txtPONumber != '' || txtPONumber != undefined) {
      this.purchasingService.GetPODetails(txtPONumber).subscribe((res) => {
        if (res != null) {
          this.onSaveCopyPO(res);
        } else {
          this.utility.toast.warning('Invalid POR Number. Try again.');
          this.onCloseCopy();
        }
      });
    }
  }
  onSaveCopyPO(poDetail) {
    this.purchaseOrder.onSaveCopyPOR(poDetail);
    this.displayCopy = !this.displayCopy;
    setTimeout(() => {
      this.GetPurchaseOrderView(this.purchasingFilterModel);
    }, 1500);
  }
  onClosePoYesClick(poDetail) {
    this.purchaseOrder.onSaveClosePOR(poDetail);
    this.displayClosePOR = !this.displayClosePOR;
    setTimeout(() => {
      this.GetPurchaseOrderView(this.purchasingFilterModel);
    }, 1500);
  }
  onClosePoNoClick() {
    this.displayClosePOR = !this.displayClosePOR;
  }
  downloadFile() {
    this.purchasingService.downloadPOHeaderData(this.PONumber).subscribe(
      (res) => {
        if (res.length > 0) {
          let excelData = new PurchaseOrderExcelFileViewResultModel();
          res.forEach((element) => {
            excelData.fileName = element.fileName;
            excelData.filePath = element.filePath;
            this.purchasingService
              .downloadPOExcelFiles(excelData)
              .subscribe((res) => {
                let data = new Blob([res], {
                  type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;',
                });
                fileSaver.saveAs(
                  data,
                  'POR-' +
                    this.PONumber +
                    +'_' +
                    new Date().toLocaleDateString('en-US') +
                    '.xlsx'
                );
              });
          });
        }

        // let data = new Blob([res], {
        //   type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;',
        // });

        // fileSaver.saveAs(
        //   data,
        //   'POR-' +
        //     this.PONumber +
        //     +'_' +
        //     new Date().toLocaleDateString('en-US') +
        //     '.xlsx'
        // );
      },
      (error) => {
        this.onError(
          error,
          ErrorMessages.Purchase_Order.download_PO_Header_Excel
        );
      }
    );
  }
  GetPrintCount() {
    this.purchasingService.GetPrintCount(this.PONumber).subscribe((res) => {
      if (res) {
        this.printCount = res;        
        this.purchaseOrder.printCount = this.printCount;
      } else {
        this.printCount = 0;
      }
    });
  }
}
