import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CacheService } from 'src/app/core/services/cache.service';
import { BaseApiService } from '../../../../core/services/base-api.service';
import { DataService } from '../../../../core/services/data.service';
import { EmployeeModel } from './employee.model'
@Injectable({
  providedIn: 'root'
})
export class EmployeeService extends BaseApiService<EmployeeModel> {
  constructor(protected dataService: DataService, protected cache: CacheService) {
    super('employee', dataService, cache);
  }

  // GetList(status: boolean): Observable<any> {
  //   return this.dataService.get<any>(`employee/GetList/${status}`);
  // }

  GetUniqueListFromUser(): Observable<any> {
    return this.dataService.get<any>(`employee/GetUniqueListFromUser`);
  }

  GetHistory(EmployeeId): Observable<any> {
    return this.dataService.get<any>(`employee/${EmployeeId}/history`);
  }

  GetActivity(EmployeeId): Observable<any> {
    return this.dataService.get<any>(`employee/GetEmployeeActivity/${EmployeeId}`);
  }
  GetEmployeeActivity(EmployeeId): Observable<any> {
    return this.dataService.get<any>(`TimeClock/PTODetails/${EmployeeId}`);
  }
  GetOtherGridActivity(EmployeeId): Observable<any> {
    return this.dataService.get<any>(`Employee/GetEmployeeActivityOtherGrid/${EmployeeId}`);
  }
  GetList(data: any): Observable<any> {
    return this.dataService.post<any>(`employee/List`, data);
  }

}
