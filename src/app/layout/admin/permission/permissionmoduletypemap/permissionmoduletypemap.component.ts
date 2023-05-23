import { UtilityService } from 'src/app/core/services/utility.service';
import { PermissionmoduleService } from '../permissionmodule/permissionmodule.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EditService, GridDataResult } from '@progress/kendo-angular-grid';
import { process, State } from '@progress/kendo-data-query';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  PermissionModuleMapModel,
  PermissionTypeModel,
} from '../permissionmodule/permissionmodule.model';
import { ErrorHandlerService } from 'src/app/core/services';
import { ModuleNames, ErrorMessages } from 'src/app/core/constant';

@Component({
  selector: 'app-permissionmoduletypemap',
  templateUrl: './permissionmoduletypemap.component.html',
  styleUrls: ['./permissionmoduletypemap.component.scss'],
})
export class PermissionmoduletypemapComponent implements OnInit {
  moduleTab: any;
  permissionType: any;
  selectedType: any;
  permissionModuleTabId: any;
  data: any[];
  filterinput: string;
  constructor(
    public service: PermissionmoduleService,
    public utils: UtilityService,
    public errorHandler: ErrorHandlerService
  ) {}
  public view: Observable<GridDataResult>;
  public gridState: State = {
    sort: [],
    skip: 0,
    take: 10,
  };
  public formGroup: FormGroup;

  private editService: EditService;
  private editedRowIndex: number;
  public ngOnInit(): void {
    this.GetList();
    this.GetPermissionTypeList();
  }

  GetList() {
    this.service.PermissionModuleTabList().subscribe(
      (res) => {
        this.moduleTab = res;
        this.data = res;
        if (this.filterinput) this.onFilter(this.filterinput);
      },
      (error) =>
        this.onError(
          error,
          ErrorMessages.permission_module.permission_module_tab_list
        )
    );
  }

  GetPermissionTypeList() {
    this.service.PermissionType().subscribe(
      (res) => {
        this.permissionType = res;
      },
      (error) =>
        this.onError(error, ErrorMessages.permission_module.permission_type)
    );
  }

  PermissionModuleMapping(value) {
    this.service.PermissionModuleMapping(value).subscribe(
      (res) => {
        this.selectedType = [];
        debugger;
        res.map((d) => {
          let obj = new PermissionTypeModel();
          obj.id = d.permissionTypeId;
          obj.typeName = this.permissionType.find(
            (x) => x.id == d.permissionTypeId
          ).typeName;
          this.selectedType.push(obj);
        });
      },
      (error) =>
        this.onError(
          error,
          ErrorMessages.permission_module.permission_module_mapping
        )
    );
  }

  public onStateChange(state: State) {
    this.gridState = state;

    // this.editService.read();
  }

  public editHandler({ sender, rowIndex, dataItem }) {
    this.closeEditor(sender);
    this.permissionModuleTabId = dataItem.id;
    this.PermissionModuleMapping(dataItem.id);
    this.editedRowIndex = rowIndex;

    sender.editRow(rowIndex, this.formGroup);
  }

  public cancelHandler({ sender, rowIndex }) {
    this.closeEditor(sender, rowIndex);
  }

  public saveHandler({ sender, rowIndex, formGroup, isNew }) {
    let data = [];
    debugger;
    this.selectedType.map((d) => {
      let obj = new PermissionModuleMapModel();
      obj.permissionModuleTabId = this.permissionModuleTabId;
      obj.permissionTypeId = d.id;
      data.push(obj);
    });

    this.service.SavePermissionModuleMapping(data).subscribe(
      (res) => {
        if (res['status'] == 200) {
          this.utils.toast.success(res['message']);
          this.GetList();
        } else this.utils.toast.error(res['message']);
      },
      (error) =>
        this.onError(
          error,
          ErrorMessages.permission_module.save_permission_module_mapping
        )
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

  public onFilter(inputValue: string): void {
    this.filterinput = inputValue;
    this.data = process(this.moduleTab, {
      filter: {
        logic: 'or',
        filters: [
          {
            field: 'permissionDepartmentName',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'moduleName',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'tabName',
            operator: 'contains',
            value: inputValue,
          },
        ],
      },
    }).data;
  }

  onError(error: any, customMessage?: string) {
    this.errorHandler.handleError(
      error,
      ModuleNames.permission_module_type_map,
      customMessage
    );
  }
}
