import { Component, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { MenuService } from 'src/app/core/helper/menu.service';
import { UtilityService } from '../../../../core/services/utility.service';
import { TitlesModel } from '../titles.model';
import { TitlesService } from '../titles.service';
import { ModuleNames, ErrorMessages } from 'src/app/core/constant';
import { ErrorHandlerService } from 'src/app/core/services';
@Component({
  selector: 'app-titles',
  templateUrl: './titles.component.html',
  styleUrls: ['./titles.component.scss'],
})
export class TitlesComponent implements OnInit {
  form: FormGroup;
  data: TitlesModel[];
  id: number = 0;
  cdate: any;
  titles: TitlesModel;
  isSave: boolean = true;
  isCancel: boolean = true;
  isEdit: boolean = false;
  isAdd: boolean = false;
  isPrint: boolean = true;
  isDisabled: boolean = true;
  employeeList: any;
  inactive: boolean;
  tempId: number;
  selectedTitle: any = null;
  allTitles = [];
  activeTitles = [];
  titleData = [];
  allTitlesData = [];
  @Output() dialogOpened: boolean = false;
  @Output() errorMsg: any;

  constructor(
    private formBuilder: FormBuilder,
    public service: TitlesService,
    public utils: UtilityService,
    public menuService: MenuService,
    public errorHandler: ErrorHandlerService
  ) {
    if (localStorage.getItem('isAdmin') == 'true') {
    } else {
      let acc = this.menuService.checkUserViewRights('Titles');
      if (acc) {
        //this.utils.toast.error("User does not have rights to access " + name + " module.");Z
      } else {
        this.utils.toast.error(
          'You do not have permissions to access this part of the system. Please contact your supervisor so they can request them from IT.'
        );
        setTimeout(() => {
          var url = '/dashboard';
          location.href = url;
        }, 1000);
      }
      this.menuService.checkUserBySubmoduleRights('Titles');
    }
  }
  SaveChange: BehaviorSubject<any> = new BehaviorSubject(null);
  ngOnInit(): void {
    this.loadEmployee();
    this.onLoadActiveTitles();
    this.initForm();
    this.form.reset();
    this.form.disable();
    //this.menuService.checkUserBySubmoduleRights('Title');
  }
  initForm(): void {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      reportTo: ['', Validators.required],
      value: [0, Validators.required],
      ssg: [false],
      timeApprover: [0, Validators.required],
      webTesting: [''],
      active: [false],
    });
  }

  loadEmployee() {
    // this.service.GetEmployeeList().subscribe(
    //   (res) => {
    //     if (res) {
    //       this.employeeList = res;
    //       ///this.empldata = res;
    //     }
    //   },
    //   (error) => {
    //     this.onError(error, ErrorMessages.titles.get_employee_list);
    //   }
    // );
  }

  editClick(id: number) {
    this.activeTitles = [...this.allTitles.filter((item) => item.id !== id)];
    this.id = id;
    this.isEdit = false;
    this.isCancel = true;
    this.form.disable();
    this.isDisabled = true;
    this.isAdd = false;
    this.isSave = true;
    this.service.getDataByID(id).subscribe(
      (res) => {
        if (res) {
          this.cdate = res['createdDate'];
          this.setValue(res);
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.titles.get_data_by_id);
      }
    );
  }

  setValue(data: TitlesModel) {
    this.form.setValue({
      name: data.name,
      reportTo: data.reportTo,
      value: data.value,
      ssg: data.ssg,
      timeApprover: data.timeApprover,
      webTesting: data.webTesting,
      active: data.active,
    });
    this.inactive = data.active;
  }

  onSave() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return false;
    }
    const data = this.form.value;
    data.ssg = data.ssg == null ? false : data.ssg;
    data.id = this.id;
    data.active = this.inactive;
    this.service.saveTitle(data).subscribe(
      (res) => {
        if (res['status'] == 200) this.utils.toast.success(res['message']);
        else this.utils.toast.error(res['message']);
        this.SaveChange.next(this.id);
        this.disbaleBtn();
        this.form.reset();
        this.form.disable();
        this.isDisabled = true;
        this.id = 0;
      },
      (error) => {
        this.onError(error, ErrorMessages.titles.save_title);
      }
    );
  }
  btnCancel() {
    this.form.disable();
    this.isDisabled = true;
    this.isCancel = true;
    this.isAdd = false;
    this.isSave = true;
    this.editClick(this.tempId);
  }

  btnAdd() {
    this.tempId = this.id;
    this.enableBtn();
    this.form.reset();
    this.form.enable();
    this.isDisabled = false;
    this.id = 0;
    this.cdate = '';
  }

  btnEdit() {
    this.tempId = this.id;
    this.form.enable();
    this.isDisabled = false;
    this.enableBtn();
  }

  enableBtn() {
    this.isAdd = true;
    this.isEdit = true;
    this.isSave = false;
    this.isCancel = false;
  }
  disbaleBtn() {
    this.isSave = true;
    this.isCancel = true;
  }
  hideallBtn(title) {
    if (title == 'POR Routing' || title == 'Time Approval Routing') {
      this.isCancel = true;
      this.isAdd = true;
      this.isEdit = true;
      this.isSave = true;
    }
    // else if (title == 'Time Approval Routing') {
    //   this.isCancel = true;this.isAdd = true;this.isEdit = true;this.isSave = true;
    // }
    else {
      this.isAdd = false;
      this.isEdit = false;
      this.isSave = true;
      this.isCancel = true;
    }
  }
  public onTabSelect(e) {
    if (e.title == 'Titles') {
      this.isAdd = false;
      this.isEdit = false;
      this.isSave = true;
      this.isCancel = true;
    } else {
      this.isCancel = true;
      this.isAdd = true;
      this.isEdit = true;
      this.isSave = true;
    }
  }
  private onError(error: any, customMessage?: string) {
    this.errorHandler.handleError(error, ModuleNames.titles, customMessage);
  }

  onLoadActiveTitles() {
    this.service.GetList(false).subscribe(
      (res) => {
        if (res.length) {
          this.activeTitles =
            this.allTitles =
            this.titleData =
            this.allTitlesData =
              res;
        } else {
          this.activeTitles =
            this.allTitles =
            this.titleData =
            this.allTitlesData =
              [];
        }
      },
      (error) => {}
    );
  }
  toggleChange(data) {
    this.inactive = data;
  }
}
