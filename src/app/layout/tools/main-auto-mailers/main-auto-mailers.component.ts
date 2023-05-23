import { Component, OnInit } from '@angular/core';
import { MenuService } from 'src/app/core/helper/menu.service';
import { UtilityService } from 'src/app/core/services/utility.service';

@Component({
  selector: 'app-main-auto-mailers',
  templateUrl: './main-auto-mailers.component.html',
  styleUrls: ['./main-auto-mailers.component.scss'],
})
export class MainAutoMailersComponent implements OnInit {
  disableMaintainITForm: boolean = false;
  // isAddble: boolean = false;
  // isEditable: boolean = false;
  isCreatable: boolean = false;
  isEditable: boolean = false;
  selectedTab: string = 'Report Routing';
  isSavebuttonclick: boolean = false;
  isAddbuttonclick : boolean = false;
  isCancelbuttonclick: boolean = false;
  isEditbuttonclick: boolean = false;
  constructor( public menuService: MenuService,
    public utility: UtilityService) {
    if (localStorage.getItem('isAdmin') == 'true') {

    } else {
      let acc = this.menuService.checkUserViewRights('Maintain Auto Mailers');
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
      this.menuService.checkUserBySubmoduleRights('Maintain Auto Mailers');
    }
  }

  ngOnInit(): void {}

  onHandleOperation(type) {
    switch (type) {
      case 'new':
        this.disableMaintainITForm = true;
        this.isAddbuttonclick = true;
        this.isCancelbuttonclick = false;
        this.isEditbuttonclick = false;
        // this.isCreatable = !this.isCreatable;
        // this.isEditable = !this.isEditable;
        // this.disableMaintainITForm = true;
        // this.onInitForm({});
        break;
      case 'edit':
        this.disableMaintainITForm = true;
        this.isEditbuttonclick = true;
        this.isCancelbuttonclick = false;
        this.isAddbuttonclick = false;
        // this.isCreatable = !this.isCreatable;
        // this.isEditable = !this.isEditable;
        // this.disableMaintainITForm = false;
        break;
      case 'cancel':
        this.disableMaintainITForm = false;
        this.isCancelbuttonclick = true;
        this.isEditbuttonclick = false;
        this.isAddbuttonclick = false;
        // this.isCreatable = !this.isCreatable;
        // this.isEditable = !this.isEditable;
        // this.disableEmployee = true;
        break;
      case 'save':
        this.isSavebuttonclick = true;
        // this.isCreatable = !this.isCreatable;
        // this.isEditable = !this.isEditable;
        // this.disableEmployee = true;
        break;
      default:
        break;
    }
  }

  onTabChange(event) {
    this.selectedTab = event.title;
  }

  saveITData(data: any) {
    this.isSavebuttonclick = false;
    this.isAddbuttonclick = false;
    this.isEditbuttonclick = false;
    this.disableMaintainITForm = false;
  }

  notsaveITData(data: any) {
    this.isSavebuttonclick = false;
    this.disableMaintainITForm = true;
  }
}
