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
import { ProjectsRoutingModule } from './projects-routing.module';
import { FloatingLabelModule } from '@progress/kendo-angular-label';
import { PagerModule } from '@progress/kendo-angular-pager';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { GridModule } from '@progress/kendo-angular-grid';
import { ChartsModule } from '@progress/kendo-angular-charts';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProjectsComponent } from './projectspage/projects.component';
import { ProjectsInfoComponent } from './projects-info/projects-info.component';
import { ProjectsQuotesComponent } from './projects-quotes/projects-quotes.component';
import { ProjectsInventoryComponent } from './projects-inventory/projects-inventory.component';
import { ProjectsNotesComponent } from './projects-notes/projects-notes.component';
import { ProjectHistoryComponent } from './project-history/project-history.component';
import { BypassBudgetComponent } from './projects-quotes/popup/bypass-budget/bypass-budget.component';
import { DeepWellBudgetComponent } from './projects-quotes/popup/deep-well-budget/deep-well-budget.component';
import { ProposalTemplatesComponent } from './projects-quotes/popup/proposal-templates/proposal-templates.component';
import { TermsNConditionsComponent } from './projects-quotes/popup/terms-n-conditions/terms-n-conditions.component';
import { WellpointBudgetComponent } from './projects-quotes/popup/wellpoint-budget/wellpoint-budget.component';
import { PAFComponent } from './projects-info/PAF/PAF.component';
import { AddKitComponent } from './projects-quotes/popup/add-kit/add-kit.component';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import {DatePipe} from '@angular/common';
import { NetworkDirectoryModule } from '../networkdirectory/networkdirectory.module';
@NgModule({
  imports: [
    CommonModule,
    ProjectsRoutingModule,
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
    IndicatorsModule,
    NetworkDirectoryModule,
  ],
  declarations: [
    ProjectsComponent,
    ProjectsInfoComponent,
    ProjectsQuotesComponent,
    ProjectsInventoryComponent,
    ProjectsNotesComponent,
    BypassBudgetComponent,
    DeepWellBudgetComponent,
    ProposalTemplatesComponent,
    TermsNConditionsComponent,
    WellpointBudgetComponent,
    ProjectHistoryComponent,
    PAFComponent,
    AddKitComponent,
  ],
  providers: [
    DatePipe,
  
  ],
  bootstrap: [ProjectsComponent],
})
export class ProjectModule {}
