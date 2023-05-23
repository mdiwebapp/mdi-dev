import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { ChartsModule } from '@progress/kendo-angular-charts';
import 'hammerjs';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { DialogsModule } from '@progress/kendo-angular-dialog';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { EditorModule } from '@progress/kendo-angular-editor';
import { ExcelExportModule } from '@progress/kendo-angular-excel-export';
import { IconsModule } from '@progress/kendo-angular-icons';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { LabelModule } from '@progress/kendo-angular-label';
import { GridModule } from '@progress/kendo-angular-grid';
import { MenuModule } from '@progress/kendo-angular-menu';
import { PagerModule } from '@progress/kendo-angular-pager';
import { PopupModule } from '@progress/kendo-angular-popup';
import { PDFExportModule } from '@progress/kendo-angular-pdf-export';
import { ProgressBarModule } from '@progress/kendo-angular-progressbar';
import { SortableModule } from '@progress/kendo-angular-sortable';
import { ToolBarModule } from '@progress/kendo-angular-toolbar';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { TreeViewModule } from '@progress/kendo-angular-treeview';
import { UploadModule } from '@progress/kendo-angular-upload';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { NotificationModule } from '@progress/kendo-angular-notification';
import { LoaderService } from './core/loader/loader.service';
import { CustomLoaderModule } from './core/loader/customloader.module';
import { TreeListModule } from '@progress/kendo-angular-treelist';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { CoreModule } from '../app/core/core.module';
import { AuthGuard } from './core/guards/auth.guard';
import { DedicatedBranchService } from './core/services/dedicated-branch.service';
import { ErrorMessageService } from './core/services/errormsg.service';
import { SharedModule } from './shared/shared.module';
import { ErrorHandlerService } from './core/services/error-handler.service';
import { FormsModule } from '@angular/forms';
import { SchedulerModule } from '@progress/kendo-angular-scheduler';
import { ScrollViewModule } from '@progress/kendo-angular-scrollview';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    HttpClientJsonpModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-center',
      preventDuplicates: true,
      maxOpened: 1,
      timeOut: 5000,
      autoDismiss: true,
    }),
    BrowserAnimationsModule,
    DropDownsModule,
    LayoutModule,
    ChartsModule,
    CoreModule,
    DateInputsModule,
    DialogsModule,
    InputsModule,
    EditorModule,
    ExcelExportModule,
    IconsModule,
    IndicatorsModule,
    LabelModule,
    GridModule,
    MenuModule,
    PagerModule,
    PopupModule,
    PDFExportModule,
    ProgressBarModule,
    SortableModule,
    ToolBarModule,
    TooltipModule,
    TreeViewModule,
    UploadModule,
    ButtonsModule,
    NotificationModule,
    CustomLoaderModule,
    TreeListModule,
    GooglePlaceModule,
    SharedModule,
    FormsModule,
    SchedulerModule,
    ScrollViewModule,
  ],
  providers: [
    LoaderService,
    AuthGuard,
    Title,
    DedicatedBranchService,
    ErrorMessageService,
    ErrorHandlerService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
