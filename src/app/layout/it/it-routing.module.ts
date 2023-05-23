import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { TroubleTicktetsInfoComponent } from './trouble-tickets/trouble-ticktets-info/trouble-ticktets-info.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: '',
        pathMatch: 'full',
      },
      {
        path: 'trouble-tickets',
        canActivate: [AuthGuard],
        component: TroubleTicktetsInfoComponent,
        data: {
          title: 'Mersino | IT | Trouble Tickets ',
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ItRoutingModule {}
