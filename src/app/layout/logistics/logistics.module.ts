import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendorComponent } from './vendor/vendor/vendor.component';
import { VendorInfoComponent } from './vendor/vendor-info/vendor-info.component';
import { VendorMoreInfoComponent } from './vendor/vendor-more-info/vendor-more-info.component';
import { VendorContactComponent } from './vendor/vendor-contact/vendor-contact.component';
import { VendorActivityComponent } from './vendor/vendor-activity/vendor-activity.component';
import { VendorNotesComponent } from './vendor/vendor-notes/vendor-notes.component';
import { VendorHistoryComponent } from './vendor/vendor-history/vendor-history.component';
import { LogisticsRoutingModule } from './logistics-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { GridModule } from '@progress/kendo-angular-grid';
import { VehicleComponent } from './vehicles/vehicle/vehicle.component';
import { VehicleInfoComponent } from './vehicles/vehicle-info/vehicle-info.component';
import { MoreInfoComponent } from './vehicles/more-info/more-info.component';
import { VehicleActivityComponent } from './vehicles/vehicle-activity/vehicle-activity.component';
import { VehicleHistoryComponent } from './vehicles/vehicle-history/vehicle-history.component';
import { VehicleNotesComponent } from './vehicles/vehicle-notes/vehicle-notes.component';
import { HistoryComponent } from './vehicles/history/history.component';
import { BinsComponent } from './bins/bins/bins.component';
import { BinslistComponent } from './bins/binslist/binslist.component';
import { TagsComponent } from './bins/tags/tags.component';
import { PartlistComponent } from './parts/partlist/partlist.component';
import { PartComponent } from './parts/part/part.component';
import { FloatingLabelModule } from '@progress/kendo-angular-label';
import { InventoryComponent } from './parts/inventory/inventory.component';
import { PurchasingComponent } from './parts/purchasing/purchasing.component';
import { PricingComponent } from './parts/pricing/pricing.component';
import { PartInfoComponent } from './parts/part-info/part-info.component';

import { ComponentsNotesComponent } from './components/components-notes/components-notes.component';
import { ComponentsInfoComponent } from './components/components-info/components-info.component';
import { ComponentsHistoryComponent } from './components/components-history/components-history.component';
import { ComponentsComponent } from './components/components/components.component';
import { ComponenterviceHistoryComponent } from './components/component-service-history/component-service-history.component';
import { ComponentActivityComponent } from './components/component-activity/component-activity.component';
import { ChartsModule } from '@progress/kendo-angular-charts';
//import { VendorFooterComponent } from './vendor/vendor-footer/vendor-footer.component';
import { VehicleInventoryComponent } from './vehicles/vehicle-inventory/vehicle-inventory.component';
import { NetworkDirectoryModule } from '../networkdirectory/networkdirectory.module';

import { EngineeringComponent } from './parts/engineering/engineering.component';
import { PartHistoryComponent } from './parts/part-history/part-history.component';
//import { PartfooterComponent } from './parts/partfooter/partfooter.component';
import { PagerModule } from '@progress/kendo-angular-pager';
import { CycleCountComponent } from './cycle-count/cycle-count.component';
import { PhysicalInvenotryComponent } from './physical-inventory/physical-inventory.component';
import { InventoryTransferComponent } from './inventory-transfer/inventory-transfer.component';

import { PurchasingWrapperComponent } from './purchasing/purchasing-wrapper/purchasing-wrapper.component';
import { LineItemsComponent } from './purchasing/lineitems/lineitems.component';
import { PurchaseOrderComponent } from './purchasing/purchase-order/purchase-order.component';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { PurchasingNotesComponent } from './purchasing/purchasing-notes/purchasing-notes.component';
import { PurchaseOrderHistoryComponent } from './purchasing/history/PurchaseOrderHistory';
import { TreeViewModule } from '@progress/kendo-angular-treeview';
import { TreeListModule } from '@progress/kendo-angular-treelist';
import { BuildingTicketsComponent } from './building-tickets/building-tickets.component';
import { PhysicalInventoryBarcodeComponent } from './physical-inventory-barcode/physical-inventory-barcode.component';
@NgModule({
  declarations: [
    VendorComponent,
    VendorInfoComponent,
    VendorMoreInfoComponent,
    VendorContactComponent,
    VendorActivityComponent,
    VendorNotesComponent,
    VendorHistoryComponent,
    VehicleComponent,
    VehicleInfoComponent,
    MoreInfoComponent,
    VehicleActivityComponent,
    VehicleHistoryComponent,
    VehicleNotesComponent,
    HistoryComponent,
    BinsComponent,
    BinslistComponent,
    TagsComponent,
    PartlistComponent,
    PartComponent,
    InventoryComponent,
    PurchasingComponent,
    PricingComponent,
    PartInfoComponent,
    ComponentsComponent,
    ComponentsHistoryComponent,
    ComponenterviceHistoryComponent,
    ComponentsNotesComponent,
    ComponentActivityComponent,
    ComponentsInfoComponent,
    VehicleInventoryComponent,
    EngineeringComponent,
    PartHistoryComponent,
    CycleCountComponent,
    PhysicalInvenotryComponent,
    InventoryTransferComponent,
    //VendorFooterComponent
    PurchasingWrapperComponent,
    LineItemsComponent,
    PurchaseOrderComponent,
    PurchasingNotesComponent,
    PurchaseOrderHistoryComponent,
    BuildingTicketsComponent,
    PhysicalInventoryBarcodeComponent,
  ],
  imports: [
    CommonModule,
    LogisticsRoutingModule,
    SharedModule,
    LayoutModule,
    ChartsModule,
    TooltipModule,
    GridModule,
    FloatingLabelModule,
    NetworkDirectoryModule,
    PagerModule,
    IndicatorsModule,
    TreeViewModule,
    TreeListModule,
  ],
})
export class LogisticsModule {}
