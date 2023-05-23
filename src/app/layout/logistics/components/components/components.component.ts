import { Component, OnInit, ViewChild } from '@angular/core';
import { ComponentsService } from '../../../logistics/components/components/components.service';
import { MenuService } from '../../../../core/helper/menu.service';
import { UtilityService } from '../../../../core/services/utility.service';
import { Router } from '@angular/router';
import {
  DataBindingDirective,
  DataStateChangeEvent,
  PageChangeEvent,
} from '@progress/kendo-angular-grid';
import {
  ViewColumns,
  ViewData,
  columns,
} from './../../../../../data/component-data';
import {
  orderBy,
  process,
  SortDescriptor,
  State,
} from '@progress/kendo-data-query';
import { PaginationWithSortRequest } from 'src/app/core/models/pagination.model';
import { ErrorMessages, ModuleNames } from 'src/app/core/constant';
import { ErrorHandlerService } from 'src/app/core/services';
import { UserPreferenceModel } from 'src/app/core/models/preference.model';
import { UserPreferenceService } from 'src/app/core/services/user-preference.service';
import { ComponentTabs } from 'src/app/core/models/enum-model';
import { ComponentsInfoComponent } from '../components-info/components-info.component';
import { ComponentsNotesComponent } from '../components-notes/components-notes.component';
import { ComponentsHistoryComponent } from '../components-history/components-history.component';
import { ComponenterviceHistoryComponent } from '../component-service-history/component-service-history.component';
import { ComponentActivityComponent } from '../component-activity/component-activity.component';
import { DropdownService } from 'src/app/core/services/dropdown.service';
import * as fileSaver from 'file-saver';
import { NetworkDirectoryComponent } from 'src/app/layout/networkdirectory/networkdirectorypage/networkdirectory.component';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';

@Component({
  selector: 'app-components',
  templateUrl: './components.component.html',
  styleUrls: ['./components.component.scss'],
})
export class ComponentsComponent implements OnInit {
  @ViewChild(ComponentsInfoComponent) componentInfo: ComponentsInfoComponent;
  @ViewChild(ComponentsNotesComponent) componentNotes: ComponentsNotesComponent;
  @ViewChild(ComponentActivityComponent)
  componentActivity: ComponentActivityComponent;
  @ViewChild(ComponentsHistoryComponent)
  componentHistory: ComponentsHistoryComponent;
  @ViewChild(ComponenterviceHistoryComponent)
  componentServiceHistory: ComponenterviceHistoryComponent;
  @ViewChild(NetworkDirectoryComponent)
  networkDirectory: NetworkDirectoryComponent;
  public pageSize = 5;
  public skip = 0;
  loader: any;
  branch: any;
  viewData: any;
  viewColumns: any;
  columns: any;
  componentTypeId: any;
  invNumber: any;
  openedExcelDialog: boolean = false;
  filterGreenTag: boolean = false;
  filterRedTag: boolean = false;
  filterMajorRepair: boolean = false;
  multiple: boolean = false;
  FilterOptions: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'startsWith',
  };
  listCompType: any = [
    // { id: '0', value: 'All' },
    // { id: '1', value: 'ENGINE' },
    // { id: '2', value: 'PUMPEND' },
    // { id: '3', value: 'PRIMINGSYSTEM' },
    // { id: '4', value: 'GEARBOX' },
    // { id: '5', value: 'CONTROLPANEL' },
    // { id: '6', value: 'MESSENGER' },
    // { id: '7', value: 'CHASSIS' },
  ];
  componentType: any = 'All';
  public sort: SortDescriptor[] = [
    {
      field: 'inventoryType',
      dir: 'asc',
    },
    {
      field: 'inventoryNumber',
      dir: 'asc',
    },
    {
      field: 'make',
      dir: 'asc',
    },
    {
      field: 'model',
      dir: 'asc',
    },
    {
      field: 'location',
      dir: 'asc',
    },
  ];
  active: boolean = false;
  public mySelection: number[] = [0];
  soldSwitch: boolean = false;
  soldSwitchDisplay: boolean = false;
  inactiveReason: string = '';
  inactiveDate: any;

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
  tabList = {
    VendorInfo: true,
    MoreInfo: true,
    Contacts: true,
    Activity: true,
    Notes: true,
    History: true,
  };
  data: any;
  id: number;
  cdate: any;
  status: boolean = true;
  inactive: boolean = true;
  tabActive: boolean = true;
  //isDisable: boolean = true;
  isDisabled: boolean = true;
  cInfos: any;
  selectedTab = 'Component Info';
  selectedTabIndex = 0;
  tempvendor: any;
  tempId: number = 0;
  filterText: string = "";
  vendorName: string;
  toggleText: string;
  show: boolean = false;
  majorRepairs: boolean = false;
  redTag: boolean = false;
  greenTag: boolean = false;
  yard: boolean = true;
  isActive: boolean = true;
  openinactiveReson: boolean = true;
  status1: any;
  status2: any;
  status3: any;
  status4: any;
  branchData: any;
  branchCode: any = 'All';
  userPreferenceModel: UserPreferenceModel;
  tabs = ComponentTabs;

  public hiddenColumns: string[] = ['make', 'model', 'location'];
  serialNumner: any;
  componentDetail: any;
  constructor(
    public service: ComponentsService,
    public menuService: MenuService,
    public dropdownService: DropdownService,
    public utils: UtilityService,
    public preference: UserPreferenceService,
    public router: Router,
    public errorHandler: ErrorHandlerService
  ) {
    if (localStorage.getItem('isAdmin') == 'true') {
      this.isTab1 = true;
      this.isTab2 = true;
      this.isTab3 = true;
      this.isTab4 = true;
      this.isTab5 = true;
    } else {
      let acc = this.menuService.checkUserViewRights('Maintain Components');
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
      this.menuService.checkUserRights('maintain components');
      const rights = JSON.parse(localStorage.getItem('Rights'));
      if (rights) {
        this.isTab1 = rights.some(
          (c) =>
            c.subModuleName == 'Component Info' &&
            c.moduleName == 'Maintain Components' &&
            c.tabName == 'VIEW'
        );

        this.isTab2 = rights.some(
          (c) =>
            c.subModuleName == 'Notes' &&
            c.moduleName == 'Maintain Components' &&
            c.tabName == 'VIEW'
        );
        this.isTab3 = rights.some(
          (c) =>
            c.subModuleName == 'History' &&
            c.moduleName == 'Maintain Components' &&
            c.tabName == 'VIEW'
        );
        this.isTab4 = rights.some(
          (c) =>
            c.subModuleName == 'Service History' &&
            c.moduleName == 'Maintain Components' &&
            c.tabName == 'VIEW'
        );
        this.isTab5 = rights.some(
          (c) =>
            c.subModuleName == 'Activity' &&
            c.moduleName == 'Maintain Components' &&
            c.tabName == 'VIEW'
        );
      }

      this.menuService.checkUserBySubmoduleRights('Component Info');

      //this.componentInfo.isdisableSN = this.menuService.isUpdateSN;
    }
  }

  ngOnInit(): void {
    this.viewColumns = ViewColumns;
    this.columns = columns;
    this.GetBranch();
    this.loadComponent();
    this.loadItems();
  }
  tempData: any;
  loadComponent() {
    this.dropdownService.GetComponentList().subscribe(
      (res) => {
        if (res) {
          this.listCompType = res;
          this.listCompType.unshift({ inventoryType: 'All', partNumber: 0 });
        }
      },
      (error) => this.onError(error, ErrorMessages.components.save_info)
    );
  }
  GetBranch() {
    this.branch = this.utils.storage.CurrentUser.userBranch;
    var index = this.branch.findIndex((c) => c.value == 'SSG');
    this.branch.splice(index, 1);
    this.branch.unshift({ code: 'All', id: 0, value: 'All' });
    this.branchData = this.branch;
  }
  setYard() {
    // if (this.isActive)
    //   this.yard = false;
    // else
    //   this.yard = true;
  }
  setActive() {
    // if (this.yard)
    //   this.isActive = false;
    // else
    //   this.isActive = true;
  }
  public loadItems(): void {
    this.isActive;
    this.viewData = [];
    this.tempData = [];
    this.loader = true;
    let actv = this.status;
    var request = {
      search: this.filterText ?? '',
      inventoryType: this.componentType ?? 'All',
      branch: this.branchCode ?? 'All',
      inActive: this.isActive == true ? false : true,
      greenTag: this.greenTag,
      redTag: this.redTag,
      yard: this.yard,
      majorRepair: this.majorRepairs,
    };
    //this.id = 0;
    this.service.GetList(request).subscribe(
      (res) => {
        if (res != null && res.length > 0) {
          this.viewData = res;
          this.tempData = res;
          this.getPreference();
          // if (this.tempId == 0) this.editClick(this.viewData[0].inventoryInfoId);
          // else this.editClick(this.tempId);
        } else {
          this.cdate = '';
          this.serialNumner = '';
          this.viewData = []; this.tempId = 0;
          this.editClick(this.tempId);
        }
      },
      (error) => this.onError(error, ErrorMessages.components.save_info)
    );
  }
  btnAdd() {
    this.enableBtn();
    this.isEdit = true;
    this.isAdd = true;
    //this.tempId = this.id;
    this.id = 0;
    this.cdate = '';
    this.inactive = true;
    if (this.selectedTab == this.tabs.tab1) {
      //0
      this.componentInfo.btnAdd();
      this.isDisabled = false;
    }
  }
  btnEdit() {
    this.enableBtn();
    this.isEdit = true;
    this.isAdd = true;
    this.tempId = this.id;
    if (this.selectedTab == this.tabs.tab1) {
      //0
      this.isDisabled = false;
      this.componentInfo.btnEdit();
    }
  }
  btnCancel() {
    this.isEdit = false;
    this.isCancel = true;
    this.isAdd = false;
    this.isSave = true;
    this.disbaleBtn();
    this.isDisabled = true;
    this.editClick(this.tempId);
  }
  onSave() {
    let saveStatus = false;
    var obj = {
      inactive: this.inactive,
      inactiveReason: this.inactiveReason,
      inactiveDate: this.inactiveDate,
      sold: this.soldSwitch,
    };
    saveStatus = this.componentInfo.onSave(obj);
    if (saveStatus)
      return false;
    setTimeout(() => {
      this.loadItems();
      this.inactiveReason = '';
      this.inactiveDate = null;
    }, 1500);
    this.disbaleBtn();
    this.isDisabled = true;
    this.isAdd = false;
    this.isEdit = false;
  }
  editClick(id: number) {
    this.id = id;
    this.tempId = id;
    this.disbaleBtn();
    var component = this.viewData.find((c) => c.inventory_PK == id);
    this.isCancel = true;
    this.isSave = true;

    if (!component) {
      this.cdate = '';
      this.invNumber = ''; this.componentInfo.componentId = null;
      this.componentInfo.form.reset();
      return false;
    }
    // this.isAdd = true;
    // this.isEdit = true;

    this.componentTypeId = component.inventoryType;
    this.invNumber = component.inventoryNumber;
    this.service.GetById(component.inventoryNumber, id).subscribe(
      (res) => {
        if (res) {
          var result = res.result;
          this.componentDetail = res.result;
          this.id = result['inventoryId'];
          this.cdate = result['createdDate'];
          this.serialNumner = result['inventoryNumber'];
          this.inactive = result['inactive'] == false ? true : false;
          this.isDisabled = true;

          if (this.selectedTab == this.tabs.tab1) {
            this.isAdd = false;
            this.isEdit = false;
            ///0 
            this.componentInfo.onEdit(result, this.componentTypeId);

          }
          if (this.selectedTab == this.tabs.tab4) {
            this.isAdd = true;
            this.isEdit = true;
            //4 
            this.componentNotes.onEdit(component.inventoryNumber);

          }
          if (this.selectedTab == this.tabs.tab2) {
            this.isAdd = true;
            this.isEdit = true;
            //5 
              this.componentServiceHistory.serviceHistoryList(
                component.inventoryNumber
              ); 
          }
          if (this.selectedTab == this.tabs.tab3) {
            this.isAdd = true;
            this.isEdit = true;
            //5 
              this.componentActivity.activityList(this.serialNumner);
            
          }
          if (this.selectedTab == this.tabs.tab5) {
            this.isAdd = true;
            this.isEdit = true;
            //5 
              this.componentHistory.historyList(result); 
          }
        }
      },
      (error) => {
        //this.onError(error, ErrorMessages.vehicle.get_by_id);
      }
    );
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
    var component = this.viewData.find((c) => c.inventory_PK == this.id);
    //this.editClick(this.id);
    if (this.selectedTab == this.tabs.tab1) {
      this.componentInfo.onEdit(this.componentDetail, this.componentTypeId);
    }
    if (this.selectedTab == this.tabs.tab4) {
      this.componentNotes.onEdit(component.inventoryNumber);
    }
    if (this.selectedTab == this.tabs.tab2) { 
        this.componentServiceHistory.serviceHistoryList(
          component.inventoryNumber
        ); 
    }
    if (this.selectedTab == this.tabs.tab3) {
        this.componentActivity.activityList(this.serialNumner);      
    }
    if (this.selectedTab == this.tabs.tab5) { 
      setTimeout(() => {
        this.componentHistory.historyList(this.componentDetail);
      }, 500);
    }
  }
  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.data = {
      data: orderBy(this.tempData, this.sort),
      total: this.tempData.length,
    };
    this.viewData = this.data.data;
    this.mySelection = [0];
    this.id = this.viewData[0].id;
    this.savePreference();
    this.editClick(this.viewData[0].inventory_PK);
  }
  public onFilter(inputValue: string): void {
    this.filterText = inputValue;
    this.mySelection = [];
    this.viewData = process(this.tempData, {
      filter: {
        logic: 'or',
        filters: [
          {
            field: 'inventoryType',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'inventoryNumber',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'make',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'model',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'location',
            operator: 'contains',
            value: inputValue,
          },
        ],
      },
    }).data;
    this.isActive;
    this.viewData = [];
    this.tempData = [];
    this.loader = true;
    let actv = this.status;
    var request = {
      search: this.filterText ?? '',
      inventoryType: this.componentType ?? 'All',
      branch: this.branchCode ?? 'All',
      inActive: this.isActive == true ? false : true,
      greenTag: this.greenTag,
      redTag: this.redTag,
      yard: this.yard,
      majorRepair: this.majorRepairs,
    };
    this.service.GetList(request).subscribe(
      (res) => {
        if (res != null && res.length > 0) {
          this.viewData = res;
          this.tempData = res;
          this.mySelection = [0];

          this.id = this.viewData[0].inventory_PK;
          this.editClick(this.id);
        } else {
          this.viewData = []; this.cdate = '';
          this.invNumber = ''; this.componentInfo.componentId = null;
          this.componentInfo.form.reset();
        }
      });
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
  closepopup() {
    this.show = !this.show;
  }
  public onToggle(): void {
    this.show = !this.show;
  }
  onActive(event) {
    this.openinactiveReson = event;
  }

  onSoldSwitch(event) {
    this.soldSwitch = event;
    this.soldSwitchDisplay = !this.soldSwitchDisplay;
  }
  closeActiveDialog(status) {
    if (status == 'yes') {
      if (this.isActive == true)
        this.id = 0;
      this.openinactiveReson = !this.openinactiveReson;
    } else if (status == 'Cancel') {
      this.inactive = true;
      this.openinactiveReson = !this.openinactiveReson;
    } else {
      this.openinactiveReson = !this.openinactiveReson;
    }
  }

  resetpopup() {
    this.utils.toast.success('Your prefernece is reset to default columns.');
    this.greenTag = false;
    this.redTag = false;
    this.majorRepairs = false;
    this.columns = [];
    this.viewColumns = [];
    this.viewColumns = ViewColumns;
    this.columns = [
      {
        Name: 'inventoryType',
        isCheck: true,
        Text: 'Inventory Type',
        isDisable: true,
        index: 0,
        width: 50,
      },
      {
        Name: 'inventoryNumber',
        isCheck: true,
        Text: 'Inventory #',
        isDisable: false,
        index: 1,
        width: 50,
      },
      {
        Name: 'make',
        isCheck: false,
        Text: 'Make',
        isDisable: false,
        index: 2,
        width: 50,
      },
      {
        Name: 'model',
        isCheck: false,
        Text: 'Model',
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
        Name: 'branchname',
        isCheck: false,
        Text: 'Branch',
        isDisable: false,
        index: 5,
        width: 50,
      },
      {
        Name: 'gpNum',
        isCheck: false,
        Text: 'Global Part',
        isDisable: false,
        index: 5,
        width: 50,
      },
    ];
    this.filterGreenTag=false;
    this.filterMajorRepair=false;
    this.filterRedTag=false;
    
    this.savePreference();
    setTimeout(() => {
      this.loadItems();
    }, 700);
  }
  columnApply() {
    if (this.greenTag) this.filterGreenTag = true;
    else this.filterGreenTag = false;
    if (this.redTag) this.filterRedTag = true;
    else this.filterRedTag = false;
    if (this.majorRepairs) this.filterMajorRepair = true;
    else this.filterMajorRepair = false;
    this.savePreference();
    /// Data Filter
    this.tempId = 0;
    this.id = 0;
    this.loadItems();
    this.show = false; // !this.show;
  }
  resetGreentag() {
    this.filterGreenTag = false;
    this.greenTag = false;
  }
  resetRedtag() {
    this.filterRedTag = false;
    this.redTag = false;
  }
  resetMajorRepair() {
    this.filterMajorRepair = false;
    this.majorRepairs = false;
  }
  savePreference() {
    var usr = JSON.parse(localStorage.getItem('currentUser'));
    if (usr) {
      this.userPreferenceModel = new UserPreferenceModel();
      this.userPreferenceModel.userName = usr.userId;
      this.userPreferenceModel.id = 0;
      this.userPreferenceModel.userId = 0;
      this.userPreferenceModel.page = 'Component';
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
      this.preference.GetUserPreference('Component').subscribe((res) => {

        if (res.result) {
          var userPref = res.result.preference;
          this.viewColumns = userPref.order.filter((c) => c.isCheck == true);
          this.viewColumns.forEach((element) => {
            let col = this.columns.findIndex((c) => c.Name == element.Name);
            if (col >= 0)
              this.columns[col].isCheck = true;
          });
          this.sort = userPref.sortBy;
          this.data = {
            data: orderBy(this.viewData, this.sort),
            total: this.viewData.length,
          };
          this.viewData = this.data.data;
        } else {
          this.viewColumns.forEach((element) => {
            let col = this.columns.findIndex((c) => c.Name == element.Name);
            this.columns[col].isCheck = true;
          });
          this.editClick(this.viewData[0].inventory_PK);
        }
        if (this.data) {
          this.viewData = this.data.data;
          // if (this.filterText) this.onFilter(this.filterText);
          // else {
          if (this.id > 0) {
            this.mySelection = [this.mySelection[0]];
            this.editClick(this.tempId);
          } else {
            this.mySelection = [0];
            this.id = this.viewData[0].inventory_PK;
            this.editClick(this.id);
          }
          // if (this.tempId == 0) {
          //   this.mySelection = [0];
          //   this.id = this.viewData[0].inventory_PK;
          //   this.editClick(this.id);
          // } else {
          //   this.id = this.tempId;
          //   this.editClick(this.id);
          // }
          //}
        }
      });
    } catch (error) {
      this.viewColumns.forEach((element) => {
        let col = this.columns.findIndex((c) => c.Name == element.Name);
        this.columns[col].isCheck = true;
      });
      this.editClick(this.viewData[0].id);
    }
  }
  columnWidths: any = [];
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
  openExcel() {
    this.openedExcelDialog = !this.openedExcelDialog;
  }
  ExportData() {
    var data = {
      search: this.filterText ?? '',
      inventoryType: this.componentType ?? 'All',
      branch: this.branchCode ?? 'All',
      isActive: this.isActive,
      greenTag: this.greenTag,
      redTag: this.redTag,
      yard: this.yard,
      majorRepair: this.majorRepairs,
    };
    this.service.ExportToExcel(data).subscribe(
      (res) => {
        let data = new Blob([res], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;',
        });
        fileSaver.saveAs(
          data,
          'Component-' + new Date().toLocaleDateString('en-US') + '.xlsx'
        );
        this.openedExcelDialog = false;
      },
      (error) => this.onError(error, ErrorMessages.components.save_info)
    );
  }
  ExportReport() {
    this.service.ExportToReport().subscribe(
      (res) => {
        let data = new Blob([res], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;',
        });
        fileSaver.saveAs(
          data,
          'Component_Report-' + new Date().toLocaleDateString('en-US') + '.xlsx'
        );
        this.openedExcelDialog = false;
      },
      (error) => this.onError(error, ErrorMessages.components.save_info)
    );
  }
  showFolder: boolean;
  public onFolderToggle(): void {
    this.showFolder = !this.showFolder;
    this.toggleText = this.showFolder ? 'Hidе' : 'Show';
    setTimeout(() => {
      this.networkDirectory.loadFolderByComponent(this.serialNumner);
    }, 200);
  }
  private onError(error: any, customMessage?: string) {
    this.errorHandler.handleError(error, "Component", customMessage);
  }
}
