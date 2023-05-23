import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CacheService } from 'src/app/core/services/cache.service';
import { BaseApiService } from '../../../core/services/base-api.service';
import { DataService } from '../../../core/services/data.service';
import { Permission } from './userpermission.model';
@Injectable({
  providedIn: 'root',
})
export class UserPermissionService extends BaseApiService<Permission> {
  constructor(
    protected dataService: DataService,
    private http: HttpClient,
    protected cache: CacheService
  ) {
    super('Permission', dataService, cache);
  }
  GetList(request: any): Observable<any> {
    return this.dataService.post<any>(`Permission/Users`, request);
  }
  GetMenuList(userId: number): Observable<any> {
    return this.dataService.get<any>(`Permission/Departments/${userId}`);
  }
  GetDepartmentModules(userid: string, DepartmentName): Observable<any> {
    return this.dataService.get<any>(`Permission/${userid}/${DepartmentName}`);
  }
}
