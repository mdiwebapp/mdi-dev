import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from 'src/app/core/services/base-api.service';
import { CacheService } from 'src/app/core/services/cache.service';
import { DataService } from 'src/app/core/services/data.service';
import { EmployeenotesModel } from './employeenotes.model';
@Injectable({
  providedIn: 'root'
})
export class EmployeenotesService extends BaseApiService<EmployeenotesModel> {
  constructor(protected dataService: DataService, private http: HttpClient, protected cache: CacheService) {
    super('employee', dataService, cache);
  }
  GetNoteList(employeeId: number): Observable<any> {
    return this.dataService.get<any>(`employee/${employeeId}/Notes`);
  }

  GetNoteById(id: number): Observable<any> {
    return this.dataService.get<any>(`employee/Notes/${id}`);
  }

  public saveNote(data: any): Observable<any> {
    return this.dataService.post<any>(`employee/Notes`, data);
  }
}
