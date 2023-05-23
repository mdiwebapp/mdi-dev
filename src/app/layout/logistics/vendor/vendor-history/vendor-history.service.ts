import { Injectable } from '@angular/core';
import { BaseApiService } from '../../../../core/services/base-api.service';
import { DataService } from '../../../../core/services/data.service';
import { VendorHistoryModel } from './vendor-history.model';
import { Observable } from 'rxjs';
import { CacheService } from 'src/app/core/services/cache.service';

@Injectable({
  providedIn: 'root',
})
export class VendorHistoryService extends BaseApiService<VendorHistoryModel> {
  constructor(protected dataService: DataService, protected cache: CacheService) {
    super('vendor', dataService, cache);
  }

  GetHistoryByVendorId(vendorId: number): Observable<any> {
    return this.dataService.get<any>(`vendor/${vendorId}/history`);
  }
}
