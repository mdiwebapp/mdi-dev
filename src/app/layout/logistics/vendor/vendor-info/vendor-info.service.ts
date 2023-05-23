import { Injectable } from '@angular/core';
import { BaseApiService } from '../../../../core/services/base-api.service';
import { DataService } from '../../../../core/services/data.service';
import { VendorInfoModel } from './vendor-info.model'
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CacheService } from 'src/app/core/services/cache.service';

@Injectable({
  providedIn: 'root'
})
export class VendorInfoService extends BaseApiService<VendorInfoModel> {
  private baseUrl: any;
  constructor(protected dataService: DataService, private http: HttpClient, protected cache: CacheService) {
    super('vendor', dataService, cache);
    this.baseUrl = environment.apiUrl;
  }
  checkPhone(phone: string): Observable<any> {
    return this.dataService.get<any>(`vendor/checkphone/` + phone);
  }
  AddVenodrData(data: any): Observable<any> {
    return this.dataService.post<any>(`Vendor/Add`, data);
  }
  UpdateVenodrData(data: any): Observable<any> {
    return this.dataService.patch<any>(`Vendor/Update`, data);
  }
}