export class VendorHistoryModel {
  Id: number;
  VendorId: number;
  Field: string;
  OldValue: string;
  NewValue: string;
  SQL: string;
  CreatedBy: string;
  CreatedDate: Date;
}
