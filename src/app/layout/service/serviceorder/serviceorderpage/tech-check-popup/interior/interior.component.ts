import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VEHICLE_OPTION_LIST } from 'src/data/serviceorderpage-data';
import { ServiceOrderService } from '../../../service-order/service-order.service';
import { TechCheckModel, vehicleInteriorModel } from '../techCheck.model';

@Component({
  selector: 'app-interior',
  templateUrl: './interior.component.html',
  styleUrls: ['./interior.component.scss'],
})
export class InteriorComponent implements OnInit {
  @Output() techCheckSave: EventEmitter<any> = new EventEmitter<any>();
  @Output() checkAllFields: EventEmitter<any> = new EventEmitter<any>();
  markAll: boolean = false;
  form: FormGroup;
  displayLights: boolean = false;
  displayElectricBrake: boolean = false;
  displayPowerPoint: boolean = false;
  displayIPass: boolean = false;
  displayFuelCard: boolean = false;
  displayFirstAidKit: boolean = false;
  displaySafetyTriangles: boolean = false;
  displayFireExtinguisher: boolean = false;
  displayCleanliness: boolean = false;
  techcheckCooling: any;

  vehicleOptions: any = VEHICLE_OPTION_LIST;
  constructor(private formBuilder: FormBuilder, public service: ServiceOrderService) {}

  ngOnInit(): void {
    this.onInitForm();
    this.techcheckCooling = this.service.techCheckService.vehicleInterior;
  }

  onInitForm() {
    this.form = this.formBuilder.group({
      lights:['', Validators.required],
      electricBrake: ['', Validators.required],
      powerPoint: ['', Validators.required],
      iPass: ['', Validators.required],
      fuelCard: ['', Validators.required],
      firstAidKit: ['', Validators.required],
      safetyTriangles: ['', Validators.required],
      fireExtinguisher: ['', Validators.required],
      cleanliness: ['', Validators.required],
    });
  }
  get f() {
    return this.form.controls;
  }
  onHandleOperations(type) {
    switch (type) {
      case 'lights': 
        this.techcheckCooling.intLights = this.form.value.lights;this.checkAllFieldsValid();
        break;
      case 'electric_brake': 
        this.techcheckCooling.electricBrake = this.form.value.electricBrake;this.checkAllFieldsValid();
        break;
      case 'power_point': 
        this.techcheckCooling.powerPoint = this.form.value.powerPoint;this.checkAllFieldsValid();
        break;
      case 'i_pass': 
        this.techcheckCooling.iPass = this.form.value.iPass;this.checkAllFieldsValid();
        break;
      case 'fuel_card': 
        this.techcheckCooling.fuelCard = this.form.value.fuelCard;this.checkAllFieldsValid();
        break;
      case 'first_aid_kit': 
        this.techcheckCooling.firstAid = this.form.value.firstAidKit;this.checkAllFieldsValid();
        break;
      case 'safety_triangles': 
        this.techcheckCooling.safetyTriangles = this.form.value.safetyTriangles;this.checkAllFieldsValid();
        break;
      case 'fire_extinguisher': 
        this.techcheckCooling.fireExtinguisher = this.form.value.fireExtinguisher;this.checkAllFieldsValid();
        break;
      case 'cleanliness': 
        this.techcheckCooling.intCleanliness = this.form.value.cleanliness;this.checkAllFieldsValid();
        break;
      default:
        break;
    }
  }
  setData(fuelIol) {
    this.techcheckCooling = this.service.techCheckService.vehicleInterior;
    this.form.setValue({
      lights: !this.techcheckCooling.intLights ? fuelIol.intLights : this.techcheckCooling.intLights,
      electricBrake: !this.techcheckCooling.electricBrake ? fuelIol.electricBrake : this.techcheckCooling.electricBrake,
      powerPoint: !this.techcheckCooling.powerPoint ? fuelIol.powerPoint : this.techcheckCooling.powerPoint,
      iPass: !this.techcheckCooling.iPass ? fuelIol.iPass : this.techcheckCooling.iPass,
      fuelCard: !this.techcheckCooling.fuelCard ? fuelIol.fuelCard : this.techcheckCooling.fuelCard,
      firstAidKit: !this.techcheckCooling.firstAid ? fuelIol.firstAid : this.techcheckCooling.firstAid,
      safetyTriangles: !this.techcheckCooling.safetyTriangles ? fuelIol.safetyTriangles : this.techcheckCooling.safetyTriangles,
      fireExtinguisher: !this.techcheckCooling.fireExtinguisher ? fuelIol.fireExtinguisher : this.techcheckCooling.fireExtinguisher,
      cleanliness: !this.techcheckCooling.intCleanliness ? fuelIol.intCleanliness : this.techcheckCooling.intCleanliness,
      
    });    
  }
  onSave() { 
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return false;
    }
    const data = new TechCheckModel();
    data.vehicleInterior = new vehicleInteriorModel();
    data.vehicleInterior.intLights = this.form.value.lights;
    data.vehicleInterior.electricBrake = this.form.value.electricBrake;
    data.vehicleInterior.powerPoint = this.form.value.powerPoint;
    data.vehicleInterior.iPass = this.form.value.iPass;
    data.vehicleInterior.fuelCard = this.form.value.fuelCard;
    data.vehicleInterior.firstAid = this.form.value.firstAidKit;
    data.vehicleInterior.safetyTriangles = this.form.value.safetyTriangles;
    data.vehicleInterior.fireExtinguisher = this.form.value.fireExtinguisher;
    data.vehicleInterior.intCleanliness = this.form.value.cleanliness;
 
    this.techCheckSave.emit(data);
  }
  checkAllFieldsValid(){
    if (this.form.valid) {
      this.checkAllFields.emit(true);
    }else{this.checkAllFields.emit(false);}
  }
  changeMarkAll(event) {
    this.techcheckCooling = this.service.techCheckService.vehicleInterior;
    if (event == true) {
      this.form.controls['lights'].setValue('N/A');
      this.form.controls['electricBrake'].setValue('N/A');
      this.form.controls['powerPoint'].setValue('N/A');
      this.form.controls['iPass'].setValue('N/A');
      this.form.controls['fuelCard'].setValue('N/A');
      this.form.controls['firstAidKit'].setValue('N/A');
      this.form.controls['safetyTriangles'].setValue('N/A');
      this.form.controls['fireExtinguisher'].setValue('N/A');
      this.form.controls['cleanliness'].setValue('N/A');
      this.techcheckCooling.intLights = 'N/A';
      this.techcheckCooling.electricBrake = 'N/A';
      this.techcheckCooling.powerPoint = 'N/A';
      this.techcheckCooling.iPass = 'N/A';
      this.techcheckCooling.fuelCard = 'N/A';
      this.techcheckCooling.firstAid = 'N/A';
      this.techcheckCooling.safetyTriangles = 'N/A';
      this.techcheckCooling.fireExtinguisher = 'N/A';
      this.techcheckCooling.intCleanliness = 'N/A';
    } else {
      this.form.controls['lights'].setValue('');
      this.form.controls['electricBrake'].setValue('');
      this.form.controls['powerPoint'].setValue('');
      this.form.controls['iPass'].setValue('');
      this.form.controls['fuelCard'].setValue('');
      this.form.controls['firstAidKit'].setValue('');
      this.form.controls['safetyTriangles'].setValue('');
      this.form.controls['fireExtinguisher'].setValue('');
      this.form.controls['cleanliness'].setValue('');
      this.techcheckCooling.intLights = '';
      this.techcheckCooling.electricBrake = '';
      this.techcheckCooling.powerPoint = '';
      this.techcheckCooling.iPass = '';
      this.techcheckCooling.fuelCard = '';
      this.techcheckCooling.firstAid = '';
      this.techcheckCooling.safetyTriangles = '';
      this.techcheckCooling.fireExtinguisher = '';
      this.techcheckCooling.intCleanliness = '';
    }
    this.checkAllFields.emit(event);
  }
}
