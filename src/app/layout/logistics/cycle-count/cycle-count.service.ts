import { Injectable } from '@angular/core';
import { DataService } from 'src/app/core/services/data.service';
import { BaseApiService } from 'src/app/core/services';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CycleCountService extends BaseApiService<any>{
  private baseUrl: any;

  constructor(protected dataService: DataService, public http: HttpClient) {
    super('cycle-count', dataService, null);
    this.baseUrl = environment.apiUrl
  }
  GetCyclecount(branchcode: any): Observable<any> {
    return this.dataService.get<any>(`CycleCount/${branchcode}/List`);
  }

  GetInventoryTypes(): Observable<any> {
    return this.dataService.get<any>(`CycleCount/InvnetoryTypes`);
  }
  GetInventoryDetail(branch: string, InvType: string): Observable<any> {
    return this.dataService.get<any>(`CycleCount/${branch}/${InvType}/Details`);
  }
  SubmitCyclecount(data: any) {
    return this.dataService.post<any>(`CycleCount/Apply`, data);
  }
  ExportCyclecount(data: any, branch: any) {
    return this.http.post(this.baseUrl + `CycleCount/${branch}/ExportToExcel`, data, {
      responseType: 'blob',

    });
    // return this.dataService.post<any>(`CycleCount/ExportToExcel`, {
    //   responseType: 'blob'
    // });
  }
  ExportTrailers(branch: string): Observable<any> {
    return this.http.get(this.baseUrl + `CycleCount/${branch}/Trailers`, { responseType: 'blob' })
  }
  ExportPumpsAndGens(branch: string): Observable<any> {
    return this.http.get(this.baseUrl + `CycleCount/${branch}/PumpsAndGens`, { responseType: 'blob' })
    // return this.dataService.get<any>(`CycleCount/${branch}/PumpsAndGens`,null, {
    //   responseType: 'blob'
    // });
  }
  ExportSubsAndCords(branch: string): Observable<any> {
    return this.http.get(this.baseUrl + `CycleCount/${branch}/SubsAndCords`, { responseType: 'blob' })
    // return this.dataService.get<any>(`CycleCount/${branch}/SubsAndCords`,null, {
    //   responseType: 'blob'
    // });
  }
}
