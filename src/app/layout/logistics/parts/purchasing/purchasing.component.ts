import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { orderBy, process, SortDescriptor } from '@progress/kendo-data-query';
import { DropdownService } from 'src/app/core/services/dropdown.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { PartsModel, partsVendorModel } from '../partlist/parts.model';
import { PartsService } from '../partlist/parts.service';
import { MenuService } from 'src/app/core/helper/menu.service';
import { ErrorHandlerService } from 'src/app/core/services';
import { ErrorMessages, ModuleNames } from 'src/app/core/constant';
@Component({
  selector: 'app-purchasing',
  templateUrl: './purchasing.component.html',
  styleUrls: ['./purchasing.component.scss'],
})
export class PurchasingComponent implements OnInit {
  form: FormGroup;
  id: number = 0;
  data: any;
  isDisabled: boolean = true;
  VendorType = ['A', 'B', 'C'];
  filterStatus: any = [];
  public pageSize = 5;
  public skip = 0;
  loader: any;
  lstVendor: any = [];
  lstTempVendor: any = [];
  lstPurchaseHistory: any = [];
  lstTempPurchaseHistory: any = [];
  filterText: string;
  public sort: SortDescriptor[] = [
    {
      field: 'poNumber',
      dir: 'asc',
    },
  ];

  isSave: boolean = true;
  isCancel: boolean = true;
  isEdit: boolean = false;
  isAdd: boolean = false;
  isActive: boolean = true;
  viewActive: boolean = false;
  public openedOffload = false;
  public vendorSelection: number[] = [0];
  isAddRight: boolean = false;
  isUpdateRight: boolean = false;
  public mySelection: number[] = [0];
  UOM: any;
  tempUOM: any;

  lstVendors: any = [];
  templstVendors: any = [];
  partId: number;
  vendorpartId: number = 0;
  constructor(
    private formBuilder: FormBuilder,
    public service: PartsService,
    private utils: UtilityService,
    public dropdownservice: DropdownService,
    public menuService: MenuService,
    public errorHandler: ErrorHandlerService
  ) {
    this.menuService.checkUserBySubmoduleRights('Purchasing');

    this.isAddRight = this.menuService.isAddRight;
    this.isUpdateRight = this.menuService.isEditRight;
  }

  ngOnInit(): void {
    this.initForm();
    this.GetVendorsList();
    this.GetUOM();
  }
  initForm(): void {
    this.form = this.formBuilder.group({
      vendorId: [0, Validators.required],
      vendorPartNumber: [''],
      vendorPrice: [0],
      preferred: [false],
      uom: ['', Validators.required],
    });
    this.form.disable();
  }
  btnCancel() {
    this.id = 0;
    this.form.disable();
    this.isCancel = true;
    this.isAdd = false;
    this.isSave = true;
    this.isEdit = false;
    this.viewActive = false;
  }

  btnAdd() {
    this.enableBtn();
    this.form.reset();
    this.form.enable();
    this.isEdit = true;
    this.isAdd = true;
    this.id = 0;
    this.viewActive = false;
  }

  btnEdit() {
    this.form.enable();
    this.enableBtn();
    this.isEdit = true;
    this.isAdd = true;
    this.viewActive = true;

    let data = this.lstVendor[this.vendorSelection[0]];
    this.setValue(data);
  }
  setValue(data: any) {
    this.id = data.id;
    // this.disbaleBtn();
    this.form.setValue({
      preferred: data.preferred,
      uom: data.uom ? data.uom : data.uomDescription,
      vendorId: data.vendorId,
      vendorPartNumber: data.vendorPartNumber,
      vendorPrice: data.vendorPrice,
    });
  }
  enableBtn() {
    this.isSave = false;
    this.isCancel = false;
  }
  disbaleBtn() {
    this.isAdd = false;
    this.isEdit = false;
    this.isSave = true;
    this.isCancel = true;
  }
  onEdit(id) {
    this.form.reset();
    if (id) {
      this.partId = id;
      this.vendorSelection = [0];
      this.GetVendors(id);
      this.GetPurchaseHistory(id);
    } else {
      this.lstVendor = [];
      this.lstTempVendor = [];
      this.lstPurchaseHistory = [];
      this.lstTempPurchaseHistory = [];
    }
  }
  GetVendorsList() {
    this.dropdownservice.GetVendorList().subscribe(
      (res) => {
        if (res) {
          this.lstVendors = res;
          this.templstVendors = res;
        }
      },
      (error) => this.onError(error, ErrorMessages.drop_down.get_vendor_list)
    );
  }
  GetVendors(id) {
    this.service.GetPurchasingVendors(id).subscribe((res) => {
      if (res) {
        this.lstVendor = res;
        this.lstTempVendor = res;
        if (this.lstVendor.length > 0) this.setValue(this.lstVendor[0]);
      }
    });
  }
  GetPurchaseHistory(id) {
    this.service.GetPurchasingHistory(id).subscribe((res) => {
      if (res) {
        this.lstPurchaseHistory = res;
        this.lstTempPurchaseHistory = res;
      }
    });
  }
  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.data = {
      data: orderBy(this.lstTempPurchaseHistory, this.sort),
      total: this.lstTempPurchaseHistory.length,
    };
    this.lstPurchaseHistory = this.data.data;
  }
  public sortChangeVendor(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.data = {
      data: orderBy(this.lstTempVendor, this.sort),
      total: this.lstTempVendor.length,
    };
    this.lstVendor = this.data.data;
  }
  public onFilter(inputValue: string): void {
    this.filterText = inputValue;
    this.mySelection = [];
    this.lstPurchaseHistory = process(this.lstTempPurchaseHistory, {
      filter: {
        logic: 'or',
        filters: [
          {
            field: 'createdDate',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'expectedDate',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'poNumber',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'purchasePrice',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'qbNumber',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'quantity',
            operator: 'contains',
            value: inputValue,
          },
        ],
      },
    }).data;
    this.mySelection = [0];
  }
  vendorFilter(value) {
    this.lstVendors = this.templstVendors.filter(
      (s) => s.vendorName.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }
  GetUOM() {
    this.dropdownservice.GetLookupList('MeasureUnits').subscribe(
      (res) => {
        if (res) {
          this.UOM = res;
          this.tempUOM = res;
        }
      },
      (error) => this.onError(error, ErrorMessages.drop_down.measure_units)
    );
  }
  uomFilter(value) {
    this.UOM = this.tempUOM.filter(
      (s) => s.value.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  public openOffload() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return false;
    }
    if (!this.form.value.vendorPartNumber && !this.form.value.vendorPrice) {
      this.openedOffload = true;
      return false;
    } else {
      this.onSave();
    }
  }
  public closeOffload(status) {
    if (status == 'yes') {
      this.onSave();
    }
    this.openedOffload = false;
  }
  onSave() {
    const data = new partsVendorModel();
    data.id = this.id;
    data.userName = JSON.parse(localStorage.getItem('currentUser')).userName;
    data.user_PK = JSON.parse(localStorage.getItem('currentUser')).user_PK;
    data.preferred = this.form.value.preferred;
    data.uom = this.form.value.uom;
    data.vendorId = this.form.value.vendorId;
    data.vendorPartNumber = this.form.value.vendorPartNumber;
    data.vendorPrice = this.form.value.vendorPrice;

    if (this.id > 0) {
      this.service.UpdatePurchasingVendor(this.partId, data).subscribe(
        (res) => {
          if (res['status'] == 200) {
            this.utils.toast.success(res['message']);
            // this.SaveEditClick.emit(res);
          } else this.utils.toast.error(res['message']);
          this.GetVendors(this.partId);
          this.GetPurchaseHistory(this.partId);
          this.form.disable();
          this.form.reset();
          this.btnCancel();
          this.isDisabled = true;
          this.id = 0;
        },
        (error) => this.onError(error, ErrorMessages.parts.update_parts_data)
      );
    } else {
      this.service.SavePurchasingVendor(this.partId, data).subscribe(
        (res) => {
          if (res['status'] == 200) {
            this.utils.toast.success(res['message']);
            // this.SaveEditClick.emit(res);
          } else this.utils.toast.error(res['message']);
          this.form.disable();
          this.isDisabled = true;
          this.form.reset();
          this.id = 0;
          this.btnCancel();
          this.GetVendors(this.partId);
          this.GetPurchaseHistory(this.partId);
        },
        (error) => this.onError(error, ErrorMessages.parts.add_parts_data)
      );
    }
  }
  onEditClick(item) {
    this.disbaleBtn();
    this.setValue(item);
  }
  removeItem(item) {
    this.opened = true;
    this.vendorpartId = item.id;
  }
  opened: boolean = false;
  public closeSubmit(status) {
    if (status == 'Yes') {
      this.opened = !this.opened;

      this.service.DeleteVendorPart(this.vendorpartId).subscribe((res) => {
        this.vendorpartId = 0;
        this.utils.toast.success(res['message']);
        this.GetVendors(this.partId);
      });
    } else {
      this.opened = !this.opened;
    }
  }
  private onError(error: any, customMessage?: string) {
    this.errorHandler.handleError(error, ModuleNames.parts, customMessage);
  }
}
