import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ErrorHandlerService } from 'src/app/core/services';
import { UtilityService } from 'src/app/core/services/utility.service';
import {
  AIRCLEANER_HOUSING_List,
  EMISSIONCONTROL_List,
  ENGINE_MOUNTS_List,
  GOVERNERLINKAGE_List,
  LOAD_BANK,
  MSHAGUARDING_List,
  REAR_BEARINGS,
  SAFETYSWITCHES_List,
  WIRING_CONNECTIONS,
} from '../../../../../../../data/serviceorderpage-data';
import { ServiceOrderService } from '../../../service-order/service-order.service';
import { enginePanelModel, TechCheckModel } from '../techCheck.model';
@Component({
  selector: 'app-engine-techcheck',
  templateUrl: './engine-techcheck.component.html',
  styleUrls: ['./engine-techcheck.component.scss'],
})
export class EngineTechCheckComponent implements OnInit {
  @Output() techCheckSave: EventEmitter<any> = new EventEmitter<any>();
  @Output() checkAllFields: EventEmitter<any> = new EventEmitter<any>();

  form: FormGroup;
  displyfilterHousing: boolean = false;
  displyEngineMounts: boolean = false;
  displayGovernerLinkageing: boolean = false;
  displayMSHAGuarding: boolean = false;
  displaySafetySwitcheing: boolean = false;
  displayEmissionControl: boolean = false;
  displaySupervisorApproval: boolean = false;
  filterHousingList = AIRCLEANER_HOUSING_List;
  engineMountsList = ENGINE_MOUNTS_List;
  governerLinkageList = GOVERNERLINKAGE_List;
  mSHAGuardingList = MSHAGUARDING_List;
  safetySwitchesList = SAFETYSWITCHES_List;
  emissionControlList = EMISSIONCONTROL_List;
  loadBankList = LOAD_BANK;
  wiringConnectionList = WIRING_CONNECTIONS;
  rearBearingList = REAR_BEARINGS;
  techcheckEngine: any;
  markAll: boolean = false;
  isGenerator: boolean = false;
  isControlPanel: boolean = false;
  constructor(private formBuilder: FormBuilder, public service: ServiceOrderService,
    private utils: UtilityService, public errorHandler: ErrorHandlerService) { }

  ngOnInit() {
    this.initForm();
    if (this.service.blGen == true) {
      this.isGenerator = true;
      this.isControlPanel = false;
      //this.form.controls['engineSafetySwitch'].setValidators([Validators.required]);
    } else {
      this.isControlPanel = true; this.isGenerator = false;
      //this.form.controls['engineSafetySwitch'].clearValidators();
    }
    this.techcheckEngine = this.service.techCheckService.enginePanel;
  }

  initForm(): void {
    this.form = this.formBuilder.group({
      airCleanHousing: ['', Validators.required],
      engineMounts: ['', Validators.required],
      noise: ['', Validators.required],
      msha: ['', Validators.required],
      engineSafetySwitch: [''],
      engineManufacture: [],
      toothCount: [],
      throttleSource: [],
      tsC1: [],
      emission: [],
      suctionMax: [],
      suctionMin: [],
      dischargeMax: [],
      dischargeMin: [],
      transLevelMax: [],
      transLevelMin: [],
      acvL1: [],
      acvL2: [],
      acvL3: [],
      loadBank: [],
      hours: [],
      acHz: [],
      generatorWiring: [],
      rearBearing: [],
      oilShutdown: [],
      tempShutdown: [],
      speedShutdown: [],
    });
  }
  get f() {
    return this.form.controls;
  }
  onFilterHousing() {
    this.techcheckEngine.airCleanHousing = this.form.value.airCleanHousing;
    this.checkAllFieldsValid();
  }
  onEngineMounts() {
    this.techcheckEngine.engineMounts = this.form.value.engineMounts;
    this.checkAllFieldsValid();
  }
  onGovernerLinkage() {
    this.techcheckEngine.noise = this.form.value.noise;
    this.checkAllFieldsValid();
  }
  onMSHAGuarding() {
    this.techcheckEngine.msha = this.form.value.msha;
    this.checkAllFieldsValid();
  }
  onSafetySwitches() {
    this.techcheckEngine.engineSafetySwitch = this.form.value.engineSafetySwitch;
    this.checkAllFieldsValid();
  }
  onEmissionControl() {
    this.techcheckEngine.emission = this.form.value.emission;
    this.checkAllFieldsValid();
  }
  onacvL1() { this.techcheckEngine.acvL1 = this.form.value.acvL1; }
  onacvL2() { this.techcheckEngine.acvL2 = this.form.value.acvL2; }
  onacvL3() { this.techcheckEngine.acvL3 = this.form.value.acvL3; }
  onloadBank() { this.techcheckEngine.loadBank = this.form.value.loadBank; }
  onhours() { this.techcheckEngine.hours = this.form.value.hours; }
  onacHz() { this.techcheckEngine.acHz = this.form.value.acHz; }
  onEnginemanufactureInbox() { this.techcheckEngine.engineManufacturer = this.form.value.engineManufacture; }
  onToothcount() { this.techcheckEngine.toothCount = this.form.value.toothCount; }
  onSourse() { this.techcheckEngine.throttleSource = this.form.value.throttleSource; }
  onTSC1Address() { this.techcheckEngine.tsC1 = this.form.value.tsC1; }
  ongeneratorWiring() { this.techcheckEngine.generatorWiring = this.form.value.generatorWiring; }
  onrearBearing() { this.techcheckEngine.rearBearing = this.form.value.rearBearing; }
  onemission() { this.techcheckEngine.emission = this.form.value.emission; }
  onsuctionMax() { this.techcheckEngine.suctionMax = this.form.value.suctionMax; }
  onsuctionMin() { this.techcheckEngine.suctionMin = this.form.value.suctionMin; }
  ondischargeMax() { this.techcheckEngine.dischargeMax = this.form.value.dischargeMax; }
  ondischargeMin() { this.techcheckEngine.dischargeMin = this.form.value.dischargeMin; }
  ontransLevelMax() { this.techcheckEngine.transLevelMax = this.form.value.transLevelMax; }
  ontransLevelMin() { this.techcheckEngine.transLevelMin = this.form.value.transLevelMin; }

  setData(fuelIol) {
    this.form.setValue({
      airCleanHousing: !this.techcheckEngine.airCleanHousing ? fuelIol.enginePanel.airCleanHousing : this.techcheckEngine.airCleanHousing,
      engineMounts: !this.techcheckEngine.engineMounts ? fuelIol.enginePanel.engineMounts : this.techcheckEngine.engineMounts,
      noise: !this.techcheckEngine.noise ? fuelIol.enginePanel.noise ?? '' : this.techcheckEngine.noise,
      msha: !this.techcheckEngine.msha ? fuelIol.enginePanel.msha ?? '' : this.techcheckEngine.msha,
      engineManufacture: !this.techcheckEngine.engineManufacturer ? fuelIol.enginePanel.engineManufacturer : this.techcheckEngine.engineManufacturer,
      engineSafetySwitch: !this.techcheckEngine.engineSafetySwitch ? fuelIol.engineSafetySwitch ?? '' : this.techcheckEngine.engineSafetySwitch,
      toothCount: !this.techcheckEngine.toothCount ? fuelIol.enginePanel.toothCount : this.techcheckEngine.toothCount,
      tsC1: !this.techcheckEngine.tsC1 ? fuelIol.enginePanel.tsC1 : this.techcheckEngine.tsC1,
      throttleSource: !this.techcheckEngine.throttleSource ? fuelIol.enginePanel.throttleSource : this.techcheckEngine.throttleSource,
      emission: !this.techcheckEngine.emission ? fuelIol.enginePanel.emission : this.techcheckEngine.emission,
      suctionMax: !this.techcheckEngine.suctionMax ? fuelIol.enginePanel.suctionMax : this.techcheckEngine.suctionMax,
      suctionMin: !this.techcheckEngine.suctionMin ? fuelIol.enginePanel.suctionMin : this.techcheckEngine.suctionMin,
      dischargeMax: !this.techcheckEngine.dischargeMax ? fuelIol.enginePanel.dischargeMax : this.techcheckEngine.dischargeMax,
      dischargeMin: !this.techcheckEngine.dischargeMin ? fuelIol.enginePanel.dischargeMin : this.techcheckEngine.dischargeMin,
      transLevelMax: !this.techcheckEngine.transLevelMax ? fuelIol.enginePanel.transLevelMax : this.techcheckEngine.transLevelMax,
      transLevelMin: !this.techcheckEngine.transLevelMin ? fuelIol.enginePanel.transLevelMin : this.techcheckEngine.transLevelMin,
      acvL1: !this.techcheckEngine.acvL1 ? fuelIol.enginePanel.acvL1 : this.techcheckEngine.acvL1,
      acvL2: !this.techcheckEngine.acvL2 ? fuelIol.enginePanel.acvL2 : this.techcheckEngine.acvL2,
      acvL3: !this.techcheckEngine.acvL3 ? fuelIol.enginePanel.acvL3 : this.techcheckEngine.acvL3,
      loadBank: !this.techcheckEngine.loadBank ? fuelIol.enginePanel.loadBank : this.techcheckEngine.loadBank,
      hours: !this.techcheckEngine.hours ? fuelIol.enginePanel.hours : this.techcheckEngine.hours,
      acHz: !this.techcheckEngine.acHz ? fuelIol.enginePanel.acHz : this.techcheckEngine.acHz,
      generatorWiring: !this.techcheckEngine.generatorWiring ? fuelIol.enginePanel.generatorWiring : this.techcheckEngine.generatorWiring,
      rearBearing: !this.techcheckEngine.rearBearing ? fuelIol.enginePanel.rearBearing : this.techcheckEngine.rearBearing,
      oilShutdown: !this.techcheckEngine.oilShutdown ? fuelIol.enginePanel.oilShutdown : this.techcheckEngine.oilShutdown,
      tempShutdown: !this.techcheckEngine.tempShutdown ? fuelIol.enginePanel.tempShutdown : this.techcheckEngine.tempShutdown,
      speedShutdown: !this.techcheckEngine.speedShutdown ? fuelIol.enginePanel.speedShutdown : this.techcheckEngine.speedShutdown,
    });
  }
  onSave() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return false;
    }
    const data = new TechCheckModel();
    data.enginePanel = new enginePanelModel();
    data.enginePanel.airCleanHousing = this.form.value.airCleanHousing;
    data.enginePanel.engineMounts = this.form.value.engineMounts;
    data.enginePanel.noise = this.form.value.noise;
    data.enginePanel.msha = this.form.value.msha;
    data.enginePanel.engineSafetySwitch = this.form.value.engineSafetySwitch;
    data.enginePanel.engineManufacturer = this.form.value.engineManufacture;
    data.enginePanel.toothCount = this.form.value.toothCount;
    data.enginePanel.throttleSource = this.form.value.throttleSource;
    data.enginePanel.tsC1 = this.form.value.tsC1;
    data.enginePanel.acvL1 = this.form.value.acvL1;
    data.enginePanel.acvL2 = this.form.value.acvL2;
    data.enginePanel.acvL3 = this.form.value.acvL3;
    data.enginePanel.loadBank = this.form.value.loadBank;
    data.enginePanel.hours = this.form.value.hours;
    data.enginePanel.acHz = this.form.value.acHz;
    data.enginePanel.generatorWiring = this.form.value.generatorWiring;
    data.enginePanel.rearBearing = this.form.value.rearBearing;
    data.enginePanel.emission = this.form.value.emission;
    data.enginePanel.suctionMax = this.form.value.suctionMax;
    data.enginePanel.suctionMin = this.form.value.suctionMin;
    data.enginePanel.dischargeMax = this.form.value.dischargeMax;
    data.enginePanel.dischargeMin = this.form.value.dischargeMin;
    data.enginePanel.transLevelMax = this.form.value.transLevelMax;
    data.enginePanel.transLevelMin = this.form.value.transLevelMin;
    data.enginePanel.oilShutdown = this.form.value.oilShutdown;
    data.enginePanel.tempShutdown = this.form.value.tempShutdown;
    data.enginePanel.speedShutdown = this.form.value.speedShutdown;
    this.service.techCheckService.enginePanel = data.enginePanel;
    this.techCheckSave.emit(data);
  }
  changeMarkAll(event) {
    this.techcheckEngine = this.service.techCheckService.enginePanel;
    if (event == true) {
      this.form.controls['airCleanHousing'].setValue('N/A');
      this.form.controls['engineMounts'].setValue('N/A');
      this.form.controls['noise'].setValue('N/A');
      this.form.controls['msha'].setValue('N/A');
      this.form.controls['engineSafetySwitch'].setValue('N/A');
      // this.form.controls['engineManufacture'].setValue('N/A');
      // this.form.controls['toothCount'].setValue('N/A');
      // this.form.controls['throttleSource'].setValue('N/A');
      // this.form.controls['tsC1'].setValue('N/A');
      this.techcheckEngine.airCleanHousing = 'N/A';
      this.techcheckEngine.engineMounts = 'N/A';
      this.techcheckEngine.noise = 'N/A';
      this.techcheckEngine.msha = 'N/A';
      this.techcheckEngine.engineSafetySwitch = 'N/A';
      // this.techcheckEngine.engineManufacture='N/A';
      // this.techcheckEngine.toothCount='N/A';
      // this.techcheckEngine.throttleSource='N/A';
      // this.techcheckEngine.tsC1='N/A';
    } else {
      this.form.controls['airCleanHousing'].setValue('');
      this.form.controls['engineMounts'].setValue('');
      this.form.controls['noise'].setValue('');
      this.form.controls['msha'].setValue('');
      this.form.controls['engineSafetySwitch'].setValue('');
      this.techcheckEngine.airCleanHousing = '';
      this.techcheckEngine.engineMounts = '';
      this.techcheckEngine.noise = '';
      this.techcheckEngine.msha = '';
      this.techcheckEngine.engineSafetySwitch = '';
    }
    this.checkAllFields.emit(event);
  }
  checkAllFieldsValid() {
    if (this.form.valid) {
      this.checkAllFields.emit(true);
    } else { this.checkAllFields.emit(false); }
  }
  private onError(error: any, customMessage?: string) {
    this.errorHandler.handleError(error, "Tech Check", customMessage);
  }
}
