import { Component, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  DataBindingDirective,
  PageChangeEvent,
} from '@progress/kendo-angular-grid';
import { orderBy, process, SortDescriptor } from '@progress/kendo-data-query';
import { BehaviorSubject } from 'rxjs';
import { UtilityService } from 'src/app/core/services/utility.service';
import { VendorContactModel } from './vendor-contact.model';
import { VendorContactService } from './vendor-contact.service';
import { ModuleNames, ErrorMessages } from 'src/app/core/constant';
import { ErrorHandlerService } from 'src/app/core/services';

@Component({
  selector: 'app-vendor-contact',
  templateUrl: './vendor-contact.component.html',
  styleUrls: ['./vendor-contact.component.scss'],
})
export class VendorContactComponent implements OnInit {
  @ViewChild(DataBindingDirective) dataBinding: DataBindingDirective;
  // @Output() SaveEditClick = new EventEmitter<number>();
  // @Input() onChange;
  @Output() dialogOpened: boolean = false;
  @Output() errorMsg: any;
  SaveChange: BehaviorSubject<any> = new BehaviorSubject(null);

  form: FormGroup;
  id: number = 0;
  data: any;
  vendorId: any;
  skip: number;
  public sort: SortDescriptor[] = [
    {
      field: 'firstName',
      dir: 'asc',
    },
  ];
  contact: any;
  vendor: VendorContactModel;
  isSave: boolean = true;
  isCancel: boolean = true;
  isEdit: boolean = true;
  loader: boolean;
  isAdd: boolean = false;
  isAddRight: boolean = false;
  isActive: boolean = true;
  viewActive: boolean = false;
  public mask = '(000) 000-0000';
  public mySelection: number[] = [0];
  tempId: number;
  constructor(
    private formBuilder: FormBuilder,
    public service: VendorContactService,
    private utils: UtilityService,
    public errorHandler: ErrorHandlerService
  ) {
    const rights = JSON.parse(localStorage.getItem('Rights'));
    if (rights) {
      var pageModuleRights = rights.filter(
        (x) => x.subModuleName == 'Contacts' && x.moduleName == 'Vendor'
      );
      this.isAddRight = pageModuleRights.find(
        (x) => x.tabName.toLowerCase() == 'add'
      );
    } else {
      this.isAddRight = true;
    }
  }

  ngOnInit(): void {
    this.initForm();
    this.form.disable();
  }

  initForm(): void {
    this.form = this.formBuilder.group({
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      title: [null, Validators.required],
      cellPhone: [null],
      office: [null],
      email: [null],
      location: [null],
      note: [null],
      active: [true],
    });
  }
  onEdit(res) {
    this.isCancel = true;
    this.isAdd = false;
    this.isSave = true;
    this.vendorId = res.id;
    this.id = 0;
    if (this.id && this.id > 0) {
      this.isEdit = false;
    }
    this.form.reset();
    this.ContactList();
  }
  onSave() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return true;
    }
    const data = this.form.value;

    data.vendorId = this.vendorId;
    if (data.active == null) data.active = false;
    data.userName = JSON.parse(localStorage.getItem('currentUser')).userName;
    debugger;
    if (this.id > 0) {
      data.id = this.id;
      this.service.UpdateContacts(data).subscribe(
        (res) => {
          if (res['status'] == 200) {
            this.viewActive = false;
            this.utils.toast.success(res['message']);
            this.ContactList();
          } else this.utils.toast.error(res['message']);
          this.disbaleBtn();
          this.form.reset();
          this.form.disable();
        },
        (error) => {
          this.onError(error, ErrorMessages.vendor.update_contacts);
        }
      );
    } else {
      this.service.AddContacts(data).subscribe(
        (res) => {
          if (res['status'] == 200) {
            this.viewActive = false;
            this.utils.toast.success(res['message']);
            this.ContactList();
          } else this.utils.toast.error(res['message']);
          this.disbaleBtn();
          this.form.reset();
          this.form.disable();
        },
        (error) => {
          this.onError(error, ErrorMessages.vendor.add_contacts);
        }
      );
    }
  }

  editContactClick(data) {
    this.id = data.id;
    // this.service.GetContactById(id).subscribe(
    //   (res) => {
    //     if (res) {

    this.viewActive = false;
    this.setValue(data);
    if (this.id > 0)
      this.isEdit = false;
    else this.isEdit = true;
    this.isAdd = false;
    this.isSave = true;
    this.isCancel = true;
    //     }
    //   },
    //   (error) => {
    //     this.onError(error, ErrorMessages.vendor.get_contact_by_id);
    //   }
    // );
  }

  ContactList() {
    this.service.GetContactList(this.vendorId).subscribe(
      (res) => {
        if (res) {
          this.data = res;
          this.contact = res;
          if (this.contact.length > 0) {
            //this.editContactClick(this.id > 0 ? this.id : this.contact[0].id);
            if (this.tempId) {this.editContactClick(this.data.find(c => c.id == this.tempId));
              //this.mySelection = [0];
            } else{
              this.editContactClick(this.contact[0]);
            this.mySelection = [0];}

            this.isEdit = false;
            this.viewActive = true;
          } else {
            this.id = 0;
          }
        } else {
          this.data = [];
          this.isEdit = true;
          this.viewActive = false;
          this.contact = this.data;
          this.form.reset();
          this.id = 0;
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.vendor.get_contact_list);
      }
    );
  }

  setValue(data: VendorContactModel) {
    this.form.setValue({
      firstName: data.firstName,
      lastName: data.lastName,
      title: data.title,
      cellPhone: data.cellPhone,
      office: data.office,
      email: data.email,
      location: data.location,
      note: data.note,
      active: true,
    });
  }

  btnCancel() {
    this.id = 0;
    this.form.disable();
    this.isCancel = true;
    this.isAdd = false;
    this.isSave = true;
    //this.isEdit = false;
    this.viewActive = false;
    this.editContactClick(this.data.find(c => c.id == this.tempId));
  }

  btnAdd() {
    this.enableBtn();
    this.form.reset();
    this.form.enable();
    this.isEdit = true;
    this.isAdd = true;
    this.tempId = this.id;
    this.id = 0;
    this.viewActive = false;
  }

  btnEdit() {
    this.form.enable();
    this.enableBtn();
    this.tempId = this.id;
    this.isEdit = true;
    this.isAdd = true;
    this.viewActive = true;
  }

  enableBtn() {
    this.isSave = false;
    this.isCancel = false;
  }
  disbaleBtn() {
    this.isAdd = false;
    this.isEdit = true;
    this.isSave = true;
    this.isCancel = true;
  }

  public onFilter(inputValue: string): void {
    this.mySelection = [];
    this.data = process(this.contact, {
      filter: {
        logic: 'or',
        filters: [
          {
            field: 'firstName',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'lastName',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'cellPhone',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'email',
            operator: 'contains',
            value: inputValue,
          },
        ],
      },
    }).data;
    this.mySelection = [0];
    this.data = this.data;
    // this.editContactClick(this.data[0].id);
  }

  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
  }
  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.data = {
      data: orderBy(this.contact, this.sort),
      total: this.contact.length,
    };
    this.data = this.data.data;
  }
  private onError(error: any, customMessage?: string) {
    this.errorHandler.handleError(
      error,
      ModuleNames.vendor_activity,
      customMessage
    );
  }
}
