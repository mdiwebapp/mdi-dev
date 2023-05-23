import { Injectable } from '@angular/core';
import { DataService } from '../../../../../../core/services/data.service';
import { BaseApiService } from '../../../../../../core/services/base-api.service';
import { FleetModel } from './fleet.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CacheService } from '../../../../../../core/services/cache.service';

@Injectable({
  providedIn: 'root',
})
export class FleetService extends BaseApiService<FleetModel> {
  private baseUrl: any;
  constructor(
    protected dataService: DataService,
    private http: HttpClient,
    protected cache: CacheService
  ) {
    super('fleet', dataService, cache);
    this.baseUrl = environment.apiUrl;
  }

  /*
  GetList(status: boolean): Observable<any> {
    return this.dataService.get<any>(`fleet/GetList/${status}`);
  }*/

  GetListFilter(filter: any): Observable<any> {
    return this.dataService.post<any>(`Fleet/GetFleetViewList`, filter);
  }
  GetById(id: number): Observable<any> {
    return this.dataService.get<any>(`Fleet/GetFleetListById/${id}`);
  }

  ExportToExcelFleetView(invNumber: string): Observable<any> {
    return this.http.get(
      this.baseUrl + `Fleet/ExportToExcelFleetView/${invNumber}`,
      { responseType: 'blob' }
    );
  }
  ExportToExcelFleetGridView(filter: any): Observable<any> {
    return this.http.post(
      this.baseUrl + `Fleet/ExportToExcelFleetGridView`,filter,
      { responseType: 'blob' }
    );
  }
  /*
  GetPurchaseOrders(filter: any): Observable<any> {
    return this.dataService.post<any>(`Fleet/PurchaseOrders`, filter);
  }
  GetById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}fleet/${id}`, { headers: { hideLoader: 'false' } });
  }
  */
}
