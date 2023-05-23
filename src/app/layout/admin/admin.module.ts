import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BranchComponent } from './branch/branch.component';
import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { BranchlistComponent } from './branch/branchlist.component';
import { UserComponent } from './user/user.component';
import { UserlistComponent } from './user/userlist.component';
import { UserpermissionComponent } from './userpermission/userpermission.component';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { FilemanagerlistComponent } from './filemanager/filemanagerlist.component';
import { FilemanagerComponent } from './filemanager/filemanager.component';
import { UploadsModule } from '@progress/kendo-angular-upload';
import { TreeViewModule } from '@progress/kendo-angular-treeview';
import { TreeListModule } from '@progress/kendo-angular-treelist';
import { FilemanagerviewComponent } from './filemanager/filemanagerview.component';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { ContextMenuModule } from '@progress/kendo-angular-menu';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { GridModule } from '@progress/kendo-angular-grid';
import { PermissionmoduleComponent } from './permission/permissionmodule/permissionmodule.component';
import { PermissionwrapperComponent } from './permission/permissionwrapper/permissionwrapper.component';
import { PermissiondepartmentComponent } from './permission/permissiondepartment/permissiondepartment.component';
import { PermissionmoduletabComponent } from './permission/permissionmoduletab/permissionmoduletab.component';
import { PermissionmoduletypemapComponent } from './permission/permissionmoduletypemap/permissionmoduletypemap.component';
import { ITComponent } from './IT//it/it.component';
import { PaulComponent } from './IT/paul/paul.component';
import { GowtamaComponent } from './IT/gowtama/gowtama.component';
import { FleetComponent } from './IT/paul/fleet/fleet/fleet.component';
import { FleetInfoComponent } from './IT/paul/fleet/fleet-info/fleet-info.component';
import { FleetNotesComponent } from './IT/paul/fleet/fleet-notes/fleet-notes.component';
import { FleetHistoryComponent } from './IT/paul/fleet/fleet-history/fleet-history.component';
import { FleetActivityComponent } from './IT/paul/fleet/fleet-activity/fleet-activity.component';
import { FleetBomComponent } from './IT/paul/fleet/fleet-bom/fleet-bom.component';
import { PersonalDayCalenderComponent } from './personal-day-calender/personal-day-calender.component';
import { SchedulerModule } from '@progress/kendo-angular-scheduler';
import { EditService } from './../../../data/edit.service';
import { FleetOtherInfoComponent } from './IT/paul/fleet/fleet-other-info/fleet-other-info.component';
import { FleetServiceHistoryComponent } from './IT/paul/fleet/fleet-service-history/fleet-service-history.component';
import { PagerModule } from '@progress/kendo-angular-pager';
import { CallLogComponent } from './call-logs/call-log/call-log.component';
import { CallLogsInfoComponent } from './call-logs/call-logs-info/call-logs-info.component';
import { CallLogsResolutionComponent } from './call-logs/call-logs-resolution/call-logs-resolution.component';
import { CallLogWebInfoComponent } from './call-logs/call-log-web-info/call-log-web-info.component';
import { CallLogPumpInfoComponent } from './call-logs/call-log-pump-info/call-log-pump-info.component';
import { CallLogRfqRequestInfoComponent } from './call-logs/call-log-rfq-request-info/call-log-rfq-request-info.component';
import { CallLogPumpQuoteComponent } from './call-logs/call-log-pump-quote/call-log-pump-quote.component';
import { TimeApprovalInfoComponent } from './time-approval/time-approval-info/time-approval-info.component';
import { TimeTrackingEditComponent } from './time-tracking-edit/time-tracking-edit.component';
import { TimeApprovalFormComponent } from './time-approval/time-approval-form/time-approval-form.component';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { PerDiemEntryComponent } from './per-diem-entry/per-diem-entry.component';
import {JobDescriptionComponent} from './jobDescription/jobDescription.component';
import{OrgChartsComponent} from './orgCharts/orgCharts.component';
import {PoliciesAndProceduresComponent} from './policiesAndProcedures/policiesAndProcedures.component';
import { MemosComponent } from './memos/memos.component';
import { OnCallRotationComponent } from './on-call-rotation/on-call-rotation.component';
import { CompanyFormsComponent } from './company-forms/company-forms.component';
import { NetworkDirectoryModule } from '../networkdirectory/networkdirectory.module';
@NgModule({
  declarations: [
    BranchComponent,
    BranchlistComponent,
    UserComponent,
    UserlistComponent,
    UserpermissionComponent,
    FilemanagerComponent,
    FilemanagerlistComponent,
    FilemanagerviewComponent,
    PermissionmoduleComponent,
    PermissionwrapperComponent,
    PermissiondepartmentComponent,
    PermissionmoduletabComponent,
    PermissionmoduletypemapComponent,
    ITComponent,
    PaulComponent,
    GowtamaComponent,
    FleetComponent,
    FleetInfoComponent,
    FleetNotesComponent,
    FleetHistoryComponent,
    FleetActivityComponent,
    FleetBomComponent,
    FleetOtherInfoComponent,
    PersonalDayCalenderComponent,
    FleetServiceHistoryComponent,
    CallLogComponent,
    CallLogsInfoComponent,
    CallLogsResolutionComponent,
    CallLogWebInfoComponent,
    CallLogPumpInfoComponent,
    CallLogRfqRequestInfoComponent,
    CallLogPumpQuoteComponent,
    TimeApprovalInfoComponent,
    TimeTrackingEditComponent,
    TimeApprovalFormComponent,
    PerDiemEntryComponent,
    JobDescriptionComponent,
    OrgChartsComponent,
    PoliciesAndProceduresComponent,
    MemosComponent,
    OnCallRotationComponent,
    CompanyFormsComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule,
    LayoutModule,
    UploadsModule,
    TreeViewModule,
    TreeListModule,
    TooltipModule,
    ContextMenuModule,
    NgxDocViewerModule,
    GridModule,
    SchedulerModule,
    PagerModule,
    IndicatorsModule,
    NetworkDirectoryModule,
  ],
  providers: [EditService],
})
export class AdminModule {}
