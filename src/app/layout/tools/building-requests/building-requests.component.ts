
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SortDescriptor ,process, orderBy } from '@progress/kendo-data-query';
import { HRRequests } from '../hr-requests/hr-requests.service';
import {BuildRequestsService} from '../building-requests/building-requests.service';
import {DropdownService} from '../../../core/services/dropdown.service';
import {BuildingRequestsAddRequestModel} from './building-requests.model';
import { UtilityService } from '../../../../app/core/services/utility.service';

@Component({
  selector: 'app-building-requests',
  templateUrl: './building-requests.component.html',
  styleUrls: ['./building-requests.component.scss'],
})
export class BuildingRequestsComponent implements OnInit {
  buildRequestForm:FormGroup;
  isRequestTypeDialogVisible: boolean = false;
  isEmployeeDialogVisible: boolean = false;
  isErrorDialogVisible: boolean = false;
  requestTypes: any = [];
  sort: SortDescriptor[] = [];
  skip: number = 0;
  multiple: boolean = false;
  selections: any = [];
  requestSelection:any=[];
  buildingSelection:any = [];
  error_title: string = '';
  error_msg: string = '';
  Selections:any=[];
  buildingData: any = [];
  building_btn: string = 'Select Building';
  requestData: any = [];
  request_btn: string = 'Select Request Type';
  submit_btn: string = '';
  isBuildingVisible: boolean = false;
  isRequestVisible: boolean = false;
  isSubmitVisible: boolean = false;
  isConfirmationDialog: boolean = false;
  requests: any = [];
  currentUser: string = '';
  currentUserEmail:string = '';
  currentDate: Date = new Date();
  selectedBranch:string = '';
  tempBuilding:any;
  gettempBuilding:any;
  tempRequestTypes:any;
  gettempRequestTypes:any;
  buildRequestData:any;
  filterBuildingData:any;
  selectedRequestType:string = '';
  selectedBuildingType: string = '';
  buildingRequestsAddRequestModel = new BuildingRequestsAddRequestModel();
  requestsColumns: any = [
    {
      Name: 'request',
      isCheck: true,
      Text: 'Request',
      isDisable: false,
      index: 0,
      width: 50,
    }
  ];
  buildingRequestColumns:any=[
    {
      Name: 'value',
      isCheck: true,
      Text: 'Name',
      isDisable: false,
      index: 0,
      width: 50,
    }
  ]
  sortBuilding: SortDescriptor[];

  constructor(   
     private formBuilder: FormBuilder,
     public hrService: HRRequests,
     public buildRequestsService : BuildRequestsService,
     public dropdownService : DropdownService,
     public utility:UtilityService,


  ) {
 
    this.requestData = requestData;
   this.tempRequestTypes = this.requestData;
 
   
  }

  ngOnInit(): void {
    this.onInitBuildingRequestForm();
    this.buildingRequestsAddRequestModel = new BuildingRequestsAddRequestModel();
    var usr = JSON.parse(localStorage.getItem('currentUser'));
    if (usr != null) 
    {this.currentUser = usr.userName;
    this.currentUserEmail = usr.email;
    }
    console.log(usr);
    this.getDefaultLocationByUsername();
    this.getBuildingList();
    this.getBuilding();

    
  }
  onInitBuildingRequestForm() {
    this.buildRequestForm = this.formBuilder.group({
      selectedRequestType: '',
      selectedBuildingType: '',
      message: '',
      openRequest: '',
    
    });
  }
  onSubmitBuildingRequest() {
    // this.isConfirmationDialog = !this.isConfirmationDialog;
    // this.isSubmitVisible = !this.isSubmitVisible;
    let values = this.buildRequestForm.value;
    if (this.selectedRequestType === undefined || this.selectedRequestType == null ||this.selectedRequestType == '' ) {
      this.error_title = 'No request selected';
      this.error_msg = 'Select Request Type';
      this.isErrorDialogVisible = true;
      } else if (this.selectedBuildingType ===  undefined || this.selectedBuildingType == null || this.selectedBuildingType == ''){
        this.error_title = 'Select Building';
        this.error_msg = 'Select site or building.';
        this.isErrorDialogVisible = true;
      } else if (!values.message){
        this.error_title = 'No message found';
        this.error_msg = 'Please include a message with your ticket';
        this.isErrorDialogVisible = true;
      }
      else{
        this.createAddUpdateModel();
        this.buildRequestsService.addBuildingRequest(this.buildingRequestsAddRequestModel).subscribe(
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
        this.getBuildingList();
      }, 1500);
      this.resetSubmitClick();
      }
  }
  onHandleFilters(value) {
    switch (value) {
      case 'buildingrequest':
        this.isBuildingVisible = !this.isBuildingVisible;
        this.buildingSelection = [];
        break;
      case 'request':
        this.isRequestVisible = !this.isRequestVisible;
        this.requestSelection  = []

        break;
      case 'submit':
        this.isSubmitVisible = !this.isSubmitVisible;
        break;
      default:
        break;
      
    }
  }

  onResizeColumn(event) {}

  onRowSelect(event, type) {
    switch (type) {
      case 'request-type':
        this.request_btn = event.selectedRows[0].dataItem.name;
        this.selectedRequestType = event.selectedRows[0].dataItem.name;
        this.isRequestVisible = false;
        this.requestSelection = [];
        break;
      case 'building':
        this.building_btn = event.selectedRows[0].dataItem.value;
        this.selectedBuildingType = event.selectedRows[0].dataItem.value;
        this.isBuildingVisible = false;
        this.buildingSelection = [];
        break;
      default:
        break;
    }
  }

  onSortChange(event) {}

  onReOrderColumns(event) {}

  onSelectionChange(event) {}

  onDataStateChange(event) {}


  getBuildingList()
  {
    
    this.buildRequestsService.getBuildingRequestList(this.currentUser).subscribe(
      (res)=>
      {
        this.requests = res;
      }
    )
  }
 
  getDefaultLocationByUsername()
  {
    this.hrService.getDefaultLocationByUserName(this.currentUser).subscribe(
      (res)=>{
        this.selectedBranch = res.result.defaultLocation;
        console.log(res);
      }
    )
  }
  onHandleDialog(type) {
    switch (type) {
      case 'request-type':
        this.isRequestTypeDialogVisible = !this.isRequestTypeDialogVisible;
        this.requestTypes = this.gettempRequestTypes;
        this.requestSelection = [];
        break;
      case 'building':
        this.isEmployeeDialogVisible = !this.isEmployeeDialogVisible;
        this.buildingData = this.gettempBuilding;
        this.buildingSelection = [];
        break;
      case 'attach':
        document.getElementById('file-explorer').click();
      case 'error':
        this.isErrorDialogVisible = !this.isErrorDialogVisible;
      default:
        break;
    }
  }
  public onFilterBuilding(inputValue: string): void {
    this.filterBuildingData = process(this.tempBuilding, {
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

    this.buildingData = this.filterBuildingData;
  
  }
  public sortBuildingData: SortDescriptor[] = [
    {
      field: 'value',
      dir: 'asc',
    }
  ];

  public sortBuildingChange(sort: SortDescriptor[]): void {
    this.sortBuildingData = sort;
    this.buildingData = {
      data: orderBy(this.tempBuilding, this.sortBuildingData),
      total: this.tempBuilding.length,
    };
    this.buildingData = this.buildingData.data;
  }
  public onFilterRequestsType(inputValue: string): void {
   
    this.buildRequestData = process(this.tempRequestTypes, {
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
   this.requestData = this.buildRequestData;
  
  }
   
  getBuilding()
  {
    this.dropdownService.GetLookupList('BuildingMaintenance').subscribe(
      (res)=>{
        this.buildingData = res;
        this.buildingData = res;
        this.tempBuilding = this.buildingData;
      }
    )
  }
  createAddUpdateModel()
  {
    this.buildingRequestsAddRequestModel = new BuildingRequestsAddRequestModel();
    this.buildingRequestsAddRequestModel.Branch = this.selectedBranch;
    this.buildingRequestsAddRequestModel.UserEmail = this.currentUserEmail;
    this.buildingRequestsAddRequestModel.UserInput = this.buildRequestForm.value.message;
    this.buildingRequestsAddRequestModel.Type = this.selectedRequestType;
    this.buildingRequestsAddRequestModel.Building = this.selectedBuildingType;
    this.buildingRequestsAddRequestModel.UserName = this.currentUser;

  }
  resetSubmitClick()
  {
    this.buildRequestForm = this.formBuilder.group({
      selectedRequestType: '',
      selectedBuildingType: '',
      message: '',
      openRequest: '',
    
    });
    this.buildRequestForm.controls['message'].setValue(''); 
    this.selectedRequestType = '';
    this.selectedBuildingType = '';
   }
  
}

export const requestData = [
  {
    name: 'Build',
  },
  {
    name: 'Electrical',
  },
  {
    name: 'HVAC',
  },
  {
    name: 'Other',
  },
  {
    name:'Plumbing'
  },
  {
    name: 'Repair',
  },
 
];

