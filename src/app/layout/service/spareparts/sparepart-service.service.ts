import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from 'src/app/core/services/base-api.service';
import { DataService } from 'src/app/core/services/data.service';
import { environment } from 'src/environments/environment';
import { CacheService } from 'src/app/core/services/cache.service';

@Injectable({
  providedIn: 'root'
})
export class SparepartServiceService extends BaseApiService<any>{
  private baseUrl: any;
  constructor(protected dataService: DataService,
    private http: HttpClient,
    protected cache: CacheService) {
    super('spareparts', dataService, cache);
    this.baseUrl = environment.apiUrl;
  }
  GetSparePartsList(data: any): Observable<any> {
    return this.dataService.post<any>(`SpareParts/List`, data);
  }
  GetSparePartsBOMList(data: any): Observable<any> {
    return this.dataService.post<any>(`SpareParts/BOM/List`, data);
  }
  downloadExcel(data: any): Observable<any> {
    return this.http.post(this.baseUrl + `SpareParts/BOM/ExportToExcel`, data, { responseType: 'blob' });
    //return this.dataService.post<any>(`SpareParts/BOM/ExportToExcel`, data);
  }

}
