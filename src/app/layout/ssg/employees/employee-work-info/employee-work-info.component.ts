import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SortDescriptor } from '@progress/kendo-data-query';
import {
  accountData,
  addTitleTypeData,
  departmentData,
  employerData,
  titlecolumns,
  titleData,
} from 'src/data/employee-data';

@Component({
  selector: 'app-employee-work-info',
  templateUrl: './employee-work-info.component.html',
  styleUrls: ['./employee-work-info.component.scss'],
})
export class EmployeeWorkInfoComponent implements OnInit {
  @Input() employee: FormGroup;
  @Input() disableEmployee: boolean;
  @Output('onSaveForm') onSaveForm: EventEmitter<any> = new EventEmitter();
  sort: SortDescriptor[] = [];
  selections: any = [];
  skip: number = 0;
  multiple: any = [];
  workInfomation: FormGroup;
  addressForm: FormGroup;
  account_btn: string;
  account: any = [];
  isAccountVisible: boolean = false;
  employer_btn: string;
  employer: any = [];
  isEmployerVisible: boolean = false;
  department_btn: string;
  department: any = [];
  isDepartmentVisible: boolean = false;
  title_btn: string;
  title: any = [];
  titletypecolumns: any = [];
  isTitleVisible: boolean = false;
  add_title_btn: string;
  addTitle: any = [];
  isAddTitleVisible: boolean = false;
  eVerify_btn: string;
  iseVerifyCompletedVisible: boolean = false;
  subVerify_btn: string;
  isSubVerifyVisible: boolean = false;
  sub_btn: string;
  e_verify_confirm_btn: string;
  isEverifyConfirmVisible: boolean = false;
  isConfirmDialogVisible: boolean = false;
  iseVerifyCloseVisible: boolean = false;
  isADPVisible: boolean = false;
  adpText: string = '';
  isQBRepVisible: boolean = false;
  QBRep: string = '';
  unionLabor_btn: string;
  isUnionLaborVisible: boolean = false;
  unionLabor: string = '';
  yard_btn: string = '';
  isYardVisible: boolean = false;
  yard: string = '';
  iscloseVisble: boolean = false;
  isVerifyContentVisible = false;
  isActiveConfirmation: boolean = false;
  isActiveConfirmed: boolean = false;

  constructor(private formBuilder: FormBuilder) {
    this.account = accountData;
    this.employer = employerData;
    this.department = departmentData;
    this.title = titleData;
    this.titletypecolumns = titlecolumns;
    this.addTitle = addTitleTypeData;
  }

  ngOnInit(): void {}

  onResizeColumn() {}

  onSortChange() {}

  onReOrderColumns() {}

  onDataStateChange() {}

  onVerifyClose() {
    this.isConfirmDialogVisible = !this.isConfirmDialogVisible;
    this.iseVerifyCompletedVisible = !this.iseVerifyCompletedVisible;
    this.isSubVerifyVisible = !this.isSubVerifyVisible;
    this.isEverifyConfirmVisible = !this.isEverifyConfirmVisible;
  }

  onRowSelect(event, type) {
    switch (type) {
      case 'account':
        this.employee.setValue({
          ...this.employee.value,
          account: event.selectedRows[0].dataItem.type,
        });
        this.isAccountVisible = false;
        break;
      case 'employer':
        this.employee.setValue({
          ...this.employee.value,
          employer: event.selectedRows[0].dataItem.type,
        });
        this.isEmployerVisible = false;
        break;
      case 'department':
        this.employee.setValue({
          ...this.employee.value,
          department: event.selectedRows[0].dataItem.type,
        });
        this.isDepartmentVisible = false;
      case 'title':
        this.employee.setValue({
          ...this.employee.value,
          title: event.selectedRows[0].dataItem.type,
        });
        this.isTitleVisible = false;
        break;
      case 'addTitle':
        this.title.push({ workType: event.selectedRows[0].dataItem.workType });
        // this.add_title_btn = event.selectedRows[0].dataItem.workType;
        this.isAddTitleVisible = false;

        break;
      default:
        break;
    }
  }

  onInitAddressForm(form) {
    this.addressForm = this.formBuilder.group({
      address: form?.address || '',
      state: form?.state || '',
      city: form?.city || '',
      zipcode: form?.zipcode || '',
      phone: form?.phone || '',
      emergencyContact: form?.emergencyContact || '',
      relationship: form?.relationship || '',
    });
  }

  onHandleOperations(type) {
    switch (type) {
      case 'account':
        this.isAccountVisible = !this.isAccountVisible;
        break;
      case 'employer':
        this.isEmployerVisible = !this.isEmployerVisible;
        break;
      case 'department':
        this.isDepartmentVisible = !this.isDepartmentVisible;
        break;
      case 'title':
        this.isTitleVisible = !this.isTitleVisible;
        break;
      case 'addTitle':
        this.isAddTitleVisible = !this.isAddTitleVisible;
        break;
      case 'e-verify':
        this.iseVerifyCompletedVisible = !this.iseVerifyCompletedVisible;
        break;
      case 'sub-verify':
        this.isSubVerifyVisible = !this.isSubVerifyVisible;
        this.iseVerifyCompletedVisible = false;
        break;
      case 'e-verify-confirm':
        this.isEverifyConfirmVisible = !this.isEverifyConfirmVisible;
        this.isSubVerifyVisible = false;
        break;
      case 'close-verify':
        if (this.iseVerifyCompletedVisible) {
          this.iseVerifyCloseVisible = false;
        }
        this.iseVerifyCloseVisible = !this.iseVerifyCloseVisible;
        break;
      case 'adp':
        this.isADPVisible = !this.isADPVisible;
        break;
      case 'adp_submit':
        this.employee.setValue({
          ...this.employee.value,
          adp: this.adpText,
        });
        this.isADPVisible = !this.isADPVisible;
        break;
      case 'QBRep':
        this.isQBRepVisible = !this.isQBRepVisible;
        break;
      case 'qbrep_submit':
        this.employee.setValue({
          ...this.employee.value,
          qbp: this.QBRep,
        });
        this.isQBRepVisible = !this.isQBRepVisible;
        break;
      case 'unionLabor':
        if (this.isUnionLaborVisible) {
          this.isYardVisible = false;
        }
        this.isUnionLaborVisible = !this.isUnionLaborVisible;
        break;
      case 'unionLabor_submit':
        this.employee.setValue({
          ...this.employee.value,
          unionlabor: this.unionLabor,
        });
      case 'yard':
        this.isYardVisible = !this.isYardVisible;
        break;
      case 'yard_submit':
        this.employee.setValue({
          ...this.employee.value,
          yard: this.yard,
        });
        this.isYardVisible = !this.isYardVisible;
        break;
      case 'e-verify-confirm-close':
        this.isEverifyConfirmVisible = false;
        this.isVerifyContentVisible = !this.isVerifyContentVisible;
        break;
      case 'active_confirmation':
        this.isActiveConfirmation = !this.isActiveConfirmation;
        break;
      case 'active_confirmed':
        this.isActiveConfirmation = false;
        this.isActiveConfirmed = !this.isActiveConfirmed;
        break;
      case 'active_Confirmed_date':
        break;
      default:
        break;
    }
  }
}
