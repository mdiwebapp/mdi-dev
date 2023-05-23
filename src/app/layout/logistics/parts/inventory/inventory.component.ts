import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PageChangeEvent } from '@progress/kendo-angular-grid';
import { TabPosition } from '@progress/kendo-angular-layout';
import { orderBy, process, SortDescriptor } from '@progress/kendo-data-query';
import { MenuService } from 'src/app/core/helper/menu.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { PartsService } from '../partlist/parts.service';
import { ModuleNames, ErrorMessages } from 'src/app/core/constant';
import { ErrorHandlerService } from 'src/app/core/services';
import * as fileSaver from 'file-saver';
import { Subscription } from 'rxjs';
import { IntlService } from "@progress/kendo-angular-intl";
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss'],
})
export class InventoryComponent implements OnInit {
  form: FormGroup;
  public position: TabPosition = 'left';
  public pageSize = 5;
  public skip = 0;
  loader: any;
  public sort: SortDescriptor[] = [
    {
      field: 'description',
      dir: 'asc',
    },
  ];
  public mySelection: number[] = [0];
  showQues: boolean = false;
  showPrint: boolean = false;
  isSave: boolean = true;
  isCancel: boolean = true;
  isEdit: boolean = true;
  isAdd: boolean = false;
  isAddRight: boolean = false;
  isUpdateRight: boolean = false;
  data: any;
  lstTransactions: any = [];
  lstTempTransactions: any = [];
  isDisable: boolean = true;
  partType: string;
  filterText: string;
  filterStatus: any = [];
  filterData: any = [{ id: 0, value: "ALL" }, { id: 1, value: "Cycle Count" }, { id: 2, value: "Inter-Company Inventory Transfer" }, { id: 3, value: "Inventory" }, { id: 4, value: "Inventory Sold" }, { id: 5, value: "Part Used" }, { id: 6, value: "Physical Inventory" }, { id: 7, value: "Product Received" }];
  onHandQty: number = 0;
  availableQty: number = 0;
  requireQty: number = 0;
  onOrderQty: number = 0;
  allocatedQty: number = 0;
  backOrderQty: number = 0;
  transitQty: number = 0;
  onjobQty: number = 0;
  branchIds: any[] = [];
  branch: any[] = [];

  onHandQtyList: any[] = [];
  availableQtyList: any[] = [];
  requireQtyList: any[] = [];
  onOrderQtyList: any[] = [];
  allocatedQtyList: any[] = [];
  backOrderQtyList: any[] = [];
  transitQtyList: any[] = [];
  onjobQtyList: any[] = [];
  dateRange: any;

  branchData: any;
  selectedBranch: any;
  branchAll = [
    {
      id: 0,
      value: 'All',
      code: null,
      // userId: null,
      // branchId: 0,
      // branchName: 'All',
      // branchCode: null,
    },
  ];
  inventoryType: any;
  clickEventsubscription: Subscription;
  branchCode: string = 'All';

  message: any;
  partId: any;
  constructor(public service: PartsService, private formBuilder: FormBuilder,
    public menuService: MenuService,
    public utils: UtilityService,
    public router: Router, public datepipe: DatePipe,
    public errorHandler: ErrorHandlerService, public intl: IntlService
  ) { }

  ngOnInit(): void {
    this.clickEventsubscription = this.utils.getClickEvent().subscribe((a) => {
      this.message = a;
      this.callBack(this.message);
    });
    this.initForm();
    this.selectedBranch = [];
    //debugger
    this.branch = JSON.parse(this.utils.storage.getItem("selectedBranch"));
    this.branch.forEach((element) => {
      this.selectedBranch.push(element.code);
    });
    // this.branchIds = JSON.parse(this.utils.storage.getItem('partBranch'));
    //JSON.parse(localStorage.getItem('partBranch'));
  }
  callBack(value) {
    var valueId = [];
    var valueId1 = [];
    value.forEach((element) => {

      valueId.push(element.code);
      valueId1.push(element.userId);
    });
    this.selectedBranch = valueId;
    // this.branch = value;
    // if (value.length > 0) { this.branchCode = value[value.length - 1].code; }
    this.getQuanititesByType();
    this.GetTransactions(this.partId);
  }
  initForm(): void {
    this.form = this.formBuilder.group({
      from: [null, Validators.required],
      to: [null, Validators.required],
      branches: [''],
      filter: ['', Validators.required],
      ascendingSort: [true],
      //dateRange: [''],
    });
  }
  onEdit(res) {
    if (res) {
      this.partType = res.partType;
      this.inventoryType = res.inventoryType;
      this.partId = res.id;
      this.GetTransactions(res.id);
      this.getQuanititesByType();
    }
    else {
      this.lstTransactions = [];
      this.lstTempTransactions = [];
      this.onHandQty = 0;
        this.availableQty = 0;
        this.requireQty = 0;
        this.onOrderQty = 0;
        this.allocatedQty = 0;
        this.backOrderQty = 0;
        this.transitQty = 0;
        this.onjobQty = 0;
        this.onHandQtyList = [];
        this.availableQtyList = [];
        this.requireQtyList = [];
        this.onOrderQtyList = [];
        this.allocatedQtyList = [];
        this.backOrderQtyList = [];
        this.transitQtyList = [];
        this.onjobQtyList = [];
    }
  }
  GetTransactions(id) {

    this.service.GetInventoryTransactions(id, this.selectedBranch).subscribe((res) => {
      if (res) {
        this.lstTransactions = res;
        this.lstTempTransactions = res;
      }
    });
  }
  GetBranch() {
    this.branch = this.branchAll.concat(
      this.utils.storage.CurrentUser.userBranch
    );
    this.branchData = this.branch;
  }
  branchChange(data) {

    var data1: any[] = [];
    if (data.length > 1) {
      if (data[0] === 0) {
        data.forEach((element) => {
          if (element != 0) {
            data1.push(element);
          }
        });
      } else if (data[0] !== 0) {
        data.forEach((element) => {
          if (element !== 0) {
            data1.push(element);
          } else if (data.includes(0)) {
            data1 = [];
            data1.push(0);
          }
        });
      }
    }
    if (data.length === 0) {
      data1 = [];
      data1.push(0);
    }
    this.branchIds = data1;
    //localStorage.removeItem('partBranch');
    this.utils.storage.setItem('partBranch', JSON.stringify(this.branchIds));
  }
  branchFilter(value) {
    this.branch = this.branchData.filter(
      (s) => s.value.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }
  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.loadItems();
  }
  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.data = {
      data: orderBy(this.lstTempTransactions, this.sort),
      total: this.lstTempTransactions.length,
    };
    this.lstTransactions = this.data.data;
  }
  private loadItems(): void {
    this.loader = true;
  }

  public onFilter(inputValue: string): void {
    this.filterText = inputValue;
    this.mySelection = [];
    this.lstTransactions = process(this.lstTempTransactions, {
      filter: {
        logic: 'or',
        filters: [
          {
            field: 'description',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'createdBy',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'location',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'tranDate',
            operator: 'contains',
            value: inputValue,
          },
        ],
      },
    }).data;
    this.mySelection = [0];
  }
  filterInventoryData() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return false;
    }
    this.form.controls["branches"].setValue(this.selectedBranch.toString());
    this.form.controls["ascendingSort"].setValue(true);
    this.form.controls["from"].setValue(
      new Date(this.datepipe.transform(this.form.value.from, 'yyyy-MM-dd')));
    this.form.controls["to"].setValue(
      new Date(this.datepipe.transform(this.form.value.to, 'yyyy-MM-dd')));
    this.service.ExportData(this.form.value).subscribe(
      (res) => {
        //this.form.reset();
        this.form.controls["ascendingSort"].setValue(true);
        let data = new Blob([res], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;',
        });
        fileSaver.saveAs(data, 'Inventory_Transactions.xlsx');
      },
      (error) => {
        this.errorHandler.handleError(
          error,
          ModuleNames.parts_inventory,
          ErrorMessages.parts.export_data
        );
      }
    );
  }
  changeDateRange(range) {

    let date: Date = new Date();
    let toDate: Date = new Date();
    if (range == '30') {
      this.form.controls['to'].setValue(date);
      toDate.setDate(date.getDate() - 30);
      this.form.controls['from'].setValue(toDate);

    } else if (range == '60') {
      this.form.controls['to'].setValue(date);
      toDate.setDate(date.getDate() - 60);
      this.form.controls['from'].setValue(toDate);
    }
    else if (range == '90') {
      this.form.controls['to'].setValue(date);
      toDate.setDate(date.getDate() - 90);
      this.form.controls['from'].setValue(toDate);
    } else if (range == 'YTD') {
      this.form.controls['to'].setValue(date);
      toDate = new Date(date.getFullYear(), date.getMonth() - date.getMonth(), 1);
      //toDate.setDate(toDate);
      this.form.controls['from'].setValue(toDate);
    } else if (range == 'Custom') {
      this.form.controls['to'].setValue(null);
      this.form.controls['from'].setValue(null);
    }
  }

  getQuanititesByType() {
    var obj = {
      "inventoryType": this.inventoryType,
      "branches": this.selectedBranch
    }
    this.service.GetInventoryQuantities(obj).subscribe((res) => {
      if (res) {
        this.onHandQty = 0;
        this.availableQty = 0;
        this.requireQty = 0;
        this.onOrderQty = 0;
        this.allocatedQty = 0;
        this.backOrderQty = 0;
        this.transitQty = 0;
        this.onjobQty = 0;
        this.onHandQtyList = [];
        this.availableQtyList = [];
        this.requireQtyList = [];
        this.onOrderQtyList = [];
        this.allocatedQtyList = [];
        this.backOrderQtyList = [];
        this.transitQtyList = [];
        this.onjobQtyList = [];
        this.data = res;
        this.data.forEach(c => {
          if (c.qtyStatus == 'OnHand') {
            this.onHandQty = this.onHandQty + c.quantity;
            this.onHandQtyList.push(c);
          }

          else if (c.qtyStatus == 'Available') {
            this.availableQty = this.availableQty + c.quantity;
            this.availableQtyList.push(c);
          }
          else if (c.qtyStatus == 'Required') {
            this.requireQty = this.requireQty + c.quantity;
            this.requireQtyList.push(c);
          }
          else if (c.qtyStatus == 'OnOrder') {
            this.onOrderQty = this.onOrderQty + c.quantity;
            this.onOrderQtyList.push(c);
          }
          else if (c.qtyStatus == 'Allocated' || c.qtyStatus == 'Transit') {
            this.allocatedQty = this.allocatedQty + c.quantity;
            this.allocatedQtyList.push(c);
          }
          else if (c.qtyStatus == 'BackOrder') {
            this.backOrderQty = this.backOrderQty + c.quantity;
            this.backOrderQtyList.push(c);
          }
          else if (c.qtyStatus == 'Transit') {
            this.transitQty = this.transitQty + c.quantity;
            this.transitQtyList.push(c);
          } else if (c.qtyStatus == 'OnJobs') {
            this.onjobQty = this.onjobQty + c.quantity;
            this.onjobQtyList.push(c);
          }
        });
        // this.onHandQty = this.data.filter(c => c.qtyStatus == 'OnHand').length;
        // this.availableQty = this.data.filter(c => c.qtyStatus == 'Available').length;
        // this.requireQty = this.data.filter(c => c.qtyStatus == 'Required').length;
        // this.onOrderQty = this.data.filter(c => c.qtyStatus == 'OnOrder').length;
        // this.allocatedQty = this.data.filter(c => c.qtyStatus == 'Allocated').length;
        // this.backOrderQty = this.data.filter(c => c.qtyStatus == 'BackOrder').length;
        // this.transitQty = this.data.filter(c => c.qtyStatus == 'Transit').length;
        // this.onjobQty = this.data.filter(c => c.qtyStatus == 'OnJobs').length;


      }
    });
  }
  resetForm() {
    this.dateRange = null;
    this.form.reset();
  }
  viewPrint() {
    this.showPrint = true;
    this.form.controls["filter"].setValue('ALL');
  }
}
