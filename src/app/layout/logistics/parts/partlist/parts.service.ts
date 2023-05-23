import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from 'src/app/core/services/base-api.service';
import { DataService } from 'src/app/core/services/data.service';
import { PartsModel } from './parts.model';
import { environment } from 'src/environments/environment';
import { CacheService } from 'src/app/core/services/cache.service';

@Injectable({
  providedIn: 'root',
})
export class PartsService extends BaseApiService<PartsModel> {
  private baseUrl: any;
  constructor(
    protected dataService: DataService,
    private http: HttpClient,
    protected cache: CacheService
  ) {
    super('parts', dataService, cache);
    this.baseUrl = environment.apiUrl;
  }
  GetList(status: any): Observable<any> {
    return this.dataService.post<any>(`Part/FilterList`, status);
  }

  GetById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}Part/${id}`, {
      headers: { hideLoader: 'false' },
    });
  }
  AddPartsData(data: any): Observable<any> {
    return this.dataService.post<any>(`Part/Add`, data);
  }
  UpdatePartsData(data: any): Observable<any> {
    return this.dataService.put<any>(`Part/Update`, data);
  }
  // history
  GetHistoryList(partId: any): Observable<any> {
    return this.dataService.get<any>(`Part/${partId}/History`);
  }
  CheckInventoryType(id: number): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}Part/InventoryType/${id}/Unique`,
      { headers: { hideLoader: 'false' } }
    );
  }
  downloadPartData() {
    return this.http.get(this.baseUrl + `Part/ExportToExcel`, {
      responseType: 'blob',
    });
  }
  UpdatePartsInfo(data: any): Observable<any> {
    return this.dataService.patch<any>(`Part/Info`, data);
  }

  // Enginnering
  GetBOMList(partId: any): Observable<any> {
    return this.dataService.get<any>(`Part/${partId}/BOMS`);
  }
  GetQtyData(partId: any, data: any): Observable<any> {
    return this.dataService.post<any>(`Part/${partId}/Inventory/Qty`, data);
  }

  GetPricingList(
    partId: any,
    branches: any,
    inventoryType: string
  ): Observable<any> {
    if (partId) {
      return this.dataService.post<any>(`Part/${partId}/Prices`, {
        branches,
        partId,
        inventoryType,
      });
    }
  }

  // Invenotry
  GetInventoryTransactions(partId: any, data: any): Observable<any> {
    return this.dataService.post<any>(
      `Part/${partId}/Inventory/Transactions`,
      data
    );
  }
  GetInventoryQuantities(data): Observable<any> {
    return this.dataService.post<any>(`Inventory/Branches/Quantities`, data);
  }

  // purchasing
  GetPurchasingVendors(partId: any): Observable<any> {
    return this.dataService.get<any>(`Part/${partId}/Purchasing/Vendors`);
  }
  GetPurchasingHistory(partId: any): Observable<any> {
    return this.dataService.get<any>(`Part/${partId}/Purchasing/History`);
  }
  SavePurchasingVendor(partId: any, data: any): Observable<any> {
    return this.dataService.post<any>(`Part/${partId}/Vendor`, data);
  }
  UpdatePurchasingVendor(partId: any, data: any): Observable<any> {
    return this.dataService.patch<any>(`Part/${partId}/Vendor`, data);
  }
  ExportData(data: any): Observable<any> {
    return this.http.post(
      this.baseUrl + `Inventory/ExportToExcel/Transactions`,
      data,
      {
        responseType: 'blob',
      }
    );
    //return this.dataService.post<any>(`Inventory/ExportToExcel/Transactions`, data);
  }

  // Add barcode
  AddBarcode(partId: any, barcode: string): Observable<any> {
    return this.dataService.post<any>(
      `Part/${partId}/Barcode?Barcode=` + barcode,
      null
    );
  }
  DeleteBarcode(partId: any, barcode: string): Observable<any> {
    return this.http.delete<any>(
      `${this.baseUrl}Part/${partId}/Barcode?Barcode=` + barcode,
      {
        headers: { hideLoader: 'false' },
      }
    );
    //return this.dataService.delete<any>(`Part/${partId}/Barcode?Barcode=`, barcode);
  }

  DeleteVendorPart(vendorpartId: any): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}Part/Vendor/${vendorpartId}`, {
      headers: { hideLoader: 'false' },
    });
    //return this.dataService.delete<any>(`Part/${partId}/Barcode?Barcode=`, barcode);
  }
  UpdatePricing(data: any): Observable<any> {
    return this.dataService.post<any>(`Part/UpdatePartPricing`,data);
  }
}
