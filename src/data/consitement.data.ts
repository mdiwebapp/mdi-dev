import { checkboxIcon } from '@progress/kendo-svg-icons';

export const jobsData = [
  {
    jobId: '16936',
    jobName: 'C & C',
    customer: 'C & C',
  },
  {
    jobId: '21035',
    jobName: 'Norm CO',
    customer: 'Norm CO',
  },
  {
    jobId: '26292',
    jobName: 'ICD - Rental',
    customer: 'ICD - Rental',
  },
];

export const jobsColums = [
  {
    Name: 'jobNumber',
    isCheck: true,
    Text: 'Job #',
    isDisable: false,
    index: 0,
    width: 100,
  },
  {
    Name: 'jobName',
    isCheck: true,
    Text: 'Job Name',
    isDisable: false,
    index: 0,
    width: 100,
  },
  {
    Name: 'customer',
    isCheck: true,
    Text: 'Customer',
    isDisable: false,
    index: 0,
    width: 100,
  },
  {
    Name: 'branchName',
    isCheck: true,
    Text: 'Branch',
    isDisable: false,
    index: 0,
    width: 100,
  },
];

export const inventoryData = [
  {
    jobId: '16936',
    jobName: 'MP 4251',
    status: ' OFF RENT',
    offrent: checkboxIcon,
    hours: 93,
    servicehour: 93,
    laston: '2/14/2022',
    lastoff: '2/18/2022',
  },
  {
    jobId: '16936',
    jobName: '7002',
    status: 'ON RENT',
    offrent: checkboxIcon,
    hours: 27723,
    servicehour: 9311,
    laston: '6/6/2022',
    lastoff: '5/21/2022',
  },
  {
    jobId: '16936',
    jobName: 'MP 741',
    status: 'OFF RENT',
    hours: 4354,
    servicehour: 467,
    laston: '4/11/2022',
    lastoff: '5/27/2022',
  },
];
export const inventoryColumns = [
  {
    Name: 'jobNumber',
    isCheck: true,
    Text: 'Job Number',
    isDisable: false,
    index: 0,
    width: 80,
  },
  {
    Name: 'inventoryNumber',
    isCheck: true,
    Text: 'Inventory Number',
    isDisable: false,
    index: 0,
    width: 100,
  },
  {
    Name: 'status',
    isCheck: true,
    Text: 'Status',
    isDisable: false,
    index: 0,
    width: 50,
  },
  {
    Name: 'offRent',
    isCheck: true,
    Text: 'Off Rent',
    isDisable: false,
    index: 0,
    width: 50,
  },
  {
    Name: 'hours',
    isCheck: true,
    Text: 'Hours',
    isDisable: false,
    index: 0,
    width: 50,
  },

  {
    Name: 'serviceHours',
    isCheck: true,
    Text: 'Service Hours',
    isDisable: false,
    index: 0,
    width: 50,
  },
  {
    Name: 'lastOnRent',
    isCheck: true,
    Text: 'Last On Rent',
    isDisable: false,
    index: 0,
    width: 100,
  },
  {
    Name: 'lastOffRent',
    isCheck: true,
    Text: 'Last Off Rent',
    isDisable: false,
    index: 0,
    width: 100,
  },
];

export const invoiceData = [
  {
    jobId: '16936',
    jobName: 'MP 4251',
    invoicenum: '92580',
    startdate: '2/14/2022',
    enddate: '2/18/2022',
    linetotal: 276,
    days: 5,
    invoicedays: '2/28/2022',
  },
  {
    jobId: '16936',
    jobName: 'MP 4251',
    invoicenum: '911486',
    startdate: '12/30/2021',
    enddate: '12/30/2021',
    linetotal: 160,
    days: 1,
    invoicedays: '1/7/2022',
  },
  {
    jobId: '16936',
    jobName: 'MP 4251',
    invoicenum: '89644',
    startdate: '10/19/2021',
    enddate: '10/20/2021',
    linetotal: 400,
    days: 2,
    invoicedays: '10/26/2021',
  },
];
export const invoiceColumns = [
  {
    Name: 'jobNumber',
    isCheck: true,
    Text: 'Job#',
    isDisable: false,
    index: 0,
    width: 100,
  },
  {
    Name: 'inventoryNumber',
    isCheck: true,
    Text: 'Inv#',
    isDisable: false,
    index: 0,
    width: 100,
  },
  {
    Name: 'invoiceNumber',
    isCheck: true,
    Text: 'Invoice Number',
    isDisable: false,
    index: 0,
    width: 100,
  },
  {
    Name: 'startDate',
    isCheck: true,
    Text: 'Start Date',
    isDisable: false,
    index: 0,
    width: 100,
  },
  {
    Name: 'endDate',
    isCheck: true,
    Text: 'End Date',
    isDisable: false,
    index: 0,
    width: 100,
  },
  {
    Name: 'lineTotal',
    isCheck: true,
    Text: 'Line Total',
    isDisable: false,
    index: 0,
    width: 100,
  },
  {
    Name: 'days',
    isCheck: true,
    Text: 'Days',
    isDisable: false,
    index: 0,
    width: 100,
  },
  {
    Name: 'invoiceDate',
    isCheck: true,
    Text: 'Invoice Date',
    isDisable: false,
    index: 0,
    width: 100,
  },
];
export const rentData = [
  {
    status: 'ON RENT',
    toggleDate: '2/14/2022',
    lastDate: '2/18/2022',
    days: '5',
    dayslnvoiced: '5',
    invoices: 92580,
  },
  {
    status: 'ON RENT',
    toggleDate: '12/30/2021',
    lastDate: '12/30/2021',
    days: '1',
    dayslnvoiced: '1',
    invoices: 91486,
  },
  {
    status: 'ON RENT',
    toggleDate: '8/30/2021',
    lastDate: '10/13/2021',
    days: '45',
    dayslnvoiced: '45',
    invoices: 89362,
  },
];
export const rentColumns = [
  {
    Name: 'status',
    isCheck: true,
    Text: 'Status',
    isDisable: false,
    index: 0,
    width: 100,
  },
  {
    Name: 'toggleDate',
    isCheck: true,
    Text: 'Toggle Date',
    isDisable: false,
    index: 0,
    width: 100,
  },
  {
    Name: 'lastDate',
    isCheck: true,
    Text: 'Last Date',
    isDisable: false,
    index: 0,
    width: 100,
  },
  {
    Name: 'days',
    isCheck: true,
    Text: 'Days',
    isDisable: false,
    index: 0,
    width: 100,
  },
  {
    Name: 'dayslnvoiced',
    isCheck: true,
    Text: 'Days Invoiced',
    isDisable: false,
    index: 0,
    width: 100,
  },
  {
    Name: 'invoices',
    isCheck: true,
    Text: 'Invoices',
    isDisable: false,
    index: 0,
    width: 100,
  },
];
export const jobInventoryData = [
  {
    inventoryNum: 'MP4251',
    project: '16939',
    status: 'OFF RENT',
    toggleDate: '2/18/2022',
    lastDate: '7/6/2022',
    days: '139',
    toggledBy: 'Margie Nealer',
    createDate: '2/5/2022 11:54:43 AM',
  },
  {
    inventoryNum: 'MP4251',
    project: '16939',
    status: 'ON RENT',
    toggleDate: '12/2/2022',
    lastDate: '12/17/2022',
    days: '16',
    toggledBy: 'Margie Nealer',
    createDate: '12/7/2020 9:56:20 AM',
  },
  {
    inventoryNum: 'MP4251',
    project: '16939',
    status: 'OFF RENT',
    toggleDate: '10/14/2020',
    lastDate: '12/2/2020',
    days: '50',
    toggledBy: 'Margie Nealer',
    createDate: '10/16/2022 4:14:37 PM',
  },
];
export const jobInventoryColumns = [
  {
    Name: 'inventoryNumber',
    isCheck: true,
    Text: 'Inventory Number',
    isDisable: false,
    index: 0,
    width: 100,
  },
  {
    Name: 'project',
    isCheck: true,
    Text: 'Project',
    isDisable: false,
    index: 0,
    width: 100,
  },
  {
    Name: 'status',
    isCheck: true,
    Text: 'Status',
    isDisable: false,
    index: 0,
    width: 50,
  },

  {
    Name: 'days',
    isCheck: true,
    Text: 'Days',
    isDisable: false,
    index: 0,
    width: 50,
  },
  {
    Name: 'toggleBy',
    isCheck: true,
    Text: 'Toggled By',
    isDisable: false,
    index: 0,
    width: 100,
  },
  {
    Name: 'toggleDate',
    isCheck: true,
    Text: 'Toggle Date',
    isDisable: false,
    index: 0,
    width: 100,
  },
  {
    Name: 'lastDate',
    isCheck: true,
    Text: 'Last Date',
    isDisable: false,
    index: 0,
    width: 100,
  },
  {
    Name: 'createdDate',
    isCheck: true,
    Text: 'Create Date',
    isDisable: false,
    index: 0,
    width: 100,
  },
];
export const subinvoiceData = [
  {
    invType: 'GHT080PR',
    invId: 'MP4190',
    status: 'OFF RENT',
    jobId: '16936',
  },
  {
    invType: 'GHT040PR',
    invId: 'MP4154',
    status: 'OFF RENT',
    jobId: '16936',
  },
  {
    invType: 'GHT040PR',
    invId: 'MP4188',
    status: 'OFF RENT',
    jobId: '16936',
  },
];
export const subinvoiceColumns = [
  {
    Name: 'invType',
    isCheck: true,
    Text: 'Inv Type',
    isDisable: false,
    index: 0,
    width: 100,
  },
  {
    Name: 'inventoryNumber',
    isCheck: true,
    Text: 'Inv#',
    isDisable: false,
    index: 0,
    width: 100,
  },
  {
    Name: 'status',
    isCheck: true,
    Text: 'Status',
    isDisable: false,
    index: 0,
    width: 100,
  },
  {
    Name: 'jobNumber',
    isCheck: true,
    Text: 'Job#',
    isDisable: false,
    index: 0,
    width: 100,
  },
];
export const utilizationCalColumns = [
  {
    Name: 'date',
    isCheck: true,
    Text: 'Date',
    isDisable: false,
    index: 0,
    width: 100,
  },
  {
    Name: 'ChangedTo',
    isCheck: true,
    Text: 'Changes To',
    isDisable: false,
    index: 0,
    width: 100,
  },
];
