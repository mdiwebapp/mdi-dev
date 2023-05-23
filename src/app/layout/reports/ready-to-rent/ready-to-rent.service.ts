import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../src/environments/environment';
import {
  BaseApiService,
  CacheService,
  DataService,
} from '../../../../../src/app/core/services';

@Injectable({
  providedIn: 'root'
})
export class ReadyToRentService extends BaseApiService<any> {
  private baseUrl: any;

  constructor(
    protected dataService: DataService,
    protected cache: CacheService,
    private http: HttpClient
  ) { 
    super('ready-to-rent', dataService, cache);
    this.baseUrl = environment.apiUrl;
  }

  ExportReadytoReport(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'ReadyToRent/ExportToExcel/ReadyToRent', data, { responseType: 'blob' });
  }
}

