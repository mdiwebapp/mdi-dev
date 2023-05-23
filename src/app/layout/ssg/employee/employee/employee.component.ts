import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  DataBindingDirective,
  PageChangeEvent,
} from '@progress/kendo-angular-grid';
import { orderBy, process, SortDescriptor } from '@progress/kendo-data-query';
import { BehaviorSubject } from 'rxjs';
import { MenuService } from 'src/app/core/helper/menu.service';
import { EmployeeActivityComponent } from '../employee-activity/employee-activity.component';
import { EmployeeCertificateComponent } from '../employee-certificate/employee-certificate.component';
import { EmployeeEquipComponent } from '../employee-equip/employee-equip.component';
import { EmployeeHistoryComponent } from '../employee-history/employee-history.component';
import { EmployeeMoreinfoComponent } from '../employee-moreinfo/employee-moreinfo.component';
import { EmployeeNotesComponent } from '../employee-notes/employee-notes.component';
import { EmployeeWorkComponent } from '../employee-work/employee-work.component';
import { EmployeeService } from './employee.service';
import { ModuleNames, ErrorMessages } from 'src/app/core/constant';
import { ErrorHandlerService } from 'src/app/core/services';
import { EmployeeFilterRequestModel } from '../employee.model';
import { ActiveStatus } from '../../../../../../src/app/core/models/enum-model';
import { UtilityService } from '../../../../../../src/app/core/services/utility.service';
import { DropdownService } from '../../../../../../src/app/core/services/dropdown.service';
import { PagerService } from 'src/app/core/services/pager.service';
import { PaginationRequest } from 'src/app/core/models/pagination.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss'],
})
export class EmployeeComponent implements OnInit {
  @ViewChild(DataBindingDirective) dataBinding: DataBindingDirective;
  @ViewChild(EmployeeMoreinfoComponent)
  employeeMoreinfo: EmployeeMoreinfoComponent;
  @ViewChild(EmployeeWorkComponent) employeeWork: EmployeeWorkComponent;
  @ViewChild(EmployeeNotesComponent) employeeNotes: EmployeeNotesComponent;
  @ViewChild(EmployeeHistoryComponent)
  employeeHistory: EmployeeHistoryComponent;

  @ViewChild(EmployeeActivityComponent)
  employeeActivity: EmployeeActivityComponent;

  @ViewChild(EmployeeActivityComponent)
  GetEmployeeActivity: EmployeeActivityComponent;

  @ViewChild(EmployeeActivityComponent)
  GetOtherGridActivity: EmployeeActivityComponent;

  @ViewChild(EmployeeCertificateComponent)
  employeeCertificate: EmployeeCertificateComponent;
  @ViewChild(EmployeeEquipComponent) employeeEquip: EmployeeEquipComponent;
  pageSizeList: any = [
    { id: 0, value: 100 },
    { id: 0, value: 300 },
    { id: 0, value: 500 },
  ];
  multiple: boolean = false;
  public totalData = 0;
  public pageSize = 100;
  public skip = 0;
  public pageNumber = 1;
  tempPageNo: number;
  sort: SortDescriptor[];
  data: any;
  employee: any[];
  statusEnum: ActiveStatus;
  status: number;
  form: FormGroup;
  id: number;
  cdate: any;
  SaveChange: BehaviorSubject<any> = new BehaviorSubject(null);
  action: string = '';
  disableEmployeeGrid: boolean = false;

  cInfos: any;
  firstName: '';
  lastName: '';
  startDate: '';
  isTab1: boolean = false;
  isTab2: boolean = false;
  isTab3: boolean = false;
  isTab4: boolean = false;
  isTab6: boolean = false;
  isTab7: boolean = false;
  isPrint: boolean = true;

  isSave: boolean = true;
  isCancel: boolean = true;
  isEdit: boolean = true;
  isAdd: boolean = true;
  isDisabled: boolean = true;
  isDisabledSearch: boolean = false;
  isDisableStartDate: boolean = true;
  employeeList: any;
  selectedTab = 0;
  inactive: boolean = true;
  mySelection: number[] = [];
  employeeFilter: unknown[];
  tempId: number;
  tabList = {
    PeronalDetails: false,
    Work: false,
    Activity: false,
    Notes: false,
    History: false,
  };
  isTab5: boolean;
  selected2Tab = 0;
  employeeName: any;
  employeeFilterRequestModel: EmployeeFilterRequestModel;
  branch: any[] = [];
  branchCode: any = [];
  statuses: any = [
    { id: 0, value: 'All' },
    { id: 1, value: 'Active' },
    { id: 2, value: 'Inactive' },
  ];
  branches: any = [];
  filterCollection: any = {
    id: 0,
    status: 1,
  };
  searchText: string = '';
  request = new PaginationRequest<any>();
  employeeDetail: any;
  constructor(
    public service: EmployeeService,
    public menuService: MenuService,
    private formBuilder: FormBuilder,
    public errorHandler: ErrorHandlerService,
    public utilityService: UtilityService,
    public dropdownService: DropdownService,
    public pagerService: PagerService,
    public datepipe: DatePipe
  ) {
    if (localStorage.getItem('isAdmin') == 'true') {
      this.isTab1 = true;
      this.isTab2 = true;
      this.isTab3 = true;
      this.isTab4 = true;
      this.isTab5 = true;
      this.isTab6 = true;
      this.isTab7 = true;
    } else {
      const rights = JSON.parse(localStorage.getItem('Rights'));
      if (rights) {
        this.isTab1 = rights.some(
          (c) =>
            c.subModuleName == 'Personal Details' &&
            c.moduleName == 'Employee' &&
            c.tabName == 'VIEW'
        );
        this.isTab2 = rights.some(
          (c) =>
            c.subModuleName == 'Work' &&
            c.moduleName == 'Employee' &&
            c.tabName == 'VIEW'
        );
        this.isTab3 = rights.some(
          (c) =>
            c.subModuleName == 'Activity' &&
            c.moduleName == 'Employee' &&
            c.tabName == 'VIEW'
        );
        this.isTab4 = rights.some(
          (c) =>
            c.subModuleName == 'Notes' &&
            c.moduleName == 'Employee' &&
            c.tabName == 'VIEW'
        );
        this.isTab5 = rights.some(
          (c) =>
            c.subModuleName == 'History' &&
            c.moduleName == 'Employee' &&
            c.tabName == 'VIEW'
        );
        this.isTab6 = rights.some(
          (c) =>
            c.subModuleName == 'Certificate' &&
            c.moduleName == 'Employee' &&
            c.tabName == 'VIEW'
        );
        this.isTab7 = rights.some(
          (c) =>
            c.subModuleName == 'Equip' &&
            c.moduleName == 'Employee' &&
            c.tabName == 'VIEW'
        );
      }
      this.menuService.checkUserBySubmoduleRights('Personal Details');
    }
  }

  ngOnInit(): void {
    this.employeeFilterRequestModel = new EmployeeFilterRequestModel();
    this.statusEnum = new ActiveStatus();
    this.status = this.statusEnum.Active;
    this.getBranch();
    this.branch = JSON.parse(
      this.utilityService.storage.getItem('selectedBranch')
    );

    if (this.branch.length > 0 && this.branch[0].id == 0) {
      this.branch.forEach((element) => {
        this.branchCode.push(element.code);
      });
    } else {
      this.branch.forEach((e) => {
        this.branchCode.push(this.branch.find((c) => c.id == e.id).code);
      });
    }

    this.employeeFilterRequestModel.Status = this.status;
    this.employeeFilterRequestModel.Branches = this.branchCode;
    this.loadItems();
    this.initForm();
    //this.menuService.checkUserBySubmoduleRights('Personal Details');
  }

  initForm(): void {
    this.form = this.formBuilder.group({
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      startDate: [null, Validators.required],
      description: [null],
    });
  }
  public onTabSelect(e) {
    this.selectedTab = e.index;
    //this.editClick(this.id);
    if (this.selectedTab == 0) {
      this.isAdd = false;
      this.menuService.checkUserBySubmoduleRights('Personal Details');
      this.tabList.PeronalDetails = false;
      this.tabList.Work = true;
      this.tabList.Notes = true;
      this.tabList.History = true;
      this.tabList.Activity = true;
      this.employeeMoreinfo.editClick(this.employeeDetail);
    } else if (this.selectedTab == 1) {
      this.isAdd = false;
      this.menuService.checkUserBySubmoduleRights('Work');
      this.tabList.PeronalDetails = true;
      this.tabList.Work = false;
      this.tabList.Notes = true;
      this.tabList.History = true;
      this.tabList.Activity = true;
      this.employeeWork.editClick(this.employeeDetail.workInfo);
    } else if (this.selectedTab == 2) {
      this.isAdd = false;
      this.menuService.checkUserBySubmoduleRights('Activity');
      this.tabList.PeronalDetails = true;
      this.tabList.Work = true;
      this.tabList.Notes = true;
      this.tabList.History = true;
      this.tabList.Activity = false;
      this.GetEmployeeActivity.EmployeeActivity(this.id);
      this.GetOtherGridActivity.OtherGridActivity(this.id);
    } else if (this.selectedTab == 3) {
      this.menuService.checkUserBySubmoduleRights('Notes');
      this.tabList.PeronalDetails = true;
      this.tabList.Work = true;
      this.tabList.Notes = false;
      this.tabList.History = true;
      this.tabList.Activity = true;
      this.employeeNotes.NoteList(this.id);
    } else if (this.selectedTab == 4) {
      this.menuService.checkUserBySubmoduleRights('History');
      this.tabList.PeronalDetails = true;
      this.tabList.Work = true;
      this.tabList.Notes = true;
      this.tabList.History = false;
      this.tabList.Activity = true;
      this.employeeHistory.GetHistory(this.id);
    }
    this.form.disable();
    this.isDisabledSearch = false;
  }

  public on2TabSelect(e) {
    this.selected2Tab = e.index;
    if (this.selected2Tab == 0)
      this.employeeCertificate.GetCertificate(this.id);
    else if (this.selected2Tab == 1) {
      this.employeeEquip.GetEquip(this.id);
    }
    //this.editClick(this.id);
    // if (this.selected2Tab == 0) {
    //   this.employeeCertificate.GetCertificate(this.id);
    // } else if (this.selected2Tab == 1) {
    //   this.employeeEquip.GetEquip(this.id);
    // }
  }

  onSave() {
    let saveStatus = false;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return true;
    }
    let data = { type: 'add', sData: this.form.value };
    //this.SaveChange.next(data);
    if (this.selectedTab == 0) {
      saveStatus = this.employeeMoreinfo.onSave(data, this.inactive);
    }
    if (this.selectedTab == 1) {
      this.action = 'save';
      saveStatus = this.employeeWork.onSave();
    }
    if (this.selectedTab == 2) {
      this.employeeActivity.onSave();
    }
    if (this.selectedTab == 3) saveStatus = this.employeeNotes.onSave();
    if (this.selected2Tab == 1) {
      this.employeeEquip.onSave();
    }
    if (saveStatus) return;
    else {
      setTimeout(() => {
        this.isAdd = false;
        this.isEdit = false;
        this.disbaleBtn();
        if (this.selectedTab == 0) {
          this.loadItems();
        }
      }, 2000);
    }
    this.isDisableStartDate = true;
    // this.editClick(this.tempId);
  }

  btnAdd() {
    if (this.selectedTab == 0) {
      this.enableBtn();
      this.isEdit = true;
      this.isAdd = true;
      this.isDisableStartDate = false;
      this.tempId = this.id;
      this.cdate = '';
      this.inactive = true;
      this.form.enable();
      this.form.reset();
      this.id = 0;
      this.employeeName = '';
      this.employeeMoreinfo.btnAdd();
      // this.employeeWork.form.reset();
      // this.employeeNotes.form.reset();
    }
    if (this.selectedTab == 1) {
      this.action = 'new';
      this.enableBtn();
      this.isEdit = true;
      this.isAdd = true;
      this.selectedTab = 0;
      // this.employeeWork.btnAdd();
    }
    if (this.selectedTab == 2) {
      this.enableBtn();
      this.isEdit = true;
      this.isAdd = true;
      this.selectedTab = 0;
    }
    this.employeeCertificate.btnAdd();
  }

  btnEdit() {
    this.enableBtn();
    this.form.enable();
    // this.isEdit = true;
    this.isAdd = true;
    this.tempId = this.id;
    this.isDisableStartDate = false;
    if (this.selectedTab == 0) {
      this.isDisabled = false;
      this.employeeMoreinfo.btnEdit();
    }
    if (this.selectedTab == 1) {
      this.action = 'edit';
      this.employeeWork.btnEdit();
    }
    if (this.selectedTab == 2) {
      this.employeeActivity.btnEdit();
    }
    if (this.selectedTab == 3) {
      this.employeeNotes.btnEdit(this.id);
    }
    if (this.selected2Tab == 0) {
      this.employeeCertificate.btnEditClick();
    }
    if (this.selected2Tab == 1) {
      this.employeeEquip.btnEdit();
    }
  }

  btnCancel() {
    let value = this.data[this.mySelection[0]]?.id;
    if (value) this.editClick(this.data[this.mySelection[0]]?.id);
    this.disbaleBtn();
    this.isDisableStartDate = true;
    if (this.selectedTab == 0) {
      this.employeeMoreinfo.btnCancel();
    }
    if (this.selectedTab == 2) {
      this.employeeActivity.btnCancel();
    }
    if (this.selectedTab == 1) {
      this.employeeWork.btnCancel();
    }
    if (this.selectedTab == 3) this.employeeNotes.btnCancel();

    if (this.selected2Tab == 0) {
      this.employeeCertificate.btnCancel();
    }
    if (this.selected2Tab == 1) {
      this.employeeEquip.btnCancel();
    }
  }

  enableBtn() {
    this.isSave = false;
    this.isCancel = false;
    this.isAdd = true;
    this.isEdit = true;
  }

  disbaleBtn() {
    this.isSave = true;
    this.isCancel = true;
    this.isAdd = false;
    this.isEdit = false;
  }

  editClick(id: number) {
    this.mySelection = this.mySelection;
    this.id = id;
    this.isEdit = false;
    this.isCancel = true;
    this.isAdd = false;
    this.isSave = true;
    if (id) {
      this.service.getOneById(id).subscribe(
        (res: any) => {
          if (res) {
            this.form.controls.firstName.setValue(res['firstName']);
            this.form.controls.lastName.setValue(res['lastName']);
            this.form.controls.startDate.setValue(
              this.datepipe.transform(res.workInfo.startDate, 'MM/dd/yyyy')
            );
            this.employeeName = res['firstName'] + ' ' + res['lastName'];
            this.cdate = res['createdDate'];
            this.inactive = res['inactive'] == true ? false : true;
            this.isDisabled = true;
            this.employeeDetail = res;
            if (this.selectedTab == 0) {
              //this.isDisabled = false;
              this.employeeMoreinfo.editClick(res);
            }
            if (this.selectedTab == 1)
              this.employeeWork.editClick(res.workInfo);
            if (this.selectedTab == 2) {
              this.GetEmployeeActivity.EmployeeActivity(this.id);
              this.GetOtherGridActivity.OtherGridActivity(this.id);
            }
            if (this.selectedTab == 3) this.employeeNotes.NoteList(this.id);
            if (this.selectedTab == 4) this.employeeHistory.GetHistory(this.id);
            if (this.selected2Tab == 0)
              this.employeeCertificate.GetCertificate(this.id);
            else if (this.selected2Tab == 1) {
              this.employeeEquip.GetEquip(this.id);
            }
            //this.SaveChange.next(res);
            this.form.disable();
            this.isDisabledSearch = false;
          }
        },
        (error) => {
          this.initForm();
          this.employeeMoreinfo.initForm();
          this.onError(error, ErrorMessages.employee.get_one_by_id);
        }
      );
    }
  }
  onFilter(inputValue: string): void {
    this.data = process(this.employeeFilter, {
      filter: {
        logic: 'or',
        filters: [
          {
            field: 'employeeName',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'branchName',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'ssNumber',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'diversLicenseNumber',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'licenseState',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'birthDate',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'address',
            operator: 'contains',
            value: inputValue,
          },

          {
            field: 'address2',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'state',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'city',
            operator: 'contains',
            value: inputValue,
          },

          {
            field: 'zipCode',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'homePhone',
            operator: 'contains',
            value: inputValue,
          },
        ],
      },
    }).data;
    this.mySelection = [0];
    this.employee = this.data;
    if (this.data != null && this.data.length > 0)
      this.editClick(this.employee[0].id);
    else {
      this.form.reset();
      this.id = 0;
      this.isEdit = true;
      this.employeeMoreinfo.form.reset();
      this.employeeMoreinfo.fullAddress = '';
      this.employeeMoreinfo.fullAdressLable = '';
      this.employeeWork.form.reset();
      this.employeeNotes.form.reset();
    }
  }
  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.loadItems();
  }
  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.data = {
      data: orderBy(this.data, this.sort),
      total: this.data.length,
    };
    this.data = this.data.data;
    if (this.request.pageNumber > 1) {
      let temp = (this.request.pageNumber - 1) * this.pageSize;
      let dataIndex = this.mySelection[0] - temp;
      this.editClick(this.data[dataIndex]?.id);
    } else {
      this.mySelection = this.mySelection.length ? [this.mySelection[0]] : [0];
      this.editClick(this.data[this.mySelection[0]]?.id); // edit part as id is not 0
    }
  }
  loadItems() {
    this.createEmployeeFilterRequestModel();
    this.service.GetList(this.request).subscribe(
      (res) => {
        if (res?.data?.length > 0) {
          this.data = res.data;
          this.employee = res;
          this.employeeFilter = res;
          this.totalData = res.totalRecords;
          if (this.id > 0) {
            if (this.request.pageNumber > 1) {
              let temp = (this.request.pageNumber - 1) * this.pageSize;
              let dataIndex = temp - this.mySelection[0];
              this.mySelection = this.mySelection.length
                ? [this.mySelection[0]]
                : [0];
              this.editClick(this.data[dataIndex]?.id);
            } else {
              this.mySelection = this.mySelection.length
                ? [this.mySelection[0]]
                : [0];
              this.editClick(this.data[this.mySelection[0]]?.id); // edit part as id is not 0
            }
          } else {
            this.mySelection = [0];
            this.editClick(this.data[this.mySelection[0]]?.id); // add part as id is
          }
        } else {
          this.data = [];
          this.totalData = 0;
          this.employeeName = '';
          this.employeeMoreinfo.fullAdressLable = '';
          this.initForm();
          this.employeeMoreinfo.initForm();
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.employee.get_list);
      }
    );
  }

  OnAddUpdate(res) {
    this.loadItems();
  }

  EmployeeInActive(event) {
    this.status = event;
    this.loadItems();
  }

  private onError(error: any, customMessage?: string) {
    this.errorHandler.handleError(error, ModuleNames.employee, customMessage);
  }

  //#region New Code
  onHandleOperation(type, value = null) {
    switch (type) {
      case 'start_date':
        this.form.setValue({
          ...this.form.value,
          startDate: value,
        });
        break;
      default:
        break;
    }
  }
  getBranch() {
    this.dropdownService.GetBranchList().subscribe((res) => {
      this.branches = res;
      // this.tempBranch =res; // used in sorting
      // this.gettempBranch = res; // used in sorting
      var index = this.branches.findIndex((c) => c.value == 'SSG');
      this.branches.splice(index, 1);
      this.branches.unshift({ code: 'All', id: 0, value: 'All' });
      this.branches = this.branches;
      // this.branches = this.branchData; // used in sorting
    });
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
    this.pageNumber = this.searchText ? 1 : this.pagerService.start;
    if (this.pageNumber > 1) {
      this.mySelection = [(this.pageNumber - 1) * this.pageSize];
    } else {
      this.mySelection = [0];
    }
    //this.skip = event.skip;
    this.loadItems();
  }
  onPageSizechange(pagesize) {
    this.pageSize = pagesize;
    this.loadItems();
  }
  //#endregion

  //#region
  createEmployeeFilterRequestModel() {
    this.employeeFilterRequestModel = new EmployeeFilterRequestModel();
    this.employeeFilterRequestModel.Branches = this.branchCode;
    this.employeeFilterRequestModel.SearchText = this.searchText;
    this.employeeFilterRequestModel.Status = this.status;
    this.request.request = this.employeeFilterRequestModel;
    this.request.pageNumber = this.searchText ? 1 : this.pagerService.start;
    this.request.pageSize = this.pageSize;
  }
  //#endregion

  //#region Filters
  onStatusChange(data) {
    if (this.pagerService.start == 0) {
      this.pagerService.start = 1;
    }
    if (data == 0) {
      this.filterCollection.Status = this.statusEnum.All;
      this.status = this.filterCollection.Status;
      this.pagerService.start = 1;
      this.skip = 0;
      // this.projectJobViewRequestModelCollection.Status = this.filterCollection.Status
      this.loadItems();
    } else if (data == 1) {
      this.filterCollection.Status = this.statusEnum.Active;
      this.status = this.filterCollection.Status;
      this.pagerService.start = 1;
      this.skip = 0;
      // this.projectJobViewRequestModelCollection.Status = this.filterCollection.Status
      this.loadItems();
    } else if (data == 2) {
      this.filterCollection.Status = this.statusEnum.Inactive;
      this.status = this.filterCollection.Status;
      this.pagerService.start = 1;
      this.skip = 0;
      // this.projectJobViewRequestModelCollection.Status = this.filterCollection.Status
      this.loadItems();
    }
  }
  onSearchClick(data) {
    this.searchText = data;
    this.loadItems();
  }

  onBranchValueChange(data) {
    this.branchCode = data;
    this.loadItems();
  }

  onHandleNotes() {
    this.isEdit = !this.isEdit;
  }
  //#endregion
}
