import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { SeriesLabels, ValueAxisLabels } from '@progress/kendo-angular-charts';
import {
  DataBindingDirective,
  GridComponent,
} from '@progress/kendo-angular-grid';
import { orderBy, process, SortDescriptor } from '@progress/kendo-data-query';
import { BehaviorSubject } from 'rxjs';
import { UtilityService } from 'src/app/core/services/utility.service';
import { BranchModel } from 'src/app/layout/admin/branch/branch.model';
import { BranchService } from 'src/app/layout/admin/branch/branch.service';
import { VendorService } from '../vendor/vendor.service';
import { VendorActivityService } from './vendor-activity.service';
import { environment } from 'src/environments/environment';
import * as fileSaver from 'file-saver';
import { ModuleNames, ErrorMessages } from 'src/app/core/constant';
import { ErrorHandlerService } from 'src/app/core/services';

interface Model {
  product: string;
  sales: number;
}

@Component({
  selector: 'app-vendor-activity',
  templateUrl: './vendor-activity.component.html',
  styleUrls: ['./vendor-activity.component.scss'],
})
export class VendorActivityComponent implements OnInit {
  products: any = [];
  tempproducts: any = [];
  public sort: SortDescriptor[] = [
    {
      field: 'branch',
      dir: 'asc',
    },
  ];
  productItems: any = [];
  vendorParts: any = [];
  viewBy: string = 'ByBranch';
  filterBy: string = 'Last12';

  show: boolean = false;
  isExported: boolean = false;
  status: any = [];
  skip: number;
  branch: BranchModel[];
  branchData: any;
  loader: any;
  isChartData: boolean = false;
  branchModel: any;
  statusModel: any;
  vendorId: any;
  selectedStatus: any[];
  totalPO: number;
  filterText: string;
  fromDate: string = '';
  toDate: string = '';

  showHistory: boolean = false;
  showParts: boolean = false;
  showReport: boolean = false;
  vendorPartsData: any;
  constructor(
    public branchService: BranchService,
    public service: VendorService,
    public activity: VendorActivityService,
    public utils: UtilityService,
    public errorHandler: ErrorHandlerService
  ) {}
  public seriesData: Model[] = [];
  ngOnInit(): void {
    this.vendorId = this.utils.storage.getItem('vendorId');

    this.status = [
      { id: 1, name: 'ALL', isCheck: false },
      { id: 2, name: 'OPEN', isCheck: false },
      { id: 3, name: 'PARTIALLY RECEIVED', isCheck: false },
      { id: 4, name: 'RECEIVED', isCheck: false },
      { id: 5, name: 'CLOSED', isCheck: false },
      { id: 6, name: 'VOID', isCheck: false },
    ];

    this.GetBranch();
  }
  onEdit(res) {
    this.isChartData = false;
    this.vendorId = res.id;
    this.productItems = [];
    this.vendorParts = [];
    if (this.showHistory) this.loadItems();
    if (this.showParts) this.bindVendorParts();
    if (this.showReport) this.bindChartData();
  }
  setVendorId(id) {
    this.vendorId = id;
    this.loadItems();
  }
  GetBranch() {
    this.branchService.GetBranchDropdown().subscribe(
      (res) => {
        if (res) {
          this.branch = res;
          this.branchData = res;
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.branch.dropdown);
      }
    );
  }
  branchhandleFilter(value) {
    this.branch = this.branchData.filter(
      (s) => s.value.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }
  public loadItems(): void {
    this.products = [];
    this.tempproducts = [];
    this.loader = true;
    this.showHistory = true;
    this.showParts = false;
    this.showReport = false;
    var obj = {
      vendorId: parseInt(this.vendorId),
      branchId: this.branchModel,
      poHeaderStatuses: [], //this.selectedStatus
    };
    this.service.GetPurchaseOrders(obj).subscribe(
      (res) => {
        if (res.length > 0) {
          this.products = res;
          this.tempproducts = res;
          this.totalPO = this.products.length;
          this.loader = false;
          //this.filterText = "";
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.vendor.get_purchase_orders);
      }
    );
    // this.bindVendorParts();
    // this.bindChartData();
  }
  bindVendorParts() {
    this.showHistory = false;
    this.showParts = true;
    this.showReport = false;
    this.vendorParts = [];

    this.service.GetVendorParts(this.vendorId).subscribe(
      (res) => {
        if (res != null && res.length > 0) {
          this.vendorParts = res;
          //this.totalPO = this.products.length;
          this.loader = false;
          //this.filterText = "";
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.vendor.get_vendor_parts);
      }
    );
  }
  bindChartData() {
    this.showHistory = false;
    this.showParts = false;
    this.showReport = true;

    this.seriesData = [];
    if (this.filterBy == 'Custom') {
      if (!this.fromDate && !this.toDate) {
        this.utils.toast.error('Please select Fromdate-Todate');
        return false;
      }
      this.show = true;
    }
    this.closepopup();
    var filterObj = {
      vendorId: parseInt(this.vendorId),
      viewOption: this.viewBy,
      filterOption: this.filterBy,
      fromDate: this.fromDate,
      toDate: this.toDate,
    };
    this.service.GetReportData(filterObj).subscribe(
      (res) => {
        this.isChartData = true;
        if (res.branches != null && res.branches.length > 0) {
          this.show = false;
          if (res.branches) {
            this.isChartData = true;
            this.seriesData = res.branches;
          }

          this.loader = false;
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.vendor.get_report_data);
      }
    );
  }
  onSelection(id) {
    this.productItems = [];
    this.service.GetPurchaseOrdersDetail(id).subscribe(
      (res) => {
        if (res != null && res.length > 0) {
          this.productItems = res;
          this.loader = false;
          //this.filterText = "";
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.vendor.get_purchase_orders_detail);
      }
    );
  }
  onStatuschange(val, event) {
    var filterProducts = [];
    // if (event.target.checked == false && val != 'ALL') {
    //   val = 'ALL';
    // }

    if (val == 'ALL') {
      this.products = this.tempproducts;
      if (this.branchModel) {
        this.products = this.products.filter(
          (c) => c.branch == this.branchModel.split('-')[0].toString().trim()
        );
      }
      this.status = [
        { id: 1, name: 'ALL', isCheck: true },
        { id: 2, name: 'OPEN', isCheck: false },
        { id: 3, name: 'PARTIALLY RECEIVED', isCheck: false },
        { id: 4, name: 'RECEIVED', isCheck: false },
        { id: 5, name: 'CLOSED', isCheck: false },
        { id: 6, name: 'VOID', isCheck: false },
      ];
    } else {
      this.status[0].isCheck = false;
      let actv = this.status.filter((c) => c.isCheck == true);
      this.selectedStatus = [];
      this.status.forEach((element) => {
        if (element.isCheck) this.selectedStatus.push(element.name);
      });
      filterProducts = this.tempproducts;

      if (this.selectedStatus.length > 0) {
        if (this.branchModel) {
          this.products = filterProducts.filter(
            (c) =>
              this.selectedStatus.includes(c.status) &&
              c.branch == this.branchModel.split('-')[0].toString().trim()
          );
        } else {
          this.products = filterProducts.filter((c) =>
            this.selectedStatus.includes(c.status)
          );
        }
      } else {
        this.status[0].isCheck = true;
        if (this.branchModel) {
          this.products = filterProducts.filter(
            (c) => c.branch == this.branchModel.split('-')[0].toString().trim()
          );
        } else {
          this.products = filterProducts;
        }
      }
    }
    this.totalPO = this.products.length;
  }

  public onFilter(inputValue: string): void {
    this.filterText = inputValue;

    this.products = process(this.tempproducts, {
      filter: {
        logic: 'or',
        filters: [
          {
            field: 'branch',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'poNumber',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'status',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'total',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'orderDate',
            operator: 'contains',
            value: inputValue,
          },
        ],
      },
    }).data;
  }
  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.products = {
      data: orderBy(this.tempproducts, this.sort),
      total: this.tempproducts.length,
    };
    this.products = this.products.data;
  }
  closepopup() {
    this.show = false;
  }
  openpopup() {
    this.show = !this.show;
  }
  partsExort(grid) {
    this.service.GetExportPart(this.vendorId).subscribe(
      (res) => {
        if (res.length > 0) {
          this.vendorPartsData = res;

          setTimeout(() => {
            grid.saveAsExcel();
            this.isExported = true;
            this.loader = false;
          }, 2000);

          //this.filterText = "";
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.vendor.get_export_part);
      }
    );
  }
  public exportToExcel() {
    this.service.downloadFile(this.vendorId).subscribe(
      (res) => {
        let data = new Blob([res], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;',
        });
        //const blob = new Blob([res], { type: 'application/octet-stream' });
        fileSaver.saveAs(data, 'Vendor_parts.xlsx');
        // const url= window.URL.createObjectURL(blob);
        // window.open(url);
      },
      (error) => {
        this.onError(error, ErrorMessages.vendor.download_file);
      }
    );
  }
  // public exportToExcel(grid: GridComponent): void {
  //   this.partsExort(grid);
  // }
  public seriesLabelsActualVsForecast: SeriesLabels = {
    visible: true,
    align: 'left',
    padding: -25,
    background: 'transparent',
    color: 'white',
    content: (e: any) => {
      let a = this.utils.formatLongNumberWithFloat(e);
      return `${a}`;
    },
    //visual: this.labelsVisual
  };
  public valueAxisLables: ValueAxisLabels = {
    visible: true, // Note that visible defaults to false
    background: 'transparent',
    content: (e: any) => {
      let aa = this.utils.formatLongNumber(e);
      return aa.toString();
    },
  };
  convertData(dataItem) {
    return this.utils.formatLongTotalWithFloat(dataItem);
  }

  private onError(error: any, customMessage?: string) {
    this.errorHandler.handleError(
      error,
      ModuleNames.vendor_activity,
      customMessage
    );
  }
}
