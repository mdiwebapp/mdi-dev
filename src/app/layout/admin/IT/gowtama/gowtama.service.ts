import { Injectable } from '@angular/core';
import { GowtamaModel } from '../gowtama/gowtama.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BaseApiService } from 'src/app/core/services/base-api.service';
import { DataService } from 'src/app/core/services/data.service';
import { CacheService } from 'src/app/core/services/cache.service';

@Injectable({
  providedIn: 'root'
})
export class GowtamaService extends BaseApiService<GowtamaModel> {
  private baseUrl: any;
  constructor(protected dataService: DataService, private http: HttpClient, protected cache: CacheService) {

    super('transfer', dataService, cache);
    this.baseUrl = environment.apiUrl
  }

  GetList(status: boolean): Observable<any> {
    return this.dataService.get<any>(`Transfer/List/${status}`);
  }

  GetById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}Transfer/${id}`, { headers: { hideLoader: 'false' } });
  }
}
