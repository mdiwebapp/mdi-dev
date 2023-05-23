import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SortDescriptor, process } from '@progress/kendo-data-query';
import { DatePipe } from '@angular/common';
import { event } from 'jquery';
import {
  emoloyeeData,
  jobData,
  labortaskData,
  labortypeData,
  unionclassData,
  unioncodeData,
} from 'src/data/time-tracking-edit';
import { TimeApprovalService } from '../time-approval/timeapproval.service';
import { PaginationWithSortRequest } from 'src/app/core/models/pagination.model';
import { ErrorHandlerService, PagerService } from 'src/app/core/services';
import { UtilityService } from 'src/app/core/services/utility.service';
import { ErrorMessages, ModuleNames } from 'src/app/core/constant';
import { PageChangeEvent } from '@progress/kendo-angular-grid';
import { thumbnailsDownIcon } from '@progress/kendo-svg-icons';
import { MenuService } from 'src/app/core/helper/menu.service';

@Component({
  selector: 'app-time-tracking-edit',
  templateUrl: './time-tracking-edit.component.html',
  styleUrls: ['./time-tracking-edit.component.scss'],
})
export class TimeTrackingEditComponent implements OnInit {
  @Input() timeTrackingClass: string = 'col-md-8';
  @Input() startDate;
  @Input() endDate;
  @Input() flag;
  @Input() isFromTimeApproval;
  timeTrackingDisable: boolean = false;
  timeTrackingEditable: boolean = false;
  timeTrackingdateDisable: boolean = true;
  timeTrackingretroDisable: boolean = true;

  isAdd: boolean = false;
  isEdit: boolean = false;
  isCancel: boolean = false;
  isSave: boolean = false;

  timeTrackingForm: FormGroup;
  timeTrackings: any = [];
  timeTrackingSort: SortDescriptor[] = [];
  timeTrackingSelections: number[] = [];
  timeTrackingColumns: any = [
    {
      Name: 'employeeNumber',
      isCheck: true,
      Text: 'Employee Number',
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
      Name: 'jobNumber',
      isCheck: true,
      Text: 'Job',
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
    {
      Name: 'jobName',
      isCheck: true,
      Text: 'Job Name',
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
    // {
    //   Name: 'laborSubTask',
    //   isCheck: true,
    //   Text: 'Labor Sub Task',
    //   isDisable: false,
    //   index: 0,
    //   width: 100,
    // },
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
      Text: 'Union Type',
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
  ];
  skip: number = 0;
  sort: SortDescriptor[] = [
    {
      field: 'job',
      dir: 'asc',
    },
  ];
  selections: any = [];
  multiple: boolean = false;

  employees: any = [];
  tempEmployees: any = [];
  employeeColumns: any = [
    {
      Name: 'ee',
      isCheck: true,
      Text: 'Employee Name',
      isDisable: false,
      index: 0,
      width: 50,
    },
    {
      Name: 'employeeNumber',
      isCheck: true,
      Text: 'Employee Number',
      isDisable: false,
      index: 0,
      width: 50,
    },
  ];
  employeeSelections: number[] = [];

  jobs: any = [];
  jobsColumns: any = [
    {
      Name: 'jobNumber',
      isCheck: true,
      Text: 'Job Number',
      isDisable: false,
      index: 0,
      width: 50,
    },
    {
      Name: 'jobName',
      isCheck: true,
      Text: 'Name',
      isDisable: false,
      index: 0,
      width: 100,
    },
  ];
  jobSelections: number[] = [];

  laborTypes: any = [];
  laborTypesColumns: any = [
    {
      Name: 'lookupValue',
      isCheck: true,
      Text: 'Labor Type',
      isDisable: false,
      index: 0,
      width: 100,
    },
  ];

  laborTypesSelections: number[] = [];

  laborTasks: any = [];
  laborTasksColumns = [];
  laborTaskSelections: number[] = [];
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
  unionClasses: any = [];
  unionClassesColumns: any = [
    {
      Name: 'type',
      isCheck: true,
      Text: 'Class',
      isDisable: false,
      index: 0,
      width: 50,
    },
    {
      Name: 'rate',
      isCheck: true,
      Text: 'Rate',
      isDisable: false,
      index: 0,
      width: 100,
    },
  ];
  unionClassesSelections: number[] = [];
  select_date_btn: any = [];
  emoloyeeData: any = [];
  isEmployeeVisible: boolean = false;
  dateVisible: boolean = false;
  jobData: any = [];
  isjobVisible: boolean = false;
  labortypeData: any = [];
  isLabortypeVisible: boolean = false;
  labortaskData: any = [];
  islabortaskVisible: boolean = false;
  unioncodeData: any = [];
  isunioncodeVisible: boolean = false;

  isunionclassVisible: boolean = false;
  isHoursVisible: boolean = false;
  totalJob: number = 0;
  @Input() allEmployee: boolean;
  filterCollection: any = {
    branch: 'All',
    searchText: '',
  };
  public pageSize = 15;
  employeeName: string = '';
  unionRate: any;

  retroValue: any = 'NO';
  employeeValue: any = 'Employee';
  dateValue: any = 'Select Date';
  jobValue: any = 'Job';
  hoursValue: any = 'Hours';
  laborTypeValue: any = 'Labor Type';
  laborTaskValue: any = 'Labor Task';
  unionCodeValue: any = '';
  unionClassValue: any = '';
  selectedIndex: any = '';
  visible: boolean = false;
  searchLaborTask: any = '';
  templaborTasks: any = [];
  isdialogUnionVisible: boolean = false;
  isDisableGrid: boolean = false;
  filterEmployee: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private service: TimeApprovalService,
    public datepipe: DatePipe,
    public pagerService: PagerService,
    private utils: UtilityService,
    public errorHandler: ErrorHandlerService,
    public menuService: MenuService,
  ) {
    if (localStorage.getItem('isAdmin') == 'true') {
     
    } else {
      let acc = this.menuService.checkUserViewRights('Time Tracking');
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
      this.menuService.checkUserBySubmoduleRights('Time Tracking'); 

    }
    //this.employees = emoloyeeData;
    //this.jobs = jobData;
    //this.laborTypes = labortypeData;
    this.laborTasks = labortaskData;
    //this.unionCodes = unioncodeData;
    //this.unionClasses = unionclassData;
  }

  ngOnInit(): void {
    if (!this.startDate) {
      this.startDate = new Date();
    }
    if (!this.endDate) {
      this.endDate = new Date();
    }
    this.pagerService.start = 1;
    this.pagerService.pageSize = 10;
    this.onInitTimeTrackingForm();
    this.getJobData();
    this.getLaborTaskData();
    this.LoadEmployeeList();
  }
  getTimeGridData() {
    this.visible = false;
    this.visible = true;
    var searchfilter = {
      // startDate: this.datepipe.transform(
      //   this.timeTrackingForm.value.date,
      //   'MM/dd/yyyy'
      // ),
      // endDate: this.datepipe.transform(
      //   this.timeTrackingForm.value.date,
      //   'MM/dd/yyyy'
      // ),
      // employee: this.timeTrackingForm.value.employee,
      // branch: 'All',

      EEID:this.timeTrackingForm.value.employee,
      workDate: this.datepipe.transform(this.timeTrackingForm.value.date, 'MM/dd/yyyy')
      
    };

    this.service.GetTimeTrackingLists(searchfilter).subscribe(
      (res) => {
        this.timeTrackings = res.map((x) => {
          return {
            objworkDate: this.datepipe.transform(x.workdate, 'MM/dd/yyyy'),
            ...x,
          };
        });
        if (res.length > 0) {
          if (this.selectedIndex > 0) {
            this.timeTrackingSelections = [this.selectedIndex];
            this.SetData();
          } else {
            this.timeTrackingSelections = [0];
            this.SetData();
          }
          this.isEdit = true;
          this.isAdd = true;
          this.isCancel = false;
          this.isSave = false;
        } else {
          this.timeTrackings = [];
          this.selectedIndex = 0;
          this.timeTrackingSelections = [0];
          this.timeTrackingForm.setValue({
            ...this.timeTrackingForm.value,
            id: 0,
            job: '',
            hours: 0,
            laborType: '',
            laborTask: '',
            unionCode: '',
            unionClass: '',
            retro: false,
            unionCodeId: '',
          });
          this.retroValue = 'No';
          this.jobValue = 'Job';
          this.hoursValue = 'Hours';
          this.laborTypeValue = 'Labor Type';
          this.laborTaskValue = 'Labor Task';
          this.unionCodeValue = '';
          this.unionClassValue = '';
        }
        this.visible = true;
        this.visible = false;
      },
      (error) => {
        this.visible = true;
        this.visible = false;
      }
    );
  }
  getJobData() {
    this.visible = false;
    this.visible = true;
    var request = new PaginationWithSortRequest<any>();
    request.pageSize = this.pagerService.pageSize;
    request.sortColumn = this.sort[0].field;
    request.sortDesc = this.sort[0].dir == 'desc' ? true : false;
    request.request = this.filterCollection;
    request.pageNumber = this.pagerService.start;
    this.service.GetTimeApprovalJob(request).subscribe((res) => {
      this.jobs = res.data;
      this.totalJob = res.data[0].totalRecords;
      this.visible = true;
      this.visible = false;
    });
  }
  getLaborTaskData() {
    this.visible = false;
    this.visible = true;
    this.service.GetTimeApprovalLabourTask().subscribe((res) => {
      this.laborTasks = res;
      this.templaborTasks = res;
      this.visible = true;
      this.visible = false;
      //this.totalJob = res.data[0].totalRecords;
    });
  }
  onHandleTimeTrackingOperation(type, event = null) {
    switch (type) {
      case 'new':
        this.timeTrackingDisable = !this.timeTrackingDisable; //this.resetData();
        this.isSave = true;
        this.isCancel = true;
        this.isAdd = false;
        this.isEdit = false;
        this.laborTypes = [];
        this.resettimeTrackingDetails();
        this.timeTrackingdateDisable = true;
        this.timeTrackingretroDisable = true;
        this.isDisableGrid = true;
        break;
      case 'edit':
        this.timeTrackingDisable = !this.timeTrackingDisable;
        this.isSave = true;
        this.isCancel = true;
        this.isAdd = false;
        this.isEdit = false;
        this.SetData();
        this.timeTrackingdateDisable = true;
        this.timeTrackingretroDisable = false;
        this.isDisableGrid = true;
        break;
      case 'cancel':
        this.timeTrackingDisable = !this.timeTrackingDisable;
        this.resetForm();
        this.timeTrackingdateDisable = false;
        this.SetData();
        this.timeTrackingretroDisable = true;
        this.isHoursVisible = false;
        if (this.timeTrackings.length > 0) {
          this.isAdd = true;
          this.isEdit = true;
          this.isCancel = false;
          this.isSave = false;
        }
        this.isDisableGrid = false;
        break;
      case 'save':
        this.addTimeApproval();

        // this.isSave=false;this.isCancel=false;this.isAdd=true;this.isEdit=true;
        break;
      case 'employee':
        break;
      case 'date':
        this.timeTrackingForm.setValue({
          ...this.timeTrackingForm.value,
          date: event,
        });

        this.dateValue = this.datepipe.transform(
          this.timeTrackingForm.value.date,
          'MM/dd/yyyy'
        );
        this.isSave = false;
        this.isCancel = false;
        this.isAdd = true;
        this.isEdit = false;
        this.getTimeGridData();
        break;
      case 'retro':
        var value = this.timeTrackingForm.value.retro;

        if (value == 'YES') {
          this.retroValue = 'NO';
          this.timeTrackingForm.setValue({
            ...this.timeTrackingForm.value,
            retro: 'NO',
          });
        } else {
          this.retroValue = 'YES';
          this.timeTrackingForm.setValue({
            ...this.timeTrackingForm.value,
            retro: 'YES',
          });
        }

        break;
      case 'hours':
        this.timeTrackingForm.setValue({
          ...this.timeTrackingForm.value,
          hours: event,
        });
        this.hoursValue = event + ' Hours';

      default:
        break;
    }
  }

  resettimeTrackingDetails() {
    this.timeTrackingForm.setValue({
      ...this.timeTrackingForm.value,
      id: 0,
      job: '',
      hours: '',
      laborType: '',
      laborTask: '',
      unionCode: '',
      unionClass: '',
      retro: false,
      unionCodeId: '',
      unionRate: '',
    });
    this.retroValue = 'No';
    this.jobValue = 'New Job';
    this.hoursValue = 'New Hours';
    this.laborTypeValue = 'Labor Type';
    this.laborTaskValue = 'Labor Task';
    this.unionCodeValue = '';
    this.unionClassValue = '';
    this.unionRate = '';
  }
  addTimeApproval() {
    console.log(this.isFromTimeApproval);
    if (this.timeTrackingForm.invalid) {
      this.timeTrackingForm.markAllAsTouched();
      return false;
    }
    this.visible = false;
    this.visible = true;
    if (!this.timeTrackingForm.get('unionClass').value && this.timeTrackingForm.get('unionCode').value) {
      this.utils.toast.error('Please select Union Class');      
      return false;
    }
    var obj = {
      id: this.timeTrackingForm.value.id,
      employeeId: this.timeTrackingForm.value.employee,
      workDate: this.datepipe.transform(
        this.timeTrackingForm.value.date,
        'MM/dd/yyyy'
      ),
      job: this.timeTrackingForm.value.job,
      hours: this.timeTrackingForm.value.hours,
      laborType: this.timeTrackingForm.value.laborType,
      laborSubtask: this.timeTrackingForm.value.laborTask,
      unionCode: this.timeTrackingForm.value.unionCode,
      unionType: this.timeTrackingForm.value.unionClass,
      unionRate: this.timeTrackingForm.value.unionRate,
      unionReport: true,
      enteredBy: '',
      entryTime: new Date(),
      retro: this.timeTrackingForm.value.retro == 'YES' ? true : false,
    };
    if(this.isFromTimeApproval)
    {
      if (this.timeTrackingForm.value.id == 0) {
        this.service.AddTimeTrackWithoutTimeClock(obj).subscribe(
          (res) => {
            //this.timeTrackingEditable = true;
            if (res['status'] == 200) {
              this.utils.toast.success(res['message']);
              this.getTimeGridData();
              this.timeTrackingForm.reset();
              this.timeTrackingDisable = !this.timeTrackingDisable;
              this.timeTrackingdateDisable = false;
              this.selectedIndex = 0;
              this.timeTrackingretroDisable = true;
              this.isDisableGrid = false;
              this.visible = true;
              this.visible = false;
            }
          },
          (error) => {
            this.onError(error, ErrorMessages.timeapproval.save_addpunch);
          }
        );
      }
    }
    else
    {
      if (this.timeTrackingForm.value.id == 0) {
        this.service.AddTimeTrack(obj).subscribe(
          (res) => {
            //this.timeTrackingEditable = true;
            if (res['status'] == 200) {
              this.utils.toast.success(res['message']);
              this.getTimeGridData();
              this.timeTrackingForm.reset();
              this.timeTrackingDisable = !this.timeTrackingDisable;
              this.timeTrackingdateDisable = false;
              this.selectedIndex = 0;
              this.timeTrackingretroDisable = true;
              this.isDisableGrid = false;
              this.visible = true;
              this.visible = false;
            }
          },
          (error) => {
            this.onError(error, ErrorMessages.timeapproval.save_addpunch);
          }
        );
      } else {
        this.service.UpdateTimeTrack(obj).subscribe(
          (res) => {
            //this.timeTrackingEditable = true;
            if (res['status'] == 200) {
              this.utils.toast.success(res['message']);
              this.getTimeGridData();
              this.timeTrackingForm.reset();
              this.timeTrackingDisable = !this.timeTrackingDisable;
              this.timeTrackingdateDisable = false;
              this.isAdd = true;
              this.isEdit = true;
              this.isCancel = false;
              this.isSave = false;
              this.timeTrackingretroDisable = true;
              this.isDisableGrid = false;
              this.visible = true;
              this.visible = false;
            }
          },
          (error) => {
            this.onError(error, ErrorMessages.timeapproval.save_addpunch);
          }
        );
      }
    }
 
  }

  SetData() {
    var data = this.timeTrackings[this.timeTrackingSelections[0]] == undefined ? null : this.timeTrackings[this.timeTrackingSelections[0]];
    if(data != null) {
    this.timeTrackingForm.setValue({
      id: data?.timeCLockFK,
      employee: data?.eeid,
      date: new Date(data?.workdate),
      job: data?.job,
      hours: data?.hours,
      laborType: data?.laborType,
      laborTask: data?.laborSubTask,
      unionCode: data?.unionCode,
      unionClass: data?.unionType,
      retro: data?.retro,
      unionCodeId: data?.unionCode,
      unionRate: data?.unionRate,
    });
  }
        if(data?.job.charAt(0).toUpperCase() == 'P') {
          this.visible = false;
          this.visible = true;
          this.service.GetTimeApprovalGpcLabourType().subscribe((res) => {
            this.laborTypes = res;
            this.visible = true;
            this.visible = false;
          });
        }
        else {
        this.visible = false;
        this.visible = true;
        this.service.GetTimeApprovalLabourType().subscribe((res) => {
          this.laborTypes = res;
          this.visible = true;
          this.visible = false;
        });
      }
    this.retroValue = data?.retro;
    this.jobValue = data?.jobName == null ? 'Job' : data?.jobName;
    this.hoursValue = data?.hours == null ? 'Hours' : data?.hours + ' Hours';
    this.laborTypeValue =
      data?.laborType == null ? 'Labor Type' : data?.laborType;
    this.laborTaskValue =
      data?.laborSubTask == null ? 'Labor Task' : data?.laborSubTask;
    this.unionCodeValue =
      data?.unionCode == null ? '' : data?.unionCode;
    this.unionClassValue =
      data?.unionType == null ? '' : data?.unionType;
    this.unionRate = data?.unionRate;
  }
  resetForm() {
    this.isSave = false;
    this.isCancel = false;
    this.isAdd = true;
    this.isEdit = false;
    this.timeTrackingForm.setValue({
      ...this.timeTrackingForm.value,
      id: 0,
      //employee: '',
      //date: '',
      job: '',
      hours: 0,
      laborType: '',
      laborTask: '',
      unionCode: '',
      unionClass: '',
      retro: false,
      unionCodeId: '',
    });
    this.employeeName = '';
  }
  resetData() {
    this.timeTrackingForm.setValue({
      id: 0,
      //employee: '',
      //date: '',
      job: '',
      hours: 0,
      laborType: '',
      laborTask: '',
      unionCode: '',
      unionClass: '',
      retro: false,
      unionCodeId: '',
    });
    this.employeeName = '';
  }

  onInitTimeTrackingForm() {
    this.timeTrackingForm = this.formBuilder.group({
      id: 0,
      employee: ['', Validators.required],
      date: ['', Validators.required],
      job: ['', Validators.required],
      hours: ['', Validators.required],
      laborType: ['', Validators.required],
      laborTask: '',
      unionCode: [''],
      unionClass: [''],
      retro: false,
      unionCodeId: '',
      unionRate: '',
    });
  }

  onResizeColumn(event) {}

  onRowSelect(event, type) {
    switch (type) {
      case 'employee':
        this.timeTrackingForm.setValue({
          ...this.timeTrackingForm.value,
          employee: event.selectedRows[0].dataItem.employeeNumber,
        });
        this.employeeValue = event.selectedRows[0].dataItem.ee;
        this.employeeName = event.selectedRows[0].dataItem.ee;
        this.isEmployeeVisible = !this.isEmployeeVisible;
        this.timeTrackingdateDisable = false;

        if (this.timeTrackingForm.value.date != '') {
          this.getTimeGridData();
        }
        break;
      case 'job':
        this.timeTrackingForm.setValue({
          ...this.timeTrackingForm.value,
          job: `${event.selectedRows[0].dataItem.jobNumber}`,
        });
        this.jobValue = event.selectedRows[0].dataItem.jobName;
        if(event.selectedRows[0].dataItem.jobNumber.charAt(0).toUpperCase() == 'P') {
          this.visible = false;
          this.visible = true;
          this.service.GetTimeApprovalGpcLabourType().subscribe((res) => {
            this.laborTypes = res;
            this.visible = true;
            this.visible = false;
          });
        }
        else {
        this.visible = false;
        this.visible = true;
        this.service.GetTimeApprovalLabourType().subscribe((res) => {
          this.laborTypes = res;
          this.visible = true;
          this.visible = false;
        });
      }
        this.isjobVisible = !this.isjobVisible;
        break;
      case 'laborType':
        this.timeTrackingForm.setValue({
          ...this.timeTrackingForm.value,
          laborType: event.selectedRows[0].dataItem.lookupValue,
        });
        this.laborTypeValue = event.selectedRows[0].dataItem.lookupValue;
        this.isLabortypeVisible = !this.isLabortypeVisible;
        break;
      case 'laborTask':
        this.timeTrackingForm.setValue({
          ...this.timeTrackingForm.value,
          laborTask: event.selectedRows[0].dataItem.lookupValue,
        });
        this.laborTaskValue = event.selectedRows[0].dataItem.lookupValue;
        this.islabortaskVisible = false;
        break;
      case 'unionCode':
        this.timeTrackingForm.setValue({
          ...this.timeTrackingForm.value,
          unionCode: event.selectedRows[0].dataItem.unionCode,
          unionCodeId: event.selectedRows[0].dataItem.unionCode,
        });
        this.unionCodeValue = event.selectedRows[0].dataItem.unionCode;
        this.isunioncodeVisible = !this.isunioncodeVisible;
        break;
      case 'unionClass':
        this.timeTrackingForm.setValue({
          ...this.timeTrackingForm.value,
          unionClass: event.selectedRows[0].dataItem.type,
          unionRate: event.selectedRows[0].dataItem.rate,
        });
        this.unionClassValue = event.selectedRows[0].dataItem.type;
        this.unionRate = event.selectedRows[0].dataItem.rate;
        this.isunionclassVisible = !this.isunionclassVisible;
        break;
      default:
        break;
    }
  }

  onSelectionChange(event) {
    this.isEdit = true;
    this.selectedIndex = this.timeTrackings.findIndex(
      (x) => x.timeCLockFK == event.selectedRows[0].dataItem.timeCLockFK
    );
    this.SetData();
  }

  onSortChange(sort: SortDescriptor[]) {
    // this.employeeSort = sort;
    // this.employees = orderBy(this.employees, sort);
  }

  onReOrderColumns(event) {}

  onDataStateChange(event) {}

  onHandleFilters(value) {
    switch (value) {
      case 'employee':
        this.isEmployeeVisible = !this.isEmployeeVisible;
        this.employeeSelections = [];
        break;
      case 'job':
        this.isjobVisible = !this.isjobVisible;
        this.jobSelections = [];
        // this.service.GetTimeApprovalJob(null).subscribe((res) => {
        //   this.jobs = res;
        // })
        break;
      case 'laborType':
        this.isLabortypeVisible = !this.isLabortypeVisible;
        this.laborTypesSelections = [];
        // this.visible = false;
        // this.visible = true;
        // this.service.GetTimeApprovalLabourType().subscribe((res) => {
        //   this.laborTypes = res;
        //   this.visible = true;
        //   this.visible = false;
        // });
        break;
      case 'laborTask':
        this.islabortaskVisible = !this.islabortaskVisible;
        this.laborTaskSelections = [];
        this.searchLaborTask = '';
        this.filterLaborTask(this.searchLaborTask);
        break;
      case 'unionCode':
        this.visible = false;
        this.visible = true;
        this.unionCodesSelections = [];
        this.service.GetTimeApprovalUnionCodes().subscribe((res) => {
          this.unionCodes = res;
          this.tempUnionCodes = res;
          this.visible = true;
          this.visible = false;
        });

        if (
          this.timeTrackingForm.value.unionClass != '' &&
          this.timeTrackingForm.value.unionClass != null
        ) {
          this.isdialogUnionVisible = true;
        } else {
          this.isunioncodeVisible = !this.isunioncodeVisible;
        }
        break;
      case 'unionClass':
        this.isunionclassVisible = !this.isunionclassVisible;
        this.unionClassesSelections = [];
        if (
          this.timeTrackingForm.value.unionCodeId != '' &&
          this.timeTrackingForm.value.unionCodeId != null
        ) {
          this.visible = false;
          this.visible = true;
          this.service
            .GetTimeApprovalUnionClasses(
              this.timeTrackingForm.value.unionCodeId
            )
            .subscribe((res) => {
              this.unionClasses = res;
              this.visible = true;
              this.visible = false;
            });
        }
        break;
      case 'hours':
        this.isHoursVisible = !this.isHoursVisible;
      default:
        break;
    }
  }
  public onPageChange(e: PageChangeEvent): void {
    this.skip = e.skip;
    this.pageSize = e.take;
    this.pagerService.start =
      this.skip == 0 ? 1 : this.skip / this.pageSize + 1;
    this.getJobData();
  }
  data: any;
  public onFilter(inputValue: string): void {
    this.unionCodes = process(this.tempUnionCodes, {
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
          },
        ],
      },
    }).data;
  }
  public onEmployeeFilter(inputValue: string): void {
    this.filterEmployee = inputValue;
    this.data = process(this.tempEmployees, {
      filter: {
        logic: 'or',
        filters: [
          {
            field: 'ee',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'employeeNumber',
            operator: 'contains',
            value: inputValue,
          },
        ],
      },
    }).data;
    this.employees = this.data;
  }
  private onError(error: any, customMessage?: string) {
    this.errorHandler.handleError(error, 'Time Tracking', customMessage);
  }

  filterLaborTask(data: any) {
    this.searchLaborTask = data;
    this.laborTasks = process(this.templaborTasks, {
      filter: {
        logic: 'or',
        filters: [
          {
            field: 'lookupValue',
            operator: 'contains',
            value: data,
          },
        ],
      },
    }).data;
  }

  closeUniondialog(data: any) {
    if (data == 'no') {
      this.isdialogUnionVisible = false;
      this.isunioncodeVisible = false;
    } else {
      this.timeTrackingForm.setValue({
        ...this.timeTrackingForm.value,
        unionClass: '',
        unionRate: '',
      });
      this.unionRate = '';
      this.unionClassValue = 'Union Class';
      this.isdialogUnionVisible = false;
      this.isunioncodeVisible = true;
    }
  }

  LoadEmployeeList() {
    var data1 = {
      // startDate: this.startDate,
      // endDate: this.endDate,
      startDate: this.datepipe.transform(this.startDate, 'MM-dd-yyyy'),
      endDate: this.datepipe.transform(this.endDate, 'MM-dd-yyyy'),
      timeOverwrite: this.flag,
    };
    this.visible = false;
    this.visible = true;
    this.service.GetTimeApprovalAllEmployee(data1).subscribe((res) => {
      this.employees = res;
      this.tempEmployees = res;
      this.visible = true;
      this.visible = false;
    });
  }

  filterJobData() {
    this.skip = 0;
    this.pagerService.start = 1;
    this.jobSelections = []
    this.getJobData();
  }
}
