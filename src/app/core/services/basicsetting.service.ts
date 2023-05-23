import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { BasicsettingModel, SavedGridColumnAddUpdateRequestModel, SavedMenuAddRequestModel } from '../models/basicsetting.model'
import { DataService } from './data.service';
import { Observable } from 'rxjs';
import { CacheService } from './cache.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BasicsettingService extends BaseApiService<BasicsettingModel> {
  private baseUrl: any;
  constructor(protected dataService: DataService, protected cache: CacheService,private http: HttpClient) {
    super('setting', dataService, cache);
    this.baseUrl = environment.apiUrl
  }

  GetSavedMenuList(id): Observable<any> {
    return this.dataService.get<any>(`setting/menus`);
  }

  AddSavedMenu(data: SavedMenuAddRequestModel): Observable<any> {
    return this.dataService.post<any>(`setting/menu`, data);
  }
  DeleteMenu(subMenuId: any): Observable<any> {
    return this.dataService.delete<any>(`setting/menu`, subMenuId);
  }
  GetGridColumnsByModule(module: string): Observable<string> {
    return this.dataService.get<string>(`setting/Grid/${module}`);
  }

  AddUpdateSaveGridColumn(data: SavedGridColumnAddUpdateRequestModel): Observable<any> {
    return this.dataService.put<any>(`setting/Grid`, data);
  }
  downloadScheduleBoard(barnch:string): Observable<any> {
    return this.http.get(this.baseUrl + `TreeView/UtilityPath/167/ScheduleBoardPath`+barnch);
  }
  downloadWarrantyLog(): Observable<any> {
    return this.dataService.get<string>(`TreeView/UtilityPath/741/WarrantyLog`);
    //return this.http.get(this.baseUrl + `TreeView/UtilityPath/741/WarrantyLog`);
  }
}