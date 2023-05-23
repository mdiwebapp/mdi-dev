import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../src/environments/environment';
import { BaseApiService, CacheService, DataService } from '../../../../../src/app/core/services';

@Injectable({
  providedIn: 'root'
})
export class PriceLookupService extends BaseApiService<any> {
  private baseUrl: any;

  constructor(
    protected dataService: DataService,
    protected cache: CacheService,
    private http: HttpClient
  ) { 
    super('price-lookup', dataService, cache);
    this.baseUrl = environment.apiUrl;
  }

  GetPriceLookupData(data: any) : Observable<any> {
    return this.http.post(this.baseUrl + 'PriceLookUp/GetPricelookUp',data);
  }
}
