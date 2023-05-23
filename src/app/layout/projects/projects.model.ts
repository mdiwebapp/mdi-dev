export class ProjectJobViewRequestModel {
  SearchText: string;
  JobGroup: boolean;
  Status: number;
  SortColumn: string;
  SortDesc: boolean;
}

export class CRMContactAddRequestModel {
  CustomerNumber: number;
  FirstName: string;
  LastName: string;
  Title: string;
  Phone: string;
  Email: string;
}

export class ProjectNotesAddRequestModel {
  JobNumber: number;
  Subject: string;
  Note: string;
  userName: string;
}

export class ProjectInfoAddRequestModel {
  JobName: string;
  Branch: string;
  CustomerId: number;
  CustomerRep: string;
  RepPhone: string;
  CustAddress: string;
  AccountManager: string;
  BidDate: Date;
  JobType: Date;
  JobValue: number;
  Probability: string;
  JobCity: string;
  JobState: string;
  JobZip: string;
  EstimatedStartDate: Date;
  EstimatedEndDate: Date;
  LeadSource: string;
  LabourHours: number;
}

export class ProjectInfoUpdateRequestModel {
  JobNumber: number;
  JobStatus: string;
  JobName: string;
  Branch: string;
  CustomerId: number;
  CustomerRep: string;
  RepPhone: string;
  CustAddress: string;
  AccountManager: string;
  BidDate: Date;
  JobType: string;
  JobValue: number;
  Probability: string;
  JobCity: string;
  JobState: string;
  JobZip: string;
  EstimatedStartDate: Date;
  EstimatedEndDate: Date;
  LeadSource: string;
  LabourHours: number;
}

export class PAFUpdateRequestModel {
  JobNumber: number;
  PAFComplete: boolean;
  ContactName: string;
  ContactEmail: string;
  ContactTitle: string;
  ContactPhone: string;
  TaxExempt: string;
  TypeOfJob: string;
  CustomerType: string;
  EmployeeGroup: string;
  OCIP: boolean;
  MineJob: boolean;
  PrevailingWage: boolean;
  CertifiedPR: boolean;
  Paperwork: string;
  OwnerName: string;
  OwnerAddress: string;
  OwnerCity: string;
  OwnerState: string;
  OwnerZip: string;
  OwnerPhone: string;
  Pipeline: boolean;
}
export class ProjectQuoteListRequestModel {
  JobNumber: number;
  ChangeOrder: number;
}
export class CRMContactViewRequestModel {
  CustomerNumber: number;
  SearchText: string;
}
export class LaborToRevRequestModel {
  JobNumber: number;
  L2R: boolean;
}
export class QuotePartDropDownRequestModel {
  QuoteType: number;
  SearchText: string;
}
export class QuoteSaveRequestModel {
  JobNumber: number;
  ChangeNumber: number;
  Completed: boolean;
  PrintNote: boolean;
  Notes: string;
  Period: string;
  QuoteType: number;
  Items: any[];
}
export class QuoteMultiplierApplyModel {
  Multiplier: number;
  JobNumber: number;
  ChangeOrder: number;
}
export class QuoteBudgetViewRequestModel {
  QuoteType: string;
  JobNumber: number;
}
export class QuoteChangePeriodModel {
  Period: string;
  JobNumber: number;
  ChangeOrder: number;
}
export class ProjectInventoryGetRequestModel {
  JobNumber: number;
}
export class ProjectInventorySellToJobModel {
  Inventory_PK: number;
  Quantity: number;
  QBInvNumber: number;
  JobNumber: number;
  UserName: string;
}
export class ToggleOffRentRequestModel {
  Inventory_PK: number;
  ToggleDate: string;
  UserName: string;
  JobNumber: number;
}
export class CallOffRequestModel {
  JobNumber: number;
  UserName: string;
  CallOffDate: string;
}
export class PickListDeleteRequestModel {
  Id: number;
  DeleteAll: boolean;
  Location_Number: number;
}
export class PickListAddUpdateRequestModel {
  InventoryType: string;
  Quantity: number;
  Location_Number: number;
}
export class InventoryLoadUnloadRequestModel {
  LocationNumber: number;
  SelectedDate: string;
  BranchCode: string;
  PartNumber: number;
  Inventorytypes: any[];
}
export class ProjectInventoryMovementGetRequestModel {
  JobNumber: number;
  From: string;
  To: string;
  customerName:string;
}
export class InventoryTypesViewRequestModel {
  SearchText: string;
  BranchCode: string;
}

export class WellpointBudgetModel {
    budgetType: string;
  id: number;
  userName: string;
  user_PK: number;
  quoteType: string;
  quoteNumber: number;
  miles: number;
  wellsQTY: number;
  wellsFootage: number;
  wellsSpacing: number;
  wellsDepth: number;
  filter: boolean;
  drillRig: string;
  pumpSize: string;
  fuelCubes: boolean;
  containment: boolean;
  power: boolean;
  gen1Qty: number;
  gen1ItemCode: string;
  gen2Qty: number;
  gen2ItemCode: string;
  gen3Qty: number;
  gen3ItemCode: string;
  dischargeFootage: number;
  hdpePipe: string;
  fusesPerHour: number;
  pipeSize: string;
  sedTrap: number;
  prodDrill: number;
  prodInstall: number;
  hoursPerDay: number;
  tractorLoads: number;
  loader: boolean;
  preDrill: boolean;
  punch: boolean;
  fork: boolean;
  crewSize: number;
  pickUpCrewSize: number;
  createdDate: string;
  createdBy: string;
  jobNumber: number;
  truckDaysPerLoad: number;
  driveTime: number;
  lowboyFloats: number;
  prodRemove: number;
  perdiem: string;
  pumpSizeIndex: number;
  numbersOfWells: number;
  pipeSizeIndex: number;
  hdpePipeSizeIndex: number;
  branch:string;
  stickBoomCasings:string;
  stickBoomPumps:string;
  modHours:number;
  filterSizeIndex:number;
  jettingText:number;
  pumpIndex:number;
}

export class DeepWellBudgetModel {
  budgetType: string;
  id: number;
  userName: string;
  user_PK: number;
  quoteType: string;
  quoteNumber: number;
  miles: number;
  wellsQTY: number;
  wellsFootage: number;
  wellsSpacing: number;
  wellsDepth: number;
  filter: boolean;
  drillRig: string;
  pumpSize: string;
  fuelCubes: boolean;
  containment: boolean;
  power: boolean;
  gen1Qty: number;
  gen1ItemCode: string;
  gen2Qty: number;
  gen2ItemCode: string;
  gen3Qty: number;
  gen3ItemCode: string;
  dischargeFootage: number;
  hdpePipe: string;
  fusesPerHour: number;
  pipeSize: string;
  sedTrap: number;
  prodDrill: number;
  prodInstall: number;
  hoursPerDay: number;
  tractorLoads: number;
  loader: boolean;
  preDrill: boolean;
  punch: boolean;
  fork: boolean;
  crewSize: number;
  pickUpCrewSize: number;
  createdDate: string;
  createdBy: string;
  jobNumber: number;
  truckDaysPerLoad: number;
  driveTime: number;
  lowboyFloats: number;
  prodRemove: number;
  perdiem: string;
  pumpSizeIndex: number;
  numbersOfWells: number;
  pipeSizeIndex: number;
  hdpePipeSizeIndex: number;
  branch:string;
  stickBoomCasings:string;
  stickBoomPumps:string;
  modHours:number;
  daysOfSetup:number;
  daysOfDrilling:number;
}
export class LineItemtoRentalQuoteModel {
  path: string;
  quoteNumber: number;
  jobNumber: string;
}

export class QuotesPrintRequestModel {
  JobNumber: string;
  ChangeOrder: number;
  QuoteType: string;
  Branch: string;
  PrintPIF: boolean;
  IsTaxed: string;
  State: string;
}