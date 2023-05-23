import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { BaseApiService } from '../../../core/services/base-api.service';
import { DataService } from '../../../core/services/data.service';
import { CacheService } from '../../../core/services/cache.service';
import { HttpRequestCache } from '../../../core/utils/http-request-cache';
@Injectable({
  providedIn: 'root',
})
export class PurchasingService extends BaseApiService<any> {
  private baseUrl: any;
  constructor(
    protected dataService: DataService,
    protected cache: CacheService,
    private http: HttpClient
  ) {
    super('purchasing', dataService, cache);
    this.baseUrl = environment.apiUrl;
  }

  GetPurchasingOrder(data: any): Observable<any> {
    return this.dataService.post<any>(`PurchaseOrder/PurchaseOrderList`, data);
  }
  GetPODetails(PONumber: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}PurchaseOrder/${PONumber}`, {
      headers: { hideLoader: 'false' },
    });
  }
  GetApproval(PONumber: string): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}PurchaseOrder/PurchaseOrderApproval/${PONumber}`,
      {
        headers: { hideLoader: 'false' },
      }
    );
  }
  GetPurchaseOrderLineItems(PONumber: string): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}PurchaseOrder/PurchaseOrderLineItems/${PONumber}`,
      {
        headers: { hideLoader: 'false' },
      }
    );
  }
  GetLineItemsFleet(data: any): Observable<any> {
    return this.dataService.post<any>(`PurchaseOrder/LineItemsFleet`, data);
  }
  GetPartUOMDetailsByPartNumber(
    PartNumber: string,
    Branches: any
  ): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}PurchaseOrder/GetPartUOMDetailsByPartNumber/${PartNumber}/${Branches}`,
      {
        headers: { hideLoader: 'false' },
      }
    );
  }
  GetPurchaseOrderJOB(data): Observable<any> {
    return this.dataService.post<any>(
      `PurchaseOrder/GetPurchaseOrderJob`,
      data
    );
  }
  GetPurchaseOrderReceivePOR(PONumber: string): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}PurchaseOrder/GetReceivePOR/${PONumber}`,
      {
        headers: { hideLoader: 'false' },
      }
    );
  }
  GetPurchaseHistory(PartNumber: string, ShowPrice: boolean): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}PurchaseOrder/GetPurchaseHistory/${PartNumber}/${ShowPrice}`,
      {
        headers: { hideLoader: 'false' },
      }
    );
  }
  ReceivePOR(PONumber: string): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}PurchaseOrder/ReceivePOR/${PONumber}`,
      {
        headers: { hideLoader: 'false' },
      }
    );
  }
  AddData(purchaseOrder: any): Observable<any> {
    return this.dataService.post<any>(`PurchaseOrder/Add`, purchaseOrder);
  }
  GetShipDetails(Code: string): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}PurchaseOrder/GetShipToDetails/${Code}`,
      {
        headers: { hideLoader: 'false' },
      }
    );
  }
  AddlineItems(lineItemsNewAddedData: any): Observable<any> {
    return this.dataService.post<any>(
      `PurchaseOrder/AddLineItems`,
      lineItemsNewAddedData
    );
  }
  EmployeeRequestor(PONumber: string): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}PurchaseOrder/EmployeeRequestor/${PONumber}`,
      {
        headers: { hideLoader: 'false' },
      }
    );
  }
  saveNote(data: any): Observable<any> {
    return this.dataService.post<any>(`PurchaseOrder/Notes`, data);
  }
  GetNotesListByPONumber(poNumber: string): Observable<any> {
    return this.dataService.get<any>(
      `PurchaseOrder/GetPONotesListByPONumber/${poNumber}`
    );
  }
  GetNotesById(id: number): Observable<any> {
    return this.dataService.get<any>(
      `PurchaseOrder/GetPONotesDetailById/${id}`
    );
  }
  saveRecievePO(data: any): Observable<any> {
    return this.dataService.post<any>(`PurchaseOrder/ReceivePO`, data);
  }
  GetHistoryByPONumber(poNumber: string): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}PurchaseOrder/${poNumber}/History`
    );
  }
  updateQuantity(
    ID: number,
    PONumber: string,
    Quantity: number
  ): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}PurchaseOrder/UpdateQuantity/${ID}/${PONumber}/${Quantity}/`,
      {
        headers: { hideLoader: 'false' },
      }
    );
  }

  updateCost(ID: number, PONumber: string, Cost: number): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}PurchaseOrder/UpdateCost/${ID}/${PONumber}/${Cost}/`,
      {
        headers: { hideLoader: 'false' },
      }
    );
  }
  downloadPOData(PONumber: string,printInOneFile:boolean) {
    // return this.http.get(
    //   this.baseUrl +
    //     `PurchaseOrder/ExportToExcelPurchaseOrderPrint/${PONumber}/${printInOneFile}`,
    //   { responseType: 'blob' }
    // );
    return this.http.get<any>(
      `${this.baseUrl}PurchaseOrder/ExportToExcelPurchaseOrderPrint/${PONumber}/${printInOneFile}`,
      {
        headers: { hideLoader: 'false' },
      }
    );
  }
  GetPORTotal(PONumber: string) {
    return this.http.get<any>(
      `${this.baseUrl}PurchaseOrder/GetPORTotal/${PONumber}`,
      {
        headers: { hideLoader: 'false' },
      }
    );
  }
  downloadPOHeaderData(poNumber: string) {
    return this.http.get<any>(
      `${this.baseUrl}PurchaseOrder/ExportToExcelPurchaseOrderPrintPOHeader/${poNumber}`,
      {
        headers: { hideLoader: 'false' },
      }
    );
  }
  sendEmail(poNumber: string,printInOneFile:boolean) {
    return this.http.get<any>(
      `${this.baseUrl}PurchaseOrder/SendEmail/${poNumber}/${printInOneFile}`,
      {
        headers: { hideLoader: 'false' },
      }
    );
  }
  GetPrintCount(PONumber: string) {
    return this.http.get<any>(
      `${this.baseUrl}PurchaseOrder/PrintCount/${PONumber}`,
      {
        headers: { hideLoader: 'false' },
      }
    );
  }
  downloadPOExcelFiles(excelData:any)
  {
    return this.http.post(
      this.baseUrl +
        `PurchaseOrder/GetPoExcelFilesByPath/`,excelData,
      { responseType: 'blob' }
    );
 
  }
  RemovelineItems(data: any): Observable<any> {
    return this.dataService.post<any>(
      `PurchaseOrder/RemoveLineItems`,
      data
    );
  }
}
