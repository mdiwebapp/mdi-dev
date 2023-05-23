import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilityService } from 'src/app/core/services/utility.service';
import { VendorInfoService } from './vendor-info.service';
import {
  billingAddressModel,
  moreInfoModel,
  shippingAddressModel,
  VendorInfoModel,
} from './vendor-info.model';
import { BehaviorSubject } from 'rxjs';
import { CustomAddress } from 'src/app/layout/ssg/google-map-address/address.model';
import { DropdownService } from 'src/app/core/services/dropdown.service';
import { VendorMoreInfoComponent } from '../vendor-more-info/vendor-more-info.component';
import { ClipboardService } from 'ngx-clipboard';
import { MenuService } from 'src/app/core/helper/menu.service';
import { MultiSelectComponent } from '@progress/kendo-angular-dropdowns';
import { delay, switchMap, map, tap } from 'rxjs/operators';
import { from } from 'rxjs';
import { ModuleNames, ErrorMessages } from 'src/app/core/constant';
import { ErrorHandlerService } from 'src/app/core/services';

@Component({
  selector: 'app-vendor-info',
  templateUrl: './vendor-info.component.html',
  styleUrls: ['./vendor-info.component.scss'],
})
export class VendorInfoComponent implements OnInit {
  @ViewChild(VendorMoreInfoComponent) vendorMoreInfo: VendorMoreInfoComponent;
  @ViewChild('multiselect') public multiselect: MultiSelectComponent;
  source: any;

  // @Output() SaveEditClick = new EventEmitter<number>();
  // @Output() AddClick = new EventEmitter<number>();
  form: FormGroup;
  id: number = 0;
  data: VendorInfoModel[];
  isDisabled: boolean = true;
  @Input() onChange;
  stateList: any;
  stateData: any;
  fullAddress: string;
  fullAdressLable: string;
  shipfullAddress: string;
  shipfullAdressLable: string;
  isExpanded: boolean = false;
  isMoreDisabled: boolean = false;
  shippingData: any[] = [];
  tempshippingData: any[] = [];
  isMoreViewRight: boolean = false;
  isMoreAddRight: boolean = false;
  isMoreUpdateRight: boolean = false;
  isSSGRight: boolean = false;
  isClone: boolean = false;
  saveClick: boolean = false;
  public mask = '(000) 000-0000';
  TermsData: import('../../../../../app/core/models/drop-down.model').DropDownModel[];
  TermsDataFilter: import('../../../../../app/core/models/drop-down.model').DropDownModel[];
  @Output() dialogOpened: boolean = false;
  @Output() errorMsg: any;
  constructor(
    private formBuilder: FormBuilder,
    private clipboardApi: ClipboardService,
    public menuService: MenuService,
    public service: VendorInfoService,
    private utils: UtilityService,
    public dropdownservice: DropdownService,
    public errorHandler: ErrorHandlerService
  ) {
    this.menuService.checkVendorMoreRights('More Info');
    this.isMoreViewRight = this.menuService.isMoreViewRight;
    // this.isMoreAddRight = this.menuService.isMoreAddRight;
    this.isMoreUpdateRight = this.menuService.isMoreEditRight;
    this.isSSGRight = this.menuService.isSSGRight;
  }
  vendor: VendorInfoModel;
  isSave: boolean = true;
  isCancel: boolean = true;
  isEdit: boolean = true;
  isAdd: boolean = false;
  ssgVendor: boolean = false;
  SaveChange: BehaviorSubject<any> = new BehaviorSubject(null);
  VendorType = []; //["Office Supplies", "Safety", "Equipment Rentals"];
  VendorTypedata = []; // ["Office Supplies", "Safety", "Equipment Rentals"];

  public value: any = [''];

  ngOnInit(): void {
    this.initForm();
    this.loadData();
    //this.GetTermsList();
    // this.onChange.subscribe(res => {
    //   if (res)
    //     this.editClick(res);
    // });
    //this.GetState();
    //this.GetVendorType();
    this.GetShippers();
    this.form.disable();
  }

  GetTermsList() {
    this.dropdownservice.GetLookupList('VendorTerms').subscribe(
      (res) => {
        if (res) {
          this.TermsData = res.sort((a, b) => a.value.localeCompare(b.value));
          this.TermsDataFilter = res.sort((a, b) =>
            a.value.localeCompare(b.value)
          );
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.drop_down.vendor_terms);
      }
    );
  }

  termshandleFilter(value) {
    this.TermsData = this.TermsDataFilter.filter(
      (s) => s.value.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  initForm(): void {
    this.form = this.formBuilder.group({
      vendorName: ['', Validators.required],
      vendorType: [],
      terms: ['', Validators.required],
      phone: ['', Validators.required],
      fax: [''],
      email: ['', [Validators.email, Validators.required]],
      //billingAddress: {
      billingAddress_address: ['', Validators.required],
      billingAddress_address2: [''],
      billingAddress_state: ['', Validators.required],
      billingAddress_city: ['', Validators.required],
      billingAddress_zip: ['', Validators.required],
      //},
      ///moreInfo: {
      //"id": 0,
      //moreInfo_id: 0,
      moreInfo_userName: [''],
      moreInfo_accountNumber: [''],
      moreInfo_qbName: ['', Validators.required],
      moreInfo_creditLimit: [''],
      moreInfo_portalInfo: [''],
      moreInfo_defaultShipper: [''],
      //shippingAddress: {

      shippingAddress_address: [''],
      shippingAddress_address2: [''],
      shippingAddress_state: [''],
      shippingAddress_city: [''],
      shippingAddress_zip: [''],

      isNational: [false],
      inactive: [false],
      isClone: [false],
      ssg: [false],
    });
  }
  onEdit(res) {
    this.editClick(res);
    //this.vendorMoreInfo.onEdit(res);
  }
  onSave(active) {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.saveClick = true;
      return true;
    }
    this.saveClick = false;
    const data = new VendorInfoModel();
    data.billingAddress = new billingAddressModel();
    data.moreInfo = new moreInfoModel();
    data.moreInfo.shippingAddress = new shippingAddressModel();
    data.billingAddress.address = this.form.value.billingAddress_address;
    data.billingAddress.address2 = this.form.value.billingAddress_address2;
    data.billingAddress.city = this.form.value.billingAddress_city;
    data.billingAddress.state = this.form.value.billingAddress_state;
    data.billingAddress.zip = this.form.value.billingAddress_zip;
    data.vendorName = this.form.value.vendorName;
    data.vendorTypes = this.value.toString();
    data.terms = this.form.value.terms;
    data.phone = this.form.value.phone;
    data.fax = this.form.value.fax;
    data.email = this.form.value.email;
    data.moreInfo.shippingAddress.address =
      this.form.value.shippingAddress_address;
    data.moreInfo.shippingAddress.address2 =
      this.form.value.shippingAddress_address2;
    data.moreInfo.shippingAddress.city = this.form.value.shippingAddress_city;
    data.moreInfo.shippingAddress.state = this.form.value.shippingAddress_state;
    data.moreInfo.shippingAddress.zip = this.form.value.shippingAddress_zip;

    //data.moreInfo.id = 0;
    data.moreInfo.accountNumber = this.form.value.moreInfo_accountNumber;
    data.moreInfo.creditLimit = this.form.value.moreInfo_creditLimit;
    data.moreInfo.defaultShipper = this.form.value.moreInfo_defaultShipper;
    data.moreInfo.portalInfo = this.form.value.moreInfo_portalInfo;
    data.moreInfo.qbName = this.form.value.moreInfo_qbName;
    data.moreInfo.userName = JSON.parse(
      localStorage.getItem('currentUser')
    ).userName;
    data.isNational =
      this.form.value.isNational == null ? false : this.form.value.isNational;

    data.id = this.id;

    data.userName = JSON.parse(localStorage.getItem('currentUser')).userName;
    data.moreInfo.ssg = this.ssgVendor == null ? false : this.ssgVendor;
    if (this.id > 0) {
      data.active = active; // (active == null ? false : active);
      this.service.UpdateVenodrData(data).subscribe(
        (res) => {
          if (res['status'] == 200) {
            this.utils.toast.success(res['message']);
            // this.SaveEditClick.emit(res);
          } else this.utils.toast.error(res['message']);

          this.disbaleBtn();
          this.form.disable();
          this.isDisabled = true;
          this.isExpanded = false;
          this.id = 0;
        },
        (error) => {
          this.onError(error, ErrorMessages.vendor.update_vendor_data);
        }
      );
    } else {
      this.service.AddVenodrData(data).subscribe(
        (res) => {
          if (res['status'] == 200) {
            this.utils.toast.success(res['message']);
            // this.SaveEditClick.emit(res);
          } else this.utils.toast.error(res['message']);
          this.disbaleBtn();
          this.form.disable();
          this.isDisabled = true;
          this.isExpanded = false;
          this.id = 0;
        },
        (error) => {
          this.onError(error, ErrorMessages.vendor.add_vendor_data);
        }
      );
    }
  }

  editClick(data: VendorInfoModel) {
    if (!this.TermsDataFilter) {
      this.GetTermsList();
    }
    this.value = [];
    this.form.disable();
    this.isDisabled = true;
    this.id = data.id;
    this.isEdit = false;
    this.isAdd = false;
    this.isSave = true;
    this.isCancel = true;
    if (data.id > 0) {
      this.setValue(data);
    } else {
      this.fullAddress = '';
      this.form.reset();
    }
  }
  checkTerms(value) {
    if (value) {
      if (!this.TermsDataFilter) {
        setTimeout(() => {
          var ext = this.TermsDataFilter.findIndex(
            (x) => x.value.toLowerCase() === value.toLowerCase()
          );
          return ext;
        }, 1000);
      } else {
        var ext = this.TermsDataFilter.findIndex(
          (x) => x.value.toLowerCase() === value.toLowerCase()
        );
        return ext;
      }
    } else {
      return -1;
    }
  }
  setValue(data: VendorInfoModel) {
    this.value = [];
    let fulladdarray = [
      data.billingAddress.address,
      data.billingAddress.address2,
      data.billingAddress.city,
      data.billingAddress.state,
    ];
    this.fullAdressLable =
      fulladdarray.filter((x) => x != '' && x != null).join(', ') +
      '-' +
      data.billingAddress.zip;
    let shipfulladdarray = [
      data.moreInfo.shippingAddress.address,
      data.moreInfo.shippingAddress.address2,
      data.moreInfo.shippingAddress.city,
      data.moreInfo.shippingAddress.state,
    ];
    this.shipfullAdressLable =
      shipfulladdarray.filter((x) => x != '' && x != null).join(', ') +
      '-' +
      data.moreInfo.shippingAddress.zip;
    let addarray = [data.billingAddress.address]; //, data.city, data.state
    this.fullAddress = addarray.filter(Boolean).join(', '); // + "-" + data.zip;

    let shipaddarray = [data.moreInfo.shippingAddress.address]; //, data.city, data.state
    this.shipfullAddress = shipaddarray.filter(Boolean).join(', '); // + "-" + data.zip;
    if (this.fullAddress == this.shipfullAddress) {
      this.isClone = true;
    }
    if (data.moreInfo.ssg == null) {
      this.ssgVendor = false;
    } else {
      this.ssgVendor = data.moreInfo.ssg;
    }
    var trm = this.checkTerms(data.terms);
    this.form.setValue({
      vendorName: data.vendorName,
      vendorType: data.vendorTypes,
      terms: '',
      phone: data.phone,
      fax: data.fax,
      email: data.email,
      billingAddress_address: this.fullAddress,
      billingAddress_address2: data.billingAddress.address2,
      billingAddress_state: data.billingAddress.state,
      billingAddress_zip: data.billingAddress.zip,
      billingAddress_city: data.billingAddress.city,
      inactive: data.active,
      // moreInfo_id: 0,
      moreInfo_userName: '',
      moreInfo_accountNumber: data.moreInfo.accountNumber,
      moreInfo_qbName: data.moreInfo.qbName,
      moreInfo_creditLimit: data.moreInfo.creditLimit,
      moreInfo_portalInfo: data.moreInfo.portalInfo,
      moreInfo_defaultShipper: data.moreInfo.defaultShipper,
      shippingAddress_address: this.shipfullAddress,
      shippingAddress_address2: data.moreInfo.shippingAddress.address2,
      shippingAddress_state: data.moreInfo.shippingAddress.state,
      shippingAddress_city: data.moreInfo.shippingAddress.city,
      shippingAddress_zip: data.moreInfo.shippingAddress.zip,
      isClone: this.fullAddress == this.shipfullAddress ? true : false,
      ssg: data.moreInfo.ssg == null ? false : data.moreInfo.ssg,
      isNational: data.isNational == null ? false : data.isNational,
    });
    this.form.controls['terms'].setValue(
      trm > 0 ? (data.terms == 'credit card' ? 'Credit Card' : data.terms) : ''
    );
    let ary =
      data.vendorTypes != null
        ? data.vendorTypes.toString().trim().split(',')
        : [];
    ary.forEach((element) => {
      this.value.push(element.toString().trim());
    });
    //this.value =  ? ary : [];
  }

  btnCancel() {
    this.saveClick = false;
    this.isExpanded = false;
    this.form.reset();
    this.form.disable();
    this.isAdd = false;
    this.fullAddress = '';
    this.shipfullAddress = '';
    this.fullAdressLable = '';
    this.value = [];
    //this.vendorMoreInfo.btnCancel();
  }

  btnAdd() {
    this.isExpanded = true;
    this.id = 0;
    this.form.reset();
    this.form.enable();
    this.isDisabled = false;
    this.fullAddress = '';
    this.fullAdressLable = '';
    this.shipfullAddress = '';
    this.shipfullAdressLable = '';
    this.value = [];
    //this.vendorMoreInfo.btnAdd();
  }

  btnEdit() {
    this.isExpanded = true;
    this.form.enable();
    this.isDisabled = false;
    this.enableBtn();
    this.isEdit = true;
    this.isAdd = true;
    //this.vendorMoreInfo.btnEdit();
  }

  enableBtn() {
    this.isSave = false;
    this.isCancel = false;
  }
  disbaleBtn() {
    this.isSave = true;
    this.isCancel = true;
  }

  infohandleFilter(value) {
    this.VendorType = this.VendorTypedata.filter(
      (s) => s.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }
  GetAddress(data: CustomAddress) {
    if (data.flag) {
      this.form.patchValue({
        billingAddress_address: '',
        billingAddress_address2: '',
        billingAddress_city: '',
        billingAddress_state: '',
        billingAddress_zip: '',
      });
      let fulladdarray = [
        data.address1 + ' ' + data.address2,
        data.city,
        data.state,
      ];
      this.fullAdressLable =
        fulladdarray.filter((x) => x != '' && x != null).join(', ') +
        '-' +
        data.postalcode;
      let addarray = [data.address1 + ' ' + data.address2]; //, data.city, data.state
      this.fullAddress = addarray.join(', '); // + "-" + data.postalcode;
      this.form.patchValue({
        billingAddress_address:
          this.fullAddress != undefined ? this.fullAddress : '',
        //billingAddress_address2: data.address2 != undefined ? data.address2 : "",
        billingAddress_city: data.city != undefined ? data.city : '',
        billingAddress_state: data.state != undefined ? data.state : '',
        billingAddress_zip: data.state != undefined ? data.postalcode : '',
      });
    } else {
      let olddata = this.form.value;
      this.form.patchValue({
        billingAddress_address: data.address1 != undefined ? data.address1 : '',
      });

      let fulladdarray = [
        data.address1,
        olddata.address2,
        olddata.city,
        olddata.state,
      ];
      this.fullAdressLable =
        fulladdarray.filter((x) => x != '' && x != null).join(', ') +
        '-' +
        olddata.zip;
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
  shipGetAddress(data: CustomAddress) {
    if (data.flag) {
      this.form.patchValue({
        shippingAddress_address: '',
        shippingAddress_address2: '',
        shippingAddress_city: '',
        shippingAddress_state: '',
        shippingAddress_zip: '',
      });

      let fulladdarray = [
        data.address1 + ' ' + data.address2,
        data.city,
        data.state,
      ];
      this.shipfullAdressLable =
        fulladdarray.filter((x) => x != '' && x != null).join(', ') +
        '-' +
        data.postalcode;
      let addarray = [data.address1 + ' ' + data.address2]; //, data.city, data.state
      this.shipfullAddress = addarray.join(', '); // + "-" + data.postalcode;
      this.form.patchValue({
        shippingAddress_address:
          this.shipfullAddress != undefined ? this.shipfullAddress : '',
        //shippingAddress_address2: data.address2 != undefined ? data.address2 : "",
        shippingAddress_city: data.city != undefined ? data.city : '',
        shippingAddress_state: data.state != undefined ? data.state : '',
        shippingAddress_zip: data.state != undefined ? data.postalcode : '',
      });
    } else {
      let olddata = this.form.value;
      this.form.patchValue({
        shippingAddress_address:
          data.address1 != undefined ? data.address1 : '',
      });

      let fulladdarray = [
        data.address1,
        olddata.address2,
        olddata.city,
        olddata.state,
      ];
      this.shipfullAdressLable =
        fulladdarray.filter((x) => x != '' && x != null).join(', ') +
        '-' +
        olddata.zip;
      let addarray = [data.address1, data.address2];
      if (
        data.address2 != '' &&
        data.address2 != undefined &&
        data.address2 != null
      )
        this.shipfullAddress = addarray.join(', ');
      else this.shipfullAddress = data.address1;
    }
    this.form.markAsDirty();
  }

  GetState() {
    this.dropdownservice.GetLookupList('States').subscribe(
      (res) => {
        if (res) {
          this.stateList = res;
          this.stateData = res;
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.drop_down.states);
      }
    );
  }

  copyContent() {
    window.open(
      'https://www.google.com/maps?q=loc:' + this.fullAdressLable,
      '_blank'
    );
    // this.clipboardApi.copyFromContent(this.fullAdressLable);
    // this.utils.toast.success("Address copied..");
  }
  copyShipContent() {
    window.open(
      'https://www.google.com/maps?q=loc:' + this.shipfullAdressLable,
      '_blank'
    );
    // this.clipboardApi.copyFromContent(this.shipfullAdressLable);
    // this.utils.toast.success("Address copied..");
  }
  GetVendorType() {
    this.dropdownservice.GetLookupList('VendorType').subscribe(
      (res) => {
        if (res) {
          this.VendorType = res;
          this.source = res;
          this.VendorTypedata = res;
          // this.stateList = res;
          // this.stateData = res;
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.drop_down.vehicle_type);
      }
    );
  }
  GetShippers() {
    this.dropdownservice.GetLookupList('Carriers').subscribe(
      (res) => {
        if (res) {
          this.shippingData = res;
          this.tempshippingData = res;
          // this.stateList = res;
          // this.stateData = res;
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.drop_down.carriers);
      }
    );
  }
  loadData() {
    if (
      this.isMoreViewRight == true &&
      (this.isMoreAddRight == true || this.isMoreUpdateRight == true)
    ) {
      this.isMoreDisabled = false;
      return true;
    } else {
      this.isMoreDisabled = true;
      //this.utils.toast.error("You don't have rights to access More Info.");
      return false;
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
        this.VendorType = x;
        this.multiselect.loading = false;
      });
  }
  cloneAddress(event) {
    this.isClone = event;
    if (this.isClone) {
      //let shipfulladdarray = [data.moreInfo.shippingAddress.address, data.moreInfo.shippingAddress.address2, data.moreInfo.shippingAddress.city, data.moreInfo.shippingAddress.state];
      this.shipfullAdressLable = this.fullAdressLable;
      this.form.controls['shippingAddress_address'].setValue(
        this.form.value.billingAddress_address
      );
      this.form.controls['shippingAddress_address2'].setValue(
        this.form.value.billingAddress_address2
      );
      this.form.controls['shippingAddress_city'].setValue(
        this.form.value.billingAddress_city
      );
      this.form.controls['shippingAddress_state'].setValue(
        this.form.value.billingAddress_state
      );
      this.form.controls['shippingAddress_zip'].setValue(
        this.form.value.billingAddress_zip
      );
      this.shipfullAddress = this.fullAddress;
    } else {
      this.shipfullAdressLable = '';
      this.shipfullAddress = '';
      this.form.controls['shippingAddress_address'].setValue('');
      this.form.controls['shippingAddress_address2'].setValue('');
      this.form.controls['shippingAddress_city'].setValue('');
      this.form.controls['shippingAddress_state'].setValue('');
      this.form.controls['shippingAddress_zip'].setValue('');
    }
  }
  checkPhoneNo(phone) {
    this.service.checkPhone(phone).subscribe(
      (res) => {
        if (res.status == 0) {
          this.utils.toast.error(res['message']);
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.vendor.check_phone);
      }
    );
  }
  shippstateFilter(value) {
    this.stateList = this.stateData.filter(
      (s) => s.value.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }
  billStateFilter(value) {
    this.stateList = this.stateData.filter(
      (s) => s.value.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }
  defaultShipperFilter(value) {
    this.shippingData = this.tempshippingData.filter(
      (s) => s.value.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }
  private onError(error: any, customMessage?: string) {
    this.errorHandler.handleError(
      error,
      ModuleNames.vendor_info,
      customMessage
    );
  }
}
