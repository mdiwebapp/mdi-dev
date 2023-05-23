import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BuildingRequestsComponent } from './building-requests/building-requests.component';
import { HrRequestsComponent } from './hr-requests/hr-requests.component';
import { ItRequestComponent } from './it-request/it-request.component';
import { TimeClockComponent } from './time-clock/time-clock.component';
import { MainAutoMailersComponent } from './main-auto-mailers/main-auto-mailers.component';
import { PriceLookupComponent } from './price-lookup/price-lookup.component';
import { DocSearchComponent } from './doc-search/doc-search.component';
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
        path: 'hr-requests',
        component: HrRequestsComponent,
        data: {
          title: 'HR Requests',
        },
      },
      {
        path: 'it-requests',
        component: ItRequestComponent,
        data: {
          title: 'IT Requests',
        },
      },
      {
        path: 'building-requests',
        component: BuildingRequestsComponent,
        data: {
          title: 'Building Requests',
        },
      },
      {
        path: 'time-clock',
        component: TimeClockComponent,
        data: {
          title: 'time-clock',
        },
      },
      {
        path: 'maintain-auto-mailers',
        component: MainAutoMailersComponent,
        data: {
          title: 'Maintain Auto Mailers',
        },
      },
      {
        path: 'price-lookup',
        component: PriceLookupComponent,
        data: {
          title: 'Price Lookup',
        },
      },
      {
        path: 'doc-search',
        component: DocSearchComponent,
        data: {
          title: 'Doc Search',
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
export class ToolsRoutingModule {}
