import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SortDescriptor, process, orderBy } from '@progress/kendo-data-query';
import moment from 'moment';
import { EmployeeRequisitionService } from './employee-requisition.service';
import { DropdownService } from '../../../../../app/core/services/dropdown.service';
import {SaveEmployeeRequisitionRequestModel} from '../employee-requisiton/employee-requisition.model';
import { UtilityService } from '../../../../../app/core/services/utility.service';
import { MenuService } from 'src/app/core/helper/menu.service';
@Component({
  selector: 'app-employee-requisiton',
  templateUrl: './employee-requisiton.component.html',
  styleUrls: ['./employee-requisiton.component.scss'],
})
export class EmployeeRequisitonComponent implements OnInit {
  employeeRequisitonForm: FormGroup;
  sort: SortDescriptor[] = [];
  selections: any = [];
  titleSelections: any = [];
  branchSelections: any = [];
  skip: number = 0;
  multiple: any = [];
  isSelectTitleVisible: boolean = false;
  isSelectBranchVisible: boolean = false;
  confirm_title: string = '';
  confirm_message: string = '';
  isConfirmDialogVisible: boolean = false;
  selectTitleData: any = [];
  selectBranchData: any = [];
  titleData: any;
  tempTitle: any;
  gettempTitle: any;
  branchData: any;
  tempBranch: any;
  gettempBranch: any;
  selectTitle:string;
  selectedBranch: string;
  currentUser:string;
  saveEmployeeRequisitionRequestModel:SaveEmployeeRequisitionRequestModel
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
  public sortBranch: SortDescriptor[] = [
    {
      field: 'value',
      dir: 'asc',
    }
  ];
  public sortTitle: SortDescriptor[] = [
    {
      field: 'title',
      dir: 'asc',
    }
  ];
  constructor(
    private formBuilder: FormBuilder,
    public empRequisitionService: EmployeeRequisitionService,
    public dropdownService: DropdownService,
    public utility: UtilityService,public menuService: MenuService
  ) {

    if (localStorage.getItem('isAdmin') == 'true') {

    } else {
      let acc = this.menuService.checkUserViewRights('Employee Requisition');
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
      //this.menuService.checkUserBySubmoduleRights('Employee Requisition');
    }
  }

  ngOnInit(): void {
    this.onInitForm({});
    this.getTitle();
    this.getBranch();
    var usr = JSON.parse(localStorage.getItem('currentUser'));
    if (usr != null) 
    {this.currentUser = usr.userName;
    }
  }

  onInitForm(value) {
    this.employeeRequisitonForm = this.formBuilder.group({
      firstName: value?.firstName || '',
      lastName: value?.lastName || '',
      selectTitle: value?.selectTitle || '',
      selectBranch: value?.selectBranch || '',
      computerphone: value?.computerphone || '',
      drive: value?.drive || false,
      driveCard: value?.driveCard || false,
      systemAccess: value?.systemAccess || false,
      email: value?.email || false,
      projectDate: new Date(),
      specialInstruction: value?.specialInstruction || '',
      PC:value?.PC ||false,
      Laptop:value?.Laptop || false,
      LaptopAccesorries:value?.LaptopAccesorries || false,
      Desktop:value?.Desktop || false,
      CellPhone:value?.CellPhone || false,
      CellCarCharger:value?.CellCharger || false,
      HotSpot:value?.HotSpot || false,
      BusinessCards:value?.BusinessCards || false,
      Uniforms:value?.Uniforms || false,
      FuelCard:value?.FuelCard || false,
      FuelPin:value?.FuelPin || false,
      CreditCard:value?.CreditCard || false,
      DoorCode:value?.DoorCode || false,
      GateCode:value?.GateCode || false,
      Keys: value?.Keys || false,
      MDI:value?.MDI || false,
      Quickbooks:value?.Quickbooks || false,
      Remote:value?.Remote || false,
      EmailMersino:value?.EmailMersino || false,
      EmailGlobal:value?.EmailGlobal || false,
    });
  }

  onRowSelect(event, type) {
    switch (type) {
      case 'select_title':
        this.employeeRequisitonForm.setValue({
          ...this.employeeRequisitonForm.value,
          selectTitle: event.selectedRows[0].dataItem.title,
        
        });
        this.selectTitle = event.selectedRows[0].dataItem.title;
        this.isSelectTitleVisible = false;
        break;
      case 'select_branch':
        this.employeeRequisitonForm.setValue({
          ...this.employeeRequisitonForm.value,
          selectBranch: event.selectedRows[0].dataItem.value,
        });
        this.selectedBranch = event.selectedRows[0].dataItem.code;
        this.isSelectBranchVisible = false;
        break;

      default:
        break;
    }
  }
  onReportTypeChange(type) {}

  onSaveActivity() {
    console.log(this.employeeRequisitonForm.value);
    if (!this.employeeRequisitonForm.get('firstName').value) {
      this.confirm_title = 'Invalid First Name';
      this.confirm_message = 'Please type a First Name for the new employee.';
      this.isConfirmDialogVisible = true;
    } else if (!this.employeeRequisitonForm.get('lastName').value) {
      this.confirm_title = 'Invalid Last Name';
      this.confirm_message = 'Please type a Last Name for the new employee.';
      this.isConfirmDialogVisible = true;
    } 
    else if (!this.employeeRequisitonForm.get('selectTitle').value) {
      this.confirm_title = 'Invalid Title';
      this.confirm_message = 'Please select a title for the new employee.';
      this.isConfirmDialogVisible = true;
    } 
    else if (!this.employeeRequisitonForm.get('selectBranch').value) {
      this.confirm_title = 'Invalid Branch';
      this.confirm_message = 'Please select a Branch for the new employee.';
      this.isConfirmDialogVisible = true;
    } else if (!this.employeeRequisitonForm.get('drive').value) {
      this.confirm_title = 'Invalid Driver';
      this.confirm_message = 'Select type of Driver before submitting.';
      this.isConfirmDialogVisible = true;
    } 
    else if (
      this.employeeRequisitonForm.get('projectDate').value == '' ||
      this.employeeRequisitonForm.get('projectDate').value === undefined || this.employeeRequisitonForm.get('projectDate').value < new Date().getFullYear()
    ) {
      this.confirm_title = 'Invalid Date';
      this.confirm_message = 'Previous year selection now allowed';
      this.isConfirmDialogVisible = true;
    }
    else {
      console.log(this.employeeRequisitonForm.value);
      this.createsaveEmployeeRequisitionRequestModel();
      this.empRequisitionService.saveEmployeeRequisition(this.saveEmployeeRequisitionRequestModel).subscribe(
        (res)=>{
          if(res['status']== 200)
          {
            this.utility.toast.success(res.message);
            this.onHandleOperation('cancel');
          }
          else
          {
            this.utility.toast.error(res.message);
          }
        }
      )
    }
  }

  onHandleOperation(type) {
    console.log(type);
    switch (type) {
      case 'select_title':
        this.isSelectTitleVisible = !this.isSelectTitleVisible;
        this.selectTitleData = this.gettempTitle;
        this.titleSelections = [];
        break;
      case 'select_branch':
        this.isSelectBranchVisible = !this.isSelectBranchVisible;
        this.selectBranchData = this.gettempBranch;
        this.branchSelections = [];
        break;
      case 'cancel':
        this.onInitForm({});
        break;
      case 'submit':
        this.onSaveActivity();
        break;
      case 'confirm':
        this.isConfirmDialogVisible = !this.isConfirmDialogVisible;
        break;
      default:
        break;
    }
  }

  //#region Title
  getTitle() {
    this.empRequisitionService.getTitle().subscribe((res) => {
      this.selectTitleData = res;
      this.tempTitle = res;
      this.gettempTitle = res;
    });
  }
  //#endregion

  //#region Branch
  getBranch() {
    this.dropdownService.GetBranchList().subscribe((res) => {
      this.selectBranchData = res;
      this.tempBranch = res;
      this.gettempBranch = res;
    });
  }
  //#endregion

  //#region Search and Sort Title and Branch
  public onFilterTitle(inputValue: string): void {
    this.titleData = process(this.tempTitle, {
      filter: {
        logic: 'or',
        filters: [
          {
            field: 'title',
            operator: 'contains',
            value: inputValue,
          },
        ],
      },
    }).data;

    this.selectTitleData = this.titleData;
  }
  public onFilterBranch(inputValue: string): void {
    this.branchData = process(this.tempBranch, {
      filter: {
        logic: 'or',
        filters: [
          {
            field: 'value',
            operator: 'contains',
            value: inputValue,
          },
        ],
      },
    }).data;
    this.selectBranchData = this.branchData;
  }
  public sortBranchChange(sort:SortDescriptor[]):void{
    this.sortBranch = sort;
    this.branchData = {
      data: orderBy(this.tempBranch, this.sortBranch),
      total: this.tempBranch.length,
    };
    this.selectBranchData = this.branchData.data;
   
  }
  public sortTitleChange(sort:SortDescriptor[]):void{
    this.sortTitle = sort;
    this.titleData = {
      data: orderBy(this.tempTitle, this.sortTitle),
      total: this.tempTitle.length,
    };
    this.selectTitleData = this.titleData.data;
   
  }
  //#endregion

  //#region Save Employee Requisition 
  getFormValues()
  {
   

    console.log(this.employeeRequisitonForm);
  }
  createsaveEmployeeRequisitionRequestModel()
  {
    this.saveEmployeeRequisitionRequestModel = new SaveEmployeeRequisitionRequestModel();
    this.saveEmployeeRequisitionRequestModel.FirstName = this.employeeRequisitonForm.get('firstName').value; 
    this.saveEmployeeRequisitionRequestModel.LastName =  this.employeeRequisitonForm.get('lastName').value; 
    this.saveEmployeeRequisitionRequestModel.UnionLabour = false ;
    this.saveEmployeeRequisitionRequestModel.ContractLabor = false;
    this.saveEmployeeRequisitionRequestModel.Title =  this.selectTitle;
    this.saveEmployeeRequisitionRequestModel.Inactive =  false;
    this.saveEmployeeRequisitionRequestModel.CreatedBy = this.currentUser;
    this.saveEmployeeRequisitionRequestModel.BranchId = this.selectedBranch;
    this.saveEmployeeRequisitionRequestModel.PC = this.employeeRequisitonForm.get('PC').value;
    this.saveEmployeeRequisitionRequestModel.Laptop = this.employeeRequisitonForm.get('Laptop').value;
    this.saveEmployeeRequisitionRequestModel.LaptopAccesorries = this.employeeRequisitonForm.get('LaptopAccesorries').value;
    this.saveEmployeeRequisitionRequestModel.Desktop = this.employeeRequisitonForm.get('Desktop').value;
    this.saveEmployeeRequisitionRequestModel.CellPhone = this.employeeRequisitonForm.get('CellPhone').value;
    this.saveEmployeeRequisitionRequestModel.CellCarCharger = this.employeeRequisitonForm.get('CellCarCharger').value;
    this.saveEmployeeRequisitionRequestModel.HotSpot = this.employeeRequisitonForm.get('HotSpot').value;
    this.saveEmployeeRequisitionRequestModel.BusinessCards = this.employeeRequisitonForm.get('BusinessCards').value;
    this.saveEmployeeRequisitionRequestModel.Uniforms    = this.employeeRequisitonForm.get('Uniforms').value;
    this.saveEmployeeRequisitionRequestModel.Driver     = this.employeeRequisitonForm.get('drive').value;
    this.saveEmployeeRequisitionRequestModel.FuelCard    = this.employeeRequisitonForm.get('FuelCard').value; 
    this.saveEmployeeRequisitionRequestModel.FuelPin     = this.employeeRequisitonForm.get('FuelPin').value;
    this.saveEmployeeRequisitionRequestModel.CreditCard     = this.employeeRequisitonForm.get('CreditCard').value;
    this.saveEmployeeRequisitionRequestModel.DoorCode     = this.employeeRequisitonForm.get('DoorCode').value;
    this.saveEmployeeRequisitionRequestModel.GateCode = this.employeeRequisitonForm.get('GateCode').value;
    this.saveEmployeeRequisitionRequestModel.Keys     = this.employeeRequisitonForm.get('Keys').value;
    this.saveEmployeeRequisitionRequestModel.MDI     = this.employeeRequisitonForm.get('MDI').value;
    this.saveEmployeeRequisitionRequestModel.Quickbooks = this.employeeRequisitonForm.get('Quickbooks').value;
    this.saveEmployeeRequisitionRequestModel.Remote = this.employeeRequisitonForm.get('Remote').value;
    this.saveEmployeeRequisitionRequestModel.EmailMersino = this.employeeRequisitonForm.get('EmailMersino').value;
    this.saveEmployeeRequisitionRequestModel.EmailGlobal = this.employeeRequisitonForm.get('EmailGlobal').value;
    this.saveEmployeeRequisitionRequestModel.projectDate = this.employeeRequisitonForm.get('projectDate').value;
    this.saveEmployeeRequisitionRequestModel.specialInstruction = this.employeeRequisitonForm.get('specialInstruction').value;
    this.saveEmployeeRequisitionRequestModel.Branch       = this.employeeRequisitonForm.get('selectBranch').value        
    this.saveEmployeeRequisitionRequestModel.computerPhone = this.employeeRequisitonForm.get('computerphone').value;
  }
  //#endregion

  //#region Grid Selection
 
  //#endregion
}
