import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  CancelEvent,
  CreateFormGroupArgs,
  EventClickEvent,
  SaveEvent,
  SchedulerComponent,
  SchedulerEvent,
  SchedulerModelFields,
  SlotClickEvent,
} from '@progress/kendo-angular-scheduler';
import '@progress/kendo-date-math/tz/regions/Europe';
import '@progress/kendo-date-math/tz/regions/NorthAmerica';
import { filter } from 'rxjs/operators';
import { EditService } from './../../../../data/edit.service';
import { EditMode, CrudOperation } from '@progress/kendo-angular-scheduler';
import {
  GroupDescriptor,
  orderBy,
  process,
  SortDescriptor,
  State,
} from '@progress/kendo-data-query';
import moment from 'moment';

import {
  // ViewData,
  // ViewColumn,
  ViewEmpData,
  ViewEmpColumn,
} from './../../../../data/personal-day-calender-data';
import { CalenderServiceService } from './calender-service.service';
import { ErrorMessages, ModuleNames } from 'src/app/core/constant';
import { ErrorHandlerService } from 'src/app/core/services';
/**
 * NOTE: Enums declaration here is for demo compilation purposes only!
 * In the usual case include them as an import from the Scheduler:
 *
 * import { EditMode, CrudOperation } from '@progress/kendo-angular-scheduler'
 */
import { Subscription } from 'rxjs';
import { UtilityService } from 'src/app/core/services/utility.service';
import { DropdownService } from 'src/app/core/services/dropdown.service';
import { DatePipe } from '@angular/common';
import {
  DataBindingDirective,
  GroupKey,
  GroupRowArgs,
} from '@progress/kendo-angular-grid';
import { UserPreferenceModel } from 'src/app/core/models/preference.model';
import { UserPreferenceService } from 'src/app/core/services/user-preference.service';
import { MenuService } from 'src/app/core/helper/menu.service';
import { LoaderService } from 'src/app/core/loader/loader.service';
@Component({
  selector: 'app-personal-day-calender',
  templateUrl: './personal-day-calender.component.html',
  styleUrls: ['./personal-day-calender.component.scss'],
})
export class PersonalDayCalenderComponent implements OnInit {
  @ViewChild(DataBindingDirective) dataBinding: DataBindingDirective;
  show: boolean;
  toggleText: string;
  public selectedDate: Date = new Date();
  eventDate: Date = new Date();
  datepickerdate: any = new Date();
  group: any = [{ field: 'employeeName' }];
  state: State = {
    group: [{ field: 'workDate' }],
  };
  public groups: GroupDescriptor[] = [
    // { field: 'workDate' },
    // { field: 'employeeName' },
    // { field: 'branch' },
  ];
  pdcData: any = [];
  public expandedKeys: { field: string; value: string }[] = [
    {
      field: 'workDate',
      value: this.datepipe.transform(this.selectedDate, 'yyyy-MM-dd'),
    },
  ];
  multiple: boolean = false;
  skip: number = 0;
  expandedGroupKeys: GroupKey[] = [];
  private initiallyExpanded = false;
  public isGroupExpanded = (rowArgs: GroupRowArgs): boolean => {
    const matchKey = this.expandedKeys.some(
      (groupKey) =>
        groupKey.field === rowArgs.group.field &&
        groupKey.value ===
          this.datepipe.transform(rowArgs.group.value, 'yyyy-MM-dd')
    );

    return (
      (this.initiallyExpanded && !matchKey) ||
      (!this.initiallyExpanded && matchKey)
    );
  };

  public items: any[] = [
    {
      text: 'Item1',
      items: [{ text: 'Item1.1' }, { text: 'Item1.2' }],
    },
    {
      text: 'Item2',
    },
    {
      text: 'Item3',
    },
  ];
  viewScheduledData: any;
  viewScheduledColumn: any;

  public formGroup: any;
  public form: FormGroup;
  branchList: any = [];
  ptoList: any = [];
  personalDayList: any = [];
  viewEmpColumn: any;
  viewData: any;
  tempViewData: any;
  viewColumn = [
    {
      Name: 'employeeName',
      isCheck: true,
      Text: 'Employee',
      isDisable: false,
      index: 0,
      width: 50,
    },
    {
      Name: 'branchName',
      isCheck: true,
      Text: 'Branch Name',
      isDisable: false,
      index: 1,
      width: 50,
    },
  ];
  viewEmpData: any;
  tempviewEmpData: any;
  displayType: boolean = false;
  displayEmpDialog: boolean = false;
  displayApprovedEmpDialog: boolean = false;
  displayAddDialog: boolean = false;
  displayRemoveDialog: boolean = false;
  displaySuccRemoveDialog: boolean = false;
  enabledCheckDateRange: boolean = true;
  displayEventpopup: boolean = false;
  data: any;
  userPreferenceModel: UserPreferenceModel;
  columnWidths: any = [];
  showPersonalDayCalendar: boolean = true;
  public sort: SortDescriptor[] = [
    {
      field: 'ee',
      dir: 'asc',
    },
    {
      field: 'branch',
      dir: 'asc',
    },
  ];
  public mySelection: number[] = [0];

  branchData: any;
  clickEventsubscription: Subscription;
  message: any;
  branchCode: string = 'All';
  errorMsg: string = '';
  branchAll = [
    {
      id: 0,
      value: 'All',
      code: 'All',
    },
  ];
  branch: any[] = [];
  pdcGroups = [
    {
      label: 'Work Date',
      value: 'workDate',
    },
    {
      label: 'Employee',
      value: 'employeeName',
    },
    {
      label: 'Branch',
      value: 'branchName',
    },
  ];

  pdcGroup = {
    label: 'Work Date',
    value: 'workDate',
  };
  // events: any[] = [];
  searchText: string;
  searchApproveText: string;

  public selectedEmp: string[] = ['Select Employee'];
  public selectedApprover: string[] = ['Select Approver'];

  //public selectedDate: Date = displayDate;
  public events: SchedulerEvent[] = [];
  public fields: SchedulerModelFields = {
    id: 'TaskID',
    title: 'Title',
    description: 'Description',
    startTimezone: 'StartTimezone',
    start: 'Start',
    end: 'End',
    endTimezone: 'EndTimezone',
    isAllDay: 'IsAllDay',
    recurrenceRule: 'RecurrenceRule',
    recurrenceId: 'RecurrenceID',
    recurrenceExceptions: 'RecurrenceException',
  };
  constructor(
    public formBuilder: FormBuilder,
    public editService: EditService,
    public service: CalenderServiceService,
    public errorHandler: ErrorHandlerService,
    public dropdownService: DropdownService,
    private utility: UtilityService,
    public datepipe: DatePipe,
    public preference: UserPreferenceService,
    public menuService: MenuService,
    public loaderService: LoaderService
  ) {
    if (localStorage.getItem('isAdmin') == 'true') {
      this.showPersonalDayCalendar = true;
    } else {
      let acc = this.menuService.checkUserViewRights('Personal Day Calendar');
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
        //this.router.navigate(['/dashboard']);
        // this.utility.toast.error(
        //   'You do not have permissions to access this part of the system. Please contact your supervisor so they can request them from IT.'
        // );
      }
      this.menuService.checkUserBySubmoduleRights('Personal Day Calendar');
      const rights = JSON.parse(localStorage.getItem('Rights'));
      if (rights) {
        this.showPersonalDayCalendar = rights.some(
          (c) =>
            c.subModuleName == 'Personal Day Calendar' &&
            c.moduleName == 'Personal Day Calendar'
        );
        console.log(this.showPersonalDayCalendar);
      }
    }
    this.createFormGroup = this.createFormGroup.bind(this);
  }
  public createFormGroup(args: CreateFormGroupArgs): FormGroup {
    const dataItem = args.dataItem;
    this.selectedDate = dataItem.start;

    const isOccurrence = args.mode === EditMode.Occurrence;
    const exceptions = isOccurrence ? [] : dataItem.recurrenceExceptions;
    this.enabledCheckDateRange = true;
    this.personalDayList = [];
    this.form = this.formBuilder.group({
      selectDateRange: [false],
      id: 0,
      userName: JSON.parse(localStorage.getItem('currentUser')).userName,
      user_PK: JSON.parse(localStorage.getItem('currentUser')).id,
      employeeId: ['', Validators.required],
      fromDt: [this.selectedDate, Validators.required],
      toDt: [this.selectedDate, Validators.required],
      paid: true,
      job: ['', Validators.required],
      approved: ['', Validators.required],
      hours: [''],
      //branch: ['']
    });

    this.GetSchedueByDay(dataItem.start);

    this.formGroup = this.formBuilder.group({
      selectDateRange: [false],
      id: args.isNew ? this.getNextId() : dataItem.id,
      start: [dataItem.start, Validators.required],
      end: [dataItem.end, Validators.required],
      startTimezone: [dataItem.startTimezone],
      endTimezone: [dataItem.endTimezone],
      isAllDay: dataItem.isAllDay,
      title: dataItem.title,
      description: dataItem.description,
      recurrenceRule: dataItem.recurrenceRule,
      recurrenceId: dataItem.recurrenceId,
      recurrenceExceptions: [exceptions],
    });
    var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    if (
      days[this.selectedDate.getDay()] === 'Sun' ||
      days[this.selectedDate.getDay()] === 'Sat'
    ) {
      return null;
    } else {
      return this.formGroup;
    }
  }
  public getNextId(): number {
    const len = this.events.length;

    return len === 0 ? 1 : this.events[this.events.length - 1].id + 1;
  }
  public ngOnInit(): void {
    this.initForm();
    this.datepickerdate = this.selectedDate;
    // this.clickEventsubscription = this.utility
    //   .getClickEvent()
    //   .subscribe((a) => {
    //     this.message = a;
    //     this.callBack(this.message);
    //   });
    this.editService.read();
    //this.viewData = ViewData;
    // this.branch = JSON.parse(this.utility.storage.getItem('selectedBranch'));
    // if (this.branch[0].id == 0) {
    this.GetBranch();
    //}
    this.GetList();
    //this.viewColumn = ViewColumn;
    //this.viewEmpData = ViewEmpData;
    this.loadEmployee();
    this.loadPTO();
    //this.viewEmpColumn = ViewEmpColumn;
  }
  callBack(value) {
    var valueId = [];
    var valueId1 = [];
    this.branchData = value;
    this.branch = value;
    this.branchCode = '';
    if (value.length > 0) {
      let ssg = value.findIndex((c) => c.value == 'SSG');
      if (value[0].id == 0 || ssg > 0) {
        this.GetBranch();
      }
    }
    // value.forEach((element) => {
    //   valueId.push(element.id);
    //   valueId1.push(element.userId);
    // });
    // if (value.length > 0) { this.branchCode = value[value.length - 1].code; }
    // this.loadCyclecount(this.branchCode);
  }
  initForm(): void {
    this.form = this.formBuilder.group({
      selectDateRange: [false],
      id: 0,
      userName: JSON.parse(localStorage.getItem('currentUser')).userName,
      user_PK: JSON.parse(localStorage.getItem('currentUser')).id,
      employeeId: ['', Validators.required],
      fromDt: [new Date(), Validators.required],
      toDt: [new Date(), Validators.required],
      paid: true,
      job: ['', Validators.required],
      approved: ['', Validators.required],
      hours: [''],
      //branch: ['']
    });
  }
  loadEmployee() {
    this.dropdownService.GetEmployeeList().subscribe(
      (res) => {
        if (res) {
          this.viewEmpData = res;
          this.tempviewEmpData = res;
        }
      },
      (error) => this.onError(error, ErrorMessages.drop_down.get_vendor_list)
    );
  }
  loadPTO() {
    this.dropdownService.GetPTOtypeList().subscribe(
      (res) => {
        if (res) {
          this.ptoList = res;
        }
      },
      (error) => this.onError(error, ErrorMessages.drop_down.get_vendor_list)
    );
  }
  datechange(event) {
    this.selectedDate = event;
    this.GetList();
  }
  setCurrentDate() {
    this.selectedDate = new Date();
    this.datepickerdate = this.selectedDate;
    this.GetList();
  }
  setPrevMonth() {
    this.selectedDate = new Date(
      this.selectedDate.setMonth(this.selectedDate.getMonth() - 1)
    );
    this.datepickerdate = this.selectedDate;
    this.GetList();
  }
  setNextMonth() {
    this.selectedDate = new Date(
      this.selectedDate.setMonth(this.selectedDate.getMonth() + 1)
    );
    this.datepickerdate = this.selectedDate;
    this.GetList();
  }
  GetList() {
    var request = {
      date: 0,
      month: this.selectedDate.getMonth() + 1, //new Date().getMonth() + 1,
      year: this.selectedDate.getFullYear(), // new Date().getFullYear(),
      branch: !this.branchCode ? 'All' : this.branchCode,
    };
    this.service.GetList(request).subscribe(
      (res) => {
        this.events = [];
        this.pdcData = process(res, this.state);
        this.viewData = res;
        this.tempViewData = res;
        this.getPreference();
        this.viewData.forEach((element) => {
          this.events.push({
            id: element.pk,
            title: element.employee,
            start: new Date(element.workDate),
            end: new Date(element.workDate), //new Date("2022-06-22T09:30:00"),
            isAllDay: false,
          });
        });
        // this.events = [
        //   {
        //     id: 1,
        //     title: 'Nayan Task',
        //     start: new Date("2022-06-20T09:00:00"),
        //     end: new Date("2022-06-22T09:30:00"),
        //     isAllDay: false,
        //   }
        // ];
      },
      (error) => this.onError(error, ErrorMessages.user.list)
    );
  }

  GetSchedueByDay(scheduledDate) {
    var request = {
      date: scheduledDate.getDate(),
      month: scheduledDate.getMonth() + 1, //new Date().getMonth() + 1,
      year: scheduledDate.getFullYear(), // new Date().getFullYear(),
      branch: this.branchCode,
    };
    this.service.GetList(request).subscribe(
      (res) => {
        this.viewScheduledData = res;
      },
      (error) => this.onError(error, ErrorMessages.user.list)
    );
  }

  GetBranch() {
    this.branch = this.utility.storage.CurrentUser.userBranch; //this.branchAll.concat(
    //);
    // var index = this.branch.findIndex((c) => c.value == 'SSG');
    // this.branch.splice(index, 1);
    this.branch.unshift({ code: 'All', id: 0, value: 'All' });
    this.branchData = this.branch;
  }

  public slotDblClickHandler({
    sender,
    start,
    end,
    isAllDay,
  }: SlotClickEvent): void {
    // this.selectedDate = start;
    this.eventDate = start;
    console.log('this.eventDate', this.eventDate);
    if (moment().isSame(moment(start), 'month')) {
      var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      if (days[start.getDay()] === 'Sun' || days[start.getDay()] === 'Sat') {
        console.log('days', days);
        this.displayEventpopup = false;
        return;
      } else {
        let currentMonth = new Date().getMonth();
        if (currentMonth == this.eventDate.getMonth()) {
          this.displayEventpopup = true;
        } else {
          this.displayEventpopup = false;
        }
        this.enabledCheckDateRange = true;
        this.personalDayList = [];
        this.form = this.formBuilder.group({
          selectDateRange: [false],
          id: 0,
          userName: JSON.parse(localStorage.getItem('currentUser')).userName,
          user_PK: JSON.parse(localStorage.getItem('currentUser')).id,
          employeeId: ['', Validators.required],
          fromDt: [start, Validators.required],
          toDt: [start, Validators.required],
          paid: false,
          job: ['', Validators.required],
          approved: ['', Validators.required],
          hours: [''],
          //branch: ['']
        });
        this.GetSchedueByDay(start);
      }
    }

    // this.formGroup = this.formBuilder.group(
    //   {
    //     "id": 0,
    //     "userName": [''],
    //     "user_PK": 0,
    //     "employeeId": ['', Validators.required],
    //     "fromDt": ['', Validators.required],
    //     "toDt": ['', Validators.required],
    //     "paid": true,
    //     "job": 1,
    //     "approved": 0,
    //     "hours": 0
    //   }
    // );

    //sender.addEvent(this.form);
  }
  public toggleGroup(rowArgs: GroupRowArgs): void {
    const keyIndex = this.expandedKeys.findIndex(
      (groupKey) =>
        groupKey.field === rowArgs.group.field &&
        groupKey.value ===
          this.datepipe.transform(rowArgs.group.value, 'yyyy-MM-dd')
    );

    if (keyIndex === -1) {
      this.expandedKeys = [];
      this.expandedKeys.push({
        field: rowArgs.group.field,
        value: this.datepipe.transform(rowArgs.group.value, 'yyyy-MM-dd'),
      });
    } else {
      this.expandedKeys.splice(keyIndex, 1);
    }
  }
  public eventDblClickHandler({ sender, event }: EventClickEvent): void {
    this.closeEditor(sender);
    let dataItem = event.dataItem;
    if (this.editService.isRecurring(dataItem)) {
      sender
        .openRecurringConfirmationDialog(CrudOperation.Edit)
        // The result will be undefined if the dialog was closed.
        .pipe(filter((editMode) => editMode !== undefined))
        .subscribe((editMode: EditMode) => {
          if (editMode === EditMode.Series) {
            dataItem = this.editService.findRecurrenceMaster(dataItem);
          }
          //this.formGroup = this.createFormGroup(dataItem, editMode);
          sender.editEvent(dataItem, { group: this.formGroup, mode: editMode });
        });
    } else {
      // this.formGroup = this.createFormGroup(dataItem, EditMode.Event);
      sender.editEvent(dataItem, { group: this.formGroup });
    }
  }

  // public createFormGroup(dataItem: any, mode: EditMode): FormGroup {
  //   const isOccurrence = mode === EditMode.Occurrence;
  //   const exceptions = isOccurrence ? [] : dataItem.RecurrenceException;

  //   return this.formBuilder.group({
  //     Start: [dataItem.Start, Validators.required],
  //     End: [dataItem.End, Validators.required],
  //     StartTimezone: [dataItem.StartTimezone],
  //     EndTimezone: [dataItem.EndTimezone],
  //     IsAllDay: dataItem.IsAllDay,
  //     Title: dataItem.Title,
  //     Description: dataItem.Description,
  //     RecurrenceRule: dataItem.RecurrenceRule,
  //     RecurrenceID: dataItem.RecurrenceID,
  //     RecurrenceException: [exceptions],
  //   });
  // }

  public cancelHandler({ sender }: CancelEvent): void {
    this.form.reset();
    this.selectedEmp = ['Select Employee'];
    this.selectedApprover = ['Select Approver'];
    this.closeEditor(sender);
  }

  // public removeHandler({ sender, dataItem }: RemoveEvent): void {
  //   if (this.editService.isRecurring(dataItem)) {
  //     sender
  //       .openRecurringConfirmationDialog(CrudOperation.Remove)
  //       // The result will be undefined if the dialog was closed.
  //       .pipe(filter((editMode) => editMode !== undefined))
  //       .subscribe((editMode) => {
  //         this.handleRemove(dataItem, editMode);
  //       });
  //   } else {
  //     sender.openRemoveConfirmationDialog().subscribe((shouldRemove) => {
  //       if (shouldRemove) {
  //         this.editService.remove(dataItem);
  //       }
  //     });
  //   }
  // }

  public saveHandler({
    sender,
    formGroup,
    isNew,
    dataItem,
    mode,
  }: SaveEvent): void {
    if (this.form.value.job == 20 || this.form.value.job == 990) {
      this.saveData(false);
    } else {
      this.displayAddDialog = true;
    }
  }

  saveData(isPaid) {
    if (this.form.valid) {
      let fromdate = new Date(
        this.datepipe.transform(this.form.value.fromDt, 'yyyy-MM-dd')
      );
      let todate = new Date(
        this.datepipe.transform(this.form.value.toDt, 'yyyy-MM-dd')
      );
      this.form.controls['fromDt'].setValue(fromdate);
      this.form.controls['toDt'].setValue(todate);
      //this.form.controls['branch'].setValue(this.branchCode);
      this.form.get('job').value === 20
        ? this.form.controls['paid'].setValue(true)
        : this.form.controls['paid'].setValue(isPaid);
      this.service.AddActivity(this.form.value).subscribe((res) => {
        this.utility.toast.success('Added successfully');
        this.selectedEmp = ['Select Employee'];
        this.selectedApprover = ['Select Approver'];
        this.form = this.formBuilder.group({
          selectDateRange: [false],
          id: 0,
          userName: JSON.parse(localStorage.getItem('currentUser')).userName,
          user_PK: JSON.parse(localStorage.getItem('currentUser')).id,
          employeeId: ['', Validators.required],
          fromDt: [this.eventDate, Validators.required],
          toDt: [this.eventDate, Validators.required],
          paid: false,
          job: ['', Validators.required],
          approved: ['', Validators.required],
          hours: [''],
          //branch: ['']
        });
        this.GetSchedueByDay(this.eventDate);
      });

      //this.closeEditor(sender);
    } else {
      this.utility.toast.error('validate');
    }
  }

  private closeEditor(scheduler: SchedulerComponent): void {
    scheduler.closeEvent();
    this.form.reset();
    this.formGroup = undefined;
  }

  private handleRemove(item: any, mode: EditMode): void {
    const service = this.editService;
    if (mode === EditMode.Series) {
      service.removeSeries(item);
    } else if (mode === EditMode.Occurrence) {
      if (service.isException(item)) {
        service.remove(item);
      } else {
        service.removeOccurrence(item);
      }
    } else {
      service.remove(item);
    }
  }

  private seriesDate(head: Date, occurence: Date, current: Date): Date {
    const year =
      occurence.getFullYear() === current.getFullYear()
        ? head.getFullYear()
        : current.getFullYear();
    const month =
      occurence.getMonth() === current.getMonth()
        ? head.getMonth()
        : current.getMonth();
    const date =
      occurence.getDate() === current.getDate()
        ? head.getDate()
        : current.getDate();
    const hours =
      occurence.getHours() === current.getHours()
        ? head.getHours()
        : current.getHours();
    const minutes =
      occurence.getMinutes() === current.getMinutes()
        ? head.getMinutes()
        : current.getMinutes();

    return new Date(year, month, date, hours, minutes);
  }
  onType() {
    this.displayType = !this.displayType;
  }
  public close(status) {
    if (status == 'cancel') {
      this.displayEmpDialog = !this.displayEmpDialog;
    } else {
      this.displayEmpDialog = !this.displayEmpDialog;
    }
  }
  public closeEvent(status) {
    this.form.reset();
    this.selectedEmp = ['Select Employee'];
    this.selectedApprover = ['Select Approver'];
    this.GetList();
    // if (status == 'cancel') {
    this.displayEventpopup = false;
    // } else {
    //   this.displayEventpopup = !this.displayEventpopup;
    // }
  }
  public closeApprovedEmp(status) {
    if (status == 'cancel') {
      this.displayApprovedEmpDialog = !this.displayApprovedEmpDialog;
    } else {
      this.displayApprovedEmpDialog = !this.displayApprovedEmpDialog;
    }
  }
  onEmployeeDialog() {
    this.viewEmpData = this.tempviewEmpData;
    this.displayEmpDialog = !this.displayEmpDialog;
  }
  onApprovedEmployeeDialog() {
    this.viewEmpData = this.tempviewEmpData;
    this.displayApprovedEmpDialog = !this.displayApprovedEmpDialog;
  }
  public closeAdd(status) {
    if (status == 'yes') {
      this.saveData(true);
      this.displayAddDialog = !this.displayAddDialog;
    } else {
      this.saveData(false);
      this.displayAddDialog = !this.displayAddDialog;
    }
  }
  public closeRemove(status) {
    if (status == 'yes') {
      this.displayRemoveDialog = !this.displayRemoveDialog;
      this.displaySuccRemoveDialog = !this.displaySuccRemoveDialog;
      console.log(this.removeItemData);
      let payload = {
        employeeId: this.removeItemData.employeeNumber,
        workDate: this.removeItemData.workDate,
        userName: JSON.parse(localStorage.getItem('currentUser')).userName,
      };

      this.service.DeleteActivity(payload).subscribe((res) => {
        this.GetSchedueByDay(this.eventDate);
        this.utility.toast.success(res.message);
      });
    } else {
      this.removeItemData = null;
      this.displayRemoveDialog = !this.displayRemoveDialog;
    }
  }
  public closeSuccRemove(status) {
    this.displaySuccRemoveDialog = !this.displaySuccRemoveDialog;
    this.GetList();
  }
  onRemove() {
    this.displayRemoveDialog = !this.displayRemoveDialog;
  }
  onAdd() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return true;
    }
    if (this.form.valid) {
      if (this.form.value.job == 20 || this.form.value.job == 990) {
        this.saveData(false);
      } else {
        this.displayAddDialog = true;
      }
    } else {
      this.utility.toast.error('validate');
    }
  }
  CheckDateRange() {
    this.enabledCheckDateRange = !this.enabledCheckDateRange;
  }
  public onToggle(): void {
    this.show = !this.show;
    this.toggleText = this.show ? 'Hidе' : 'Show';
  }

  closepopup() {
    this.show = !this.show;
  }
  resetpopup() {}
  columnApply() {}

  public hideColumn(): void {}

  public onFilter(inputValue: string): void {
    this.viewEmpData = process(this.tempviewEmpData, {
      filter: {
        logic: 'or',
        filters: [
          {
            field: 'employeeNumber',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'name',
            operator: 'contains',
            value: inputValue,
          },
        ],
      },
    }).data;
    //this.dataBinding.skip = 0;
  }
  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.data = {
      data: orderBy(this.viewData, this.sort),
      total: this.viewData.length,
    };
    this.viewData = this.data.data;
    this.savePreference();
  }
  selectionChange(emp) {
    this.selectedEmp = [emp.name];
    this.loadPersonalDays(emp);
    this.form.controls['employeeId'].setValue(emp.employeeNumber);
  }
  dblClickEvent(emp) {
    // this.selectedEmp = [emp.name];
    // this.form.controls['employeeId'].setValue(emp.employeeNumber);

    this.displayEmpDialog = false;
  }
  selectionApproveChange(emp) {
    this.selectedApprover = [emp.name];
    this.form.controls['approved'].setValue(emp.employeeNumber);
  }
  dblClickEventApprover(emp) {
    // this.selectedApprover = [emp.name];
    // this.form.controls['approved'].setValue(emp.employeeNumber);

    this.displayApprovedEmpDialog = false;
  }

  loadPersonalDays(emp) {
    var obj = {
      employeeId: emp.employeeNumber,
      month: 0,
      year: this.selectedDate.getFullYear(),
    };
    this.service.GetPerosnalDayList(obj).subscribe(
      (res) => {
        if (res) {
          this.personalDayList = res;
          this.loaderService.hide();
        }
      },
      (error) => this.onError(error, ErrorMessages.drop_down.get_vendor_list)
    );
  }

  removeItemData: any;
  removeItem(data) {
    this.displayRemoveDialog = true;
    this.removeItemData = data;
  }
  dateChangeHandler(sender) {
    if (this.selectedDate != sender.selectedDate) {
      this.selectedDate = sender.selectedDate;
      this.GetList();
    }
  }
  savePreference() {
    var usr = JSON.parse(localStorage.getItem('currentUser'));
    if (usr) {
      this.userPreferenceModel = new UserPreferenceModel();
      this.userPreferenceModel.userName = usr.userId;
      this.userPreferenceModel.id = 0;
      this.userPreferenceModel.userId = 0;
      this.userPreferenceModel.page = 'PersonalDay';
      var objd = {
        columns: [],
        order: this.viewColumn,
        width: this.columnWidths,
        sortBy: this.sort,
      };
      this.userPreferenceModel.preference = objd; //'{ columns: ' + this.hiddenColumns + ', order: ' + this.sort[0].dir + ', width: "", sortBy: ' + this.sort[0].field + '}';
      this.preference
        .SaveUserPreference(this.userPreferenceModel)
        .subscribe((res) => {});
    }
  }
  getPreference() {
    try {
      this.preference.GetUserPreference('PersonalDay').subscribe((res) => {
        if (res.result) {
          var userPref = res.result.preference;
          this.viewColumn = userPref.order.filter((c) => c.isCheck == true);
          this.viewColumn.forEach((element) => {
            let col = this.viewColumn.findIndex((c) => c.Name == element.Name);
            this.viewColumn[col].isCheck = true;
          });
          this.sort = userPref.sortBy;
          this.data = {
            data: orderBy(this.tempViewData, this.sort),
            total: this.tempViewData.length,
          };
        } else {
          this.viewColumn.forEach((element) => {
            let col = this.viewColumn.findIndex((c) => c.Name == element.Name);
            this.viewColumn[col].isCheck = true;
          });
        }
        this.viewData = this.data.data;
      });
    } catch (error) {
      this.viewColumn.forEach((element) => {
        let col = this.viewColumn.findIndex((c) => c.Name == element.Name);
        this.viewColumn[col].isCheck = true;
      });
    }
  }
  resizeColumns(eventData) {
    let col = this.viewColumn.findIndex(
      (c) => c.Name == eventData[0].column.field
    );
    this.viewColumn[col].width = eventData[0].newWidth;
    this.savePreference();
  }
  reorderColumns(event) {
    var newIndx = event.newIndex;
    var oldIndx = event.oldIndex;
    var column = event.column.field;
    let cutOut = this.viewColumn.splice(oldIndx, 1)[0]; // cut the element at index 'from'
    this.viewColumn.splice(newIndx, 0, cutOut); // insert it at index 'to'
    this.savePreference();
  }
  public onSelectionChange(event): void {
    this.expandedKeys = [
      {
        field: 'workDate',
        value: this.datepipe.transform(event.start, 'yyyy-MM-dd'),
      },
    ];
  }

  onError(error: any, customMessage?: string) {
    this.errorHandler.handleError(error, ModuleNames.user, customMessage);
  }

  onRowSelect(event) {}

  onResizeColumn(event) {
    let col = this.viewColumn.findIndex((c) => c.Name == event[0].column.field);
    if (col > -1) {
      this.viewColumn[col].width = event[0].newWidth;
      this.savePreference();
    }
  }

  // onSortChange(event) {}

  onReOrderColumns(event) {}

  onDataStateChange(event) {}

  groupChange() {}

  onChangeValue(event) {
    this.state = {
      group: [{ field: event.value }],
    };
    this.GetList();
  }
  getCalendarDate(date) {
    if (moment(this.selectedDate).isSame(date, 'month')) {
      return moment(date).format('DD');
    } else {
      ('');
    }
  }
}
