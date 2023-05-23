import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from 'src/app/core/services/base-api.service';
import { CacheService } from 'src/app/core/services/cache.service';
import { DataService } from 'src/app/core/services/data.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class InventoryService extends BaseApiService<any> {
  private baseUrl: any;
  constructor(
    protected dataService: DataService,
    protected cache: CacheService,
    private http: HttpClient
  ) {
    super('inventory', dataService, cache);
    this.baseUrl = environment.apiUrl;
  }

  GetInventoryTypes(branchCode: any): Observable<any> {
    var data = {
      "searchText": "",
      "branchCode": branchCode
    }
    return this.dataService.post<any>(`Inventory/InventoryTypes`, data);
    //return this.dataService.get<any>(`Inventory/${branchCode}/InventoryTypes`);
  }
  GetInventoryNumbers(branchCode: any, inventorytype: any): Observable<any> {
    return this.dataService.get<any>(
      `Inventory/${branchCode}/InventoryType/${inventorytype}/InventoryNumbers`
    );
  }
  GetScanBarcode(vehiclenumber: any, barcode: any): Observable<any> {
    return this.dataService.get<any>(
      `Inventory/${vehiclenumber}/Scan/${barcode}`
    );
  }
  LoadInvenotry(data:any): Observable<any> {
    return this.dataService.post<any>(
      'Inventory/LoadedPicklist',data
    );
  }
  LoadOnVehicle(data: any) {
    return this.dataService.post<any>(`Inventory/Load`, data);
  }
  UnLoadOnVehicle(data: any) {
    return this.dataService.post<any>(`Inventory/Unload`, data);
  }
  OffloadVehicle(data: any) {
    return this.dataService.post<any>(`Inventory/Offload`, data);
  }
  GetInventoryView(data: any): Observable<any> {
    return this.dataService.post<any>(`Inventory/InventoryView`, data);
  }
  downloadInventoryData(data: any) {
    return this.http.post(this.baseUrl + `Inventory/ExportToExcel`, data, {
      responseType: 'blob',
    });
  }
}
