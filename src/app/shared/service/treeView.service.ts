import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../../core/services/data.service';
import { CacheService } from '../../core/services/cache.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BaseApiService } from '../../core/services/base-api.service';
@Injectable({
  providedIn: 'root',
})
export class TreeViewService extends BaseApiService<any> {
  private baseUrl: any;
  constructor(
    protected dataService: DataService,
    protected cache: CacheService,
    private http: HttpClient
  ) {
    super('TreeViewService', dataService, cache);
    this.baseUrl = environment.apiUrl;
  }

  getTreeViewList(UtilityId: number, UtilityType: string): Observable<any> {
    return this.dataService.get<any>(
      `TreeView/TreeViewList/${UtilityId}/${UtilityType}`
    );
  }

  getExtensionList(): Observable<any> {
    return this.http.get(this.baseUrl + 'FileExtension/List');
  }

  AddExtension(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'FileExtension/Add', data);
  }

  DeleteExtension(data: any): Observable<any> {
    return this.http.post(
      this.baseUrl + 'FileExtension/DeleteFileExtension/' + data,
      data
    );
  }
}
