import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { GridModule, PDFModule, ExcelModule } from "@progress/kendo-angular-grid";
import { InputsModule } from "@progress/kendo-angular-inputs";
import { ButtonModule, ButtonsModule } from "@progress/kendo-angular-buttons";
import { DropDownsModule } from "@progress/kendo-angular-dropdowns";
import { DateInputsModule } from "@progress/kendo-angular-dateinputs";
import { TooltipModule } from "@progress/kendo-angular-tooltip";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { DialogModule } from "@progress/kendo-angular-dialog";
import { EditorModule } from "@progress/kendo-angular-editor";
import { ToolBarModule } from "@progress/kendo-angular-toolbar";
import { LayoutModule } from "@progress/kendo-angular-layout";
import { NotificationModule } from "@progress/kendo-angular-notification";
import { GoogleMapAddressComponent } from "../layout/ssg/google-map-address/google-map-address.component";
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { ToastPopupComponent } from "./../toast-popup/toast-popup.component";
@NgModule({
  declarations: [GoogleMapAddressComponent, ToastPopupComponent],
  imports: [
    CommonModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    ButtonsModule,
    DropDownsModule,
    InputsModule,
    DateInputsModule,
    GridModule,
    PDFModule,
    ExcelModule,
    RouterModule,
    TooltipModule,
    DialogModule,
    EditorModule,
    ToolBarModule,
    LayoutModule,
    NotificationModule,
    GooglePlaceModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    ButtonsModule,
    InputsModule,
    DropDownsModule,
    DateInputsModule,
    GridModule,
    PDFModule,
    ExcelModule,
    DialogModule,
    EditorModule,
    ToolBarModule,
    GoogleMapAddressComponent,
    ToastPopupComponent
  ]
})
export class SharedModule {}
