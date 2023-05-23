import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TitlesComponent } from './Titles/titles/titles.component';



const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: '',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        canActivate: [AuthGuard],
        component: DashboardComponent,
        data: {
          title: 'Mersino | Dashboard '
        }
      },
      {
        path: 'changepassword',
        canActivate: [AuthGuard],
        component: ChangePasswordComponent,
        data: {
          title: 'Mersino | Change Password '
        }
      },
      {
        path: 'titles',
        canActivate: [AuthGuard],
        component: TitlesComponent,
        data: {
          title: 'Mersino | Titles '
        }
      }
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MastersRoutingModule { }
