import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MUFFLER_List, RAINCAP_List, SUPPORTS_List } from '../../../../../../../data/serviceorderpage-data';
import { ServiceOrderService } from '../../../service-order/service-order.service';
import { exhaustVactestModel, TechCheckModel } from '../techCheck.model';


@Component({
  selector: 'app-exhaust-techcheck',
  templateUrl: './exhaust-techcheck.component.html',
  styleUrls: ['./exhaust-techcheck.component.scss'],
})
export class ExcaustTechCheckComponent implements OnInit {
  @Output() techCheckSave: EventEmitter<any> = new EventEmitter<any>();
  @Output() checkAllFields: EventEmitter<any> = new EventEmitter<any>();

  form: FormGroup;
  displayMufflerPipesBtn: boolean = false;
  displayHangerBtn: boolean = false;
  displayRainCapBtn: boolean = false;
  displaySupervisorApproval: boolean = false;

  mufflerPipesList = MUFFLER_List;
  hangerList = SUPPORTS_List;
  rainCapList = RAINCAP_List;
  techcheckExhaust: any;
  isGenerator: boolean = false;
  isControlPanel: boolean = false;

  constructor(private formBuilder: FormBuilder, public service: ServiceOrderService) { }

  ngOnInit() {
    this.techcheckExhaust = this.service.techCheckService.exhaustVactest;
    this.initForm();
    if (this.service.blGen == true) {
      this.isGenerator = true;
      this.isControlPanel = false;
      // this.form.controls['vaccumHold'].clearValidators();
      // this.form.controls['vaccumMercury'].clearValidators();
    } else {
      this.isControlPanel = true; this.isGenerator = false;
      // this.form.controls['vaccumHold'].setValidators([Validators.required]);      
      // this.form.controls['vaccumMercury'].setValidators([Validators.required]);
    }
  }

  initForm(): void {
    this.form = this.formBuilder.group({
      vaccumHold: [],
      vaccumMercury: [],
      mufflerPipesLevel: ['', Validators.required],
      hangerLevel: ['', Validators.required],
      rainCapLevel: ['', Validators.required],
    });
  }
  get f() {
    return this.form.controls;
  }
  onVaccumHold() { this.techcheckExhaust.vacuumHold = this.form.value.vaccumHold; }
  onVaccumMercury() { this.techcheckExhaust.vacuumTest = this.form.value.vaccumMercury; }
  onMufflerPipes() {
    this.techcheckExhaust.muffler = this.form.value.mufflerPipesLevel;
    this.checkAllFieldsValid();
  }
  onHangars() {
    this.techcheckExhaust.supports = this.form.value.hangerLevel;
    this.checkAllFieldsValid();
  }
  onRainCap() {
    this.techcheckExhaust.rainCap = this.form.value.rainCapLevel;
    this.checkAllFieldsValid();
  }
  setData(fuelIol) {
    this.techcheckExhaust = this.service.techCheckService.exhaustVactest;
    this.techcheckExhaust.supports = fuelIol.supports;
    this.form.setValue({
      vaccumHold: !this.techcheckExhaust.vacuumHold ? fuelIol.vacuumHold : this.techcheckExhaust.vacuumHold,
      vaccumMercury: !this.techcheckExhaust.vacuumTest ? fuelIol.vacuumTest : this.techcheckExhaust.vacuumTest,
      mufflerPipesLevel: !this.techcheckExhaust.muffler ? fuelIol.muffler : this.techcheckExhaust.muffler,
      hangerLevel: !this.techcheckExhaust.supports ? fuelIol.supports : this.techcheckExhaust.supports,
      rainCapLevel: !this.techcheckExhaust.rainCap ? fuelIol.rainCap : this.techcheckExhaust.rainCap,

    });
  }
  onSave() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return false;
    }
    const data = new TechCheckModel();
    data.exhaustVactest = new exhaustVactestModel();
    data.exhaustVactest.vacuumHold = this.form.value.vaccumHold;
    data.exhaustVactest.vacuumTest = this.form.value.vaccumMercury;
    data.exhaustVactest.muffler = this.form.value.mufflerPipesLevel;
    data.exhaustVactest.rainCap = this.form.value.rainCapLevel;
    data.exhaustVactest.supports = this.form.value.hangerLevel;
    this.service.techCheckService.exhaustVactest.supports = this.form.value.hangerLevel;
    this.service.techCheckService.exhaustVactest = data.exhaustVactest;
    this.techCheckSave.emit(data);
  }
  checkAllFieldsValid() {
    if (this.form.valid) {
      this.checkAllFields.emit(true);
    } else { this.checkAllFields.emit(false); }
  }
}
