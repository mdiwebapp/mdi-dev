import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ErrorHandlerService } from 'src/app/core/services';
import { UtilityService } from 'src/app/core/services/utility.service';
import {
  BRAKEACTUATOR_List,
  FRAME_List,
  HUBS_List,
  LIGHTS_List,
  PINTLEHITCH_List,
  SAFETYLATCHES_List,
  Tech_TIRES_LIST,
  WHEELBEARINGS_List,
  WHEELS_List,
  WIRINGHARNESS_List,
} from '../../../../../../../data/serviceorderpage-data';
import { ServiceOrderService } from '../../../service-order/service-order.service';
import { TechCheckModel, trailerModel } from '../techCheck.model';

@Component({
  selector: 'app-trailer-techcheck',
  templateUrl: './trailer-techcheck.component.html',
  styleUrls: ['./trailer-techcheck.component.scss'],
})
export class TrailerTechCheckComponent implements OnInit {
  @Output() techCheckSave: EventEmitter<any> = new EventEmitter<any>();
  @Output() checkAllFields: EventEmitter<any> = new EventEmitter<any>();

  form: FormGroup;
  displayFrameBtn: boolean = false;
  displayPintleHitchBtn: boolean = false;
  displaySafetyLatchesBtn: boolean = false;
  displayWiringHarnessBtn: boolean = false;
  displayLightsBtn: boolean = false;
  displayTiresBtn: boolean = false;
  displayWheelsBtn: boolean = false;
  displayWheelsBearingBtn: boolean = false;
  displayWheelsBearingLUGSBtn: boolean = false;
  displayActuatorConditionBtn: boolean = false;
  frameList = FRAME_List;
  pintleHitchList = PINTLEHITCH_List;
  safetyLatchesList = SAFETYLATCHES_List;
  wiringHarnessList = WIRINGHARNESS_List;
  lightsList = LIGHTS_List;
  tiresList = Tech_TIRES_LIST;
  wheelsList = WHEELS_List;
  wheelsBearingList = WHEELBEARINGS_List;
  wheelsBearingLUGSList = HUBS_List;
  actutorConditionList = BRAKEACTUATOR_List;
  isGenerator: boolean = false;
  isControlPanel: boolean = false;

  techcheckTrailer: any;

  constructor(private formBuilder: FormBuilder, public service: ServiceOrderService,
    private utils: UtilityService, public errorHandler: ErrorHandlerService) { }

  ngOnInit() {
    this.initForm();
    if (this.service.blGen == true) {
      this.isGenerator = true;
      this.isControlPanel = false;
      this.form.controls['tiresData'].clearValidators();
      this.form.controls['wheelsBearingLUGSData'].clearValidators();
    } else {
      this.isControlPanel = true; this.isGenerator = false;
      // this.form.controls['tiresData'].setValidators([Validators.required]);
      // this.form.controls['wheelsBearingLUGSData'].setValidators([Validators.required]);
    }
    this.techcheckTrailer = this.service.techCheckService.trailer;
  }

  initForm(): void {
    this.form = this.formBuilder.group({
      tirePSILF: [''],
      tirePSILR: [''],
      tirePSIRF: [''],
      tirePSIRR: [''],
      tireTreadLF: [''],
      tireTreadLR: [''],
      tireTreadRF: [''],
      tireTreadRR: [''],
      tirePSILM: [''],
      tirePSIRM: [''],
      tireTreadLM: [''],
      tireTreadRM: [''],
      framData: ['', Validators.required],
      pintleHitchData: ['', Validators.required],
      safetyLatchesData: ['', Validators.required],
      harness: ['', Validators.required],
      lightsData: ['', Validators.required],
      tiresData: [],
      wheelsData: ['', Validators.required],
      wheelsBearingData: ['', Validators.required],
      wheelsBearingLUGSData: [],
      actutorConditionData: ['', Validators.required],
    });
  }
  get f() {
    return this.form.controls;
  }
  ontirePSILF() { this.techcheckTrailer.tirePSILF = this.form.value.tirePSILF; this.checkAllFieldsValid(); }
  ontirePSILM() { this.techcheckTrailer.tirePSILM = this.form.value.tirePSILM; this.checkAllFieldsValid(); }
  ontirePSILR() { this.techcheckTrailer.tirePSILR = this.form.value.tirePSILR; this.checkAllFieldsValid(); }
  ontirePSIRF() { this.techcheckTrailer.tirePSIRF = this.form.value.tirePSIRF; this.checkAllFieldsValid(); }
  ontirePSIRM() { this.techcheckTrailer.tirePSIRM = this.form.value.tirePSIRM; this.checkAllFieldsValid(); }
  ontirePSIRR() { this.techcheckTrailer.tirePSIRR = this.form.value.tirePSIRR; this.checkAllFieldsValid(); }
  ontireTreadLF() { this.techcheckTrailer.tireTreadLF = this.form.value.tireTreadLF; this.checkAllFieldsValid(); }
  ontireTreadLM() { this.techcheckTrailer.tireTreadLM = this.form.value.tireTreadLM; this.checkAllFieldsValid(); }
  ontireTreadLR() { this.techcheckTrailer.tireTreadLR = this.form.value.tireTreadLR; this.checkAllFieldsValid(); }
  ontireTreadRF() { this.techcheckTrailer.tireTreadRF = this.form.value.tireTreadRF; this.checkAllFieldsValid(); }
  ontireTreadRM() { this.techcheckTrailer.tireTreadRM = this.form.value.tireTreadRM; this.checkAllFieldsValid(); }
  ontireTreadRR() { this.techcheckTrailer.tireTreadRR = this.form.value.tireTreadRR; this.checkAllFieldsValid(); }
  onBatteryLeaks() {
    this.techcheckTrailer.frame = this.form.value.framData;
    // this.displayFrameBtn = !this.displayFrameBtn;
    // if (this.form.value.framData)
    //   this.checkAllFields.emit(true);
    this.checkAllFieldsValid();
  }
  onPintleHitch() {
    this.techcheckTrailer.pintleHitch = this.form.value.pintleHitchData;
    this.checkAllFieldsValid();
    // this.displayPintleHitchBtn = !this.displayPintleHitchBtn;
    // if (this.form.value.pintleHitchData)
    //   this.checkAllFields.emit(true);
  }
  onSafetyLatches() {
    this.techcheckTrailer.safetyLatchesData = this.form.value.safetyLatchesData;
    this.checkAllFieldsValid();
    // this.displaySafetyLatchesBtn = !this.displaySafetyLatchesBtn;
    // if (this.form.value.safetyLatchesData)
    //   this.checkAllFields.emit(true);
  }
  onWiringHarness() {
    this.techcheckTrailer.harness = this.form.value.harness;
    this.checkAllFieldsValid();
    // this.displayWiringHarnessBtn = !this.displayWiringHarnessBtn;
    // if (this.form.value.harness)
    //   this.checkAllFields.emit(true);
  }
  onLights() {
    this.techcheckTrailer.lights = this.form.value.lightsData;
    this.checkAllFieldsValid();
    // this.displayLightsBtn = !this.displayLightsBtn;
    // if (this.form.value.lightsData)
    //   this.checkAllFields.emit(true);
  }
  onTires() {
    this.techcheckTrailer.tires = this.form.value.tires;
    this.checkAllFieldsValid();
    // this.displayTiresBtn = !this.displayTiresBtn;
    // if (this.form.value.tires)
    //   this.checkAllFields.emit(true);
  }
  onWheels() {
    this.techcheckTrailer.wheel = this.form.value.wheelsData;
    this.checkAllFieldsValid();
    // this.displayWheelsBtn = !this.displayWheelsBtn;
    // if (this.form.value.wheelsData)
    //   this.checkAllFields.emit(true);
  }
  onWheelsBearings() {
    this.techcheckTrailer.wheelBearing = this.form.value.wheelsBearingData;
    this.checkAllFieldsValid();
    // this.displayWheelsBearingBtn = !this.displayWheelsBearingBtn;
    // if (this.form.value.wheelsBearingData)
    //   this.checkAllFields.emit(true);
  }
  onWheelsBearingsLUGS() {
    this.techcheckTrailer.hubs = this.form.value.wheelsBearingLUGSData;
    this.checkAllFieldsValid();
    // this.displayWheelsBearingLUGSBtn = !this.displayWheelsBearingLUGSBtn;
    // if (this.form.value.wheelsBearingLUGSData)
    //   this.checkAllFields.emit(true);
  }
  onActuatorCondition() {
    this.techcheckTrailer.brakeActuator = this.form.value.actutorConditionData; this.checkAllFieldsValid();
    // this.displayActuatorConditionBtn = !this.displayActuatorConditionBtn;
    // if (this.form.value.actutorConditionData)
    //   this.checkAllFields.emit(true);
  }
  setData(fuelIol) {
    this.techcheckTrailer = this.service.techCheckService.trailer;
    this.techcheckTrailer.tirePSILF = fuelIol.tirePSILF;
    this.techcheckTrailer.pintleHitch = fuelIol.pintleHitch;
    this.techcheckTrailer.safetyLatchesData = fuelIol.safetyLatches;
    this.techcheckTrailer.hubs = fuelIol.hubs;
    this.techcheckTrailer.tirePSILR = fuelIol.tirePSILR;
    this.techcheckTrailer.tirePSIRF = fuelIol.tirePSIRF;
    this.techcheckTrailer.tirePSIRR = fuelIol.tirePSIRR;
    this.techcheckTrailer.tireTreadLF = fuelIol.tireTreadLF;
    this.techcheckTrailer.tireTreadLR = fuelIol.tireTreadLR;
    this.techcheckTrailer.tireTreadRF = fuelIol.tireTreadRF;
    this.techcheckTrailer.tireTreadRR = fuelIol.tireTreadRR;
    this.techcheckTrailer.brakeActuator = fuelIol.brakeActuator;
    this.techcheckTrailer.tires = fuelIol.tires;

    this.form.setValue({
      framData: !this.techcheckTrailer.frame ? fuelIol.trailer.frame : this.techcheckTrailer.frame,
      harness: !this.techcheckTrailer.harness ? fuelIol.trailer.harness : this.techcheckTrailer.harness,
      lightsData: !this.techcheckTrailer.lights ? fuelIol.trailer.lights : this.techcheckTrailer.lights,
      wheelsBearingData: !this.techcheckTrailer.wheelBearing ? fuelIol.trailer.wheelBearing : this.techcheckTrailer.wheelBearing,
      wheelsData: !this.techcheckTrailer.wheel ? fuelIol.trailer.wheel ?? 'N/A' : this.techcheckTrailer.wheel,
      pintleHitchData: !this.techcheckTrailer.pintleHitch ? fuelIol.pintleHitch ?? '' : this.techcheckTrailer.pintleHitch,
      safetyLatchesData: !this.techcheckTrailer.safetyLatchesData ? fuelIol.safetyLatches ?? '' : this.techcheckTrailer.safetyLatchesData,
      wheelsBearingLUGSData: !this.techcheckTrailer.hubs ? fuelIol.hubs ?? '' : this.techcheckTrailer.hubs,

      tirePSILF: !this.techcheckTrailer.tirePSILF ? fuelIol.tirePSILF ?? '' : this.techcheckTrailer.tirePSILF,
      tirePSILR: !this.techcheckTrailer.tirePSILR ? fuelIol.tirePSILR ?? '' : this.techcheckTrailer.tirePSILR,
      tirePSIRF: !this.techcheckTrailer.tirePSIRF ? fuelIol.tirePSIRF ?? '' : this.techcheckTrailer.tirePSIRF,
      tirePSIRR: !this.techcheckTrailer.tirePSIRR ? fuelIol.tirePSIRR ?? '' : this.techcheckTrailer.tirePSIRR,
      tireTreadLF: !this.techcheckTrailer.tireTreadLF ? fuelIol.tireTreadLF ?? '' : this.techcheckTrailer.tireTreadLF,
      tireTreadLR: !this.techcheckTrailer.tireTreadLR ? fuelIol.tireTreadLR ?? '' : this.techcheckTrailer.tireTreadLR,
      tireTreadRF: !this.techcheckTrailer.tireTreadRF ? fuelIol.tireTreadRF ?? '' : this.techcheckTrailer.tireTreadRF,
      tireTreadRR: !this.techcheckTrailer.tireTreadRR ? fuelIol.tireTreadRR ?? '' : this.techcheckTrailer.tireTreadRR,
      tirePSILM: !this.techcheckTrailer.tirePSILM ? fuelIol.trailer.tirePSILM ?? '' : this.techcheckTrailer.tirePSILM,
      tirePSIRM: !this.techcheckTrailer.tirePSIRM ? fuelIol.trailer.tirePSIRM ?? '' : this.techcheckTrailer.tirePSIRM,
      tireTreadLM: !this.techcheckTrailer.tireTreadLM ? fuelIol.trailer.tireTreadLM ?? '' : this.techcheckTrailer.tireTreadLM,
      tireTreadRM: !this.techcheckTrailer.tireTreadRM ? fuelIol.trailer.tireTreadRM ?? '' : this.techcheckTrailer.tireTreadRM,
      actutorConditionData: !this.techcheckTrailer.brakeActuator ? fuelIol.brakeActuator ?? '' : this.techcheckTrailer.brakeActuator,
      tiresData: !this.techcheckTrailer.tires ? fuelIol.tires : this.techcheckTrailer.tires,
    });
  }
  onSave() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return false;
    }
    const data = new TechCheckModel();
    data.trailer = new trailerModel();
    this.service.techCheckService.trailer.tirePSILF = this.form.value.tirePSILF;
    this.service.techCheckService.trailer.tirePSILR = this.form.value.tirePSILR;
    this.service.techCheckService.trailer.tirePSIRF = this.form.value.tirePSIRF;
    this.service.techCheckService.trailer.tirePSIRR = this.form.value.tirePSIRR;

    this.service.techCheckService.trailer.tireTreadLF = this.form.value.tireTreadLF;
    this.service.techCheckService.trailer.tireTreadLR = this.form.value.tireTreadLR;
    this.service.techCheckService.trailer.tireTreadRF = this.form.value.tireTreadRF;
    this.service.techCheckService.trailer.tireTreadRR = this.form.value.tireTreadRR;
    this.service.techCheckService.trailer.tirePSILM = this.form.value.tirePSILM;
    this.service.techCheckService.trailer.tirePSIRM = this.form.value.tirePSIRM;
    this.service.techCheckService.trailer.tireTreadLM = this.form.value.tireTreadLM;
    this.service.techCheckService.trailer.tireTreadRM = this.form.value.tireTreadRM;

    this.service.techCheckService.trailer.frame = this.form.value.framData;
    this.service.techCheckService.trailer.harness = this.form.value.harness;
    this.service.techCheckService.trailer.lights = this.form.value.lightsData;
    this.service.techCheckService.trailer.wheelBearing = this.form.value.wheelsBearingData;
    this.service.techCheckService.trailer.wheel = this.form.value.wheelsData;
    this.service.techCheckService.trailer.pintleHitch = this.form.value.pintleHitchData;
    this.service.techCheckService.trailer.brakeActuator = this.form.value.actutorConditionData;
    this.service.techCheckService.trailer.safetyLatchesData = this.form.value.safetyLatchesData;
    this.service.techCheckService.trailer.hubs = '';

    this.techCheckSave.emit(data);
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
