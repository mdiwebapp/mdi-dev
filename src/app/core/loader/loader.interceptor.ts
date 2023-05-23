import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoaderService } from './loader.service';
@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  private pendingRequest = 0;
  constructor(public loaderService: LoaderService) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const hideLoader = req.headers.get('hideLoader');

    if (!hideLoader) {
      this.loaderService.show();
      this.pendingRequest += 1;
    }

    return next.handle(req).pipe(
      finalize(() => {
        if (!hideLoader) {
          this.pendingRequest -= 1;
          if (this.pendingRequest === 0) {
            this.loaderService.hide();
          }
        }
      })
    );
  }
}
