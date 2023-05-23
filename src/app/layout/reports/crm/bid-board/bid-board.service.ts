import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../../../../../src/app/core/services/base-api.service';
import { CacheService } from '../../../../../../src/app/core/services/cache.service';
import { DataService } from '../../../../../../src/app/core/services/data.service';
import { environment } from '../../../../../../src/environments/environment';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class BidBoardService extends BaseApiService<any> {
  private baseUrl: any;
  constructor(
    protected dataService: DataService,
    protected cache: CacheService,
    private http: HttpClient
  ) {
    super('bidBoard', dataService, cache);
    this.baseUrl = environment.apiUrl;
  }

  GetBidBoardDetails(data: any): Observable<any> {
    return this.dataService.post<any>(`BidBoard/GetBidBoardDetails`,data);
  }
  

}
