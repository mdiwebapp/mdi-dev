import { Injectable } from '@angular/core';
import { DataService } from 'src/app/core/services/data.service';
import { BaseApiService } from 'src/app/core/services';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PhysicalInventoryService extends BaseApiService<any>{
  private baseUrl: any;
  constructor(protected dataService: DataService,private http: HttpClient) {
    super('cycle-count', dataService, null);
    this.baseUrl = environment.apiUrl
  }
  GetPhysicalInventory(PartType: any): Observable<any> {
    return this.dataService.get<any>(`PhysicalInventory/${PartType}/InventoryTypes`);
  }

  GetInventoryTypes(Branch: any): Observable<any> {
    return this.dataService.get<any>(`PhysicalInventory/${Branch}/InventoryTypes`);
  }
  SubmitPhysicalInventory(data: any) {
    return this.dataService.post<any>(`PhysicalInventory/Apply`, data);
  }
  GetInventoryDetail(branch: string, InvType: string): Observable<any> {
    return this.dataService.get<any>(`CycleCount/${branch}/${InvType}/Details`);
  }

  ///// PhysicalInventoryBarcode 
  GetInventoryBarcodeByBranch(branch: string): Observable<any> {
    return this.dataService.get<any>(`PhysicalInventoryBarcode/GetPhysicalInventoryBarcodeByBranch/${branch}`);
  }
  AddPhysicalInventoryBarcode(data: any) {
    return this.dataService.post<any>(`PhysicalInventoryBarcode/addPhysicalInvBarcode`, data);
  }
  PhysicalInventoryBarcodeExport(data:any){
    return this.http.post(this.baseUrl + `PhysicalInventoryBarcode/ExportToExcelVacationDay`, data, {
      responseType: 'blob',
    });
  }
  GetInventoryBarcodeNumber(invNumber: string,branch:string): Observable<any> {
    return this.dataService.get<any>(`PhysicalInventoryBarcode/GetPhysicalInventoryBarcodeInv/${invNumber}/${branch}`);
  }
}
