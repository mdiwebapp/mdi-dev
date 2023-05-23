import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as fileSaver from 'file-saver';
import {
  DataStateChangeEvent,
  PageChangeEvent,
} from '@progress/kendo-angular-grid';
import {
  orderBy,
  process,
  SortDescriptor,
  State,
} from '@progress/kendo-data-query';
import { MenuService } from 'src/app/core/helper/menu.service';
import { PartTabs } from 'src/app/core/models/enum-model';
import { UserPreferenceModel } from 'src/app/core/models/preference.model';
import { DropdownService } from 'src/app/core/services/dropdown.service';
import { UserPreferenceService } from 'src/app/core/services/user-preference.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { PartHistoryComponent } from '../part-history/part-history.component';
import { PartInfoComponent } from '../part-info/part-info.component';
import { PartComponent } from '../part/part.component';
import { PartsModel } from './parts.model';
import { PartsService } from './parts.service';
import { PaginationRequest } from 'src/app/core/models/pagination.model';
import { PagerService } from 'src/app/core/services/pager.service';
import { PurchasingComponent } from '../purchasing/purchasing.component';
import { EngineeringComponent } from '../engineering/engineering.component';
import { PricingComponent } from '../pricing/pricing.component';
import { ModuleNames, ErrorMessages } from 'src/app/core/constant';
import { ErrorHandlerService } from 'src/app/core/services';
import { InventoryComponent } from '../inventory/inventory.component';

@Component({
  selector: 'app-partlist',
  templateUrl: './partlist.component.html',
  styleUrls: ['./partlist.component.scss'],
})
export class PartlistComponent implements OnInit {
  @Input() gridList: any;
  @ViewChild(PartComponent) part: PartComponent;
  @ViewChild(PartInfoComponent) partInfo: PartInfoComponent;
  @ViewChild(PurchasingComponent) purchasing: PurchasingComponent;
  @ViewChild(EngineeringComponent) engineering: EngineeringComponent;
  @ViewChild(PricingComponent) pricing: PricingComponent;
  @ViewChild(PartHistoryComponent) partHistory: PartHistoryComponent;
  @ViewChild(InventoryComponent) partInventory: InventoryComponent;
  public totalData = 0;
  public pageSize = 100;
  public skip = 0;
  loader: any;
  public sort: SortDescriptor[] = [
    {
      field: 'vendorName',
      dir: 'asc',
    },
  ];
  public mySelection: number[] = [0];
  multiple: boolean = false;
  isSave: boolean = true;
  isCancel: boolean = true;
  isEdit: boolean = false;
  isAdd: boolean = false;
  isAddRight: boolean = false;
  isUpdateRight: boolean = false;
  isTab1: boolean = false;
  isTab2: boolean = false;
  isTab3: boolean = false;
  isTab4: boolean = false;
  isTab5: boolean = false;
  isTab6: boolean = false;
  isTab7: boolean = false;
  isTabBarcode: boolean = false;
  tabList = {
    VendorInfo: true,
    MoreInfo: true,
    Contacts: true,
    Activity: true,
    Notes: true,
    History: true,
  };
  data: any;
  @Input() onChange;
  tempParts: PartsModel[];
  id: number;
  cdate: any;
  status: boolean = true;
  inactive: boolean = true;
  tabActive: boolean = true;
  isDisable: boolean = true;
  show: boolean;
  displayBarcodePopup: boolean;
  cInfos: any;
  selectedTab = 'Parts';
  selectedTabIndex = 0;
  tempId: number;
  filterText: string;
  filterStatus: any = [];
  assignTo: any = [];
  lstFrequency: any = [];
  categoryList: any = [];
  tempcategoryList: any = [];
  subCategoryList: any = [];
  tempsubCategoryList: any = [];
  AllsubCategoryList: any = [];
  isDisabled: boolean = true;
  filterCategory: boolean = false;
  filterSubCategory: boolean = false;
  filterVendor: boolean = false;
  filterInstock: boolean = false;
  pageSizeList: any = [
    { id: 0, value: 100 },
    { id: 0, value: 300 },
    { id: 0, value: 500 },
  ];
  statusData: any = [
    { id: -1, value: 'All' },
    { id: 0, value: 'Active' },
    { id: 1, value: 'InActive' },
    // { id: 2, value: 'Substitude' },
    // { id: 3, value: 'InDevelopment' },
    // { id: 4, value: 'DisContinued' },
  ];
  branch: any[] = [];
  PartTypeData: any = [
    { id: 0, value: 'All' },
    { id: 1, value: 'Rental' },
    { id: 2, value: 'Global' },
    { id: 3, value: 'Service' },
    { id: 4, value: 'Component' },
  ];
  branchData: any;
  branchAll = [
    {
      id: 0,
      value: 'All',
      code: null,
      // userId: null,
      // branchId: 0,
      // branchName: 'All',
      // branchCode: null,
    },
  ];
  branchCode: any;
  filterCollection: any = {
    // pageNumber: this.skip,
    // pageSize: this.pageSize,
    status: 0,
    type: 0,
    //  branchIds: [],
    category: '',
    subCategory: '',
    vendorId: 0,
    inStock: false,
    searchText: '',
  };
  toggleText: string;
  public columns: any = [
    {
      Name: 'availableQty',
      isCheck: false,
      Text: 'Available Quantity',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'category',
      isCheck: false,
      Text: 'Category',
      isDisable: false,
      index: 1,
      width: 100,
    },
    {
      Name: 'subCategory',
      isCheck: false,
      Text: 'Sub-Category',
      isDisable: false,
      index: 2,
      width: 100,
    },
    {
      Name: 'description',
      isCheck: false,
      Text: 'Description',
      isDisable: false,
      index: 3,
      width: 100,
    },
    {
      Name: 'onHandQty',
      isCheck: false,
      Text: 'On Hand Quantity',
      isDisable: false,
      index: 4,
      width: 100,
    },
    {
      Name: 'onOrderQty',
      isCheck: false,
      Text: 'On Order Quantity',
      isDisable: false,
      index: 5,
      width: 100,
    },
    {
      Name: 'status',
      isCheck: false,
      Text: 'Status',
      isDisable: false,
      index: 6,
      width: 100,
    },
    {
      Name: 'inventoryType',
      isCheck: true,
      Text: 'Type',
      isDisable: true,
      index: 7,
      width: 100,
    },
  ];
  public viewColumns = [
    {
      Name: 'inventoryType',
      isCheck: true,
      Text: 'Type',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'description',
      isCheck: true,
      Text: 'Description',
      isDisable: false,
      index: 1,
      width: 100,
    },
  ];
  userPreferenceModel: UserPreferenceModel;
  hiddenColumns = ['status', 'terms', 'phone', 'email', 'address'];
  partData: any;
  partNum: any;
  tabs = PartTabs;
  lstVendors: any = [];
  templstVendors: any = [];
  barcode: string = '';
  tempPageNo: number;
  isLoading: boolean = false;
  isDataExists: boolean = false;

  constructor(
    public service: PartsService,
    public menuService: MenuService,
    public utils: UtilityService,
    public router: Router,
    public dropdownservice: DropdownService,
    private utility: UtilityService,
    public preference: UserPreferenceService,
    public pagerService: PagerService,
    public errorHandler: ErrorHandlerService
  ) {
    if (localStorage.getItem('isAdmin') == 'true') {
      this.isTab1 = false;
      this.isTab2 = false;
      this.isTab3 = false;
      this.isTab4 = false;
      this.isTab5 = false;
      this.isTab6 = false;
      this.isTab7 = false;
    } else {
      let acc = this.menuService.checkUserViewRights('Parts');
      if (acc) {
        //this.utils.toast.error("User does not have rights to access " + name + " module.");Z
      } else {
        this.router.navigate(['dashboard']);
      }
      const rights = JSON.parse(localStorage.getItem('Rights'));
      if (rights) {
        this.isTab1 = !rights.some(
          (c) =>
            c.subModuleName == 'Parts' &&
            c.moduleName == 'Parts' &&
            c.tabName == 'VIEW'
        );
        this.isTab2 = !rights.some(
          (c) =>
            c.subModuleName == 'Inventory' &&
            c.moduleName == 'Parts' &&
            c.tabName == 'VIEW'
        );
        this.isTab3 = !rights.some(
          (c) =>
            c.subModuleName == 'Purchasing' &&
            c.moduleName == 'Parts' &&
            c.tabName == 'VIEW'
        );
        this.isTab4 = !rights.some(
          (c) =>
            c.subModuleName == 'Engineering' &&
            c.moduleName == 'Parts' &&
            c.tabName == 'VIEW'
        );
        this.isTab5 = !rights.some(
          (c) =>
            c.subModuleName == 'Pricing' &&
            c.moduleName == 'Parts' &&
            c.tabName == 'VIEW'
        );
        this.isTab6 = !rights.some(
          (c) =>
            c.subModuleName == 'Part Info' &&
            c.moduleName == 'Parts' &&
            c.tabName == 'VIEW'
        );
        this.isTab7 = !rights.some(
          (c) =>
            c.subModuleName == 'History' &&
            c.moduleName == 'Parts' &&
            c.tabName == 'VIEW'
        );
        this.isTabBarcode = !rights.some(
          (c) => c.moduleName == 'Parts' && c.tabName == 'Add Barcode'
        );
      }

      this.menuService.checkUserBySubmoduleRights('Parts');
      this.isAddRight = this.menuService.isAddRight;
      this.isUpdateRight = this.menuService.isEditRight;
    }
  }
  ngOnInit(): void {
    //this.filterCollection.branchIds.push(0);
    this.GetBranch();
    this.GetVendors();
    this.loadItems();
    this.GetCategory();
  }

  GetBranch() {
    this.isLoading = true;
    this.branch = this.branchAll.concat(
      this.utility.storage.CurrentUser.userBranch
    );
    this.branchData = this.branch;
  }
  GetCategory() {
    this.isLoading = true;
    this.dropdownservice.GetCategoryList().subscribe((res) => {
      if (res) {
        this.categoryList = res;
        this.tempcategoryList = res;
        this.GetSubCategory(0);
        this.isLoading = false;
      }
      (error) => this.onError(error, ErrorMessages.drop_down.get_category_list);
      this.isLoading = false;
    });
  }
  GetSubCategory(category) {
    if (this.categoryList.length > 0) {
      if (category != undefined) {
        let id =
          category == 0
            ? 0
            : this.categoryList.find((c) => c.value == category).id;
        this.dropdownservice.GetSubCategoryList(id).subscribe(
          (res) => {
            if (res) {
              this.subCategoryList = res;
              this.tempsubCategoryList = res;
              if (category == 0) {
                this.AllsubCategoryList = res;
              }
            }
          },
          (error) =>
            this.onError(error, ErrorMessages.drop_down.get_sub_category_list)
        );
      } else {
        this.subCategoryList = this.AllsubCategoryList;
        this.tempsubCategoryList = this.AllsubCategoryList;
        this.filterCollection.subCategory = '';
      }
    }
    // let id = this.categoryList.find((c) => c.value == categoryId).id;
    // this.dropdownservice.GetSubCategoryList(id).subscribe(
    //   (res) => {
    //     if (res) {
    //       this.subCategoryList = res;
    //       this.tempsubCategoryList = res;
    //     }
    //   },
    //   (error) =>
    //     this.onError(error, ErrorMessages.drop_down.get_sub_category_list)
    // );
  }
  GetVendors() {
    this.isLoading = true;
    this.dropdownservice.GetVendorList().subscribe((res) => {
      if (res) {debugger
        this.lstVendors = res;
        this.templstVendors = res;
        this.isLoading = false;
      }
      (error) => this.onError(error, ErrorMessages.drop_down.get_vendor_list);
      this.isLoading = false;
    });
  }
  vendorFilter(value) {
    this.lstVendors = this.templstVendors.filter(
      (s) => s.vendorName.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }
  categoryFilter(value) {
    this.categoryList = this.tempcategoryList.filter(
      (s) => s.value.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }
  subcategoryFilter(value) {
    this.subCategoryList = this.tempsubCategoryList.filter(
      (s) => s.value.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }
  loadItems(): void {
    this.isLoading = true;
    var request = new PaginationRequest<any>();
    // request.start = this.pagerService.start;
    // request.end = this.pagerService.end;
    request.pageNumber = this.pagerService.start;
    request.pageSize = this.pageSize;

    request.request = this.filterCollection;
    this.data = [];
    this.tempParts = [];
    this.totalData = 0;
    this.service.GetList(request).subscribe(
      (res) => {
        if (res != null) {
          this.totalData = res.totalRecords;
          if (res != null && res.data.length > 0) {
            this.data = res.data;
            this.tempParts = res.data;
            this.loader = false;
            this.getPreference();
            // if (this.filterText)
            //   this.onFilter(this.filterText);
            //this.editClick(this.data[0].id);
            this.isDataExists = true;
            this.isLoading = false;
          } else {
            this.data = [];
            this.loader = false;
            this.editClick(0);
            this.isLoading = false;
            this.isDataExists = true;
          }
        }
        else {
          this.data = [];
          this.partNum = '';
          this.cdate = '';
          this.loader = false;
          this.editClick(0);
          this.isEdit = true;
          this.isAdd = true;
          this.isSave = true;
          this.isCancel = true;
          this.isLoading = false;
          this.isDataExists = false;
        }
      },
      (error) => this.onError(error, ErrorMessages.parts.get_list)
    );
  }
  columnApply() {
    // if (this.filterCollection.assignedTo) {
    //   this.filterassignedTo = true;
    //   this.assignedName = this.assignTo.find(
    //     (c) => c.id == this.filterCollection.assignedTo
    //   ).employeeName;
    // } else this.filterassignedTo = false;
    if (this.filterCollection.category) this.filterCategory = true;
    else {
      this.filterCategory = false;
      this.filterCollection.category = null;
    }
    if (this.filterCollection.subCategory) this.filterSubCategory = true;
    else {
      this.filterSubCategory = false;
      this.filterCollection.subCategory = null;
    }
    if (this.filterCollection.vendorId) {
      this.filterCollection.vendor = this.lstVendors.find(
        (c) => c.id == this.filterCollection.vendorId
      ).vendorName;
      this.filterVendor = true;
    } else {
      this.filterVendor = false;
      this.filterCollection.vendorId = 0;
      this.filterCollection.vendor = '';
    }
    if (this.filterCollection.inStock) this.filterInstock = true;
    else this.filterInstock = false;

    this.savePreference();
    /// Data Filter
    this.loadItems();
    this.show = false; // !this.show;
  }
  resetCategory() {
    this.filterCategory = false;
    this.filterCollection.category = '';
  }
  resetSubCategory() {
    this.filterSubCategory = false;
    this.filterCollection.subCategory = '';
    this.subCategoryList = this.AllsubCategoryList;
    this.tempsubCategoryList = this.AllsubCategoryList;
  }
  resetVendor() {
    this.filterVendor = false;
    this.filterCollection.vendorId = 0;
  }
  resetInstock() {
    this.filterInstock = false;
    this.filterCollection.inStock = false;
  }
  public hideColumn(): void {
    // this.temphiddenColumns = [];
    this.columns.forEach((element) => {
      if (element.isCheck) {
        var inde = this.viewColumns.find((c) => c.Name == element.Name);
        if (!inde) {
          this.viewColumns.push(element);
        }
        //this.temphiddenColumns.push(element.Name);
      } else {
        var index = this.viewColumns.findIndex((c) => c.Name == element.Name);
        //var index = this.viewColumns.indexOf(element);
        if (index > 0) {
          this.viewColumns.splice(index, 1);
        }
        //this.viewColumns.splice());
      }
    });
  }
  public onTabSelect(e) {
    this.selectedTab = e.title;
    this.selectedTabIndex = e.index;

    //this.editClick(this.id);
    console.log(this.selectedTab);
    if (this.selectedTab == this.tabs.tab1) {
      this.isAdd = false;this.isEdit = false;
      // setTimeout(() => {
      //   this.part.editClick(this.partData);
      // }, 300);
      this.menuService.checkUserBySubmoduleRights('Parts');
      this.isAddRight = this.menuService.isAddRight;
      this.isUpdateRight = this.menuService.isEditRight;
      this.part.editClick(this.partData);
    } else if (this.selectedTab == this.tabs.tab2) {
      this.isAdd = true;
      this.isEdit = true;
      this.partInventory.onEdit(this.partData);
      // this.menuService.checkUserBySubmoduleRights('Inventory');
    } else if (this.selectedTab == this.tabs.tab3) {
      this.isAdd = false;
      this.isEdit = false;
      this.purchasing.onEdit(this.partData.id);
    } else if (this.selectedTab == this.tabs.tab4) {
      this.isAdd = true;
      this.isEdit = true;
      this.engineering.BOMList(this.partData.id);
    } else if (this.selectedTab == this.tabs.tab5) {
      this.isAdd = true;
      this.isEdit = true;
      this.pricing.editClick(this.partData);
    } else if (this.selectedTab == this.tabs.tab6) {
      this.isAdd = true;
      this.isEdit = false;
      this.menuService.checkUserBySubmoduleRights('Part Info');
      this.isAddRight = this.menuService.isAddRight;
      this.isUpdateRight = this.menuService.isEditRight;
      this.partInfo.editClick(this.partData);
    } else if (this.selectedTab == this.tabs.tab7) {
      this.isAdd = true;
      this.isEdit = true;
      this.partHistory.historyList(this.partData.id);
      //this.partHistory.historyList(this.partData.id);
    }
  }

  editClick(id: number) {
    this.id = id;
    //    this.isEdit = false;
    this.tempId = id;
    this.isCancel = true;
    //    this.isAdd = false;
    this.isSave = true;
    //localStorage.removeItem('partBranch');
    this.service.GetById(id).subscribe(
      (res) => {
        if (res) {
          this.cdate = res['createdDate'];
          this.partNum = res['inventoryType'];
          this.inactive = res['closed'] == false ? true : false;
          this.isDisable = true;
          this.partData = res;
          if (this.selectedTab == this.tabs.tab1) {
            //
            this.isEdit = false;
            this.isAdd = false;
            this.part.editClick(res);
          }
          if (this.selectedTab == this.tabs.tab2) {
            this.isAdd = true;
            this.isEdit = true;
            this.partInventory.onEdit(res);
          }
          if (this.selectedTab == this.tabs.tab3) {
            this.isAdd = false;
            this.isEdit = false;
            this.purchasing.onEdit(res.id);
          }
          if (this.selectedTab == this.tabs.tab4) {
            this.isAdd = true;
            this.isEdit = true;
            this.engineering.BOMList(this.partData.id);
          }
          if (this.selectedTab == this.tabs.tab5) {
            this.isAdd = true;
            this.isEdit = true;
            this.pricing.editClick(res);
          }
          if (this.selectedTab == this.tabs.tab6) {
            this.isAdd = true;
            this.isEdit = false;
            this.partInfo.editClick(res);
          }
          if (this.selectedTab == this.tabs.tab7) {
            this.isAdd = true;
            this.isEdit = true;
            this.partHistory.historyList(this.partData.id);
          }
        } else {
          if (this.selectedTab == this.tabs.tab1) {
            this.isEdit = false;
            this.isAdd = false;
            this.part.editClick(null);
          } if (this.selectedTab == this.tabs.tab2) {
            this.isAdd = true;
            this.isEdit = true;
            this.partInventory.onEdit(null);
          }
          if (this.selectedTab == this.tabs.tab3) {
            this.isAdd = false;
            this.isEdit = false;
            this.purchasing.onEdit(null);
          }
          if (this.selectedTab == this.tabs.tab4) {
            this.isAdd = true;
            this.isEdit = true;
            this.engineering.BOMList(null);
          }
          if (this.selectedTab == this.tabs.tab5) {
            this.isAdd = true;
            this.isEdit = true;
            this.pricing.editClick(null);
          }
          if (this.selectedTab == this.tabs.tab6) {
            this.isAdd = true;
            this.isEdit = false;
            this.partInfo.editClick(null);
          }
          if (this.selectedTab == this.tabs.tab7) {
            this.isAdd = true;
            this.isEdit = true;
            this.partHistory.historyList(null);
          }
        }
      },
      (error) => this.onError(error, ErrorMessages.parts.get_by_id)
    );
  }

  onSave() {
    let saveStatus = false;
    if (this.selectedTab == this.tabs.tab1) {
      this.inactive = !this.inactive; // == true ? false : true;
      saveStatus = this.part.onSave(this.inactive);
      if (saveStatus == false) return false;
    }
    if (this.selectedTab == this.tabs.tab2) {
    }
    if (this.selectedTab == this.tabs.tab3) {
      this.purchasing.onSave();
    }
    if (this.selectedTab == this.tabs.tab4) {
    }
    if (this.selectedTab == this.tabs.tab6) {
      this.partInfo.onSave();
    }
    //if (saveStatus) return;
    this.isDisabled = true;
    this.isAdd = false;
    this.isEdit = false;
    setTimeout(() => {
      this.loadItems();
      //this.btnCancel();
    }, 1000);

    // this.editClick(this.tempId);
  }
  btnAdd() {
    this.enableBtn();
    this.isEdit = true;
    this.isAdd = true;
    this.isDisabled = false;
    this.tempId = this.id;
    this.id = 0;
    this.cdate = '';
    this.inactive = true;
    if (this.selectedTab == this.tabs.tab1) {
      this.part.btnAdd();
      // this.vendorInfo.form.reset();
      // this.vendorMoreInfo.form.reset();
      // this.vendorContacts.form.reset();
      // this.vendorNotes.form.reset();
    } else if (this.selectedTab === this.tabs.tab3) {
      this.purchasing.btnAdd();
    }
    // if (this.selectedTab == 1) this.vendorMoreInfo.btnAdd();
    // if (this.selectedTab == 2) this.vendorContacts.btnAdd();
    // if (this.selectedTab == 4) this.vendorNotes.btnAdd();
  }
  btnEdit() {
    this.isDisabled = false;
    this.enableBtn();
    this.isEdit = true;
    this.isAdd = true;
    this.tempId = this.id;
    if (this.selectedTab == this.tabs.tab1) {
      this.part.btnEdit();
    }
    if (this.selectedTab == this.tabs.tab6) {
      this.partInfo.btnEdit();
    }

    if (this.selectedTab === this.tabs.tab3) {
      this.purchasing.btnEdit();
    }
  }
  btnCancel() {
    this.disbaleBtn();
    this.isDisabled = true;
    if (this.selectedTab === this.tabs.tab3) {
      this.purchasing.btnCancel();
    } else {
      this.editClick(this.tempId);
    }
  }

  enableBtn() {
    this.isSave = false;
    this.isCancel = false;
  }
  disbaleBtn() {
    this.isSave = true;
    this.isCancel = true;
    this.isEdit = false;
    if (this.selectedTab == this.tabs.tab6) {
      this.isAdd = true;
    } else {
      this.isAdd = false;
    }
  }

  OnAddUpdate(res) {
    this.loadItems();
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
  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;

    this.data = {
      data: orderBy(this.data, this.sort),
      total: this.tempParts.length,
    };
    this.data = this.data.data;

    this.mySelection = [this.mySelection[0]];
    this.id = this.data[this.mySelection[0]].id;
    this.savePreference();
    this.editClickWithoutLoader(this.id);
  }
  public onFilter(inputValue: string): void {
    this.filterText = inputValue;
    this.mySelection = [];
    this.pagerService.start = inputValue ? 0 : this.tempPageNo;
    this.filterCollection.searchText = inputValue;
    this.loadItems();
    // this.data = process(this.tempParts, {
    //   filter: {
    //     logic: 'or',
    //     filters: [
    //       {
    //         field: 'availableQty',
    //         operator: 'contains',
    //         value: inputValue,
    //       },
    //       {
    //         field: 'category',
    //         operator: 'contains',
    //         value: inputValue,
    //       },
    //       {
    //         field: 'description',
    //         operator: 'contains',
    //         value: inputValue,
    //       },
    //       {
    //         field: 'inventoryType',
    //         operator: 'contains',
    //         value: inputValue,
    //       },
    //       {
    //         field: 'onHandQty',
    //         operator: 'contains',
    //         value: inputValue,
    //       },
    //       {
    //         field: 'onOrderQty',
    //         operator: 'contains',
    //         value: inputValue,
    //       },
    //       {
    //         field: 'status',
    //         operator: 'contains',
    //         value: inputValue,
    //       },
    //       {
    //         field: 'subCategory',
    //         operator: 'contains',
    //         value: inputValue,
    //       },
    //     ],
    //   },
    // }).data;
    // this.mySelection = [0];
    //this.tempParts = this.data;
  }

  VendorInActive(event) {
    // this.data = this.vendor.filter(x => x.inactive == event);
    this.status = event;
    this.id = 0;
    this.mySelection = [this.mySelection[0]];
    this.loadItems();
  }

  OnAddClick() {
    this.editClick(0);
    // this.SaveChange.next(null);
    this.id = 0;
    this.cdate = '';
  }
  // public state: State = {
  //   skip: 0,
  //   take: 5,

  //   // Initial filter descriptor
  //   filter: {
  //     logic: 'and',
  //     filters: [{ field: 'vendorName', operator: 'contains', value: 'Chef' }],
  //   },
  // };

  public dataStateChange(state: DataStateChangeEvent): void {
    // this.state = state;
    // this.data = process(this.tempParts, this.state);
  }
  PartTypeFilter(value) { }
  branchFilter(value) {
    this.branch = this.branchData.filter(
      (s) => s.value.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }
  dedicatedbranchchange(data) {
    var data1: any[] = [];
    if (data.length > 1) {
      if (data[0] === 0) {
        data.forEach((element) => {
          if (element != 0) {
            data1.push(element);
          }
        });
      } else if (data[0] !== 0) {
        data.forEach((element) => {
          if (element !== 0) {
            data1.push(element);
          } else if (data.includes(0)) {
            data1 = [];
            data1.push(0);
          }
        });
      }
    }
    if (data.length === 0) {
      data1 = [];
      data1.push(0);
    }
    //    this.filterCollection.branchIds = data1;
    // if (this.filterCollection.branchIds != null && this.filterCollection.branchIds.length > 0)
    //   if (this.filterCollection.branchIds.filter(x => x == 0).length > 0) {
    //     this.filterCollection.branchIds = this.filterCollection.branchIds.filter(x => x == 0);
    //   }
    this.loadItems();
  }
  public onToggle(): void {
    this.show = !this.show;
    this.toggleText = this.show ? 'Hidе' : 'Show';
  }
  closepopup() {
    this.filterCollection = {
      status: 0,
      type: 0,
      category: '',
      subCategory: '',
      vendorId: 0,
      inStock: false,
      searchText: '',
    };
    this.subCategoryList = this.AllsubCategoryList;
    this.tempsubCategoryList = this.AllsubCategoryList;
    this.show = !this.show;
  }
  savePreference() {
    var usr = JSON.parse(localStorage.getItem('currentUser'));

    this.userPreferenceModel = new UserPreferenceModel();
    this.userPreferenceModel.userName = usr.userId;
    this.userPreferenceModel.id = 0;
    this.userPreferenceModel.userId = 0;
    this.userPreferenceModel.page = 'Parts';
    var objd = {
      columns: this.hiddenColumns,
      order: this.viewColumns,
      width: this.columnWidths,
      sortBy: this.sort,
    };
    this.userPreferenceModel.preference = objd; //'{ columns: ' + this.hiddenColumns + ', order: ' + this.sort[0].dir + ', width: "", sortBy: ' + this.sort[0].field + '}';
    this.preference
      .SaveUserPreference(this.userPreferenceModel)
      .subscribe((res) => { });
  }
  getPreference() {
    try {
      this.preference.GetUserPreference('Parts').subscribe((res) => {
        if (res.result) {
          var userPref = res.result.preference;
          this.viewColumns = userPref.order.filter((c) => c.isCheck == true);
          this.viewColumns.forEach((element) => {
            let col = this.columns.findIndex((c) => c.Name == element.Name);
            this.columns[col].isCheck = true;
          });
          this.sort = userPref.sortBy;
          this.data = {
            data: orderBy(this.tempParts, this.sort),
            total: this.tempParts.length,
          };
          this.data = this.data.data;
        } else {
          this.viewColumns.forEach((element) => {
            let col = this.columns.findIndex((c) => c.Name == element.Name);
            this.columns[col].isCheck = true;
          });
          this.data = this.data;
        }
        if (this.id > 0) {
          this.mySelection = [this.mySelection[0]];
          this.editClick(this.tempId);
        } else {
          this.mySelection = [0];
          this.id = this.data[0].id;
          this.editClick(this.id);
        }
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

    this.savePreference();
  }
  columnWidths: any = [];
  resizeColumns(eventData) {
    let col = this.viewColumns.findIndex(
      (c) => c.Name == eventData[0].column.field
    );
    this.viewColumns[col].width = eventData[0].newWidth;
    this.savePreference();
  }
  public onBarcode(): void {
    this.displayBarcodePopup = !this.displayBarcodePopup;
  }
  closebarcodepopup() {
    this.barcode = '';
    this.displayBarcodePopup = !this.displayBarcodePopup;
  }
  downloadFile() {
    this.service.downloadPartData().subscribe(
      (res) => {
        let data = new Blob([res], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;',
        });
        fileSaver.saveAs(data, 'Parts_Info.xlsx');
      },
      (error) => this.onError(error, ErrorMessages.parts.download_part_data)
    );
    //window.open(environment.apiUrl + 'Vendor/ExportToExcel');
  }
  addBarcode() {
    if (!this.barcode) {
      this.utils.toast.error('Please enter barcode.');
      return false;
    }
    this.service.AddBarcode(this.id, this.barcode).subscribe(
      (res) => {
        if (res['status'] == 200) {
          this.utils.toast.success(res['message']);
        } else this.utils.toast.error(res['message']);
        this.barcode = '';
        this.partInfo.loadBarcodeList(res.result.barcodes);
        this.closebarcodepopup();
      },
      (failed) => { }
    );
  }

  editClickWithoutLoader(id: number) {
    this.id = id;
    this.isCancel = true;
    this.isSave = true;
    if (
      this.selectedTab == this.tabs.tab2 ||
      this.selectedTab == this.tabs.tab3 ||
      this.selectedTab == this.tabs.tab4 ||
      this.selectedTab == this.tabs.tab5
    ) {
      this.isAdd = true;
      this.isEdit = true;
    } else {
      this.isAdd = false;
      this.isEdit = false;
    }

    this.service.GetById(id).subscribe((res) => {
      if (res) {
        this.cdate = res['createdDate'];
        this.inactive = res['closed'] == false ? true : false;
        this.partNum = res['inventoryType'];
        this.isDisabled = false;
        if (this.selectedTab == this.tabs.tab1) {
          this.part.editClick(res);
        }
        if (this.selectedTab == this.tabs.tab2) this.partInventory.onEdit(res);
        if (this.selectedTab == this.tabs.tab4) this.purchasing.onEdit(res.id);
        if (this.selectedTab == this.tabs.tab5) this.pricing.editClick(res);
        if (this.selectedTab == this.tabs.tab6) this.partInfo.editClick(res.id);
        if (this.selectedTab == this.tabs.tab7)
          this.partHistory.historyList(this.partData.id);
      }
    });
  }
  onPageSizechange(pagesize) {
    this.pageSize = pagesize;
    this.loadItems();
  }
  private onError(error: any, customMessage?: string) {
    this.errorHandler.handleError(error, ModuleNames.parts, customMessage);
  }
  resetpopup() {
    this.utils.toast.success('Your prefernece is reset to default columns.');
    this.filterCollection = {
      status: 0,
      type: 0,
      category: '',
      subCategory: '',
      vendorId: 0,
      inStock: false,
      searchText: '',
    };
    this.subCategoryList = this.AllsubCategoryList;
    this.tempsubCategoryList = this.AllsubCategoryList;
    this.columns = [
      {
        Name: 'availableQty',
        isCheck: false,
        Text: 'Available Quantity',
        isDisable: false,
        index: 0,
        width: 100,
      },
      {
        Name: 'category',
        isCheck: false,
        Text: 'Category',
        isDisable: false,
        index: 1,
        width: 100,
      },
      {
        Name: 'subCategory',
        isCheck: false,
        Text: 'Sub-Category',
        isDisable: false,
        index: 2,
        width: 100,
      },
      {
        Name: 'description',
        isCheck: true,
        Text: 'Description',
        isDisable: false,
        index: 3,
        width: 100,
      },
      {
        Name: 'onHandQty',
        isCheck: false,
        Text: 'On Hand Quantity',
        isDisable: false,
        index: 4,
        width: 100,
      },
      {
        Name: 'onOrderQty',
        isCheck: false,
        Text: 'On Order Quantity',
        isDisable: false,
        index: 5,
        width: 100,
      },
      {
        Name: 'status',
        isCheck: false,
        Text: 'Status',
        isDisable: false,
        index: 6,
        width: 100,
      },
      {
        Name: 'inventoryType',
        isCheck: true,
        Text: 'Type',
        isDisable: true,
        index: 7,
        width: 100,
      },
    ];
    this.viewColumns = [
      {
        Name: 'inventoryType',
        isCheck: true,
        Text: 'Type',
        isDisable: false,
        index: 0,
        width: 100,
      },
      {
        Name: 'description',
        isCheck: true,
        Text: 'Description',
        isDisable: false,
        index: 1,
        width: 100,
      },
    ];
    this.savePreference();
    setTimeout(() => {
      this.loadItems();
    }, 700);
  }
  GetCategoryBySubcategory(category) {
    if (this.categoryList.length > 0) {
      let id =
        category == 0
          ? 0
          : this.subCategoryList.find((c) => c.value == category).categoryId;

      this.filterCollection.category = this.categoryList.find(
        (c) => c.id == id
      ).value;
    }
  }

  onFilterItems() {
    this.id = 0;
    this.loadItems();
  }
  setId() {
    if (this.filterCollection.status != -1)
      this.id = 0;
  }
}
