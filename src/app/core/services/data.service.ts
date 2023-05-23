import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class DataService {
  private baseUrl: string = '';

  constructor(private httpClient: HttpClient) {
    this.baseUrl = environment.apiUrl;
  }

  get<T>(
    url: string,
    id?: number | boolean,
    params?: any,
    headers?: any
  ): Observable<T> {
    const options = {};
    if (params) {
      options['params'] = params;
    }
    if (headers) {
      options['headers'] = headers;
    }

    if (id !== null && id !== undefined) {
      return this.httpClient.get<T>(`${this.baseUrl}${url}/${id}`, options);
    } else {
      return this.httpClient.get<T>(`${this.baseUrl}${url}`, options);
    }
  }

  post<T>(url: string, data: any): Observable<T> {
    return this.httpClient.post<T>(`${this.baseUrl}${url}`, data);
  }

  put<T>(url: string, data: any): Observable<T> {
    return this.httpClient.put<T>(`${this.baseUrl}${url}`, data);
  }

  delete<T>(url: string, id: number): Observable<T> {
    return this.httpClient.delete<T>(`${this.baseUrl}${url}/${id}`);
  }

  patch<T>(url: string, data?: any): Observable<T> {
    return this.httpClient.patch<T>(`${this.baseUrl}${url}`, data);
  }
}
