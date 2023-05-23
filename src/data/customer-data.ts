export const customerData = [
  {
    id: '25276',
    name: 'HDD Inc',
    createdDate: Date.now(),
    address: '176 Indian Tail',
    zipcode: '36078',
    city: 'TALLASSEE',
    state: 'AL',
    country: 'UNITED STATES',
    phone: '3343217571',
    fax: '8883019853',
    web: 'http://hddincalabama.com/',
    branch: 'Atlanta',
    type: 'Industrial',
    am: 'Darek Kirkpatrick',
    inactive: false,
    credit_card_pre_pay: false,
    credit_limit: '5,000.00',
    credit_risk: false,
    credit_override: false,
    credit_note: 'Credit Score C w/moderate risk - approved for $50k - SR',
    call_date: new Date(),
    checklists: [
      { name: 'Credit App Approved-5/2/2019' },
      { name: 'Text Exempt: N/A' },
      { name: 'COL' },
    ],
    contacts: [
      {
        fullName: 'CD Ray',
        firstName: 'CD',
        lastName: 'Ray',
        role: 'Decison Maker',
        location: '',
        title: '',
        office: '',
        cell: '',
        email: '',
        notes: '',
      },
      {
        fullName: 'Cinda Davis',
        firstName: 'Cinda',
        lastName: 'Davis',
        role: 'Decison Maker',
        location: '',
        title: '',
        office: '',
        cell: '',
        email: '',
        notes: '',
      },
    ],
  },
  {
    name: '24/6 Technical Services',
  },
];

export const branchData = [
  {
    name: 'Select Branch',
  },
  {
    name: 'All',
  },
  {
    name: 'Atlanta',
  },
  {
    name: 'Burton',
  },
  {
    name: 'Houston',
  },
];

export const accountManagersData = [
  {
    name: 'Select Account Manager',
  },
  {
    name: 'All',
  },
  {
    name: 'Allan Schmitz',
  },
  {
    name: 'Carl Richards',
  },
  {
    name: 'Jay Saenz',
  },
];

export const customerTypesData = [
  {
    name: 'Select Customer Type',
  },
  {
    name: 'All',
  },
  {
    name: 'Agricultural',
  },
  {
    name: 'Contractors-Building',
  },
  {
    name: 'Environmental',
  },
];

export const collectionsData = [
  { id: true, value: 'Yes' },
  { id: false, value: 'No' },
];

export const customerCheckListData = [
  { name: 'Credit App Approved-5/2/2019' },
  { name: 'Text Exempt: N/A' },
  { name: 'COL' },
];

export const custInfoData = [
  {
    customerchecklist: 'Text Exempt:N/A',
  },
  {
    customerchecklist: 'Credit App Approved-5/2/2019',
  },
  {
    customerchecklist: 'COI',
  },
];
export const branchtypeData = [
  {
    name: 'All',
  },
  {
    name: 'Atlanta',
  },
  {
    name: 'Burton',
  },
  {
    name: 'Houston',
  },
];
export const accounttypeData = [
  {
    name: 'All',
  },
  {
    name: 'Allan Schmitz',
  },
  {
    name: 'Carl Richards',
  },
  {
    name: 'Jay Saenz',
  },
];
export const customertypeData = [
  {
    name: 'All',
  },
  {
    name: 'Oli & Gas',
  },
  {
    name: 'Other',
  },
  {
    name: 'Landfill',
  },
];

export const customerColumns = [
  {
    Name: 'name',
    isCheck: true,
    Text: 'Customer',
    isDisable: false,
    index: 0,
    width: 100,
  },
];
export const activityColumns = [
  // {
  //   Name: 'dateCalled',
  //   isCheck: true,
  //   Text: 'Date Called',
  //   isDisable: false,
  //   index: 0,
  //   width: 100,
  // },
  {
    Name: 'mdiRep',
    isCheck: true,
    Text: 'MDI Rep',
    isDisable: false,
    index: 0,
    width: 100,
  },
  {
    Name: 'contactType',
    isCheck: true,
    Text: 'Contact Type',
    isDisable: false,
    index: 0,
    width: 200,
  },
  // {
  //   Name: 'activityType',
  //   isCheck: true,
  //   Text: 'Activity Type',
  //   isDisable: false,
  //   index: 0,
  //   width: 100,
  // },
];
export const activityData = [
  {
    datecalled: '4/20/2027',
    mdirap: 'Allison',
    contact: 'AP',
    activitytype: 'Notes',
  },
  {
    datecalled: '1/25/2021',
    mdirap: 'Ross',
    contact: 'Credit',
    activitytype: 'Notes',
  },
  {
    datecalled: '1/25/2021',
    mdirap: 'Ross',
    contact: 'Credit Approval',
    activitytype: 'Notes',
  },
  {
    datecalled: '3/16/2027',
    mdirap: 'Allison',
    contact: 'AP',
    activitytype: 'Notes',
  },
];
export const collectionColumns = [
  {
    Name: 'job',
    isCheck: true,
    Text: 'Job',
    isDisable: false,
    index: 0,
    width: 100,
    hide: true,
  },
  {
    Name: 'invoice',
    isCheck: true,
    Text: 'Invoice',
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
    width: 300,
  },
];

export const collectionData = [
  {
    job: '38208 | 5 Star Services - Rental | $74,460.00',
    invoice:
      'Inv# 79763 - HH1207, HH1241, HH1242 2/2-3/1 | 02-26-2021 | $23,400.00',
    note: '3/17/21 Mailed current statement to customer. Ss 03-17-2021',
  },
  {
    job: '38208 | 5 Star Services - Rental | $74,460.00',
    invoice: 'Inv# 79764 - MP503, 1/29-2/25 | 02-26-2021 | $2160.00',
    note: '3/17/21 Mailed current statement to customer. Ss 03-17-2021',
  },
];
