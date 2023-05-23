import {
  Component,
  Input,
  OnInit,
  ViewChild,
  Output,
  OnChanges,
} from '@angular/core';
import { SchedulerEvent } from '@progress/kendo-angular-scheduler';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  EmployeeMoreInfoModel,
  EmployeeWorkInfoViewModel,
} from '../employee-moreinfo/employee-moreinfo.model';
import { UtilityService } from 'src/app/core/services/utility.service';
import { EmployeeWorkService } from './employee-work.service';
import { BranchModel } from '../../../admin/branch/branch.model';
import { DropdownService } from '../../../../core/services/dropdown.service';
import {
  DropDownModel,
  EmployeeType,
} from '../../../../core/models/drop-down.model';
import { EmployeeTitle } from '../../employee/employee.model';
import { TitlesService } from 'src/app/layout/masters/Titles/titles.service';
import { EmployeeService } from '../employee/employee.service';
import { MultiSelectComponent } from '@progress/kendo-angular-dropdowns';
import { delay, switchMap, map, tap } from 'rxjs/operators';
import { from } from 'rxjs';
import { ModuleNames, ErrorMessages } from 'src/app/core/constant';
import { ErrorHandlerService } from 'src/app/core/services';
import {
  accountData,
  addTitleTypeData,
  departmentData,
  employerData,
  titlecolumns,
  titleData,
} from 'src/data/employee-data';
import { DatePipe } from '@angular/common';
import { NullTemplateVisitor } from '@angular/compiler/public_api';
import { process } from '@progress/kendo-data-query';
import { EmployeeMoreinfoComponent } from '../employee-moreinfo/employee-moreinfo.component';
import moment from 'moment';
@Component({
  selector: 'app-employee-work',
  templateUrl: './employee-work.component.html',
  styleUrls: ['./employee-work.component.scss'],
})
export class EmployeeWorkComponent implements OnInit, OnChanges {
  @Input() onChange;
  @Input() employeeForm: FormGroup;
  @Input() action: string = '';
  form: FormGroup;
  Hourly: boolean;
  status: boolean = true;
  employeeId: any;
  titleList: any;
  accountList: any[];
  accountFilter: DropDownModel[];
  employerListFilter: DropDownModel[];
  isVerifyContentVisible: boolean = false;
  eVerify_btn: string;
  isQBRepVisible: boolean = false;
  isNewVisibleForHourlyBtn: boolean = true;
  isNewVisibleForHourlyRateLbl: boolean = false;
  isHourlyVisible: boolean = false;
  unionLaborVisible: boolean = true;
  isADPVisible: boolean = false;
  @Output() dialogOpened: boolean = false;
  @Output() errorMsg: any;
  @ViewChild('multiselect') public multiselect: MultiSelectComponent;
  @ViewChild(EmployeeMoreinfoComponent)
  employeeMoreinfo: EmployeeMoreinfoComponent;
  source: any;
  account: any = [];
  employer: any = [];
  disableHourlyButton: boolean = true;
  disableUnionLabor: boolean = true;
  isDisableUnionLabor: boolean = true;
  disableSubUnionLabor: boolean = true;
  disableYardBtn: boolean = true;
  isDisableSubUnionLabor: boolean = true;
  disableYardEEtext: boolean = false;
  // department: any = [];

  titles = [];
  titletypecolumns: any = [];
  addTitle: any = [];
  selections: any = [];
  employeerEelections: any = [];
  departmentSelections: any = [];
  employeeTitlesSelections: any = [];
  titleSelections: any = [0];

  subVerifyDate: any;
  constructor(
    private formBuilder: FormBuilder,
    public service: EmployeeWorkService,
    public dropdownservice: DropdownService,
    public titleservice: TitlesService,
    public employeeService: EmployeeService,
    private utils: UtilityService,
    public errorHandler: ErrorHandlerService,
    private datePipe: DatePipe
  ) {
    const newDate = new Date();
    this.subVerifyDate = this.datePipe.transform(newDate, 'MM/dd/yyyy');
    this.titletypecolumns = titlecolumns;
  }
  employee: EmployeeMoreInfoModel;
  isAdd: boolean = true;
  isSave: boolean = true;
  isCancel: boolean = true;
  isEdit: boolean = true;
  empldata: any;
  employerList: DropDownModel[];
  employeeTitle: any;
  isDisabled: boolean = true;
  isDisabledHourlyEE: boolean = true;
  isDisabledEVerify: boolean = true;
  isDisabledI9Comment: boolean = true;
  isAccountVisible: boolean = false;
  isEmployerVisible: boolean = false;
  isDepartmentVisible: boolean = false;
  isTitleVisible: boolean = false;
  isAddTitleVisible: boolean = false;
  iseVerifyCompletedVisible: boolean = false;
  isSubVerifyVisible: boolean = false;
  isEverifyCalendar: boolean = false;
  isEverifyConfirmVisible: boolean = false;
  iseVerifyCloseVisible: boolean = false;
  isUnionLaborVisible: boolean = false;
  isI9DateAlert: boolean = false;
  isTitlesAlert: boolean = false;
  isYardVisible: boolean = false;
  isActiveConfirmation: boolean = false;
  isActiveConfirmed: boolean = false;
  adpText: string = '';
  QBRep: string = '';
  unionLabor: string = '';
  i9Notes: any = '';
  yard: string = '';
  MarriedType: Array<{ text: string; value: string }> = [
    { text: 'Married', value: 'M' },
    { text: 'Single', value: 'S' },
    { text: 'Widowed', value: 'W' },
    { text: 'Divorced', value: 'D' },
  ];
  RaceType: Array<{ text: string; value: string }> = [
    { text: 'American Indian/Alaskan Native', value: '1' },
    { text: 'Asian/Pacific Islander', value: '2' },
    { text: 'Black', value: '3' },
    { text: 'Hispanic', value: '4' },
    { text: 'White', value: '5' },
  ];
  MarriedTypeFilter: Array<{ text: string; value: string }>;
  RaceTypeFilter: Array<{ text: string; value: string }>;
  selectedAccount: string = '';
  selectedEmployer: number;
  selectedDepartment: string = '';
  selectedTitle: string = '';
  public events: SchedulerEvent[] = [];
  public selectedDate: Date = new Date();
  titlesListSelection : any;
  public department = [
    {
      full_name: 'None',
    },
    {
      full_name: 'Bypass',
    },
    {
      full_name: 'Dewatering',
    },
  ];
  allDepartments = this.department;
  selectedTitles: any;
  ngOnInit(): void {
    this.MarriedTypeFilter = this.MarriedType;
    this.RaceTypeFilter = this.RaceType;

    this.initForm({});
    this.GetEmployerAccount();
    this.GetTitle();
    this.GetEmployer();
    // this.onChange.subscribe(res => {
    //   this.employee = res;
    //   if (res)
    //     this.editClick(res.workInfo);
    // });

    this.form.disable();
    // this.onChange;
  }

  ngOnChanges() {}

  initForm(value): void {
    this.form = this.formBuilder.group({
      employeeId: [null],
      employeeAccount: [null],
      employer: [null],
      adpNumber: [null],
      qbRep: [null],
      unionLabor: [null],
      contractLabor: [null],
      hourly: value.hourly || [null],
      hourlyRate: [null],
      mdi: [null],
      accountManager: [null],
      emergencyContact: [null],
      emergencyPhone: [null],
      emergencyRelationship: [null],
      maritalStatus: [null],
      email: [null],
      veteranStatus: [null],
      race: [null],
      gender: [null],
      rehireDate: [new Date()],
      title: [null],
      department: [null],
      i9Completed: value.i9Completed || [null],
      i9Comment: [null],
      i9Date: [null],
      yardEmployee: [null],
      i9by: [null],
    });
  }
  editClick(data: any) {
    this.employee = data;
    if (data) {
      this.isEdit = false;
      this.isSave = true;
      this.isCancel = true;
      this.titles = [];
      this.setValue(data);
    }
    if (this.form.value.i9Completed === true) {
      this.isDisabledEVerify = false;
      // this.isVerifyContentVisible = true
    } else {
      this.isDisabledEVerify = true;
    }
    if (this.form.value.hourly === true) {
      this.isDisabledHourlyEE = false;
    } else {
      this.isDisabledHourlyEE = true;
    }
    this.isHourlyVisible = false;
    this.disableHourlyButton = true;
    if (this.form.value.unionLabor == true) {
      this.disableUnionLabor = false;
      this.disableSubUnionLabor = true;
      this.unionLaborVisible = true;
    } else {
      this.disableUnionLabor = true;
      this.disableSubUnionLabor = false;
      this.unionLaborVisible = false;
    }
  }
  onChangeHourlyButtonEvent(event) {
    if (this.action == 'edit') {
      if (this.form.value.hourly == true) {
        this.form.setValue({
          ...this.form.value,
          hourly: !this.form.value.hourly,
        });
      } else {
        this.form.setValue({
          ...this.form.value,
          hourly: !this.form.value.hourly,
        });
        this.disableHourlyButton = false;
        this.isHourlyVisible = true;
      }
    } else if (this.action == 'new' && this.form.value.hourly == null) {
      this.disableHourlyButton = false;
      this.isHourlyVisible = true;
    } else if (this.action == 'new' && this.form.value.hourly == true) {
      this.form.setValue({
        ...this.form.value,
        hourly: !this.form.value.hourly,
      });
    } else {
      this.disableHourlyButton = false;
      this.isHourlyVisible = true;
      this.isDisabledHourlyEE = false;
    }
  }
  onButton(event) {
    if (this.action == 'new') {
      if ((this.isHourlyVisible = true && this.action == 'new')) {
        this.isHourlyVisible = false;
        this.disableHourlyButton = true;
        this.form.setValue({
          ...this.form.value,
          hourly: !this.form.value.hourly,
        });
      } else {
        this.disableHourlyButton = false;
        this.isHourlyVisible = false;
        this.disableHourlyButton = true;
        this.form.setValue({
          ...this.form.value,
          hourly: !this.form.value.hourly,
        });
      }
    } else {
      this.isHourlyVisible = false;
      this.disableHourlyButton = true;
      this.isDisabledHourlyEE = false;
    }
    // this.form.setValue({});
  }
  
  GetEmployerAccount() {
    this.dropdownservice.GetLookupList('LaborAccounts').subscribe(
      (res) => {
        if (res) {
          this.accountList = res;
          this.accountFilter = res;
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.drop_down.labor_accounts);
      }
    );
  }
  getCalendarDate(date) {
    if (moment(this.selectedDate).isSame(date, 'month')) {
      return moment(date).format('DD');
    } else {
      ('');
    }
  }
  GetEmployer() {
    this.dropdownservice.GetLookupList('Company').subscribe(
      (res) => {
        if (res) {
          this.employerList = res.sort((a, b) =>
            a.value.localeCompare(b.value)
          );
          this.employerListFilter = res;
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.drop_down.company);
      }
    );
  }
  setPrevMonth() {
    this.selectedDate = new Date(
      this.selectedDate.setMonth(this.selectedDate.getMonth() - 1)
    );
  }
  setNextMonth() {
    this.selectedDate = new Date(
      this.selectedDate.setMonth(this.selectedDate.getMonth() + 1)
    );
  }
  datechange(event) {
    this.selectedDate = event;
  }
  slotClickHandler(event) {
    this.subVerifyDate = moment(event.start).format('MM-DD-YYYY');
  }
  slotDblClickHandler(event) {
    this.isEverifyCalendar = false;
    this.isEverifyConfirmVisible = true;
  }
  GetTitle() {
    this.titleservice.GetList(false).subscribe(
      (res) => {
        if (res) {
          this.titleList = res;
          this.source = res;
          if (
            res != null &&
            this.employee != null &&
            (this.employee.employeeTitles != null ||
              this.employee.employeeTitles != undefined)
          ) {
            this.employeeTitle = [];
            this.employee.employeeTitles.map((d) => {
              let obj = new EmployeeType();
              obj.id = d.title;
              obj.name = this.titleList.find((x) => x.name == d.title)?.name;
              this.employeeTitle.push(obj);
            });
          }
          this.empldata = res;
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.titles.get_list);
      }
    );
  }

  setValue(data: EmployeeWorkInfoViewModel) {
    // this.GetEmployerAccount();
    // this.GetEmployer();
    // this.GetTitle();
    this.employeeId = data.employeeId;
    this.selectedAccount = data.employeeAccount;
    this.selectedEmployer = data.employer;
    // this.subVerifyDate = data.i9Date
    this.form.setValue({
      employeeId: data.employeeId,
      employeeAccount: data.employeeAccount,
      employer: data.employer,
      adpNumber: data.adpNumber,
      qbRep: data.qbRep,
      unionLabor: data.unionLabor,
      contractLabor: data.contractLabor,
      hourly: data.hourly,
      hourlyRate: data.hourlyRate,
      mdi: 0,
      accountManager: data.salesMan,
      emergencyContact: data.emergencyContact,
      emergencyPhone: data.emergencyPhone,
      emergencyRelationship: data.emergencyRelationship,
      maritalStatus: data.maritalStatus,
      email: data.email,
      veteranStatus: data.veteranStatus,
      race: data.race,
      gender: data.gender,
      rehireDate: data.rehireDate != null ? new Date(data.rehireDate) : null,
      title: null,
      department: data.department,
      i9Completed: data.i9Completed,
      i9Comment: data.i9Comment,
      i9Date: data.i9Date,
      yardEmployee: data.yardEmployee,
      i9by: data.i9By,
    });
    if (data.employeeTitles == null) {
    } else if (data.employeeTitles.length > 0) {
      this.selectedTitle = data.employeeTitles[0].title;
      this.form.setValue({
        ...this.form.value,
        title: data.employeeTitles[0].title,
      });
    }
    if (data.employeeTitles == null) {
    } else {
      for (let i = 0; i < data.employeeTitles.length; i++) {
        const newformated = data.employeeTitles[i].title;
        this.titles.push({ name: newformated });
      }
    }
  }

  onSave() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return true;
    }
    this.action = 'save';
    const data = this.form.value;
    data.unionLabor = data.unionLabor == null ? false : data.unionLabor;
    data.contractLabor =
      data.contractLabor == null ? false : data.contractLabor;
    data.hourly = data.hourly == null ? false : data.hourly;
    data.i9Completed = data.i9Completed == null ? false : data.i9Completed;
    data.employeeId = this.employeeId;
    data.department = data.department;
    data.yardEmployee = data.yardEmployee;
    data.accountManager =
      data.accountManager == null ? false : data.accountManager;
    data.startDate = this.employeeForm.value.startDate;
    data.i9Comment = data.i9Comment;
    data.yardEmployee = data.yardEmployee ? data.yardEmployee : 0;
    let title: EmployeeTitle[] = [];
    this.titles?.forEach((element) => {
      let obj = new EmployeeTitle();
      obj.employeeId = this.employeeId;
      obj.title = element.name;
      title.push(obj);
    });
    data.title = title;
    this.service.SaveWorkInfo(data).subscribe(
      (res) => {
        if (res['status'] == 200) {
          this.utils.toast.success(res['message']);
          //this.SaveEditClick.emit(res);
        } else this.utils.toast.error(res['message']);
        this.disbaleBtn();
        this.form.disable();
        this.isDisabled = true;
        this.isEdit = false;
        this.isDisableSubUnionLabor = true;
      },
      (error) => {
        this.onError(error, ErrorMessages.employee.save_work_info);
      }
    );
    if (this.form.value.hourly == false) {
      this.isDisabledHourlyEE = true;
    }
    if (this.form.value.i9Completed == false) {
      this.isDisabledEVerify = true;
    }
  }
  btnCancel() {
    this.action = 'cancle';
    this.isDisabled = true;
    this.isDisabledEVerify = true;
    this.isDisableSubUnionLabor = true;
    this.form.reset();
    this.form.disable();
    this.form.setValue({ ...this.form.value });
    // this.form.value.i9Comment.disable();
    this.isDisabledI9Comment = true;
  }

  btnEdit() {
    this.action = 'edit';
    this.form.enable();
    this.isDisabled = false;
    this.isDisabledEVerify = false;
    this.isDisabledI9Comment = true;
    this.enableBtn();
    this.isEdit = true;
    this.isDisabledHourlyEE = false;
    this.isDisableSubUnionLabor = false;
  }
  btnAdd() {
    this.action = 'new';
    this.form.enable();
    this.isDisabled = false;
    this.isDisabledEVerify = false;
    this.isDisabledHourlyEE = false;
    this.disableSubUnionLabor = false;
    this.isDisableSubUnionLabor = false;
    this.disableUnionLabor = true;
    this.enableBtn();
    this.isEdit = true;
    this.form.reset();
    // this.form.value.i9Comment.disable();
    this.isDisabledI9Comment = true;
  }
  enableBtn() {
    this.isSave = false;
    this.isCancel = false;
  }
  disbaleBtn() {
    this.isSave = true;
    this.isCancel = true;
  }

  handleFilter(value) {
    this.employerList = this.employerListFilter.filter(
      (s) => s.value.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  accounthandleFilter(value) {
    this.accountList = this.accountFilter.filter(
      (s) => s.value.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  handleMetrialFilter(value) {
    this.MarriedType = this.MarriedTypeFilter.filter(
      (s) => s.text.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  RaceFilter(value) {
    this.RaceType = this.RaceTypeFilter.filter(
      (s) => s.text.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  ngAfterViewInit() {
    const contains = (value) => (s) =>
      s.name.toLowerCase().indexOf(value.toLowerCase()) !== -1;
    if (this.multiselect) {
      this.multiselect.filterChange
        .asObservable()
        .pipe(
          switchMap((value) =>
            from([this.source]).pipe(
              tap(() => (this.multiselect.loading = true)),
              delay(1000),
              map((data) => data.filter(contains(value)))
            )
          )
        )
        .subscribe((x) => {
          this.titleList = x;
          this.multiselect.loading = false;
        });
    }
  }

  private onError(error: any, customMessage?: string) {
    this.errorHandler.handleError(
      error,
      ModuleNames.employee_work,
      customMessage
    );
  }
  onHandleOperations(type) {
    switch (type) {
      case 'account':
        this.isAccountVisible = !this.isAccountVisible;
        this.accountList = this.accountFilter;
        break;
      case 'employer':
        this.isEmployerVisible = !this.isEmployerVisible;
        this.employerList = this.employerListFilter;
        break;
      case 'department':
        this.isDepartmentVisible = !this.isDepartmentVisible;
        break;
      case 'title':
        if (this.form.value.title == null) this.titles = [];
        this.isTitleVisible = !this.isTitleVisible;
        break;
      case 'titleClose':
         if(this.titles.length == 0){
          this.isTitlesAlert = true
          }
          else{
          this.isTitlesAlert = false
          this.isTitleVisible = !this.isTitleVisible
          }
        break;
      case 'addTitle':
        this.titleSelections = [0]
        this.titlesListSelection = this.titleList[0]
        this.isAddTitleVisible = !this.isAddTitleVisible;
        break;
      case 'e-verify':
        if (this.action == 'edit') {
          if (this.form.value.i9Completed == true) {
            this.form.setValue({
              ...this.form.value,
              i9Completed: !this.form.value.i9Completed,
            });
          } else {
            this.iseVerifyCompletedVisible = !this.iseVerifyCompletedVisible;
          }
        } else if (this.action == 'new') {
          this.form.setValue({
            ...this.form.value,
            i9Completed: false,
          });
          this.iseVerifyCompletedVisible = true;
        } else {
          this.isVerifyContentVisible = true;
        }
        break;
      case 'sub-verify':
        this.isSubVerifyVisible = !this.isSubVerifyVisible;
        this.iseVerifyCompletedVisible = false;
        break;
      case 'e-verify-confirm':
        this.subVerifyDate = moment().format('MM-DD-YYYY');
        this.form.setValue({
          ...this.form.value,
          i9Date: this.subVerifyDate,
        });
        this.i9Notes = ' ';
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
        this.form.controls['adpNumber'].setValue(this.adpText);
        this.isADPVisible = !this.isADPVisible;
        break;
      case 'QBRep':
        this.isQBRepVisible = !this.isQBRepVisible;
        break;
      case 'qbrep_submit':
        this.form.controls['qbRep'].setValue(this.QBRep);
        this.isQBRepVisible = !this.isQBRepVisible;
        break;
      case 'unionLabor':
        if (this.isUnionLaborVisible) {
          this.isYardVisible = false;
        }
        this.isUnionLaborVisible = !this.isUnionLaborVisible;
        break;
      case 'unionLabor_submit':
        this.form.controls['unionLabor'].setValue(this.unionLabor);
      case 'yard':
        this.isYardVisible = !this.isYardVisible;
        break;
      case 'yard_submit':
        this.form.setValue({
          ...this.form.value,
          yard: this.yard,
        });
        this.isYardVisible = !this.isYardVisible;
        break;
      case 'e-verify-confirm-close':
        if (this.subVerifyDate == this.subVerifyDate) {
          if (this.form.value.i9by == null) {
            this.form.value.i9by = '';
          }
          this.form.setValue({
            ...this.form.value,
            i9Comment:
              'Completed by ' +
              this.form.value.i9by +
              'on ' +
              moment(this.subVerifyDate).format('MM-DD-YYYY') +
              ' Notes :' +
              this.i9Notes,
          });
        } else {
          this.form.setValue({
            ...this.form.value,
            i9Comment:
              'Completed by ' +
              this.form.value.i9by +
              'on ' +
              moment(this.subVerifyDate).format('MM-DD-YYYY') +
              ' Notes :' +
              this.i9Notes,
          });
        }
        this.isEverifyConfirmVisible = !this.isEverifyConfirmVisible;
        this.isVerifyContentVisible = true;

        break;
      case 'e-verify-confirm-i9Comment-close':
        this.isVerifyContentVisible = false;
        this.isDisabledEVerify = false;
        // this.subVerifyDate = this.form.value.i9Date
        if (this.action == 'edit' || this.action == 'new') {
          this.form.setValue({
            ...this.form.value,
            i9Completed: !this.form.value.i9Completed,
            i9Date: this.subVerifyDate,
          });
        }
        // if (this.action != 'edit' && this.form.value.i9Completed == false)
        //   return (this.isDisabledEVerify = true);
        break;
      case 'active_confirmation':
        this.isActiveConfirmation = !this.isActiveConfirmation;
        break;
      case 'e-verify-confirm-i9Notes-close':
        this.isEverifyConfirmVisible = !this.isEverifyConfirmVisible;
        this.isVerifyContentVisible = true;

        break;
      case 'active_confirmed':
        this.isActiveConfirmation = false;
        this.isActiveConfirmed = !this.isActiveConfirmed;
        break;
      case 'active_Confirmed_date':
        break;
      case 'everifyCalendar':
        this.isI9DateAlert = true;
        // this.isEverifyCalendar = !this.isEverifyCalendar
        // this.isI9DateAlert=true
        break;
      case 'calanderExit':
        this.isI9DateAlert = false;
        this.isEverifyCalendar = true;
        break;
      case 'alertClose':
        this.isI9DateAlert = false;
        this.isEverifyCalendar = true;
        break;
      case 'calanderCancle':
        this.isI9DateAlert = false;
        this.isEverifyCalendar = true;
        break;
      case 'completeionSelectedDate':
        this.isEverifyCalendar = false;
        this.i9Notes = ' ';
        this.isEverifyConfirmVisible = true;
        break;
      case 'titleAlertClose':
        this.isTitlesAlert = false;
        break;
      case 'titleExit':
        this.isTitlesAlert = false;
        break;
      default:
        break;
    }
  }
  onVerifyClose() {
    this.isSubVerifyVisible = false;
    this.subVerifyDate = moment().format('MM-DD-YYYY');
    this.form.setValue({
      ...this.form.value,
      i9Date: this.subVerifyDate,
    });
    this.iseVerifyCompletedVisible = false;
    this.isEverifyCalendar = true;
  }
  onVerifyI9Close() {
    this.iseVerifyCompletedVisible = false;
  }
  onChangeUnionSubButtonEvent() {
    if (this.action == 'edit') {
      if (this.form.value.unionLabor == true) {
        this.disableSubUnionLabor = false;
        this.disableUnionLabor = true;
        this.form.setValue({
          ...this.form.value,
          unionLabor: !this.form.value.unionLabor,
        });
      }
    } else if (this.action == 'new') {
      this.disableSubUnionLabor = false;
      this.disableUnionLabor = true;
      this.form.setValue({
        ...this.form.value,
        unionLabor: !this.form.value.unionLabor,
      });
    }
  }
  onChangeUnionButton() {
    this.disableUnionLabor = false;
    this.form.setValue({
      ...this.form.value,
      unionLabor: !this.form.value.unionLabor,
    });
    this.disableSubUnionLabor = true;
  }
  onClickYardeeBtn(event) {
    this.disableYardEEtext = true;
    this.disableYardBtn = false;
  }
  onResizeColumn() {}
  disableTextbox(event) {
    this.disableYardEEtext = false;
    this.disableYardBtn = true;
    this.form.setValue(event.selectedRows[0].dataItem.yardEmployee);
  }
  onSortChange() {}

  onReOrderColumns() {}

  onDataStateChange() {}

  onRowSelect(event, type) {
    this.selectedTitles = event;
    switch (type) {
      case 'account':
        // this.selectedAccount = event.selectedRows[0].dataItem.value;
        this.form.controls['employeeAccount'].setValue(
          event.selectedRows[0].dataItem.value
        );
        this.isAccountVisible = !this.isAccountVisible;
        break;
      case 'employer':
        this.form.controls['employer'].setValue(
          event.selectedRows[0].dataItem.value
        );
        this.isEmployerVisible = !this.isEmployerVisible;
        break;
      case 'department':
        this.form.controls['department'].setValue(
          event.selectedRows[0].dataItem.full_name
        );
        this.isDepartmentVisible = !this.isDepartmentVisible;
        break;
      case 'title':
        // this.form.controls['title'].setValue(this.titles[0].name);
        break;
      case 'addTitle':
       
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
        this.form.controls['adpNumber'].setValue(this.adpText);
        this.isADPVisible = !this.isADPVisible;
        break;
      case 'adpText':
        this.isADPVisible = !this.isADPVisible;
        break;
      case 'QBRep':
        this.isQBRepVisible = !this.isQBRepVisible;
        break;
      case 'qbrep_submit':
        this.form.controls['qbRep'].setValue(this.QBRep);
        this.isQBRepVisible = !this.isQBRepVisible;
        break;
      case 'unionLabor':
        if (this.isUnionLaborVisible) {
          this.isYardVisible = false;
        }
        this.isUnionLaborVisible = !this.isUnionLaborVisible;
        break;
      case 'unionLabor_submit':
        this.form.controls['unionLabor'].setValue(this.unionLabor);
      case 'yard':
        this.isYardVisible = !this.isYardVisible;
        break;
      case 'yard_submit':
        this.form.setValue({
          ...this.form.value,
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
  rowDbClick(event) {
    const data: any = this.titles.indexOf(
      this.selectedTitles?.selectedRows[0]?.dataItem
    );
    if (data >= 0) {
      this.titles.splice(data, 1);
    }
    this.isAddTitleVisible = !this.isAddTitleVisible;
  }
  titlesDbClick(event){
    if(this.selectedTitles === undefined ){
      this.titles.push({name:this.titlesListSelection.name});
      const data: any = this.titleList.indexOf(
        this.titlesListSelection
      );
      if (data >= 0) {
        this.titleList.splice(data, 1);
      }
      this.isAddTitleVisible = !this.isAddTitleVisible;
    }
    else{
      this.titles.push(this.selectedTitles?.selectedRows?.[0]?.dataItem);
      const data: any = this.titleList.indexOf(
        this.selectedTitles?.selectedRows?.[0]?.dataItem
      );
      if (data >= 0) {
        this.titleList.splice(data, 1);
      }
      this.isAddTitleVisible = !this.isAddTitleVisible;
    }
  }
  getCreditDate() {
    let eVerifydate: any = '';
    let form = this.form.value;
  }
  onChangeHourly(type) {
    switch (type) {
      case 'hourly':
        this.form.setValue({
          ...this.form.value,
          hourly: !this.form.value.hourly,
        });
    }
  }

  onSearchTitles(event) {
    this.titleList = process(this.source, {
      filter: {
        logic: 'or',
        filters: [
          {
            field: 'name',
            operator: 'contains',
            value: event.target.value,
          },
        ],
      },
    }).data;
  }
  handleFilterDepartment(inputValue: string): void {
    if (inputValue) {
      this.department = process(this.allDepartments, {
        filter: {
          logic: 'or',
          filters: [
            {
              field: 'full_name',
              operator: 'contains',
              value: inputValue,
            },
          ],
        },
      }).data;
    } else {
      this.department = this.allDepartments;
    }
  }
  onSearchDepartments(event) {
    // this.department = process(this.source).data;
  }
  employeeTitlespupop(event, type) {
    switch (type) {
      case 'title':
        if (this.titles.length == 0) {
          this.isTitlesAlert = true;
        } else {
          this.form.controls['title'].setValue(this.titles[0].name);
          this.isTitleVisible = !this.isTitleVisible;
        }
        break;
      default:
        break;
    }
  }
  otherColorInfo(value, type = 'value') {
    if (value === true) {
      return type === 'color' ? { 'background-color': 'lightgreen' } : 'Yes';
    } else if (value === null && this.action == 'new') {
      return type === 'color' ? { 'background-color': '' } : '';
    } else {
      return type === 'color' ? { 'background-color': '#ff7070' } : 'No';
    }
  }
  allButtonadpNumber(value, type = 'value') {
    if (!value) {
      return type === 'color' ? { 'background-color': '' } : 'No';
    } else if (value > 0 && value != 1) {
      return type === 'color'
        ? { 'background-color': 'lightgreen' }
        : this.form.value?.adpNumber || null;
    } else if (value == 0) {
      return type === 'color' ? { 'background-color': '#ff7070' } : 'No';
    } else if (value == 1) {
      return type === 'color' ? { 'background-color': 'lightgreen' } : 'Yes';
    } else if (value <= 0) {
      return type === 'color'
        ? { 'background-color': '#ff7070' }
        : this.form.value?.adpNumber || null;
    } else if (this.action == 'new') {
      return type === 'color' ? { 'background-color': '' } : '';
    }
  }
  allButtonQB(value, type = 'value') {
    if (value) {
      return type === 'color'
        ? { 'background-color': 'lightgreen' }
        : this.form.value?.qbRep || null;
    } else if (value == '') {
      return type === 'color' ? { 'background-color': '#ff7070' } : null;
    } else if (this.action == 'new') {
      return type === 'color' ? { 'background-color': '' } : '';
    }
  }
  eVerifyButton(value) {
    if (value == false) {
      return 'No';
    }
  }
}
