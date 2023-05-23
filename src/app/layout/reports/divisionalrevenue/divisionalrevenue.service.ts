import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CacheService } from 'src/app/core/services/cache.service';
import { BaseApiService } from '../../../core/services/base-api.service';
import { DataService } from '../../../core/services/data.service';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class DivisionalRevenueService extends BaseApiService<any> {
  private baseUrl: any;
  constructor(
    protected dataService: DataService,
    private http: HttpClient,
    protected cache: CacheService
  ) {
    super('DivisionalRevenue', dataService, cache);
    this.baseUrl = environment.apiUrl;
  }

  GetList(data: any): Observable<any> {
    return this.dataService.post<any>(`DivisionalRevenue/List`, data);
  }

  DivisionalRevenueLevel2(data: any): Observable<any> {
    return this.dataService.post<any>(
      `DivisionalRevenue/DivisionalRevenueLevel2`,
      data
    );
  }

  DivisionalRevenueLevel3(data: any): Observable<any> {
    return this.dataService.post<any>(
      `DivisionalRevenue/DivisionalRevenueLevel3`,
      data
    );
  }

  DivisionalRevenueRegionLevel(data: any): Observable<any> {
    return this.dataService.post<any>(
      `DivisionalRevenue/DivisionalRevenueRegionLevel`,
      data
    );
  }

  DivisionalRevenueRegionLevel2(data: any): Observable<any> {
    return this.dataService.post<any>(
      `DivisionalRevenue/DivisionalRevenueRegionLevel2`,
      data
    );
  }

  DivisionalRevenueRegionLevel3(data: any): Observable<any> {
    return this.dataService.post<any>(
      `DivisionalRevenue/DivisionalRevenueRegionLevel3`,
      data
    );
  }

  DivisionalRevenueLevel3InventoryList(JobId: number): Observable<any> {
    return this.dataService.get<any>(
      `DivisionalRevenue/DivisionalRevenueLevel3InventoryList/${JobId}`
    );
  }
  DivisionalRevenueLevel3LaborList(JobId: number): Observable<any> {
    return this.dataService.get<any>(
      `DivisionalRevenue/DivisionalRevenueLevel3LaborList/${JobId}`
    );
  }
  DivisionalRevenueLevel3InvoiceList(JobId: number): Observable<any> {
    return this.dataService.get<any>(
      `DivisionalRevenue/DivisionalRevenueLevel3InvoiceList/${JobId}`
    );
  }
  downloadDivisonalData(JobId: number, selectedSection: string) {
    return this.http.get(
      this.baseUrl +
        `DivisionalRevenue/ExportToExcel/${JobId}/${selectedSection}`,
      { responseType: 'blob' }
    );
  }
}
