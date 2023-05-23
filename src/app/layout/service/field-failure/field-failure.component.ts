import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageChangeEvent } from '@progress/kendo-angular-grid';
import { process, orderBy, SortDescriptor } from '@progress/kendo-data-query';
import { PaginationWithSortRequest } from 'src/app/core/models/pagination.model';
import { PagerService } from 'src/app/core/services/pager.service';
import { FieldFailureService } from '../../../../app/layout/service/field-failure/field-failure.service';
import { FieldFailureModel } from '../field-failure/field-failure.model';
import { UtilityService } from 'src/app/core/services/utility.service';
import { DropdownService } from 'src/app/core/services/dropdown.service';
import { MenuService } from 'src/app/core/helper/menu.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-field-failure',
  templateUrl: './field-failure.component.html',
  styleUrls: ['./field-failure.component.scss'],
})
export class FieldFailureComponent implements OnInit {
  Id: number;
  fieldfailureForm: FormGroup;
  disable: boolean = true;
  isDisable: boolean = true;
  sort: SortDescriptor[] = [];
  selections: any = [0];
  projectselections: any = [];
  accountmanagerselections: any = [];
  typeOffailureselections: any = [];
  invNumberselections: any = [];
  phototgraphsTakenbyselections: any = [];
  fieldSort: SortDescriptor[] = [];
  isCreatable: boolean = false;
  isEditable: boolean = false;
  selectedField: any = null;
  isProjectVisible: boolean = false;
  isaccountManagerVisible: boolean = false;
  isTypeOfFailureVisible: boolean = false;
  isInvNumberVisible: boolean = false;
  isIfYesWhomVisible: boolean = false;
  isTimeOfIncident: boolean = false;
  public steps: any = { hour: 2, minute: 15, second: 30, millisecond: 25 };
  public value: Date = new Date(2000, 2, 10, 10, 30);
  tempProjectdata: any = [];
  tempInvNumberdata: any = [];
  tempAccountManagerdata: any = [];
  tempphotographsTakenbyData: any = [];
  valueoftimeofIncident: any;
  public photographsTakenbyData: any = [];
  projectdetailvalue: any;
  accountManagervalue: any;
  failureTypevalue: any;
  photographstakenbyvalue: any;
  invNumbervalue: any;
  timeofIncidentvalue: any;
  isPhotographstakenbyvisible: boolean = false;
  selectedId: any;
  isProjectSelected: boolean = true;
  disableReason: boolean = true;
  isNotfiedFailure: boolean = false;
  public fieldFailuresort: SortDescriptor[] = [
    {
      field: 'ff',
      dir: 'asc',
    },
    {
      field: 'fleetNum',
      dir: 'asc',
    },
    {
      field: 'branch',
      dir: 'asc',
    },
  ];

  public defaultFiedFailureSort : SortDescriptor[] = [
    {
      field: 'ff',
      dir: 'desc',
    }
  ]

  public invNumbersort: SortDescriptor[] = [
    {
      field: 'invNumber',
      dir: 'asc',
    },
    {
      field: 'description',
      dir: 'asc',
    },
  ];

  public photographsTakenbysort: SortDescriptor[] = [
    {
      field: 'id',
      dir: 'asc',
    },
    {
      field: 'value',
      dir: 'asc',
    },
  ];

  public totalData = 0;
  public totalInvNumberData = 0;
  public pageSize = 100;
  public invNumberpageSize = 100;
  isPagesizeChange: boolean = false;
  isInvNumberPagesizeChange: boolean = false;
  request = new PaginationWithSortRequest<any>();
  invNumberrequest = new PaginationWithSortRequest<any>();
  public skip = 0;
  public invNumberskip = 0;
  pageSizeList: any = [
    { id: 0, value: 100 },
    { id: 0, value: 300 },
    { id: 0, value: 500 },
  ];
  multiple: boolean = false;
  searchText: string = '';
  invNumbersearchText: string = '';
  visible: boolean;
  public fieldfailureData: any[];

  fieldfailurecolumns = [
    {
      Name: 'ff',
      isCheck: true,
      Text: 'FF',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'fleetNumdf',
      isCheck: true,
      Text: 'Fleet Num',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'branchName',
      isCheck: true,
      Text: 'Branch',
      isDisable: false,
      index: 0,
      width: 100,
    },
  ];

  public projectdata: any[];
  // projectdata = [
  //   {
  //     type: '16936',
  //     name: 'C & C Pumps - Consignment',
  //   },
  //   {
  //     type: '21035',
  //     name: 'NORMco - Consignment',
  //   },
  //   {
  //     type: '26492',
  //     name: 'ICD - Pond 7 - Rental',
  //   },
  // ];
  accountManagercolumns = [
    {
      Name: 'employeeNumber',
      isCheck: true,
      Text: 'EE',
      isDisable: false,
      index: 0,
      width: 100,
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

  photographsTakenbyDataColumns = [
    {
      Name: 'eeid',
      isCheck: true,
      Text: 'Id',
      isDisable: false,
      index: 0,
      width: 100,
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

  projectDataColumns = [
    {
      Name: 'jobNumber',
      isCheck: true,
      Text: 'Job Number',
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
  ];

  invNumberDataColumns = [
    {
      Name: 'invNumber',
      isCheck: true,
      Text: 'Inv Number',
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
  public accountManagerData: any = [];
  public accountManagersort: SortDescriptor[] = [
    {
      field: 'employeeNumber',
      dir: 'asc',
    },
    {
      field: 'name',
      dir: 'asc',
    },
  ];
  typeOfFailureData = [
    {
      name: 'Engine related',
    },
    {
      name: 'Other',
    },
    {
      name: 'Priming related',
    },
    {
      name: 'Application related',
    },
    {
      name: 'Pump related',
    },
  ];
  temptypeOfFailureData = [
    {
      name: 'Engine related',
    },
    {
      name: 'Other',
    },
    {
      name: 'Priming related',
    },
    {
      name: 'Application related',
    },
    {
      name: 'Pump related',
    },
  ];
  public invNumberData: any = [];

  filterProject: string = '';
  filterAccountManager: string = '';
  filterFailureType: string = '';
  filterPhotographstakenby: string = '';
  filterBranch: string = 'All';
  selectedBranch: any;
  branchList: any = [];
  // invNumberData = [
  //   {
  //     type: '15019',
  //     name: '150 KVA GENERATOR',
  //   },
  //   {
  //     type: '2H2-027',
  //     name: '2.5HP SUBMERSIBLE PUMP',
  //   },
  //   {
  //     type: '3G5-36',
  //     name: '5HP SUBMERSIBLE PUMP',
  //   },
  // ];
  fieldFailurepageSize: number = 100;
  fieldFailurestartPage: number = 0;
  invpageSize: number = 100;
  invstartPage: number = 0;
  constructor(
    private formBuilder: FormBuilder,
    private service: FieldFailureService,
    private utility: UtilityService,
    public menuService: MenuService,
    private dropdownService: DropdownService
  ) {
    if (localStorage.getItem('isAdmin') == 'true') {
    } else {
      let acc = this.menuService.checkUserViewRights('Field Failure');
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
      this.menuService.checkUserBySubmoduleRights('Field Failure');
    }
  }
  ngOnInit(): void {
    this.filterBranch = 'ALL';
    this.selectedBranch = 'ALL';
    this.onInitFieldFailureForm({});
    // this.loadProjectData();
    // // this.loadInvNumberData();
    // this.loadAccountManagerData();
    this.loadPhotographsTakenByData();
    this.loadBranchList();
    this.loadFieldFailureData();
    //this.selectedField = this.fieldfailureData[0];
    // this.onInitFieldFailureForm(this.fieldfailureData[0]);
  }
  onInitFieldFailureForm(value) {
    this.fieldfailureForm = this.formBuilder.group({
      Id: this.Id,
      projectdetail: [
        value?.projectNumber && value?.projectName
          ? value?.projectNumber + '-' + value?.projectName
          : '',
        [Validators.required],
      ],
      projectNumber: [value?.projectNumber, [Validators.required]],
      projectName: [value?.projectName, [Validators.required]],
      accountManager: [value?.projectManager || '', [Validators.required]],
      typeOfFailure: [value?.failureType || '', [Validators.required]],
      invNumber: [value?.fleetNumber || '', [Validators.required]],
      timeOfIncident: [value?.timeOfIncident || '', [Validators.required]],
      ifYesWhom: [value?.photosBy || '', [Validators.required]],
      describeofpromblem: [value?.description || '', [Validators.required]],
      findOutAboutthePromblem: [value?.how || '', [Validators.required]],
      condition: value?.repaired || '',
      photographtaken: [
        value?.photosTaken ? 'yes' : 'no' || '',
        [Validators.required],
      ],
      dateOfIncident: [
        value?.dateOfIncident ? new Date(value?.dateOfIncident) : '',
        [Validators.required],
      ],
      ifFieldFailure: value?.notFailure || false,
      fieldFailureReason: [
        value?.notFailureReason || '',
        [Validators.required],
      ],
      projectLocation: value?.jobCity + ', ' + value?.jobState,

      // sort: value?.sort || '',
    });
    if (value.timeOfIncident != undefined) {
      var year = new Date(value?.dateOfIncident).getFullYear();
      var month = new Date(value?.dateOfIncident).getMonth();
      var date = new Date(value?.dateOfIncident).getDate();
      if (value.timeOfIncident.includes('PM')) {
        var x = new Date(
          year,
          month,
          date,
          value.timeOfIncident.split(':')[0],
          value.timeOfIncident.split(':')[1].split(' ')[0]
        );
        this.valueoftimeofIncident = new Date(
          x.setTime(x.getTime() + 12 * 60 * 60 * 1000)
        );
      } else {
        this.valueoftimeofIncident = new Date(
          year,
          month,
          date,
          value.timeOfIncident.split(':')[0],
          value.timeOfIncident.split(':')[1].split(' ')[0]
        );
      }
    } else {
      this.valueoftimeofIncident = '';
    }

    if (value?.photosTaken) {
      this.isPhotographstakenbyvisible = true;
      this.fieldfailureForm
        .get('ifYesWhom')
        .setValidators([Validators.required]);
      this.fieldfailureForm.get('ifYesWhom').updateValueAndValidity();
    } else {
      this.isPhotographstakenbyvisible = false;
      this.fieldfailureForm.get('ifYesWhom').clearValidators();
      this.fieldfailureForm.get('ifYesWhom').updateValueAndValidity();
    }
    if (value?.notFailure) {
      this.fieldfailureForm.controls['fieldFailureReason'].setValidators([
        Validators.required,
      ]);
      this.fieldfailureForm.get('fieldFailureReason').updateValueAndValidity();
      this.isNotfiedFailure = true;
      //this.fieldfailureForm.get('fieldFailureReason').setValidators([Validators.required]);
    } else {
      this.fieldfailureForm.controls['fieldFailureReason'].clearValidators();
      this.fieldfailureForm.get('fieldFailureReason').updateValueAndValidity();
      this.isNotfiedFailure = false;
      // this.fieldfailureForm.get('fieldFailureReason').clearValidators();
    }
  }
  //

  onResizeColumn(event) {}

  onReOrderColumns(event) {}

  onDataStateChange(event) {}

  onSelectionChange(id,branch) {
    this.visible = false;
    this.visible = true;
    this.disable = true;
    this.disableReason = true;
    if (this.disable) {
      this.service
        .GetFieldFailureDetail(id)
        .subscribe(
          (x) => {
            this.Id = id;
            this.selectedId = id;
            this.onInitFieldFailureForm(x.result);
            this.projectdetailvalue =
              x.result.projectNumber + '-' + x.result.projectName;
            this.accountManagervalue = x.result.projectManagerName;
            this.failureTypevalue = x.result.failureType;
            this.photographstakenbyvalue = x.result.photosBy;
            this.invNumbervalue = x.result.fleetNumber;
            this.timeofIncidentvalue = x.result.timeOfIncident;
            this.projectselections = [];
            this.accountmanagerselections = [];
            this.typeOffailureselections = [];
            this.invNumberselections = [];
            this.phototgraphsTakenbyselections = [];
            this.isTimeOfIncident = false;
            this.selectedBranch = branch;
            this.loadAccountManagerData();
            this.loadProjectData();
            if (x.result.projectNumber > 0) {
              this.isProjectSelected = true;
              this.loadInvNumberData();
            }
            this.visible = true;
            this.visible = false;
          },
          (error) => {
            this.visible = true;
            this.visible = false;
          }
        );
    } else {
      this.visible = true;
      this.visible = false;
    }
  }

  onSortChange(fieldFailuresort: SortDescriptor[]) {
    this.fieldFailuresort = fieldFailuresort;
    this.loadFieldFailureData();
  }

  onSortingRadioChange(value) {
    //this.fieldfailureForm.controls['sort'].setValue(value);
    if (value == 'yes') {
      this.isPhotographstakenbyvisible = true;
      this.fieldfailureForm
        .get('ifYesWhom')
        .setValidators([Validators.required]);
      this.fieldfailureForm.get('ifYesWhom').updateValueAndValidity();
      var photographtakenby = this.fieldfailureForm.value.ifYesWhom;
      if (photographtakenby == '' || photographtakenby == null) {
        this.photographstakenbyvalue = 'Select';
      }
    } else {
      this.isPhotographstakenbyvisible = false;
      this.fieldfailureForm.get('ifYesWhom').clearValidators();
      this.fieldfailureForm.get('ifYesWhom').updateValueAndValidity();
    }
  }

  onchangeifFieldFailure() {
    var iffieldfailure = this.fieldfailureForm.value.ifFieldFailure;
    if (iffieldfailure) {
      this.fieldfailureForm.controls['fieldFailureReason'].setValidators([
        Validators.required,
      ]);
      this.fieldfailureForm.get('fieldFailureReason').updateValueAndValidity();
      this.disableReason = false;
    } else if (!iffieldfailure) {
      this.fieldfailureForm.get('fieldFailureReason').clearValidators();
      this.fieldfailureForm.get('fieldFailureReason').updateValueAndValidity();
      this.disableReason = true;
    }
  }

  onRowSelect(event, type) {
    switch (type) {
      case 'project':
        this.fieldfailureForm.setValue({
          ...this.fieldfailureForm.value,
          projectdetail: `${event.selectedRows[0].dataItem.job}`,
          projectNumber: `${event.selectedRows[0].dataItem.jobNumber}`,
          projectName: `${event.selectedRows[0].dataItem.job}`,
          projectLocation:
            `${event.selectedRows[0].dataItem.jobCity}` +
            ', ' +
            `${event.selectedRows[0].dataItem.jobState}`,
        });
      
        this.projectdetailvalue = `${event.selectedRows[0].dataItem.jobNumber} - ${event.selectedRows[0].dataItem.job}`;
        this.isProjectVisible = false;
        this.invNumbersearchText = '';
        this.loadInvNumberData();
        break;
      case 'account_manager':
        this.fieldfailureForm.setValue({
          ...this.fieldfailureForm.value,
          accountManager: event.selectedRows[0].dataItem.employeeNumber,
        });
        this.accountManagervalue = event.selectedRows[0].dataItem.name;
        this.isaccountManagerVisible = false;
        break;
      case 'type_failure':
        this.fieldfailureForm.setValue({
          ...this.fieldfailureForm.value,
          typeOfFailure: event.selectedRows[0].dataItem.name,
        });
        this.failureTypevalue = event.selectedRows[0].dataItem.name;
        this.isTypeOfFailureVisible = false;
        break;
      case 'if_whom':
        this.fieldfailureForm.setValue({
          ...this.fieldfailureForm.value,
          ifYesWhom: event.selectedRows[0].dataItem.name,
        });
        this.photographstakenbyvalue = event.selectedRows[0].dataItem.name;
        this.isIfYesWhomVisible = false;
        break;
      case 'inv_number':
        this.fieldfailureForm.setValue({
          ...this.fieldfailureForm.value,
          invNumber: event.selectedRows[0].dataItem.invNumber,
        });
        this.invNumbervalue = event.selectedRows[0].dataItem.invNumber;
        this.isInvNumberVisible = false;
        break;
      default:
        break;
    }
  }

  resetDropdownvalues() {
    this.projectdetailvalue = 'Select Project';
    this.accountManagervalue = 'Select AM';
    this.failureTypevalue = 'Select Failure Type';
    this.photographstakenbyvalue = 'Select';
    this.invNumbervalue = 'Select Inv Number';
    this.timeofIncidentvalue = 'Select Time';
    this.valueoftimeofIncident = '';
    this.projectselections = [];
    this.accountmanagerselections = [];
    this.typeOffailureselections = [];
    this.invNumberselections = [];
    this.phototgraphsTakenbyselections = [];
  }

  onHandleInvNumberOperation() {
    if (this.fieldfailureForm.value.projectNumber > 0) {
      this.isProjectSelected = true;
      this.isInvNumberVisible = !this.isInvNumberVisible;
    } else {
      this.isProjectSelected = false;
    }
  }

  onHandleOperation(type) {
    switch (type) {
      case 'new':
        // this.isCreatable = !this.isCreatable;
        // this.isEditable = !this.isEditable;
        this.isCreatable = true;
        this.isEditable = false;
        this.disable = false;
        this.disableReason = true;
        this.fieldfailureForm.reset();
        this.Id = null;
        this.resetDropdownvalues();
        this.isPhotographstakenbyvisible = false;
        this.fieldfailureForm.get('ifYesWhom').clearValidators();
        this.fieldfailureForm.get('ifYesWhom').updateValueAndValidity();
        this.fieldfailureForm.get('fieldFailureReason').clearValidators();
        this.fieldfailureForm.get('fieldFailureReason').updateValueAndValidity();
        this.invNumberData = [];
        this.tempInvNumberdata = [];
        this.selectedBranch = this.filterBranch;
        this.loadAccountManagerData();
        this.loadProjectData();
        break;
      case 'edit':
        this.disable = false;
        this.isCreatable = false;
        this.isEditable = true;
        if (this.isNotfiedFailure) {
          this.disableReason = false;
        } else {
          this.disableReason = true;
        }
        // this.isCreatable = !this.isCreatable;
        // this.isEditable = !this.isEditable;
        break;
      case 'cancel':
        this.isCreatable = !this.isCreatable;
        this.isEditable = !this.isEditable;
        this.disable = true;
        this.disableReason = true;
        this.isTimeOfIncident = false;
        if (this.Id == null) {
          this.fieldfailureForm.reset();
          this.resetDropdownvalues();
        }
        if (this.selectedId > 0) {
          this.reloadFormonCancel(this.selectedId);
        }
        break;
      case 'save':
        // this.isCreatable = !this.isCreatable;
        // this.isEditable = !this.isEditable;
        this.disable = true;
        this.disableReason = true;
        break;
      case 'project':
        this.isProjectVisible = !this.isProjectVisible;
        break;
      case 'account_manager':
        this.isaccountManagerVisible = !this.isaccountManagerVisible;
        break;
      case 'type_of_failure':
        this.isTypeOfFailureVisible = !this.isTypeOfFailureVisible;
        break;
      case 'inv_number':
        this.isInvNumberVisible = !this.isInvNumberVisible;
        break;
      case 'if_whom':
        this.isIfYesWhomVisible = !this.isIfYesWhomVisible;
        break;
      case 'time_incident':
        this.isTimeOfIncident = !this.isTimeOfIncident;
        break;
      default:
        break;
    }
  }
  // gridSelection(event) {
  //   console.log(event);
  //   this.selectedId = event.type;
  //   this.selectedName = event.name;
  //   this.fieldfailureForm.
  // }

  reInitFieldFailureForm() {
    this.visible = false;
    this.visible = true;
    this.service.GetFieldFailureDetail(this.fieldfailureData[0].ff).subscribe(
      (x) => {
        this.Id = this.fieldfailureData[0].ff;
        this.onInitFieldFailureForm(x.result);
        this.projectdetailvalue =
          x.result.projectNumber + '-' + x.result.projectName;
        this.accountManagervalue = x.result.projectManagerName;
        this.failureTypevalue = x.result.failureType;
        this.photographstakenbyvalue = x.result.photosBy;
        this.invNumbervalue = x.result.fleetNumber;
        this.timeofIncidentvalue = x.result.timeOfIncident;
        this.selections = [0];
        this.visible = true;
        this.visible = false;
      },
      (error) => {
        this.visible = true;
        this.visible = false;
      }
    );
  }

  loadFieldFailureData() {
    this.visible = false;
    this.visible = true;
    var filter = { searchText: this.searchText, branch: this.filterBranch };
    this.totalData = 0;
    this.request.pageSize = this.pageSize;
    if (this.searchText) {
      this.request.pageNumber = 1;
    } else {
      this.request.pageNumber = this.fieldFailurestartPage + 1;
    }

    // if(this.isPagesizeChange) {
    //   this.request.pageNumber = this.pagerService.end -1 ;
    // }
    this.request.sortColumn = this.fieldFailuresort[0].field;
    this.request.sortDesc =
      this.fieldFailuresort[0].dir == 'desc' ? true : false;
    this.request.request = filter;

    this.service.GetFieldFailureData(this.request).subscribe((res) => {
      if (res.totalRecords > 0) {
        this.fieldfailureData = res.data;
        this.totalData = res.totalRecords;
        this.service.GetFieldFailureDetail(res.data[0].ff).subscribe(
          (x) => {
            this.Id = res.data[0].ff;
            this.selectedId = res.data[0].ff;
            this.onInitFieldFailureForm(x.result);
            this.projectdetailvalue =
              x.result.projectNumber + '-' + x.result.projectName;
            this.accountManagervalue = x.result.projectManagerName;
            this.failureTypevalue = x.result.failureType;
            this.photographstakenbyvalue = x.result.photosBy;
            this.invNumbervalue = x.result.fleetNumber;
            this.timeofIncidentvalue = x.result.timeOfIncident;
            this.selectedBranch = x.result.branch;
            this.loadAccountManagerData();
            this.loadProjectData();
            if (x.result.projectNumber > 0) {
              this.isProjectSelected = true;
              this.loadInvNumberData();
            }
            // this.selections = [0];
            this.visible = true;
            this.visible = false;
          },
          (error) => {
            this.visible = true;
            this.visible = false;
          }
        );
      } else {
        this.fieldfailureData = [];
        this.totalData = res.totalRecords;
        this.visible = true;
        this.visible = false;
      }
    });
  }

  public onPageChange(e: PageChangeEvent): void {
    this.skip = e.skip;
    this.pageSize = e.take;
    this.fieldFailurestartPage = this.skip == 0 ? 0 : this.skip / this.pageSize;
    // this.filterCollection.pageSize = this.pageSize;
    // this.tempPageNo = this.pagerService.start;

    this.loadFieldFailureData();
  }

  onPageSizechange(e) {
    this.pageSize = e;
    this.fieldFailurestartPage = Math.floor(
      this.skip == 0 ? 0 : this.skip / this.pageSize
    );
    this.isPagesizeChange = true;
    this.loadFieldFailureData();
  }

  onFilter(value): void {
    this.searchText = value;
    this.skip = 0;
    this.fieldFailurestartPage = 0;
    this.selections = [0];
    this.loadFieldFailureData();
  }

  loadProjectData() {
    this.visible = false;
    this.visible = true;
    var branch = this.selectedBranch;
    this.service.GetProjectData(branch).subscribe(
      (res) => {
        if (res.length > 0) {
          this.projectdata = res;
          this.tempProjectdata = res;
          this.visible = true;
          this.visible = false;
        } else {
          this.visible = true;
          this.visible = false;
        }
      },
      (error) => {
        this.visible = true;
        this.visible = false;
      }
    );
  }

  searchProjectData(data: any) {
    this.filterProject = data;
    this.projectdata = process(this.tempProjectdata, {
      filter: {
        logic: 'or',
        filters: [
          {
            field: 'job',
            operator: 'contains',
            value: data,
          },
          {
            field: 'jobNumber',
            operator: 'contains',
            value: data,
          },
        ],
      },
    }).data;
  }

  // loadInvNumberData() {
  //   this.visible = false;
  //   this.visible = true;
  //   var filter = {searchText: this.invNumbersearchText}
  //   this.totalInvNumberData = 0;

  //   this.invNumberrequest.pageSize = this.invNumberPagerService.pageSize;
  //   if (this.invNumbersearchText) {
  //     this.invNumberrequest.pageNumber = 1;
  //   } else {
  //     this.invNumberrequest.pageNumber = this.invNumberPagerService.start + 1;
  //   }

  //   // if(this.isPagesizeChange) {
  //   //   this.request.pageNumber = this.pagerService.end -1 ;
  //   // }
  //   this.invNumberrequest.sortColumn = this.invNumbersort[0].field;
  //   this.invNumberrequest.sortDesc = this.invNumbersort[0].dir == 'desc' ? true : false;
  //   this.invNumberrequest.request = filter
  //   this.service.GetInvnumberData(this.invNumberrequest).subscribe(res => {
  //     if(res.totalRecords>0) {
  //     this.invNumberData = res.data;
  //     this.tempInvNumberdata = res;
  //     this.totalInvNumberData = res.totalRecords;
  //     this.visible = true;
  //     this.visible = false;
  //     }
  //     else {
  //       this.visible = true;
  //     this.visible = false;
  //    }
  //   },(error) => {
  //     this.visible=true;
  //     this.visible=false;
  //   })
  // }

  public onInvNumberPageChange(e: PageChangeEvent): void {
    this.invNumberskip = e.skip;
    this.invNumberpageSize = e.take;
    this.invstartPage =
      this.invNumberskip == 0 ? 0 : this.invNumberskip / this.invNumberpageSize;
    // this.filterCollection.pageSize = this.pageSize;
    // this.tempPageNo = this.pagerService.start;

    this.loadInvNumberData();
  }

  oninvNumberPageSizechange(e) {
    this.invNumberpageSize = e;
    this.invstartPage = Math.floor(
      this.invNumberskip == 0 ? 0 : this.invNumberskip / this.invNumberpageSize
    );
    this.isPagesizeChange = true;
    this.loadInvNumberData();
  }

  onInvNumberFilter(value: any) {
    this.invNumbersearchText = value;
    this.loadInvNumberData();
  }

  loadAccountManagerData() {
    this.visible = false;
    this.visible = true;
    var branch = this.selectedBranch;
    this.service.GeAccountManagerData(branch).subscribe(
      (res) => {
        if (res.length > 0) {
          this.accountManagerData = res;
          this.tempAccountManagerdata = res;
          this.visible = true;
          this.visible = false;
        } else {
          this.visible = true;
          this.visible = false;
        }
      },
      (error) => {
        this.visible = true;
        this.visible = false;
      }
    );
  }

  onAccountManagerSortChange(sort: SortDescriptor[]) {
    this.accountManagersort = sort;
    this.accountManagerData = orderBy(
      this.tempAccountManagerdata,
      this.accountManagersort
    );
  }

  onAccountManagerFilter(data: any) {
    this.filterAccountManager = data;
    this.accountManagerData = process(this.tempAccountManagerdata, {
      filter: {
        logic: 'or',
        filters: [
          {
            field: 'employeeNumber',
            operator: 'contains',
            value: data,
          },
          {
            field: 'name',
            operator: 'contains',
            value: data,
          },
        ],
      },
    }).data;
  }

  loadPhotographsTakenByData() {
    this.visible = false;
    this.visible = true;
    this.service.GetPhotographsTakenByData().subscribe(
      (res) => {
        if (res.result.length > 0) {
          this.photographsTakenbyData = res.result;
          this.tempphotographsTakenbyData = res.result;
          this.visible = true;
          this.visible = false;
        } else {
          this.visible = true;
          this.visible = false;
        }
      },
      (error) => {
        this.visible = true;
        this.visible = false;
      }
    );
  }

  onPhotographstakebySortChange(sort: SortDescriptor[]) {
    this.photographsTakenbysort = sort;
    this.photographsTakenbyData = orderBy(
      this.tempphotographsTakenbyData,
      this.photographsTakenbysort
    );
  }

  onPhotographstakenbyFilter(data: any) {
    this.filterPhotographstakenby = data;
    this.photographsTakenbyData = process(this.tempphotographsTakenbyData, {
      filter: {
        logic: 'or',
        filters: [
          {
            field: 'eeid',
            operator: 'contains',
            value: data,
          },
          {
            field: 'name',
            operator: 'contains',
            value: data,
          },
        ],
      },
    }).data;
  }

  handleTimeofIncident(time: any) {
    this.fieldfailureForm.setValue({
      ...this.fieldfailureForm.value,
      timeOfIncident:
        time.getHours() > 12
          ? time.getHours() - 12 + ':' + time.getMinutes() + ' PM'
          : time.getHours() + ':' + time.getMinutes() + ' AM',
    });
  }

  onFailureTypeFilter(data: any) {
    this.filterFailureType = data;
    this.typeOfFailureData = process(this.temptypeOfFailureData, {
      filter: {
        logic: 'or',
        filters: [
          {
            field: 'name',
            operator: 'contains',
            value: data,
          },
        ],
      },
    }).data;
  }

  submitFieldFailureForm() {
    if (this.fieldfailureForm.invalid) {
      this.isProjectSelected = true;
      this.fieldfailureForm.markAllAsTouched();
      return false;
    }
    this.visible = false;
    this.visible = true;
    const field_failure = new FieldFailureModel();
    field_failure.id = this.fieldfailureForm.value.Id;
    field_failure.userName = JSON.parse(
      localStorage.getItem('currentUser')
    ).userName;
    field_failure.branch = this.filterBranch;
    field_failure.failureType = this.fieldfailureForm.value.typeOfFailure;
    field_failure.projectName = this.fieldfailureForm.value.projectName;
    field_failure.projectNumber = this.fieldfailureForm.value.projectNumber;
    field_failure.projectLocation = this.fieldfailureForm.value.project;
    field_failure.projectManager = this.fieldfailureForm.value.accountManager;
debugger;
    field_failure.dateOfIncident = this.fieldfailureForm.value.dateOfIncident;
    field_failure.photosTaken =
      this.fieldfailureForm.value.photographtaken == 'yes' ? true : false;
    field_failure.photosBy = this.fieldfailureForm.value.ifYesWhom;
    field_failure.fleetNumber = this.fieldfailureForm.value.invNumber;
    field_failure.description = this.fieldfailureForm.value.describeofpromblem;
    field_failure.how = this.fieldfailureForm.value.findOutAboutthePromblem;
    field_failure.notFailure =
      this.fieldfailureForm.value.ifFieldFailure == null
        ? false
        : this.fieldfailureForm.value.ifFieldFailure;
    field_failure.notFailureReason =
      this.fieldfailureForm.value.fieldFailureReason;
    field_failure.repaired = this.fieldfailureForm.value.condition;
    field_failure.projectLocation = this.fieldfailureForm.value.projectLocation;
    if (this.valueoftimeofIncident.getHours() > 12) {
      field_failure.timeOfIncident =
        this.valueoftimeofIncident.getHours() -
        12 +
        ':' +
        this.valueoftimeofIncident.getMinutes() +
        ' PM';
    } else {
      field_failure.timeOfIncident =
        this.valueoftimeofIncident.getHours() +
        ':' +
        this.valueoftimeofIncident.getMinutes() +
        ' AM';
    }
    if (this.isPhotographstakenbyvisible == false) {
      field_failure.photosBy = null;
    }

    var days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    field_failure.dayOfWeek = days[field_failure.dateOfIncident.getDay()];
    if (field_failure.id > 0) {
      this.service.UpdateFieldFailureDetail(field_failure).subscribe(
        (res) => {
          if (res['status'] == 200) {
            this.visible = true;
            this.visible = false;
            this.utility.toast.success(res['message']);
            this.valueoftimeofIncident = '';
            this.disable = true;
            this.disableReason = true;
            this.projectselections = [];
            this.accountmanagerselections = [];
            this.typeOffailureselections = [];
            this.invNumberselections = [];
            this.phototgraphsTakenbyselections = [];
            this.isTimeOfIncident = false;
            this.timeofIncidentvalue = field_failure.timeOfIncident;
            var year = new Date(field_failure?.dateOfIncident).getFullYear();
            var month = new Date(field_failure?.dateOfIncident).getMonth();
            var date = new Date(field_failure?.dateOfIncident).getDate();
            if (field_failure.timeOfIncident.includes('PM')) {
              var x = new Date(
                year,
                month,
                date,
                this.timeofIncidentvalue.split(':')[0],
                this.timeofIncidentvalue.split(':')[1].split(' ')[0]
              );
              this.valueoftimeofIncident = new Date(
                x.setTime(x.getTime() + 12 * 60 * 60 * 1000)
              );
            } else {
              this.valueoftimeofIncident = new Date(
                year,
                month,
                date,
                this.timeofIncidentvalue.split(':')[0],
                this.timeofIncidentvalue.split(':')[1].split(' ')[0]
              );
            }
            this.onSelectionChange(this.fieldfailureForm.value.Id,field_failure.branch)
          } else {
            this.visible = true;
            this.visible = false;
            this.utility.toast.error(res['message']);
            this.valueoftimeofIncident = '';
            this.disable = true;
            this.disableReason = true;
            this.projectselections = [];
            this.accountmanagerselections = [];
            this.typeOffailureselections = [];
            this.invNumberselections = [];
            this.phototgraphsTakenbyselections = [];
          }
          this.onInvNumberFilter('');
        },
        (error) => {
          this.visible = true;
          this.visible = false;
        }
      );
    } else {
      field_failure.id = 0;
      this.service.AddFieldFailureDetail(field_failure).subscribe(
        (res) => {
          if (res['status'] == 200) {
            this.visible = true;
            this.visible = false;
            this.utility.toast.success(res['message']);
            this.valueoftimeofIncident = '';
            this.disable = true;
            this.disableReason = true;
            this.projectselections = [];
            this.accountmanagerselections = [];
            this.typeOffailureselections = [];
            this.invNumberselections = [];
            this.phototgraphsTakenbyselections = [];
            this.valueoftimeofIncident = this.isTimeOfIncident = false;
            this.timeofIncidentvalue = field_failure.timeOfIncident;
            var year = new Date(field_failure?.dateOfIncident).getFullYear();
            var month = new Date(field_failure?.dateOfIncident).getMonth();
            var date = new Date(field_failure?.dateOfIncident).getDate();
            if (field_failure.timeOfIncident.includes('PM')) {
              var x = new Date(
                year,
                month,
                date,
                this.timeofIncidentvalue.split(':')[0],
                this.timeofIncidentvalue.split(':')[1].split(' ')[0]
              );
              this.valueoftimeofIncident = new Date(
                x.setTime(x.getTime() + 12 * 60 * 60 * 1000)
              );
            } else {
              this.valueoftimeofIncident = new Date(
                year,
                month,
                date,
                this.timeofIncidentvalue.split(':')[0],
                this.timeofIncidentvalue.split(':')[1].split(' ')[0]
              );
            }
            this.fieldFailuresort = this.defaultFiedFailureSort;
            this.loadFieldFailureData();
          } else {
            this.visible = true;
            this.visible = false;
            this.utility.toast.error(res['message']);
            this.valueoftimeofIncident = '';
            this.disable = true;
            this.disableReason = true;
            this.projectselections = [];
            this.accountmanagerselections = [];
            this.typeOffailureselections = [];
            this.invNumberselections = [];
            this.phototgraphsTakenbyselections = [];
            this.isTimeOfIncident = false;
          }
          this.onInvNumberFilter('');
        },
        (error) => {
          this.visible = true;
          this.visible = false;
        }
      );
    }
  }

  reloadFormonCancel(id: any) {
    this.visible = false;
    this.visible = true;
    this.service.GetFieldFailureDetail(id).subscribe(
      (x) => {
        this.Id = id;
        this.onInitFieldFailureForm(x.result);
        this.projectdetailvalue =
          x.result.projectNumber + '-' + x.result.projectName;
        this.accountManagervalue = x.result.projectManagerName;
        this.failureTypevalue = x.result.failureType;
        this.photographstakenbyvalue = x.result.photosBy;
        this.invNumbervalue = x.result.fleetNumber;
        this.timeofIncidentvalue = x.result.timeOfIncident;
        this.projectselections = [];
        this.accountmanagerselections = [];
        this.typeOffailureselections = [];
        this.invNumberselections = [];
        this.phototgraphsTakenbyselections = [];
        this.selectedBranch = x.result.branch;
        this.loadAccountManagerData();
        this.loadProjectData();
        if (x.result.projectNumber > 0) {
          this.loadInvNumberData();
          this.isProjectSelected = true;
        }
        this.visible = true;
        this.visible = false;
        this.onInvNumberFilter('');
      },
      (error) => {
        this.visible = true;
        this.visible = false;
      }
    );
  }

  loadInvNumberData() {
    this.visible = false;
    this.visible = true;
    var filter = {
      searchText: this.invNumbersearchText,
      jobNumber: String(this.fieldfailureForm.value.projectNumber),
      branch: this.selectedBranch,
    };
    this.totalInvNumberData = 0;

    this.invNumberrequest.pageSize = this.invNumberpageSize;
    if (this.invNumbersearchText) {
      this.invNumberrequest.pageNumber = 1;
    } else {
      this.invNumberrequest.pageNumber = this.invstartPage + 1;
    }

    // if(this.isPagesizeChange) {
    //   this.request.pageNumber = this.pagerService.end -1 ;
    // }
    this.invNumberrequest.sortColumn = this.invNumbersort[0].field;
    this.invNumberrequest.sortDesc = this.invNumbersort[0].dir == 'desc' ? true : false;
    this.invNumberrequest.request = filter;
    this.service.GetInvnumberData(this.invNumberrequest).subscribe(
      (res) => {

          if (res.totalRecords > 0) {
          this.invNumberData = res.data;
          this.tempInvNumberdata = res;
          this.totalInvNumberData = res.totalRecords;
          this.visible = true;
          this.visible = false;
        } else {
          this.invNumberData = [];
          this.tempInvNumberdata = [];
          this.visible = true;
          this.visible = false;
        }
      },
      (error) => {
        this.visible = true;
        this.visible = false;
      }
    );
  }

  loadBranchList() {
    this.dropdownService.GetBranchList().subscribe((result) => {
      if (result) {
        this.branchList = [{ code: 'ALL', value: 'All' }, ...result];
      }
    });
  }

  filterFieldFailureData(data: any) {
    this.filterBranch = data;
    this.skip = 0;
    this.fieldFailurestartPage = 0;
    this.selections = [0];
    this.loadFieldFailureData();
  }
}
