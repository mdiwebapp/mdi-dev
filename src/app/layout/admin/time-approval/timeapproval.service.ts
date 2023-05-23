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

export class TimeApprovalService extends BaseApiService<any> {
  private baseUrl: any;
  constructor(
    protected dataService: DataService,
    protected cache: CacheService,
    private http: HttpClient
  ) {
    super('timeapproval', dataService, cache);
    this.baseUrl = environment.apiUrl;
  }
  GetTimeApprovalAllEmployee(data: any): Observable<any> {
    return this.dataService.post<any>(`TimeLineApproval/GetTimeApprovalAllEmployee`, data);
  }
  GetTimeApprovalBranches(): Observable<any> {
    return this.dataService.get<any>(`TimeLineApproval/GetTimeApprovalBranches`);
  }
  GetTimeApprovalGpcLabourType(): Observable<any> {
    return this.dataService.get<any>(`TimeLineApproval/GetTimeApprovalGpcLabourType`);
  }
  GetTimeApprovalLabourType(): Observable<any> {
    return this.dataService.get<any>(`TimeLineApproval/GetTimeApprovalLabourType`);
  }
  GetTimeApprovalLabourTask(): Observable<any> {
    return this.dataService.get<any>(`TimeTracking/GetTimeTrackingLaborTask`);
  }
  GetTimeApprovalJob(data:any): Observable<any> {
    return this.dataService.post<any>(`TimeLineApproval/GetTimeApprovalJob`,data);
  }
  GetTimeApprovalUnionCodes(): Observable<any> {
    return this.dataService.get<any>(`TimeLineApproval/GetTimeApprovalUnionCodes`);
  }
  GetTimeApprovalEmployeeTime(data:any){
    return this.dataService.post<any>(`TimeLineApproval/GetTimeApprovalEmployeeTime`,data);
  }
  GetTimeApprovalBranchDDL(): Observable<any> {
    return this.dataService.get<any>(`TimeLineApproval/GetTimeApprovalBranchDropDown`);
  }
  TimeApprovalPerDiem(data:any){
    return this.dataService.post<any>(`TimeLineApproval/TimeApprovalPerDiem`,data);
  }
  SetTimeApprovalLunch(data:any){
    return this.dataService.post<any>(`TimeLineApproval/TimeApprovalLunch`,data);
  }
  TimeApprovalDeletePunch(data:any){
    return this.dataService.post<any>(`TimeLineApproval/TimeApprovalDeletePunch`,data);
  }

  GetTimeApprovalUnionClasses( unioncode: string): Observable<any> {
    return this.dataService.get<any>(`TimeLineApproval/TimeApprovalUnionClass/${unioncode}`);
  }
  AddPunchTimeApproval(data:any): Observable<any> {
    return this.dataService.post<any>(`TimeLineApproval/AddPunchTimeApproval`,data);
  }

  UpdatePunchTimeApproval(data:any): Observable<any> {
    return this.dataService.post<any>(`TimeLineApproval/UpdatePunchTimeApproval`,data);
  }
  DeletePunchTimeApproval(data:any): Observable<any> {
    return this.dataService.post<any>(`TimeLineApproval/TimeApprovalDeletePunch`,data);
  }

  AddTimeTrack(data:any): Observable<any> {
    return this.dataService.post<any>(`TimeTracking/TimeTrackingADD`,data);
  }
  UpdateTimeTrack(data:any): Observable<any> {
    return this.dataService.post<any>(`TimeTracking/TimeTrackingUpdate`,data);
  }
  exportToExcel(data:any) {
    return this.http.post(this.baseUrl + `TimeLineApproval/ExportToExcelPrintWODetail`,data, { responseType: 'blob' });
  }
  UpdatePunchTimeApprovalCheck(data:any): Observable<any> {
    return this.dataService.post<any>(`TimeLineApproval/UpdatePunchTimeApprovalCheckBox`,data);
  }
  GetTimeTrackingLists(data:any){
    return this.dataService.post<any>(`TimeTracking/GetTimeTrackingLists`,data);
  }
  AddTimeTrackWithoutTimeClock(data:any): Observable<any> {
    return this.dataService.post<any>(`TimeTracking/TimeTrackingADDWithoutTimeClock`,data);
  }
  printExcel(data:any) {
    return this.http.post(this.baseUrl + `TimeLineApproval/ExportToExcelPrintDailyTimeAndWork/`+data,null, { responseType: 'blob' });
  }
  printExcelWithJobNumber(data:any) {
      return this.http.post(this.baseUrl + `TimeLineApproval/ExportToExcelPrintDailyTimeAndWorkWithJobNumber`,data, { responseType: 'blob' });
  }
}