import { Component, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DropdownService } from 'src/app/core/services/dropdown.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { PartsModel } from '../partlist/parts.model';
import { PartsService } from '../partlist/parts.service';
import { ModuleNames, ErrorMessages } from 'src/app/core/constant';
import { ErrorHandlerService } from 'src/app/core/services';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-part',
  templateUrl: './part.component.html',
  styleUrls: ['./part.component.scss'],
})
export class PartComponent implements OnInit {
  @Output() dialogOpened: boolean = false;
  @Output() errorMsg: any;
  form: FormGroup;
  id: number = 0;
  partNumber: string;
  data: PartsModel[];
  VehicleTypeData: any = [];
  EquivalentData: any = [];
  tmpEquivalentData: any = [];
  InventoryTypeData: any = [];

  branchIds: any = [];
  selectdBranchIds: any = [];
  hideSubstitute: boolean = false;
  isDisabled: boolean = true;
  showEqui: boolean = false;
  showQues: boolean = false;
  showSubstitute: boolean = false;
  isRentalFleet: boolean = false;
  isServiceParts: boolean = false;
  isGpcParts: boolean = false;
  partType: string;
  UOM: any; // ["DAY", "EA", "FT", "GAL", "HOUR", "IN", "LB", "ML", "OZ", "PT", "QT", "SQFT", "SQIN", "WEEK", "YARD"];
  tempUOM: any;
  dataBarcode: any = [];
  buildQty: number = 0;
  qtyOnOrder: number = 0;
  qtyAllocated: number = 0;
  qtyPicked: number = 0;
  qtyOnHand: number = 0;
  qtyBackOrder: number = 0;
  qtyRequired: number = 0;
  branchData: any;
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
  branch: any[] = [];
  inventoryTypeFilterData: any;
  clickEventsubscription: Subscription;
  isLoading: boolean = false;
  message: any;
  constructor(
    private formBuilder: FormBuilder,
    public service: PartsService,
    private utils: UtilityService,
    public dropdownservice: DropdownService,
    public errorHandler: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    this.clickEventsubscription = this.utils.getClickEvent().subscribe((a) => {
      this.message = a;
      this.callBack(this.message);
    });
    this.initForm();
    this.GetEquivalent();
    this.GetBranch();
    this.GetUOM();
    //this.GetInventoryType();
    this.branch = JSON.parse(this.utils.storage.getItem('selectedBranch'));
    this.branch.forEach((element) => {
      this.selectdBranchIds.push(element.code);
    });
    //this.branchIds = JSON.parse(this.utils.storage.getItem('partBranch'));
    this.bindQuantities();
  }
  callBack(value) {
    var valueId = [];
    var valueId1 = [];
    value.forEach((element) => {
      valueId.push(element.code);
      valueId1.push(element.userId);
    });
    this.selectdBranchIds = valueId;
    this.bindQuantities();
  }
  GetBranch() {
    this.branch = this.branchAll.concat(
      this.utils.storage.CurrentUser.userBranch
    );
    this.branchData = this.branch;
  }
  branchFilter(value) {
    this.branch = this.branchData.filter(
      (s) => s.value.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }
  uomFilter(value) {
    this.UOM = this.tempUOM.filter(
      (s) => s.value.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }
  branchChange(data) {
    this.buildQty = 0;
    this.qtyOnOrder = 0;
    this.qtyAllocated = 0;
    this.qtyPicked = 0;
    this.qtyOnHand = 0;
    this.selectdBranchIds = [];
    var data1: any[] = [];
    if (data.length >= 1) {
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
    if (data[0] == 0) {
      this.branch.forEach((element) => {
        if (element.value != 'All' && element.value != '%') {
          this.selectdBranchIds.push(element.code);
        }
      });
    } else {
      this.branchIds.forEach((e) => {
        this.selectdBranchIds.push(this.branch.find((c) => c.id == e).code);
      });
    }
    this.utils.storage.setItem('partBranch', JSON.stringify(this.branchIds));
    this.isLoading = true;
    this.service.GetQtyData(this.id, this.selectdBranchIds).subscribe((res) => {
      if (res.length > 0) {
        this.buildQty = res[0].buildQty;
        this.qtyOnOrder = res[0].qtyOnOrder;
        this.qtyAllocated = res[0].qtyAllocated;
        this.qtyPicked = res[0].qtyPicked;
        this.qtyOnHand = res[0].qtyOnHand;
      }
    });
  }

  bindQuantities() {
    // if (this.branchIds.length > 0 && this.branchIds[0] == 0) {
    //   this.branch.forEach((element) => {
    //     if (element.value != 'All' && element.value != '%') {
    //       this.selectdBranchIds.push(element.code);
    //     }
    //   });
    // } else {
    //   this.branchIds.forEach((e) => {
    //     this.selectdBranchIds.push(this.branch.find((c) => c.id == e).code);
    //   });
    // }
    this.service.GetQtyData(this.id, this.selectdBranchIds).subscribe((res) => {
      if (res != null && res.length > 0) {
        this.buildQty = res[0].buildQty;
        this.qtyOnOrder = res[0].qtyOnOrder;
        this.qtyAllocated = res[0].qtyAllocated;
        this.qtyPicked = res[0].qtyPicked;
        this.qtyOnHand = res[0].qtyOnHand;
      }
    });
  }
  dedicatedbranchchange(data) {
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
    //this.utils.storage.setItem('partBranch', JSON.stringify(this.branchIds));
  }
  numericNumberReg = '^[0-9]{12}[a-z|A-Z]{1}$'; //'^-?[0-9]\\d*(\\.\\d{1,2})?$'
  initForm(): void {
    this.form = this.formBuilder.group({
      inventoryType: [
        '',
        [Validators.required, Validators.pattern(this.numericNumberReg)],
      ],
      rop: [''],
      roq: [''],
      gpcPartNumber: [''],
      purchaseDescription: ['', Validators.required],
      salesDescription: ['', Validators.required],
      keyword: [''],
      status: [''],
      maxQty: [''],
      uom: ['', Validators.required],
    });
  }
  btnAdd() {
    this.id = 0;
    this.form.reset();
    this.form.enable();
    // localStorage.removeItem('partBranch');
    this.isDisabled = false;
  }
  btnEdit() {
    this.form.enable();
    this.isDisabled = false;
    this.form.controls['inventoryType'].disable();
  }
  editClick(data: any) {
    this.form.reset();
    //localStorage.removeItem('partBranch');
    this.form.disable();
    this.isDisabled = true;
    if(!data){
      this.form.reset();
      this.buildQty = 0;
        this.qtyOnOrder = 0;
        this.qtyAllocated = 0;
        this.qtyPicked = 0;
        this.qtyOnHand = 0;
      return false;
    }
    this.id = data.id;
    ///this.partNumber = data.partNumber;
    this.isRentalFleet = data.partInfo.rentalFleet;
    this.isGpcParts = data.partInfo.gpcParts;
    this.isServiceParts = data.partInfo.serviceParts;
    // if (data.id > 0) {
    this.setValue(data);
    if (this.branchIds != null) {
      this.bindQuantities();
    }
    // } else {
    //   this.form.reset();
    // }
  }
  setPartnumber(event) {
    var partNum = this.InventoryTypeData.find((c) => c.inventoryType === event);
    this.partNumber = partNum.partNumber;
    this.form.controls['partNumber'].setValue(this.partNumber);
  }
  setValue(data: any) {
    this.partType = data.partType;
    this.form.setValue({
      //partNumber: data.partNumber,
      inventoryType: data.inventoryType,
      purchaseDescription: data.purchaseDescription,
      salesDescription: data.salesDescription,
      keyword: data.keyword,
      rop: data.rop,
      roq: data.roq,
      gpcPartNumber: data.gpcPartNumber,
      status: '',
      uom: data.uom,
      maxQty: data.maxQty,
      // invType:'',
      // rentalFleet:'',
      // components:'',
      // gpcParts:'',
      // serviceParts:'',
      // showPrice:'',
      // isTaxed:'',
      // hasUsage:'',
      // hasMultiple:'',
    });
  }
  GetEquivalent() {
    this.dropdownservice.GetEquivalentList().subscribe(
      (res) => {
        if (res) {
          this.EquivalentData = res;
          this.tmpEquivalentData = res;
        }
      },
      (error) =>
        this.onError(error, ErrorMessages.drop_down.get_equivalent_list)
    );
  }
  GetInventoryType() {
    this.dropdownservice.GetInventoryTypeList().subscribe(
      (res) => {
        if (res) {
          this.InventoryTypeData = res;
          this.inventoryTypeFilterData = res;
        }
      },
      (error) =>
        this.onError(error, ErrorMessages.drop_down.get_inventory_type_list)
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

  onSave(active) {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return false;
    }
    const data = new PartsModel();
    data.id = this.id;
    data.userName = JSON.parse(localStorage.getItem('currentUser')).userName;
    data.inventoryType = this.form.get('inventoryType').value;
    data.rop = this.form.value.rop ?? 0;
    data.roq = this.form.value.roq ?? 0;
    data.gpcPartNumber = this.form.value.gpcPartNumber;
    data.purchaseDescription = this.form.value.purchaseDescription;
    data.salesDescription = this.form.value.salesDescription;
    data.keyword = this.form.value.keyword;

    data.maxQty = this.form.value.maxQty ?? 0;
    data.uom = this.form.value.uom;
    if (this.id > 0) {
      data.status = active == false ? 1 : 0;
      //data.active = active; // (active == null ? false : active);
      this.service.UpdatePartsData(data).subscribe(
        (res) => {
          if (res['status'] == 200) {
            this.utils.toast.success(res['message']);
            // this.SaveEditClick.emit(res);
          } else this.utils.toast.error(res['message']);

          this.form.disable();
          this.isDisabled = true;
          this.id = 0;
        },
        (error) => this.onError(error, ErrorMessages.parts.update_parts_data)
      );
    } else {
      this.service.AddPartsData(data).subscribe(
        (res) => {
          if (res['status'] == 200) {
            this.utils.toast.success(res['message']);
            // this.SaveEditClick.emit(res);
          } else this.utils.toast.error(res['message']);
          this.form.disable();
          this.isDisabled = true;
          this.id = 0;
        },
        (error) => this.onError(error, ErrorMessages.parts.add_parts_data)
      );
    }
  }

  inventoryTypeFilter(value) {
    this.InventoryTypeData = this.inventoryTypeFilterData.filter(
      (s) => s.inventoryType.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }
  gpcPartFilter(value) {
    this.EquivalentData = this.tmpEquivalentData.filter(
      (s) => s.value.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }
  checkinventoryType(value) {
    this.service.CheckInventoryType(value).subscribe(
      (res) => {
        if (res.status == 0) {
          this.form.get('inventoryType').setValue('');
          this.utils.toast.error(res['message']);
        }
      },
      (error) => this.onError(error, ErrorMessages.parts.check_inventory_type)
    );
  }

  private onError(error: any, customMessage?: string) {
    this.errorHandler.handleError(error, ModuleNames.parts, customMessage);
  }
}
