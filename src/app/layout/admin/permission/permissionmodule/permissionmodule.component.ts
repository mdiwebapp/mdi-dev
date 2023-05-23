import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EditService, GridDataResult } from '@progress/kendo-angular-grid';
import { process, State } from '@progress/kendo-data-query';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UtilityService } from '../../../../../../src/app/core/services/utility.service';
import { PermissionmoduleService } from './permissionmodule.service';
import { ModuleNames, ErrorMessages } from 'src/app/core/constant';
import { ErrorHandlerService } from 'src/app/core/services';

@Component({
  selector: 'app-permissionmodule',
  templateUrl: './permissionmodule.component.html',
  styleUrls: ['./permissionmodule.component.scss'],
})
export class PermissionmoduleComponent implements OnInit {
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

  constructor(
    public service: PermissionmoduleService,
    public utils: UtilityService,
    public errorHandler: ErrorHandlerService
  ) {}

  public ngOnInit(): void {
    this.GetList();
  }

  GetList() {
    this.service.PermissionModuleList().subscribe(
      (res) => {
        this.module = res;
      },
      (error) =>
        this.onError(
          error,
          ErrorMessages.permission_module.permission_module_list
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
      moduleName: new FormControl('', Validators.required),
      departmentId: new FormControl('', Validators.required),
    });

    sender.addRow(this.formGroup);
  }

  public editHandler({ sender, rowIndex, dataItem }) {
    this.closeEditor(sender);
    this.GetDepartment();
    this.formGroup = new FormGroup({
      id: new FormControl(dataItem.id),
      moduleName: new FormControl(dataItem.moduleName),
      departmentId: new FormControl(dataItem.departmentId),
    });

    this.editedRowIndex = rowIndex;

    sender.editRow(rowIndex, this.formGroup);
  }

  public cancelHandler({ sender, rowIndex }) {
    this.closeEditor(sender, rowIndex);
  }

  public saveHandler({ sender, rowIndex, formGroup, isNew }) {
    let data = formGroup.value;
    data.PermissionDepartmentId = data.departmentId;
    data.PermissionDepartmentId = data.departmentId;

    this.service.SaveModule(data).subscribe(
      (res) => {
        if (res['status'] == 200) {
          this.utils.toast.success(res['message']);
          this.GetList();
        } else this.utils.toast.error(res['message']);
      },
      (error) =>
        this.onError(error, ErrorMessages.permission_module.save_module)
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

  private onError(error: any, customMessage?: string) {
    this.errorHandler.handleError(
      error,
      ModuleNames.permission_module,
      customMessage
    );
  }
}
