import { Injectable } from '@angular/core';
import { BaseApiService, CacheService } from 'src/app/core/services';
import { environment } from 'src/environments/environment';
import { DataService } from 'src/app/core/services/data.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ServiceOrderService extends BaseApiService<any> {
  private baseUrl: any;
  constructor(
    protected dataService: DataService,
    private http: HttpClient,
    protected cache: CacheService
  ) {
    super('ServiceOrder', dataService, cache);
    this.baseUrl = environment.apiUrl;
  }
  GetList(data: any): Observable<any> {
    return this.dataService.post<any>(`ServiceOrder/List`, data);
  }
  GetSOItems(InvType: any, Branch: any): Observable<any> {
    return this.dataService.get<any>(`ServiceOrder/Items/${InvType}/${Branch}`);
  }
  GetServiceOrderItems(ServiceNumnber: any): Observable<any> {
    return this.dataService.get<any>(`ServiceOrder/Items/${ServiceNumnber}`);
  }
  DeleteItems(data: any): Observable<any> {
    return this.dataService.delete<any>(`ServiceOrder/Items`, data);
  }
  AddItems(data: any): Observable<any> {
    return this.dataService.post<any>(`ServiceOrder/Items`, data);
  }
  GetItemsDetail(Branch: any, InvType: any): Observable<any> {
    return this.dataService.get<any>(
      `ServiceOrder/Price/Details/${Branch}/${InvType}`
    );
  }
  SaveServiceOrder(data: any): Observable<any> {
    return this.dataService.post<any>(`ServiceOrder/Add`, data);
  }
  UpdateServiceOrder(data: any): Observable<any> {
    return this.dataService.patch<any>(`ServiceOrder/Update`, data);
  }
  GetDetails(serviceNo: any): Observable<any> {
    return this.dataService.get<any>(`ServiceOrder/Details/${serviceNo}`);
  }
  GetEstimateDetails(serviceNo: any): Observable<any> {
    return this.dataService.get<any>(
      `ServiceOrder/Estimate/Details/${serviceNo}`
    );
  }
  GetEstimateItems(serviceNo: any): Observable<any> {
    return this.dataService.get<any>(
      `ServiceOrder/Estimate/Items/${serviceNo}`
    );
  }
  SaveEstimate(data: any): Observable<any> {
    return this.dataService.put<any>(`ServiceOrder/Estimate/Header`, data);
  }
  DeleteEstimate(data: any): Observable<any> {
    return this.dataService.delete<any>(`ServiceOrder/Estimate/Items`, data);
  }
  SaveEstimateItems(data: any): Observable<any> {
    return this.dataService.post<any>(`ServiceOrder/Estimate/Items`, data);
  }
  GetPartList(data: any): Observable<any> {
    return this.dataService.post<any>(`ServiceOrder/Part/List`, data);
  }

  SaveTechCheck(data: any): Observable<any> {
    return this.dataService.put<any>(
      `ServiceOrder/TechCheckList/AddUpdate`,
      data
    );
  }
  GetTechCheckList(SONumber: any): Observable<any> {
    return this.dataService.get<any>(
      `ServiceOrder/TechCheckList/${SONumber}`,
      null
    );
  }
  GetTechCheckType(InvNumber: any): Observable<any> {
    return this.dataService.get<any>(
      `ServiceOrder/TechCheckList/Type/${InvNumber}`,
      null
    );
  }

  SaveNotes(data: any): Observable<any> {
    return this.dataService.post<any>(`ServiceOrder/Notes`, data);
  }
  GetNotesDetail(Id: any): Observable<any> {
    return this.dataService.get<any>(`ServiceOrder/Notes/${Id}`, null);
  }
  GetNotesList(Id: any): Observable<any> {
    return this.dataService.get<any>(`ServiceOrder/${Id}/Notes`);
  }
  GetHistoryList(Id: any): Observable<any> {
    return this.dataService.get<any>(`ServiceOrder/${Id}/History`);
  }

  GetSalesTax(Id: any): Observable<any> {
    return this.dataService.get<any>(`ServiceOrder/SalesTax/${Id}`);
  }
  downloadData(ServiceNumber: any): Observable<any> {
    return this.http.get(
      this.baseUrl + `ServiceOrder/${ServiceNumber}/ExportToExcel/Form`,
      {
        responseType: 'blob',
      }
    );
  }
  downloadInvoice(ServiceNumber: any): Observable<any> {
    return this.http.get(
      this.baseUrl + `ServiceOrder/${ServiceNumber}/ExportToExcel/Invoice`,
      {
        responseType: 'blob',
      }
    );
  }
  downloadEstimateInvoice(ServiceNumber: any): Observable<any> {
    return this.http.get(
      this.baseUrl +
        `ServiceOrder/${ServiceNumber}/ExportToExcel/Estimate/Invoice`,
      {
        responseType: 'blob',
      }
    );
  }
  AddBarcode(barcode: any, branch: any): Observable<any> {
    return this.dataService.get<any>(
      `ServiceOrder/Barcode/Scan/${barcode}/${branch}`
    );
  }
  ExportToExcelFleetView(invNumber: any): Observable<any> {
    return this.http.get(
      this.baseUrl + `Fleet/ExportToExcelFleetView/${invNumber}`,
      { responseType: 'blob' }
    );
  }
  techcheckType:string;
  blGen:boolean=false;
  componentized:boolean=false;
  resetTechCheck() {
    this.techCheckService = {
      fuelInfo: {
        fuelLevel: '',
        fuelWater: '',
        hoses: '',
        fuelLeaks: '',
        crankCase: '',
        oilLeaks: '',
        engineOilCond: '',
        engineOilLevel: '',
      },
      cooling: {
        hydrometer: '',
        coolantReservoir: '',
        waterPump: '',
        fan: '',
        waterPumpBearing: '',
        radiatorLevel: '',
        waterLeak: '',
      },
      battery: {
        batteryLoad: '',
        battery: '',
        batteryPost: '',
        batteryLeak: '',
        batteryCompartment: '',
      },
      electrical: {
        alternatorTest: '',
        starterLoadTest: '',
        wireCondition: '',
        connections: '',
        starterConnections: '',
        fuse: '',
        alternator: '',
        controlPanelShutdown: '',
        relays: '',
      },
      enginePanel: {
        airCleanHousing: '',
        engineMounts: '',
        noise: '',
        msha: '',
        engineSafetySwitch: '',
        engineManufacturer: '',
        toothCount: '',
        emission: '',
        throttleSource: '',
        tsC1: '',
        suctionMax: '',
        suctionMin: '',
        dischargeMax: '',
        dischargeMin: '',
        transLevelMax: '',
        transLevelMin: '',
        acvL1: '',
        acvL2: '',
        acvL3: '',
        loadBank: '',
        hours: '',
        acHz: '',
        generatorWiring: '',
        rearBearing: '',
        oilShutdown:false,
        tempShutdown:false,
        speedShutdown:false,
      },
      centrifugalPump: {
        wearRingClearance: '',
        wearRingGapAfter: '',
        wearRingGapBefore: '',
        footMounts: '',
        screwCap: '',
        lipSeal: '',
        impeller: '',
        sealResLevel: '',
        sealReservoir: '',
        wearRing: '',
        bearings: '',
        gaskets: '',
        centrifugalBallValve: '',
      },
      compressor: {
        venturiSizeBefore: '',
        venturiSizeAfter: '',
        backPressureReading: '',
        venturiHose: '',
        venturiViton: '',
        pulley: '',
        airFilterCondition: '',
        compOilLevel: '',
        compOilCond: '',
        popOffValve: '',
        compAirFilter: '',
      },
      trailer: {
        tirePSILM: '',
        tirePSIRM: '',
        tireTreadLM: '',
        tireTreadRM: '',
        frame: '',
        harness: '',
        lights: '',
        wheelBearing: '',
        wheel: '',
        hubs: '',
        safetyLatches: '',
        tirePSILF: '',
        tirePSILR: '',
        tirePSIRF: '',
        tirePSIRR: '',
        tireTreadLF: '',
        tireTreadLR: '',
        tireTreadRF: '',
        tireTreadRR: '',
        brakeActuator: '',
        pintleHitch: '',
        tires: '',
        safetyLatchesData:''
      },
      couplerAlignCheckValve: {
        alignmentBefore: '',
        alignmentAfter: '',
        bolts: '',
        elements: '',
        flanges: '',
        flapperValve: '',
        flapperWeight: '',
        sealPlate: '',
        pressureGauge: '',
      },
      enviornBox: {
        hosesBallValve: '',
        float: '',
        floatValve: '',
        floatSize: '',
        spoolScreen: '',
        spoolBallValve: '',
        vacuumGauge: '',
        spoolGasket: '',
      },
      exhaustVactest: {
        muffler: '',
        supports: '',
        rainCap: '',
        vacuumTest: '',
        vacuumHold: '',
      },
      comments: {
        comments: '',
      },
      airSeperationReclaimerTank: {
        peelerValve: '',
        floatBall: '',
        backFlowValve: '',
        hosesConnections: '',
        cooler: '',
        tank: '',
        oilLevel: '',
        oilCondition: '',
        smokeFilter: '',
        oilTank: '',
        gasketsHoses: '',
        oilCooler: '',
      },
      testVacuumPump: {
        vacuum: '',
        vacuumHoldTest: '',
        vacuumPulley: '',
        vacuumReading: '',
        pulleyCondition: '',
        vacuumBearings: '',
        beltCondition: '',
        spareBelts: '',
      },
      trailerTires: {
        rims: '',
        lugs: '',
        bearings: '',
        leafSprings: '',
        uBolts: '',
        shackles: '',
        seal: '',
        axle: '',
        fender: '',
        tires:'',
      },
      trailerBrakes: {
        brakeFluidLevel: '',
        brakeFluidLeaks: '',
        shoes: '',
        breakAway: '',
        pintleHitchbolts: '',
        safetyChain: '',
        jack: '',
        brakeActuator:'',
        pintleHitch:'',
      },
      trailerElectricalSystem: {
        lfSignal: '',
        rfSignal: '',
        lrSignal: '',
        rrSignal: '',
        brakeLights: '',
        pigTail: '',
        frontMarkerLights: '',
        backMarkerLights: '',
        wiring: '',
      },
      trailerDecking: {
        boards: '',
        steel: '',
        screws: '',
        reflectiveTape: '',
      },
      trailerRegulatory: {
        registration: '',
        licensePlate: '',
        insurance: '',
        documentholder: '',
      },
      vehicleRearDiffrential: {
        rearDiffNoLeaks: '',
        rearDiffUJoints: '',
        rearFluidClean: '',
        rearAxleBearings: '',
        rearBrakes: '',
        rearShocks: '',
        rearUBolts: '',
      },
      vehicleLights: {
        headLights: '',
        brakeLights:'',
        turnSignals: '',
        trailerPlug: '',
        lightCleanliness: '',
      },
      vehicleInterior: {
        intLights: '',
        electricBrake: '',
        powerPoint: '',
        iPass: '',
        fuelCard: '',
        firstAid: '',
        safetyTriangles: '',
        fireExtinguisher: '',
        intCleanliness: '',
      },
      vehicleAdditionalItems: {
        exhaust: '',
        rotateTires: '',
      },
      vehicleFluidLevels: {
        brakeReservoir: '',
        coolantReservoir: '',
        transferCase: '',
        frontDifferential: '',
        rearDifferential: '',
        windshieldWasherReservoir: '',
        transmission: '',
        engineOil: '',
        powerSteering: '',
      },
      vehicleEngine: {
        airFilter: '',
        engineClean: '',
        radiatorClean: '',
        eCode: '',
        mileage:'',
        battery:'',
        oilLeaks: '',
        fuelLeaks: '',
      },
      vehicleTransmissionTransferCase: {
        cleanOilCooler: '',
        noTransLeaks: '',
        noTransferLeaks: '',
        driveShaft: '',
      },
      vehicleFrontDiffrential: {
        frontDiffNoLeaks: '',
        frontDiffUJoints: '',
        frontFluidClean: '',
        frontAxleBearings: '',
        frontBrakes: '',
        frontShocks: '',
        frontSteeringDamper: '',
        frontBallJointsUpper: '',
        frontBallJointsLower: '',
        steeringComponents: '',
      },
    };
  }
  techCheckService = {
    fuelInfo: {
      fuelLevel: '',
      fuelWater: '',
      hoses: '',
      fuelLeaks: '',
      crankCase: '',
      oilLeaks: '',
      engineOilCond: '',
      engineOilLevel: '',
    },
    cooling: {
      hydrometer: '',
      coolantReservoir: '',
      waterPump: '',
      fan: '',
      waterPumpBearing: '',
      radiatorLevel: '',
      waterLeak: '',
    },
    battery: {
      batteryLoad: '',
      battery: '',
      batteryPost: '',
      batteryLeak: '',
      batteryCompartment: '',
    },
    electrical: {
      alternatorTest: '',
      starterLoadTest: '',
      wireCondition: '',
      connections: '',
      starterConnections: '',
      fuse: '',
      alternator: '',
      controlPanelShutdown: '',
      relays: '',
    },
    enginePanel: {
      airCleanHousing: '',
      engineMounts: '',
      noise: '',
      msha: '',
      engineSafetySwitch: '',
      engineManufacturer: '',
      toothCount: '',
      emission: '',
      throttleSource: '',
      tsC1: '',
      suctionMax: '',
      suctionMin: '',
      dischargeMax: '',
      dischargeMin: '',
      transLevelMax: '',
      transLevelMin: '',
      acvL1: '',
      acvL2: '',
      acvL3: '',
      loadBank: '',
      hours: '',
      acHz: '',
      generatorWiring: '',
      rearBearing: '',
      oilShutdown:false,
      tempShutdown:false,
      speedShutdown:false,
    },
    centrifugalPump: {
      wearRingClearance: '',
      wearRingGapAfter: '',
      wearRingGapBefore: '',
      footMounts: '',
      screwCap: '',
      lipSeal: '',
      impeller: '',
      sealResLevel: '',
      sealReservoir: '',
      wearRing: '',
      bearings: '',
      gaskets: '',
      centrifugalBallValve: '',
    },
    compressor: {
      venturiSizeBefore: '',
      venturiSizeAfter: '',
      backPressureReading: '',
      venturiHose: '',
      venturiViton: '',
      pulley: '',
      airFilterCondition: '',
      compOilLevel: '',
      compOilCond: '',
      popOffValve: '',
      compAirFilter: '',
    },
    trailer: {
      tirePSILM: '',
      tirePSIRM: '',
      tireTreadLM: '',
      tireTreadRM: '',
      frame: '',
      harness: '',
      lights: '',
      wheelBearing: '',
      wheel: '',
      hubs: '',
      safetyLatches: '',
      tirePSILF: '',
      tirePSILR: '',
      tirePSIRF: '',
      tirePSIRR: '',
      tireTreadLF: '',
      tireTreadLR: '',
      tireTreadRF: '',
      tireTreadRR: '',
      brakeActuator: '',
      pintleHitch: '',
      tires: '',
      safetyLatchesData:''
    },
    couplerAlignCheckValve: {
      alignmentBefore: '',
      alignmentAfter: '',
      bolts: '',
      elements: '',
      flanges: '',
      flapperValve: '',
      flapperWeight: '',
      sealPlate: '',
      pressureGauge: '',
    },
    enviornBox: {
      hosesBallValve: '',
      float: '',
      floatValve: '',
      floatSize: '',
      spoolScreen: '',
      spoolBallValve: '',
      vacuumGauge: '',
      spoolGasket: '',
    },
    exhaustVactest: {
      muffler: '',
      supports: '',
      rainCap: '',
      vacuumTest: '',
      vacuumHold: '',
    },
    comments: {
      comments: '',
    },
    airSeperationReclaimerTank: {
      peelerValve: '',
      floatBall: '',
      backFlowValve: '',
      hosesConnections: '',
      cooler: '',
      tank: '',
      oilLevel: '',
      oilCondition: '',
      smokeFilter: '',
      oilTank: '',
      gasketsHoses: '',
      oilCooler: '',
    },
    testVacuumPump: {
      vacuum: '',
      vacuumHoldTest: '',
      vacuumPulley: '',
      vacuumReading: '',
      pulleyCondition: '',
      vacuumBearings: '',
      beltCondition: '',
      spareBelts: '',
    },
    trailerTires: {
      rims: '',
      lugs: '',
      bearings: '',
      leafSprings: '',
      uBolts: '',
      shackles: '',
      seal: '',
      axle: '',
      fender: '',
      tires:'',
    },
    trailerBrakes: {
      brakeFluidLevel: '',
      brakeFluidLeaks: '',
      shoes: '',
      breakAway: '',
      pintleHitchbolts: '',
      safetyChain: '',
      jack: '',
      brakeActuator:'',
      pintleHitch:'',

    },
    trailerElectricalSystem: {
      lfSignal: '',
      rfSignal: '',
      lrSignal: '',
      rrSignal: '',
      brakeLights: '',
      pigTail: '',
      frontMarkerLights: '',
      backMarkerLights: '',
      wiring: '',
    },
    trailerDecking: {
      boards: '',
      steel: '',
      screws: '',
      reflectiveTape: '',
    },
    trailerRegulatory: {
      registration: '',
      licensePlate: '',
      insurance: '',
      documentholder: '',
    },
    vehicleRearDiffrential: {
      rearDiffNoLeaks: '',
      rearDiffUJoints: '',
      rearFluidClean: '',
      rearAxleBearings: '',
      rearBrakes: '',
      rearShocks: '',
      rearUBolts: '',
    },
    vehicleLights: {
      headLights: '',
      brakeLights:'',
      turnSignals: '',
      trailerPlug: '',
      lightCleanliness: '',
    },
    vehicleInterior: {
      intLights: '',
      electricBrake: '',
      powerPoint: '',
      iPass: '',
      fuelCard: '',
      firstAid: '',
      safetyTriangles: '',
      fireExtinguisher: '',
      intCleanliness: '',
    },
    vehicleAdditionalItems: {
      exhaust: '',
      rotateTires: '',
    },
    vehicleFluidLevels: {
      brakeReservoir: '',
      coolantReservoir: '',
      transferCase: '',
      frontDifferential: '',
      rearDifferential: '',
      windshieldWasherReservoir: '',
      transmission: '',
      engineOil: '',
      powerSteering: '',
    },
    vehicleEngine: {
      airFilter: '',
      engineClean: '',
      radiatorClean: '',
      eCode: '',
      mileage:'',
      battery:'',
      oilLeaks: '',
      fuelLeaks: '',
    },
    vehicleTransmissionTransferCase: {
      cleanOilCooler: '',
      noTransLeaks: '',
      noTransferLeaks: '',
      driveShaft: '',
    },
    vehicleFrontDiffrential: {
      frontDiffNoLeaks: '',
      frontDiffUJoints: '',
      frontFluidClean: '',
      frontAxleBearings: '',
      frontBrakes: '',
      frontShocks: '',
      frontSteeringDamper: '',
      frontBallJointsUpper: '',
      frontBallJointsLower: '',
      steeringComponents: '',
    },
  };
}
