import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConsignmentInfoComponent } from './consignments/consignment-info/consignment-info.component';
import { MunicipalityEmergencyFormsComponent } from './municipality-emergency-forms/municipality-emergency-forms.component';
import { PipelineCorrectComponent } from './pipeline-correct/pipeline-correct.component';
import { SafetyComponent } from './safety/safety.component';
import { DatePipe } from '@angular/common';
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
        path: 'consignment',
        component: ConsignmentInfoComponent,
        data: {
          title: 'Consignment',
        },
      },
      {
        path: 'safety',
        component: SafetyComponent,
        data: {
          title: 'Safety',
        },
      },
      {
        path: 'pipeline-correct',
        component: PipelineCorrectComponent,
        data: {
          title: 'Pipeline Correct',
        },
      },
      {
        path: 'municipality-emergency-forms',
        component: MunicipalityEmergencyFormsComponent,
        data: {
          title: 'Municipality Emergency Forms',
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [DatePipe]
})
export class OperationRoutingModule {}
