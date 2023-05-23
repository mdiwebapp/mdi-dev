import { Injectable } from '@angular/core';
import { BaseApiService } from '../../../../../../core/services/base-api.service';
import { DataService } from '../../../../../../core/services/data.service';
import { FleetActivityModel } from './fleet-activity.model';
import { Observable } from 'rxjs';
import { CacheService } from 'src/app/core/services/cache.service';

@Injectable({
  providedIn: 'root',
})
export class FleetActivityService extends BaseApiService<FleetActivityModel> {
  constructor(
    protected dataService: DataService,
    protected cache: CacheService
  ) {
    super('vendor', dataService, cache);
  }

  GetActivityList(invNumber: string): Observable<any> {
    return this.dataService.get<any>(`Fleet/${invNumber}/Activity`);
  }
  GetFleetHistory(InvNumber: string): Observable<any> {
    return this.dataService.get<any>(`Fleet/${InvNumber}/FleetHistory`);
  }
}
