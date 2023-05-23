import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ErrorMessages, ModuleNames } from 'src/app/core/constant';
import { ErrorHandlerService } from 'src/app/core/services';
import { DropdownService } from 'src/app/core/services/dropdown.service';
import { PerdiemService } from './perdiem.service';
import * as fileSaver from 'file-saver';
import { UtilityService } from 'src/app/core/services/utility.service';
import { MenuService } from 'src/app/core/helper/menu.service';
import moment from 'moment';
import { DatePipe } from '@angular/common';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';

import {
  process,
  SortDescriptor,
  State,
  orderBy,
} from '@progress/kendo-data-query';

@Component({
  selector: 'app-per-diem-entry',
  templateUrl: './per-diem-entry.component.html',
  styleUrls: ['./per-diem-entry.component.scss'],
})
export class PerDiemEntryComponent implements OnInit {
  pipelineFilterOptions: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'startsWith',
  };
  employeeForm: FormGroup;
  isPerDiemReportVisible: boolean = false;
  isSubmitVisible: boolean = false;
  isConfirmationDialog: boolean = false;
  isErrorDialogVisible: boolean = false;
  error_title: string = '';
  error_msg: string = '';
  employees: any = [];
  employeesFilter: any = [];
  jobs: any = [];
  jobsFilter: any = [];
  corrections: any = [];
  isDisable: boolean = true;

  fromDate: any = moment().startOf('week').add(1, 'day').toDate();
  toDate: any = moment().endOf('week').add(1, 'day').toDate();
  visible: boolean = false;
  public sort: SortDescriptor[] = [
    {
      field: 'name',
      dir: 'asc',
    },
  ];
  constructor(
    private formBuilder: FormBuilder,
    private service: PerdiemService,
    private dropdownservice: DropdownService,
    public errorHandler: ErrorHandlerService,
    private utils: UtilityService,
    public menuService: MenuService,
    public datepipe: DatePipe
  ) {
    if (localStorage.getItem('isAdmin') == 'true') {
    } else {
      let acc = this.menuService.checkUserViewRights('Per diem entry');
      if (acc) {
        //this.utils.toast.error("User does not have rights to access " + name + " module.");Z
      } else {
        this.utils.toast.error(
          'You do not have permissions to access this part of the system. Please contact your supervisor so they can request them from IT.'
        );
        setTimeout(() => {
          var url = '/dashboard';
          location.href = url;
        }, 1000);
      }
      this.menuService.checkUserBySubmoduleRights('Per diem entry');
    }
  }

  onSortChange(sort: SortDescriptor[]) {
    this.sort = sort;
    this.corrections = orderBy(this.corrections, sort);
    // this.loadPipelinecorrectData();
  }
  ngOnInit(): void {
    this.onInitEmployeeForm();
    this.GetEmployee();
    this.GetJobs();
  }
  GetEmployee() {
    this.visible = true;
    this.dropdownservice.GetEmployee().subscribe(
      (res) => {
        if (res) {
          this.employees = res.result;
          this.employeesFilter = res.result;
          this.employees.unshift({ eeid: 'all', name: 'All' });
          this.visible = false;
        }
      },
      (error) =>
        this.onError(error, ErrorMessages.employee.get_unique_list_user)
    );
  }
  GetJobs() {
    this.visible = true;
    this.service.GetJobList().subscribe(
      (res) => {
        if (res) {
          this.jobs = [{ jobName: 'All', jobNumber: 'all' }, ...res];
          this.jobsFilter = res;
          this.visible = false;
          //this.employees.unshift({ id: 0, value: 'All' });
        }
      },
      (error) =>
        this.onError(error, ErrorMessages.employee.get_unique_list_user)
    );
  }
  employeeFilter(value) {
    this.employees = this.employeesFilter.filter(
      (s) => s.value.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }
  jobFilter(value) {
    this.jobs = this.jobsFilter.filter(
      (s) => s.jobName.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }
  onSubmitEmployee() {
    let values = this.employeeForm.value;
    if (!values?.employeeNumber || values?.employeeNumber === 'all') {
      this.utils.toast.error('Please select a specified employee');
    } else if (!values?.job || values?.job === 'all') {
      this.utils.toast.error('Please select a specified job');
    } else if (!values?.perDiemDate) {
      this.utils.toast.error('Please select a per diem date');
    } else {
      this.SavePerdiem();
    }
  }

  onInitEmployeeForm() {
    this.employeeForm = this.formBuilder.group({
      add: true,
      employeeNumber: ['all'],
      job: ['all'],
      perDiemDate: [''],
      enteredBy: '',
      enteredDate: new Date(),
    });
  }

  onHandleDialog(value) {
    const form = this.employeeForm.value;
    if (form?.employeeNumber) {
      this.isPerDiemReportVisible = !this.isPerDiemReportVisible;
    } else {
      this.utils.toast.error('Please select employee');
    }
    // debugger;
    // let perDimeDate = this.employeeForm?.controls?.perDiemDate?.value;
    // if (perDimeDate != null && perDimeDate != '') {
    //   this.isPerDiemReportVisible = true;
    // } else {
    //   if (this.employeeForm.invalid) {
    //     this.employeeForm.markAllAsTouched();
    //   }
    //   this.isPerDiemReportVisible = !this.isPerDiemReportVisible;
    //   this.isPerDiemReportVisible = false;
    // }
    // if (this.employeeForm.invalid) {
    //   this.isPerDiemReportVisible = false;
    //   this.employeeForm.markAllAsTouched();
    // } else {
    //   this.isPerDiemReportVisible = !this.isPerDiemReportVisible;
    // }
    // let data = this.employeeForm.get('perDiemDate');
    // console.log('data', data);
    // if (data?.touched == false) {
    //   // console.log('please select job!');
    //   this.isPerDiemReportVisible = true;
    // } else {
    //   this.isPerDiemReportVisible = false;
    // }
    switch (value) {
      case 'error':
        this.isErrorDialogVisible = !this.isErrorDialogVisible;
        break;
      default:
        break;
    }
  }

  closeperdiemDialog() {
    this.isPerDiemReportVisible = false;
  }

  downloadReport() {
    if (!this.fromDate) {
      this.error_title = 'Date required';
      this.error_msg = 'Select from date';
      this.isErrorDialogVisible = true;
      return false;
    }
    if (!this.toDate) {
      this.error_title = 'Date required';
      this.error_msg = 'Select to date';
      this.isErrorDialogVisible = true;
      return false;
    }
    this.isPerDiemReportVisible = !this.isPerDiemReportVisible;
    var data = {
      startDate: this.datepipe.transform(this.fromDate, 'MM/dd/yyyy'),
      endDate: this.datepipe.transform(this.toDate, 'MM/dd/yyyy'),
      employee:
        this.employeeForm.value.employeeNumber === 'all'
          ? ''
          : this.employeeForm.value.employeeNumber,
      job:
        this.employeeForm.value.job === 'all'
          ? ''
          : this.employeeForm.value.job,
    };
    this.service.GetExportData(data).subscribe(
      (res) => {
        if (res?.size > 8176) {
          let data = new Blob([res], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;',
          });
          fileSaver.saveAs(data, 'PerDiem_Info.xlsx');
          this.employeeForm.reset();
        } else {
          this.error_title = 'MDI 3.0';
          this.error_msg = 'No records found!';
          this.isErrorDialogVisible = true;
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.vehicle.download_vehicle_data);
      }
    );
  }

  SavePerdiem() {
    this.employeeForm.controls['add'].setValue(true);
    this.employeeForm.controls['enteredDate'].setValue(new Date());
    this.employeeForm.controls['enteredBy'].setValue(
      JSON.parse(localStorage.getItem('currentUser')).userName
    );
    this.service.SavePerdiem(this.employeeForm.value).subscribe(
      (res) => {
        this.utils.toast.success(res['message']);
        this.employeeForm.reset();
      },
      (error) => {
        this.onError(error, ErrorMessages.vehicle.download_vehicle_data);
      }
    );
  }
  private onError(error: any, customMessage?: string) {
    this.errorHandler.handleError(
      error,
      ModuleNames.per_diem_entry,
      customMessage
    );
  }

  oncloseDialog() {
    this.isErrorDialogVisible = false;
  }
}
