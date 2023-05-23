import { DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CranesMainComponent } from './cranes/cranes-main/cranes-main.component';
import { FieldNotesComponent } from './field-notes/field-notes.component';
import { FieldFailureComponent } from './field-failure/field-failure.component';
import { ServiceOrderPageComponent } from './serviceorder/serviceorderpage/serviceorderpage.component';
import { SparePartsComponent } from './spareparts/spareparts.component';
import { ServiceDocsComponent } from './service-docs/service-docs.component';

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
        path: 'serviceorder',
        component: ServiceOrderPageComponent,
        data: {
          title: 'Service Order',
        },
      },
      {
        path: 'spareparts',
        component: SparePartsComponent,
        data: {
          title: 'Spare Parts',
        },
      },
      {
        path: 'cranes',
        component: CranesMainComponent,
        data: {
          title: 'Cranes',
        },
      },
      {
        path: 'cranes',
        component: CranesMainComponent,
        data: {
          title: 'Cranes',
        },
      },
      {
        path: 'field-failure',
        component: FieldFailureComponent,
        data: {
          title: 'Field Failure',
        },
      },
      {
        path: 'fieldnotes',
        component: FieldNotesComponent,
        data: {
          title: 'Field Notes',
        },
      },
      {
        path: 'servicedocs',
        component: ServiceDocsComponent,
        data: {
          title: 'Service Docs',
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [DatePipe],
})
export class ServiceOrderRoutingModule {}
