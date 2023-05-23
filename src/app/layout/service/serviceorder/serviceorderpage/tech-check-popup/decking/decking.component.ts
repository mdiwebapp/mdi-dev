import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  BOARDS_LIST,
  REFLECTIVE_TAPE_LIST,
  SCREWS_LIST,
  STEEL_LIST,
} from 'src/data/serviceorderpage-data';
import { ServiceOrderService } from '../../../service-order/service-order.service';
import { TechCheckModel, trailerDeckingModel } from '../techCheck.model';

@Component({
  selector: 'app-decking',
  templateUrl: './decking.component.html',
  styleUrls: ['./decking.component.scss'],
})
export class DeckingComponent implements OnInit {
  @Output() techCheckSave: EventEmitter<any> = new EventEmitter<any>();
  @Output() checkAllFields: EventEmitter<any> = new EventEmitter<any>();

  form: FormGroup;
  displayBoards: boolean = false;
  displaySteel: boolean = false;
  displayScrews: boolean = false;
  displayReflectiveTape: boolean = false;

  boardsList: any = BOARDS_LIST;
  steelList: any = STEEL_LIST;
  screwsList: any = SCREWS_LIST;
  reflectiveTapeList: any = REFLECTIVE_TAPE_LIST;
  techcheckCooling: any;
  markAll: boolean = false;
  constructor(private formBuilder: FormBuilder,public service: ServiceOrderService) {}

  ngOnInit(): void {
    this.onInitForm();
    this.techcheckCooling = this.service.techCheckService.trailerDecking;
  }

  onInitForm() {
    this.form = this.formBuilder.group({
      boards: ['', Validators.required],
      steel: ['', Validators.required],
      screws: ['', Validators.required],
      reflectiveTape: ['', Validators.required],
    });
  }
  get f() {
    return this.form.controls;
  }
  onHandleOperations(type) {
    switch (type) {
      case 'boards': 
        this.techcheckCooling.boards = this.form.value.boards;this.checkAllFieldsValid();
        break;
      case 'steel': 
        this.techcheckCooling.steel = this.form.value.steel;this.checkAllFieldsValid();
        break;
      case 'screws': 
        this.techcheckCooling.screws = this.form.value.screws;this.checkAllFieldsValid();
        break;
      case 'reflective_tape': 
        this.techcheckCooling.reflectiveTape = this.form.value.reflectiveTape;this.checkAllFieldsValid();
        break;
      default:
        break;
    }
  }
  setData(fuelIol) {
    this.techcheckCooling = this.service.techCheckService.trailerDecking;
    this.form.setValue({
      boards: !this.techcheckCooling.boards ? fuelIol.boards : this.techcheckCooling.boards,
      steel: !this.techcheckCooling.steel ? fuelIol.steel : this.techcheckCooling.steel,
      screws: !this.techcheckCooling.screws ? fuelIol.screws : this.techcheckCooling.screws,
      reflectiveTape: !this.techcheckCooling.reflectiveTape ? fuelIol.reflectiveTape : this.techcheckCooling.reflectiveTape,
      
    });    
  }
  onSave() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return false;
    }
    const data = new TechCheckModel();
    data.trailerDecking = new trailerDeckingModel();
    data.trailerDecking.boards = this.form.value.boards;
    data.trailerDecking.steel = this.form.value.steel;
    data.trailerDecking.screws = this.form.value.screws;
    data.trailerDecking.reflectiveTape = this.form.value.reflectiveTape;
  
    this.techCheckSave.emit(data);
  }
  checkAllFieldsValid() {
    if (this.form.valid) {
      this.checkAllFields.emit(true);
    } else { this.checkAllFields.emit(false); }
  }
  changeMarkAll(event) {
    this.techcheckCooling = this.service.techCheckService.trailerDecking;
    if (event == true) {
      this.form.controls['boards'].setValue('N/A');
      this.form.controls['steel'].setValue('N/A');
      this.form.controls['screws'].setValue('N/A');
      this.form.controls['reflectiveTape'].setValue('N/A'); 
      this.techcheckCooling.boards = 'N/A';
      this.techcheckCooling.steel = 'N/A';
      this.techcheckCooling.screws = 'N/A';
      this.techcheckCooling.reflectiveTape = 'N/A'; 
    } else {
      this.form.controls['boards'].setValue('');
      this.form.controls['steel'].setValue('');
      this.form.controls['screws'].setValue('');
      this.form.controls['reflectiveTape'].setValue(''); 
      this.techcheckCooling.boards = '';
      this.techcheckCooling.steel = '';
      this.techcheckCooling.screws = '';
      this.techcheckCooling.reflectiveTape = ''; 
    }
    this.checkAllFields.emit(event);
  }
}
