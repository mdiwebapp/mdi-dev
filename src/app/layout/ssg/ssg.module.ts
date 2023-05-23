import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeComponent } from './employee/employee/employee.component';
import { SsgRoutingModule } from './ssg-routing.module';
import { SharedModule } from '../../../app/shared/shared.module';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { EmployeeMoreinfoComponent } from './employee/employee-moreinfo/employee-moreinfo.component';
import { EmployeeWorkComponent } from './employee/employee-work/employee-work.component';
import { EmployeeActivityComponent } from './employee/employee-activity/employee-activity.component';
import { EmployeeCertificateComponent } from './employee/employee-certificate/employee-certificate.component';
import { EmployeeEquipComponent } from './employee/employee-equip/employee-equip.component';
import { EmployeeNotesComponent } from './employee/employee-notes/employee-notes.component';
import { EmployeeHistoryComponent } from './employee/employee-history/employee-history.component';
import { TreeListModule } from '@progress/kendo-angular-treelist';
import { GoogleMapAddressComponent } from './google-map-address/google-map-address.component';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { DevicesComponent } from './devices/devices/devices.component';
import { DevicesInfoComponent } from './devices/devices-info/devices-info.component';
import { DevicesNotesComponent } from './devices/devices-notes/devices-notes.component';
import { DevicesHistoryComponent } from './devices/devices-history/devices-history.component';
import { PagerModule } from '@progress/kendo-angular-pager';
import { RequestTicketComponent } from './hr/request-ticket/request-ticket.component';
import { ForecastComponent } from './forecast/forecast.component';
import { EmployeeInfoComponent } from './employees/employee-info/employee-info.component';
import { EmployeePersonalInfoComponent } from './employees/employee-personal-info/employee-personal-info.component';
import { EmployeeWorkInfoComponent } from './employees/employee-work-info/employee-work-info.component';
import { EmployeeActivityPtoComponent } from './employees/employee-activity-pto/employee-activity-pto.component';
import { EmployeeCertificationComponent } from './employees/employee-certification/employee-certification.component';
// import { EmployeeEquipComponent } from './employees/employee-equip/employee-equip.component';
// import { EmployeeNotesComponent } from './employees/employee-notes/employee-notes.component';
// import { EmployeeHistoryComponent } from './employees/employee-history/employee-history.component';
import { VacationDaysReportsComponent } from './hr/vacation-days-reports/vacation-days-reports.component';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { MaintainUnionsComponent } from './hr/maintain-unions/maintain-unions.component';
import { PayrollInterfaceComponent } from './payroll-interface/payroll-interface.component';
import {
  ProgressBarComponent,
  ProgressBarModule,
} from '@progress/kendo-angular-progressbar';
import { EmployeeRequisitonComponent } from './hr/employee-requisiton/employee-requisiton.component';
import {DatePipe} from '@angular/common';
import { SchedulerModule } from '@progress/kendo-angular-scheduler';
@NgModule({
  declarations: [
    EmployeeComponent,
    EmployeeMoreinfoComponent,
    EmployeeWorkComponent,
    EmployeeActivityComponent,
    EmployeeCertificateComponent,
    EmployeeEquipComponent,
    EmployeeNotesComponent,
    EmployeeHistoryComponent,
    DevicesComponent,
    DevicesInfoComponent,
    DevicesNotesComponent,
    DevicesHistoryComponent,
    ForecastComponent,
    RequestTicketComponent,
    EmployeeInfoComponent,
    EmployeePersonalInfoComponent,
    EmployeeWorkInfoComponent,
    EmployeeActivityPtoComponent,
    EmployeeCertificationComponent,
    // EmployeeEquipComponent,
    // EmployeeNotesComponent,
    // EmployeeHistoryComponent,
    VacationDaysReportsComponent,
    MaintainUnionsComponent,
    PayrollInterfaceComponent,
    EmployeeRequisitonComponent,
  ],
  imports: [
    CommonModule,
    SsgRoutingModule,
    SharedModule,
    TreeListModule,
    LayoutModule,
    GooglePlaceModule,
    TooltipModule,
    PagerModule,
    IndicatorsModule,
    ProgressBarModule,
    SchedulerModule
  ],
  providers: [
    DatePipe,
  
  ],
})
export class SsgModule {}
