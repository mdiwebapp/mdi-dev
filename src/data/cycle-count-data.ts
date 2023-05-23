export const ViewColumns = [
  {
    Name: 'inventoryType',
    isCheck: true,
    Text: 'Inv Type',
    isDisable: false,
    index: 0,
    width: 50,
    editable: false,
  },
  {
    Name: 'inventoryNumber',
    isCheck: true,
    Text: 'Inv #',
    isDisable: false,
    index: 1,
    width: 50,
    editable: false,
  },
  {
    Name: 'description',
    isCheck: true,
    Text: 'Description',
    isDisable: false,
    index: 2,
    width: 50,
    editable: false,
  },
  {
    Name: 'onHandQty',
    isCheck: true,
    Text: 'On Hand',
    isDisable: false,
    index: 3,
    width: 50,
    editable: false,
  },
  {
    Name: 'countedQty',
    isCheck: true,
    Text: 'Counted',
    isDisable: false,
    index: 4,
    width: 50,
    editable: true,
    type: 'number',
    format: 'n',
  },
];

export const ViewData = [
  {
    id: 1,
    inventoryType: 'CSMCR',
    inventoryNumber: 'CSM00000',
    description: '12" SLOTTED STEEL SCREEN BY LINEAL FOOT',
    onHandQty: '768',
    countedQty: '0',
  },
  {
    id: 2,
    inventoryType: 'ELEX000R',
    inventoryNumber: 'HSS0000',
    description: '50 EXTENSION CORD MALE X FEM 50 AMP',
    onHandQty: '4',
    countedQty: '0',
  },
  {
    id: 3,
    inventoryType: 'HSSNPL000R',
    inventoryNumber: '50EX000',
    description: '2" X 20 PINLUG SUCT HOSE',
    onHandQty: '1',
    countedQty: '0',
  },
];

export const ViewColumnsItems = [
  {
    Name: 'invType',
    isCheck: true,
    Text: 'Inventory Type',
    isDisable: false,
    index: 0,
    width: 50,
  },
  {
    Name: 'inv',
    isCheck: true,
    Text: 'Inv #',
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
];

export const ItemData = [
  {
    id: 1,
    invType: 'HSSNPL000R',
    inv: '50EX000',
    description: '2" X 20 PINLUG SUCT HOSE',
  },
  {
    id: 2,
    invType: 'ACCL08XX',
    inv: '6CLAMP',
    description: '8" FERNCO CLAMP',
  },
  {
    id: 3,
    invType: 'ACED02R',
    inv: 'FB10x12',
    description: 'FILTER BAG 10"x12',
  },
];
