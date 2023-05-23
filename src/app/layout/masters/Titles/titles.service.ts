import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CacheService } from 'src/app/core/services/cache.service';
import { BaseApiService } from '../../../core/services/base-api.service';
import { DataService } from '../../../core/services/data.service';

@Injectable({
  providedIn: 'root',
})
export class TitlesService extends BaseApiService<TitlesService> {
  constructor(
    protected dataService: DataService,
    protected cache: CacheService
  ) {
    super('title', dataService, cache);
  }
  GetList(status: boolean): Observable<any> {
    return this.dataService.get<any>(`Employee/${status}/title`);
  }
  getDataByID(id: number): Observable<any> {
    return this.dataService.get<any>(`Employee/title/${id}`);
  }
  saveTitle(data: any): Observable<any> {
    return this.dataService.post<any>(`Employee/title`, data);
  }
  GetEmployeeList(status: boolean): Observable<any> {
    return this.dataService.get<any>(`Employee/GetList`);
  }  
  GetEEInfo(eeid: number): Observable<any> {
    return this.dataService.get<any>(`Employee/GetEEInfo/${eeid}`);
  }
  GetEEInfoDetails(eeid: number): Observable<any> {
    return this.dataService.get<any>(`Employee/GetEEInfoDetails/${eeid}`);
  }
  GetJobListingUsingEEBranch(branch: string): Observable<any> {
    return this.dataService.get<any>(`Employee/GetJobListUsingEEBranch/${branch}`);
  }
  GetLoadApproverForTitle(): Observable<any> {
    return this.dataService.get<any>(`Employee/GetLoadApproverForTitle`);
  }
  GetTimeApprovalOverride(): Observable<any> {
    return this.dataService.get<any>(`Employee/GetTimeApprovalOverride`);
  }
  GetTitleList(eeid: number): Observable<any> {
    return this.dataService.get<any>(`Employee/GetTitleList/${eeid}`);
  }
  updateTitle(data: any): Observable<any> {
    return this.dataService.post<any>(`Employee/UpdateTitleList`, data);
  }
  getEEInfoUsingJob(data: any): Observable<any> {
    return this.dataService.post<any>(`Employee/getEEInfoDetailsUsingJob`, data);

  }
}
