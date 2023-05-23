export class ServiceEstimateModel {
    serviceNumber: string;
    customerName: string;
    userName: string;
    address: string;
    address2: string;
    city: string;
    state: string;
    zip: string;
    rate: number;
    hours: number;
    taxExempt: boolean;
    salesTax: boolean;
    items: any = [];
    note: string;
}
