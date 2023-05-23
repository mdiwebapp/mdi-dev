import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from 'src/app/core/services/base-api.service';
import { CacheService } from 'src/app/core/services/cache.service';
import { DataService } from 'src/app/core/services/data.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DevicesService extends BaseApiService<any>{
  private baseUrl: any;
  constructor(protected dataService: DataService, private http: HttpClient, protected cache: CacheService) {
    super('devices', dataService, cache);
    this.baseUrl = environment.apiUrl
  }
  GetList(status: any): Observable<any> {
    return this.dataService.post<any>(`Device/GetList`, status);
  }

  public SaveDevice(data: any): Observable<any> {
    return this.dataService.post<any>(`Device`, data);
  }
  public UpdateDevice(data: any): Observable<any> {
    return this.dataService.patch<any>(`Device`, data);
  }
  GetDeviceById(id: number): Observable<any> {
    return this.dataService.get<any>(`Device/${id}`);
  }

  checkMacaddress(id: string): Observable<any> {
    return this.dataService.get<any>(`Device/CheckMacAddress/${id}`);
  }

  GetNoteList(deviceId: number): Observable<any> {
    return this.dataService.get<any>(`Device/${deviceId}/Notes`);
  }

  GetNoteById(id: number): Observable<any> {
    return this.dataService.get<any>(`Device/Notes/${id}`);
  }

  public saveNote(data: any): Observable<any> {
    return this.dataService.post<any>(`Device/Notes`, data);
  }
  GetHistoryList(deviceId: number): Observable<any> {
    return this.dataService.get<any>(`Device/${deviceId}/history`);
  }
  downloadDeviceData(status) {
    return this.http.get(this.baseUrl + `Device/ExportToExcel/${status}`, { responseType: 'blob' });
  }
  GenerateDeviceId(deviceType: string): Observable<any> {
    return this.dataService.get<any>(`Device/GenerateDeviceId/${deviceType}`);
  }

}
