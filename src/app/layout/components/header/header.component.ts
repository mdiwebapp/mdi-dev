import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import {
  SavedMenuAddRequestModel,
  SavedMenuViewModel,
} from 'src/app/core/models/basicsetting.model';
import { CurrentUserModel } from 'src/app/core/models/current-user';
import { BasicsettingService } from 'src/app/core/services/basicsetting.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { MenuItem } from '../../../core/constant/menuitem';
import { MenuService } from '../../../core/helper/menu.service';
import { saveAs } from 'file-saver';
import { NetworkDirectoryService } from '../../../../app/layout/networkdirectory/networkdirectorypage/networkdirectory.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  menuList: SavedMenuViewModel[] = [];
  menu: any;
  viewMenu: boolean = true;
  visible: boolean = false;
  typeMediator: string;
  selectedBranch: any = [];
  public kendokaAvatar =
    'https://www.telerik.com/kendo-angular-ui-develop/components/navigation/appbar/assets/kendoka-angular.png';
  userBranch: any[] = [];
  userPermission: any;
  isAdmin: string = 'false';
  show: boolean = false;
  branchCode: any;
  constructor(
    public settingService: BasicsettingService,
    private utils: UtilityService,
    public menuService: MenuService,
    public sessionStorage: StorageService,
    public router: Router,
    private utility: UtilityService,
    public NetworkDirectoryService: NetworkDirectoryService
  ) {
    var ua = navigator.userAgent;

    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(
        ua
      )
    )
      this.viewMenu = false;
    else this.viewMenu = true;
    //this.menuService.checkUserRights('Vendor');
  }
  usermodel: CurrentUserModel;
  branchAll = [
    {
      id: 0,
      value: 'All',
      code: 'All',
    },
  ];
  branch: any[] = [];
  ngOnInit(): void {
    this.typeMediator = this.utility.storage.getItem('typeMediator');
    // this.userBranch = this.utility.storage.CurrentUser.userBranch;
    this.branch = this.branchAll.concat(
      this.utility.storage.CurrentUser.userBranch
    );
    this.utility.storage.setItem(
      'selectedBranch',
      JSON.stringify([{ id: 0, value: 'All', code: 'All' }])
    );
    this.userBranch = this.branch;
    this.selectedBranch.push(this.userBranch[0]);
    this.isAdmin = this.utility.storage.CurrentUser.isAdmin;
    this.userPermission = this.utility.storage.CurrentUser.userPermissions;
    this.GetfavoriteMenu();
    this.usermodel = this.sessionStorage.CurrentUser;
  }

  AddFavorite(menuname, submenuname, menuId,title) {
    var isExist = this.GetFavoriteMenuStatus(menuId);
    if (isExist) {
      this.settingService.DeleteMenu(menuId).subscribe((res) => {
        if (res) {
          if (res['status'] == 200) {
            this.GetfavoriteMenu();
            this.utils.toast.success(res['message']);
          } else this.utils.toast.error(res['message']);
        }
      });
    } else {
      let data = new SavedMenuAddRequestModel();
      data.menuName = menuname;
      data.subMenuName = submenuname;
      data.subMenuId = menuId;
      data.userId = this.utility.storage.CurrentUser.id;
      data.userName = this.utility.storage.CurrentUser.userName;
      data.title = title;
      this.settingService.AddSavedMenu(data).subscribe(
        (res) => {
          if (res) {
            if (res['status'] == 200) {
              this.GetfavoriteMenu();
              this.utils.toast.success(res['message']);
            } else this.utils.toast.error(res['message']);
          }
        },
        (error) => {
          this.utils.toast.error(error['message']);
        }
      );
    }
  }
  redirectOnPage(data) {
    console.log(data)
    if(data == 'schedule-board') {
      this.openpopup()
    }else if(data == 'warranty-log') {
      this.downloadWarrantyLog()
    } else {
      var link = '/' + data.replace(' ', '');
      this.router.navigate([link]);
    }
  }
  GetfavoriteMenu() {
    this.settingService
      .GetSavedMenuList(this.utility.storage.CurrentUser.userId)
      .subscribe((res) => {
        if (res) {
          this.menuList = res;
        } else {
          this.menuList = [];
        }
      });
  }
  displayMenu(value) {
    if (this.userPermission != null) {
      return this.userPermission.find((x) => x.departmentId === value)
        ? true
        : false;
    } else {
      return true;
    }
  }
  displaySubMenu(value) {
    if (this.userPermission != null) {
      return this.userPermission.find((x) => x.permissionModuleId === value)
        ? true
        : false;
    } else {
      return true;
    }
  }

  displaySubTypeMenu(value) {
    // console.log(this.userPermission);
    // console.log(value);
    if (this.userPermission != null) {
      return this.userPermission.find((x) => x.permissionModuleTabId === value)
        ? true
        : false;
    } else {
      return true;
    }
  }

  public getName(id) {
    return MenuItem.MenuName.find((x) => x.id == id).path.trim();
  }

  public GetFavoriteMenuStatus(id) {
    if (this.menuList)
      return this.menuList?.find((x) => x.subMenuId == id) ? true : false;
    else return false;
  }
  logOut() {
    this.utils.storage.clear();
    localStorage.removeItem('typeMediator');
    this.router.navigate(['auth/login/']);
  }
  checkRights(name) {
    if (localStorage.getItem('isAdmin') == 'true') {
      return true;
    }
    let acc = this.menuService.checkUserViewRights(name);

    if (!acc) {
      this.utils.toast.error(
        'User does not have rights to access ' + name + ' module.'
      );
      this.router.navigate(['dashboard']);
      return false;
      //this.router.navigate(['auth/login/']);
    }
  }

  shortcutmenuClick(name) {
    //
    // console.log(localStorage.getItem('Rights'));
    // if (localStorage.getItem("isAdmin") == 'true') {
    //   this.router.navigate([name]);
    // }
    // else {
    //   let acc;
    //   if (name == "customers") {
    //     acc = this.menuService.checkUserViewRights("customer");
    //   }
    //   else if (name == "vehicles") {
    //     acc = this.menuService.checkUserViewRights("vehicle");
    //   }
    //   else {
    //     acc = this.menuService.checkUserViewRights(name);
    //   }
    //   if (!acc) {
    //     this.utils.toast.error("User does not have rights to access " + name + " module.");
    //     this.router.navigate(['dashboard']);
    //     return false;
    //   }
    //   else {
    //     this.router.navigate([name]);
    //   }
    // }
  }
  dedicatedBranchChanges(data: any) {
    // this.selectedBranch = [];
    // values.forEach(element => {
    //   this.selectedBranch.push(element.id);
    // });

    var data1: any[] = [];
    if (data.length >= 1) {
      if (data[0].id === 0) {
        data.forEach((element) => {
          if (element.id != 0) {
            data1.push(element);
          }
        });
      } else if (data[0].id !== 0) {
        data.forEach((element) => {
          if (element.id !== 0) {
            data1.push(element);
          } else {
            data1 = [];
            data1.push({ id: 0, value: 'All', code: 'All' });
          }
        });
      }
    }
    if (data.length === 0) {
      data1 = [];
      data1.push({ id: 0, value: 'All', code: 'All' });
    }
    this.selectedBranch = data1;

    this.utility.storage.setItem('selectedBranch', JSON.stringify(data1));
    this.utils.sendClickEvent(data1);
  }
  public tagMapper(tags: any[]): any[] {
    return tags.sort((tag1: any, tag2: any): number => {
      return tag1['value'] - tag2['value'];
    });
  }
  branchChange() {
    this.show = true;
    this.downloadScheduleBoard();
  }
  closepopup() {
    this.visible = false;
    this.show = false;
  }
  openpopup() {
    this.show = true;
  }
  downloadScheduleBoard() {
    //this.branchCode
    var branch 
    if (this.branchCode == 'All') {
      this.utils.toast.error('Please select branch.');
    } 
    else {
      if(this.branchCode == '%')
      {
        branch = 'MI'
      }
      else
      {
        branch = this.branchCode;
      }
      this.visible = true;
      this.settingService
        .downloadScheduleBoard(branch)
        .subscribe((res) => {
          if (res.status == 200 && res.result) {
            this.visible = false;
            var path = res.result.utilityPath
              .toString().toLowerCase()
              .replace('\\reagan', '\\192.168.0.2');
            var filename = path.split('\\').pop();
            this.visible = true;
            this.NetworkDirectoryService.DownloadFile(
              encodeURI(path)
            ).subscribe((ress) => {
              this.visible = false;
              if (ress.size > 0) {
                saveAs(ress, filename);
                this.show = false;
              }
            });
          } else {
            this.visible = false;
            this.utility.toast.error('File not found.');
          }
        });
    }
  }
  downloadWarrantyLog() {
    this.visible = true;
    this.settingService.downloadWarrantyLog().subscribe((res) => {
      this.visible = false;
      var path = res.result.utilityPath
        .toString()
        .replace('\\reagan', '\\192.168.0.2');
      var filename = path.split('\\').pop();
      this.visible = true;
      this.NetworkDirectoryService.DownloadFile(encodeURI(path)).subscribe(
        (ress) => {
          this.visible = false;
          if (ress.size > 0) {
            saveAs(ress, filename);
         
          }
          else
          {
            this.visible = false;
          }
        }
      );
    });
  }
}
