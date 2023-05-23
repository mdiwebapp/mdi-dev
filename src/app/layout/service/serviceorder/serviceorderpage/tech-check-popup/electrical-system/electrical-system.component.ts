import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  BACK_MARKERS_LIGHTS_LIST,
  BRAKE_LIGHTS_LIST,
  CONDITION_OF_WRITING_LIST,
  FRONT_MARKERS_LIGHTS_LIST,
  LF_TURN_SIGNALS_LIST,
  LR_TURN_SIGNALS_LIST,
  PIG_TAIL_CORD_LIST,
  RF_TURN_SIGNALS_LIST,
  RR_TURN_SIGNALS_LIST,
} from 'src/data/serviceorderpage-data';
import { ServiceOrderService } from '../../../service-order/service-order.service';
import { TechCheckModel, trailerElectricalSystemModel } from '../techCheck.model';

@Component({
  selector: 'app-electrical-system',
  templateUrl: './electrical-system.component.html',
  styleUrls: ['./electrical-system.component.scss'],
})
export class ElectricalSystemComponent implements OnInit {
  @Output() techCheckSave: EventEmitter<any> = new EventEmitter<any>();
  @Output() checkAllFields: EventEmitter<any> = new EventEmitter<any>();
  form: FormGroup;
  displayLfTurnSignals: boolean = false;
  displayRfTurnSignals: boolean = false;
  displayLrTurnSignals: boolean = false;
  displayRrTurnSignals: boolean = false;
  displayBrakeLights: boolean = false;
  displayPigTailCord: boolean = false;
  displayFrontMarkerLights: boolean = false;
  displayBackMarkerLights: boolean = false;
  displayConditionOfWriting: boolean = false;

  lfTurnSignalsList: any = LF_TURN_SIGNALS_LIST;
  rfTurnSignalsList: any = RF_TURN_SIGNALS_LIST;
  lrTurnSignalsList: any = LR_TURN_SIGNALS_LIST;
  rrTurnSignalsList: any = RR_TURN_SIGNALS_LIST;
  brakeLightsList: any = BRAKE_LIGHTS_LIST;
  pigTailCordList: any = PIG_TAIL_CORD_LIST;
  frontMarkerLightsList: any = FRONT_MARKERS_LIGHTS_LIST;
  backMarkerLightsList: any = BACK_MARKERS_LIGHTS_LIST;
  conditionOfWritingList: any = CONDITION_OF_WRITING_LIST;
  markAll: boolean = false;
  techcheckCooling: any;
  constructor(private formBuilder: FormBuilder, public service: ServiceOrderService) { }

  ngOnInit(): void {
    this.onInitForm();
    this.techcheckCooling = this.service.techCheckService.trailerElectricalSystem;
  }

  onInitForm() {
    this.form = this.formBuilder.group({
      lfTurnSignals: ['', Validators.required],
      rfTurnSignals: ['', Validators.required],
      lrTurnSignals: ['', Validators.required],
      rrTurnSignals:['', Validators.required],
      brakeLights: ['', Validators.required],
      pigTailCord: ['', Validators.required],
      frontMarkerLights:['', Validators.required],
      backMarkerLights:['', Validators.required],
      conditionOfWriting: ['', Validators.required],
    });
  }
  get f() {
    return this.form.controls;
  }
  onHandleOperations(type) {
    switch (type) {
      case 'lf_turn_signals': 
        this.techcheckCooling.lfSignal = this.form.value.lfTurnSignals;this.checkAllFieldsValid();
        break;
      case 'rf_turn_signals': 
        this.techcheckCooling.rfSignal = this.form.value.rfTurnSignals;this.checkAllFieldsValid();
        break;
      case 'lr_turn_signals': 
        this.techcheckCooling.lrSignal = this.form.value.lrTurnSignals;this.checkAllFieldsValid();
        break;
      case 'rr_turn_signals': 
        this.techcheckCooling.rrSignal = this.form.value.rrTurnSignals;this.checkAllFieldsValid();
        break;
      case 'brake_lights': 
        this.techcheckCooling.brakeLights = this.form.value.brakeLights;this.checkAllFieldsValid();
        break;
      case 'pig_tail_cord': 
        this.techcheckCooling.pigTail = this.form.value.pigTailCord;this.checkAllFieldsValid();
        break;
      case 'front_marker_lights': 
        this.techcheckCooling.frontMarkerLights = this.form.value.frontMarkerLights;this.checkAllFieldsValid();
        break;
      case 'back_marker_lights': 
        this.techcheckCooling.backMarkerLights = this.form.value.backMarkerLights;this.checkAllFieldsValid();
        break;
      case 'condition_of_writing': 
        this.techcheckCooling.wiring = this.form.value.conditionOfWriting;this.checkAllFieldsValid();
        break;
      case '':
        break; 
      default:
        break;
    }
  }
  setData(fuelIol) {
    this.techcheckCooling = this.service.techCheckService.trailerElectricalSystem;
    this.techcheckCooling.brakeLights = fuelIol.brakeLights;
    this.form.setValue({
      lfTurnSignals: !this.techcheckCooling.lfSignal ? fuelIol.trailerElectricalSystem.lfSignal : this.techcheckCooling.lfSignal,
      rfTurnSignals: !this.techcheckCooling.rfSignal ? fuelIol.trailerElectricalSystem.rfSignal : this.techcheckCooling.rfSignal,
      lrTurnSignals: !this.techcheckCooling.lrSignal ? fuelIol.trailerElectricalSystem.lrSignal : this.techcheckCooling.lrSignal,
      rrTurnSignals: !this.techcheckCooling.rrSignal ? fuelIol.trailerElectricalSystem.rrSignal : this.techcheckCooling.rrSignal,
      brakeLights: !this.techcheckCooling.brakeLights ? fuelIol.brakeLights??'' : this.techcheckCooling.brakeLights,
      pigTailCord: !this.techcheckCooling.pigTail ? fuelIol.trailerElectricalSystem.pigTail : this.techcheckCooling.pigTail,
      frontMarkerLights: !this.techcheckCooling.frontMarkerLights ? fuelIol.trailerElectricalSystem.frontMarkerLights : this.techcheckCooling.frontMarkerLights,
      backMarkerLights: !this.techcheckCooling.backMarkerLights ? fuelIol.trailerElectricalSystem.backMarkerLights : this.techcheckCooling.backMarkerLights,
      conditionOfWriting: !this.techcheckCooling.wiring ? fuelIol.trailerElectricalSystem.wiring : this.techcheckCooling.wiring
    });
  }
  onSave() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return false;
    }
    const data = new TechCheckModel();
    data.trailerElectricalSystem = new trailerElectricalSystemModel();
    data.trailerElectricalSystem.lfSignal = this.form.value.lfTurnSignals;
    data.trailerElectricalSystem.rfSignal = this.form.value.rfTurnSignals;
    data.trailerElectricalSystem.lrSignal = this.form.value.lrTurnSignals;
    data.trailerElectricalSystem.rrSignal = this.form.value.rrTurnSignals;
    data.trailerElectricalSystem.brakeLights = this.form.value.brakeLights;
    this.service.techCheckService.trailerElectricalSystem.brakeLights = this.form.value.brakeLights;
    data.trailerElectricalSystem.pigTail = this.form.value.pigTailCord;
    data.trailerElectricalSystem.frontMarkerLights = this.form.value.frontMarkerLights;
    data.trailerElectricalSystem.backMarkerLights = this.form.value.backMarkerLights;
    data.trailerElectricalSystem.wiring = this.form.value.conditionOfWriting;
    
    this.techCheckSave.emit(data);
  }
  checkAllFieldsValid() {
    if (this.form.valid) {
      this.checkAllFields.emit(true);
    } else { this.checkAllFields.emit(false); }
  }
  changeMarkAll(event) {
    this.techcheckCooling = this.service.techCheckService.trailerElectricalSystem;
    if (event == true) {
      this.form.controls['lfTurnSignals'].setValue('N/A');
      this.form.controls['rfTurnSignals'].setValue('N/A');
      this.form.controls['lrTurnSignals'].setValue('N/A');
      this.form.controls['rrTurnSignals'].setValue('N/A');
      this.form.controls['brakeLights'].setValue('N/A');
      this.form.controls['pigTailCord'].setValue('N/A');
      this.form.controls['frontMarkerLights'].setValue('N/A');
      this.form.controls['backMarkerLights'].setValue('N/A');
      this.form.controls['conditionOfWriting'].setValue('N/A'); 
      this.techcheckCooling.lfSignal = 'N/A';
      this.techcheckCooling.rfSignal = 'N/A';
      this.techcheckCooling.lrSignal = 'N/A';
      this.techcheckCooling.rrSignal = 'N/A';
      this.techcheckCooling.brakeLights = 'N/A';
      this.techcheckCooling.pigTail = 'N/A';
      this.techcheckCooling.frontMarkerLights = 'N/A';
      this.techcheckCooling.backMarkerLights = 'N/A';
      this.techcheckCooling.wiring = 'N/A';

    } else {
      this.form.controls['lfTurnSignals'].setValue('');
      this.form.controls['rfTurnSignals'].setValue('');
      this.form.controls['lrTurnSignals'].setValue('');
      this.form.controls['rrTurnSignals'].setValue('');
      this.form.controls['brakeLights'].setValue('');
      this.form.controls['pigTailCord'].setValue('');
      this.form.controls['frontMarkerLights'].setValue('');
      this.form.controls['backMarkerLights'].setValue('');
      this.form.controls['conditionOfWriting'].setValue(''); 
      this.techcheckCooling.lfSignal = '';
      this.techcheckCooling.rfSignal = '';
      this.techcheckCooling.lrSignal = '';
      this.techcheckCooling.rrSignal = '';
      this.techcheckCooling.brakeLights = '';
      this.techcheckCooling.pigTail = '';
      this.techcheckCooling.frontMarkerLights = '';
      this.techcheckCooling.backMarkerLights = '';
      this.techcheckCooling.wiring = '';
    }
    this.checkAllFields.emit(event);
  }
}
