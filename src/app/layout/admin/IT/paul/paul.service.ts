/*
import { Injectable } from '@angular/core';
import { DataService } from '../../../../core/services/data.service';
import { BaseApiService } from '../../../../core/services/base-api.service';
import { PaulModel } from "./paul.model"
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class PaulService extends BaseApiService<PaulModel> {
  constructor(protected dataService: DataService, protected cache: CacheService) {
  constructor(protected dataService: dataService) {
    super('branch', dataService,cache);
  }

  GetList(status: boolean): Observable<any> {
    return this.dataService.get<any>(`Branch/List/${status}`);
  }

  GetBranchDropdown(): Observable<any> {
    return this.dataService.get<any>(`DropDown/branches`);
  }

  AddLookupCompany(data):Observable<any>{
    return this.dataService.post<any>(`Lookup`,data);
  }
  
  
}
*/
