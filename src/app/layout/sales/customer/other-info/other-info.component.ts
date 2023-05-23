import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DatePickerComponent } from '@progress/kendo-angular-dateinputs';
import { orderBy, SortDescriptor } from '@progress/kendo-data-query';
import { valHooks } from 'jquery';
import moment from 'moment';
import { customerCheckListData } from 'src/data/customer-data';

@Component({
  selector: 'app-other-info',
  templateUrl: './other-info.component.html',
  styleUrls: ['./other-info.component.scss'],
})
export class OtherInfoComponent implements OnInit, OnChanges {
  @Input() form: FormGroup;
  @Input() disableCustomer: boolean = false;
  @Input() selectedCustomer: any;
  @Input() action: string = '';
  labourToRevColor: string;

  sort: SortDescriptor[] = [];
  selections: any = [];
  skip: number = 0;
  multiple: any = [];
  checklists: any = [];
  custInfoColumns: any = [];
  creditLimitVisible: boolean = false;
  creditCloseDialogVisible: boolean = false;
  inactive: boolean = true;
  isActiveConfirmation: boolean = false;
  isActiveConfirmed: boolean = false;
  creditAppData: any = [
    {
      label: 'N/A',
      value: 'N/A',
    },
    {
      label: 'Approved',
      value: 'Approved',
    },
    {
      label: 'Received',
      value: 'Received',
    },
    {
      label: 'Sent',
      value: 'Sent',
    },
  ];
  creditAmount: number = 0;

  public disabledDates = (date: Date): boolean => {
    return new Date() >= date;
  };

  isCOIInvalidDateVisible: boolean = false;

  constructor() {
    this.checklists = customerCheckListData;
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    this.getCreditStatus();
  }

  onResizeColumn(event) {}

  onRowSelect(event) {}

  onReOrderColumns(event) {}

  onDataStateChange(event) {}

  onStatusChange(event) {
    if (!event) {
      this.isActiveConfirmation = true;
    }
  }

  onSortChange(sort: SortDescriptor[]) {
    this.sort = sort;
    this.checklists = orderBy(this.checklists, sort);
  }
  onHandleOperations(type) {
    switch (type) {
      case 'credit_limit':
        if (this.creditAmount) {
          this.form.setValue({
            ...this.form.value,
            creditLimit: this.creditAmount,
          });
        }
        this.creditLimitVisible = !this.creditLimitVisible;
        this.creditCloseDialogVisible = false;
        break;
      case 'credit_limit_cancel':
        this.creditLimitVisible = !this.creditLimitVisible;
        this.creditCloseDialogVisible = false;
        break;
      case 'active_confirmation':
        this.isActiveConfirmation = !this.isActiveConfirmation;
        break;
      case 'active_confirmed':
        this.isActiveConfirmation = false;
        this.isActiveConfirmed = !this.isActiveConfirmed;
        break;
      case 'pre_payment':
        this.form.setValue({
          ...this.form.value,
          prePayment: !this.form.value.prePayment,
        });
        break;
      case 'credit_risk':
        this.form.setValue({
          ...this.form.value,
          creditRisk: !this.form.value.creditRisk,
        });
        break;
      case 'credit_override':
        this.form.setValue({
          ...this.form.value,
          creditOverride: !this.form.value.creditOverride,
        });
      default:
        break;
    }
  }
  getColor() {
    if (this.form.get('prePayment')?.value == true) {
      this.labourToRevColor = 'lightgreen';
    } else {
      this.labourToRevColor = '#ff7070';
    }
  }
  onValueChange(event, type) {
    switch (type) {
      case 'creditApp':
        if (event === 'Sent') {
          this.form.setValue({
            ...this.form.value,
            creditAppSent: true,
            creditAppSentDate: new Date(),
          });
        }

        if (event === 'Received') {
          this.form.setValue({
            ...this.form.value,
            creditAppReceived: true,
            creditAppReceivedDate: new Date(),
          });
        }

        if (event === 'Approved') {
          this.form.setValue({
            ...this.form.value,
            creditAppApproved: true,
            creditAppApprovedDate: new Date(),
          });
        }
        this.getCreditStatus();
        break;
      case 'taxExempt':
        if (event) {
          this.form.setValue({
            ...this.form.value,
            taxExempt: event,
            taxExemptDate: moment().utc().add(1, 'years').toISOString(),
          });
        } else {
          this.form.setValue({
            ...this.form.value,
            taxExempt: event,
            taxExemptDate: '',
          });
        }
        break;
      case 'coi':
        if (event) {
          this.form.setValue({
            ...this.form.value,
            coi: true,
            coiDate: moment(event).utc().toISOString(),
          });
        } else {
          this.form.setValue({
            ...this.form.value,
            coi: false,
            coiDate: '',
          });
        }
        break;
      default:
        break;
    }
  }

  getCreditStatus() {
    let status = 'N/A';
    let form = this.form.value;
    if (form?.creditAppSent) {
      status = 'Sent';
    }
    if (form?.creditAppReceived) {
      status = 'Received';
    }
    if (form?.creditAppApproved) {
      status = 'Approved';
    }
    return status;
  }

  getCreditDate() {
    let creditDate: any = '';
    let form = this.form.value;
    if (form?.creditAppSent) {
      creditDate = form?.creditAppSentDate || new Date();
    }
    if (form?.creditAppReceived) {
      creditDate = form?.creditAppReceivedDate || new Date();
    }
    if (form?.creditAppApproved) {
      creditDate = form?.creditAppApprovedDate || new Date();
    }
    return creditDate;
  }

  OnChangeCOI(data, coi_date_picker: DatePickerComponent) {
    if (data) {
      coi_date_picker.show = true;
    } else {
      coi_date_picker.show = false;
    }
  }

  onCOIDateChange(event, coi_date_picker: DatePickerComponent) {
    if (event <= new Date()) {
      this.isCOIInvalidDateVisible = true;
    } else {
      this.form.setValue({
        ...this.form.value,
        coi: true,
        coiDate: moment(event).utc().toISOString(),
      });
    }
  }

  OnCloseCOIDateInvalid() {
    this.isCOIInvalidDateVisible = false;
    this.form.setValue({
      ...this.form.value,
      coi: false,
      coiDate: '',
    });
  }

  onAmountChange(value) {
    this.creditAmount = value;
  }

  otherColorInfo(value, type = 'value') {
    if (value === true) {
      return type === 'color' ? { 'background-color': 'lightgreen' } : 'Yes';
    } else if (value === null && this.action == 'new') {
      return type === 'color' ? { 'background-color': '' } : '';
    } else {
      return type === 'color' ? { 'background-color': '#ff7070' } : 'No';
    }
    // // } else if (value === false || value === null) {
    // // } else if (value.length == 0) {
    // // }
  }
  craditLimitInfo(value, type = 'value') {
    if (value === null && this.action == 'new') {
      return type === 'color' ? { 'background-color': '' } : '';
    } else if (value == 0 || value == null) {
      return type === 'color'
        ? { 'background-color': '#ff7070' }
        : this.form.value?.creditLimit || 0;
    } else {
      return type === 'color'
        ? { 'background-color': 'lightgreen' }
        : this.form.value?.creditLimit || 0;
    }
  }
}
