import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../src/environments/environment';
import { BaseApiService, CacheService, DataService } from '../../../../../../src/app/core/services';

@Injectable({
  providedIn: 'root'
})
export class CallLogService extends BaseApiService<any> {
  private baseUrl: any;


  constructor(
    protected dataService: DataService,
    protected cache: CacheService,
    private http: HttpClient
  ) { 
    super('call-log', dataService, cache);
    this.baseUrl = environment.apiUrl;
  }

  GetMDIRepDropdown():Observable<any> {
    return this.http.get(this.baseUrl + 'DropDown/Representative/Employees');
  }

  GetMDIBranchList(): Observable<any> {
    return this.http.get(this.baseUrl + 'DropDown/Branches');
  }

  GetCustomerList():Observable<any> {
    return this.http.post(this.baseUrl + 'DropDown/Customers',{});
  }

  GetCustomerTypes(data: any): Observable<any> {
    return this.http.get(this.baseUrl + `DropDown/lookups/${data}`);
  }

  GetStateList(data: any): Observable<any> {
    return this.http.get(this.baseUrl + `DropDown/lookups/${data}`)
  }

  GetExistingContactName(data): Observable<any> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("customerid",data);
    return this.http.get(this.baseUrl + 'DropDown/ContactName',{params:queryParams});
    // return this.http.get(this.baseUrl + `DropDown/ContactName/${data}`)
  }

  GetContactReasonList(data: any) : Observable<any> {
    return this.http.get(this.baseUrl + `DropDown/lookups/${data}`)
  }

  GetJobNumberList(data: any) : Observable<any> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("branch",data);
    return this.http.get(this.baseUrl + 'DropDown/JobName',{params:queryParams});
    // return this.http.get(this.baseUrl + 'DropDown/JobName')
  }

  GetCustomerData(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'DropDown/Customers',data);
  }

  GetCustomerDetail(data: any): Observable<any> {
    return this.http.get(this.baseUrl + `Customer/${data}`)
  }

  GetContactDetails(data: any): Observable<any> {
    return this.http.get(this.baseUrl + `Customer/Contact/${data}`)
  }

  SaveCallLogDetail(data: any): Observable<any> {
    // let queryParams = new HttpParams();
    // queryParams = queryParams.append("model",data);
    // return this.http.post(this.baseUrl + `CRM/CallLog/Save`,{params:queryParams})
    return this.http.put(this.baseUrl + `CRM/CallLog/Save`,data);
  }
  exportToExcel(data: any): Observable<any> {
    return this.http.post(this.baseUrl + `CRM/PringJobGrid/ExportToExcel`, data, {
      responseType: 'blob',
    });
  }
  getOneById(id: number): Observable<any> {
    return this.http.get(this.baseUrl + `user/${id}`)
  }

  getCallLogById(id: string): Observable<any> {
    return this.http.get(this.baseUrl + `Customer/CRMCallLogDetails/${id}`)
  }
}
