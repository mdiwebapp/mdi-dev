import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuService } from '../../../../core/helper/menu.service';
import { UtilityService } from '../../../../core/services/utility.service';
import { Router } from '@angular/router';
import { DataBindingDirective, DataStateChangeEvent, PageChangeEvent, } from '@progress/kendo-angular-grid';
import { orderBy, process, SortDescriptor, State, } from '@progress/kendo-data-query';
import { DevicesService } from './devices.service';
import { ErrorMessages, ModuleNames } from 'src/app/core/constant';
import { ErrorHandlerService, PagerService } from 'src/app/core/services';
import { UserPreferenceModel } from 'src/app/core/models/preference.model';
import { UserPreferenceService } from 'src/app/core/services/user-preference.service';
import { DevicesInfoComponent } from '../devices-info/devices-info.component';
import { DevicesHistoryComponent } from '../devices-history/devices-history.component';
import { DeviceTabs } from 'src/app/core/models/enum-model';
import { DevicesNotesComponent } from '../devices-notes/devices-notes.component';
import { PaginationWithSortRequest } from 'src/app/core/models/pagination.model';
import { DeviceNotesModel } from '../devices-notes/device-notes.model';
import * as fileSaver from 'file-saver';
@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.scss']
})
export class DevicesComponent implements OnInit {
  @ViewChild(DevicesInfoComponent) deviceInfo: DevicesInfoComponent;
  @ViewChild(DevicesHistoryComponent) deviceHistory: DevicesHistoryComponent;
  @ViewChild(DevicesNotesComponent) deviceNotes: DevicesNotesComponent;
  public pageSize = 100;
  public skip = 0;
  loader: any;
  public sort: SortDescriptor[] = [
    {
      field: 'deviceID',
      dir: 'asc',
    },
    {
      field: 'issuedUser',
      dir: 'asc',
    },
    {
      field: 'location',
      dir: 'asc',
    },  {
      field: 'type',
      dir: 'asc',
    },
  ];
  public mySelection: number[] = [0];
  public totalData = 0;
  public deactiveReasons: any[] = [{ name: "Damaged" }, { name: "Decommissioned" }, { name: "Lost/Missing" }, { name: "Sold" }];
  pageSizeList: any = [
    { id: 0, value: 100 },
    { id: 0, value: 300 },
    { id: 0, value: 500 },
  ];
  isSave: boolean = true;
  isCancel: boolean = true;
  isEdit: boolean = true;
  isAdd: boolean = false;
  isAddRight: boolean = false;
  isUpdateRight: boolean = false;
  isTab1: boolean = false;
  isTab2: boolean = false;
  isTab3: boolean = false;
  opened: boolean = false;
  openedOptions: boolean = false;
  userPreferenceModel: UserPreferenceModel;
  columnWidths: any = [];
  request:any;
  public pageNumber = 1;
  public viewColumns = [{
    Name: 'deviceID',
    isCheck: true,
    Text: 'DeviceId',
    isDisable: false,
    index: 0,
    width: 100,
  }, {
    Name: 'type',
    isCheck: true,
    Text: 'Type',
    isDisable: false,
    index: 0,
    width: 80,
  }, {
    Name: 'location',
    isCheck: true,
    Text: 'Location',
    isDisable: false,
    index: 0,
    width: 150,
  }, {
    Name: 'issuedUser',
    isCheck: true,
    Text: 'Issued',
    isDisable: false,
    index: 0,
    width: 150,
  }];
  public columns = [];
  tabList = { DeviceInfo: true, Notes: true, History: true }
  data: any = [];
  tempData: any;
  id: number;
  cdate: any;
  status: number = 1;
  isDesktop: boolean = true;
  isLaptop: boolean = true;
  isPhone: boolean = true;
  isHotSpot: boolean = true;
  isTablet: boolean = true;
  inactive: boolean = true;
  tabActive: boolean = true;
  //isDisable: boolean = true;
  isDisabled: boolean = true;
  cInfos: any;
  tempvendor: any;
  tempId: number = 0;
  filterText: string;
  vendorName: string;
  tabs = DeviceTabs;
  selectedTab = 'Device Info';
  selectedTabIndex = 0;
  filterOptions = {
    searchText: '',
    status: this.status,
    desktop: this.isDesktop,
    laptop: this.isLaptop,
    phone: this.isPhone,
    hotSpot: this.isHotSpot,
    tablet: this.isTablet,
  };
  reason: string = '';
  deviceId: any;
  isRecordSave: boolean = false;
  deviceDetail: any;
  constructor(
    public service: DevicesService, public pagerService: PagerService,
    public menuService: MenuService, public preference: UserPreferenceService,
    public utils: UtilityService, public errorHandler: ErrorHandlerService,
    public router: Router) {
    if (localStorage.getItem("isAdmin") == 'true') {
      this.isTab1 = false;
      this.isTab2 = false;
      this.isTab3 = false;
    }
    else {
      let acc = this.menuService.checkUserViewRights('Devices');
      if (acc) {
        //this.menuService.checkUserRights('Devices');
        const rights = JSON.parse(localStorage.getItem('Rights'));
        if (rights) {
          this.isTab1 = !rights.some(
            (c) => c.subModuleName == 'Devices' && c.tabName == 'VIEW'
          );

          this.isTab2 = !rights.some(
            (c) => c.subModuleName == 'Notes' && c.tabName == 'VIEW'
          );
          this.isTab3 = !rights.some(
            (c) => c.subModuleName == 'History' && c.tabName == 'VIEW'
          );
        }
      } else {
        this.utils.toast.error(
          'You do not have permissions to access this part of the system. Please contact your supervisor so they can request them from IT.'
        );
        setTimeout(() => {
          var url = '/dashboard';
          location.href = url;
        }, 1000);
      }

    }
  }
  ngOnInit(): void {
    this.loadItems();
  }
  private loadItems(): void {
    this.data=[];
    this.loader = true;
    let actv = this.status;
     this.request = new PaginationWithSortRequest<any>();
    // request.start = null;
    // request.end = null;
    this.request.pageSize = this.pagerService.pageSize;     
    this.request.sortColumn = this.sort[0].field;
    this.request.sortDesc = this.sort[0].dir == 'asc' ? false : true;
    this.request.pageNumber = this.pageNumber;;
    this.request.request = this.filterOptions;  
    if(this.isRecordSave)
    {
      this.isRecordSave = false;
      this.request.sortColumn = 'id';
      this.request.sortDesc = true;
      this.tempId = 0;
      this.mySelection = [0];
    }
    this.id = 0;
    this.service.GetList(this.request).subscribe(
      (res) => {   
        if (res != null && res.length > 0) {
          this.data = res;
          this.tempData = res;
          this.totalData = res[0].totalRecords;         
          // this.getPreference();      
          // this.mySelection = [0];   
          if (this.tempId == 0) this.editClick(this.data[0].id);
          else this.editClick(this.tempId);         
          this.deviceId = this.data[0].deviceID;       
          
          // this.id=this.data[0].id;
          // if (this.id > 0) {
          //   this.editClick(this.id);
          // } else {
          //   this.editClick(this.data[0].id);
          // }
        } else {
          this.totalData=0;
          this.data = [];
          this.deviceInfo.onEdit(null);
          this.deviceId='';
          this.cdate='';
        }
      },
      (error) => this.onError(error, ErrorMessages.devices.get_note_list)
    );
  }
  btnAdd() {
    this.enableBtn();
    this.isEdit = true;
    this.isAdd = true;
    this.isRecordSave = true;
    this.tempId = 0;
    this.id = 0;
    this.deviceId='';
    this.cdate = "";
    this.inactive = false;
    if (this.selectedTab == this.tabs.tab1) {
      //0
      this.deviceInfo.btnAdd();
      this.isDisabled = false;
    }
  }
  btnEdit() {
    this.enableBtn();
    this.isEdit = true;
    this.isAdd = true;
    //this.tempId = this.id;
    if (this.selectedTab == this.tabs.tab1) {
      //0
      this.isDisabled = false;
      this.deviceInfo.btnEdit();
    }
  }
  btnCancel() {
    this.isEdit = false;
    this.isCancel = true;
    this.isAdd = false;
    this.isSave = true;
    this.tempId = 0;
    this.mySelection = [0];
    this.disbaleBtn();
     this.loadItems();
    if (this.selectedTab == this.tabs.tab1) {
      this.isDisabled = true;
      this.deviceInfo.btnCancel();
    }
  }
  onSave() {
    let saveStatus = false;
    saveStatus = this.deviceInfo.onSave(this.inactive);
    if (saveStatus) return false;
    setTimeout(() => {
      this.loadItems();
    }, 3000);
    this.disbaleBtn();
    this.isDisabled = true;
    this.isAdd = false;
    this.isEdit = false;
   
  }
  editClick(id: number) {
    this.id = id;
    this.tempId = id;
    this.isCancel = true;
    this.isSave = true;
    this.isAdd = false;
    this.isEdit = false;
    this.service.GetDeviceById(id).subscribe(
      (res) => {
        this.inactive = res['active'];
        this.cdate = res['createdDate'];
        this.deviceId = res['deviceID'];
        this.deviceDetail = res;
        if (this.selectedTab == this.tabs.tab1) {
          //0
          //this.isDisabled = false;
          this.deviceInfo.onEdit(res);
          this.tabList.DeviceInfo = false;
          this.tabList.Notes = true;
          this.tabList.History = true;
        }
        if (this.selectedTab == this.tabs.tab2) {
          //3
          this.isAdd = true;
          this.isEdit = true;
          this.deviceNotes.onEdit(res);
          this.tabList.DeviceInfo = true;
          this.tabList.Notes = false;
          this.tabList.History = true;
        }
        if (this.selectedTab == this.tabs.tab3) {
          //4
          this.isAdd = true;
          this.isEdit = true;
          this.deviceHistory.historyList(res);
          this.tabList.DeviceInfo = false;
          this.tabList.Notes = false;
          this.tabList.History = false;
        }
        
      });
  }
  enableBtn() {
    this.isSave = false;
    this.isCancel = false;
  }
  disbaleBtn() {
    this.isSave = true;
    this.isCancel = true;
  }

  public onTabSelect(e) {
    this.selectedTab = e.title;
    //this.editClick(this.id);
    if (this.selectedTab == this.tabs.tab1) {
      this.isAdd = false;
      this.isEdit = false;  this.tabList.DeviceInfo = false;
      this.tabList.Notes = true;
      this.tabList.History = true;
      this.deviceInfo.onEdit(this.deviceDetail);
      //this.menuService.checkUserBySubmoduleRights('Vendor Info');
    } else if (this.selectedTab == this.tabs.tab2) {
      this.isAdd = true;
      this.isEdit = true;
      this.isSave = true;
      this.isCancel = true;  this.tabList.DeviceInfo = true;
      this.tabList.Notes = false;
      this.tabList.History = true;
      this.deviceNotes.onEdit(this.deviceDetail);
      //this.menuService.checkUserBySubmoduleRights('Notes');
    } else if (this.selectedTab == this.tabs.tab3) {
      this.isAdd = true;
      this.isEdit = true;
      this.isSave = true;
      this.isCancel = true;this.tabList.DeviceInfo = false;
      this.tabList.Notes = false;
      this.tabList.History = false;
      this.deviceHistory.historyList(this.deviceDetail);
      //this.menuService.checkUserBySubmoduleRights('Notes');
    }
  } 
  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.mySelection = [0];
    this.tempId = 0;
    this.loadItems();
    // this.data = {
    //   data: orderBy(this.tempData, this.sort),
    //   total: this.tempData.length,
    // };
    // this.data = this.data.data;
  }
  public onFilter(inputValue: string): void {
    this.filterText = inputValue;
    this.filterOptions.searchText = this.filterText;
    this.loadItems();
  }

  public onPageChange(e: PageChangeEvent): void {
    this.skip = e.skip;
    this.pageSize = e.take;
    this.pageNumber =
      this.skip == 0 ? 0 : this.skip / this.pageSize + 1;
    if (this.pageNumber == 0) {
      this.pageNumber = 1;
    }
   
    // this.currentPage = this.pageNumber;
    //this.skip = event.skip;
    this.mySelection = [0];
    this.tempId = 0;
    this.loadItems();
  }
  onPageSizechange(pagesize) {
    this.pageSize = pagesize;
    this.loadItems();
  }
  savePreference() {
    var usr = JSON.parse(localStorage.getItem('currentUser'));
    if (usr) {
      this.userPreferenceModel = new UserPreferenceModel();
      this.userPreferenceModel.userName = usr.userId;
      this.userPreferenceModel.id = 0;
      this.userPreferenceModel.userId = 0;
      this.userPreferenceModel.page = 'Devices';
      var objd = {
        columns: [],
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
      this.preference.GetUserPreference('Devices').subscribe((res) => {
        if (res.result) {
          var userPref = res.result.preference;
          this.viewColumns = userPref.order.filter((c) => c.isCheck == true);
          this.viewColumns.forEach((element) => {
            let col = this.viewColumns.findIndex((c) => c.Name == element.Name);
            this.viewColumns[col].isCheck = true;
          });
          this.sort = userPref.sortBy;
          this.data = {
            data: orderBy(this.tempData, this.sort),
            total: this.tempData.length,
          };
          this.data = this.data.data;
        } else {
          this.viewColumns.forEach((element) => {
            let col = this.viewColumns.findIndex((c) => c.Name == element.Name);
            this.viewColumns[col].isCheck = true;
          });
          this.data = this.data;
        }
       
        if (this.filterText) this.onFilter(this.filterText);
        else {
          if (this.tempId == 0) {
            // this.mySelection = [0];
            this.id = this.data[0].id;
            this.editClick(this.id);
          } else {
            this.id = this.tempId;
            this.editClick(this.id);
          }
        }
      });
    } catch (error) {
      this.viewColumns.forEach((element) => {
        let col = this.viewColumns.findIndex((c) => c.Name == element.Name);
        this.viewColumns[col].isCheck = true;
      }); 
    }
  }
  resizeColumns(eventData) {
    let col = this.viewColumns.findIndex(
      (c) => c.Name == eventData[0].column.field
    );
    this.viewColumns[col].width = eventData[0].newWidth;
    this.savePreference();
  }
  reorderColumns(event) {
    var newIndx = event.newIndex;
    var oldIndx = event.oldIndex;
    var column = event.column.field;
    let cutOut = this.viewColumns.splice(oldIndx, 1)[0]; // cut the element at index 'from'
    this.viewColumns.splice(newIndx, 0, cutOut); // insert it at index 'to'
    this.savePreference();
  }
  onStatuschange(event) {
    this.filterOptions.status = event == false ? 0 : 1;
    this.mySelection = [0];
    this.tempId = 0;
    this.skip = 0;
    this.pageNumber = 1;  
    this.loadItems();
  }
  onDesktopchange(event) {
    this.filterOptions.desktop = event;
    this.mySelection = [0];
    this.tempId = 0;
    this.skip = 0;
    this.pageNumber = 1;  
    this.loadItems();
  }
  onLaptopchange(event) {
    this.filterOptions.laptop = event;
    this.mySelection = [0];
    this.tempId = 0;
    this.skip = 0;
    this.pageNumber = 1;  
    this.loadItems();
  }
  onPhonechange(event) {
    this.filterOptions.phone = event;
    this.mySelection = [0];
    this.tempId = 0;
    this.skip = 0;
    this.pageNumber = 1;  
    this.loadItems();
  }
  onHotspotchange(event) {
    this.filterOptions.hotSpot = event;
    this.mySelection = [0];
    this.tempId = 0;
    this.skip = 0;
    this.pageNumber = 1;  
    this.loadItems();
  }
  onTabletchange(event) {
    this.filterOptions.tablet = event;
    this.mySelection = [0];
    this.tempId = 0;
    this.skip = 0;
    this.pageNumber = 1;  
    this.loadItems();
  }
  onSwitchChange(event) {
    if (event == false) {
      if (this.menuService.isAddRight) { this.opened = true; }
    }
  }
  submitOption() {
    this.openedOptions = false;
    this.inactive = true;
    this.deviceInfo.form.controls['inactivatedReason'].setValue('');
  }
  submitReason(type) {
    if (type == 1) {
      this.opened = false;
      this.openedOptions = true;
    }
    else {
      this.opened = false;
      this.inactive = true;
    }
  }
  selectionChange(reason) {
    this.deviceInfo.form.controls['inactivatedReason'].setValue(reason.name);
  }
  dblClickEvent(reason) {
    this.openedOptions = false;
  }
  downloadFile() {
    let status = this.inactive == false ? 0 : 1;
    this.service.downloadDeviceData(status).subscribe(
      (res) => {
        let data = new Blob([res], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;',
        });
        fileSaver.saveAs(data, 'Devices_Info.xlsx');
      },
      (error) => {
        this.onError(error, ErrorMessages.devices.get_error);
      }
    );
    //window.open(environment.apiUrl + 'Vendor/ExportToExcel');
  }
  private onError(error: any, customMessage?: string) {
    this.errorHandler.handleError(error, ModuleNames.devices, customMessage);
  }

  filterDevices() {
    this.skip = 0;
    this.pageNumber = 1;
    this.mySelection=[0];
    this.tempId = 0;
    this.loadItems();
  }
}
