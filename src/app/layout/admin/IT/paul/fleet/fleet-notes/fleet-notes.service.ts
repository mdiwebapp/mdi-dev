import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from 'src/app/core/services/base-api.service';
import { CacheService } from 'src/app/core/services/cache.service';
import { DataService } from 'src/app/core/services/data.service';
import { FleetNotesModel } from './fleet-notes.model';
@Injectable({
  providedIn: 'root',
})
export class FleetNotesService extends BaseApiService<FleetNotesModel> {
  constructor(
    protected dataService: DataService,
    private http: HttpClient,
    protected cache: CacheService
  ) {
    super('vendor', dataService, cache);
  }
  GetNoteList(fleetId: number): Observable<any> {
    return this.dataService.get<any>(`Fleet/${fleetId}/Notes`);
  }

  GetNoteById(id: number): Observable<any> {
    return this.dataService.get<any>(`Fleet/Notes/${id}`);
  }

  public saveNote(data: any): Observable<any> {
    return this.dataService.post<any>(`Fleet/Notes`, data);
  }
}
