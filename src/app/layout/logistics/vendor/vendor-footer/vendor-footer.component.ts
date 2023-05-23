import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UtilityService } from 'src/app/core/services/utility.service';
import { environment } from 'src/environments/environment';
import { VendorService } from '../vendor/vendor.service';
import * as fileSaver from 'file-saver';
import { ModuleNames, ErrorMessages } from 'src/app/core/constant';
import { ErrorHandlerService } from 'src/app/core/services';

@Component({
  selector: 'app-vendor-footer',
  templateUrl: './vendor-footer.component.html',
  styleUrls: ['./vendor-footer.component.scss'],
})
export class VendorFooterComponent implements OnInit {
  routName: string;
  public vendorId: string;
  clickEventsubscription: Subscription;
  message: any;

  constructor(
    private location: Location,
    private router: Router,
    public utils: UtilityService,
    public service: VendorService,
    public errorHandler: ErrorHandlerService
  ) {
    //this.vendorId =Constants.vendorId;
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
    //this.vendorId = parseInt(this.utils.storage.getItem("vendorId"));
    //this.routName =this.router.url;
  }
  callBack(value) {
    var data = JSON.stringify(value);
    this.vendorId = data;
  }
  public exportToExcel() {
    //window.open(environment.apiUrl + 'Vendor/' + this.vendorId + '/partsexport');
    this.service.downloadFile(this.vendorId).subscribe(
      (res) => {
        let data = new Blob([res], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;',
        });
        fileSaver.saveAs(data, 'Vendor_parts.xlsx');
      },
      (error) => {
        this.errorHandler.handleError(
          error,
          ModuleNames.vendor_footer,
          ErrorMessages.vendor.download_file
        );
      }
    );
  }
}
