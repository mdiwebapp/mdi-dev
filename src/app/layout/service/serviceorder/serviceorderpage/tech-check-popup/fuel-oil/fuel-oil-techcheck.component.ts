import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ErrorMessages } from 'src/app/core/constant';
import { ErrorHandlerService } from 'src/app/core/services';
import { UtilityService } from 'src/app/core/services/utility.service';
import {
  FuelLevelList, FuelWaterList, HosePipeList, LeakageList, CRANKCASEBREATHERList, ENGINEOIL_CONDITIONList, ENGINEOIL_LEVELList
} from '../../../../../../../data/serviceorderpage-data';
import { ServiceOrderService } from '../../../service-order/service-order.service';
import { airSeperationReclaimerTankModel, batteryModel, centrifugalPumpModel, commentsModel, compressorModel, coolingModel, couplerAlignCheckValveModel, electricalModel, enginePanelModel, enviornBoxModel, exhaustVactestModel, fuelIolModel, TechCheckModel, testVacuumPumpModel, trailerBrakesModel, trailerDeckingModel, trailerElectricalSystemModel, trailerModel, trailerRegulatoryModel, trailerTiresModel } from '../techCheck.model';

@Component({
  selector: 'app-fuel-oil-techcheck',
  templateUrl: './fuel-oil-techcheck.component.html',
  styleUrls: ['./fuel-oil-techcheck.component.scss'],
})
export class FuelOilTechCheckComponent implements OnInit {

  @Output() techCheckSave: EventEmitter<any> = new EventEmitter<any>();
  @Output() checkAllFields: EventEmitter<any> = new EventEmitter<any>();

  form: FormGroup;
  markAll: boolean = false;
  displayfueloilBtn: boolean = false;
  displaywaterinfuelBtn: boolean = false;
  displayhosesBtn: boolean = false;
  displayleaksBtn: boolean = false;
  displaycrankcaseBtn: boolean = false;
  displayoilleaksexistBtn: boolean = false;
  displayengineoilconditionBtn: boolean = false;
  displayengineoillevelBtn: boolean = false;
  displaySupervisorApproval: boolean = false;
  fuellevelList = FuelLevelList;
  waterlevelList = FuelWaterList;
  hosesList = HosePipeList;
  leaksList = LeakageList;
  CRANKCASEBREATHERList = CRANKCASEBREATHERList;
  ENGINEOIL_CONDITIONList = ENGINEOIL_CONDITIONList;
  ENGINEOIL_LEVELList = ENGINEOIL_LEVELList;
  techcheckFuel: any;
  isGenerator: boolean = false;
  isControlPanel: boolean = false;

  constructor(private formBuilder: FormBuilder, public service: ServiceOrderService,
    private utils: UtilityService, public errorHandler: ErrorHandlerService) { }

  ngOnInit() {
    this.initForm();
    this.techcheckFuel = this.service.techCheckService.fuelInfo;
    if (this.service.blGen == true) {
      this.isGenerator = true;
      this.isControlPanel = false;
      this.form.controls['fuelLeaks'].clearValidators();
    } else {
      this.isControlPanel = true; this.isGenerator = false;
      this.form.controls['fuelLeaks'].setValidators([Validators.required]);
    }
    
  }

  initForm(): void {
    this.form = this.formBuilder.group({
      fuelLevel: ['', Validators.required],
      fuelWater: ['', Validators.required],
      hoses: ['', Validators.required],
      fuelLeaks: [''],
      crankCase: ['', Validators.required],
      oilLeaks: ['', Validators.required],
      engineOilCond: ['', Validators.required],
      engineOilLevel: ['', Validators.required],
    });
  }
  get f() {
    return this.form.controls;
  }
  onfuelOil() { 
    this.techcheckFuel.fuelLevel = this.form.value.fuelLevel; 
    this.checkAllFieldsValid();
  }
  onwaterinfuelOil() {
    //this.service.techCheckService.fuelInfo.fuelWater = this.form.value.fuelWater;
    this.techcheckFuel.fuelWater = this.form.value.fuelWater; 
    this.checkAllFieldsValid();
  }
  onhoses() {
    this.techcheckFuel.hoses = this.form.value.hoses; 
    this.checkAllFieldsValid();
  }
  onleaks() {
    this.techcheckFuel.fuelLeaks = this.form.value.fuelLeaks; 
    this.checkAllFieldsValid();
  }
  onbreathe() {
    this.techcheckFuel.crankCase = this.form.value.crankCase; 
    this.checkAllFieldsValid();
  }
  onleaksExist() {
    this.techcheckFuel.oilLeaks = this.form.value.oilLeaks; 
    this.checkAllFieldsValid();

  }
  onOilCondition() {
    this.techcheckFuel.engineOilCond = this.form.value.engineOilCond; 
    this.checkAllFieldsValid();
  }
  onOilLevel() {
    this.techcheckFuel.engineOilLevel = this.form.value.engineOilLevel; 
    this.checkAllFieldsValid();
  }
  setData(res) {
    // this.service.GetTechCheckList(soNum).subscribe(
    //   (res) => { 
    this.techcheckFuel = this.service.techCheckService.fuelInfo;
    this.techcheckFuel.fuelLeaks = res.fuelLeaks;
    this.techcheckFuel.oilLeaks = res.oilLeaks;
    this.form.setValue({
      fuelLevel: !this.techcheckFuel.fuelLevel ? res.fuelIol.fuelLevel : this.techcheckFuel.fuelLevel,
      fuelWater: !this.techcheckFuel.fuelWater ? res.fuelIol.fuelWater : this.techcheckFuel.fuelWater,
      hoses: !this.techcheckFuel.hoses ? res.fuelIol.hoses : this.techcheckFuel.hoses,
      fuelLeaks: !this.techcheckFuel.fuelLeaks ? res.fuelLeaks??'' : this.techcheckFuel.fuelLeaks,
      crankCase: !this.techcheckFuel.crankCase ? res.fuelIol.crankCase : this.techcheckFuel.crankCase,
      oilLeaks: !this.techcheckFuel.oilLeaks ? res.oilLeaks??'' : this.techcheckFuel.oilLeaks,
      engineOilCond: !this.techcheckFuel.engineOilCond ? res.fuelIol.engineOilCond : this.techcheckFuel.engineOilCond,
      engineOilLevel: !this.techcheckFuel.engineOilLevel ? res.fuelIol.engineOilLevel : this.techcheckFuel.engineOilLevel
    });
    //this.checkAllFields.emit(event);
    // },
    // (error) => {
    //   this.onError(error, ErrorMessages.vendor.add_vendor_data);
    // }
    //);
  }
  onSave() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return false;
    }
    const data = new TechCheckModel();
    data.fuelIol = new fuelIolModel();
    data.fuelIol.fuelLevel = this.form.value.fuelLevel;
    data.fuelIol.fuelWater = this.form.value.fuelWater;
    data.fuelIol.hoses = this.form.value.hoses;
    data.fuelIol.fuelLeaks = this.form.value.fuelLeaks;
    this.service.techCheckService.fuelInfo.fuelLeaks = this.form.value.fuelLeaks;
    data.fuelIol.crankCase = this.form.value.crankCase;
    this.service.techCheckService.fuelInfo.oilLeaks = this.form.value.oilLeaks;
    data.fuelIol.oilLeaks = this.form.value.oilLeaks;
    data.fuelIol.engineOilCond = this.form.value.engineOilCond;
    data.fuelIol.engineOilLevel = this.form.value.engineOilLevel;
    //data.soNumber = soNum;
    this.service.techCheckService.fuelInfo = data.fuelIol;
    this.techCheckSave.emit(data);

  }

  checkAllFieldsValid(){
    if (this.form.valid) {
      this.checkAllFields.emit(true);
    }else{this.checkAllFields.emit(false);}
  }

  changeMarkAll(event) {
    this.techcheckFuel = this.service.techCheckService.fuelInfo;
    if (event == true) {
      this.form.controls['fuelLevel'].setValue('N/A');
      this.form.controls['fuelWater'].setValue('N/A');
      this.form.controls['hoses'].setValue('N/A');
      this.form.controls['fuelLeaks'].setValue('N/A');
      this.form.controls['crankCase'].setValue('N/A');
      this.form.controls['oilLeaks'].setValue('N/A');
      this.form.controls['engineOilCond'].setValue('N/A');
      this.form.controls['engineOilLevel'].setValue('N/A');
      this.techcheckFuel.fuelLevel = 'N/A';
      this.techcheckFuel.fuelWater = 'N/A';
      this.techcheckFuel.hoses = 'N/A';
      this.techcheckFuel.fuelLeaks = 'N/A';
      this.techcheckFuel.crankCase = 'N/A';
      this.techcheckFuel.oilLeaks = 'N/A';
      this.techcheckFuel.engineOilCond = 'N/A';
      this.techcheckFuel.engineOilLevel = 'N/A';
    } else {
      this.form.controls['fuelLevel'].setValue('');
      this.form.controls['fuelWater'].setValue('');
      this.form.controls['hoses'].setValue('');
      this.form.controls['fuelLeaks'].setValue('');
      this.form.controls['crankCase'].setValue('');
      this.form.controls['oilLeaks'].setValue('');
      this.form.controls['engineOilCond'].setValue('');
      this.form.controls['engineOilLevel'].setValue('');
      this.techcheckFuel.fuelLevel = '';
      this.techcheckFuel.fuelWater = '';
      this.techcheckFuel.hoses = '';
      this.techcheckFuel.fuelLeaks = '';
      this.techcheckFuel.crankCase = '';
      this.techcheckFuel.oilLeaks = '';
      this.techcheckFuel.engineOilCond = '';
      this.techcheckFuel.engineOilLevel = '';
    }
    this.checkAllFields.emit(event);
  }
  private onError(error: any, customMessage?: string) {
    this.errorHandler.handleError(error, "Tech Check", customMessage);
  }
}
