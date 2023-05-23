import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VEHICLE_OPTION_LIST } from 'src/data/serviceorderpage-data';
import { ServiceOrderService } from '../../../service-order/service-order.service';
import { TechCheckModel, vehicleTransmissionTransferCaseModel } from '../techCheck.model';

@Component({
  selector: 'app-trasmission-transfer-case',
  templateUrl: './trasmission-transfer-case.component.html',
  styleUrls: ['./trasmission-transfer-case.component.scss'],
})
export class TrasmissionTransferCaseComponent implements OnInit {
  @Output() techCheckSave: EventEmitter<any> = new EventEmitter<any>();
  @Output() checkAllFields: EventEmitter<any> = new EventEmitter<any>();
  form: FormGroup;
  displayOilCoolerClean: boolean = false;
  displayNoTransmissionLeaks: boolean = false;
  displayNoTransferCaseLeaks: boolean = false;
  displayDriveShaft: boolean = false;
  techcheckCooling: any;
  vehicleOptions: any = VEHICLE_OPTION_LIST;
  markAll: boolean = false;
  
  constructor(private formBuilder: FormBuilder, public service: ServiceOrderService) {}

  ngOnInit(): void {
    this.onInitForm();
    this.techcheckCooling = this.service.techCheckService.vehicleTransmissionTransferCase;
  }

  onInitForm() {
    this.form = this.formBuilder.group({
      oilCoolerClean: ['', Validators.required],
      noTransmissionLeaks: ['', Validators.required],
      noTransferCaseLeaks: ['', Validators.required],
      driveShaft: ['', Validators.required],
    });
  }
  get f() {
    return this.form.controls;
  }
  onHandleOperations(type) {
    switch (type) {
      case 'oil_cooler_clean':
        this.techcheckCooling.cleanOilCooler = this.form.value.oilCoolerClean;this.checkAllFieldsValid();
        break;
      case 'no_transmission_leaks': 
        this.techcheckCooling.noTransLeaks = this.form.value.noTransmissionLeaks;this.checkAllFieldsValid();
        break;
      case 'no_trasnfer_case_leaks': 
        this.techcheckCooling.noTransferLeaks = this.form.value.noTransferCaseLeaks;this.checkAllFieldsValid();
        break;
      case 'drive_shaft': 
        this.techcheckCooling.driveShaft = this.form.value.driveShaft;this.checkAllFieldsValid();
        break;

      default:
        break;
    }
  }
  setData(fuelIol) {
    this.techcheckCooling = this.service.techCheckService.vehicleTransmissionTransferCase;
    this.form.setValue({
      oilCoolerClean: !this.techcheckCooling.cleanOilCooler ? fuelIol.cleanOilCooler : this.techcheckCooling.cleanOilCooler,
      noTransmissionLeaks: !this.techcheckCooling.noTransLeaks ? fuelIol.noTransLeaks : this.techcheckCooling.noTransLeaks,
      noTransferCaseLeaks: !this.techcheckCooling.noTransferLeaks ? fuelIol.noTransferLeaks : this.techcheckCooling.noTransferLeaks,
      driveShaft: !this.techcheckCooling.driveShaft ? fuelIol.driveShaft : this.techcheckCooling.driveShaft,
      
    });    
  }
  onSave() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return false;
    }
    const data = new TechCheckModel();
    data.vehicleTransmissionTransferCase = new vehicleTransmissionTransferCaseModel();
    data.vehicleTransmissionTransferCase.cleanOilCooler = this.form.value.oilCoolerClean;
    data.vehicleTransmissionTransferCase.noTransLeaks = this.form.value.noTransmissionLeaks;
    data.vehicleTransmissionTransferCase.noTransferLeaks = this.form.value.noTransferCaseLeaks;
    data.vehicleTransmissionTransferCase.driveShaft = this.form.value.driveShaft;
 
    this.techCheckSave.emit(data);
  }
  checkAllFieldsValid(){
    if (this.form.valid) {
      this.checkAllFields.emit(true);
    }else{this.checkAllFields.emit(false);}
  }
  changeMarkAll(event) {
    this.techcheckCooling = this.service.techCheckService.vehicleTransmissionTransferCase;
    if (event == true) {
      this.form.controls['oilCoolerClean'].setValue('N/A');
      this.form.controls['noTransmissionLeaks'].setValue('N/A');
      this.form.controls['noTransferCaseLeaks'].setValue('N/A');
      this.form.controls['driveShaft'].setValue('N/A');
      this.techcheckCooling.cleanOilCooler = 'N/A';
      this.techcheckCooling.noTransLeaks = 'N/A';
      this.techcheckCooling.noTransferLeaks = 'N/A';
      this.techcheckCooling.driveShaft = 'N/A'; 
    } else {
      this.form.controls['oilCoolerClean'].setValue('');
      this.form.controls['noTransmissionLeaks'].setValue('');
      this.form.controls['noTransferCaseLeaks'].setValue('');
      this.form.controls['driveShaft'].setValue('');
      this.techcheckCooling.cleanOilCooler = '';
      this.techcheckCooling.noTransLeaks = '';
      this.techcheckCooling.noTransferLeaks = '';
      this.techcheckCooling.driveShaft = ''; 
    }
    this.checkAllFields.emit(event);
  }
}
