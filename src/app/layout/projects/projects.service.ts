import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from './../../core/services/data.service';
import { CacheService } from '../../core/services/cache.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BaseApiService } from '../../core/services/base-api.service';
@Injectable({
  providedIn: 'root',
})
export class ProjectService extends BaseApiService<any> {
  private baseUrl: any;
  constructor(
    protected dataService: DataService,
    protected cache: CacheService,
    private http: HttpClient
  ) {
    super('ProjectService', dataService, cache);
    this.baseUrl = environment.apiUrl;
  }

  getProjectServieJobList(data: any): Observable<any> {
    return this.dataService.post<any>('Project/Lists', data);
  }
  getProjectServiceJobDetails(jobNumber: number): Observable<any> {
    return this.dataService.get<any>(`Project/Info/Details/${jobNumber}`);
  }
  GetCRMContactByCustNumber(data: any) {
    return this.dataService.post<any>('CRM/Contacts/List', data);
  }
  addCRMCustomer(data: any): Observable<any> {
    return this.dataService.post<any>('CRM/Contacts/Add', data);
  }
  getPAFDetails(jobNumber: number): Observable<any> {
    return this.dataService.get<any>(`Project/Info/PAF/Detils/${jobNumber}`);
  }
  addNotes(data: any): Observable<any> {
    return this.dataService.post<any>('Project/Notes', data);
  }
  getNotesDetailsById(jobNumber: number): Observable<any> {
    return this.dataService.get<any>(`Project/Notes/${jobNumber}`);
  }
  GetListByJobNumber(jobNumber: number): Observable<any> {
    return this.dataService.get<any>(`Project/${jobNumber}/Notes`);
  }
  GetProjectNotesList(jobNumber: number): Observable<any> {
    return this.dataService.get<any>(`Project/ProjectNotes/${jobNumber}`);
  }
  saveProjectInfo(data: any): Observable<any> {
    return this.dataService.post<any>('Project/Info/Add', data);
  }
  editProjectInfo(data: any): Observable<any> {
    return this.dataService.patch<any>('Project/Info/Update', data);
  }
  getHistoryByJobNumber(jobNumber: number): Observable<any> {
    return this.dataService.get<any>(`Project/${jobNumber}/History`);
  }
  exportToExcel(data: any): Observable<any> {
    return this.http.post(this.baseUrl + `Project/ExportToExcel`, data, {
      responseType: 'blob',
    });
  }
  getProjectInfoJobInvoiceLists(
    jobNumber: number,
    unPaid: boolean
  ): Observable<any> {
    return this.dataService.get<any>(
      `Project/Info/InvoiceList/${jobNumber}/${unPaid}`
    );
  }
  GetLaborToRev(data: any): Observable<any> {
    return this.dataService.post<any>('Project/Info/L2R', data);
  }
  //#region PAF
  editPAF(data: any): Observable<any> {
    return this.dataService.patch<any>('Project/Info/PAF/Update', data);
  }
  exportToExcelPAF(jobNumber: number): Observable<any> {
    return this.http.get(
      this.baseUrl + `Project/Info/ExportToExcel/PAF/${jobNumber}`,
      { responseType: 'blob' }
    );
  }
  //#endregion

  //#region Tab Quotes
  GetQuoteList(jobNumber: number, changeOrder: number): Observable<any> {
    return this.dataService.get<any>(
      `Project/${jobNumber}/Quote/List/${changeOrder}`
    );
  }

  getQoutesDetails(jobNumber: number, changeOrder: number): Observable<any> {
    return this.dataService.get<any>(
      `Project/${jobNumber}/Quote/Details/${changeOrder}`
    );
  }
  addChangeOrder(jobNumber: number): Observable<any> {
    return this.dataService.get<any>(
      `Project/Quote/ChangeOrder/Add/${jobNumber}`
    );
  }
  copyChangeOrder(jobNumber: number, changeOrder: number) {
    return this.dataService.get<any>(
      `Project/${jobNumber}/Quote/ChangeOrder/Copy/${changeOrder}`
    );
  }
  GetQuotePriceDetails(InvType: string, QouteBranch: string) {
    return this.dataService.get<any>(
      `Project/Quote/Price/Details/${QouteBranch}/${InvType}`
    );
  }
  GetQuotePartDropdownList(data: any) {
    return this.dataService.post<any>('Dropdown/Project/Quote/Part', data);
  }
  saveQoutes(data: any): Observable<any> {
    return this.dataService.post<any>('Project/Quote/Save', data);
  }
  addMultiplier(data: any): Observable<any> {
    return this.dataService.post<any>('Project/Quote/Multiplier/Apply', data);
  }
  changePeriod(data: any): Observable<any> {
    return this.dataService.post<any>('Project/Quote/Period/Change', data);
  }
  //#endregion

  //#region Deep Well
  getDeepWell(data: any): Observable<any> {
    return this.dataService.post<any>('Project/Quote/Budget/Details', data);
  }
  //#endregion

  //#region Inevntory
  getInventory(data: any): Observable<any> {
    return this.dataService.post<any>('Project/Inventory/List', data);
  }

  exportToExcelInventory(data: any): Observable<any> {
    return this.http.post(
      this.baseUrl + `Project/Inventory/ExportToExcel`,
      data,
      { responseType: 'blob' }
    );
  }

  inventorySellToJob(data: any): Observable<any> {
    return this.dataService.post<any>('Project/Inventory/SellToJob', data);
  }

  inventoryOffRentToggle(data: any): Observable<any> {
    return this.dataService.post<any>('Project/Inventory/OffRent/Toggle', data);
  }
  inventoryCallOff(data: any): Observable<any> {
    return this.dataService.post<any>('Project/Inventory/CallOff', data);
  }
  getInventoryType(jobNumber: number): Observable<any> {
    return this.dataService.get<any>(
      `Project/Inventory/Movement/Types/${jobNumber}`
    );
  }
  //#endregion

  //#region Project Inventory
  getItemCode(data: any): Observable<any> {
    return this.dataService.post<any>(`Inventory/InventoryTypes`, data);
  }
  getLoadedInventoryData(jobNumber: number,branchCode:string): Observable<any> {
    return this.dataService.get<any>(`Picklist/${jobNumber}?Branch=${branchCode}`);
  }
  getUnLoadedInventoryData(data: any): Observable<any> {
    return this.dataService.post<any>(`Inventory/LoadedPicklist`,data);
  }
  deleteLoadInventory(data: any): Observable<any> {
    return this.dataService.post<any>('Picklist/Delete', data);
  }
  loadInventory(data: any): Observable<any> {
    return this.dataService.post<any>('Inventory/LoadProjectInventory', data);
  }
  unLoadInventory(data: any): Observable<any> {
    return this.dataService.post<any>('Inventory/UnloadProjectInventory', data);
  }
  addLine(data: any): Observable<any> {
    return this.dataService.put<any>('Picklist/AddUpdate', data);
  }
  offLoadInventory(data: any): Observable<any> {
    return this.dataService.post<any>('Inventory/UnloadProjectInventory', data);
  }
  exportToInventoryMovement(data: any): Observable<any> {
    return this.http.post(
      this.baseUrl + `Project/Inventory/Movement/ExportToExcel`,
      data,
      { responseType: 'blob' }
    );
  }
  getInventoryLoadedPicklist(data: any): Observable<any> {
    return this.dataService.get<any>('Project/Inventory/'+data);
  }
  // create budget
  createDeepwellBudget(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'Project/Quotes/DeepWellExportToExcel', data,{ responseType: 'blob' });
  }
  createWellpointBudget(data: any): Observable<any> {
    return this.http.post(this.baseUrl +'Project/Quotes/WellPointExportToExcel', data,{ responseType: 'blob' });
  }

  // Add line items to rental quotes
  addLineItemstoQuotes(data: any): Observable<any> {
    return this.dataService.post<any>('Project/Quote/AddLineItemsToRentalQuote', data);
  }

  getProjectInventoryPicklist(data: any): Observable<any> {
    return this.dataService.post<any>('Project/Inventory/GetProjectInventoryPickList', data);
  }

  
  downloadDocumnet(data: any): Observable<any> {
    return this.http.post(
      this.baseUrl + `Project/Inventory/DownloadDocument`,
      data,
      { responseType: 'blob' }
    );
  }

  getExportToExcelProposalTemplate(data: any): Observable<any> {
    return this.http.post(
      this.baseUrl + `Project/ExportToExcelProposalTemplate`,  data,
    { responseType: 'blob' }
  );
  }
  getExportToExcelProposalPIFTemplate(data: any): Observable<any> {
    return this.http.post(
      this.baseUrl + `Project/ExportToExcelProposalPIFTemplate`,  data,
    { responseType: 'blob' }
  );
  }
  getExportToExcelPIFProposalTemplate(data: any): Observable<any> {
    return this.http.post(
      this.baseUrl + `Project/ExportToExcelProposalPIFTemplate`,  data,
    { responseType: 'blob' }
  );
  }
  getTACPath(UtilityId: number, UtilityType: string): Observable<any> {
    return this.http.get(this.baseUrl + `TreeView/UtilityPath/${UtilityId}/${UtilityType}`);
  }
  LoadQuantity(data: any): Observable<any> {
    return this.dataService.patch<any>(`Picklist/LoadQty`, data);
  }

  getExportToExcelTimeComplete(data: any): Observable<any> {
    return this.http.post(
      this.baseUrl + `Project/ExportToExcelTimeComplete`,  data,
    { responseType: 'blob' }
  );
  }
  getQuotePrint(data: any): Observable<any> {
    return this.http.post(
      this.baseUrl + `Project/ExportToExcelQuotesRentalSales`,  data,
    { responseType: 'blob' }
  );
  }
  //#endregion
}
