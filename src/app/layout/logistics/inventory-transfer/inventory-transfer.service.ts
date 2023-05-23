import { Injectable } from '@angular/core';
import { DataService } from 'src/app/core/services/data.service';
import { BaseApiService } from 'src/app/core/services';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InventoryTransferService extends BaseApiService<any>{
  private baseUrl: any;
  constructor(protected dataService: DataService, private http: HttpClient) {
    super('cycle-count', dataService, null);
    this.baseUrl = environment.apiUrl
  }

  GetInventoryTransHeader(obj:any): Observable<any> {    
    return this.dataService.post<any>(`InventoryTransfer/GetInvTransferHeader`,obj);
  }
  SetInvTransferService(transferNumber:string): Observable<any> {
    return this.dataService.post<any>(`InventoryTransfer/InvTransferOverride/${transferNumber}`,null);
  }
  GetInventoryTransCheckTrnDetails(data:any): Observable<any> {
    return this.dataService.post<any>(`InventoryTransfer/InventoryTransferCheckTrnDetails`,data);
  }
  SendMailAfterSend(data:any): Observable<any> {
    return this.dataService.post<any>(`InventoryTransfer/SendMailAfterSend`,data);
  }
  GetInventoryTransferSelectItem(data): Observable<any> {
    return this.dataService.post<any>(`InventoryTransfer/InventoryTransferSelectItem`,data);
  }
  AddInventoryTransfer(data:any): Observable<any> {
    return this.dataService.post<any>(`InventoryTransfer/Add`,data);
  }
  GetInvTransferDetails(data:any): Observable<any> {
    return this.dataService.post<any>(`InventoryTransfer/GetInvTransferDetails`,data);
  }
  InvTranDetailsReceive(data:any): Observable<any> {
    return this.dataService.post<any>(`InventoryTransfer/InvTranDetailsReceive`,data);
  }    
  SendMailAfterRecQty(data:any): Observable<any> {
    return this.dataService.post<any>(`InventoryTransfer/sendMailAfterRecQty`,data);
  }
  LoadInvAvailable(): Observable<any> {
    return this.dataService.get<any>(`InventoryTransfer/LoadInvAvailable`);
  }
  LoadInvNumber(): Observable<any> {
    return this.dataService.get<any>(`InventoryTransfer/LoadInvNumber`);
  }
  validateTrDetailsInvCompile(data:any): Observable<any> {
    return this.dataService.post<any>(`InventoryTransfer/validateTrDetailsInvCompile`,data);
  }
  AddLine(data:any): Observable<any> {
    return this.dataService.post<any>(`InventoryTransfer/AddLine`,data);
  }
  GetNextInvNumber(): Observable<any> {
    return this.dataService.get<any>(`InventoryTransfer/GetMaxInvTranNumber`);
  }
  deleteInventory(invNumber:any): Observable<any>{
    return this.dataService.delete<any>(`InventoryTransfer/DeleteInvTransfer`,invNumber);
  }
  exportToExcel(data:any): Observable<any>{
    return this.http.post(
      this.baseUrl + `InventoryTransfer/ExportToExcelInventoryTransfer/`,data,
      { responseType: 'blob' }
    );
  }
}
