import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VEHICLE_OPTION_LIST } from 'src/data/serviceorderpage-data';
import { ServiceOrderService } from '../../../service-order/service-order.service';
import { TechCheckModel, vehicleAdditionalItemsModel } from '../techCheck.model';

@Component({
  selector: 'app-additional-items',
  templateUrl: './additional-items.component.html',
  styleUrls: ['./additional-items.component.scss'],
})
export class AdditionalItemsComponent implements OnInit {
  @Output() techCheckSave: EventEmitter<any> = new EventEmitter<any>(); 
   @Output() checkAllFields: EventEmitter<any> = new EventEmitter<any>();

  form: FormGroup;
  displayExaustNoLeaks: boolean = false;
  displayRotateTires: boolean = false;
  techcheckCooling: any;
  markAll: boolean = false;
  vehicleOptions: any = VEHICLE_OPTION_LIST;
  constructor(private formBuilder: FormBuilder, public service: ServiceOrderService) {}

  ngOnInit(): void {
    this.onInitForm();
    this.techcheckCooling = this.service.techCheckService.vehicleAdditionalItems;
  }

  onInitForm() {
    this.form = this.formBuilder.group({
      exaustNoLeaks: ['', Validators.required],
      rotateTires: ['', Validators.required],
    });
  }
  get f() {
    return this.form.controls;
  }
  onHandleOperations(type) {
    switch (type) {
      case 'exaust_no_leaks': 
        this.techcheckCooling.exhaust = this.form.value.exaustNoLeaks;this.checkAllFieldsValid();
        break;
      case 'rotate_tires': 
        this.techcheckCooling.rotateTires = this.form.value.rotateTires;this.checkAllFieldsValid();
        break;
      default:
        break;
    }
  }
  setData(fuelIol) {
    this.techcheckCooling = this.service.techCheckService.vehicleAdditionalItems;
    this.form.setValue({
      exaustNoLeaks: !this.techcheckCooling.exhaust ? fuelIol.exhaust : this.techcheckCooling.exhaust,
      rotateTires: !this.techcheckCooling.rotateTires ? fuelIol.rotateTires : this.techcheckCooling.rotateTires,
      
    });    
  }
  changeMarkAll(event) {
    this.techcheckCooling = this.service.techCheckService.vehicleAdditionalItems;
    if (event == true) {
      this.form.controls['exaustNoLeaks'].setValue('N/A');
      this.form.controls['rotateTires'].setValue('N/A');
       
      this.techcheckCooling.rotateTires = 'N/A';
      this.techcheckCooling.exhaust = 'N/A';
      
    } else {
      this.form.controls['exaustNoLeaks'].setValue('');
      this.form.controls['rotateTires'].setValue('');
       
      this.techcheckCooling.rotateTires = '';
      this.techcheckCooling.exhaust = '';
    }
    this.checkAllFields.emit(event);
  }
  onSave() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return false;
    }
    const data = new TechCheckModel();
    data.vehicleAdditionalItems = new vehicleAdditionalItemsModel();
    data.vehicleAdditionalItems.exhaust = this.form.value.exaustNoLeaks;
    data.vehicleAdditionalItems.rotateTires = this.form.value.rotateTires; 
 
    this.techCheckSave.emit(data);
  }
  checkAllFieldsValid(){
    if (this.form.valid) {
      this.checkAllFields.emit(true);
    }else{this.checkAllFields.emit(false);}
  }
   
}
