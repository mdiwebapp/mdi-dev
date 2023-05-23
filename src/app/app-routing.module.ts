import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'auth/login',
        data: {
          title: 'App Dashboard '
        }
      },
      {
        path: '',
        loadChildren: () => import('./layout/layout.module').then((m) => m.CustomLayoutModule),
        data: {
          title: 'Customer  '
        }
      },
      {
        path: 'auth',
        loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
        data: {
          title: 'Auth modules '
        }
      },
      {
        path: 'mediator',
        loadChildren: () => import('./mediator/mediator.module').then((m) => m.MediatorModule),
        data: {
          title: 'App Mediator '
        }
      },
      {path: '**', redirectTo: 'auth/login'}

    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
