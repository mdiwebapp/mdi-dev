import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StorageService, DataService } from './services';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { AuthGuard } from './guards/auth.guard';
import { SharedModule } from '../shared/shared.module';
import { NotificationModule } from '@progress/kendo-angular-notification';
@NgModule({
  declarations: [],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NotificationModule],
  providers: [
    DataService,
    StorageService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
})
export class CoreModule {}
