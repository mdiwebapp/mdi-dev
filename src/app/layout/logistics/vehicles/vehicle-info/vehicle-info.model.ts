export class VehicleInfoModel {
    id: number;
    userName: string;
    vehicleType: string;
    vehicleNumber: string;
    description: string;
    serialNumber: string;
    license: string;
    licenseExpiration: string;
    branchId: 0;
    assignedEmployeeName: string;
    assignEmployeeId: 0;
    assignedDate: Date;
    miles: 0;
    hours: 0;
    rental: boolean;
    active: boolean;
    moreInfo: moreInfoModel;
}

export class moreInfoModel {
    serviceFrequency: string;
    annualInspectionDate: Date;
    dailyRate: 0;
    purchasedFrom: string;
    purchasePrice: string;
    purchaseDate: Date;
    expensed: boolean;
    length: string;
    height: number;
    width: string;
    dot: boolean;
    sold: boolean;
    abs: boolean;
    cdl: boolean;
    milesAtPurchased: 0;
    hoursAtPurchased: 0;
    engineMake: string;
    engineModel: string;
    engineSerialNumber: string;
    engineHP: string;
    displacement: string;
    transmissionModel: string;
    unitBuildDate: Date;
    maxLiftingHeight: number;
    liftingCapacity: 0;
    telescopicReachLength: number;
    frontAxelRatio: string;
    rearAxelRatio: string;
    frontGAWR: string;
    rearGAWR: string;
    tireSize: string;
    numberOfAxels: 0;
    curbWeight: string;
    gvwr: string;
    psiCold: string;
    wheelMaterial: string;
    cabType: string;
    fifthWheel: boolean;
    trailerHitch: string;
    axleSpacing1: number;
    axleSpacing2: number;
    weight: string;
    wheel: boolean;
    dryWeight: 0;
    operatingWeight: 0;
    maxDrillingDepth: number;
    numberOfAxles: string;
    tyreType: string;
    sleeps: 0
}
