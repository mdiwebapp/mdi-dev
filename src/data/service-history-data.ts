export const ViewColumns = [
  {
    Name: 'branch',
    isCheck: true,
    Text: 'Branch',
    isDisable: false,
    index: 0,
    width: 50,
  },
  {
    Name: 'serialNumber',
    isCheck: true,
    Text: 'Serial Number',
    isDisable: false,
    index: 1,
    width: 50,
  },
  {
    Name: 'mechanic',
    isCheck: true,
    Text: 'Mechanic',
    isDisable: false,
    index: 2,
    width: 50,
  },
  {
    Name: 'repairDate',
    isCheck: true,
    Text: 'Repair Date',
    isDisable: false,
    index: 3,
    width: 50,
  },
  {
    Name: 'status',
    isCheck: true,
    Text: 'Status',
    isDisable: false,
    index: 4,
    width: 50,
  },
];

export const ServiceHistoryData = [
  {
    id: 1,
    branch: 'GPR',
    serialNumber: 'V124962',
    mechanic: '',
    repairDate: '',
    status: 'ACTIVE',
  },
  {
    id: 2,
    branch: 'CHI',
    serialNumber: 'V127485',
    mechanic: 'CHI	V120627	James "Nick" Elieff	10/2/2020	CLOSED',
    repairDate: '10/2/2020',
    status: 'CLOSED',
  },
  {
    id: 3,
    branch: 'CHI',
    serialNumber: 'V7841025',
    mechanic: '',
    repairDate: '',
    status: 'ACTIVE',
  },
  {
    id: 4,
    branch: 'CHI',
    serialNumber: 'V963258',
    mechanic: '',
    repairDate: '7/12/2019',
    status: 'ACTIVE',
  },
  {
    id: 5,
    branch: 'OMA',
    serialNumber: 'V102457',
    mechanic: 'BradleyTabor',
    repairDate: '7/10/2018',
    status: 'ACTIVE',
  },
];

export const ViewSubColumns = [
  {
    Name: 'partNumber',
    isCheck: true,
    Text: 'Part Number',
    isDisable: false,
    index: 0,
    width: 50,
  },
  {
    Name: 'description',
    isCheck: true,
    Text: 'Description',
    isDisable: false,
    index: 2,
    width: 200,
  },
  {
    Name: 'qty',
    isCheck: true,
    Text: 'Qty',
    isDisable: false,
    index: 3,
    width: 50,
  },
  {
    Name: 'price',
    isCheck: true,
    Text: 'Price',
    isDisable: false,
    index: 4,
    width: 50,
  },
  {
    Name: 'total',
    isCheck: true,
    Text: 'Total',
    isDisable: false,
    index: 5,
    width: 50,
  },
];

export const ServiceSubHistoryData = [
  {
    id: 1,
    partNumber: '000062001001',
    description: 'PRESSURE GAUGE, 0-100 PSI, BOTTOM MOUNT',
    qty: '1',
    price: '$51.95',
    total: '$51.95',
  },
  {
    id: 2,
    partNumber: '000003440610',
    description: 'VACUUM GAUGE, 0 - 30 INHG, BOTTOM MOUNT',
    qty: '1',
    price: '$51.70',
    total: '$51.70',
  },
];
