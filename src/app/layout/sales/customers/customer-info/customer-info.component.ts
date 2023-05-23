import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DropDownModel } from '../../../../core/models/drop-down.model';
import { DropdownService } from '../../../../core/services/dropdown.service';
import { CustomerInfoModel } from './customer-info.model';
import { CustomerInfoService } from './customer-info.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { CustomAddress } from 'src/app/layout/ssg/google-map-address/address.model';
import { BranchService } from 'src/app/layout/admin/branch/branch.service';
import { ModuleNames, ErrorMessages } from 'src/app/core/constant';
import { ErrorHandlerService } from 'src/app/core/services';

@Component({
  selector: 'app-customer-info',
  templateUrl: './customer-info.component.html',
  styleUrls: ['./customer-info.component.scss'],
})
export class CustomerInfoComponent implements OnInit {
  @Output() SaveEditClick = new EventEmitter<number>();
  BranchTypeData: any = [
    'Branch:CHI',
    'Customer Type: CEO',
    'AM: Anthony Panozzo',
  ];
  @Input() onChange;
  form: FormGroup;
  isSave: boolean = true;
  isCancel: boolean = true;
  isEdit: boolean = false;
  isAdd: boolean = false;
  isExpanded: boolean = false;

  id: number = 0;
  data: CustomerInfoModel[];
  branchList: DropDownModel[];
  employeeList: DropDownModel[];
  branchdata: any;
  employeedata: any;
  model: any;
  customerId: any;
  customerTypes: any = [];
  customerTypesdata: any = this.customerTypes;
  filterColle: any;
  stateList: DropDownModel[];
  stateData: DropDownModel[];
  fullAddress: string;
  isDisabled: boolean;
  fullAdressLable: string;
  constructor(
    private formBuilder: FormBuilder,
    public service: CustomerInfoService,
    private utils: UtilityService,
    public dropdownservice: DropdownService,
    public branchService: BranchService,
    public errorHandler: ErrorHandlerService
  ) {}

  mAddress: string;
  mAddress2: string;
  mCity: string;
  mZip: string;
  mState: string;
  mCountry: string;
  @Output() dialogOpened: boolean = false;
  @Output() errorMsg: any;
  ngOnInit(): void {
    this.initForm();
    this.GetBranches();
    this.GetCustomerTypes();
    this.GetEmployee();
    this.GetState();
    this.onChange.subscribe((res) => {
      if (res) this.editClick(res);
      else this.initForm();
    });
    this.form.disable();
  }
  initForm(): void {
    this.form = this.formBuilder.group({
      customerName: ['', Validators.required],
      address: [''],
      address2: [''],
      state: [''],
      zip: [''],
      city: [''],
      country: [''],
      phone: [''],
      fax: [''],
      website: [''],
      branch: [''],
      customerType: [''],
      employeeNumber: [''],
      active: [''],
    });
  }
  editClick(data: CustomerInfoModel) {
    if (data) {
      this.form.disable();
      this.id = data.id;
      this.isEdit = true;
      this.isAdd = true;
      this.isSave = false;
      this.isCancel = false;
      this.isDisabled = true;

      this.setValue(data);
    }
  }
  btnCancel() {
    this.isExpanded = false;
    this.form.reset();
    this.isAdd = false;
  }
  setValue(data: CustomerInfoModel) {
    this.mAddress = data.address;
    this.mAddress2 = data.address2;
    this.mCity = data.city;
    this.mZip = data.zip;
    this.mState = data.state;
    this.mCountry = data.country;
    let fulladdarray = [data.address, data.address2, data.city, data.state];
    this.fullAdressLable = fulladdarray.join(', ') + '-' + data.zip;
    let addarray = [data.address]; //, data.city, data.state
    this.fullAddress = addarray.filter(Boolean).join(', '); // + "-" + data.zip;
    this.form.setValue({
      customerName: data.customerName,
      address: this.fullAddress,
      address2: data.address2,
      state: data.state,
      zip: data.zip,
      city: data.city,
      country: data.country,
      phone: data.phone,
      fax: data.fax,
      website: data.website,
      branch: data.branch,
      customerType: data.customerType,
      employeeNumber: data.employeeNumber,
      active: data.active,
    });
  }

  GetBranches() {
    this.branchService.GetBranchDropdown().subscribe(
      (res) => {
        if (res) {
          this.branchList = res;
          this.branchdata = res;
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.branch.dropdown);
      }
    );
  }

  GetEmployee() {
    this.service.GetEmployeeList().subscribe(
      (res) => {
        if (res) {
          this.employeeList = res;
          this.employeedata = res;
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.customer.get_employee_list);
      }
    );
  }

  GetCustomerTypes() {
    this.dropdownservice.GetLookupList('CRMCustomerType').subscribe(
      (res) => {
        if (res) {
          this.customerTypes = res;
          this.customerTypesdata = res;
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.drop_down.crm_customer_type);
      }
    );
  }

  GetState() {
    this.dropdownservice.GetLookupList('States').subscribe(
      (res) => {
        if (res) {
          this.stateList = res.sort((a, b) => a.value.localeCompare(b.value));
          this.stateData = res.sort((a, b) => a.value.localeCompare(b.value));
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.drop_down.states);
      }
    );
  }

  GetAddress(data: CustomAddress) {
    if (data.flag) {
      this.form.patchValue({
        address: '',
        address2: '',
        city: '',
        state: '',
        zip: '',
      });
      let fulladdarray = [data.address1, data.address2, data.city, data.state];
      this.fullAdressLable = fulladdarray.join(', ') + '-' + data.postalcode;
      let addarray = [data.address1, data.address2]; //, data.city, data.state
      this.fullAddress = addarray.join(', '); // + "-" + data.postalcode;
      this.form.patchValue({
        address: this.fullAddress != undefined ? this.fullAddress : '',
        // address2: data.address2 != undefined ? data.address2 : '',
        city: data.city != undefined ? data.city : '',
        state: data.state != undefined ? data.state : '',
        zip: data.state != undefined ? data.postalcode : '',
      });
    } else {
      let olddata = this.form.value;
      this.form.patchValue({
        address: data.address1 != undefined ? data.address1 : '',
      });

      let fulladdarray = [
        data.address1,
        olddata.address2,
        olddata.city,
        olddata.state,
      ];
      this.fullAdressLable = fulladdarray.join(', ') + '-' + olddata.zip;
      let addarray = [data.address1, data.address2];
      if (
        data.address2 != '' &&
        data.address2 != undefined &&
        data.address2 != null
      )
        this.fullAddress = addarray.join(', ');
      else this.fullAddress = data.address1;
    }
    this.form.markAsDirty();
  }

  btnAdd() {
    this.isExpanded = true;
    this.form.reset();
    this.form.enable();
    this.isEdit = true;
    this.isDisabled = false;
    this.id = 0;
  }
  btnEdit() {
    this.form.enable();
    this.isDisabled = false;
    this.isEdit = true;
    this.isAdd = true;
    this.isExpanded = true;
  }
  onSave(active) {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return true;
    }
    const data = this.form.value;
    data.id = this.id;
    data.customerId = this.id;
    data.active = active;

    //data.workInfo = [];
    this.service.save(data).subscribe(
      (res) => {
        if (res['status'] == 200) {
          this.utils.toast.success(res['message']);
          this.SaveEditClick.emit(res);
        } else this.utils.toast.error(res['message']);
        //this.disbaleBtn();
        this.form.disable();
        //this.isDisabled = true;
        this.isExpanded = false;
        this.isEdit = false;
        this.isAdd = false;
      },
      (error) => {
        this.onError(error, ErrorMessages.customer.save);
      }
    );
  }
  branchesHandleFilter(value) {
    this.branchList = this.branchdata.filter(
      (s) => s.value.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }
  employeeHandleFilter(value) {
    this.employeeList = this.employeedata.filter(
      (s) => s.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  customerTypesHandleFilter(value) {
    this.customerTypes = this.customerTypesdata.filter(
      (s) => s.value.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  private onError(error: any, customMessage?: string) {
    this.errorHandler.handleError(
      error,
      ModuleNames.customer_info,
      customMessage
    );
  }
}
