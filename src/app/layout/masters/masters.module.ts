import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MastersRoutingModule } from "./masters-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DropDownsModule } from "@progress/kendo-angular-dropdowns";
import { InputsModule } from "@progress/kendo-angular-inputs";
import { DateInputsModule } from "@progress/kendo-angular-dateinputs";
import { GridModule } from "@progress/kendo-angular-grid";
import { RouterModule } from "@angular/router";
import { TooltipModule } from "@progress/kendo-angular-tooltip";
import { DialogModule } from "@progress/kendo-angular-dialog";
import { EditorModule } from "@progress/kendo-angular-editor";
import { ToolBarModule } from "@progress/kendo-angular-toolbar";
import { LayoutModule } from "@progress/kendo-angular-layout";
import { ButtonModule, ButtonsModule } from "@progress/kendo-angular-buttons";
import { ChartsModule } from "@progress/kendo-angular-charts";
import { TreeViewModule } from "@progress/kendo-angular-treeview";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { ChangePasswordComponent } from "./change-password/change-password.component";
import { TitlesComponent } from "./Titles/titles/titles.component";
import { TitleslistComponent } from "./Titles/titleslist/titleslist.component";
import { SharedModule } from "../../shared/shared.module";
import { TitleInfoComponent } from './Titles/title-info/title-info.component';
import { TitleRoutingComponent } from './Titles/title-routing/title-routing.component';

@NgModule({
  declarations: [DashboardComponent, ChangePasswordComponent, TitlesComponent, TitleslistComponent, TitleInfoComponent, TitleRoutingComponent],
  imports: [
    CommonModule,
    MastersRoutingModule,
    FormsModule,
    ButtonModule,
    ButtonsModule,
    ReactiveFormsModule,
    DropDownsModule,
    InputsModule,
    DateInputsModule,
    GridModule,
    RouterModule,
    TooltipModule,
    DialogModule,
    EditorModule,
    ToolBarModule,
    LayoutModule,
    ChartsModule,
    TreeViewModule,
    SharedModule
  ]
})
export class MastersModule {}
