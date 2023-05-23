import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { orderBy, process, SortDescriptor } from '@progress/kendo-data-query';
import { PurchasingService } from '../purchasing.service';
import { PartsService } from '../../parts/partlist/parts.service';
import { DropdownService } from 'src/app/core/services/dropdown.service';
import { PagerService } from 'src/app/core/services/pager.service';
import { PageChangeEvent } from '@progress/kendo-angular-grid';
import {
  PurchaseOrderFleetFilterModel,
  PurchaseOrderJOBFilterModel,
  RemoveLineItemsRequestModel,
} from './lineitems.model';
import { Subscription } from 'rxjs';
import { UtilityService } from 'src/app/core/services/utility.service';
import { PaginationRequest } from 'src/app/core/models/pagination.model';
import { ErrorHandlerService } from 'src/app/core/services';
import { ModuleNames, ErrorMessages } from 'src/app/core/constant';
@Component({
  selector: 'app-lineitems',
  templateUrl: './lineitems.component.html',
  styleUrls: ['./lineitems.component.scss'],
})
export class LineItemsComponent implements OnInit {
  form: FormGroup;
  displayError: boolean = false;
  statusStock: boolean = false;
  viewData: any = [];
  PricePerTotal: any;
  SalesRentalTotal: any;
  displayPartDialog: boolean;
  displayFleetDialog: boolean;
  displayJobSoDialog: boolean;
  total: number;
  salesRentalTotal: number;
  partData: any = [];
  allPartData = [];
  fleetData: any = [];
  purchaseHistoryData: any = [];
  displayItemsForSalesRental: boolean;
  purchasingFleetModel: PurchaseOrderFleetFilterModel;
  purchashingJObModel: PurchaseOrderJOBFilterModel;
  removeLineItemsModel: RemoveLineItemsRequestModel;
  message: any;
  branchCode: any = [];
  puchaseUOMData: any = [];
  UOMData: any = [];
  listSalesRental: any = [
    { id: '0', value: 'S' },
    { id: '1', value: 'R' },
  ];
  listRentalPeriod: any = [
    { id: '0', value: 'Days' },
    { id: '1', value: 'Weeks' },
    { id: '2', value: 'Months' },
  ];
  data: any;
  PONumber: string;
  vendorNumer: Number;
  public totalData = 0;
  public pageSize = 100;
  public skip = 0;
  public fleetSkip = 0;
  tempPageNo: number;
  public pageNumber = 1;
  public currentPage = 1;
  public FleetPageNumber = 1;
  public jobPageNumber = 1;
  hasValue: boolean;
  hasFleetValue: boolean;
  hasJobValue: boolean;
  isDisabled: boolean;
  Search: string;
  searchFleet: string;
  searchJob: string = '';
  isScanMultiple: boolean = false;
  public totalFleetData = 0;
  public sort: SortDescriptor[] = [
    {
      field: 'ItemCode',
      dir: 'asc',
    },
    {
      field: 'Description',
      dir: 'asc',
    },
    {
      field: 'Qty',
      dir: 'asc',
    },
    {
      field: 'PurchaseCost',
      dir: 'asc',
    },
    {
      field: 'PurchaseTotal',
      dir: 'asc',
    },
    {
      field: 'Stock',
      dir: 'asc',
    },
    {
      field: 'SR',
      dir: 'asc',
    },
    {
      field: 'SRPrice',
      dir: 'asc',
    },
    {
      field: 'number',
      dir: 'asc',
    },
    {
      field: 'Re-RentalPeriod',
      dir: 'asc',
    },
    {
      field: 'Re-RentalUOM',
      dir: 'asc',
    },
    {
      field: 'FleetInv',
      dir: 'asc',
    },
    {
      field: 'JobSO',
      dir: 'asc',
    },
  ];
  filterCollection: any = {
    searchText: '',
  };

  pageSizeList: any = [
    { id: 0, value: 100 },
    { id: 0, value: 300 },
    { id: 0, value: 500 },
  ];
  public mySelection: number[] = [];
  public fleetSelection: number[] = [];
  public jobSelection: number[] = [];
  lineItemsViewData: any = [];
  lineItemsNewAddedData: any = [];
  selectPartNumber: string;
  selectPartId: string;
  selectInvType: string;
  selectFleetNumber: string;
  selectJob: string;
  scanMultipleText: string;
  PartNumber: string;
  jobData: any = [];
  Requestor: any = [];
  stockValue: string;
  SalesRentalValue: string;
  RentalPeriodValue: string;
  clickEventsubscription: Subscription;
  isPurchaseHistoryDialogVisible: boolean = false;
  isLineItemRentalDialogVisible: boolean = false;
  multiple: boolean = false;
  selections: number[] = [];
  rentalLineItemColumns: any = [
    {
      Name: 'sr',
      isCheck: true,
      Text: 'SR',
      isDisable: false,
      index: 2,
      width: 100,
    },

    {
      Name: 'srPrice',
      isCheck: true,
      Text: 'S/R Price',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'number',
      isCheck: true,
      Text: 'Quantity',
      isDisable: true,
      index: 1,
      width: 100,
    },
    {
      Name: 'rPeriod',
      isCheck: true,
      Text: 'Re-Rental Period',
      isDisable: false,
      index: 2,
      width: 100,
    },
    {
      Name: 'ruom',
      isCheck: true,
      Text: 'Re-Rental UOM',
      isDisable: false,
      index: 2,
      width: 100,
    },
  ];
  rentalLineItems: any = [];

  purchaseHistoryColumns = [
    {
      Name: 'vendorName',
      isCheck: true,
      Text: 'Vendor Name',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'pricePer',
      isCheck: true,
      Text: 'Price Per',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'quantity',
      isCheck: true,
      Text: 'Quantity',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'recdQty',
      isCheck: true,
      Text: 'Recd Qty',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'lastOrderDate',
      isCheck: true,
      Text: 'Last Order Date',
      isDisable: false,
      index: 0,
      width: 100,
    },
  ];
  public min = 1;
  public max = 1000000000;
  public autoCorrect = true;
  isViewHistory: boolean = false;
  isVendorGlobal: boolean;
  isShowCost: boolean = false;

  constructor(
    public formBuilder: FormBuilder,
    public purchasingService: PurchasingService,
    public dropDownService: DropdownService,
    public pagerService: PagerService,
    private utility: UtilityService,
    public errorHandler: ErrorHandlerService
  ) {
    if (localStorage.getItem('isAdmin') == 'true') {
    } else {
      const rights = JSON.parse(localStorage.getItem('Rights'));
      this.isViewHistory = rights.some(
        (c) =>
          c.subModuleName == 'Line Items' &&
          c.moduleName == 'Maintain POR' &&
          c.tabName == 'View Purchase History'
      );
      this.isShowCost = rights.some(
        (c) =>
          c.subModuleName == 'Line Items' &&
          c.moduleName == 'Maintain POR' &&
          c.tabName == 'Show Cost'
      );
    }
  }
  ngOnInit(): void {
    this.initForm();
    this.purchasingFleetModel = new PurchaseOrderFleetFilterModel();
    this.purchashingJObModel = new PurchaseOrderJOBFilterModel();
    this.hasValue = false;
    this.hasFleetValue = false;
    this.hasJobValue = false;
    this.displayItemsForSalesRental = true;
    this.scanMultipleText = 'Scan Multiple No';
    this.clickEventsubscription = this.utility
      .getClickEvent()
      .subscribe((a) => {
        this.message = a;
        this.callBack(this.message);
      });

    var request = new PaginationRequest<any>();
    request.pageNumber = 1;
    request.pageSize = 100;
    request.request = this.filterCollection;
  }

  initForm(): void {
    this.form = this.formBuilder.group({
      partId: [''],
      fleet: [''],
      job: [''],
      purchaseQty: [''],
      purchaseCost: [''],
      purchaseUOM: [''],
      pricePerUnit: [''],
      sales: [''],
      rentalPeriod: [''],
      rental: [''],
      UOM: [''],
      rentalStartDate: [''],
      stock: [false],
      copyPORText: [],
      description: [],
      invNumber: [],
      jobNumber: [],
    });
  }

  public viewColumns = [
    {
      Name: 'newItemCode',
      isCheck: true,
      Text: 'Item Code',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'description',
      isCheck: true,
      Text: 'Description',
      isDisable: true,
      index: 1,
      width: 100,
    },
    {
      Name: 'quantity',
      isCheck: true,
      Text: 'Qty',
      isDisable: false,
      index: 2,
      width: 100,
    },
    {
      Name: 'uom',
      isCheck: true,
      Text: 'UOM',
      isDisable: false,
      index: 2,
      width: 100,
    },

    {
      Name: 'pricePer',
      isCheck: true,
      Text: 'Purchase Cost',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'total',
      isCheck: true,
      Text: 'Purchase Total',
      isDisable: true,
      index: 1,
      width: 100,
    },
    {
      Name: 'stock',
      isCheck: true,
      Text: 'Stock',
      isDisable: false,
      index: 2,
      width: 100,
    },
    {
      Name: 'SR',
      isCheck: true,
      Text: 'SR',
      isDisable: false,
      index: 2,
      width: 100,
    },

    {
      Name: 'srPrice',
      isCheck: true,
      Text: 'S/R Price',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'number',
      isCheck: true,
      Text: '#',
      isDisable: true,
      index: 1,
      width: 100,
    },
    {
      Name: 'rPeriod',
      isCheck: true,
      Text: 'Re-Rental Period',
      isDisable: false,
      index: 2,
      width: 100,
    },
    {
      Name: 'ruom',
      isCheck: true,
      Text: 'Re-Rental UOM',
      isDisable: false,
      index: 2,
      width: 100,
    },
    {
      Name: 'fleetInv',
      isCheck: true,
      Text: 'Fleet/Inv',
      isDisable: false,
      index: 2,
      width: 100,
    },
    {
      Name: 'jobSO',
      isCheck: true,
      Text: 'Job/SO',
      isDisable: false,
      index: 2,
      width: 100,
    },
  ];
  public viewEmpColumn = [
    {
      Name: 'value',
      isCheck: true,
      Text: 'Part',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'description',
      isCheck: true,
      Text: 'Description',
      isDisable: true,
      index: 1,
      width: 100,
    },
  ];
  public viewFleetColumn = [
    {
      Name: 'invNumber',
      isCheck: true,
      Text: 'Inventory Number',
      isDisable: false,
      index: 0,
      width: 100,
    },
  ];
  public viewJobColumn = [
    {
      Name: 'jobNumber',
      isCheck: true,
      Text: 'Job Number',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'jobName',
      isCheck: true,
      Text: 'Job Name',
      isDisable: false,
      index: 0,
      width: 100,
    },
  ];
  public viewPurchaseUOMColumn = [
    {
      Name: 'uom',
      isCheck: true,
      isDisable: false,
      index: 0,
      width: 100,
    },
  ];
  private onError(error: any, customMessage?: string) {
    this.errorHandler.handleError(
      error,
      ModuleNames.purchase_order,
      customMessage
    );
  }
  onPurchaseHistory() {
    if (this.selectPartId === undefined) {
      this.displayError = !this.displayError;
    } else {
      this.isPurchaseHistoryDialogVisible =
        !this.isPurchaseHistoryDialogVisible;
      this.GetPurchaseHistory();
    }
  }
  onClosePOR() {
    this.displayError = !this.displayError;
  }

  onStockChanges(event: any) {
    this.statusStock = event;
  }
  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.data = {
      data: orderBy(this.viewData, this.sort),
      total: this.viewData.length,
    };
    this.viewData = this.data.data;
  }
  GetLineItemsView(PONumber) {
    this.purchasingService.GetPurchaseOrderLineItems(PONumber).subscribe(
      (res) => {
        this.lineItemsViewData = [];
        if (res.length > 0) {
          this.lineItemsViewData = res;
          this.PricePerTotal = this.lineItemsViewData.map((item) => item.total);
          this.SalesRentalTotal = this.lineItemsViewData.map(
            (item) => item.srPrice
          );
          this.GetTotal();
          this.GetSRTotal();
        } else {
          this.total = 0;
          this.SalesRentalTotal = 0;
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.Purchase_Order.save_LineItems_Data);
      }
    );
  }
  editclick(data: any, poData: any) {
    this.isDisabled = true;
    this.PONumber = data;
    this.isVendorGlobal = poData.vendor == 'Global Pump Company' ? true : false;
    if (data != null) {
      this.GetLineItemsView(this.PONumber);
    }
    this.GetPart(this.filterCollection);
    this.GetFleet(this.FleetPageNumber, this.pageSize);
    this.GetPurchaseOrderJob(this.purchashingJObModel);
    this.GetEmployeeRequestor();
  }
  GetTotal() {
    let totalVal = 0;
    for (let i = 0; i < this.PricePerTotal.length; i++) {
      totalVal = totalVal + parseFloat(this.PricePerTotal[i]);
    }
    this.total = totalVal;
  }
  GetSRTotal() {
    let SRTotalValue = 0;

    for (let i = 0; i < this.SalesRentalTotal.length; i++) {
      SRTotalValue = SRTotalValue + parseFloat(this.SalesRentalTotal[i]);
    }
    this.salesRentalTotal = SRTotalValue;
  }
  onPartDialog() {
    this.displayPartDialog = !this.displayPartDialog;
  }
  onFleetDialog() {
    this.displayFleetDialog = !this.displayFleetDialog;
  }
  onJobSODialog() {
    this.displayJobSoDialog = !this.displayJobSoDialog;
  }
  public close(status) {
    this.hasValue = false;

    if (status == 'cancel') {
      this.displayPartDialog = !this.displayPartDialog;
    } else {
      this.displayPartDialog = !this.displayPartDialog;
    }
    this.mySelection = [];
  }
  public onFleetClose(status) {
    this.hasFleetValue = false;
    if (status == 'cancel') {
      this.displayFleetDialog = !this.displayFleetDialog;
    } else {
      this.displayFleetDialog = !this.displayFleetDialog;
    }
    this.fleetSelection = [];
  }
  public onJobClose(status) {
    this.hasJobValue = false;
    if (status == 'cancel') {
      this.displayJobSoDialog = !this.displayJobSoDialog;
    } else {
      this.displayJobSoDialog = !this.displayJobSoDialog;
    }
    this.jobSelection = [];
  }
  GetPart(data) {
    var request = new PaginationRequest<any>();
    request.pageNumber = this.pageNumber;
    request.pageSize = this.pageSize;
    request.request = this.filterCollection;
    this.dropDownService.GetPart(request).subscribe(
      (res) => {
        this.partData = [];
        if (res != null) {
          this.partData = this.allPartData = res.data;
          this.totalData = res.totalRecords;
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.Purchase_Order.part_Data);
      }
    );
  }
  public onPageChange(e: PageChangeEvent): void {
    this.skip = e.skip;
    this.pageSize = e.take;
    this.partData.pageNumber = this.skip == 0 ? 0 : this.skip / this.pageSize;
    if (this.partData.pageNumber == 0) {
      this.partData.pageNumber = 1;
    }
    this.filterCollection.pageSize = this.pageSize;
    this.tempPageNo = this.pagerService.start;
    this.pageNumber = this.partData.pageNumber;
    this.filterCollection.PageNumber = this.pageNumber;
    this.filterCollection.PageSize = this.pageSize;
    this.GetPart(this.filterCollection);
    // this.currentPage = this.pageNumber;
    //this.skip = event.skip;
    // this.GetPurchaseOrderView(this.purchasingFilterModel);
  }
  onPageSizechange(pagesize) {
    this.pageSize = pagesize;
    this.filterCollection.PageNumber = this.pageNumber;
    this.filterCollection.PageSize = this.pageSize;
    this.GetPart(this.filterCollection);
    // this.GetPurchaseOrderView(this.purchasingFilterModel);
  }
  partClick(data) {
    this.mySelection = [];
    this.selectPartNumber = data.description;
    let partNumber = data.id;
    this.selectPartId = partNumber;
    this.selectInvType = data.value;
    this.hasValue = true;
    this.displayPartDialog = !this.displayPartDialog;

    let branch;
    if (this.branchCode == 'All' || this.branchCode.length == 0) {
      this.branchCode = 'MI';
    }

    this.GetPartUOMDetailsByPartNumber(partNumber, this.branchCode);
  }
  callBack(value) {
    var valueId = [];
    var valueId1 = [];
    value.forEach((element) => {
      valueId.push(element.code);
      valueId1.push(element.userId);
    });
    this.branchCode = valueId;
  }
  fleetClick(data: string) {
    this.selectFleetNumber = data;
    this.hasFleetValue = true;
    this.displayFleetDialog = !this.displayFleetDialog;
    this.fleetSelection = [];
  }
  jobClick(data: string) {
    this.selectJob = data;
    this.hasJobValue = true;
    this.displayJobSoDialog = !this.displayJobSoDialog;
    this.jobSelection = [];
  }
  GetFleet(FleetPageNumber, pagesize) {
    this.purchasingFleetModel.pageNumber = this.FleetPageNumber;
    this.purchasingFleetModel.pageSize = this.pageSize;
    this.purchasingService
      .GetLineItemsFleet(this.purchasingFleetModel)
      .subscribe(
        (res) => {
          this.fleetData = [];
          if (res != null) {
            this.fleetData = res;
            this.totalFleetData = res[0].totalRecords;
          }
        },
        (error) => {
          this.onError(error, ErrorMessages.Purchase_Order.inventory_Data);
        }
      );
  }
  OnChaneSalesRental(value) {
    console.log(value);
    if (value == 1 || value === undefined) {
      this.displayItemsForSalesRental = true;
    } else {
      this.displayItemsForSalesRental = false;
    }
  }
  btnEdit() {
    this.isDisabled = false;
  }
  btnCancel() {
    this.isDisabled = true;
    this.hasValue = false;
    this.hasFleetValue = false;
    this.hasJobValue = false;
    this.selectPartNumber = undefined;
    this.selectPartId = undefined;
    this.selectFleetNumber = undefined;
    this.selectJob = undefined;
    this.displayItemsForSalesRental = true;
    this.isScanMultiple = false;
    this.scanMultipleText = 'Scan Multiple No';
    //this.autoCorrect = true;
  }
  OnSave() {
    console.log(this.lineItemsNewAddedData);
    if (this.lineItemsNewAddedData.length > 0) {
      this.purchasingService.AddlineItems(this.lineItemsNewAddedData).subscribe(
        (res) => {
          // console.log(res);
          if (res) {
            if (res['status'] == 200) {
              this.utility.toast.success(res['message']);
            } else {
              this.utility.toast.error(res['message']);
            }
            this.lineItemsNewAddedData = [];
            //this.autoCorrect = true;
            this.form.reset();
          }
        },
        (error) => {
          this.onError(error, ErrorMessages.Purchase_Order.save_LineItems_Data);
        }
      );
    }
    this.isScanMultiple = false;
    this.scanMultipleText = 'Scan Multiple No';
  }
  GetPartUOMDetailsByPartNumber(partNumber, branch) {
    this.purchasingService
      .GetPartUOMDetailsByPartNumber(partNumber, branch)
      .subscribe(
        (res) => {
          this.puchaseUOMData = res;
        },
        (error) => {
          this.onError(error, ErrorMessages.Purchase_Order.uom_Data);
        }
      );
  }

  onFleetPageSizechange(FleetpageSize) {
    this.pageSize = FleetpageSize;
    this.fleetSkip = 0;
    this.GetFleet(this.FleetPageNumber, this.pageSize);
  }
  public onFleetPageChange(e: PageChangeEvent): void {
    this.fleetSkip = e.skip;
    this.pageSize = e.take;
    this.fleetData.pageNumber =
      this.fleetSkip == 0 ? 0 : this.fleetSkip / this.pageSize;
    if (this.fleetData.pageNumber == 0) {
      this.fleetData.pageNumber = 1;
    }
    this.filterCollection.pageSize = this.pageSize;
    this.tempPageNo = this.pagerService.start;
    this.FleetPageNumber = this.fleetData.pageNumber;
    this.GetFleet(this.FleetPageNumber, this.pageSize);
    // this.currentPage = this.pageNumber;
    //this.skip = event.skip;
    // this.GetPurchaseOrderView(this.purchasingFilterModel);
  }
  GetPurchaseOrderJob(data) {
    this.purchasingService
      .GetPurchaseOrderJOB(this.purchashingJObModel)
      .subscribe(
        (res) => {
          this.jobData = [];
          if (res != null) {
            this.jobData = res;
          }
        },
        (error) => {
          this.onError(error, ErrorMessages.Purchase_Order.job_Data);
        }
      );
  }

  onAddline() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return false;
    }
    console.log('addline');
    this.rentalLineItems = [];
    if (this.selectPartId === undefined) {
      this.utility.toast.error('You must select a part number');
      return false;
    } else if (
      this.form.controls['purchaseQty'].value === undefined ||
      this.form.controls['purchaseQty'].value == '' ||
      this.form.controls['purchaseQty'].value == null
    ) {
      this.utility.toast.error('Quantity must be numeric');
      return false;
    } else if (
      this.form.controls['purchaseCost'].value === undefined ||
      this.form.controls['purchaseCost'].value == '' ||
      this.form.controls['purchaseCost'].value == null
    ) {
      this.utility.toast.error('Purchase cost must be numeric');
      return false;
    } else if (
      (this.form.controls['rentalPeriod'].value === undefined ||
        this.form.controls['rentalPeriod'].value == '' ||
        this.form.controls['rentalPeriod'].value == null) &&
      this.displayItemsForSalesRental &&
      !this.statusStock
    ) {
      this.utility.toast.error(
        'Must select days,weeks or months for Rental period'
      );
      return false;
    } else if (
      (this.form.controls['rental'].value === undefined ||
        this.form.controls['rental'].value == '' ||
        this.form.controls['rental'].value == null) &&
      this.displayItemsForSalesRental &&
      !this.statusStock
    ) {
      this.utility.toast.error('Rental Quantity must be numeric');
      return false;
    } else if (
      (this.form.controls['sales'].value === undefined ||
        this.form.controls['sales'].value == '' ||
        this.form.controls['sales'].value == null) &&
      !this.statusStock
    ) {
      this.utility.toast.error('Must select S for Sale or R for Rental');
      return false;
    } else if (
      (this.form.controls['pricePerUnit'].value === undefined ||
        this.form.controls['pricePerUnit'].value == '' ||
        this.form.controls['pricePerUnit'].value == null) &&
      this.displayItemsForSalesRental &&
      !this.statusStock
    ) {
      this.utility.toast.error('Price must be numeric');
      return false;
    } else if (
      (this.form.controls['rentalStartDate'].value === undefined ||
        this.form.controls['rentalStartDate'].value == '' ||
        this.form.controls['rentalStartDate'].value == null) &&
      this.displayItemsForSalesRental &&
      !this.statusStock
    ) {
      this.utility.toast.error('Must select Rental Start Date for this part');
      return false;
    } else {
      if (
        this.form.controls['stock'].value == false ||
        this.form.controls['stock'].value == null
      ) {
        this.stockValue = 'N';
        this.statusStock = false;
      } else if (this.form.controls['stock'].value == true) {
        this.stockValue = 'Y';
        this.statusStock = true;
      }
      if (
        this.form.controls['rentalPeriod'].value !== undefined &&
        this.displayItemsForSalesRental
      ) {
        if (this.form.controls['rentalPeriod'].value == 0) {
          this.RentalPeriodValue = 'Days';
        } else if (this.form.controls['rentalPeriod'].value == 1) {
          this.RentalPeriodValue = 'Weeks';
        } else if (this.form.controls['rentalPeriod'].value == 2) {
          this.RentalPeriodValue = 'Months';
        }
      }
      if (this.form.controls['sales'].value == 1) {
        this.SalesRentalValue = 'R';
      } else if (this.form.controls['sales'].value == 0) {
        this.SalesRentalValue = 'S';
      }
      
      var objData = {
        poNumber: this.PONumber,
        newItemCode: this.selectPartId,
        description: this.selectPartNumber,
        fleetInv: this.selectFleetNumber,
        jobSO: this.selectJob,
        quantity: this.form.controls['purchaseQty'].value,
        uom: 'EA',
        pricePer:
          this.isShowCost && this.isVendorGlobal
            ? 0.0
            : this.form.controls['purchaseCost'].value,
        rPeriod: this.RentalPeriodValue,
        number: this.form.controls['rental'].value,
        total:
          this.form.controls['purchaseQty'].value *
          this.form.controls['purchaseCost'].value,
        ruom: 'EA',
        stock: this.stockValue,
        sr: this.SalesRentalValue,
        srPrice: this.form.controls['pricePerUnit'].value,
        rentalstartdate: this.form.controls['rentalStartDate'].value,
        Requestor: this.Requestor,
        puom: 'EA',
      };
      var data = {
        rPeriod: this.RentalPeriodValue,
        number: this.form.controls['rental'].value,
        srPrice: this.form.controls['pricePerUnit'].value,
        ruom: 'EA',
        sr: this.SalesRentalValue,
      };
      this.lineItemsViewData.push(objData);
      this.lineItemsNewAddedData.push(objData);
      this.form.controls['purchaseQty'].setValue('');
      this.rentalLineItems.push(data);
      this.selectPartNumber = undefined;
      this.selectPartId = undefined;
      if (!this.isScanMultiple) {
        this.selectFleetNumber = undefined;
        this.selectJob = undefined;
        this.hasJobValue = false;
        this.hasFleetValue = false;
      }
      this.hasValue = false;
      this.form.controls['purchaseQty'].setValue('');
      this.form.controls['UOM'].setValue('');
      this.form.controls['purchaseCost'].setValue('');
      this.form.controls['rentalPeriod'].setValue('');
      this.form.controls['rental'].setValue('');
      // this.form.controls['stock'].setValue('');
      this.form.controls['sales'].setValue('');
      this.form.controls['pricePerUnit'].setValue('');
      //this.autoCorrect = true;
      console.log(this.form.controls);
    }
  }

  GetPurchaseHistory() {
    this.purchasingService
      .GetPurchaseHistory(this.selectPartId, false)
      .subscribe(
        (res) => {
          this.purchaseHistoryData = res;
        },
        (error) => {
          ErrorMessages.Purchase_Order.purchase_History_Data;
        }
      );
  }

  onSearchClick() {
    this.Search = this.form.get('description').value;
    //this.filterCollection.PageNumber = 1;
    this.pageNumber = this.filterCollection.PageNumber;
    this.skip = 0;
    this.filterCollection.searchText = this.Search;
    this.GetPart(this.filterCollection);
  }

  onFleetSearchClick() {
    this.searchFleet = this.form.get('invNumber').value;
    this.purchasingFleetModel.Search = this.searchFleet;
    this.GetFleet(this.FleetPageNumber, this.pageSize);
  }
  onJobSearchClick() {
    this.searchJob = this.form.get('jobNumber').value;
    this.purchashingJObModel.Search = this.searchJob;
    this.GetPurchaseOrderJob(this.purchashingJObModel);
  }
  onSelectPurchaseHistory(event) {}

  onHandleLineItemsRentalDialog(id) {
    this.isLineItemRentalDialogVisible = !this.isLineItemRentalDialogVisible;
    this.rentalLineItems = [];
    if (id != undefined) {
      if (id.pk == undefined) {
        var data = {
          rPeriod: id.rPeriod,
          number: id.number,
          srPrice: id.pricePer,
          ruom: id.uom,
          sr: id.sr,
        };
        this.rentalLineItems.push(data);
      } else {
        var data = {
          rPeriod: id.rPeriod,
          number: id.rQty,
          srPrice: id.pricePer,
          ruom: id.ruom,
          sr: id.saleRerental,
        };
        this.rentalLineItems.push(data);
      }
    }
  }

  onResizeColumn(event) {}

  onSelectionChange(event) {}

  onSortChange(event) {}

  onReOrderColumns(event) {}

  onDataStateChange(event) {}
  GetEmployeeRequestor() {
    this.purchasingService.EmployeeRequestor(this.PONumber).subscribe(
      (res) => {
        this.Requestor = res[0].requestor;
      },
      (error) => {
        this.onError(error, ErrorMessages.Purchase_Order.employee_requestor);
      }
    );
  }
  onResubmit() {}
  onQuantityValueChange(data, event) {
    console.log(data);
    console.log(event);
    let quantity = event;

    if (event != null) {
      data.quantity = quantity;

      console.log(data);
      this.purchasingService
        .updateQuantity(data.pk, this.PONumber, quantity)
        .subscribe(
          (res) => {
            if (res) {
              if (res['status'] == 200) {
                this.GetLineItemsView(this.PONumber);
              } else {
              }
            }
          },
          (error) => {
            ErrorMessages.Purchase_Order.updateQuantity_LineItems;
          }
        );
    }
  }
  onCostValueChange(data, event) {
    console.log(data);
    console.log(event);
    let cost = event;

    if (event != null) {
      data.pricePer = cost;

      console.log(data);
      this.purchasingService.updateCost(data.pk, this.PONumber, cost).subscribe(
        (res) => {
          if (res) {
            if (res['status'] == 200) {
              this.GetLineItemsView(this.PONumber);
            } else {
            }
          }
        },
        (error) => {
          ErrorMessages.Purchase_Order.updateCost_LineItems;
        }
      );
    }
  }
  scanMultipleClick() {
    if (this.scanMultipleText == 'Scan Multiple Yes') {
      this.scanMultipleText = 'Scan Multiple No';
      this.isScanMultiple = false;
      this.selectFleetNumber = undefined;
      this.selectJob = undefined;
      this.hasJobValue = false;
      this.hasFleetValue = false;
    } else if (this.scanMultipleText == 'Scan Multiple No') {
      this.scanMultipleText = 'Scan Multiple Yes';
      this.isScanMultiple = true;
    }
  }

  onDelete(dataItem) {
    if (dataItem != null) {
      if (dataItem.pk === undefined) {
        this.lineItemsViewData.pop(dataItem);
        this.lineItemsNewAddedData.pop(dataItem);
      } else {
        var event = dataItem.pk;
        this.removeLineItemsModel = new RemoveLineItemsRequestModel();
        this.removeLineItemsModel.Id = dataItem.pk;
        this.removeLineItemsModel.PONumber = dataItem.poNumber;
        this.purchasingService
          .RemovelineItems(this.removeLineItemsModel)
          .subscribe((res) => {
            if (res['status'] == 200) {
              this.utility.toast.success(res.message);
              this.GetLineItemsView(this.PONumber);
            } else {
              this.utility.toast.error(res.message);
            }
          });
      }
    }
  }

  onSearchPart(event) {
    this.partData = process(this.allPartData, {
      filter: {
        logic: 'or',
        filters: [
          {
            field: 'value',
            operator: 'contains',
            value: event,
          },
          {
            field: 'description',
            operator: 'contains',
            value: event,
          },
        ],
      },
    }).data;
    this.totalData = this.partData.length;
  }
}
