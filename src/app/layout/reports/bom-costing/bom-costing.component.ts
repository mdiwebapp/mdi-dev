import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { orderBy, SortDescriptor } from '@progress/kendo-data-query';

@Component({
  selector: 'app-bom-costing',
  templateUrl: './bom-costing.component.html',
  styleUrls: ['./bom-costing.component.scss'],
})
export class BomCostingComponent implements OnInit {
  bomCostingForm: FormGroup;
  sort: SortDescriptor[] = [];
  selections: any = [];
  skip: number = 0;
  multiple: boolean = false;
  disable: boolean = false;
  isDisable: boolean = true;
  productionOrderSort: SortDescriptor[] = [];
  isSelectVisible: boolean = false;
  isProductionOrderVisible: boolean = false;
  production_btn: string = 'Production Order';
  select_btn: string = 'Select Bom';
  isSelectOrder: boolean = false;
  isProductitonOrder: boolean = false;
  selectBomData = [
    {
      type: '000293001001',
      name: 'SUCTION SPOOL, 18GHT, C.I.',
    },
    {
      type: '120011051000',
      name: 'GUSSET, 1/4" X 2" X 2", A-36 HR',
    },
    {
      type: '120049060002',
      name: '	BRACKET, ANGLE, 2-1/2" X 2-1/2" X 3/8" THICK X 2-1/2" LONG, A-36',
    },
  ];
  productionOrderColumns = [
    {
      Name: 'prod',
      isCheck: true,
      Text: 'Prod',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'modelNumber',
      isCheck: true,
      Text: 'Model Number',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'jobDescription',
      isCheck: true,
      Text: 'Job Description',
      isDisable: false,
      index: 0,
      width: 100,
    },
  ];
  productionOrderData = [
    {
      prod: 'P10264',
      modelNumber: '203843200000',
      jobDescription:
        'AIR SEPERATION TANK WELDMENT, 4", MARK 2.1 FOR INVENTORY	3.71	2',
    },
    {
      prod: 'P10268',
      modelNumber: '600717000000',
      jobDescription: '8GSTDPICT4T1SG	148.203',
    },
    {
      prod: 'P10270',
      modelNumber: '600893000000',
      jobDescription: '12GSTDPICT4T1SG	226.048',
    },
  ];

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.onInitForm(this.selectBomData[0]);
  }

  onInitForm(value) {
    this.bomCostingForm = this.formBuilder.group({
      type: value?.type || '',
      name: value?.rate || '',
      prod: value?.prod || '',
      modelNumber: value?.modelNumber || '',
      jobDescription: value?.jobDescription || '',
    });
  }

  onResizeColumn(event) {}

  onSelectionChange(event) {}

  onReOrderColumns(event) {}

  onDataStateChange(event) {}

  onRowSelect(event, type) {
    switch (type) {
      case 'production':
        this.production_btn = event.selectedRows?.[0]?.dataItem.modelNumber;
        this.select_btn = this.selectBomData[0].type;
        this.isProductionOrderVisible = false;
        this.isProductitonOrder = true;
        this.isSelectOrder = true;
        break;
      case 'select':
        this.select_btn = event.selectedRows?.[0]?.dataItem.type;
        this.isSelectVisible = false;
        this.isSelectOrder = true;
        break;
      default:
        break;
    }
  }

  onSortChange(sort: SortDescriptor[], type) {
    switch (type) {
      case 'production_order':
        this.productionOrderSort = sort;
        this.productionOrderColumns = orderBy(
          this.productionOrderColumns,
          sort
        );
        break;
      default:
        break;
    }
  }

  onHandleOperations(type) {
    switch (type) {
      case 'select_bom':
        this.isSelectVisible = !this.isSelectVisible;
        this.disable = false;
        break;
      case 'production_order':
        this.isProductionOrderVisible = !this.isProductionOrderVisible;
        break;
      default:
        break;
    }
  }

  onReset() {
    this.isProductitonOrder = false;
    this.isSelectOrder = false;
    this.production_btn = 'Prodution Order';
    this.select_btn = 'Select BOM';
  }

  onCheckboxChecked(event) {
    this.disable = event.target.checked;
  }
}
