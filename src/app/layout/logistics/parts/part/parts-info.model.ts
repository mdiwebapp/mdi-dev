export class PartsInfoModel {
    id: 0;
    userName: string;
    partNumber: 0;
    inventoryType: string;
    rop: 0;
    roq: 0;
    mdiPart: string;
    purchaseDescription: string;
    salesDescription: string;
    keyword: string;
    status: 0;
    partInfo: partInfoModel;
    isNational: boolean;
    active: boolean;
}

export class partInfoModel {
    //id: 0;
    invType: string;
    rentalFleet: true;
    components: true;
    gpcParts: true;
    serviceParts: true;
    showPrice: true;
    isTaxed: true;
    hasUsage: true;
    hasMultiple: true;
    custom: true;
    oneTimeCharge: true;
    bom: true;
    cycleCountClass: string;
    uom: string;
    peSerialized: true;
    inventoryPart: true;
    sparePart: true;
    componentized: true;
    recordHours: true;
    autoGenerate: true;
    longLead: true;
    inspection: true;
    itemGroup: string;
    qbGroup: string
}
