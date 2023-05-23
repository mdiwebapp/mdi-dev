import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CacheService } from 'src/app/core/services/cache.service';
import { BaseApiService } from '../../../../core/services/base-api.service';
import { DataService } from '../../../../core/services/data.service';
import { CustomerInfoModel } from './customer-info.model';

@Injectable({
  providedIn: 'root',
})
export class CustomerInfoService extends BaseApiService<CustomerInfoModel> {
  constructor(
    protected dataService: DataService,
    protected cache: CacheService
  ) {
    super('customer', dataService, cache);
  }
  GetBranchList(status: boolean): Observable<any> {
    return this.dataService.get<any>(`Branch/List/${status}`);
  }
  GetEmployeeList(): Observable<any> {
    return this.dataService.get<any>(`User/AccountManagers`);
  }
}
