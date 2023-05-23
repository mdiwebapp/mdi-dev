import { Injectable } from '@angular/core';
import { Router, Route, CanLoad, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { StorageService } from '../services/storage.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private storageService: StorageService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    if (state.url !== '/login' && !this.storageService.Token) {
      this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
      //this.router.navigate(['/auth/login']);
      return false;
    }
    return true;
  }

  private checkAuthentication(url: string): boolean {
    if (this.storageService.HasToken) {
      return true;
    } else {
      this.router.navigate(['/auth/login']);
      return false;
    }
  }
}
