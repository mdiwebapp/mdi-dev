export class FleetHistoryModel {
  Id: number;
  from: Date;
  to: Date;
  days: number;
  customer: string;
  job: string;
  hours: number;
  userName: string;
}

export class FleetServiceHistoryModel {
  Id: number;
  serviceNumber: number;
  dateRepaired: Date;
  status: string;
  Note: string;
  name: string;
}

export class FleetServiceLineModel {
  Id: number;
  partNumber: string;
  description: string;
  quantity: number;
  listPrice: number;
  total: number;
}
