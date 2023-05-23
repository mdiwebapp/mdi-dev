import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VEHICLE_OPTION_LIST } from 'src/data/serviceorderpage-data';
import { ServiceOrderService } from '../../../service-order/service-order.service';
import { TechCheckModel, vehicleLightsModel } from '../techCheck.model';

@Component({
  selector: 'app-lights',
  templateUrl: './lights.component.html',
  styleUrls: ['./lights.component.scss'],
})
export class LightsComponent implements OnInit {
  @Output() techCheckSave: EventEmitter<any> = new EventEmitter<any>();
  @Output() checkAllFields: EventEmitter<any> = new EventEmitter<any>();
  markAll: boolean = false;
  form: FormGroup;
  displayHeadLights: boolean = false;
  displayBrakeLights: boolean = false;
  displayTurnSignals: boolean = false;
  displayTrailerPlug: boolean = false;
  displayCleanliness: boolean = false;

  vehicleOptions: any = VEHICLE_OPTION_LIST;
  techcheckCooling: any;
  constructor(private formBuilder: FormBuilder, public service: ServiceOrderService) {}

  ngOnInit(): void {
    this.onInitForm();
    this.techcheckCooling = this.service.techCheckService.vehicleLights;
  }

  onInitForm() {
    this.form = this.formBuilder.group({
      headLights:  ['', Validators.required],
      brakeLights:  ['', Validators.required],
      turnSignals:  ['', Validators.required],
      trailerPlug: ['', Validators.required],
      lightCleanliness:  ['', Validators.required],
    });
  }
  get f() {
    return this.form.controls;
  }
  onHandleOperations(type) {
    switch (type) {
      case 'head_lights': 
        this.techcheckCooling.headLights = this.form.value.headLights;this.checkAllFieldsValid();
        break;
      case 'brake_lights':
        this.techcheckCooling.brakeLights = this.form.value.brakeLights;this.checkAllFieldsValid();
        break;
      case 'turn_signals': 
        this.techcheckCooling.turnSignals = this.form.value.turnSignals;this.checkAllFieldsValid();
        break;
      case 'trailer_plug': 
        this.techcheckCooling.trailerPlug = this.form.value.trailerPlug;this.checkAllFieldsValid();
        break;
      case 'cleanliness': 
        this.techcheckCooling.lightCleanliness = this.form.value.lightCleanliness;this.checkAllFieldsValid();
        break;
      default:
        break;
    }
  }
  setData(fuelIol) {
    this.techcheckCooling = this.service.techCheckService.vehicleLights;
    this.techcheckCooling.brakeLights = fuelIol.brakeLights;
    this.form.setValue({
      headLights: !this.techcheckCooling.headLights ? fuelIol.vehicleLights.headLights : this.techcheckCooling.headLights,
      turnSignals: !this.techcheckCooling.turnSignals ? fuelIol.vehicleLights.turnSignals : this.techcheckCooling.turnSignals,
      trailerPlug: !this.techcheckCooling.trailerPlug ? fuelIol.vehicleLights.trailerPlug : this.techcheckCooling.trailerPlug,
      lightCleanliness: !this.techcheckCooling.lightCleanliness ? fuelIol.vehicleLights.lightCleanliness : this.techcheckCooling.lightCleanliness,
      brakeLights: !this.techcheckCooling.brakeLights ? fuelIol.brakeLights??'' : this.techcheckCooling.brakeLights,
      
    });    
  }
  onSave() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return false;
    }
    const data = new TechCheckModel();
    data.vehicleLights = new vehicleLightsModel();
    data.vehicleLights.headLights = this.form.value.headLights;
    data.brakeLights = this.form.value.brakeLights;    
    this.service.techCheckService.vehicleLights.brakeLights = this.form.value.brakeLights;
    data.vehicleLights.turnSignals = this.form.value.turnSignals;
    data.vehicleLights.trailerPlug = this.form.value.trailerPlug;
    data.vehicleLights.lightCleanliness = this.form.value.lightCleanliness; 

    this.techCheckSave.emit(data);
  }
  checkAllFieldsValid(){
    if (this.form.valid) {
      this.checkAllFields.emit(true);
    }else{this.checkAllFields.emit(false);}
  }
  changeMarkAll(event) {
    this.techcheckCooling = this.service.techCheckService.vehicleLights;
    if (event == true) {
      this.form.controls['headLights'].setValue('N/A');
      this.form.controls['brakeLights'].setValue('N/A');
      this.form.controls['turnSignals'].setValue('N/A');
      this.form.controls['trailerPlug'].setValue('N/A');
      this.form.controls['lightCleanliness'].setValue('N/A'); 
      this.techcheckCooling.headLights = 'N/A';
      this.techcheckCooling.turnSignals = 'N/A';
      this.techcheckCooling.trailerPlug = 'N/A';
      this.techcheckCooling.lightCleanliness = 'N/A';
      this.techcheckCooling.brakeLights = 'N/A'; 
    } else {
      this.form.controls['headLights'].setValue('');
      this.form.controls['brakeLights'].setValue('');
      this.form.controls['turnSignals'].setValue('');
      this.form.controls['trailerPlug'].setValue('');
      this.form.controls['lightCleanliness'].setValue(''); 
      this.techcheckCooling.headLights = '';
      this.techcheckCooling.turnSignals = '';
      this.techcheckCooling.trailerPlug = '';
      this.techcheckCooling.lightCleanliness = '';
      this.techcheckCooling.brakeLights = ''; 
    }
    this.checkAllFields.emit(event);
  }
}
