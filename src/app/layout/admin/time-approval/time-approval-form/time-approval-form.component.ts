import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SortDescriptor, process } from '@progress/kendo-data-query';
import { ModuleNames, ErrorMessages } from 'src/app/core/constant';
import { TimeApprovalService } from '../timeapproval.service';
import { ErrorHandlerService, PagerService } from 'src/app/core/services';
import { UtilityService } from 'src/app/core/services/utility.service';
import { DatePipe } from '@angular/common';
import moment from 'moment';
import { PaginationWithSortRequest } from 'src/app/core/models/pagination.model';
import { PageChangeEvent } from '@progress/kendo-angular-grid';
@Component({
  selector: 'app-time-approval-form',
  templateUrl: './time-approval-form.component.html',
  styleUrls: ['./time-approval-form.component.scss'],
})
export class TimeApprovalFormComponent implements OnInit {
  @Output('onHandleCancel') onHandleCancel: EventEmitter<any> =
    new EventEmitter();
  timeApprovalForm: FormGroup;
  @Input() selectedRow: any;
  sort: SortDescriptor[] = [{
    field: 'job',
    dir: 'asc',
  }];
  skip: number = 0;
  totalJob: number = 0;
  multiple: boolean = false;
  isConfirmDialogVisible: boolean = false;
  confirmDialogHeader: string = '';
  confirmDialogMessage: string = '';
  isResetUnionCode: boolean = false;
  selectedUnionCode: string = '';
  isAddPunch: boolean = false;
  isErrorVisible: boolean = false;
  errorDialogHeader: string = '';
  errorDialogMessage: string = '';

  isLaborTypeVisible: boolean = false;
  laborTypes: any = [];
  laborTypesColumns: any = [];
  laborTypesSelections: number[] = [];

  isJobNumberVisible: boolean = false;
  jobNumbers: any = [];
  jobNumbersColumns: any = [];
  jobNumbersSelections: number[] = [];

  isUnionCodeVisible: boolean = false;
  unionCodes: any = [];
  tempUnionCodes: any = [];

  unionCodesColumns = [
    {
      Name: 'unionCode',
      isCheck: true,
      Text: 'Code',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'description',
      isCheck: true,
      Text: 'Description',
      isDisable: false,
      index: 0,
      width: 100,
    },
  ];
  unionCodesSelections: number[] = [];

  isUnionClassVisible: boolean = false;
  unionClasses: any = [];
  unionClassesColumns: any = [];
  unionClassesSelections: number[] = [];
  jobNumberDisable: boolean = true;
  unionCodeDisable: boolean = true;
  unionClassDisable: boolean = true;
  filterCollection: any = {
    branch: 'All',
    searchText: '',
  };
  public pageSize = 15;
  isDelete: boolean = false;
  button_name: string = 'Add Punch';
  valueIn: any;
  valueOut: any;
  constructor(private formBuilder: FormBuilder, public service: TimeApprovalService,
    public errorHandler: ErrorHandlerService, public datepipe: DatePipe, public pagerService: PagerService,
    private utils: UtilityService) {
  }

  ngOnInit(): void {
    this.pagerService.start = 1;
    this.pagerService.pageSize = 10;
    this.onInitForm();
    this.service.GetTimeApprovalLabourType().subscribe((res) => {
      this.laborTypes = res;
    })
    this.getJobData();
    this.service.GetTimeApprovalUnionCodes().subscribe((res) => {
      this.unionCodes = res;
      this.tempUnionCodes = res;
    })
  }

  getJobData() {
    var request = new PaginationWithSortRequest<any>();
    request.pageSize = this.pagerService.pageSize;
    request.sortColumn = this.sort[0].field;
    request.sortDesc = this.sort[0].dir == 'desc' ? true : false;
    request.request = this.filterCollection;
    if (this.filterCollection.searchText) {
      request.pageNumber = 1;
    } else {
      request.pageNumber = this.pagerService.start;
    }
    this.service.GetTimeApprovalJob(request).subscribe((res) => {
      this.jobNumbers = res.data;
      this.totalJob = res.data[0].totalRecords;
    })
  }
  public onPageChange(e: PageChangeEvent): void {
    this.skip = e.skip;
    this.pageSize = e.take;
    this.pagerService.start = this.skip == 0 ? 1 : (this.skip / this.pageSize) + 1;
    this.getJobData();
  }
  onInitForm() {
    this.timeApprovalForm = this.formBuilder.group({
      employeeName: this.selectedRow.ee,
      employeeId: this.selectedRow.employeeNumber,
      dateIn: new Date(),
      timeIn: [],
      dateOut: new Date(),
      timeOut: [],
      hours: '0.00',
      laborType: '',
      jobNumber: '',
      unionCode: '',
      unionClass: '',
      unionRate: 0,
      id: [],
    });
  }

  onHandleOperations(type) {
    switch (type) {
      case 'labor_type':
        this.isLaborTypeVisible = !this.isLaborTypeVisible;
        break;
      case 'job_number':
        this.isJobNumberVisible = !this.isJobNumberVisible;
        break;
      case 'union_code':
        let value = this.timeApprovalForm.get('unionCode').value;
        if (value) {
          this.confirmDialogHeader = 'Reset Union Code, Union Class, and Rate';
          this.confirmDialogMessage =
            'Changing Union Code will reset Union Class and Rate. Continue?';
          this.isConfirmDialogVisible = true;
          this.isUnionCodeVisible = !this.isUnionCodeVisible;
          this.isResetUnionCode = true; this.unionClassDisable = !this.unionClassDisable;
        } else {
          this.unionCodes = this.tempUnionCodes;
          this.isUnionCodeVisible = !this.isUnionCodeVisible;
        }

        break;
      case 'union_class':
        this.service.GetTimeApprovalUnionClasses(this.timeApprovalForm.value.unionCode).subscribe((res) => {
          this.unionClasses = res;
        })
        this.isUnionClassVisible = !this.isUnionClassVisible;
        break;
      case 'add_punch':
        this.confirmDialogHeader = 'Add Time Entry?';
        this.confirmDialogMessage =
          'Are you sure you want to add this time entry?';
        this.isAddPunch = true;
        this.isConfirmDialogVisible = !this.isConfirmDialogVisible;
        break;
      case 'confirm':
        if (this.isResetUnionCode) {
          this.isUnionCodeVisible = true;
          this.isResetUnionCode = false;
        } if (this.isAddPunch) {
          this.AddTimeApproval();
        } if (this.isDelete == true) {
          this.deleteTimeApproval();
        }
        this.isConfirmDialogVisible = !this.isConfirmDialogVisible;
        break;
      case 'error':
        this.isErrorVisible = !this.isErrorVisible;
        break;
      case 'cancel':
        this.onHandleCancel.emit(); this.button_name = 'Add Punch';
        break;
      case 'close':
        this.isConfirmDialogVisible = !this.isConfirmDialogVisible;
        break;
      default:
        break;
    }
  }

  AddTimeApproval() {
    if (!this.timeApprovalForm.get('laborType').value) {
      this.errorDialogHeader = 'Invalid Labor Type';
      this.errorDialogMessage = 'Please select Labor Type';
      this.isErrorVisible = true;
      return false;
    } else if (!this.timeApprovalForm.get('jobNumber').value) {
      this.errorDialogHeader = 'Invalid Job Number';
      this.errorDialogMessage = 'Please select Job Number';
      this.isErrorVisible = true;
      return false;
    }
    //  else if (!this.timeApprovalForm.get('unionCode').value) {
    //   this.errorDialogHeader = 'Invalid Union Code';
    //   this.errorDialogMessage = 'Please select Union Code';
    //   this.isErrorVisible = true;
    // } 
    else if (!this.timeApprovalForm.get('unionClass').value && this.timeApprovalForm.get('unionCode').value) {
      this.errorDialogHeader = 'Invalid Union Class';
      this.errorDialogMessage = 'Please select Union';
      this.isErrorVisible = true;return false;
    }
    else if (!this.timeApprovalForm.get('employeeName').value) {
      this.errorDialogHeader = 'Invalid Union Class';
      this.errorDialogMessage = 'Please select Union';
      this.isErrorVisible = true;return false;
    }
    else if (!this.valueIn) {
      this.errorDialogHeader = 'Invalid TimeIn';
      this.errorDialogMessage = 'Please select Timein';
      this.isErrorVisible = true;return false;
    } else if (!this.valueOut) {
      this.errorDialogHeader = 'Invalid TimeOut';
      this.errorDialogMessage = 'Please select TimeOut';
      this.isErrorVisible = true;return false;
    }
    else {
      this.timeApprovalForm.setValue({
        ...this.timeApprovalForm.value,
        employeeName: this.timeApprovalForm.value.employeeName,
        employeeId: this.timeApprovalForm.value.employeeId
      });
    }
    var dtin = this.datepipe.transform(this.valueIn, 'MM/dd/yyyy HH:mm:ss');//this.datepipe.transform(this.timeApprovalForm.value.timeIn, 'MM/dd/yyyy hh:mm:ss') ;
    var dtOut = this.datepipe.transform(this.valueOut, 'MM/dd/yyyy HH:mm:ss');//this.timeApprovalForm.value.timeOut;


    this.timeApprovalForm.controls['timeIn'].setValue(dtin);
    this.timeApprovalForm.controls['timeOut'].setValue(dtOut);
    // this.timeApprovalForm.value.timeIn.setDate(this.timeApprovalForm.value.dateIn.getDate());
    // this.timeApprovalForm.value.timeOut.setDate(this.timeApprovalForm.value.dateOut.getDate());
  
    if (this.timeApprovalForm.value.id) {
      this.service.UpdatePunchTimeApproval(this.timeApprovalForm.value).subscribe(
        (res) => {
          if (res['status'] == 200) {
            this.utils.toast.success(res['message']);
            this.onHandleCancel.emit();
          }
        },
        (error) => {
          this.onError(error, ErrorMessages.timeapproval.save_addpunch);
        }
      );
    } else {
      this.service.AddPunchTimeApproval(this.timeApprovalForm.value).subscribe(
        (res) => {
          if (res['status'] == 200) {
            this.utils.toast.success(res['message']);
            this.onHandleCancel.emit();
          }
        },
        (error) => {
          this.onError(error, ErrorMessages.timeapproval.save_addpunch);
        }
      );
    }
  }
  private onError(error: any, customMessage?: string) {
    this.errorHandler.handleError(error, ModuleNames.fleet, customMessage);
  }
  onResizeColumn(event) { }

  onSelectionChange(event, type) {
    switch (type) {
      case 'labor_type':
        this.timeApprovalForm.setValue({
          ...this.timeApprovalForm.value,
          laborType: event.selectedRows[0].dataItem.lookupValue,
        });
        this.isLaborTypeVisible = !this.isLaborTypeVisible;
        this.jobNumberDisable = false;
        break;
      case 'job_number':
        this.timeApprovalForm.setValue({
          ...this.timeApprovalForm.value,
          jobNumber: event.selectedRows[0].dataItem.jobNumber,
        });
        this.isJobNumberVisible = !this.isJobNumberVisible;
        this.unionCodeDisable = false;
        break;
      case 'union_code':
        this.timeApprovalForm.setValue({
          ...this.timeApprovalForm.value,
          unionCode: event.selectedRows[0].dataItem.unionCode,
        });
        this.isUnionCodeVisible = !this.isUnionCodeVisible;
        this.unionClassDisable = false;
        break;
      case 'union_class':
        this.timeApprovalForm.setValue({
          ...this.timeApprovalForm.value,
          unionClass: event.selectedRows[0].dataItem.type,
          unionRate: event.selectedRows[0].dataItem.rate,
        });
        this.isUnionClassVisible = !this.isUnionClassVisible;
      default:
        break;
    }
   
  }

  onSortChange(sort: SortDescriptor[]) {
    this.sort = sort;
  }

  onReOrderColumns(event) { }

  onDataStateChange(event) { }
  public handleChange(value: Date, type: string) {

    if (type == 'timeIn')
      this.getDiffDays(value, this.valueOut??new Date());
    else
      this.getDiffDays(this.valueIn??new Date(), value);
  }
  getDayDiff() {
    if(this.valueIn != undefined && this.valueOut != undefined) {
    var startDate = new Date(this.valueIn);
    var endDate = new Date(this.valueOut);
    startDate.setDate(this.timeApprovalForm.value.dateIn.getDate());
    startDate.setMonth(this.timeApprovalForm.value.dateIn.getMonth());
    endDate.setDate(this.timeApprovalForm.value.dateOut.getDate());
    endDate.setMonth(this.timeApprovalForm.value.dateOut.getMonth());
    this.valueIn = startDate;
    this.valueOut = endDate;
    var Time = endDate.getTime() - startDate.getTime();
    if (Time < 0) {
      this.utils.toast.error('Out date/time must be greater than In date/time.');
    }
    var hrs = Math.floor(Time / 1000 / 60 / 60); //Math.floor((Time % 86400000) / 3600000);
    var minuts = Math.round(((Time % 86400000) % 3600000) / 60000)/60;
    this.timeApprovalForm.controls['hours'].setValue((hrs +minuts).toFixed(2));
  }
  }
  getDiffDays(sDate, eDate) {
    var startDate = new Date(sDate);
    var endDate = new Date(eDate);
    startDate.setDate(this.timeApprovalForm.value.dateIn.getDate());
    startDate.setMonth(this.timeApprovalForm.value.dateIn.getMonth());
    endDate.setDate(this.timeApprovalForm.value.dateOut.getDate());
    endDate.setMonth(this.timeApprovalForm.value.dateOut.getMonth());
    this.valueIn = startDate;
    this.valueOut = endDate;
    var Time = endDate.getTime() - startDate.getTime();
    if (Time < 0) {
      this.utils.toast.error('Out date/time must be greater than In date/time.');
    }
    var hrs = Math.floor(Time / 1000 / 60 / 60);// Math.floor((Time % 86400000) / 3600000);
    var minuts = Math.round(((Time % 86400000) % 3600000) / 60000)/60;
    this.timeApprovalForm.controls['hours'].setValue((hrs + minuts).toFixed(1));
  }
  editClick(data) {
    //this.isAddPunch = true;
    var inYear = new Date(data.date).getFullYear();
    var inMonth = new Date(data.date).getMonth();
    var inDate = new Date(data.date).getDate();
    var outYear =data.dateOut.split('-')[2]; //new Date(data.timeOutStore).getFullYear();
    var outMonth =data.dateOut.split('-')[0]// new Date(data.timeOutStore).getMonth();
    var outDate =data.dateOut.split('-')[1] //new Date(data.timeOutStore).getDate();
    this.button_name = 'Update Punch';
    this.service.GetTimeApprovalUnionClasses(data.unionCode).subscribe((res) => {
      this.unionClasses = res;
    })
    this.timeApprovalForm.setValue({
      employeeName: data.employeeName,
      employeeId: data.employeeNumber,
      dateIn:new Date(inYear, inMonth, inDate), //new Date(this.datepipe.transform(data.timeInStore, 'MM/dd/yyyy')),
      timeIn: new Date(inYear, inMonth, inDate, data.timeIn.split(':')[0], data.timeIn.split(':')[1]),
      dateOut: new Date(outYear, outMonth-1, outDate),
      timeOut:new Date(outYear, outMonth-1, outDate, data.timeOut.split(':')[0], data.timeOut.split(':')[1]),
      hours: data.hours,
      laborType: data.laborType,
      jobNumber: data.jobNumber,
      unionCode: data.unionCode,
      unionClass: data.unionClass,
      unionRate: data.unionRate,
      id:data.timeClockPK
    });
    this.unionClassDisable = false;
    this.valueIn = new Date(inYear, inMonth, inDate, data.timeIn.split(':')[0], data.timeIn.split(':')[1]);
    this.valueOut = new Date(outYear, outMonth-1, outDate, data.timeOut.split(':')[0], data.timeOut.split(':')[1]);
  }

  openDeleteApproval() {
    this.confirmDialogHeader = 'Delete Time Entry?';
    this.confirmDialogMessage =
      'Are you sure you want to delete this time entry?';
    this.isDelete = true;
    this.isConfirmDialogVisible = !this.isConfirmDialogVisible;
  }
  deleteTimeApproval() {
    let user = JSON.parse(localStorage.getItem('currentUser'));
    var obj = {
      id: this.timeApprovalForm.value.id,
      user: user.userId
    }
    this.service.DeletePunchTimeApproval(obj).subscribe((res) => {
      this.utils.toast.success(res['message']);
      this.onHandleCancel.emit();
    })
  }
  data: any;
  public onFilter(inputValue: string): void {

    this.data = process(this.tempUnionCodes, {
      filter: {
        logic: 'or',
        filters: [
          {
            field: 'unionCode',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'description',
            operator: 'contains',
            value: inputValue,
          }
        ],
      },
    }).data;
    this.unionCodes = this.data;
  }
}
