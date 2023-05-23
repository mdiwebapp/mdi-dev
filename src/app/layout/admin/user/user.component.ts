import { Component, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserBranch, UserModel } from './user.model';
import { UserService } from './user.service';
import { UtilityService } from '../../../core/services/utility.service';
import { BehaviorSubject } from 'rxjs';
import { BranchService } from '../branch/branch.service';
import { BranchModel } from '../branch/branch.model';
import { EmployeeService } from '../../ssg/employee/employee/employee.service';
import { MenuService } from 'src/app/core/helper/menu.service';
import { Router } from '@angular/router';
import { DropDownModel } from 'src/app/core/models/drop-down.model';
import { DedicatedBranchService } from 'src/app/core/services/dedicated-branch.service';
import { ModuleNames, ErrorMessages } from '../../../core/constant';
import { ErrorHandlerService, PagerService } from '../../../core/services';
import { PaginationRequest } from '../../../core/models/pagination.model';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  pipelineFilterOptions: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'startsWith',
  };
  form: FormGroup;
  id: any;
  data: UserModel[];
  cdate: any;
  branch: any;
  branchData: any;
  employeeData: any;
  tempId: any;
  isGridDisable: boolean;
  userList: any;
  userdata: any;
  userName: string;
  isDisabled: boolean;
  isExpanded: boolean;
  isMoreDisabled: boolean;
  selectedBranch: any;
  @Output() dialogOpened: boolean = false;
  @Output() errorMsg: any;
  filterCollection: any = {
    status: false,
  };
  constructor(
    private formBuilder: FormBuilder,
    public service: UserService,
    private utils: UtilityService,
    public branchService: BranchService,
    public employeeService: EmployeeService,
    public menuService: MenuService,
    public router: Router,
    private dedicatedBranchService: DedicatedBranchService,
    public errorHandler: ErrorHandlerService,
    public pagerService: PagerService
  ) {
    this.menuService.checkUserBySubmoduleRights('User');
    if (!this.menuService.isViewRight) {
      // this.utils.toast.error("User does not have rights to access this module.");
      this.router.navigate(['auth/login/']);
    }
  }
  user: UserModel;
  isSave: boolean = true;
  isCancel: boolean = true;
  isEdit: boolean = true;
  isAdd: boolean = false;
  public mask = '(000) 000-0000';
  SaveChange: BehaviorSubject<any> = new BehaviorSubject(null);
  ngOnInit(): void {
    this.GetUserList();
    this.initForm();
    this.form.reset();
    this.form.disable();
    this.GetBranch();
    this.GetEmployee();
  }

  GetBranch() {
    this.branchService.GetBranchDropdown().subscribe(
      (res) => {
        if (res) {
          this.branch = res;
          this.branchData = res;
        }
      },
      (error) => this.onError(error, ErrorMessages.branch.dropdown)
    );
  }

  GetEmployee() {
    this.employeeService.GetUniqueListFromUser().subscribe(
      (res) => {
        if (res) {
          this.employeeData = res;
        }
      },
      (error) =>
        this.onError(error, ErrorMessages.employee.get_unique_list_user)
    );
  }

  GetUserList() {
    var request = new PaginationRequest<any>();
    request.start = this.pagerService.start;
    request.end = this.pagerService.end;
    request.pageSize = this.pagerService.pageSize;
    request.request = this.filterCollection;
    this.service.GetList(request).subscribe(
      (res) => {
        this.userList = res.data;
        this.userdata = res.data;
      },
      (error) => this.onError(error, ErrorMessages.user.list)
    );
  }

  userHandleFilter(value) {
    this.userList = this.userdata.filter(
      (s) => s.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  editClick(id: any) {
    this.id = id;
    this.isEdit = false;
    this.isCancel = true;
    this.form.disable();
    this.isAdd = false;
    this.isSave = true;

    if (id == 0) {
      this.form.reset();
      this.isGridDisable = false;
    } else {
      this.service.getOneById(id).subscribe(
        (res) => {
          if (res) {
            this.cdate = res['createdDate'];
            this.userName = res['userName'];
            this.setValue(res);
          }
        },
        (error) => this.onError(error, ErrorMessages.user.get_byId)
      );
    }
  }

  initForm(): void {
    this.form = this.formBuilder.group({
      userId: ['', [Validators.required, Validators.maxLength(50)]],
      userName: ['', [Validators.required, Validators.maxLength(50)]],
      branchId: ['', Validators.required],
      employeeId: [''],
      domainAccount: ['', Validators.maxLength(50)],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.maxLength(50)],
      isActive: [false],
      isSalesMan: [false],
      isAdmin: [false],
      isEnable2FA: [false],
      newFeature: ['', [Validators.required, Validators.min(0)]],
      userSecurityId: [''],
    });
  }

  setValue(data: UserModel) {
    this.form.setValue({
      userId: data.userId,
      userName: data.userName,
      branchId: data.branchId,
      employeeId: data.employeeId,
      isSalesMan: data.isSalesMan,
      domainAccount: data.domainAccount,
      email: data.email,
      phoneNumber: data.phoneNumber,
      newFeature: data.newFeature,
      isActive: data.inactive == true ? false : true,
      isAdmin: data.isAdmin,
      isEnable2FA: data.isEnable2FA,
      userSecurityId: '',
    });

    this.selectedBranch = [];
    if (data.userBranch != null || data.userBranch != undefined) {
      data.userBranch.map((x) => {
        let d = new DropDownModel();
        d.id = x.branchId;
        d.value = this.branch.find((y) => y.id == x.branchId).value;
        this.selectedBranch.push(d);
      });
    }
  }
  onSave() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const data = this.form.value;
    data.id = this.id;
    data.salesman = true;

    // data.isActive = data.isActive == null ? false : data.isActive;
    data.isAdmin = data.isAdmin == null ? false : data.isAdmin;
    data.isEnable2FA = data.isEnable2FA == null ? false : data.isEnable2FA;
    data.isSalesMan = data.isSalesMan == null ? false : data.isSalesMan;
    data.employeeId = data.employeeId == 0 ? null : data.employeeId;

    let userBranchdata: UserBranch[] = [];
    if (this.selectedBranch == null || this.selectedBranch == undefined) {
    } else {
      this.selectedBranch.map((data) => {
        const obj = new UserBranch();
        obj.userId = this.id;
        obj.branchId = data.id;
        userBranchdata.push(obj);
      });
    }

    data.userBranch = userBranchdata;
    if (this.id == '' || this.id == null) {
      this.service.AddUser(data).subscribe(
        (res) => {
          this.resetSave(res);
        },
        (failed) => {
          this.onError(failed, ErrorMessages.user.add_user);
        }
      );
    } else {
      this.service.savePatch(data).subscribe(
        (res) => {
          this.resetSave(res);
        },
        (error) => {
          this.onError(error, ErrorMessages.user.save_patch);
        }
      );
    }
  }

  resetSave(res) {
    if (res['status'] == 200) {
      this.utils.toast.success(res['message']);
      this.SaveChange.next(this.id);
      this.disbaleBtn();
      this.form.reset();
      this.form.disable();
      this.GetEmployee();
      this.id = 0;
    } else this.utils.toast.error(res['message']);
  }

  btnCancel() {
    this.form.disable();
    this.isCancel = true;
    this.isAdd = false;
    this.isSave = true;
    this.editClick(this.tempId);
  }

  btnAdd() {
    this.enableBtn();
    this.form.reset();
    this.form.enable();
    this.tempId = this.id;
    this.isEdit = true;
    this.isAdd = true;
    this.isSave = false;
    this.id = '';
    this.cdate = '';this.userName='';
    this.selectedBranch = [];
    this.form.patchValue({
      isActive: true,
      isSalesMan: false,
      isAdmin: false,
      isEnable2FA: false,
    });
  }

  btnEdit() {
    this.form.enable();
    this.enableBtn();
    this.tempId = this.id;
    this.isEdit = true;
    this.isAdd = true;
  }

  enableBtn() {
    this.isSave = false;
    this.isCancel = false;
  }
  disbaleBtn() {
    this.isSave = true;
    this.isCancel = true;
  }

  branchhandleFilter(value) {
    this.branch = this.branchData.filter(
      (s) => s.value.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }
  onChangeEvent(event: any) {
    this.service.CheckUser(event.target.value).subscribe(
      (res) => {
        if (res.status == 0) {
          this.form.controls['userId'].setValue('');
          this.utils.toast.error(res.message);
        }
        //this.resetSave(res);
      },
      (failed) => {
        this.onError(failed, ErrorMessages.user.check_user);
      }
    );
  }

  onBranchChange(values) {
    this.dedicatedBranchService.onChangeBranches(values);
  }

  onError(error: any, customMessage?: string) {
    this.errorHandler.handleError(error, ModuleNames.user, customMessage);
  }
}
