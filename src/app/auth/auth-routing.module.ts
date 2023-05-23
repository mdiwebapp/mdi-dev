import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component'
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { TimeclockComponent } from './timeclock/timeclock.component';
import { DatePipe } from '@angular/common';
const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        pathMatch: 'full'
      },
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'forgot',
        component: ForgotPasswordComponent
      },
      {
        path: 'reset',
        component: ResetPasswordComponent
      },
      {
        path: 'timeclock',
        component: TimeclockComponent
      },
    ]
  }
]

@NgModule({
  imports: [
    CommonModule,
    [RouterModule.forChild(routes)]
  ],
  exports: [
    [RouterModule]
  ],
  providers: [DatePipe]
})
export class AuthRoutingModule {

}
