import { Injectable } from '@angular/core';
import { DataService } from '../../../../core/services/data.service';
import { BaseApiService } from '../../../../core/services/base-api.service';
import { EmployeeWorkInfoViewModel } from '../employee-moreinfo/employee-moreinfo.model';
import { Observable } from 'rxjs';
import { CacheService } from 'src/app/core/services/cache.service';


@Injectable({
  providedIn: 'root'
})
export class EmployeeWorkService extends BaseApiService<EmployeeWorkInfoViewModel>{

  constructor(protected dataService: DataService, protected cache: CacheService) {
    super('employee', dataService, cache);
  }

  SaveWorkInfo(data: any) {
    return this.dataService.put<any>('Employee/WorkInfo', data)
  }
  GetBranchList(status: boolean): Observable<any> {
    return this.dataService.get<any>(`Branch/List/${status}`);
  }
}
