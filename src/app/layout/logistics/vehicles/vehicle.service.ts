import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BaseApiService } from 'src/app/core/services/base-api.service';
import { DataService } from 'src/app/core/services/data.service';
import { VehicleInfoModel } from './vehicle-info/vehicle-info.model';
import { CacheService } from 'src/app/core/services/cache.service';
import { HttpRequestCache } from 'src/app/core/utils/http-request-cache';

@Injectable({
  providedIn: 'root'
})
export class VehicleService extends BaseApiService<VehicleInfoModel> {


  private baseUrl: any;
  constructor(protected dataService: DataService, private http: HttpClient, protected cache: CacheService) {

    super('vehicle', dataService, cache);
    this.baseUrl = environment.apiUrl
  }

  GetVehicleNo(vehicleType: string): Observable<any> {
    var vnt = vehicleType;
    return this.dataService.post<any>(`Vehicle/${vnt}`, null);
  }

  GetList(status: any): Observable<any> {
    return this.dataService.post<any>(`Vehicle/GetList`, status);
  }
  AddData(vehicle: any): Observable<any> {
    return this.dataService.post<any>(`Vehicle/Add`, vehicle);
  }
  UpdateData(vehicle: any): Observable<any> {
    return this.dataService.patch<any>(`Vehicle/Update`, vehicle);
  }

  GetById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}Vehicle/${id}`, { headers: { hideLoader: 'false' } });
  }

  AddDedicatedBranch(userId: any, branchId: any): Observable<any> {
    return this.dataService.get<any>(`Vehicle/GetVehiclesByBranchId/${userId}/${branchId}`);
  }
  deleteId(id): Observable<any> {
    return this.dataService.delete<any>(`Vehicle`, id);
  }
  //// Get histroy
  GetHistoryByVehicleId(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}Vehicle/${id}/History`);
  }

  /// Notess
  GetNoteList(vehicleId: number): Observable<any> {
    return this.dataService.get<any>(`Vehicle/${vehicleId}/Notes`);
  }

  GetNoteById(id: number): Observable<any> {
    return this.dataService.get<any>(`Vehicle/Notes/${id}`);
  }

  public saveNote(data: any): Observable<any> {
    return this.dataService.post<any>(`Vehicle/Notes`, data);
  }

  NonExpiringVehicleId(id: number, isStatus: boolean): Observable<any> {
    return this.dataService.patch<any>(`Vehicle/${id}/NonExpiringPlate/${isStatus}`);
  }

  checkVIN(sNo: string): Observable<any> {
    return this.dataService.get<any>(`Vehicle/CheckSerialNumber/` + sNo);
  }

  // GetPartItems(branchCode: any): Observable<any> {
  //   return this.dataService.get<any>(`Vehicle/${branchCode}/InventoryItems`);
  // }



  public LoadPicklist(data: any): Observable<any> {
    return this.dataService.put<any>(`Picklist/AddUpdate`, data);
  }

  public GetLoadPicklist(data: any): Observable<any> {
    return this.dataService.get<any>(`Picklist/${data}`);
  }
  public deletePicklist(data:any): Observable<any> {
    return this.dataService.post<any>(`Picklist/Delete`, data);
    //return this.http.delete<any>(`${this.baseUrl}Picklist/Delete?Id=${selected}&DeleteAll=${isAll}&location_Number=${vhicleNo}`);
    //return this.dataService.delete<any>(`Vehicle/${vhicleNo}/Picklist?Id=${selected}&DeleteAll=${isAll}`, null);
  }
  @HttpRequestCache<VehicleService>(function () {
    return {
      storage: this.cache,
      refreshSubject: this.refreshSubject,
    };
  })
  GetActivityList(vehicleNumber: string): Observable<any> {
    return this.dataService.get<any>(`Vehicle/${vehicleNumber}/Activity`);
  }
  @HttpRequestCache<VehicleService>(function () {
    return {
      storage: this.cache,
      refreshSubject: this.refreshSubject,
    };
  })
  GetServiceHistory(vehicleNumber: string): Observable<any> {
    return this.dataService.get<any>(`Vehicle/${vehicleNumber}/ServiceHeader`);
  }
  GetServiceDetail(vehicleNumber: string, serviceNo: string): Observable<any> {
    return this.dataService.get<any>(`Vehicle/${vehicleNumber}/ServiceDetail?ServiceNumber=${serviceNo}`);
  }

  LoadQuantity(data: any): Observable<any> {
    return this.dataService.patch<any>(`Picklist/LoadQty`, data);
  }

  downloadVehicleData() {
    return this.http.get(this.baseUrl + `Vehicle/ExportToExcel`, { responseType: 'blob' });
  }

}
