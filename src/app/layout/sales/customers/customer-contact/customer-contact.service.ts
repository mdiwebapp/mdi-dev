import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CacheService } from 'src/app/core/services/cache.service';
import { BaseApiService } from '../../../../core/services/base-api.service';
import { DataService } from '../../../../core/services/data.service';
import { CustomerContactModel } from './customer-contact.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerContactService extends BaseApiService<CustomerContactModel> {
  constructor(protected dataService: DataService, protected cache: CacheService) {
    super('customer', dataService, cache);
  }
  GetContactsList(customerId: number): Observable<any> {
    return this.dataService.get<any>(`Customer/${customerId}/Contacts`);
  }

  GetContactsById(id: number): Observable<any> {
    return this.dataService.get<any>(`Customer/Contact/${id}`);
  }

  public saveContacts(data: any): Observable<any> {
    return this.dataService.put<any>(`Customer/Contact`, data);
  }
}