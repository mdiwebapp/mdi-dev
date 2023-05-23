import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SortDescriptor } from '@progress/kendo-data-query';
import { DataService } from 'src/app/core/services';
import { UtilityService } from 'src/app/core/services/utility.service';
import { customerData } from 'src/data/customer-data';

@Component({
  selector: 'app-contacts-details',
  templateUrl: './contacts-details.component.html',
  styleUrls: ['./contacts-details.component.scss'],
})
export class ContactsDetailsComponent implements OnInit, OnChanges {
  form: FormGroup;
  contacts: any = [];
  @Input() disableCustomer: boolean;
  @Input() selectedCustomer: any;
  selectedContact: any;
  customer: any;
  selectable: boolean = true;

  sort: SortDescriptor[] = [];
  selections: any = [0];
  skip: number = 0;
  multiple: any = [];
  roleTypeVisible: boolean = false;
  roleTypeData: any = [
    {
      label: 'Accounts Payable',
      value: 'accounts payable',
    },
    {
      label: 'Buyer',
      value: 'buyer',
    },
    {
      label: 'Decision Maker',
      value: 'decision maker',
    },
    {
      label: 'End User',
      value: 'end user',
    },
    {
      label: 'Gate Keeper',
      value: 'gate keeper',
    },
    {
      label: 'Influencer',
      value: 'influencer',
    },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private utilityService: UtilityService
  ) {}

  ngOnInit(): void {
    this.onInitForm({});
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.selectedCustomer.id !== this.customer?.id) {
      this.onLoadContacts();
      this.customer = this.selectedCustomer;
    }
  }

  onResizeColumn(event) {}

  onLoadContacts() {
    this.dataService
      .get(`Customer/${this.selectedCustomer?.id}/Contacts`)
      .subscribe((result: any) => {
        if (result?.length) {
          this.contacts = result;
          if (!this.selectedContact) {
            this.onInitForm(result[0]);
            this.selectedContact = result[0];
            this.selections = [0];
          }
          this.selectable = true;
        } else {
          this.contacts = [];
          this.onInitForm({});
          this.selectedContact = null;
        }
      });
  }

  onInitForm(value) {
    this.form = this.formBuilder.group({
      firstName: [value?.firstName || '', [Validators.required]],
      lastName: [value?.lastName || '', [Validators.required]],
      role: value?.role ,
      location: value?.location ,
      title: [value?.title || '', [Validators.required]],
      office: value?.office ,
      cellPhone: value?.cellPhone ,
      email: value?.email ,
      note: value?.note ,
      phone :value?.note ,
      field:value?.field ,
      createdBy : value?.createdBy 
    });
    
  }

  onUpdateContacts() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return false;
    }
    let payload = {
      id: this.selectedContact?.id || 0,
      customerId: this.selectedCustomer?.id || 0,
      userName: JSON.parse(localStorage.getItem('currentUser')).userName,
      user_PK: JSON.parse(localStorage.getItem('currentUser')).id,
      ...this.form.value,
    };
    this.dataService
      .put(`Customer/Contact`, payload)
      .subscribe((result: any) => {
        if (result?.status === 200) {
          this.form.reset();
          this.disableCustomer = !this.disableCustomer;
          this.utilityService.toast.success(result?.message);
          // this.selectable = true;
          this.onLoadContacts();
        } else {
          this.utilityService.toast.error(result?.message);
          this.disableCustomer = false;
        }
      });
  }

  onRowSelect(event) {
    this.selectedContact = event?.selectedRows[0].dataItem;
    this.onInitForm(event?.selectedRows[0].dataItem);
    // this.form.setValue({
    //   firstName: event?.selectedRows[0].dataItem?.firstName || '',
    //   lastName: event?.selectedRows[0].dataItem?.lastName || '',
    //   role: event?.selectedRows[0].dataItem?.role || '',
    //   location: event?.selectedRows[0].dataItem?.location || '',
    //   title: event?.selectedRows[0].dataItem?.title || '',
    //   office: event?.selectedRows[0].dataItem?.office || '',
    //   cellPhone: event?.selectedRows[0].dataItem?.cellPhone || '',
    //   email: event?.selectedRows[0].dataItem?.email || '',
    //   note: event?.selectedRows[0].dataItem?.note || '',
    // });
  }

  onSortChange(event) {}

  onReOrderColumns(event) {}

  onDataStateChange(event) {}

  onSelectionChange(type, event) {
    switch (type) {
      case 'role':
        this.form.setValue({
          ...this.form.value,
          role: event,
        });
        this.roleTypeVisible = !this.roleTypeVisible;
        break;
      default:
        break;
    }
  }

  onHandleOperation(value) {
    switch (value) {
      case 'role':
        this.roleTypeVisible = !this.roleTypeVisible;
        break;
      default:
        break;
    }
  }
}
