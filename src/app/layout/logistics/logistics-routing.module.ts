import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { VendorComponent } from './vendor/vendor/vendor.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { VehicleComponent } from './vehicles/vehicle/vehicle.component';

import { BinslistComponent } from './bins/binslist/binslist.component';
import { PartlistComponent } from './parts/partlist/partlist.component';
import { ComponentsComponent } from './components/components/components.component';
import { CycleCountComponent } from './cycle-count/cycle-count.component';
import { PhysicalInvenotryComponent } from './physical-inventory/physical-inventory.component';
import { InventoryTransferComponent } from './inventory-transfer/inventory-transfer.component';
import { PurchasingWrapperComponent } from './purchasing/purchasing-wrapper/purchasing-wrapper.component';
import { BuildingTicketsComponent } from './building-tickets/building-tickets.component';
import { PhysicalInventoryBarcodeComponent } from './physical-inventory-barcode/physical-inventory-barcode.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: '',
        pathMatch: 'full',
      },
      {
        path: 'vendor',
        component: VendorComponent,
        data: {
          title: 'Mersino | Logistics | Vendor ',
        },
      },
      {
        path: 'vehicles',
        component: VehicleComponent,
        data: {
          title: 'Mersino | Logistics | Vehicles ',
        },
      },
      {
        path: 'bins',
        component: BinslistComponent,
        data: {
          title: 'Mersino | Logistics | Bins ',
        },
      },
      {
        path: 'parts',
        component: PartlistComponent,
        data: {
          title: 'Mersino | Logistics | Parts ',
        },
      },
      {
        path: 'components',
        component: ComponentsComponent,
        data: {
          title: 'Mersino | Logistics | Components ',
        },
      },
      {
        path: 'cyclecount',
        component: CycleCountComponent,
        data: {
          title: 'Mersino | Logistics | Cycle Count ',
        },
      },
      {
        path: 'physicalinventory',
        component: PhysicalInvenotryComponent,
        data: {
          title: 'Mersino | Logistics | Physical Inventory ',
        },
      },
      {
        path: 'inventorytransfer',
        component: InventoryTransferComponent,
        data: {
          title: 'Mersino | Logistics | Inventory Transfer ',
        },
      },
      {
        path: 'purchasing',
        component: PurchasingWrapperComponent,
        data: {
          title: 'Mersino | Logistics | Purchase ',
        },
      },
      {
        path: 'building-tickets',
        component: BuildingTicketsComponent,
        data: {
          title: 'Mersino | Logistics | Building Tickets ',
        },
      },
      {
        path: 'physical-inventory-barcode',
        component: PhysicalInventoryBarcodeComponent,
        data: {
          title: 'Mersino | Logistics | Physical Inventory Barcode ',
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [DatePipe],
})
export class LogisticsRoutingModule {}
