import { Injectable } from '@angular/core';
import { DataService } from '../../../core/services/data.service';
import { BaseApiService } from '../../../core/services/base-api.service';
import { BranchModel } from './branch.model';
import { Observable } from 'rxjs';
import { UtilityService } from '../../../core/services/utility.service';
import { CacheService } from 'src/app/core/services/cache.service';
@Injectable({
  providedIn: 'root',
})
export class BranchService extends BaseApiService<BranchModel> {
  constructor(
    protected dataService: DataService,
    public utils: UtilityService,
    protected cache: CacheService
  ) {
    super('branch', dataService, cache);
  }

  GetList(status: boolean): Observable<any> {
    return this.dataService.get<any>(`Branch/List/${status}`);
  }

  GetBranchDropdown(): Observable<any> {
    return this.dataService.get<any>(`DropDown/branches`);
  }

  AddLookupCompany(data): Observable<any> {
    return this.dataService.post<any>(`Lookup`, data);
  }

  GetLocationDropdown(): Observable<any> {
    return this.dataService.get<any>(`DropDown/Location`);
  }
}
