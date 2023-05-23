import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../src/environments/environment';
import {
  BaseApiService,
  CacheService,
  DataService,
} from '../../../../../src/app/core/services';

@Injectable({
  providedIn: 'root',
})
export class PipelineCorrectService extends BaseApiService<any> {
  private baseUrl: any;

  constructor(
    protected dataService: DataService,
    protected cache: CacheService,
    private http: HttpClient
  ) {
    super('pipeline-correct', dataService, cache);
    this.baseUrl = environment.apiUrl;
  }

  GetPipelineCorrectData(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'PipeLineCorrection/List', data);
  }

  CloseJob(data: any): Observable<any> {
    // return this.http.patch(this.baseUrl + 'PipeLineCorrection/Update',data);
    return this.dataService.patch<any>('PipeLineCorrection/Update', data);
  }

  ExporttoExcel(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'PipeLineCorrection/ExportToExcel',data,{responseType:'blob'})
  }

  ChangePipelineCorrectDetail(data: any): Observable<any> {
    return this.http.patch(this.baseUrl + 'PipeLineCorrection/Save',data);
  }
}
