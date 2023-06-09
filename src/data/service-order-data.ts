export const StatusList = [
  { id: 1, value: 'ACTIVE' },
  { id: 2, value: 'CLOSED' },
  { id: 3, value: 'NEEDS INVOICE' },
];

export const ViewColumnsCust = [
  {
    Name: 'value',
    isCheck: true,
    Text: 'Customer Name',
    isDisable: false,
    index: 0,
    width: 150,
  },
  // {
  //   Name: 'city',
  //   isCheck: true,
  //   Text: 'City',
  //   isDisable: false,
  //   index: 1,
  //   width: 150,
  // },
  // {
  //   Name: 'state',
  //   isCheck: true,
  //   Text: 'State',
  //   isDisable: false,
  //   index: 2,
  //   width: 150,
  // },
];

export const CustomerData = [
  // {
  //   id: 1,
  //   customer: '4Renuel Canada',
  //   city: 'Sherwood Park',
  //   state: 'AB',
  // },
  // {
  //   id: 2,
  //   customer: '5 Star Maintenance, LLC',
  //   city: 'Clinton Township',
  //   state: 'MI',
  // },
  // {
  //   id: 3,
  //   customer: '5 Star Septic',
  //   city: 'Sterlinq',
  //   state: 'VA',
  // },
];

export const ServiceOrderData = [
  {
    id: 1,
    qty: 2,
    itemCode: '000062001001',
    description: '4GT IMPELLER (10" DIA) [CAST GRAY IRON]',
    listPrice: '$912.00',
    total: '$1,824.00',
    cost: '$101.30',
    max: '$101.30',
    action: '',
  },
  {
    id: 2,
    qty: 0,
    itemCode: '000062001001',
    description: '4GT IMPELLER (10" DIA) [CAST GRAY IRON]',
    listPrice: '$912.00',
    total: '$1,824.00',
    cost: '$101.30',
    max: '$101.30',
    action: '',
  },
  {
    id: 3,
    qty: 0,
    itemCode: '000062001001',
    description: '4GT IMPELLER (10" DIA) [CAST GRAY IRON]',
    listPrice: '$912.00',
    total: '$1,824.00',
    cost: '$101.30',
    max: '$101.30',
    action: '',
  },
];
export const ServiceOrderColumns = [
  {
    Name: 'qty',
    isCheck: true,
    Text: 'Qty',
    isDisable: false,
    index: 0,
    width: 50,
  },
  {
    Name: 'itemCode',
    isCheck: true,
    Text: 'Item Code',
    isDisable: false,
    index: 1,
    width: 50,
  },
  {
    Name: 'description',
    isCheck: true,
    Text: 'Description',
    isDisable: false,
    index: 2,
    width: 50,
  },
  {
    Name: 'listPrice',
    isCheck: true,
    Text: 'ListPrice',
    isDisable: false,
    index: 3,
    width: 50,
  },
  {
    Name: 'total',
    isCheck: true,
    Text: 'Total',
    isDisable: false,
    index: 4,
    width: 50,
  },
  {
    Name: 'cost',
    isCheck: true,
    Text: 'Cost',
    isDisable: false,
    index: 5,
    width: 50,
  },
  {
    Name: 'max',
    isCheck: true,
    Text: 'Max',
    isDisable: false,
    index: 6,
    width: 50,
  },
  {
    Name: 'action',
    isCheck: true,
    Text: '',
    isDisable: false,
    index: 6,
    width: 50,
  },
];
