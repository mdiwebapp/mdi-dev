import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { CallLogService } from '../call-log/call-log.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { PageChangeEvent } from '@progress/kendo-angular-grid';
import { process, orderBy, SortDescriptor } from '@progress/kendo-data-query';
import { PaginationWithSortRequest } from 'src/app/core/models/pagination.model';
import { ErrorHandlerService } from 'src/app/core/services';
import { PagerService } from 'src/app/core/services/pager.service';
import { DropdownService } from 'src/app/core/services/dropdown.service';
import { CallLogModel } from '../call-log/call-log.model';
import { MenuService } from 'src/app/core/helper/menu.service';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { ErrorMessages } from 'src/app/core/constant';
import { otherColumns } from 'src/data/employee-data';

@Component({
  selector: 'app-call-log',
  templateUrl: './call-log.component.html',
  styleUrls: ['./call-log.component.scss'],
})
export class CallLogsComponent implements OnInit {
  form: FormGroup;
  mdiRepList = [];
  visible: boolean;
  isCustomerVisible: boolean = false;
  filterchange: boolean = false;
  public mask = '(000) 000-0000';
  total: number;
  customerdataValue: string = 'Select Customer';
  isMDIRepVisible: boolean = false
  dropdownFilterOption: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'startsWith',
  };

  branchList = [];
  branchListWithId: any = [];
  customerList: any = [];
  keywordData: any = [];
  customerTypeList: any = [];
  stateList: any = [];
  contactTypeList: any = [
    {
      label: 'phone',
      value: 'PHONE',
    },
    {
      label: 'in person',
      value: 'IN PERSON',
    },
    {
      label: 'e-mail',
      value: 'E-MAIL',
    },
  ];
  followUpMethodList: any = [
    {
      label: 'phone',
      value: 'PHONE',
    },
    {
      label: 'in person',
      value: 'IN PERSON',
    },
    {
      label: 'e-mail',
      value: 'E-MAIL',
    },
    {
      label: 'none',
      value: 'NONE',
    },
  ];
  contactReasonList: any = [];
  rentalList: any = [
    {
      label: 'pump',
      value: 'PUMP',
    },
    {
      label: 'power',
      value: 'POWER',
    },
    {
      label: 'other',
      value: 'OTHER',
    },
    {
      label: 'both',
      value: 'BOTH',
    },
  ];
  salesList: any = [
    {
      label: 'pump',
      value: 'PUMP',
    },
    {
      label: 'power',
      value: 'POWER',
    },
    {
      label: 'other',
      value: 'OTHER',
    },
    {
      label: 'both',
      value: 'BOTH',
    },
  ];
  displayRentalDrp: boolean = false;
  displaySalesDrp: boolean = false;
  displayFollowUpSection: boolean = false;
  displayMDIProjectSection: boolean = false;
  followUpReasonList: any = [];
  jobNumberList: any = [];
  displayJobSearch: boolean = false;
  existingCustomerList: any = [];
  displayExistingCustomer: boolean = false;
  displayInvalidPopup: boolean = false;
  isEditable: boolean = true;
  searchText: string = '';
  customerData: any = [];
  public totalData: any = 0;
  skip: number = 0;
  public pageSize = 100;
  public pageNumber = 1;
  public currentPage = 1;
  tempPageNo: number;
  pageSizeList: any = [
    { id: 0, value: 100 },
    { id: 0, value: 300 },
    { id: 0, value: 500 },
  ];
  customerselections = [];
  request = new PaginationWithSortRequest<any>();
  public customersort: SortDescriptor[] = [
    {
      field: 'value',
      dir: 'asc',
    },
    {
      field: 'id',
      dir: 'asc',
    },
  ];
  isBranchselected: boolean = true;
  selectedUser: string = null;
  selectedBranch: string = null;
  employees = [];
  sort: SortDescriptor[] = [
    {
      field: 'fileName',
      dir: 'asc',
    },
  ];
  searchColumns: any = [
    {
      Name: 'job',
      isCheck: true,
      Text: 'JoB',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'customer',
      isCheck: true,
      Text: 'Customer',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'status',
      isCheck: true,
      Text: 'Status',
      isDisable: false,
      index: 0,
      width: 100,
    },
  ];
  And1: string = "";
  And2: string = "";
  Or1: string = "";
  Or2: string = "";
  customerId: string = "";
  callLogId: string = "";
  // filterCollection: any = {
  //   And1: '',
  //   And2: '',
  //   Or1: '',
  //   Or2: '',
  // };
  constructor(
    private formBuilder: FormBuilder,
    public router: Router,
    private service: CallLogService,
    private utility: UtilityService,
    public pagerService: PagerService,
    public menuService: MenuService,
    public dropDownService: DropdownService,
    public errorHandler: ErrorHandlerService, private route: ActivatedRoute
  ) {
    if (localStorage.getItem('isAdmin') == 'true') {
    } else {
      let acc = this.menuService.checkUserViewRights('Call Log');
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
    }
    this.menuService.checkUserBySubmoduleRights('Call Log');
  }
  ngOnInit(): void {
    this.initForm();
    const user = JSON.parse(this.utility.storage.getItem('currentUser'));
    const branch = JSON.parse(
      this.utility.storage.getItem('selectedBranch')
    )?.[0];
    this.route.queryParams
      .subscribe(params => {
        this.customerId = params.customerId;
        this.callLogId = params.callLogId;
      }
      );
    // this.form.setValue({
    //   ...this.form.value,
    //   mdiRepData: user?.id,
    //   mdiBranch: branch?.value,
    // });
    this.selectedUser = user?.id;
    this.selectedBranch = branch?.value;
    this.loadDropdowns();
    this.loadData();
    this.loadMDIRepDropdown();
   
    if (this.callLogId) {
      setTimeout(() => {
        this.getCallLogDetail(this.callLogId);
      }, 1000);
    }else{
      this.getUserAndLoction(this.selectedUser);
    }
  }
  loadData() {
    this.visible = true;
    var request = { "And1": this.And1, "And2": this.And2, "Or1": this.Or1, "Or2": this.Or2, "Branch": this.form.value.mdiBranch };
    // request.pageNumber = this.pagerService.start;
    // request.pageSize = this.pagerService.pageSize;
    // request.sortColumn = this.sort[0].field;
    // request.sortDesc = this.sort[0].dir == 'desc' ? true : false;
    //request.request = this.filterCollection;
    // request.And1= this.And1;
    // request.And2= this.And2;
    // request.Or1 = this.Or1;
    // request.Or2 = this.Or2;
    // request.Branch= this.form.value.mdiBranch

    this.dropDownService.GetSalesJobKeywordSearch(request).subscribe(
      (res) => {
        this.keywordData = res;
        this.total = res.length;
        this.visible = false;
      },
      (error) => {
        this.onError(error, 'Error getting Doc. Search data.');
      }
    );
  }
  OnChangeFilter(data: any) {
    if (data) {
      this.filterchange = true;
      this.Or1 = '';
      this.Or2 = '';
      this.loadData();
    } else {
      this.filterchange = false;
      this.And1 = '';
      this.And2 = '';
      this.loadData();
    }
  }
  clearSearch() {
    this.Or1 = '';
    this.Or2 = '';
    this.And1 = '';
    this.And2 = '';
    this.pagerService.start = 1;
    this.loadData();
  }
  onResizeColumn(event) { }
  private onError(error: any, customMessage?: string) {
    this.errorHandler.handleError(error, 'Document search', customMessage);
  }
  onReOrderColumns(event) { }

  onSortChange(sort: SortDescriptor[]) {
    this.sort = sort;
    this.loadDropdowns();
  }

  loadDropdowns() {

    this.loadMDIBranchDropdown();
    //this.loadCustomerList();
    this.loadCustomerData();
    this.loadCustomerTypes();
    this.loadStateList();
    //this.loadExisitingContactName();
    this.loadContactReasonList();
    this.loadFollowupReasonList();
    //this.loadGetJobNumberList();
    this.loadSalesCallLogJobData();
  }
  exportToExcelData() {
    this.visible = false;
    this.visible = true;
    var data = {
      keyword1: this.form.value.Or1,
      keyword2: this.form.value.And1,
      keyword3: this.form.value.Or2,
      keyword4: this.form.value.And1,
      branch: this.form.value.mdiBranch,
    };
    this.service.exportToExcel(data).subscribe(
      (res) => {
        if (res.size > 0) {
          saveAs(res, 'SalesCallLog_Job.xlsx');
          this.visible = true;
          this.visible = false;
        } else {
          this.visible = true;
          this.visible = false;
        }
      },
      (error) => {
        this.visible = true;
        this.visible = false;
      }
    );
  }
  loadSalesCallLogJobData() {
    this.visible = false;
    this.visible = true;
    this.dropDownService.GetSalesCallLogJobName().subscribe(
      (res) => {
        if (res != null) {
          this.jobNumberList = res.map((res) => {
            return {
              label: res.value,
              value: res.id,
            };
          });
        }
        this.visible = true;
        this.visible = false;
      },
      (error) => {
        this.visible = true;
        this.visible = false;
      }
    );
  }
  loadMDIBranchDropdown() {
    this.visible = false;
    this.visible = true;
    this.service.GetMDIBranchList().subscribe(
      (res) => {
        if (res != null) {
          this.branchListWithId = res;
          this.branchList = res.map((res) => {
            return {
              label: res.value,
              value: res.code,
            };
          });
        }
        this.visible = true;
        this.visible = false;
      },
      (error) => {
        this.visible = true;
        this.visible = false;
      }
    );
  }

  onvaluechangeBranch(data: any) {
    this.visible = false;
    this.visible = true;
    this.isBranchselected = true;
    this.service.GetJobNumberList(data.value).subscribe(
      (res) => {
        if (res != null) {
          this.jobNumberList = res.map((res) => {
            return {
              label: res.value,
              value: res.id,
            };
          });
        }
        this.visible = true;
        this.visible = false;
      },
      (error) => {
        this.visible = true;
        this.visible = false;
      }
    );
  }

  loadCustomerData() {
    this.visible = false;
    this.visible = true;
    var obj = {
      pageNumber: this.pagerService.start,
      pageSize: this.pageSize,
      sortColumn: 'value',
      sortDesc: true,
      request: {
        searchText: this.searchText,
      },
    };
    this.dropDownService.GetCustomerList(obj).subscribe((res) => {
      this.customerData = res.data;
      this.totalData = res.totalRecords;
      this.visible = true;
      this.visible = false;
      if (this.customerId) {
        this.form.setValue({
          ...this.form.value,
          customerId: this.customerId
        });
        this.getCustomerDetails(this.customerId);
      }

    });
  }

  public onPageChange(e: PageChangeEvent): void {
    this.skip = e.skip;
    this.pagerService.pageSize = e.take;
    this.pagerService.start =
      this.skip == 0 ? 1 : this.skip / this.pagerService.pageSize + 1;
    this.loadDropdowns();
  }
  onPageSizechange(pagesize) {
    this.pagerService.pageSize = pagesize;
    this.pagerService.start =
      this.skip == 0 ? 1 : this.skip / this.pagerService.pageSize + 1;
    this.loadDropdowns();
  }

  onFilter(value): void {
    this.searchText = value;
    this.loadCustomerData();
  }

  loadContactReasonList() {
    this.visible = false;
    this.visible = true;
    this.service.GetContactReasonList('CRMReason').subscribe(
      (res) => {
        if (res != null) {
          this.contactReasonList = res.map((res) => {
            return {
              label: res.value,
              value: res.id,
            };
          });
        }
        this.visible = true;
        this.visible = false;
      },
      (error) => {
        this.visible = true;
        this.visible = false;
      }
    );
  }

  loadFollowupReasonList() {
    this.visible = false;
    this.visible = true;
    this.service.GetContactReasonList('CRMReason').subscribe(
      (res) => {
        if (res != null) {
          this.followUpReasonList = res.map((res) => {
            return {
              label: res.value,
              value: res.id,
            };
          });
        }
        this.visible = true;
        this.visible = false;
      },
      (error) => {
        this.visible = true;
        this.visible = false;
      }
    );
  }

  loadStateList() {
    this.visible = false;
    this.visible = true;
    this.service.GetStateList('States').subscribe(
      (res) => {
        if (res != null) {
          this.stateList = res.map((res) => {
            return {
              label: res.value,
              value: res.id,
            };
          });
        }
        this.visible = true;
        this.visible = false;
      },
      (error) => {
        this.visible = true;
        this.visible = false;
      }
    );
  }

  loadCustomerTypes() {
    this.visible = false;
    this.visible = true;
    this.service.GetCustomerTypes('CRMCustomerType').subscribe(
      (res) => {
        if (res != null) {
          this.customerTypeList = res.map((res) => {
            return {
              label: res.value,
              value: res.id,
            };
          });
        }
        this.visible = true;
        this.visible = false;
      },
      (error) => {
        this.visible = true;
        this.visible = false;
      }
    );
  }

  loadCustomerList() {
    this.visible = false;
    this.visible = true;
    this.service.GetCustomerList().subscribe(
      (res) => {
        if (res.result != null) {
          this.customerList = res.result.map((res) => {
            return {
              label: res.customerName,
              value: res.customerName,
            };
          });
        }
        this.visible = true;
        this.visible = false;
      },
      (error) => {
        this.visible = true;
        this.visible = false;
      }
    );
  }

  loadMDIRepDropdown() {
    this.visible = false;
    this.visible = true;
    this.service.GetMDIRepDropdown().subscribe(
      (res) => {
        if (res.result != null) {
          this.employees = res?.result;
          this.mdiRepList = res.result.map((res) => {
            return {
              label: res.employeeName,
              value: res.eeid,
            };
          });
        }
        this.visible = true;
        this.visible = false;
      },
      (error) => {
        this.visible = true;
        this.visible = false;
      }
    );
  }

  valuemdiRepChange(event: any) {
    if (this.employees?.length) {
      let employee = this.employees.find((item) => item.eeid == event?.value);
      let branch = this.branchList.find(
        (item) => item.label == employee.branch
      );
      this.form.setValue({
        ...this.form.value,
        mdiRep: employee?.employeeName,
        mdiRepData: employee?.eeid,
        mdiBranch: branch?.value,
      });
      this.onToggleMDIRep()
    }
  }

  initForm(): void {
    this.form = this.formBuilder.group({
      callDate: ['', [Validators.required]],
      mdiRep: [],
      mdiRepData: [
        this.selectedUser ? this.selectedUser : '',
        [Validators.required],
      ],
      mdiBranch: [
        this.selectedBranch ? this.selectedBranch : '',
        [Validators.required],
      ],
      customerType: [],
      address1: [],
      address2: [],
      city: [],
      state: [],
      zipCode: [],
      phone: [],
      fax: [],
      contactName1: [],
      contactName2: [],
      existingContact: [false],
      phoneContact: [],
      position: [],
      mobile: [],
      email: [],
      creditAppSent: [false],
      contactTypeData: [],
      contactReasonData: [],
      pumps: [false],
      dewatering: [false],
      trenching: [false],
      power: [false],
      environmental: [false],
      rental: [false],
      sales: [false],
      rentalData: [],
      salesData: [],
      vendor: [],
      comments: [],
      followUp: [false],
      mdiProject: [false],
      followUpDate: [],
      followUpReason: [],
      followUpMethod: [],
      jobNumber: [],
      existingCustomer: [],
      customerId: ['', [Validators.required]],
      customerName: [],
      searchTerm1: [],
      searchTerm2: [],
    });
  }

  rentalChange(event) {
    this.displayRentalDrp = !this.displayRentalDrp;
    if (event) {
      this.form.get('rentalData').setValidators([Validators.required]);
      this.form.get('rentalData').updateValueAndValidity();
    } else {
      this.form.get('rentalData').clearValidators();
      this.form.get('rentalData').updateValueAndValidity();
    }
  }
  salesChange(event) {
    this.displaySalesDrp = !this.displaySalesDrp;
    if (event) {
      this.form.get('salesData').setValidators([Validators.required]);
      this.form.get('salesData').updateValueAndValidity();
    } else {
      this.form.get('salesData').clearValidators();
      this.form.get('salesData').updateValueAndValidity();
    }
  }
  onFollowUpSection(status) {
    this.displayFollowUpSection = !this.displayFollowUpSection;
    if (status) {
      this.form.get('followUpDate').setValidators([Validators.required]);
      this.form.get('followUpDate').updateValueAndValidity();
      this.form.get('followUpReason').setValidators([Validators.required]);
      this.form.get('followUpReason').updateValueAndValidity();
      this.form.get('followUpMethod').setValidators([Validators.required]);
      this.form.get('followUpMethod').updateValueAndValidity();
    } else {
      this.form.get('followUpDate').clearValidators();
      this.form.get('followUpDate').updateValueAndValidity();
      this.form.get('followUpReason').clearValidators();
      this.form.get('followUpReason').updateValueAndValidity();
      this.form.get('followUpMethod').clearValidators();
      this.form.get('followUpMethod').updateValueAndValidity();
    }
  }
  onMDIProjectSection(event) {
    var branch = this.form.value.mdiBranch;
    if (branch != null && branch != '') {
      this.displayMDIProjectSection = !this.displayMDIProjectSection;
      if (event) {
        this.form.get('jobNumber').setValidators([Validators.required]);
        this.form.get('jobNumber').updateValueAndValidity();
      } else {
        this.form.get('jobNumber').clearValidators();
        this.form.get('jobNumber').updateValueAndValidity();
      }
    } else {
      this.isBranchselected = false;
      this.form.setValue({
        ...this.form.value,
        mdiProject: false,
      });
    }
  }
  onJobSearch() {
    this.displayJobSearch = !this.displayJobSearch;
    this.clearSearch()
  }

  onCustomer() {
    this.router.navigate([]).then((result) => {
      window.open(`/customer`, '_blank');
    });
  }
  public close(status) {
    if (status == 'cancel') {
      this.displayJobSearch = !this.displayJobSearch;
    } else {
      this.displayJobSearch = !this.displayJobSearch;
    }
  }
  onExistingContact(data) {
    this.displayExistingCustomer = !this.displayExistingCustomer;
    if (data) {
      this.form.get('existingCustomer').setValidators([Validators.required]);
      this.form.get('existingCustomer').updateValueAndValidity();
      this.form.get('contactName1').clearValidators();
      this.form.get('contactName1').updateValueAndValidity();
      this.form.get('contactName2').clearValidators();
      this.form.get('contactName2').updateValueAndValidity();
    } else {
      this.form.get('contactName1').setValidators([Validators.required]);
      this.form.get('contactName1').updateValueAndValidity();
      this.form.get('contactName2').setValidators([Validators.required]);
      this.form.get('contactName2').updateValueAndValidity();
      this.form.get('existingCustomer').clearValidators();
      this.form.get('existingCustomer').updateValueAndValidity();
    }
  }

  onHandleOperation(type) {
    switch (type) {
      case 'customer':
        this.isCustomerVisible = !this.isCustomerVisible;
        break;
      default:
        break;
    }
  }

  onRowSelect(event, type) {
    switch (type) {
      case 'customer':
        this.isCustomerVisible = false;
        this.form.setValue({
          ...this.form.value,
          customerId: `${event.selectedRows[0].dataItem.id}`,
          customerName: `${event.selectedRows[0].dataItem.value}`,
        });
        this.addValidationforCustomer();
        this.customerdataValue = event.selectedRows[0].dataItem.value;
        this.getCustomerDetails(event.selectedRows[0].dataItem.id);

        break;
      default:
        break;
    }
  }

  addValidationforCustomer() {
    this.form.get('address1').setValidators([Validators.required]);
    // this.form.get("address1").updateValueAndValidity();
    this.form.get('customerType').setValidators([Validators.required]);
    this.form.get('customerType').updateValueAndValidity();
    this.form.get('city').setValidators([Validators.required]);
    //this.form.get("city").updateValueAndValidity();
    this.form.get('state').setValidators([Validators.required]);
    //this.form.get("state").updateValueAndValidity();
    this.form.get('zipCode').setValidators([Validators.required]);
    //this.form.get("zipCode").updateValueAndValidity();
    this.form
      .get('phone')
      .setValidators([
        Validators.required,
        Validators.pattern('^[0-9]*$'),
        Validators.minLength(10),
        Validators.maxLength(10),
      ]);
    //this.form.get("phone").updateValueAndValidity();
    this.form
      .get('phoneContact')
      .setValidators([
        Validators.required,
        Validators.pattern('^[0-9]*$'),
        Validators.minLength(10),
        Validators.maxLength(10),
      ]);
    //this.form.get("phoneContact").updateValueAndValidity();
    this.form.get('position').setValidators([Validators.required]);
    //this.form.get("position").updateValueAndValidity();
    this.form
      .get('mobile')
      .setValidators([
        Validators.required,
        Validators.pattern('^[0-9]*$'),
        Validators.minLength(10),
        Validators.maxLength(10),
      ]);
    //this.form.get("mobile").updateValueAndValidity();
    this.form
      .get('email')
      .setValidators([Validators.required, Validators.email]);
    //this.form.get("email").updateValueAndValidity();

    //this.form.get("contactName2").updateValueAndValidity();
    this.form.get('contactTypeData').setValidators([Validators.required]);
    this.form.get('contactTypeData').updateValueAndValidity();
    this.form.get('contactReasonData').setValidators([Validators.required]);
    this.form.get('contactReasonData').updateValueAndValidity();

    if (this.form.value.existingContact) {
      this.form.get('existingCustomer').setValidators([Validators.required]);
    } else {
      this.form.get('contactName1').setValidators([Validators.required]);
      //this.form.get("contactName1").updateValueAndValidity();
      this.form.get('contactName2').setValidators([Validators.required]);
    }
  }

  getCustomerDetails(id: any) {
    this.visible = false;
    this.visible = true;
    this.service.GetCustomerDetail(id).subscribe(
      (res) => {
        this.form.controls['address1'].setValue(res.address);
        this.form.controls['address2'].setValue(res.address2);
        this.form.controls['customerType'].setValue(res.customerType);
        this.form.controls['city'].setValue(res.city);
        this.form.controls['zipCode'].setValue(res.zip);
        this.form.controls['phone'].setValue(res.phone);
        this.form.controls['fax'].setValue(res.fax);
        this.form.controls['state'].setValue(res.state);
        this.visible = true;
        this.visible = false;
        this.customerdataValue = res.customerName;
        this.form.setValue({
          ...this.form.value,
          customerName: `${res.customerName}`,
        });
      },
      (error) => {
        this.visible = true;
        this.visible = false;
      }
    );

    this.service.GetExistingContactName(id).subscribe(
      (res) => {
        this.visible = false;
        this.visible = true;
        this.form.controls['existingCustomer'].setValue('');
        this.form.controls['contactName1'].setValue('');
        this.form.controls['contactName2'].setValue('');
        this.form.controls['phoneContact'].setValue('');
        this.form.controls['position'].setValue('');
        this.form.controls['mobile'].setValue('');
        this.form.controls['email'].setValue('');
        if (res != null) {
          this.existingCustomerList = res.map((res) => {
            return {
              label: res.value,
              value: res.id,
            };
          });
        }
        this.visible = true;
        this.visible = false;
      },
      (error) => {
        this.visible = true;
        this.visible = false;
      }
    );
  }

  onvalueChangeContactname(id: any) {
    this.visible = false;
    this.visible = true;
    this.service.GetContactDetails(id.value).subscribe(
      (res) => {
        this.form.controls['phoneContact'].setValue(res.office);
        this.form.controls['position'].setValue(res.role);
        this.form.controls['mobile'].setValue(res.cellPhone);
        this.form.controls['email'].setValue(res.email);
        this.visible = true;
        this.visible = false;
      },
      (error) => {
        this.visible = true;
        this.visible = false;
      }
    );
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return false;
    }
    // this.displayInvalidPopup = !this.displayInvalidPopup;
    this.visible = false;
    this.visible = true;

    const call_log = new CallLogModel();
    call_log.employeeId = this.form.value.mdiRepData;
    call_log.MDIRep = this.mdiRepList.find(
      (x) => x.value == call_log.employeeId
    ).label;
    call_log.branch = this.form.value.mdiBranch;
    call_log.customerId = this.form.value.customerId;
    call_log.customerName = this.form.value.customerName;
    call_log.customerAddress1 = this.form.value.address1;
    call_log.customerAddress2 = this.form.value.address2;
    call_log.customerCity = this.form.value.city;
    call_log.customerState = this.form.value.state;
    call_log.customerZip = this.form.value.zipCode;
    call_log.customerPhone = this.form.value.phone;
    call_log.customerFax = this.form.value.fax;
    //call_log.customerEmail = this.form.value.email;
    call_log.customerType = this.form.value.customerType;
    call_log.dateCalled = this.form.value.callDate;

    call_log.contactFirstName = this.form.value.contactName1;
    call_log.contactLastName = this.form.value.contactName2;
    if (this.form.value.existingContact) {
      call_log.contactName = this.existingCustomerList.find(
        (x) => x.value == this.form.value.existingCustomer
      ).label;
      call_log.contactFirstName = null;
      call_log.contactLastName = null;
    }
    call_log.contactPhone = this.form.value.phoneContact;
    call_log.contactMobile = this.form.value.mobile;
    call_log.contactEmail = this.form.value.email;
    call_log.contactPosition = this.form.value.position;
    call_log.contactType = this.form.value.contactTypeData;
    call_log.contactReason = this.form.value.contactReasonData;
    call_log.serviceBypass = false;
    call_log.serviceDewatering = this.form.value.dewatering;
    call_log.serviceTrenching = this.form.value.trenching;
    call_log.servicePower = this.form.value.power;
    call_log.serviceRental = this.form.value.rental;
    call_log.saleType = this.form.value.salesData;
    call_log.rentalType = this.form.value.rentalData;
    if (!call_log.serviceRental) {
      call_log.rentalType = null;
    }
    if (!call_log.saleType) {
      call_log.saleType = null;
    }
    if (!this.form.value.existingContact) {
      call_log.contactName = null;
    }
    call_log.serviceSale = this.form.value.sales;
    call_log.serviceEnvironmental = this.form.value.environmental;
    call_log.currentVendor = this.form.value.vendor;
    call_log.notes = this.form.value.comments;
    call_log.followUp = this.form.value.followUp;
    call_log.followUpDate = this.form.value.followUpDate;
    call_log.followUpMethod = this.form.value.followUpMethod;
    call_log.followUpReason = this.form.value.followUpReason;
    call_log.creditAppSent = this.form.value.creditAppSent;
    call_log.MDIProject = this.form.value.jobNumber;
    call_log.userName = JSON.parse(
      localStorage.getItem('currentUser')
    ).userName;
    call_log.user_PK = JSON.parse(localStorage.getItem('currentUser')).id;
    if (!this.form.value.mdiProject) {
      call_log.MDIProject = null;
    }
    this.service.SaveCallLogDetail(call_log).subscribe(
      (res) => {
        if (res['status'] == 200) {
          this.visible = true;
          this.visible = false;
          this.utility.toast.success(res['message']);
          this.form.reset();
          this.customerdataValue = 'Select Customer';
          this.displayExistingCustomer = false;
          this.displayRentalDrp = false;
          this.displaySalesDrp = false;
          this.displayFollowUpSection = false;
          this.displayMDIProjectSection = false;
          this.customerselections = [];
          this.getUserAndLoction(this.selectedUser);
        } else {
          this.visible = true;
          this.visible = false;
          this.utility.toast.error(res['message']);
        }
      },
      (error) => {
        this.visible = true;
        this.visible = false;
      }
    );

  }
  public closeSubmit(status) {
    if (status == 'cancel') {
      this.displayInvalidPopup = !this.displayInvalidPopup;
    } else {
      this.displayInvalidPopup = !this.displayInvalidPopup;
    }
  }
  filterData() {
    this.pagerService.start = 1;
    this.skip = 0;
    this.loadData();
  }
  getUserAndLoction(selectedUser) {
    this.service.getOneById(selectedUser).subscribe(
      (res) => {
        if (res) {
          let branch = this.branchListWithId.find(
            (item) => item.id == res?.branchId,
          );

          let employee = this.employees.find((item) => item.eeid === res?.employeeId)
          this.form.setValue({
            ...this.form.value,
            mdiRep: employee?.fullName,
            mdiRepData: res?.employeeId,
            mdiBranch: branch.code,
          });
          // this.cdate = res['createdDate'];
          // this.userName = res['userName'];
          // this.setValue(res);
        }
      },
      (error) => this.onError(error, ErrorMessages.user.get_byId)
    );
  }
  getCallLogDetail(callLogId) {
    this.service.getCallLogById(callLogId).subscribe(
      (res) => {
        if (res.length > 0) {
          var data = res[0];
          let selectedMdiRep = null
          let selectedMDIRepName = null
          if(data?.mdiRep) {
            let mdiRep = this.mdiRepList.find((item) => item.label === data?.mdiRep)
            if(mdiRep) {
              selectedMdiRep = mdiRep?.value
              selectedMDIRepName = mdiRep?.label
            }else {
              selectedMDIRepName = data?.mdiRep
            }
          }

          if(data?.employeeNumber) {
            let mdiRep = this.mdiRepList.find((item) => item.value === data?.employeeNumber)
            if(mdiRep) {
              selectedMdiRep = selectedMdiRep ? selectedMdiRep :  mdiRep?.value
              selectedMDIRepName = selectedMDIRepName ? selectedMDIRepName :  mdiRep?.label
            }
          }

          if(data?.mdiRep2) {
            let mdiRep = this.mdiRepList.find((item) => item.label === data?.mdiRep2)
            if(mdiRep) {
              selectedMdiRep = selectedMdiRep ? selectedMdiRep : mdiRep?.value
              selectedMDIRepName = selectedMDIRepName ? selectedMDIRepName :  mdiRep?.label
            }
          }

          let branch = this.branchList.find(
            (item) => item.value == data.branch.trim()
          );

          this.form.setValue(
            {
              callDate: new Date(data.dateCalled),
              mdiRep: selectedMDIRepName ,
              mdiRepData:  selectedMdiRep ? selectedMdiRep : data?.mdiRep,
              mdiBranch: branch?.value,
              customerType: data.custType,
              address1: data.custAdd1,
              address2: data.custAdd2,
              city: data.custCity,
              state: data.custState,
              zipCode: data.custZip,
              phone: data.custPhone,
              fax: data.custFax,
              contactName1: data.contactName ?? data.contactFirstName + ' ' + data.contactLastName,
              contactName2: '',
              existingContact: true,
              phoneContact: data.contactPhone,
              position: data.contactPosition,
              mobile: data.contactMobile,
              email: data.contactEmail,
              creditAppSent: data.creditAppSent,
              contactTypeData: data.contactType,
              contactReasonData: data.contactReason,
              pumps: false,
              dewatering: data.serviceDewatering,
              trenching: data.serviceTrenching,
              power: data.servicePower,
              environmental: data.serviceEnvironmental,
              rental: data.serviceRental,
              sales: data.serviceSale,
              rentalData: data.rentalType,
              salesData: data.saleType,
              vendor: data.currentVendor,
              comments: data.notes,
              followUp: data.followUp,
              mdiProject: data.mdiProject,
              followUpDate: new Date(data.followUpDate),
              followUpReason: data.followUpReason,
              followUpMethod: data.followUpMethod,
              jobNumber: parseInt(data.mdiProject),
              existingCustomer: true,
              customerId: data.customerNumber,
              customerName: data.custName,
              searchTerm1: '',
              searchTerm2: '',
            }
          );

          if (data.followUp) {
            this.displayFollowUpSection = true;
          }
          if (data.mdiProject)
            this.displayMDIProjectSection = true;
          if (data.serviceRental)
            this.displayRentalDrp = true;
          if (data.serviceSale)
            this.displaySalesDrp = true;
          this.customerdataValue = data.custName;
          this.isEditable = false;
        }
      },
      (error) => this.onError(error, ErrorMessages.user.get_byId)
    );
  }

  onToggleMDIRep() {
    this.isMDIRepVisible = !this.isMDIRepVisible
  }
}
