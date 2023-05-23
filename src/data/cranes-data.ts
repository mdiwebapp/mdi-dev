import moment from 'moment';

export const branchData = [
  {
    type: 'All',
    name: 'ALL',
  },
  {
    type: 'Atlanta',
    name: 'ATL',
  },
  {
    type: 'Baltimore',
    name: 'BALT',
  },
  {
    type: 'Omaha',
    name: 'OMA',
  },
];
export const cranesColumns = [
  {
    Name: 'branchName',
    isCheck: true,
    Text: 'Branch Name',
    isDisable: false,
    index: 0,
    width: 100,
  },
  {
    Name: 'craneNumber',
    isCheck: true,
    Text: 'Crane Number',
    isDisable: false,
    index: 0,
    width: 100,
  },
  {
    Name: 'description',
    isCheck: true,
    Text: 'Description',
    isDisable: false,
    index: 0,
    width: 100,
  },
  {
    Name: 'location',
    isCheck: true,
    Text: 'Location',
    isDisable: false,
    index: 0,
    width: 100,
  },
];
export const cranesData = [
  {
    craneNumber: '123',
    description: 'Test Description',
    location: 'Test Location',
    branch: 'Daytona',
    craneType: 'Jib',
    craneId: '123',
    serialNumber: '456',
    make: 'Test Make',
    model: 'Test Model',
    lastAnnualDate: new Date(),
    active: true,
    vehicle: 'T002',
    inactiveReason: '',
    inspectedBy: 'Alex Doimage',
    inspectionDate: new Date(),
  },
  {
    branchName: 'Daytona',
    craneNumber: 'C001',
    description: 'Double rail crane',
    location: 'Fab Shop 1',
  },
];
export const annualInspectionColumns = [
  {
    Name: 'Inspection Date',
    isCheck: true,
    Text: 'Insp Date',
    isDisable: false,
    index: 0,
    width: 100,
  },
  {
    Name: 'Inspected By',
    isCheck: true,
    Text: 'Insp By',
    isDisable: false,
    index: 0,
    width: 100,
  },
];
export const annualInspectionDataType = [
  {
    inspDate: moment().format('MM/DD/YYYY'),
    inspBy: 'Aaron McGraw',
  },
];
export const inspectioncolumn = [
  {
    Name: 'id',
    isCheck: true,
    Text: 'EE#',
    isDisable: false,
    index: 0,
    width: 100,
  },
  {
    Name: 'value',
    isCheck: true,
    Text: 'Name',
    isDisable: false,
    index: 0,
    width: 100,
  },
];
export const inspectiondata = [
  {
    ee: '2765',
    name: 'Alex Doimage',
  },
  {
    ee: '3031',
    name: 'Allan Schmitz',
  },
  {
    ee: '2893',
    name: 'Allen Ortez',
  },
  {
    ee: '3156',
    name: 'Andrew Jaruzel',
  },
];
export const notes = [
  {
    Name: 'userName',
    isCheck: true,
    Text: 'UserName',
    isDisable: false,
    index: 0,
    width: 100,
  },
  {
    Name: 'subject',
    isCheck: true,
    Text: 'Subject',
    isDisable: false,
    index: 0,
    width: 100,
  },
  {
    Name: 'note',
    isCheck: true,
    Text: 'Note',
    isDisable: false,
    index: 0,
    width: 100,
  },
];
export const notesData = [
  {
    userName: 'hello',
    subject: '123',
  },
];
export const vehicleData = [
  {
    vehicletype: 'MI',
    vehiclenumber: 'T002',
    vehicledescription: '94 Ford, F350, Extended cab P/U Sold',
  },
  {
    vehicletype: 'MI',
    vehiclenumber: 'T003',
    vehicledescription:
      '96 Ford, F450 - Superduty, 2 Door UtilityGVW increased from 24000 to 26000 5/25/067.3l',
  },
  {
    vehicletype: 'MI',
    vehiclenumber: 'T004',
    vehicledescription: '94 Ford, F450 - Superduty, 2 Door Utilitysold',
  },
  {
    vehicletype: 'MI',
    vehiclenumber: 'T051',
    vehicledescription: '2000 GMC DENALI, 4X4',
  },
];
