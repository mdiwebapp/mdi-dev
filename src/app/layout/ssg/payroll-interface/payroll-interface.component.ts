import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { SelectionRange } from '@progress/kendo-angular-dateinputs';
import { GroupKey } from '@progress/kendo-angular-grid';
import { process, SortDescriptor, State } from '@progress/kendo-data-query';
import { Day, nextDayOfWeek, prevDayOfWeek } from '@progress/kendo-date-math';
import {PayrollInterfaceService} from './payroll-interface.service';
import * as fileSaver from 'file-saver';
import { UtilityService } from 'src/app/core/services/utility.service';
import { MenuService } from 'src/app/core/helper/menu.service';

@Component({
  selector: 'app-payroll-interface',
  templateUrl: './payroll-interface.component.html',
  styleUrls: ['./payroll-interface.component.scss'],
})
export class PayrollInterfaceComponent implements OnInit {
  sort: SortDescriptor[] = [];
  startDate: any;
  endDate:any;
  selections: any = [];
  skip: number = 0;
  totalData: number = 0;
  multiple: boolean = false;
  isTimeReportVisible: boolean = false;
  confirm_title: string = '';
  confirm_message: string = '';
  isConfirmDialogVisible: boolean = false;
  isConfirmDialogOkVisible: boolean = false;
  expandedGroupKeys: Array<GroupKey> = [];
  groupData: any = [];
  groupcolumn: any = [];
  group: any = [];
  branches: any = [];
  state: State = {
    group: [{ field: 'branch' }],
  };

  branchcolumns = [
    {
      Name: 'branch',
      isCheck: true,
      Text: 'Branch',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'employeeName',
      isCheck: true,
      Text: 'Name',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'timeIn',
      isCheck: true,
      Text: 'TimeIn',
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
    // {
    //   Name: 'am',
    //   isCheck: true,
    //   Text: 'Am',
    //   isDisable: false,
    //   index: 0,
    //   width: 100,
    // },
    // {
    //   Name: 'admin',
    //   isCheck: true,
    //   Text: 'Admin',
    //   isDisable: false,
    //   index: 0,
    //   width: 100,
    // },
  ];
  branchData = [
    {
      branch: 'Putnam',
      name: 'Michael Kinstler',
      timeIn: '2022-09-06 08:00:00 +00:00',
      hours: '9',
      am: '',
      admin: '',
    },
  ];
  tempBranch: any;
  public value = 0;
  public running: number;
  constructor(public service: PayrollInterfaceService,private utils: UtilityService,public menuService: MenuService) {
    //this.branches = process(this.branchData, this.state);
    if (localStorage.getItem('isAdmin') == 'true') {

    } else {
      let acc = this.menuService.checkUserViewRights('Payroll Interface');
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
      this.menuService.checkUserBySubmoduleRights('Payroll Interface');
    }
  }

  ngOnInit(): void {
    this.setWeekDate();
    // var fromdate = new Date();
    // var todate = new Date();
    // this.startDate=new Date(fromdate.setDate(fromdate.getDate() - 7));
    // this.endDate=new Date(todate.setDate(todate.getDate()-1));
    this.getListData();  
  }
  getListData(){
    // var obj ={
    //   "startDate": this.startDate,
    //   "endDate": this.endDate,
    //   "union": true
    // }
    // this.service.GetPayrollInterfaceList(obj).subscribe((res) => {
    //   this.branches =process(res, this.state);    
    // });
    this.startProgress();
    var objs ={
      "startDate": this.startDate,
      "endDate": this.endDate,
     // "union": true
    }
    this.service.GetPayrollInterfaceTime(objs).subscribe((res) => {
      this.tempBranch=res;this.totalData = res.length;
      this.branches =process(res, this.state);  
      this.stopProgress();
    });
    
  }
  onFilter(inputValue:string){
          
     var data  = process(this.tempBranch, {
      filter: {
        logic: 'or',
        filters: [
          {
            field: 'branch',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'employeeName',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'timeIn',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'hours',
            operator: 'contains',
            value: inputValue,
          }
        ],
      },
    }).data;
    this.branches =process(data, this.state);  
    this.totalData = this.branches.length;
  }
  getExceptionReportData(){
    var obj ={
      "startDate": this.startDate
    }
    this.service.GetPayrollInterfaceExceptionReport(obj).subscribe((res) => {
      //this.branches = res;     
    });
  }
  GetPayrollInterfaceTimeData(){
    var obj ={
      "startDate": this.startDate,
      "endDate": this.endDate
    }
    this.service.GetPayrollInterfaceTime(obj).subscribe((res) => {
      //this.branches = res;     
    });
  }
  GetPayrollInterfaceGrTimeData(){
    var obj ={
      "startDate": this.startDate,
      "endDate": this.endDate
    }
    this.service.GetPayrollInterfaceGrTime(obj).subscribe((res) => {
      //this.branches = res;     
    });
  }
  PayrollInterfaceCreateInterfaceFiles(){
    var obj ={
      "startDate": this.startDate,
      "endDate": this.endDate
    }
    this.service.PayrollInterfaceCreateInterfaceFiles(obj).subscribe(
      (res) => {
        this.utils.toast.success(res.message);
        // let data = new Blob([res], {
        //   type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;',
        // });
        // fileSaver.saveAs(data, 'PayrollInterface_Info.xlsx');
      },
      (error) => {
        //this.onError(error, ErrorMessages.vehicle.download_vehicle_data);
      }
    );
    // this.service.PayrollInterfaceCreateInterfaceFiles(obj).subscribe((res) => {     
    //   //this.branches = res;     
    // });
  }
  onResizeColumn(event) {}

  onSelectionChange(event) {}

  onSortChange(event) {}

  onReOrderColumns(event) {}

  onDataStateChange(event) {}

  groupChange() {}

  onHandleOperation(type) {
    switch (type) {
      case 'time_report':
        this.isTimeReportVisible = !this.isTimeReportVisible;
        break;
      case 'submit':
        // this.confirm_title = 'MDI3.0';
        // this.confirm_message = 'Invalid Date Range.';
        this.isConfirmDialogVisible = false;
        this.isTimeReportVisible = !this.isTimeReportVisible;
        this.getListData();  
        break;
      case 'exception_report':
        this.confirm_title = 'MDI3.0';
        this.confirm_message = 'NONE';
        this.isConfirmDialogVisible = true;
        this.getExceptionReportData();
        break;
      case 'confirm':
        this.isConfirmDialogVisible = !this.isConfirmDialogVisible;
        break;
      case 'confirm_ok':
        this.isConfirmDialogOkVisible = !this.isConfirmDialogOkVisible;
        break;
      case 'create_interfacefile':
        this.confirm_title = 'Approval Needed';
        this.confirm_message = 'Do you Want to lock time approval?';
        this.isConfirmDialogOkVisible = true;
        this.PayrollInterfaceCreateInterfaceFiles();
        break;
      case 'adp_mdi_hours':
        this.confirm_title = 'Import ADP CSV to MDI';
        this.confirm_message = 'Do yo wish to impot time?';
        this.isConfirmDialogOkVisible = true;
        break;
      default:
        break;
    }
  }
  public range = {
    start: new Date(),
    end: new Date(),
  };
  setWeekDate() { 
    var weekday = new Array(7);
    weekday[0] = "Sun";
    weekday[1] = "Mon";
    weekday[2] = "Tue";
    weekday[3] = "Wed";
    weekday[4] = "Thu";
    weekday[5] = "Fri";
    weekday[6] = "Sat";

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
      
      this.startDate=newdate;
      this.range.start=newdate;
      this.handleSelectionRange(this.range);
      // var dt = endDate.setDate(newdate.getDate() + 6);
      // this.filterForm.controls['endDate'].setValue(new Date(dt));
    } else {
      this.range.start=currentDate;
      this.handleSelectionRange(this.range);
      // var endDate: Date = currentDate;
      // var newdate = new Date();
      // this.filterForm.controls['startDate'].setValue(newdate);
      // var dt = endDate.setDate(newdate.getDate() + 6);
      // this.filterForm.controls['endDate'].setValue(new Date(dt));
    }

  }

  public handleSelectionRange(range: SelectionRange): void {
    const firstWeekDay = prevDayOfWeek(range.start, Day.Monday);
    const lastWeekDay = nextDayOfWeek(firstWeekDay, Day.Sunday);
    this.startDate=firstWeekDay;
    this.endDate=lastWeekDay;
    //this.range = { start: firstWeekDay, end: lastWeekDay };
  }

  public startProgress(): void {
    this.running = setInterval(() => {
      if (this.value <= 100) {
        this.value++;
      } else {
        this.stopProgress();
      }
    }, 10);
  }

  public stopProgress(): void {
    if (this.running) {
      clearInterval(this.running);
      this.running = null;
    }
  }

  public resetProgress(): void {
    this.value = 0;
    this.stopProgress();
  }
}
