import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-call-logform',
  templateUrl: './call-logform.component.html',
  styleUrls: ['./call-logform.component.scss'],
})
export class CallLogformComponent implements OnInit {
  @Input() customer: FormGroup;
  form: FormGroup;
  mdiRepList: any = [
    {
      label: 'all',
      value: 'All',
    },
    {
      label: 'abernathy,Kevin',
      value: 'Abernathy,Kevin',
    },
    {
      label: 'barr,jason',
      value: 'Barr,Jason',
    },
    {
      label: 'beaty,jeremy',
      value: 'Beaty,Jeremy',
    },
  ];
  branchList: any = [
    {
      label: 'mi',
      value: 'MI',
    },
    {
      label: 'chi',
      value: 'CHI',
    },
    {
      label: 'hou',
      value: 'HOU',
    },
    {
      label: 'nc',
      value: 'NC',
    },
  ];
  customerList: any = [
    {
      label: '5 star maintenance, LLC',
      value: '5 Star Maintenance, LLC',
    },
    {
      label: '5 Star Septic',
      value: '5 Star Septic',
    },
    {
      label: '5 Star Services, Inc',
      value: '5 Star Services, Inc',
    },
    {
      label: '8-KOI',
      value: '8-KOI',
    },
  ];
  customerTypeList: any = [
    {
      label: 'Industrial',
      value: 'Industrial',
    },
    {
      label: 'landfill',
      value: 'Landfill',
    },
    {
      label: 'marine',
      value: 'Marine',
    },
    {
      label: 'Mining',
      value: 'Mining',
    },
  ];
  stateList: any = [
    {
      label: 'ab',
      value: 'AB',
    },
    {
      label: 'ak',
      value: 'AK',
    },
    {
      label: 'bc',
      value: 'BC',
    },
    {
      label: 'ct',
      value: 'CT',
    },
  ];
  contactTypeList: any = [
    {
      label: 'phone',
      value: 'PHONE',
    },
    {
      label: 'in person',
      value: 'IN PERSON',
    },
    {
      label: 'e-mail',
      value: 'E-MAIL',
    },
  ];
  contactReasonList: any = [
    {
      label: 'job',
      value: 'JOB',
    },
    {
      label: 'cold-call',
      value: 'COLD-CALL',
    },
    {
      label: 'rfq',
      value: 'RFQ',
    },
  ];
  rentalList: any = [];
  salesList: any = [];
  displayRentalDrp: boolean = false;
  displaySalesDrp: boolean = false;
  displayFollowUpSection: boolean = false;
  displayMDIProjectSection: boolean = false;
  followUpReasonList: any = [];
  followUpMethodList: any = [];
  jobNumberList: any = [];
  displayJobSearch: boolean = false;
  existingCustomerList: any = [];
  displayExistingCustomer: boolean = false;
  displayInvalidPopup: boolean = false;

  constructor(private formBuilder: FormBuilder, public router: Router) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.form = this.formBuilder.group({
      callDate: [],
      mdiRepData: [],
      mdiBranch: [],
      customerData: [],
      customerType: [],
      address1: [],
      address2: [],
      city: [],
      state: [],
      zipCode: [],
      phone: [],
      fax: [],
      contactName1: [],
      contactName2: [],
      existingContact: [false],
      phoneContact: [],
      position: [],
      mobile: [],
      email: [],
      creditAppSent: [false],
      contactTypeData: [],
      contactReasonData: [],
      pumps: [false],
      dewatering: [false],
      trenching: [false],
      power: [false],
      environmental: [false],
      rental: [false],
      sales: [false],
      rentalData: [],
      salesData: [],
      vendor: [],
      comments: [],
      followUp: [false],
      mdiProject: [false],
      followUpDate: [],
      followUpReason: [],
      followUpMethod: [],
      jobNumber: [],
      existingCustomer: [],
    });
  }

  rentalChange(event) {
    this.displayRentalDrp = !this.displayRentalDrp;
  }
  salesChange(event) {
    this.displaySalesDrp = !this.displaySalesDrp;
  }
  onFollowUpSection(status) {
    this.displayFollowUpSection = !this.displayFollowUpSection;
  }
  onMDIProjectSection(status) {
    this.displayMDIProjectSection = !this.displayMDIProjectSection;
  }
  onJobSearch() {
    this.displayJobSearch = !this.displayJobSearch;
  }

  onCustomer() {
    this.router.navigate(['customers']);
  }
  public close(status) {
    if (status == 'cancel') {
      this.displayJobSearch = !this.displayJobSearch;
    } else {
      this.displayJobSearch = !this.displayJobSearch;
    }
  }
  onExistingContact($event) {
    this.displayExistingCustomer = !this.displayExistingCustomer;
  }

  onSubmit() {
    this.displayInvalidPopup = !this.displayInvalidPopup;
  }
  public closeSubmit(status) {
    if (status == 'cancel') {
      this.displayInvalidPopup = !this.displayInvalidPopup;
    } else {
      this.displayInvalidPopup = !this.displayInvalidPopup;
    }
  }
}
