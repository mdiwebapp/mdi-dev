import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CacheService } from 'src/app/core/services/cache.service';
import { BaseApiService } from '../../../../core/services/base-api.service';
import { DataService } from '../../../../core/services/data.service';
import { VendorContactModel } from './vendor-contact.model';

@Injectable({
  providedIn: 'root'
})
export class VendorContactService extends BaseApiService<VendorContactModel> {
  constructor(protected dataService: DataService, private http: HttpClient, protected cache: CacheService) {
    super('vendor', dataService, cache);
  }

  // SaveContacts(data: any) {
  //   return this.dataService.put<any>('vendor/Contacts', data)
  // }
  AddContacts(data: any) {
    return this.dataService.post<any>('vendor/Contacts/add', data)
  }
  UpdateContacts(data: any) {
    return this.dataService.patch<any>('vendor/Contacts/update', data)
  }

  GetContactList(id: number): Observable<any> {
    return this.dataService.get<any>(`vendor/${id}/Contacts`);
  }

  GetContactById(id: number): Observable<any> {
    return this.dataService.get<any>(`vendor/Contacts/${id}`);
  }

}