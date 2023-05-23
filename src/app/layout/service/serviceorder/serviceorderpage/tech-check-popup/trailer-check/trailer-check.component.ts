import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  BRAKEACTUATOR_List,
  FRAME_List,
  HUBS_List,
  LIGHTS_List,
  PINTLEHITCH_List,
  SAFETYLATCHES_List,
  WHEELBEARINGS_List,
  WHEELS_List,
  WIRINGHARNESS_List,
} from 'src/data/serviceorderpage-data';

@Component({
  selector: 'app-trailer-check',
  templateUrl: './trailer-check.component.html',
  styleUrls: ['./trailer-check.component.scss'],
})
export class TrailerCheckComponent implements OnInit {
  form: FormGroup;
  displayFrameBtn: boolean = true;
  displayPintleHitchBtn: boolean = true;
  displaySafetyLatchesBtn: boolean = true;
  displayWiringHarnessBtn: boolean = true;
  displayLightsBtn: boolean = true;
  // displayTiresBtn: boolean = true;
  displayWheelsBtn: boolean = true;
  displayWheelsBearingBtn: boolean = true;
  // displayWheelsBearingLUGSBtn: boolean = true;
  displayHubsConditionBtn: boolean = true;
  displayActuatorConditionBtn: boolean = true;
  frameList = FRAME_List;
  pintleHitchList = PINTLEHITCH_List;
  safetyLatchesList = SAFETYLATCHES_List;
  wiringHarnessList = WIRINGHARNESS_List;
  lightsList = LIGHTS_List;
  // tiresList = [];
  wheelsList = WHEELS_List;
  wheelsBearingList = WHEELBEARINGS_List;
  // wheelsBearingLUGSList = HUBS_List;
  hubsConditionList = HUBS_List;
  actutorConditionList = WHEELS_List;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.initForm();
  }

  initForm(): void {
    this.form = this.formBuilder.group({
      txtlfpsi: [],
      txtlmpsi: [],
      txtlrpsi: [],
      txtrfpsi: [],
      txtrmpsi: [],
      txtrrpsi: [],
      txtlfin: [],
      txtlmin: [],
      txtlrin: [],
      txtrfin: [],
      txtrmin: [],
      txtrrin: [],
      framData: [],
      pintleHitchData: [],
      safetyLatchesData: [],
      wiringHarnessData: [],
      lightsData: [],
      tiresData: [],
      wheelsData: [],
      wheelsBearingData: [],
      wheelsBearingLUGSData: [],
      actutorConditionData: [],
    });
  }
  onBatteryLeaks() {
    this.displayFrameBtn = !this.displayFrameBtn;
  }
  onPintleHitch() {
    this.displayPintleHitchBtn = !this.displayPintleHitchBtn;
  }
  onSafetyLatches() {
    this.displaySafetyLatchesBtn = !this.displaySafetyLatchesBtn;
  }
  onWiringHarness() {
    this.displayWiringHarnessBtn = !this.displayWiringHarnessBtn;
  }
  onLights() {
    this.displayLightsBtn = !this.displayLightsBtn;
  }
  // onTires() {
  //   this.displayTiresBtn = !this.displayTiresBtn;
  // }
  onWheels() {
    this.displayWheelsBtn = !this.displayWheelsBtn;
  }
  onWheelsBearings() {
    this.displayWheelsBearingBtn = !this.displayWheelsBearingBtn;
  }
  // onWheelsBearingsLUGS() {
  //   this.displayWheelsBearingLUGSBtn = !this.displayWheelsBearingLUGSBtn;
  // }
  onHubsCondition() {
    this.displayHubsConditionBtn = !this.displayHubsConditionBtn;
  }
  onActuatorCondition() {
    this.displayActuatorConditionBtn = !this.displayActuatorConditionBtn;
  }
}
