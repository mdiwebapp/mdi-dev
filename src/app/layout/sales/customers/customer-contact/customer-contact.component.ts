import { Component, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerContactService } from './customer-contact.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { orderBy, process, SortDescriptor } from '@progress/kendo-data-query';
import { ModuleNames, ErrorMessages } from 'src/app/core/constant';
import { ErrorHandlerService } from 'src/app/core/services';
@Component({
  selector: 'app-customer-contact',
  templateUrl: './customer-contact.component.html',
  styleUrls: ['./customer-contact.component.scss'],
})
export class CustomerContactComponent implements OnInit {
  @Input() onChange;
  form: FormGroup;
  skip: number;
  isSave: boolean = true;
  isCancel: boolean = true;
  id: number = 0;
  customerId: any;
  isAdd: boolean;
  data: any;
  contacts: any;
  isEdit: boolean;
  mySelection: number[] = [0];
  contactsFilter: any;
  tempId: number;
  @Output() dialogOpened: boolean = false;
  @Output() errorMsg: any;
  constructor(
    private formBuilder: FormBuilder,
    public service: CustomerContactService,
    private utils: UtilityService,
    public errorHandler: ErrorHandlerService
  ) {}
  public sort: SortDescriptor[] = [
    {
      field: 'firstName',
      dir: 'asc',
    },
  ];
  ngOnInit(): void {
    this.initForm();
    this.onChange.subscribe((res) => {
      if (res) {
        this.customerId = res.id;
        this.data = res.contacts;

        this.contacts = res.contacts;
        this.contactsFilter = res.contacts;
        if (this.data != null || this.data.length > 0)
          this.editClick(this.data[0].id);
      }
    });
    this.form.disable();
  }
  initForm(): void {
    this.form = this.formBuilder.group({
      id: ['0'],
      userName: [null],
      customerId: [null],
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      title: [null, Validators.required],
      cellPhone: [null],
      office: [null],
      email: [null, [Validators.email]],
      location: [null],
      role: [null],
      note: [null],
    });
  }
  editClick(data: any) {
    if (data) {
      this.tempId = data;
      this.service.GetContactsById(data).subscribe(
        (res) => {
          if (res) {
            this.contacts = res;
            this.setValue(this.contacts);
          } else {
            this.data = [];
          }
        },
        (error) => {
          this.onError(error, ErrorMessages.customer.get_contacts_by_id);
        }
      );
    }
  }
  setValue(data: any) {
    this.form.setValue({
      id: data.id,
      userName: '',
      customerId: this.customerId,
      firstName: data.firstName,
      lastName: data.lastName,
      title: data.title,
      cellPhone: data.cellPhone,
      office: data.office,
      email: data.email,
      location: data.location,
      role: data.role,
      note: data.note,
    });
  }

  btnCancel() {
    this.id = 0;
    this.form.disable();
    this.isCancel = true;
    this.isAdd = false;
    this.isSave = true;
    this.editClick(this.tempId);
  }
  enableBtn() {
    this.isSave = false;
    this.isCancel = false;
  }
  btnAdd() {
    this.enableBtn();
    this.form.reset();
    this.form.enable();
    this.isEdit = true;
    this.isAdd = true;
    this.tempId = this.id;
    this.id = 0;
  }
  disbaleBtn() {
    this.isSave = true;
    this.isCancel = true;
  }
  onSave() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return true;
    }
    const data = this.form.value;
    if (data.id == null) data.id = 0;
    data.customerId = this.customerId;
    this.service.saveContacts(data).subscribe(
      (res) => {
        if (res['status'] == 200) {
          this.utils.toast.success(res['message']);

          this.editClick(this.tempId);
          this.disbaleBtn();
          this.form.disable();
          this.form.reset();
          //this.form.disable();
          this.id = 0;
          if (data.id == 0) this.ContactsList();
          return false;
        } else this.utils.toast.error(res['message']);
      },
      (error) => {
        this.onError(error, ErrorMessages.customer.save_contacts);
      }
    );
  }
  btnEdit() {
    this.isEdit = true;
    this.isAdd = true;
    // this.tempId = this.id;
    this.form.enable();
    this.isEdit = true;
  }
  ContactsList() {
    this.service.GetContactsList(this.customerId).subscribe(
      (res) => {
        if (res) {
          this.data = res;
          this.contacts = res;
        } else {
          this.data = [];
          this.contacts = this.data;
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.customer.get_contacts_list);
      }
    );
  }

  public onFilter(inputValue: string): void {
    this.data = process(this.contactsFilter, {
      filter: {
        logic: 'or',
        filters: [
          {
            field: 'firstName',
            operator: 'contains',
            value: inputValue,
          },
        ],
      },
    }).data;
    this.mySelection = [0];
    this.contacts = this.data;
    ///this.dataBinding.skip = 0;
  }

  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.data = {
      data: orderBy(this.contacts, this.sort),
      total: this.contacts.length,
    };
    this.data = this.data.data;
    //this.loadProducts();
  }

  private onError(error: any, customMessage?: string) {
    this.errorHandler.handleError(
      error,
      ModuleNames.customer_contact,
      customMessage
    );
  }
}
