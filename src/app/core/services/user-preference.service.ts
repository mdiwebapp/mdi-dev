import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from './data.service';
import { UserPreferenceModel } from '../models/preference.model';
@Injectable({
  providedIn: 'root'
})
export class UserPreferenceService {

  constructor(public dataService: DataService) { }
  SaveUserPreference(data: UserPreferenceModel): Observable<any> {
    return this.dataService.put<any>(`UserPreference`, data);
  }
  GetUserPreference(data: any): Observable<any> {
    return this.dataService.get<any>(`UserPreference/${data}`, null);
  }
}
