import { Component, OnInit } from '@angular/core';
import { UtilityService } from 'src/app/core/services/utility.service';

@Component({
  selector: 'app-permissionwrapper',
  templateUrl: './permissionwrapper.component.html',
  styleUrls: ['./permissionwrapper.component.scss']
})
export class PermissionwrapperComponent implements OnInit {

  constructor(public utils: UtilityService) { 
    if (localStorage.getItem('isAdmin') == 'true') {      
    }else{ 
      this.utils.toast.error(
        'You do not have permissions to access this part of the system. Please contact your supervisor so they can request them from IT.'
      );
      setTimeout(() => {
        var url = '/dashboard';
        location.href = url;
      }, 1000);
    }
  }

  ngOnInit(): void {
  }

}
