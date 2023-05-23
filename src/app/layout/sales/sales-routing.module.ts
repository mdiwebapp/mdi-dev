import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
// import { CustomerComponent } from './customers/customer/customer.component';
import { CallLogsComponent } from './call-logs/call-log/call-log.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { CustomerInfoComponent } from './customer/customer-info/customer-info.component';
import { SalesSupportComponent } from './salesSupport/salesSupport.component';
import { PhotosComponent } from './photos/photos.component';
import { TradeShowComponent } from './tradeShows/tradeShows.component';
import { VideosComponent } from './videos/videos.component';
import { BranchComponent } from '../admin/branch/branch.component';
import { BrandingComponent } from './branding/branding.component';
import { EngineeringCatalogComponent } from './engineering-catalog/engineering-catalog.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: '',
        pathMatch: 'full',
      },
      // {
      //   path: 'customers',
      //   component: CustomerComponent,
      //   data: {
      //     title: 'Mersino | Sales | Customer ',
      //   },
      // },
      {
        path: 'customers',
        canActivate: [AuthGuard],
        component: CustomerInfoComponent,
        data: {
          title: 'Mersino | Sales | Customer ',
        },
      },
      {
        path: 'calllogs',
        component: CallLogsComponent,
        data: {
          title: 'Mersino | Sales | Call Logs ',
        },
      },
      {
        path: 'salessupport',
        component: SalesSupportComponent,
        data: {
          title: 'Mersino | Sales | Sales Support ',
        },
      },
      {
        path: 'photos',
        component: PhotosComponent,
        data: {
          title: 'Mersino | Sales | Photos ',
        },
      },
      {
        path: 'tradeshow',
        component: TradeShowComponent,
        data: {
          title: 'Mersino | Sales | Trade Show ',
        },
      },
      {
        path: 'videos',
        component: VideosComponent,
        data: {
          title: 'Mersino | Sales | Videos ',
        },
      },
      {
        path: 'branding',
        component: BrandingComponent,
        data: {
          title: 'Mersino | Sales | Branding ',
        },
      },
      {
        path: 'engineering-catalog',
        component: EngineeringCatalogComponent,
        data: {
          title: 'Mersino | Sales | Engineering Catalog ',
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalesRoutingModule {}
