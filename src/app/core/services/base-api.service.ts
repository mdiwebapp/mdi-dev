import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { DataService } from './data.service';
import { CacheService } from './cache.service';
@Injectable({
  providedIn: 'root',
})
export class BaseApiService<T> {
  protected readonly refreshSubject = new Subject();
  constructor(private ctrl: string, protected dataService: DataService, protected cache: CacheService) { }

  getOneById(id: number): Observable<T> {
    return this.dataService.get<T>(this.ctrl, id);
  }

  public getAll(): Observable<T[]> {
    return this.dataService.get<T[]>(this.ctrl);
  }

  public save(data: T): Observable<any> {
    return this.dataService.put<any>(this.ctrl, data);
  }

  public saveList(data: T[]): Observable<any> {
    return this.dataService.put<any>(this.ctrl, data);
  }

  public savePost(data: T): Observable<any> {
    return this.dataService.post<any>(this.ctrl, data);
  }

  public savePatch(data: T): Observable<any> {
    return this.dataService.patch<any>(this.ctrl, data);
  }

  public delete(id: number): Observable<void> {
    return this.dataService.delete<void>(this.ctrl, id);
  }
}
