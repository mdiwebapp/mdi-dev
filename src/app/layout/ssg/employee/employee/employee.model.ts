export class EmployeeModel {
    id: number;
    employeeName: string;
    branchName: string;
    inactive: boolean;
    firstName: string;
    lastName: string;
    ssNumber: string;
    diversLicenseNumber: string;
    licenseState: string;
    birthDate: string;
    address: string;
    address2: string;
    state: string;
    city: string;
    zipCode: string;
    homePhone: string;
}

export class EmployeeCertificateModel {
    key: string;
    childData: EmployeeCertificateDetailModel[] = [];
}

export class EmployeeCertificateDetailModel {
    certification: string;
    dateType: string;
}