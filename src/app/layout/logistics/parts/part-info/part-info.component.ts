import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DropDownModel } from 'src/app/core/models/drop-down.model';
import { DropdownService } from 'src/app/core/services/dropdown.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { partInfoModel } from '../partlist/parts.model';
import { PartsService } from '../partlist/parts.service';
import { ModuleNames, ErrorMessages } from 'src/app/core/constant';
import { ErrorHandlerService } from 'src/app/core/services';
@Component({
  selector: 'app-part-info',
  templateUrl: './part-info.component.html',
  styleUrls: ['./part-info.component.scss'],
})
export class PartInfoComponent implements OnInit {
  form: FormGroup;
  stateList: any = [];
  UOM: any = [];
  cycleList: any = ['A', 'B', 'C', 'D', 'E'];
  dataBarcode: any = [];
  isDisabled: boolean;
  showPartType: boolean = false;
  showPricing: boolean = false;
  showSystem: boolean = false;
  opened: boolean = false;
  isEdit: boolean = false;
  id: any;
  categoryList: DropDownModel[];
  subCategoryList: any[];
  selectedBarcode: any;
  constructor(
    private formBuilder: FormBuilder,
    public dropdownservice: DropdownService,
    public service: PartsService,
    private utils: UtilityService,
    public errorHandler: ErrorHandlerService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.GetCategory();
  }

  initForm(): void {
    this.form = this.formBuilder.group({
      //partNumber: [''],
      // parts info
      //invType: [''],
      rentalFleet: [false],
      components: [false],
      gpcParts: [false],
      serviceParts: [false],
      // showPrice: [false],
      isTaxed: [false],
      hasUsage: [false],
      hasMultiple: [false],
      custom: [false],
      oneTimeCharge: [false],
      bom: [false],
      cycleCountClass: [''],

      peSerialized: [false],
      inventoryPart: [false],
      sparePart: [false],
      componentized: [false],
      recordHours: [false],
      autoGenerate: [false],
      longLead: [false],
      //inspection: [false],
      //itemGroup: [''],
      //qbGroup: [''],
      category: [''],
      subCategory: [''],
    });
  }
  editClick(data: any) {
    this.form.disable();
    this.isDisabled = true;this.isEdit=false;
    if (data) {
      this.id = data.id;
      setTimeout(() => {
        this.setValue(data);
      }, 300);
    } else {this.dataBarcode = [];
      this.form.reset();
    }
  }

  setValue(data: any) {
    // if (data.partInfo.category) {
    //   this.GetSubCategory(data.partInfo.category);
    // }

    this.form.setValue({
      //partNumber: data.partNumber,
      // invType:'',
      rentalFleet: data.partInfo.rentalFleet,
      components: data.partInfo.components,
      gpcParts: data.partInfo.gpcParts,
      serviceParts: data.partInfo.serviceParts,
      isTaxed: data.partInfo.isTaxed,
      hasUsage: data.partInfo.hasUsage,
      custom: data.partInfo.custom,
      oneTimeCharge: data.partInfo.oneTimeCharge,
      bom: data.partInfo.bom,
      cycleCountClass: data.partInfo.cycleCountClass,
      peSerialized: data.partInfo.peSerialized,
      sparePart: data.partInfo.sparePart,
      componentized: data.partInfo.componentized,
      recordHours: data.partInfo.recordHours,
      autoGenerate: data.partInfo.autoGenerate,
      longLead: data.partInfo.longLead,
      inventoryPart: data.partInfo.inventoryPart,
      hasMultiple: data.partInfo.hasMultiple,
      //inspection: '',// data.partInfo.inspection,
      category: data.partInfo.category == null ? '' : data.partInfo.category,
      subCategory:
        data.partInfo.subCategory == null ? '' : data.partInfo.subCategory,
    });
    this.dataBarcode = [];
    this.dataBarcode = data.partInfo.barcodes;
  }
  GetCategory() {
    this.dropdownservice.GetCategoryList().subscribe(
      (res) => {
        if (res) {
          this.categoryList = res;
          this.GetSubCategory(0);
        }
      },
      (error) => this.onError(error, ErrorMessages.drop_down.get_category_list)
    );
  }
  GetSubCategory(category) {
    if (this.categoryList.length > 0) {
      let id =
        category == 0
          ? 0
          : this.categoryList.find((c) => c.value == category).id;
      this.dropdownservice.GetSubCategoryList(id).subscribe(
        (res) => {
          if (res) {
            this.subCategoryList = res;
          }
        },
        (error) =>
          this.onError(error, ErrorMessages.drop_down.get_sub_category_list)
      );
    }
  }
  GetCategoryBySubcategory(category) {
    if (this.categoryList.length > 0) {
      let id =
        category == 0
          ? 0
          : this.subCategoryList.find((c) => c.value == category).categoryId;

      this.form.controls['category'].setValue(
        this.categoryList.find((c) => c.id == id).value
      );
    }
  }
  btnEdit() {  this.isEdit = true;
    this.form.enable();
  }
  onSave() {
    const data = new partInfoModel();
    data.id = this.id;
    data.rentalFleet = this.form.value.rentalFleet;
    data.components = this.form.value.components;
    data.serviceParts = this.form.value.serviceParts;
    data.userName = JSON.parse(localStorage.getItem('currentUser')).userName;
    data.user_PK = JSON.parse(localStorage.getItem('currentUser')).id;
    data.category = this.form.value.category;
    data.subCategory = this.form.value.subCategory;
    data.isTaxed = this.form.value.isTaxed;
    data.hasUsage = this.form.value.hasUsage;
    data.oneTimeCharge = this.form.value.oneTimeCharge;
    data.hasMultiple = this.form.value.hasMultiple;
    data.custom = this.form.value.custom;
    data.recordHours = this.form.value.recordHours;
    data.longLead = this.form.value.longLead;
    data.inventoryPart = this.form.value.inventoryPart;
    data.componentized = this.form.value.componentized;
    data.autoGenerate = this.form.value.autoGenerate;
    data.bom = this.form.value.bom;
    data.peSerialized = this.form.value.peSerialized;
    data.sparePart = this.form.value.sparePart;
    data.cycleCountClass = this.form.value.cycleCountClass;
    data.gpcParts = this.form.value.gpcParts;

    this.service.UpdatePartsInfo(data).subscribe(
      (res) => {
        if (res['status'] == 200) {
          this.utils.toast.success(res['message']);
          // this.SaveEditClick.emit(res);
        } else this.utils.toast.error(res['message']);

        this.form.disable();
        this.isDisabled = true;
        this.id = 0;
      },
      (error) => this.onError(error, ErrorMessages.parts.update_parts_info)
    );
  }
  changeRentalStatus(val) {
    this.form.controls['gpcParts'].setValue(val ? false : true);
  }
  changeGPCStatus(val) {
    this.form.controls['rentalFleet'].setValue(val ? false : true);
  }
  loadBarcodeList(data) {
    this.dataBarcode = [];
    this.dataBarcode = data;
  }
  removeItem(itm) {
    this.opened = true;
    this.selectedBarcode = itm;
  }
  public closeSubmit(status) {
    if (status == 'Yes') {
      this.opened = !this.opened;
      this.service.DeleteBarcode(this.id, this.selectedBarcode).subscribe(
        (res) => {
          if (res['status'] == 200) {
            this.selectedBarcode = '';
            this.dataBarcode = res.result.barcodes;
            this.utils.toast.success(res['message']);
            // this.SaveEditClick.emit(res);
          } else this.utils.toast.error(res['message']);

        },
        (error) => this.onError(error, ErrorMessages.parts.update_parts_info)
      );
    } else {
      this.opened = !this.opened;
    }
  }
  private onError(error: any, customMessage?: string) {
    this.errorHandler.handleError(error, ModuleNames.parts, customMessage);
  }
}
