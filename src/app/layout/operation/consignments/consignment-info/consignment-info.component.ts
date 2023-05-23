import { Component, OnInit, ViewChild } from '@angular/core';
import { PageChangeEvent } from '@progress/kendo-angular-grid';
import { orderBy, SortDescriptor, process } from '@progress/kendo-data-query';
import { ErrorMessages } from 'src/app/core/constant';
import { MenuService } from 'src/app/core/helper/menu.service';
import { PaginationWithSortRequest } from 'src/app/core/models/pagination.model';
import { UserPreferenceModel } from 'src/app/core/models/preference.model';
import { ErrorHandlerService, PagerService } from 'src/app/core/services';
import { UserPreferenceService } from 'src/app/core/services/user-preference.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import {
  jobsData,
  jobsColums,
  subinvoiceData,
  subinvoiceColumns,
} from '../../../../../data/consitement.data';
import { ConsignmentInventoryComponent } from '../consignment-inventory/consignment-inventory.component';
import { ConsignmentInvoiceComponent } from '../consignment-invoice/consignment-invoice.component';
import { ConsignmentReportsComponent } from '../consignment-reports/consignment-reports.component';
import { ConsignmentService } from '../consignment.service';
// import debounce from 'debounce';
@Component({
  selector: 'app-consignment-info',
  templateUrl: './consignment-info.component.html',
  styleUrls: ['./consignment-info.component.scss'],
})
export class ConsignmentInfoComponent implements OnInit {
  @ViewChild(ConsignmentInventoryComponent)
  inventory: ConsignmentInventoryComponent;
  @ViewChild(ConsignmentReportsComponent)
  consignmentReports: ConsignmentReportsComponent;
  @ViewChild(ConsignmentInvoiceComponent) invoice: ConsignmentInvoiceComponent;

  data: any = [];
  sort: SortDescriptor[] = [{ field: 'jobNumber', dir: 'asc' }];
  selections: any = [];
  skip: number = 0;
  totalData: number = 0;
  public pageSize = 100;
  multiple: boolean = false;
  isInventoryVisible: boolean = false;
  isInvoiceVisible: boolean = false;
  visible: boolean = false;
  userPreferenceModel: UserPreferenceModel;
  pageSizeList: any = [
    { id: 0, value: 100 },
    { id: 0, value: 300 },
    { id: 0, value: 500 },
  ];
  jobs: any[];
  tempjobs: any[];
  jobColumns: any[];
  subinvoiceData: any[];
  subinvoiceColumns: any[];
  selectedTab: string = 'Inventory';
  columnWidths: any = [];
  jobNumber: any = '';
  searchValue: string = '';
  isTab1: boolean = false;
  isTab2: boolean = false;
  isTab3: boolean = false;
  isTab4: boolean = false;
  isTab5: boolean = false;
  constructor(
    public service: ConsignmentService,
    public pagerService: PagerService,
    public errorHandler: ErrorHandlerService,
    public utility: UtilityService,
    public preference: UserPreferenceService,
    public menuService: MenuService
  ) {
    if (localStorage.getItem('isAdmin') == 'true') {
      this.isTab1 = false;
      this.isTab2 = false;
      this.isTab3 = false;
      this.isTab4 = false;
      this.isTab5 = false;
    } else {
      let acc = this.menuService.checkUserViewRights('Consignments');
      if (acc) {
        //this.utils.toast.error("User does not have rights to access " + name + " module.");Z
      } else {
        this.utility.toast.error(
          'You do not have permissions to access this part of the system. Please contact your supervisor so they can request them from IT.'
        );
        setTimeout(() => {
          var url = '/dashboard';
          location.href = url;
        }, 1000);
      }

      const rights = JSON.parse(localStorage.getItem('Rights'));
      this.isTab1 = !rights.some(
        (c) =>
          c.subModuleName == 'Inventory' &&
          c.moduleName == 'Consignments' &&
          c.tabName == 'VIEW'
      );
      this.isTab2 = !rights.some(
        (c) =>
          c.subModuleName == 'Invoices' &&
          c.moduleName == 'Consignments' &&
          c.tabName == 'VIEW'
      );
      this.isTab3 = !rights.some(
        (c) =>
          c.subModuleName == 'Reports' &&
          c.moduleName == 'Consignments' &&
          c.tabName == 'VIEW'
      );
      this.isTab4 = !rights.some(
        (c) =>
          c.subModuleName == 'Notes' &&
          c.moduleName == 'Consignments' &&
          c.tabName == 'VIEW'
      );
      this.isTab5 = !rights.some(
        (c) =>
          c.subModuleName == 'History' &&
          c.moduleName == 'Consignments' &&
          c.tabName == 'VIEW'
      );
    }
    //this.jobs = jobsData;
    this.jobColumns = jobsColums;
    this.subinvoiceData = subinvoiceData;
    this.subinvoiceColumns = subinvoiceColumns;
    // this.onFilter = debounce(this.onFilter, 3000);
  }

  ngOnInit(): void {
    this.pagerService.start=1;
    this.loadItems();
  }

  loadItems(): void {
    var request = new PaginationWithSortRequest<any>();
    request.pageSize = this.pagerService.pageSize;
    request.pageNumber = this.pagerService.start;
    request.sortColumn = '';
    request.sortDesc = true;
    request.request = {
      pageNumber: 0,
      pageSize: 0,
    };
    this.visible = true;

    this.service
      .GetList({ ...request, request: { searchText: this.searchValue } })
      .subscribe(
        (res) => {
          this.visible = false;
          if (res.data != null && res.data.length > 0) {
            this.totalData = res.totalRecords;
            this.jobs = res.data;
            this.tempjobs = res.data;
            this.selections = [0];
            this.getPreference();
          } else {
            this.jobs = [];
            this.getPreference();
          }
        },
        (error) => {
          this.onError(error, ErrorMessages.vehicle.get_list);
        }
      );
  }

  savePreference() {
    var usr = JSON.parse(localStorage.getItem('currentUser'));
    if (usr) {
      this.userPreferenceModel = new UserPreferenceModel();
      this.userPreferenceModel.userName = usr.userId;
      this.userPreferenceModel.id = 0;
      this.userPreferenceModel.userId = usr.id;
      this.userPreferenceModel.page = 'Consignment';
      var objd = {
        columns: this.jobColumns,
        order: this.jobColumns,
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
      this.preference.GetUserPreference('Consignment').subscribe((res) => {
        if (res.result) {
          var userPref = res.result.preference;
          this.jobColumns = userPref.order.filter((c) => c.isCheck == true);
          this.sort = userPref.sortBy;
          this.data = {
            data: orderBy(this.jobs, this.sort),
            total: this.jobs.length,
          };
          this.jobs = this.data.data;
        }
        if (this.jobs.length) {
          this.jobNumber = this.jobs[0].jobNumber;
          this.onSelectionChange(this.jobs[0]);
        } else {
          this.onSelectionChange({});
        }
      });
    } catch (error) {}
  }

  public onPageChange(e: PageChangeEvent): void {
    this.skip = e.skip;
    this.pageSize = e.take;
    this.pagerService.start = this.skip == 1 ? 1 : this.skip / this.pageSize;
    // this.filterCollection.pageSize = this.pageSize;
    // this.tempPageNo = this.pagerService.start;

    this.loadItems();
  }
  public onFilter(inputValue: string): void {
    this.searchValue = inputValue;
    this.loadItems();
  }
  onResizeColumn(eventData) {
    let col = this.jobColumns.findIndex(
      (c) => c.Name == eventData[0].column.field
    );
    this.jobColumns[col].width = eventData[0].newWidth;

    this.savePreference();
  }

  onSelectionChange(event) {
    this.jobNumber = event?.jobNumber;
    if (this.selectedTab == 'Invoices') {
      this.invoice.GetInvoiceList(event?.jobNumber);
    } else {
      this.inventory.GetInventoryList(event?.jobNumber);
    }
    this.service.SetJobNumber(event?.jobNumber);
  }

  onSortChange(sort: SortDescriptor[]) {
    this.sort = sort;
    this.data = orderBy(this.tempjobs, sort);
    this.jobs = this.data;
    this.selections = [0];
    this.savePreference();
    this.loadItems();
  }

  onReOrderColumns(event) {
    var newIndx = event.newIndex;
    var oldIndx = event.oldIndex;
    var column = event.column.field;
    let cutOut = this.jobColumns.splice(oldIndx, 1)[0]; // cut the element at index 'from'
    this.jobColumns.splice(newIndx, 0, cutOut); // insert it at index 'to'
    this.savePreference();
  }

  onDataStateChange(event) {}

  onTabChange(event) {
    this.selectedTab = event.title;
    if (event.title === 'Invoices') {
      setTimeout(() => {
        this.invoice.GetInvoiceList(this.jobNumber);
      }, 300);
    } else if (event.title === 'Inventory') {
      setTimeout(() => {
        this.inventory.GetInventoryList(this.jobNumber);
        this.service.SetJobNumber(event.jobNumber);
      }, 300);
    }
  }
  private onError(error: any, customMessage?: string) {
    this.errorHandler.handleError(error, 'Consignment', error.message);
  }
}
