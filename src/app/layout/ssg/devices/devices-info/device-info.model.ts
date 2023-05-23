export class DeviceInfoModel {
    [x: string]: any;
    id: number;
    userName: string;
    user_PK: number;
    employeeId: number;
    type: number;
    status: number;
    brand: string;
    location: string;
    //issuedUser: string;
    issuedDate: Date;
    model: string;
    partNumber: string;
    serialNumber: string;
    macAddress: string;
    inactivatedReason: string;
    autoImport: boolean;
    active: boolean;
    deviceId:string;
    computerDevice: computerDeviceModel;
    mobileDevice: mobileDeviceModel;
    hostpotDevice: hostpotDeviceModel;
}

export class computerDeviceModel {
    hdd: string;
    belarc: boolean;
    processor: string;
    speed: string;
    purchaseDate: Date;
    os: string;
    licenceKEY: string;
    ram: string;
}
export class mobileDeviceModel {
    gSuite: boolean;
    vmdm: boolean;
    imei: string;
    sim: string;
    phoneNumber: string;
    phoneSerial: string
}
export class hostpotDeviceModel {
    imei: string;
    sim: string;
    phoneNumber: string;
}
