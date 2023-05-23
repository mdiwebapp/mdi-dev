export class PaulModel {
  // table columns go here
  id : number;
  autoReport: string;
  subject: string;
  description: string;
  branchSpecific: boolean;
  skip: boolean;
  active: boolean;
  reportType: number;
}

export class PaulResultModel
{
    id: number;
    autoReport : string;
}
