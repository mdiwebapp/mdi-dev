import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { SortDescriptor, orderBy, process } from '@progress/kendo-data-query';
import {
  DataBindingDirective,
  GridComponent,
  GridDataResult,
  PageChangeEvent,
} from '@progress/kendo-angular-grid';
import { CustomerService } from './customer.service';
import { CustomerModel, CustormerReqModel } from './Customer.model';
import { BehaviorSubject } from 'rxjs';
import { DropdownService } from '../../../../core/services/dropdown.service';
import { CustomerInfoComponent } from '../customer-info/customer-info.component';
import { CustomerNotesComponent } from '../customer-notes/customer-notes.component';
import { OtherInfoComponent } from '../other-info/other-info.component';
import { CustomerContactComponent } from '../customer-contact/customer-contact.component';
import { BranchService } from 'src/app/layout/admin/branch/branch.service';
import { MenuService } from 'src/app/core/helper/menu.service';
import { debounceTime } from 'rxjs/operators';
import { ModuleNames, ErrorMessages } from 'src/app/core/constant';
import { ErrorHandlerService } from 'src/app/core/services';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss'],
})
export class CustomerComponent implements OnInit {
  @Input() onChange;
  @ViewChild('grid') private grid: GridComponent;
  public checked = true;
  status: boolean = true;
  customer: CustomerModel[];
  public loading: boolean;
  filterData: CustormerReqModel;
  branches: any = [];
  cInfos: any;
  branchdata: any;
  accountManagers: any = [];
  accountManagersdata: any = this.accountManagers;
  customerTypes: any = [];
  customerTypesdata: any = this.customerTypes;
  skip: number = 0;
  tabList = {
    CustomerInfo: false,
    OtherInfo: false,
    Contacts: false,
    Notes: false,
  };
  customerRole: any = [
    {
      id: 0,
      text: 'Accounts Payable',
    },
    {
      id: 1,
      text: 'Buyer',
    },
    {
      id: 2,
      text: 'Decision Maker',
    },
    {
      id: 3,
      text: 'End User',
    },
    {
      id: 4,
      text: 'Gate Keeper',
    },
    {
      id: 5,
      text: 'Influencer',
    },
  ];

  public gridView: GridDataResult;
  public value: Date = new Date(2020, 2, 10);
  public model = {
    terms: true,
  };
  id: number = 0;
  public data: GridDataResult;
  vendorId: any;

  credLimit: any;
  contact: unknown[];
  isSave: boolean = true;
  isCancel: boolean = true;
  isEdit: boolean = true;
  loader: boolean;
  isAdd: boolean = false;
  public mask = '(000) 000-0000';
  cdate: any;
  active: boolean = true;
  filterBrance: string = '';
  filterColle: boolean = false;
  filterAM: string = '';
  filterCustType: string = '';
  creditLimit: any;
  rawValue: number;
  isDisable: boolean = true;
  customerFilter: any;
  isAddRight: boolean;
  isUpdateRight: boolean;
  filterinput: string;
  pageSize: number = 20;
  recordCount: any;

  public sort: SortDescriptor[] = [
    {
      field: 'customerName',
      dir: 'asc',
    },
  ];
  selectedTab = 0;
  tempId: number;
  customerName: string;
  show: boolean;
  toggleText: string;
  constructor(
    public service: CustomerService,
    public dropdownservice: DropdownService,
    public branchService: BranchService,
    public menuService: MenuService,
    public errorHandler: ErrorHandlerService
  ) {
    if (localStorage.getItem('isAdmin') == 'true') {
      this.isTab1 = false;
      this.isTab2 = false;
      this.isTab3 = false;
      this.isTab4 = false;
    } else {
      const rights = JSON.parse(localStorage.getItem('Rights'));
      if (rights) {
        this.isTab1 = !rights.some(
          (c) => c.subModuleName == 'Customer Info' && c.tabName == 'VIEW'
        );
        this.isTab2 = !rights.some(
          (c) => c.subModuleName == 'Other Info' && c.tabName == 'VIEW'
        );
        this.isTab3 = !rights.some(
          (c) => c.subModuleName == 'Contacts' && c.tabName == 'VIEW'
        );
        this.isTab4 = !rights.some(
          (c) => c.subModuleName == 'Notes' && c.tabName == 'VIEW'
        );
      }
    }
    this.menuService.checkUserBySubmoduleRights('Customer Info');
    this.isAddRight = this.menuService.isAddRight;
    this.isUpdateRight = this.menuService.isEditRight;
  }
  SaveChange: BehaviorSubject<any> = new BehaviorSubject(null);
  public mySelection: number[] = [0];
  isTab1: boolean = false;
  isTab2: boolean = false;
  isTab3: boolean = false;
  isTab4: boolean = false;

  @ViewChild(DataBindingDirective) dataBinding: DataBindingDirective;
  @ViewChild(CustomerInfoComponent) CustomerInfo: CustomerInfoComponent;
  @ViewChild(CustomerNotesComponent) CustomerNotes: CustomerNotesComponent;
  @ViewChild(OtherInfoComponent) OtherInfo: OtherInfoComponent;
  @ViewChild(CustomerContactComponent)
  CustomerContact: CustomerContactComponent;
  ngOnInit(): void {
    this.loadItems();
    this.GetBranches();
    this.GetEmployee();
    this.GetCustomerTypes();
  }
  public loadItems(): void {
    this.loader = true;

    this.filterData = new CustormerReqModel();
    this.filterData.branch =
      this.filterBrance != undefined ? this.filterBrance : '';
    this.filterData.accountManagerEmpId =
      this.filterAM != undefined ? this.filterAM : '';
    this.filterData.collection = this.filterColle;
    this.filterData.customerType =
      this.filterCustType != undefined ? this.filterCustType : '';
    this.filterData.status = this.status;

    this.service.GetList(this.filterData).subscribe(
      (res) => {
        // this.data = res.slice(0, 100);
        this.customerFilter = res.slice(0, 50);
        this.recordCount = this.customerFilter?.length;

        this.customer = res;

        this.loadCustomer(this.customerFilter.slice(0, 10));
        // this.data = {
        //   data: this.customerFilter.slice(this.skip, this.skip + this.pageSize),
        //   total: this.customerFilter.length,
        // };
        this.loader = false;
        if (this.filterinput) this.onFilter(this.filterinput);

        this.editClick(this.customer[0].id);
      },
      (error) => {
        this.onError(error, ErrorMessages.customer.get_list);
      }
    );
  }

  loadCustomer(data) {
    this.data = {
      data: data.slice(this.skip, this.skip + this.pageSize),
      total: this.customerFilter.length,
    };
  }

  public ngAfterViewInit(): void {
    this.grid.pageChange
      .pipe(debounceTime(500))
      .subscribe((e) => this.pageChange(e));
  }

  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    if (this.filterinput != '') {
      this.data = {
        data: this.customer.slice(this.skip, this.skip + this.pageSize),
        total: this.customer.length,
      };
      this.recordCount = this.customer?.length;
    } else {
      this.data = {
        data: this.customerFilter.slice(this.skip, this.skip + this.pageSize),
        total: this.customerFilter.length,
      };
      this.recordCount = this.customerFilter?.length;
    }
  }

  GetBranches() {
    this.branchService.GetBranchDropdown().subscribe(
      (res) => {
        if (res) {
          this.branches = res;
          this.branchdata = res;
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.branch.dropdown);
      }
    );
  }

  GetCustomerTypes() {
    this.dropdownservice.GetLookupList('CRMCustomerType').subscribe(
      (res) => {
        if (res) {
          this.customerTypes = res;
          this.customerTypesdata = res;
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.drop_down.crm_customer_type);
      }
    );
  }
  GetEmployee() {
    this.service.GetEmployeeList().subscribe(
      (res) => {
        if (res) {
          this.accountManagers = res;
          this.accountManagersdata = res;
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.customer.get_employee_list);
      }
    );
  }
  editClick(id: number) {
    this.id = id;
    this.isEdit = false;
    this.isCancel = true;
    this.isAdd = false;
    this.isSave = true;
    this.service.getOneById(id).subscribe(
      (res) => {
        if (res) {
          this.cdate = res['createdDate'];
          this.customerName = res['customerName'];
          this.active = res['active']; // == true ? false : true;
          this.SaveChange.next(res);
          if (this.selectedTab == 0) {
            this.tabList.CustomerInfo = false;
            this.tabList.OtherInfo = true;
            this.tabList.Contacts = true;
            this.tabList.Notes = true;
          }
          if (this.selectedTab == 1) {
            this.tabList.CustomerInfo = true;
            this.tabList.OtherInfo = false;
            this.tabList.Contacts = true;
            this.tabList.Notes = true;
          }
          if (this.selectedTab == 2) {
            this.tabList.CustomerInfo = true;
            this.tabList.OtherInfo = true;
            this.tabList.Contacts = false;
            this.tabList.Notes = true;
          }
          if (this.selectedTab == 3) {
            this.tabList.CustomerInfo = true;
            this.tabList.OtherInfo = true;
            this.tabList.Contacts = true;
            this.tabList.Notes = false;
          }
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.customer.get_one_by_id);
      }
    );
  }
  onSave() {
    let saveStatus = false;
    if (this.selectedTab == 0)
      saveStatus = this.CustomerInfo.onSave(this.active);
    if (this.selectedTab == 1) saveStatus = this.OtherInfo.onSave();
    if (this.selectedTab == 2) saveStatus = this.CustomerContact.onSave();
    if (this.selectedTab == 3) saveStatus = this.CustomerNotes.onSave();

    if (saveStatus) return;
    this.editClick(this.tempId);
    this.isDisable = true;
    this.isAdd = false;
    this.isEdit = false;
    this.disbaleBtn();
  }
  btnAdd() {
    this.enableBtn();
    this.isEdit = true;
    this.isAdd = true;
    this.tempId = this.id;
    this.id = 0;
    this.cdate = '';
    this.active = true;
    if (this.selectedTab == 0) {
      this.CustomerInfo.btnAdd();
      this.CustomerInfo.fullAdressLable = '';
      this.CustomerInfo.fullAddress = '';
      this.OtherInfo.form.reset();
      this.CustomerContact.form.reset();
      this.CustomerNotes.form.reset();
    }
    if (this.selectedTab == 1) this.OtherInfo.btnAdd();
    if (this.selectedTab == 2) this.CustomerContact.btnAdd();
    if (this.selectedTab == 3) this.CustomerNotes.btnAdd();
    this.enableBtn();
  }
  btnEdit() {
    this.enableBtn();
    this.isEdit = true;
    this.isAdd = true;
    this.tempId = this.id;
    if (this.selectedTab == 0) {
      this.CustomerInfo.btnEdit();
    }

    if (this.selectedTab == 1) this.OtherInfo.btnEdit();
    if (this.selectedTab == 2) this.CustomerContact.btnEdit();
    // if (this.selectedTab == 3)
    //   this.CustomerNotes.btnEdit();
    this.enableBtn();
  }
  btnCancel() {
    this.disbaleBtn();
    this.editClick(this.tempId);

    if (this.selectedTab == 0) this.CustomerInfo.btnCancel();
    if (this.selectedTab == 1) this.OtherInfo.btnCancel();
    if (this.selectedTab == 2) this.CustomerContact.btnCancel();
    if (this.selectedTab == 3) this.CustomerNotes.btnCancel();

    this.disbaleBtn();
  }
  public onTabSelect(e) {
    this.selectedTab = e.index;
    this.isEdit = false;
    this.isCancel = true;
    this.isAdd = false;
    this.isSave = true;

    if (this.selectedTab == 0) {
      this.isAdd = false;
      this.menuService.checkUserBySubmoduleRights('Customer Info');
    } else if (this.selectedTab == 1) {
      this.isAdd = true;
      this.menuService.checkUserBySubmoduleRights('Other Info');
    } else if (this.selectedTab == 2) {
      this.isAdd = false;
      this.menuService.checkUserBySubmoduleRights('Contacts');
    } else if (this.selectedTab == 3) {
      this.isAdd = false;
      this.menuService.checkUserBySubmoduleRights('Notes');
    }
  }

  GetFilterData() {
    this.filterData = new CustormerReqModel();
    this.filterData.branch =
      this.filterBrance != undefined ? this.filterBrance : '';
    this.filterData.accountManagerEmpId =
      this.filterAM != undefined ? this.filterAM : '';
    this.filterData.collection = this.filterColle;
    this.filterData.customerType =
      this.filterCustType != undefined ? this.filterCustType : '';
    this.filterData.status = this.status;
    this.service.GetList(this.filterData).subscribe(
      (res) => {
        this.data = res;
        this.customer = res;
        this.customerFilter = res;
        this.loader = false;
        this.editClick(this.customer[0].id);
      },
      (error) => {
        this.onError(error, ErrorMessages.customer.get_list);
      }
    );
  }

  OnAddClick() {
    this.editClick(0);
    this.SaveChange.next(null);
    this.id = 0;
    this.cdate = '';
  }
  enableBtn() {
    this.isSave = false;
    this.isCancel = false;
    this.isAdd = true;
    this.isEdit = true;
  }

  disbaleBtn() {
    this.isSave = true;
    this.isCancel = true;
    this.isAdd = false;
    this.isEdit = false;
  }

  public allowCustom = true;

  public onValueChange(value: number): void {
    this.rawValue = value;
  }

  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.data = {
      data: orderBy(this.customer, this.sort),
      total: this.customer.length,
    };
    this.data.data = this.data.data;
    // this.loadProducts();
  }

  customerHandleFilter(value) {
    // this.data = this.data.filter(
    //   (s) => s.customerName.toLowerCase().indexOf(value.toLowerCase()) !== -1
    // );
  }
  public onFilter(inputValue: string): void {
    this.filterinput = inputValue;
    this.mySelection = [];
    this.customer = process(this.customerFilter, {
      filter: {
        logic: 'or',
        filters: [
          {
            field: 'customerName',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'customerType',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'address',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'address2',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'country',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'state',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'city',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'zip',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'phone',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'fax',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'website',
            operator: 'contains',
            value: inputValue,
          },
        ],
      },
    }).data;
    this.mySelection = [0];
    // this.customer = this.data.data;
    this.recordCount = this.customer?.length;
    this.loadCustomer(this.customer);
    if (this.data.data.length > 0) this.editClick(this.customer[0].id);
    else {
      this.CustomerInfo.form.reset();
      this.CustomerInfo.fullAddress = '';
      this.CustomerInfo.fullAdressLable = '';
      this.OtherInfo.form.reset();
      this.CustomerContact.form.reset();
      this.CustomerNotes.form.reset();
    }
    this.dataBinding.skip = 0;
  }
  accountHandleFilter(value) {
    this.accountManagers = this.accountManagersdata.filter(
      (s) => s.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  branchesHandleFilter(value) {
    this.branches = this.branchdata.filter(
      (s) => s.value.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  customerTypesHandleFilter(value) {
    this.customerTypes = this.customerTypesdata.filter(
      (s) => s.value.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }
  OnAddUpdate() {
    this.loadItems();
  }
  valueChange(data, ty) {
    this.loadItems();
  }
  public onToggle(show?: boolean): void {
    this.show = show !== undefined ? show : !this.show;
    this.toggleText = this.show ? 'Hide' : 'Show';
  }

  closepopup() {
    this.show = !this.show;
  }

  private onError(error: any, customMessage?: string) {
    this.errorHandler.handleError(error, ModuleNames.customer, customMessage);
  }
}
