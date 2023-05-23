export class LineItemsUpdateRequestModel {
  PONumber: string;
  PartId: string;
  PartNumber: string;
  InventoryNumber: string;
  JOB: string;
  Quantity: string;
  PUOM: string;
  Requestor: string;
  PUOMQuantity: string;
  UOM: string;
  PricePer: string;
  Total: string;
  Status: string;
  CostCenter: string;
  PurchasingUOM: string;
  Stock: string;
  SalesRental: string;
  SRPrice: string;
  RQuantity: string;
  RPeriod: string;
  RUOM: string;
  FleetInv: string;
  JOBSO: string;
  description: string;
  purchaseCost: string;
  rentalPeriod: string;
  rentalStartDate: string;
  rental: number;
}
export class PurchaseOrderFleetFilterModel {
  pageNumber: number;
  pageSize: number;
  Search: string;
}
export class PurchaseOrderJOBFilterModel {
  Search: string;
}
export class RemoveLineItemsRequestModel{
  Id:number;
  PONumber:string;
}