import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../src/environments/environment';
import { BaseApiService, CacheService, DataService } from '../../../../../src/app/core/services';
import { observableToBeFn } from 'rxjs/internal/testing/TestScheduler';
@Injectable({
  providedIn: 'root'
})
export class TimeClockService  extends BaseApiService<any> {
  private baseUrl: any;
  constructor(
    protected dataService: DataService,
    protected cache: CacheService,
    private http: HttpClient
  )
  {
    super('time-clock', dataService, cache);
    this.baseUrl = environment.apiUrl;
   }

   GetEmployeeHourDetail(data: any): Observable<any> {
    return this.http.get(this.baseUrl + `TimeClock/HoursDetails/${data}`);
   }

   GetPTODetailEmployeeNo(data: any): Observable<any> {
    // let queryParams = new HttpParams();
    // queryParams = queryParams.append("EmployeeNumber",data);
    // return this.http.get(this.baseUrl + `TimeClock/Employee/Details`,{params:queryParams});
    return this.http.get(this.baseUrl + `TimeClock/PTODetails/${data}`);
   }

   GetJobDetail(data: any): Observable<any> {
    return this.http.get(this.baseUrl + `TimeClock/JobDetails/${data}`);
   }

   PunchInEmployee(data: any) : Observable<any> {
    return this.http.put(this.baseUrl + 'TimeClock/PunchIn',data);
   }

   PunchOutEmployee(data: any): Observable<any> {
    return this.http.put(this.baseUrl + 'TimeClock/PunchOut',data);
   }

   ChangeJob(data: any): Observable<any> {
    return this.http.put(this.baseUrl + 'TimeClock/ChangeJob', data);
   }
}