import { Injectable } from '@angular/core';
import { CacheService } from 'src/app/core/services/cache.service';
import { BaseApiService } from '../../../../core/services/base-api.service';
import { DataService } from '../../../../core/services/data.service';
import { VendorMoreInfoModel } from './vendor-more-info.model'
@Injectable({
  providedIn: 'root'
})
export class VendorMoreInfoService extends BaseApiService<VendorMoreInfoModel> {
  constructor(protected dataService: DataService, protected cache: CacheService) {
    super('vendor', dataService, cache);
  }
}