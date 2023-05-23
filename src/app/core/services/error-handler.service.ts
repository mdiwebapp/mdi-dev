import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ToasterService } from './toaster.service';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  private moduleName: string;
  private errorMessage: string;
  private customizeError: string;

  private _displayErrorMessage: BehaviorSubject<string> = new BehaviorSubject(
    ''
  );

  constructor(private toastService: ToasterService) {}

  showError(): void {
    let htmlError = {} as any;
    if (this.moduleName) {
      htmlError.moduleName = this.moduleName;
    }

    if (this.customizeError) {
      htmlError.customizedError = this.customizeError;
    }

    if (this.errorMessage) {
      htmlError.errorMessage = this.errorMessage;
    }
    if (Object.keys(htmlError).length)
      this._displayErrorMessage.next(htmlError);
  }

  get displayErrorMessage() {
    return this._displayErrorMessage.asObservable();
  }

  public handleError = (
    error: HttpErrorResponse,
    moduleName: string,
    customizedError?: string
  ) => {
    if (moduleName) {
      this.moduleName = moduleName;
    }

    if (customizedError) {
      this.customizeError = customizedError;
    }

    this.createErrorMessage(error);
    this.showError();
  };

  private createErrorMessage = (error: HttpErrorResponse) => {
    if (
      error &&
      error.error &&
      error.error.errors &&
      (error.error.errors[''] || error.error.errors['Id'])
    ) {
      this.errorMessage = error.error.errors[''][0];
      // this.customizeError = '';
      // this.errorMessage = '';
      // this.moduleName = '';
    } else {
      this.errorMessage = error.error
        ? error.error
          ? error.error.message
          : error.error.message
        : error.statusText;
    }
  };
}
