import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  DataBindingDirective,
  DataStateChangeEvent,
} from '@progress/kendo-angular-grid';
import { BehaviorSubject } from 'rxjs';
import { MenuService } from 'src/app/core/helper/menu.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { VehicleService } from '../vehicle.service';
import {
  orderBy,
  process,
  SortDescriptor,
  State,
} from '@progress/kendo-data-query';
import { BranchService } from 'src/app/layout/admin/branch/branch.service';
import { BranchModel } from 'src/app/layout/admin/branch/branch.model';
import { VehicleInfoComponent } from '../vehicle-info/vehicle-info.component';
import { DropdownService } from 'src/app/core/services/dropdown.service';
import { Subscription } from 'rxjs';
import { EmployeeService } from 'src/app/layout/ssg/employee/employee/employee.service';
import { MultiSelectComponent } from '@progress/kendo-angular-dropdowns';
import { DropDownModel } from 'src/app/core/models/drop-down.model';
import { VehicleNotesComponent } from '../vehicle-notes/vehicle-notes.component';
import { VehicleHistoryComponent } from '../vehicle-history/vehicle-history.component';
import { VehicleActivityComponent } from '../vehicle-activity/vehicle-activity.component';
import { HistoryComponent } from '../history/history.component';
import { VehicleTabs } from '../../../../core/models/enum-model';
import { VehicleInventoryComponent } from '../vehicle-inventory/vehicle-inventory.component';
import { UserPreferenceService } from 'src/app/core/services/user-preference.service';
import { UserPreferenceModel } from 'src/app/core/models/preference.model';
import { NetworkDirectoryComponent } from 'src/app/layout/networkdirectory/networkdirectorypage/networkdirectory.component';
import * as fileSaver from 'file-saver';
import { PagerService } from 'src/app/core/services/pager.service';
import { PaginationRequest } from '../../../../core/models/pagination.model';
import { ModuleNames, ErrorMessages } from 'src/app/core/constant';
import { ErrorHandlerService } from 'src/app/core/services';
import { VehicleNotesModel } from '../vehicle-notes/vehicle-notes.model';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.scss'],
})
export class VehicleComponent implements OnInit {
  @ViewChild(DataBindingDirective) dataBinding: DataBindingDirective;
  @ViewChild(VehicleInfoComponent) vehicleInfo: VehicleInfoComponent;
  @ViewChild(VehicleNotesComponent) vehicleNotes: VehicleNotesComponent;
  @ViewChild(VehicleHistoryComponent)
  vehicleServiceHistory: VehicleHistoryComponent;
  @ViewChild(HistoryComponent) vehicleHistory: HistoryComponent;
  @ViewChild(VehicleActivityComponent)
  vehicleActivity: VehicleActivityComponent;
  @ViewChild(VehicleInventoryComponent)
  vehicleInventory: VehicleInventoryComponent;

  @ViewChild(NetworkDirectoryComponent)
  networkDirectory: NetworkDirectoryComponent;

  @ViewChild('multiselect') public multiselect: MultiSelectComponent;
  @Input() gridList: any;
  public pageSize = 5;
  public skip = 0;
  loader: any;
  branchList: any;
  tempvendor: any;
  public expFromvalue: Date = new Date(2000, 2, 10);
  public expTovalue: Date = new Date(2000, 2, 10);
  public RegFromvalue: Date = new Date(2000, 2, 10);
  public RegTovalue: Date = new Date(2000, 2, 10);
  multiple: boolean = false;
  // filterpopup = {
  //   assignedTo: "", frequency: [], miledge: "", terms: "", AnnualInspectionExpiresOn: "", RegistrationExpires: ""
  //   , dot: false, rxpensed: false, rental: false
  // };
  public columns: any = [
    {
      Name: 'branch',
      isCheck: true,
      Text: 'Branch',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'vehicleNumber',
      isCheck: true,
      Text: 'Vehicle Number',
      isDisable: true,
      index: 1,
      width: 100,
    },
    {
      Name: 'assignedTo',
      isCheck: true,
      Text: 'Assigned To',
      isDisable: false,
      index: 2,
      width: 100,
    },
    {
      Name: 'location',
      isCheck: false,
      Text: 'Location',
      isDisable: false,
      index: 3,
      width: 100,
    },
    {
      Name: 'description',
      isCheck: false,
      Text: 'Description',
      isDisable: false,
      index: 4,
      width: 100,
    },
    {
      Name: 'licencePlate',
      isCheck: false,
      Text: 'License Plate #',
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
      Name: 'vehicleType',
      isCheck: false,
      Text: 'Vehicle Type',
      isDisable: false,
      index: 7,
      width: 100,
    },
  ];
  public viewColumns = [
    {
      Name: 'branch',
      isCheck: true,
      Text: 'Branch',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'vehicleNumber',
      isCheck: true,
      Text: 'Vehicle Number',
      isDisable: true,
      index: 1,
      width: 100,
    },
    {
      Name: 'assignedTo',
      isCheck: true,
      Text: 'Assigned To',
      isDisable: false,
      index: 2,
      width: 100,
    },
  ];
  public hiddenColumns: string[] = [
    'location',
    'license',
    'status',
    'vehicleType',
  ];
  public temphiddenColumns: string[] = [];
  public sort: SortDescriptor[] = [
    {
      field: 'vendorName',
      dir: 'asc',
    },
  ];
  public mySelection: number[] = [0];
  vehicleNum: string;
  opened: boolean = false;
  isPrint: boolean = true;
  isSave: boolean = true;
  isCancel: boolean = true;
  isEdit: boolean = false;
  isAdd: boolean = false;
  isAddRight: boolean = false;
  isUpdateRight: boolean = false;
  isTab1: boolean = true;
  isTab2: boolean = true;
  isTab3: boolean = true;
  isTab4: boolean = true;
  isTab5: boolean = true;
  isTab6: boolean = true;
  isDisabled: boolean = true;
  isDot: boolean = false;
  isDisableGrid: boolean = false;
  filterDOT: boolean = false;
  filterExpensed: boolean = false;
  filterRental: boolean = false;

  assignTo: any = [];
  data: any;
  @Input() onChange;
  vendor: any;
  id: number;
  branchId: number;
  cdate: any;
  status: boolean = true;
  trucksStatus: boolean = true;
  dotStatus: boolean = true;
  active: boolean = true;
  tabActive: boolean = true;
  isDisable: boolean = true;
  saveData: boolean = true;
  cInfos: any;
  selectedTab = 'Vehicle Info';
  selectedTabIndex = 0;
  branch: any[] = [];
  branchData: any;
  filterText: string='';
  show: boolean;
  showFolder: boolean;
  toggleText: string;
  statusData: any = [
    { id: 0, value: 'All' },
    { id: 1, value: 'Active' },
    { id: 2, value: 'InActive' },
  ];
  lstFrequency: any = [
    { id: 0, value: '30 Days' },
    { id: 0, value: '60 Days' },
    { id: 0, value: '90 Days' },
    { id: 0, value: 'None' },
  ];
  VehicleTypeData: any = [];
  filterState: boolean;
  filterassignedTo: boolean;
  clickEventsubscription: Subscription;
  message: any;
  isNew: boolean;
  tempId: number = 0;
  VehicleTypeFilterData: DropDownModel[];
  assignToFilterData: any;
  tabList = {
    VehicleInfo: true,
    MoreInfo: true,
    Contacts: true,
    Activity: true,
    Notes: true,
    History: true,
  };
  userPreferenceModel: UserPreferenceModel;
  tabs = VehicleTabs;
  filterServiceFreq: boolean;
  filterDate: boolean;
  assignedName: any;

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
  totalVehicle: number = 0;
  reason: string = '';
  vehicleDetail: any;
  constructor(
    public branchService: BranchService,
    public service: VehicleService,
    public preference: UserPreferenceService,
    public menuService: MenuService,
    public utils: UtilityService,
    public router: Router,
    public dropdownservice: DropdownService,
    public employeeService: EmployeeService,
    private utility: UtilityService,
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
    } else {
      let acc = this.menuService.checkUserViewRights('vehicle');
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
      const rights = JSON.parse(localStorage.getItem('Rights'));

      if (rights) {
        this.isTab1 = !rights.some(
          (c) =>
            c.subModuleName == 'Vehicle Info' &&
            c.moduleName == 'Vehicle' &&
            c.tabName == 'VIEW'
        );
        this.isTab2 = !rights.some(
          (c) => c.subModuleName == 'Inventory' && c.moduleName == 'Vehicle' && c.tabName == 'VIEW'
        );
        this.isTab3 = !rights.some(
          (c) =>
            c.subModuleName == 'Service History' &&
            c.moduleName == 'Vehicle' &&
            c.tabName == 'VIEW'
        );
        this.isTab4 = !rights.some(
          (c) =>
            c.subModuleName == 'Activity' &&
            c.moduleName == 'Vehicle' &&
            c.tabName == 'VIEW'
        );
        this.isTab5 = !rights.some(
          (c) =>
            c.subModuleName == 'Notes' &&
            c.moduleName == 'Vehicle' &&
            c.tabName == 'VIEW'
        );
        this.isTab6 = !rights.some(
          (c) =>
            c.subModuleName == 'History' &&
            c.moduleName == 'Vehicle' &&
            c.tabName == 'VIEW'
        );
      }
    }
    this.menuService.checkUserBySubmoduleRights('Vehicle Info');

    this.isAddRight = this.menuService.isAddRight;
    this.isUpdateRight = this.menuService.isEditRight;
    this.menuService.checkVendorMoreRights('More Info');
  }
  SaveChange: BehaviorSubject<any> = new BehaviorSubject(null);

  filterCollection: any = {
    id: 0,
    userName: '',
    status: 1,
    vehicleTypes: [],
    dedicatedBranch: '',
    branchIds: [],
    assignedTo: '',
    serviceFrequency: '',
    inspectionExpireFrom: '',
    inspectionExpireTo: '',
    expensed: null,
    dot: null,
    rental: null,
  };
  ngOnInit(): void {
    this.clickEventsubscription = this.utils.getClickEvent().subscribe((a) => {
      this.message = a;
      this.callBack(this.message);
    });
    this.filterCollection.branchIds.push(0);

    this.pagerService.load();
    this.loadItems();
    this.GetBranch();
    this.GetEmployee();
    this.GetVehicleType();
  }
  ngOnDestroy() {
    //this.savePreference();
    console.log('Goodbye vehicle!');
  }
  GetBranch() {
    this.branch = this.branchAll.concat(
      this.utility.storage.CurrentUser.userBranch
    );
    this.branchData = this.branch;
  }
  GetEmployee() {
    this.dropdownservice.GetEmployee().subscribe(
      (res) => {
        if (res) {
          this.assignTo = res.result;
          this.assignToFilterData = res.result;
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.employee.get_list);
      }
    );
  }

  GetVehicleType() {
    this.dropdownservice.GetLookupList('VehicleType').subscribe(
      (res) => {
        if (res) {
          // res.forEach(item => {
          //   var firstname = (item.value.split('-')[0].split(' ').length > 2 ? item.value.split('-')[0][0] + "" + item.value.split('-')[0].split(' ')[1][0] : item.value.split('-')[0]);
          //   var str = firstname + " - " + item.value.split('-')[1];
          //   item["shortName"] = str;
          // });

          this.VehicleTypeData = res;
          this.VehicleTypeFilterData = res;
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.drop_down.vehicle_type);
      }
    );
  }
  vehicleTypeFilter(value) {
    this.VehicleTypeData = this.VehicleTypeFilterData.filter(
      (s) => s.value.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }
  branchFilter(value) {
    this.branch = this.branchData.filter(
      (s) => s.value.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }
  assignedToFilter(value) {
    this.assignTo = this.assignToFilterData.filter(
      (s) => s.value.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  dedicatedbranchchange(data) {
    var data1: any[] = [];
    if (data.length >= 1) {
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
    this.filterCollection.branchIds = data1;
    // if (this.filterCollection.branchIds != null && this.filterCollection.branchIds.length > 0)
    //   if (this.filterCollection.branchIds.filter(x => x == 0).length > 0) {
    //     this.filterCollection.branchIds = this.filterCollection.branchIds.filter(x => x == 0);
    //   }
    this.loadItems(false);
  }

  loadItems(mergeData?: boolean): void {
    var request = new PaginationRequest<any>();
    request.start = this.pagerService.start;
    request.end = this.pagerService.end;
    request.pageSize = this.pagerService.pageSize;
    request.request = this.filterCollection;
    this.service.GetList(request).subscribe(
      (res) => {
        if (res != null && res.data.length > 0) {
          this.totalVehicle = res.totalRecords;
          // this.pagerService.setHasMore(res.hasMore);
          this.data = res.data; // mergeData ? this.data.concat(res.data) : res.data;
          this.vendor = res.data; //[...this.data];
          this.getPreference();

          // if (this.tempId == 0) this.editClick(this.vendor[0].id);
          // else this.editClick(this.tempId);
          this.loader = false;
        } else {
          this.data = [];
          this.vendor = [];
          this.loader = false;
          this.editClick(0);
        }
        var handleEvent = (event) => {
          this.handleScroll(event);
        };

        this.pagerService.registerScrollEvent(handleEvent);
      },
      (error) => {
        this.onError(error, ErrorMessages.vehicle.get_list);
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
  callBack(value) {
    var valueId = [];
    var valueId1 = [];
    value.forEach((element) => {
      valueId.push(element.id);
      valueId1.push(element.userId);
    });
    // let branchId = valueId.join(',');
    // let userId = valueId1.join(',');
    this.filterCollection.branchIds = valueId;
    this.loadItems(false);
    // var request = new PaginationRequest<any>();
    // request.start = this.pagerService.start;
    // request.end = this.pagerService.end;
    // request.pageSize = this.pagerService.pageSize;
    // request.request = this.filterCollection;
    // this.service.GetList(request).subscribe(
    //   (res) => {
    //     if (res.length > 0) {
    //       this.data = res.data;
    //       this.vendor = res.data;
    //     }
    //   },
    //   (error) => {
    //     this.onError(error, ErrorMessages.vehicle.get_list);
    //   }
    // );
  }

  editClick(id: number) {
    this.id = id;
    this.isDisableGrid = false;
    this.tempId = id;
    this.isNew = false;
    this.disbaleBtn();
    this.service.GetById(id).subscribe(
      (res) => {
        if (res) {
          this.vehicleNum = res['vehicleNumber'];
          this.cdate = res['createdDate'];
          this.active = res['inactive'] == true ? false : true;
          this.isDisabled = true;
          this.vehicleDetail = res;
          if (this.selectedTab == this.tabs.tab1) {
            ///0
            setTimeout(() => {
              this.vehicleInfo.onEdit(res);
            }, 100);
          } else if (this.selectedTab == this.tabs.tab2) {
            //4
            setTimeout(() => {
              this.vehicleInventory.setVehicleId(
                this.vehicleNum,
                res['branchCode']
              );
            }, 500);
          }
          if (this.selectedTab == this.tabs.tab5) {
            //4
            setTimeout(() => {
              this.vehicleNotes.onEdit(res);
            }, 500);
            this.tabList.VehicleInfo = true;
            this.tabList.MoreInfo = true;
            this.tabList.Contacts = true;
            this.tabList.Notes = false;
            this.tabList.History = true;
            this.tabList.Activity = true;
          }
          if (this.selectedTab == this.tabs.tab3) {
            //5
            setTimeout(() => {
              this.vehicleServiceHistory.serviceHistoryList(this.vehicleNum);
            }, 500);
            this.tabList.VehicleInfo = false;
            this.tabList.MoreInfo = false;
            this.tabList.Contacts = false;
            this.tabList.Notes = false;
            this.tabList.History = false;
            this.tabList.Activity = false;
          }
          if (this.selectedTab == this.tabs.tab4) {
            //5
            setTimeout(() => {
              this.vehicleActivity.activityList(this.vehicleNum);
            }, 500);
            this.tabList.VehicleInfo = false;
            this.tabList.MoreInfo = false;
            this.tabList.Contacts = false;
            this.tabList.Notes = false;
            this.tabList.History = false;
            this.tabList.Activity = false;
          }
          if (this.selectedTab == this.tabs.tab6) {
            //5
            setTimeout(() => {
              this.vehicleHistory.historyList(res);
            }, 500);
            this.tabList.VehicleInfo = false;
            this.tabList.MoreInfo = false;
            this.tabList.Contacts = false;
            this.tabList.Notes = false;
            this.tabList.History = false;
            this.tabList.Activity = false;
          }
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.vehicle.get_by_id);
      }
    );
  }
  btnAdd() {
    this.enableBtn();
    this.active = true;
    this.isEdit = true;
    this.isAdd = true;
    this.isNew == true;
    if (this.selectedTab == this.tabs.tab1) {
      //0
      this.vehicleInfo.btnAdd();
      this.isDisabled = false;
    }
    if (this.selectedTab == this.tabs.tab5) {
      //4
      this.vehicleNotes.btnAdd();
    }
  }
  btnEdit() {
    this.isDisabled = false;
    this.enableBtn();
    this.tempId = this.id;
    this.isEdit = true;
    this.isAdd = true;
    if (this.selectedTab == this.tabs.tab1) {
      //0
      this.isDisabled = false;
      this.vehicleInfo.btnEdit();
    }
    if (this.selectedTab == this.tabs.tab5) this.vehicleNotes.btnEdit(); //4
  }
  btnCancel() {
    this.saveData = false;
    this.isDisabled = true;
    this.isCancel = true;
    this.isAdd = false;
    this.isEdit = false;
    this.isSave = true;
    this.vehicleInfo.btnCancel();
    this.editClick(this.tempId);
    // if (this.isNew == true && this.saveData == false) {
    //   this.deleteVehicleId();
    // }
  }
  enableBtn() {
    this.isSave = false;
    this.isCancel = false;
    this.isAdd = true;
    this.isEdit = true;
  }
  disbaleBtn() {
    this.isSave = true;
    this.isCancel = true;
    // this.isAdd = false;
    // this.isEdit = false;
    if (
      this.selectedTab == this.tabs.tab2 ||
      this.selectedTab == this.tabs.tab3 ||
      this.selectedTab == this.tabs.tab4 ||
      this.selectedTab == this.tabs.tab5 ||
      this.selectedTab == this.tabs.tab6
    ) {
      this.isAdd = true;
      this.isEdit = true;
    } else {
      this.isAdd = false;
      this.isEdit = false;
    }
  }

  public onFilter(): void {
    //this.filterText = inputValue;
    this.mySelection = [];
    this.data = process(this.vendor, {
      filter: {
        logic: 'or',
        filters: [
          {
            field: 'branch',
            operator: 'contains',
            value: this.filterText,
          },
          {
            field: 'vehicleNumber',
            operator: 'contains',
            value: this.filterText,
          },
          {
            field: 'vehicleType',
            operator: 'contains',
            value: this.filterText,
          },
          {
            field: 'serialNumber',
            operator: 'contains',
            value: this.filterText,
          },
          {
            field: 'purchasePrice',
            operator: 'contains',
            value: this.filterText,
          },
          {
            field: 'description',
            operator: 'contains',
            value: this.filterText,
          },
          {
            field: 'assignedTo',
            operator: 'contains',
            value: this.filterText,
          },
          {
            field: 'annualInspectionMiles',
            operator: 'contains',
            value: this.filterText,
          },
        ],
      },
    }).data;
    // this.data = this.vendor.filter(function (ele, i, array) {
    //   let arrayelement = ele.vendorName.toLowerCase();
    //   return arrayelement.includes(inputValue);
    // });
    this.mySelection = [0];
    this.tempvendor = this.data;
    this.totalVehicle = this.data.length;
    
  }
  onSearchClick() {
    this.onFilter();
    if (this.data.length > 0)
      this.editClickWithoutLoader(this.tempvendor[0].id);
    else {
      this.editClickWithoutLoader(0);
      //this.vehicleInfo.form.reset();
    }
  }
  OnAddClick() {
    this.editClick(0);
    this.SaveChange.next(null);
    this.id = 0;
    this.cdate = '';
  }
  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.data = {
      data: orderBy(this.data, this.sort),
      total: this.vendor.length,
    };
    this.data = this.data.data;
    this.mySelection = [0];
    this.id = this.data[0].id;

    this.savePreference();
    this.editClickWithoutLoader(this.id);
  }
  onSave() {
    let saveStatus = false;
    this.saveData = true;
    if (this.selectedTab == this.tabs.tab1) {
      //0
      saveStatus = this.vehicleInfo.onSave(this.active);

      if (saveStatus == false) return false;
      setTimeout(() => {
        this.loadItems();
      }, 1500);
    }
    if (this.selectedTab == this.tabs.tab5) {
      //4
      this.vehicleNotes.onSave();
    }

    this.disbaleBtn();
    this.isDisabled = true;
    this.isAdd = false;
    this.isEdit = false;
    //this.btnCancel();
  }
  VendorInActive(event) {
    this.status = event;
    this.loadItems();
  }
  filterbyBranch(event) {
    this.onFilter();
  }
  public dataStateChange(state: DataStateChangeEvent): void {
    // this.state = state;
    // this.data = process(this.vendor, this.state);
  }
  public onToggle(): void {
    this.show = !this.show;
    this.toggleText = this.show ? 'Hidе' : 'Show';
    // let aaa = this.columns.filter(x => x.isCheck == true);
    // if (aaa.length == 1) {
    //   this.columns.forEach(element => {
    //     if (element.Name != aaa[0].Name) {
    //       this.temphiddenColumns.push(element.Name);
    //     }
    //   });
    //   this.isDisabledColumn(aaa[0].Name);
    // }
  }
  public onFolderToggle(): void {
    this.showFolder = !this.showFolder;
    this.toggleText = this.showFolder ? 'Hidе' : 'Show';
    // this.networkDirectory.valuesFile.DirecotryPath = "\\192.168.0.2\\Mersino\\03  Logistics\\FLEET BOOKS\\" + this.vehicleNum;
    // this.networkDirectory.valuesFile.UserName = "MERSINO\jagdip.joshi";
    // this.networkDirectory.valuesFile.Password = "2YLhB^4UarY6u$6P";
    setTimeout(() => {
      this.networkDirectory.loadFolderByVehicleNo(this.vehicleNum);
    }, 200);
  }
  closepopup() {
    this.show = !this.show;
  }
  resetpopup() {
    // this.columns = [
    //   { Name: "assignedTo", isCheck: true, Text: "Assigned To", isDisable: false },
    //   { Name: "location", isCheck: false, Text: "Location", isDisable: false },
    //   { Name: "description", isCheck: true, Text: "Description", isDisable: false },
    //   { Name: "license", isCheck: false, Text: "License Plate #", isDisable: false },
    //   { Name: "status", isCheck: false, Text: "Status", isDisable: false },
    //   { Name: "vehicleType", isCheck: false, Text: "Vehicle Type", isDisable: false }];
    // this.hiddenColumns = ['location', 'license', 'status', 'vehicleType'];
    // this.temphiddenColumns = ['location', 'license', 'status', 'vehicleType'];
    this.filterCollection = {
      id: 0,
      userName: '',
      status: 1,
      vehicleTypes: [],
      dedicatedBranch: '',
      branchIds: [],
      assignedTo: '',
      serviceFrequency: '',
      inspectionExpireFrom: '',
      inspectionExpireTo: '',
      expensed: null,
      dot: null,
      rental: null,
    };
  }
  columnApply() {
    if (this.filterCollection.assignedTo) {
      this.filterassignedTo = true;
      // this.assignedName = this.assignTo.find(
      //   (c) => c.id == this.filterCollection.assignedTo
      // ).employeeName;
    } else this.filterassignedTo = false;
    if (this.filterCollection.dot == true) this.filterDOT = true;
    else {
      this.filterDOT = false;
      this.filterCollection.dot = null;
    }
    if (this.filterCollection.rental == true) this.filterRental = true;
    else {
      this.filterRental = false;
      this.filterCollection.rental = null;
    }
    if (this.filterCollection.expensed == true) this.filterExpensed = true;
    else {
      this.filterExpensed = false;
      this.filterCollection.expensed = null;
    }
    if (this.filterCollection.serviceFrequency) this.filterServiceFreq = true;
    else this.filterServiceFreq = false;
    if (
      this.filterCollection.inspectionExpireFrom ||
      this.filterCollection.inspectionExpireTo
    )
      this.filterDate = true;
    else this.filterDate = false;
    // Column Filter

    // if (this.temphiddenColumns.length == 0) {
    //   this.temphiddenColumns = ['location', 'license', 'status', 'vehicleType'];
    // }
    // this.hiddenColumns = this.temphiddenColumns;
    // this.temphiddenColumns = [];
    // let filteredData = [];
    // this.columns.forEach(element => {
    //   let data = this.hiddenColumns.find(x => x == element.Name);
    //   if (!data)
    //     filteredData.push(element.Name);
    // });
    this.savePreference();
    /// Data Filter
    this.loadItems();
    this.show = false; // !this.show;
  }
  public isDisabledColumn(columnName: string): boolean {
    return (
      this.columns.length - this.temphiddenColumns.length === 1 &&
      !this.isHiddenTemp(columnName)
    );
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
  public isHiddenTemp(columnName: string): boolean {
    return this.temphiddenColumns.indexOf(columnName) > -1;
  }
  public isHidden(columnName: string): boolean {
    // var dd = this.columns.find(c => c.Name == columnName);
    // return dd.isDisable;
    return this.hiddenColumns.indexOf(columnName) > -1;
  }
  public onTabSelect(e) {
    //this.selectedTab = e.index;
    this.selectedTab = e.title;
    //this.editClick(this.id);
    this.isPrint = true;
    if (this.selectedTab == this.tabs.tab1) {
      this.isAdd = false; this.isEdit = false;
      this.vehicleInfo.onEdit(this.vehicleDetail);
      this.menuService.checkUserBySubmoduleRights('Vehicle Info');
      // }
      // else if (this.selectedTab == 1) {
      //   this.isAdd = true;
      //   this.isEdit = true;
      //   this.isSave = true;
      //   this.isCancel = true;
      //   this.isTab1 = false;
      //   this.isTab2 = false;
      //   this.isTab3 = false;
      //   this.isTab4 = false;
      //   this.isTab5 = false;
      //   this.isTab6 = false;
      //   this.menuService.checkUserBySubmoduleRights('Inventory');
    } else if (this.selectedTab == this.tabs.tab2) {
      //4
      this.isAdd = true;
      this.isEdit = true;
      this.isSave = true;
      this.isCancel = true;

      if (this.vehicleInventory) {
        this.vehicleInventory.setVehicleId(this.vehicleNum, this.vehicleDetail.branchCode);
      }
    } else if (this.selectedTab == this.tabs.tab3) {
      //5
      setTimeout(() => {
        this.vehicleServiceHistory.serviceHistoryList(this.vehicleNum);
        this.tabList.VehicleInfo = false;
        this.tabList.MoreInfo = false;
        this.tabList.Contacts = false;
        this.tabList.Notes = false;
        this.tabList.History = false;
        this.tabList.Activity = false;
      }, 1000);
    }
    else if (this.selectedTab == this.tabs.tab4) {
      this.vehicleActivity.activityList(this.vehicleNum);

    }
    else if (this.selectedTab == this.tabs.tab5) {
      //4
      this.isAdd = true;
      this.isEdit = true;
      this.isSave = true;
      this.isCancel = true;
      this.vehicleNotes.onEdit(this.vehicleDetail);
      //this.menuService.checkUserBySubmoduleRights('Notes');
    } else if (this.selectedTab == this.tabs.tab6) {
      //5
      this.isAdd = true;
      this.isEdit = true;
      this.isSave = true;
      this.isCancel = true;
      this.utils.storage.setItem('vehicleId', this.id.toString());
      this.vehicleHistory.historyList(this.vehicleDetail);
      this.isPrint = false;
      //this.menuService.checkUserBySubmoduleRights('Activity');
    } else {
      this.isAdd = true;
      this.isEdit = true;
      this.isSave = true;
      this.isCancel = true;
    }
  }

  deleteVehicleId() {
    this.service.deleteId(this.id).subscribe(
      (res) => {
        this.isNew = true;
      },
      (error) => {
        this.onError(error, ErrorMessages.vehicle.deleteId);
      }
    );
  }
  editClickWithoutLoader(id: number) {
    this.id = id;
    this.tempId = id;
    this.disbaleBtn();

    // this.isEdit = false;
    // this.isCancel = true;
    // this.isAdd = false;
    // this.isSave = true;
    this.service.GetById(id).subscribe(
      (res) => {
        if (res) {
          this.vehicleNum = res['vehicleNumber'];
          this.branchCode = res['branchCode'];
          this.cdate = res['createdDate'];
          this.active = res['inactive'] == true ? false : true;
          this.isDisabled = true;
          if (this.selectedTab == this.tabs.tab1) {
            //this.isDisabled = false;
            this.saveData = false;
            this.vehicleInfo.onEdit(res);
          } else if (this.selectedTab == this.tabs.tab2) {
            //4
            this.vehicleInventory.setVehicleId(
              this.vehicleNum,
              this.branchCode
            );
          }
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.vehicle.get_by_id);
      }
    );
  }

  savePreference() {
    var usr = JSON.parse(localStorage.getItem('currentUser'));
    if (usr) {
      this.userPreferenceModel = new UserPreferenceModel();
      this.userPreferenceModel.userName = usr.userId;
      this.userPreferenceModel.id = 0;
      this.userPreferenceModel.userId = 0;
      this.userPreferenceModel.page = 'Vehicle';
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
  }
  getPreference() {
    try {
      this.preference.GetUserPreference('Vehicle').subscribe((res) => {
        if (res.result) {
          var userPref = res.result.preference;
          this.viewColumns = userPref.order.filter((c) => c.isCheck == true);
          this.viewColumns.forEach((element) => {
            let col = this.columns.findIndex((c) => c.Name == element.Name);
            this.columns[col].isCheck = true;
          });
          this.sort = userPref.sortBy;
          this.data = {
            data: orderBy(this.vendor, this.sort),
            total: this.vendor.length,
          };
          this.data = this.data.data;
        } else {
          this.viewColumns.forEach((element) => {
            let col = this.columns.findIndex((c) => c.Name == element.Name);
            this.columns[col].isCheck = true;
          });
        }

        if (this.filterText) this.onFilter();
        else {
          if (this.tempId == 0) {
            this.mySelection = [0];
            this.id = this.data[0].id;
            this.editClick(this.id);
          } else {
            this.id = this.tempId;
            this.mySelection = [this.data.findIndex(c => c.id == this.tempId)];
            this.editClick(this.id);
          }
        }
      });
    } catch (error) {
      this.viewColumns.forEach((element) => {
        let col = this.columns.findIndex((c) => c.Name == element.Name);
        this.columns[col].isCheck = true;
      });
      this.editClick(this.vendor[0].id);
    }
  }
  columnWidths: any = [];
  resizeColumns(eventData) {
    // var colItem = {
    //   field: eventData[0].column.field,
    //   width: eventData[0].newWidth,
    // };

    let col = this.viewColumns.findIndex(
      (c) => c.Name == eventData[0].column.field
    );
    this.viewColumns[col].width = eventData[0].newWidth;

    // var indx = this.columnWidths.indexOf(
    //   (c) => c.field == eventData[0].column.field
    // );
    // if (indx < 0) {
    //   this.columnWidths.push(colItem);
    // } else {
    //   this.columnWidths[indx].width = eventData[0].newWidth;
    // }
    this.savePreference();
  }

  resetDOT() {
    this.filterDOT = false;
    this.filterCollection.dot = false;
  }
  resetExpensed() {
    this.filterExpensed = false;
    this.filterCollection.expensed = false;
  }
  resetRental() {
    this.filterRental = false;
    this.filterCollection.rental = false;
  }
  resetServiceFreq() {
    this.filterServiceFreq = false;
    this.filterCollection.serviceFrequency = '';
  }
  resetFilterDate() {
    this.filterDate = false;
    this.filterCollection.inspectionExpireFrom = '';
    this.filterCollection.inspectionExpireTo = '';
  }
  resetAssignto() {
    this.filterassignedTo = false;
    this.filterCollection.assignedTo = '';
  }
  reorderColumns(event) {
    var newIndx = event.newIndex;
    var oldIndx = event.oldIndex;
    var column = event.column.field;

    let cutOut = this.viewColumns.splice(oldIndx, 1)[0]; // cut the element at index 'from'
    this.viewColumns.splice(newIndx, 0, cutOut); // insert it at index 'to'

    this.savePreference();
  }
  downloadFile() {
    this.service.downloadVehicleData().subscribe(
      (res) => {
        let data = new Blob([res], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;',
        });
        fileSaver.saveAs(data, 'Vehicle_Info.xlsx');
      },
      (error) => {
        this.onError(error, ErrorMessages.vehicle.download_vehicle_data);
      }
    );
    //window.open(environment.apiUrl + 'Vendor/ExportToExcel');
  }
  popupitem(type) {
    // console.log(type, 'jkh');
    this.isDisableGrid = type;
  }
  onSwitchChange(event) {
    if (event == false) {
      if (this.menuService.isAddRight) {
        this.opened = true;
      }
    }
  }
  submitReason(type) {
    if (type == 1) {
      if (!this.reason) {
        this.utils.toast.error('Please add inactivate reason.');
        return false;
      }
      const data = new VehicleNotesModel();
      data.id = this.id;
      data.vehicleId = this.id;
      data.userName = JSON.parse(localStorage.getItem('currentUser')).userName;
      data.note = this.reason;
      data.subject = 'Vehicle Inactivated';
      this.service.saveNote(data).subscribe(
        (res) => {
          if (res['status'] == 200) {
            this.active = false;
            this.utils.toast.success(res['message']);
            this.opened = false;
            var saveStatus = this.vehicleInfo.onSave(this.active);
            if (saveStatus == false) return false;
            setTimeout(() => {
              this.loadItems();
            }, 1500);
            this.disbaleBtn();
            this.isDisabled = true;
            this.isAdd = false;
            this.isEdit = false;
            this.btnCancel();
          } else this.utils.toast.error(res['message']);
          this.reason = '';
        },
        (error) => {
          this.onError(error, ErrorMessages.vehicle.save_note);
        }
      );
    } else {
      this.opened = false;
      this.active = true;
    }
  }
  private onError(error: any, customMessage?: string) {
    this.errorHandler.handleError(error, ModuleNames.vehicle, customMessage);
  }
}
