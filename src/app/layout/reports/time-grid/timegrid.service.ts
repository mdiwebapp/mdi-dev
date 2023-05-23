import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService, CacheService, DataService } from 'src/app/core/services';
import { environment } from '../../../../../src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TimegridService extends BaseApiService<any>{
  private baseUrl: any;
  constructor(protected dataService: DataService, protected cache: CacheService) {
    super('timeapproval', dataService, cache);
    this.baseUrl = environment.apiUrl;
  }
  GetTimeGridData(data: any): Observable<any> {
    return this.dataService.post<any>(`TimeGrid/GetTimeGridPunch`, data);
  }
}
