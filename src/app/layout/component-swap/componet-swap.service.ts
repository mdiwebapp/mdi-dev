import { Injectable } from '@angular/core';
import { DataService } from 'src/app/core/services/data.service';
import { BaseApiService } from 'src/app/core/services';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComponetSwapService extends BaseApiService<any>{
  private baseUrl: any;
  constructor(protected dataService: DataService) {
    super('componetswap', dataService, null);
    this.baseUrl = environment.apiUrl
  }

  GetUnits(branchcode: any): Observable<any> {
    return this.dataService.get<any>(`Component/${branchcode}/Units`);
  }

  GetItems(data: any): Observable<any> {
    return this.dataService.post<any>(`Component/notselected/Inventories`, data);
  }

  LoadInventories(data: any) {
    return this.dataService.post<any>(`Component/Selected/Inventories`, data);
  }
  AddRemoveComponent(data: any) {
    return this.dataService.put<any>(`Component/AddRemove`, data);
  }
}
