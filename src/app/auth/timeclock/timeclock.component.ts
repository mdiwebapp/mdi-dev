import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuService } from 'src/app/core/helper/menu.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { TimeClockService } from 'src/app/layout/tools/time-clock/time-clock.service';
import { DatePipe } from '@angular/common';
import { SortDescriptor } from '@progress/kendo-data-query';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-timeclock',
  templateUrl: './timeclock.component.html',
  styleUrls: ['./timeclock.component.scss']
})
export class TimeclockComponent implements OnInit {
  timeClock: FormGroup;
  sort: SortDescriptor[] = [];
  selections: any = [];
  skip: number = 0;
  multiple: any = [];
  isUserVisible: boolean = false;
  inputValue: string = '';
  jobValue: string = ''
  Label1: string = '';
  Label2: string = '';
  Label3: string = '';
  PTOData: any = [];
  isnotEmployee: boolean = false;
  isPunchOUTVisible: boolean = false;
  isPunchInVisible: boolean = false;
  selectedEmployeeNo: any = 0;
  selectedJobNo: any = 0;
  isdialogPunchOutVisible: boolean = false;
  isEmployeeDisabled: boolean = false;
  isJobDisabled: boolean = true;
  isPunchInAllowed: boolean = false;
  timediff: any
  isDaysVisible: boolean = true;
  isWeeksVisible: boolean = false;
  isLastWeeksVisible: boolean = false;
  Daysdata: any = [];
  Weeksdata: any = [];
  lastWeeksdata: any = [];
  daysselections: any = [];
  weeksselections: any = [];
  lastWeeksselections: any = [];
  ischangeJobVisible: boolean = false;
  isJobChanged: boolean = false;
  isdialogChangeJobVisible: boolean = false;
  previousJobNo: any;
  isInvalidJob: boolean = false;
  hourColumns: any = [
    {
      Name: 'jobNumber',
      isCheck: true,
      Text: 'Job',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'timeIn',
      isCheck: true,
      Text: 'TimeIN',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'objtimeIn',
      isCheck: true,
      Text: 'TimeIN',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'timeOut',
      isCheck: true,
      Text: 'TimeOut',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'objtimeOut',
      isCheck: true,
      Text: 'TimeOut',
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
  PTOColumns: any = [
    {
      Name: 'approvedBy',
      isCheck: true,
      Text: 'Approved By',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'employeeNumber',
      isCheck: true,
      Text: 'EmployeeNumber',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'enteredBy',
      isCheck: true,
      Text: 'EnteredBy',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'enteredDate',
      isCheck: true,
      Text: 'EnteredDate',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'job',
      isCheck: true,
      Text: 'Job',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'paid',
      isCheck: true,
      Text: 'Paid',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'pk',
      isCheck: true,
      Text: 'PK',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'workDate',
      isCheck: true,
      Text: 'Work Date',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'objworkDate',
      isCheck: true,
      Text: 'Work Date',
      isDisable: false,
      index: 0,
      width: 100,
    },
  ]
  visible: boolean = false;
  isTab1: boolean = false;
  isTab2: boolean = false;
  constructor(private formBuilder: FormBuilder,private titleService:Title
    , private service: TimeClockService,
    private utility: UtilityService, public menuService: MenuService, public router: Router,
    public datepipe: DatePipe) {
    if (localStorage.getItem('isAdmin') == 'true') {
      this.isTab1 = false;
      this.isTab2 = false;
    } else {
      // let acc = this.menuService.checkUserViewRights('Time Clock');
      // if (acc) { 
      // } else {
      //   this.utility.toast.error(
      //     'You do not have permissions to access this part of the system. Please contact your supervisor so they can request them from IT.'
      //   );
      //   setTimeout(() => {
      //     var url = '/dashboard';
      //     location.href = url;
      //   }, 1000);        
      // }

      // this.menuService.checkUserBySubmoduleRights('Hours');
      // const rights = JSON.parse(localStorage.getItem('Rights'));
      // if (rights) {
      //   this.isTab1 = !rights.some(
      //     (c) =>
      //       c.subModuleName == 'Hours' &&
      //       c.moduleName == 'Time Clock' &&
      //       c.tabName == 'VIEW'
      //   );
      //   this.isTab2 = !rights.some(
      //     (c) =>
      //       c.subModuleName == 'PTODays' &&
      //       c.moduleName == 'Time Clock' &&
      //       c.tabName == 'VIEW'
      //   );
      // }
    }
    // if (localStorage.getItem('isAdmin') == 'true') {    }
    // else {
    //   let acc = this.menuService.checkUserViewRights('Hours');
    //   if (acc) {
    //     //this.utils.toast.error("User does not have rights to access " + name + " module.");Z
    //   } else {
    //     this.router.navigate(['dashboard']);
    //   }
    // }

  }
  ngOnInit(): void {
    this.titleService.setTitle('Time Clock');
    this.onInitTimeClockForm();
  }
  onInitTimeClockForm() {
    this.timeClock = this.formBuilder.group({
      JobNo: '',
      JobName: '',
      user: 'NO USER',
      EmployeeNo: '',
      hours: 'days'
    });
    this.Label1 = "";
    this.Label2 = "";
    this.Label3 = "";
  }
  onReportTypeChange(type) {

    var typename = type.target.value;
    if (typename == 'days') {
      this.isDaysVisible = true;
      this.isWeeksVisible = false;
      this.isLastWeeksVisible = false;
    }

    if (typename == 'week') {
      this.isWeeksVisible = true;
      this.isDaysVisible = false;
      this.isLastWeeksVisible = false;
    }

    if (typename == 'lastweek') {
      this.isDaysVisible = false;
      this.isWeeksVisible = false;
      this.isLastWeeksVisible = true;
    }

  }


  onResizeColumn(event) { }
  onSelectionChange(event) { }
  onSortChange(event) { }
  onReOrderColumns(event) { }
  onDataStateChange(event) { }
  onInitActivityForm(form) { }
  onValueChange(value) {
    if (this.isJobDisabled) {
      this.inputValue += value;
      this.timeClock.controls['EmployeeNo'].setValue(this.inputValue);
    }
    if (this.isEmployeeDisabled) {
      this.jobValue += value;
      this.timeClock.controls['JobName'].setValue(this.jobValue);
    }
  }
  onHandleOperation(type, event = null) {
    switch (type) {
      case 'user':
        this.isUserVisible = !this.isUserVisible;
        break;
      case 'cancel':
        this.inputValue = '';
        this.jobValue = '';
        this.Daysdata = [];
        this.Weeksdata = [];
        this.lastWeeksdata = [];
        this.selectedEmployeeNo = 0;
        this.selectedJobNo = 0;
        this.isPunchInVisible = false;
        this.isPunchOUTVisible = false;
        this.ischangeJobVisible = false;
        this.isEmployeeDisabled = false;
        this.isJobDisabled = true;
        this.timeClock.controls['EmployeeNo'].setValue('');
        this.timeClock.controls['JobName'].setValue('');
        this.timeClock.controls['JobNo'].setValue('');
        this.PTOData = [];
        this.Label1 = "";
        this.Label2 = "";
        this.Label3 = "";
      default:
        break;
    }
  }
  closeInvalidEmployee() {
    this.isnotEmployee = false;
    this.inputValue = '';
    this.timeClock.controls['EmployeeNo'].setValue('');
    this.isEmployeeDisabled = false;
    this.isJobDisabled = true;
  }

  GetDetail() {
    if (this.isEmployeeDisabled == false) {
      this.GetEmployeeHourDetails();
      this.GetPTODetail();
    }
    if (this.isJobDisabled == false) {
      this.loadJobDetail();
    }

  }

  GetEmployeeHourDetails() {
    this.visible = false;
    this.visible = true;
    var EmployeeNo = this.timeClock.value.EmployeeNo;
    if (!isNaN(EmployeeNo)) {
      if (EmployeeNo > 0) {
        this.selectedEmployeeNo = EmployeeNo;
      }
      this.service.GetEmployeeHourDetail(EmployeeNo).subscribe((res) => {

        this.inputValue = res.firstName + " " + res.lastName;
        if (res.firstName == null && res.lastName == null) {
          this.inputValue = '';
          this.isnotEmployee = true;
        }
        this.previousJobNo = res.activeJobNumber;
        this.timeClock.controls['JobName'].setValue(res.jobTitle);
        this.timeClock.controls['JobNo'].setValue(res.activeJobNumber);

        if (res.dayHourList != null) {
          this.Daysdata = res.dayHourList.map(x => {
            return {
              objtimeIn: this.datepipe.transform(x.timeIn, "MM/dd/yyyy hh:mm:ss a"),
              objtimeOut: this.datepipe.transform(x.timeOut, "MM/dd/yyyy hh:mm:ss a"),
              ...x
            }
          });
        }
        else {
          this.Daysdata = [];
        }
        if (res.weekHourList != null) {
          this.Weeksdata = res.weekHourList.map(x => {
            return {
              objtimeIn: this.datepipe.transform(x.timeIn, "MM/dd/yyyy hh:mm:ss a"),
              objtimeOut: this.datepipe.transform(x.timeOut, "MM/dd/yyyy hh:mm:ss a"),
              ...x
            }
          });
        }
        else {
          this.Weeksdata = [];
        }
        if (res.lastWeekHourList != null) {
          this.lastWeeksdata = res.lastWeekHourList.map(x => {
            return {
              objtimeIn: this.datepipe.transform(x.timeIn, "MM/dd/yyyy hh:mm:ss a"),
              objtimeOut: this.datepipe.transform(x.timeOut, "MM/dd/yyyy hh:mm:ss a"),
              ...x
            }
          });
        }
        else {
          this.lastWeeksdata = [];
        }
        if (res.activeJobNumber != null && res.activeJobNumber != '') {
          this.selectedJobNo = res.activeJobNumber;
        }
        if (!res.jobTitle) {
          this.isEmployeeDisabled = true;
          this.isJobDisabled = false;
        }
        if (!res.punchedIn) {

          var punchedOuttime = res.punchedOutTime
          if (punchedOuttime != null && punchedOuttime != '') {
            var objpunchOuttime = new Date(res.punchedOutTime);
            var punchinTime = new Date(objpunchOuttime.setMinutes(objpunchOuttime.getMinutes() + 30));
            var currenttime = new Date();
            if (currenttime > punchinTime) {
              if (res.activeJobNumber > 0) {
                this.isPunchInVisible = true;
              }
            }
            else {
              this.onHandleOperation('cancel');

              this.inputValue = res.firstName + " " + res.lastName;
              this.timeClock.controls['EmployeeNo'].setValue(EmployeeNo);
              this.timediff = Math.ceil((punchinTime.getTime() - currenttime.getTime()) / 60000);
              this.isPunchInAllowed = true;
              this.isPunchInVisible = false;
            }
          }

        }
        if (res.punchedIn && this.timeClock.value.JobName != null && this.timeClock.value.JobName != '') {
          this.isPunchOUTVisible = true;
          this.ischangeJobVisible = true;
        }
        this.visible = true;
        this.visible = false
      }, (error) => {
        this.visible = true;
        this.visible = false;
      })
    }
    else {
      this.isnotEmployee = true;
      this.inputValue = '';
    }
  }

  loadJobDetail() {

    this.visible = false;
    this.visible = true;
    var JobNo = this.timeClock.value.JobName;
    this.service.GetJobDetail(JobNo).subscribe((res) => {

      if (res.length > 0) {
        this.selectedJobNo = res[0].jobNumber;
        this.timeClock.controls['JobName'].setValue(res[0].jobName);
        this.isJobDisabled = true;
        this.isPunchInVisible = true;
        this.visible = true;
        this.visible = false;
      }
      else {
        this.isInvalidJob = true;
        this.jobValue = '';
        this.timeClock.controls['JobName'].setValue('');
        this.visible = true;
        this.visible = false;
      }

    }, (error) => {
      this.visible = true;
      this.visible = false;
    })
  }

  GetPTODetail() {

    var EmployeeNo = this.timeClock.value.EmployeeNo;
    if (EmployeeNo != '' && EmployeeNo != null) {
      this.visible = false;
      this.visible = true;
      this.service.GetPTODetailEmployeeNo(EmployeeNo).subscribe((res) => {

        if (res.ptoList != null) {
          if (res.ptoList.length > 0) {

            this.PTOData = res.ptoList.map((x) => { return { objworkDate: new Date(x.workDate), ...x } });
            this.Label1 = "Start: " + res.start;
            this.Label2 = "Used: " + res.used;
            this.Label3 = "End: " + res.end;

          }
        }
        if (res.ptoList === null && res.start === null && res.end === null) {
          this.PTOData = [];
          this.Label1 = "";
          this.Label2 = "";
          this.Label3 = "";
          this.isnotEmployee = true;

        }
        this.visible = true;
        this.visible = false;
      }, (error) => {
        this.visible = true;
        this.visible = false;
      })
    }
    else {
      this.PTOData = [];
      this.Label1 = "";
      this.Label2 = "";
      this.Label3 = "";

      this.isnotEmployee = true;
    }
  }

  OnPunchIn() {

    this.visible = false;
    this.visible = true;
    var previousjobNumber;
    if (!this.isJobChanged) {
      previousjobNumber = '';
    }
    else {
      previousjobNumber = this.previousJobNo;
    }
    var request = { userName: JSON.parse(localStorage.getItem('currentUser')).userName, employeeNumber: this.selectedEmployeeNo, jobNumber: this.selectedJobNo, previousJobNumber: previousjobNumber }
    this.service.PunchInEmployee(request).subscribe((res) => {
      if (res['status'] == 200) {
        this.isPunchInVisible = false;
        this.isPunchOUTVisible = true;
        this.ischangeJobVisible = true
        this.isdialogPunchOutVisible = false;
        this.utility.toast.success(res['message']);
        this.visible = true;
        this.visible = false;
        this.loadHoursData();
      }
      else {
        this.utility.toast.error(res['message']);
        this.visible = true;
        this.visible = false;
      }

    }, (error) => {
      this.visible = true;
      this.visible = false;
    })
  }

  OnPunchOut() {
    this.isdialogPunchOutVisible = true;
  }

  public closePunchOutdialog(data) {
    if (data == 'no') {
      this.isdialogPunchOutVisible = false;
    }

    if (data == 'yes') {
      this.visible = false;
      this.visible = true;

      var request = { userName: JSON.parse(localStorage.getItem('currentUser')).userName, employeeNumber: this.selectedEmployeeNo, jobNumber: this.selectedJobNo }
      this.service.PunchOutEmployee(request).subscribe((res) => {
        if (res['status'] == 200) {
          this.isdialogPunchOutVisible = false;
          this.isPunchInVisible = false;
          this.isPunchOUTVisible = false;
          this.ischangeJobVisible = false;
          this.utility.toast.success(res['message']);
          this.visible = true;
          this.visible = false;
          this.loadHoursData();
        }
        else {
          this.utility.toast.error(res['message']);
          this.visible = true;
          this.visible = false;
        }

      }, (error) => {
        this.visible = true;
        this.visible = false;
      })
    }
  }

  onAddEmployeeno() {
    this.isEmployeeDisabled = false;
    this.isJobDisabled = true;
  }

  onAddJobNo() {
    this.isEmployeeDisabled = true;
    this.isJobDisabled = false;
  }

  closePunchedInAllow() {
    this.isPunchInAllowed = false;
  }

  loadHoursData() {
    if (this.selectedEmployeeNo > 0) {
      this.visible = false;
      this.visible = true;
      this.service.GetEmployeeHourDetail(this.selectedEmployeeNo).subscribe((res) => {
        if (res.dayHourList != null) {
          this.Daysdata = res.dayHourList.map(x => {
            return {
              objtimeIn: this.datepipe.transform(x.timeIn, "MM/dd/yyyy hh:mm:ss a"),
              objtimeOut: this.datepipe.transform(x.timeOut, "MM/dd/yyyy hh:mm:ss a"),
              ...x
            }
          });
        }
        else {
          this.Daysdata = [];
        }
        if (res.weekHourList != null) {
          this.Weeksdata = res.weekHourList.map(x => {
            return {
              objtimeIn: this.datepipe.transform(x.timeIn, "MM/dd/yyyy hh:mm:ss a"),
              objtimeOut: this.datepipe.transform(x.timeOut, "MM/dd/yyyy hh:mm:ss a"),
              ...x
            }
          });
        }
        else {
          this.Weeksdata = [];
        }
        if (res.lastWeekHourList != null) {
          this.lastWeeksdata = res.lastWeekHourList.map(x => {
            return {
              objtimeIn: this.datepipe.transform(x.timeIn, "MM/dd/yyyy hh:mm:ss a"),
              objtimeOut: this.datepipe.transform(x.timeOut, "MM/dd/yyyy hh:mm:ss a"),
              ...x
            }
          });
        }
        else {
          this.lastWeeksdata = [];
        }
        this.visible = true;
        this.visible = false;
      }, (error) => {
        this.visible = true;
        this.visible = false;
      })
    }
  }

  OnChangeJob() {
    this.isdialogChangeJobVisible = true;
  }

  closechangeJobdialog(data: any) {
    if (data == 'no') {
      this.isdialogChangeJobVisible = false;
    }

    if (data == 'yes') {

      this.isJobChanged = true;
      this.isEmployeeDisabled = true;
      this.isJobDisabled = false;
      this.jobValue = '';
      this.previousJobNo = this.selectedJobNo;
      this.timeClock.controls['JobName'].setValue('');
      this.isdialogChangeJobVisible = false;
      this.isPunchOUTVisible = false;
      this.ischangeJobVisible = false;
      this.isPunchInVisible = false;
    }
  }

  closeInvalidJob() {
    this.isInvalidJob = false;
  }
}
