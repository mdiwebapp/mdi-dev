export class PaginationRequest<T> {
  start: number;
  end: number;
  pageNumber: number;
  pageSize: number;
  request: T;
}
export class PaginationWithSortRequest<T> {
  pageNumber: number;
  pageSize: number;
  sortColumn: string;
  sortDesc: boolean = false;
  request: T;
}
export class PaginationResponse<T> {
  totalRecords: number;
  hasMore: boolean;
  data: T;
}
