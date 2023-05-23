import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DropDownModel, EmployeeType} from '../models/drop-down.model';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class DropdownService {
  constructor(public dataService: DataService) { }

  //Get Lookup
  GetLookupList(lookupgroup: string): Observable<DropDownModel[]> {
    return this.dataService.get<DropDownModel[]>(
      `DropDown/lookups/${lookupgroup}`
    );
  }
  GetBranchList(): Observable<DropDownModel[]> {
    return this.dataService.get<DropDownModel[]>(`DropDown/branches`);
  }
  GetCustomerList(data: any): Observable<any> {
    return this.dataService.post<any>(`DropDown/Customers/`, data);
  }
  // GetBranchList(): Observable<DropDownModel[]> {
  //   return this.dataService.get<DropDownModel[]>(`DropDown/user/branches`);
  // }

  GetShipperList(): Observable<DropDownModel[]> {
    return this.dataService.get<DropDownModel[]>(`DropDown/shippers`);
  }
  GetEquivalentList(): Observable<DropDownModel[]> {
    return this.dataService.get<DropDownModel[]>(`DropDown/GPCPartNumber/`);
  }
  GetInventoryTypeList(): Observable<DropDownModel[]> {
    return this.dataService.get<DropDownModel[]>(`DropDown/InventoryType`);
  }
  GetCategoryList(): Observable<DropDownModel[]> {
    return this.dataService.get<DropDownModel[]>(`DropDown/Category`);
  }
  GetSubCategoryList(categoryId): Observable<DropDownModel[]> {
    return this.dataService.get<DropDownModel[]>(
      `DropDown/SubCategory?categoryid=${categoryId}`
    );
  }
  GetVendorList(): Observable<DropDownModel[]> {
    return this.dataService.get<DropDownModel[]>(`DropDown/vendors`);
  }
  GetPONumberList(ShowActive: boolean): Observable<DropDownModel[]> {
    return this.dataService.get<DropDownModel[]>(
      `DropDown/PONumber/${ShowActive}`
    );
  }
  GetLookupListForDivision(
    lookupgroup: string,
    lookUpValue: boolean,
    lookUpCode: boolean
  ): Observable<DropDownModel[]> {
    return this.dataService.get<DropDownModel[]>(
      `DropDown/lookups/${lookupgroup}/${lookUpValue}/${lookUpCode}`
    );
  }
  GetEmployeeList(): Observable<DropDownModel[]> {
    return this.dataService.get<DropDownModel[]>(`DropDown/CalendarEmployees`);
  }
  GetPTOtypeList(): Observable<DropDownModel[]> {
    return this.dataService.get<DropDownModel[]>(`DropDown/PTOTypes`);
  }
  GetEmployee(): Observable<any> {
    return this.dataService.get<any>(`DropDown/employees`);
  }
  GetPart(data: any): Observable<any> {
    return this.dataService.post<any>(`DropDown/PartNumber/`, data);
  }
  GetUserList(): Observable<DropDownModel[]> {
    return this.dataService.get<DropDownModel[]>(`DropDown/Users`);
  }
  GetComponentList(): Observable<DropDownModel[]> {
    return this.dataService.get<DropDownModel[]>(`DropDown/Components`);
  }
  GetGlobalPartList(): Observable<DropDownModel[]> {
    return this.dataService.get<DropDownModel[]>(
      `DropDown/Component/GlobalParts`
    );
  }
  GetJobList(data: any): Observable<any> {
    return this.dataService.post<any>(`DropDown/ServiceOrder/Job`, data);
  }
  GetInvNumberList(branch: any,serviceNumber:any): Observable<DropDownModel[]> {
    return this.dataService.get<DropDownModel[]>(`DropDown/ServiceOrder/${serviceNumber}/InventoryNumbers/${branch}`);
  }
 
  getYearList():Observable<any>{
    return this.dataService.get<any>(`DropDown/AMForecast/Year`);
  }
  getAmEmployee():Observable<any>{
    return this.dataService.get<any>(`DropDown/AMForecast/AM`);
  }
  GetAccountManagerList(): Observable<EmployeeType[]> {
    return this.dataService.get<EmployeeType[]>(`PipeLine/GetAcountManagerList`);
  }
  GetSOAirfilterList(): Observable<any> {
    return this.dataService.post<any>(`DropDown/TechcheckList/Compressor/AirFilterPart`, null);
  }
  GetSupervisonList(data: any): Observable<any> {
    return this.dataService.post<any>(`DropDown/TechcheckList/Supervisor/${data}`, null);
  }
  getChangeOrder(jobNumber:number): Observable<any> {
    return this.dataService.post<any>(`DropDown/Project/Quote/ChangeOrder/${jobNumber}`, null);
  }
  getUserBranch()
  {
    return this.dataService.get<DropDownModel[]>(`DropDown/user/branches`);
  }
  getAMEmployeeByBranch(branch:string)
  {
    return this.dataService.get<any>(`DropDown/AMByBranch/${branch}`);
  }
  GetSalesCallLogJobName()
  {
    return this.dataService.get<any>(`DropDown/SalesCallLogJobName`);
  }
  GetSalesJobKeywordSearch(data:any)
  {
    return this.dataService.post<any>(`DropDown/SalesJobKeywordSearch/`, data);
  }
  GetAllEmployeesList(): Observable<any> {
    return this.dataService.get<any>(`DropDown/AllEmployees`);
  }
}
