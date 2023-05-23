import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VEHICLE_OPTION_LIST } from 'src/data/serviceorderpage-data';
import { ServiceOrderService } from '../../../service-order/service-order.service';
import { TechCheckModel, vehicleFluidLevelsModel } from '../techCheck.model';

@Component({
  selector: 'app-fluid-levels',
  templateUrl: './fluid-levels.component.html',
  styleUrls: ['./fluid-levels.component.scss'],
})
export class FluidLevelsComponent implements OnInit {
  @Output() techCheckSave: EventEmitter<any> = new EventEmitter<any>();
  @Output() checkAllFields: EventEmitter<any> = new EventEmitter<any>();
  markAll: boolean = false;
  form: FormGroup;
  displayBrakeReservoir: boolean = false;
  displayCoolantReservoir: boolean = false;
  displayTransferCase: boolean = false;
  displayFrontDiffrential: boolean = false;
  displayRearDiffrential: boolean = false;
  displayWindShieldReservoir: boolean = false;
  displayTransmission: boolean = false;
  displayEngineOil: boolean = false;
  displayPowerStreeing: boolean = false;
  techcheckCooling: any;

  vehicleOptions: any = VEHICLE_OPTION_LIST;
  constructor(private formBuilder: FormBuilder,public service: ServiceOrderService) {}

  ngOnInit(): void {
    this.onInitForm();
    this.techcheckCooling = this.service.techCheckService.vehicleFluidLevels;
  }

  onInitForm() {
    this.form = this.formBuilder.group({
      brakeReservoir: ['', Validators.required],
      coolantReservoir: ['', Validators.required],
      transferCase: ['', Validators.required],
      frontDiffrential:['', Validators.required],
      rearDiffrential: ['', Validators.required],
      windShieldReservoir: ['', Validators.required],
      transmission: ['', Validators.required],
      engineOil: ['', Validators.required],
      powerStreeing: ['', Validators.required],
    });
  }
  get f() {
    return this.form.controls;
  }
  onHandleOperations(type) {
    switch (type) {
      case 'brake_reservoir': 
        this.techcheckCooling.brakeReservoir = this.form.value.brakeReservoir;this.checkAllFieldsValid();
        break;
      case 'coolant_reservoir': 
        this.techcheckCooling.exhaust = this.form.value.coolantReservoir;this.checkAllFieldsValid();
        break;
      case 'transfer_case': 
        this.techcheckCooling.transferCase = this.form.value.transferCase;this.checkAllFieldsValid();
        break;
      case 'front_differential': 
        this.techcheckCooling.frontDifferential = this.form.value.frontDiffrential;this.checkAllFieldsValid();
        break;
      case 'rear_differential': 
        this.techcheckCooling.rearDifferential = this.form.value.rearDiffrential;this.checkAllFieldsValid();
        break;
      case 'windshield_reservoir': 
        this.techcheckCooling.windshieldWasherReservoir = this.form.value.windShieldReservoir;this.checkAllFieldsValid();
        break;
      case 'transmission': 
        this.techcheckCooling.transmission = this.form.value.transmission;this.checkAllFieldsValid();
        break;
      case 'engine_oil': 
        this.techcheckCooling.engineOil = this.form.value.engineOil;this.checkAllFieldsValid();
        break;
      case 'power_steering': 
        this.techcheckCooling.powerSteering = this.form.value.powerStreeing;this.checkAllFieldsValid();
        break;
      default:
        break;
    }
  }
  setData(fuelIol) {
    this.techcheckCooling = this.service.techCheckService.vehicleFluidLevels;
    this.techcheckCooling.coolantReservoir = fuelIol.coolantReservoir;
    this.form.setValue({
      brakeReservoir: !this.techcheckCooling.brakeReservoir ? fuelIol.vehicleFluidLevels.brakeReservoir : this.techcheckCooling.brakeReservoir,
      transferCase: !this.techcheckCooling.transferCase ? fuelIol.vehicleFluidLevels.transferCase : this.techcheckCooling.transferCase,
      frontDiffrential: !this.techcheckCooling.frontDiffrential ? fuelIol.vehicleFluidLevels.frontDifferential : this.techcheckCooling.frontDiffrential,
      rearDiffrential: !this.techcheckCooling.rearDiffrential ? fuelIol.vehicleFluidLevels.rearDifferential : this.techcheckCooling.rearDiffrential,
      windShieldReservoir: !this.techcheckCooling.windshieldWasherReservoir ? fuelIol.vehicleFluidLevels.windshieldWasherReservoir : this.techcheckCooling.windshieldWasherReservoir,
      transmission: !this.techcheckCooling.transmission ? fuelIol.vehicleFluidLevels.transmission : this.techcheckCooling.transmission,
      engineOil: !this.techcheckCooling.engineOil ? fuelIol.vehicleFluidLevels.engineOil : this.techcheckCooling.engineOil,
      powerStreeing: !this.techcheckCooling.powerStreeing ? fuelIol.vehicleFluidLevels.powerSteering : this.techcheckCooling.powerStreeing,
      coolantReservoir: !this.techcheckCooling.coolantReservoir ? fuelIol.coolantReservoir : this.techcheckCooling.coolantReservoir,
      
    });    
  }
  onSave() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return false;
    }
    const data = new TechCheckModel();
    data.vehicleFluidLevels = new vehicleFluidLevelsModel();
    data.vehicleFluidLevels.brakeReservoir = this.form.value.brakeReservoir; 
    data.vehicleFluidLevels.transferCase = this.form.value.transferCase; 
    data.vehicleFluidLevels.frontDifferential = this.form.value.frontDiffrential; 
    data.vehicleFluidLevels.rearDifferential = this.form.value.rearDiffrential; 
    data.vehicleFluidLevels.windshieldWasherReservoir = this.form.value.windShieldReservoir; 
    data.vehicleFluidLevels.transmission = this.form.value.transmission; 
    data.vehicleFluidLevels.engineOil = this.form.value.engineOil; 
    data.vehicleFluidLevels.powerSteering = this.form.value.powerStreeing; 
    data.vehicleFluidLevels.coolantReservoir = this.form.value.coolantReservoir;
    this.service.techCheckService.vehicleFluidLevels.coolantReservoir = this.form.value.coolantReservoir;
    this.techCheckSave.emit(data);
  }
  checkAllFieldsValid(){
    if (this.form.valid) {
      this.checkAllFields.emit(true);
    }else{this.checkAllFields.emit(false);}
  }
  changeMarkAll(event) {
    this.techcheckCooling = this.service.techCheckService.vehicleFluidLevels;
    if (event == true) {
      this.form.controls['brakeReservoir'].setValue('N/A');
      this.form.controls['coolantReservoir'].setValue('N/A');
      this.form.controls['transferCase'].setValue('N/A');
      this.form.controls['frontDiffrential'].setValue('N/A');
      this.form.controls['rearDiffrential'].setValue('N/A');
      this.form.controls['windShieldReservoir'].setValue('N/A');
      this.form.controls['transmission'].setValue('N/A');
      this.form.controls['engineOil'].setValue('N/A');
      this.form.controls['powerStreeing'].setValue('N/A');
      this.techcheckCooling.brakeReservoir = 'N/A';
      this.techcheckCooling.exhaust = 'N/A';
      this.techcheckCooling.transferCase = 'N/A';
      this.techcheckCooling.frontDifferential = 'N/A';
      this.techcheckCooling.rearDifferential = 'N/A';
      this.techcheckCooling.windshieldWasherReservoir = 'N/A';
      this.techcheckCooling.transmission = 'N/A';
      this.techcheckCooling.engineOil = 'N/A';
      this.techcheckCooling.powerSteering = 'N/A';
    } else {
      this.form.controls['brakeReservoir'].setValue('');
      this.form.controls['coolantReservoir'].setValue('');
      this.form.controls['transferCase'].setValue('');
      this.form.controls['frontDiffrential'].setValue('');
      this.form.controls['rearDiffrential'].setValue('');
      this.form.controls['windShieldReservoir'].setValue('');
      this.form.controls['transmission'].setValue('');
      this.form.controls['engineOil'].setValue('');
      this.form.controls['powerStreeing'].setValue('');
      this.techcheckCooling.brakeReservoir = '';
      this.techcheckCooling.exhaust = '';
      this.techcheckCooling.transferCase = '';
      this.techcheckCooling.frontDifferential = '';
      this.techcheckCooling.rearDifferential = '';
      this.techcheckCooling.windshieldWasherReservoir = '';
      this.techcheckCooling.transmission = '';
      this.techcheckCooling.engineOil = '';
      this.techcheckCooling.powerSteering = '';
    }
    this.checkAllFields.emit(event);
  }
}
