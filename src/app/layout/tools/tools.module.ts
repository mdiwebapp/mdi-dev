import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ToolsRoutingModule } from './tools-routing.module';
import { HrRequestsComponent } from './hr-requests/hr-requests.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { DialogsModule } from '@progress/kendo-angular-dialog';
import { GridModule } from '@progress/kendo-angular-grid';
import { ItRequestComponent } from './it-request/it-request.component';
import { BuildingRequestsComponent } from './building-requests/building-requests.component';
import { TimeClockComponent } from './time-clock/time-clock.component';
import { MainAutoMailersComponent } from './main-auto-mailers/main-auto-mailers.component';
import { MainReportRoutingComponent } from './main-auto-mailers/main-report-routing/main-report-routing.component';
import { MainAutoItComponent } from './main-auto-mailers/main-auto-it/main-auto-it.component';
import { SplitterModule, TabStripModule } from '@progress/kendo-angular-layout';
import { PriceLookupComponent } from './price-lookup/price-lookup.component';
import { DocSearchComponent } from './doc-search/doc-search.component';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { PagerModule } from '@progress/kendo-angular-pager';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
@NgModule({
  declarations: [
    HrRequestsComponent,
    ItRequestComponent,
    BuildingRequestsComponent,
    TimeClockComponent,
    MainAutoMailersComponent,
    MainReportRoutingComponent,
    MainAutoItComponent,
    TimeClockComponent,
    PriceLookupComponent,
    DocSearchComponent,
  ],
  imports: [
    CommonModule,
    ToolsRoutingModule,
    FormsModule,
    InputsModule,
    ReactiveFormsModule,
    DialogsModule,
    GridModule,
    SplitterModule,
    TabStripModule,
    IndicatorsModule,
    PagerModule,
    DropDownsModule
  ],
})
export class ToolsModule {}
