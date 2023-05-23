import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NetworkDirectoryComponent } from './networkdirectorypage/networkdirectory.component';

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
        path: 'networkdirectory',
        component: NetworkDirectoryComponent,
        data: {
          title: 'Network Directory ',
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NetworkDirectoryRoutingModule { }
