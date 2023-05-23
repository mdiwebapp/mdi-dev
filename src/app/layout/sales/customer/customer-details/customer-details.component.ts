import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from 'src/app/core/services';
import { DropdownService } from 'src/app/core/services/dropdown.service';
import { CustomAddress } from 'src/app/layout/ssg/google-map-address/address.model';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.scss'],
})
export class CustomerDetailsComponent implements OnInit, OnChanges {
  @Input() form: FormGroup;
  @Input() disableCustomer: boolean;
  @Input() allBranches: any = [];
  @Input() customerTypes: any = [];
  @Input() accountManagers: any = [];
  @Input() selectedCustomer: any;

  custDetailsForm: FormGroup;
  calllog_btn: any = [];
  isCalllogFormVisible: boolean = false;
  isConfirmationDialog: boolean = false;
  branchVisible: boolean = false;
  customerTypeVisible: boolean = false;
  accountManagerVisible: boolean = false;
  fullAddress: string = '';
  fullAdressLable: string;
  states: any = [];
  public addressExpanded: boolean = false;
  //   {
  //     value: 'AB',
  //     label: 'Alberta',
  //   },
  //   {
  //     value: 'AK',
  //     label: 'Alaska',
  //   },
  //   {
  //     value: 'AL',
  //     label: 'Alabama',
  //   },
  // ];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private dataService: DataService,
    private dropdownService: DropdownService
  ) {}

  ngOnInit(): void {
    this.onLoadState();
  }

  ngOnChanges(changes: SimpleChanges): void {}

  redirectOnCallLog() {
    var custId = localStorage.getItem('callCustomer');
    this.router
      .navigate([])
      .then(() => window.open('/calllogs?customerId=' + custId, '_blank'));
  }

  onInitForm(value) {
    this.custDetailsForm = this.formBuilder.group({
      name: value?.name || '',
      firstName: value?.firstName || '',
      lastName: value?.lastName || '',
      branch: value?.branch || '',
      address: value?.address || '',
      states: value?.state || '',
    });
  }

  onSelectionChange(type, event) {
    switch (type) {
      case 'branch':
        let selectedBranch = this.allBranches.find(
          (item) => item.code === event
        );
        this.form.setValue({
          ...this.form.value,
          branch: event,
          branchName: selectedBranch?.value,
        });
        this.branchVisible = !this.branchVisible;
        break;
      case 'customer_type':
        this.form.setValue({
          ...this.form.value,
          customerType: event,
        });
        this.customerTypeVisible = !this.customerTypeVisible;
        break;
      case 'account_manager':
        this.form.setValue({
          ...this.form.value,
          employeeNumber: event,
          employeeName: this.accountManagers.find((c) => c.id == event).value,
        });
        this.accountManagerVisible = !this.accountManagerVisible;
        break;
      case 'states':
        this.form.setValue({
          ...this.form.value,
          states: event,
        });
        break;
      default:
        break;
    }
  }

  // onLoadState() {
  //   this.dropdownService.GetEmployee().subscribe((result) => {
  //     this.state = this.allstate = [{ id: 'All', value: 'All' }, ...result];
  //   });
  // }
  onLoadState() {
    this.dropdownService.GetLookupList('States').subscribe((result) => {
      if (result?.length) {
        this.states = result;
      } else {
        this.states = [];
      }
    });
  }

  onHandleOperation(value) {
    switch (value) {
      case 'branch':
        this.branchVisible = !this.branchVisible;
        break;
      case 'customer_type':
        this.customerTypeVisible = !this.customerTypeVisible;
        break;
      case 'account_manager':
        this.accountManagerVisible = !this.accountManagerVisible;
        break;
      default:
        break;
    }
  }

  copyContent() {
    window.open(
      'https://www.google.com/maps?q=loc:' + this.form.get('address').value,
      '_blank'
    );
  }

  GetAddress(data: CustomAddress) {
    if (data.flag) {
      console.log(this.form.value);
      // this.form.setValue({
      //   ...this.form.value,
      //   address: data?.address1,
      //   address2: data?.address2,
      //   city: data?.city,
      //   state: data?.state,
      //   country: data?.country,
      //   zip: data?.postalcode,
      // });
      this.form.value({});

      this.fullAddress = Object.values(data).join(',');
    } else {
      this.form.patchValue({
        address: data.address1 != undefined ? data.address1 : '',
      });
    }
    // if (data.flag) {
    //   this.form.patchValue({
    //     billingAddress_address: '',
    //     billingAddress_address2: '',
    //     billingAddress_city: '',
    //     billingAddress_state: '',
    //     billingAddress_zip: '',
    //   });
    //   let fulladdarray = [
    //     data.address1 + ' ' + data.address2,
    //     data.city,
    //     data.state,
    //   ];
    //   this.fullAdressLable =
    //     fulladdarray.filter((x) => x != '' && x != null).join(', ') +
    //     '-' +
    //     data.postalcode;
    //   let addarray = [data.address1 + ' ' + data.address2]; //, data.city, data.state
    //   this.fullAddress = addarray.join(', '); // + "-" + data.postalcode;
    //   this.form.patchValue({
    //     billingAddress_address:
    //       this.fullAddress != undefined ? this.fullAddress : '',
    //     //billingAddress_address2: data.address2 != undefined ? data.address2 : "",
    //     billingAddress_city: data.city != undefined ? data.city : '',
    //     billingAddress_state: data.state != undefined ? data.state : '',
    //     billingAddress_zip: data.state != undefined ? data.postalcode : '',
    //   });
    // } else {
    //   let olddata = this.form.value;
    //   this.form.patchValue({
    //     billingAddress_address: data.address1 != undefined ? data.address1 : '',
    //   });

    //   let fulladdarray = [
    //     data.address1,
    //     olddata.address2,
    //     olddata.city,
    //     olddata.state,
    //   ];
    //   this.fullAdressLable =
    //     fulladdarray.filter((x) => x != '' && x != null).join(', ') +
    //     '-' +
    //     olddata.zip;
    //   let addarray = [data.address1, data.address2];
    //   if (
    //     data.address2 != '' &&
    //     data.address2 != undefined &&
    //     data.address2 != null
    //   )
    //     this.fullAddress = addarray.join(', ');
    //   else this.fullAddress = data.address1;
    // }
    // this.form.markAsDirty();
  }
}
