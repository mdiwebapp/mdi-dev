import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DrawerSelectEvent } from '@progress/kendo-angular-layout';
import { VendorFooterComponent } from './logistics/vendor/vendor-footer/vendor-footer.component';
import { FleetFooterComponent } from './admin/it/paul/fleet/fleet-footer/fleet-footer.component';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { PartfooterComponent } from './logistics/parts/partfooter/partfooter.component';
import { ServiceFooterComponent } from './service/serviceorder/service-footer/service-footer.component';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.sass'],
})
export class LayoutComponent implements OnInit {
  @ViewChild(VendorFooterComponent) vendorActivity: VendorFooterComponent;
  @ViewChild(FleetFooterComponent) fleetActivity: FleetFooterComponent;
  @ViewChild(PartfooterComponent) parts: PartfooterComponent;
  @ViewChild(ServiceFooterComponent) serviceFooter: ServiceFooterComponent;
  routName: string;
  public vendorId: string;
  clickEventsubscription: Subscription;
  message: any;

  constructor(private location: Location, private router: Router) {
    router.events.subscribe((val) => {
      if (location.path() != '') {
        this.routName = location.path();
      } else {
        this.routName = '/dashboard';
      }
    });
  }
  ngOnInit() { }
}
