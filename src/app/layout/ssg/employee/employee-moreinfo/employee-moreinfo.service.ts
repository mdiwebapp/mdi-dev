import { Injectable } from '@angular/core';
import { DataService } from '../../../../core/services/data.service';
import { BaseApiService } from '../../../../core/services/base-api.service';
import { EmployeeMoreInfoModel } from './employee-moreinfo.model';
import { CacheService } from 'src/app/core/services/cache.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeMoreinfoService extends BaseApiService<EmployeeMoreInfoModel>{

  constructor(protected dataService: DataService, protected cache: CacheService) {
    super('employee', dataService, cache);
  }
}
