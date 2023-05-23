import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VEHICLE_OPTION_LIST } from 'src/data/serviceorderpage-data';
import { ServiceOrderService } from '../../../service-order/service-order.service';
import { TechCheckModel, vehicleRearDiffrentialModel } from '../techCheck.model';

@Component({
  selector: 'app-rear-differential',
  templateUrl: './rear-differential.component.html',
  styleUrls: ['./rear-differential.component.scss'],
})
export class RearDifferentialComponent implements OnInit {
  @Output() techCheckSave: EventEmitter<any> = new EventEmitter<any>();
  @Output() checkAllFields: EventEmitter<any> = new EventEmitter<any>();
  form: FormGroup;
  displayNoLeaks: boolean = false;
  displayUJoints: boolean = false;
  displayFluidCleans: boolean = false;
  displayAxleBearingsSeals: boolean = false;
  displayRearBrakes: boolean = false;
  displayRearShocks: boolean = false;
  displayUboltsSeals: boolean = false;
  techcheckCooling: any;
  vehicleOptions: any = VEHICLE_OPTION_LIST;
  markAll: boolean = false;
  
  constructor(private formBuilder: FormBuilder, public service: ServiceOrderService) { }

  ngOnInit(): void {
    this.onInitForm();
    this.techcheckCooling = this.service.techCheckService.vehicleRearDiffrential;
  }

  onInitForm() {
    this.form = this.formBuilder.group({
      noLeaks: ['', Validators.required],
      uJoints: ['', Validators.required],
      fluidCleans: ['', Validators.required],
      axleBearingSeals: ['', Validators.required],
      rearBrakes: ['', Validators.required],
      rearShocks: ['', Validators.required],
      uBoltsSeals: ['', Validators.required],
    });
  }
  get f() {
    return this.form.controls;
  }
  onHandleOperations(type) {
    switch (type) {
      case 'no_leaks':
        this.techcheckCooling.rearDiffNoLeaks = this.form.value.noLeaks;
        this.checkAllFieldsValid();
        break;
      case 'u_joints':
        this.techcheckCooling.rearDiffUJoints = this.form.value.uJoints; this.checkAllFieldsValid();
        break;
      case 'fluid_clean':
        this.techcheckCooling.rearFluidClean = this.form.value.fluidCleans; this.checkAllFieldsValid();
        break;
      case 'axle_bearings_seals':
        this.techcheckCooling.rearAxleBearings = this.form.value.axleBearingSeals; this.checkAllFieldsValid();
        break;
      case 'rear_breaks':
        this.techcheckCooling.rearBrakes = this.form.value.rearBrakes; this.checkAllFieldsValid();
        break;
      case 'rear_shocks':
        this.techcheckCooling.rearShocks = this.form.value.rearShocks; this.checkAllFieldsValid();
        break;
      case 'u_bolts_seals':
        this.techcheckCooling.rearUBolts = this.form.value.uBoltsSeals; this.checkAllFieldsValid();
        break;
      default:
        break;
    }
  }
  setData(fuelIol) {
    this.techcheckCooling = this.service.techCheckService.vehicleRearDiffrential;
    this.form.setValue({
      noLeaks: !this.techcheckCooling.rearDiffNoLeaks ? fuelIol.rearDiffNoLeaks : this.techcheckCooling.rearDiffNoLeaks,
      uJoints: !this.techcheckCooling.rearDiffUJoints ? fuelIol.rearDiffUJoints : this.techcheckCooling.rearDiffUJoints,
      fluidCleans: !this.techcheckCooling.rearFluidClean ? fuelIol.rearFluidClean : this.techcheckCooling.rearFluidClean,
      axleBearingSeals: !this.techcheckCooling.rearAxleBearings ? fuelIol.rearAxleBearings : this.techcheckCooling.rearAxleBearings,
      rearBrakes: !this.techcheckCooling.rearBrakes ? fuelIol.rearBrakes : this.techcheckCooling.rearBrakes,
      rearShocks: !this.techcheckCooling.rearShocks ? fuelIol.rearShocks : this.techcheckCooling.rearShocks,
      uBoltsSeals: !this.techcheckCooling.rearUBolts ? fuelIol.rearUBolts : this.techcheckCooling.rearUBolts,

    });
  }
  onSave() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return false;
    }
    const data = new TechCheckModel();
    data.vehicleRearDiffrential = new vehicleRearDiffrentialModel();
    data.vehicleRearDiffrential.rearDiffNoLeaks = this.form.value.noLeaks;
    data.vehicleRearDiffrential.rearDiffUJoints = this.form.value.uJoints;
    data.vehicleRearDiffrential.rearFluidClean = this.form.value.fluidCleans;
    data.vehicleRearDiffrential.rearAxleBearings = this.form.value.axleBearingSeals;
    data.vehicleRearDiffrential.rearBrakes = this.form.value.rearBrakes;
    data.vehicleRearDiffrential.rearShocks = this.form.value.rearShocks;
    data.vehicleRearDiffrential.rearUBolts = this.form.value.uBoltsSeals;

    this.techCheckSave.emit(data);
  }
  checkAllFieldsValid() {
    if (this.form.valid) {
      this.checkAllFields.emit(true);
    } else { this.checkAllFields.emit(false); }
  }
  changeMarkAll(event) {
    this.techcheckCooling = this.service.techCheckService.vehicleRearDiffrential;
    if (event == true) {
      this.form.controls['noLeaks'].setValue('N/A');
      this.form.controls['uJoints'].setValue('N/A');
      this.form.controls['fluidCleans'].setValue('N/A');
      this.form.controls['axleBearingSeals'].setValue('N/A');
      this.form.controls['rearBrakes'].setValue('N/A');
      this.form.controls['rearShocks'].setValue('N/A');
      this.form.controls['uBoltsSeals'].setValue('N/A'); 
      this.techcheckCooling.rearDiffNoLeaks = 'N/A';
      this.techcheckCooling.rearDiffUJoints = 'N/A';
      this.techcheckCooling.rearFluidClean = 'N/A';
      this.techcheckCooling.rearAxleBearings = 'N/A';
      this.techcheckCooling.rearBrakes = 'N/A';
      this.techcheckCooling.rearShocks = 'N/A';
      this.techcheckCooling.rearUBolts = 'N/A'; 
    } else {
      this.form.controls['noLeaks'].setValue('');
      this.form.controls['uJoints'].setValue('');
      this.form.controls['fluidCleans'].setValue('');
      this.form.controls['axleBearingSeals'].setValue('');
      this.form.controls['rearBrakes'].setValue('');
      this.form.controls['rearShocks'].setValue('');
      this.form.controls['uBoltsSeals'].setValue(''); 
      this.techcheckCooling.rearDiffNoLeaks = '';
      this.techcheckCooling.rearDiffUJoints = '';
      this.techcheckCooling.rearFluidClean = '';
      this.techcheckCooling.rearAxleBearings = '';
      this.techcheckCooling.rearBrakes = '';
      this.techcheckCooling.rearShocks = '';
      this.techcheckCooling.rearUBolts = ''; 
    }
    this.checkAllFields.emit(event);
  }
}
