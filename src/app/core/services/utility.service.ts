import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { StorageService } from './storage.service';
import { ToasterService } from './toaster.service';
import { FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UtilityService {
  constructor(
    public data: DataService,
    public storage: StorageService,
    public httpClient: HttpClient,
    public toast: ToasterService
  ) {
    // this.loadBaseSettings()
  }

  validateForm(formGroup: FormGroup, valid: boolean): boolean {
    Object.keys(formGroup.controls).forEach((controlName: string) => {
      const control = formGroup.get(controlName);
      if (control instanceof FormGroup) {
        valid = this.validateForm(control, valid);
      } else {
        if (control.errors) {
          control.markAsTouched();
          valid = false;
        }
      }
    });
    return valid;
  }

  public getTimeZone(): string {
    return /\((.*)\)/.exec(new Date().toString())[1];
  }

  public toBoolean(value: any) {
    if (!value) {
      return value;
    }

    if (typeof value === 'string') {
      value = value.trim().toLowerCase();
    }
    switch (value) {
      case true:
      case 'true':
      case 1:
      case '1':
      case 'on':
      case 'yes':
        return true;
      default:
        return false;
    }
  }

  // private loadBaseSettings(): void {
  //   this.httpClient.get<BaseSettingsModel>('assets/base-settings.json').subscribe((settings) => {
  //     this.storage.setBaseSettings(settings);
  //   });
  // }

  formatLongNumberWithFloat(e) {
    var xAxisValue = e.value;
    if (xAxisValue == 0) {
      return 0;
    } else {
      // for testing
      //value = Math.floor(Math.random()*1001);

      // hundreds
      if (xAxisValue <= 999) {
        return '$' + parseFloat(xAxisValue.toString()).toFixed(2);
      }
      // thousands
      else if (xAxisValue >= 1000 && xAxisValue <= 999999) {
        return (
          '$' + parseFloat((xAxisValue / 1000).toString()).toFixed(2) + 'K'
        );
      }
      // millions
      else if (xAxisValue >= 1000000 && xAxisValue <= 999999999) {
        return (
          '$' + parseFloat((xAxisValue / 1000000).toString()).toFixed(2) + 'M'
        );
      }
      // billions
      else if (xAxisValue >= 1000000000 && xAxisValue <= 999999999999) {
        return (
          '$' +
          parseFloat((xAxisValue / 1000000000).toString()).toFixed(2) +
          'B'
        );
      }
    }
  }

  formatLongNumber(e) {
    var xAxisValue = e.value;
    if (xAxisValue == 0) {
      return 0;
    } else {
      // for testing
      //value = Math.floor(Math.random()*1001);

      // hundreds
      if (xAxisValue <= 999) {
        return '$' + parseFloat(xAxisValue.toString());
      }
      // thousands
      else if (xAxisValue >= 1000 && xAxisValue <= 999999) {
        return '$' + parseFloat((xAxisValue / 1000).toString()) + 'K';
      }
      // millions
      else if (xAxisValue >= 1000000 && xAxisValue <= 999999999) {
        return '$' + parseFloat((xAxisValue / 1000000).toString()) + 'M';
      }
      // billions
      else if (xAxisValue >= 1000000000 && xAxisValue <= 999999999999) {
        return '$' + parseFloat((xAxisValue / 1000000000).toString()) + 'B';
      }
    }
  }
  formatLongNumberPercentage(e) {
    var xAxisValue = e.value;
    if (xAxisValue == 0) {
      return 0;
    } else {
      // for testing
      //value = Math.floor(Math.random()*1001);

      // hundreds
      if (xAxisValue <= 999) {
        return parseFloat(xAxisValue.toString()) + '%';
      }
    }
  }
  formatLongTotalWithFloat(e) {
    var xAxisValue = e.total;
    if (xAxisValue == 0) {
      return 0;
    } else {
      // for testing
      //value = Math.floor(Math.random()*1001);

      // hundreds
      if (xAxisValue <= 999) {
        return '$' + parseFloat(xAxisValue.toString()).toFixed(2);
      }
      // thousands
      else if (xAxisValue >= 1000 && xAxisValue <= 999999) {
        return (
          '$' + parseFloat((xAxisValue / 1000).toString()).toFixed(2) + 'K'
        );
      }
      // millions
      else if (xAxisValue >= 1000000 && xAxisValue <= 999999999) {
        return (
          '$' + parseFloat((xAxisValue / 1000000).toString()).toFixed(2) + 'M'
        );
      }
      // billions
      else if (xAxisValue >= 1000000000 && xAxisValue <= 999999999999) {
        return (
          '$' +
          parseFloat((xAxisValue / 1000000000).toString()).toFixed(2) +
          'B'
        );
      }
    }
  }

  private subject = new Subject<any>();
  private vensubject = new Subject<any>();
  private soSubject = new Subject<any>();
  sendClickEvent(value) {
    this.subject.next(value);
  }
  getClickEvent(): Observable<any> {
    return this.subject.asObservable();
  }
  vensendClickEvent(value) {
    this.vensubject.next(value);
  }
  soCompClickEvent(value){
    this.soSubject.next(value);
  }
  vengetClickEvent(): Observable<any> {
    return this.vensubject.asObservable();
  }

  soGetClickEvent():Observable<any>{
    return this.soSubject.asObservable();
  }
}
