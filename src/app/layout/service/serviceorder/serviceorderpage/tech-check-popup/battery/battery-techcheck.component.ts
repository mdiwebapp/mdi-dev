import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ErrorHandlerService } from 'src/app/core/services';
import { UtilityService } from 'src/app/core/services/utility.service';
import { BATTERYCOMPARTMENT_List, BATTERYLEAKS_List, BATTERYPOSTS_List, BATTERY_List } from '../../../../../../../data/serviceorderpage-data';
import { ServiceOrderService } from '../../../service-order/service-order.service';
import { batteryModel, TechCheckModel } from '../techCheck.model';

@Component({
  selector: 'app-battery-techcheck',
  templateUrl: './battery-techcheck.component.html',
  styleUrls: ['./battery-techcheck.component.scss'],
})
export class BatteryTechCheckComponent implements OnInit {
  @Output() techCheckSave: EventEmitter<any> = new EventEmitter<any>();
  @Output() checkAllFields: EventEmitter<any> = new EventEmitter<any>();

  form: FormGroup;
  displaybatteryConditionBtn: boolean = false;
  displaybatteryPostBtn: boolean = false;
  displaybatteryComponentBtn: boolean = false;
  displaybatteryLeaksBtn: boolean = false;
  displaySupervisorApproval: boolean = false;
  batteryConditionList = BATTERY_List;
  batteryPostList = BATTERYPOSTS_List;
  batteryComponentList = BATTERYCOMPARTMENT_List;
  batteryLeaksList = BATTERYLEAKS_List;
  techcheckBattery: any;
  isGenerator: boolean = false;
  isControlPanel: boolean = false;
  markAll: boolean = false;
  constructor(private formBuilder: FormBuilder, public service: ServiceOrderService,
    private utils: UtilityService, public errorHandler: ErrorHandlerService) { }

  ngOnInit() {
    this.initForm();
    if (this.service.blGen == true) {
      this.isGenerator = true;
      this.isControlPanel = false;
      this.form.controls['batteryLeaks'].clearValidators();
    } else {
      this.isControlPanel = true; this.isGenerator = false;
      this.form.controls['batteryLeaks'].setValidators([Validators.required]);
    }
    this.techcheckBattery = this.service.techCheckService.battery;
  }

  initForm(): void {
    this.form = this.formBuilder.group({
      loadTestReading: ['', Validators.required],
      batteryCondition: ['', Validators.required],
      batteryPost: ['', Validators.required],
      batteryComponent: ['', Validators.required],
      batteryLeaks: ['', Validators.required],
    });
  }
  get f() {
    return this.form.controls;
  }
  onBatteryLoad() {
    this.techcheckBattery.batteryLoad = this.form.value.loadTestReading;
    this.checkAllFieldsValid();
  }
  onBatteryCondition() {
    this.techcheckBattery.battery = this.form.value.batteryCondition;
    this.checkAllFieldsValid();
  }
  onBatteryPost() {
    this.techcheckBattery.batteryPost = this.form.value.batteryPost;
    this.checkAllFieldsValid();
  }
  onBatteryComponent() {
    this.techcheckBattery.batteryCompartment = this.form.value.batteryComponent;
    this.checkAllFieldsValid();
  }
  onBatteryLeaks() {
    this.techcheckBattery.batteryLeak = this.form.value.batteryLeaks;
    this.checkAllFieldsValid();
  }
  setData(battery) {
    this.techcheckBattery = this.service.techCheckService.battery;
    this.techcheckBattery.battery =battery.battery;
    this.form.setValue({
      loadTestReading: !this.techcheckBattery.batteryLoad ? battery.batteryModel.batteryLoad : this.techcheckBattery.batteryLoad,
      batteryCondition: !this.techcheckBattery.battery ? battery.battery??'' : this.techcheckBattery.battery,
      batteryPost: !this.techcheckBattery.batteryPost ? battery.batteryModel.batteryPost : this.techcheckBattery.batteryPost,
      batteryComponent: !this.techcheckBattery.batteryCompartment ? battery.batteryModel.batteryCompartment : this.techcheckBattery.batteryCompartment,
      batteryLeaks: !this.techcheckBattery.batteryLeak ? battery.batteryModel.batteryLeak : this.techcheckBattery.batteryLeak
    });
  }
  onSave() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return false;
    }
    const data = new TechCheckModel();
    data.batteryModel = new batteryModel();
    data.batteryModel.batteryLoad = this.form.value.loadTestReading;
    data.batteryModel.battery = this.form.value.batteryCondition;
    this.service.techCheckService.battery.battery = this.form.value.batteryCondition;
    data.batteryModel.batteryPost = this.form.value.batteryPost;
    data.batteryModel.batteryCompartment = this.form.value.batteryComponent;
    data.batteryModel.batteryLeak = this.form.value.batteryLeaks;
    this.service.techCheckService.battery = data.batteryModel;
    this.techCheckSave.emit(data);
  }
  checkAllFieldsValid() {
    if (this.form.valid) {
      this.checkAllFields.emit(true);
    } else { this.checkAllFields.emit(false); }
  }
  changeMarkAll(event) {
    this.techcheckBattery = this.service.techCheckService.battery;
    if (event == true) {
      this.form.controls['batteryCondition'].setValue('N/A');
      this.form.controls['batteryPost'].setValue('N/A');
      this.form.controls['batteryComponent'].setValue('N/A');
      this.form.controls['batteryLeaks'].setValue('N/A');
      this.techcheckBattery.battery = 'N/A';
      this.techcheckBattery.batteryPost = 'N/A';
      this.techcheckBattery.batteryCompartment = 'N/A';
      this.techcheckBattery.batteryLeak = 'N/A';

    } else {
      this.form.controls['batteryCondition'].setValue('');
      this.form.controls['batteryPost'].setValue('');
      this.form.controls['batteryComponent'].setValue('');
      this.form.controls['batteryLeaks'].setValue('');
      this.techcheckBattery.battery = '';
      this.techcheckBattery.batteryPost = '';
      this.techcheckBattery.batteryCompartment = '';
      this.techcheckBattery.batteryLeak = '';

    }
    this.checkAllFieldsValid();
  }
  private onError(error: any, customMessage?: string) {
    this.errorHandler.handleError(error, "Tech Check", customMessage);
  }
}
