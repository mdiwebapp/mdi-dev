import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InventoryViewComponent } from './inventory-view/inventory-view.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: '',
        pathMatch: 'full',
      },
      {
        path: 'inventoryview',
        component: InventoryViewComponent,
        data: {
          title: 'Inventory View',
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventoryViewRoutingModule {}
