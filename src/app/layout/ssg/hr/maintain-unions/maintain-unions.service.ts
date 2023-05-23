import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../../../../core/services/data.service';
import { CacheService } from '../../../../core/services/cache.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { BaseApiService } from '../../../../core/services/base-api.service';

@Injectable({
  providedIn: 'root'
})
export class MaintainUnionsService extends BaseApiService<any>{
  private baseUrl: any;
  constructor(protected dataService: DataService,
    protected cache: CacheService,
    private http: HttpClient) {
    super('MaintainUnion', dataService, cache);
    this.baseUrl = environment.apiUrl;
  }
  getHRUnionList(data: any): Observable<any> {
    return this.dataService.post<any>(`HRUnion/Lists`, data);
  }
  getLabourTypeList(): Observable<any> {
    return this.dataService.get<any>(`HRUnion/LabourType/Lists`);
  }
  getUnionDetails(id:any): Observable<any> {
    return this.dataService.get<any>(`HRUnion/Union/Details/`+id);
  }
  addHRUnion(data: any): Observable<any> {
    return this.dataService.post<any>(`HRUnion/Add`, data);
  }
  updateHRUnion(data: any): Observable<any> {
    return this.dataService.patch<any>(`HRUnion/Update`, data);
  }
  checkUnionCode(unionCode:any): Observable<any> {
    return this.dataService.get<any>(`HRUnion/CheckUnionCode/`+unionCode);
  }
}
