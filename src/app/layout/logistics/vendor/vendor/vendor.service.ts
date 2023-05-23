import { Injectable } from '@angular/core';
import { DataService } from '../../../../core/services/data.service';
import { BaseApiService } from '../../../../core/services/base-api.service';
import { VendorModel } from './vendor.model';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CacheService } from 'src/app/core/services/cache.service';

@Injectable({
  providedIn: 'root'
})
export class VendorService extends BaseApiService<VendorModel> {
  private baseUrl: any;
  public vendorId: number;
  constructor(protected dataService: DataService, private http: HttpClient, protected cache: CacheService) {

    super('vendor', dataService, cache);
    this.baseUrl = environment.apiUrl
  }

  GetList(status: boolean): Observable<any> {
    return this.dataService.get<any>(`vendor/GetList/${status}`);
  }

  GetListFilter(filter: any): Observable<any> {
    return this.dataService.post<any>(`vendor/GetListFilter`, filter);
  }

  GetPurchaseOrders(filter: any): Observable<any> {
    return this.dataService.post<any>(`Vendor/PurchaseOrders`, filter);
  }
  GetPurchaseOrdersDetail(id: any): Observable<any> {
    return this.dataService.post<any>(`Vendor/PurchaseOrders/` + id, null);
  }
  GetById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}vendor/${id}`, { headers: { hideLoader: 'false' } });
  }
  GetVendorParts(vID: any): Observable<any> {
    return this.dataService.post<any>(`Vendor/` + vID + `/parts`, null);
  }
  GetReportData(filter: any): Observable<any> {
    return this.dataService.post<any>(`Vendor/Report/Spend`, filter);
  }
  GetExportPart(id: any): any {
    return this.dataService.get<any>(`Vendor/` + id + `/partsexport`, null, null, { responseType: 'blob' });
  }
  downloadFile(id): any {
    return this.http.get(this.baseUrl + `Vendor/` + id + `/partsexport`, { responseType: 'blob' });
  }
  downloadVendorData(): any {
    return this.http.get(this.baseUrl + `Vendor/ExportToExcel`, { responseType: 'blob' });
  }
  GetNextId(): Observable<any> {
    return this.dataService.post<any>(`vendor`, null);
  }
  deleteId(id): Observable<any> {
    return this.dataService.delete<any>(`vendor`, id);
  }

}
