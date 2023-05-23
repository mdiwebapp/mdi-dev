import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VEHICLE_OPTION_LIST } from 'src/data/serviceorderpage-data';
import { ServiceOrderService } from '../../../service-order/service-order.service';
import { TechCheckModel, vehicleEngineModel } from '../techCheck.model';

@Component({
  selector: 'app-vehicle-engine',
  templateUrl: './vehicle-engine.component.html',
  styleUrls: ['./vehicle-engine.component.scss'],
})
export class VehicleEngineComponent implements OnInit {
  @Output() techCheckSave: EventEmitter<any> = new EventEmitter<any>();
  @Output() checkAllFields: EventEmitter<any> = new EventEmitter<any>();
  form: FormGroup;
  displayAirFilter: boolean = false;
  displayBattery: boolean = false;
  displayOilLeaks: boolean = false;
  displayFuelLeaks: boolean = false;
  displayCleanliness: boolean = false;
  displayRadiatorClean: boolean = false;
  vehicleOptions: any = VEHICLE_OPTION_LIST;
  techcheckCooling: any;
  markAll: boolean = false;
  
  constructor(private formBuilder: FormBuilder, public service: ServiceOrderService) { }

  ngOnInit(): void {
    this.onInitForm();
    this.techcheckCooling = this.service.techCheckService.vehicleEngine;
  }

  onInitForm() {
    this.form = this.formBuilder.group({
      airFilter: ['', Validators.required],
      battery: ['', Validators.required],
      oilLeaks: ['', Validators.required],
      fuelLeaks: ['', Validators.required],
      cleanliness: ['', Validators.required],
      radiatorClean: ['', Validators.required],
      mileage: ['', Validators.required],
      eCode: ['', Validators.required],
    });
  }
  get f() {
    return this.form.controls;
  }
  onHandleOperations(type) {
    switch (type) {
      case 'air_filter': 
        this.techcheckCooling.airFilter = this.form.value.airFilter;this.checkAllFieldsValid();
        break;
      case 'battery': 
        this.techcheckCooling.battery = this.form.value.battery;this.checkAllFieldsValid();
        break;
      case 'oil_leaks': 
        this.techcheckCooling.oilLeaks = this.form.value.oilLeaks;this.checkAllFieldsValid();
        break;
      case 'fuel_leaks': 
        this.techcheckCooling.fuelLeaks = this.form.value.fuelLeaks;this.checkAllFieldsValid();
        break;
      case 'cleanliness': 
        this.techcheckCooling.engineClean = this.form.value.cleanliness;this.checkAllFieldsValid();
        break;
      case 'radiator_clean': 
        this.techcheckCooling.radiatorClean = this.form.value.radiatorClean;this.checkAllFieldsValid();
        break;
      case 'e_code':
        this.techcheckCooling.eCode = this.form.value.eCode;this.checkAllFieldsValid();
        break;
      case 'milage':
        this.techcheckCooling.mileage = this.form.value.mileage;this.checkAllFieldsValid();
        break;
      default:
        break;
    }
  }
  setData(fuelIol) {
    this.techcheckCooling = this.service.techCheckService.vehicleEngine;
    this.techcheckCooling.battery = fuelIol.battery;
    this.techcheckCooling.oilLeaks = fuelIol.oilLeaks;
    this.techcheckCooling.fuelLeaks = fuelIol.fuelLeaks;
    this.form.setValue({
      airFilter: !this.techcheckCooling.airFilter ? fuelIol.vehicleEngine.airFilter : this.techcheckCooling.airFilter,
      eCode: !this.techcheckCooling.eCode ? fuelIol.vehicleEngine.eCode : this.techcheckCooling.eCode,
      cleanliness: !this.techcheckCooling.engineClean ? fuelIol.vehicleEngine.engineClean : this.techcheckCooling.engineClean,
      mileage: !this.techcheckCooling.mileage ? fuelIol.vehicleEngine.mileage : this.techcheckCooling.mileage,
      radiatorClean: !this.techcheckCooling.radiatorClean ? fuelIol.vehicleEngine.radiatorClean : this.techcheckCooling.radiatorClean,
      battery: !this.techcheckCooling.battery ? fuelIol.battery??'' : this.techcheckCooling.battery,
      oilLeaks: !this.techcheckCooling.oilLeaks ? fuelIol.oilLeaks??'' : this.techcheckCooling.oilLeaks,
      fuelLeaks: !this.techcheckCooling.fuelLeaks ? fuelIol.fuelLeaks??'' : this.techcheckCooling.fuelLeaks,
   

    });
  }
  onSave() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return false;
    }
    const data = new TechCheckModel();
    data.vehicleEngine = new vehicleEngineModel();
    data.vehicleEngine.airFilter = this.form.value.airFilter;
    data.battery = this.form.value.battery;
    data.oilLeaks = this.form.value.oilLeaks;
    data.fuelLeaks = this.form.value.fuelLeaks;
    data.vehicleEngine.engineClean = this.form.value.cleanliness;
    data.vehicleEngine.radiatorClean = this.form.value.radiatorClean;
    data.vehicleEngine.mileage = this.form.value.mileage;
    this.service.techCheckService.vehicleEngine.fuelLeaks = this.form.value.fuelLeaks; 
    this.service.techCheckService.vehicleEngine.oilLeaks = this.form.value.oilLeaks; 
    this.service.techCheckService.vehicleEngine.battery = this.form.value.battery; 
    this.techCheckSave.emit(data);
  }
  checkAllFieldsValid(){
    if (this.form.valid) {
      this.checkAllFields.emit(true);
    }else{this.checkAllFields.emit(false);}
  }

  changeMarkAll(event) {
    this.techcheckCooling = this.service.techCheckService.vehicleEngine;
    if (event == true) {
      this.form.controls['airFilter'].setValue('N/A');
      this.form.controls['battery'].setValue('N/A');
      this.form.controls['oilLeaks'].setValue('N/A');
      this.form.controls['fuelLeaks'].setValue('N/A');
      this.form.controls['cleanliness'].setValue('N/A');
      this.form.controls['radiatorClean'].setValue('N/A');
       
      this.techcheckCooling.airFilter = 'N/A';
      this.techcheckCooling.battery = 'N/A';
      this.techcheckCooling.oilLeaks = 'N/A';
      this.techcheckCooling.fuelLeaks = 'N/A';
      this.techcheckCooling.cleanliness = 'N/A';
      this.techcheckCooling.radiatorClean = 'N/A';
       
    } else {
      this.form.controls['airFilter'].setValue('');
      this.form.controls['battery'].setValue('');
      this.form.controls['oilLeaks'].setValue('');
      this.form.controls['fuelLeaks'].setValue('');
      this.form.controls['cleanliness'].setValue('');
      this.form.controls['radiatorClean'].setValue('');
      
      this.techcheckCooling.airFilter = '';
      this.techcheckCooling.battery = '';
      this.techcheckCooling.oilLeaks = '';
      this.techcheckCooling.fuelLeaks = '';
      this.techcheckCooling.cleanliness = '';
      this.techcheckCooling.radiatorClean = '';
     
    }
    this.checkAllFields.emit(event);
  }
}
