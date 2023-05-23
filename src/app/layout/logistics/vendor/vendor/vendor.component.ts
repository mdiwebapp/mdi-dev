import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  DataBindingDirective,
  DataStateChangeEvent,
  PageChangeEvent,
} from '@progress/kendo-angular-grid';
import {
  orderBy,
  process,
  SortDescriptor,
  State,
} from '@progress/kendo-data-query';
import { BehaviorSubject } from 'rxjs';
import { MenuService } from '../../../../core/helper/menu.service';
import { UtilityService } from '../../../../core/services/utility.service';
import { VendorContactComponent } from '../vendor-contact/vendor-contact.component';
import { VendorInfoComponent } from '../vendor-info/vendor-info.component';
import { VendorMoreInfoComponent } from '../vendor-more-info/vendor-more-info.component';
import { VendorNotesComponent } from '../vendor-notes/vendor-notes.component';
import { VendorModel } from './vendor.model';
import { VendorService } from './vendor.service';
import { VendorHistoryComponent } from '../vendor-history/vendor-history.component';
import { DropdownService } from 'src/app/core/services/dropdown.service';
import { DropDownModel } from 'src/app/core/models/drop-down.model';
import { VendorActivityComponent } from '../vendor-activity/vendor-activity.component';
import { MultiSelectComponent } from '@progress/kendo-angular-dropdowns';
import { delay, switchMap, map, tap } from 'rxjs/operators';
import { from } from 'rxjs';
//import { VendorFooterComponent } from '../vendor-footer/vendor-footer.component';
import { Subscription } from 'rxjs';
import { BooleanOptions } from '../../../../core/models/enum-model';
import { environment } from 'src/environments/environment';
import { VendorTabs } from '../../../../core/models/enum-model';
import * as fileSaver from 'file-saver';
import { UserPreferenceModel } from 'src/app/core/models/preference.model';
import { UserPreferenceService } from 'src/app/core/services/user-preference.service';
import { PaginationRequest } from 'src/app/core/models/pagination.model';
import { PagerService } from 'src/app/core/services/pager.service';
import { ModuleNames, ErrorMessages } from 'src/app/core/constant';
import { ErrorHandlerService } from 'src/app/core/services';

@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.scss'],
})
export class VendorComponent implements OnInit {
  @ViewChild(DataBindingDirective) dataBinding: DataBindingDirective;
  @ViewChild(VendorContactComponent) vendorContacts: VendorContactComponent;
  @ViewChild(VendorInfoComponent) vendorInfo: VendorInfoComponent;
  //@ViewChild(VendorMoreInfoComponent) vendorMoreInfo: VendorMoreInfoComponent;
  @ViewChild(VendorNotesComponent) vendorNotes: VendorNotesComponent;
  @ViewChild(VendorHistoryComponent) vendorHistory: VendorHistoryComponent;
  @ViewChild(VendorActivityComponent) vendorActivity: VendorActivityComponent;
  //@ViewChild(VendorFooterComponent) vendorFooter: VendorFooterComponent;
  @ViewChild('multiselect') public multiselect: MultiSelectComponent;

  @Input() gridList: any;
  public pageSize = 5;
  public skip = 0;
  loader: any;
  source: any;
  public opened = true;
  public dataSaved = false;
  isSSGRight: boolean = false;
  isNew: boolean = false;
  saveData: boolean = false;
  booleanType = new BooleanOptions();
  vendorDetail: VendorModel;
  public close() {
    this.opened = false;
  }

  public open() {
    this.opened = true;
  }

  public submit() {
    this.dataSaved = true;
    this.close();
  }
  filterpopup = {
    status: this.booleanType.true,
    vendorTypeList: [],
    terms: '',
    vendorTypes: '',
    state: '',
    showSSG: this.booleanType.false,
    isNational: this.booleanType.All,
  };
  public columns: any = [
    {
      Name: 'status',
      isCheck: false,
      Text: 'Status',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'vendorName',
      isCheck: true,
      Text: 'Vendor Name',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'vendorTypes',
      isCheck: true,
      Text: 'Vendor Type',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'terms',
      isCheck: false,
      Text: 'Terms',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'phone',
      isCheck: false,
      Text: 'Phone',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'email',
      isCheck: false,
      Text: 'Email',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'address',
      isCheck: false,
      Text: 'Billing Address',
      isDisable: false,
      index: 0,
      width: 100,
    },
  ];
  public viewColumns = [
    {
      Name: 'vendorName',
      isCheck: true,
      Text: 'Vendor Name',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'vendorTypes',
      isCheck: true,
      Text: 'Vendor Type',
      isDisable: true,
      index: 1,
      width: 100,
    },
  ];
  public hiddenColumns: string[] = [
    'status',
    'terms',
    'phone',
    'email',
    'address',
  ];
  public temphiddenColumns: string[] = [];
  public statusData: any = [
    { value: 'Active', id: 1 },
    { value: 'All', id: 0 },
  ];
  public sort: SortDescriptor[] = [
    {
      field: 'vendorName',
      dir: 'asc',
    },
  ];
  public mySelection: number[] = [0];

  ssgVendor: number = this.booleanType.All;
  isNational: number = this.booleanType.All;
  filterNational: boolean = false;
  filterSSG: boolean = false;
  filterState: boolean = false;
  filterTerms: boolean = false;
  isSave: boolean = true;
  isPrint: boolean = true;
  isCancel: boolean = true;
  isEdit: boolean = true;
  isAdd: boolean = false;
  isAddRight: boolean = false;
  isUpdateRight: boolean = false;
  isTab1: boolean = false;
  isTab2: boolean = false;
  isTab3: boolean = false;
  isTab4: boolean = false;
  isTab5: boolean = false;
  isTab6: boolean = false;
  tabList = {
    VendorInfo: true,
    MoreInfo: true,
    Contacts: true,
    Activity: true,
    Notes: true,
    History: true,
  };
  data: any;
  @Input() onChange;
  vendor: VendorModel[];
  id: number;
  cdate: any = new Date();
  status: number = this.booleanType.true;
  inactive: boolean = false;
  tabActive: boolean = true;
  //isDisable: boolean = true;
  isDisabled: boolean = true;
  cInfos: any;
  selectedTab = 'Vendor Info';
  selectedTabIndex = 0;
  tempvendor: any;
  tempId: number;
  filterText: string='';
  vendorName: string;
  VendorType: DropDownModel[];
  show: boolean;
  toggleText: string;
  SaveChange: BehaviorSubject<any> = new BehaviorSubject(null);
  @ViewChild('anchor') public anchor: ElementRef;
  @ViewChild('popup', { read: ElementRef }) public popup: ElementRef;
  TermsData: DropDownModel[];
  TermsDataFilter: DropDownModel[];
  stateList: DropDownModel[];
  stateData: DropDownModel[];
  //@HostListener("keydown", ["$event"])
  tabs = VendorTabs;

  public keydown(event: any): void {
    if (event.keyCode === 27) {
      this.toggle(false);
    }
  }

  //@HostListener("document:click", ["$event"])
  public documentClick(event: any): void {
    if (!this.contains(event.target)) {
      this.toggle(false);
    }
  }
  clickEventsubscription: Subscription;
  message: any;
  userPreferenceModel: UserPreferenceModel;
  totalVendor: number = 0;
  constructor(
    public service: VendorService,
    public menuService: MenuService,
    public utils: UtilityService,
    public router: Router,
    public dropdownservice: DropdownService,
    public preference: UserPreferenceService,
    public pagerService: PagerService,
    public errorHandler: ErrorHandlerService
  ) {
    if (localStorage.getItem('isAdmin') == 'true') {
      this.isTab1 = false;
      this.isTab2 = false;
      this.isTab3 = false;
      this.isTab4 = false;
      this.isTab5 = false;
      this.isTab6 = false;
    } else {
      let acc = this.menuService.checkUserViewRights('vendor');
      if (acc) {
        //this.utils.toast.error("User does not have rights to access " + name + " module.");Z
      } else {
        this.utils.toast.error(
          'You do not have permissions to access this part of the system. Please contact your supervisor so they can request them from IT.'
        );
        setTimeout(() => {
          var url = '/dashboard';
          location.href = url;
        }, 1000);
      }
      const rights = JSON.parse(localStorage.getItem('Rights'));

      if (rights) {
        this.isTab1 = !rights.some(
          (c) =>
            c.subModuleName == 'Vendor Info' &&
            c.moduleName == 'Vendor' &&
            c.tabName == 'VIEW'
        );
        // this.isTab2 = !rights.some(
        //   (c) => c.subModuleName == 'More Info' && c.tabName == 'VIEW'
        // );
        this.isTab3 = !rights.some(
          (c) =>
            c.subModuleName == 'Contacts' &&
            c.moduleName == 'Vendor' &&
            c.tabName == 'VIEW'
        );
        this.isTab4 = !rights.some(
          (c) =>
            c.subModuleName == 'Activity' &&
            c.moduleName == 'Vendor' &&
            c.tabName == 'VIEW'
        );
        this.isTab5 = !rights.some(
          (c) =>
            c.subModuleName == 'Notes' &&
            c.moduleName == 'Vendor' &&
            c.tabName == 'VIEW'
        );
        this.isTab6 = !rights.some(
          (c) =>
            c.subModuleName == 'History' &&
            c.moduleName == 'Vendor' &&
            c.tabName == 'VIEW'
        );
      }
    }
    this.menuService.checkUserBySubmoduleRights('Vendor Info');

    this.isAddRight = this.menuService.isAddRight;
    this.isUpdateRight = this.menuService.isEditRight;
    this.menuService.checkVendorMoreRights('More Info');

    this.isSSGRight = this.menuService.isSSGRight;
  }

  ngOnInit(): void {
    // this.clickEventsubscription = this.utils.getClickEvent().subscribe((a) => {
    //   this.message = a
    //   this.callBack(this.message);
    // });
    this.pagerService.load();
    this.loadItems();
    this.GetTermsList();
    this.GetVendorType();
    this.GetState();
  }
  ngOnDestroy() {
    this.savePreference();
    console.log('Goodbye Vendor!');
  }
  ngAfterViewInit() {
    const contains = (value) => (s) =>
      s.value.toLowerCase().indexOf(value.toLowerCase()) !== -1;

    this.multiselect.filterChange
      .asObservable()
      .pipe(
        switchMap((value) =>
          from([this.source]).pipe(
            tap(() => (this.multiselect.loading = true)),
            delay(1000),
            map((data) => data.filter(contains(value)))
          )
        )
      )
      .subscribe((x) => {
        this.VendorType = x;
        this.multiselect.loading = false;
      });
  }
  GetVendorType() {
    this.dropdownservice.GetLookupList('VendorType').subscribe(
      (res) => {
        if (res) {
          this.VendorType = res;
          this.source = res;
          this.vendorInfo.VendorType=this.VendorType;
          this.vendorInfo.source=this.source;
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.drop_down.vendor_type);
      }
    );
  }
  public onTabSelect(e) {
    this.selectedTab = e.title;
    this.selectedTabIndex = e.index;
    //this.editClick(this.id);
    this.isPrint = true;
    if (this.selectedTab == this.tabs.tab1) {
      //0
      this.isAdd = false;this.vendorInfo.onEdit(this.vendorDetail);
      this.isEdit = false;
      this.menuService.checkUserBySubmoduleRights('Vendor Info');
    } else if (this.selectedTab == this.tabs.tab2) {
      //1
      this.isAdd = true;
      this.isEdit = true;
      this.isSave = true;
      this.isCancel = true;  this.vendorContacts.onEdit(this.vendorDetail);
      // this.isTab1 = false;
      // this.isTab2 = false;
      // this.isTab3 = false;
      // this.isTab4 = false;
      // this.isTab5 = false;
      // this.isTab6 = false;
      // this.menuService.checkUserBySubmoduleRights('Contacts');
    } else if (this.selectedTab == this.tabs.tab4) {
      //3
      this.isAdd = true;
      this.isEdit = true;
      this.isSave = true;
      this.isCancel = true;this.vendorNotes.onEdit(this.vendorDetail);
      //this.menuService.checkUserBySubmoduleRights('Notes');
    } else if (this.selectedTab == this.tabs.tab3) {
      //2
      this.isAdd = true;
      this.isEdit = true;
      this.isSave = true;
      this.isCancel = true;this.vendorActivity.onEdit(this.vendorDetail);
      this.utils.storage.setItem('vendorId', this.id.toString());
      this.isPrint = false;
      //this.menuService.checkUserBySubmoduleRights('Activity');
    } else {
      this.isAdd = true;
      this.isEdit = true;
      this.isSave = true;
      this.isCancel = true; this.vendorHistory.historyList(this.vendorDetail);
    }
  }

  editClick(id: number) {
    this.id = id;
    this.isNew = false;
    this.tempId = id;
    this.isCancel = true;
    this.isSave = true;
    if (
      this.selectedTab == this.tabs.tab2 ||
      this.selectedTab == this.tabs.tab3 ||
      this.selectedTab == this.tabs.tab4 ||
      this.selectedTab == this.tabs.tab5
    ) {
      this.isAdd = true;
      this.isEdit = true;
    } else {
      this.isAdd = false;
      this.isEdit = false;
    }
    this.service.getOneById(id).subscribe(
      (res) => {
        if (res) {
          this.utils.storage.setItem('vendorId', this.id.toString());
          this.cdate = res['createdDate'];
          this.vendorName = res['vendorName'];
          this.inactive = res['active'];
          this.isDisabled = true;
          this.vendorDetail = res;
          if (this.selectedTab == this.tabs.tab1) {
            //0
            //this.isDisabled = false;
            this.vendorInfo.onEdit(res);
            this.tabList.VendorInfo = false;
            this.tabList.MoreInfo = true;
            this.tabList.Contacts = true;
            this.tabList.Notes = true;
            this.tabList.History = true;
            this.tabList.Activity = true;
          }
          // if (this.selectedTab == 1) {
          //   this.vendorMoreInfo.onEdit(res);
          //   this.tabList.VendorInfo = true;
          //   this.tabList.MoreInfo = false;
          //   this.tabList.Contacts = true;
          //   this.tabList.Notes = true;
          //   this.tabList.History = true;
          //   this.tabList.Activity = true;
          // }
          if (this.selectedTab == this.tabs.tab2) {
            //1

            this.vendorContacts.onEdit(res);
            this.tabList.VendorInfo = true;
            this.tabList.MoreInfo = true;
            this.tabList.Contacts = false;
            this.tabList.Notes = true;
            this.tabList.History = true;
            this.tabList.Activity = true;
          }
          if (this.selectedTab == this.tabs.tab3) {
            // 2

            this.vendorActivity.onEdit(res);
            this.tabList.VendorInfo = true;
            this.tabList.MoreInfo = true;
            this.tabList.Contacts = true;
            this.tabList.Notes = true;
            this.tabList.History = true;
            this.tabList.Activity = false;
          }
          if (this.selectedTab == this.tabs.tab4) {
            //3
            this.vendorNotes.onEdit(res);
            this.tabList.VendorInfo = true;
            this.tabList.MoreInfo = true;
            this.tabList.Contacts = true;
            this.tabList.Notes = false;
            this.tabList.History = true;
            this.tabList.Activity = true;
          }
          if (this.selectedTab == this.tabs.tab5) {
            //4
            this.vendorHistory.historyList(res);
            this.tabList.VendorInfo = false;
            this.tabList.MoreInfo = false;
            this.tabList.Contacts = false;
            this.tabList.Notes = false;
            this.tabList.History = false;
            this.tabList.Activity = false;
          }
          //this.SaveChange.next(res);
          this.utils.vensendClickEvent(id);
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.vendor.get_one_by_id);
      }
    );
  }

  editClickWithoutLoader(id: number) {
    this.id = id;
    this.isCancel = true;
    this.isSave = true;
    if (
      this.selectedTab == this.tabs.tab2 ||
      this.selectedTab == this.tabs.tab3 ||
      this.selectedTab == this.tabs.tab4 ||
      this.selectedTab == this.tabs.tab5
    ) {
      this.isAdd = true;
      this.isEdit = true;
    } else {
      this.isAdd = false;
      this.isEdit = false;
    }

    this.service.GetById(id).subscribe(
      (res) => {
        if (res) {
          this.cdate = res['createdDate'];
          this.inactive = res['active'];
          this.vendorName = res['vendorName'];
          //this.isDisabled = true;
          if (this.selectedTab == this.tabs.tab1) {
            //this.isDisabled = false;
            this.saveData = false;
            this.vendorInfo.onEdit(res);
          }
          //if (this.selectedTab == 1) this.vendorMoreInfo.onEdit(res);
          if (this.selectedTab == this.tabs.tab2)
            this.vendorContacts.onEdit(res);
          if (this.selectedTab == this.tabs.tab4) this.vendorNotes.onEdit(res);
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.vendor.get_by_id);
      }
    );
  }

  onSave() {
    let saveStatus = false;
    this.saveData = true;
    if (this.selectedTab == this.tabs.tab1) {
      saveStatus = this.vendorInfo.onSave(this.inactive);

      if (saveStatus) return false;
      setTimeout(() => {
        this.loadItems();
      }, 1500);
    }

    if (this.selectedTab == this.tabs.tab2) {
      saveStatus = this.vendorContacts.onSave();
    }
    if (this.selectedTab == this.tabs.tab4) {
      saveStatus = this.vendorNotes.onSave();
    }
    // if (saveStatus)
    //   return;
    // else
    //   this.loadItems();

    this.isDisabled = true;
    this.isAdd = false;
    this.isEdit = false;
    this.disbaleBtn(); 
    //this.btnCancel();
    // this.editClick(this.tempId);
  }
  btnAdd() {
    this.enableBtn();
    this.isEdit = true;
    this.isAdd = true;
    this.tempId = this.id;
    this.id = 0;
    this.cdate = new Date();
    this.vendorName = '';
    this.inactive = true;
    if (this.selectedTab == this.tabs.tab1) {
      this.isDisabled = false;
      this.vendorInfo.form.reset();
      this.vendorInfo.btnAdd();
      //this.getNextVendorId();
      // this.vendorMoreInfo.form.reset();
      // this.vendorContacts.form.reset();
      // this.vendorNotes.form.reset();
    }
    //  if (this.selectedTab == 1) this.vendorMoreInfo.btnAdd();
    if (this.selectedTab == this.tabs.tab2) this.vendorContacts.btnAdd();
    if (this.selectedTab == this.tabs.tab4) this.vendorNotes.btnAdd();
  }
  btnEdit() {
    this.enableBtn();
    this.isEdit = true;
    this.isAdd = true;
    this.tempId = this.id;
    if (this.selectedTab == this.tabs.tab1) {
      this.isDisabled = false;
      this.vendorInfo.btnEdit();
      // this.vendorMoreInfo.btnEdit()
    }
    //  if (this.selectedTab == 1) this.vendorMoreInfo.btnEdit();
    if (this.selectedTab == this.tabs.tab2) this.vendorContacts.btnEdit();
    if (this.selectedTab == this.tabs.tab4) this.vendorNotes.btnEdit();
  }
  btnCancel() {
    this.disbaleBtn();

    // if (this.isNew == true && this.saveData == false) {
    //   this.deleteVendorId();
    // }
    this.editClick(this.tempId);

    if (this.selectedTab == this.tabs.tab1) {
      this.isDisabled = true;
      this.vendorInfo.btnCancel();
      // this.vendorMoreInfo.btnCancel();
    }
    // if (this.selectedTab == 1) this.vendorMoreInfo.btnCancel();
    if (this.selectedTab == this.tabs.tab2) this.vendorContacts.btnCancel();
    if (this.selectedTab == this.tabs.tab4) this.vendorNotes.btnCancel();
  }

  enableBtn() {
    this.isSave = false;
    this.isCancel = false;
  }
  disbaleBtn() {
    this.isSave = true;
    this.isCancel = true;
  }

  OnAddUpdate(res) {
    this.loadItems();
  }

  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.loadItems();
  }
  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.data = {
      data: orderBy(this.vendor, this.sort),
      total: this.vendor.length,
    };
    this.data = this.data.data;
    this.mySelection = [0];
    this.id = this.data[0].id;
    this.editClickWithoutLoader(this.id);
  }
  private loadItems(mergeData?: boolean): void {
    this.loader = true;
    let actv = this.status;
    this.filterpopup.status = this.status;
    this.filterpopup.showSSG = this.ssgVendor;
    this.filterpopup.isNational = this.isNational;

    var request = new PaginationRequest<any>();
    request.start = this.pagerService.start;
    request.end = this.pagerService.end;
    request.pageSize = this.pagerService.pageSize;
    this.filterpopup.vendorTypes =
      this.filterpopup.vendorTypeList?.length > 0
        ? this.filterpopup.vendorTypeList.join()
        : '';
    request.request = this.filterpopup;
    this.service.GetListFilter(request).subscribe(
      (res) => {
        if (res != null && res.data.length > 0) {
          this.totalVendor = res.totalRecords;
          // this.pagerService.setHasMore(res.hasMore);
          // this.data = mergeData ? this.data.concat(res.data) : res.data;

          this.data = res.data; // this.data;
          this.vendor = [...this.data];
          this.tempvendor = res.data;
          this.loader = false;
          this.getPreference();
          if (this.filterText) this.onFilter();
          // if (this.id > 0) {
          //   this.editClick(this.id);
          // } else {
          //   this.editClick(this.vendor[0].id);
          // }
          var handleEvent = (event) => {
            this.handleScroll(event);
          };

          this.pagerService.registerScrollEvent(handleEvent);

          //this.filterText = "";
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.vendor.get_list_filter);
      }
    );
  }
  public handleScroll(event) {
    if (this.pagerService.enableLoadMoreItems(event)) {
      // the element reach the end of vertical scroll
      this.loadMoreItems();
    }
  }

  public loadMoreItems() {
    if (this.pagerService.hasMore) {
      this.pagerService.loadMore();
      this.loadItems(true);
    }
  }

  GetTermsList() {
    this.dropdownservice.GetLookupList('VendorTerms').subscribe(
      (res) => {
        if (res) {
          this.TermsData = res.sort((a, b) => a.value.localeCompare(b.value));
          this.TermsDataFilter = res.sort((a, b) =>
            a.value.localeCompare(b.value)
          );
          this.vendorInfo.TermsData = this.TermsData;
          this.vendorInfo.TermsDataFilter = this.TermsDataFilter;
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.drop_down.vendor_terms);
      }
    );
  }

  public onFilter(): void {
    //this.filterText = inputValue;

    //this.mySelection = [];
    this.data = process(this.tempvendor, {
      filter: {
        logic: 'or',
        filters: [
          {
            field: 'vendorName',
            operator: 'contains',
            value: this.filterText,
          },
          {
            field: 'vendorType',
            operator: 'contains',
            value: this.filterText,
          },
          {
            field: 'qbNameMDI',
            operator: 'contains',
            value: this.filterText,
          },
          {
            field: 'qbNameGPC',
            operator: 'contains',
            value: this.filterText,
          },
          {
            field: 'address',
            operator: 'contains',
            value: this.filterText,
          },
          {
            field: 'address2',
            operator: 'contains',
            value: this.filterText,
          },
          {
            field: 'state',
            operator: 'contains',
            value: this.filterText,
          },
          {
            field: 'city',
            operator: 'contains',
            value: this.filterText,
          },
          {
            field: 'zip',
            operator: 'contains',
            value: this.filterText,
          },
          {
            field: 'comments',
            operator: 'contains',
            value: this.filterText,
          },
          {
            field: 'terma',
            operator: 'contains',
            value: this.filterText,
          },
          {
            field: 'phoneNormal',
            operator: 'contains',
            value: this.filterText,
          },
          {
            field: 'email',
            operator: 'contains',
            value: this.filterText,
          },
        ],
      },
    }).data;

    // this.data = this.vendor.filter(function (ele, i, array) {
    //   let arrayelement = ele.vendorName.toLowerCase();
    //   return arrayelement.includes(inputValue);
    // });
    // if(!this.filterText)
    //   {
    if (this.saveData == false) {
      this.mySelection = [0];
      this.id = this.data.length == 0 ? 0 : this.data[0].id;
    }
    // }
    this.vendor = this.data;
    this.totalVendor=this.vendor.length;
    if (this.data.length > 0) this.editClickWithoutLoader(this.id);
    else {
      this.vendorInfo.value = [];
      this.vendorInfo.form.reset();
      this.vendorInfo.fullAddress = '';
      this.vendorInfo.fullAdressLable = '';
      this.vendorInfo.shipfullAddress = '';
      this.vendorInfo.shipfullAdressLable = '';
      //  this.vendorMoreInfo.form.reset();
      // this.vendorContacts.form.reset();
      // this.vendorNotes.form.reset();
    }
    //this.dataBinding.skip = 0;
  }
  onSearchClick() {
    this.onFilter();
    
  }
  VendorInActive(event) {
    // this.data = this.vendor.filter(x => x.inactive == event);
    this.status = event == true ? this.booleanType.true : this.booleanType.All;
    this.id = 0;
    this.mySelection = [0];
    this.loadItems();
  }
  SSGvendorActive(event) {
    this.ssgVendor =
      event == true ? this.booleanType.true : this.booleanType.All;
    //this.id = 0;
    //this.mySelection = [0];
    //this.loadItems();
  }
  nationalVendorActive(event) {
    this.isNational =
      event == true ? this.booleanType.true : this.booleanType.All;
  }
  OnAddClick() {
    this.editClick(0);
    this.SaveChange.next(null);
    this.id = 0;
    this.cdate = '';
    this.inactive = true;
  }
  public state: State = {
    skip: 0,
    take: 5,

    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: [{ field: 'vendorName', operator: 'contains', value: 'Chef' }],
    },
  };

  public dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    this.data = process(this.vendor, this.state);
  }

  GetState() {
    this.dropdownservice.GetLookupList('States').subscribe(
      (res) => {
        if (res) {
          this.stateList = res;
          this.stateData = res;
          this.vendorInfo.stateList=this.stateList;
          this.vendorInfo.stateData=this.stateData;
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.drop_down.states);
      }
    );
  }
  //// For Advance Filter

  public isDisabledColumn(columnName: string): boolean {
    return (
      this.columns.length - this.temphiddenColumns.length === 1 &&
      !this.isHiddenTemp(columnName)
    );
  }

  public hideColumn(): void {
    // this.temphiddenColumns = [];
    // this.columns.forEach(element => {
    //   if (!element.isCheck)
    //     this.temphiddenColumns.push(element.Name);
    // });
    this.columns.forEach((element) => {
      if (element.isCheck) {
        var inde = this.viewColumns.find((c) => c.Name == element.Name);
        if (!inde) {
          this.viewColumns.push(element);
        }
      } else {
        var index = this.viewColumns.findIndex((c) => c.Name == element.Name);
        if (index > 0) {
          this.viewColumns.splice(index, 1);
        }
      }
    });
  }

  public onToggle(): void {
    this.show = !this.show;
    this.toggleText = this.show ? 'Hidе' : 'Show';

    let aaa = this.columns.filter((x) => x.isCheck == true);
    if (aaa.length == 1) {
      this.columns.forEach((element) => {
        if (element.Name != aaa[0].Name) {
          this.temphiddenColumns.push(element.Name);
        }
      });
      this.isDisabledColumn(aaa[0].Name);
    }
  }
  public isHidden(columnName: string): boolean {
    return this.hiddenColumns.indexOf(columnName) > -1;
  }

  public isHiddenTemp(columnName: string): boolean {
    return this.temphiddenColumns.indexOf(columnName) > -1;
  }

  columnApply() {
    if (this.filterpopup.state != '') this.filterState = true;
    else this.filterState = false;
    if (this.filterpopup.terms != '') this.filterTerms = true;
    else this.filterTerms = false;
    if (this.ssgVendor == this.booleanType.true) this.filterSSG = true;
    else this.filterSSG = false;

    if (this.isNational == this.booleanType.true) this.filterNational = true;
    else this.filterNational = false;
    // Column Filter

    // if (this.temphiddenColumns.length == 0) {
    //   this.temphiddenColumns = ['status', 'terms', 'phone', 'email', 'address'];
    // }
    // this.hiddenColumns = this.temphiddenColumns;
    // this.temphiddenColumns = [];
    // let filteredData = [];
    // this.columns.forEach(element => {
    //   let data = this.hiddenColumns.find(x => x == element.Name);
    //   if (!data)
    //     filteredData.push(element.Name);
    // });
    this.savePreference();
    /// Data Filter
    this.AdvanceFilterData();
    this.show = !this.show;
  }

  AdvanceFilterData() {
    this.filterpopup.status == null
      ? this.booleanType.true
      : this.booleanType.false;
    this.filterpopup.showSSG = this.ssgVendor;
    this.filterpopup.isNational = this.isNational;
    this.filterpopup.vendorTypes =
      this.filterpopup.vendorTypeList?.length > 0
        ? this.filterpopup.vendorTypeList.join()
        : '';

    var request = new PaginationRequest<any>();
    request.start = this.pagerService.start;
    request.end = this.pagerService.end;
    request.pageSize = this.pagerService.pageSize;
    this.filterpopup.vendorTypes =
      this.filterpopup.vendorTypeList?.length > 0
        ? this.filterpopup.vendorTypeList.join()
        : '';
    request.request = this.filterpopup;
    this.service.GetListFilter(request).subscribe((res) => {
      if (res != null && res.data.length > 0) {
        this.totalVendor = res.totalRecords;
        this.data = res.data;// this.data;
        this.vendor = [...this.data];
        this.tempvendor = res.data;
        // this.data = res;
        // this.vendor = res;
        // this.tempvendor = res;
        this.loader = false;
        if (this.filterText) this.onFilter();
        this.editClick(this.vendor[0].id);
      } else {
        this.data = [];
        this.vendor = [];
        this.loader = false;
      }
    },
        (error) => {
            this.onError(error, ErrorMessages.vendor.get_list_filter);
        });
  }

  closepopup() {
    this.show = !this.show;
    this.filterState = false;
    this.filterTerms = false;
  }
  resetState() {
    this.filterState = false;
    this.filterpopup.state = '';
  }
  resetTerms() {
    this.filterTerms = false;
    this.filterpopup.terms = '';
  }
  resetSSG() {
    this.filterSSG = false;
    this.filterpopup.showSSG = this.booleanType.All;
    this.ssgVendor = this.booleanType.All;
  }
  resetNational() {
    this.filterNational = false;
    this.filterpopup.isNational = this.booleanType.All;
    this.isNational = this.booleanType.All;
  }
  resetpopup() {
    this.columns = [
      { Name: 'status', isCheck: false, Text: 'Status', isDisable: false },
      {
        Name: 'vendorType',
        isCheck: true,
        Text: 'Vendor Type',
        isDisable: false,
      },
      { Name: 'terms', isCheck: false, Text: 'Terms', isDisable: false },
      { Name: 'phone', isCheck: false, Text: 'Phone', isDisable: false },
      { Name: 'email', isCheck: false, Text: 'Email', isDisable: false },
      {
        Name: 'address',
        isCheck: false,
        Text: 'Billing Address',
        isDisable: false,
      },
    ];
    this.hiddenColumns = ['status', 'terms', 'phone', 'email', 'address'];
    this.temphiddenColumns = ['status', 'terms', 'phone', 'email', 'address'];
    this.isNational = this.booleanType.All;
    this.ssgVendor = this.booleanType.All;
    this.filterpopup.status = this.booleanType.true;
    this.filterpopup.showSSG = this.booleanType.All;
    this.filterpopup.isNational = this.booleanType.All;
    this.filterpopup.terms = '';
    this.filterpopup.vendorTypeList = [];
    this.filterpopup.vendorTypes = '';
    this.filterpopup.state = '';
  }

  private contains(target: any): boolean {
    return (
      this.anchor.nativeElement.contains(target) ||
      (this.popup ? this.popup.nativeElement.contains(target) : false)
    );
  }

  public toggle(show?: boolean): void {
    this.show = show !== undefined ? show : !this.show;
    this.toggleText = this.show ? 'Hide' : 'Show';
  }

  joinbillingAddress(data) {
    let fulladdarray = [data.address, data.address2, data.city, data.state];
    let zopcode = data.zip != null && data.zip != '' ? '-' + data.zip : '';
    return (
      fulladdarray.filter((x) => x != '' && x != null).join(', ') + zopcode
    );
  }

  onVendortypeChange(data) {
    this.AdvanceFilterData();
  }
  termshandleFilter(value) {
    this.TermsData = this.TermsDataFilter.filter(
      (s) => s.value.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }
  statehandleFilter(value) {
    this.stateList = this.stateData.filter(
      (s) => s.value.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }
  getNextVendorId() {
    this.service.GetNextId().subscribe(
      (res) => {
        if (res != null) {
          this.id = res.result.vendorId;
          this.isNew = true;
          this.vendorInfo.btnAdd();
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.vendor.get_next_id);
      }
    );
  }
  deleteVendorId() {
    this.service.deleteId(this.id).subscribe(
      (res) => {
        this.isNew = true;
      },
      (error) => {
        this.onError(error, ErrorMessages.vendor.delete_id);
      }
    );
  }

  callBack(value) {
    var data = JSON.stringify(value);
  }
  downloadFile() {
    this.service.downloadVendorData().subscribe(
      (res) => {
        let data = new Blob([res], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;',
        });
        fileSaver.saveAs(data, 'Vendor_Info.xlsx');
      },
      (error) => {
        this.onError(error, ErrorMessages.vendor.download_vendor_data);
      }
    );
    //window.open(environment.apiUrl + 'Vendor/ExportToExcel');
  }

  savePreference() {
    var usr = JSON.parse(localStorage.getItem('currentUser'));
    if (usr) {
      this.userPreferenceModel = new UserPreferenceModel();
      this.userPreferenceModel.userName = usr.userId;
      this.userPreferenceModel.id = 0;
      this.userPreferenceModel.userId = 0;
      this.userPreferenceModel.page = 'Vendor';
      var objd = {
        columns: this.hiddenColumns,
        order: this.viewColumns,
        width: this.columnWidths,
        sortBy: this.sort,
      };
      this.userPreferenceModel.preference = objd; //'{ columns: ' + this.hiddenColumns + ', order: ' + this.sort[0].dir + ', width: "", sortBy: ' + this.sort[0].field + '}';
      this.preference
        .SaveUserPreference(this.userPreferenceModel)
        .subscribe((res) => {});
    }
  }
  getPreference() {
    try {
      this.preference.GetUserPreference('Vendor').subscribe((res) => {
        if (res.result) {
          var userPref = res.result.preference;
          this.viewColumns = userPref.order.filter((c) => c.isCheck == true);
          this.viewColumns.forEach((element) => {
            let col = this.columns.findIndex((c) => c.Name == element.Name);
            this.columns[col].isCheck = true;
          });
          this.sort = userPref.sortBy;
          this.data = {
            data: orderBy(this.vendor, this.sort),
            total: this.vendor.length,
          };
          this.data = this.data.data;
          if(this.tempId){
            this.mySelection=[this.data.findIndex(c=> c.id==this.tempId)];
            this.editClick(this.tempId);
          }else{
          this.mySelection = [0];
          this.id = this.data[0].id;
          this.editClick(this.id);}
        } else {
          this.viewColumns.forEach((element) => {
            let col = this.columns.findIndex((c) => c.Name == element.Name);
            this.columns[col].isCheck = true;
          });
          this.editClick(this.vendor[0].id);
        }
       
      });
    } catch (error) {
      this.viewColumns.forEach((element) => {
        let col = this.columns.findIndex((c) => c.Name == element.Name);
        this.columns[col].isCheck = true;
      });
    }
  }
  reorderColumns(event) {
    var newIndx = event.newIndex;
    var oldIndx = event.oldIndex;
    var column = event.column.field;

    let cutOut = this.viewColumns.splice(oldIndx, 1)[0]; // cut the element at index 'from'
    this.viewColumns.splice(newIndx, 0, cutOut); // insert it at index 'to'

    //this.savePreference();
  }
  columnWidths: any = [];
  resizeColumns(eventData) {
    let col = this.viewColumns.findIndex(
      (c) => c.Name == eventData[0].column.field
    );
    this.viewColumns[col].width = eventData[0].newWidth;
  }

  private onError(error: any, customMessage?: string) {
    this.errorHandler.handleError(error, ModuleNames.vendor, customMessage);
  }
}
