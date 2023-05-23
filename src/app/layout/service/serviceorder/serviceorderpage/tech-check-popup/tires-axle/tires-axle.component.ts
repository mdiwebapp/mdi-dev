import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ErrorHandlerService } from 'src/app/core/services';
import { UtilityService } from 'src/app/core/services/utility.service';
import {
  AXLE_LIST,
  BEARINGS_LIST,
  FENDER_LIST,
  HUBS_SEAL_LIST,
  LEAF_SPRINGS_LIST,
  LUG_NUTS_LIST,
  RIMS_LIST,
  SHACKLES_LIST,
  TIRES_LIST,
  U_BOLTS_LIST,
} from 'src/data/serviceorderpage-data';
import { ServiceOrderService } from '../../../service-order/service-order.service';
import { TechCheckModel, trailerTiresModel } from '../techCheck.model';

@Component({
  selector: 'app-tires-axle',
  templateUrl: './tires-axle.component.html',
  styleUrls: ['./tires-axle.component.scss'],
})
export class TiresAxleComponent implements OnInit {
  @Output() techCheckSave: EventEmitter<any> = new EventEmitter<any>();
  @Output() checkAllFields: EventEmitter<any> = new EventEmitter<any>();

  form: FormGroup;
  displayRims: boolean = false;
  displayTires: boolean =false;
  displayLugNuts: boolean = false;
  displayBearings: boolean = false;
  displayLeafSprings: boolean = false;
  displayUBolts: boolean = false;
  displayShackles: boolean = false;
  displayHubsSeal: boolean = false;
  displayAxle: boolean = false;
  displayFender: boolean = false;
  markAll: boolean = false;
  rimsList: any = RIMS_LIST;
  tiresList: any = TIRES_LIST;
  lugNutsList: any = LUG_NUTS_LIST;
  bearingsList: any = BEARINGS_LIST;
  leafSpringsList: any = LEAF_SPRINGS_LIST;
  uBoltsList: any = U_BOLTS_LIST;
  shacklesList: any = SHACKLES_LIST;
  hubsSealList: any = HUBS_SEAL_LIST;
  axleList: any = AXLE_LIST;
  fenderList: any = FENDER_LIST;
  techcheckCooling: any;

  constructor(private formBuilder: FormBuilder, public service: ServiceOrderService,
    private utils: UtilityService, public errorHandler: ErrorHandlerService) {}

  ngOnInit(): void {
    this.onInitForm();
    this.techcheckCooling = this.service.techCheckService.trailerTires;
  }

  onInitForm() {
    this.form = this.formBuilder.group({
      rims: ['', Validators.required],
      tires: ['', Validators.required],
      lugNuts: ['', Validators.required],
      bearings: ['', Validators.required],
      leafSprings: ['', Validators.required],
      uBolts:['', Validators.required],
      shackles: ['', Validators.required],
      hubsSeal: ['', Validators.required],
      axle:['', Validators.required],
      fender: ['', Validators.required],
    });
  }

  onHandleOperations(type) {
    switch (type) {
      case 'rims': 
        this.techcheckCooling.rims = this.form.value.rims;this.checkAllFieldsValid();
        break;
      case 'tires': 
        this.techcheckCooling.tires = this.form.value.tires;this.checkAllFieldsValid();
        break;
      case 'log_nuts': 
        this.techcheckCooling.lugs = this.form.value.lugNuts;    this.checkAllFieldsValid();    
        break;
      case 'bearings': 
        this.techcheckCooling.bearings = this.form.value.bearings;this.checkAllFieldsValid();
        break;
      case 'leaf_springs': 
        this.techcheckCooling.leafSprings = this.form.value.leafSprings;this.checkAllFieldsValid();
        break;
      case 'u_bolts': 
        this.techcheckCooling.uBolts = this.form.value.uBolts;this.checkAllFieldsValid();
        break;
      case 'shackles': 
        this.techcheckCooling.shackles = this.form.value.shackles;this.checkAllFieldsValid();
        break;
      case 'hub_seal': 
        this.techcheckCooling.seal = this.form.value.hubsSeal;this.checkAllFieldsValid();
        break;
      case 'axle': 
        this.techcheckCooling.axle = this.form.value.axle;this.checkAllFieldsValid();
        break;
      case 'fender': 
        this.techcheckCooling.fender = this.form.value.fender;this.checkAllFieldsValid();
        break;

      default:
        break;
    }
  }
  get f() {
    return this.form.controls;
  }
  setData(fuelIol) { 
    this.techcheckCooling = this.service.techCheckService.trailerTires;
    this.techcheckCooling.bearings = fuelIol.bearings;
    this.techcheckCooling.seal = fuelIol.hubs;
    this.techcheckCooling.tires = fuelIol.tires;

    this.form.setValue({
      rims: !this.techcheckCooling.rims ? fuelIol.trailerTires.rims : this.techcheckCooling.rims,
      lugNuts: !this.techcheckCooling.lugs ? fuelIol.trailerTires.lugs : this.techcheckCooling.lugs,
      bearings:!this.techcheckCooling.bearings ? fuelIol.bearings : this.techcheckCooling.bearings,
      leafSprings: !this.techcheckCooling.leafSprings ? fuelIol.trailerTires.leafSprings : this.techcheckCooling.leafSprings,     
      uBolts: !this.techcheckCooling.uBolts ? fuelIol.trailerTires.uBolts : this.techcheckCooling.uBolts,     
      shackles: !this.techcheckCooling.shackles ? fuelIol.trailerTires.shackles : this.techcheckCooling.shackles,     
      hubsSeal: !this.techcheckCooling.seal ? fuelIol.hubs : this.techcheckCooling.seal,     
      axle: !this.techcheckCooling.axle ? fuelIol.trailerTires.axle : this.techcheckCooling.axle,     
      fender: !this.techcheckCooling.fender ? fuelIol.trailerTires.fender : this.techcheckCooling.fender,
      tires:!this.techcheckCooling.tires ? fuelIol.tires : this.techcheckCooling.tires,
    });    
  }
  onSave() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return false;
    }
    const data = new TechCheckModel();
    data.trailerTires = new trailerTiresModel();
    data.trailerTires.rims = this.form.value.rims;
    data.trailerTires.lugs = this.form.value.lugNuts;
    data.trailerTires.bearings = this.form.value.bearings;
    this.service.techCheckService.trailerTires.bearings = this.form.value.bearings;
    data.trailerTires.leafSprings = this.form.value.leafSprings;
    data.trailerTires.uBolts = this.form.value.uBolts;
    data.trailerTires.shackles = this.form.value.shackles;
    data.trailerTires.seal = this.form.value.hubsSeal;
    this.service.techCheckService.trailerTires.seal = this.form.value.hubsSeal;
    data.trailerTires.axle = this.form.value.axle;
    data.trailerTires.fender = this.form.value.fender;
    data.trailerTires.tires = this.form.value.tires;
    this.service.techCheckService.trailerTires.tires = this.form.value.tires;
    this.techCheckSave.emit(data);
  }
  checkAllFieldsValid(){
    if (this.form.valid) {
      this.checkAllFields.emit(true);
    }else{this.checkAllFields.emit(false);}
  }
  changeMarkAll(event) {
    this.techcheckCooling = this.service.techCheckService.trailerTires;
    if (event == true) {
      this.form.controls['rims'].setValue('N/A');
      this.form.controls['tires'].setValue('N/A');
      this.form.controls['lugNuts'].setValue('N/A');
      this.form.controls['bearings'].setValue('N/A');
      this.form.controls['leafSprings'].setValue('N/A');
      this.form.controls['uBolts'].setValue('N/A');
      this.form.controls['shackles'].setValue('N/A');
      this.form.controls['hubsSeal'].setValue('N/A');
      this.form.controls['axle'].setValue('N/A');
      this.form.controls['fender'].setValue('N/A');
      this.techcheckCooling.rims = 'N/A';
      this.techcheckCooling.tires = 'N/A';
      this.techcheckCooling.lugs = 'N/A';
      this.techcheckCooling.bearings = 'N/A';
      this.techcheckCooling.leafSprings = 'N/A';
      this.techcheckCooling.uBolts = 'N/A';
      this.techcheckCooling.shackles = 'N/A';
      this.techcheckCooling.seal = 'N/A';
      this.techcheckCooling.axle = 'N/A';
      this.techcheckCooling.fender = 'N/A';
    } else {
      this.form.controls['rims'].setValue('');
      this.form.controls['tires'].setValue('');
      this.form.controls['lugNuts'].setValue('');
      this.form.controls['bearings'].setValue('');
      this.form.controls['leafSprings'].setValue('');
      this.form.controls['uBolts'].setValue('');
      this.form.controls['shackles'].setValue('');
      this.form.controls['hubsSeal'].setValue('');
      this.form.controls['axle'].setValue('');
      this.form.controls['fender'].setValue('');
      this.techcheckCooling.rims = '';
      this.techcheckCooling.tires = '';
      this.techcheckCooling.lugs = '';
      this.techcheckCooling.bearings = '';
      this.techcheckCooling.leafSprings = '';
      this.techcheckCooling.uBolts = '';
      this.techcheckCooling.shackles = '';
      this.techcheckCooling.seal = '';
      this.techcheckCooling.axle = '';
      this.techcheckCooling.fender = '';
    }
    this.checkAllFields.emit(event);
  }
}
