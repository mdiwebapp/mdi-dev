import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VEHICLE_OPTION_LIST } from 'src/data/serviceorderpage-data';
import { ServiceOrderService } from '../../../service-order/service-order.service';
import { TechCheckModel, vehicleFrontDiffrentialModel } from '../techCheck.model';

@Component({
  selector: 'app-front-differential',
  templateUrl: './front-differential.component.html',
  styleUrls: ['./front-differential.component.scss'],
})
export class FrontDifferentialComponent implements OnInit {
  @Output() techCheckSave: EventEmitter<any> = new EventEmitter<any>();
  @Output() checkAllFields: EventEmitter<any> = new EventEmitter<any>();
  markAll: boolean = false;
  form: FormGroup;
  displayNoLeaks: boolean = false;
  displayUJoints: boolean = false;
  displayFluidCleans: boolean = false;
  displayAxleBearingsSeals: boolean = false;
  displayfrontBrakes: boolean = false;
  displayfrontShocks: boolean = false;
  displaySteeringDamper: boolean = false;
  displayBallJointsUpper: boolean = false;
  displayBallJointsLower: boolean = false;
  displaySteeringComponents: boolean = false;
  techcheckCooling: any;
  vehicleOptions: any = VEHICLE_OPTION_LIST;
  constructor(private formBuilder: FormBuilder, public service: ServiceOrderService) {}

  ngOnInit(): void {
    this.onInitForm();
    this.techcheckCooling = this.service.techCheckService.vehicleFrontDiffrential;
  }

  onInitForm() {
    this.form = this.formBuilder.group({
      noLeaks: ['', Validators.required],
      uJoints: ['', Validators.required],
      fluidCleans: ['', Validators.required],
      axleBearingSeals: ['', Validators.required],
      frontBrakes: ['', Validators.required],
      frontShocks: ['', Validators.required],
      steeringDamper: ['', Validators.required],
      ballJointsUpper: ['', Validators.required],
      ballJointsLower: ['', Validators.required],
      steeringComponents: ['', Validators.required],
    });
  }
  get f() {
    return this.form.controls;
  }
  onHandleOperations(type) {
    switch (type) {
      case 'no_leaks':
        this.techcheckCooling.frontDiffNoLeaks = this.form.value.noLeaks;this.checkAllFieldsValid();
        break;
      case 'u_joints':
        this.techcheckCooling.frontDiffUJoints = this.form.value.uJoints;this.checkAllFieldsValid();
        break;
      case 'fluid_clean': 
        this.techcheckCooling.frontFluidClean = this.form.value.fluidCleans;this.checkAllFieldsValid();
        break;
      case 'axle_bearings_seals': 
        this.techcheckCooling.frontAxleBearings = this.form.value.axleBearingSeals;this.checkAllFieldsValid();
        break;
      case 'front_breaks': 
        this.techcheckCooling.frontBrakes = this.form.value.frontBrakes;this.checkAllFieldsValid();
        break;
      case 'front_shocks': 
        this.techcheckCooling.frontShocks = this.form.value.frontShocks;this.checkAllFieldsValid();
        break;
      case 'steering_damper': 
        this.techcheckCooling.frontSteeringDamper = this.form.value.steeringDamper;this.checkAllFieldsValid();
        break;
      case 'ball_joints_upper': 
        this.techcheckCooling.frontBallJointsUpper = this.form.value.ballJointsUpper;this.checkAllFieldsValid();
        break;
      case 'ball_joints_lower': 
        this.techcheckCooling.frontBallJointsLower = this.form.value.ballJointsLower;this.checkAllFieldsValid();
        break;
      case 'steering_components': 
        this.techcheckCooling.steeringComponents = this.form.value.steeringComponents;this.checkAllFieldsValid();
        break;
      default:
        break;
    }
  }
  setData(fuelIol) {
    this.techcheckCooling = this.service.techCheckService.vehicleFrontDiffrential;
    this.form.setValue({
      noLeaks: !this.techcheckCooling.frontDiffNoLeaks ? fuelIol.frontDiffNoLeaks : this.techcheckCooling.frontDiffNoLeaks,
      uJoints: !this.techcheckCooling.frontDiffUJoints ? fuelIol.frontDiffUJoints : this.techcheckCooling.frontDiffUJoints,
      fluidCleans: !this.techcheckCooling.frontFluidClean ? fuelIol.frontFluidClean : this.techcheckCooling.frontFluidClean,
      axleBearingSeals: !this.techcheckCooling.frontAxleBearings ? fuelIol.frontAxleBearings : this.techcheckCooling.frontAxleBearings,
      frontBrakes: !this.techcheckCooling.frontBrakes ? fuelIol.frontBrakes : this.techcheckCooling.frontBrakes,
      frontShocks: !this.techcheckCooling.frontShocks ? fuelIol.frontShocks : this.techcheckCooling.frontShocks,
      steeringDamper: !this.techcheckCooling.frontSteeringDamper ? fuelIol.frontSteeringDamper : this.techcheckCooling.frontSteeringDamper,
      ballJointsUpper: !this.techcheckCooling.frontBallJointsUpper ? fuelIol.frontBallJointsUpper : this.techcheckCooling.frontBallJointsUpper,
      ballJointsLower: !this.techcheckCooling.frontBallJointsLower ? fuelIol.frontBallJointsLower : this.techcheckCooling.frontBallJointsLower,
      steeringComponents: !this.techcheckCooling.steeringComponents ? fuelIol.steeringComponents : this.techcheckCooling.steeringComponents,
      
    });    
  }
  onSave() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return false;
    }
    const data = new TechCheckModel();
    data.vehicleFrontDiffrential = new vehicleFrontDiffrentialModel();
    data.vehicleFrontDiffrential.frontDiffNoLeaks = this.form.value.noLeaks;
    data.vehicleFrontDiffrential.frontDiffUJoints = this.form.value.uJoints;
    data.vehicleFrontDiffrential.frontFluidClean = this.form.value.fluidCleans;
    data.vehicleFrontDiffrential.frontAxleBearings = this.form.value.axleBearingSeals;
    data.vehicleFrontDiffrential.frontBrakes = this.form.value.frontBrakes;
    data.vehicleFrontDiffrential.frontShocks = this.form.value.frontShocks;
    data.vehicleFrontDiffrential.frontSteeringDamper = this.form.value.steeringDamper;
    data.vehicleFrontDiffrential.frontBallJointsUpper = this.form.value.ballJointsUpper;
    data.vehicleFrontDiffrential.frontBallJointsLower = this.form.value.ballJointsLower;
    data.vehicleFrontDiffrential.steeringComponents = this.form.value.steeringComponents; 
    this.techCheckSave.emit(data);
  }
  checkAllFieldsValid(){
    if (this.form.valid) {
      this.checkAllFields.emit(true);
    }else{this.checkAllFields.emit(false);}
  }

  changeMarkAll(event) {
    this.techcheckCooling = this.service.techCheckService.vehicleFrontDiffrential;
    if (event == true) {
      this.form.controls['noLeaks'].setValue('N/A');
      this.form.controls['uJoints'].setValue('N/A');
      this.form.controls['fluidCleans'].setValue('N/A');
      this.form.controls['axleBearingSeals'].setValue('N/A');
      this.form.controls['frontBrakes'].setValue('N/A');
      this.form.controls['frontShocks'].setValue('N/A');
      this.form.controls['steeringDamper'].setValue('N/A');
      this.form.controls['ballJointsUpper'].setValue('N/A');
      this.form.controls['ballJointsLower'].setValue('N/A');
      this.form.controls['steeringComponents'].setValue('N/A');
      this.techcheckCooling.frontDiffNoLeaks = 'N/A';
      this.techcheckCooling.frontDiffUJoints = 'N/A';
      this.techcheckCooling.frontFluidClean = 'N/A';
      this.techcheckCooling.frontAxleBearings = 'N/A';
      this.techcheckCooling.frontBrakes = 'N/A';
      this.techcheckCooling.frontShocks = 'N/A';
      this.techcheckCooling.frontSteeringDamper = 'N/A';
      this.techcheckCooling.frontBallJointsUpper = 'N/A';
      this.techcheckCooling.frontBallJointsLower = 'N/A';
      this.techcheckCooling.steeringComponents = 'N/A';
    } else {
      this.form.controls['noLeaks'].setValue('');
      this.form.controls['uJoints'].setValue('');
      this.form.controls['fluidCleans'].setValue('');
      this.form.controls['axleBearingSeals'].setValue('');
      this.form.controls['frontBrakes'].setValue('');
      this.form.controls['frontShocks'].setValue('');
      this.form.controls['steeringDamper'].setValue('');
      this.form.controls['ballJointsUpper'].setValue('');
      this.form.controls['ballJointsLower'].setValue('');
      this.form.controls['steeringComponents'].setValue('');
      this.techcheckCooling.frontDiffNoLeaks = '';
      this.techcheckCooling.frontDiffUJoints = '';
      this.techcheckCooling.frontFluidClean = '';
      this.techcheckCooling.frontAxleBearings = '';
      this.techcheckCooling.frontBrakes = '';
      this.techcheckCooling.frontShocks = '';
      this.techcheckCooling.frontSteeringDamper = '';
      this.techcheckCooling.frontBallJointsUpper = '';
      this.techcheckCooling.frontBallJointsLower = '';
      this.techcheckCooling.steeringComponents = '';
    }
    this.checkAllFields.emit(event);
  }
}
