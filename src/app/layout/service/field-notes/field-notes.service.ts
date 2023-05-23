import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../src/environments/environment';
import { BaseApiService, CacheService, DataService } from '../../../../../src/app/core/services';


@Injectable({
  providedIn: 'root'
})
export class FieldNotesService extends BaseApiService<any> {
  private baseUrl: any;

  constructor(
    protected dataService: DataService,
    protected cache: CacheService,
    private http: HttpClient
  ) 
  {
    super('field-notes', dataService, cache);
    this.baseUrl = environment.apiUrl;
   }

   AddFieldNotes(data:any) : Observable<any> {
    return this.http.post(this.baseUrl + 'FieldNotes/AddFieldNotes',data);
   }

   GetInventoryNumbers():Observable<any> {
    return this.http.get(this.baseUrl + 'FieldNotes/GetJobFieldNotes');
   }
}
