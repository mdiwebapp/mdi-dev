import { Injectable } from '@angular/core';
import { NotificationService } from '@progress/kendo-angular-notification';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ToasterService {
  constructor(
    private toast: ToastrService,
    private notificationService: NotificationService
  ) {}

  success(message: string) {
    this.notificationService.show({
      content: message,
      cssClass: 'button-notification',
      animation: { type: 'slide', duration: 400 },
      position: { horizontal: 'center', vertical: 'top' },
      type: { style: 'success', icon: true },
      closable: false,
      hideAfter: 3000,
    });
  }

  info(message: string) {
    this.notificationService.show({
      content: message,
      cssClass: 'button-notification',
      animation: { type: 'slide', duration: 400 },
      position: { horizontal: 'center', vertical: 'top' },
      type: { style: 'info', icon: true },
      closable: false,
      hideAfter: 4000,
    });
  }

  warning(message: string) {
    this.notificationService.show({
      content: message,
      cssClass: 'button-notification',
      animation: { type: 'slide', duration: 400 },
      position: { horizontal: 'center', vertical: 'top' },
      type: { style: 'warning', icon: true },
      closable: false,
      hideAfter: 4000,
    });
  }

  error(message: string) {
    this.notificationService.show({
      content: message,
      cssClass: 'button-notification',
      animation: { type: 'slide', duration: 400 },
      position: { horizontal: 'center', vertical: 'top' },
      type: { style: 'error', icon: true },
      closable: false,
      hideAfter: 4000,
    });
  }
}
