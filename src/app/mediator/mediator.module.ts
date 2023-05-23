import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediatorComponent } from './mediator.component';
import { MediatorRoutingModule } from './mediator-routing.module';

@NgModule({
  declarations: [MediatorComponent],
  imports: [
    CommonModule,
    MediatorRoutingModule    
  ]
})
export class MediatorModule { }
