export class VendorInfoModel {
    id: number;
    userName:string;
    vendorName: string;
    vendorTypes: string;
    // qbNameMDI : string;
    // qbNameGPC : string;
    // address : string;
    // address2 : string;
    // state : string;
    // city : string;
    // zip : string;
    // comments : string;
    terms: string;
    phone: string;
    fax: string;
    email: string;
    active: boolean;
    billingAddress: billingAddressModel;
    // {
    //     address: string;
    //     address2: string;
    //     state: string;
    //     city: string;
    //     zip: string
    // };
    moreInfo: moreInfoModel;
    isNational:boolean;
}

export class billingAddressModel {
    address: string;
        address2: string;
        state: string;
        city: string;
        zip: string
}
export class shippingAddressModel {
    address: string;
        address2: string;
        state: string;
        city: string;
        zip: string
}
export class moreInfoModel {
    id: 0;
    userName: string;
    accountNumber: string;
    qbName: string;
    creditLimit: string;
    portalInfo: string;
    defaultShipper: string;
    shippingAddress:shippingAddressModel;
    ssg:boolean;
}
