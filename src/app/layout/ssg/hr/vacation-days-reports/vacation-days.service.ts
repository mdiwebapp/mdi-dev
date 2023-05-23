import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../../../../core/services/data.service';
import { CacheService } from '../../../../core/services/cache.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { BaseApiService } from '../../../../core/services/base-api.service';

@Injectable({
  providedIn: 'root'
})
export class VacationDaysService extends BaseApiService<any>{
  private baseUrl: any;
  constructor(protected dataService: DataService,
    protected cache: CacheService,
    private http: HttpClient) {
    super('VacationDays', dataService, cache);
    this.baseUrl = environment.apiUrl;
  }
   
  getDataList(data:any): Observable<any> {
    return this.http.post(
      this.baseUrl + `VacationDays/ExportToExcelVacationDay`,data,
      { responseType: 'blob' }
    );
    //return this.dataService.post<any>(`VacationDays/ExportToExcelVacationDay`,data);
  }
}
