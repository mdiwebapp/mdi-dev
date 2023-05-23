import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private _visible: BehaviorSubject<boolean>;
  constructor() {
    this._visible = new BehaviorSubject(false);
  }
  get visible(): Observable<any> {
    return this._visible.asObservable();
  }

  show(): void {
    this._visible.next(true);
  }

  hide(): void {
    this._visible.next(false);
  }
}
