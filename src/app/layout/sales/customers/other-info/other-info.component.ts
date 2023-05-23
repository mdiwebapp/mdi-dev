import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilityService } from 'src/app/core/services/utility.service';
import { OtherInfoModel } from './other-info.model';
import { OtherInfoService } from './other-info.service';
import { ModuleNames, ErrorMessages } from 'src/app/core/constant';
import { ErrorHandlerService } from 'src/app/core/services';

@Component({
  selector: 'app-other-info',
  templateUrl: './other-info.component.html',
  styleUrls: ['./other-info.component.scss'],
})
export class OtherInfoComponent implements OnInit {
  public creditAppData: any = [
    { text: 'Small', value: 1 },
    { text: 'Medium', value: 2 },
    { text: 'Large', value: 3 },
  ];
  public taxExempt: boolean = false;
  public value: Date = new Date(2020, 2, 10);
  CreditLimitValue: any;
  filterColle: any;
  model: any;
  rawValue: any;
  @Output() SaveEditClick = new EventEmitter<number>();
  @Input() onChange;
  form: FormGroup;
  isSave: boolean = true;
  isCancel: boolean = true;
  isEdit: boolean = false;
  isAdd: boolean = false;
  id: number = 0;
  customerId: any;
  data: any;
  contacts: any;
  @Output() dialogOpened: boolean = false;
  @Output() errorMsg: any;
  constructor(
    private formBuilder: FormBuilder,
    public service: OtherInfoService,
    private utils: UtilityService,
    public errorHandler: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.form.disable();
    this.onChange.subscribe((res) => {
      if (res) {
        this.customerId = res.id;
        this.data = res.customerInfo;
        this.contacts = res.customerInfo;
        if (this.data != null && this.data.customerId > 0) {
          this.editClick(this.data);
        }
      }
    });
  }

  public onValueChange(value: number): void {
    this.rawValue = value;
  }
  initForm(): void {
    this.form = this.formBuilder.group({
      creditAppStatus: ['', Validators.required],
      taxExempt: [null],
      coi: [null],
      prePayment: [null],
      creditLimit: [null],
      creditRisk: [null],
      creditOverride: [null],
      creditNote: [null],
    });
  }
  btnAdd() {
    this.form.reset();
    this.form.enable();
    this.isEdit = true;
    this.id = 0;
  }
  btnEdit() {
    this.form.enable();
    this.isEdit = true;
  }
  editClick(data: OtherInfoModel) {
    if (data) {
      this.form.disable();
      this.id = data.id;
      this.isEdit = true;
      this.isAdd = true;
      this.isSave = false;
      this.isCancel = false;
      this.setValue(data);
    }
  }

  setValue(data: OtherInfoModel) {
    this.form.setValue({
      creditAppStatus: data.creditAppStatus,
      taxExempt: data.taxExempt,
      coi: data.coi,
      prePayment: data.prePayment,
      creditLimit: data.creditLimit,
      creditRisk: data.creditRisk,
      creditOverride: data.creditOverride,
      creditNote: data.creditNote,
    });
  }

  onSave() {
    const data = this.form.value;
    if (data.coi == null || data.coi == undefined) data.coi = false;
    if (data.creditOverride == null || data.creditOverride == undefined)
      data.creditOverride = false;
    if (data.creditRisk == null || data.creditRisk == undefined)
      data.creditRisk = false;
    if (data.prePayment == null || data.prePayment == undefined)
      data.prePayment = false;
    if (data.id == null) data.id = 0;
    data.customerId = this.customerId;
    data.active = '';
    //data.workInfo = [];
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return true;
    }
    this.service.savePatch(data).subscribe(
      (res) => {
        if (res['status'] == 200) {
          this.utils.toast.success(res['message']);
          this.SaveEditClick.emit(res);
        } else this.utils.toast.error(res['message']);
        //this.disbaleBtn();
        this.form.disable();
        //this.isDisabled = true;
        this.isEdit = false;
        this.isAdd = false;
      },
      (error) => {
        this.errorHandler.handleError(
          error,
          ModuleNames.customer_info,
          ErrorMessages.customer.save_patch
        );
      }
    );
  }

  btnCancel() {}
}
