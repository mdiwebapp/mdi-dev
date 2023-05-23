import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonHeadersComponent } from './commonHeaders/common-headers.component';
import { LoginComponent } from './login/login.component';
import { AuthRoutingModule } from './auth-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { TwofactorAuthComponent } from './twofactor-auth/twofactor-auth.component';
import { HttpClientModule } from '@angular/common/http';
import { TimeclockComponent } from './timeclock/timeclock.component';
import { FormsModule } from '@angular/forms';
import { LayoutModule } from '@progress/kendo-angular-layout';

@NgModule({
  declarations: [CommonHeadersComponent, LoginComponent, ForgotPasswordComponent, ResetPasswordComponent, TwofactorAuthComponent, TimeclockComponent],
  imports: [
    CommonModule,
    AuthRoutingModule,
    SharedModule,
    HttpClientModule,
    FormsModule,
    LayoutModule
  ]
})
export class AuthModule { }
