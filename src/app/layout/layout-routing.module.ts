import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: '',
        pathMatch: 'full',
      },
      {
        path: '',
        loadChildren: () =>
          import('./masters/masters.module').then((m) => m.MastersModule),
      },
      {
        path: '',
        loadChildren: () =>
          import('./admin/admin.module').then((m) => m.AdminModule),
      },
      {
        path: '',
        loadChildren: () =>
          import('./logistics/logistics.module').then((m) => m.LogisticsModule),
      },
      {
        path: '',
        loadChildren: () => import('./ssg/ssg.module').then((m) => m.SsgModule),
      },
      {
        path: '',
        loadChildren: () =>
          import('./sales/sales.module').then((m) => m.SalesModule),
      },
      {
        path: '',
        loadChildren: () =>
          import('./reports/reports.module').then((m) => m.ReportsModule),
      },
      {
        path: '',
        loadChildren: () =>
          import('./networkdirectory/networkdirectory.module').then(
            (m) => m.NetworkDirectoryModule
          ),
      },
      {
        path: '',
        loadChildren: () =>
          import('./projects/projects.module').then((m) => m.ProjectModule),
      },
      {
        path: '',
        loadChildren: () =>
          import('./component-swap/component-swap.module').then(
            (m) => m.ComponentSwapModule
          ),
      },
      {
        path: '',
        loadChildren: () =>
          import('./service/serviceorder.module').then(
            (m) => m.ServiceOrderModule
          ),
      },
      {
        path: '',
        loadChildren: () =>
          import('./inventory-view/inventory-view.module').then(
            (m) => m.InventoryViewModule
          ),
      },
      {
        path: '',
        loadChildren: () =>
          import('./operation/operation.module').then((m) => m.OperationModule),
      },
      {
        path: '',
        loadChildren: () =>
          import('./tools/tools.module').then((m) => m.ToolsModule),
      },
      {
        path: '',
        loadChildren: () => import('./it/it.module').then((m) => m.ItModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutRoutingModule {}
