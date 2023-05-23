import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../core/services/data.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { MenuService } from '../core/helper/menu.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-mediator',
  templateUrl: './mediator.component.html',
  styleUrls: ['./mediator.component.scss']
})
export class MediatorComponent implements OnInit {

  module: string;
  userId: string;
  error: string;
  password: string;
  ipAddress: any;
  latitude: any;
  longitude: any;
  returnUrl: string;
  constructor(private route: ActivatedRoute, private router: Router, protected dataService: DataService, private http: HttpClient,
    private utility: UtilityService, public menuService: MenuService,) {

  }

  ngOnInit(): void {
    this.http.get("https://geolocation-db.com/json/").subscribe((res: any) => {

      this.ipAddress = res.IPv4;
      this.latitude = res.latitude;
      this.longitude = res.longitude;
    });
    this.route.queryParams
      .subscribe(params => {
        this.module = params.module;
        this.userId = (params.userid || params.userId);
        this.password = params.password;
      }
      );

    const formValues = {
      email: this.userId,
      password: this.password,
      rememberMe: false,
      isEncrypted: true,
      encryptPassword: this.password,
      ipAddress: 0,
      macAddress: '',
      latitude: 0,
      longitude: 0
    };
    try {

      formValues.ipAddress = this.ipAddress;
      formValues.latitude = this.latitude;
      formValues.longitude = this.longitude;
      this.dataService.post<any>(`User/Signin`, formValues).subscribe((res: any) => {

        if (res.status == 0) {
          this.error = res.message;
          return false;
        } else {
          if (res["result"].userPermissions != null && res["result"].userPermissions.length == 0) {
            this.error = "You don't have the permission to access Maintain " + this.module + " , please contact admin";
            return false;
          }
          this.utility.storage.setUserData(res["result"])
          this.utility.storage.setItem("typeMediator", 'yes');
          if (res.result.require2FA && !res.result.userPermissions) {
            this.router.navigateByUrl('/auth/login?returnUrl=' + this.module);
          } else {
            if (this.module.toLocaleLowerCase() == 'vendor') {
              this.menuService.checkUserRights('Vendor');
              let acc = this.menuService.checkUserViewRights('vendor');
              if (acc) {
                this.router.navigateByUrl('/vendor');
              }
              else {
                this.error = "Please contact administrator.";
              }
            }
            else if (this.module.toLocaleLowerCase() == 'vehicles') {
              this.menuService.checkUserRights('vehicle');
              let acc = this.menuService.checkUserViewRights('vehicle');
              if (acc) {
                this.router.navigateByUrl('/vehicles');
              }
              else {
                this.error = "Please contact administrator.";
              }
            }else if (this.module.toLocaleLowerCase() == 'timeclock') {
              this.menuService.checkUserRights('Time Clock');
              let acc = this.menuService.checkUserViewRights('Time Clock');
              if (acc) {
                this.router.navigateByUrl('auth/timeclock');
              }
              else {
                this.error = "Please contact administrator.";
              }
            }
          }
        }


      });

    } catch (ew) {
      this.error = 'Module name is wrong.';
    }
    //this.error = 'Module name is wrong.';
  }


}
