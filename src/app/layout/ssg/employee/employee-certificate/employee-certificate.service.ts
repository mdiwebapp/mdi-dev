import { Injectable } from '@angular/core';
import { DataService } from '../../../../core/services/data.service';
import { BaseApiService } from '../../../../core/services/base-api.service';
import { EmployeeCertificateModel } from './employee-certificate.model'
import { Observable } from 'rxjs';
import { CacheService } from 'src/app/core/services/cache.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeCertificateService extends BaseApiService<EmployeeCertificateModel> {
  constructor(protected dataService: DataService, protected cache: CacheService) {
    super('employee', dataService, cache);
  }

  GetCertificteHeader(): Observable<any> {
    return this.dataService.get<any>(`employee/GetCertificateHeader`);
  }
  GetCertifictes(EmployeeId): Observable<any> {
    return this.dataService.get<any>(`employee/${EmployeeId}/certificates`);
  }

  public SaveCertificates(data: any): Observable<any> {
    return this.dataService.put<any>(`employee/Certificate`, data);
  }

  public DeleteCertificates(id: any): Observable<any> {
    return this.dataService.delete<any>(`employee/Certificate`, id);
  }
}
