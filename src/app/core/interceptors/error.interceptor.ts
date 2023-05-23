import { Injector, Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToasterService } from '../services/toaster.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private injector: Injector) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.error instanceof ErrorEvent) {
          this.showError('Clinet error', error.error.message);
        } else {
          switch (error.status) {
            case 400:
              this.handleBadRequest(error);
              break;

            case 401:
              // this.handleUnauthorized(error);
              break;

            case 403:
              this.handleForbidden();
              break;

            case 404:
              this.handleNotFound(error);
              break;

            case 409:
              this.alreadyLoggedIn(error);
              break;

            case 422:
              this.handleValueRequired(error);
              break;

            case 500:
              this.handleServerError(error);
              break;

            default:
              this.handleServerError(error);
              break;
          }
        }

        return throwError(error);
      })
    );
  }

  private handleBadRequest(error: any): void {
    let message = error.message,
      title = error.statusText;
    if (error.error) {
      error = error.error;
    }

    if (error instanceof Object) {
      message = Object.keys(error).map((key) => Reflect.get(error, key));
    } else {
      message = error;
    }

    this.showError(title, message);
  }

  private handleUnauthorized(error: any): void {
    this.showError('Unauthorized', 'Please login again.');
    this.goToRoute('/auth/auth');
  }

  private handleForbidden(): void {
    this.showError('Forbidden', 'You do not have rights to see this page.');
    this.goToRoute('/forbidden');
  }

  private handleValueRequired(error: any): void {
    let messages = [];
    for (let key in error.error) {
      messages.push(error.error[key]);
    }
    const message = messages.join('<br/>');
    this.showError('Required', message);
  }

  private handleNotFound(error: any): void {
    const message = error.message,
      title = error.statusText;
    this.showError(title, message);
    this.goToRoute('/not-found');
  }

  private alreadyLoggedIn(error: any): void {
    const router = this.injector.get(Router);
    router.navigate(['/auth/login', error.error]);
  }

  private handleServerError(error: any): void {
    const message = error.error || error.message,
      title = error.statusText;

    this.showError(title, message);
  }

  private goToRoute(url: string) {
    const router = this.injector.get(Router);
    router.navigate([url]);
  }

  private showError(title: string, message: string): void {
    const toster = this.injector.get(ToasterService);
    toster.error(message);
  }
}
