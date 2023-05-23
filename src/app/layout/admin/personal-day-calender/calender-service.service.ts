import { Injectable } from '@angular/core';
import { DataService } from '../../../core/services/data.service';
import { BaseApiService } from '../../../core/services/base-api.service';
import { Observable } from 'rxjs';
import { CacheService } from 'src/app/core/services/cache.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class CalenderServiceService extends BaseApiService<any> {
  private baseUrl: any;
  constructor(
    protected dataService: DataService, private http: HttpClient,
    protected cache: CacheService) { super('calender', dataService, cache); this.baseUrl = environment.apiUrl; }

  GetList(request: any): Observable<any> {
    return this.dataService.post<any>(`EmployeeCalendar/List`, request);
  }
  AddActivity(request: any): Observable<any> {
    return this.dataService.post<any>(`EmployeeCalendar/Add`, request);
  }
  DeleteActivity(request: any): Observable<any> {
    return this.dataService.post<any>(`EmployeeCalendar/Delete`, request);
    // return this.http.delete<any>(`${this.baseUrl}EmployeeCalendar/Delete`, {
    //   params: request
    // });
  }
  GetPerosnalDayList(request: any): Observable<any> {
    return this.dataService.post<any>(`EmployeeCalendar/PersonalDay`, request);
  }
}
