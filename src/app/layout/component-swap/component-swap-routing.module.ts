import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ComponentSwapComponent } from './component-swap/component-swap.component';

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
        path: 'componentswap',
        component: ComponentSwapComponent,
        data: {
          title: 'Components Swap',
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComponentSwapRoutingModule {}
