import {
  Component,
  ElementRef,
  Input,
  Output,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  DataBindingDirective,
  PageChangeEvent,
} from '@progress/kendo-angular-grid';
import { orderBy, SortDescriptor } from '@progress/kendo-data-query';

import { ModuleNames, ErrorMessages } from '../../../../../../core/constant';
import { BehaviorSubject } from 'rxjs';
import { MenuService } from '../../../../../../core/helper/menu.service';
import { UtilityService } from '../../../../../../core/services/utility.service';
import { FleetInfoComponent } from '../fleet-info/fleet-info.component';
import { FleetNotesComponent } from '../fleet-notes/fleet-notes.component';
import { FleetModel } from './fleet.model';
import { FleetService } from './fleet.service';
import { FleetHistoryComponent } from '../fleet-history/fleet-history.component';
import { FleetActivityComponent } from '../fleet-activity/fleet-activity.component';
import { FleetOtherInfoComponent } from '../fleet-other-info/fleet-other-info.component';
import { DropdownService } from 'src/app/core/services/dropdown.service';
import { MultiSelectComponent } from '@progress/kendo-angular-dropdowns';
import { DropDownModel } from 'src/app/core/models/drop-down.model';
import { delay, switchMap, map, tap } from 'rxjs/operators';
import { FleetServiceHistoryComponent } from '../fleet-service-history/fleet-service-history.component';
import { from } from 'rxjs';
import { ErrorHandlerService, PagerService } from 'src/app/core/services';
import {
  tempViewColumns,
  ViewColumnsFleetList,
  ViewColumnsFleetList1,
} from '../../../../../../../data/fleet-data';
import { UserPreferenceModel } from 'src/app/core/models/preference.model';
import { UserPreferenceService } from 'src/app/core/services/user-preference.service';
import * as fileSaver from 'file-saver';
import { NetworkDirectoryComponent } from 'src/app/layout/networkdirectory/networkdirectorypage/networkdirectory.component';
@Component({
  selector: 'app-fleet',
  templateUrl: './fleet.component.html',
  styleUrls: ['./fleet.component.scss'],
})
export class FleetComponent implements OnInit {
  @ViewChild(DataBindingDirective) dataBinding: DataBindingDirective;
  @ViewChild(FleetInfoComponent) fleetInfo: FleetInfoComponent;
  @ViewChild(FleetNotesComponent) fleetNotes: FleetNotesComponent;
  @ViewChild(FleetHistoryComponent) fleetHistory: FleetHistoryComponent;
  @ViewChild(FleetActivityComponent) fleetActivity: FleetActivityComponent;
  @ViewChild(FleetOtherInfoComponent) fleetotherInfo: FleetOtherInfoComponent;
  @ViewChild('multiselect') public multiselect: MultiSelectComponent;
  @ViewChild(FleetServiceHistoryComponent)
  fleetServiceHistory: FleetServiceHistoryComponent;
  @ViewChild(NetworkDirectoryComponent)
  networkDirectory: NetworkDirectoryComponent;

  viewData: any;
  @Input() gridList: any;
  multiple: boolean = false;
  loader: any;
  source: any;
  branchList: DropDownModel[];
  branchData: DropDownModel[];
  selectedBranch: any = [];
  isPrint: boolean = true;
  isSave: boolean = true;
  isCancel: boolean = true;
  isEdit: boolean = false;
  isAdd: boolean = false;
  viewColumns: any;
  tempviewColumns: any;
  data: any;
  visible: boolean = false;
  filterCollection: any = {
    id: 0,
    status: 1,
    rdFilter: false,
    soldFilter: false,
    majorRepairsFilter: false,
    tagFilter: false,
    uaFilter: false,
    activeFilter: true,
    yardFilter: false,
    pumpFilter: true,
  };
  excelFilter: any;
  selectedRow: any;
  displayExcelConfirmationDialog: boolean = false;
  public sort: SortDescriptor[] = [
    {
      field: 'invNumber',
      dir: 'asc',
    },
  ];
  filterText: string = '';
  public mySelection: number[] = [0];
  public hiddenColumns: string[] = [];
  public temphiddenColumns: string[] = [];
  userPreferenceModel: UserPreferenceModel;
  isDisabled: boolean = true;
  fleetFilterModel: FleetModel;
  soldSwitch: boolean = false;
  soldSwitchDisplay: boolean = false;
  soNumberText: string = '';
  qbNumberText: string = '';
  priceNumberText: string = '';
  active: boolean = false;
  public value: any = [1];
  blEdit: boolean = false;
  blAdd: boolean = false;
  isTab1: boolean = false;
  isTab2: boolean = false;
  isTab3: boolean = false;
  isTab4: boolean = false;
  isTab5: boolean = false;
  inactivateAccess: boolean = false;
  blFolderList: boolean = false;
  public console: string[];
  tabList = { FleetInfo: true, Activity: true, Notes: true, History: true };
  @Input() onChange;
  @Output() InvNumber;
  id: number;
  blShow: boolean = false;
  strFilter: string;
  repairsFilter: boolean = false;
  blInactive: boolean = false;
  inactive: boolean = true;
  blTab: boolean = true;
  blDisabled: boolean = true;
  cInfos: any;
  selectedTab = 'Unit Info';
  dateInactiveReason: any;
  public totalData = 0;
  public pageSize = 100;
  public pageNumber = 1;
  public skip = 0;
  public currentPage = 1;
  tempPageNo: number;
  ViewColumnsFleetList: any;
  pageSizeList: any = [
    { id: 0, value: 100 },
    { id: 0, value: 300 },
    { id: 0, value: 500 },
  ];
  majorRepairNeededText: string = '';
  branchId: any = ['All'];
  activeId: any = 1;
  public activefilterDefault: { value: number; text: string } = {
    value: 1,
    text: 'Yes',
  };
  public currentfilter: any = [
    { value: 1, text: 'Active', active: true },
    { value: 2, text: 'Sold', active: false },
    { value: 3, text: 'Unassigned', active: false },
    { value: 4, text: 'Major Repairs', active: false },
    { value: 5, text: 'Red Tag', active: false },
    { value: 6, text: 'Green Tag', active: false },
    { value: 7, text: 'Yard', active: false },
    { value: 8, text: 'RD', active: false },
  ];
  public temphiddenFilters: string[] = [];
  public fleetType: string[] = [
    'Active',
    'Sold',
    'Unassigned',
    'Major Repairs',
    'Red Tag',
    'Green Tag',
    'Yard',
    'RD',
  ];
  searchText: any = '';
  filterRnD: boolean = false;
  filterSold: boolean = false;
  filterMajorRepairs: boolean = false;
  filterTag: boolean = false;
  filterUnAssigned: boolean = false;
  SaveChange: BehaviorSubject<any> = new BehaviorSubject(null);
  @ViewChild('anchor') public anchor: ElementRef;
  @ViewChild('popup', { read: ElementRef }) public popup: ElementRef;
  status: boolean = false;
  selectedInvNumber: any = '';
  isFleetInfoSaved: boolean = false;
  isDisableGrid: boolean = false;
  showFolder: boolean;
  toggleText: string;
  fleetDetail: any;

  constructor(
    public service: FleetService,
    public menuService: MenuService,
    public utils: UtilityService,
    public router: Router,
    public dropdownservice: DropdownService,
    public pagerService: PagerService,
    public errorHandler: ErrorHandlerService,
    private preference: UserPreferenceService
  ) {
    this.ViewColumnsFleetList = ViewColumnsFleetList;
    this.viewColumns = ViewColumnsFleetList1;
    this.tempviewColumns = tempViewColumns;
    if (localStorage.getItem('isAdmin') == 'true') {
      this.isTab1 = true;
      this.isTab2 = true;
      this.isTab3 = true;
      this.isTab4 = true;
      this.isTab5 = true;
      this.inactivateAccess = true;
    } else {
      let acc = this.menuService.checkUserViewRights('Maintain Fleet');
      if (acc) {
        //this.utils.toast.error("User does not have rights to access " + name + " module.");Z
      } else {
        this.utils.toast.error(
          'You do not have permissions to access this part of the system. Please contact your supervisor so they can request them from IT.'
        );
        setTimeout(() => {
          var url = '/dashboard';
          location.href = url;
        }, 1000);

      }
      this.menuService.checkUserBySubmoduleRights('Unit Info');
      const rights = JSON.parse(localStorage.getItem('Rights'));
      if (rights) {
        this.isTab1 = rights.some(
          (c) =>
            c.subModuleName == 'Unit Info' &&
            c.moduleName == 'Maintain Fleet' &&
            c.tabName == 'VIEW'
        );

        this.isTab2 = rights.some(
          (c) =>
            c.subModuleName == 'Notes' &&
            c.moduleName == 'Maintain Fleet' &&
            c.tabName == 'VIEW'
        );
        this.isTab3 = rights.some(
          (c) =>
            c.subModuleName == 'History' &&
            c.moduleName == 'Maintain Fleet' &&
            c.tabName == 'VIEW'
        );
        this.isTab4 = rights.some(
          (c) =>
            c.subModuleName == 'Service History' &&
            c.moduleName == 'Maintain Fleet' &&
            c.tabName == 'VIEW'
        );
        this.isTab5 = rights.some(
          (c) =>
            c.subModuleName == 'Activity' &&
            c.moduleName == 'Maintain Fleet' &&
            c.tabName == 'VIEW'
        );
        this.inactivateAccess = rights.some(
          (c) =>
            c.subModuleName == 'Unit Info' &&
            c.moduleName == 'Maintain Fleet' &&
            c.tabName == 'Inactivate'
        );
      }

      //this.menuService.checkUserBySubmoduleRights('Unit Info');
      // this.isAddRight = this.menuService.isAddRight;
      // this.isUpdateRight = this.menuService.isEditRight;
    }
  }

  ngOnInit(): void {
    //this.btnCancel();
    this.GetBranch();
    this.loadItems();
  }

  columnWidths: any = [];
  savePreference() {
    var usr = JSON.parse(localStorage.getItem('currentUser'));
    this.userPreferenceModel = new UserPreferenceModel();
    this.userPreferenceModel.userName = usr.userId;
    this.userPreferenceModel.id = 0;
    this.userPreferenceModel.userId = 0;
    this.userPreferenceModel.page = 'fleet';
    var objd = {
      columns: this.viewColumns,
      order: this.ViewColumnsFleetList,
      width: this.columnWidths,
      sortBy: this.sort,
    };
    this.userPreferenceModel.preference = objd;
    this.preference
      .SaveUserPreference(this.userPreferenceModel)
      .subscribe((res) => { });
  }
  getPreference() {
    try {
      this.preference.GetUserPreference('fleet').subscribe((res) => {
        if (res.result) {
          var userPref = res.result.preference;

          this.ViewColumnsFleetList = userPref.order.filter((c) => c.isCheck == true);
          this.ViewColumnsFleetList.forEach((element) => {
            let col = this.tempviewColumns.findIndex(
              (c) => c.Name == element.Name
            );
            this.tempviewColumns[col].isCheck = true;
          });
          //this.sort = userPref.sortBy;
          this.data = {
            data: orderBy(this.viewData, this.sort),
            total: this.viewData.length,
          };
          this.data = this.data.data;
          if (this.data.length > 0) {
            this.id = this.data[0].id;
          } else {
            this.id = 0;
          }
        } else {
          this.viewColumns.forEach((element) => {
            let col = this.ViewColumnsFleetList.findIndex(
              (c) => c.Name == element.Name
            );
            this.ViewColumnsFleetList[col].isCheck = true;
          });
        }

        //this.mySelection = [0];
      });
    } catch (error) {
      this.viewColumns.forEach((element) => {
        let col = this.ViewColumnsFleetList.findIndex(
          (c) => c.Name == element.Name
        );
        this.ViewColumnsFleetList[col].isCheck = true;
      });
    }
  }
  ngAfterViewInit() {
    const contains = (value) => (s) =>
      s.value.toLowerCase().indexOf(value.toLowerCase()) !== -1;

    this.multiselect.filterChange
      .asObservable()
      .pipe(
        switchMap((value) =>
          from([this.source]).pipe(
            tap(() => (this.multiselect.loading = true)),
            delay(1000),
            map((data) => data.filter(contains(value)))
          )
        )
      )
      .subscribe((x) => {
        this.currentfilter = x;
        this.multiselect.loading = false;
      });
  }

  onSoldSwitch(event) {
    this.soldSwitch = event;
    this.soldSwitchDisplay = !this.soldSwitchDisplay;
  }
  public onTabSelect(e) {
    this.selectedTab = e.title;
    //this.editClickWithoutLoader(this.InvNumber);
    this.isEdit = false;
    this.isCancel = true;
    this.isAdd = false;
    this.isSave = true;
    if (this.selectedTab == 'Unit Info') {
      this.fleetInfo.onEdit(this.fleetDetail);
      this.fleetInfo.getFleetAdorsComponent(this.InvNumber);
      this.fleetInfo.getFleetUnitInfoAdorsHours(this.InvNumber);
      this.fleetInfo.GetFleetUnitInfoLastInvoiced(this.InvNumber);
      this.fleetInfo.GetFleetUnitInfoServiceYTD(this.InvNumber);
      this.fleetInfo.getComponentCheck(this.InvNumber);
      this.fleetInfo.loadPicturesFiles(this.InvNumber);
      this.fleetInfo.loadMovementFiles(this.InvNumber);
      this.fleetInfo.loadCurveFiles(this.InvNumber);
      this.fleetInfo.loadBuildSheetFiles(this.InvNumber);
    }
    else if (this.selectedTab == 'Service History') {
      this.fleetServiceHistory.serviceHistoryList(this.InvNumber);
    }
    else if (this.selectedTab == 'Activity') {
      this.fleetActivity.activityList(this.InvNumber);
    }
    else if (this.selectedTab == 'Notes') {
      this.fleetNotes.NoteList(this.InvNumber);
    }
    else if (this.selectedTab == 'History') {
      this.fleetHistory.historyList(this.InvNumber);
    }
  }

  editClickWithoutLoader(id: number) {
    this.id = id;
    // this.isEdit = false;
    // this.isCancel = true;
    // this.isAdd = false;
    // this.isSave = true;
    this.service.GetById(id).subscribe((res) => {
      if (res) {
        if (res.length > 0) {
          this.isDisabled = true;
          this.selectedInvNumber = id;
          this.InvNumber = res[0].invNumber;
          this.inactive = res[0].inActive == false ? true : false;
          this.fleetDetail = res[0];
          if (this.selectedTab == 'Unit Info') {
            // this.isTab1 = true;
            // this.isTab2 = false;
            // this.isTab3 = false;
            // this.isTab4 = false;
            // this.isTab5 = false;
            this.fleetInfo.onEdit(res[0]);
            this.fleetInfo.getFleetAdorsComponent(this.InvNumber);
            this.fleetInfo.getFleetUnitInfoAdorsHours(this.InvNumber);
            this.fleetInfo.GetFleetUnitInfoLastInvoiced(this.InvNumber);
            this.fleetInfo.GetFleetUnitInfoServiceYTD(this.InvNumber);
            this.fleetInfo.getComponentCheck(this.InvNumber);
            //this.fleetInfo.onUnAssigned(this.filterCollection.uaFilter);
            this.fleetInfo.loadPicturesFiles(this.InvNumber);
            this.fleetInfo.loadMovementFiles(this.InvNumber);
            this.fleetInfo.loadCurveFiles(this.InvNumber);
            this.fleetInfo.loadBuildSheetFiles(this.InvNumber);
          } else if (this.selectedTab == 'Service History') {
            // this.isTab1 = false;
            // this.isTab2 = true;
            // this.isTab3 = false;
            // this.isTab4 = false;
            // this.isTab5 = false;
            this.fleetServiceHistory.serviceHistoryList(this.InvNumber);
          } else if (this.selectedTab == 'Activity') {
            // this.isTab1 = false;
            // this.isTab2 = false;
            // this.isTab3 = true;
            // this.isTab4 = false;
            // this.isTab5 = false;
            this.fleetActivity.activityList(this.InvNumber);
          } else if (this.selectedTab == 'Notes') {
            // this.isTab1 = false;
            // this.isTab2 = false;
            // this.isTab3 = false;
            // this.isTab4 = true;
            // this.isTab5 = false;
            this.fleetNotes.NoteList(this.InvNumber);
          } else if (this.selectedTab == 'History') {
            // this.isTab1 = false;
            // this.isTab2 = false;
            // this.isTab3 = false;
            // this.isTab4 = false;
            // this.isTab5 = true;
            this.fleetHistory.historyList(this.InvNumber);
          } else {
            this.blAdd = false;
            this.blEdit = false;
          }
        }
      }
    });
  }

  btnSave() {
    this.blAdd = false;
    this.blEdit = false;
    this.btnCancel();
    this.fleetInfo.btnSave();
    if (this.isSave) {
      this.loadItems(true);
    }
  }

  btnAdd() {
    this.blAdd = true;
    this.isDisableGrid = true;
    if (this.selectedTab == 'Unit Info') {
      this.blDisabled = false;
      this.isDisabled = false;
      this.fleetInfo.btnAdd();
      this.fleetInfo.form.reset();
    }
    if (this.selectedTab == 'Notes') {
      this.fleetNotes.btnAdd();
    }
    this.isCancel = false;
    this.isAdd = true;
    this.isSave = false;
    this.isEdit = true;
    this.fleetInfo.enableForm();
  }
  btnEdit() {
    this.blAdd = false;
    this.isAdd = true;
    this.isEdit = true;
    this.isDisableGrid = true;
    this.isDisabled = false;
    if (this.selectedTab == 'Unit Info') {
      this.blDisabled = false;
      this.fleetInfo.btnEdit();
    }
    this.isCancel = false;
    this.isSave = false;
    if (this.selectedTab == 'Notes') {
      this.fleetNotes.btnEdit();
    }
    if (this.selectedTab == 'History') {
      this.fleetHistory.historyList(this.InvNumber);
    }
    if (this.isSave) {
      this.loadItems(true);
    }
    this.fleetInfo.enableForm();
  }

  btnCancel() {
    this.blAdd = false;
    this.isCancel = true;
    this.isAdd = false;
    this.isSave = true;
    this.isEdit = false;
    this.isDisableGrid = false; this.isDisabled = true;
    if (this.selectedTab == 'Unit Info') {
      this.blDisabled = true;
      this.fleetInfo.btnCancel();
      this.editClickWithoutLoader(this.InvNumber);
    }
    if (this.selectedTab == 'Notes') this.fleetNotes.btnCancel();
  }

  OnAddUpdate(res) {
    //this.loadItems();
  }

  public loadItems(mergeData?: boolean): void {
    this.loader = true;
    this.pagerService.load();
    this.fleetFilterModel = new FleetModel();
    this.fleetFilterModel.blRDFilter = this.filterCollection.rdFilter;
    this.fleetFilterModel.uaFilter = this.filterCollection.uaFilter;
    this.fleetFilterModel.blRepairsFilter =
      this.filterCollection.majorRepairsFilter;
    this.fleetFilterModel.blSoldFilter = this.filterCollection.soldFilter;
    this.fleetFilterModel.fleetBranchList = this.branchId;
    this.fleetFilterModel.status = this.status;
    this.fleetFilterModel.pageNumber = this.pageNumber;
    this.fleetFilterModel.pageSize = this.pageSize;
    this.fleetFilterModel.SortColumn = this.sort[0].field;
    this.fleetFilterModel.SortDesc = this.sort[0].dir == 'asc' ? false : true;
    this.fleetFilterModel.tagFilter = this.filterCollection.tagFilter;
    this.fleetFilterModel.activeFilter = this.filterCollection.activeFilter;
    this.fleetFilterModel.yardFilter = this.filterCollection.yardFilter;
    this.fleetFilterModel.pumpFilter = this.filterCollection.pumpFilter;
    this.fleetFilterModel.searchFilter = this.filterText;
    this.visible = true;
    this.service.GetListFilter(this.fleetFilterModel).subscribe((res) => {
      this.viewData = res;
      this.getPreference();
      this.visible = false;
      if (res.length > 0) {
        this.totalData = res[0].totalRecords;
        if (this.selectedInvNumber != '') {
          this.InvNumber = this.selectedInvNumber;
          this.isEdit = false;
          if (this.selectedTab == 'Unit Info') {
            this.fleetInfo.getInvType();
          }
          this.editClickWithoutLoader(this.selectedInvNumber);
          this.fleetInfo.disableForm();
        } else {
          this.mySelection = [0];
          this.InvNumber = this.viewData[0].invNumber;
          this.isEdit = false;
          if (this.selectedTab == 'Unit Info') {
            this.fleetInfo.getInvType();
          }
          this.editClickWithoutLoader(this.viewData[0].invNumber);
          this.fleetInfo.disableForm();
        }
        // }
      } else {
        this.totalData = 0;
        this.InvNumber = 0;
        this.isEdit = true;
        this.fleetInfo.resetData();
      }
    });
  }

  public onFilter(): void {
    this.filterText = this.searchText.toString();
    this.pageNumber = 1;
    this.skip = 0;
    this.selectedInvNumber = '';
    this.loadItems();
  }

  SoldFilter(event) {
    this.filterCollection.soldFilter = event;
    this.id = 0;
    this.selectedInvNumber = '';
    this.mySelection = [0];
  }
  YardFilter(event) {
    this.filterCollection.yardFilter = event;
    this.id = 0;
    this.selectedInvNumber = '';
    this.mySelection = [0];
    this.pageNumber = 1;
    this.skip = 0;
    this.loadItems();
  }
  ActiveFilter(event) {
    this.filterCollection.activeFilter = event;
    this.id = 0;
    this.mySelection = [0];
    this.selectedInvNumber = '';
    this.loadItems();
  }

  TagFilter(event) {
    //this.filterTag = event;
    this.filterCollection.tagFilter = event;
    // this.id = 0;
    // this.selectedInvNumber='';
  }

  MajorRepairsFilter(event) {
    //this.filterMajorRepairs = event;
    this.filterCollection.majorRepairsFilter = event;
    // this.id = 0;
    // this.selectedInvNumber='';
  }

  UnassignedFilter(event) {
    //this.filterUnAssigned = event;
    this.filterCollection.uaFilter = event;
    // this.id = 0;
    // this.selectedInvNumber='';
  }

  OnAddClick() { }

  btnYard() { }

  btnRD() { }

  public DisableColumn(strColumnName: string): boolean {
    return (
      this.ViewColumnsFleetList.length - this.temphiddenColumns.length === 1 &&
      !this.isHiddenTemp(strColumnName)
    );
  }

  public hideColumn(): void {
    this.tempviewColumns.forEach((element) => {
      if (element.isCheck) {
        var inde = this.ViewColumnsFleetList.find(
          (c) => c.Name == element.Name
        );
        if (!inde) {
          this.ViewColumnsFleetList.push(element);
        }
      } else {
        var index = this.ViewColumnsFleetList.findIndex(
          (c) => c.Name == element.Name
        );
        if (index > 0) {
          this.ViewColumnsFleetList.splice(index, 1);
        }
      }
    });
  }
  public btnFolder(): void {
    this.blFolderList = !this.blFolderList;
    this.showFolder = !this.showFolder;
    this.toggleText = this.showFolder ? 'Hidе' : 'Show';
    //this.btnFolderDownload(this.InvNumber);   
    setTimeout(() => {
      this.networkDirectory.loadFolderByFleetNo(this.InvNumber);
    }, 200);
  }
  public btnFolderDownload(inv): void {
    this.visible = true;
    this.service.ExportToExcelFleetView(inv).subscribe(
      (res) => {
        this.visible = false;
        let data = new Blob([res], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;',
        });
        fileSaver.saveAs(data, 'InventoryInformationReport.xlsx');
      },
      (error) => {
        this.visible = false;
        this.onError(error, ErrorMessages.fleet.download_fleet_data);
      }
    );
  }
  public onToggle(): void {
    this.blShow = !this.blShow;
    this.strFilter = this.blShow ? 'Hidе' : 'Show';

    let aaa = this.ViewColumnsFleetList.filter((x) => x.isCheck == true);
    if (aaa.length == 1) {
      this.ViewColumnsFleetList.forEach((element) => {
        if (element.Name != aaa[0].Name) {
          this.temphiddenColumns.push(element.Name);
        }
      });
      this.DisableColumn(aaa[0].Name);
    }
  }

  public isHidden(columnName: string): boolean {
    return this.hiddenColumns.indexOf(columnName) > -1;
  }

  public isHiddenTemp(columnName: string): boolean {
    return this.temphiddenColumns.indexOf(columnName) > -1;
  }

  columnApply() {
    if (this.temphiddenColumns.length > 0) {
      this.hiddenColumns = this.temphiddenColumns;
    }
    this.temphiddenColumns = [];
    let filteredData = [];
    this.ViewColumnsFleetList.forEach((element) => {
      let data = this.hiddenColumns.find((x) => x == element.Name);
      if (!data) filteredData.push(element.Name);
    });

    if (this.filterCollection.rdFilter) {
      this.filterRnD = true;
    } else {
      this.filterRnD = false;
    }
    if (this.filterCollection.soldFilter) {
      this.filterSold = true;
    } else {
      this.filterSold = false;
    }
    if (this.filterCollection.majorRepairsFilter) {
      this.filterMajorRepairs = true;
    } else {
      this.filterMajorRepairs = false;
    }
    if (this.filterCollection.tagFilter) {
      this.filterTag = true;
    } else {
      this.filterTag = false;
    }
    if (this.filterCollection.uaFilter) {
      this.filterUnAssigned = true;
    } else {
      this.filterUnAssigned = false;
    }
    this.blShow = false;
    this.pageNumber = 1;
    this.skip = 0;
    this.selectedInvNumber = '';
    this.loadItems();
    this.savePreference();
  }

  closeFolderList() {
    this.blFolderList = !this.blFolderList;
  }

  closepopup() {
    this.blShow = !this.blShow;
  }

  resetpopup() {
    this.filterRnD = false;
    this.filterCollection.rdFilter = false;
    this.filterSold = false;
    this.filterCollection.soldFilter = false;
    this.filterMajorRepairs = false;
    this.filterCollection.majorRepairsFilter = false;
    this.filterTag = false;
    this.filterCollection.tagFilter = false;
    this.filterUnAssigned = false;
    this.filterCollection.uaFilter = false;
    this.ViewColumnsFleetList = []; this.tempviewColumns = [];
    this.tempviewColumns = [
      {
        Name: 'invNumber',
        isCheck: true,
        Text: 'Inventory Number',
        isDisable: false,
        index: 0,
        width: 131,
      },
      {
        Name: 'invType',
        isCheck: true,
        Text: 'Inventory Type',
        isDisable: false,
        index: 1,
        width: 50,
      },
      {
        Name: 'description',
        isCheck: false,
        Text: 'Description',
        isDisable: false,
        index: 2,
        width: 100,
      },
      {
        Name: 'branchName',
        isCheck: false,
        Text: 'Branch',
        isDisable: false,
        index: 3,
        width: 50,
      },
      {
        Name: 'location',
        isCheck: false,
        Text: 'Location',
        isDisable: false,
        index: 4,
        width: 50,
      },
      {
        Name: 'custName',
        isCheck: true,
        Text: 'Customer',
        isDisable: false,
        index: 5,
        width: 50,
      },
    ];
    this.ViewColumnsFleetList = ViewColumnsFleetList;
    this.loadItems();
    this.savePreference();
  }

  onFilterBranchChange(data) {
    var data1 = [];
    this.branchId = [];
    if (data.length >= 1) {
      if (data[0].id === 0) {
        data.forEach((element) => {
          if (element.id != 0) {
            data1.push(element);
          }
        });
      } else if (data[0].id !== 0) {
        data.forEach((element) => {
          if (element.id !== 0) {
            data1.push(element);
          } else {
            this.branchId = [];
            data1 = [];
            data1.push({ id: 0, value: 'All', code: 'All' });
          }
        });
      }
    }
    if (data.length === 0) {
      data1 = [];
      this.branchId = [];
      data1.push({ id: 0, value: 'All', code: 'All' });
    }
    this.selectedBranch = data1;
    this.selectedBranch.forEach((element) => {
      this.branchId.push(element.code);
    });
    if (!this.isAdd) { this.btnCancel(); this.loadItems(); }
  }

  onFilterTypeChange(data) {
    // data will be read in as selections in a CSV, where the last number will be the latest selection
    // compare the data in latest selection to what is already selected
    let aaa = data;
    let finder;
    let remove = -1;
    // = aaa          SEE ALL DATA
    // = aaa.length   SEE LENGTH OF DATA
    if (aaa[aaa.length - 1] == 1) {
      // ACTIVE look for SOLD
      for (var i = 0; i < aaa.length; i++) {
        if (aaa[i] == 2) {
          finder = 'Take out SOLD, selected ACTIVE';
          remove = i;
        }
      }
    } else if (aaa[aaa.length - 1] == 2) {
      // SOLD look for ACTIVE
      for (var i = 0; i < aaa.length; i++) {
        if (aaa[i] == 1) {
          finder = 'Take out ACTIVE, selected SOLD';
          remove = i;
        }
      }
    } else if (aaa[aaa.length - 1] == 5) {
      // RED TAG look for GREEN TAG
      for (var i = 0; i < aaa.length; i++) {
        if (aaa[i] == 6) {
          finder = 'Take out GREEN TAG, selected RED TAG';
          remove = i;
        }
      }
    } else if (aaa[aaa.length - 1] == 6) {
      // GREEN TAG look for RED TAG
      for (var i = 0; i < aaa.length; i++) {
        if (aaa[i] == 5) {
          finder = 'Take out RED TAG, selected GREEN TAG';
          remove = i;
        }
      }
    } else {
      finder = 'no conflicts';
    }
    var newArray = [];
    if (remove >= 0) {
      for (var i = 0; i < aaa.length; i++) {
        if (i != remove) {
          newArray.push(aaa[i]);
        }
      }

      // values pushed to newArray, set them to value
      this.value = newArray;
    }

    if (newArray.length == 0) {
      this.console = ['no issues'];
    } else {
      this.console = newArray;
    }
    //this.console = aaa[aaa.length - 1];

    //this.console = data;
  }

  onActiveFilterChange(event) {
    this.filterCollection.activeFilter = event;
    this.selectedInvNumber = '';
    this.pageNumber = 1;
    this.skip = 0;
    this.loadItems();
  }
  onPumpFilterChange(event) {
    this.filterCollection.pumpFilter = event;
    this.selectedInvNumber = '';
    this.pageNumber = 1;
    this.skip = 0;
    this.loadItems();
  }
  public DisableFilter(strFilterName: string): boolean {
    return (
      this.currentfilter.length - this.temphiddenFilters.length === 1 &&
      !this.isfilterHiddenTemp(strFilterName)
    );
  }

  public isfilterHiddenTemp(strFilter: string): boolean {
    return this.temphiddenFilters.indexOf(strFilter) > -1;
  }

  public hideFilter(): void {
    this.temphiddenFilters = [];
    this.currentfilter.forEach((element) => {
      if (!element.active) this.temphiddenFilters.push(element.text);
    });
  }

  btnRepairFilter() {
    this.repairsFilter = true;
    this.fleetFilterModel.blRepairsFilter = true;
  }
  btnRDFilter(event) {
    //this.filterRnD = event;
    this.filterCollection.rdFilter = event;
    this.fleetFilterModel.blRDFilter = event;
  }
  btnSoldFilter(event) {
    //this.filterSold = event;
    this.filterCollection.soldFilter = event;
    this.fleetFilterModel.blSoldFilter = event;
  }

  onActive(event) {
    this.active = event;
  }
  closeActiveDialog(status) {
    if (status == 'Ok') {
      this.active = !this.active;
    } else if (status == 'Cancel') {
      this.active = !this.active;
    } else {
      this.active = !this.active;
    }
  }
  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.selectedInvNumber = '';
    //this.savePreference();
    this.loadItems();
    // this.data = {
    //   data: orderBy(this.viewData, this.sort),
    //   total: this.viewData.length,
    // };
    // this.viewData = this.data.data;
  }
  onPageChange(e: PageChangeEvent): void {
    this.selectedInvNumber = '';
    this.skip = e.skip;
    this.pageSize = e.take;
    this.fleetFilterModel.pageNumber =
      this.skip == 0 ? 0 : this.skip / this.pageSize + 1;
    if (this.fleetFilterModel.pageNumber == 0) {
      this.fleetFilterModel.pageNumber = 1;
    }
    this.filterCollection.pageSize = this.pageSize;
    this.tempPageNo = this.pagerService.start;
    this.pageNumber = this.fleetFilterModel.pageNumber;

    this.loadItems();
  }
  onPageSizechange(pagesize) {
    this.pageSize = pagesize;
    this.loadItems();
  }

  public loadMoreItems() {
    if (this.pagerService.hasMore) {
      this.pagerService.loadMore();
      this.loadItems(true);
    }
  }

  GetBranch() {
    this.dropdownservice.GetBranchList().subscribe(
      (res) => {
        if (res) {
          this.branchList = res.sort((a, b) => a.value.localeCompare(b.value));
          this.branchData = res.sort((a, b) => a.value.localeCompare(b.value));
          var index = this.branchData.findIndex((c) => c.value == 'SSG');
          this.branchData.splice(index, 1);
          this.branchData.unshift({ code: 'All', id: 0, value: 'All' });
          this.branchData = this.branchData;
          this.selectedBranch.push(this.branchData[0]);
        }
      },
      (error) => this.onError(error, ErrorMessages.drop_down.branch_list)
    );
  }

  private onError(error: any, customMessage?: string) {
    this.errorHandler.handleError(error, ModuleNames.fleet, customMessage);
  }

  reorderColumns(event) {
    var newIndx = event.newIndex;
    var oldIndx = event.oldIndex;
    var column = event.column.field;
    let cutOut = this.ViewColumnsFleetList.splice(oldIndx, 1)[0]; // cut the element at index 'from'
    this.ViewColumnsFleetList.splice(newIndx, 0, cutOut); // insert it at index 'to'
    this.savePreference();
  }
  resizeColumns(eventData) {
    let col = this.ViewColumnsFleetList.findIndex(
      (c) => c.Name == eventData[0].column.field
    );
    this.ViewColumnsFleetList[col].width = eventData[0].newWidth;
    this.savePreference();
  }
  onGridSelectionChange($event) {
    this.selectedRow = $event.selectedRows[0].dataItem;
    this.InvNumber = this.selectedRow.invNumber;
    this.fleetInfo.getFleetAdorsUnitInfo(this.selectedRow.invNumber);
    this.fleetInfo.getFleetUnitInfoAdorsHours(this.selectedRow.invNumber);
    this.fleetInfo.getFleetAdorsComponent(this.selectedRow.invNumber);
  }

  // LoadItemAddorEdit(data: any) {
  //
  //   if(data.isAdd == false) {
  //     this.loadItems();
  //   }
  // }

  onSave() {
    if (this.selectedTab == 'Unit Info') {
      this.isFleetInfoSaved = this.fleetInfo.onSave(this.inactive == false ? true : false, this.selectedBranch);
      if (this.isFleetInfoSaved) {
        setTimeout(() => {
          if (this.inactive == false) {
            this.mySelection = [0];
            this.selectedInvNumber = '';
          }
          this.loadItems();
        }, 2000);
      }
    } else if (this.selectedTab == 'Notes') {
      this.fleetNotes.onSave();
      setTimeout(() => {
        this.loadItems();
      }, 2500);
    } else {
    }
  }

  resetRnD() {
    //this.filterRnD = false;
    this.filterCollection.rdFilter = false;
  }
  resetSold() {
    //this.filterSold = false;
    this.filterCollection.soldFilter = false;
  }
  resetMajorRepairs() {
    //this.filterMajorRepairs = false;
    this.filterCollection.majorRepairsFilter = false;
  }
  resetTag() {
    //this.filterTag = false;
    this.filterCollection.tagFilter = false;
  }
  resetUnAssigned() {
    //this.filterUnAssigned = false;
    this.filterCollection.uaFilter = false;
  }
  downloadFile() {
    this.btnDownload(this.fleetFilterModel);
  }
  emitLoadItems() {
    this.blAdd = false;
    this.isCancel = true;
    this.isAdd = false;
    this.isSave = true;
    this.isEdit = false;
    this.selectedInvNumber = '';
    this.mySelection = []; this.isDisableGrid = false;
    //this.loadItems(true);
  }
  public btnDownload(filter): void {
    this.excelFilter = filter;
    this.visible = true;
    this.displayExcelConfirmationDialog = !this.displayExcelConfirmationDialog;
  }
  CloseExcelDialog(status) {
    if (status == 'Ok') {
      this.visible = true;
      this.displayExcelConfirmationDialog =
        !this.displayExcelConfirmationDialog;
      this.service.ExportToExcelFleetGridView(this.excelFilter).subscribe(
        (res) => {
          this.visible = false;
          let data = new Blob([res], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;',
          });
          fileSaver.saveAs(data, 'Book.xlsx');
        },
        (error) => {
          this.visible = false;
          this.onError(error, ErrorMessages.fleet.download_fleet_data);
        }
      );
    } else if (status == 'Cancel') {
      this.visible = false;
      this.displayExcelConfirmationDialog =
        !this.displayExcelConfirmationDialog;
    } else {
      this.visible = false;
      this.displayExcelConfirmationDialog =
        !this.displayExcelConfirmationDialog;
    }
  }

  isDataSaved(data: any) {
    if (data.isSavedData) {
      this.isEdit = false;
      this.isCancel = true;
      this.isAdd = false;
      this.isSave = true;
      this.isFleetInfoSaved = true;
      this.isDisableGrid = false;
      if (data.isAddData) {
        this.selectedInvNumber = '';
      }
      //this.loadItems();
    } else {
      this.isEdit = true;
      this.isCancel = false;
      this.isAdd = true;
      this.isSave = false;
      this.isFleetInfoSaved = false;
      this.isDisableGrid = true;
    }
  }
}
