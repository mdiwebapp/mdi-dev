import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  CERTIFICATE_OF_INSURANCE_LIST,
  DOCUMENT_HOLDER_LIST,
  LICENCE_PLATE_LIST,
  VEHICLE_REGISRATION_LIST,
} from 'src/data/serviceorderpage-data';
import { ServiceOrderService } from '../../../service-order/service-order.service';
import { TechCheckModel, trailerRegulatoryModel } from '../techCheck.model';

@Component({
  selector: 'app-regulatory-requirement',
  templateUrl: './regulatory-requirement.component.html',
  styleUrls: ['./regulatory-requirement.component.scss'],
})
export class RegulatoryRequirementComponent implements OnInit {
  @Output() techCheckSave: EventEmitter<any> = new EventEmitter<any>();
  @Output() checkAllFields: EventEmitter<any> = new EventEmitter<any>();

  form: FormGroup;
  displayVehicleRegistration: boolean = false;
  displayLicensePlate: boolean = false;
  displayCertificateOfInsurance: boolean = false;
  displayDocumentHolder: boolean = false;

  vehicleRegistrationList: any = VEHICLE_REGISRATION_LIST;
  licensePlateList: any = LICENCE_PLATE_LIST;
  certificateOfInsuranceList: any = CERTIFICATE_OF_INSURANCE_LIST;
  documentHolderList: any = DOCUMENT_HOLDER_LIST;
  techcheckCooling: any;
  markAll: boolean = false;
  constructor(private formBuilder: FormBuilder, public service: ServiceOrderService) { }

  ngOnInit(): void {
    this.onInitForm();
    this.techcheckCooling = this.service.techCheckService.trailerRegulatory;
  }

  onInitForm() {
    this.form = this.formBuilder.group({
      vehicleRegistration: ['', Validators.required],
      licensePlate:['', Validators.required],
      certificateOfInsurance:['', Validators.required],
      documentHolder: ['', Validators.required],
    });
  }
  get f() {
    return this.form.controls;
  }
  onHandleOperations(type) {
    switch (type) {
      case 'vehicle_registration': 
        this.techcheckCooling.registration = this.form.value.vehicleRegistration;this.checkAllFieldsValid();
        break;
      case 'license_plate': 
        this.techcheckCooling.licensePlate = this.form.value.licensePlate;this.checkAllFieldsValid();
        break;
      case 'certificateOfInsurance': 
        this.techcheckCooling.insurance = this.form.value.certificateOfInsurance;this.checkAllFieldsValid();
        break;
      case 'document_holder': 
        this.techcheckCooling.documentholder = this.form.value.documentHolder;this.checkAllFieldsValid();
        break; 
      default:
        break;
    }
  }
  setData(fuelIol) {
    this.techcheckCooling = this.service.techCheckService.trailerRegulatory;
    this.form.setValue({
      vehicleRegistration: !this.techcheckCooling.registration ? fuelIol.registration : this.techcheckCooling.registration,
      licensePlate: !this.techcheckCooling.licensePlate ? fuelIol.licensePlate : this.techcheckCooling.licensePlate,
      certificateOfInsurance: !this.techcheckCooling.insurance ? fuelIol.insurance : this.techcheckCooling.insurance,
      documentHolder: !this.techcheckCooling.documentholder ? fuelIol.documentholder : this.techcheckCooling.documentholder,
      
    });    
  }
  onSave() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return false;
    }
    const data = new TechCheckModel();
    data.trailerRegulatory = new trailerRegulatoryModel();
    data.trailerRegulatory.registration = this.form.value.vehicleRegistration;
    data.trailerRegulatory.licensePlate = this.form.value.licensePlate;
    data.trailerRegulatory.insurance = this.form.value.certificateOfInsurance;
    data.trailerRegulatory.documentholder = this.form.value.documentHolder;
 
    this.techCheckSave.emit(data);
  }
  checkAllFieldsValid() {
    if (this.form.valid) {
      this.checkAllFields.emit(true);
    } else { this.checkAllFields.emit(false); }
  }
  changeMarkAll(event) {
    this.techcheckCooling = this.service.techCheckService.trailerRegulatory;
    if (event == true) {
      this.form.controls['vehicleRegistration'].setValue('N/A');
      this.form.controls['licensePlate'].setValue('N/A');
      this.form.controls['certificateOfInsurance'].setValue('N/A');
      this.form.controls['documentHolder'].setValue('N/A'); 
      this.techcheckCooling.registration = 'N/A';
      this.techcheckCooling.licensePlate = 'N/A';
      this.techcheckCooling.insurance = 'N/A';
      this.techcheckCooling.documentholder = 'N/A'; 
    } else {
      this.form.controls['vehicleRegistration'].setValue('');
      this.form.controls['licensePlate'].setValue('');
      this.form.controls['certificateOfInsurance'].setValue('');
      this.form.controls['documentHolder'].setValue(''); 
      this.techcheckCooling.registration = '';
      this.techcheckCooling.licensePlate = '';
      this.techcheckCooling.insurance = '';
      this.techcheckCooling.documentholder = ''; 
    }
    this.checkAllFields.emit(event);
  }
}
