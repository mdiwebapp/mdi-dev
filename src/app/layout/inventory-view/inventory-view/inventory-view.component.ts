import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { InventoryService } from '../../logistics/inventory.service';
import { ErrorHandlerService } from 'src/app/core/services';
import { ModuleNames, ErrorMessages } from 'src/app/core/constant';
import { InventoryViewFilterModel } from '../inventory-view/inventory-view.model';
import { PagerService } from 'src/app/core/services/pager.service';
import { PageChangeEvent } from '@progress/kendo-angular-grid';
import { BranchService } from 'src/app/layout/admin/branch/branch.service';
import { BranchModel } from 'src/app/layout/admin/branch/branch.model';
import * as fileSaver from 'file-saver';
import { MenuService } from 'src/app/core/helper/menu.service';
import { PaginationRequest } from 'src/app/core/models/pagination.model';
import {
  orderBy,
  process,
  SortDescriptor,
  State,
} from '@progress/kendo-data-query';
import { UserPreferenceModel } from 'src/app/core/models/preference.model';
import { UserPreferenceService } from 'src/app/core/services/user-preference.service';
import { UtilityService } from 'src/app/core/services/utility.service';
@Component({
  selector: 'app-inventory-view',
  templateUrl: './inventory-view.component.html',
  styleUrls: ['./inventory-view.component.scss'],
})
export class InventoryViewComponent implements OnInit {
  form: FormGroup;
  isMersino: boolean;
  isAdd: boolean = true;
  isEdit: boolean = true;
  idCancel: boolean = false;
  isSave: boolean = false;
  displayTechCheckList: boolean = false;
  show: boolean = false;
  toggleText: string;
  diplayitemDrp: boolean = false;
  branchName: any;
  branch: any = [];
  branchData: any;
  yardData: any = [];
  visible: boolean;
  multiple: boolean = false;
  filterCollection: any = {
    id: 0,
    status: 1,
  };
  public sort: SortDescriptor[] = [
    {
      field: 'invType',
      dir: 'asc',
    },
    {
      field: 'invNumber',
      dir: 'asc',
    },
    {
      field: 'description',
      dir: 'asc',
    },
  ];
  data: any;
  columnWidths: any = [];
  public viewColumns = [
    {
      Name: 'branchName',
      isCheck: true,
      Text: 'Branch Name',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'invType',
      isCheck: true,
      Text: 'Inventory Type',
      isDisable: false,
      index: 1,
      width: 100,
    },
    {
      Name: 'invNumber',
      isCheck: true,
      Text: 'Inventory Number',
      isDisable: false,
      index: 2,
      width: 80,
    },
    {
      Name: 'hours',
      isCheck: true,
      Text: 'Hours',
      isDisable: false,
      index: 3,
      width: 50,
    },
    {
      Name: 'description',
      isCheck: true,
      Text: 'Description',
      isDisable: false,
      index: 4,
      width: 160,
    },
    {
      Name: 'quantity',
      isCheck: true,
      Text: 'Quantity',
      isDisable: false,
      index: 5,
      width: 50,
    },
    {
      Name: 'location',
      isCheck: true,
      Text: 'Location',
      isDisable: false,
      index: 6,
      width: 100,
    },

    {
      Name: 'porCost',
      isCheck: true,
      Text: 'POR Cost',
      isDisable: false,
      index: 7,
      width: 60,
    },
  ];
  public mySelection: number[] = [0];
  inventoryViewData: any = [];
  branchList = [];
  streamList = [];
  inventoryTypeList = [];
  invNumberList = [];
  locationList = [];
  inventoryViewFilterModel: InventoryViewFilterModel;
  showCost: boolean;
  showRent: boolean;
  Search: string;
  Yard: boolean = false;
  public totalData = 0;
  public pageSize = 100;
  public pageNumber = 1;
  public skip = 0;
  public currentPage = 1;
  tempPageNo: number;
  pageSizeList: any = [
    { id: 0, value: 100 },
    { id: 0, value: 300 },
    { id: 0, value: 500 },
  ];
  id: number;
  userPreferenceModel: UserPreferenceModel;
  constructor(
    private formBuilder: FormBuilder,
    public inventoryService: InventoryService,
    public errorHandler: ErrorHandlerService,
    public pagerService: PagerService,
    public branchService: BranchService,
    public menuService: MenuService,
    public preference: UserPreferenceService,
    private utility: UtilityService
  ) {
    if (localStorage.getItem('isAdmin') == 'false') {
      let acc = this.menuService.checkUserViewRights('inventory view');
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
      this.showCost = rights.some(
        (c) =>
          c.subModuleName == 'Maintain Inventory View' &&
          c.moduleName == 'Inventory View' &&
          c.tabName == 'Show Cost'
      );
    } else {
      this.showCost = true;
    }
    if (!this.showCost) {
      this.viewColumns[7].isDisable = true;
    }
  }

  ngOnInit() {
    this.initForm();
    this.pageSize = 100;
    // this.showCost = true;
    this.showRent = true;
    this.Search = '';
    this.inventoryViewFilterModel = new InventoryViewFilterModel();
    this.inventoryViewFilterModel.ShowCost = this.showCost;
    this.inventoryViewFilterModel.ShowRent = this.showRent;
    this.inventoryViewFilterModel.Search = this.Search;
    this.inventoryViewFilterModel.branchName = '';
    this.inventoryViewFilterModel.YardOnly = false;
    this.inventoryViewFilterModel.SortColumn = this.sort[0].field;
    this.inventoryViewFilterModel.SortDesc =
      this.sort[0].dir == 'asc' ? false : true;
    this.GetBranch();
    // this.GetLocation();
    this.GetInventoryView(this.inventoryViewFilterModel);
  }

  initForm(): void {
    this.form = this.formBuilder.group({
      branch: [],
      itemcode: [],
      checkrentalfleetonly: [true],
      checkyardonly: [false],
      checkInventory: [false],
      quantity: [],
      inventoryType: [],
      invNumber: [],
      description: [],
      location: [],
      porCost: [],
      avgCost: [],
    });
  }
  onFilter(value) {}
  public onToggle(): void {
    this.show = !this.show;
    this.toggleText = this.show ? 'Hidе' : 'Show';
  }
  columnApply() {}
  resetpopup() {}
  closepopup() {
    this.show = !this.show;
    this.toggleText = this.show ? 'Hidе' : 'Show';
  }

  onItem() {
    this.diplayitemDrp = !this.diplayitemDrp;
  }
  AddItem() {
    this.diplayitemDrp = !this.diplayitemDrp;
  }
  closepopup1() {
    this.diplayitemDrp = !this.diplayitemDrp;
  }
  GetInventoryView(data) {
    this.inventoryViewFilterModel.pageNumber = this.pageNumber;
    this.inventoryViewFilterModel.pageSize = this.pageSize;
    this.inventoryViewFilterModel.ExcelExport = false;
    this.inventoryViewData = [];
    this.visible = false;
    this.visible = true;
    this.inventoryService
      .GetInventoryView(this.inventoryViewFilterModel)
      .subscribe(
        (res) => {
          if (res.length > 0) {
            this.totalData = res[0].totalRecords;
            this.inventoryViewData = res;
            this.getPreference();

            this.visible = true;
            this.visible = false;
          }
          else
          {
            this.totalData = 0;
            this.visible = true;
            this.visible = false;
          }
        },
        (error) => {
          this.visible = true;
            this.visible = false;
          this.onError(error, ErrorMessages.inventory.load_invenotry);
        }
      );
  }
  private onError(error: any, customMessage?: string) {
    this.errorHandler.handleError(
      error,
      ModuleNames.vehicle_inventory,
      customMessage
    );
  }
  public onPageChange(e: PageChangeEvent): void {
    this.skip = e.skip;
    this.pageSize = e.take;
    this.inventoryViewFilterModel.pageNumber =
      this.skip == 0 ? 0 : this.skip / this.pageSize + 1;
    if (this.inventoryViewFilterModel.pageNumber == 0) {
      this.inventoryViewFilterModel.pageNumber = 1;
    }
    this.filterCollection.pageSize = this.pageSize;
    this.tempPageNo = this.pagerService.start;
    this.pageNumber = this.inventoryViewFilterModel.pageNumber;
    // this.currentPage = this.pageNumber;
    //this.skip = event.skip;
    this.GetInventoryView(this.inventoryViewFilterModel);
  }
  onPageSizechange(pagesize) {
    this.pageSize = pagesize;
    this.GetInventoryView(this.inventoryViewFilterModel);
  }
  GetBranch() {
    // this.visible = false;
    // this.visible = true;
    this.branchService.GetBranchDropdown().subscribe(
      (res) => {
        if (res) {
          this.branch = res;
          var index = this.branch.findIndex((c) => c.value == 'SSG');
          this.branch.splice(index, 1);
          this.branch.unshift({ code: 'All', id: 0, value: 'All' });
          this.branchData = this.branch;

          // this.visible = true;
          // this.visible = false;
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.branch.dropdown);
      }
    );
  }
  GetLocation() {
    this.branchService.GetLocationDropdown().subscribe((res) => {
      if (res) {
        this.locationList = res;
      }
    });
  }
  branchFilter(value) {
    this.branch = this.branchData.filter(
      (s) => s.value.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }
  branchChange(data) {
    this.branchName = data;
    if (data === undefined) {
      this.inventoryViewFilterModel.branchName = null;
    } 
    else if (data.code == 'All')
    {
      this.inventoryViewFilterModel.branchName = "";
    }
    else {
      this.inventoryViewFilterModel.branchName = this.branchName.value;
    }

    this.inventoryViewFilterModel.pageNumber = 1;
    this.pageNumber = this.inventoryViewFilterModel.pageNumber;
    this.skip = 0;
    //this.currentPage = this.pageNumber;
    this.GetInventoryView(this.inventoryViewFilterModel);
  }
  changeYardStatus(val) {
    // this.Yard = val;
    this.inventoryViewFilterModel.YardOnly = val;
    this.GetInventoryView(this.inventoryViewFilterModel);
  }
  changeRental(val) {
    this.showRent = val;
    this.inventoryViewFilterModel.ShowRent = this.showRent;
    this.GetInventoryView(this.inventoryViewFilterModel);
  }
  // onSearchFilter() {
  //   //this.Search = inputValue;
  //   this.Search = this.form.get('description').value;
  //   if (this.Search == '') {
  //     this.inventoryViewFilterModel.pageNumber = 1;
  //     this.pageNumber = this.inventoryViewFilterModel.pageNumber;
  //     this.skip = 0;
  //     this.inventoryViewFilterModel.Search = this.Search;
  //     this.GetInventoryView(this.inventoryViewFilterModel);
  //   }

  //   // setTimeout(() => {
  //   //   this.GetInventoryView(this.inventoryViewFilterModel);
  //   // }, 200);
  // }
  onSearchClick() {
    this.Search = this.form.get('description').value;
    this.inventoryViewFilterModel.pageNumber = 1;
    this.pageNumber = this.inventoryViewFilterModel.pageNumber;
    this.skip = 0;
    this.inventoryViewFilterModel.Search = this.Search;
    this.GetInventoryView(this.inventoryViewFilterModel);
  }
  downloadFile() {
    this.inventoryViewFilterModel.ExcelExport = true;
    this.inventoryService
      .downloadInventoryData(this.inventoryViewFilterModel)
      .subscribe(
        (res) => {
          let data = new Blob([res], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;',
          });
          fileSaver.saveAs(data, 'InventoryView_Info.xlsx');
        },
        (error) => {
          this.onError(error, ErrorMessages.vehicle.download_vehicle_data);
        }
      );
  }
  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.inventoryViewData = {
      data: orderBy(this.inventoryViewData, this.sort),
      total: this.inventoryViewData.length,
    };
    // this.inventoryViewData = this.inventoryViewData.data;
    this.mySelection = [0];
    // this.id = this.data[0].invType;
    this.inventoryViewFilterModel.SortColumn = this.sort[0].field;
    this.inventoryViewFilterModel.SortDesc =
      this.sort[0].dir == 'asc' ? false : true;
    this.savePreference();
    this.GetInventoryView(this.inventoryViewFilterModel);
  }
  resizeColumns(eventData) {
    let col = this.viewColumns.findIndex(
      (c) => c.Text == eventData[0].column.title
    );
    this.viewColumns[col].width = eventData[0].newWidth;
    this.savePreference();
  }
  savePreference() {
    var usr = JSON.parse(localStorage.getItem('currentUser'));
    if (usr) {
      this.userPreferenceModel = new UserPreferenceModel();
      this.userPreferenceModel.userName = usr.userId;
      this.userPreferenceModel.id = 0;
      this.userPreferenceModel.userId = 0;
      this.userPreferenceModel.page = 'Inventory View';
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
      this.preference.GetUserPreference('Inventory View').subscribe((res) => {
        if (res.result) {
          var userPref = res.result.preference;
          this.viewColumns = userPref.order.filter((c) => c.isCheck == true);
          this.viewColumns.forEach((element) => {
            let col = this.viewColumns.findIndex((c) => c.Name == element.Name);
            this.viewColumns[col].isCheck = true;
          });
          this.sort = userPref.sortBy;
          this.inventoryViewData = {
            data: orderBy(this.inventoryViewData, this.sort),
            total: this.inventoryViewData.length,
          };
          this.inventoryViewData = this.inventoryViewData.data;
        } else {
          this.viewColumns.forEach((element) => {
            let col = this.viewColumns.findIndex((c) => c.Name == element.Name);
            this.viewColumns[col].isCheck = true;
          });
          this.inventoryViewData = this.inventoryViewData;
        }

        if (!this.showCost) {
          this.viewColumns[7].isDisable = true;
        }
        this.viewColumns = this.viewColumns.filter((x) => x.isDisable == false);
      });
    } catch (error) {
      this.viewColumns.forEach((element) => {
        let col = this.viewColumns.findIndex((c) => c.Name == element.Name);
        this.viewColumns[col].isCheck = true;
      });
      this.GetInventoryView(this.inventoryViewData[0].id);
    }
  }
}
