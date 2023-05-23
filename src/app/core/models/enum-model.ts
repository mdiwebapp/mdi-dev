export class EnumModel {
  id?: number;
  value?: string;
  code?: string;
}

export class BooleanOptions {
  All = 0;
  true = 1;
  false = 2;
}

export enum VendorTabs {
  tab1 = 'Vendor Info',
  tab2 = 'Contacts',
  tab3 = 'Activity',
  tab4 = 'Notes',
  tab5 = 'History',
}

export enum VehicleTabs {
  tab1 = 'Vehicle Info',
  tab2 = 'Inventory',
  tab3 = 'Service History',
  tab4 = 'Activity',
  tab5 = 'Notes',
  tab6 = 'History',
}

export enum PartTabs {
  tab1 = 'Parts',
  tab2 = 'Inventory',
  tab3 = 'Purchasing',
  tab4 = 'Engineering',
  tab5 = 'Pricing',
  tab6 = 'Part Info',
  tab7 = 'History',
}

export enum PurchaseTabs {
  tab1 = 'Purchase Order',
  tab2 = 'Line Items',
  tab3 = 'Notes',
  tab4 = 'History',
}
export enum DeviceTabs {
  tab1 = 'Device Info',
  tab2 = 'Notes',
  tab3 = 'History',
}

export enum ComponentTabs {
  tab1 = 'Component Info',
  tab2 = 'Service History',
  tab3 = 'Activity',
  tab4 = 'Notes',
  tab5 = 'History',
}
export enum ServiceOrderTabs {
  tab1 = 'Service Order',
  tab2 = 'Service History',
  tab3 = 'Estimate',
  tab4 = 'Notes',
  tab5 = 'History',
}
export enum ProjectTabs {
  tab1 = 'Project Info',
  tab2 = 'Quotes',
  tab3 = 'Inventory',
  tab4 = 'Notes',
  tab5 = 'History',
}
export enum ContorlPanelMake {
  'CAT',
  'CONTROLS INC.',
  'GLOBAL PUMP CO.',
  'HOUSTON STREET',
  'LOFA',
  'LOR',
  'MURPHY',
}
export enum DiapumpMake {
  'GLOBAL PUMP CO.',
  'CORNELL',
}
export enum GearboxMake {
  'GLOBAL PUMP CO.',
  'NORDGEAR',
  'TWIN DISC',
}
export enum MotorMake {
  'BALDOR',
  'BROOK CROMPTON',
  'DELCO',
  'HYUNDAI',
  'MAGNETEK ELECTRIC',
  'MARATHON ELECTRIC',
  'RELIANCE ELECTRIC',
  'SEI',
  'SHAKTI',
  'SIEMENS',
  'TECO WESTINGHOUSE',
  'TESLA',
  'US MOTOR',
  'VANGUARD ELECTRIC',
  'WEG',
  'WORLDWIDE ELECTRIC',
}
export enum PumpendMake {
  'AMERICAN MARSH',
  'BERKLEY',
  'CORNELL',
  'GLOBAL PUMP CO.',
  'NETZSCH',
  'PRIMAX',
  'SMART TURNER',
  'SUMMIT',
  'VOGELSANG',
}
export enum VaccumPumpMake {
  'GLOBAL PUMP CO.',
  'MASPORT',
}

export enum EngineMake {
  'CAT',
  'CUMMINS',
  'DETROIT DIESEL',
  'DEUTZ',
  'FIAT',
  'HATZ',
  'ISUZU',
  'JCB',
  'JOHN DEERE',
  'KOHLER',
  'KOMATSU',
  'KUBOTA',
  'LOMBARDINI',
  'MITSUBISHI',
  'PERKINS',
  'VOLVO',
  'YANMAR',
}
export class BuildingRequestStatusEnum {
  Open = 0;
  Close = 1;
  Elevate = 2;
  AssignedTo = 3;
}
export class ProjectActiveStatusEnum {
  All = 'All';
  Active = 'Active';
  NeedsBid = 'Needs Bid';
  Proposed = 'Proposed';
  Closed = 'Closed';
  AR = 'AR';
}
export class Qoute {
  Sales = 0;
  Rental = 1;
}
export enum craneTabs {
  craneInfo = 'Crane Info',
  notes = 'Notes',
  activity = 'Activity',
  history = 'History',
}
export class ActiveStatus{
   All = 0;
    Active = 1;
    Inactive = 2;
}