import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ErrorMessages } from 'src/app/core/constant';
import { ErrorHandlerService } from 'src/app/core/services';
import { UtilityService } from 'src/app/core/services/utility.service';
import {
  COOLANT_LEVELList, FANSANDBELTS_List, LeakageList, RADIATORCONDITION_List, WATERPUMPBEARINGS_List, WATERPUMP_List
} from '../../../../../../../data/serviceorderpage-data';
import { ServiceOrderService } from '../../../service-order/service-order.service';
import { airSeperationReclaimerTankModel, batteryModel, centrifugalPumpModel, commentsModel, compressorModel, coolingModel, couplerAlignCheckValveModel, electricalModel, enginePanelModel, enviornBoxModel, exhaustVactestModel, fuelIolModel, TechCheckModel, testVacuumPumpModel, trailerBrakesModel, trailerDeckingModel, trailerElectricalSystemModel, trailerModel, trailerRegulatoryModel, trailerTiresModel } from '../techCheck.model';
@Component({
  selector: 'app-cooling-techcheck',
  templateUrl: './cooling-techcheck.component.html',
  styleUrls: ['./cooling-techcheck.component.scss'],
})
export class CoolingTechCheckComponent implements OnInit {

  @Output() techCheckSave: EventEmitter<any> = new EventEmitter<any>();
  @Output() checkAllFields: EventEmitter<any> = new EventEmitter<any>();

  form: FormGroup;
  displaycoolBtn: boolean = false;
  displaywaterpumpBtn: boolean = false;
  displayfanBtn: boolean = false;
  displaypumpBearingBtn: boolean = false;
  displayradiatorBtn: boolean = false;
  displayleakingBtn: boolean = false;
  displayengineoilconditionBtn: boolean = false;
  displaySupervisorApproval: boolean = false;
  coolantLevelList = COOLANT_LEVELList;
  waterlevelList = WATERPUMP_List;
  fanList = FANSANDBELTS_List;
  radiatorList = RADIATORCONDITION_List;
  leaksList = LeakageList;
  pumpingbearingList = WATERPUMPBEARINGS_List;
  techcheckCooling: any;
  isGenerator: boolean = false;
  isControlPanel: boolean = false;
  markAll: boolean = false;
  constructor(private formBuilder: FormBuilder, public service: ServiceOrderService,
    private utils: UtilityService, public errorHandler: ErrorHandlerService) { }

  ngOnInit() {
    this.techcheckCooling = this.service.techCheckService.cooling;
    this.initForm();
    if (this.service.blGen == true) {
      this.isGenerator = true;
      this.isControlPanel = false;
      this.form.controls['leaksLevel'].clearValidators();
    } else {
      this.isControlPanel = true; this.isGenerator = false;
      this.form.controls['leaksLevel'].setValidators([Validators.required]);
    }
  }

  initForm(): void {
    this.form = this.formBuilder.group({
      glycolHydrometerReading: ['', Validators.required],
      coolantLevel: ['', Validators.required],
      waterLevel: ['', Validators.required],
      fanLevel: ['', Validators.required],
      pumpingbearingLevel: ['', Validators.required],
      radiatorLevel: ['', Validators.required],
      leaksLevel: ['', Validators.required],
    });
  }
  get f() {
    return this.form.controls;
  }
  onHydrometer() {
    this.techcheckCooling.hydrometer = this.form.value.glycolHydrometerReading;
    this.checkAllFieldsValid();
  }
  onCoolantLevel() {
    this.techcheckCooling.coolantReservoir = this.form.value.coolantLevel;
    this.checkAllFieldsValid();
  }
  onwaterPump() {
    this.techcheckCooling.waterPump = this.form.value.waterLevel;
    this.checkAllFieldsValid();
  }
  onFan() {
    this.techcheckCooling.fan = this.form.value.fanLevel;
    this.checkAllFieldsValid();
  }
  onPumpBearings() {
    this.techcheckCooling.waterPumpBearing = this.form.value.pumpingbearingLevel;
    this.checkAllFieldsValid();
  }
  onRadiator() {
    this.techcheckCooling.radiatorLevel = this.form.value.radiatorLevel;
    this.checkAllFieldsValid();
  }
  onLeaking() {
    this.techcheckCooling.waterLeak = this.form.value.leaksLevel;
    this.checkAllFieldsValid();
  }
  onOilCondition() {
    this.displayengineoilconditionBtn = !this.displayengineoilconditionBtn; this.checkAllFieldsValid();
  }
  setData(fuelIol) {
    this.techcheckCooling = this.service.techCheckService.cooling;
    this.techcheckCooling.coolantReservoir = fuelIol.coolantReservoir;
    this.form.setValue({
      glycolHydrometerReading: !this.techcheckCooling.hydrometer ? fuelIol.cooling.hydrometer : this.techcheckCooling.hydrometer,
      coolantLevel: !this.techcheckCooling.coolantReservoir ? fuelIol.coolantReservoir??'' : this.techcheckCooling.coolantReservoir,
      waterLevel: !this.techcheckCooling.waterPump ? fuelIol.cooling.waterPump : this.techcheckCooling.waterPump,
      fanLevel: !this.techcheckCooling.fan ? fuelIol.cooling.fan : this.techcheckCooling.fan,
      pumpingbearingLevel: !this.techcheckCooling.waterPumpBearing ? fuelIol.cooling.waterPumpBearing : this.techcheckCooling.waterPumpBearing,
      radiatorLevel: !this.techcheckCooling.radiatorLevel ? fuelIol.cooling.radiatorLevel : this.techcheckCooling.radiatorLevel,
      leaksLevel: !this.techcheckCooling.waterLeak ? fuelIol.cooling.waterLeak : this.techcheckCooling.waterLeak
    });
  }
  onSave() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return false;
    }
    const data = new TechCheckModel();
    data.cooling = new coolingModel();
    data.cooling.hydrometer = this.form.value.glycolHydrometerReading;
    data.cooling.coolantReservoir = this.form.value.coolantLevel;
    this.service.techCheckService.cooling.coolantReservoir = this.form.value.coolantLevel;
    data.cooling.waterPump = this.form.value.waterLevel;
    data.cooling.fan = this.form.value.fanLevel;
    data.cooling.waterPumpBearing = this.form.value.pumpingbearingLevel;
    data.cooling.radiatorLevel = this.form.value.radiatorLevel;
    data.cooling.waterLeak = this.form.value.leaksLevel??''; 
    this.service.techCheckService.cooling = data.cooling;
    this.techCheckSave.emit(data);
  }
  private onError(error: any, customMessage?: string) {
    this.errorHandler.handleError(error, "Tech Check", customMessage);
  }
  checkAllFieldsValid() {
    if (this.form.valid) {
      this.checkAllFields.emit(true);
    } else { this.checkAllFields.emit(false); }
  }
  changeMarkAll(event) {
    this.techcheckCooling = this.service.techCheckService.cooling;
    if (event == true) {
      this.form.controls['coolantLevel'].setValue('N/A');
      this.form.controls['waterLevel'].setValue('N/A');
      this.form.controls['fanLevel'].setValue('N/A');
      this.form.controls['pumpingbearingLevel'].setValue('N/A');
      this.form.controls['radiatorLevel'].setValue('N/A');
      this.form.controls['leaksLevel'].setValue('N/A');
      this.techcheckCooling.hydrometer = 'N/A';
      this.techcheckCooling.coolantReservoir = 'N/A';
      this.techcheckCooling.waterPump = 'N/A';
      this.techcheckCooling.fan = 'N/A';
      this.techcheckCooling.waterPumpBearing = 'N/A';
      this.techcheckCooling.radiatorLevel = 'N/A';
      this.techcheckCooling.waterLeak = 'N/A';
    } else {
      this.form.controls['coolantLevel'].setValue('');
      this.form.controls['waterLevel'].setValue('');
      this.form.controls['fanLevel'].setValue('');
      this.form.controls['pumpingbearingLevel'].setValue('');
      this.form.controls['radiatorLevel'].setValue('');
      this.form.controls['leaksLevel'].setValue('');
      this.techcheckCooling.hydrometer = '';
      this.techcheckCooling.coolantReservoir = '';
      this.techcheckCooling.waterPump = '';
      this.techcheckCooling.fan = '';
      this.techcheckCooling.waterPumpBearing = '';
      this.techcheckCooling.radiatorLevel = '';
      this.techcheckCooling.waterLeak = '';
    }
    this.checkAllFieldsValid();
  }
}
