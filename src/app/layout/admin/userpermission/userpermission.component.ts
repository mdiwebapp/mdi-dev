import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { NotificationService } from '@progress/kendo-angular-notification';
import { orderBy, process, SortDescriptor } from '@progress/kendo-data-query';
import { MenuService } from 'src/app/core/helper/menu.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { UserModel } from '../user/user.model';
import { UserService } from '../user/user.service';
import { Permission } from './userpermission.model';
import { UserPermissionService } from './userpermission.service';
import { PaginationRequest } from '../../../core/models/pagination.model';
import { ErrorHandlerService, PagerService } from 'src/app/core/services';
import { ModuleNames, ErrorMessages } from './../../../core/constant';

@Component({
  selector: 'app-userpermission',
  templateUrl: './userpermission.component.html',
  styleUrls: ['./userpermission.component.scss'],
})
export class UserpermissionComponent implements OnInit {
  @ViewChild(DataBindingDirective) dataBinding: DataBindingDirective;

  data: any;
  user: UserModel[];
  userData: any;
  public skip = 0;
  loader: boolean;
  userId: any;
  tabName: number = 0;
  userPermission: Permission[];
  public mySelection: number[] = [0];
  isDisabled: boolean = true;
  selectedRecord: UserModel;
  hasAdminRole: boolean = false;

  isSave: boolean = true;
  isCancel: boolean = true;
  isEdit: boolean = false;
  totalUsers: number = 0;

  mainTabName = [];
  //  [
  //   { id: 1, text: 'Admin', isActive: false },
  //   { id: 2, text: 'Logistics', isActive: false },
  //   { id: 3, text: 'Operations', isActive: false },
  //   { id: 4, text: 'Sales', isActive: false },
  //   { id: 5, text: 'Service', isActive: false },
  //   { id: 6, text: 'SSG', isActive: false },
  //   { id: 7, text: 'IT', isActive: false },
  // ];
  public sort: SortDescriptor[] = [
    {
      field: 'firstName',
      dir: 'asc',
    },
    {
      field: 'lastName',
      dir: 'asc',
    },
  ];
  module: any;
  moduleName: any;
  userName: any;
  isDepartment: boolean;
  constructor(
    public userservice: UserService,
    public service: UserPermissionService,
    public utils: UtilityService,
    public notificationService: NotificationService,
    public menuService: MenuService,
    public router: Router,
    public pagerService: PagerService,
    public errorHandler: ErrorHandlerService
  ) {
    this.menuService.checkUserRights('userpermission');
    //this.menuService.checkUserBySubmoduleRights('userpermission');
    if (
      this.menuService.isViewRight ||
      this.menuService.isAddRight ||
      this.menuService.isEditRight ||
      this.menuService.isDeleteRight
    ) {
    } else {
      this.router.navigate(['dashboard']);
    }
  }

  ngOnInit(): void {
    this.pagerService.load();
    this.loadItems();
  }

  private loadItems(mergeData?: boolean): void {
    this.loader = true;
    this.userPermission = [];

    var request = new PaginationRequest<any>();
    request.start = this.pagerService.start;
    request.end = this.pagerService.end;
    request.pageSize = this.pagerService.pageSize;
    this.service.GetList(request).subscribe(
      (result) => {
        if (result) {
          this.totalUsers = result.totalRecords;
          // this.pagerService.setHasMore(result.hasMore);
          this.data = result.data; // mergeData ? this.data.concat(result.data) : result.data;
          this.user = [...this.data];
          this.userId = this.user[0].id;
          this.userName = this.data[0].name;
          this.isDepartment = true;
          this.onTabSelect(this.tabName);
          this.editClick(this.data[0]);
          this.loader = false;

          var handleEvent = (event) => {
            this.handleScroll(event);
          };

          this.pagerService.registerScrollEvent(handleEvent);
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.user_permission.get_users);
      }
    );
  }

  public handleScroll(event) {
    if (this.pagerService.enableLoadMoreItems(event)) {
      // the element reach the end of vertical scroll
      this.loadMoreItems();
    }
  }

  public loadMoreItems() {
    if (this.pagerService.hasMore) {
      this.pagerService.loadMore();
      this.loadItems(true);
    }
  }

  private loadMenuItems(): void {
    this.loader = true;
    this.userPermission = [];
    this.service.GetMenuList(this.selectedRecord.id).subscribe(
      (res) => {
        if (res) {
          this.mainTabName = res;
          //this.user = res;
          // this.userId = this.user[0].id;
          // this.userName = this.data[0].name;
          //
          // this.editClick(this.data[0]);
          this.mainTabName.forEach((element) => {
            element.className = 'departmentInactive';
          });

          let data = this.mainTabName.filter((x) => x.isAccess == true)[0];
          this.isDepartment = true;
          this.onTabSelect(data.id);
          this.loader = false;
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.user_permission.get_menu_list);
      }
    );
  }

  public onFilter(inputValue: string): void {
    this.mySelection = [];
    this.data = process(this.user, {
      filter: {
        logic: 'or',
        filters: [
          {
            field: 'name',
            operator: 'contains',
            value: inputValue,
          },
        ],
      },
    }).data;
    this.userData = this.data;
    this.mySelection = [0];
    if (this.data.length > 0) {
      this.editClick(this.data[0]);
    } else {
      this.mainTabName = [];
    }
    this.totalUsers = this.userData.length;
  }

  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.data = {
      data: orderBy(this.userData, this.sort),
      total: this.userData.length,
    };
    this.data = this.data.data;
  }
  departmentChange(event, id) {
    if (id != this.tabName) return;
    else {
      this.isDepartment = event.target.checked;
      if (this.isDepartment) {
      } else {
        if (this.module?.length > 0)
          this.module.forEach((module) => {
            module.isAccess = false;
            module.moduleTabs.forEach((element) => {
              element.isAccess = false;
              this.addUpdatePermission(id, module.id, element.id, 0, false);
              element.actionTyes.forEach((item) => {
                item.isAccess = false;
                this.addUpdatePermission(
                  id,
                  module.id,
                  element.id,
                  item.id,
                  false
                );
              });
            });
          });

        this.userPermission.forEach((element) => {
          if (element.permissionDepartmentId == id) element.isAccess = false;
        });
      }
    }
  }

  onTabSelect(event, isAccess = true) {
    this.isDepartment = isAccess;

    this.tabName = event;
    this.mainTabName.forEach((element) => {
      if (event == element.id) element.className = 'departmentActive';
      else element.className = 'departmentInactive';
    });
    this.onSave();
    this.service.GetDepartmentModules(this.userId, this.tabName).subscribe(
      (res) => {
        if (res) {
          this.moduleName = Array.prototype.map
            .call(res, function (item) {
              return item.moduleName;
            })
            .join(',');
          if (
            this.userPermission.findIndex(
              (c) => c.permissionModuleId == res[0].id
            )
          ) {
            res[0].moduleTabs.forEach((element) => {
              element.actionTyes.forEach((item) => {
                if (item.isAccess) {
                  let obj = new Permission();
                  obj.userId = this.userId;
                  obj.permissionModuleId = res[0].id;
                  obj.PermissionModuleTabId = element.id;
                  obj.PermissionTypeId = item.id;
                  obj.permissionDepartmentId = res[0].departmentId;
                  obj.isAccess =
                    this.hasAdminRole == true ? true : item.isAccess;
                  this.userPermission.push(obj);
                }
              });
            });
            res.forEach((element) => {
              if (element.moduleTabs.find((y) => y.isAccess == true)) {
                element.isAccess = true;
              } else {
                element.isAccess = false;
              }
            });
          }
          this.module = res;
        } else {
          this.module = [];
        }
      },
      (error) => {
        this.onError(
          error,
          ErrorMessages.user_permission.get_department_modules
        );
      }
    );
  }

  editClick(data: any) {
    this.isEdit = false;
    this.isCancel = true;
    this.isDisabled = true;
    this.isSave = true;
    this.module = [];
    this.userId = data.id;
    this.userName = data.name;
    this.userPermission = [];
    // this.onTabSelect('Admin');//(this.tabName);
    this.selectedRecord = data;
    this.loadMenuItems();
    if (data.isAdmin) {
      this.hasAdminRole = true;
      this.mainTabName = [
        { id: 1, text: 'Admin', isActive: true },
        { id: 2, text: 'Logistics', isActive: true },
        { id: 3, text: 'Operations', isActive: true },
        { id: 4, text: 'Sales', isActive: true },
        { id: 5, text: 'Service', isActive: true },
        { id: 6, text: 'SSG', isActive: true },
        { id: 7, text: 'IT', isActive: true },
      ];
    }
  }

  addUpdatePermission(
    DepartmentId,
    PermissionModuleId,
    PermissionModuleTabId,
    PermissionTypeId,
    IsAccess
  ) {
    if (this.userId == null || this.userId == '') {
      this.utils.toast.error('Please select User id from grid data...');
    }

    if (this.userPermission == undefined) {
      this.userPermission = [];
    }

    let isExist = [];
    if (PermissionTypeId != 0) {
      isExist = this.userPermission.filter(
        (item) =>
          item.userId == this.userId &&
          item.permissionModuleId == PermissionModuleId &&
          item.PermissionModuleTabId == PermissionModuleTabId &&
          item.PermissionTypeId == PermissionTypeId
      );
    } else {
      isExist = this.userPermission.filter(
        (item) =>
          item.userId == this.userId &&
          item.permissionModuleId == PermissionModuleId &&
          item.PermissionModuleTabId == PermissionModuleTabId
      );
      let ind = this.module.findIndex((c) => c.id == PermissionModuleId);
      const modul = this.module[ind].moduleTabs.find(
        (c) => c.id == PermissionModuleTabId
      );
    }

    if (PermissionTypeId == 0) {
      let ind = this.module.findIndex((c) => c.id == PermissionModuleId);
      const modul = this.module[ind].moduleTabs.find(
        (c) => c.id == PermissionModuleTabId
      );

      let obj = new Permission();
      obj.userId = this.userId;
      obj.permissionDepartmentId = DepartmentId;
      obj.permissionModuleId = PermissionModuleId;
      obj.PermissionModuleTabId = PermissionModuleTabId;
      obj.PermissionTypeId = 3;
      obj.isAccess = IsAccess;
      this.userPermission.push(obj);

      if (!IsAccess) {
        let ind = this.module.findIndex((c) => c.id == PermissionModuleId);
        const modul = this.module[ind].moduleTabs.find(
          (c) => c.id == PermissionModuleTabId
        );
        modul.actionTyes.forEach((item, index) => {
          item.isAccess = false;
          let aa = this.userPermission.filter(
            (x) =>
              x.permissionDepartmentId == DepartmentId &&
              x.permissionModuleId == PermissionModuleId &&
              x.PermissionModuleTabId == PermissionModuleTabId &&
              x.PermissionTypeId == item.id
          );
          if (aa.length > 0)
            this.userPermission.find(
              (x) =>
                x.permissionDepartmentId == DepartmentId &&
                x.permissionModuleId == PermissionModuleId &&
                x.PermissionModuleTabId == PermissionModuleTabId &&
                x.PermissionTypeId == item.id
            ).isAccess = false;
        });
      }
    } else {
      let obj = new Permission();
      obj.userId = this.userId;
      obj.permissionDepartmentId = DepartmentId;
      obj.permissionModuleId = PermissionModuleId;
      obj.PermissionModuleTabId = PermissionModuleTabId;
      obj.PermissionTypeId = PermissionTypeId;
      obj.isAccess = IsAccess;
      this.userPermission.push(obj);
    }
    // }
  }

  ChangeMainPermission(mdl: any, bool: any) {
    if (!bool)
      mdl.moduleTabs.forEach((element) => {
        element.isAccess = false;
        this.addUpdatePermission(
          mdl.departmentId,
          mdl.id,
          element.id,
          0,
          false
        );
      });
  }
  onSaveUserPermission() {
    const obj = this.userPermission;
    this.service.saveList(obj).subscribe(
      (res) => {
        if (res) {
          if (res['status'] == 200) {
            this.notificationService.show({
              content: res['message'],
              cssClass: 'button-notification',
              animation: { type: 'slide', duration: 400 },
              position: { horizontal: 'center', vertical: 'top' },
              type: { style: 'success', icon: true },
              closable: false,
              hideAfter: 700,
            });
            this.userPermission = [];
            this.onCancel();
          } else this.utils.toast.error(res['message']);
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.user_permission.save);
      }
    );
  }

  onSave() {
    const obj = this.userPermission;
    if (obj.length > 0) {
      this.service.saveList(obj).subscribe(
        (res) => {
          if (res) {
            if (res['status'] == 200) {
              this.userPermission = [];
            } else this.utils.toast.error(res['message']);
          }
        },
        (error) => {
          this.onError(error, ErrorMessages.user_permission.save);
        }
      );
    }
  }

  onEdit() {
    this.isDisabled = false;
    this.isSave = false;
    this.isCancel = false;
    this.isEdit = true;
  }

  onCancel() {
    //this.onTabSelect(this.tabName);
    this.isDisabled = true;
    this.isCancel = true;
    this.isEdit = false;
    this.isSave = true;
    this.editClick(this.selectedRecord);
  }

  onError(error: any, customMessage?: string) {
    this.errorHandler.handleError(
      error,
      ModuleNames.user_permission,
      customMessage
    );
  }
}
