import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  StatusList,
  ViewColumnsCust,
  CustomerData,
  ServiceOrderData,
  ServiceOrderColumns,
} from '../../../../../data/service-order-data';
import {
  orderBy,
  process,
  SortDescriptor,
  State,
} from '@progress/kendo-data-query';
import { ServiceOrderModel } from './serviceOrder.model';
import { ServiceOrderService } from './service-order.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { ErrorHandlerService, PagerService } from 'src/app/core/services';
import { ErrorMessages, ModuleNames } from 'src/app/core/constant';
import { DropdownService } from 'src/app/core/services/dropdown.service';
import { EmployeeService } from 'src/app/layout/ssg/employee/employee/employee.service';
import { BranchService } from 'src/app/layout/admin/branch/branch.service';
import { PageChangeEvent } from '@progress/kendo-angular-grid';
import { EventEmitter, Output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MenuService } from 'src/app/core/helper/menu.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-service-order',
  templateUrl: './service-order.component.html',
  styleUrls: ['./service-order.component.scss'],
})
export class ServiceOrderComponent implements OnInit {
  @Output() buttonClicked: EventEmitter<string> = new EventEmitter<string>();
  displayBarcodePopup: boolean;
  barcode: string = '';
  multiple: boolean = false;
  showTechCheck: boolean = false;
  showTechCheckRight: boolean = false;
  editClosedRight: boolean = false;
  form: FormGroup;
  screenTypeList = [];
  screenTypeListFilter = [];
  customerList = [];
  employeeList = [];
  employeeListFilter = [];
  branchList = [];
  branchListFilter = [];
  jobList = [];
  InvNumberList = [];
  istaxed: boolean;
  isRefurb: boolean;
  isFullService: boolean;
  displayHours: boolean = false;
  displayMile: boolean = false;
  displayStatusDialog: boolean = false;
  displayStatusDialogDrp: boolean = false;
  displayStatusConfirmDrp: boolean = false;
  displayType: boolean = false;
  displayINVNumberBtn: boolean = false;
  displayPitDialog: boolean = false;
  diplayitemDrp: boolean = false;
  displayItemDialog: boolean = false;
  displayJobDrp: boolean = false;
  displayBranchDrp: boolean = false;
  displayEmpDrp: boolean = false;
  displayCustDrp: boolean = false;
  isDisabled: boolean = true;
  isVoidDisabled: boolean = true;
  isEstimatePull: boolean = false;
  visible: boolean = false;
  public statusList: any;
  public viewColumnsCust: any;
  customerData: any;
  invNoList = [];
  invNoListFilter = [];
  refurbData = [];
  refurbValue: any = 'No';
  displayRefurb: boolean = false;
  status_btn: string = 'Status';
  custSearch: string = '';
  mechanicName: string = '';
  fieldhours: string = 'field hrs';
  tempfieldhours: string = '';
  lastFullService: string = '';
  lastFullServiceHours: string = '';
  lastServiceHours: string = '';
  istechCheckVisible: boolean = false;
  refurbList = [
    { id: 1, value: 'Blast / Paint' },
    { id: 2, value: 'New Engine' },
    { id: 3, value: 'New Pump' },
  ];
  createDate: Date;
  repairDate: Date;

  public viewColumns: any;
  public serviceOrderData: any;
  displayRemovePopup: any;
  hoursText: any;
  mileText: any;
  laborHrs: any;
  data: any;
  public sort: SortDescriptor[] = [
    {
      field: 'qty',
      dir: 'asc',
    },
    {
      field: 'itemCode',
      dir: 'asc',
    },
    {
      field: 'description',
      dir: 'asc',
    },
    {
      field: 'listPrice',
      dir: 'asc',
    },
    {
      field: 'total',
      dir: 'asc',
    },
    {
      field: 'cost',
      dir: 'asc',
    },
    {
      field: 'max',
      dir: 'asc',
    },
    {
      field: 'action',
      dir: 'asc',
    },
  ];
  public mySelection: number[] = [0];
  public mySelection2: number[] = [0];
  public jobSelection: number[] = [0];
  data1: any;
  public sort1: SortDescriptor[] = [
    {
      field: 'customer',
      dir: 'asc',
    },
    {
      field: 'city',
      dir: 'asc',
    },
    {
      field: 'state',
      dir: 'asc',
    },
  ];
  public mySelection1: number[] = [0];
  customerName: string;
  customerId: number;
  gridView: any[];
  tempgridView: any[];
  id: any;
  quantity: number;
  isVoid: boolean = false;
  isVehicle: boolean = false;
  isOpenTechCheck: boolean = false;
  pullEstimatebtnCount: number = 0;
  replaceEstimateItems: boolean = false;
  oldEstimateitemspk: any = [];

  constructor(
    private formBuilder: FormBuilder,
    public service: ServiceOrderService,
    private utils: UtilityService,
    public errorHandler: ErrorHandlerService,
    public pagerService: PagerService,
    public dropdownservice: DropdownService,
    public employeeService: EmployeeService,
    public branchService: BranchService,
    public datepipe: DatePipe,
    public menuService: MenuService,
    public router: Router
  ) {
   
    this.isOpenTechCheck = this.menuService.isOpenTechCheck;
    if (localStorage.getItem('isAdmin') == 'true') {
      this.showTechCheckRight=true;
    } else {
      let acc = this.menuService.checkUserViewRights('Maintain Service Orders');
      if (acc) {
        //this.utils.toast.error("User does not have rights to access " + name + " module.");Z
      } else {
        this.router.navigate(['dashboard']);
      }
      const rights = JSON.parse(localStorage.getItem('Rights'));

      this.showTechCheckRight = rights.some(
        (c) =>
          c.subModuleName == 'Service Order' &&
          c.moduleName == 'Maintain Service Orders' &&
          c.tabName == 'Open Tech Check'
      );
      // this.editClosedRight = rights.some(
      //   (c) =>
      //     c.subModuleName == 'Service Order' &&
      //     c.moduleName == 'Edit Closed Order' &&
      //     c.tabName == 'Open Tech Check'
      // );
    }
    this.menuService.checkUserBySubmoduleRights('Service Order');
  }
  ngOnInit() {
    //this.serviceOrderData = ServiceOrderData;
    this.statusList = StatusList;
    this.viewColumnsCust = ViewColumnsCust;
    //this.customerData = CustomerData;
    this.viewColumns = ServiceOrderColumns;
    this.initForm();
    this.form.disable();
    this.loadServiceType();
    //this.GetEmployee();
    this.GetBranch();
    this.GetCustomer();
    this.partList();
    this.GetJob();
  }

  initForm(): void {
    this.form = this.formBuilder.group({
      // id: [],
      // userName: [],
      // user_PK: [],
      serviceNumber: [],
      customerNumber: [],
      job: [],
      branch: [],
      type: ['', Validators.required],
      modelNumber: [],
      serialNumber: [],
      invNumber: ['', Validators.required],
      miles: [],
      hours: [],
      mechanic: [],
      repairedDate: [],
      isFullService: [],
      fullServiceDate: [],
      fullServiceBy: [],
      problem: [],
      note: [],
      refurb: [],
      salesTax: [],
      status: [],
      pitTest: [],
      mechanicChecklist: [],
      mechanicChecklistDate: [],
      mechanicChecklistBy: [],
      closed: [],
      closedDate: [],
      closedBy: [],

      //status: [true],
      // stream: [],
      // customer: [],
      createdDate: [null],
      //employee: [],
      //unitPitTest: [],
      //itemCode: [],
      //qty: [],
      //part: [],
      //listPrice: [],
      //describeProblem: [],
      //detailedDescribeofPair: [],
      //isTaxted: [],
      //isRefurb: [],
      //invNoData: [],
      //statusConfirm: ['ACTIVE'],
      //pitText: [],
      //quantity: [],
      //custSearch: [],
      //refurbData: ['refurb1'],
    });
  }
  get f() {
    return this.form.controls;
  }
  jobTotal: number = 0;
  public jobPageSize = 100;
  public partPageSize = 100;
  public jobSkip = 0;
  public partSkip = 0;
  partTotal: number = 0;
  jobSearch: string;
  partSearch: string;

  GetJob() {
    var obj = {
      pageNumber: this.pagerService.start,
      pageSize: 100,
      sortColumn: '',
      sortDesc: true,
      request: {
        searchText: this.jobSearch,
      },
    };
    this.dropdownservice.GetJobList(obj).subscribe(
      (res) => {
        if (res) {
          this.jobList = res.data;
          this.jobTotal = res.totalRecords;
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.branch.dropdown);
      }
    );
  }
  sumItemTotal: number = 0;
  salesTax: number = 0;
  salesRate: number = 0;
  total: number = 0;

  getServiceOrderItems() {
    this.serviceOrderData = [];
    this.lstItems = [];
    this.service.GetServiceOrderItems(this.id).subscribe(
      (res) => {
        if (res) {
          this.serviceOrderData = res;
          this.lstItems = res;
          this.lstItems.forEach((element) => {
            element.id = element.pk;
          });
          this.sumItemTotal = this.serviceOrderData
            .map((item) => Number.parseFloat(item.total))
            .reduce((acc, curr) => acc + curr, 0);
          this.total = this.sumItemTotal;
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.branch.dropdown);
      }
    );
  }
  GetInvNumber() {
    var branch = !this.form.value.branch ? 'All' : this.form.value.branch;
    this.dropdownservice.GetInvNumberList(branch, this.id).subscribe(
      (res) => {
        if (res) {
          this.invNoList = res;
          this.invNoListFilter = res;
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.branch.dropdown);
      }
    );
  }
  partList() {
    this.gridView = [];
    this.tempgridView = [];
    var data = {
      pageNumber: this.pagerService.start,
      pageSize: 100,
      sortColumn: '',
      sortDesc: true,
      request: {
        searchText: this.partSearch,
      },
    };
    this.service.GetPartList(data).subscribe(
      (res) => {
        if (res.data.length > 0) {
          this.gridView = res.data;
          this.tempgridView = res.data;
          this.partTotal = res.totalRecords;
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.vehicle.get_service_history);
      }
    );
  }
  customerTotal: number = 0;
  public pageSize = 100;
  public skip = 0;

  GetCustomer() {
    var obj = {
      pageNumber: this.pagerService.start,
      pageSize: 100,
      sortColumn: 'value',
      sortDesc: true,
      request: {
        searchText: this.custSearch,
      },
    };
    this.dropdownservice.GetCustomerList(obj).subscribe(
      (res) => {
        if (res) {
          this.customerData = res.data;
          this.customerTotal = res.totalRecords;
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.branch.dropdown);
      }
    );
  }
  public onPageChange(e: PageChangeEvent): void {
    this.skip = e.skip;
    this.pageSize = e.take;
    this.pagerService.start = this.skip == 0 ? 0 : this.skip / this.pageSize;
    this.GetCustomer();
  }
  public onJobPageChange(e: PageChangeEvent): void {
    this.jobSkip = e.skip;
    this.jobPageSize = e.take;
    this.pagerService.start =
      this.jobSkip == 0 ? 0 : this.jobSkip / this.jobPageSize;
    this.GetJob();
  }
  public onPartPageChange(e: PageChangeEvent): void {
    this.partSkip = e.skip;
    this.partPageSize = e.take;
    this.pagerService.start =
      this.partSkip == 0 ? 0 : this.partSkip / this.partPageSize;
    this.partList();
  }
  GetBranch() {
    this.branchService.GetBranchDropdown().subscribe(
      (res) => {
        if (res) {
          this.branchList = res;
          this.branchListFilter = res;
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.branch.dropdown);
      }
    );
  }
  loadServiceType() {
    this.dropdownservice.GetLookupList('ServiceType').subscribe(
      (res) => {
        if (res) {
          this.screenTypeList = res;
          this.screenTypeListFilter = res;
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.drop_down.vehicle_type);
      }
    );
  }
  GetEmployee() {
    this.dropdownservice.GetEmployee().subscribe(
      (res) => {
        if (res) {
          if (res.result.length > 0) {
            this.employeeList = res.result;
            this.employeeListFilter = res.result;
          }
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.employee.get_list);
      }
    );
  }
  GetSalesTax() {
    this.service.GetSalesTax(this.customerId).subscribe(
      (res) => {
        if (res) {
          this.salesRate = res.result;
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.employee.get_list);
      }
    );
  }
  selectHours() {
    this.displayHours = !this.displayHours;
  }
  selectMile() {
    this.displayMile = !this.displayMile;
  }

  onStatus(value) {
    if (value == 'No') {
      this.displayStatusDialog = !this.displayStatusDialog;
    } else if (value == 'Yes') {
      this.displayStatusDialog = !this.displayStatusDialog;
    } else {
      this.displayStatusDialog = !this.displayStatusDialog;
    }
  }
  public closeStatus(status) {
    if (status == 'Yes' && !this.displayStatusDialogDrp) {
      this.displayStatusDialogDrp = !this.displayStatusDialogDrp;
    } else if (status == 'No') {
      this.initForm();
      this.displayStatusDialog = !this.displayStatusDialog;
    } else {
      this.initForm();
      this.displayStatusDialog = !this.displayStatusDialog;
    }
  }
  addStatus(data) {
    //this.status_btn = `Status: ${data.value}`;
    if (data) {
      this.displayStatusConfirmDrp = !this.displayStatusConfirmDrp;
      //this.displayStatusDialog = !this.displayStatusDialog;
    }
    // else {
    //   this.displayStatusDialog = !this.displayStatusDialog;
    // }
  }
  closeConfirm(status) {
    if (status == 'Yes') {
      this.displayStatusConfirmDrp = !this.displayStatusConfirmDrp;
      this.form.controls['status'].setValue('VOID');
    } else if (status == 'No') {
      this.isVoid = false;
      this.displayStatusConfirmDrp = !this.displayStatusConfirmDrp;
    } else {
      this.displayStatusConfirmDrp = !this.displayStatusConfirmDrp;
    }
  }

  selectType() {
    this.displayType = !this.displayType;
  }

  selectINVNumber() {
    this.displayINVNumberBtn = !this.displayINVNumberBtn;
    if (this.form.value.invNumber) {
      var branch = this.invNoList.find(
        (c) => c.invNumber == this.form.value.invNumber
      ).branchLocation;
      this.form.controls['branch'].setValue(branch);
    }
  }

  onPitNo() {
    this.displayPitDialog = !this.displayPitDialog;
  }
  closePitDialog(status) {
    if (status == 'Yes') {
      this.displayPitDialog = !this.displayPitDialog;
      this.fieldhours = this.form.value.pitTest;
      this.tempfieldhours = this.form.value.pitTest;
    } else if (status == 'No') {
      this.displayPitDialog = !this.displayPitDialog;
      this.form.setValue({
        ...this.form.value,
        pitTest: this.tempfieldhours,
      });
    } else {
      this.displayPitDialog = !this.displayPitDialog;
    }
  }
  onItem() {
    this.diplayitemDrp = !this.diplayitemDrp;
    this.gridView = this.tempgridView;
    this.mySelection = [];
  }
  closepopup() {
    this.diplayitemDrp = !this.diplayitemDrp;
    this.quantity = null;
    this.partSearch = '';
    this.partList();
  }
  onAddItem() {
    if (!this.quantity) {
      this.displayItemDialog = true;
      this.diplayitemDrp = !this.diplayitemDrp;
      return false;
    }
    this.diplayitemDrp = !this.diplayitemDrp;
    var cust = this.gridView[this.mySelection[this.mySelection.length - 1]];
    this.getItemsDetail(cust.invType);
  }
  closeItem(status) {
    if (status == 'OK') {
      this.diplayitemDrp = !this.diplayitemDrp;
      this.displayItemDialog = !this.displayItemDialog;
    } else {
      this.displayItemDialog = !this.displayItemDialog;
    }
  }
  selectJob() {
    this.displayJobDrp = !this.displayJobDrp;
  }
  selectBranch() {
    this.displayBranchDrp = !this.displayBranchDrp;
  }
  selectEmp(id) {
    this.displayEmpDrp = !this.displayEmpDrp;
    if (id != undefined) {
      this.mechanicName = this.employeeList.find((c) => c.eeid == id).name;
    } else {
      this.mechanicName = '';
    }
  }
  selectCust() {
    this.displayCustDrp = !this.displayCustDrp;
  }
  onRemove() {
    this.displayRemovePopup = !this.displayRemovePopup;
  }
  closeRemoveDialog(status) {
    if (status == 'Yes') {
      this.displayRemovePopup = !this.displayRemovePopup;
    } else if (status == 'No') {
      this.displayRemovePopup = !this.displayRemovePopup;
    } else {
      this.displayRemovePopup = !this.displayRemovePopup;
    }
  }
  onHours($event) {
    this.hoursText = $event.target.value;
  }
  onMile($event) {
    this.mileText = $event.target.value;
  }

  onHourBtn() {
    //this.initForm();
    this.displayHours = !this.displayHours;
  }
  onMileBtn() {
    //this.initForm();
    this.displayMile = !this.displayMile;
  }
  selectRefurb() {
    this.displayRefurb = !this.displayRefurb;
  }
  refurbChange(data) {
    if (data.length > 0) {
      this.refurbValue = 'Yes';
      this.displayRefurb = true;
    } else {
      this.refurbValue = 'No';
      this.displayRefurb = false;
    }
  }
  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.data = {
      data: orderBy(this.serviceOrderData, this.sort),
      total: this.serviceOrderData.length,
    };
    this.serviceOrderData = this.data.data;
  }
  public sortChange1(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.data = {
      data: orderBy(this.customerData, this.sort),
      total: this.customerData.length,
    };
    this.customerData = this.data.data;
  }
  sortChangeJob(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.data = {
      data: orderBy(this.jobList, this.sort),
      total: this.jobList.length,
    };
    this.jobList = this.data.data;
  }
  btnAdd() {
    this.id = 0;
    this.form.reset();
    this.form.enable();
    this.serviceOrderData = [];
    this.status_btn = 'ACTIVE';
    this.customerName = '';
    this.lastFullService = '';
    this.hoursText = '';
    this.laborHrs = '';
    this.fieldhours = 'field hrs';
    this.tempfieldhours = '';
    this.isDisabled = false;
    this.isVoidDisabled = false;
    this.GetInvNumber();
  }
  btnEdit() {
    this.form.enable();
    this.isDisabled = false;
    this.isVoidDisabled = false;
    if (this.status_btn == 'CLOSED') {
      this.isVoidDisabled = true;
    }
  }
  onEdit(id) {
    this.id = id;
    this.isDisabled = true;
    this.isVoidDisabled = true;
    this.form.reset();
    this.form.disable();
    this.isEstimatePull = false;
    this.serviceOrderData = [];
    this.sumItemTotal = 0;
    this.total = 0;
    if (id != 0) {
      this.service.GetDetails(id).subscribe(
        (res) => {
          var result = res.result;
          this.service.componentized = result.componentized;
          this.showTechCheck = res.result.showTechCheck;
          this.form.setValue({
            branch: result.branch,
            closed: result.closed,
            closedBy: result.closedBy,
            closedDate: result.closedDate,
            customerNumber: result.customerNumber,
            //dateReceived: result.dateReceived,
            repairedDate: null,
            isFullService: result.fullService,
            fullServiceBy: result.fullServiceBy,
            fullServiceDate: result.fullServiceDate,
            hours: result.hours,
            invNumber: result.invNumber,
            job: result.job,
            //lastFullService: result.lastFullService,
            mechanic: result.mechanic,
            mechanicChecklist: result.mechanicChecklist,
            mechanicChecklistBy: result.mechanicChecklistBy,
            mechanicChecklistDate: result.mechanicChecklistDate,
            miles: result.miles,
            modelNumber: result.modelNumber,
            note: result.note,
            pitTest: result.pitTest,
            problem: result.problem,
            refurb: result.refurb,
            salesTax: result.salesTax,
            serialNumber: result.serialNumber,
            serviceNumber: result.serviceNumber,
            status: result.status,
            type: result.type,
            //qty: 0,
            //listPrice: 0,
            //statusConfirm: '',
            createdDate: result.createdDate,
          });
          this.getServiceOrderItems();
          this.GetInvNumber();
          this.customerName = result.customerName;
          this.customerId = result.customerNumber;
          this.lastFullService = result.lastFullService;
          this.lastServiceHours = result.lastServiceHours;
          this.lastFullServiceHours = result.lastFullServiceHours;
          this.status_btn = result.status;
          this.mechanicName = result.mechanicName;
          this.hoursText = result.hours;
          this.laborHrs = result.totalHours ?? 0;
          this.isVoid = result.status == 'Void' ? true : false;
          this.refurbValue = result.refurb == true ? 'Yes' : 'No';
          this.refurbData = result.refurbList;
          this.displayRefurb = result.refurb;
          this.isVehicle = result.isVehicleType;
          this.createDate = !result.dateReceived
            ? null
            : new Date(result.dateReceived);
          this.repairDate = !result.dateRepaired
            ? null
            : new Date(result.dateRepaired);
          this.GetSalesTax();
          this.utils.soCompClickEvent(result.componentized);
          this.fieldhours = result.pitTest;
          this.tempfieldhours = result.pitTest;

          this.displayType = false;
          this.displayEmpDrp = false;
        },
        (error) => {
          this.onError(error, ErrorMessages.vendor.add_vendor_data);
        }
      );
    } else {
      this.form.reset();
      this.form.disable();
      //this.getServiceOrderItems();
      //this.GetInvNumber();
      this.customerName = '';
      this.customerId = 0;
      this.lastFullService = '';
      this.lastServiceHours = '';
      this.lastFullServiceHours = '';
      this.status_btn = 'ACTIVE';
      this.mechanicName = '';
      this.fieldhours = 'field hrs';
      this.tempfieldhours = '';
      this.hoursText = '';
      this.laborHrs = 0;
      this.isVoid = false;
      this.refurbValue = 'No';
      //this.refurbData = result.refurbList;
      this.displayRefurb = false;
      this.isVehicle = false;
      this.createDate = null;
      this.repairDate = null;
      //this.GetSalesTax();
      //this.utils.soCompClickEvent(result.componentized);
    }
  }
  onSave(status) {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return false;
    }
    if (this.form.value.status != 'VOID') {
      this.form.controls['status'].setValue(status);
    } else {
      this.form.controls['status'].setValue('VOID');
    }
    const data = new ServiceOrderModel();
    data.serviceNumber = this.form.value.serviceNumber;
    data.customerNumber = this.form.value.customerNumber;
    data.job = this.form.value.job;
    data.branch = this.form.value.branch;
    data.type = this.form.value.type;
    data.modelNumber = this.form.value.modelNumber;
    data.serialNumber = this.form.value.serialNumber;
    data.invNumber = this.form.value.invNumber;
    data.miles = this.form.value.miles;
    data.hours = this.form.value.hours;
    data.mechanic = this.form.value.mechanic;

    if (this.repairDate) {
      data.dateRepaired = this.datepipe.transform(
        this.repairDate,
        'MM/dd/yyyy'
      );
    } else {
      data.dateRepaired = null;
    }
    //data.dateRepaired = this.form.value.repairedDate;
    data.fullService = this.form.value.isFullService;
    data.fullServiceDate = this.form.value.fullServiceDate;
    data.fullServiceBy = this.form.value.fullServiceBy;
    data.problem = this.form.value.problem;
    data.note = this.form.value.note;
    data.refurb = this.displayRefurb;
    data.salesTax = this.form.value.salesTax;
    data.status = this.form.value.status;
    data.pitTest = this.form.value.pitTest;
    data.mechanicChecklist = this.form.value.mechanicChecklist;
    data.mechanicChecklistDate = this.form.value.mechanicChecklistDate;
    data.mechanicChecklistBy = this.form.value.mechanicChecklistBy;
    data.closed = this.form.value.closed;
    data.closedDate = this.form.value.closedDate;
    data.closedBy = this.form.value.closedBy;
    data.userName = JSON.parse(localStorage.getItem('currentUser')).userName;
    data.user_PK = JSON.parse(localStorage.getItem('currentUser')).id;
    data.items = this.lstItems;
    data.refurbList = this.refurbData;
    if (data.serviceNumber) {
      this.service.UpdateServiceOrder(data).subscribe(
        (res) => {
          if (res['status'] == 200) {
            this.utils.toast.success(res['message']);
            // this.SaveEditClick.emit(res);
          } else this.utils.toast.error(res['message']);
          this.form.reset();
          this.refurbData = [];
          this.form.disable();
          if (this.isEstimatePull == true) {
          }
          this.isEstimatePull = false;
          return true;
        },
        (error) => {
          this.onError(error, ErrorMessages.vendor.add_vendor_data);
        }
      );
    } else {
      this.service.SaveServiceOrder(data).subscribe(
        (res) => {
          if (res['status'] == 200) {
            this.utils.toast.success(res['message']);
            // this.SaveEditClick.emit(res);
          } else this.utils.toast.error(res['message']);
          this.form.reset();
          this.refurbData = [];
          this.form.disable();
          return true;
        },
        (error) => {
          this.onError(error, ErrorMessages.vendor.add_vendor_data);
        }
      );
    }
  }
  dblClickEvent(event) {
    var cust = this.customerData[this.mySelection1[0]];
    this.form.controls['customerNumber'].setValue(cust.id);
    this.customerName = cust.value;
    this.displayCustDrp = false;
  }
  dblClickJobEvent(event) {
    var job = this.jobList[this.jobSelection[0]];
    this.form.controls['job'].setValue(job.jobNumber);
    this.displayJobDrp = false;
  }
  dblClickInvntoryEvent(event) {
    var cust = this.gridView[this.mySelection[this.mySelection.length - 1]];
    this.getItemsDetail(cust.invType);
  }
  lstItems = [];
  getItemsDetail(invType) {
    this.visible = true;
    this.mySelection = [];
    // if (!this.form.value.branch) {
    //   this.utils.toast.error('Please select branch.');
    //   this.closepopup();
    //   return false;
    // }
    var branch = !this.form.value.branch ? 'All' : this.form.value.branch;
    this.service.GetItemsDetail(branch, invType).subscribe(
      (res) => {
        this.visible = false;
        if (res) {
          //res[0].qty = this.quantity;
          var isExist = this.serviceOrderData.find(
            (c) => c.vPartNumber == res[0].invType
          );
          if (isExist && isExist.custom == false) {
            isExist.quantity = isExist.quantity + this.quantity;
          } else {
            var obj = {
              pk: res[0].pk,
              partNumber: res[0].pk,
              vPartNumber: res[0].invType,
              quantity: this.quantity,
              cost: res[0].cost ?? 0.0,
              listPrice: res[0].listPrice ?? 0.0,
              total: res[0].cost * this.quantity,
              description: res[0].description,
              id: 0,
              custom: res[0].custom,
            };
            this.serviceOrderData.push(obj);
          }
          var objItem = {
            id: 0,
            quantity: this.quantity,
            partNumber: res[0].pk,
            vPartNumber: res[0].invType,
            description: res[0].description,
            cost: res[0].cost,
            total: res[0].cost * this.quantity,
            listPrice: res[0].listPrice ?? 0,
          };
          //this.lstItems.push(objItem);
          // if (this.id) {
          //   var addObj = {
          //     "serviceNumber": this.id,
          //     "items": this.lstItems
          //   }
          //   this.service.AddItems(addObj).subscribe(
          //     (res) => {
          //       this.lstItems = [];
          //       //this.utils.toast.success(res.message);
          //       this.serviceOrderData = res.result;
          //       this.sumItemTotal = this.serviceOrderData.map((item) => Number.parseFloat(item.total)).reduce((acc, curr) => acc + curr, 0);
          //       this.total = this.sumItemTotal;
          //     }
          //   )
          // } else {

          this.getItemTotal();
          //}
        }
        this.quantity = null;
      },
      (error) => {
        this.onError(error, ErrorMessages.branch.dropdown);
      }
    );
  }
  deleteItem(dataItem, id) {
    if (this.id && id != 0) {
      this.service.DeleteItems(dataItem).subscribe(
        (res) => {
          if (res) {
            var id = this.serviceOrderData.findIndex((c) => c.pk == dataItem);
            this.serviceOrderData.splice(id, 1);
            this.lstItems.slice(id, 1);
            this.utils.toast.success(res.message);
            //this.getServiceOrderItems();
          }
        },
        (error) => {
          this.onError(error, ErrorMessages.branch.dropdown);
        }
      );
    } else {
      var id = this.serviceOrderData.findIndex((c) => c.pk == dataItem);
      this.serviceOrderData.splice(id, 1);
      this.lstItems.slice(id, 1);
    }
  }
  public onFilter(inputValue: string): void {
    this.gridView = process(this.tempgridView, {
      filter: {
        logic: 'or',
        filters: [
          {
            field: 'invType',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'description',
            operator: 'contains',
            value: inputValue,
          },
        ],
      },
    }).data;
    this.mySelection = [];
  }
  setSalesTax(event) {
    if (event) {
      this.salesTax = (this.sumItemTotal * (this.salesRate ?? 0)) / 100;
      this.total = this.sumItemTotal + this.salesTax;
    } else {
      this.salesTax = 0;
      this.total = this.sumItemTotal;
    }
  }
  onTechCheckList() {
    if (this.isOpenTechCheck) {
      this.buttonClicked.emit(this.id);
    } else {
      this.utils.toast.error(
        'You do not have permissions to access this part of the system. Please contact your supervisor so they can request them from IT.'
      );
    }
  }
  checkValue(event) {
    if (event.target.value < 0) {
      this.quantity = 0;
    }
  }
  public rowClass = (args) => ({
    'k-disabled': this.isDisabled == false ? false : true,
  });
  public cellClickHandler({
    sender,
    rowIndex,
    columnIndex,
    dataItem,
    isEdited,
  }) {
    if (!isEdited) {
      if (columnIndex == 2 && dataItem.custom == true) {
        sender.editCell(rowIndex, columnIndex, this.createFormGroup(dataItem));
      } else if (columnIndex != 2) {
        sender.editCell(rowIndex, columnIndex, this.createFormGroup(dataItem));
      }
    } else {
      // dataItem.loadQty = 1;
    }
  }
  public cellCloseHandler(args: any) {
    const { formGroup, dataItem } = args;
    if (formGroup.controls['listPrice'].status == 'INVALID') {
      this.utils.toast.error(
        'Please use a positive decimal number upto 2 places.'
      );
      formGroup.value.listPrice.setValue(0);
      args.preventDefault();
    } else if (formGroup.controls['quantity'].status == 'INVALID') {
      this.utils.toast.error('Please use a positive whole number.');
      formGroup.value.quantity.setValue(0);
      // prevent closing the edited cell if there are invalid values.
      args.preventDefault();
    } else if (formGroup.dirty) {
      dataItem.quantity = formGroup.value.quantity;
      dataItem.listPrice = formGroup.value.listPrice;
      dataItem.description = formGroup.value.description;
      dataItem.total = formGroup.value.quantity * formGroup.value.listPrice;
      var id = this.lstItems.findIndex((c) => c.pk == dataItem.pk);
      var itm = this.lstItems[id];
      itm.listPrice = formGroup.value.listPrice;
      itm.quantity = formGroup.value.quantity;
      itm.total = dataItem.total;
      this.getItemTotal();
    }
  }
  public createFormGroup(dataItem: any): FormGroup {
    return this.formBuilder.group({
      quantity: [
        dataItem.quantity,
        Validators.compose([
          Validators.required,
          Validators.pattern('^[0-9]{1,3}'),
        ]),
      ],
      listPrice: [
        Number(dataItem.listPrice).toFixed(2),
        Validators.compose([
          Validators.required,
          Validators.pattern('^[0-9]\\d*(\\.\\d{1,2})?$'),
        ]),
      ],
      description: [dataItem.description],
    });
  }
  getItemTotal() {
    this.sumItemTotal = 0;
    this.serviceOrderData.forEach((element) => {
      this.sumItemTotal = this.sumItemTotal + element.total;
    });
    this.total = this.sumItemTotal;
  }
  invNumberFilter(value) {
    this.invNoList = this.invNoListFilter.filter(
      (s) => s.invNumber.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }
  technicianFilter(value) {
    this.employeeList = this.employeeListFilter.filter(
      (s) => s.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }
  branchFilter(value) {
    this.branchList = this.branchListFilter.filter(
      (s) => s.value.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }
  typeFilter(value) {
    this.screenTypeList = this.screenTypeListFilter.filter(
      (s) => s.value.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }
  private onError(error: any, customMessage?: string) {
    this.errorHandler.handleError(error, ModuleNames.vehicle, customMessage);
  }

  public onBarcode(): void {
    this.displayBarcodePopup = !this.displayBarcodePopup;
  }
  addBarcode() {
    this.visible = true;
    if (!this.barcode) {
      this.utils.toast.error('Please enter barcode.');
      return false;
    }
    if (!this.form.value.branch) {
      this.utils.toast.error('Please select branch.');
      return false;
    }
    this.service
      .AddBarcode(this.barcode, this.form.value.branch ?? 'All')
      .subscribe(
        (res) => {
          this.visible = false;
          var isExist = this.serviceOrderData.find(
            (c) => c.vPartNumber == res[0].invType
          );
          if (isExist && isExist.custom == false) {
            isExist.quantity = isExist.quantity + 1;
          } else {
            var obj = {
              pk: res[0].pk,
              partNumber: res[0].pk,
              vPartNumber: res[0].invType,
              quantity: 0,
              cost: res[0].cost ?? 0.0,
              listPrice: res[0].listPrice ?? 0.0,
              total: 0,
              description: res[0].description,
              id: 0,
              custom: res[0].custom,
            };
            this.serviceOrderData.push(obj);
          }
          this.barcode = '';
          this.displayBarcodePopup = !this.displayBarcodePopup;
        },
        (failed) => {}
      );
  }
  closebarcodepopup() {
    this.barcode = '';
    this.displayBarcodePopup = !this.displayBarcodePopup;
  }
  pullEstimateItems() {
    if (this.pullEstimatebtnCount <= 0) {
      this.visible = true;
      this.service.GetEstimateItems(this.id).subscribe(
        (res) => {
          if (res && res.length > 0) {
            // this.lstItems.push(res);
            this.oldEstimateitemspk = [];
            res.forEach((element) => {
              var obj = {
                pk: element.pk,
                partNumber: element.pk,
                vPartNumber: element.itemCode,
                quantity: element.quantity,
                cost: element.cost ?? 0.0,
                listPrice: element.listPrice ?? 0.0,
                total: element.total,
                description: element.description,
                id: 0,
                custom: element.custom,
              };
              this.serviceOrderData.push(obj);
              this.oldEstimateitemspk.push(obj.pk);
            });
            this.isEstimatePull = true;
            this.sumItemTotal = this.serviceOrderData
              .map((item) => Number.parseFloat(item.total))
              .reduce((acc, curr) => acc + curr, 0);
            this.total = this.sumItemTotal;
            this.pullEstimatebtnCount = this.pullEstimatebtnCount + 1;
            this.visible = false;
          }
        },
        (error) => {
          this.onError(error, ErrorMessages.vehicle.get_service_history);
        }
      );
    } else {
      this.replaceEstimateItems = true;
    }
  }

  closeEstimateItem(data: any) {
    if (data == 'No') {
      this.replaceEstimateItems = false;
    } else {
      this.visible = true;
      this.serviceOrderData = this.serviceOrderData.filter(
        (item) => !this.oldEstimateitemspk.some((e) => e == item.pk)
      );
      this.service.GetEstimateItems(this.id).subscribe(
        (res) => {
          if (res && res.length > 0) {
            // this.lstItems.push(res);
            this.oldEstimateitemspk = [];
            res.forEach((element) => {
              var obj = {
                pk: element.pk,
                partNumber: element.pk,
                vPartNumber: element.itemCode,
                quantity: element.quantity,
                cost: element.cost ?? 0.0,
                listPrice: element.listPrice ?? 0.0,
                total: element.total,
                description: element.description,
                id: 0,
                custom: element.custom,
              };
              this.serviceOrderData.push(obj);
              this.oldEstimateitemspk.push(obj.pk);
            });
            this.isEstimatePull = true;
            this.sumItemTotal = this.serviceOrderData
              .map((item) => Number.parseFloat(item.total))
              .reduce((acc, curr) => acc + curr, 0);
            this.total = this.sumItemTotal;
            this.pullEstimatebtnCount = this.pullEstimatebtnCount + 1;
            this.visible = false;
            this.replaceEstimateItems = false;
          }
        },
        (error) => {
          this.onError(error, ErrorMessages.vehicle.get_service_history);
        }
      );
    }
  }

  onHandleOperations(type, event = null) {
    switch (type) {
      case 'tech-check':
        this.istechCheckVisible = !this.istechCheckVisible;
        break;

      default:
        break;
    }
  }
}
