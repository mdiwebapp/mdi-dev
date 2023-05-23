import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  ViewColumns,
  ServiceOrderData,
  columns,
  UnitList,
  TopStatusList,
  StatusList,
} from '../../../../../data/serviceorderpage-data';
import {
  orderBy,
  process,
  SortDescriptor,
  State,
} from '@progress/kendo-data-query';
import { PaginationWithSortRequest } from 'src/app/core/models/pagination.model';
import { ErrorHandlerService, PagerService } from 'src/app/core/services';
import { ServiceOrderService } from '../service-order/service-order.service';
import { ErrorMessages, ModuleNames } from 'src/app/core/constant';
import { PageChangeEvent } from '@progress/kendo-angular-grid';

import { UtilityService } from 'src/app/core/services/utility.service';
import { UserPreferenceModel } from 'src/app/core/models/preference.model';
import { UserPreferenceService } from 'src/app/core/services/user-preference.service';
import { MenuService } from 'src/app/core/helper/menu.service';
import { ServiceOrderTabs } from 'src/app/core/models/enum-model';
import { ServiceOrderComponent } from '../service-order/service-order.component';
import { ServiceHistoryComponent } from '../service-history/service-history.component';
import { ServiceEstimateComponent } from '../service-estimate/service-estimate.component';
import { ServiceOrderNotesComponent } from '../notes/notes.component';
import { ServiceCommmonHistoryComponent } from '../history/service-history.component';
import { NetworkDirectoryComponent } from 'src/app/layout/networkdirectory/networkdirectorypage/networkdirectory.component';
import { FuelOilTechCheckComponent } from './tech-check-popup/fuel-oil/fuel-oil-techcheck.component';
import { DropdownService } from 'src/app/core/services/dropdown.service';
import * as fileSaver from 'file-saver';
import {
  fuelIolModel,
  TechCheckModel,
} from './tech-check-popup/techCheck.model';
@Component({
  selector: 'app-serviceorderpage',
  templateUrl: './serviceorderpage.component.html',
  styleUrls: ['./serviceorderpage.component.scss'],
})
export class ServiceOrderPageComponent implements OnInit {
  @ViewChild(ServiceOrderComponent) serviceOrder: ServiceOrderComponent;
  @ViewChild(ServiceHistoryComponent) serviceHistory: ServiceHistoryComponent;
  @ViewChild(ServiceEstimateComponent)
  serviceEstimate: ServiceEstimateComponent;
  @ViewChild(ServiceOrderNotesComponent)
  serviceNotes: ServiceOrderNotesComponent;
  @ViewChild(ServiceCommmonHistoryComponent)
  history: ServiceCommmonHistoryComponent;
  @ViewChild(NetworkDirectoryComponent)
  networkDirectory: NetworkDirectoryComponent;

  form: FormGroup;
  isMersino: boolean;
  isAdd: boolean = true;
  isEdit: boolean = true;
  isDisabled: boolean = true;
  isCancel: boolean = false;
  isSave: boolean = false;
  technicianData: any;
  displayTechCheckList: boolean = false;
  displaySupervisorApproval: boolean = true;
  displayTechnicianApproval: boolean = true;
  displayTechApprovalDialog: boolean = false;
  public viewColumns: any;
  columns: any;
  statusConfirm: any;
  serviceOrderData: any;
  tempData: any;
  statusList = StatusList;
  topStatusList = TopStatusList;
  customerList = [];
  branchList = [];
  unitList = UnitList;

  supervisorApprovalList = [];
  employeeList = [];
  show: boolean;
  toggleText: string;
  technicianApprovalList = [];
  displayStatusDrp: boolean = false;
  displayBranchDrp: boolean = false;
  filterTechnician: boolean = false;
  data: any;
  public pageSize = 100;
  public skip = 0;
  public totalData = 0;
  tempId: number = 0;
  id: number;
  pk: number;
  invNumber: string;
  userPreferenceModel: UserPreferenceModel;
  columnWidths: any = [];
  selectedTab = 'Service Order';
  selectedTabIndex = 0;
  tabs = ServiceOrderTabs;
  visible: boolean = false;
  isTab1: boolean = false;
  isTab2: boolean = false;
  isTab3: boolean = false;
  isTab4: boolean = false;
  isTab5: boolean = false;

  public sort: SortDescriptor[] = [
    {
      field: 'serviceNumber',
      dir: 'asc',
    },
    {
      field: 'invNumber',
      dir: 'asc',
    },
    {
      field: 'branch',
      dir: 'asc',
    },
    {
      field: 'status',
      dir: 'asc',
    },
    {
      field: 'custName',
      dir: 'asc',
    },
    {
      field: 'unit',
      dir: 'asc',
    },
  ];
  filterCollection: any = {
    branch: '',
    status: '',
    unit: '',
    mersino: true,
    searchText: '',
  };
  public mySelection: number[] = [0];
  pageSizeList: any = [
    { id: 0, value: 100 },
    { id: 0, value: 300 },
    { id: 0, value: 500 },
  ];
  branchAll = [
    {
      id: 0,
      value: 'All Branch',
      code: null,
    },
  ];
  public hiddenColumns: string[] = ['customer', 'unit'];
  techCheckType: string;
  isEditClosedOrder: boolean = false;
  closeRight: boolean = true;
  status: any;
  constructor(
    private formBuilder: FormBuilder,
    public pagerService: PagerService,
    public service: ServiceOrderService,
    public errorHandler: ErrorHandlerService,
    public menuService: MenuService,
    public dropdownservice: DropdownService,
    private utility: UtilityService,
    public preference: UserPreferenceService
  ) {
    if (localStorage.getItem('isAdmin') == 'true') {
      this.isTab1 = false;
      this.isTab2 = false;
      this.isTab3 = false;
      this.isTab4 = false;
      this.isTab5 = false;
    } else {
      let acc = this.menuService.checkUserViewRights('Maintain Service Orders');
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
      this.menuService.checkUserBySubmoduleRights('Service Order');
      const rights = JSON.parse(localStorage.getItem('Rights'));
      this.isTab1 = !rights.some(
        (c) =>
          c.subModuleName == 'Service Order' &&
          c.moduleName == 'Maintain Service Orders' &&
          c.tabName == 'VIEW'
      );
      this.isTab2 = !rights.some(
        (c) =>
          c.subModuleName == 'Service History' &&
          c.moduleName == 'Maintain Service Orders' &&
          c.tabName == 'VIEW'
      );
      this.isTab3 = !rights.some(
        (c) =>
          c.subModuleName == 'Estimate' &&
          c.moduleName == 'Maintain Service Orders' &&
          c.tabName == 'VIEW'
      );
      this.isTab4 = !rights.some(
        (c) =>
          c.subModuleName == 'Notes' &&
          c.moduleName == 'Maintain Service Orders' &&
          c.tabName == 'VIEW'
      );
      this.isTab5 = !rights.some(
        (c) =>
          c.subModuleName == 'History' &&
          c.moduleName == 'Maintain Service Orders' &&
          c.tabName == 'VIEW'
      );
      this.isEditClosedOrder = rights.some(
        (c) =>
          c.subModuleName == 'Service Order' &&
          c.moduleName == 'Maintain Service Orders' &&
          c.tabName == 'Edit Closed Order'
      );
      this.closeRight = rights.some(
        (c) =>
          c.subModuleName == 'Service Order' &&
          c.moduleName == 'Maintain Service Orders' &&
          c.tabName == 'Close'
      );
    }
  }

  ngOnInit() {
    this.pagerService.pageSize = this.pageSize;
    this.viewColumns = ViewColumns;
    this.columns = columns;
    this.serviceOrderData = ServiceOrderData;
    this.initForm();
    this.disbaleBtn();
    this.GetEmployee();
    this.loadItems();
    this.GetBranch();
  }
  GetBranch() {
    this.branchList = this.branchAll.concat(
      this.utility.storage.CurrentUser.userBranch
    );
  }
  loadItems(): void {
    var request = new PaginationWithSortRequest<any>();
    // request.start = null; //this.pagerService.start;
    // request.end = null;// this.pagerService.end;
    request.pageSize = this.pagerService.pageSize; // this.pagerService.pageSize;
    this.filterCollection.branch = this.form.value.branch ?? 'ALL';
    this.filterCollection.unit =
      this.form.value.unit == null
        ? 'ALL'
        : this.form.value.unit == 'All Units'
        ? 'ALL'
        : this.form.value.unit;
    this.filterCollection.status =
      this.form.value.status == null
        ? 'ALL'
        : this.form.value.status == 'All Status'
        ? 'ALL'
        : this.form.value.status;
    this.filterCollection.mersino = this.form.value.isMersino;

    if (this.technicianData) {
      this.filterCollection.technician = this.technicianData.eeid;
      this.filterTechnician = true;
    } else {
      this.filterCollection.technician = 0;
      this.filterTechnician = false;
    }
    request.request = this.filterCollection;
    if (this.filterCollection.searchText) {
      request.pageNumber = 0;
      this.tempId = 0;
    } else {
      this.filterCollection.status;
      request.pageNumber = this.pagerService.start;
    }
    request.sortColumn = this.sort[0].field;
    request.sortDesc = this.sort[0].dir == 'desc' ? true : false;
    if (this.isEdit == false) {
      this.id = 0;
      this.tempId = 0;
    }
    this.isAdd = false;
    this.isEdit = false;
    this.serviceOrderData = [];
    this.tempData = [];
    this.totalData = 0;
    this.visible = true;
    this.service.GetList(request).subscribe(
      (res) => {
        this.visible = false;
        if (res.data != null && res.data.length > 0) {
          this.totalData = res.totalRecords;
          this.serviceOrderData = res.data;
          this.tempData = res.data;

          this.getPreference();

          // if (this.tempId == 0) this.editClick(this.vendor[0].id);
          // else
          //   this.editClick(this.tempId);
        } else {
          this.serviceOrderData = [];
          this.editClick(0);
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.vehicle.get_list);
      }
    );
  }
  initForm(): void {
    this.form = this.formBuilder.group({
      unit: ['All Units'],
      branch: [],
      status: ['ACTIVE'],
      isMersino: [true],
      activeSite: [],
      needinvoiced: [],
      supervisorApprovalData: [],
      technicianApprovalData: [],
      showPrice: [false],
      isActiveSos: [],
      needInvoiced: [],
      customerData: [],
    });
  }
  onTechCheckList() {
    this.displayTechCheckList = !this.displayTechCheckList;
    // setTimeout(() => {
    //this.fuelOil.setData(this.id);
    // }, 500);
    localStorage.setItem('serviceNumber', this.id.toString());
    this.service.resetTechCheck();
  }
  GetEmployee() {
    this.dropdownservice.GetEmployee().subscribe(
      (res) => {
        if (res) {
          this.employeeList = res.result;
          this.serviceOrder.employeeList=this.employeeList;
          this.serviceOrder.employeeListFilter=this.employeeList;
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.employee.get_list);
      }
    );
  }
  public onToggle(): void {
    this.show = !this.show;
    this.toggleText = this.show ? 'Hidе' : 'Show';
  }
  columnApply() {
    this.savePreference();
    /// Data Filter
    this.tempId = 0;
    this.id = 0;
    this.loadItems();
    this.show = false;
  }
  resetpopup() {
    this.viewColumns = ViewColumns;
    this.columns = columns;
    this.savePreference();
    setTimeout(() => {
      this.loadItems();
    }, 700);
  }
  closepopup() {
    this.show = !this.show;
    this.toggleText = this.show ? 'Hidе' : 'Show';
  }
  changeCustomer($event: any) {}
  onTechnicianApproval() {
    this.displayTechnicianApproval = !this.displayTechnicianApproval;
  }
  onSupervisorApproval() {
    this.displaySupervisorApproval = !this.displaySupervisorApproval;
  }
  onTechApproval() {
    this.displayTechApprovalDialog = !this.displayTechApprovalDialog;
  }
  closeTech(status) {
    if (status == 'OK') {
      this.displayTechApprovalDialog = !this.displayTechApprovalDialog;
    } else {
      this.displayTechApprovalDialog = !this.displayTechApprovalDialog;
    }
  }
  onStatus() {
    this.displayStatusDrp = !this.displayStatusDrp;
  }
  onBranch() {
    this.displayBranchDrp = !this.displayBranchDrp;
  }
  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    // this.data = {
    //   data: orderBy(this.tempData, this.sort),
    //   total: this.tempData.length,
    // };
    // this.serviceOrderData = this.data.data;
    // this.mySelection = [0];
    // this.id = this.serviceOrderData[0].serviceNumber;
    this.savePreference();
    this.loadItems();
  }
  public onPageChange(e: PageChangeEvent): void {
    this.skip = e.skip;
    this.pageSize = e.take;
    this.pagerService.start = this.skip == 0 ? 0 : this.skip / this.pageSize;
    // this.filterCollection.pageSize = this.pageSize;
    // this.tempPageNo = this.pagerService.start;

    this.loadItems();
  }

  savePreference() {
    var usr = JSON.parse(localStorage.getItem('currentUser'));
    if (usr) {
      this.userPreferenceModel = new UserPreferenceModel();
      this.userPreferenceModel.userName = usr.userId;
      this.userPreferenceModel.id = 0;
      this.userPreferenceModel.userId = 0;
      this.userPreferenceModel.page = 'ServiceOrder';
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
  }
  getPreference() {
    try {
      this.preference.GetUserPreference('ServiceOrder').subscribe(
        (res) => {
          if (res.result) {
            var userPref = res.result.preference;
            this.viewColumns = userPref.order.filter((c) => c.isCheck == true);
            this.viewColumns.forEach((element) => {
              let col = this.columns.findIndex((c) => c.Name == element.Name);
              this.columns[col].isCheck = true;
            });
            this.sort = userPref.sortBy;
            this.data = {
              data: orderBy(this.serviceOrderData, this.sort),
              total: this.serviceOrderData.length,
            };
            this.serviceOrderData = this.data.data;
          } else {
            this.viewColumns.forEach((element) => {
              let col = this.columns.findIndex((c) => c.Name == element.Name);
              this.columns[col].isCheck = true;
            });
          }

          if (this.filterCollection.filterText) {
            //this.onFilter(this.filterText);
          } else {
            if (this.tempId == 0) {
              this.mySelection = [0];
              this.id = this.serviceOrderData[0].serviceNumber;
              this.pk = this.serviceOrderData[0].pk;
              this.status = this.serviceOrderData[0].status;
              this.statusConfirm = this.serviceOrderData[0].status;
              this.invNumber = this.serviceOrderData[0].invNumber;
              if (this.serviceOrderData[0].invType.includes('GN')) {
                this.service.blGen = true;
              } else {
                this.service.blGen = false;
              }
              if (this.id != 0) {
                this.editClick(this.id);
                this.getTechCheckType(this.invNumber);
                this.utility.vensendClickEvent(
                  this.invNumber + '_' + this.serviceOrderData[0].branch
                );
              }
            } else {
              this.id = this.tempId;
              if (this.id != 0) this.editClick(this.id);
            }
          }
        },
        (error) => {
          if (this.tempId == 0) {
            this.mySelection = [0];
            this.id = this.serviceOrderData[0].serviceNumber;
            this.pk = this.serviceOrderData[0].pk;
            this.status = this.serviceOrderData[0].status;
            this.statusConfirm = this.serviceOrderData[0].status;
            this.invNumber = this.serviceOrderData[0].invNumber;
            if (this.serviceOrderData[0].invType.includes('GN')) {
              this.service.blGen = true;
            } else {
              this.service.blGen = false;
            }
            if (this.id != 0) {
              this.editClick(this.id);
              this.getTechCheckType(this.invNumber);
              this.utility.vensendClickEvent(
                this.invNumber + '_' + this.serviceOrderData[0].branch
              );
            }
          } else {
            this.id = this.tempId;
            if (this.id != 0) this.editClick(this.id);
          }
        }
      );
    } catch (error) {
      this.viewColumns.forEach((element) => {
        let col = this.columns.findIndex((c) => c.Name == element.Name);
        this.columns[col].isCheck = true;
      });
      this.editClick(this.serviceOrderData[0].id);
    }
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
  public onTabSelect(e) {
    this.selectedTab = e.title;
    if (this.pk != 0) this.editClick(this.id);
    if (this.selectedTab == this.tabs.tab1) {
      this.isAdd = false;
      this.menuService.checkUserBySubmoduleRights('Service Order');
    } else if (this.selectedTab == this.tabs.tab4) {
      this.isAdd = true;
      this.menuService.checkUserBySubmoduleRights('Notes');
    }
  }
  editRowClick(data: any) {
    this.pk = data.pk;
    this.service.techcheckType = 'CheckList';
    this.status = data.status;
    if (data.invType.includes('GN')) {
      this.service.blGen = true;
    } else {
      this.service.blGen = false;
    }
    this.invNumber = data.invNumber;
    this.statusConfirm = data.status;
    if (this.pk != 0) this.editClick(data.serviceNumber);
    this.getTechCheckType(data.invNumber);
    this.utility.vensendClickEvent(this.invNumber + '_' + data.branch);
  }
  editClick(id: number) {
    this.id = id;
    this.tempId = id;
    this.disbaleBtn();
    this.isCancel = true;
    this.isSave = true;
    if (this.selectedTab == this.tabs.tab1) {
      this.isAdd = false;
      this.isEdit = false;
      setTimeout(() => {
        this.serviceOrder.onEdit(this.id);
      }, 500);
    }
    if (this.selectedTab == this.tabs.tab2) {
      this.isAdd = true;
      this.isEdit = true;
      setTimeout(() => {
        this.serviceHistory.serviceHistoryList(this.invNumber);
      }, 500);
    }
    if (this.selectedTab == this.tabs.tab3) {
      this.isAdd = true;
      this.isEdit = false;
      setTimeout(() => {
        this.serviceEstimate.loadEstimateData(this.id);
      }, 500);
    }
    if (this.selectedTab == this.tabs.tab4) {
      this.isAdd = true;
      this.isEdit = true;
      setTimeout(() => {
        this.serviceNotes.onEdit(this.pk, this.invNumber);
      }, 500);
    }
    if (this.selectedTab == this.tabs.tab5) {
      this.isAdd = true;
      this.isEdit = true;
      setTimeout(() => {
        this.history.historyList(this.pk);
      }, 500);
    }
  }
  btnAdd() {
    this.enableBtn();
    this.isEdit = true;
    this.isAdd = true;
    //this.tempId = this.id;
    this.id = 0;
    this.statusConfirm = 'ACTIVE';
    //this.inactive = true;
    if (this.selectedTab == this.tabs.tab1) {
      this.serviceOrder.btnAdd();
    }
    if (this.selectedTab == this.tabs.tab3) {
      this.serviceEstimate.btnAdd();
    }
  }
  btnEdit() {
    if (this.filterCollection.status == 'CLOSED' && !this.isEditClosedOrder) {
      this.utility.toast.error(
        'You do not have permissions to access this part of the system. Please contact your supervisor so they can request them from IT.'
      );
    } else {
      this.enableBtn();
      this.isEdit = true;
      this.isAdd = true;
      this.tempId = this.id;
      this.isDisabled = false;
      if (this.selectedTab == this.tabs.tab1) {
        this.serviceOrder.btnEdit();
      }
      if (this.selectedTab == this.tabs.tab3) {
        this.serviceEstimate.btnEdit();
      }
    }
  }
  btnCancel() {
    this.isEdit = false;
    this.isCancel = true;
    this.isAdd = false;
    this.isSave = true;
    this.isDisabled = true;
    this.disbaleBtn(); //this.isDisabled = true;
    if (this.pk != 0) this.editClick(this.tempId);
  }
  onSave() {
    if (this.selectedTab == this.tabs.tab1) {
      this.disbaleBtn();
      if (this.closeRight == false && this.statusConfirm == 'CLOSED') {
        this.utility.toast.error(
          'You do not have permissions to close service order. Please contact your supervisor so they can request them from IT.'
        );
        this.enableBtn();
        return;
      } else {
        var saveStatus = this.serviceOrder.onSave(this.statusConfirm);
        if (saveStatus === false) {
          this.enableBtn();
        }
      }
      setTimeout(() => {
        if (saveStatus == false) {
          return false;
        }
        if (this.filterCollection.status == 'CLOSED') {
          this.id = 0;
          this.tempId = 0;
        }
        this.loadItems();
      }, 1500);
    }
    if (this.selectedTab == this.tabs.tab3) {
      // this.isAdd = false;
      // this.isEdit = false;
      //this.disbaleBtn();
      var isSaved = this.serviceEstimate.onSave(this.id);
      if (isSaved == false) {
        this.isCancel = false;
        this.isSave = false;
        this.isAdd = true;
        this.isEdit = true;
      } else {
        this.isCancel = true;
        this.isSave = true;
        this.isAdd = false;
        this.isEdit = false;
        // setTimeout(() => {
        //   this.serviceEstimate.loadEstimateData(this.id);
        // }, 500);
      }
    }
  }
  enableBtn() {
    this.isSave = false;
    this.isCancel = false;
  }

  disbaleBtn() {
    this.isSave = true;
    this.isCancel = true;
  }

  showFolder: boolean;
  public onFolderToggle(): void {
    this.showFolder = !this.showFolder;
    this.toggleText = this.showFolder ? 'Hidе' : 'Show';
    setTimeout(() => {
      this.networkDirectory.loadFolderByServiceOrder(this.id);
    }, 200);
  }
  btnCancelTech(isClose) {
    this.displayTechCheckList = false;
    localStorage.setItem('serviceNumber', this.id.toString());
    this.service.resetTechCheck();
  }
  // onSaveTech() {
  //   this.fuelOil.onSave(this.id);
  // }
  getTechCheckType(invNo) {
    //if (invNo && invType) {
    this.service.GetTechCheckType(invNo).subscribe(
      (res) => {
        this.techCheckType = res.result;
        this.service.techcheckType = this.techCheckType;
      },
      (error) => {
        this.onError(error, ErrorMessages.vehicle.get_list);
      }
    );
    //}
  }
  downloadFile() {
    this.service.downloadData(this.id).subscribe(
      (res) => {
        let data = new Blob([res], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;',
        });
        fileSaver.saveAs(data, 'ServiceOrder_Info.xlsx');
      },
      (error) => this.onError(error, ErrorMessages.parts.download_part_data)
    );
  }
  downloadInvoice() {
    this.service.downloadInvoice(this.id).subscribe(
      (res) => {
        let data = new Blob([res], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;',
        });
        fileSaver.saveAs(data, 'ServiceOrder_Invoice.xlsx');
      },
      (error) => this.onError(error, ErrorMessages.parts.download_part_data)
    );
  }
  downloadEstimateInvoice() {
    this.service.downloadEstimateInvoice(this.id).subscribe(
      (res) => {
        let data = new Blob([res], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;',
        });
        fileSaver.saveAs(data, 'ServiceOrder_EstimateInvoice.xlsx');
      },
      (error) =>
        this.onError('Estimate', ErrorMessages.parts.download_part_data)
    );
  }
  resetTechnician() {
    this.technicianData = null;
  }
  parentEventHandlerFunction(valueEmitted) {
    // valueEmitted;
    this.onTechCheckList();
  }
  openedExcelDialog: boolean = false;
  openExcel() {
    this.openedExcelDialog = !this.openedExcelDialog;
  }
  downloadUnitInfo() {
    this.service.ExportToExcelFleetView(this.invNumber).subscribe(
      (res) => {
        let data = new Blob([res], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;',
        });
        fileSaver.saveAs(data, 'InventoryInformationReport.xlsx');
      },
      (error) => {
        this.onError(error, ErrorMessages.fleet.download_fleet_data);
      }
    );
  }
  onComponentSwap() {
    localStorage.setItem('InvNumber', this.invNumber);

    window.open('/componentswap', '_blank');
  }
  private onError(error: any, customMessage?: string) {
    if (error == 'Estimate') {
      this.utility.toast.error('Estimate Service Order does not exist');
    } else {
      this.errorHandler.handleError(error, 'Service Order', error.error);
    }
  }
}
