import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  orderBy,
  SortDescriptor,
  State,
  process,
} from '@progress/kendo-data-query';
import { ProjectService } from '../projects.service';
import { ProjectsInfoComponent } from './../projects-info/projects-info.component';
import {
  ProjectTabs,
  ProjectActiveStatusEnum,
} from '../../../core/models/enum-model';
import { ProjectJobViewRequestModel } from './../projects.model';
import { PaginationRequest, PaginationWithSortRequest } from 'src/app/core/models/pagination.model';
import { PagerService } from 'src/app/core/services/pager.service';
import {
  DataStateChangeEvent,
  GroupKey,
  PageChangeEvent,
} from '@progress/kendo-angular-grid';
import { ProjectsNotesComponent } from '../projects-notes/projects-notes.component';
import { PAFComponent } from './../projects-info/PAF/PAF.component';
import * as fileSaver from 'file-saver';
import { ProjectHistoryComponent } from './../project-history/project-history.component';
import { ProjectsQuotesComponent } from './../projects-quotes/projects-quotes.component';
import { ProjectsInventoryComponent } from '../projects-inventory/projects-inventory.component';
import { MenuService } from 'src/app/core/helper/menu.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { DropdownService } from 'src/app/core/services/dropdown.service';
import { UserPreferenceModel } from 'src/app/core/models/preference.model';
import { UserPreferenceService } from 'src/app/core/services/user-preference.service';
import { NetworkDirectoryComponent } from '../../networkdirectory/networkdirectorypage/networkdirectory.component';
@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent implements OnInit {
  @ViewChild(ProjectsInfoComponent) projectInfoComponent: ProjectsInfoComponent;
  @ViewChild(ProjectsNotesComponent)
  projectNotesComponent: ProjectsNotesComponent;
  @ViewChild(PAFComponent) pAFComponent: PAFComponent;
  @ViewChild(ProjectHistoryComponent)
  projectHistoryComponent: ProjectHistoryComponent;
  @ViewChild(ProjectsQuotesComponent)
  projectsQuotesComponent: ProjectsQuotesComponent;
  @ViewChild(ProjectsInventoryComponent)
  projectsInventoryComponent: ProjectsInventoryComponent;
  @ViewChild(NetworkDirectoryComponent)
  networkDirectory: NetworkDirectoryComponent;
  form: FormGroup;
  selectedTab = 'Project Info';
  isAdd: boolean = true;
  isEdit: boolean = true;
  idCancel: boolean = false;
  isSave: boolean = false;
  visible: boolean;
  show: boolean;
  showFolder: boolean;
  jobGroup: boolean;
  toggleText: string;
  searchText: string = '';
  branch: string = '';
  AM: number = 0;
  jobNumber: number;
  status: string;
  tabs = ProjectTabs;
  StatusEnum: ProjectActiveStatusEnum;
  request = new PaginationWithSortRequest<any>();
  isdisabled: boolean = false;
  isSearchDisabled: boolean = false;
  projectJobViewRequestModelCollection: any = {
    Status: 0,
    SearchText: '',
    JobGroup: false,
    Branch: '',
    AM: 0,
  };
  pageSizeList: any = [
    { id: 0, value: 100 },
    { id: 0, value: 300 },
    { id: 0, value: 500 },
  ];
  public totalData = 0;
  public pageSize = 100;
  public skip = 0;
  public pageNumber = 1;
  tempPageNo: number;

  public viewColumns = [
    {
      Name: 'jobNumber',
      isCheck: true,
      Text: 'Job#',
      isDisable: false,
      index: 0,
      width: 50,
    },
    {
      Name: 'jobName',
      isCheck: true,
      Text: 'Job Name',
      isDisable: false,
      index: 1,
      width: 50,
    },
    {
      Name: 'branchName',
      isCheck: true,
      Text: 'Branch',
      isDisable: false,
      index: 3,
      width: 50,
    }
  ];
  projectData: any = [];
  state: State = {
    group: [],
  };
  multiple: boolean = false;
  expandedGroupKeys: Array<GroupKey> = [];
  statusData: any = [
    { id: 0, value: 'All' },
    { id: 1, value: 'Active' },
    { id: 2, value: 'Needs Bid' },
    { id: 3, value: 'Proposed' },
    { id: 4, value: 'Closed' },
    { id: 5, value: 'A/R' },
  ];
  columns = [
    {
      Name: 'jobNumber',
      isCheck: false,
      Text: 'Job#',
      isDisable: true,
      index: 0,
      width: 50,
    },
    {
      Name: 'jobName',
      isCheck: false,
      Text: 'Job Name',
      isDisable: false,
      index: 1,
      width: 50,
    },
    {
      Name: 'am',
      isCheck: false,
      Text: 'A M',
      isDisable: false,
      index: 2,
      width: 50,
    },
    {
      Name: 'branchName',
      isCheck: false,
      Text: 'Branch',
      isDisable: false,
      index: 3,
      width: 50,
    },
    {
      Name: 'customerName',
      isCheck: false,
      Text: 'Customer',
      isDisable: false,
      index: 4,
      width: 50,
    }
  ];
  customerData = [];
  filterCollection: any = {
    id: 0,
    status: 1,
  };
  groupJobList: boolean = false;
  data: any;
  public sort: SortDescriptor[] = [
    {
      field: 'jobNumber',
      dir: 'asc',
    },
    {
      field: 'jobName',
      dir: 'asc',
    },
    {
      field: 'am',
      dir: 'asc',
    },
    // {
    //   field: 'branch',
    //   dir: 'asc',
    // },
    // {
    //   field: 'customer',
    //   dir: 'asc',
    // },
    // {
    //   field: 'status',
    //   dir: 'asc',
    // },
  ];
  public mySelection: number[] = [0];
  isJobWithRevenue: boolean = false;
  quoteBranches: string = '';
  isTab1: boolean = false;
  isTab2: boolean = false;
  isTab3: boolean = false;
  isTab4: boolean = false;
  isTab5: boolean = false;
  userPreferenceModel: UserPreferenceModel;
  public hiddenColumns: string[] = ['make', 'model', 'location'];
  columnWidths: any = [];
  customerName: any;
  projectDetail: any;
  constructor(
    private formBuilder: FormBuilder,
    public projectService: ProjectService,
    public pagerService: PagerService,
    public menuService: MenuService, public dropDownService: DropdownService,
    private utility: UtilityService, public preference: UserPreferenceService,
  ) {
    if (localStorage.getItem('isAdmin') == 'true') {
      this.isTab1 = false;
      this.isTab2 = false;
      this.isTab3 = false;
      this.isTab4 = false;
      this.isTab5 = false;
    } else {
      let acc = this.menuService.checkUserViewRights('Maintain Projects');
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
      this.menuService.checkUserBySubmoduleRights('Project Info');
      const rights = JSON.parse(localStorage.getItem('Rights'));
      this.isTab1 = !rights.some(
        (c) =>
          c.subModuleName == 'Project Info' &&
          c.moduleName == 'Maintain Projects' &&
          c.tabName == 'VIEW'
      );
      this.isTab2 = !rights.some(
        (c) =>
          c.subModuleName == 'Quotes' &&
          c.moduleName == 'Maintain Projects' &&
          c.tabName == 'VIEW'
      );
      this.isTab3 = !rights.some(
        (c) =>
          c.subModuleName == 'Inventory' &&
          c.moduleName == 'Maintain Projects' &&
          c.tabName == 'VIEW'
      );
      this.isTab4 = !rights.some(
        (c) =>
          c.subModuleName == 'Notes' &&
          c.moduleName == 'Maintain Projects' &&
          c.tabName == 'VIEW'
      );
      this.isTab5 = !rights.some(
        (c) =>
          c.subModuleName == 'History' &&
          c.moduleName == 'Maintain Projects' &&
          c.tabName == 'VIEW'
      );

      //this.router.navigate(['/dashboard']);
      // this.utility.toast.error(
      //   'You do not have permissions to access this part of the system. Please contact your supervisor so they can request them from IT.'
      // );
    }
  }

  ngOnInit() {
    this.initForm();
    this.StatusEnum = new ProjectActiveStatusEnum();
    this.status = this.StatusEnum.Active;
    this.jobGroup = false;
    this.AM = 0;
    this.branch = '';
    this.pagerService.start = this.pageNumber;
    var lsData = localStorage.getItem('jobNumber');
    //this.loadCustomerData();
    if (lsData) {
      this.status = this.StatusEnum.All;
      this.searchText = lsData;
      this.getProjectServiceJobGridList();
    }
    else {
      this.getProjectServiceJobGridList();
    }
  }

  initForm(): void {
    this.form = this.formBuilder.group({
      milesToTheJob: [],
      headerFootageText: [],
      pointSpacingText: [],
      provideType: [],
      holePunchType: [],
      preDrillingType: [],
      jettingText: [],
      HoursDayText: [],
      txtTractorLoads: [],
      crewSetupText: [],
      crewPickupText: [],
      pumpSizeType: [],
      fuelCubeType: [],
      containmentType: [],
      sedimentationtrapType: [],
      dischargeFootageText: [],
      dischargeType: [],
      fusesHourText: [],
      pipeSizeType: [],
      excavatorType: [],
      cutomerDataType: [],
      description: [],
      groupJobList: [],
    });
  }
  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.data = {
      data: orderBy(this.projectData, this.sort),
      total: this.projectData.length,
    };
    // this.projectData = this.data.data;
    this.mySelection = [0];
    this.jobNumber = null;
    // this.id = this.data[0].invType;
    this.request.sortColumn = this.sort[0].field;
    this.request.sortDesc =
      this.sort[0].dir == 'asc' ? false : true;
    this.savePreference();
    this.getProjectServiceJobGridList()
  }

  public onFilter(inputValue: string): void { }

  public onToggle(): void {
    this.show = !this.show;
    this.toggleText = this.show ? 'Hidе' : 'Show';
    // let aaa = this.columns.filter(x => x.isCheck == true);
    // if (aaa.length == 1) {
    //   this.columns.forEach(element => {
    //     if (element.Name != aaa[0].Name) {
    //       this.temphiddenColumns.push(element.Name);
    //     }
    //   });
    //   this.isDisabledColumn(aaa[0].Name);
    // }
  }
  columnApply() {
    this.show = false;
    this.savePreference();

  }

  resetpopup() {
    this.show = false;
    this.viewColumns = [
      {
        Name: 'jobNumber',
        isCheck: true,
        Text: 'Job#',
        isDisable: false,
        index: 0,
        width: 50,
      },
      {
        Name: 'jobName',
        isCheck: true,
        Text: 'Job Name',
        isDisable: false,
        index: 1,
        width: 50,
      },
      {
        Name: 'branchName',
        isCheck: true,
        Text: 'Branch',
        isDisable: false,
        index: 3,
        width: 50,
      }
    ];
    this.columns = [
      {
        Name: 'jobNumber',
        isCheck: true,
        Text: 'Job#',
        isDisable: false,
        index: 0,
        width: 50,
      },
      {
        Name: 'jobName',
        isCheck: true,
        Text: 'Job Name',
        isDisable: false,
        index: 1,
        width: 50,
      },
      {
        Name: 'am',
        isCheck: false,
        Text: 'A M',
        isDisable: false,
        index: 2,
        width: 50,
      },
      {
        Name: 'branchName',
        isCheck: true,
        Text: 'Branch',
        isDisable: false,
        index: 3,
        width: 50,
      },
      {
        Name: 'customerName',
        isCheck: false,
        Text: 'Customer',
        isDisable: false,
        index: 4,
        width: 50,
      }
    ];
    this.savePreference();
  }
  closepopup() {
    this.show = !this.show;
    this.toggleText = this.show ? 'Hidе' : 'Show';
  }
  changeCustomer($event: any) { }

  //#region Main Grid List Bind
  getProjectServiceJobGridList() {
    this.projectData = [];
    this.visible = false;
    this.visible = true;
    this.createProjectJobViewRequestModel();
    this.projectService
      .getProjectServieJobList(this.request)
      .subscribe((res) => {

        if (res.totalRecords > 0) {
          this.getPreference();
          if (this.jobGroup) {
            (this.state.group = [{ field: 'branchName' }, { field: 'am' }]),
              (this.projectData = this.jobGroup
                ? process(res.data, this.state)
                : res.data);
            this.visible = true;
            this.visible = false;
            this.jobNumber = 0;
            this.isSearchDisabled = true;
            this.mySelection = [];
          } else if (!this.jobGroup) {
            this.isSearchDisabled = false;
            this.state.group = [];
            this.projectData = res.data;
            if (!this.jobNumber) { this.jobNumber = this.projectData[0].jobNumber; this.mySelection = [0]; }
            this.gridSelection(this.jobNumber);

          }

          this.totalData = res.totalRecords;
        } else {
          this.totalData=0;
          if (this.selectedTab == this.tabs.tab1) {
            this.projectInfoComponent.resetForm();
          }else if (this.selectedTab == this.tabs.tab2) {
            this.projectsQuotesComponent.resetData();
          } else if (this.selectedTab == this.tabs.tab3) {
            this.projectsInventoryComponent.resetData();
          } else if (this.selectedTab == this.tabs.tab4) {
            this.projectNotesComponent.resetData();
          } else if (this.selectedTab == this.tabs.tab5) {
            this.projectHistoryComponent.getHistoryList(this.jobNumber);
          }
          this.visible = true;
          this.visible = false;
        }
        var lsData = localStorage.getItem('jobNumber');
        if (lsData) {
          window.localStorage.removeItem('jobNumber');
          this.searchText = '';
        }
      });
  }
  //#endregion

  //#region Tab Selection
  public onTabSelect(e) {
    const rights = JSON.parse(localStorage.getItem('Rights'));

    //this.selectedTab = e.index;
    this.selectedTab = e.title;
    if (this.selectedTab == this.tabs.tab1) {
      this.disableEnableButtons();
      this.projectInfoComponent.getFormDetails(this.projectDetail);
      //this.gridSelection(this.jobNumber);
    } else if (this.selectedTab == this.tabs.tab2) {
      this.disableEnableButtons();
      if (rights) {
        var pageModuleRights = rights.filter(
          (x) =>
            x.subModuleName == 'Quotes' && x.moduleName == 'Maintain Projects'
        );
        this.isAdd = pageModuleRights.find(
          (x) => x.tabName.toLowerCase() == 'add'
        );
        this.isEdit = pageModuleRights.find(
          (x) => x.tabName.toLowerCase() == 'edit'
        );
        this.projectsQuotesComponent.getFormDetails(this.projectDetail);
      } else {
        this.isAdd = false;
        this.isEdit = true;
        this.projectsQuotesComponent.getFormDetails(this.projectDetail);
      }
      //this.gridSelection(this.jobNumber);
    } else if (this.selectedTab == this.tabs.tab3) {
      this.disableEnableButtons();
      //this.gridSelection(this.jobNumber);
      this.projectsInventoryComponent.getList(
        this.jobNumber,
        this.projectDetail.jobName, this.quoteBranches
      );
    } else if (this.selectedTab == this.tabs.tab4) {
      this.disableEnableButtons();
      this.projectNotesComponent.getNotesDetailsByJobNumber(
        this.jobNumber
      );
      //this.gridSelection(this.jobNumber);
    } else if (this.selectedTab == this.tabs.tab5) {
      this.disableEnableButtons();
      this.projectHistoryComponent.getHistoryList(this.jobNumber);
      //this.gridSelection(this.jobNumber);
    }
  }
  //#endregion

  //#region Main Grid Click Event
  gridSelection(jobNumber: number) {
    this.jobNumber = jobNumber;
    this.projectService
      .getProjectServiceJobDetails(this.jobNumber)
      .subscribe((res) => {
        if (
          this.jobNumber != null ||
          this.jobNumber !== undefined ||
          this.jobNumber !== 0
        ) {
          this.projectDetail =res.result; 
          
          this.projectsInventoryComponent.customerName=res.result.customerName;
          this.quoteBranches = res.result.branch;
          if (this.selectedTab == this.tabs.tab1) {
            this.projectInfoComponent.getFormDetails(res.result);
          } else if (this.selectedTab == this.tabs.tab2) {
            this.projectsQuotesComponent.getFormDetails(
              res.result
            );
          } else if (this.selectedTab == this.tabs.tab3) {
            this.projectsInventoryComponent.getList(
              this.jobNumber,
              res.result.jobName, this.quoteBranches
            );
          } else if (this.selectedTab == this.tabs.tab4) {
            this.projectNotesComponent.getNotesDetailsByJobNumber(
              this.jobNumber
            );
          } else if (this.selectedTab == this.tabs.tab5) {
            this.projectHistoryComponent.getHistoryList(this.jobNumber);
          }
        }
        this.visible = true;
        this.visible = false;
      });
  }
  //#endregion

  //#region searchGrid
  onSearchClick() {
    this.searchText = this.form.get('description').value;
    this.jobNumber = null;
    this.getProjectServiceJobGridList();
  }
  //#endregion

  //#region Create Models
  createProjectJobViewRequestModel() {
    this.projectJobViewRequestModelCollection.Status = this.status;
    this.projectJobViewRequestModelCollection.SearchText = this.searchText;
    this.projectJobViewRequestModelCollection.JobGroup = false;
    this.projectJobViewRequestModelCollection.branch = this.branch;
    this.projectJobViewRequestModelCollection.AM = this.AM;
    this.request.request = this.projectJobViewRequestModelCollection;
    this.request.pageNumber = this.pagerService.start;
    this.request.pageSize = this.pageSize;
  }
  //#endregion

  //#region Pagination
  public onPageChange(e: PageChangeEvent): void {
    this.skip = e.skip;
    this.pageSize = e.take;
    this.pagerService.start =
      this.skip == 0 ? 0 : this.skip / this.pageSize + 1;
    if (this.pagerService.start == 0) {
      this.pagerService.start = 1;
    }
    this.filterCollection.pageSize = this.pageSize;
    this.tempPageNo = this.pagerService.start;
    //this.skip = event.skip;
    this.getProjectServiceJobGridList();
  }
  onPageSizechange(pagesize) {
    this.pageSize = pagesize;
    this.getProjectServiceJobGridList();
  }
  //#endregion

  //#region Status Filter
  onStatusChange(data) {
    if (this.pagerService.start == 0) {
      this.pagerService.start = 1;
    }
    this.jobNumber = null;
    if (data == 0) {
      this.filterCollection.Status = this.StatusEnum.All;
      this.status = this.filterCollection.Status;
      this.pagerService.start = 1;
      this.skip = 0;
      // this.projectJobViewRequestModelCollection.Status = this.filterCollection.Status
      this.getProjectServiceJobGridList();
    } else if (data == 1) {
      this.filterCollection.Status = this.StatusEnum.Active;
      this.status = this.filterCollection.Status;
      this.pagerService.start = 1;
      this.skip = 0;
      // this.projectJobViewRequestModelCollection.Status = this.filterCollection.Status
      this.getProjectServiceJobGridList();
    } else if (data == 2) {
      this.filterCollection.Status = this.StatusEnum.NeedsBid;
      this.status = this.filterCollection.Status;
      this.pagerService.start = 1;
      this.skip = 0;
      // this.projectJobViewRequestModelCollection.Status = this.filterCollection.Status
      this.getProjectServiceJobGridList();
    } else if (data == 3) {
      this.filterCollection.Status = this.StatusEnum.Proposed;
      this.status = this.filterCollection.Status;
      this.pagerService.start = 1;
      this.skip = 0;
      this.getProjectServiceJobGridList();
    } else if (data == 4) {
      this.filterCollection.Status = this.StatusEnum.Closed;
      this.status = this.filterCollection.Status;
      this.pagerService.start = 1;
      this.skip = 0;
      this.getProjectServiceJobGridList();
    } else if (data == 5) {
      this.filterCollection.Status = this.StatusEnum.AR;
      this.status = this.filterCollection.Status;
      this.pagerService.start = 1;
      this.skip = 0;
      this.getProjectServiceJobGridList();
    }
  }
  //#endregion

  //#region Job Group Switch

  onActive(data) {
    this.jobGroup = data;
    this.jobNumber = 0;
    this.getProjectServiceJobGridList();
  }
  //#endregion

  //#region Button Events
  onAddClick() {
    this.isAdd = true;
    this.addEditButtonClickShowHide();
    if (this.selectedTab == this.tabs.tab1) {
      this.projectInfoComponent.onAddClick();
    }
  }
  onEditClick() {
    this.isEdit = true;
    this.addEditButtonClickShowHide();
    if (this.selectedTab == this.tabs.tab1) {
      this.projectInfoComponent.onEditClick();
    } else if (this.selectedTab == this.tabs.tab2) {
      this.projectsQuotesComponent.onEditClick();
    }
  }
  onCancelClick() {
    this.isAdd = false;
    this.addEditButtonClickShowHide();
    if (this.selectedTab == this.tabs.tab1) {
      this.projectInfoComponent.onCancelClick();
    }
    if (this.selectedTab == this.tabs.tab2) {
      this.projectsQuotesComponent.onCancelClick();
    }
    this.gridSelection(this.jobNumber);
  }
  onSaveClick() {
    this.isAdd = false;

    if (this.selectedTab == this.tabs.tab1) {
      let saveStatus = false;
      saveStatus = this.projectInfoComponent.onSaveClick();
      if (saveStatus == false) return false;
    }
    if (this.selectedTab == this.tabs.tab2) {
      this.projectsQuotesComponent.onSaveClick();
    }
    if (this.selectedTab == this.tabs.tab1) {
      setTimeout(() => {
        this.getProjectServiceJobGridList();
      }, 1500);
    }
    this.addEditButtonClickShowHide();
  }
  //#endregion
  //#region disableEnable Buttons -- Add /Edit
  disableEnableButtons() {
    if (this.selectedTab == this.tabs.tab1) {
      this.isAdd = true;
      this.isEdit = true;
    } else if (this.selectedTab == this.tabs.tab2) {
      this.isAdd = false;
      this.isEdit = true;
    } else if (this.selectedTab == this.tabs.tab3) {
      this.isAdd = false;
      this.isEdit = false;
    } else if (this.selectedTab == this.tabs.tab3) {
      this.isAdd = true;
      this.isEdit = true;
    } else if (this.selectedTab == this.tabs.tab4) {
      this.isAdd = false;
      this.isEdit = false;
      this.isSave = false;
      this.idCancel = false;
    } else if (this.selectedTab == this.tabs.tab5) {
      this.isAdd = false;
      this.isEdit = false;
      this.isSave = false;
      this.idCancel = false;
    }
  }

  addEditButtonClickShowHide() {
    if (this.isAdd || this.isEdit) {
      this.isSave = true;
      this.idCancel = true;
      this.isAdd = false;
      this.isEdit = false;
      this.isdisabled = true;
    } else if (!this.isAdd || !this.isEdit) {
      this.isSave = false;
      this.idCancel = false;
      if (this.selectedTab == this.tabs.tab1)
        this.isAdd = true;
      this.isEdit = true;
      this.isdisabled = false;
    }
  }
  //#endregion

  groupChange() { }
  //#region Export to Excel
  exportToExcel() {
    this.visible = false;
    this.visible = true;
    var excelModal = {
      searchText: '',
      status: 'Active',
      jobGroup: false,
      branch: '',
      am: 0,
    };
    this.createProjectJobViewRequestModel();
    this.projectService.exportToExcel(excelModal).subscribe((res) => {
      let data = new Blob([res], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;',
      });
      fileSaver.saveAs(
        data,
        'ProjectJobList_' + new Date().toLocaleDateString('en-US') + '.xlsx'
      );
      this.visible = true;
      this.visible = false;
    });
  }
  //#endregion

  //#region

  valueChangeJobWithRev(data) {
    if (data) {
      this.isJobWithRevenue = true;
    } else {
      this.isJobWithRevenue = false;
    }
  }
  //#endregion

  backButtonEvent(p) {
    this.addEditButtonClickShowHide();
  }
  ngOnDestroy() {
    window.localStorage.removeItem('jobNumber');
    this.searchText = '';
  }
  loadCustomerData() {
    this.visible = false;
    this.visible = true;
    var obj = {
      pageNumber: this.pagerService.start,
      pageSize: this.pageSize,
      sortColumn: 'value',
      sortDesc: true,
      request: {
        searchText: this.searchText,
      },
    };
    this.dropDownService.GetCustomerList(obj).subscribe((res) => {
      this.customerData = res.data;
      this.totalData = res.totalRecords;
      this.visible = true;
      this.visible = false;
    });
  }
  savePreference() {
    var usr = JSON.parse(localStorage.getItem('currentUser'));
    if (usr) {
      this.userPreferenceModel = new UserPreferenceModel();
      this.userPreferenceModel.userName = usr.userId;
      this.userPreferenceModel.id = 0;
      this.userPreferenceModel.userId = 0;
      this.userPreferenceModel.page = 'Projects';
      var objd = {
        columns: this.hiddenColumns,
        order: this.viewColumns,
        width: this.columnWidths,
        sortBy: this.sort,
      };
      this.userPreferenceModel.preference = objd; //'{ columns: ' + this.hiddenColumns + ', order: ' + this.sort[0].dir + ', width: "", sortBy: ' + this.sort[0].field + '}';
      this.preference
        .SaveUserPreference(this.userPreferenceModel)
        .subscribe((res) => { });
    }
  }
  getPreference() {
    try {
      this.preference.GetUserPreference('Projects').subscribe((res) => {
        if (res.result) {
          var userPref = res.result.preference;
          this.viewColumns = userPref.order.filter((c) => c.isCheck == true);
          this.viewColumns.forEach((element) => {
            let col = this.columns.findIndex((c) => c.Name == element.Name);
            this.columns[col].isCheck = true;
          });
          //this.sort = userPref.sortBy;
          this.data = {
            data: orderBy(this.projectData, this.sort),
            total: this.projectData.length,
          };
          this.projectData = this.data.data;
        } else {
          this.viewColumns.forEach((element) => {
            let col = this.columns.findIndex((c) => c.Name == element.Name);
            this.columns[col].isCheck = true;
          });
          //this.editClick(this.viewData[0].inventory_PK);
        }
        if (this.data) {
          // this.viewData = this.data.data;
          // if (this.filterText) this.onFilter(this.filterText);
          // else {
          //   if (this.tempId == 0) {
          //     this.mySelection = [0];
          //     this.id = this.viewData[0].inventory_PK;
          //     this.editClick(this.id);
          //   } else {
          //     this.id = this.tempId;
          //     this.editClick(this.id);
          //   }
          // }
        }
      });
    } catch (error) {
      this.viewColumns.forEach((element) => {
        let col = this.columns.findIndex((c) => c.Name == element.Name);
        this.columns[col].isCheck = true;
      });
      //this.editClick(this.viewData[0].id);
    }
  }
  public hideColumn(): void {
    // this.temphiddenColumns = [];
    this.columns.forEach((element) => {
      if (element.isCheck) {
        var inde = this.viewColumns.find((c) => c.Name == element.Name);
        if (!inde) {
          this.viewColumns.push(element);
        }
        //this.temphiddenColumns.push(element.Name);
      } else {
        var index = this.viewColumns.findIndex((c) => c.Name == element.Name);
        //var index = this.viewColumns.indexOf(element);
        if (index > 0) {
          this.viewColumns.splice(index, 1);
        }
        //this.viewColumns.splice());
      }
    });
  }
  resizeColumns(eventData) {
    // var colItem = {
    //   field: eventData[0].column.field,
    //   width: eventData[0].newWidth,
    // };

    let col = this.viewColumns.findIndex(
      (c) => c.Name == eventData[0].column.field
    );
    this.viewColumns[col].width = eventData[0].newWidth;

    // var indx = this.columnWidths.indexOf(
    //   (c) => c.field == eventData[0].column.field
    // );
    // if (indx < 0) {
    //   this.columnWidths.push(colItem);
    // } else {
    //   this.columnWidths[indx].width = eventData[0].newWidth;
    // }
    this.savePreference();
  }
  reorderColumns(event) {
    var newIndx = event.newIndex;
    var oldIndx = event.oldIndex;
    var column = event.column.field;

    let cutOut = this.viewColumns.splice(oldIndx, 1)[0]; // cut the element at index 'from'
    this.viewColumns.splice(newIndx, 0, cutOut); // insert it at index 'to'

    this.savePreference();
  }

  public onFolderToggle(): void {
    this.showFolder = !this.showFolder;
    this.toggleText = this.showFolder ? 'Hidе' : 'Show';
    setTimeout(() => {
      this.networkDirectory.loadFolderByProject(this.jobNumber);
    }, 200);
  }
}
