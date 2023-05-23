import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../../../core/services/data.service';
import { CacheService } from '../../../core/services/cache.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { BaseApiService } from '../../../core/services/base-api.service';
@Injectable({
    providedIn: 'root',
  })
  export class ForecastService extends BaseApiService<any>
  {
    private baseUrl: any;
    constructor(
      protected dataService: DataService,
      protected cache: CacheService,
      private http: HttpClient
    ) {
      super('purchasing', dataService, cache);
      this.baseUrl = environment.apiUrl;
    }
    getAMForecastList(data: any): Observable<any> {
        return this.dataService.post<any>(`Forecast/List`, data);
      }
    addForecastList(data:any):Promise<any>{
      return this.dataService.put<any>(`Forecast/AddUpdate`,data).toPromise();
    }
    checkExistingRecordInForecast(data:any):Observable<any>{
      return this.dataService.post<any>(`Forecast/CheckExist`,data);
    }
    deleteRecordInForecast(data:any):Observable<any>{
      return this.dataService.post<any>(`Forecast/Delete`,data);
    }
    getForecastTotal(data:any):Observable<any>{
      return this.dataService.post<any>(`Forecast/Total`,data);
    }
  }