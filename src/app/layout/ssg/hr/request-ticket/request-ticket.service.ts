import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../../../../core/services/data.service';
import { CacheService } from '../../../../core/services/cache.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { BaseApiService } from '../../../../core/services/base-api.service';
@Injectable({
    providedIn: 'root',
  })
  export class HRRequestTickets extends BaseApiService<any>
  {
    private baseUrl: any;
    constructor(
      protected dataService: DataService,
      protected cache: CacheService,
      private http: HttpClient
    ) {
      super('HRRequestTicktes', dataService, cache);
      this.baseUrl = environment.apiUrl;
    }
    getHRRequestTickests(data:any):Observable<any>{
        return this.dataService.post<any>(`HRRequest/Tickets`,data);
      }
    exportToExcel(data:any):Observable<any>{
      return this.http.post(
        this.baseUrl +
          `HRRequest/Tickets/ExportToExcel`,data,
        { responseType: 'blob' }
      );
    }
    saveTickets(data:any):Observable<any>{
      return this.dataService.patch<any>(`HRRequest/Tickets/Save`,data);
    }
    getHRRequestTicketDetails(ticketNumber:number):Observable<any>{
      return this.dataService.get<any>(`HRRequest/Tickets/Details/${ticketNumber}`);
    }
  }