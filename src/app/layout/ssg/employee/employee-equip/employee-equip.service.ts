import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { DataService } from '../../../../core/services/data.service';
import { BaseApiService } from '../../../../core/services/base-api.service';
import { CacheService } from 'src/app/core/services/cache.service';
@Injectable({
  providedIn: 'root'
})
export class EmployeeEquipService extends BaseApiService<any> {
  constructor(protected dataService: DataService, protected cache: CacheService) {
    super('employee', dataService, cache);
  }

  GetEquipment(EmployeeId): Observable<any> {
    return this.dataService.get<any>(`employee/GetEmployeeEquipment/${EmployeeId}`);
  }

  SaveEquipList(data): Observable<any> {
    return this.dataService.put<any>(`employee/EmployeeEquipment`, data);
  }
}