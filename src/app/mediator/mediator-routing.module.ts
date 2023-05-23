import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediatorComponent } from './mediator.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component:MediatorComponent,
        pathMatch: 'full',
		data : {  
			title: 'Mersino | Mediator '  
		}
      }
    ]
  }
]


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    [RouterModule.forChild(routes)]
  ],
  exports: [
    [RouterModule]
  ]
})
export class MediatorRoutingModule { }
