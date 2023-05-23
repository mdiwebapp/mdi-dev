import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { LayoutRoutingModule } from './layout-routing.module';
import { HeaderComponent } from './components/header/header.component';
import { LayoutComponent } from './layout.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TreeViewModule } from '@progress/kendo-angular-treeview';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { TreeListModule } from '@progress/kendo-angular-treelist';
import { NavigationModule } from '@progress/kendo-angular-navigation';
import { IconModule } from '@progress/kendo-angular-icons';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { VendorFooterComponent } from './logistics/vendor/vendor-footer/vendor-footer.component';
import { FleetFooterComponent } from './admin/IT/paul/fleet/fleet-footer/fleet-footer.component';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { PartfooterComponent } from './logistics/parts/partfooter/partfooter.component';
import { ServiceFooterComponent } from './service/serviceorder/service-footer/service-footer.component';

@NgModule({
  declarations: [
    HeaderComponent,
    LayoutComponent,
    SidebarComponent,
    VendorFooterComponent,
    FleetFooterComponent,
    PartfooterComponent,
    ServiceFooterComponent,
  ],
  imports: [
    CommonModule,
    ButtonsModule,
    DropDownsModule,
    FormsModule,
    ReactiveFormsModule,
    LayoutRoutingModule,
    TreeViewModule,
    LayoutModule,
    TreeListModule,
    LayoutModule,
    NavigationModule,
    IconModule,
    IndicatorsModule,
    TooltipModule,
  ],
})
export class CustomLayoutModule {}
