import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment'
import { DataService } from '../core/services/data.service';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public baseUrl = environment.apiUrl

  constructor(
    private dataService: DataService,
    public httpClient: HttpClient,

  ) { }



  login(data: any): Observable<any> {
    return this.dataService.post(`User/Signin`, data);
  }
  verifyOTP(data: any): Observable<any> {
    return this.dataService.post(`User/VerifyOTP`, data);
  }
  updateContact(data: any): Observable<any> {
    return this.dataService.patch(`User/contact`, data);
  }
  logOut(userId: number): Observable<any> {
    return this.dataService.get<any>(`${this.baseUrl}login/logout/${userId}`);
  }

  forgot(data: any): Observable<any> {
    return this.dataService.post(`User/ForgotPassword`, data);
  }

  ResetUserPassword(data: any): Observable<any> {
    return this.dataService.post(`User/ResetPassword`, data);
  }

  ChangePassword(data: any): Observable<any> {
    return this.dataService.post(`User/ChangePassword`, data);
  }
 
}
