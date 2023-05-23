import { Injectable } from '@angular/core';
import { DataService } from '../../../core/services/data.service';
import { BaseApiService } from '../../../core/services/base-api.service';
import { NetworkDirectoryModel } from './networkdirectory.model';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { environment } from './../../../../../src/environments/environment';
import { CacheService } from 'src/app/core/services/cache.service';

@Injectable({
  providedIn: 'root',
})
export class NetworkDirectoryService extends BaseApiService<NetworkDirectoryModel> {
  private baseUrl: any;
  constructor(protected dataService: DataService, private http: HttpClient, protected cache: CacheService) {
    super('network directory', dataService, cache);
    this.baseUrl = environment.apiUrl;
  }

  GetDirectoryDetails(data: any): Observable<any> {
    return this.dataService.post<any>(
      `NetworkDirectory/RetriveDirectories`,
      data
    );
  }

  DownloadFile(path: any): Observable<any> {
    return this.http.get(
      this.baseUrl + 'NetworkDirectory/DownloadFile/' + path,
      {
        responseType: 'blob',
      }
    );
  }
}
