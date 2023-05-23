import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NetworkDirectoryComponent } from './networkdirectorypage/networkdirectory.component';
import { NetworkDirectoryRoutingModule } from './networkdirectory-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TreeViewModule } from '@progress/kendo-angular-treeview';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { PopupModule } from '@progress/kendo-angular-popup';
import { InputsModule } from '@progress/kendo-angular-inputs';
@NgModule({
  declarations: [NetworkDirectoryComponent],
  imports: [
    CommonModule,
    PopupModule,
    LayoutModule,
    InputsModule,
    FormsModule,
    ReactiveFormsModule,
    NetworkDirectoryRoutingModule,
    TreeViewModule,
  ],
  exports: [
    NetworkDirectoryComponent, // <--- Enable using the component in other modules
  ],
})
export class NetworkDirectoryModule {}
