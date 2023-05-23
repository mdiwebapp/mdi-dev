import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';
import { DivisionalRevenueComponent } from './divisionalrevenue/divisionalrevenue.component';
import { UtilizationComponent } from './utilization/utilization.component';
import { ReportsComponent } from './reports.component';
import { InventoryTransactionsComponent } from './inventory-transactions/inventory-transactions.component';
import { DatePipe } from '@angular/common';
import { LastInvoicedComponent } from './ssg/last-invoiced/last-invoiced.component';
import { PipelineReportsComponent } from './pipeline-reports/pipeline-reports.component';
import { ReadyToRentComponent } from './ready-to-rent/ready-to-rent.component';
import { JobCostingComponent } from './job-costing/job-costing.component';
import { TimeTrackingComponent } from './time-tracking/time-tracking.component';
import { CallLogActivityComponent } from './crm/call-log-activity/call-log-activity.component';
import { JobReportComponent } from './operations/job-report/job-report.component';
import { BidBoardComponent } from './crm/bid-board/bid-board.component';
import { TimeGridComponent } from './time-grid/time-grid.component';
import { BomCostingComponent } from './bom-costing/bom-costing.component';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { UtilizationPbReportComponent } from './ssg/utilization-pb-report/utilization-pb-report.component';
import { SalesReportComponent } from './ssg/sales-report/sales-report.component';
import { UtilizationNewPbReportComponent } from './ssg/utilization-new-pb-report/utilization-new-pb-report.component';

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
        path: 'reports',
        canActivate: [AuthGuard],
        component: ReportsComponent,
        data: {
          title: 'Mersino | Reports ',
        },
      },
      {
        path: 'divisional-revenue',
        canActivate: [AuthGuard],
        component: DivisionalRevenueComponent,
        data: {
          title: 'Mersino | Reports | Divisional Revenue ',
        },
      },
      {
        path: 'utilization',
        canActivate: [AuthGuard],
        component: UtilizationComponent,
        data: {
          title: 'Mersino | Reports | Utilization ',
        },
      },
      {
        path: 'inventory-transaction',
        canActivate: [AuthGuard],
        component: InventoryTransactionsComponent,
        data: {
          title: 'Mersino | Reports | Inventory Transaction ',
        },
      },
      {
        path: 'last-invoiced',
        canActivate: [AuthGuard],
        component: LastInvoicedComponent,
        data: {
          title: 'Mersino | Reports | Last Invoiced ',
        },
      },
      {
        path: 'pipeline-reports',
        canActivate: [AuthGuard],
        component: PipelineReportsComponent,
        data: {
          title: 'Mersino | Reports | Pipeline Reports ',
        },
      },
      {
        path: 'ready-to-rent',
        canActivate: [AuthGuard],
        component: ReadyToRentComponent,
        data: {
          title: 'Mersino | Reports | Ready to Rent ',
        },
      },
      {
        path: 'job-costing',
        canActivate: [AuthGuard],
        component: JobCostingComponent,
        data: {
          title: 'Mersino | Reports | Job Costing ',
        },
      },
      {
        path: 'time-tracking-reports',
        canActivate: [AuthGuard],
        component: TimeTrackingComponent,
        data: {
          title: 'Mersino | Reports | Time Tracking Reports ',
        },
      },
      {
        path: 'call-log-activity',
        canActivate: [AuthGuard],
        component: CallLogActivityComponent,
        data: {
          title: 'Mersino | Reports | Call Log Activity',
        },
      },
      {
        path: 'job-report',
        canActivate: [AuthGuard],
        component: JobReportComponent,
        data: {
          title: 'Mersino | Reports | Job Report ',
        },
      },
      {
        path: 'bid-board',
        canActivate: [AuthGuard],
        component: BidBoardComponent,
        data: {
          title: 'Mersino | Reports | Bid Board ',
        },
      },
      {
        path: 'time-grid',
        canActivate: [AuthGuard],
        component: TimeGridComponent,
        data: {
          title: 'Mersino | Reports | Time Grid',
        },
      },
      {
        path: 'customer-list',
        canActivate: [AuthGuard],
        component: CustomerListComponent,
        data: {
          title: 'Mersino | Reports |Customer List',
        },
      },
      {
        path: 'utilization-pb-report',
        canActivate: [AuthGuard],
        component: UtilizationPbReportComponent,
        data: {
          title: 'Mersino | Reports | Utilization PB Report',
        },
      },
      {
        path: 'utilization-new-pb-report',
        canActivate: [AuthGuard],
        component: UtilizationNewPbReportComponent,
        data: {
          title: 'Mersino | Reports | Utilization PB Report',
        },
      },
      {
        path: 'sales-report',
        canActivate: [AuthGuard],
        component: SalesReportComponent,
        data: {
          title: 'Mersino | Reports | Sales Report',
        },
      },
      // {
      //   path: 'bom-costing',
      //   canActivate: [AuthGuard],
      //   component: BomCostingComponent,
      //   data: {
      //     title: 'Mersino | Reports |Bom Costing',
      //   },
      // },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [DatePipe],
})
export class ReportsRoutingModule {}
