import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FLOATSIZE_List, FLOATS_List, FLOATVALVE_List, HOSEANDBALL_VALVES_List, SPOOLBALLVALVE_List, SPOOLGASKETS_List, SPOOLSCREEN_List, VACUUMGAUGE_List } from '../../../../../../../data/serviceorderpage-data';
import { ServiceOrderService } from '../../../service-order/service-order.service';
import { enviornBoxModel, TechCheckModel } from '../techCheck.model';


@Component({
  selector: 'app-environbox-techcheck',
  templateUrl: './environbox-techcheck.component.html',
  styleUrls: ['./environbox-techcheck.component.scss'],
})
export class EnvironBoxTechCheckComponent implements OnInit {
  @Output() techCheckSave: EventEmitter<any> = new EventEmitter<any>();
  @Output() checkAllFields: EventEmitter<any> = new EventEmitter<any>();

  form: FormGroup;
  displayBollValueBtn: boolean = false;
  displayFloatBtn: boolean = false;
  displayFloatValueBtn: boolean = false;
  displaySizeFloatBtn: boolean = false;
  displaySpoolScreenBtn: boolean = false;
  displaySpoolBallBtn: boolean = false;
  displayVaccumGuage: boolean = false;
  displaySpoolGasketsBtn: boolean = false;
  displaySupervisorApproval: boolean = false;
  ballValueList = HOSEANDBALL_VALVES_List;
  floatList = FLOATS_List;
  floatValueList = FLOATVALVE_List;
  sizeFloatList = FLOATSIZE_List;
  spoolScreenList = SPOOLSCREEN_List;
  spoolBallList = SPOOLBALLVALVE_List;
  vaccumGuageList = VACUUMGAUGE_List;
  spoolGasketsList = SPOOLGASKETS_List;
  techcheckEnviron: any;

  constructor(private formBuilder: FormBuilder, public service: ServiceOrderService) { }

  ngOnInit() {
    this.techcheckEnviron = this.service.techCheckService.enviornBox;
    this.initForm();
  }

  initForm(): void {
    this.form = this.formBuilder.group({
      bollValueLevel: ['', Validators.required],
      floatLevel: ['', Validators.required],
      floatValueLevel: ['', Validators.required],
      sizeFloatLevel: ['', Validators.required],
      spoolScreenLevel: ['', Validators.required],
      spoolBallLevel: ['', Validators.required],
      vaccumGuageLevel: ['', Validators.required],
      spoolGasketsLevel: ['', Validators.required],
    });
  }
  get f() {
    return this.form.controls;
  }
  onBots() {
    this.techcheckEnviron.hosesBallValve = this.form.value.bollValueLevel; this.checkAllFieldsValid();
  }
  onFloat() {
    this.techcheckEnviron.float = this.form.value.floatLevel; this.checkAllFieldsValid();
  }
  onFloatValue() {
    this.techcheckEnviron.floatValve = this.form.value.floatValueLevel; this.checkAllFieldsValid();
  }
  onSizeFloat() {
    this.techcheckEnviron.floatSize = this.form.value.sizeFloatLevel; this.checkAllFieldsValid();
  }
  onSpoolScreen() {
    this.techcheckEnviron.spoolScreen = this.form.value.spoolScreenLevel; this.checkAllFieldsValid();
  }
  onSpoolBall() {
    this.techcheckEnviron.spoolBallValve = this.form.value.spoolBallLevel; this.checkAllFieldsValid();
  }
  onVaccumGuage() {
    this.techcheckEnviron.vacuumGauge = this.form.value.vaccumGuageLevel; this.checkAllFieldsValid();
  }
  onSpoolGaskets() {
    this.techcheckEnviron.spoolGasket = this.form.value.spoolGasketsLevel; this.checkAllFieldsValid();
  }
  setData(fuelIol) {
    this.techcheckEnviron = this.service.techCheckService.enviornBox;
    this.form.setValue({
      bollValueLevel: !this.techcheckEnviron.hosesBallValve ? fuelIol.hosesBallValve : this.techcheckEnviron.hosesBallValve,
      floatLevel: !this.techcheckEnviron.float ? fuelIol.float : this.techcheckEnviron.float,
      floatValueLevel: !this.techcheckEnviron.floatValve ? fuelIol.floatValve : this.techcheckEnviron.floatValve,
      sizeFloatLevel: !this.techcheckEnviron.floatSize ? fuelIol.floatSize : this.techcheckEnviron.floatSize,
      spoolScreenLevel: !this.techcheckEnviron.spoolScreen ? fuelIol.spoolScreen : this.techcheckEnviron.spoolScreen,
      spoolBallLevel: !this.techcheckEnviron.spoolBallValve ? fuelIol.spoolBallValve : this.techcheckEnviron.spoolBallValve,
      vaccumGuageLevel: !this.techcheckEnviron.vacuumGauge ? fuelIol.vacuumGauge : this.techcheckEnviron.vacuumGauge,
      spoolGasketsLevel: !this.techcheckEnviron.spoolGasket ? fuelIol.spoolGasket : this.techcheckEnviron.spoolGasket,

    });
  }
  onSave() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return false;
    }
    const data = new TechCheckModel();
    data.enviornBox = new enviornBoxModel();
    data.enviornBox.hosesBallValve = this.form.value.bollValueLevel;
    data.enviornBox.float = this.form.value.floatLevel;
    data.enviornBox.floatValve = this.form.value.floatValueLevel;
    data.enviornBox.floatSize = this.form.value.sizeFloatLevel;
    data.enviornBox.spoolScreen = this.form.value.spoolScreenLevel;
    data.enviornBox.spoolBallValve = this.form.value.spoolBallLevel;
    data.enviornBox.vacuumGauge = this.form.value.vaccumGuageLevel;
    data.enviornBox.spoolGasket = this.form.value.spoolGasketsLevel;
    this.service.techCheckService.enviornBox = data.enviornBox;
    this.techCheckSave.emit(data);
  }
  checkAllFieldsValid() {
    if (this.form.valid) {
      this.checkAllFields.emit(true);
    } else { this.checkAllFields.emit(false); }
  }
}
