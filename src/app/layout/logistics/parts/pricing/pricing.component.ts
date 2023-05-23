import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DropdownService } from 'src/app/core/services/dropdown.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { PartsModel } from '../partlist/parts.model';
import { PartsService } from '../partlist/parts.service';
import { ModuleNames, ErrorMessages } from 'src/app/core/constant';
import { ErrorHandlerService } from 'src/app/core/services';
import {
  orderBy,
  process,
  SortDescriptor,
  State,
} from '@progress/kendo-data-query';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss'],
})
export class PricingComponent implements OnInit {
  form: FormGroup;
  id: number = 0;
  data: any;
  isDisabled: boolean = true;
  VendorType = ['A', 'B', 'C'];
  filterStatus: any = [];
  public pageSize = 5;
  public skip = 0;
  loader: any;
  isRentalFleet: boolean = false;
  isServiceParts: boolean = false;
  isGpcParts: boolean = false;
  partType: string;
  inventoryType: string;
  branchIds: any = [];
  branchCode: any = [];
  branch: any[] = [];
  expandedPricing = [
    {
      averagePORPrice: 0,
      lowestPORNumber: '',
      lowestPORPrice: 0,
      onHandPrice: 0,
    },
  ];
  public sort: SortDescriptor[] = [
    {
      field: 'branch',
      dir: 'asc',
    },
  ];
  branchAll = [
    {
      id: 0,
      value: 'All',
      code: null,
    },
  ];
  public priceData: any[] = [];
  branchData: any;
  AveragePORPrice: any;
  LowestPORNumber: any;
  LowestPORPrice: any;
  onHandPrice: any;
  pricingTab: boolean = false;
  expandedPricingTab: boolean = false;
  expandedPrice: any[] = [];
  clickEventsubscription: Subscription;
  message: any;
  public pricinghistory: any[] = [];
  public tempPricinghistory: any[] = [];
  partPricing: any[] = [];
  tempPartPricing: any[] = [];
  public mySelection: number[] = [0];
  constructor(
    private formBuilder: FormBuilder,
    public service: PartsService,
    private utils: UtilityService,
    public dropdownservice: DropdownService,
    public errorHandler: ErrorHandlerService
  ) {
    if (localStorage.getItem('isAdmin') == 'true') {
      this.pricingTab = false;
      this.expandedPricingTab = false;
    } else {
      const rights = JSON.parse(localStorage.getItem('Rights'));
      if (rights) {
        this.pricingTab = !rights.some(
          (c) =>
            c.subModuleName == 'Pricing' &&
            c.moduleName == 'Parts' &&
            c.tabName == 'VIEW'
        );
        this.expandedPricingTab = !rights.some(
          (c) =>
            c.subModuleName == 'Expanded Pricing' &&
            c.moduleName == 'Parts' &&
            c.tabName == 'SSG'
        );
      }
    }
  }

  ngOnInit(): void {
    this.clickEventsubscription = this.utils.getClickEvent().subscribe((a) => {
      this.message = a;
      this.callBack(this.message);
    });
    this.initForm();
    this.GetBranch();
    this.branchIds = JSON.parse(this.utils.storage.getItem('selectedBranch'));

    // this.branchIds.forEach((element) => {
    //   var code = this.branch.find((i) => i.id == element);
    //   this.branchCode.push(code.code);
    // });
    if (this.branchIds.length > 0 && this.branchIds[0].id == 0) {
      this.branch.forEach((element) => {
        if (element.value != 'All' && element.value != '%') {
          this.branchCode.push(element.code);
        }
      });
    } else {
      this.branchIds.forEach((e) => {
        this.branchCode.push(this.branch.find((c) => c.id == e.id).code);
      });
    }
  }
  callBack(value) {
    var valueId = [];
    var valueId1 = [];
    value.forEach((element) => {
      valueId.push(element.code);
      valueId1.push(element.userId);
    });
    this.branchCode = valueId;
    // this.GetPricing(this.id, this.branchCode);
  }
  initForm(): void {
    this.form = this.formBuilder.group({
      vendorName: ['', Validators.required],
      vendorType: [''],
      qbNameMDI: [''],
      qbNameGPC: [''],
      address: [''],
      address2: [''],
      state: [''],
      zip: [''],
      city: [''],
      comments: [''],
      inactive: [false],
    });
  }
  editClick(data: any) {
    this.form.reset();
    this.form.disable();
    this.isDisabled = true;
    if (data) {
      this.id = data.id;
      this.isRentalFleet = data.rentalFleet;
      this.isGpcParts = data.gpcParts;
      this.isServiceParts = data.serviceParts;
      this.inventoryType = data?.inventoryType;
      this.GetPricing(this.id, this.branchCode, data?.inventoryType);
    } else {
      this.priceData = [];
      this.pricinghistory = [];
      this.tempPricinghistory = [];
      this.partPricing = [];
      this.tempPartPricing = [];
      this.partType = '';
      this.expandedPricing[0].averagePORPrice = 0;
      this.expandedPricing[0].lowestPORNumber = '';
      this.expandedPricing[0].lowestPORPrice = 0;
      this.expandedPricing[0].onHandPrice = 0;
    }

  }
  setValue(data: any) {
    this.partType = data.partType;
    this.form.setValue({
      inventoryType: data.inventoryType,
      purchaseDescription: data.purchaseDescription,
      salesDescription: data.salesDescription,
      keyword: data.keyword,
      rop: 0, //data.rop,
      roq: 0, // data.roq,
      gpcPartNumber: data.gpcPartNumber,
      status: '',
      uom: data.uom,
      maxQty: data.maxQty,
    });
  }
  GetPricing(value, branch, inventoryType) {
    this.service.GetPricingList(value, branch, inventoryType).subscribe(
      (res) => {
        if (res) {
          this.priceData = res;
          this.pricinghistory = res.pricingHistory;
          this.tempPricinghistory = res.pricingHistory;
          this.partPricing = res.partPrices;
          this.tempPartPricing = res.partPrices;
          this.partType = res.partType;
          this.expandedPricing[0].averagePORPrice = res.averagePORPrice;
          this.expandedPricing[0].lowestPORNumber = res.lowestPORNumber;
          this.expandedPricing[0].lowestPORPrice = res.lowestPORPrice;
          this.expandedPricing[0].onHandPrice = res.onHandPrice;
        }
      },
      (error) => {
        this.errorHandler.handleError(
          error,
          ModuleNames.parts_pricing,
          ErrorMessages.parts.get_pricing_list
        );
      }
    );
  }
  GetBranch() {
    this.branch = this.branchAll.concat(
      this.utils.storage.CurrentUser.userBranch
    );
    this.branchData = this.branch;
  }
  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;

    this.data = {
      data: orderBy(this.tempPartPricing, this.sort),
      total: this.tempPartPricing.length,
    };
    this.partPricing = this.data;
  }
  public sortChangeHistory(sort: SortDescriptor[]): void {
    this.sort = sort;

    this.data = {
      data: orderBy(this.tempPricinghistory, this.sort),
      total: this.tempPricinghistory.length,
    };
    this.pricinghistory = this.data;
  }

  public cellClickHandler({
    sender,
    rowIndex,
    columnIndex,
    dataItem,
    isEdited,
  }) {
    if (!isEdited) {
      sender.editCell(rowIndex, columnIndex, this.createFormGroup(dataItem));
    } else {
      // dataItem.loadQty = 1;
    }
  }
  public cellCloseHandler(args: any) {
    const { formGroup, dataItem } = args;
    if (formGroup.dirty) {
      if (!formGroup.valid) {
        this.utils.toast.error(
          'Value not accepted. Please use a positive whole number.'
        );
        // prevent closing the edited cell if there are invalid values.
        formGroup.value.listPrice.setValue(0);
        args.preventDefault();
      } else {

        dataItem.listPrice = formGroup.value.listPrice;
        var obj = {
          "partId": this.id,
          "branch": dataItem.branch,
          "listPrice": dataItem.listPrice,
          "userName": JSON.parse(localStorage.getItem('currentUser')).userName
        }
        this.service.UpdatePricing(obj).subscribe(
          (res) => {
            this.utils.toast.success(res.message); this.GetPricing(this.id, this.branchCode, this.inventoryType);
          });
      }
    }
  }
  public createFormGroup(dataItem: any): FormGroup {

    return this.formBuilder.group({
      listPrice: [
        dataItem.listPrice,
        Validators.compose([Validators.pattern('^[0-9]{1,7}')]),
      ],
    });

  }
}
