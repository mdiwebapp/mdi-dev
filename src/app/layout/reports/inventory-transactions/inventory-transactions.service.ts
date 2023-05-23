import { Injectable } from '@angular/core';
import { BaseApiService } from '../../../core/services/base-api.service';
import { CacheService } from '../../../core/services/cache.service';
import { DataService } from '../../../core/services/data.service';
import { Observable } from 'rxjs';
import { environment } from '../../../../../src/environments/environment';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class InventoryTransactionService extends BaseApiService<any> {
  private baseUrl: any;
  constructor(
    protected dataService: DataService,
    protected cache: CacheService,
    private http: HttpClient
  ) {
    super('inventory transaction report', dataService, cache);
    this.baseUrl = environment.apiUrl;
  }

  ExportToExcelInventoryTransactionView(
    dtFrom: Date,
    dtTo: Date,
    Branch: string,
    Filter: string,
    strSort: string
  ): Observable<any> {
    return this.http.get(
      this.baseUrl +
        `InventoyTransactionReport/ExportToExcel?dtFrom=${dtFrom}&dtTo=${dtTo}&Branch=${Branch}&Filter=${Filter}&strSort=${strSort}`,
      { responseType: 'blob' }
    );
  }
}
