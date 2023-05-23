export class EmployeeMoreInfoModel {
  id: number;
  firstName: string;
  lastName: string;
  startDate: Date;
  ssNumber: string;
  driversLicenseNumber: string;
  licenseState: string;
  birthDate: Date;
  address: string;
  address2: string;
  state: string;
  city: string;
  zipCode: string;
  homePhone: string;
  inactive: boolean;
  workInfo: EmployeeWorkInfoViewModel;
  employeeTitles: EmployeeTitleModel[];
}
export class EmployeeWorkInfoViewModel {
  id: number;
  userName: string;
  employeeId: number;
  employeeAccount: string;
  employer: number;
  adpNumber: number;
  qbRep: string;
  unionLabor: boolean;
  contractLabor: boolean;
  hourly: boolean;
  hourlyRate: number;
  emergencyContact: string;
  emergencyPhone: string;
  emergencyRelationship: string;
  maritalStatus: string;
  email: string;
  veteranStatus: string;
  race: string;
  gender: string;
  rehireDate: Date;
  employeeTitles: any;
  department: string;
  titles: string;
  i9Completed: boolean;
  i9Comment: string;
  i9Date:Date;
  i9By:string;
  salesMan:boolean;
  yardEmployee:number;
  startDate:Date;
}

export class EmployeeTitleModel {
  id: number;
  employeeId: number;
  title: number;
}
