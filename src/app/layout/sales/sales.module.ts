import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { LayoutModule, SplitterModule } from '@progress/kendo-angular-layout';
// import { CustomerComponent } from './customers/customer/customer.component';
import { SalesRoutingModule } from './sales-routing.module';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
// import { CustomerInfoComponent } from './customers/customer-info/customer-info.component';
// import { OtherInfoComponent } from './customers/other-info/other-info.component';
// import { CustomerContactComponent } from './customers/customer-contact/customer-contact.component';
// import { CustomerNotesComponent } from './customers/customer-notes/customer-notes.component';
// import { CustomerActivityComponent } from './customers/customer-activity/customer-activity.component';
// import { CustomerCollectionComponent } from './customers/customer-collection/customer-collection.component';
// import { CustomerHistoryComponent } from './customers/customer-history/customer-history.component';
import { CallLogsComponent } from './call-logs/call-log/call-log.component';
import { KeywordSearchPopupComponent } from './call-logs/keyword-search-popup/keyword-search-popup.component';
import { CustomerInfoComponent } from './customer/customer-info/customer-info.component';
import { CustomerDetailsComponent } from './customer/customer-details/customer-details.component';
import { OtherInfoComponent } from './customer/other-info/other-info.component';
import { ContactsDetailsComponent } from './customer/contacts-details/contacts-details.component';
import { CallLogformComponent } from './customer/call-logform/call-logform.component';
import { ActivityComponent } from './customer/activity/activity.component';
import { CollectionsComponent } from './customer/collections/collections.component';
import { CustomerNotesComponent } from './customer/customer-notes/customer-notes.component';
import { CustomerHistoryComponent } from './customer/customer-history/customer-history.component';
import {SalesSupportComponent} from './salesSupport/salesSupport.component';
import {PhotosComponent} from './photos/photos.component';
import {TradeShowComponent} from './tradeShows/tradeShows.component';
import {VideosComponent} from './videos/videos.component';
import {BrandingComponent} from './branding/branding.component';
import { TreeViewModule } from '@progress/kendo-angular-treeview';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { EngineeringCatalogComponent } from './engineering-catalog/engineering-catalog.component';
import { PagerModule } from '@progress/kendo-angular-pager';

@NgModule({
  declarations: [
    // CustomerComponent,
    // CustomerInfoComponent,
    // OtherInfoComponent,
    // CustomerContactComponent,
    // CustomerNotesComponent,
    // CustomerActivityComponent,
    // CustomerCollectionComponent,
    // CustomerHistoryComponent,
    CallLogsComponent,
    KeywordSearchPopupComponent,
    CustomerInfoComponent,
    CustomerDetailsComponent,
    // OtherInfoComponent,
    OtherInfoComponent,
    ContactsDetailsComponent,
    CallLogformComponent,
    ActivityComponent,
    CollectionsComponent,
    CustomerNotesComponent,
    CustomerHistoryComponent,
    SalesSupportComponent,
    PhotosComponent,
    TradeShowComponent,
    VideosComponent,
    BrandingComponent,
    EngineeringCatalogComponent
  ],
  imports: [
    CommonModule,
    SalesRoutingModule,
    SharedModule,
    LayoutModule,
    TooltipModule,
    SplitterModule,
    TreeViewModule,
    IndicatorsModule,
    PagerModule
  ],
})
export class SalesModule {}
