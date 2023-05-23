import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EditService, GridDataResult } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import { Observable } from 'rxjs';
import { PermissionmoduleService } from '../permissionmodule/permissionmodule.service';
import { UtilityService } from '../../../../core/services/utility.service';
import { ModuleNames, ErrorMessages } from 'src/app/core/constant';
import { ErrorHandlerService } from 'src/app/core/services';

@Component({
  selector: 'app-permissionmoduletab',
  templateUrl: './permissionmoduletab.component.html',
  styleUrls: ['./permissionmoduletab.component.scss'],
})
export class PermissionmoduletabComponent implements OnInit {
  public view: Observable<GridDataResult>;
  public gridState: State = {
    sort: [],
    skip: 0,
    take: 10,
  };
  public formGroup: FormGroup;

  private editService: EditService;
  private editedRowIndex: number;
  department: any;
  module: any;
  moduleTab: any;

  constructor(
    public service: PermissionmoduleService,
    public utils: UtilityService,
    public errorHandler: ErrorHandlerService
  ) {}

  public ngOnInit(): void {
    this.GetDepartment();
    this.GetList();
  }

  GetList() {
    this.service.PermissionModuleTabList().subscribe(
      (res) => {
        this.moduleTab = res;
      },
      (error) =>
        this.onError(
          error,
          ErrorMessages.permission_module.permission_module_tab_list
        )
    );
  }

  GetDepartment() {
    this.service.GetList().subscribe(
      (res) => {
        this.department = res;
      },
      (error) =>
        this.onError(error, ErrorMessages.permission_module.permission_list)
    );
  }
  public onStateChange(state: State) {
    this.gridState = state;

    // this.editService.read();
  }

  public addHandler({ sender }) {
    this.closeEditor(sender);
    this.GetDepartment();
    this.formGroup = new FormGroup({
      id: new FormControl(0),
      departmentId: new FormControl('', Validators.required),
      tabName: new FormControl('', Validators.required),
      permissionModuleId: new FormControl('', Validators.required),
    });

    sender.addRow(this.formGroup);
  }

  public editHandler({ sender, rowIndex, dataItem }) {
    this.closeEditor(sender);
    this.GetDepartment();
    this.departmentChange(dataItem.departmentId);
    this.formGroup = new FormGroup({
      id: new FormControl(dataItem.id),
      moduleName: new FormControl(dataItem.moduleName),
      departmentId: new FormControl(dataItem.departmentId),
      tabName: new FormControl(dataItem.tabName),
      permissionModuleId: new FormControl(dataItem.permissionModuleId),
    });

    this.editedRowIndex = rowIndex;

    sender.editRow(rowIndex, this.formGroup);
  }

  public cancelHandler({ sender, rowIndex }) {
    this.closeEditor(sender, rowIndex);
  }

  departmentChange(value: any) {
    this.service.PermissionModuleListByDepartment(value).subscribe(
      (res) => {
        this.module = res;
      },
      (error) =>
        this.onError(
          error,
          ErrorMessages.permission_module.permission_module_list_by_department
        )
    );
  }
  public saveHandler({ sender, rowIndex, formGroup, isNew }) {
    let data = formGroup.value;
    debugger;
    data.permissionModuleId = data.permissionModuleId;
    data.moduleTabName = data.tabName;
    this.service.SaveModuleTab(data).subscribe(
      (res) => {
        if (res['status'] == 200) {
          this.utils.toast.success(res['message']);
          this.GetList();
        } else this.utils.toast.error(res['message']);
      },
      (error) =>
        this.onError(error, ErrorMessages.permission_module.save_module_tab)
    );
    sender.closeRow(rowIndex);
  }

  public removeHandler({ dataItem }) {
    this.editService.remove(dataItem);
  }

  private closeEditor(grid, rowIndex = this.editedRowIndex) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
    this.formGroup = undefined;
  }

  onError(error: any, customMessage?: string) {
    this.errorHandler.handleError(
      error,
      ModuleNames.permission_module_tab,
      customMessage
    );
  }
}
