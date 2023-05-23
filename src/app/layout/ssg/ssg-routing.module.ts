import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { EmployeeComponent } from './employee/employee/employee.component';
import { DevicesComponent } from './devices/devices/devices.component';
import { GoogleMapAddressComponent } from './google-map-address/google-map-address.component';
import { DatePipe } from '@angular/common';
import { ForecastComponent } from './forecast/forecast.component';
import { RequestTicketComponent } from './hr/request-ticket/request-ticket.component';
import { EmployeeInfoComponent } from './employees/employee-info/employee-info.component';
import { VacationDaysReportsComponent } from './hr/vacation-days-reports/vacation-days-reports.component';
import { MaintainUnionsComponent } from './hr/maintain-unions/maintain-unions.component';
import { PayrollInterfaceComponent } from './payroll-interface/payroll-interface.component';
import { EmployeeRequisitonComponent } from './hr/employee-requisiton/employee-requisiton.component';

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
        path: 'employee',
        canActivate: [AuthGuard],
        component: EmployeeComponent,
        data: {
          title: 'Mersino | SSG | Employee ',
        },
      },
      {
        path: 'devices',
        canActivate: [AuthGuard],
        component: DevicesComponent,
        data: {
          title: 'Mersino | SSG | Devices ',
        },
      },
      {
        path: 'hr-request-tickets',
        canActivate: [AuthGuard],
        component: RequestTicketComponent,
        data: {
          title: 'Mersino | SSG | HR Request Tickets ',
        },
      },
      {
        path: 'forecast',
        canActivate: [AuthGuard],
        component: ForecastComponent,
        data: {
          title: 'Mersino | SSG | Forecast ',
        },
      },
      {
        path: 'autocomplete',
        component: GoogleMapAddressComponent,
      },
      {
        path: 'vacation-days-report',
        canActivate: [AuthGuard],
        component: VacationDaysReportsComponent,
        data: {
          title: 'Mersino | SSG | Vacation Days Report ',
        },
      },
      {
        path: 'maintain-unions',
        canActivate: [AuthGuard],
        component: MaintainUnionsComponent,
        data: {
          title: 'Mersino | SSG | Maintain Unions ',
        },
      },
      {
        path: 'payroll-interface',
        canActivate: [],
        component: PayrollInterfaceComponent,
        data: {
          title: 'Mersino | SSG | Payroll Interface ',
        },
      },
      {
        path: 'employee-hiring',
        canActivate: [],
        component: EmployeeRequisitonComponent,
        data: {
          title: 'Mersino | SSG | Employee Requisiton ',
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
export class SsgRoutingModule {}
