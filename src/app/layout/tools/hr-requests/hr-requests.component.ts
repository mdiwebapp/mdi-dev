import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SortDescriptor,process,orderBy } from '@progress/kendo-data-query';
import { DropdownService } from 'src/app/core/services/dropdown.service';
import { usersData } from 'src/data/call-logs-data';
import { HRRequests } from '../hr-requests/hr-requests.service';
import {HRRequestAddRequestModel} from './hr-requests.model';
import { UtilityService } from '../../../../app/core/services/utility.service';
@Component({
  selector: 'app-hr-requests',
  templateUrl: './hr-requests.component.html',
  styleUrls: ['./hr-requests.component.scss'],
})
export class HrRequestsComponent implements OnInit {
  hrRequestForm: FormGroup;
  isRequestTypeDialogVisible: boolean = false;
  isEmployeeDialogVisible: boolean = false;
  isErrorDialogVisible: boolean = false;
  requestTypes: any = [];
  employees: any = [];
  sort: SortDescriptor[] = [];
  skip: number = 0;
  multiple: boolean = false;
  selections: any = [];
  requestTypeSelections:any=[];
  employeeSelections:any=[];
  error_title: string = '';
  error_msg: string = '';
  requests: any = [];
  currentUser: string = '';
  currentUserEmail:string = '';
  currentDate: Date = new Date();
  selectedEmployeeName:string = '';
  selectedEmployeeNumber:number = 0;
  selectedRequestType:string='';
  selectedBranch:string = '';
  hrRequestsAddUpdateModel:HRRequestAddRequestModel;
  employeeData:any;
  tempEmployee:any;
  gettempEmployee:any;
  requestsData:any;
  tempRequestTypes:any;
  gettempRequestTypes:any;
  requestsColumns: any = [
    {
      Name: 'pk',
      isCheck: true,
      Text: 'Ticket No',
      isDisable: false,
      index: 0,
      width: 50,
    },
    {
      Name: 'userInput',
      isCheck: true,
      Text: 'Description',
      isDisable: false,
      index: 0,
      width: 100,
    },
  ];
  requestTypeColumns: any = [
    {
      Name: 'name',
      isCheck: true,
      Text: 'Name',
      isDisable: false,
      index: 0,
      width: 100,
    },
  ];

  employeeColumns: any = [
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
  constructor(
    private formBuilder: FormBuilder,
    public dropdownService: DropdownService,
    public hrService: HRRequests,
    public utility:UtilityService,
  ) {
    this.requestTypes = [
      {
        name: 'Boot Pay',
      },
      {
        name: 'Certifications',
      },
      {
        name: 'Departure',
      },
      {
        name: 'Direct Deposit Change',
      },
      {
        name: 'Equipment',
      },
      {
        name: 'New Hire',
      },
      {
        name:'Other',
      },
      {
        name:'Per Diem'
      },
      {
        name:'Performance'
      },
      {
        name:'Personal Information Change'
      },

      {
        name:'PTO'
      },
      {
        name:'Retro Pay'
      },
      {
        name:'Status Change'
      },
      {
        name:'Training'
      },
      {
        name:'Truck Pay'
      }
    ];
    this.tempRequestTypes = this.requestTypes;
      this.gettempRequestTypes = this.requestTypes;
    
  }

  ngOnInit(): void {
    this.onInitHRRequestForm();
    this.hrRequestsAddUpdateModel = new HRRequestAddRequestModel();
    this.getEmployees();
    var usr = JSON.parse(localStorage.getItem('currentUser'));
    if (usr != null) 
    {this.currentUser = usr.userName;
    this.currentUserEmail = usr.email;
    }
    console.log(usr);
    this.getLocationByUsername();
    this.getHRRequestList();
   
  }

  onInitHRRequestForm() {
    this.hrRequestForm = this.formBuilder.group({
      requestType: '',
      employee: '',
      message: '',
      openRequest: '',
    });
  }

  onSubmitHRRequest() {
    let values = this.hrRequestForm.value;
    if (!values.requestType) {
      this.error_title = 'No message found';
      this.error_msg = 'Select Request Type';
      this.isErrorDialogVisible = true;
    } else if (!values.employee) {
      this.error_title = 'No employee selected';
      this.error_msg = 'Select an Employee';
      this.isErrorDialogVisible = true;
    } else if (!values.message) {
      this.error_title = 'No message found';
      this.error_msg = 'Please include a message with your ticket';
      this.isErrorDialogVisible = true;
      
    }
     else{
      this.createAddUpdateModel();
      this.hrService.addHRRequests(this.hrRequestsAddUpdateModel).subscribe(
        (res)=>{
          if(res['status']=200)
          {
            this.utility.toast.success(res.message);
          }
          else
          {
           this.utility.toast.error(res.message);
          }
        }
      )
      setTimeout(() => {
        this.getHRRequestList();
      }, 1500);
      this.resetSubmitClick();
     }
  }

  onHandleDialog(type) {
    switch (type) {
      case 'request-type':
        this.isRequestTypeDialogVisible = !this.isRequestTypeDialogVisible;
        this.requestTypes = this.gettempRequestTypes;
        this.requestTypeSelections = [];
        break;
      case 'employee':
        this.isEmployeeDialogVisible = !this.isEmployeeDialogVisible;
        this.employees = this.gettempEmployee;
        this.employeeSelections = [];
        break;
      case 'attach':
        document.getElementById('file-explorer').click();
      case 'error':
        this.isErrorDialogVisible = !this.isErrorDialogVisible;
      default:
        break;
    }
  }

  onResizeColumn(event) {}

  onRowSelect(event, type) {
    switch (type) {
      case 'request-type':
        this.hrRequestForm.setValue({
          ...this.hrRequestForm.value,
          requestType: event.selectedRows[0].dataItem.name,
        });
        this.selectedRequestType = event.selectedRows[0].dataItem.name
        this.isRequestTypeDialogVisible = false;
        this.requestTypeSelections = [];
        break;
      case 'employee':
        this.hrRequestForm.setValue({
          ...this.hrRequestForm.value,
          employee: event.selectedRows[0].dataItem.name,
        });
        this.selectedEmployeeName = event.selectedRows[0].dataItem.name
        this.selectedEmployeeNumber = event.selectedRows[0].dataItem.employeeNumber
        this.isEmployeeDialogVisible = false;
        this.employeeSelections = [];
        break;

      default:
        break;
    }
  }

  onSortChange(event) {}

  onReOrderColumns(event) {}

  onSelectionChange(event) {}

  onDataStateChange(event) {}

  getEmployees() {
    this.dropdownService.getAmEmployee().subscribe((res) => {
      this.employees = res;
      this.tempEmployee = res;
      this.gettempEmployee = res;
    });
  }
  getHRRequestList() {
    
    this.hrService.getHRRequestList(this.currentUser).subscribe((res) => {
    this.requests = res;
     
    });
  }
  getLocationByUsername()
  {
    this.hrService.getDefaultLocationByUserName(this.currentUser).subscribe(
      (res)=>{
        this.selectedBranch = res.result.defaultLocation;
        if(res.result.defaultLocation === '%')
        {
          this.selectedBranch = 'SSG';
        }
      }
    )
  }
  createAddUpdateModel()
  {
    this.hrRequestsAddUpdateModel = new HRRequestAddRequestModel();
    this.hrRequestsAddUpdateModel.Branch = this.selectedBranch;
    this.hrRequestsAddUpdateModel.UserEmail = this.currentUserEmail;
    this.hrRequestsAddUpdateModel.UserInput = this.hrRequestForm.value.message;
    this.hrRequestsAddUpdateModel.Category = this.selectedRequestType;
    this.hrRequestsAddUpdateModel.Employee = this.selectedEmployeeName;
    this.hrRequestsAddUpdateModel.EmployeeNum = this.selectedEmployeeNumber;
    this.hrRequestsAddUpdateModel.Attachment = 0;
    this.hrRequestsAddUpdateModel.UserName = this.currentUser;
  }
  resetSubmitClick()
  {
    this.hrRequestForm = this.formBuilder.group({
      requestType: '',
      employee: '',
      message: '',
      openRequest: '',
    });
    this.selectedEmployeeName = '';
    this.selectedRequestType = '';
    this.hrRequestForm.controls['message'].setValue('');
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
  public onFilterRequestsType(inputValue: string): void {
    this.requestsData = process(this.tempRequestTypes, {
      filter: {
        logic: 'or',
        filters: [
          {
            field: 'name',
            operator: 'contains',
            value: inputValue,
          }
          
        ],
      },
    }).data;

    this.requestTypes = this.requestsData;
  
  }
  public sortEmployeeChange(sort: SortDescriptor[]): void {
    this.sortEmployee = sort;
    this.employeeData = {
      data: orderBy(this.tempEmployee, this.sortEmployee),
      total: this.tempEmployee.length,
    };
    this.employees = this.employeeData.data;
  }
  
}
