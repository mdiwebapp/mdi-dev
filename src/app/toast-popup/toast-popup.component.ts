import { Component, OnInit, Input } from '@angular/core';
import { ErrorHandlerService } from 'src/app/core/services';
@Component({
  selector: 'app-toast-popup',
  templateUrl: './toast-popup.component.html',
  styleUrls: ['./toast-popup.component.scss'],
})
export class ToastPopupComponent implements OnInit {
  @Input() dialogOpened: boolean;
  openErrorDialog: boolean;
  errorDetails: any;
  @Input() errorMsg: any;
  subscription: any;
  constructor(private errorHandler: ErrorHandlerService) {}

  ngOnInit(): void {
    this.subscription = this.errorHandler.displayErrorMessage.subscribe(
      (messageData) => {
        this.errorDetails = messageData;
        this.openErrorDialog = true;
      }
    );
  }

  onLoginClose() {}
  public close() {
    this.dialogOpened = false;
    this.errorMsg = '';
  }

  public closeError() {
    this.openErrorDialog = false;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
