import moment from 'moment';

export const employeeData = [
  {
    name: 'Abernathy, Kevin',
    firstName: 'Kevin',
    lastName: 'Abernathy',
    branch: 'Atlanta',
    email: 'kavin.abernathy@gmail.com',
    code: '2916',
    startDate: Date.now(),
    phone: '8137673362',
    ss: '262873198',
    license: 'A165517741642345',
    address: '12517 Dorer Dr',
    zipcode: '  77356',
    city: 'MONTGOMERY',
    state: 'TX',
    contact: 'Heather',
    dob: new Date(),
    licenseState: 'FL',
    maritalStatus: 'M',
    gender: 'M',
    veteranStatus: '',
    race: 'W',
    rehireDate: '',
    relationship: 'Mother',
    emergencyContact: 'Kris Kimmery',
    beginning: '10',
    used: '0',
    account: '',
    employer: '',
    department: '',
    title: '',
    usesMDI: true,
    adp: '',
    accountManager: false,
    qbRep: '',
    unionLabor: false,
    yardEE: 0,
    contractLabor: false,
    hourlyEE: 0,
    eVerifyCompleted: new Date(),
    inactive: true,
    hourly: 'yes',
  },
  {
    name: 'Adams, Carl',
    firstName: 'Carl',
    lastName: 'Adams',
    branch: 'Daytona',
  },
];
export const branchData = [
  {
    type: 'All',
  },
  {
    type: 'SSG',
  },
  {
    type: 'Atlanta',
  },
  {
    type: 'Daytona',
  },
];
export const stateData = [
  {
    name: 'AB',
    type: 'Alberta',
  },
  {
    name: 'AK',
    type: 'Alaska',
  },
  {
    name: 'AL',
    type: 'Alabama',
  },
];
export const otherColumns = [
  {
    Name: 'date',
    isCheck: true,
    Text: 'Date',
    isDisable: false,
    index: 0,
    width: 100,
  },
  {
    Name: 'type',
    isCheck: true,
    Text: 'Type',
    isDisable: false,
    index: 0,
    width: 100,
  },
  {
    Name: 'paid',
    isCheck: true,
    Text: 'Paid',
    isDisable: false,
    index: 0,
    width: 100,
  },
];
export const personalTimecolumns = [
  {
    Name: 'workDate',
    isCheck: true,
    Text: 'WorkDate',
    isDisable: false,
    index: 0,
    width: 100,
  },
  {
    Name: 'approvedBy',
    isCheck: true,
    Text: 'ApprovedBy',
    isDisable: false,
    index: 0,
    width: 100,
  },
  {
    Name: 'paid',
    isCheck: true,
    Text: 'Paid',
    isDisable: false,
    index: 0,
    width: 100,
  },
];
export const accountData = [
  {
    type: '100-01 Repairs & Main.- Pump Shop - Canada',
  },
  {
    type: '100-01 Repairs & Main.- Engine Shop - Canada',
  },
  {
    type: '100-01 Repairs & Main.- Field Techs - Canada',
  },
  {
    type: '100-04 Service -VP - Canada',
  },
];
export const employerData = [
  {
    type: 'MDI - ATL',
  },
  {
    type: 'MDI - BALT',
  },
  {
    type: 'MI - CHI',
  },
  {
    type: 'MDI - ETD',
  },
];
export const departmentData = [
  {
    type: 'None',
  },
  {
    type: 'Bypass',
  },
  {
    type: 'Dewatering',
  },
];
export const titleData = [
  {
    workType: 'Sale and Marketing - Sales Manager',
  },
  {
    workType: 'Manager - Branch Manager',
  },
];
export const titlecolumns = [
  {
    Name: 'name',
    isCheck: true,
    Text: 'WorkType',
    isDisable: false,
    index: 0,
    width: 100,
  },
];
export const addTitleTypeData = [
  {
    workType: 'Administration - Administrative Assistant',
  },
  {
    workType: 'Manager - Director',
  },
  {
    workType: 'Manager - President',
  },
];

export const certificationData = [
  {
    certification: 'Driver',
    dataType: '',
    date: moment().format('MM/DD/YYYY'),
  },
  {
    certification: 'Employement',
    dataType: '',
    date: moment().format('MM/DD/YYYY'),
  },
];

export const historyData = [
  { name: '09/27/2021 - CreditCard Changed' },
  { name: '09/27/2021 - FuelCard Changed' },
  { name: '02/04/2021 - CertDate Changed' },
];
;