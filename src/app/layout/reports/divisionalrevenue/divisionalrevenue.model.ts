export class DivisionalRevenueModel
{
    month : number;
    year : number;
    branchName : string;
    jobType : string;
    level : number;
    region : string;
}

export class DivisionalRevenueViewModel
{
    value : number;
    l2R : number;
    region : string;
}


export class DivisionalRevenueEeidModel {
    month: number;
    year: number;
    branchName: string;
    jobType: string;
    level: number;
    region: string;
    eeid: any;
  }
  
  export class DivisionalRevenueDateModel {
    month: number;
    year: number;
  }

  export class DivisionalRevenueRegion1Model {
    month: number;
    year: number;
    region: string;
  }

  export class DivisionalRevenueRegion2Model {
    month: number;
    year: number;
    region: string;
    branch : string;
  }