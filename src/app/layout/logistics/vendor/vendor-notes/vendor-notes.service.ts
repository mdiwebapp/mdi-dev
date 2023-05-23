import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from 'src/app/core/services/base-api.service';
import { CacheService } from 'src/app/core/services/cache.service';
import { DataService } from 'src/app/core/services/data.service';
import { VendorNotesModel } from './vendor-notes.model';
@Injectable({
  providedIn: 'root'
})
export class VendorNotesService extends BaseApiService<VendorNotesModel> {
  constructor(protected dataService: DataService, private http: HttpClient, protected cache: CacheService) {
    super('vendor', dataService, cache);
  }
  GetNoteList(venderId: number): Observable<any> {
    return this.dataService.get<any>(`vendor/${venderId}/Notes`);
  }

  GetNoteById(id: number): Observable<any> {
    return this.dataService.get<any>(`vendor/Notes/${id}`);
  }

  public saveNote(data: any): Observable<any> {
    return this.dataService.post<any>(`vendor/Notes`, data);
  }
}
