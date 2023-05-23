import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CacheService } from 'src/app/core/services/cache.service';
import { BaseApiService } from '../../../../core/services/base-api.service';
import { DataService } from '../../../../core/services/data.service';
import { PermissionmoduleModel } from './permissionmodule.model';

@Injectable({
  providedIn: 'root'
})
export class PermissionmoduleService extends BaseApiService<PermissionmoduleModel> {
  constructor(protected dataService: DataService, protected cache: CacheService) {
    super('permission', dataService, cache);
  }


  GetList(): Observable<any> {
    return this.dataService.get<any>(`permission/PermissionDepartmentList`);
  }

  PermissionModuleList(): Observable<any> {
    return this.dataService.get<any>(`permission/PermissionModuleList`);
  }

  PermissionModuleTabList(): Observable<any> {
    return this.dataService.get<any>(`permission/PermissionModuleTabList`);
  }

  PermissionModuleListByDepartment(departmentId: any): Observable<any> {
    return this.dataService.get<any>(`permission/PermissionModuleList/${departmentId}`);
  }


  PermissionType(): Observable<any> {
    return this.dataService.get<any>(`permission/PermissionType`);
  }

  PermissionModuleMapping(tabId: any): Observable<any> {
    return this.dataService.get<any>(`permission/PermissionModuleMapping/${tabId}`);
  }

  SaveDepartment(data: any) {
    return this.dataService.put<any>('permission/PermissionDepartment', data)
  }

  SaveModule(data: any) {
    return this.dataService.put<any>('permission/PermissionModule', data)
  }

  SaveModuleTab(data: any) {
    return this.dataService.put<any>('permission/PermissionModuleTab', data)
  }

  SavePermissionModuleMapping(data: any) {
    return this.dataService.put<any>('permission/PermissionModuleMapping', data)
  }
}
