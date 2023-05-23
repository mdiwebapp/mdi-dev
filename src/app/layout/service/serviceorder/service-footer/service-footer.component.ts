import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UtilityService } from 'src/app/core/services/utility.service';
import { environment } from 'src/environments/environment';
import * as fileSaver from 'file-saver';
import { ModuleNames, ErrorMessages } from 'src/app/core/constant';
import { ErrorHandlerService } from 'src/app/core/services';
import { ServiceOrderComponent } from '../service-order/service-order.component';
import { ServiceOrderService } from '../service-order/service-order.service';
@Component({
  selector: 'app-service-footer',
  templateUrl: './service-footer.component.html',
  styleUrls: ['./service-footer.component.scss']
})
export class ServiceFooterComponent implements OnInit {
  routName: string;
  clickEventsubscription: Subscription;
  message: any;
  soMessage: any;
  componnet: string;
  isDisable: boolean = true;
  constructor(private location: Location, public service: ServiceOrderService,
    private router: Router,
    public utils: UtilityService,
    public errorHandler: ErrorHandlerService) {
    router.events.subscribe((val) => {
      if (location.path() != '') {
        this.routName = location.path();
      } else {
        this.routName = '/dashboard';
      }
    });
  }

  ngOnInit(): void {
    this.clickEventsubscription = this.utils
      .vengetClickEvent()
      .subscribe((a) => {
        this.message = a;
        this.callBack(this.message);
      });
      this.clickEventsubscription = this.utils
      .soGetClickEvent()
      .subscribe((a) => {
        this.soMessage = a;
        this.socallBack(this.soMessage);
      });
  }
  callBack(value) {
    //var data = JSON.stringify(value);
    this.componnet = value;
    if (this.componnet.split('_')[2]) { 
    }else{
      this.isDisable=false;
    }
  }
  socallBack(value) {
    //var data = JSON.stringify(value);
    
      this.isDisable=value;
    
  }
  componentSwap() {
    if (this.service.componentized) {
      var invNumber = this.componnet;
      localStorage.setItem('InvNumber', invNumber);
      window.open('/componentswap', '_blank');
    }else{
      this.isDisable=false;
    }
  }
}
