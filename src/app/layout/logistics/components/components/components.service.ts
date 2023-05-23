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
export class ComponentsService extends BaseApiService<any>{
  componentInfo :any;
  constructor(protected dataService: DataService, private http: HttpClient, protected cache: CacheService) {
    super('devices', dataService, cache);
  }
  GetList(status: any): Observable<any> {
    return this.dataService.post<any>(`Component/List`, status);
  }
  GetById(Id: any, InventoryId: any): Observable<any> {
    return this.dataService.get<any>(`Component/Details/Id?InventotyNumber=${Id}&InventoryId=${InventoryId}`);
  }
  public SaveComponent(data: any): Observable<any> {
    return this.dataService.post<any>(`Component/Add`, data);
  }
  public UpdateComponent(data: any): Observable<any> {
    return this.dataService.patch<any>(`Component/Update`, data);
  }
  GetNoteList(venderId: number): Observable<any> {
    return this.dataService.get<any>(`Component/Notes?InventoryNumber=${venderId}`);
  }

  GetNoteById(id: number): Observable<any> {
    return this.dataService.get<any>(`Component/Notes/details?id=${id}&tablename=INV_NOTES`);
  }

  public saveNote(data: any): Observable<any> {
    return this.dataService.post<any>(`Component/Notes`, data);
  }

  GetServiceHistory(vehicleNumber: string): Observable<any> {
    return this.dataService.get<any>(`Vehicle/${vehicleNumber}/ServiceHeader`);
  }
  GetServiceDetail(vehicleNumber: string, serviceNo: string): Observable<any> {
    return this.dataService.get<any>(`Vehicle/${vehicleNumber}/ServiceDetail?ServiceNumber=${serviceNo}`);
  }

  public ExportToExcel(data: any): Observable<any> {
    return this.http.post(environment.apiUrl + `Component/ExportToExcel`, data, { responseType: 'blob' })

  }
  public ExportToReport(): Observable<any> {
    return this.http.post(environment.apiUrl + `Component/ExportToReport`, null, { responseType: 'blob' })

  }
  GetHistoryList(data: any): Observable<any> {
    return this.dataService.get<any>(`Component/History/List?InventoryId=${data.inventoryId}&InventoryNumber=${data.inventoryNumber}`);
  }

  GetFleetHistory(InvNumber: string): Observable<any> {
    return this.dataService.get<any>(`Fleet/${InvNumber}/FleetHistory`);
  }
  checkSerialNo(sNo: string): Observable<any> {
    return this.dataService.get<any>(`Component/CheckSerialExists/` + sNo);
  }
}
