import { Injectable } from '@angular/core';
import { DataService } from '../../../../core/services/data.service';
import { BaseApiService } from '../../../../core/services/base-api.service';
import { VendorActivityModel } from './vendor-activity.model';
import { CacheService } from 'src/app/core/services/cache.service';
@Injectable({
  providedIn: 'root'
})
export class VendorActivityService extends BaseApiService<VendorActivityModel> {
  constructor(protected dataService: DataService, protected cache: CacheService) {
    super('vendor', dataService, cache);
  }
}
