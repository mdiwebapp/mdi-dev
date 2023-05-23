import { Component, OnInit, ViewChild, Output } from '@angular/core';
import { FormBuilder, FormGroup, NumberValueAccessor } from '@angular/forms';
import {
  orderBy,
  process,
  SortDescriptor,
  State,
} from '@progress/kendo-data-query';
import { ErrorHandlerService, PagerService } from 'src/app/core/services';
import {
  BooleanFilterMenuComponent,
  GroupKey,
  PageChangeEvent,
} from '@progress/kendo-angular-grid';
import { DropdownService } from './../../../core/services/dropdown.service';
import { ModuleNames, ErrorMessages } from 'src/app/core/constant';
import { ViewColumnsCust } from '../../../../data/service-order-data';
import { ProjectService } from './../projects.service';
import {
  CRMContactAddRequestModel,
  ProjectInfoAddRequestModel,
  ProjectInfoUpdateRequestModel,
  CRMContactViewRequestModel,
  LaborToRevRequestModel,
} from './../projects.model';
import { UtilityService } from '../../../core/services/utility.service';
import { PAFComponent } from './PAF/PAF.component';
import { DatePipe } from '@angular/common';
import {
  viewProjectInfoColumns,
  probabilityData,
  leadSourceData,
  jobData,
  viewColumnsContact,
} from '../../../../data/projectdata';
import * as fileSaver from 'file-saver';

@Component({
  selector: 'app-projects-info',
  templateUrl: './projects-info.component.html',
  styleUrls: ['./projects-info.component.scss'],
})
export class ProjectsInfoComponent implements OnInit {
  @ViewChild(PAFComponent) PAFComponent: PAFComponent;
  form: FormGroup;
  displayLaborToRev: boolean = false;
  displayLaborToRevPumpWatch: boolean = false;
  displayJobSatus: boolean = false;
  displayPAF: boolean = false;
  displayBranch: boolean = false;
  displayBranchDrp: boolean = false;
  jobNumber: number = 0;
  jobStatus: string = '';
  branch: string = '';
  labourToRev: string;
  labourToRevPumpWatch: string;
  laborHours: string;
  lastInvDate: string;
  custOpen: string;
  custSearch: string = '';
  customerTotal: number;
  customerName: string;
  displayCustDrp: boolean = false;
  custId: number;
  public viewColumnsCust: any;
  public pageSize = 100;
  public skip = 0;
  pageNumber = 0;
  cRMContactAddRequestModel: CRMContactAddRequestModel;
  projectInfoAddRequestModel: ProjectInfoAddRequestModel;
  projectInfoUpdateRequestModel: ProjectInfoUpdateRequestModel;
  cRMContactViewRequestModel: CRMContactViewRequestModel;
  laborToRevRequestModel: LaborToRevRequestModel;
  contactFirstName: string;
  contactLastName: string;
  contactEmail: string;
  contactPhone: string;
  contactTitle: string;
  pageSizeList: any = [
    { id: 0, value: 100 },
    { id: 0, value: 300 },
    { id: 0, value: 500 },
  ];
  public mask = '(000) 000-0000';
  invTotal: number;
  disabled: boolean;
  billingAmt: number;
  hours: number;
  customername: string;
  customerRep: string;
  jobOpen: string;
  customerPhone: number;
  customerContactemail: string;
  customerContactPhone: string;
  customerContactPosition: string;
  PAFDetails: any = [];
  branches: any = [];
  isdisabled: boolean = true;
  isBranch: boolean = true;
  isCustomer: boolean = true;
  isAdd: boolean;
  isEdit: boolean;
  isUnpaid: boolean = false;
  isLaborToRev: boolean = false;
  currentUser: string;
  isLaborToRevWP: boolean = false;
  searchText: string = '';
  labourToRevColor: string;
  labourToRevPumpWatchColor: string;
  labourToRevPerc: number;
  labourToRevPumpPerc: number;
  statusData: any = [];
  callOff: boolean;
  callOfBy: string;
  callOffDate: Date;
  callOffLabel: string;
  jobValue: number;
  isL2r: boolean;
  isPafComplete: boolean;
  l2Rdata: any = {
    am: '',
    jobName: '',
    jobNumber: '',
    jobStatus: '',
    l2R: '',
    nonUnionCost: '',
    nonUnionHours: '',
    nonUnionRate: '',
    totalInvoiced: '',
    unionCost: '',
    unionHours: '',
    unionRate: '',
  };
  projectInfoData: any = [];
  expandedGroupKeys: Array<GroupKey> = [];
  state: State = {
    group: [],
  };
  customerData = [];
  customerContactType = [];
  accountManagerType = [];
  jobTypeData = [];
  probabilityData: any = probabilityData;
  leadSourceData: any = leadSourceData;
  jobStatusList = [];
  branchTypeList = [];
  stateList = [];
  displayCustomerContact: boolean = false;
  employeeData: any = [];
  jobData: any = jobData;
  isStatusButtonDisables: boolean = true;
  isPAF: boolean = true;
  public viewColumnsContact: any = viewColumnsContact;
  contactListData: any = [];
  tempContactListData: any = [];
  data: any;
  public sort: SortDescriptor[] = [
    {
      field: 'item',
      dir: 'asc',
    },
    {
      field: 'description',
      dir: 'asc',
    },
    {
      field: 'inv',
      dir: 'asc',
    },
    {
      field: 'qty',
      dir: 'asc',
    },
    {
      field: 'rate',
      dir: 'asc',
    },
    {
      field: 'lineTotal',
      dir: 'asc',
    },
  ];
  public mySelection: number[] = [0];
  public infoGridSelection: number[] = [0];
  data1: any;
  public sort1: SortDescriptor[] = [
    {
      field: 'name',
      dir: 'asc',
    },
    {
      field: 'phone',
      dir: 'asc',
    },
    {
      field: 'position',
      dir: 'asc',
    },
    {
      field: 'email',
      dir: 'asc',
    },
  ];
  public mySelection1: number[] = [0];
  pAFbuttonColor: string;
  checkCredit: boolean;
  branchName: any;
  labourHoursColor: string;

  constructor(
    private formBuilder: FormBuilder,
    public dropDownService: DropdownService,
    public errorHandler: ErrorHandlerService,
    public pagerService: PagerService,
    public projectService: ProjectService,
    public utilityService: UtilityService,
    public datepipe: DatePipe
  ) {}
  ngOnInit() {
    this.initForm();
    // this.disabled = true;
    this.pagerService.start = this.pageNumber;
    this.viewColumnsCust = ViewColumnsCust;
    this.cRMContactAddRequestModel = new CRMContactAddRequestModel();
    this.projectInfoAddRequestModel = new ProjectInfoAddRequestModel();
    this.projectInfoUpdateRequestModel = new ProjectInfoUpdateRequestModel();
    this.cRMContactViewRequestModel = new CRMContactViewRequestModel();
    this.laborToRevRequestModel = new LaborToRevRequestModel();
    var usr = JSON.parse(localStorage.getItem('currentUser'));
    this.getAMEmployees();
    this.getStateDropDown();
    this.getCustomerData();
    this.getBranch();
  }

  initForm(): void {
    this.form = this.formBuilder.group({
      jobNumber: [],
      jobStatus: [],
      jobName: [],
      jobLocation: [],
      branch: [],
      accountManager: [],
      bidDate: [],
      billingAmt: [],
      callOff: [],
      callOffBy: [],
      callOffDate: [],
      custAddress: [],
      customerId: [],
      customerRep: [],
      estimatedEndDate: [],
      estimatedStartDate: [],
      jobCity: [],
      jobState: [],
      jobType: [],
      jobValue: [],
      jobZip: [],
      labourHours: [],
      leadSource: [],
      note: [],
      probability: [],
      repPhone: [],
      estStartDate: [],
      estEndDate: [],
      displayAllInvoices: [],
      stateName: [],
      name: [],
      address: [],
      cityText: [],
      stateText: [],
      zipCode: [],
      estJobValue: [],
      customerType: [],
      laborHours: [],
      laborToRev: [],
      laborToRev_pumpWatch: [],

      lastInvoicedDate: [],

      customerContact: [],

      branchType: [],
      emailName: [],
      titleName: [],
      lastName: [],
      phoneNumber: [],
      firstName: [],
    });
  }

  onLaborToRev() {
    this.isL2r = true;
    this.displayLaborToRev = !this.displayLaborToRev;
    if (this.displayLaborToRev) {
      this.bindPopupForLaborToRevenue();
    }
  }
  onLaborToRevPumpWatch() {
    this.isL2r = false;
    this.displayLaborToRevPumpWatch = !this.displayLaborToRevPumpWatch;
    if (this.displayLaborToRevPumpWatch) {
      this.bindPopupForLaborToRevenue();
    }
  }
  onHour() {
    var filterData = {
      startDate: '2000-01-01T05:30:41.880Z',
      returnDate: new Date(),
      employee: '%',
      job: this.jobNumber,
      order: 'DATE',
      detail: 'DETAIL',
      union: false,
    };
    this.projectService
      .getExportToExcelTimeComplete(filterData)
      .subscribe((res) => {
        if (res && res.size > 0) {
          let data = new Blob([res], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          });
          fileSaver.saveAs(
            data,
            'ProjectTimeComplete_' +
              new Date().toLocaleDateString('en-US') +
              '.xlsx'
          );
        }
      });
  }
  currentStatus: string;
  onJobStatus() {
    this.currentStatus = this.jobStatus;
    if (localStorage.getItem('isAdmin') == 'true') {
      this.isStatusButtonDisables = false;
      this.displayJobSatus = !this.displayJobSatus;
    } else {
      const rights = JSON.parse(localStorage.getItem('Rights'));
      var isStatusButtonDisables = !rights.some(
        (c) =>
          c.subModuleName == 'Project Info' &&
          c.moduleName == 'Maintain Projects' &&
          c.tabName == 'Change Status'
      );
      if (isStatusButtonDisables) {
        this.utilityService.toast.error(
          'You do not have permissions to access this part of the system. Please contact your supervisor so they can request them from IT.'
        );
      } else {
        this.displayJobSatus = !this.displayJobSatus;
      }
    }
  }
  onPAF() {
    this.displayPAF = !this.displayPAF;
  }
  onBranch() {
    this.displayBranch = !this.displayBranch;
    this.displayBranchDrp = !this.displayBranchDrp;
  }
  public close(status) {
    if (status == 'yes' && !this.displayBranchDrp) {
      this.displayBranchDrp = !this.displayBranchDrp;
    } else if (status == 'yes' && this.displayBranchDrp) {
      this.displayBranchDrp = !this.displayBranchDrp;
      this.displayBranch = !this.displayBranch;
    } else if (status == 'no') {
      this.displayBranch = !this.displayBranch;
    } else {
      this.displayBranch = !this.displayBranch;
      this.displayBranchDrp = !this.displayBranchDrp;
    }
  }
  onClosedisplayBranch() {
    this.displayBranchDrp = !this.displayBranchDrp;
    this.displayBranch = !this.displayBranch;
  }
  onCustomerContact() {
    this.displayCustomerContact = !this.displayCustomerContact;
  }

  onGridSelectionChange($event: any) {}

  public sortChange1(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.data = {
      data: orderBy(this.tempContactListData, this.sort),
      total: this.tempContactListData.length,
    };
    this.contactListData = this.data.data;
  }
  //#region Bind Account Manager DropDown
  getAMEmployees() {
    this.dropDownService.getAmEmployee().subscribe((res) => {
      this.employeeData = res;
    });
  }
  //#endregion

  //#region  Bind State DropDown
  getStateDropDown() {
    this.dropDownService.GetLookupList('States').subscribe(
      (res) => {
        if (res) {
          this.stateList = res;
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.drop_down.states);
      }
    );
  }

  //#endregion

  //#region get Form Details
  getFormDetails(data) {
    var br = [];
    br = this.branches;
    this.jobNumber = data.jobNumber;
    this.jobStatus = data.jobStatus;
    this.branch = data.branch;
    this.branchName = br.find((c) => c.code == data.branch)
      ? br.find((c) => c.code == data.branch).value
      : data.branch;
    this.labourToRev = data.l2R;
    this.labourToRevPerc = data.l2R;
    this.labourToRevPumpWatch = data.l2RPW;
    this.labourToRevPumpPerc = data.l2RPW;
    this.laborHours = data.labourHours;
    this.lastInvDate = data.lastInvDate;
    this.custOpen = data.custOpen;
    this.billingAmt = data.billingAmt;
    this.hours = data.hours;
    this.customername = data.customerName;
    this.customerRep = data.customerRep;
    this.jobOpen = data.jobOpen;
    this.invTotal = data.invTotal;
    this.custId = data.customerId;
    this.customerPhone = data.repPhone;
    this.callOff = data.callOff;
    this.callOfBy = data.callOffBy;
    this.callOffDate = data.callOffDate;
    this.jobValue = data.jobValue;
    this.isPafComplete = data.pafComplete;
    this.checkCredit = data.checkCredit;
    if (data.labourHours == null || data.labourHours == 0) {
      this.laborHours = 'No Labor';
    }
    if (data.l2R == 0 || data.l2R == null) {
      this.labourToRev = 'No Billing';
      this.isLaborToRev = true;
    } else {
      this.isLaborToRev = false;
      this.labourToRev = data.l2R + '%';
    }

    if (data.l2RPW == 0 || data.l2RPW == null) {
      this.labourToRevPumpWatch = 'No Billing';
      this.isLaborToRevWP = true;
    } else {
      this.isLaborToRevWP = false;
      this.labourToRevPumpWatch = data.l2RPW + '%';
    }
    if (data.callOff) {
      this.callOffLabel =
        'Call Off on' +
        ' ' +
        this.datepipe.transform(this.callOffDate, 'MM/dd/yyyy') +
        ' ' +
        'by ' +
        ' ' +
        this.callOfBy;
    } else {
      this.callOffLabel = '';
    }
    this.form.setValue({
      jobNumber: data.jobNumber,
      jobStatus: data.jobStatus,
      jobName: data.jobName,
      jobLocation: data.jobLocation,
      branch: data.branch,
      accountManager: parseInt(data.accountManager),
      bidDate: new Date(data.bidDate),
      billingAmt: data.billingAmt,
      callOff: data.callOff,
      callOffBy: data.callOffBy,
      callOffDate: new Date(data.callOffDate),
      custAddress: data.workAddress,
      customerId: data.customerId,
      customerRep: data.customerRep,
      estimatedEndDate: new Date(data.estimatedEndDate),
      estimatedStartDate: new Date(data.estimatedStartDate),
      jobCity: data.jobCity,
      jobState: data.jobState,
      jobType: data.jobType,
      jobValue: data.jobValue,
      jobZip: data.jobZip,
      labourHours: data.labourHours,
      leadSource: data.leadSource,
      note: data.note,
      probability: data.probability,
      repPhone: data.repPhone,
      laborHours: data.labourHours,

      estStartDate: null,
      estEndDate: null,
      displayAllInvoices: null,
      stateName: null,
      name: '',
      address: '',
      cityText: '',
      stateText: '',
      zipCode: '',
      estJobValue: '',
      customerType: null,

      laborToRev: null,
      laborToRev_pumpWatch: null,

      lastInvoicedDate: null,

      customerContact: null,

      branchType: null,
      emailName: null,
      titleName: null,
      lastName: null,
      phoneNumber: null,
      firstName: null,
    });

    this.getProjectInfoGrid();
    this.getStatus();
    this.getColor();
    this.getColorForRevPump();
    this.getColorForPAF();  
    this.getLabourHours();
  }
  //#endregion

  //#region Error method
  private onError(error: any, customMessage?: string) {
    this.errorHandler.handleError(
      error,
      ModuleNames.project_info,
      customMessage
    );
  }
  //#endregion

  //#region Bind Customer Grid And Search
  selectCust() {
    this.displayCustDrp = !this.displayCustDrp;
    this.mySelection1 = [];
  }

  getCustomerData() {
    var obj = {
      pageNumber: this.pagerService.start,
      pageSize: this.pageSize,
      sortColumn: 'value',
      sortDesc: true,
      request: {
        searchText: this.custSearch,
      },
    };
    this.dropDownService.GetCustomerList(obj).subscribe((res) => {
      this.customerData = res.data;
      this.customerTotal = res.totalRecords;
    });
  }

  customerClick(event) {
    this.custId = event.id;
    this.customername = event.value;
    // this.customerPhone = event.phone;
    this.displayCustDrp = false;
    this.getCRMContactByCustNumber();
  }
  customerContactClick(event) {
    this.customerRep = event.name;
    this.customerContactemail = event.email;
    this.customerPhone = event.phone;
    this.customerContactPosition = event.position;
    this.displayCustomerContact = false;
  }

  onSearchClick() {
    this.searchText = this.form.get('customerContact').value;
    this.getCRMContactByCustNumber();
  }
  //#endregion

  //#region Customer Dropdown Pagination
  public onPageChange(e: PageChangeEvent): void {
    this.skip = e.skip;
    this.pageSize = e.take;
    this.pagerService.start = this.skip == 0 ? 0 : this.skip / this.pageSize;

    this.getCustomerData();
  }
  onPageSizechange(pagesize) {
    this.pageSize = pagesize;
    this.getCustomerData();
  }

  getCRMContactByCustNumber() {
    this.contactListData = [];
    this.tempContactListData = [];
    this.createCRMContactViewRequestModel();
    this.projectService
      .GetCRMContactByCustNumber(this.cRMContactViewRequestModel)
      .subscribe((res) => {
        this.contactListData = res;
        this.tempContactListData = res;
      });
  }

  createCRMContactViewRequestModel() {
    this.cRMContactViewRequestModel = new CRMContactViewRequestModel();
    this.cRMContactViewRequestModel.CustomerNumber = this.custId;
    this.cRMContactViewRequestModel.SearchText = this.searchText;
  }
  //#endregion

  //#region createContact

  createContact() {
    this.cRMContactAddRequestModel = new CRMContactAddRequestModel();
    this.cRMContactAddRequestModel.CustomerNumber = this.custId;
    this.cRMContactAddRequestModel.FirstName = this.contactFirstName;
    this.cRMContactAddRequestModel.LastName = this.contactLastName;
    this.cRMContactAddRequestModel.Email = this.contactEmail;
    this.cRMContactAddRequestModel.Phone = this.contactPhone;
    this.cRMContactAddRequestModel.Title = this.contactTitle;
  }

  addCustomerContact() {
    this.getCustomerContactFormValues();
    this.createContact();

    if (
      this.contactFirstName == null ||
      this.contactFirstName === undefined ||
      this.contactFirstName == ''
    ) {
      this.utilityService.toast.error('Please enter first name');
      return;
    } else {
      this.projectService
        .addCRMCustomer(this.cRMContactAddRequestModel)
        .subscribe((res) => {
          if (res['status'] == 200) {
            this.utilityService.toast.success(res.message);
            this.getCRMContactByCustNumber();
          } else {
            this.utilityService.toast.error(res.message);
            this.getCRMContactByCustNumber();
          }
        });
      this.resetCustomerContactValues();
    }
  }

  //#endregion

  //#region get and set customer contact values
  getCustomerContactFormValues() {
    this.contactFirstName = this.form.get('firstName').value;
    this.contactLastName = this.form.get('lastName').value;
    this.contactEmail = this.form.get('emailName').value;
    this.contactTitle = this.form.get('titleName').value;
    this.contactPhone = this.form.get('phoneNumber').value;
  }

  resetCustomerContactValues() {
    this.form.controls['firstName'].setValue('');
    this.form.controls['lastName'].setValue('');
    this.form.controls['emailName'].setValue('');
    this.form.controls['titleName'].setValue('');
    this.form.controls['phoneNumber'].setValue('');
    this.contactFirstName = '';
    this.contactLastName = '';
    this.contactEmail = '';
    this.contactTitle = '';
    this.contactPhone = '';
  }
  //#endregion

  //#region onAddClick
  onAddClick() {
    this.isdisabled = false;
    this.isBranch = false;
    this.isCustomer = false;
    this.isAdd = true;
    this.branchName = 'Select Branch';
    this.isEdit = false;
    this.isPAF = true;
    this.form.reset();
    this.resetFeildsOnAdd();
  }
  resetForm(){
    this.form.reset();
    this.resetFeildsOnAdd();
  }
  resetFeildsOnAdd() {
    this.branch = '';
    this.jobNumber = 0;
    this.custId = 0;
    this.jobStatus = 'Needs Bid';
    this.labourToRev = '';
    this.labourToRevPumpWatch = '';
    this.laborHours = '';
    this.lastInvDate = '';
    this.custOpen = '';
    this.billingAmt = 0;
    this.hours = 0;
    this.customername = 'Click here to select a customer';
    this.customerRep = 'Click here to select a customer';
    this.jobOpen = '';
    this.invTotal = 0;
    this.customerPhone = 0;
    this.laborHours = '';
    this.labourToRev = '';
    this.labourToRevPumpWatch = 'No Billing';
  }
  //#endregion

  //#region On Save Click
  onSaveClick() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return false;
    }

    if (this.isAdd) {
      let data = new ProjectInfoAddRequestModel();
      data = this.createAddModel();
      var getCustomfromDate = new Date(data.EstimatedStartDate);
      var getCustomtoDate = new Date(data.EstimatedEndDate);
      if (
        data.CustomerId == null ||
        data.CustomerId === undefined ||
        data.CustomerId == 0
      ) {
        this.utilityService.toast.error('You must select a customer.');
        return false;
      } else if (
        data.AccountManager == null ||
        data.AccountManager === undefined ||
        data.AccountManager == ''
      ) {
        this.utilityService.toast.error('You must select the account manager.');
        return false;
      } else if (
        data.JobName == null ||
        data.JobName === undefined ||
        data.JobName == ''
      ) {
        this.utilityService.toast.error('You must enter the job name.');
        return false;
      } else if (
        data.JobCity == null ||
        data.JobCity === undefined ||
        data.JobCity == ''
      ) {
        this.utilityService.toast.error('You must enter the job city.');
        return false;
      } else if (
        data.JobState == null ||
        data.JobName === undefined ||
        data.JobState == ''
      ) {
        this.utilityService.toast.error('You must enter the job state.');
        return false;
      } else if (getCustomfromDate.getTime() > getCustomtoDate.getTime()) {
        this.utilityService.toast.error(
          'Estimate start date should be greater than Estimated To date .'
        );
        return false;
      } else if (
        data.Branch == '' ||
        data.Branch == null ||
        data.Branch === undefined
      ) {
        this.utilityService.toast.error('You must select the branch.');
        return false;
      } else {
        this.projectService.saveProjectInfo(data).subscribe((res) => {
          if ((res['status'] = 200)) {
            this.utilityService.toast.success(res.message);
            this.isdisabled = true;
            this.isBranch = true;
            this.isCustomer = true;
            this.isStatusButtonDisables = true;
            this.isPAF = true;
          } else {
            this.utilityService.toast.error(res.message);
            this.isdisabled = true;
            this.isBranch = true;
            this.isCustomer = true;
            this.isPAF = true;
          }

          //return true;
        });
      }
    } else if (this.isEdit) {
      let data = new ProjectInfoUpdateRequestModel();
      data = this.createAddModel();
      var getCustomfromDate = new Date(data.EstimatedStartDate);
      var getCustomtoDate = new Date(data.EstimatedEndDate);
      if (getCustomfromDate.getTime() > getCustomtoDate.getTime()) {
        this.utilityService.toast.error(
          'Estimate start date should be greater than Estimated To date .'
        );
        return false;
      } else {
        this.projectService.editProjectInfo(data).subscribe((res) => {
          if (res['status'] == 200) {
            this.utilityService.toast.success(res.message);
            this.isdisabled = true;
            this.isBranch = true;
            this.isCustomer = true;
            this.isStatusButtonDisables = true;
            this.isPAF = true;
          } else {
            this.utilityService.toast.error(res.message);
            this.isdisabled = true;
            this.isBranch = true;
            this.isCustomer = true;
            this.isPAF = true;
          }
        });
      }
    }
    this.displayJobSatus = false;
    this.isdisabled = true;
    this.isBranch = true;
    this.isCustomer = true;
  }
  createAddModel() {
    let data;
    if (this.isAdd) {
      data = new ProjectInfoAddRequestModel();
    } else if (this.isEdit) {
      data = new ProjectInfoUpdateRequestModel();
      data.jobNumber = this.jobNumber;
      data.jobStatus = this.jobStatus;
    }
    data.JobName = this.form.get('jobName').value;
    data.Branch = this.branch;
    data.CustomerId = this.custId;
    data.CustomerRep = this.customerRep;
    data.RepPhone = this.customerPhone;
    data.CustAddress = this.form.get('custAddress').value;
    data.AccountManager = this.form.get('accountManager').value;
    data.BidDate = this.datepipe.transform(
      this.form.get('bidDate').value,
      'MM/dd/yyyy'
    );
    data.JobType = this.form.get('jobType').value;
    data.JobValue = this.form.get('jobValue').value;
    data.Probability = this.form.get('probability').value;
    data.JobCity = this.form.get('jobCity').value;
    data.JobState = this.form.get('jobState').value;
    data.JobZip = this.form.get('jobZip').value;
    data.EstimatedStartDate = this.datepipe.transform(
      this.form.get('estimatedStartDate').value,
      'MM/dd/yyyy'
    );

    data.EstimatedEndDate = this.datepipe.transform(
      this.form.get('estimatedEndDate').value,
      'MM/dd/yyyy'
    );
    data.LeadSource = this.form.get('leadSource').value;
    data.LabourHours = this.form.get('laborHours').value;

    return data;
  }
  //#endregion

  //#region get Branch Dropdown
  getBranch() {
    this.dropDownService.getUserBranch().subscribe((res) => {
      this.branches = res;
    });
  }
  onValueChange(event) {
    this.branch = event;
    this.displayBranch = !this.displayBranch;
    this.branchName = this.branches.find((c) => c.code == event).value;
  }
  //#endregion
  //#region onCancelClick
  onCancelClick() {
    this.isdisabled = true;
    this.isBranch = true;
    this.isCustomer = true;
    this.isAdd = false;
    this.isEdit = false;
    this.displayJobSatus = false;
    this.isStatusButtonDisables = true;
    this.isPAF = true;
  }
  //#endregion

  //#region onEditClick
  onEditClick() {
    this.isEdit = true;
    this.isAdd = false;
    this.isPAF = false;

    this.form.enable();
    // this.isdisabled = false;
    if (localStorage.getItem('isAdmin') == 'true') {
      this.isStatusButtonDisables = false;
      if (this.jobStatus == 'Needs Bid' || this.jobStatus == 'Proposed') {
        this.isBranch = false;
        this.isCustomer = false;
      }
    } else {
      //const rights = JSON.parse(localStorage.getItem('Rights'));
      if (this.jobStatus == 'Closed') {
        this.isStatusButtonDisables = true;
      } else {
        this.isStatusButtonDisables = false;
        if (this.jobStatus == 'Needs Bid' || this.jobStatus == 'Proposed') {
          this.isBranch = false;
          this.isCustomer = false;
        } else {
          this.isBranch = true;
          this.isCustomer = true;
        }
      }
      // else {
      //   this.isStatusButtonDisables = !rights.some(
      //     (c) =>
      //       c.subModuleName == 'Project Info' &&
      //       c.moduleName == 'Maintain Projects' &&
      //       c.tabName == 'Change Status'
      //   );
      //   if (this.isStatusButtonDisables) {
      //     this.utilityService.toast.error(
      //       'You do not have permissions to access this part of the system. Please contact your supervisor so they can request them from IT.'
      //     );
      //   }
      // }
    }
  }
  //#endregion
  //#region
  onJobStatusClick(event) {
    if (localStorage.getItem('isAdmin') == 'false') {
      const rights = JSON.parse(localStorage.getItem('Rights'));
      /// -------- close from a/r ------------
      var isClosefromAR = !rights.some(
        (c) =>
          c.subModuleName == 'Project Info' &&
          c.moduleName == 'Maintain Projects' &&
          c.tabName == 'Close from A/R'
      );
      if (this.currentStatus == 'A/R' && isClosefromAR && event == 'Closed') {
        this.utilityService.toast.error(
          'You do not have permissions to access this part of the system. Please contact your supervisor so they can request them from IT.'
        );
        this.form.controls['jobStatus'].setValue('');
        return false;
      }
      /// -------- close job never activated ------------
      var isCloseJobNverActive = !rights.some(
        (c) =>
          c.subModuleName == 'Project Info' &&
          c.moduleName == 'Maintain Projects' &&
          c.tabName == 'Close Job never activated'
      );
      if (
        (this.currentStatus == 'Needs Bid' ||
          this.currentStatus == 'Proposed') &&
        isCloseJobNverActive &&
        event == 'Closed'
      ) {
        this.utilityService.toast.error(
          'You do not have permissions to access this part of the system. Please contact your supervisor so they can request them from IT.'
        );
        this.form.controls['jobStatus'].setValue('');
        return false;
      }
      /// -------- move job to a/r ------------
      var isMoveJobtoAR = !rights.some(
        (c) =>
          c.subModuleName == 'Project Info' &&
          c.moduleName == 'Maintain Projects' &&
          c.tabName == 'Move Job to A/R'
      );
      if (this.currentStatus == 'Active' && isMoveJobtoAR && event == 'A/R') {
        this.utilityService.toast.error(
          'You do not have permissions to access this part of the system. Please contact your supervisor so they can request them from IT.'
        );
        this.form.controls['jobStatus'].setValue('');
        return false;
      }
      /// -------- move job to a/r ------------
      var isActivate = !rights.some(
        (c) =>
          c.subModuleName == 'Project Info' &&
          c.moduleName == 'Maintain Projects' &&
          c.tabName == 'Activate'
      );
      if (this.currentStatus == 'Proposed' && isActivate && event == 'Active') {
        this.utilityService.toast.error(
          'You do not have permissions to access this part of the system. Please contact your supervisor so they can request them from IT.'
        );
        this.form.controls['jobStatus'].setValue('');
        return false;
      }
    }
    if (event == 'A/R') {
      this.jobStatus = 'AR';
    }
    this.jobStatus = event;
  }
  //#endregion

  //#region project Info Grid Selection
  projectInfoGridSelection(data) {}
  groupChange() {}
  //#endregion

  //#region Bind project info grid.
  getProjectInfoGrid() {
    this.projectService
      .getProjectInfoJobInvoiceLists(this.jobNumber, this.isUnpaid)
      .subscribe((res) => {
        // this.state.group = [{ field: 'branch'  } , {field: 'am'}],
        // this.projectInfoData = res;
        (this.state.group = [{ field: 'status' }, { field: 'invoiceNumber' }]),
          (this.projectInfoData = process(res, this.state));
      });
  }
  //#endregion

  //#region show All Invoice Change Event
  showAllInvoice(data) {
    this.isUnpaid = data;
    this.getProjectInfoGrid();
  }
  sortChange(data) {}
  //#endregion

  //#region Bind Status By Job Status
  getStatus() {
    if (this.jobStatus == 'Needs Bid') {
      this.statusData = [
        { id: 3, value: 'Proposed' },
        { id: 4, value: 'Closed' },
      ];
    } else if (this.jobStatus == 'Proposed') {
      this.statusData = [
        { id: 1, value: 'Active' },
        { id: 4, value: 'Closed' },
      ];
    } else if (this.jobStatus == 'Active') {
      this.statusData = [{ id: 5, value: 'A/R' }];
    } else if (this.jobStatus == 'A/R') {
      this.statusData = [
        { id: 1, value: 'Active' },
        { id: 4, value: 'Closed' },
      ];
    } else if (this.jobStatus == 'Closed') {
      this.isStatusButtonDisables = true;
      //nothing should disable job status
    }
  }
  //#endregion

  //#region Back Button Event Handler
  backButtonEvent(p) {
    this.onPAF();
  }
  //#endregion

  //#region Bind Color
  getLabourHours(){
    if(this.hours>0){
        if(!this.laborHours){
          this.labourHoursColor ='lightgrey';
        }else if(this.hours> parseInt(this.laborHours)){
          this.labourHoursColor ='#3355596';
        }else if(this.hours< parseInt(this.laborHours)){
          this.labourHoursColor ='lightgreen';
        }else{
          this.labourHoursColor ='yellow';
        }
    }else{
      this.labourHoursColor ='lightgrey';
    }
  }
  getColor() {
    if (
      this.labourToRevPerc < 25 &&
      this.labourToRev != 'No Billing' &&
      this.labourToRevPerc != 0
    ) {
      this.labourToRevColor = 'lightgreen';
    } else if (this.labourToRevPerc > 35) {
      this.labourToRevColor = 'red';
    } else if (this.labourToRevPerc < 25 && this.labourToRevPerc > 35) {
      this.labourToRevColor = 'yellow';
      this.labourToRevPumpWatchColor = 'yellow';
    } else if (this.labourToRevPerc == 0 && this.labourToRev == 'No Billing') {
      this.labourToRevColor = 'lightgrey';
    }
  }
  getColorForRevPump() {
    if (
      this.labourToRevPumpPerc < 25 &&
      this.labourToRevPumpWatch != 'No Billing' &&
      this.labourToRevPumpPerc != 0
    ) {
      this.labourToRevPumpWatchColor = 'lightgreen';
    } else if (this.labourToRevPumpPerc > 35) {
      this.labourToRevPumpWatchColor = 'red';
    } else if (this.labourToRevPumpPerc < 25 && this.labourToRevPumpPerc > 35) {
      this.labourToRevPumpWatchColor = 'yellow';
    } else if (
      this.labourToRevPumpPerc == 0 &&
      this.labourToRevPumpWatch == 'No Billing'
    ) {
      this.labourToRevPumpWatchColor = 'lightgrey';
    }
  }

  getColorForPAF() {
    if ((this.branch == 'CHI' || this.branch == 'MI') && !this.isPafComplete) {
      this.pAFbuttonColor = 'yellow';
      //yellow
    } else if (
      this.branch != 'CHI' &&
      this.branch != 'MI' &&
      this.jobValue >= 20000 &&
      !this.isPafComplete
    ) {
      this.pAFbuttonColor = 'yellow';
      // yellow
    } else if (this.isPafComplete) {
      this.pAFbuttonColor = 'lightgreen';
      // green
    } else {
      this.pAFbuttonColor = 'lightgrey';
      // light grey
    }
  }
  //#endregion

  //#region Bind Popup for labour button
  bindPopupForLaborToRevenue() {
    this.createPopupModel();
    this.projectService
      .GetLaborToRev(this.laborToRevRequestModel)
      .subscribe((res) => {
        this.l2Rdata = res[0];
      });
  }

  createPopupModel() {
    this.laborToRevRequestModel.JobNumber = this.jobNumber;
    this.laborToRevRequestModel.L2R = this.isL2r;
  }
  checkStartDate(cdate){   
    let date = new Date(cdate);
    let currentDate = new Date(this.form.value.bidDate);
    let days = Math.floor((date.getTime() - currentDate.getTime()) / 1000 / 60 / 60 / 24);
    if (days < 0) {
      this.form.controls['estimatedStartDate'].setValue('');
      this.utilityService.toast.error('Est. Start Date must be greater than Bid date.');
    }
  }

  checkEndDate(cdate){   
    let date = new Date(cdate);
    let currentDate = new Date(this.form.value.estimatedStartDate);
    let days = Math.floor((date.getTime() - currentDate.getTime()) / 1000 / 60 / 60 / 24);
    if (days < 0) {
      this.form.controls['estimatedEndDate'].setValue('');
      this.utilityService.toast.error('Est. End Date must be greater than Est. Start Date.');
    }
  }
  //#endregion
}
