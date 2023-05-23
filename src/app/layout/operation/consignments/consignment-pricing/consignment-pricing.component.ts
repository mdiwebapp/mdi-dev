import { Component, OnInit } from '@angular/core';
import { SortDescriptor } from '@progress/kendo-data-query';

@Component({
  selector: 'app-consignment-pricing',
  templateUrl: './consignment-pricing.component.html',
  styleUrls: ['./consignment-pricing.component.scss'],
})
export class ConsignmentPricingComponent implements OnInit {
  data: any = [];
  sort: SortDescriptor[] = [];
  selections: any = [];
  skip: number = 0;
  multiple: boolean = false;
  isAddPricing: boolean = false;
  isEditPricing: boolean = false;
  isInventoryTypeVisible: boolean = false;
  inventoryTypeColumns: any = [
    {
      Name: 'name',
      isCheck: true,
      Text: 'Name',
      isDisable: false,
      index: 0,
      width: 100,
    },
  ];
  inventoryTypes: any = [];
  inventory_type_btn: string = 'Select Inventory';
  constructor() {}

  ngOnInit(): void {
    this.inventoryTypes = [
      { name: 'GDD040PR' },
      { name: 'GHT080PR' },
      { name: 'GST048PR' },
    ];
  }
  onResizeColumn(event) {}

  onSelectionChange(event) {
    this.inventory_type_btn = event.selectedRows?.[0]?.dataItem.name;
    this.isInventoryTypeVisible = false;
  }

  onSortChange(event) {}

  onReOrderColumns(event) {}

  onDataStateChange(event) {}

  onTabChange(event) {}

  onChangeAction(event) {}

  onHandleOperation(type) {
    switch (type) {
      case 'add':
        this.isAddPricing = !this.isAddPricing;
        break;
      case 'save':
        this.isAddPricing = !this.isAddPricing;
        break;
      case 'cancel':
        this.isAddPricing = !this.isAddPricing;
        break;
      case 'edit':
        this.isEditPricing = !this.isEditPricing;
      case 'inventory_type':
        this.isInventoryTypeVisible = !this.isInventoryTypeVisible;
      default:
        break;
    }
  }
}
