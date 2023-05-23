import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageChangeEvent } from '@progress/kendo-angular-grid';
import { orderBy, SortDescriptor } from '@progress/kendo-data-query';
import { event } from 'jquery';
import { MenuService } from 'src/app/core/helper/menu.service';
import { DataService } from 'src/app/core/services';
import { DropdownService } from 'src/app/core/services/dropdown.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { collectionsData } from 'src/data/customer-data';
import { PaginationWithSortRequest } from 'src/app/core/models/pagination.model';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { ContactsDetailsComponent } from '../contacts-details/contacts-details.component';
import { CustomerDetailsComponent } from '../customer-details/customer-details.component';

@Component({
  selector: 'app-customer-info',
  templateUrl: './customer-info.component.html',
  styleUrls: ['./customer-info.component.scss'],
})
export class CustomerInfoComponent implements OnInit {
  @ViewChild(ContactsDetailsComponent) contact: ContactsDetailsComponent;
  @ViewChild(CustomerDetailsComponent) details: CustomerDetailsComponent;
  customerInfoFilterOptions: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'startsWith',
  };
  isCreatable: boolean = false;
  isEditable: boolean = false;
  disableCustomer: boolean = true;
  disableFormInput: boolean = true;
  disableCancel: boolean = false;
  disableAdd: boolean = false;
  filterForm: FormGroup;
  customer: FormGroup;
  customerForm: FormGroup;
  otherForm: FormGroup;
  allBranches: any = [];
  branches: any = [];
  accountManagers: any = [];
  customerTypes: any = [];
  collections: any = [];
  status: any = [];
  loading: boolean = false;
  selectable: boolean = true;
  skip: number = 0;
  multiple: boolean = false;
  selectedTab: string = 'Customer Info';
  selectedCustomer: any = null;
  selectedContact: any = null;
  customers: any = [];
  customerSort: SortDescriptor[] = [];
  customerSelection: number[] = [0];
  addressExpanded = false;
  isAlertDialog: boolean = false
  isDesc: boolean = false
  customerColumns: any = [
    {
      Name: 'customer',
      isCheck: true,
      Text: 'Customer',
      isDisable: false,
      index: 0,
      width: 100,
    },
  ];
  totalCustomers: number = 0;
  pageSize: number = 100;
  pageNumber: number = 1;
  pageSizeList: any = [
    { id: 0, value: 100 },
    { id: 1, value: 300 },
    { id: 2, value: 500 },
  ];
  contactForm: FormGroup;
  contacts: any = [];
  searchText: string = '';
  isEdit: boolean = false;
  isTab1: boolean = false;
  isTab2: boolean = false;
  isTab3: boolean = false;
  isTab4: boolean = false;
  isTab5: boolean = false;
  isTab6: boolean = false;
  isTab7: boolean = false;
  statusData: any = [
    { id: 0, value: 'All' },
    { id: 1, value: 'Active' },
    { id: 2, value: 'Inactive' },
  ];
  filterCollection: any = {
    id: 0,
    status: 1,
  };

  action: string = '';
  constructor(
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private dropdownService: DropdownService,
    private utilityService: UtilityService,
    public menuService: MenuService
  ) {
    this.collections = collectionsData;
    if (localStorage.getItem('isAdmin') == 'true') {
      this.isTab1 = true;
      this.isTab2 = true;
      this.isTab3 = true;
      this.isTab4 = true;
      this.isTab5 = true;
      this.isTab6 = true;
      this.isTab7 = true;
    } else {
      let acc = this.menuService.checkUserViewRights('Customer');
      if (acc) {
        //this.utils.toast.error("User does not have rights to access " + name + " module.");Z
      } else {
        this.utilityService.toast.error(
          'You do not have permissions to access this part of the system. Please contact your supervisor so they can request them from IT.'
        );
        setTimeout(() => {
          var url = '/dashboard';
          location.href = url;
        }, 1000);
      }
      const rights = JSON.parse(localStorage.getItem('Rights'));
      if (rights) {
        this.isTab1 = rights.some(
          (c) =>
            c.subModuleName == 'Customer Info' &&
            c.moduleName == 'Customer' &&
            c.tabName == 'VIEW'
        );

        this.isTab2 = rights.some(
          (c) =>
            c.subModuleName == 'Other Info' &&
            c.moduleName == 'Customer' &&
            c.tabName == 'VIEW'
        );
        this.isTab3 = rights.some(
          (c) =>
            c.subModuleName == 'Contacts' &&
            c.moduleName == 'Customer' &&
            c.tabName == 'VIEW'
        );
        this.isTab4 = rights.some(
          (c) =>
            c.subModuleName == 'Notes' &&
            c.moduleName == 'Customer' &&
            c.tabName == 'VIEW'
        );
        this.isTab5 = rights.some(
          (c) =>
            c.subModuleName == 'History' &&
            c.moduleName == 'Customer' &&
            c.tabName == 'VIEW'
        );
        this.isTab6 = rights.some(
          (c) =>
            c.subModuleName == 'Activity' &&
            c.moduleName == 'Customer' &&
            c.tabName == 'VIEW'
        );
        this.isTab7 = rights.some(
          (c) =>
            c.subModuleName == 'Collection' &&
            c.moduleName == 'Customer' &&
            c.tabName == 'VIEW'
        );
      }

      this.menuService.checkUserBySubmoduleRights('Customer Info');
    }
  }

  ngOnInit(): void {
    this.onInitForm({});
    this.onInitOtherForm({});
    this.onFilterInitForm();
    this.getAllBranches();
    this.getAllAccountManagers();
    this.getAllCustomerTypes();
    this.onLoadCustomers();
    this.onInitContactForm({});
  }
  onResizeColumn(event) {}

  onSelectionChange(event, type) {
    if (this.selectedTab === 'Contacts') {
      this.contact.selectedContact = null;
    }
    this.getCustomerDetails(event.selectedRows[0].dataItem?.custID);
  }
  onSortChange(event, type) {
    this.pageNumber = 1
    this.isDesc = !this.isDesc
    this.onLoadCustomers()
  }

  onReOrderColumns(event) {}

  onDataStateChange(event) {}

  onHandleOperation(type) {
    switch (type) {
      case 'new':
        this.action = 'new';
        this.disableCustomer = false;
        this.isEdit = false;
        this.selectable = false;
        if (this.selectedTab == 'Customer Info') {
          this.selectedCustomer = null;
        }
        if (this.selectedTab == 'Other Info') {
          this.selectedTab = 'Customer Info';
          this.disableCustomer = false;
        }
        if (this.selectedTab === 'Contacts') {
          this.selectable = false;
          this.contact.selectable = false;
          this.contact.selectedContact = null;
          this.contact.onInitForm({});
          this.onInitContactForm({});
        } else {
          this.onInitForm({});
          this.onInitOtherForm({});
        }
        // this.selectable = false;
        break;
      case 'edit':
        this.action = 'edit';
        if (this.selectedTab == 'Contacts' && !this.contact.contacts.length) {
          this.onToggleAlert()
        } else {
          this.isEdit = false;
          this.selectable = false;
          this.disableCustomer = false;
          this.contact.selectable = false;
        }
        break;
      case 'cancel':
        this.action = 'cancel';
        this.disableCustomer = true;
        this.disableCancel = false;
        this.isEdit = true;
        this.getCustomerDetails(
          this.customers[this.customerSelection[0]]?.custID
        );
        this.selectable = true;
        this.customerSelection = [...this.customerSelection];
        if (
          this.selectedTab === 'Customer Info' ||
          this.selectedTab === 'Other Info'
        ) {
          this.selectedTab = 'Customer Info';
        }
        if (this.selectedTab === 'Contacts') {
          this.contact.onLoadContacts();
        }
        break;
      case 'save':
        this.action = 'save';
        // this.isCreatable = !this.isCreatable;
        // this.isEditable = !this.isEditable;
        // this.disableCustomer = true;
        // // this.onInitForm(this.selectedCustomer);
        // this.selectable = true;
        // // this.onSaveNotes();
        // this.customerSelection = [0];
        if (this.selectedTab === 'Contacts') {
          this.onUpdateContacts();
          this.selectable = true;
        } else {
          this.handleSave();
        }

        break;
      default:
        break;
    }
  }

  onStatusChange(data) {}
  onFilterInitForm() {
    this.filterForm = this.formBuilder.group({
      branch: '',
      employeeNumber: '0',
      collection: false,
      customerType: '',
      status: 1,
      searchText: '',
    });
  }

  getAllBranches() {
    this.loading = true;
    this.dropdownService.GetBranchList().subscribe((result) => {
      if (result?.length) {
        this.branches = this.allBranches = [
          { code: '', value: 'All' },
          ...result,
        ];
      } else {
        this.branches = this.allBranches = [];
      }
    });
  }

  getAllAccountManagers() {
    this.dropdownService.GetEmployee().subscribe((result) => {
      if (result?.result?.length) {
        this.accountManagers = [{ id: '0', value: 'All' }, ...result?.result];
      } else {
        this.accountManagers = [];
      }
    });
  }

  getAllCustomerTypes() {
    this.dropdownService
      .GetLookupList('CRMCustomerType')
      .subscribe((result) => {
        if (result?.length) {
          //this.customerTypes = [{ id: '', value: 'All' }, ...result];
          this.customerTypes = result.map((x) => {
            return { id: x.id, value: x.value, text: x.value };
          });
          this.customerTypes = [
            { id: '', value: '', text: 'All' },
            ...this.customerTypes,
          ];
        } else {
          this.customerTypes = [];
        }
      });
  }

  onLoadCustomers() {
    let filters: any = this.filterForm.value;
    this.dataService
      .post(`Customer/list`, {
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
        sortColumn: 'Customer',
        sortDesc: this.isDesc,
        request: {
          ...filters,
          searchText: this.searchText,
        },
      })
      .subscribe((result: any) => {
        if (result.length) {
          this.totalCustomers = result[0].totalRecords;
          this.customers = result;
          this.isEdit = true;
          if (!this.selectedCustomer) {
            this.getCustomerDetails(result[0]?.custID);
          }else {
            // this.selectedCustomer?.id !== result[0]?.custID
            if(this.customerSelection.length) {
              this.getCustomerDetails(result[this.customerSelection[0]]?.custID)
            }
            console.log(":::::2")
          }
        } else {
          this.customers = [];
          this.totalCustomers = 0;
          this.selectedCustomer = null;
          this.isEdit = false;
          this.onInitForm({})
        }
      }, (error) => {
      });
  }

  getCustomerDetails(custID) {
    this.loading = true;
    this.dataService.get(`Customer/${custID}`).subscribe((result) => {
      if (result) {
        this.onLoadCustomerOtherInfo(custID);
        this.selectedCustomer = result;
        this.onInitForm(result);
        this.details.fullAddress = this.customerForm.value.address;
        // if (this.selectedTab === 'Contacts') this.contact.onLoadContacts();
      } else {
        this.selectedCustomer = {};
        this.onInitForm(null);
      }
      this.loading = false;
    }, (error) => {});
  }

  onInitForm(value) {
    this.customerForm = this.formBuilder.group({
      customerName: [value?.customerName || '', Validators.required],
      address: [value?.address || '', Validators.required],
      city: [value?.city || '', Validators.required],
      country: [value?.country || '', Validators.required],
      zip: [value?.zip || '', Validators.required],
      phone: [value?.phone || '', Validators.required],
      fax: [value?.fax || '', Validators.required],
      employeeNumber: [value?.employeeNumber || '', Validators.required],
      employeeName: value?.employeeName || '',
      address2: value?.address2 || '',
      branch: [value?.branch || '', Validators.required],
      branchName: [value?.branchName],
      state: [value?.state || '', Validators.required],
      website: value?.website || '',
      customerType: [value?.customerType || '', Validators.required],
      active: value?.active || false,
    });
    
    localStorage.setItem('callCustomer', value?.id || 0);
  }

  onInitOtherForm(value) {
    this.otherForm = this.formBuilder.group({
      taxExempt: value?.taxExempt || false,
      taxExemptBy: value?.taxExemptBy || '',
      taxExemptDate: value?.taxExemptDate || '',
      taxExemptExpire: value?.taxExemptExpire || '',
      coi: value?.coi || false,
      coiBy: value?.coiBy || '',
      coiDate: value?.coiDate || '',
      coiExpire: value?.coiExpire || '',
      prePayment: value.prePayment || null,
      creditAppDate: value?.creditAppDate || '',
      creditAppSent: value?.creditAppSent || false,
      creditAppSentDate: value?.creditAppSentDate || '',
      creditAppSentBy: value?.creditAppSentBy || '',
      creditAppReceived: value?.creditAppReceived || false,
      creditAppReceivedDate: value?.creditAppReceivedDate || '',
      creditAppReceivedBy: value?.creditAppReceivedBy || '',
      creditAppApproved: value?.creditAppApproved || false,
      creditAppApprovedDate: value?.creditAppApprovedDate || '',
      creditAppApprovedBy: value?.creditAppApprovedBy || '',
      creditAppNotes: value?.creditAppNotes || '',
      creditLimit: value?.creditLimit || null,
      creditRisk: value?.creditRisk || null,
      creditOverride: value?.creditOverride || null,
      creditNote: value?.creditNote || '',
    });
  }

  onTabChange(event) {
    this.selectedTab = event.title;
    if(this.selectedTab=='Customer Info'){
        this.details.fullAddress = this.customerForm.value.address;
    }
  }

  onInitContactForm(value) {
    this.contactForm = this.formBuilder.group({
      firstName: [value?.firstName , [Validators.required]],
      lastName: [value?.lastName , [Validators.required]],
      role: value?.role ,
      location: value?.location ,
      title: [value?.title , [Validators.required]],
      office: value?.office ,
      cellPhone: value?.cellPhone ,
      email: value?.email ,
      note: value?.note ,
    });
  }

  handleSave() {
    if (this.selectedTab === 'Customer Info') {
      this.onUpdateCustomer();
    } else if (this.selectedTab === 'Other Info') {
      this.onUpdateOtherInfo();
    } else if (this.selectedTab === 'Contacts') {
      this.onUpdateContacts();
    }
  }

  onSaveCustomer() {}

  onUpdateCustomer() {
    if (this.customerForm.valid) {
      let payload = {
        id: this.selectedCustomer?.id || 0,
        userName: JSON.parse(localStorage.getItem('currentUser')).userName,
        user_PK: JSON.parse(localStorage.getItem('currentUser')).id,
        ...this.customerForm.value,
      };

      delete payload.branchName;
      this.dataService.put('Customer', payload).subscribe((result: any) => {
        this.utilityService.toast.success(result?.message);
        this.disableCustomer = true;
        this.isEdit = true;
        this.selectable = true;
        this.onLoadCustomers();
      });
      `1`;
    } else {
      this.details.addressExpanded = true;
      this.customerForm.markAllAsTouched();
    }
  }

  onUpdateOtherInfo() {
    let form = this.otherForm.value;
    let payload = {
      ...form,
      id: this.selectedCustomer?.id || 0,
      userName: JSON.parse(localStorage.getItem('currentUser')).userName,
      user_PK: JSON.parse(localStorage.getItem('currentUser')).id,
      prePayment: form?.prePayment ? form?.prePayment : false,
      creditLimit: form?.creditLimit ? form?.creditLimit : 0,
      creditRisk: form?.creditRisk ? form?.creditRisk : false,
      creditOverride: form?.creditOverride ? form?.creditOverride : false,
    };
    this.dataService.patch('Customer', payload).subscribe((result: any) => {
      if (result) {
        this.utilityService.toast.success(result?.message);
        this.disableCustomer = true;
        this.isEdit = true;
        this.selectable = true;
        this.onLoadCustomers();
      } else {
        this.disableCustomer = false;
        this.isEdit = false;
        this.selectable = false;
      }
    });
  }

  onUpdateContacts() {
    if (this.contact.form.invalid) {
      this.contact.form.markAllAsTouched();
      return false;
    }
    let payload = {
      id: this.contact.selectedContact?.id || 0,
      customerId: this.contact.selectedCustomer?.id || 0,
      userName: JSON.parse(localStorage.getItem('currentUser')).userName,
      user_PK: JSON.parse(localStorage.getItem('currentUser')).id,
      ...this.contact.form.value,
    };
    this.dataService
      .put(`Customer/Contact`, payload)
      .subscribe((result: any) => {
        if (result?.status === 200) {
          this.disableCustomer = true;
          this.isEdit = true;
          this.utilityService.toast.success(result?.message);
          this.contact.selectable = true;
          this.contact.onLoadContacts();
        } else {
          this.utilityService.toast.error(result?.message);
          this.disableCustomer = false;
          this.contact.selectable = true;
          this.isEdit = false;
        }
      });
  }

  getCustomerContacts() {
    this.dataService
      .get(`Customer/${this.selectedCustomer?.id}/Contacts`)
      .subscribe((result: any) => {
        if (result?.length) {
          this.contacts = result;
          this.onInitContactForm(result[0]);
        } else {
          this.contacts = [];
          this.onInitContactForm({});
          this.selectedContact = null;
        }
      });
  }

  onLoadCustomerOtherInfo(custID) {
    this.dataService
      .post(`Customer/${custID}/Info`, {})
      .subscribe((result: any) => {
        if (result?.status === 200) {
          this.onInitOtherForm(result?.result);
        }
      });
  }

  onPageChange(e: PageChangeEvent): void {
    (this.skip = e.skip), (this.pageSize = e.take);
    // this.pageNumber = Math.floor(this.skip == 0 ? 0 : e.skip / this.pageSize);
    this.pageNumber = this.skip == 0 ? 0 : e.skip / this.pageSize + 1;
    if (this.pageNumber == 0) {
      this.pageNumber = 1;
    }
    if (this.pageNumber > 1) {
      this.customerSelection = [(this.pageNumber - 1) * this.pageSize];
    } else {
      this.customerSelection = [0];
    }
    this.selectedCustomer = null;
    this.onLoadCustomers();
  }

  onPageSizechange(pagesize) {
    this.pageSize = pagesize;
    this.skip = 0;
    this.pageNumber = 1;
    this.onLoadCustomers();
  }

  filterCustomers(data: any) {
    this.searchText = data;
    this.skip = 0;
    this.pageNumber = 1;
    this.onLoadCustomers();
  }

  filterCustomerData() {
    this.skip = 0;
    this.pageNumber = 1;
    this.onLoadCustomers();
  }

  onToggleAlert() {
    this.isAlertDialog = !this.isAlertDialog
  }
}
