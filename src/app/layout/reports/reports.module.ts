import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsRoutingModule } from './reports-routing.module';
import { ChartsModule } from '@progress/kendo-angular-charts';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { IconsModule } from '@progress/kendo-angular-icons';
import { ReportsComponent } from './reports.component';
import { DivisionalRevenueComponent } from './divisionalrevenue/divisionalrevenue.component';
import { DivisionalRevenueRegionComponent } from './divisionalrevenue-region/divisionalrevenue-region.component';
import { UtilizationComponent } from './utilization/utilization.component';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { InventoryTransactionsComponent } from './inventory-transactions/inventory-transactions.component';
import { LastInvoicedComponent } from './ssg/last-invoiced/last-invoiced.component';
import { PipelineReportsComponent } from './pipeline-reports/pipeline-reports.component';
import { ProgressBarModule } from '@progress/kendo-angular-progressbar';
import { ReadyToRentComponent } from './ready-to-rent/ready-to-rent.component';
import { JobCostingComponent } from './job-costing/job-costing.component';
import { TimeTrackingComponent } from './time-tracking/time-tracking.component';
import { CallLogActivityComponent } from './crm/call-log-activity/call-log-activity.component';
import { JobReportComponent } from './operations/job-report/job-report.component';
import { BidBoardComponent } from './crm/bid-board/bid-board.component';
import { SchedulerModule } from '@progress/kendo-angular-scheduler';
import { TimeGridComponent } from './time-grid/time-grid.component';
import { PagerModule } from '@progress/kendo-angular-pager';
import { BomCostingComponent } from './bom-costing/bom-costing.component';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { UtilizationPbReportComponent } from './ssg/utilization-pb-report/utilization-pb-report.component';
import { SalesReportComponent } from './ssg/sales-report/sales-report.component';
import { UtilizationNewPbReportComponent } from './ssg/utilization-new-pb-report/utilization-new-pb-report.component';

@NgModule({
  imports: [
    CommonModule,
    LayoutModule,
    SharedModule,
    FormsModule,
    ChartsModule,
    TooltipModule,
    FormsModule,
    IconsModule,
    ReportsRoutingModule,
    IndicatorsModule,
    ProgressBarModule,
    SchedulerModule,
    PagerModule,
  ],
  declarations: [
    ReportsComponent,
    DivisionalRevenueComponent,
    DivisionalRevenueRegionComponent,
    UtilizationComponent,
    InventoryTransactionsComponent,
    LastInvoicedComponent,
    PipelineReportsComponent,
    ReadyToRentComponent,
    JobCostingComponent,
    TimeTrackingComponent,
    CallLogActivityComponent,
    JobReportComponent,
    BidBoardComponent,
    TimeGridComponent,
    BomCostingComponent,
    CustomerListComponent,
    UtilizationPbReportComponent,
    SalesReportComponent,
    UtilizationNewPbReportComponent,
  ],
  bootstrap: [ReportsComponent],
})
export class ReportsModule {}
