import { BooleanFilterCellComponent } from '@progress/kendo-angular-grid';

export class PurchaseOrderRequestModel {
  poNumber: string;
  submitDate: string;
  ExpectedDate: string;
  QBPONumber: string;
  QBNoticeDate: string;
  CreatedDate: string;
  Vendor: string;
  vendorAddress: string;
  vendorCity: string;
  vendorState: string;
  vendorZip: string;
  vendorContact: string;
  vendorPhone: string;
  Notes: string;
  Freight: boolean;
  Tax: boolean;
  Branch: string;
  ShipAddress: string;
  ShipCity: string;
  ShipState: string;
  ShipZip: string;
  CreditCard: boolean;
  CCHolder: string;
  CCLast4: string;
  ShipTerms: string;
  logo: string;
  Status: string;
  UserName: string;
  Closed: boolean;
  ClosedDate: Date;
  ShipTo: string;
  CreatedBy: string;
  RequestedBy: number;
}
export class PurchaseOrderExcelFileViewResultModel{
  fileName:string;
  filePath:string;
}