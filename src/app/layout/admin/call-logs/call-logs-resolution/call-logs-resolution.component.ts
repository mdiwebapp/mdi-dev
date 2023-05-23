import {
  Component,
  OnInit,
  Input,
  SimpleChanges,
  OnChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { inputRules } from '@progress/kendo-angular-editor';
import { SortDescriptor, process } from '@progress/kendo-data-query';
import { DropdownService } from 'src/app/core/services/dropdown.service';
import { callTypesData, usersData } from 'src/data/call-logs-data';

@Component({
  selector: 'app-call-logs-resolution',
  templateUrl: './call-logs-resolution.component.html',
  styleUrls: ['./call-logs-resolution.component.scss'],
})
export class CallLogsResolutionComponent implements OnInit, OnChanges {
  @Input() disable: boolean;
  @Input() actiondisable: boolean;
  @Input() selectedLog: any = null;
  @Input() form: FormGroup;
  @Input() allEmployees: any;
  @Input() selectedEmployeeName: any;
  @Input() isSaveResolution: boolean = false;
  @Input() selectedLogBy: string = null;
  @Output() closeButtonEvent = new EventEmitter();
  isEmployeeVisible: boolean = false;
  disableNoActionRequiredComment: boolean = true;
  sort: SortDescriptor[] = [];
  selections: any = [];
  skip: number = 0;
  employees: any = [];
  emp_btn: string = 'Select Employee';
  call_type_btn: string = 'Call Type';
  isConfirmationDialog: boolean = false;
  selectedEmployee: string = '';
  isNoActionRequired: boolean = false;
  isCallTypeVisible: boolean = false;
  isNoActionVisible: boolean = false;
  isCommentsRequiredVisible: boolean = false;
  tmpemployees: any = [];
  employeeSearch: string = '';
  isCloseDisable: boolean = true;
  closeValue: boolean;
  message: string = '';
  columns = [
    {
      Name: 'id',
      isCheck: true,
      Text: 'EE#',
      isDisable: false,
      index: 0,
      width: 50,
    },
    {
      Name: 'value',
      isCheck: true,
      Text: 'Name',
      isDisable: false,
      index: 0,
      width: 100,
    },
  ];
  callTypes: any = [
    {
      label: 'Email',
      value: 'Email',
    },
    {
      label: 'Inperson',
      value: 'Inperson',
    },
    {
      label: 'Phone',
      value: 'Phone',
    },
  ];

  constructor(private dropdownService: DropdownService) {}

  ngOnInit(): void {
    //this.onLoadEmployee();
  }

  onLoadEmployee() {
    this.dropdownService.GetEmployee().subscribe((result) => {
      this.employees = this.allEmployees = [
        { id: 'All', value: 'All' },
        ...result.result,
      ];
      this.tmpemployees = this.allEmployees = [
        { id: 'All', value: 'All' },
        ...result.result,
      ];
    });
  }
  handleEmployeeDialog() {
    this.isEmployeeVisible = !this.isEmployeeVisible;
    this.employeeSearch = '';
    this.tmpemployees = this.allEmployees;
    this.filterEmployee();
  }

  handleEmployeeConfirmationDialog() {
    this.isConfirmationDialog = !this.isConfirmationDialog;
  }

  onResizeColumn(event) {}

  onSelectionChange(event) {
    this.form.setValue({
      ...this.form.value,
      reassignedTo: event.selectedRows[0].dataItem.id,
    });
    this.selectedEmployeeName = event.selectedRows?.[0]?.dataItem.name;
    this.isConfirmationDialog = true;
  }

  onEmployeeConfirm() {
    this.emp_btn = this.selectedEmployee;
    this.isConfirmationDialog = !this.isConfirmationDialog;
    this.isEmployeeVisible = !this.isEmployeeVisible;
  }

  onEmployeeConfirmClose() {
    this.selectedEmployee = '';
    this.isConfirmationDialog = !this.isConfirmationDialog;
    this.isEmployeeVisible = !this.isEmployeeVisible;
  }

  onSortChange(event) {}

  onReOrderColumns(event) {}

  onDataStateChange(event) {}

  onChangeAction(event) {
    if (event.target.checked == true) {
      this.disableNoActionRequiredComment = false;
    } else {
      this.disableNoActionRequiredComment = true;
    }
  }

  onHandleCallType() {
    this.isCallTypeVisible = !this.isCallTypeVisible;
  }

  onSelectCallType(event) {
    this.call_type_btn = event.selectedRows?.[0]?.dataItem.name;
    this.isCallTypeVisible = false;
  }

  onChangeClosed(event) {
    if (this.disableNoActionRequiredComment) {
      this.isNoActionVisible = true;
      this.message = 'Comments Required.';
      this.form.controls['closed'].setValue(false);
    } else if (
      this.form.get('noActionReason').value == null ||
      this.form.get('noActionReason').value == '' ||
      this.form.get('noActionReason').value === undefined
    ) {
      this.isNoActionVisible = true;
      this.message = 'Reason required for no action field.';
      this.form.controls['closed'].setValue(false);
    } else {
      this.closeValue = true;
      this.closeButtonEvent.emit(this.closeValue);
    }
  }

  onHandleCloseAction() {
    this.isNoActionVisible = !this.isNoActionVisible;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.isSaveResolution) {
      if (
        changes.isSaveResolution.currentValue &&
        !changes.isSaveResolution.previousValue
      ) {
        this.isCallTypeVisible = false;
      }
    }
  }
  filterEmployee() {
    this.employees = process(this.tmpemployees, {
      filter: {
        logic: 'or',
        filters: [
          {
            field: 'id',
            operator: 'contains',
            value: this.employeeSearch,
          },
          {
            field: 'value',
            operator: 'contains',
            value: this.employeeSearch,
          },
        ],
      },
    }).data;
  }
  numberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
}
