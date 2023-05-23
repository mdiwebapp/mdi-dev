import { Injectable } from '@angular/core';
import { BaseApiService } from '../../../../../../core/services/base-api.service';
import { CacheService } from '../../../../../../core/services/cache.service';
import { DataService } from '../../../../../../core/services/data.service';
import { FleetInfoModel } from './fleet-info.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class FleetInfoService extends BaseApiService<FleetInfoModel> {
  private baseUrl: any;
  constructor(
    protected dataService: DataService,
    protected cache: CacheService,
    private http: HttpClient
  ) {
    super('fleet', dataService, cache);
    this.baseUrl = environment.apiUrl;
  }
  GetFleetPartViewInvType(data: any): Observable<any> {
    return this.dataService.post<any>(`Fleet/GetFleetPartViewInvType`, data);
  }
  GetFleetUnitInfoAdorsHours(invNumber: any): Observable<any> {
    return this.dataService.get<any>(
      `Fleet/GetFleetUnitInfoAdorsHours/${invNumber}`
    );
  }
  GetFleetUnitInfoPartsServiceComponent(invNumber: any): Observable<any> {
    return this.dataService.get<any>(
      `Fleet/GetFleetUnitInfoPartServiceComponent/${invNumber}`
    );
  }

  GetFleetAdorsUnitInfo(invNumber: any): Observable<any> {
    return this.dataService.get<any>(
      `Fleet/GetFleetAdorsUnitInfo/${invNumber}`
    );
  }
  GetFleetAdorsComponent(invNumber: any): Observable<any> {
    return this.dataService.get<any>(
      `Fleet/GetFleetAdorsComponent/${invNumber}`
    );
  }

  GetServiceHistory(fleetNumber: string): Observable<any> {
    return this.dataService.get<any>(`Fleet/${fleetNumber}/ServiceHeader`);
  }
  GetServiceDetail(InvNumber: string, ServiceNumber: string): Observable<any> {
    return this.dataService.get<any>(
      `Fleet/${InvNumber}/ServiceDetail/${ServiceNumber}`
    );
  }
  GetUtilityDetail(UtilityId: number, UtilityType: string): Observable<any> {
    return this.dataService.get<any>(
      `Fleet/getFleetUtility/${UtilityId}/${UtilityType}`
    );
  }
  ExportToExcelFleetView(invNumber: string): Observable<any> {
    return this.http.get(
      this.baseUrl + `Fleet/ExportToExcelFleetView/${invNumber}`,
      { responseType: 'blob' }
    );
  }
  ExportToExcelFleetGridView(filter: any): Observable<any> {
    return this.http.post(
      this.baseUrl + `Fleet/ExportToExcelFleetGridView`, filter,
      { responseType: 'blob' }
    );
  }
  ExportToExcelDoIt(data: any): Observable<any> {
    return this.http.post(
      this.baseUrl + 'PipeLine/GetPipelineForcastDetail',data,
      { responseType: 'blob' }
    );
  }
  GetServiceHistoryHeaderParts(fleetNumber: string): Observable<any> {
    return this.dataService.get<any>(`Fleet/${fleetNumber}/ServiceHeaderParts`);
  }

  GetFleetHistory(InvNumber: string): Observable<any> {
    return this.dataService.get<any>(`Fleet/${InvNumber}/FleetHistory`);
  }

  GetFleetLastInvoiced(InvNumber: string): Observable<any> {
    return this.dataService.get<any>(`Fleet/${InvNumber}/FleetLastInvoiced`);
  }
  GetFleetServiceYTD(InvNumber: string): Observable<any> {
    return this.dataService.get<any>(`Fleet/${InvNumber}/FleetServiceYTD`);
  }
  GetFleetActiveInvListDetails(
    InvNumber: string,
    InvType: string
  ): Observable<any> {
    return this.dataService.get<any>(
      `Fleet/GetFleetActiveInvList/${InvNumber}/${InvType}`
    );
  }
  GetFleetActiveInvList(InvType: string): Observable<any> {
    return this.dataService.get<any>(
      `Fleet/GetFleetActiveInventoryActiveInvList/${InvType}`
    );
  }
  GetFleetActiveInvAllList(InvType: string): Observable<any> {
    return this.dataService.get<any>(
      `Fleet/GetFleetActiveInventoryActiveInvAllList/${InvType}`
    );
  }
  GetFleetActivityInventoryAdorsList(InvNumber: string): Observable<any> {
    return this.dataService.get<any>(
      `Fleet/GetFleetActivityInventoryAdorsList/${InvNumber}`
    );
  }

  GetFleetComponentCheck(InvNumber: string): Observable<any> {
    return this.dataService.get<any>(
      `Fleet/GetFleetComponentCheck/${InvNumber}`
    );
  }
  GetFleetSellInacComponent(
    InvNumber: string,
    qb: string,
    ir: string,
    salesNumber: string,
    userName: string,
    sold: boolean
  ): Observable<any> {
    return this.dataService.get<any>(
      `Fleet/GetFleetSellInacComponent/${InvNumber}/${qb}/${ir}/${salesNumber}/${userName}/${sold}`
    );
  }

  addFleetInvInfo(data: any): Observable<any> {
    return this.dataService.post<any>(`Fleet/addFleetInvInfo`, data);
  }
  addFleetUnitInfo(data: any): Observable<any> {
    return this.dataService.post<any>(`Fleet/addFleetUnitInfo`, data);
  }
  editFleetUnitInfo(data: any): Observable<any> {
    return this.dataService.post<any>(`Fleet/editFleetUnitInfo`, data);
  }

  sendFleetMail(data: any): Observable<any> {
    return this.dataService.post<any>(`Fleet/sendMail`, data);
  }

  AssignToFleetAccept(data: any): Observable<any> {
    return this.dataService.post<any>(`Fleet/assignToFleetAccept`, data);
  }

  AddPrepareForSale(invNumber: string, userName: string): Observable<any> {
    return this.dataService.get<any>(
      `Fleet/setPrepareForSale/${invNumber}/${userName}`
    );
  }
}
