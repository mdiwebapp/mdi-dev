export class InventoryViewFilterModel {
  ShowCost: boolean;
  ShowRent: boolean;
  YardOnly: boolean;
  Search: string;
  branchName: string;
  pageNumber: number;
  pageSize: number;
  SortColumn: string;
  SortDesc: boolean = false;
  ExcelExport: boolean;
}
