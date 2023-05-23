import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ErrorHandlerService } from 'src/app/core/services';
import { UtilityService } from 'src/app/core/services/utility.service';
import {
  ACTUATOR_LIST,
  BRAKE_FLUID_LEAKS_LIST,
  BRAKE_FLUID_LEVEL_LIST,
  BREAK_AWAY_LIST,
  JACK_LIST,
  LATCH_LIST,
  PINTLE_HOOK_BOLTS_LIST,
  PINTLE_HOOK_LIST,
  SAFETY_CHAIN_LIST,
  SHOES_LIST,
} from 'src/data/serviceorderpage-data';
import { ServiceOrderService } from '../../../service-order/service-order.service';
import { TechCheckModel, trailerBrakesModel } from '../techCheck.model';

@Component({
  selector: 'app-breaks-hitch-latch',
  templateUrl: './breaks-hitch-latch.component.html',
  styleUrls: ['./breaks-hitch-latch.component.scss'],
})
export class BreaksHitchLatchComponent implements OnInit {
  @Output() techCheckSave: EventEmitter<any> = new EventEmitter<any>();
  @Output() checkAllFields: EventEmitter<any> = new EventEmitter<any>();

  form: FormGroup;
  displayBrakeFluidLevel: boolean = false;
  displayBrakeFluidLeaks: boolean = false;
  displayActuator: boolean = false;
  displayShoes: boolean = false;
  displayBreakAway: boolean = false;
  displayPintleHook: boolean = false;
  displayPintleHookBolts: boolean = false;
  displaySafetyChain: boolean = false;
  displayJack: boolean = false;
  displayLatch: boolean = false;
  markAll: boolean = false;
  brakeFluidLevelList: any = BRAKE_FLUID_LEVEL_LIST;
  brakeFluidLeaksList: any = BRAKE_FLUID_LEAKS_LIST;
  actuatorList: any = ACTUATOR_LIST;
  shoesList: any = SHOES_LIST;
  breakAwayList: any = BREAK_AWAY_LIST;
  pintleHookList: any = PINTLE_HOOK_LIST;
  pintleHookBoltsList: any = PINTLE_HOOK_BOLTS_LIST;
  safetyChainList: any = SAFETY_CHAIN_LIST;
  jackList: any = JACK_LIST;
  latchList: any = LATCH_LIST;

  techcheckCooling: any;

  constructor(private formBuilder: FormBuilder, public service: ServiceOrderService,
    private utils: UtilityService, public errorHandler: ErrorHandlerService) { }

  ngOnInit(): void {
    this.onInitForm();
    this.techcheckCooling = this.service.techCheckService.trailerBrakes;
  }

  onInitForm() {
    this.form = this.formBuilder.group({
      brakeFluidLevel: ['', Validators.required],
      brakeFluidLeaks: ['', Validators.required],
      actuator: ['', Validators.required],
      shoes: ['', Validators.required],
      breakAway: ['', Validators.required],
      pintleHook: ['', Validators.required],
      pintleHookBolts: ['', Validators.required],
      safetyChain: ['', Validators.required],
      jack: ['', Validators.required],
      litch: ['', Validators.required],
    });
  }

  onHandleOperations(type) {
    switch (type) {
      case 'brake_fluid_level':
        this.techcheckCooling.brakeFluidLevel = this.form.value.brakeFluidLevel; this.checkAllFieldsValid();
        break;
      case 'brake_fluid_leaks':
        this.techcheckCooling.brakeFluidLeaks = this.form.value.brakeFluidLeaks; this.checkAllFieldsValid();
        break;
      case 'actuator':
        this.techcheckCooling.actuator = this.form.value.actuator; this.checkAllFieldsValid();
        break;
      case 'shoes':
        this.techcheckCooling.shoes = this.form.value.shoes; this.checkAllFieldsValid();
        break;
      case 'break_away':
        this.techcheckCooling.breakAway = this.form.value.breakAway; this.checkAllFieldsValid();
        break;
      case 'pintle_hook':
        this.techcheckCooling.pintleHook = this.form.value.pintleHook; this.checkAllFieldsValid();
        break;
      case 'pintle_hook_bolts':
        this.techcheckCooling.pintleHitchbolts = this.form.value.pintleHookBolts; this.checkAllFieldsValid();
        break;
      case 'safety_chain':
        this.techcheckCooling.safetyChain = this.form.value.safetyChain; this.checkAllFieldsValid();
        break;
      case 'jack':
        this.techcheckCooling.jack = this.form.value.jack; this.checkAllFieldsValid();
        break;
      case 'litch':
        this.techcheckCooling.litch = this.form.value.litch; this.checkAllFieldsValid();
        break;
      default:
        break;
    }
  }
  get f() {
    return this.form.controls;
  }
  setData(fuelIol) {
    this.techcheckCooling = this.service.techCheckService.trailerBrakes;
    this.techcheckCooling.brakeActuator = fuelIol.brakeActuator;
    this.techcheckCooling.pintleHitch = fuelIol.pintleHitch;
    this.form.setValue({
      brakeFluidLevel: !this.techcheckCooling.brakeFluidLevel ? fuelIol.trailerBrakes.brakeFluidLevel : this.techcheckCooling.brakeFluidLevel,
      brakeFluidLeaks: !this.techcheckCooling.brakeFluidLeaks ? fuelIol.trailerBrakes.brakeFluidLeaks : this.techcheckCooling.brakeFluidLeaks,
      shoes: !this.techcheckCooling.shoes ? fuelIol.trailerBrakes.shoes : this.techcheckCooling.shoes,
      breakAway: !this.techcheckCooling.breakAway ? fuelIol.trailerBrakes.breakAway : this.techcheckCooling.breakAway,
      pintleHookBolts: !this.techcheckCooling.pintleHitchbolts ? fuelIol.trailerBrakes.pintleHitchbolts : this.techcheckCooling.pintleHitchbolts,
      safetyChain: !this.techcheckCooling.safetyChain ? fuelIol.trailerBrakes.safetyChain : this.techcheckCooling.safetyChain,
      jack: !this.techcheckCooling.jack ? fuelIol.trailerBrakes.jack : this.techcheckCooling.jack,
      actuator: !this.techcheckCooling.brakeActuator ? fuelIol.brakeActuator : this.techcheckCooling.brakeActuator,
      pintleHook: !this.techcheckCooling.pintleHitch ? fuelIol.pintleHitch : this.techcheckCooling.pintleHitch,
      litch: 'N/A',
    });
  }
  onSave() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return false;
    }
    const data = new TechCheckModel();
    data.trailerBrakes = new trailerBrakesModel();
    data.trailerBrakes.brakeFluidLevel = this.form.value.brakeFluidLevel;
    data.trailerBrakes.brakeFluidLeaks = this.form.value.brakeFluidLeaks;
    this.service.techCheckService.trailer.brakeActuator = this.form.value.actuator;
    data.trailerBrakes.shoes = this.form.value.shoes;
    data.trailerBrakes.breakAway = this.form.value.breakAway;
    this.service.techCheckService.trailer.pintleHitch = this.form.value.pintleHook;
    data.trailerBrakes.pintleHitchbolts = this.form.value.pintleHookBolts;
    data.trailerBrakes.safetyChain = this.form.value.safetyChain;
    data.trailerBrakes.jack = this.form.value.jack; 
    data.brakeActuator = this.form.value.actuator;
    data.pintleHitch = this.form.value.pintleHook;
    this.techCheckSave.emit(data);
  }
  checkAllFieldsValid() {
    if (this.form.valid) {
      this.checkAllFields.emit(true);
    } else { this.checkAllFields.emit(false); }
  }
  changeMarkAll(event) {
    this.techcheckCooling = this.service.techCheckService.trailerBrakes;
    if (event == true) {
      this.form.controls['brakeFluidLevel'].setValue('N/A');
      this.form.controls['brakeFluidLeaks'].setValue('N/A');
      this.form.controls['shoes'].setValue('N/A');
      this.form.controls['breakAway'].setValue('N/A');
      this.form.controls['pintleHookBolts'].setValue('N/A');
      this.form.controls['safetyChain'].setValue('N/A');
      this.form.controls['jack'].setValue('N/A');
      this.form.controls['actuator'].setValue('N/A');
      this.form.controls['pintleHook'].setValue('N/A');
      this.form.controls['litch'].setValue('N/A');
      this.techcheckCooling.brakeFluidLevel = 'N/A';
      this.techcheckCooling.brakeFluidLeaks = 'N/A';
      this.techcheckCooling.brakeActuator = 'N/A';
      this.techcheckCooling.shoes = 'N/A';
      this.techcheckCooling.breakAway = 'N/A';
      this.techcheckCooling.pintleHitch = 'N/A';
      this.techcheckCooling.pintleHitchbolts = 'N/A';
      this.techcheckCooling.safetyChain = 'N/A';
      this.techcheckCooling.jack = 'N/A';

    } else {
      this.form.controls['brakeFluidLevel'].setValue('');
      this.form.controls['brakeFluidLeaks'].setValue('');
      this.form.controls['shoes'].setValue('');
      this.form.controls['breakAway'].setValue('');
      this.form.controls['pintleHookBolts'].setValue('');
      this.form.controls['safetyChain'].setValue('');
      this.form.controls['jack'].setValue('');
      this.form.controls['actuator'].setValue('');
      this.form.controls['pintleHook'].setValue('');
      this.form.controls['litch'].setValue('');
      this.techcheckCooling.brakeFluidLevel = '';
      this.techcheckCooling.brakeFluidLeaks = '';
      this.techcheckCooling.brakeActuator = '';
      this.techcheckCooling.shoes = '';
      this.techcheckCooling.breakAway = '';
      this.techcheckCooling.pintleHitch = '';
      this.techcheckCooling.pintleHitchbolts = '';
      this.techcheckCooling.safetyChain = '';
      this.techcheckCooling.jack = '';
    }
    this.checkAllFields.emit(event);
  }
}
