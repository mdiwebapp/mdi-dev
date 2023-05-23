
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../../../core/services/data.service';
import { CacheService } from '../../../core/services/cache.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { BaseApiService } from '../../../core/services/base-api.service';

@Injectable({
  providedIn: 'root'
})
export class DocSearchService extends BaseApiService<any>{
  private baseUrl: any;

  constructor( protected dataService: DataService,
    protected cache: CacheService,
    private http: HttpClient) {super('buildingRequests', dataService, cache);
    this.baseUrl = environment.apiUrl; }
    getList(data:any): Observable<any> {
      return this.dataService.post<any>(`DocSearch/GetDocSearch`, data);
    }
}
