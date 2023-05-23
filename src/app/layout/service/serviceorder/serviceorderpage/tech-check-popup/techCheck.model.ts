export class TechCheckModel {
    soNumber: string;
    safetyLatches: string;
    tirePSILF: string;
    tirePSILR: string;
    tirePSIRF: string;
    tirePSIRR: string;
    tireTreadLF: string;
    tireTreadLR: string;
    tireTreadRF: string;
    tireTreadRR: string;
    brakeActuator: string;
    pintleHitch: string;
    beltCondition: string;
    tires: string;
    hubs: string;
    brakeLights: string;
    coolantReservoir: string;
    battery: string;
    oilLeaks: string;
    fuelLeaks: string;
    bearings:string;

    fuelIol: fuelIolModel;
    cooling: coolingModel;
    batteryModel: batteryModel;
    electrical: electricalModel;
    enginePanel: enginePanelModel;
    centrifugalPump: centrifugalPumpModel;
    compressor: compressorModel;
    trailer: trailerModel;
    couplerAlignCheckValve: couplerAlignCheckValveModel;
    enviornBox: enviornBoxModel;
    exhaustVactest: exhaustVactestModel;
    comments: commentsModel;
    airSeperationReclaimerTank: airSeperationReclaimerTankModel;
    testVacuumPump: testVacuumPumpModel;
    trailerTires: trailerTiresModel;
    trailerBrakes: trailerBrakesModel;
    trailerElectricalSystem: trailerElectricalSystemModel;
    trailerDecking: trailerDeckingModel;
    trailerRegulatory: trailerRegulatoryModel;
    vehicleRearDiffrential: vehicleRearDiffrentialModel;
    vehicleLights: vehicleLightsModel;
    vehicleInterior: vehicleInteriorModel;
    vehicleAdditionalItems: vehicleAdditionalItemsModel;
    vehicleFluidLevels: vehicleFluidLevelsModel;
    vehicleEngine: vehicleEngineModel;
    vehicleTransmissionTransferCase: vehicleTransmissionTransferCaseModel;
    vehicleFrontDiffrential: vehicleFrontDiffrentialModel;


    techComplete: boolean;
    tech: string;
    mgmtApprove: boolean;
    manager: string
}

export class fuelIolModel {
    fuelLevel: string;
    fuelWater: string;
    hoses: string;
    fuelLeaks: string;
    crankCase: string;
    oilLeaks: string;
    engineOilCond: string;
    engineOilLevel: string;
}
export class coolingModel {
    hydrometer: string;
    coolantReservoir: string;
    waterPump: string;
    fan: string;
    waterPumpBearing: string;
    radiatorLevel: string;
    waterLeak: string;
}
export class batteryModel {
    batteryLoad: string;
    battery: string;
    batteryPost: string;
    batteryLeak: string;
    batteryCompartment: string
}
export class electricalModel {
    alternatorTest: string;
    starterLoadTest: string;
    wireCondition: string;
    connections: string;
    starterConnections: string;
    fuse: string;
    alternator: string;
    controlPanelShutdown: string;
    relays: string
}
export class enginePanelModel {
    airCleanHousing: string;
    engineMounts: string;
    noise: string;
    msha: string;
    engineSafetySwitch: string;
    engineManufacturer: string;
    toothCount: string;
    emission: string;
    throttleSource: string;
    tsC1: string;
    suctionMax: string;
    suctionMin: string;
    dischargeMax: string;
    dischargeMin: string;
    transLevelMax: string;
    transLevelMin: string;
    acvL1: string;
    acvL2: string;
    acvL3: string;
    loadBank: string;
    hours: string;
    acHz: string;
    generatorWiring: string;
    rearBearing: string;
    oilShutdown:boolean;
    tempShutdown:boolean;
    speedShutdown:boolean;
}
export class centrifugalPumpModel {
    wearRingClearance: string;
    wearRingGapAfter: string;
    wearRingGapBefore: string;
    footMounts: string;
    screwCap: string;
    lipSeal: string;
    impeller: string;
    sealResLevel: string;
    sealReservoir: string;
    wearRing: string;
    bearings: string;
    gaskets: string;
    centrifugalBallValve: string
}
export class compressorModel {
    venturiSizeBefore: string;
    venturiSizeAfter: string;
    backPressureReading: string;
    venturiHose: string;
    venturiViton: string;
    pulley: string;
    airFilterCondition: string;
    compOilLevel: string;
    compOilCond: string;
    popOffValve: string;
    compAirFilter: string
}

export class trailerModel {
    tirePSILM: string;
    tirePSIRM: string;
    tireTreadLM: string;
    tireTreadRM: string;
    frame: string;
    harness: string;
    lights: string;
    wheelBearing: string;
    wheel: string;
    hubs: string;
      safetyLatches: string;
      tirePSILF: string;
      tirePSILR: string;
      tirePSIRF: string;
      tirePSIRR: string;
      tireTreadLF: string;
      tireTreadLR: string;
      tireTreadRF: string;
      tireTreadRR: string;
      brakeActuator: string;
      pintleHitch: string;
      tires: string;
      safetyLatchesData:string;
}
export class couplerAlignCheckValveModel {
    alignmentBefore: string;
    alignmentAfter: string;
    bolts: string;
    elements: string;
    flanges: string;
    flapperValve: string;
    flapperWeight: string;
    sealPlate: string;
    pressureGauge: string
}
export class enviornBoxModel {
    hosesBallValve: string;
    float: string;
    floatValve: string;
    floatSize: string;
    spoolScreen: string;
    spoolBallValve: string;
    vacuumGauge: string;
    spoolGasket: string
}
export class exhaustVactestModel {
    muffler: string;
    supports: string;
    rainCap: string;
    vacuumTest: string;
    vacuumHold: string
}
export class commentsModel { comments: string }
export class airSeperationReclaimerTankModel {
    peelerValve: string;
    floatBall: string;
    backFlowValve: string;
    hosesConnections: string;
    cooler: string;
    tank: string;
    oilLevel: string;
    oilCondition: string;
    smokeFilter: string;
    oilTank: string;
    gasketsHoses: string;
    oilCooler: string
}
export class testVacuumPumpModel {
    vacuum: string;
    vacuumHoldTest: string;
    vacuumPulley: string;
    vacuumReading: string;
    pulleyCondition: string;
    vacuumBearings: string;
    beltCondition: string;
    spareBelts: string
}
export class trailerTiresModel {
    rims: string;
    lugs: string;
    bearings: string;
    leafSprings: string;
    uBolts: string;
    shackles: string;
    seal: string;
    axle: string;
    fender: string;
    tires:string;
}
export class trailerBrakesModel {
    brakeFluidLevel: string;
    brakeFluidLeaks: string;
    shoes: string;
    breakAway: string;
    pintleHitchbolts: string;
    safetyChain: string;
    jack: string;
    brakeActuator:string;
    pintleHitch:string;
}
export class trailerElectricalSystemModel {
    lfSignal: string;
    rfSignal: string;
    lrSignal: string;
    rrSignal: string;
    brakeLights: string;
    pigTail: string;
    frontMarkerLights: string;
    backMarkerLights: string;
    wiring: string
}
export class trailerDeckingModel {
    boards: string;
    steel: string;
    screws: string;
    reflectiveTape: string
}
export class trailerRegulatoryModel {
    registration: string;
    licensePlate: string;
    insurance: string;
    documentholder: string
}

export class vehicleRearDiffrentialModel {
    rearDiffNoLeaks: string;
    rearDiffUJoints: string;
    rearFluidClean: string;
    rearAxleBearings: string;
    rearBrakes: string;
    rearShocks: string;
    rearUBolts: string
}
export class vehicleLightsModel {
    headLights: string;
    turnSignals: string;
    trailerPlug: string;
    brakeLights: string;
    lightCleanliness: string
}
export class vehicleInteriorModel {
    intLights: string;
    electricBrake: string;
    powerPoint: string;
    iPass: string;
    fuelCard: string;
    firstAid: string;
    safetyTriangles: string;
    fireExtinguisher: string;
    intCleanliness: string
}
export class vehicleAdditionalItemsModel {
    exhaust: string;
    rotateTires: string
}
export class vehicleFluidLevelsModel {
    brakeReservoir: string;
    transferCase: string;
    frontDifferential: string;
    rearDifferential: string;
    windshieldWasherReservoir: string;
    transmission: string;
    engineOil: string;
    powerSteering: string;
    coolantReservoir: string;
}
export class vehicleEngineModel {
    airFilter: string;
    engineClean: string;
    radiatorClean: string;
    eCode: string;
    mileage: string;
    battery: string;
    oilLeaks: string;
    fuelLeaks: string;
}
export class vehicleTransmissionTransferCaseModel {
    cleanOilCooler: string;
    noTransLeaks: string;
    noTransferLeaks: string;
    driveShaft: string
}
export class vehicleFrontDiffrentialModel {
    frontDiffNoLeaks: string;
    frontDiffUJoints: string;
    frontFluidClean: string;
    frontAxleBearings: string;
    frontBrakes: string;
    frontShocks: string;
    frontSteeringDamper: string;
    frontBallJointsUpper: string;
    frontBallJointsLower: string;
    steeringComponents: string
}