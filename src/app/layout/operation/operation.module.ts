import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OperationRoutingModule } from './operation-routing.module';
import { ConsignmentInfoComponent } from './consignments/consignment-info/consignment-info.component';
import { ConsignmentInventoryComponent } from './consignments/consignment-inventory/consignment-inventory.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GridModule } from '@progress/kendo-angular-grid';
import {
  ExpansionPanelModule,
  LayoutModule,
  SplitterModule,
  TabStripModule,
} from '@progress/kendo-angular-layout';
import { ConsignmentInvoiceComponent } from './consignments/consignment-invoice/consignment-invoice.component';
import { ConsignmentPricingComponent } from './consignments/consignment-pricing/consignment-pricing.component';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { ConsignmentReportsComponent } from './consignments/consignment-reports/consignment-reports.component';
import { DatePickerModule } from '@progress/kendo-angular-dateinputs';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { SchedulerModule } from '@progress/kendo-angular-scheduler';
import { ConsignmentNotesComponent } from './consignments/consignment-notes/consignment-notes.component';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { SharedModule } from 'src/app/shared/shared.module';
import { PagerModule } from '@progress/kendo-angular-pager';
import { SafetyComponent } from './safety/safety.component';
import { TreeViewModule } from '@progress/kendo-angular-treeview';
import { PipelineCorrectComponent } from './pipeline-correct/pipeline-correct.component';
import { MunicipalityEmergencyFormsComponent } from './municipality-emergency-forms/municipality-emergency-forms.component';
import { ConsignmentHistoryComponent } from './consignments/consignment-history/consignment-history.component';
@NgModule({
  declarations: [
    ConsignmentInfoComponent,
    ConsignmentInventoryComponent,
    ConsignmentInvoiceComponent,
    ConsignmentPricingComponent,
    ConsignmentReportsComponent,
    ConsignmentNotesComponent,
    SafetyComponent,
    PipelineCorrectComponent,
    MunicipalityEmergencyFormsComponent,
    ConsignmentHistoryComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    LayoutModule,
    IndicatorsModule,
    OperationRoutingModule,
    FormsModule,
    GridModule,
    SplitterModule,
    TabStripModule,
    InputsModule,
    DatePickerModule,
    DialogModule,
    SchedulerModule,
    ExpansionPanelModule,
    ReactiveFormsModule,
    PagerModule,
    TreeViewModule,
  ],
})
export class OperationModule {}
