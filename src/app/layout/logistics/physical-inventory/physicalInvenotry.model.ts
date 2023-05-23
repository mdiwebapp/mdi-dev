import { StringFilterCellComponent } from "@progress/kendo-angular-grid";

export class PhysicalInventoryModel {
    userName: StringFilterCellComponent;
    branch: string;
    comment: string;
    approved: boolean;
    selectedInventories: InventoriesModel[];
}
export class InventoriesModel {
    inventoryType: string;
    inventoryNumber: string;
    onHandQty: 0;
    countedQty: 0;
}