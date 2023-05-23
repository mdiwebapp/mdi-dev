import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../src/environments/environment';
import { BaseApiService, CacheService, DataService } from '../../../../../src/app/core/services';

@Injectable({
  providedIn: 'root'
})
export class FieldFailureService extends BaseApiService<any> {
  private baseUrl: any;

  constructor(protected dataService: DataService,
    protected cache: CacheService,
    private http: HttpClient) 
    { 
      super('field-failure', dataService, cache);
    this.baseUrl = environment.apiUrl;
  }

  GetFieldFailureData(data: any) : Observable<any> {
    return this.http.post(this.baseUrl + 'FieldFailure/Lists',data);
  }

  GetFieldFailureDetail(data: any): Observable<any> {
    return this.http.get(
      this.baseUrl + 'FieldFailure/Details/' + data
    );
  }

  GetProjectData(data): Observable<any> {
    return this.http.get(
      this.baseUrl + 'DropDown/FieldFailure/Project/' + data
    );
  }

  GetInvnumberData(data: any): Observable<any> {
    return this.http.post(
      this.baseUrl + 'DropDown/FieldFailure/InvNumber',data
    );
  }

  GeAccountManagerData(data: any): Observable<any> {
    return this.http.get(
      this.baseUrl + 'DropDown/AMByBranch/' + data
    );
  }

  GetPhotographsTakenByData(): Observable<any> {
    return this.http.get(
      this.baseUrl + 'DropDown/employees'
    );
  }

  AddFieldFailureDetail(data: any): Observable<any> {
    return this.http.post(
      this.baseUrl + 'FieldFailure/Add',data
    );
  }

  UpdateFieldFailureDetail(data: any): Observable<any> {
    return this.http.post(
      this.baseUrl + 'FieldFailure/Update',data
    );
  }
}
