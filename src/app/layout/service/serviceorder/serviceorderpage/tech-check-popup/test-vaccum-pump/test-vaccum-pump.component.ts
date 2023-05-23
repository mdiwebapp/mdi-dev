import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ErrorHandlerService } from 'src/app/core/services';
import { UtilityService } from 'src/app/core/services/utility.service';
import {
  BEARINGS_List,
  BELTCONDITION_List,
  PULLEYCONDITION_List,
  SPAREBELTS_List,
} from 'src/data/serviceorderpage-data';
import { ServiceOrderService } from '../../../service-order/service-order.service';
import { TechCheckModel, testVacuumPumpModel } from '../techCheck.model';

@Component({
  selector: 'app-test-vaccum-pump',
  templateUrl: './test-vaccum-pump.component.html',
  styleUrls: ['./test-vaccum-pump.component.scss'],
})
export class TestVaccumPumpComponent implements OnInit {
  @Output() techCheckSave: EventEmitter<any> = new EventEmitter<any>();
  @Output() checkAllFields: EventEmitter<any> = new EventEmitter<any>();

  form: FormGroup;
  displayPulleyCondition: boolean = false;
  displaybearings: boolean = false;
  displayBeltCondition: boolean = false;
  displaySpareBelts: boolean = false;

  pulleyConditionList: any = PULLEYCONDITION_List;
  bearingsList: any = BEARINGS_List;
  beltConditionList: any = BELTCONDITION_List;
  spareBeltsList: any = SPAREBELTS_List;
  techcheckCooling: any;

  constructor(private formBuilder: FormBuilder, public service: ServiceOrderService,
    private utils: UtilityService, public errorHandler: ErrorHandlerService) {}

  ngOnInit(): void {
    this.onInitForm();
    this.techcheckCooling = this.service.techCheckService.testVacuumPump;
  }

  onInitForm() {
    this.form = this.formBuilder.group({
      pulleyCondition: ['', Validators.required],
      bearings: ['', Validators.required],
      beltCondition: ['', Validators.required],
      spareBelts: ['', Validators.required],
    });
  }
  get f() {
    return this.form.controls;
  }
  onHandleOperations(type) {
    switch (type) {
      case 'pulley_condition':
        this.techcheckCooling.pulleyCondition = this.form.value.pulleyCondition;this.checkAllFieldsValid();
        break;
      case 'bearings': 
        this.techcheckCooling.vacuumBearings = this.form.value.bearings;this.checkAllFieldsValid();
        break;
      case 'belt_condition': 
        this.techcheckCooling.beltCondition = this.form.value.beltCondition;this.checkAllFieldsValid();
        break;
      case 'spare_belts': 
        this.techcheckCooling.spareBelts = this.form.value.spareBelts;this.checkAllFieldsValid();
        break;

      default:
        break;
    }
  }
  setData(fuelIol) { 
    this.techcheckCooling = this.service.techCheckService.testVacuumPump;
    this.techcheckCooling.beltCondition =fuelIol.beltCondition; 
    this.form.setValue({
      pulleyCondition: !this.techcheckCooling.pulleyCondition ? fuelIol.testVacuumPump.pulleyCondition : this.techcheckCooling.pulleyCondition,
      bearings: !this.techcheckCooling.vacuumBearings ? fuelIol.testVacuumPump.vacuumBearings : this.techcheckCooling.vacuumBearings,
      beltCondition: !this.techcheckCooling.beltCondition ? fuelIol.beltCondition??'' : this.techcheckCooling.beltCondition,
      spareBelts: !this.techcheckCooling.spareBelts ? fuelIol.testVacuumPump.spareBelts : this.techcheckCooling.spareBelts,     
    });    
  }
  onSave() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return false;
    }
    const data = new TechCheckModel();
    data.testVacuumPump = new testVacuumPumpModel();
    data.testVacuumPump.pulleyCondition = this.form.value.pulleyCondition;
    data.testVacuumPump.vacuumBearings = this.form.value.bearings;
    this.service.techCheckService.testVacuumPump.beltCondition = this.form.value.beltCondition;
    data.testVacuumPump.beltCondition = this.form.value.beltCondition;
    data.testVacuumPump.spareBelts = this.form.value.spareBelts;
    this.service.techCheckService.testVacuumPump = data.testVacuumPump;
    this.techCheckSave.emit(data);
  }

  checkAllFieldsValid() {
    if (this.form.valid) {
      this.checkAllFields.emit(true);
    } else { this.checkAllFields.emit(false); }
  }
  private onError(error: any, customMessage?: string) {
    this.errorHandler.handleError(error, "Tech Check", customMessage);
  }
}
