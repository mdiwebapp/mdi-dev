import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { FormsModule } from '@angular/forms';
import { IconsModule } from '@progress/kendo-angular-icons';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { IntlModule } from '@progress/kendo-angular-intl';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { FloatingLabelModule } from '@progress/kendo-angular-label';
import { PagerModule } from '@progress/kendo-angular-pager';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { GridModule } from '@progress/kendo-angular-grid';
import { ChartsModule } from '@progress/kendo-angular-charts';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentSwapComponent } from './component-swap/component-swap.component';
import { ComponentSwapRoutingModule } from './component-swap-routing.module';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';

@NgModule({
  imports: [
    CommonModule,
    ComponentSwapRoutingModule,
    FormsModule,
    LayoutModule,
    IconsModule,
    InputsModule,
    LabelModule,
    ButtonsModule,
    DropDownsModule,
    IntlModule,
    DateInputsModule,
    CommonModule,
    SharedModule,
    ChartsModule,
    TooltipModule,
    GridModule,
    FloatingLabelModule,
    PagerModule,
    IndicatorsModule
  ],
  declarations: [ComponentSwapComponent],
  bootstrap: [ComponentSwapComponent],
})
export class ComponentSwapModule {}
