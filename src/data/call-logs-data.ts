export const columns = [
  {
    Name: 'logId',
    isCheck: true,
    Text: 'Log Id',
    isDisable: false,
    index: 0,
    width: 100,
  },
  {
    Name: 'callFrom',
    isCheck: true,
    Text: 'Call From',
    isDisable: false,
    index: 0,
    width: 100,
  },
  {
    Name: 'assignedTo',
    isCheck: true,
    Text: 'Assigned To',
    isDisable: false,
    index: 0,
    width: 100,
  },
  // {
  //   Name: 'logDate',
  //   isCheck: true,
  //   Text: 'Log Date',
  //   isDisable: false,
  //   index: 0,
  //   width: 100,
  // },
];

export const data = [
  {
    logId: '3542',
    callFrom: 'MDI Web',
    assignedTo: 'Raymond',
    logDate: '27-06-2022',
    no: '123-456-7890',
    type: 'call',
  },
  {
    logId: '7584',
    callFrom: 'MDI Web',
    assignedTo: 'Andrew',
    logDate: '27-06-2022',
    no: '123-456-7890',
    type: 'web',
  },
  {
    logId: '2342',
    callFrom: 'MDI Web',
    assignedTo: 'Alex',
    logDate: '27-06-2022',
    no: '123-456-7890',
    type: 'web-pump-form',
  },
  {
    logId: '5973',
    callFrom: 'MDI Web',
    assignedTo: 'Marcus',
    logDate: '27-06-2022',
    no: '123-456-7890',
    type: 'rfq-request-form',
  },
  {
    logId: '1234',
    callFrom: 'MDI Web',
    assignedTo: 'Jeff N',
    logDate: '27-06-2022',
    no: '123-456-7890',
    type: 'web-pump-quote',
  },
];

export const usersData = [
  {
    employeeId: '100',
    name: 'Jeff N',
    no: '123-456-7890',
  },
  {
    employeeId: '221',
    name: 'Andrew',
    no: '123-456-7890',
  },
  {
    employeeId: '123',
    name: 'Alex',
    no: '123-456-7890',
  },
  {
    employeeId: '123',
    name: 'Raymond',
    no: '123-456-7890',
  },
  {
    employeeId: '233',
    name: 'Marcus',
    no: '123-456-7890',
  },
];

export const callerTypesData = [
  {
    type: 'Customer',
  },
  {
    type: 'Internal',
  },
  {
    type: 'Pump Rental',
  },
  {
    type: 'Repair',
  },
  {
    type: 'Vendor',
  },
];

export const stateData = [
  {
    code: 'AB',
    state: 'Alberta',
  },
  {
    code: 'AK',
    state: 'Alaska',
  },
  {
    code: 'AL',
    state: 'Alabama',
  },
  {
    code: 'AR',
    state: 'Arkansas',
  },
  {
    code: 'AZ',
    state: 'Arizona',
  },
];

export const callTypesData = [
  {
    name: 'Email',
  },
  {
    name: 'Inperson',
  },
  {
    name: 'Phone',
  },
];

export const branchData = [
  {
    name: 'Atlanta',
    code: 'ATL',
  },
  {
    name: 'Baltimore',
    code: 'BALT',
  },
  {
    name: 'Burton',
    code: 'MI',
  },
  {
    name: 'Devtona',
    code: 'DAYT',
  },
  {
    name: 'Houston',
    code: 'HOU',
  },
];

export const statusData = [
  {
    status: 'Status: All',
  },
  {
    status: 'Status: Closed',
  },
  {
    status: 'Status: Open',
  },
];

export const yearsData = [
  {
    year: '2019',
  },
  {
    year: '2020',
  },
  {
    year: '2021',
  },
  {
    year: '2022',
  },
  {
    year: 'All',
  },
];

export const ForeCastData = [
  {
    name: 'Aaron Rebadi',
    year: '2022',
    branch: 'Pittsburh',
    month: '1',
    monthGoal: '$125.25',
  },
];
