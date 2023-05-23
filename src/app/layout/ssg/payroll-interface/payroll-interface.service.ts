import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService, CacheService, DataService } from 'src/app/core/services';
import { environment } from '../../../../../src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class PayrollInterfaceService extends BaseApiService<any> {
  private baseUrl: any;
  constructor(protected dataService: DataService,
    protected cache: CacheService,
    private http: HttpClient) {
    super('timeapproval', dataService, cache);
    this.baseUrl = environment.apiUrl;
  }

  GetPayrollInterfaceList(data: any): Observable<any> {
    return this.dataService.post<any>(`PayrollInterface/GetPayrollInterfaceEE`, data);
  }
  GetPayrollInterfaceTime(data: any): Observable<any> {
    return this.dataService.post<any>(`PayrollInterface/GetPayrollInterfaceTime`, data);
  }
  GetPayrollInterfaceExceptionReport(data: any): Observable<any> {
    return this.dataService.post<any>(`PayrollInterface/GetPayrollInterfaceExceptionReport`, data);
  }
  GetPayrollInterfaceGrTime(data: any): Observable<any> {
    return this.dataService.post<any>(`PayrollInterface/GetPayrollInterfaceGrTime`, data);
  }
  PayrollInterfaceCreateInterfaceFiles(data: any): Observable<any> {
    //return this.http.post(this.baseUrl + `PayrollInterface/PayrollInterfaceCreateInterfaceFiles`,data, { responseType: 'blob' });
    return this.dataService.post<any>(`PayrollInterface/PayrollInterfaceCreateInterfaceFiles`, data);
  }
}

