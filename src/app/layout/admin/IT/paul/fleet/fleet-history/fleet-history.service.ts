import { Injectable } from '@angular/core';
import { BaseApiService } from '../../../../../../core/services/base-api.service';
import { DataService } from '../../../../../../core/services/data.service';
import { FleetHistoryModel } from './fleet-history.model';
import { Observable } from 'rxjs';
import { CacheService } from 'src/app/core/services/cache.service';

@Injectable({
  providedIn: 'root',
})
export class FleetHistoryService extends BaseApiService<FleetHistoryModel> {
  constructor(
    protected dataService: DataService,
    protected cache: CacheService
  ) {
    super('fleet', dataService, cache);
  }

  GetHistoryByFleetId(InvNumber: number): Observable<any> {
    return this.dataService.get<any>(`Fleet/${InvNumber}/History`);
  }
}
