import { Injectable } from '@angular/core';
import { BaseApiService } from '../../../../core/services/base-api.service';
import { CustomerModel } from './Customer.model';
import { DataService } from '../../../../core/services/data.service';
import { Observable } from 'rxjs';
import { CacheService } from 'src/app/core/services/cache.service';

@Injectable({
  providedIn: 'root',
})
export class CustomerService extends BaseApiService<CustomerModel> {
  constructor(
    protected dataService: DataService,
    protected cache: CacheService
  ) {
    super('customer', dataService, cache);
  }

  GetList(data: any): Observable<any> {
    return this.dataService.get<any>(
      `customer?branch=${data.branch}&accountManagerEmpId=${data.accountManagerEmpId}&collection=${data.collection}&customerType=${data.customerType}&status=${data.status}`
    );
  }
  GetBranchList(status: boolean): Observable<any> {
    return this.dataService.get<any>(`Branch/List/${status}`);
  }
  GetEmployeeList(): Observable<any> {
    return this.dataService.get<any>(`User/AccountManagers`);
  }

  GetHistoryByCustomerId(CustomerId): Observable<any> {
    return this.dataService.get<any>(`customer/${CustomerId}/history`);
  }

  GetActivityByCustomerId(CustomerId): Observable<any> {
    return this.dataService.get<any>(`customer/${CustomerId}/activities`);
  }
}
