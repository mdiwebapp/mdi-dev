import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { orderBy, SortDescriptor } from '@progress/kendo-data-query';
import { TimeApprovalService } from '../timeapproval.service';
import moment from 'moment';
import { DatePipe } from '@angular/common';
import { DropdownService } from '../../../../core/services/dropdown.service';
import { ErrorMessages, ModuleNames } from 'src/app/core/constant';
import { ErrorHandlerService } from 'src/app/core/services';
import { TimeApprovalFormComponent } from '../time-approval-form/time-approval-form.component';
import * as fileSaver from 'file-saver';
import { UtilityService } from 'src/app/core/services/utility.service';
import { SelectionRange } from '@progress/kendo-angular-dateinputs';
import { Day, prevDayOfWeek, nextDayOfWeek } from '@progress/kendo-date-math';
import { MenuService } from 'src/app/core/helper/menu.service';

@Component({
  selector: 'app-time-approval-info',
  templateUrl: './time-approval-info.component.html',
  styleUrls: ['./time-approval-info.component.scss'],
})
export class TimeApprovalInfoComponent implements OnInit {
  @ViewChild(TimeApprovalFormComponent)
  timeApprovalForm: TimeApprovalFormComponent;
  multiple: boolean = false;

  skip: number = 0;
  employeeSelections: number[] = [0];
  timeSelections: number[] = [0];
  selectedKeyEE: any;
  employeeSort: SortDescriptor[] = [];
  timeApprovalSort: SortDescriptor[] = [];
  timeApprovalSelections: number[] = [];
  selectedTimeApproval: any = null;
  error_title: string = '';
  error_message: string = '';
  isErrorDialogVisible: boolean = false;
  isDisable: boolean = false;
  confirm_title: string = '';
  confirm_message: string = '';
  isConfirmDialogVisible: boolean = false;
  isTimeTrackingDialogVisible: boolean = false;
  isFormVisible: boolean = false;
  flag: boolean = false;
  branches: any = [];
  branchList: any = [];
  branchAll = [
    {
      id: 0,
      value: 'All',
      code: 'All',
    },
  ];
  visible: boolean;
  unionClasses: any = [];
  filterForm: any = {
    dateOptions: 'week',
    startDate: new Date(),
    endDate: new Date(),
    selectedDate: new Date(),
    branch: 'All',
    branchCode: 'All',
  };
  allEmpTimeList: boolean = false;
  hideApproved: boolean = true;
  employees: any = [];
  employeesColumns: any = [
    {
      Name: 'ee',
      isCheck: true,
      Text: 'Employee Name',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'hours',
      isCheck: true,
      Text: 'Hours',
      isDisable: false,
      index: 0,
      width: 100,
    },
  ];

  timeApprovals: any = [];
  timeApprovalsColumns: any = [
    {
      Name: 'employeeName',
      isCheck: true,
      Text: 'Employee Name',
      isDisable: false,
      index: 0,
      width: 120,
    },
    {
      Name: 'timeInStore',
      isCheck: true,
      Text: 'Date In',
      isDisable: false,
      index: 0,
      width: 120,
    },
    {
      Name: 'timeIn',
      isCheck: true,
      Text: 'Time In',
      isDisable: false,
      index: 0,
      width: 65,
    },
    {
      Name: 'timeOutStore',
      isCheck: true,
      Text: 'Date Out',
      isDisable: false,
      index: 0,
      width: 120,
    },
    {
      Name: 'timeOut',
      isCheck: true,
      Text: 'Time Out',
      isDisable: false,
      index: 0,
      width: 75,
    },
    {
      Name: 'hours',
      isCheck: true,
      Text: 'Hours',
      isDisable: false,
      index: 0,
      width: 65,
    },
    {
      Name: 'jobNumber',
      isCheck: true,
      Text: 'Job Number',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'laborType',
      isCheck: true,
      Text: 'Labor Type',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'laborSubTask',
      isCheck: true,
      Text: 'Labor Sub Task',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'unionCode',
      isCheck: true,
      Text: 'Union Code',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'unionClass',
      isCheck: true,
      Text: 'Union Class',
      isDisable: false,
      index: 0,
      width: 100,
    },
  ];
  selectdItem: any;
  selectedType: any;
  opened: boolean = false;
  selectedTime : any;
  constructor(
    private formBuilder: FormBuilder,
    public service: TimeApprovalService,
    private utils: UtilityService,
    public menuService: MenuService,
    public datepipe: DatePipe,
    public dropdownService: DropdownService,
    public errorHandler: ErrorHandlerService

  ) {
    this.timeApprovals = [];
    if (localStorage.getItem('isAdmin') == 'true') {
    } else {
      let acc = this.menuService.checkUserViewRights('Time Approval');
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
      this.menuService.checkUserBySubmoduleRights('Time Approval');
    }
  }

  ngOnInit(): void {
    this.onInitFilterForm();
    this.getBranch();
    this.onDateOptionChange(this.filterForm.value.dateOptions);
    //this.setWeekDate();
  }

  onInitFilterForm() {
    this.filterForm = this.formBuilder.group({
      dateOptions: 'week',
      selectedDate: new Date(),
      branch: 'All',
      startDate: new Date(),
      endDate: new Date(),
      branchCode: 'All',
    });
  }

  onResizeColumn(event) { }

  onSelectionChange(event) {
    this.timeSelections=[];
    this.selectedKeyEE = event.selectedRows[0].dataItem;
    var searchfilter = {
      startDate: this.datepipe.transform(
        (this.filterForm.value.dateOptions=='day'?this.filterForm.value.selectedDate: this.filterForm.value.startDate),
        'MM/dd/yyyy'
      ),
      endDate: this.datepipe.transform(
        (this.filterForm.value.dateOptions=='day'?this.filterForm.value.selectedDate:this.filterForm.value.endDate),
        'MM/dd/yyyy'
      ),
      employee: this.selectedKeyEE.employeeNumber,
      branch: this.filterForm.value.branchCode,
    };
    this.getTimeGridData(searchfilter);
    this.service.GetTimeApprovalEmployeeTime
  }

  onSortChange(sort: SortDescriptor[]) {
    this.employeeSort = sort;
    this.employees = orderBy(this.employees, sort);
    var searchfilter = {
      startDate: this.datepipe.transform(
        this.filterForm.value.startDate,
        'MM/dd/yyyy'
      ),
      endDate: this.datepipe.transform(
        this.filterForm.value.endDate,
        'MM/dd/yyyy'
      ),
      employee: this.employees[0].employeeNumber,
      branch: this.filterForm.value.branchCode,
    };
    this.getTimeGridData(searchfilter);
  }
  onTimeSortChange(sort: SortDescriptor[]) {
    this.timeApprovalSort = sort;
    this.timeApprovals = orderBy(this.timeApprovals, sort);
  }



  onReOrderColumns(event) { }

  onDataStateChange(event) { }

  onHandleOperation(type) {
    switch (type) {
      case 'error':
        this.isErrorDialogVisible = !this.isErrorDialogVisible;
        break;
      case 'print':
        if (!this.selectedTimeApproval) {
          this.error_title = 'Invalid';
          this.error_message = 'No record selected';
          this.isErrorDialogVisible = true;
        }
        break;
      case 'edit':
        this.isFormVisible = !this.isFormVisible;
        this.filterForm.disable();
        setTimeout(() => {
          this.timeApprovalForm.editClick(this.selectedTimeApproval);
        }, 200);
        // if (!this.selectedTimeApproval) {
        //   this.error_title = 'Invalid Time Selection';
        //   this.error_message = 'Please select a time entry to edit';
        //   this.isErrorDialogVisible = true;
        // }
        break;
      case 'new':
        this.isFormVisible = !this.isFormVisible;
        break;
      case 'save':
        this.confirm_title = 'Save Changes?';
        this.confirm_message = 'Do you wish to save the changes?';
        this.isConfirmDialogVisible = true;
        break;
      case 'am':
        this.confirm_title = 'Continue?';
        this.confirm_message =
          'Are you sure you want to approve all time for the AM?';
        this.isConfirmDialogVisible = true;
        this.selectedType = 'AM';
        break;
      case 'admin':
        this.confirm_title = 'Continue?';
        this.confirm_message =
          'Are you sure you want to approve all time for the Admin?';
        this.isConfirmDialogVisible = true;
        this.selectedType = 'entityAdmin';
        break;
      case 'confirm':
        this.isConfirmDialogVisible = !this.isConfirmDialogVisible;
        var allList = [];
        this.timeApprovals.forEach((element) => {
          allList.push(element.pk);
        });
        var data = {
          pk: allList,
          //this.selectdItem.pk
          userName: JSON.parse(localStorage.getItem('currentUser')).userName,
          checkValue: true,
          checkBoxType: this.selectedType,
        };

        this.service.UpdatePunchTimeApprovalCheck(data).subscribe(
          (res) => {
            this.utils.toast.success(res.message);
            this.onDateOptionChange(this.filterForm.value.dateOptions);
          },
          (error) => {
            this.onError(error, 'Error occurred in download time line data');
          }
        );
        break;
      case 'close':
        this.isConfirmDialogVisible = !this.isConfirmDialogVisible;
        break;
      case 'time-edit-entry':
        this.isTimeTrackingDialogVisible = !this.isTimeTrackingDialogVisible;
        break;
      case 'time-edit-entry-close':
        this.isTimeTrackingDialogVisible = !this.isTimeTrackingDialogVisible;
        this.onDateOptionChange(this.filterForm.value.dateOptions);
        break;
      case 'cancel':
        this.isFormVisible = !this.isFormVisible;
        this.filterForm.enable();
        var searchfilter = {
          startDate: this.datepipe.transform(
            this.filterForm.value.startDate,
            'MM/dd/yyyy'
          ),
          endDate: this.datepipe.transform(
            this.filterForm.value.endDate,
            'MM/dd/yyyy'
          ),
          employee: this.selectedKeyEE.employeeNumber,
          branch: this.filterForm.value.branchCode,
        };
        this.getTimeGridData(searchfilter);
        this.onDateOptionChange(this.filterForm.value.dateOptions)
        break;

      default:
        break;
    }
  }

  onDateOptionChange(value) {
    this.employees = [];
    if (value == 'day') {
      var data = {
        startDate: this.datepipe.transform(
          this.filterForm.value.selectedDate,
          'MM/dd/yyyy'
        ),
        endDate: this.datepipe.transform(
          this.filterForm.value.selectedDate,
          'MM/dd/yyyy'
        ),
        timeOverwrite: this.flag,
        branch: this.filterForm.value.branchCode,
      };
      this.service.GetTimeApprovalAllEmployee(data).subscribe(
        (res) => {
          this.employees = res;
          if (this.employees.length > 0) {
            this.selectedKeyEE = this.employees[0];
            this.getTimeGridData(data);
          }
        },
        (error) => {
          this.onError(error, ErrorMessages.timeapproval.save_addpunch);
        }
      );
    } else {
      this.setWeekDate();
      var data1 = {
        startDate: this.datepipe.transform(
          this.filterForm.value.startDate,
          'MM/dd/yyyy'
        ),
        endDate: this.datepipe.transform(
          this.filterForm.value.endDate,
          'MM/dd/yyyy'
        ),
        timeOverwrite: this.flag,
        branch: this.filterForm.value.branchCode,
      };
      this.service.GetTimeApprovalAllEmployee(data1).subscribe((res) => {
        this.employees = res;
        if (this.employees.length > 0) {
          this.selectedKeyEE = this.employees[0];
          this.getTimeGridData(data1);
        }
      });
    }
  }
  getBranch() {
    this.branches = this.branchAll.concat(
      this.utils.storage.CurrentUser.userBranch
    );
    this.branchList = this.branches;
    // this.dropdownService.GetBranchList().subscribe(
    //   (res) => {
    //     if (res) {
    //       this.branches = res;
    //       if (res.length > 0) {
    //         this.branches.forEach(element => {
    //           if (element.value != 'SSG') {
    //             this.branchList.push(element);
    //           }
    //         });
    //         if (this.branchList.length > 0) {
    //           this.GetBranches();
    //         }
    //       }

    //     }
    //   }
    // );
  }
  GetBranches() {
    this.branchList.unshift({ code: 'All', id: 0, value: 'All' });
    this.branches = this.branchList;
  }
  private onError(error: any, customMessage?: string) {
    this.errorHandler.handleError(
      error,
      ModuleNames.time_approval,
      customMessage
    );
  }
  getTimeGridData(data) {
    var searchfilter = {
      startDate: this.datepipe.transform(data.startDate, 'MM/dd/yyyy'),
      endDate: this.datepipe.transform(data.endDate, 'MM/dd/yyyy'),
      employee:
        this.allEmpTimeList == true
          ? 0
          : this.employees[this.employeeSelections[0]].employeeNumber,
      branch: data.branch,
      adminApproved: this.hideApproved == true ? false : true,
    };
    this.timeApprovals = [];this.selectedTimeApproval =[];
    this.visible = true;
    this.service.GetTimeApprovalEmployeeTime(searchfilter).subscribe((res) => {
      if(res){
        this.timeApprovals = res;
        this.selectedTimeApproval = this.timeApprovals[0];
      }else{
        this.timeApprovals=[];
      }
      this.visible = false;
    });
  }
  onBranchChange(event) {
    this.filterForm.controls['branchCode'].setValue(event);
    this.onDateOptionChange(this.filterForm.value.dateOptions);
  }
  onExcel() {
    var data = {
      branch: this.filterForm.value.branch,
      employee:
        this.allEmpTimeList == true
          ? 0
          : this.employees[this.employeeSelections[0]].employeeNumber,
      startDate: this.datepipe.transform(
        this.filterForm.value.startDate,
        'MM/dd/yyyy'
      ),
      endDate: this.datepipe.transform(
        this.filterForm.value.endDate,
        'MM/dd/yyyy'
      ),
      adminApproved: this.hideApproved == true ? false : true,
    };
    this.service.exportToExcel(data).subscribe(
      (res) => {
        let data = new Blob([res], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;',
        });
        fileSaver.saveAs(data, 'TimeLine_Info.xlsx');
      },
      (error) => {
        this.onError(error, 'Error occurred in download time line data');
      }
    );
  }

  changesEmpTimeChange(event, type) {
    if (type == 'showall') this.allEmpTimeList = event.target.checked;
    else if (type == 'showapprove') this.hideApproved = event.target.checked;
    var data1 = {
      startDate: this.datepipe.transform(
        this.filterForm.value.startDate,
        'MM/dd/yyyy'
      ),
      endDate: this.datepipe.transform(
        this.filterForm.value.endDate,
        'MM/dd/yyyy'
      ),
      timeOverwrite: this.flag,
      branch: this.filterForm.value.branchCode,
    };
    //this.selectedKeyEE.employeeNumber = 0;
    this.getTimeGridData(data1);
  }
  onTimeSelectionChange(event) {
    this.selectedTimeApproval = event.selectedRows[0].dataItem;
    this.selectedTime = event.selectedRows[0].dataItem;
  
    //this.timeApprovalForm.editClick(event.selectedTimeApproval[0].dataItem);
  }
  departmentChange(event, dataItem, type) {
    this.selectdItem = dataItem;
    this.selectedType = type;
    //if (type == 'PerDiem' || type == 'Lunch') {
    var data = {
      pk: [dataItem.timeClockPK],
      userName: JSON.parse(localStorage.getItem('currentUser')).userName,
      checkValue: event.target.checked,
      checkBoxType: type,
    };
    this.service.UpdatePunchTimeApprovalCheck(data).subscribe(
      (res) => {
        this.utils.toast.success(res.message);
        this.onDateOptionChange(this.filterForm.value.dateOptions);
      },
      (error) => {
        this.onError(error, 'Error occurred in download time line data');
      }
    );
    //}
  }
  public handleSelectionRange(range: SelectionRange): void {
    const firstWeekDay = prevDayOfWeek(range.start, Day.Monday);
    const lastWeekDay = nextDayOfWeek(firstWeekDay, Day.Sunday);
    this.filterForm.controls['startDate'].setValue(firstWeekDay);
    this.filterForm.controls['endDate'].setValue(lastWeekDay);
    //this.range = { start: firstWeekDay, end: lastWeekDay };
  }
  public range = {
    start: new Date(),
    end: new Date(),
  };
  changeDateRange(event) {
    this.range.start = event;
    ///this.handleSelectionRange(this.range);
    this.setWeekDate();
    // var searchfilter = {
    //   startDate: this.datepipe.transform(
    //     this.filterForm.value.startDate,
    //     'MM/dd/yyyy'
    //   ),
    //   endDate: this.datepipe.transform(
    //     this.filterForm.value.endDate,
    //     'MM/dd/yyyy'
    //   ),
    //   employee: this.selectedKeyEE.employeeNumber,
    //   branch: this.filterForm.value.branchCode,
    // };
    this.onDateOptionChange(this.filterForm.value.dateOptions);
    //this.getTimeGridData(searchfilter);
    // this.range.start = event;
    // this.handleSelectionRange(this.range);
  }
  setWeekDate() {
    var weekday = new Array(7);
    weekday[0] = 'Sun';
    weekday[1] = 'Mon';
    weekday[2] = 'Tue';
    weekday[3] = 'Wed';
    weekday[4] = 'Thu';
    weekday[5] = 'Fri';
    weekday[6] = 'Sat';

    var currentDate = this.range.start;
    var day = weekday[currentDate.getDay()];
    var startIndex = weekday.indexOf(day);
    var indexOfDay = weekday.indexOf('Mon');
    if (startIndex != indexOfDay) {
      var newdate = this.range.start;
      if (startIndex == 0) {
        newdate.setDate(currentDate.getDate() - 6);
      } else if (startIndex == 2) {
        newdate.setDate(currentDate.getDate() - 1);
      } else if (startIndex == 3) {
        newdate.setDate(currentDate.getDate() - 2);
      } else if (startIndex == 4) {
        newdate.setDate(currentDate.getDate() - 3);
      } else if (startIndex == 5) {
        newdate.setDate(currentDate.getDate() - 4);
      } else if (startIndex == 6) {
        newdate.setDate(currentDate.getDate() - 5);
      }

      var endDate = new Date();

      this.filterForm.controls['startDate'].setValue(newdate);
      this.range.start = newdate;
      this.handleSelectionRange(this.range);
      // var dt = endDate.setDate(newdate.getDate() + 6);
      // this.filterForm.controls['endDate'].setValue(new Date(dt));
    } else {
      this.range.start = currentDate;
      this.handleSelectionRange(this.range);
      // var endDate: Date = currentDate;
      // var newdate = new Date();
      // this.filterForm.controls['startDate'].setValue(newdate);
      // var dt = endDate.setDate(newdate.getDate() + 6);
      // this.filterForm.controls['endDate'].setValue(new Date(dt));
    }
  }
  timeApprovalPrint() {
    if(this.timeSelections.length==0){
      this.utils.toast.error('Please select a row to print data.');
      return false;
    }
    var data = this.timeApprovals[this.timeSelections[0]]
   
    console.log(data);
    if(data == null || data === undefined) {
      this.utils.toast.error('Please select a row to print data.');
    }
    else
    {
      if (data.jobNumber < 1000) {
        this.utils.toast.error('This job has no timesheet to print.');
      }
      else if(data.jobTaskPK == null)
      {
        let isnum = /^\d+$/.test(data.jobNumber);
        if (isnum) {
          var data1 = {
            WorkDate: this.datepipe.transform(
             data.workDate,
              'MM/dd/yyyy'
            ),
            JobNumber: data.jobNumber,
            EmployeeNumber: data.employeeNumber,
            EmployeeName: data.employeeName,
          };
          this.onPrintWithJobNumber(data1);
      }
       
      }
      else{
        this.onPrint(); 
      }
    }

  }
  onPrint() {
    if (this.timeSelections.length > 0) {
      var data = this.timeApprovals[this.timeSelections[0]]
      if(data.jobTaskPK){
        this.service.printExcel(data.jobTaskPK).subscribe(
          (res) => {          
            if(res == null || res === undefined)
            {
                this.opened = true;
            }
            else{
              let data = new Blob([res], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;',
              });
              fileSaver.saveAs(data, 'TimeLine_Detail_Info.xlsx');
            }
           
          },
          (error) => {
            this.onError(error, 'Error occurred in download time line data');
          }
        );
      }
     
    }else{
      this.utils.toast.error('Please select a row to print data.');
    }
  }
  onPrintWithJobNumber(data1) {
    if (this.timeSelections.length > 0) {
     
      
        this.service.printExcelWithJobNumber(data1).subscribe(
          (res) => {         
            if(res == null || res === undefined)
            {
              this.opened = true;
            } 
            else
            {
              let data = new Blob([res], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;',
              });
              fileSaver.saveAs(data, 'TimeLine_Detail_Info.xlsx');
            }
        
          },
          (error) => {
            this.onError(error, 'Error occurred in download time line data');
          }
        );
      
     
    }else{
      this.utils.toast.error('Please select a row to print data.');
    }
  }
  openPopup() {
    this.opened = !this.opened;
  }
}
