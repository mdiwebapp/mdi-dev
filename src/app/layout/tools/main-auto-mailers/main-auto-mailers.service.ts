import { HttpClient, HttpParams } from '@angular/common/http';
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
export class MainAutoMailersService extends BaseApiService<any> {
  private baseUrl: any;

  constructor(
    protected dataService: DataService,
    protected cache: CacheService,
    private http: HttpClient
  ) 
  { 
    super('main-auto-mailers', dataService, cache);
    this.baseUrl = environment.apiUrl;
  }

  GetMainAutoMailersITData(): Observable<any> {
    return this.http.get(this.baseUrl + 'AutoMailers/AutoMailerLists');
  }

  AddUpdateAutoMailer(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'AutoMailers/AutoMailer/AddUpdate',data);
  }

  GetReportList(data: any): Observable<any> {
    return this.http.get(this.baseUrl + `AutoMailers/ReportLists/${data}`);
  }

  GetToandCCList(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'AutoMailers/CClists',data);
  }

  GetBranchList(): Observable<any> {
    return this.http.get(this.baseUrl + 'DropDown/Branches');
  }

  GetAutoMailerEmployeeList(data:any): Observable<any> {
    return this.http.get(this.baseUrl + `AutoMailers/AutoMailerEmployees/${data}`);
  }

  ReplaceAllAutoMailer(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'AutoMailers/ReplaceAll',data);
  }

  GetMainAutoMailerData(data: any):Observable<any> {
    return this.http.post(this.baseUrl + 'AutoMailers/Lists',data);
  }

  AddEmailData(data:any): Observable<any> {
    return this.http.post(this.baseUrl + 'AutoMailers/AddEmail',data);
  }

  RemoveEmailData(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'AutoMailers/RemoveEmail',data);
  }

  SetAllBranchRecipient(data: any):Observable<any> {
    return this.http.post(this.baseUrl + 'AutoMailers/SetAllBranches',data);
  }
}
