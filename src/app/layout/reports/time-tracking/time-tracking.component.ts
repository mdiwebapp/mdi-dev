import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { orderBy, SortDescriptor,process } from '@progress/kendo-data-query';
import moment from 'moment';
import { environment } from 'src/environments/environment';
import * as fileSaver from 'file-saver';
import { HttpClient } from '@angular/common/http';
import { DropdownService } from 'src/app/core/services/dropdown.service';
import { DataService } from 'src/app/core/services';
import { MenuService } from 'src/app/core/helper/menu.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-time-tracking',
  templateUrl: './time-tracking.component.html',
  styleUrls: ['./time-tracking.component.scss'],
})
export class TimeTrackingComponent implements OnInit {
  // validation: any;
  timeTrackingForm: FormGroup;
  isEmployeeVisible: boolean = false;
  isJobNumberVisible: boolean = false;
  skip: number = 0;
  multiple: boolean = false;
  employeesGrid: any = [];
  employeeSort: SortDescriptor[] = [];
  employeeSelections: number[] = [];
  employeeColumns: any = [];
  isEmployeeDialogVisible: boolean = false;
  jobNumbersGrid: any = [];
  jobNumberSort: SortDescriptor[] = [];
  jobNumberSelections: number[] = [];
  jobNumberColumns: any = [];
  isJobNumberDialogVisible: boolean = false;
  confirm_title: string = '';
  confirm_message: string = '';
  isConfirmDialogVisible: boolean = false;
  reportTypes: string = '';
  employees: any = [];
  jobNumbers: any = [];
  totalJobs: number = 0;
  pageSize: number = 100;
  pageNumber: number = 1;
  typeStatus = 'Detail';
  groupByStatus = 'Date';
  pageSizeList: any = [
    { id: 0, value: 100 },
    { id: 1, value: 300 },
    { id: 2, value: 500 },
  ];
  employeeData:any;
  tempEmployee:any;
  gettempEmployee:any;
  employeeDrop:any;
  jobDrop:any;
  jobData:any;
  tempJob:any;
  gettempJob:any;
  opened:boolean;
  isRunWeekly:boolean = false;
  public sortEmployee: SortDescriptor[] = [
    {
      field: 'eeid',
      dir: 'asc',
    },
    {
      field: 'name',
      dir: 'asc',
    }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private httpClient: HttpClient,
    private dropdownService: DropdownService,
    private dataService: DataService,
    private utility: UtilityService,
    public menuService: MenuService,
    public datepipe: DatePipe
  ) {
    this.jobNumberColumns = [
      {
        Name: 'jobNumber',
        isCheck: true,
        Text: 'Job Number',
        isDisable: false,
        index: 0,
        width: 60,
      },
      {
        Name: 'jobName',
        isCheck: true,
        Text: 'Job Name ',
        isDisable: false,
        index: 0,
        width: 100,
      },
    ];

    this.employeeColumns = [
      {
        Name: 'eeid',
        isCheck: true,
        Text: 'EE#',
        isDisable: false,
        index: 0,
        width: 60,
      },
      {
        Name: 'name',
        isCheck: true,
        Text: 'Employee Name ',
        isDisable: false,
        index: 0,
        width: 100,
      },
    ];

    if (localStorage.getItem('isAdmin') == 'true') {
     
    } else {
      let acc = this.menuService.checkUserViewRights('Time Tracking Report');
        if (acc) {
          //this.utils.toast.error("User does not have rights to access " + name + " module.");Z
        } else {
          this.utility.toast.error(
            'You do not have permissions to access this part of the system. Please contact your supervisor so they can request them from IT.'
          );
          setTimeout(() => {
            var url = '/dashboard';
            location.href = url;
          }, 1000);
        }
      
    }
  }

  ngOnInit(): void {
    this.onInitForm();
    this.getEmployees();
    this.getJobs();
  }

  onInitForm() {
    this.timeTrackingForm = this.formBuilder.group({
      reportType: 'Weekly',
      fromDate: moment().startOf('week').add(1, 'day').toDate(),
      toDate: moment().endOf('week').add(1, 'day').toDate(),
      employee: '',
      job: '',
      type: '',
      groupBy: '',  
    });
  }

  onReportTypeChange(event) {
    this.timeTrackingForm.setValue({
      ...this.timeTrackingForm.value,
      employee: '',
      job: '',
      type: '',
      groupBy: '',
    });
    this.isEmployeeVisible = false;
  }

  onHandleOperation(type) {
    switch (type) {
      case 'employee':
        if (this.timeTrackingForm.get('reportType').value === 'Complete') {
          this.isEmployeeDialogVisible = !this.isEmployeeDialogVisible;
        } else {
          this.isEmployeeVisible = !this.isEmployeeVisible;
        }
        break;
      case 'job_number':
        this.isJobNumberDialogVisible = !this.isJobNumberDialogVisible;
        break;
      case 'close':
        this.isConfirmDialogVisible = !this.isConfirmDialogVisible;
        break;
      case 'confirm':
        this.isConfirmDialogVisible = !this.isConfirmDialogVisible;
        this.onReportSubmit();
        break;
      default:
        break;
    }
  }

  onReportSubmit() {
    this.httpClient
      .post(
        `${environment.apiUrl}TimeTracking/ExportToExcel`,
        {
          ...this.timeTrackingForm.value,
          job: this.timeTrackingForm.value?.job?.jobName || '',
          employee: this.timeTrackingForm.value?.employee?.eeid || '',
        },
        {
          responseType: 'blob',
        }
      )
      .subscribe((result) => {
        let data = new Blob([result], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;',
        });
        fileSaver.saveAs(data, 'Book.xlsx');
      });
  }

  onSelectionChange(type, value) {
    switch (type) {
      case 'employee':
        this.timeTrackingForm.setValue({
          ...this.timeTrackingForm.value,
          employee: value,
        });
        this.isEmployeeVisible = !this.isEmployeeVisible;
        break;
      case 'job_number':
        console.log(value);
        this.timeTrackingForm.setValue({
          ...this.timeTrackingForm.value,
          job: value.name,
        });
        this.isJobNumberVisible = !this.isJobNumberVisible;
        break;
      default:
        break;
    }
  }

  onResizeColumn(event) {}

  onRowSelect(event, type) {
    switch (type) {
      case 'employee':
        this.timeTrackingForm.setValue({
          ...this.timeTrackingForm.value,
          employee: event.selectedRows[0].dataItem,
        });
        this.isEmployeeDialogVisible = false;
        break;
      case 'job_number':
        this.timeTrackingForm.setValue({
          ...this.timeTrackingForm.value,
          job: event.selectedRows[0].dataItem,
        });
        this.isJobNumberDialogVisible = false;
        break;

      default:
        break;
    }
  }

  onSortChange(sort: SortDescriptor[], type) {
    switch (type) {
      case 'employee':
        this.employeeSort = sort;
        this.employeesGrid = orderBy(this.employeesGrid, sort);
        break;
      case 'job_number':
        this.jobNumberSort = sort;
        this.jobNumbersGrid = orderBy(this.jobNumbersGrid, sort);
        break;

      default:
        break;
    }
  }

  onReOrderColumns(event) {}

  onDataStateChange(event) {}

  validateReport() {
    const values = this.timeTrackingForm.value;
    // if(moment)
  }

  generateReport() {
    
    let reportType = this.timeTrackingForm.value.reportType;
    // let FromDate = this.datepipe.transform(this.timeTrackingForm.value.fromDate, 'MM/dd/yyyy');
    // this.timeTrackingForm.controls['fromDate'].setValue(FromDate);
    
    if(reportType == 'Weekly' && !this.isRunWeekly)
    {
        this.isRunWeekly = true;
    }
    else
    {
      this.httpClient
      .post(
        `${environment.apiUrl}TimeTracking/ExportToExcel`,
        {
      
          ...this.timeTrackingForm.value,
          job: this.timeTrackingForm.value?.job?.jobName || (reportType=='Complete'?'%': null),
          employee: this.timeTrackingForm.value?.employee?.eeid || (reportType=='Complete'?'%': null),
          fromDate: this.datepipe.transform(this.timeTrackingForm.value.fromDate, 'MM/dd/yyyy'),
          toDate:this.datepipe.transform(this.timeTrackingForm.value.toDate, 'MM/dd/yyyy'),
          groupBy:this.timeTrackingForm.value.groupBy || null,
          reportType:this.timeTrackingForm.value.reportType,
          type:this.timeTrackingForm.value.type
        },
        {
          responseType: 'blob',
        }
      )
      .subscribe((result) => {
        if(result != null)
        {
          let data = new Blob([result], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;',
          });
          fileSaver.saveAs(data, 'TimeTracking_'+
          new Date().toLocaleDateString('en-US') + '.xlsx');
        }
        else
        {
          this.opened = true;
        }
      });
    }
    
    // const values = this.timeTrackingForm.value;
    // if (moment(values.toDate).isAfter(moment(values.fromDate))) {
    //   this.confirm_title = 'Weekly Report';
    //   this.confirm_message =
    //     'You have selected date range greater than 1 week. Proceed with report?';
    //   this.isConfirmDialogVisible = !this.isConfirmDialogVisible;
    //   this.reportTypes = 'customize';
    // } else {
    //   this.confirm_title = 'Confirm';
    //   this.confirm_message = 'Run weekly Summary report?';
    //   this.isConfirmDialogVisible = !this.isConfirmDialogVisible;
    //   this.reportTypes = 'weekly';
    // }
  }

  getEmployees() {
    this.dropdownService.GetEmployee().subscribe((result) => {
      this.employees = [{ eeid: 'All', name: 'All' }, ...result.result];
      this.employeeDrop = this.employees;
      this.employeesGrid = result?.result || [];
      this.employeesGrid.unshift({ "name": "All", "eeid": 0});
      this.employeesGrid = this.employeesGrid;  
      this.tempEmployee = this.employeesGrid;
      this.gettempEmployee = this.employeesGrid;
    });
  }

  getJobs() {
    this.dataService
      .post('TimeLineApproval/GetTimeApprovalJob', {
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
        sortColumn: 'job',
        sortDesc: true,
        request: {
          branch: 'All',
          searchText: '',
        },
      })
      .subscribe((result: any) => {
        this.jobNumbersGrid = result?.data || [];
        
        this.jobNumbersGrid.unshift({ "jobName": "All", "jobNumber": 0});
        this.jobNumbersGrid = this.jobNumbersGrid;  
        this.tempJob = this.jobNumbersGrid;
        this.gettempJob = this.jobNumbersGrid;
        this.totalJobs = result?.totalRecords;
        this.jobDrop = this.jobNumbersGrid;
      });
  }

  onPageSizechange(pagesize) {
    this.pageSize = pagesize;
    this.getJobs();
  }

  onPageChange(e): void {
    (this.skip = e.skip), (this.pageSize = e.take);
    this.pageNumber = e.skip / 100 + 1;
    this.getJobs();
  }
  public onFilterRequestsEmployee(inputValue: string): void {
    this.employeeData = process(this.tempEmployee, {
      filter: {
        logic: 'or',
        filters: [
          {
            field: 'eeid',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'name',
            operator: 'contains',
            value: inputValue,
          }
          
        ],
      },
    }).data;

    this.employeesGrid = this.employeeData;
  
  }

  public onFilterRequestsJob(inputValue: string): void {
    this.jobData = process(this.tempJob, {
      filter: {
        logic: 'or',
        filters: [
          {
            field: 'jobName',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'jobNumber',
            operator: 'contains',
            value: inputValue,
          }
          
        ],
      },
    }).data;

    this.jobNumbersGrid = this.jobData;
  
  }
  openPopup()
  {
    this.opened = !this.opened;
  }

  employeehandleFilter(value) {
    this.employees = this.employeeDrop.filter(
      (s) => s.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }
  jobhandleFilter(value) {
    this.jobNumbers = this.jobDrop.filter(
      (s) => s.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }
  closechangeWeeklyReport(data)
  {
    if(data == 'yes')
    {
      
      this.generateWeeklyReport();
      this.generateReport();
      this.isRunWeekly = !this.isRunWeekly;
      
    }
    else if(data == 'no')
    {
    
      this.generateWeeklyReport();
      this.isRunWeekly = !this.isRunWeekly;
     
    }
  }
  generateWeeklyReport() {
    this.httpClient
      .post(
        `${environment.apiUrl}TimeTracking/ExportToExcelWeeklyReportSummary`,
        {
          ...this.timeTrackingForm.value,
          job: this.timeTrackingForm.value?.job?.jobName || null,
          employee: this.timeTrackingForm.value?.employee?.eeid || null,
        },
        {
          responseType: 'blob',
        }
      )
      .subscribe((result) => {
        if(result != null)
        {
          let data = new Blob([result], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;',
          });
          fileSaver.saveAs(data, 'TimeTracking_'+
          new Date().toLocaleDateString('en-US') + '.xlsx');
        }
        else
        {
          this.opened = true;
        }
      });
    }
  
  
}
