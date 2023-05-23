import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UtilityService } from 'src/app/core/services/utility.service';

@Component({
  selector: 'app-fleet-footer',
  templateUrl: './fleet-footer.component.html',
  styleUrls: ['./fleet-footer.component.scss']
})
export class FleetFooterComponent implements OnInit {
  routName :string;
  public vendorId :number;
  constructor(private location: Location,private router: Router,  public utils: UtilityService) { 
    router.events.subscribe((val) => {
      if(location.path() != ''){
        this.routName = location.path();
      } else {
        this.routName = '/dashboard'
      }
    });
  }

  ngOnInit(): void {
    this.vendorId = parseInt(this.utils.storage.getItem("vendorId"));
    //this.routName =this.router.url;
  }

}
