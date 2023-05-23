import { Component, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BranchModel } from './branch.model';
import { BranchService } from './branch.service';
import { UtilityService } from '../../../core/services/utility.service';
import { DropdownService } from '../../../core/services/dropdown.service';
import { BehaviorSubject } from 'rxjs';
import { DropDownModel } from 'src/app/core/models/drop-down.model';
import { CustomAddress } from '../../ssg/google-map-address/address.model';
import { MenuService } from '../../../core/helper/menu.service';
import { Router } from '@angular/router';
import { ModuleNames, ErrorMessages } from '../../../core/constant';
import { ErrorHandlerService } from '../../../core/services';

@Component({
  selector: 'app-branch',
  templateUrl: './branch.component.html',
  styleUrls: ['./branch.component.scss'],
})
export class BranchComponent implements OnInit {
  form: FormGroup;
  isExpanded: boolean = false;
  id: number = 0;
  stateList: any;
  stateData: any;
  data: BranchModel[];
  cdate: any;
  empldata: any;
  employerList: DropDownModel[];
  branchList: DropDownModel[];
  addressnew: any;
  isDisabled: boolean = true;
  isMetric: boolean;
  isPricing: boolean;
  isActive: boolean;
  subTitleText: string = 'View More';
  fullAdressLable: string;
  fullAddress: string;
  branchData: DropDownModel[];
  branchName: string;
  activeToggle:boolean = true;
  selectedBranch:string = '';
  @Output() dialogOpened: boolean = false;
  @Output() errorMsg: any;
  constructor(
    private formBuilder: FormBuilder,
    public menuService: MenuService,
    public service: BranchService,
    public utils: UtilityService,
    public router: Router,
    public dropdownservice: DropdownService,
    public errorHandler: ErrorHandlerService
  ) {
    this.menuService.checkUserBySubmoduleRights('Branch');
    if (!this.menuService.isViewRight) {
      // this.utils.toast.error("User does not have rights to access this module.");
      this.router.navigate(['dashboard']);
    }
  }
  branch: BranchModel;
  isSave: boolean = true;
  isCancel: boolean = true;
  isEdit: boolean = true;
  isAdd: boolean = false;

  SaveChange: BehaviorSubject<any> = new BehaviorSubject(null);
  ngOnInit(): void {
    this.initForm();
    this.form.reset();
    this.form.disable();
    this.GetState();
    this.GetEmployer();
    this.GetBranch();
  }

  initForm(): void {
    this.form = this.formBuilder.group({
      branchCode: ['', Validators.required],
      branchName: ['', Validators.required],
      employer: ['', Validators.required],
      address: ['', Validators.required],
      address2: [''],
      city: [''],
      state: [''],
      zip: [''],
      qbBranch: [''],
      qbName: [''],
      nickName: [''],
      pricelist: [''],
      metric: [false],
      pricing: [false],
      active: [false],
    });
  }

  GetState() {
    this.dropdownservice.GetLookupList('States').subscribe(
      (res) => {
        if (res) {
          this.stateList = res.sort((a, b) => a.value.localeCompare(b.value));
          this.stateData = res.sort((a, b) => a.value.localeCompare(b.value));
        }
      },
      (error) => this.onError(error, ErrorMessages.drop_down.states)
    );
  }

  GetEmployer() {
    this.dropdownservice.GetLookupList('Company').subscribe(
      (res) => {
        if (res) {
          this.employerList = res.sort((a, b) =>
            a.value.localeCompare(b.value)
          );
          this.empldata = res.sort((a, b) => a.value.localeCompare(b.value));
          if (this.filter) this.handleFilter(this.filter);
        }
      },
      (error) => this.onError(error, ErrorMessages.drop_down.company)
    );
  }
  GetBranch() {
    this.dropdownservice.GetBranchList().subscribe(
      (res) => {
        if (res) {
          this.branchList = res.sort((a, b) => a.value.localeCompare(b.value));
          this.branchData = res.sort((a, b) => a.value.localeCompare(b.value));
        }
      },
      (error) => this.onError(error, ErrorMessages.drop_down.branch_list)
    );
  }
  addressfulltext(data) {
    debugger;
  }
  editClick(id: number) {
    this.id = id;
    this.isEdit = false;
    this.isCancel = true;
    this.form.disable();
    this.isDisabled = true;
    this.isAdd = false;
    this.isSave = true;

    if (id == 0) {
      this.fullAddress = '';
      this.fullAdressLable = '';
      this.form.reset();
    } else {
      this.service.getOneById(id).subscribe(
        (res) => {
          if (res) {
            this.cdate = res['createdDate'];
            this.branchName = res['branchName'];
            this.setValue(res);
          }
        },
        (error) => this.onError(error, ErrorMessages.branch.get_by_id)
      );
    }
  }

  setValue(data: BranchModel) {
    let fulladdarray = [data.address, data.address2, data.city, data.state];
    this.fullAdressLable = fulladdarray.join(', ') + '-' + data.zip;
    let addarray = [data.address]; //, data.city, data.state
    this.fullAddress = addarray.filter(Boolean).join(', '); // + "-" + data.zip;
    this.form.setValue({
      branchCode: data.branchCode,
      branchName: data.branchName,
      employer: data.employer,
      address: this.fullAddress,
      address2: data.address2,
      city: data.city,
      state: data.state,
      zip: data.zip,
      qbBranch: data.qbBranch,
      qbName: data.qbName,
      nickName: data.nickName,
      metric: data.metric,
      pricing: data.pricing,
      pricelist: '',
      active: data.active, // (data.active == true ? false : true)
    });
    this.selectedBranch = "MDI -" + " " +data.branchCode;
  }
  submitted: boolean = false;

  onSave() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return false;
    }
    const data = this.form.value;
    data.id = this.id;
    data.metric = data.metric == null ? false : data.metric;
    data.pricing = data.pricing == null ? false : data.pricing;
    data.active = this.form.get('active').value;
    data.employer = this.form.get('employer').value;;
    this.service.save(data).subscribe(
      (res) => {
        if (res['status'] == 200) this.utils.toast.success(res['message']);
        else this.utils.toast.error(res['message']);
        this.SaveChange.next(this.id);
        this.disbaleBtn();
        this.form.reset();
        this.form.disable();
        this.isDisabled = true;
        this.isExpanded = false;
        this.id = 0;
      },
      (error) => this.onError(error, ErrorMessages.branch.save)
    );
  }

  btnCancel() {
    this.isExpanded = false;
    //this.form.reset();
    this.form.disable();
    this.isDisabled = true;
    this.isCancel = true;
    this.isAdd = false;
    this.isSave = true;
    //this.fullAddress = "";
    this.editClick(this.tempId);
  }
  tempId;
  number;
  btnAdd() {
    this.isExpanded = true;
    this.enableBtn();
    this.form.reset();
    this.form.enable();
    this.form.controls['active'].setValue(true);
    this.isDisabled = false;
    this.isEdit = true;
    this.isAdd = true;
    this.tempId = this.id;
    this.id = 0;
    this.branchName = '';
    this.cdate = '';
    this.fullAddress = '';
    this.fullAdressLable = '';
  }

  btnEdit() {
    this.form.enable();
    this.isDisabled = false;
    this.tempId = this.id;
    this.enableBtn();
    this.isEdit = true;
    this.isAdd = true;
    this.isExpanded = true;
    if(this.form.get('pricing').value == true){
      this.isPricing = true;
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

  handleFilter(value) {
    this.filter = value;
    this.employerList = this.empldata.filter(
      (s) => s.value.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  statehandleFilter(value) {
    this.stateList = this.stateData.filter(
      (s) => s.value.toLowerCase().indexOf(value.toLowerCase()) !== -1
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
        // address2: data.address2 != undefined ? data.address2 : "",
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

  branchhandleFilter(value) {
    this.branchList = this.branchData.filter(
      (s) => s.value.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }
  public onAction(ev): void {
    if (ev.action == 'expand') this.subTitleText = 'View Less';
    else this.subTitleText = 'View More';
  }
  checkAddress() {
    if (!this.fullAddress) {
      this.form.controls['address'].setValue('');
    }
  }
  public filter: string;
  // public dataDDL: Array<{ text: string; value: number }>;

  // public source: Array<{ text: string; value: number }> = [
  //   { text: "Small", value: 1 },
  //   { text: "Medium", value: 2 },
  //   { text: "Large", value: 3 },
  // ];
  public addNew(): void {
    var empData = {
      lookupGroup: 'Company',
      lookupValue: this.filter,
    };
    this.service.AddLookupCompany(empData).subscribe(
      (res) => {
        if (res['status'] == 200) this.utils.toast.success(res['message']);
        else this.utils.toast.error(res['message']);
        this.GetEmployer();
        //this.empldata = this.empldata.sort((a, b) => a.value.localeCompare(b.value));
      },
      (error) => this.onError(error, ErrorMessages.branch.add_lookup_company)
    );
    // this.empldata.push({
    //   value: this.filter,
    //   id: 0,
    // });
  }
  // handleFilterDDL(value){
  //   this.filter = value;
  //   this.dataDDL = this.source.filter(
  //     (s) => s.text.toLowerCase().indexOf(value.toLowerCase()) !== -1
  //   );
  // }

  private onError(error: any, customMessage?: string) {
    this.errorHandler.handleError(error, ModuleNames.branch, customMessage);
  }
  backButtonEvent(p) {
    this.activeToggle = p;
  }
  OnPricingChange(event)
  {
     this.isPricing = event;
  }
}
