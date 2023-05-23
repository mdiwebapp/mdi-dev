import { StringFilterCellComponent } from "@progress/kendo-angular-grid";

export class CycleCountModel {
  userName: StringFilterCellComponent;
  branch: string;
  selectedInventories: InventoriesModel[];  
}
export class InventoriesModel {
  inventoryType: string;
  inventoryNumber: string;
  description: string;
  onHandQty: 0;
  countedQty: 0;
}