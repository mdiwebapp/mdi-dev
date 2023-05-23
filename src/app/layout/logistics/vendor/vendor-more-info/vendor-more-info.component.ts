import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { DropdownService } from 'src/app/core/services/dropdown.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { VendorMoreInfoModel } from './vendor-more-info.model';
import { VendorMoreInfoService } from './vendor-more-info.service';
import { ModuleNames, ErrorMessages } from 'src/app/core/constant';
import { ErrorHandlerService } from 'src/app/core/services';

@Component({
  selector: 'app-vendor-more-info',
  templateUrl: './vendor-more-info.component.html',
  styleUrls: ['./vendor-more-info.component.scss'],
})
export class VendorMoreInfoComponent implements OnInit {
  @Output() SaveEditClick = new EventEmitter<number>();
  form: FormGroup;
  id: number = 0;
  data: VendorMoreInfoModel[];
  @Input() onChange;
  vendorId: any;
  fullAddress: string;
  @Output() dialogOpened: boolean = false;
  @Output() errorMsg: any;
  constructor(
    private formBuilder: FormBuilder,
    public dropdownservice: DropdownService,
    public service: VendorMoreInfoService,
    private utils: UtilityService,
    public errorHandler: ErrorHandlerService
  ) {}
  vendor: VendorMoreInfoModel;
  isSave: boolean = true;
  isCancel: boolean = true;
  isEdit: boolean = true;
  SaveChange: BehaviorSubject<any> = new BehaviorSubject(null);
  public shippingData: any[] = [
    // {
    //   text: "FedEx",
    //   id: 1,
    //   items: [
    //     { text: "Ground", id: 2 },
    //     { text: "Priority Overnight", id: 3 },
    //     { text: "Standard Overnight", id: 4 },
    //     { text: "2Day AM", id: 5 },
    //     { text: "2Day", id: 6 },
    //     { text: "Express Saver", id: 7 },
    //   ],
    // },
    // {
    //   text: "FedEx Freight",
    //   id: 5,
    //   items: [
    //     { text: "Freight Priority", id: 9 },
    //   ],
    // },
    // {
    //   text: "Freight Economy",
    //   id: 10,
    //   items: [],
    // },
  ];
  ngOnInit(): void {
    this.initForm();
    // this.onChange.subscribe(res => {
    //   if (res)
    //     this.id = res.moreInfo.id;
    //   this.vendorId = res.id;
    //   this.editClick(res.moreInfo);
    // });
    this.GetShippers();
    this.form.disable();
  }

  initForm(): void {
    this.form = this.formBuilder.group({
      accountNumber: [null, Validators.required],
      portalInfo: [null],
      creditLimit: [null],
      terms: [null],
      poSubmittedVia: [null],
      defaultShipper: [null],
      shippedFrom: [null],
    });
  }
  GetShippers() {
    this.dropdownservice.GetLookupList('Carriers').subscribe(
      (res) => {
        if (res) {
          this.shippingData = res;
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.drop_down.carriers);
      }
    );
  }
  onEdit(res) {
    if (res) this.id = res.moreInfo.id;
    this.vendorId = res.id;
    this.editClick(res.moreInfo);
  }
  onSave() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return true;
    }

    const data = this.form.value;
    data.id = this.vendorId;
    data.vendorId = this.vendorId;
    data.userName = JSON.parse(localStorage.getItem('currentUser')).userName;
    this.service.savePatch(data).subscribe(
      (res) => {
        if (res['status'] == 200) {
          this.utils.toast.success(res['message']);
          this.SaveEditClick.emit(res);
        } else this.utils.toast.error(res['message']);
        this.disbaleBtn();
        this.form.disable();
        this.isEdit = false;
      },
      (error) => {
        this.onError(error, ErrorMessages.vendor.save_patch);
      }
    );
  }

  editClick(data: VendorMoreInfoModel) {
    if (data) {
      this.isEdit = false;
      this.isSave = true;
      this.isCancel = true;
      this.setValue(data);
    }
  }

  setValue(data: VendorMoreInfoModel) {
    this.form.setValue({
      accountNumber: data.accountNumber,
      portalInfo: data.portalInfo,
      creditLimit: data.creditLimit,
      terms: data.terms,
      poSubmittedVia: data.poSubmittedVia,
      defaultShipper: data.defaultShipper,
      shippedFrom: data.shippedFrom,
    });
  }

  btnCancel() {
    this.form.reset();
    this.form.disable();
  }

  btnAdd() {
    this.enableBtn();
    this.form.enable();
    this.fullAddress = '';
  }

  btnEdit() {
    this.form.enable();
    this.enableBtn();
    this.isEdit = true;
  }

  enableBtn() {
    this.isSave = false;
    this.isCancel = false;
  }
  disbaleBtn() {
    this.isSave = true;
    this.isCancel = true;
  }

  private onError(error: any, customMessage?: string) {
    this.errorHandler.handleError(
      error,
      ModuleNames.vendor_info,
      customMessage
    );
  }
}
