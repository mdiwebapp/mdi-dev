import { Injectable } from '@angular/core';
import { DataService } from '../../../core/services/data.service';
import { BaseApiService } from '../../../core/services/base-api.service';
import { UserModel } from './user.model';
import { Observable } from 'rxjs';
import { CacheService } from 'src/app/core/services/cache.service';
@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseApiService<UserModel> {
  constructor(
    protected dataService: DataService,
    protected cache: CacheService
  ) {
    super('user', dataService, cache);
  }
  GetList(request: any): Observable<any> {
    return this.dataService.post<any>(`user/GetList`, request);
  }

  AddUser(data: UserModel): Observable<any> {
    return this.dataService.post<any>(`User`, data);
  }
  CheckUser(data: any): Observable<any> {
    return this.dataService.get<any>(`user/unique/userId/${data}`);
  }
}
