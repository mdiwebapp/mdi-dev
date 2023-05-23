import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService, PagerService } from 'src/app/core/services';
import { orderBy, SortDescriptor } from '@progress/kendo-data-query';
import { DropdownService } from 'src/app/core/services/dropdown.service';
import {
  columns as callLogsColumns,
  usersData,
} from '../../../../../data/call-logs-data';
import { PageChangeEvent } from '@progress/kendo-angular-grid';
import { UtilityService } from 'src/app/core/services/utility.service';
import {
  textboxHiddenIcon,
  thumbnailsLeftIcon,
} from '@progress/kendo-svg-icons';
import { ResetPasswordComponent } from 'src/app/auth/reset-password/reset-password.component';
import { find } from 'rxjs/operators';
import { MenuService } from 'src/app/core/helper/menu.service';

@Component({
  selector: 'app-call-log',
  templateUrl: './call-log.component.html',
  styleUrls: ['./call-log.component.scss'],
})
export class CallLogComponent implements OnInit {
  isConfirmationDialog: boolean = false;
  selectedEmployee: any;
  webContactForm: FormGroup;
  webGlobalPumpForm: FormGroup;
  rfqCenterRequestForm: FormGroup;
  rfqCenterRequestPumpQuoteForm: FormGroup;
  resolutionForm: FormGroup;
  userForm: FormGroup;
  disable: boolean = true;
  selectedTab: string = 'Call Log';
  data: any = [];
  tempId: any;
  isClose: boolean = false;
  // skip: number = 0;

  calllog: any = [];
  sort: SortDescriptor[] = [
    {
      field: 'assignedTo',
      dir: 'asc',
    },
  ];
  selections: any = [0];
  collactionOfValue :any;
  visible: boolean = false;
  columns: any = callLogsColumns;
  totalLogs: number = 0;
  logUsers: any = [];
  activeTab: string = 'call_log';
  isCallLogTab: boolean = false;
  isResolutionTab: boolean = false;
  filterForm: FormGroup;
  logsByUsers: any = usersData;
  logs_by_filter_btn: string = 'All';
  employee_filter_btn: string = 'All';
  branch_filter_btn: string = 'All';
  status_filter_btn: string = 'All';
  isLogVisible: boolean = false;
  isEmployeeVisible: boolean = false;
  isBranchVisible: boolean = false;
  isStatusVisible: boolean = false;
  multiple: boolean = false;
  logs: any = [];
  allEmployees: any = [];
  employees: any = [];
  allBranches: any = [];
  branches: any = [];
  emp_btn: string = 'Select Employee';
  isAlertDialog: boolean = false;
  alertTitle: string = '';
  alertMessage: string = '';
  statuses: any = [];
  adminSort: SortDescriptor[] = [];
  selectedAdminCalllog: any = null;
  selectedCallLog: any = null;
  selectedResolution: any = null;
  isSaveResolution: boolean = false;
  isSaveCallLogs: boolean = false;
  statusData: any = [
    {
      label: 'All',
      value: 'All',
    },
    {
      label: 'Closed',
      value: 'Closed',
    },
    {
      label: 'Open',
      value: 'Open',
    },
  ];
  isAddble: boolean = false;
  isEditable: boolean = false;
  formsTypes: string[] = [
    'MDIWEBIMPORT',
    'MDIWEBIMPORT4',
    'MDIWEBRFQCRIMPORT2',
    'MDIWEBRFQPQIMPORT',
  ];
  public extraEmployees = [
    {
      eeid: 99999,
      email: '',
      emergencyContact: '',
      emergencyPhone: '',
      homePhone: '',
      id: 99999,
      name: 'ap@mersino.com',
      value: 'ap@mersino.com',
    },
    {
      eeid: 99998,
      email: '',
      emergencyContact: '',
      emergencyPhone: '',
      homePhone: '',
      id: 99998,
      name: 'ar@mersino.com',
      value: 'ar@mersino.com',
    },
    {
      eeid: 99997,
      email: '',
      emergencyContact: '',
      emergencyPhone: '',
      homePhone: '',
      id: 99997,
      name: 'hr@mersino.com',
      value: 'hr@mersino.com',
    },
    {
      eeid: 99996,
      email: '',
      emergencyContact: '',
      emergencyPhone: '',
      homePhone: '',
      id: 99996,
      name: 'partssale@mersino.com',
      value: 'partssale@mersino.com',
    },
    {
      eeid: 99995,
      email: '',
      emergencyContact: '',
      emergencyPhone: '',
      homePhone: '',
      id: 99995,
      name: 'repairs@mersino.com',
      value: 'repairs@mersino.com',
    },
  ];

  public pageSize = 100;
  public pageNumber = 1;
  public skip = 0;
  public currentPage = 1;
  public totalData = 0;
  pageSizeList: any = [
    { id: 0, value: 100 },
    { id: 1, value: 300 },
    { id: 2, value: 500 },
  ];
  filterCollection: any = {
    id: 0,
    status: 1,
  };
  tempPageNo: number;
  form: FormGroup;
  isLoading: boolean = false;
  states: any = [];
  selectedLogBy: string = '';
  disableCallLogTab: boolean = false;
  disableResolutionTab: boolean = false;
  confirm_title: string = '';
  confirm_message: string = '';
  isConfirmDialogVisible: boolean = false;
  formCustomValidation: any = {
    assignTo: false,
    cC1: false,
    cC2: false,
    cC3: false,
    cC4: false,
  };
  isTab1: boolean = false;
  isTab2: boolean = false;
  logId: any;
  selectedEmployeeName: string = '';
  constructor(
    private formBuilder: FormBuilder,
    private dropdownService: DropdownService,
    private dataService: DataService,
    public pagerService: PagerService,
    private utilityService: UtilityService,
    public menuService: MenuService
  ) {
    if (localStorage.getItem('isAdmin') == 'true') {
      this.isTab1 = false;
      this.isTab2 = false;
    } else {
      let acc = this.menuService.checkUserViewRights('Call Log');
      if (acc) {
        //this.utils.toast.error("User does not have rights to access " + name + " module.");Z
      } else {
        this.utilityService.toast.error(
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
      this.menuService.checkUserBySubmoduleRights('Call Log');
      const rights = JSON.parse(localStorage.getItem('Rights'));
      this.isTab1 = !rights?.some(
        (c) =>
          c.subModuleName == 'Call Log' &&
          c.moduleName == 'Call Log' &&
          c.tabName == 'VIEW'
      );
      this.isTab2 = !rights?.some(
        (c) =>
          c.subModuleName == 'Resolution' &&
          c.moduleName == 'Call Log' &&
          c.tabName == 'VIEW'
      );
    }
  }

  ngOnInit(): void {
    this.onLoadStates();
    this.onInitWebContactForm({});
    this.onInitWebGlobalPumpForm({});
    this.onInitRfqCenterRequestForm({});
    this.onInitRfqCenterRequestpumpQuoteForm({});
    this.onIntiResolutionForm({});
    this.onInitUserForm({});
    this.OnInitFilterForm();
    this.onLoadEmployee();
    this.onLoadBranch();
    this.onLoadAdminCalllog();
    this.onLoadLogBy();
  }
  onResizeColumn(event) {}

  onSelectionChange(event) {
    this.selectedCallLog = event.selectedRows[0].dataItem;

    if (this.selectedCallLog.resolutionFK == null) {
      this.selectedCallLog.resolutionFK = 0;
    }
    this.selectedCallLog.logId = event.selectedRows[0].dataItem.logId;
    this.onInitForm(event.selectedRows[0].dataItem);
    this.onLoadAdminDetails();
    this.onLoadResolutionDetails();
  }

  onSortChange(sort: SortDescriptor[]) {
    this.adminSort = sort;
    this.data = orderBy(this.data, sort);
  }

  onReOrderColumns(event) {}

  onDataStateChange(event) {}

  onToggleFilter() {
    this.visible = !this.visible;
  }

  onFilterData(value) {}

  onTabChange(event) {
    this.selectedTab = event.title;
    if (this.selectedTab == 'Resolution') {
      const rights = JSON.parse(localStorage.getItem('Rights'));
      this.menuService.isEditRight = rights.some(
        (c) =>
          c.subModuleName == 'Resolution' &&
          c.moduleName == 'Call Log' &&
          c.tabName == 'EDIT'
      );
    } else {
    }
  }

  onInitForm(value) {
    this.collactionOfValue = value;
    if (value?.logBy === 'MDIWEBIMPORT') {
      this.onInitWebContactForm(value);
    } else if (value?.logBy === 'MDIWEBIMPORT4') {
      this.onInitWebGlobalPumpForm(value);
    } else if (value?.logBy === 'MDIWEBRFQCRIMPORT2') {
      this.onInitRfqCenterRequestForm(value);
    } else if (value?.logBy === 'MDIWEBRFQPQIMPORT') {
      this.onInitRfqCenterRequestpumpQuoteForm(value);
    } else {
      this.onInitUserForm(value);
    }
  }

  onInitWebContactForm(value) {
    this.webContactForm = this.formBuilder.group({
      contactID: value?.contactForm?.contactID || '',
      name: value?.firstForm?.contact || '',
      phone: value?.phone || '',
      company: value?.company || '',
      oPhone: value?.oPhone || '',
      city: value?.city || '',
      state: value?.state || '',
      country: value?.country || '',
      county: value?.county || '',
      note: value?.note || '',
      assignTo: this.getEmployee(value?.assignTo) || '',
      emailSent: value?.emailSent || false,
    });
  }

  onInitWebGlobalPumpForm(value) {
    this.webGlobalPumpForm = this.formBuilder.group({
      name: value?.name || '',
      phone: value?.phone || '',
      oPhone: value?.oPhone || '',
      company: value?.company || '',
      city: value?.city || '',
      state: value?.state || '',
      country: value?.country || '',
      county: value?.county || '',
      note: value?.note || '',
      assignTo: this.getEmployee(value?.assignTo) || '',
      emailSent: value?.emailSent || false,
    });
  }

  onInitRfqCenterRequestForm(value) {
    this.rfqCenterRequestForm = this.formBuilder.group({
      name: value?.name || '',
      title: value?.title || '',
      company: value?.company || '',
      phone: value?.phone || '',
      oPhone: value?.oPhone || '',
      address: value?.address || '',
      city: value?.city || '',
      state: value?.state || '',
      country: value?.country || '',
      projectTitle: value?.projectTitle || '',
      descProject: value?.descProject || '',
      bidDate: value?.centerRequest?.bidDate || '',
      anticStartDate: value?.centerRequest?.anticStartDate || '',
      dpDistance: value?.centerRequest?.dpDistance || '',
      doeMeasure1: value?.centerRequest?.doeMeasure1 || '',
      doeMeasure2: value?.centerRequest?.doeMeasure2 || '',
      doeMeasure3: value?.centerRequest?.doeMeasure3 || '',
      doeMeasure4: value?.centerRequest?.doeMeasure4 || '',
      elecAvail: value?.centerRequest?.elecAvail || false,
      elecLocation: value?.centerRequest?.elecLocation || '',
      elecServiceType: value?.centerRequest?.elecServiceType || '',
      erSystem: value?.centerRequest?.erSystem || false,
      ersType: value?.centerRequest?.ersType || '',
      exUObstructions: value?.centerRequest?.exUObstructions || false,
      exULocations: value?.centerRequest?.exULocations || '',
      excavationSketch: value?.centerRequest?.excavationSketch || false,
      gwDepth: value?.centerRequest?.gwDepth || '',
      ocipccip: value?.centerRequest?.ocipccip || false,
      prevailingWage: value?.centerRequest?.prevailingWage || false,
      sbType: value?.centerRequest?.sbType || '',
      soilBoring: value?.centerRequest?.soilBoring || false,
      unionLocation: value?.centerRequest?.unionLocation || '',
      waterSupplyAvail: value?.centerRequest?.waterSupplyAvail || false,
      wsLocation: value?.centerRequest?.wsLocation || '',
      wsSource: value?.centerRequest?.wsSource || '',
      sendemail: value?.sendemail || false,
      assignTo: this.getEmployee(value?.assignTo) || '',
    });
  }

  onInitRfqCenterRequestpumpQuoteForm(value) {
    this.rfqCenterRequestPumpQuoteForm = this.formBuilder.group({
      name: value?.name || '',
      title: value?.title || '',
      company: value?.company || '',
      address: value?.address || '',
      city: value?.city || '',
      state: value?.state || '',
      country: value?.country || '',
      phone: value?.phone || '',
      oPhone: value?.oPhone || '',
      cellphone: value?.cellphone || '',
      projectTitle: value?.projectTitle || '',
      descProject: value?.descProject || '',
      suctionLift: value?.suctionLift || '',
      totaldynamic: value?.totaldynamic || '',
      lowfat: value?.lowfat || '',
      productpump: value?.productpump || '',
      temperature: value?.temperature || '',
      additionalperInfo: value?.additionalperInfo || '',
      emailSent: value?.emailSent || false,
      assignTo: this.getEmployee(value?.assignTo) || '',
      highFlowRate: value?.highFlowRate || '',
      lowFlowRate: value?.lowFlowRate || '',
    });
  }

  onIntiResolutionForm(value) {
    this.resolutionForm = this.formBuilder.group({
      reassignedTo: value?.reassignedTo || '',
      logId: value?.logId || '',
      completedDate: value?.completedDate ? new Date(value?.completedDate) : '',
      completedBy: value?.completedBy || '',
      jobNumber: [
        value?.jobNumber || '',
        [Validators.pattern(/^-?(0|[1-9]\d*)?$/)],
      ],
      spokeTo: value?.spokeTo || '',
      callType: value?.callType || '',
      comments: value?.comments || '',
      closed: value?.closed || false,
      noActionRequired: value?.noActionRequired || '',
      noActionReason: value?.noActionReason || '',
      sendemail: value?.sendemail || false,
    });
  }

  onInitUserForm(value) {
    this.userForm = this.formBuilder.group({
      assignTo: [this.getEmployee(value?.assignTo) || '', Validators.required],
      cC1: [this.getEmployee(Number(value?.firstForm?.cC1)) || ''],
      cC2: [this.getEmployee(Number(value?.firstForm?.cC2)) || ''],
      cC3: [this.getEmployee(Number(value?.firstForm?.cC3)) || ''],
      cC4: [this.getEmployee(Number(value?.firstForm?.cC4)) || ''],
      company: [value?.company || '', Validators.required],
      callerType: [value?.firstForm?.callerType || '', Validators.required],
      contact: [value?.firstForm?.contact || '', Validators.required],
      note: [value?.note || '', Validators.required],
      phone: [value?.phone || '', Validators.required],
      state: [value?.state || '', Validators.required],
      emailSent: value?.emailSent || false,
      phoneCC1 : [value?.firstForm?.phoneCC1 || ''],
      phoneCC2 : [value?.firstForm?.phoneCC2 || ''],
      phoneCC3 : [value?.firstForm?.phoneCC3 || ''],
      phoneCC4 : [value?.firstForm?.phoneCC4 || ''],
      assignToPhone :[ value?.assignToPhone || '']
    });
  }

  OnInitFilterForm() {
    this.filterForm = this.formBuilder.group({
      branch: '',
      status: '',
      logBy: '',
      employee: '',
      searchText: '',
      branchName: '',
    });
  }

  onLoadEmployee() {
    this.dropdownService.GetEmployee().subscribe((result) => {
      this.employees = this.allEmployees = [
        { id: 'All', value: 'All' },
        ...result.result,
      ];
      let mainEmployeeGird = this.allEmployees;
      let extraEmployees = this.extraEmployees;
      for (let i = 0; i < extraEmployees.length; i++) {
        let payload = {
          eeid: extraEmployees[i].eeid,
          email: extraEmployees[i].email,
          emergencyContact: extraEmployees[i].emergencyContact,
          emergencyPhone: extraEmployees[i].emergencyPhone,
          homePhone: extraEmployees[i].homePhone,
          id: extraEmployees[i].id,
          name: extraEmployees[i].name,
          value: extraEmployees[i].value,
        };
        mainEmployeeGird.push(payload);
      }
      this.allEmployees = mainEmployeeGird;
    });
  }

  onLoadBranch() {
    this.dropdownService.GetBranchList().subscribe((result) => {
      this.branches = this.allBranches = [
        { code: 'All', value: 'All' },
        ...result,
      ];
    });
  }

  onLoadLogBy() {
    this.dataService
      .get('DropDown/AdminCallLog/LogBy')
      .subscribe((result: any) => {
        if (result?.length) {
          this.logs = result;
        } else {
          this.logs = [];
        }
      });
  }

  onLoadAdminCalllog() {
    this.isLoading = true;
    this.dataService
      .post('AdminCallLog/List', {
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
        sortColumn: '',
        sortDesc: true,
        request: {
          ...this.filterForm.value,
          status: this.filterForm.get('status')?.value
            ? this.filterForm.get('status')?.value
            : 'ALL',
          branch: this.filterForm.get('branch')?.value
            ? this.filterForm.get('branch')?.value
            : 'ALL',
          employee: this.filterForm.get('employee')?.value
            ? this.filterForm.get('employee')?.value
            : 'ALL',
        },
      })
      .subscribe((result: any) => {
        if (result?.data) {
          this.data = result.data;
          this.totalLogs = result.totalRecords;
          this.selectedCallLog = result?.data?.[0];
          if (this.selectedCallLog.resolutionFK == null) {
            this.selectedCallLog.resolutionFK = 0;
          }
          this.selections = [0];
          this.onLoadAdminDetails();
          this.onLoadResolutionDetails();
          this.isLoading = false;
        } else {
          this.data = [];
          this.totalLogs = 0;
          this.selectedCallLog = null;
          this.selections = [];
          this.isLoading = false;
          this.onInitForm({ logBy: this.selectedLogBy });
          this.onIntiResolutionForm({});
        }
      });

    this.formCustomValidation = {
      assignTo: false,
      cC1: false,
      cC2: false,
      cC3: false,
      cC4: false,
    };
  }

  onLoadAdminDetails() {
    this.dataService
      .get(`AdminCalllog/Details/${this.selectedCallLog?.logId}`)
      .subscribe((res: any) => {
        if (res?.result) {
          this.selectedAdminCalllog = res?.result;
          this.selectedLogBy = res?.result?.logBy;
          this.onInitForm(res?.result);
        }
      });
  }

  onLoadResolutionDetails() {
    if (
      this.selectedCallLog?.resolutionFK ||
      this.selectedCallLog?.resolutionFK != 0
    ) {
      this.dataService
        .get(
          `AdminCallLog/Resolution/Details/${this.selectedCallLog?.resolutionFK}`
        )
        .subscribe((res: any) => {
          if (res?.result) {
            this.selectedResolution = res?.result;
            this.onIntiResolutionForm(res?.result);
            this.getEmployeeNameById(res?.result?.reassignedTo);
            this.isLoading = false;
          }
        });
    } else {
      if (this.selectedCallLog.forEmployee > 0) {
        this.getEmployeeNameById(this.selectedCallLog.forEmployee);
      }
      //this.resolutionForm.reset();
      this.resolutionForm = this.formBuilder.group({
        reassignedTo: this.selectedCallLog.forEmployee,
        logId: '',
        completedDate: new Date(),
        completedBy: '',
        jobNumber: ['', [Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
        spokeTo: '',
        callType: '',
        comments: '',
        closed: false,
        noActionRequired: '',
        noActionReason: '',
        sendemail: false,
      });
    }
  }

  onHandleFilters(value) {
    switch (value) {
      case 'logBy':
        this.isLogVisible = !this.isLogVisible;
        break;
      case 'employees':
        this.isEmployeeVisible = !this.isEmployeeVisible;
        break;
      case 'branch':
        this.isBranchVisible = !this.isBranchVisible;
        break;
      case 'status':
        this.isStatusVisible = !this.isStatusVisible;
        break;
      default:
        break;
    }
  }

  onRowSelect(event, type) {
    switch (type) {
      case 'logs':
        this.logs_by_filter_btn = event.selectedRows?.[0]?.dataItem.name;
        this.isLogVisible = false;
        break;
      case 'employees':
        this.employee_filter_btn = event.selectedRows?.[0]?.dataItem.name;
        this.isEmployeeVisible = false;
      case 'branch':
        this.branch_filter_btn = event.selectedRows?.[0]?.dataItem.name;
        this.isBranchVisible = false;
      case 'status':
        this.status_filter_btn =
          event.selectedRows?.[0]?.dataItem.status.split(':')[1];
        this.isStatusVisible = false;
      default:
        break;
    }
  }

  onCancel() {
    this.onInitForm(this.collactionOfValue);
    this.selectedLogBy = this.data[this.selections[0]]?.logBy;
    this.selectedCallLog = this.data[this.selections[0]];
    this.disable = true;
    if (this.selectedTab == 'Call Log') {
      this.disableResolutionTab = false;
    } else if (this.selectedTab == 'Resolution') {
      this.disableCallLogTab = false;
    }
  }

  onSave() {
    this.onInitForm(this.data[this.selections[0]]);
    this.selectedLogBy = this.data[this.selections[0]]?.logBy;
    this.selectedCallLog = this.data[this.selections[0]];
    this.disable = true;
    if (this.selectedTab == 'Call Log') {
      this.disableResolutionTab = false;
    } else if (this.selectedTab == 'Resolution') {
      this.disableCallLogTab = false;
    }
  }

  onAdd() {
    // if (this.selectedLogBy === 'MDIWEBIMPORT') {
    //   this.onInitWebContactForm({});
    // } else if (this.selectedLogBy === 'MDIWEBIMPORT4') {
    //   this.onInitWebGlobalPumpForm({});
    // } else if (this.selectedLogBy === 'MDIWEBRFQCRIMPORT2') {
    //   this.onInitRfqCenterRequestForm({});
    // } else if (this.selectedLogBy === 'MDIWEBRFQPQIMPORT') {
    //   this.onInitRfqCenterRequestpumpQuoteForm({});
    // } else {
    this.selectedLogBy = '';
    this.selectedCallLog = null;
    this.onInitUserForm({});
    // }
    if (this.selectedTab == 'Call Log') {
      this.disableResolutionTab = true;
    } else if (this.selectedTab == 'Resolution') {
      this.disableCallLogTab = true;
    }
    this.disable = false;
  }

  onEdit() {
    this.disable = false;
    if (this.selectedTab == 'Call Log') {
      this.disableResolutionTab = true;
      this.disable = true;
    } else if (this.selectedTab == 'Resolution') {
      this.disableCallLogTab = true;
    }
  }

  public onPageChange(e: PageChangeEvent): void {
    (this.skip = e.skip), (this.pageSize = e.take);
    this.pageNumber = e.skip / 100 + 1;
    this.onLoadAdminCalllog();
  }

  onPageSizechange(pagesize) {
    this.pageSize = pagesize;
    this.onLoadAdminCalllog();
  }

  onValueChange(type, event) {
    switch (type) {
      case 'logBy':
        this.isLogVisible = !this.isLogVisible;
        break;
      case 'employee':
        this.isEmployeeVisible = !this.isEmployeeVisible;
        break;

      case 'branch':
        let selectedBranch = this.branches.find((item) => item.code === event);
        this.filterForm.setValue({
          ...this.filterForm.value,
          branchName: selectedBranch?.value || '',
        });
        this.isBranchVisible = !this.isBranchVisible;
        break;
      case 'status':
        this.isStatusVisible = !this.isStatusVisible;
        break;
      default:
        break;
    }
    this.onLoadAdminCalllog();
  }

  getEmployee(id) {
    return this.allEmployees.find((item) => item?.id === id);
  }

  getEmployeeNameById(id) {
    let empName = this.allEmployees.find((i) => i.id == id);

    if (id !== undefined) {
      this.selectedEmployeeName = empName?.name;
      return this.selectedEmployeeName;
    }
  }

  onLoadStates() {
    this.dropdownService.GetLookupList('States').subscribe((result) => {
      if (result?.length) {
        this.states = result;
      } else {
        this.states = [];
      }
    });
  }

  onSaveData() {
    if (this.selectedTab === 'Call Log') {
      let payload = this.userForm.value;
      for (const [key, value] of Object.entries(payload)) {
        if (Object.keys(this.formCustomValidation).includes(key)) {
          if (!value) {
            this.formCustomValidation[key] = true;
          } else {
            this.formCustomValidation[key] = false;
          }
        }
      }
      if (this.userForm.valid) {
        this.onSaveLogs();
      } else {
        this.userForm.markAllAsTouched();
      }
    } else {
      let resolution = this.resolutionForm.value;
      if (resolution?.noActionRequired && !resolution?.noActionReason) {
        this.alertTitle = 'Save Cancelled';
        this.alertMessage = 'Reason required no action field';
        this.isAlertDialog = true;
      } else if (resolution?.closed == false) {
        this.isConfirmationDialog = true;
      }
    }
    this.disableCallLogTab = false;
  }

  onSaveLogs() {
    let formPayload = null;
    formPayload = this.userForm.value;
    let payload = {
      id: 0,
      userName: JSON.parse(this.utilityService.storage.getItem('currentUser'))
        .userName,
      user_PK: JSON.parse(this.utilityService.storage.getItem('currentUser'))
        .id,
      branch: JSON.parse(localStorage.getItem('selectedBranch'))[0].code || '',
      logDate: new Date(),
      logBy: this.selectedCallLog?.logBy || '',
      assignTo: formPayload?.assignTo?.id || '',
      assignEmail: '',
      company: formPayload?.company || '',
      contact: formPayload?.contact || '',
      note: formPayload?.note || '',
      phone: formPayload?.phone || '',
      state: formPayload?.state || '',
      emailSent: true,
      name: formPayload?.name || '',
      title: formPayload?.title || '',
      oPhone: formPayload?.oPhone || '',
      address: formPayload?.address || '',
      city: formPayload?.city || '',
      county: formPayload?.county || '',
      country: formPayload?.country || '',
      projectTitle: formPayload?.projectTitle || '',
      descProject: formPayload?.descProject || '',
      pumpingDur: formPayload?.pumpingDur || '',
      firstForm: {
        cC1: formPayload.cC1?.id || '',
        cC2: formPayload.cC2?.id || '',
        cC3: formPayload.cC3?.id || '',
        cC4: formPayload.cC4?.id || '',
        callerType: formPayload?.callerType || '',
        contact: formPayload?.contact || '',
        PhoneCC1: formPayload.cC1?.id || '',
        PhoneCC2: formPayload.cC2?.id || '',
        PhoneCC3: formPayload.cC3?.id || '',
        PhoneCC4: formPayload.cC4?.id ||'',
        CC1Email: formPayload.cC1?.name || '',
        CC2Email: formPayload.cC2?.name || '',
        CC3Email: formPayload.cC3?.name || '',
        CC4Email: formPayload.cC4?.name || ''
      },
      contactForm: {
        contactID: formPayload?.contactID,
      },
      centerRequest: {
        bidDate: formPayload?.bidDate || '',
        anticStartDate: formPayload?.anticStartDate || '',
        gwDepth: formPayload?.gwDepth || '',
        erSystem: true,
        ersType: formPayload?.ersType || '',
        soilBoring: true,
        sbType: formPayload?.sbType || '',
        elecAvail: true,
        elecLocation: formPayload?.elecLocation || '',
        elecServiceType: formPayload?.elecServiceType || '',
        waterSupplyAvail: true,
        wsLocation: formPayload?.wsLocation || '',
        wsSource: formPayload?.wsSource || '',
        exUObstructions: true,
        exULocations: formPayload?.exULocations || '',
        bUnion: true,
        unionLocation: formPayload?.unionLocation || '',
        dpDistance: formPayload?.dpDistance || '',
        doeMeasure1: formPayload?.doeMeasure1 || '',
        doeMeasure2: formPayload?.doeMeasure2 || '',
        doeMeasure3: formPayload?.doeMeasure3 || '',
        doeMeasure4: formPayload?.doeMeasure4 || '',
        prevailingWage: true,
        certifiedPayroll: true,
        ocipccip: true,
        excavationSketch: true,
      },
      requestPumpQuote: {
        cPhone: formPayload?.cPhone || '',
        lowFlowRate: formPayload?.lowFlowRate || '',
        highFlowRate: formPayload?.highFlowRate || '',
        suctionLiftReq: formPayload?.suctionLiftReq || '',
        productTemp: formPayload?.productTemp || '',
        adPertinentInfo: formPayload?.adPertinentInfo || '',
        totalDynamicHead: formPayload?.totalDynamicHead || '',
      },
    };

    this.dataService
      .post('AdminCallLog/Add', payload)
      .subscribe((result: any) => {
        if (result) {
          this.utilityService.toast.success(result?.message);
          this.disable = true;
          this.disableResolutionTab = false;
          this.isSaveCallLogs = true;
          this.onLoadAdminCalllog();
        }
      });
  }

  onUpdateResolution() {
    let payload = {
      ...this.resolutionForm.value,
      id: this.selectedCallLog?.resolutionFK,
      logId: this.selectedCallLog?.logId,
      userName: JSON.parse(this.utilityService.storage.getItem('currentUser'))
        .userName,
      user_PK: JSON.parse(this.utilityService.storage.getItem('currentUser'))
        .id,
    };
    this.dataService
      .patch('AdminCallLog/Resolution/Update', payload)
      .subscribe((result: any) => {
        if (result?.status === 200) {
          this.utilityService.toast.success(result.message);
          this.disable = true;
          this.disableResolutionTab = false;
          this.isSaveResolution = true;
          this.onLoadAdminCalllog();
        }
      });
  }

  onConfirmResolution() {
    this.resolutionForm.setValue({
      ...this.resolutionForm.value,
      closed: true,
    });
    this.onUpdateResolution();
    this.isConfirmationDialog = false;
  }

  onCancelConfirmResolution() {
    this.onUpdateResolution();
    this.isConfirmationDialog = false;
  }

  onToggleConfirm() {
    this.isConfirmationDialog = !this.isConfirmationDialog;
  }

  closeButtonEvent(p) {
    this.isClose = p;
  }

  onToggleAlert() {
    this.isAlertDialog = !this.isAlertDialog;
  }
}
