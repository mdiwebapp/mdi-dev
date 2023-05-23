import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItRoutingModule } from './it-routing.module';
import { TroubleTicktetsInfoComponent } from './trouble-tickets/trouble-ticktets-info/trouble-ticktets-info.component';
import { TroubleTicktetsSectionComponent } from './trouble-tickets/trouble-ticktets-section/trouble-ticktets-section.component';
import { TroubleTicktetsItProjectsComponent } from './trouble-tickets/trouble-ticktets-it-projects/trouble-ticktets-it-projects.component';
import { SplitterModule, TabStripModule } from '@progress/kendo-angular-layout';
import { GridModule } from '@progress/kendo-angular-grid';
import {
  SwitchModule,
  TextAreaModule,
  TextBoxModule,
} from '@progress/kendo-angular-inputs';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { DatePickerModule } from '@progress/kendo-angular-dateinputs';
import { ComboBoxModule } from '@progress/kendo-angular-dropdowns';

@NgModule({
  declarations: [
    TroubleTicktetsInfoComponent,
    TroubleTicktetsSectionComponent,
    TroubleTicktetsItProjectsComponent,
  ],
  imports: [
    CommonModule,
    ItRoutingModule,
    TabStripModule,
    SplitterModule,
    GridModule,
    TextAreaModule,
    ReactiveFormsModule,
    DialogModule,
    SwitchModule,
    TextBoxModule,
    DatePickerModule,
    ComboBoxModule,
  ],
})
export class ItModule {}
