import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  ViewColumns,
  ServiceEstimateData,
} from '../../../../../data/service-estimate-data';
import {
  orderBy,
  process,
  SortDescriptor,
  State,
} from '@progress/kendo-data-query';
import { ServiceOrderService } from '../service-order/service-order.service';
import { ErrorMessages, ModuleNames } from 'src/app/core/constant';
import { ErrorHandlerService, PagerService } from 'src/app/core/services';
import { UtilityService } from 'src/app/core/services/utility.service';
import { ServiceEstimateModel } from './serviceEstimate.model'
import { DropdownService } from 'src/app/core/services/dropdown.service';
import { PageChangeEvent } from '@progress/kendo-angular-grid';
@Component({
  selector: 'app-service-estimate',
  templateUrl: './service-estimate.component.html',
  styleUrls: ['./service-estimate.component.scss'],
})
export class ServiceEstimateComponent implements OnInit {
  form: FormGroup;
  displayItemDrp: boolean = false;
  displayItemDialog: boolean = false;
  isDisabled: boolean = true;
  public viewColumns: any;
  serviceEstimateData: any;
  stateList: any = [];
  displayState: boolean = false;
  displayStatusDrp: boolean = false;
  viewData: any;
  data: any;
  tempData: any;
  gridView: any;
  tempgridView: any;
  serviceNumber: string;
  sumItemTotal: number = 0;
  salesTax: number = 0;
  total: number = 0;
  totalLabour: number = 0;
  isShowPrice:boolean=false;
  public partPageSize = 100;
  public partSkip = 0;
  partTotal: number = 0;
  partSearch: string;

  public sort: SortDescriptor[] = [
    // {
    //   field: 'invType',
    //   dir: 'asc',
    // },
    // {
    //   field: 'description',
    //   dir: 'asc',
    // },
  ];
  public mySelection: number[] = [0];
  public mySelection1: number[] = [0];
  customerName: any;
  visible: boolean=false;
  constructor(private formBuilder: FormBuilder, public service: ServiceOrderService,
    private utils: UtilityService, public errorHandler: ErrorHandlerService, public pagerService: PagerService,
    public dropdownservice: DropdownService) { }

  ngOnInit() {
    this.viewColumns = ViewColumns;
    this.serviceEstimateData = ServiceEstimateData;
    this.initForm(); this.GetState();
    this.partList();
  }
  GetState() {
    this.dropdownservice.GetLookupList('States').subscribe(
      (res) => {
        if (res) {
          this.stateList = res;
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.drop_down.states);
      }
    );
  }
  loadEstimateData(serviceNo) {
    this.isDisabled = true;
    this.form.disable(); this.form.reset();
    this.serviceNumber = serviceNo;
    this.serviceEstimateData = []; this.sumItemTotal = 0; this.total = 0; this.totalLabour = 0;
    this.estimateList(serviceNo);
    this.estimateDetail(serviceNo);
  }
  estimateDetail(serviceNo) {
    this.serviceEstimateData = [];
    this.form.reset();
    this.customerName = '';
    this.service.GetEstimateDetails(serviceNo).subscribe(
      (res) => {
        const resp = res[0];
        if (resp) {
          this.customerName = resp.custName;
          this.form.setValue({
            address: resp.address,
            address2: resp.address2,
            city: resp.city,
            zip: resp.zip,
            //qty: resp.qty,
            notes: resp.note,
            quantity: 0,
            isTaxExempt: resp.taxExempt,
            isSalesTax: resp.salesTax,
            txtHours: Number(resp.hours),
            txtRate: resp.rate,
            state: resp.state,
          });
          this.totalLabour = resp.hours * resp.rate;
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.vehicle.get_service_history);
      }
    );
  }
  estimateList(serviceNo) {
    this.serviceEstimateData = []; this.lstItems = [];
    this.service.GetEstimateItems(serviceNo).subscribe(
      (res) => {
        if (res && res.length > 0) {
          this.serviceEstimateData = res;
          this.lstItems = res;
          this.lstItems.forEach(element => {
            element.id = element.pk;
            element.vendorPartNumber = element.itemCode;
            element.cost = element.linePrice;
          });
          this.sumItemTotal = this.serviceEstimateData.map((item) => Number.parseFloat(item.total)).reduce((acc, curr) => acc + curr, 0);
          this.total = this.sumItemTotal;
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.vehicle.get_service_history);
      }
    );
  }
  partList() {
    this.gridView = [];
    var data = {
      "pageNumber": this.pagerService.start,
      "pageSize": 100,
      "sortColumn": "",
      "sortDesc": true,
      "request": {
        "searchText": this.partSearch
      }
    }
    this.service.GetPartList(data).subscribe(
      (res) => {
        if(res.data != null) {
        if (res.data.length > 0) {
          this.gridView = res.data;
          this.tempgridView = res.data;
          this.partTotal = res.totalRecords;
        }
      }
      },
      (error) => {
        this.onError(error, ErrorMessages.vehicle.get_service_history);
      }
    );
  }
  public onPartPageChange(e: PageChangeEvent): void {
    this.partSkip = e.skip;
    this.partPageSize = e.take;
    this.pagerService.start = this.partSkip == 0 ? 0 : this.partSkip / this.partPageSize;
    this.partList();
  }
  initForm(): void {
    this.form = this.formBuilder.group({
      address: [],
      address2: [],
      city: [],
      zip: [],
      //qty: [],
      notes: [],
      quantity: [],
      isTaxExempt: [],
      isSalesTax: [],
      txtHours: [],
      txtRate: [],
      state: [],
    });
  }
  onSave(id:any) {
    const data = new ServiceEstimateModel();
    data.serviceNumber = this.serviceNumber;
    data.customerName = this.customerName;
    data.userName = JSON.parse(localStorage.getItem('currentUser')).userName;
    data.address = this.form.value.address;
    data.address2 = this.form.value.address2;
    data.city = this.form.value.city;
    data.state = this.form.value.state;
    data.zip = this.form.value.zip;
    data.rate = this.form.value.txtRate;
    data.hours = this.form.value.txtHours;
    data.taxExempt = this.form.value.isTaxExempt;
    data.salesTax = this.form.value.isSalesTax;
    data.note = this.form.value.notes;
 
    data.items = this.lstItems;
    if (this.form.invalid) {     
      this.form.markAllAsTouched();
      return false;
    }
    this.service.SaveEstimate(data).subscribe(
      (res) => {
        if (res['status'] == 200) {
          this.utils.toast.success(res['message']);
          // this.SaveEditClick.emit(res);
        } else this.utils.toast.error(res['message']);
        this.form.reset();
        this.form.disable();
        this.loadEstimateData(id);
        return true;
      },
      (error) => {
        this.onError(error, ErrorMessages.vendor.add_vendor_data);
        return false;
      }
    );
  }
  onItem() {
    this.displayItemDrp = !this.displayItemDrp;
    this.gridView = this.tempgridView;
    this.mySelection = [];
  }
  quantity: number;
  AddItem() {
    if (!this.quantity) {
      this.displayItemDialog = true; this.displayItemDrp = !this.displayItemDrp;
      return false;
    }
    this.displayItemDrp = !this.displayItemDrp;
    var cust = this.gridView[this.mySelection[this.mySelection.length - 1]];
    this.getItemsDetail(cust.invType);
    //this.displayItemDialog = !this.displayItemDialog;
  }
  public onFilter(inputValue: string): void {
    this.gridView = process(this.tempgridView, {
      filter: {
        logic: 'or',
        filters: [
          {
            field: 'invType',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'description',
            operator: 'contains',
            value: inputValue,
          }
        ],
      },
    }).data;
    this.mySelection = [];
  }
  lstItems = [];
  getItemsDetail(invType) {
    this.mySelection = [];
    this.visible=true;
    this.service.GetItemsDetail('All', invType).subscribe(
      (res) => {this.visible=false;
        if (res) {
          //res[0].qty = this.quantity;
          var isExist = this.serviceEstimateData.find(c => c.vendorPartNumber == res[0].invType);
          if (isExist && isExist.custom == false) {
            isExist.quantity = isExist.quantity + this.quantity;
          } else {
            var obj = {
              "pk": res[0].pk, "itemCode": res[0].invType, "vendorPartNumber": res[0].invType, "quantity": this.quantity, "cost": res[0].cost ?? 0.00,
              "total": (res[0].cost * this.quantity), "description": res[0].description, "id": 0, custom: res[0].custom
            }
            this.serviceEstimateData.push(obj);
          }
          this.lstItems = this.serviceEstimateData;
          this.getItemTotal();
          // if (this.serviceNumber) {
          //   var addObj = {
          //     "serviceNumber": this.serviceNumber,
          //     "items": [
          //       {
          //         "quantity": this.quantity,
          //         "partNumber": res[0].pk,
          //         "vendorPartNumber": res[0].invType,
          //         "description": res[0].description,
          //         "cost": res[0].cost,
          //         "total": (res[0].cost * this.quantity),
          //         //"listPrice": res[0].listPrice ?? 0
          //       }
          //     ]
          //   }
          //   this.service.SaveEstimateItems(addObj).subscribe(
          //     (res) => {
          //       //this.utils.toast.success(res.message);
          //       this.serviceEstimateData = res.result;
          //       this.sumItemTotal = this.serviceEstimateData.map((item) => Number.parseFloat(item.total)).reduce((acc, curr) => acc + curr, 0);
          //       this.total = this.sumItemTotal;
          //     }
          //   )
          // }
        }
        this.quantity = null;
      },
      (error) => {
        this.onError(error, ErrorMessages.branch.dropdown);
      }
    );
  }
  closeItem(status) {
    if (status == 'OK') {
      this.displayItemDrp = !this.displayItemDrp;
      this.displayItemDialog = !this.displayItemDialog;
    } else {
      this.displayItemDialog = !this.displayItemDialog;
    }
  }
  deleteItem(dataItem, id) {
    if (this.serviceNumber && id != 0) {
      this.service.DeleteEstimate(dataItem).subscribe(
        (res) => {
          if (res) {
            var id = this.serviceEstimateData.findIndex(c => c.pk == dataItem);
            this.serviceEstimateData.splice(id, 1);
            this.lstItems.slice(id, 1);
            this.utils.toast.success(res.message);
            this.getItemTotal();
            //this.estimateList(this.serviceNumber);
          }
        },
        (error) => {
          this.onError(error, ErrorMessages.branch.dropdown);
        }
      );
    } else {
      var id = this.serviceEstimateData.findIndex(c => c.pk == dataItem);
      this.serviceEstimateData.splice(id, 1);
      this.lstItems.slice(id, 1);
      this.getItemTotal();
    }

  }
  closePopup() {
    this.displayItemDrp = !this.displayItemDrp;
    this.quantity = null; this.partSearch = '';
    this.partList();
  }
  onState() {
    this.displayState = !this.displayState;
  }
  setTotalLabour() {
    this.totalLabour = this.form.value.txtRate * this.form.value.txtHours;
    this.getItemTotal();
    this.total = this.total + this.totalLabour;
  }
  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.data = {
      data: orderBy(this.serviceEstimateData, this.sort),
      total: this.serviceEstimateData.length,
    };
    this.serviceEstimateData = this.data.data;
  }
  btnAdd() {
    this.form.reset();
    this.form.enable();
    this.isDisabled = false;
  }
  btnEdit() {
    this.form.enable();
    this.isDisabled = false;
  }
  public rowClass = (args) => ({
    "k-disabled": (this.isDisabled == false ? false : true),
  });
  checkValue(event) {
    if (event.target.value < 0) {
      this.quantity = 0;
    }
  }
  public cellClickHandler({
    sender,
    rowIndex,
    columnIndex,
    dataItem,
    isEdited,
  }) {
    if (!isEdited) {
      if (columnIndex == 2 && dataItem.custom == true) {
        sender.editCell(rowIndex, columnIndex, this.createFormGroup(dataItem));
      }
      else if (columnIndex != 2) {
        sender.editCell(rowIndex, columnIndex, this.createFormGroup(dataItem));
      }
      //sender.editCell(rowIndex, columnIndex, this.createFormGroup(dataItem));
    } else {
      // dataItem.loadQty = 1;
    }
  }
  public cellCloseHandler(args: any) {
    const { formGroup, dataItem } = args;
    if (!formGroup.valid) {
      if (formGroup.value.quantity < 0) {
        this.utils.toast.error(
          'Qty. should not be greater than 0.'
        );
      }
      // prevent closing the edited cell if there are invalid values.
      args.preventDefault();
    } else if (formGroup.dirty) {
      dataItem.quantity = formGroup.value.quantity;
      dataItem.cost = formGroup.value.cost;
      dataItem.description = formGroup.value.description;
      dataItem.total = formGroup.value.quantity * formGroup.value.cost;
      var id = this.lstItems.findIndex(c => c.pk == dataItem.pk);
      var itm = this.lstItems[id];
      itm.cost = formGroup.value.cost;
      itm.quantity = formGroup.value.quantity;
      itm.total = dataItem.total;
      this.getItemTotal();
    }
  }
  public createFormGroup(dataItem: any): FormGroup {
    return this.formBuilder.group({
      quantity: [
        dataItem.quantity,
        Validators.compose([
          Validators.required,
          Validators.pattern('^[0-9]{1,3}'),
        ]),
      ],
      cost: [dataItem.cost,
      Validators.compose([
        Validators.required,
        Validators.pattern('^[0-9]\\d*(\\.\\d{1,2})?$'),
      ])],
      description: [dataItem.description]
    });
  }
  getItemTotal() {
    this.sumItemTotal = 0;
    this.serviceEstimateData.forEach(element => {
      this.sumItemTotal = this.sumItemTotal + element.total;
    });
    this.total = this.sumItemTotal;
  }
  private onError(error: any, customMessage?: string) {
    this.errorHandler.handleError(error, ModuleNames.vehicle, customMessage);
  }
}
