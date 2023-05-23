import { StringFilterComponent } from '@progress/kendo-angular-grid';

export class PartsModel {
  id: number;
  userName: string;
  partNumber: number;
  inventoryType: string;
  rop: number;
  roq: number;
  gpcPartNumber: string;
  purchaseDescription: string;
  salesDescription: string;
  keyword: string;
  status: number;
  // partInfo: partInfoModel;
  isNational: boolean;
  //active: boolean;
  maxQty: number;
  uom: string;
}

export class partInfoModel {
  id: number;
  userName: string;
  user_PK: number;
  category: string;
  subCategory: string;
  invType: string;
  rentalFleet: true;
  components: true;
  gpcParts: true;
  serviceParts: true;
  showPrice: true;
  isTaxed: true;
  hasUsage: true;
  hasMultiple: true;
  custom: true;
  oneTimeCharge: true;
  bom: true;
  cycleCountClass: string;
  uom: string;
  peSerialized: true;
  inventoryPart: true;
  sparePart: true;
  componentized: true;
  recordHours: true;
  autoGenerate: true;
  longLead: true;
  inspection: true;
  itemGroup: string;
  qbGroup: string;
}

export class partsVendorModel {
  id: number;
  userName: string;
  user_PK: 0;
  vendorId: 0;
  vendorPartNumber: string;
  vendorPrice: 0;
  preferred: false;
  uom: string;
}
