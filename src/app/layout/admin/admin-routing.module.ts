import { NgModule } from '@angular/core';
import { BranchComponent } from './branch/branch.component';
import { Routes, RouterModule } from '@angular/router';
import { UserComponent } from './user/user.component';
import { UserpermissionComponent } from './userpermission/userpermission.component';
//import { FilemanagerComponent } from './filemanager/filemanager.component';
import { FilemanagerviewComponent } from './filemanager/filemanagerview.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { PermissionwrapperComponent } from './permission/permissionwrapper/permissionwrapper.component';
import { PermissionmoduletypemapComponent } from './permission/permissionmoduletypemap/permissionmoduletypemap.component';
import { PaulComponent } from './IT/paul/paul.component';
import { GowtamaComponent } from './IT/gowtama/gowtama.component';
import { FleetComponent } from './IT/paul/fleet/fleet/fleet.component';
import { PersonalDayCalenderComponent } from './personal-day-calender/personal-day-calender.component';
import { DatePipe } from '@angular/common';
import { CallLogComponent } from './call-logs/call-log/call-log.component';
import { TimeApprovalInfoComponent } from './time-approval/time-approval-info/time-approval-info.component';
import { TimeTrackingEditComponent } from './time-tracking-edit/time-tracking-edit.component';
import { PerDiemEntryComponent } from './per-diem-entry/per-diem-entry.component';
import { JobDescriptionComponent } from './jobDescription/jobDescription.component';
import { OrgChartsComponent } from './orgCharts/orgCharts.component';
import { PoliciesAndProceduresComponent } from './policiesAndProcedures/policiesAndProcedures.component';
import { MemosComponent } from './memos/memos.component';
import { OnCallRotationComponent } from './on-call-rotation/on-call-rotation.component';
import { CompanyFormsComponent } from './company-forms/company-forms.component';

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
        path: 'branch',
        component: BranchComponent,
        data: {
          title: 'Mersino | Admin | Branch ',
        },
      },
      {
        path: 'user',
        component: UserComponent,
        data: {
          title: 'Mersino | Admin | User ',
        },
      },
      {
        path: 'userpermission',
        component: UserpermissionComponent,
        data: {
          title: 'Mersino | Admin | User Permission ',
        },
      },
      {
        path: 'permission',
        component: PermissionwrapperComponent,
        data: {
          title: 'Mersino | Admin | Permission ',
        },
      },
      {
        path: 'permissionmap',
        component: PermissionmoduletypemapComponent,
        data: {
          title: 'Mersino | Admin | Permission Map',
        },
      },
      {
        path: 'companyforms',
        component: CompanyFormsComponent,
        data: {
          title: 'Mersino | Admin | Company forms ',
        },
      },
      {
        path: 'paul',
        component: PaulComponent,
        data: {
          title: 'Mersino | Admin | IT | Paul ',
        },
      },
      {
        path: 'fleet',
        component: FleetComponent,
        data: {
          title: 'Mersino | Admin | IT | Fleet ',
        },
      },
      {
        path: 'gowtama',
        component: GowtamaComponent,
        data: {
          title: 'Mersino | Admin | IT | Gowtama',
        },
      },
      {
        path: 'personaldaycalender',
        component: PersonalDayCalenderComponent,
        data: {
          title: 'Mersino | Admin | Personal Day Calender ',
        },
      },
      {
        path: 'calllog',
        component: CallLogComponent,
        data: {
          title: 'Mersino | Admin | Call Log ',
        },
      },
      {
        path: 'time-approval',
        component: TimeApprovalInfoComponent,
        data: {
          title: 'Mersino | Admin | Time Approval ',
        },
      },
      {
        path: 'time-tracking-edit-entry',
        component: TimeTrackingEditComponent,
        data: {
          title: 'Mersino | Admin | Time Tracking Edit/Entry ',
        },
      },
      {
        path: 'per-diem-entry',
        component: PerDiemEntryComponent,
        data: {
          title: 'Mersino | Admin | Per Diem Entry ',
        },
      },
      {
        path: 'jobdescription',
        component: JobDescriptionComponent,
        data: {
          title: 'Mersino | Admin | Job Descriptions ',
        },
      },
      {
        path: 'orgcharts',
        component: OrgChartsComponent,
        data: {
          title: 'Mersino | Admin | Org Charts',
        },
      },
      {
        path: 'policiesProcedures',
        component: PoliciesAndProceduresComponent,
        data: {
          title: 'Mersino | Admin | Policies And Procedures',
        },
      },
      {
        path: 'memos',
        component: MemosComponent,
        data: {
          title: 'Mersino | Admin | Memos',
        },
      },
      {
        path: 'on-call-rotation',
        component: OnCallRotationComponent,
        data: {
          title: 'Mersino | Admin | On Call Rotation',
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
export class AdminRoutingModule {}
