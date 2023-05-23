import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../src/environments/environment';
import { BaseApiService, CacheService, DataService } from '../../../../../src/app/core/services'


@Injectable({
  providedIn: 'root'
})
export class SafetyService extends BaseApiService<any>  {
  private baseUrl: any;

  constructor(
    protected dataService: DataService,
    protected cache: CacheService,
    private http: HttpClient
  ) {
    super('safety', dataService, cache);
    this.baseUrl = environment.apiUrl;
   }

   DownloadSafetyFile(data: any) : Observable<any> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("path",data);
    return this.http.get(this.baseUrl + 'NetworkDirectory/DownloadFile',{params:queryParams, responseType:'blob'});
    //  return this.http.get(
    //   this.baseUrl + 'NetworkDirectory/DownloadFile/' + data,
    //   {
    //     responseType: 'blob',
    //   }
    // );;
  }
}
