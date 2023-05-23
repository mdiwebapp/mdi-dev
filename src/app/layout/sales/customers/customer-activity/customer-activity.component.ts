import { Component, Input, OnInit } from '@angular/core';
import { CustomerService } from '../customer/customer.service';
import { ModuleNames, ErrorMessages } from 'src/app/core/constant';
import { ErrorHandlerService } from 'src/app/core/services';
@Component({
  selector: 'app-customer-activity',
  templateUrl: './customer-activity.component.html',
  styleUrls: ['./customer-activity.component.scss'],
})
export class CustomerActivityComponent implements OnInit {
  products: any = [];
  skip: number;
  customerId: any;
  data: any;
  activity: any;
  iscalllog: boolean = true;
  isnotes: boolean = true;
  isalljobs: boolean = true;
  isactivatedjobs: boolean = true;
  constructor(
    public service: CustomerService,
    public errorHandler: ErrorHandlerService
  ) {}
  @Input() onChange;

  ngOnInit(): void {
    this.onChange.subscribe((res) => {
      if (res) {
        this.customerId = res.id;
        this.ActivityList();
      }
    });

    this.products = [
      {
        Date: '11/11/2020',
        ProductName: 'Leonard',
        UnitPrice: 'Website',
        Discontinued: '33',
        newValue: 'ww.mersino.in',
      },
      {
        Date: '8/27/2019',
        ProductName: 'Thornton',
        UnitPrice: 'Phone',
        Discontinued: '22',
        newValue: 'ww.sd.ds',
      },
      {
        Date: '8/27/2019',
        ProductName: 'Thornton',
        UnitPrice: 'Phone',
        Discontinued: '22',
        newValue: 'ww.sd.ds',
      },
      {
        Date: '8/27/2019',
        ProductName: 'Thornton',
        UnitPrice: 'Phone',
        Discontinued: '22',
        newValue: 'ww.sd.ds',
      },
      {
        Date: '8/27/2019',
        ProductName: 'Thornton',
        UnitPrice: 'Phone',
        Discontinued: '22',
        newValue: 'ww.sd.ds',
      },
    ];
  }

  ActivityList() {
    this.service.GetActivityByCustomerId(this.customerId).subscribe(
      (res) => {
        if (res) {
          this.data = res;
          this.activity = res;
        } else {
          this.data = [];
        }
      },
      (error) => {
        this.errorHandler.handleError(
          error,
          ModuleNames.customer_activity,
          ErrorMessages.customer.get_activity_by_customer_id
        );
      }
    );
  }
  calllog() {
    this.iscalllog = !this.iscalllog;
    this.filterActivity();
  }
  notes() {
    this.isnotes = !this.isnotes;
    this.filterActivity();
  }
  alljobs() {
    this.isalljobs = !this.isalljobs;
    this.filterActivity();
  }
  activatedjobs() {
    this.isactivatedjobs = !this.isactivatedjobs;
    this.filterActivity();
  }

  filterActivity() {
    let tempdata = [];
    if (this.isnotes) {
      let result = this.data.filter((x) => x.activityType == 'Notes');
      tempdata.push(...result);
    }

    if (this.iscalllog) {
      let result = this.data.filter((x) => x.activityType == 'Call Log');
      tempdata.push(...result);
    }

    if (this.isalljobs) {
      let result = this.data.filter(
        (x) => x.id.charAt(0) == 'J' && x.status == null
      );
      tempdata.push(...result);
    }

    if (this.isactivatedjobs) {
      let result = this.data.filter(
        (x) => x.id.charAt(0) == 'J' && x.status != null
      );
      tempdata.push(...result);
    }

    this.activity = tempdata;
  }
}
