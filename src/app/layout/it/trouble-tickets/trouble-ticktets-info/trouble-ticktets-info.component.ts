import { Component, OnInit } from '@angular/core';
import { MenuService } from 'src/app/core/helper/menu.service';
import { UtilityService } from 'src/app/core/services/utility.service';

@Component({
  selector: 'app-trouble-ticktets-info',
  templateUrl: './trouble-ticktets-info.component.html',
  styleUrls: ['./trouble-ticktets-info.component.scss'],
})
export class TroubleTicktetsInfoComponent implements OnInit {
  isEditable: boolean = false;
  isDisable: boolean = true;
  selectedTab: string = '';
  constructor(public menuService: MenuService,
    public utility: UtilityService) {
    if (localStorage.getItem('isAdmin') == 'true') {

    } else {
      let acc = this.menuService.checkUserViewRights('Trouble Tickets');
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
      this.menuService.checkUserBySubmoduleRights('Trouble Tickets');
    }
  }

  ngOnInit(): void {}

  onTabChange(event) {
    this.selectedTab = event.title;
  }

  onHandleOperation(type) {
    switch (type) {
      case 'edit':
        this.isDisable = false;
        break;
      case 'cancel':
        this.isDisable = true;
        break;
      case 'save':
        this.isDisable = true;
        break;

      default:
        break;
    }
  }
}
