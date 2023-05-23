import { Injectable } from '@angular/core';
import { BaseApiService, CacheService } from 'src/app/core/services';
import { environment } from 'src/environments/environment';
import { DataService } from 'src/app/core/services/data.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConsignmentService extends BaseApiService<any> {
  private baseUrl: any;
  jobNumber :any;
  constructor(
    protected dataService: DataService,
    private http: HttpClient,
    protected cache: CacheService
  ) {
    super('Consignment', dataService, cache);
    this.baseUrl = environment.apiUrl;
  }

  GetList(data: any): Observable<any> {
    return this.dataService.post<any>(`Consignment/Job/List`, data);
  }

  GetInventoryList(data: any): Observable<any> {
    return this.dataService.get<any>(`Consignment/Inventory/List/${data}`);
  }
  GetInventoryTransList(invNum: any, job: any): Observable<any> {
    return this.dataService.get<any>(
      `Consignment/InventoryTran/List/${invNum}/${job}`
    );
  }
  GetInventoryTransExport(invNum: any, job: any): Observable<any> {
    return this.dataService.get<any>(
      `Consignment/InventoryTran/ExportToExcel/${invNum}/${job}`
    );
  }
  GetInventorySmallList(data: any): Observable<any> {
    return this.dataService.get<any>(
      `Consignment/Invoicing/InventorySmall/List/${data}`
    );
  }
  GetInvoiceList(invNum: any, job: any): Observable<any> {
    return this.dataService.get<any>(
      `Consignment/Invoicing/Invoice/List/${invNum}/${job}`
    );
  }
  GetInvoiceRentList(data: any, job: any): Observable<any> {
    return this.dataService.get<any>(
      `Consignment/Invoicing/InvoiceRent/List/${data}/${job}`
    );
  }
  GetOffRentReport(): Observable<any> {
    return this.http.get(
      this.baseUrl +
        'Consignment/ExportToExcelRunOffRentOnJob',
      { responseType: 'blob' }
    );
  }
  GetUtilizationCalenderList(request: any): Observable<any> {
    return this.dataService.post<any>(`UtilizationCalendar/List`, request);
  }

  onloadSave(result: any): Observable<any> {
    return this.dataService.post<any>(`UtilizationCalendar/Save`, result);
  }
  GetExcelRunNeedInvoicing(JobNumber:string): Observable<any> {
    return this.http.get(
      this.baseUrl +
        `Consignment/ExportToExcelRunNeedInvoicing/${JobNumber}`,
      { responseType: 'blob' }
    );
  }
  SetJobNumber(jobNum) {
    this.jobNumber = jobNum;
  }
  GetJobNumber() {
    return this.jobNumber;
  }
  GetExcelRunDayByDayMessenger(data:any): Observable<any>{
    return this.http.post(
      this.baseUrl + `Consignment/ExportToExcelRunDayByDayMessenger/`,data,
      { responseType: 'blob' }
    );
  }
}
