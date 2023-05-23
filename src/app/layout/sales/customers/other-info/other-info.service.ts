import { Injectable } from '@angular/core';
import { OtherInfoModel } from './other-info.model';
import { DataService } from '../../../../core/services/data.service';
import { BaseApiService } from '../../../../core/services/base-api.service';
import { Observable } from 'rxjs';
import { CacheService } from 'src/app/core/services/cache.service';

@Injectable({
  providedIn: 'root'
})
export class OtherInfoService extends BaseApiService<OtherInfoModel> {
  constructor(protected dataService: DataService, protected cache: CacheService) {
    super('customer', dataService, cache);
  }


}
