import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from './../../../core/services/data.service';
import { CacheService } from './../../../core/services/cache.service';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../../../environments/environment';
import { BaseApiService } from './../../../core/services/base-api.service';
@Injectable({
    providedIn: 'root',
  })
  export class BuildingTicketsService extends BaseApiService<any>
  {
    private baseUrl: any;
    constructor(
      protected dataService: DataService,
      protected cache: CacheService,
      private http: HttpClient
    ) {
      super('BuildingTickets', dataService, cache);
      this.baseUrl = environment.apiUrl;
    }
    getBuildingTicketRequest(data:any):Observable<any>{
        return this.dataService.post<any>(`BuildingRequests/Tickets`,data);
      }
    exportToExcel(data:any):Observable<any>{
      return this.http.post(
        this.baseUrl +
          `BuildingRequests/Tickets/ExportToExcel`,data,
        { responseType: 'blob' }
      );
    }
 
    getBuildingRequestTicketDetails(ticketNumber:number):Observable<any>{
      return this.dataService.get<any>(`BuildingRequests/Details/${ticketNumber}`);
    }
    saveTickets(data:any):Observable<any>{
      return this.dataService.patch<any>(`BuildingRequests/Tickets/Save`,data);
    }
  }