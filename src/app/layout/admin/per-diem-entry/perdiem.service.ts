import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService, CacheService, DataService } from 'src/app/core/services';
import { environment } from '../../../../../src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class PerdiemService extends BaseApiService<any>{
  private baseUrl: any;
  constructor(
    protected dataService: DataService,
    protected cache: CacheService,
    private http: HttpClient
  ) {
    super('perdiem', dataService, cache);
    this.baseUrl = environment.apiUrl;
  }
  GetExportData(data: any): Observable<any> {
    return this.http.post(this.baseUrl + `PerDiem/ExportToExcelPerDiemGridView`,data, { responseType: 'blob' });
    //return this.dataService.post<any>(`PerDiem/ExportToExcelPerDiemGridView`, data);
  }
  SavePerdiem(data: any): Observable<any> {
    return this.dataService.post<any>(`PerDiem`, data);
  }
  GetJobList(): Observable<any> {
    return this.dataService.get<any>(`PerDiem/GetJobList`);
  }
}
