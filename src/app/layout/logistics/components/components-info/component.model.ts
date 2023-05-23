export class ComponentModel {
    inventoryId: number;
    inventoryNumber: string;
    userName: string;
    make: string;
    model: string;
    serialNumber: string;
    component: string;
    location: string;
    branch: string;
    purchasePrice: number;
    inactive: boolean;
    inactiveDate: string;
    inactiveReason: string;
    inactiveBy: string;

    majorRepairs: boolean;
    majorRepairBy: string;
    majorRepairDate: string;
    keywords: string;
    globalPart: string;
    comments: string;
    sold: boolean;

    chasis: chasisModel;
    controlPanel: controlPanelModel;
    diaPump: diaPumpModel;
    engine: engineModel;
    gearBox: gearBoxModel;
    genSet: genSetModel;
    motor: motorModel;
    primingSystem: primingSystemModel;
    pumpEnd: pumpEndModel;
    vaccumPump: vaccumPumpModel;
    messenger: messengerModel;
}
export class messengerModel {
    messengerSimCard: string;
    messengerIMEI: string;
    messengerPhone: string;
}
export class chasisModel {
    trailerPackage: boolean;
    soundAttenuation: boolean;
    chassisFuelCap: string;
    chassisHeight: number;
    chassisWidth: number;
    chassisLength: number;
}
export class controlPanelModel {
    throttleType: string;
}
export class diaPumpModel {
    diaOilType: string;
    diaOilCap: string;
}
export class engineModel {
    engineMufflerPartNum: string;
    engineRadHose: string;
    engineFanPart: string;
    engineRad: string;
    engineSolenoid: string;
    fanBelt: string;
    engineCoolant: string;
    engineCoolantCap: string;
    horsePower: string;
    oilCap: string;
    primaryFuelFilter: string;
    secondaryFuelFilter: string;
    airFilter: string;
    airFilter2: string;
    oilFilter: string;
    voltage: string;
    engineTier: string;
    engineMountComp: string;
    engineRegistration: boolean;
    engineRegDate: Date;
}
export class gearBoxModel {
    gearBoxRatio: string;
    gearBoxPrimShaft: string;
    gearBoxKeySize: string;
    gearBoxOil: string;
    gearBoxOilcap: string;
    saeHousing: string;
    gearBoxPrimShaftOil: string;
    gearBoxAdapterPlate: string;
    gearBoxSecondOilSeal: string;
}

export class genSetModel {
    genSetFrame: string;
    genSetPhase: string;
    genSetVoltage: string;
    genSetBearing: string;
}
export class motorModel {
    //horsePower: string;
    motorHP: string;
    motorEnclosure: string;
    motorFrameSize: string;
    motorAmps: string;
    motorHertz: string;
    motorRPM: string;
    motorRating: string;
    motorThermal: string;
    motorDuty: string;
    motorPowerFactor: string;
    motorTemp: string;
    motorNemaDesign: string;
    motorNEMA: string;
    motorPhase: string;
    motorCode: string;
    motorWeight: string;
    motorInvertyDuty: string;
    motorCSE: string;
    motorUL: string;
    voltage: string;
}

export class primingSystemModel {
    compressorAirFilter: string;
    compressorBelt: string;
    compressorOilFilter: string;
    compressorOil: string;
    compressorOilType: string;
    valveCoverGasketPart: string;
    dischargeValvePart: string;
    intakeValvePart: string;
}
export class pumpEndModel {
    waterPumpMaterial: string;
    casingMaterial: string;
    pumpOilType: string;
    impellerMaterial: string;
    pumpOilCap: string;
    impellerSize: string;
    pumpCutterBlades: string;
}
export class vaccumPumpModel {
    vacOilCap: string;
    vacOil: string;
    vacShimEndCover02: string;
    vacShimEndCover03: string;
    vacLipSeal: string;
    vacVanesPartNum: string;
    vacOringPartNum: string;
}