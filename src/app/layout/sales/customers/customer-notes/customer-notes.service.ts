import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CacheService } from 'src/app/core/services/cache.service';
import { BaseApiService } from '../../../../core/services/base-api.service';
import { DataService } from '../../../../core/services/data.service';
import { CustomerNotesModel } from './customer-notes.model';


@Injectable({
  providedIn: 'root'
})
export class CustomerNotesService extends BaseApiService<CustomerNotesModel> {
  constructor(protected dataService: DataService, protected cache: CacheService) {
    super('customer', dataService, cache);
  }
  GetNoteList(employeeId: number): Observable<any> {
    return this.dataService.get<any>(`customer/${employeeId}/Notes`);
  }

  GetNoteById(id: number): Observable<any> {
    return this.dataService.get<any>(`customer/Note/${id}`);
  }

  public saveNote(data: any): Observable<any> {
    return this.dataService.post<any>(`customer/Note`, data);
  }
}