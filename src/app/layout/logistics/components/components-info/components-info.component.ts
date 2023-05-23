import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ErrorMessages, ModuleNames } from 'src/app/core/constant';
import { ErrorHandlerService } from 'src/app/core/services';
import { DropdownService } from 'src/app/core/services/dropdown.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { ContorlPanelMake } from '../../../../core/models/enum-model';
import { DiapumpMake } from '../../../../core/models/enum-model';
import { GearboxMake } from '../../../../core/models/enum-model';
import { MotorMake } from '../../../../core/models/enum-model';
import { VaccumPumpMake } from '../../../../core/models/enum-model';
import { EngineMake } from '../../../../core/models/enum-model';
import { PumpendMake } from '../../../../core/models/enum-model';
import { ComponentsService } from '../components/components.service';
import { chasisModel, ComponentModel, controlPanelModel, diaPumpModel, engineModel, gearBoxModel, genSetModel, messengerModel, motorModel, primingSystemModel, pumpEndModel, vaccumPumpModel } from './component.model';
import { ComponentNotesModel } from '../components-notes/component-notes.model'
import { MenuService } from 'src/app/core/helper/menu.service';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-components-info',
  templateUrl: './components-info.component.html',
  styleUrls: ['./components-info.component.scss'],
})
export class ComponentsInfoComponent implements OnInit {
  form: FormGroup;
  gridView: any[];
  public mySelection: number[] = [0];
  deviceList = ['Desktop', 'Laptop', 'Phone', 'Tablet', 'HotSpot'];
  tierList = ['1', '2', '3', '4i', '4', '5'];
  makeList = [];
  pumpendMakeList = PumpendMake;
  ContorlPanelMakeList = ContorlPanelMake;
  DiapumpMakeList = DiapumpMake;
  GearboxMakeList = GearboxMake;
  MotorMakeList = MotorMake;
  VaccumPumpMakeList = VaccumPumpMake;
  EngineMakeList = EngineMake;
  branch: any;
  branchCode: any;
  componentList: any = [
    { id: '0', value: 'ALL' },
    { id: '1', value: 'ENGINE' },
    { id: '2', value: 'PUMPEND' },
    { id: '3', value: 'PRIMINGSYSTEM' },
    { id: '4', value: 'GEARBOX' },
    { id: '5', value: 'CONTROLPANEL' },
    { id: '6', value: 'MESSENGER' },
    { id: '7', value: 'CHASSIS' },
    { id: '8', value: 'GENSET' },
  ];
  public componentId = '0';
  displayAll: boolean = true;

  displayEngine: boolean = false;
  displayPumpEnd: boolean = false;
  displayVaccumPump: boolean = false;
  displayDiaPump: boolean = false;
  displayPrimingSystem: boolean = false;
  displayGearBox: boolean = false;
  displayControlPanel: boolean = false;
  displayMessenger: boolean = false;
  displayChassis: boolean = false;
  displayGenset: boolean = false;
  displayMotor: boolean = false;
  displayCompressor: boolean = false;
  displayRegBtn: boolean = false;
  isAdd: boolean = false;
  isBranchVisisble: boolean = false;
  FilterOptions: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'startsWith',
  };
  statusList = [
    'Assigned',
    'Locked',
    'Needs Repair',
    'Pending Assignment',
    'Pending Return',
    'Spare',
  ];
  employeeList: [];
  locationList: [];
  typeList: any = [{ id: 0, value: 'All' }];
  throttleTypeList: any = [{ id: 0, value: 'Mechanical' }, { id: 1, value: 'Electronic' }];
  voltageList: any = [{ id: 0, value: '12V' }, { id: 1, value: '24V' }];
  impellerMaterialList: any = [{ id: 0, value: 'Cast Iron' }, { id: 1, value: 'CD4MCU' }];
  impellerSizelList: any = [8, 8.5, 10, 11, 12, 12.5, 14, 15.5, 16, 17, 17.5, 19, 21.95, 22, 22.05];
  casingMaterialList: any = [{ id: 0, value: 'Cast Iron' }, { id: 1, value: 'CD4MCU' }, { id: 2, value: 'Cast Steel' }];
  voltageSettingList: any = [{ id: 0, value: '120/240' }, { id: 1, value: '208' }, { id: 2, value: '240' }, { id: 3, value: '480' }, { id: 4, value: '120/240/208/480' }, { id: 5, value: '240' }];
  phaseList: any = [{ id: 0, value: '1 Phase Only' }, { id: 1, value: '3 Phase Only' }, { id: 2, value: '1 Phase & 3 Phase' }];
  isExpand: boolean = false;
  id: any;
  componentName: any;
  isRegisterFlag: boolean = false;
  globalPartsList: import('../../../../core/models/drop-down.model').DropDownModel[];
  openInventoryType: boolean;
  globalPartname: string;
  isMajorchange: boolean;
  isDisabled: boolean = true;
  isParts: boolean = true;
  isdisableSN: boolean = true;
  clickEventsubscription: Subscription;
  message: any;

  constructor(
    private formBuilder: FormBuilder, public service: ComponentsService,
    public dropdownService: DropdownService, private utils: UtilityService,
    public errorHandler: ErrorHandlerService, public menuService: MenuService, public datepipe: DatePipe,
  ) {
    if (localStorage.getItem('isAdmin') == 'true') {

    } else {

      // this.menuService.checkUserBySubmoduleRights('Component Info'); 
      // this.isdisableSN = this.menuService.isUpdateSN;
    }
  }

  ngOnInit(): void {
    this.clickEventsubscription = this.utils
      .getClickEvent()
      .subscribe((a) => {
        this.message = a;
        this.callBack(this.message);
      });
    this.initForm(); this.form.disable();
    this.loadComponent(); this.GetBranch();
    this.loadParts();
  }
  callBack(value) {
    if (value.length > 0) {
      this.form.controls['location'].setValue('YARD-' + value[value.length - 1].value);
    }

  }
  GetBranch() {
    this.branch = this.utils.storage.CurrentUser.userBranch;
    // var index = this.branch.findIndex((c) => c.value == 'SSG');
    // this.branch.splice(index, 1);
    // this.branch.unshift({ "code": "All", "id": 0, "value": "All" });
  }
  initForm(): void {
    this.form = this.formBuilder.group({
      userName: [''],
      inventoryId: [0],
      inventoryNumber: [''],
      make: [''],
      model: [''],
      serialNumber: ['', Validators.required],
      component: ['', Validators.required],
      location: [''],
      branch: ['', Validators.required],
      purchasePrice: [0],
      inactive: [true],
      inactiveDate: [],
      inactiveReason: [''],
      inactiveBy: [''],
      sold: [false],
      majorRepairs: [''],
      majorRepairBy: [''],
      majorRepairDate: [''],
      comments: [''],

      keywords: [''],
      globalPart: [''],
      chasis_trailerPackage: [''],
      chasis_soundAttenuation: [''],
      chasis_chassisFuelCap: [''],
      chasis_chassisHeight: [''],
      chasis_chassisWidth: [''],
      chasis_chassisLength: [''],
      throttleType: [0],

      messengerSimCard: [''],
      messengerPhone: [''],
      messengerIMEI: [''],


      diaOilType: [''],
      diaOilCap: [''],

      engineMufflerPartNum: [''],
      engineRadHose: [''],
      engineFanPart: [''],
      engineRad: [''],
      engineSolenoid: [''],
      engine_fanBelt: [''],
      engineCoolant: [''],
      engineCoolantCap: [''],
      engine_horsePower: [''],
      engine_oilCap: [''],
      engine_fuelFilter: [''],
      engine_fuelFilter2: [''],
      engine_airFilter: [''],
      engine_airFilter2: [''],
      engine_oilFilter: [''],
      engine_voltage: [''],
      engineTier: [''],
      engineMountComp: [''],
      engineRegistration: [false],
      engineRegDate: [''],

      gearRation: [''],
      gearBoxPrimShaft: [''],
      gearBoxKeySize: [''],
      gearBoxOil: [''],
      gearBoxOilcap: [''],
      saeHousing: [''],
      gearBoxPrimShaftOil: [''],
      gearBoxAdapterPlate: [''],
      gearBoxSecondOilSeal: [''],

      genSetFrame: [''],
      genSetPhase: [''],
      genSetVoltage: [''],
      genSetBearing: [''],
      // gensetOilType: [''],
      // gensetOilCap: [''],

      horsePower: [''],
      motorEnclosure: [''],
      motorFrameSize: [''],
      motorAmps: [''],
      motorHertz: [''],
      motorRPM: [''],
      motorRating: [''],
      motorThermal: [''],
      motorDuty: [''],
      motorPowerFactor: [''],
      motorTemp: [''],
      motorNemaDesign: [''],
      motorNEMA: [''],
      motorPhase: [''],
      motorCode: [''],
      motorWeight: [''],
      motorInvertyDuty: [''],
      motorCSE: [''],
      motorUL: [''],
      voltage: [''],

      compressorAirFilter: [''],
      compressorBelt: [''],
      compressorOilFilter: [''],
      compressorOil: [''],
      compressorOilType: [''],
      //valveCoverGasketPart: [''],
      //dischargeValvePart: [''],
      //intakeValvePart: [''],

      waterPumpMaterial: [''],
      casingMaterial: [''],
      pumpOilType: [''],
      impellerMaterial: [''],
      pumpOilCap: [''],
      impellerSize: [''],
      pumpCutterBlades: [''],

      vacOilCap: [''],
      vacOil: [''],
      vacShimEndCover02: [''],
      vacShimEndCover03: [''],
      vacLipSeal: [''],
      vacVanesPartNum: [''],
      vacOringPartNum: [''],
    });
  }
  get f() {
    return this.form.controls;
  }
  loadComponent() {
    this.dropdownService.GetComponentList().subscribe(
      (res) => {
        if (res) {
          this.componentList = res;
        }
      },
      (error) => this.onError(error, ErrorMessages.components.save_info)
    );
  }
  loadParts() {
    this.dropdownService.GetGlobalPartList().subscribe(
      (res) => {
        if (res) {
          this.gridView = res;
        }
      },
      (error) => this.onError(error, ErrorMessages.components.save_info)
    );
  }
  btnEdit() {
    
    this.form.enable();this.isDisabled = true;
    this.isParts = false;
    this.form.controls['branch'].disable();
    if (localStorage.getItem('isAdmin') == 'true') {

    } else {
      const rights = JSON.parse(localStorage.getItem('Rights'));
      var isdis = rights.find(
        (x) => (x.subModuleName == 'Component Info' && x.tabName.toLowerCase() == ' update sn')
      );
      if (isdis || localStorage.getItem('isAdmin') == 'true') {
        this.isdisableSN = false
      }
      else {
        this.form.controls['serialNumber'].disable();
        this.isdisableSN = true
      }
    }
  }
  setExpand(val) {
    if (val) this.isExpand = true;
    else this.isExpand = false;
  }
  onEdit(res, type) {
    this.form.disable();
    this.componentId = type;
    this.onComponentChange(type);
    this.editClick(res);
    //this.vendorMoreInfo.onEdit(res);
  }
  editClick(data: any) {
    // this.form.disable();
    this.isDisabled = true;this.isParts=true;
    this.isBranchVisisble = false;
    // this.isDisableExp = true;
    this.id = data.inventoryNumber;
    if (this.id) {
      this.setValue(data);
    } else {
      this.form.reset();
    }
  }

  setValue(data: any) {
    this.isAdd = false;
    this.globalPartname = '';
    this.form.controls['branch'].setValue(null); 
    

    this.form.setValue({
      inventoryId: data.inventoryId,
      inventoryNumber: data.inventoryNumber,
      userName: '',
      inactive: data.inactive,
      inactiveDate: data.inactiveDate,
      inactiveReason: data.inActiveReason,
      inactiveBy: data.inactiveBy,

      make: data.make,
      model: data.model,
      serialNumber: data.inventoryNumber,
      location: data.location,
      branch: this.branch.find(c=> c.code == data.branch)?this.branch.find(c=> c.code == data.branch).code:null,
      purchasePrice: data.purchasePrice,
      component: '',
      // inactive: data.inactive,
      // inactiveReason: '',
      sold: data.sold,
      majorRepairs: data.majorRepairs,
      majorRepairBy: data.majorRepairBy,
      majorRepairDate: data.majorRepairDate,
      comments: '',
      keywords: data.keywords,
      globalPart: data.globalPart,
      chasis_trailerPackage: data.trailerPackage,
      chasis_soundAttenuation: data.soundAttenuation,
      chasis_chassisFuelCap: data.chassisFuelCap,
      chasis_chassisHeight: data.chassisHeight,
      chasis_chassisWidth: data.chassisWidth,
      chasis_chassisLength: data.chassisLength,
      throttleType: data.throttleType,

      messengerSimCard: data.serialNumber,
      messengerPhone: data.messengerNumber,
      messengerIMEI: data.messengerID,

      diaOilType: data.diaOilType,
      diaOilCap: data.diaOilCap,

      engineMufflerPartNum: data.engineMufflerPartNum,
      engine_horsePower: data.engineHP,
      engineRadHose: data.engineRadHose,
      engineFanPart: data.engineFanPart,
      engineRad: data.engineRad,
      engineSolenoid: data.engineSolenoid,
      engine_fanBelt: data.fanBelt,
      engineCoolant: data.engineCoolant,
      engineCoolantCap: data.engineCoolantCap,
      engine_oilCap: data.oilCap,
      engine_fuelFilter: data.primaryFuelFilter,
      engine_fuelFilter2: data.secondaryFuelFilter,
      engine_airFilter: data.airFilter,
      engine_airFilter2: data.airFilter2,
      engine_oilFilter: data.oilFilter,
      engine_voltage: data.voltage,
      engineTier: data.engineTier,
      engineMountComp: data.engineMountComp,
      engineRegistration: data.engineRegistration ?? false,
      engineRegDate: data.engineRegDate,

      gearRation: data.gearBoxRatio,
      gearBoxPrimShaft: data.gearBoxPrimShaft,
      gearBoxKeySize: data.gearBoxKeySize,
      gearBoxOil: data.gearBoxOil,
      gearBoxOilcap: data.gearBoxOilcap,
      saeHousing: data.saeHousing,
      gearBoxPrimShaftOil: data.gearBoxPrimShaftOil,
      gearBoxAdapterPlate: data.gearBoxAdapterPlate,
      gearBoxSecondOilSeal: data.gearBoxSecondOilSeal,

      genSetFrame: data.genSetFrame,
      genSetPhase: data.genSetPhase,
      genSetVoltage: data.genSetVoltage,
      genSetBearing: data.genSetBearing,

      horsePower: data.motorHP ?? '',
      motorEnclosure: data.motorEnclosure,
      motorFrameSize: data.motorFrameSize,
      motorAmps: data.motorAmps,
      motorHertz: data.motorHertz,
      motorRPM: data.motorRPM,
      motorRating: data.motorRating,
      motorThermal: data.motorThermal,
      motorDuty: data.motorDuty,
      motorPowerFactor: data.motorPowerFactor,
      motorTemp: data.motorTemp,
      motorNemaDesign: data.motorNemaDesign,
      motorNEMA: data.motorNEMA,
      motorPhase: data.motorPhase,
      motorCode: data.motorCode,
      motorWeight: data.motorWeight,
      motorInvertyDuty: data.motorInvertyDuty,
      motorCSE: data.motorCSE,
      motorUL: data.motorUL,
      voltage: data.voltage,

      compressorAirFilter: data.compressorAirFilter,
      compressorBelt: data.compressorBelt,
      compressorOilFilter: data.compressorOilFilter,
      compressorOil: data.compressorOil,
      compressorOilType: data.compressorOilType,
      // valveCoverGasketPart: '',
      // dischargeValvePart: '',
      // intakeValvePart: '',

      waterPumpMaterial: data.waterPumpMaterial,
      casingMaterial: data.casingMaterial,
      pumpOilType: data.pumpOilType,
      impellerMaterial: data.impellerMaterial,
      pumpOilCap: data.pumpOilCap,
      impellerSize: data.impellerSize,
      pumpCutterBlades: data.pumpCutterBlades,

      vacOilCap: data.vacOilCap,
      vacOil: data.vacOil,
      vacShimEndCover02: data.vacShimEndCover02,
      vacShimEndCover03: data.vacShimEndCover03,
      vacLipSeal: data.vacLipSeal,
      vacVanesPartNum: data.vacVanesPartNum,
      vacOringPartNum: data.vacOringPartNum,

    });
    this.globalPartname = data.globalPart;
  }
  onSave(savedata: any) {
    if (this.componentId) {
      this.form.controls['component'].setValue(this.componentId);
    }
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return true;
    }
    const data = new ComponentModel();
    data.chasis = new chasisModel();
    data.controlPanel = new controlPanelModel();
    data.diaPump = new diaPumpModel();
    data.engine = new engineModel();
    data.gearBox = new gearBoxModel();
    data.genSet = new genSetModel();
    data.motor = new motorModel();
    data.primingSystem = new primingSystemModel();
    data.pumpEnd = new pumpEndModel();
    data.vaccumPump = new vaccumPumpModel();
    data.messenger = new messengerModel();

    data.inventoryId = this.form.value.inventoryId ?? 0;
    data.inventoryNumber = this.form.value.inventoryNumber ?? (this.componentId != 'MESSENGER' ? this.form.value.serialNumber : this.form.value.messengerSimCard);
    data.userName = JSON.parse(localStorage.getItem('currentUser')).userName;
    data.make = this.form.value.make;
    data.model = this.form.value.model;
    data.branch =this.form.get('branch').value;
    data.serialNumber =  this.componentId != 'MESSENGER' ? this.form.value.serialNumber : this.form.value.messengerSimCard;;
    data.component = this.componentId;
    //this.form.value.location;
    data.purchasePrice = this.form.value.purchasePrice ?? 0;
    data.inactive = savedata.inactive == false ? true : false;
    
    if (savedata.inactive == false && this.form.value.inactive==false) {
      data.inactiveDate = this.datepipe.transform(savedata.inactiveDate??this.form.value.inactiveDate, 'MM/dd/yyyy');
      data.inactiveBy = JSON.parse(localStorage.getItem('currentUser')).userName;
      data.inactiveReason = savedata.inactiveReason==""?this.form.value.inactiveReason:savedata.inactiveReason;
      data.sold = savedata.sold;
    }else{
      data.inactiveDate = this.form.value.inactiveDate;
      data.inactiveBy = this.form.value.inactiveBy;
      data.inactiveReason = this.form.value.inactiveReason;
      data.sold = this.form.value.sold??false;
    }
    

    data.majorRepairs = this.form.value.majorRepairs;
    data.majorRepairBy = this.form.value.majorRepairBy;
    data.majorRepairDate = 
    this.form.value.majorRepairs? this.datepipe.transform(new Date().toString(), 'MM/dd/yyyy'):'';
    data.comments = this.form.value.comments;

    data.keywords = this.form.value.keywords;
    data.globalPart = this.form.value.globalPart;

    data.chasis.trailerPackage = this.form.value.chasis_trailerPackage;
    data.chasis.soundAttenuation = this.form.value.chasis_soundAttenuation;
    data.chasis.chassisFuelCap = this.form.value.chasis_chassisFuelCap;
    data.chasis.chassisHeight = this.form.value.chasis_chassisHeight;
    data.chasis.chassisWidth = this.form.value.chasis_chassisWidth;
    data.chasis.chassisLength = this.form.value.chasis_chassisLength;

    data.controlPanel.throttleType = this.form.value.throttleType;

    data.diaPump.diaOilCap = this.form.value.diaOilCap;
    data.diaPump.diaOilType = this.form.value.diaOilType;

    data.engine.engineMufflerPartNum = this.form.value.engineMufflerPartNum;
    data.engine.engineRadHose = this.form.value.engineRadHose;
    data.engine.engineFanPart = this.form.value.engineFanPart;
    data.engine.engineRad = this.form.value.engineRad;
    data.engine.engineSolenoid = this.form.value.engineSolenoid;
    data.engine.fanBelt = this.form.value.engine_fanBelt;
    data.engine.engineCoolant = this.form.value.engineCoolant;
    data.engine.engineCoolantCap = this.form.value.engineCoolantCap;
    data.engine.horsePower = this.form.value.engine_horsePower;
    data.engine.oilCap = this.form.value.engine_oilCap;
    data.engine.primaryFuelFilter = this.form.value.engine_fuelFilter;
    data.engine.secondaryFuelFilter = this.form.value.engine_fuelFilter2;
    data.engine.airFilter = this.form.value.engine_airFilter;
    data.engine.airFilter2 = this.form.value.engine_airFilter2;
    data.engine.oilFilter = this.form.value.engine_oilFilter;
    data.engine.voltage = this.form.value.engine_voltage;
    data.engine.engineTier = this.form.value.engineTier;
    data.engine.engineMountComp = this.form.value.engineMountComp;
    data.engine.engineRegistration = this.form.value.engineRegistration ?? false;
    data.engine.engineRegDate = this.form.value.engineRegDate;

    data.gearBox.gearBoxRatio = this.form.value.gearRation;
    data.gearBox.gearBoxPrimShaft = this.form.value.gearBoxPrimShaft;
    data.gearBox.gearBoxKeySize = this.form.value.gearBoxKeySize;
    data.gearBox.gearBoxOil = this.form.value.gearBoxOil;
    data.gearBox.gearBoxOilcap = this.form.value.gearBoxOilcap;
    data.gearBox.saeHousing = this.form.value.saeHousing;
    data.gearBox.gearBoxPrimShaftOil = this.form.value.gearBoxPrimShaftOil;
    data.gearBox.gearBoxAdapterPlate = this.form.value.gearBoxAdapterPlate;
    data.gearBox.gearBoxSecondOilSeal = this.form.value.gearBoxSecondOilSeal;

    data.genSet.genSetFrame = this.form.value.genSetFrame;
    data.genSet.genSetPhase = this.form.value.genSetPhase;
    data.genSet.genSetVoltage = this.form.value.genSetVoltage;
    data.genSet.genSetBearing = this.form.value.genSetBearing;

    data.motor.motorHP = this.form.value.horsePower;
    data.motor.motorEnclosure = this.form.value.motorEnclosure;
    data.motor.motorFrameSize = this.form.value.motorFrameSize;
    data.motor.motorAmps = this.form.value.motorAmps;
    data.motor.motorHertz = this.form.value.motorHertz;
    data.motor.motorRPM = this.form.value.motorRPM;
    data.motor.motorRating = this.form.value.motorRating;
    data.motor.motorThermal = this.form.value.motorThermal;
    data.motor.motorDuty = this.form.value.motorDuty;
    data.motor.motorPowerFactor = this.form.value.motorPowerFactor;
    data.motor.motorTemp = this.form.value.motorTemp;
    data.motor.motorNemaDesign = this.form.value.motorNemaDesign;
    data.motor.motorNEMA = this.form.value.motorNEMA;
    data.motor.motorPhase = this.form.value.motorPhase;
    data.motor.motorCode = this.form.value.motorCode;
    data.motor.motorWeight = this.form.value.motorWeight;
    data.motor.motorInvertyDuty = this.form.value.motorInvertyDuty;
    data.motor.motorCSE = this.form.value.motorCSE;
    data.motor.motorUL = this.form.value.motorUL;
    data.motor.voltage = this.form.value.voltage;

    data.primingSystem.compressorAirFilter = this.form.value.compressorAirFilter;
    data.primingSystem.compressorBelt = this.form.value.compressorBelt;
    data.primingSystem.compressorOilFilter = this.form.value.compressorOilFilter;
    data.primingSystem.compressorOil = this.form.value.compressorOil;
    data.primingSystem.compressorOilType = this.form.value.compressorOilType;
    // data.primingSystem.valveCoverGasketPart = this.form.value.valveCoverGasketPart;
    // data.primingSystem.dischargeValvePart = this.form.value.dischargeValvePart;
    // data.primingSystem.intakeValvePart = this.form.value.intakeValvePart;

    data.pumpEnd.waterPumpMaterial = this.form.value.waterPumpMaterial;
    data.pumpEnd.casingMaterial = this.form.value.casingMaterial;
    data.pumpEnd.pumpOilType = this.form.value.pumpOilType;
    data.pumpEnd.impellerMaterial = this.form.value.impellerMaterial;
    data.pumpEnd.pumpOilCap = this.form.value.pumpOilCap;
    data.pumpEnd.impellerSize = this.form.value.impellerSize;
    data.pumpEnd.pumpCutterBlades = this.form.value.pumpCutterBlades;

    data.vaccumPump.vacOilCap = this.form.value.vacOilCap;
    data.vaccumPump.vacOil = this.form.value.vacOil;
    data.vaccumPump.vacShimEndCover02 = this.form.value.vacShimEndCover02;
    data.vaccumPump.vacShimEndCover03 = this.form.value.vacShimEndCover03;
    data.vaccumPump.vacLipSeal = this.form.value.vacLipSeal;
    data.vaccumPump.vacVanesPartNum = this.form.value.vacVanesPartNum;
    data.vaccumPump.vacOringPartNum = this.form.value.vacOringPartNum;

    data.messenger.messengerIMEI = this.form.value.messengerIMEI;
    data.messenger.messengerPhone = this.form.value.messengerPhone;
    data.messenger.messengerSimCard = this.form.value.messengerSimCard;

    if (this.id) {
      data.location = this.form.value.location;
      //data.active = active;
      this.service.UpdateComponent(data).subscribe(
        (res) => {
          if (res['status'] == 200) {
            if (savedata.inactive == false) {
              var data = new ComponentNotesModel();
              data.id = 0;
              data.subject = 'Component Inactivated';
              data.note = savedata.inactiveReason;
              data.invNumber = this.form.value.inventoryNumber;
              data.userName = JSON.parse(localStorage.getItem('currentUser')).userName;
              data.user_PK = JSON.parse(localStorage.getItem('currentUser')).id;
              this.service.saveNote(data).subscribe(
                (res) => {
                },
                (error) => this.onError(error, ErrorMessages.components.save_info)
              );
            }
            this.utils.toast.success(res['message']);
            // this.SaveEditClick.emit(res);
          } else{
            this.utils.toast.error(res['message']);
          }
          this.form.reset();
          this.form.disable();
          this.isMajorchange = false;
          this.id = 0;
        },
        (error) => {
          this.onError(error, ErrorMessages.components.save_info);
        }
      );
    } else {
      data.location = "YARD";
      this.service.SaveComponent(data).subscribe(
        (res) => {
          if (res['status'] == 200) {
            this.utils.toast.success(res['message']);
            // this.SaveEditClick.emit(res);
          } else this.utils.toast.error(res['message']);
          this.form.reset(); this.isMajorchange = false;
          this.form.disable();
          this.id = 0;
        },
        (error) => {
          this.onError(error, ErrorMessages.components.save_info);
        }
      );
    }
  }
  btnAdd() {

    this.id = 0;this.isParts = false;
    this.form.reset(); this.globalPartname = '';
    this.form.enable(); this.isDisabled = false;
    this.componentId = null;
    this.isAdd = true; this.isdisableSN = false;
    this.isBranchVisisble = true;
  }
  onComponentChange(value) {
    this.isAdd = false;
    //this.componentId = value.id;
    this.componentName = value;
    this.displayAll = false;
    this.displayEngine = false;
    this.displayPumpEnd = false;
    this.displayPrimingSystem = false;
    this.displayGearBox = false;
    this.displayControlPanel = false;
    this.displayMessenger = false;
    this.displayChassis = false;
    this.displayGenset = false;
    this.displayVaccumPump = false;
    this.displayMotor = false;
    this.displayCompressor = false;
    this.displayDiaPump = false;
    if (this.componentId) {
      this.form.controls['component'].setValue(this.componentId);
    }
    switch (this.componentName) {
      case 'ENGINE':
        this.displayEngine = true;
        this.makeList = Object.keys(this.EngineMakeList)
          .filter((k) => typeof this.EngineMakeList[k] === 'number')
          .map((label) => ({ value: label, id: this.EngineMakeList[label] }));
        break;
      case 'PUMPEND':
        this.displayPumpEnd = true;
        this.makeList = Object.keys(this.pumpendMakeList)
          .filter((k) => typeof this.pumpendMakeList[k] === 'number')
          .map((label) => ({ value: label, id: this.pumpendMakeList[label] }));
        break;
      case 'PRIMINGSYSTEM':
        this.displayPrimingSystem = true;
        break;
      case 'GEARBOX':
        this.displayGearBox = true;
        this.makeList = Object.keys(this.GearboxMakeList)
          .filter((k) => typeof this.GearboxMakeList[k] === 'number')
          .map((label) => ({ value: label, id: this.GearboxMakeList[label] }));
        break;
      case 'CONTROLPANEL':
        this.displayControlPanel = true;
        this.makeList = Object.keys(this.ContorlPanelMakeList)
          .filter((k) => typeof this.ContorlPanelMakeList[k] === 'number')
          .map((label) => ({
            value: label,
            id: this.ContorlPanelMakeList[label],
          }));
        break;
      case 'MESSENGER':
        this.form.get('serialNumber').clearValidators();
        this.form.get('serialNumber').updateValueAndValidity();
        this.form.get('messengerSimCard').setValidators([Validators.required]);
        this.displayMessenger = true;
        break;
      case 'CHASSIS':
        this.displayChassis = true;
        break;
      case 'GENSET':
        this.displayGenset = true;
        break;
      case 'VACUUMPUMP':
        this.displayVaccumPump = true;
        this.makeList = Object.keys(this.VaccumPumpMakeList)
          .filter((k) => typeof this.VaccumPumpMakeList[k] === 'number')
          .map((label) => ({
            value: label,
            id: this.VaccumPumpMakeList[label],
          }));
        break;
      case 'MOTOR':
        this.displayMotor = true;
        this.makeList = Object.keys(this.MotorMakeList)
          .filter((k) => typeof this.MotorMakeList[k] === 'number')
          .map((label) => ({ value: label, id: this.MotorMakeList[label] }));
        break;
      case 'COMPRESSOR':
        this.displayCompressor = true;
        break;
      case 'DIAPUMP':
        this.displayDiaPump = true;
        this.makeList = Object.keys(this.DiapumpMakeList)
          .filter((k) => typeof this.DiapumpMakeList[k] === 'number')
          .map((label) => ({ value: label, id: this.DiapumpMakeList[label] }));
        break;
      default:
        this.displayAll = true;
        break;
    }
  }
  onRegBtn() {
    this.displayRegBtn = !this.displayRegBtn;
  }
  isRegister(val) {
    this.isRegisterFlag = val;
  }
  isMajorRepairchange(val) {
    this.isMajorchange = val;
  }
  openParts() {
    this.openInventoryType = true;
  }
  public close(status) {
    if (status == 'cancel') {
      this.openInventoryType = !this.openInventoryType;
    } else {
      this.openInventoryType = !this.openInventoryType;
    }
  }
  addInventoryItem() {
    var inv = this.gridView[this.mySelection[this.mySelection.length - 1]];
    if (!inv) {
      return false;
    }
    this.form.controls['globalPart'].setValue(inv.invType);
    this.globalPartname = inv.invType;
    this.openInventoryType = false;
  }
  selectionChange() { }
  dblClickEvent(event) {
    this.addInventoryItem();
  }
  checkSerialNo(sNo) {
    this.service.checkSerialNo(sNo).subscribe(
      (res) => {
        if (res.status == 200) {
          this.form.get('serialNumber').setValue('');
          this.utils.toast.error(res['message']);
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.vehicle.check_VIN);
      }
    );
  }
  onError(error: any, customMessage?: string) {
    this.errorHandler.handleError(error, "Component", customMessage);
  }
}
