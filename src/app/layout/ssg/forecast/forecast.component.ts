import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SortDescriptor,orderBy, process } from '@progress/kendo-data-query';
import {
  branchData,
  ForeCastData,
  usersData,
  yearsData,
} from 'src/data/call-logs-data';
import { DropdownService } from '../../../../app/core/services/dropdown.service';
import { ForecastService } from '../forecast/forecast.service';
import {
  ForecastExistRequestModel,
  ForecastViewFilterModel,
  ForecastAddUpdateRequestModel,
  ForecastDeleteRequestModel,
  ForeCastTotalFilterModel,
} from './forecast.model';
import { UtilityService } from '../../../../app/core/services/utility.service';
import { async } from 'rxjs/internal/scheduler/async';
import { MenuService } from 'src/app/core/helper/menu.service';

@Component({
  selector: 'app-forecast',
  template: '',
  templateUrl: './forecast.component.html',
  styleUrls: ['./forecast.component.scss'],
})

export class ForecastComponent implements OnInit {
  isEmployeeVisible: boolean = false;
  isBranchVisible: boolean = false;
  isYearsVisible: boolean = false;
  isNewYearVisible: boolean = false;
  isNewForecastVisible: boolean = false;
  isForecastFormVisible: boolean = false;
  isHideButtons: boolean = false;
  multiple: boolean = false;
  skip: number = 0;
  forecastViewFilterModel: ForecastViewFilterModel;
  forecastExistRequestModel: ForecastExistRequestModel;
  forecastAddUpdateRequestModel: ForecastAddUpdateRequestModel;
  forecastDeleteRequestModel: ForecastDeleteRequestModel;
  foreCastTotalFilterModel: ForeCastTotalFilterModel;
  sort: SortDescriptor[] = [];
  selections: any = [];
  employeeSelection: any = [];
  branchSelecttion: any = [];
  yearSelection: any = [];
  employees: any = [];
  branches: any = [];
  years: any = [];
  forecasts: any = [];
  selectedEmployee: number;
  selectedBranch: string;
  selectBranchCode: string;
  selectedYear: string;
  newEmployee: string;
  newBranch: string;
  newYear: string;
  acc_manager_btn: string = '';
  branch_btn: string = 'Branch';
  year_btn: string = 'Year';
  forecastForm: any = {
    account_manager: '',
    branch: '',
    year: '',
    yearGoal: '',
  };
  isErrorDialogVisible: boolean = false;
  isNewRecord: boolean = false;
  error_message: string = '';
  monthForm: any = {
    AM: '',
    Branch: '',
    YearNumber: '',
    MonthNumber: '',
    MonthGoal: '',
  };

  employeeColumn = [
    {
      Name: 'employeeNumber',
      isCheck: true,
      Text: 'EE#',
      isDisable: false,
      index: 0,
      width: 50,
    },
    {
      Name: 'name',
      isCheck: true,
      Text: 'Name',
      isDisable: false,
      index: 0,
      width: 100,
    },
  ];

  branchColumn = [
    {
      Name: 'value',
      isCheck: true,
      Text: 'Branch',
      isDisable: false,
      index: 0,
      width: 100,
    },
  ];

  yearsColumn = [
    {
      Name: 'year',
      isCheck: true,
      Text: 'Year',
      isDisable: false,
      index: 0,
      width: 100,
    },
  ];

  options: any = {
    spinners: false,
  };
  month = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  isAddRecord: boolean = false;
  selectedRowId: any;
  firstselectedRow: any;
  displayDeleteForecast: boolean;
  isrecordExist: boolean;
  amTotal: number;
  branchTotal: number;
  displayOverwriteForecast: boolean;
  isoverwriteData: boolean;
  monthNumber: number = 1;
  counter: number = 1;
  limit: number = 12;
  displayAddUpdateRecord: boolean;
  public currentYear: Date = new Date();
  employeeBranch: string;

  yearDropdown: any = [
    {
      year: this.currentYear.getFullYear(),
    },
    {
      year: this.currentYear.getFullYear() + 1,
    },
    {
      year: this.currentYear.getFullYear() + 2,
    },
  ];
  employeeSearchList: any[];
  employeeData:any;
  tempEmployee:any;
  tempBranch:any;
  branchData:any;
  yearData:any;
  tempYear:any;
  
  gettempYear:any;
  gettempEmployee:any;
  gettempBranch:any;
  tempForecast:any;
  forecastData:any;
  public sortEmployee: SortDescriptor[] = [
    {
      field: 'employeeNumber',
      dir: 'asc',
    },
    {
      field: 'name',
      dir: 'asc',
    }
  ];
  public sortBranch: SortDescriptor[] = [
    {
      field: 'value',
      dir: 'asc',
    }
  ];
  public sortYear: SortDescriptor[] = [
    {
      field: 'year',
      dir: 'asc',
    }
  ];
  
  public sortGrid: SortDescriptor[] = [
    {
      field: 'am',
      dir: 'asc',
    },
    {
      field: 'branchName',
      dir: 'asc',
    },
    {
      field: 'yearNumber',
      dir: 'asc',
    },
    {
      field: 'monthNumber',
      dir: 'asc',
    },
    {
      field: 'monthGoal',
      dir: 'asc',
    }
  ]
  public min = 1;
  public max = 12;
  public autoCorrect = true;
  public minValue = new Date().getFullYear();
  branchesData:any;
  isNewBranchVisible:boolean;
  constructor(
    private formBuilder: FormBuilder,
    public dropdownService: DropdownService,
    public forecastService: ForecastService,
    public menuService: MenuService,
    public utility: UtilityService
  ) {
    if (localStorage.getItem('isAdmin') == 'true') {

    } else {
      let acc = this.menuService.checkUserViewRights('Forecast');
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
      this.menuService.checkUserBySubmoduleRights('Forecast');
    }
  }

  ngOnInit(): void {
    this.forecasts = [];
   
    this.forecastViewFilterModel = new ForecastViewFilterModel();
    this.forecastExistRequestModel = new ForecastExistRequestModel();
    this.forecastAddUpdateRequestModel = new ForecastAddUpdateRequestModel();
    this.forecastDeleteRequestModel = new ForecastDeleteRequestModel();
    this.foreCastTotalFilterModel = new ForeCastTotalFilterModel();
    this.getEmployees();
    this.getBranch();
    this.getYear();
    this.getdropDownBranch();
    this.year_btn = this.currentYear.getFullYear().toString();
    this.selectedYear =this.currentYear.getFullYear().toString();
    this.forecastViewFilterModel.Year = this.selectedYear;
    this.getForecastList();
    //  this.getForecastList();
  }

  onHandleFilters(type) {
    switch (type) {
      case 'employees':
        this.isEmployeeVisible = !this.isEmployeeVisible;
        this.employees = this.gettempEmployee;
        this.employeeSelection = [];
        break;

      case 'branch':
        this.isBranchVisible = !this.isBranchVisible;
        this.branches = this.gettempBranch;
        this.branchSelecttion = [];
        break;

      case 'years':
        this.isYearsVisible = !this.isYearsVisible;
        this.years = this.gettempYear;
        this.yearSelection = [];
        break;
      default:
      case 'add-forecast':
        this.isForecastFormVisible = !this.isForecastFormVisible;
        this.isHideButtons = true;
        this.forecastForm.year = new Date().getFullYear();
        this.selectedYear = this.currentYear.getFullYear().toString();
        // this.isHideButtons = true
        // // this.isNewForecastVisible = !this.isNewForecastVisible
        // this.isForecastFormVisible = !this.isForecastFormVisible;
        break;
      case 'cancel-forecast':
        // this.isNewForecastVisible = !this.isNewForecastVisible;
        this.isHideButtons = false;
        break;
      case 'save-forecast':
        // this.isNewForecastVisible = !this.isNewForecastVisible;
        // this.isHideButtons = false
        break;
      case 'error':
        this.isErrorDialogVisible = !this.isErrorDialogVisible;
        break;
    }
  }
  onResizeColumn(event) {}

  onRowSelect(event, type) {
    this.amTotal = 0;
    this.branchTotal = 0;
    switch (type) {
      case 'employees':
        if (!this.isForecastFormVisible) {
          this.acc_manager_btn = event.selectedRows?.[0]?.dataItem.name;
          this.selectedEmployee = event.selectedRows[0].dataItem.employeeNumber;
          this.forecastViewFilterModel.AM = this.selectedEmployee;
          this.getForecastList();
        } else {
          this.forecastForm.account_manager =
            event.selectedRows?.[0]?.dataItem.name;
        }
        this.selectedEmployee = event.selectedRows[0].dataItem.employeeNumber;
        this.employeeBranch = event.selectedRows[0].dataItem.branch;
        this.isEmployeeVisible = false;
        this.employeeSelection = [];
        break;
      case 'branch':
        if (!this.isForecastFormVisible) {
          this.branch_btn = event.selectedRows?.[0]?.dataItem.value;
          this.selectedBranch = event.selectedRows[0].dataItem.code;
          this.forecastViewFilterModel.Branch = this.selectedBranch;
          this.getForecastList();
        } else {
          this.forecastForm.branch = event.selectedRows?.[0]?.dataItem.value;
        }
        this.selectBranchCode = event.selectedRows[0].dataItem.code;
        this.selectedBranch = event.selectedRows[0].dataItem.value;
        this.employeeBranch = event.selectedRows[0].dataItem.code;
        this.isBranchVisible = false;
        this.isNewBranchVisible = false;
        this.branchSelecttion = [];
        break;
      case 'years':
        if (!this.isForecastFormVisible) {
          this.year_btn = event.selectedRows?.[0]?.dataItem.year;
          this.selectedYear = event.selectedRows[0].dataItem.year;
          this.forecastViewFilterModel.Year = this.selectedYear;
          this.getForecastList();
        } else {
          this.forecastForm.year = event.selectedRows?.[0]?.dataItem.year;
        }
        this.selectedYear = event.selectedRows[0].dataItem.year;
        this.isYearsVisible = false;
        this.isNewYearVisible = false;
        this.yearSelection = [];
        break;
      default:
        break;
    }
  }

  onSortChange(event) {}

  onReOrderColumns(event) {}

  onDataStateChange(event) {}

  async onAddForecast() {
    if (!this.forecastForm.account_manager) {
      this.error_message = 'Account Manager required';
      this.isErrorDialogVisible = true;
    } else if (!this.forecastForm.yearGoal) {
      this.error_message = 'Invalid Goal';
      this.isErrorDialogVisible = true;
    } else {
      this.forecastExistRequestModel = new ForecastExistRequestModel();
      this.forecastExistRequestModel.AM = this.selectedEmployee;
      this.selectBranchCode = this.employeeBranch;
      this.forecastExistRequestModel.Branch = this.selectBranchCode;
      this.forecastExistRequestModel.YearNumber = this.selectedYear;
      await this.checkExistingRecord();
      this.isForecastFormVisible = false;
    }
  }

  onAddMonthRecord() {
    this.forecasts.push({
      name: '',
      year: '',
      branch: '',
      month: '',
      monthGoal: '',
    });
    (this.isHideButtons = true), (this.isForecastFormVisible = false);
    this.isNewForecastVisible = true;
    this.isNewRecord = true;
  }

  onValueChange(event, key) {
    if (key === 'YearNumber') {
      if (!event?.target?.value) {
        this.error_message = 'Must be valid year';
        this.isErrorDialogVisible = true;
      } else if (
        event.target.value &&
        Number(event.target.value) < new Date().getFullYear()
      ) {
        this.error_message = 'Previous year selection now allowed';
        this.isErrorDialogVisible = true;
      
      }
    }

    if (key === 'MonthNumber' || key === 'MonthGoal') {
      if (!event?.target?.value) {
        this.error_message = 'Not a valid number';
        this.isErrorDialogVisible = !this.isErrorDialogVisible;
      } else if (event.target.value && Number(event.target.value) <= 0) {
        this.error_message = 'Not a valid number';
        this.isErrorDialogVisible = !this.isErrorDialogVisible;
      }
      if (key === 'MonthNumber') {
        if (!event?.target?.value) {
          this.error_message = 'Not a valid number';
          this.isErrorDialogVisible = !this.isErrorDialogVisible;
        } else if (
          (event.target.value && Number(event.target.value) < 1) ||
          Number(event.target.value) > 12
        ) {
          this.error_message = 'Not a valid number';
          this.isErrorDialogVisible = !this.isErrorDialogVisible;
         
      
        }
      }
    
    }
    // if(key === 'AM')
    // {
    //   var index = this.employees.find((c) => c.employeeNumber == event);
    //   this.branches.code = index.branch
    //   this.branches.value = index.branchName
  
    // }
    this.monthForm[key] = event instanceof Object ? event.target.value : event;
   
  }
 
  onSaveMonthRecord() {
    // this.forecasts.pop();

    // this.forecasts.push(this.monthForm);
    // this.isNewForecastVisible = false
    if (this.monthForm.AM == '' || this.monthForm.AM === undefined) {
      this.error_message = 'AM must be selected';
      this.isErrorDialogVisible = true;
    } else if (
      this.monthForm.Branch == '' ||
      this.monthForm.Branch === undefined
    ) {
      this.error_message = 'Branch must be selected';
      this.isErrorDialogVisible = true;
    } else if (
      this.monthForm.YearNumber == '' ||
      this.monthForm.YearNumber === undefined || this.monthForm.YearNumber < new Date().getFullYear()
    ) {
      this.error_message = 'Previous year selection now allowed';
      this.isErrorDialogVisible = true;
    } else if (
      this.monthForm.MonthNumber == '' ||
      this.monthForm.MonthNumber === undefined ||
      this.monthForm.MonthNumber < 1 ||
      this.monthForm.MonthNumber > 12
    ) {
      this.error_message = 'Not a valid number';
      this.isErrorDialogVisible = true;
    } else if (
      this.monthForm.MonthGoal == '' ||
      this.monthForm.MonthGoal === undefined
    ) {
      this.error_message = 'Not a valid number';
      this.isErrorDialogVisible = true;
    } else {
      this.forecastExistRequestModel = new ForecastExistRequestModel();
      this.forecastExistRequestModel.AM = this.monthForm.AM;
      this.forecastExistRequestModel.Branch = this.monthForm.Branch;
      this.forecastExistRequestModel.YearNumber = this.monthForm.YearNumber;
      this.forecastService
        .checkExistingRecordInForecast(this.forecastExistRequestModel)
        .subscribe((res) => {
          if (res['status'] == 200) {
            this.forecastService.addForecastList(this.monthForm).then((res) => {
              if (res['status'] == 200) {
                this.utility.toast.success(res.message);
                this.isAddRecord = true;
              } else {
                this.utility.toast.error(res.message);
              }
            });
            this.forecastViewFilterModel.AM = this.selectedEmployee;
                setTimeout(() => {
              this.getForecastList();
             }, 1500);
             this.onDeleteMonthRecord();
          } else {
            this.onDisplayAddUpdateRecord();
          }
        });
     
      //AT - Call add API
    }

    this.isNewRecord = false;

    // AM: '',
    // Branch: '',
    // YearNumber: '',
    // MonthNumber: '',
    // MonthGoal: '',
  }

  onDeleteMonthRecord() {
    this.forecasts.pop();
    this.isNewForecastVisible = false;
    this.isNewRecord = false;
    this.resetMonthForm();
  }
  getEmployees() {
    this.dropdownService.getAmEmployee().subscribe((res) => {
      this.employees = res;
      this.tempEmployee = res;
      this.gettempEmployee = res;
      this.employees.unshift({ "name": "All", "employeeNumber": 0, "value": "All" });
      this.employees = this.employees;  
    });
  }
  getBranch() {
    this.dropdownService.GetBranchList().subscribe((res) => {
      this.branches = res;
      this.tempBranch =res; // used in sorting
      this.gettempBranch = res; // used in sorting
      var index = this.branches.findIndex((c) => c.value == 'SSG');
      this.branches.splice(index, 1);
      this.branches.unshift({ "code": "All", "id": 0, "value": "All" });
      this.branches = this.branches;
      this.branches = this.branchData; // used in sorting
    });
  }
  onEmployeeValueChange(event, data) {
    
  }
  getForecastList() {
    if (
      this.forecastViewFilterModel.AM == null ||
      this.forecastViewFilterModel.AM === undefined
    ) {
      this.forecastViewFilterModel.AM = 0;
    }
    if (
      this.forecastViewFilterModel.Branch == null ||
      this.forecastViewFilterModel.Branch === undefined
    ) {
      this.forecastViewFilterModel.Branch = 'ALL';
    }
    if (
      this.forecastViewFilterModel.Year == null ||
      this.forecastViewFilterModel.Year === undefined ||  this.forecastViewFilterModel.Year == "All"
    ) {
      this.forecastViewFilterModel.Year = '0';
    }

    this.forecastService
      .getAMForecastList(this.forecastViewFilterModel)
      .subscribe((res) => {
        this.forecasts = res;
        this.tempForecast = res;
        console.log(res);
        this.firstselectedRow = this.forecasts[0];
        if(this.firstselectedRow!=undefined)
        {
          if(this.forecastViewFilterModel.AM == 0)
          {
            this.acc_manager_btn = "All"
          }
          else
          {
            this.acc_manager_btn = this.firstselectedRow.name;
          }
        
          this.newEmployee = this.firstselectedRow.name;
          this.selectedBranch = this.firstselectedRow.branch;
        }
       
        this.getForecastTotal();
      });
    this.selections = [0];
  }
  getYear() {
    this.dropdownService.getYearList().subscribe((res) => {
      this.years = res;
      this.tempYear = res;
      this.gettempYear = res;
      this.years.unshift({ "year": "All"});
      this.years = this.years;       
    });
  }
  onAddSelectionEmployeeClick(data) {
    this.isEmployeeVisible = !this.isEmployeeVisible;
    this.selectedBranch = this.employeeBranch;
  }
  OnAddSelectionBranchClick(data) {
    this.isNewBranchVisible = !this.isNewBranchVisible;
  }
  onAddSelectionYearClick(data) {
    this.isNewYearVisible = !this.isNewYearVisible;
  }
  onAddClick() {
    this.isForecastFormVisible = false;
    this.resetAddClick();
    this.isErrorDialogVisible = false;
    // this.isHideButtons = true
    // this.isForecastFormVisible = false;
  }
  async checkExistingRecord() {
    //checkexists(AM,Year,Branch)
    //False
    //Add/Update Call
    //Pass(AM,Branch,Year,YearlyGoal,MonthNumber = 0)
    //True
    //Popup
    //Yes
    //Forloop of twelve
    //Pass (AM,Branch,Year,YearlyGoal,MonthNumber)
    //No
    //DoNothing

    this.forecastService
      .checkExistingRecordInForecast(this.forecastExistRequestModel)
      .subscribe(async (res) => {
        if (res['status'] == 200) {
          this.requestModelForAddUpdate();
          this.forecastAddUpdateRequestModel.MonthNumber = 0;
          await this.forecastService
            .addForecastList(this.forecastAddUpdateRequestModel)
            .then((res) => {
              if (res['status'] == 200) {
                this.utility.toast.success(res.message);
                this.forecastViewFilterModel.AM = this.selectedEmployee;
                this.resetAddClick();
                setTimeout(() => {
                  this.getForecastList();
                }, 1500);
              } else {
                this.utility.toast.error(res.message);
              }
            });
        } else {
          this.onDisplayOverwriteForecast();
        }
      });
  }
  onDeleteRecord() {}
  onGridSelectionChange($event) {
    this.firstselectedRow = $event.selectedRows[0].dataItem;
    this.selectedRowId = $event.selectedRows[0].dataItem.pk;
    this.newEmployee = $event.selectedRows[0].dataItem.name;
    this.selectedBranch = $event.selectedRows[0].dataItem.branchName;
    this.getForecastTotal();
  }
  onDeleteForecast() {
    if (this.forecasts.length > 0 && this.forecasts.length > 0) {
      this.displayDeleteForecast = !this.displayDeleteForecast;

    }
    // this.forecastDeleteRequestModel.YearNumber = getFullYear();
  }
  onYesClickDeleteButton() {
    if (this.firstselectedRow === undefined) {
      this.firstselectedRow = this.forecasts[0];
    }
    this.forecastDeleteRequestModel = new ForecastDeleteRequestModel();
    this.forecastDeleteRequestModel.AM = this.firstselectedRow.am;
    this.forecastDeleteRequestModel.Branch = this.firstselectedRow.branch;
    this.forecastDeleteRequestModel.YearNumber = this.firstselectedRow.yearNumber;
    this.displayDeleteForecast = !this.displayDeleteForecast;
    this.forecastService
      .deleteRecordInForecast(this.forecastDeleteRequestModel)
      .subscribe((res) => {
        if ((res['status'] = 200)) {
          this.utility.toast.success(res.message);
        } else {
          this.utility.toast.error(res.message);
        }
      });
    setTimeout(() => {
      this.getForecastList();
    }, 1500);
  }
  onNoClickDeleteButton() {
    if (this.firstselectedRow === undefined && this.forecasts.length > 0) {
      this.firstselectedRow = this.forecasts[0];
    }
    this.forecastDeleteRequestModel = new ForecastDeleteRequestModel();
    this.forecastDeleteRequestModel.Id = this.firstselectedRow.pk;
    this.displayDeleteForecast = !this.displayDeleteForecast;
    this.forecastService
      .deleteRecordInForecast(this.forecastDeleteRequestModel)
      .subscribe((res) => {
        if ((res['status'] = 200)) {
          this.utility.toast.success(res.message);
        } else {
          this.utility.toast.error(res.message);
        }
      });
    setTimeout(() => {
      this.getForecastList();
    }, 1500);
  }

  getForecastTotal() {
    this.foreCastTotalFilterModel = new ForeCastTotalFilterModel();
    if (this.firstselectedRow === undefined && this.forecasts.length > 0) {
      this.firstselectedRow = this.forecasts[0];
    }
    if(this.firstselectedRow!=undefined)
    {
      this.foreCastTotalFilterModel.AM =  this.firstselectedRow.am;
      this.foreCastTotalFilterModel.Branch = this.firstselectedRow.branch;
      this.foreCastTotalFilterModel.Year = this.firstselectedRow.yearNumber;
      this.newYear = this.foreCastTotalFilterModel.Year;
      this.newBranch = this.foreCastTotalFilterModel.Branch;
      this.forecastService
        .getForecastTotal(this.foreCastTotalFilterModel)
        .subscribe((res) => {
          this.amTotal = res.result.aM_Total;
          this.branchTotal = res.result.branch_Total;
        });
    }
    else{
      this.amTotal = 0;
      this.branchTotal = 0;
    }
   
  }
  requestModelForAddUpdate() {
    this.forecastAddUpdateRequestModel = new ForecastAddUpdateRequestModel();
    this.forecastAddUpdateRequestModel.AM = this.selectedEmployee;
    this.selectBranchCode = this.employeeBranch;
    this.forecastAddUpdateRequestModel.Branch = this.selectBranchCode;
    this.forecastAddUpdateRequestModel.YearNumber = parseInt(this.selectedYear);
    this.forecastAddUpdateRequestModel.YearlyGoal = this.forecastForm.yearGoal;
  }
  onDisplayOverwriteForecast() {
    if (this.displayOverwriteForecast) {
      this.displayOverwriteForecast = false;
    } else if (!this.displayOverwriteForecast) {
      this.displayOverwriteForecast = true;
    }
  }
  async onDisplayOverwriteForecastClick(data) {
    this.counter++;
    if (data == 'Yes') {
      this.requestModelForAddUpdate();
      this.forecastAddUpdateRequestModel.MonthNumber = 0;
      await this.forecastService
        .addForecastList(this.forecastAddUpdateRequestModel)
        .then((res) => {
          //this.monthNumber++;
         // if (this.counter > 12) {
            if (res['status'] == 200) {
              this.utility.toast.success(res.message);
            } else {
              this.utility.toast.error(res.message);
            }
          // }
        });
    } else if (data == 'No') {
    //  this.displayOverwriteForecast = false;
    }
    this.displayOverwriteForecast = false;
    this.forecastViewFilterModel.AM = this.selectedEmployee;
    this.resetAddClick();
    setTimeout(() => {
      this.getForecastList();
    }, 1500);

    // if (this.counter <= 12) {
    //   this.displayOverwriteForecast = false;
    //   setTimeout(() => {
    //     this.displayOverwriteForecast = true;
    //   }, 100);
    // } else if (this.counter > 12) {
    //   this.displayOverwriteForecast = false;
    //   this.forecastViewFilterModel.AM = this.selectedEmployee;
    //   this.resetAddClick();
    //   setTimeout(() => {
    //     this.getForecastList();
    //   }, 1500);
    // }
  }
  resetAddClick() {
    this.forecastForm.account_manager = '';
    this.forecastForm.branch = '';
    this.forecastForm.year = '';
    this.forecastForm.yearGoal = '';
    this.employeeBranch = '';
    this.counter = 1;
    this.monthNumber = 1;
  }
  resetMonthForm() {
    this.monthForm.AM = '';
    this.monthForm.Branch = '';
    this.monthForm.YearNumber = '';
    this.monthForm.MonthNumber = '';
    this.monthForm.MonthGoal = '';
  }

  onDisplayAddUpdateRecord() {
    this.displayAddUpdateRecord = !this.displayAddUpdateRecord;
  }
  onDisplayAddUpdateRecordClick() {
    this.forecastService.addForecastList(this.monthForm).then((res) => {
      if (res['status'] == 200) {
        this.utility.toast.success(res.message);
        this.isAddRecord = true;
      } else {
        this.utility.toast.error(res.message);
      }
    });
    this.displayAddUpdateRecord = false;
    this.onDeleteMonthRecord();
    this.forecastViewFilterModel.AM = this.selectedEmployee;
    setTimeout(() => {
      this.getForecastList();
     }, 1500);
  }
  public onFilterEmployees(inputValue: string): void {
    this.employeeData = process(this.tempEmployee, {
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
          }
          
        ],
      },
    }).data;

    this.employees = this.employeeData;
  
  }
  public onFilterBranch(inputValue:string) : void
  {
    this.branchData = process(this.tempBranch, {
      filter: {
        logic: 'or',
        filters: [
          {
            field: 'value',
            operator: 'contains',
            value: inputValue,
          }
          
          
        ],
      },
    }).data;
   this.branches = this.branchData;
   this.branchesData = this.branchData;

  }
  public onFilterYear(inputValue:string) :void
  {
    this.yearData = process(this.tempYear, {
      filter: {
        logic: 'or',
        filters: [
          {
            field: 'year',
            operator: 'contains',
            value: inputValue,
          }
          
          
        ],
      },
    }).data;

    this.years = this.yearData;
    this.yearDropdown - this.yearData;

  }
  public sortEmployeeChange(sort: SortDescriptor[]): void {
    this.sortEmployee = sort;
    this.employeeData = {
      data: orderBy(this.tempEmployee, this.sortEmployee),
      total: this.tempEmployee.length,
    };
    this.employees = this.employeeData.data;
  }
  public sortBranchChange(sort:SortDescriptor[]):void{
    this.sortBranch = sort;
    this.branchData = {
      data: orderBy(this.tempBranch, this.sortBranch),
      total: this.tempBranch.length,
    };
    this.branches = this.branchData.data;
    this.branchesData = this.branchData.data;
  }
  public sortYearChange(sort:SortDescriptor[]):void{
    this.sortYear = sort;
    this.yearData = {
      data: orderBy(this.tempYear, this.sortYear),
      total: this.tempYear.length,
    };
    this.years = this.yearData.data;
    this.yearDropdown = this.yearData.data;
  }

  public sortGridChange(sort:SortDescriptor[]):void{
    this.sortGrid = sort;
    this.forecastData = {
      data: orderBy(this.tempForecast, this.sortGrid),
      total: this.tempForecast.length,
    };
    this.forecasts = this.forecastData.data;
  }
  getdropDownBranch() {
    this.dropdownService.GetBranchList().subscribe((res) => {
          this.branchesData = res;
    });
  }
 
}
