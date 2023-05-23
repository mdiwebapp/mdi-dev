import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ErrorHandlerService } from 'src/app/core/services';
import {
  BALLVALVE_List,
  BEARINGS_List,
  FOOTMOUNTS_List,
  GASKETS_List,
  GLANDLIPSEAL_List,
  IMPELLERSCREWCAP_List,
  IMPELLER_List,
  SEALRESERVOIRCONDITION_List,
  WEARRINGGAPS_List,
} from 'src/data/serviceorderpage-data';
import { ServiceOrderService } from '../../../service-order/service-order.service';
import { centrifugalPumpModel, TechCheckModel } from '../techCheck.model';

@Component({
  selector: 'app-centrifugal-pump',
  templateUrl: './centrifugal-pump.component.html',
  styleUrls: ['./centrifugal-pump.component.scss'],
})
export class CentrifugalPumpComponent implements OnInit {
  @Output() techCheckSave: EventEmitter<any> = new EventEmitter<any>();
  @Output() checkAllFields: EventEmitter<any> = new EventEmitter<any>();

  form: FormGroup;
  displayFootMountsBtn: boolean = false;
  displayImpellerScrewCapBtn: boolean = false;
  displayGlandLipSealBtn: boolean = false;
  displayImpellerBtn: boolean = false;
  displaySealReservoirBtn: boolean = false;
  displayWearRingBtn: boolean = false;
  displayBearingBtn: boolean = false;
  displayGasketsSealsBtn: boolean = false;
  displayBallValueBtn: boolean = false;
  displaySupervisorApproval: boolean = false;
  displayReservoirLevelBtn: boolean = false;
  footMountsList = FOOTMOUNTS_List;
  impellerScrewList = IMPELLERSCREWCAP_List;
  glandLipSealList = GLANDLIPSEAL_List;
  impellerList = IMPELLER_List;
  sealReservoirList = SEALRESERVOIRCONDITION_List;
  wearRingList = WEARRINGGAPS_List;
  bearingList = BEARINGS_List;
  gasketsSealsList = GASKETS_List;
  ballValueList = BALLVALVE_List;
  techcheckCentri: any;
  markAll: boolean = false;
  constructor(private formBuilder: FormBuilder, public errorHandler: ErrorHandlerService,
    public service: ServiceOrderService) { }

  ngOnInit() {
    this.initForm();
    this.techcheckCentri = this.service.techCheckService.centrifugalPump;
  }

  initForm(): void {
    this.form = this.formBuilder.group({
      txtWRC: [],
      txtWRGB: [],
      txtWRGA: [],
      footMountsData: ['', Validators.required],
      impellerScrewCapData: ['', Validators.required],
      glandLipSealData: ['', Validators.required],
      impellerData: ['', Validators.required],
      sealReservoirData: ['', Validators.required],
      wearRingData: ['', Validators.required],
      bearingData: ['', Validators.required],
      gasketsSealsData: ['', Validators.required],
      ballValueData: ['', Validators.required],
      reservoirLevelData: ['', Validators.required],
    });
  }
  get f() {
    return this.form.controls;
  }
  onFootMounts() {
    this.techcheckCentri.footMounts = this.form.value.footMountsData;this.checkAllFieldsValid();
  }
  onImpellerScrewCap() {
    this.techcheckCentri.screwCap = this.form.value.impellerScrewCapData;this.checkAllFieldsValid();
  }
  onGlandLipSeal() {
    this.techcheckCentri.lipSeal = this.form.value.glandLipSealData;this.checkAllFieldsValid();
  }
  onImpeller() {
    this.techcheckCentri.impeller = this.form.value.impellerData;this.checkAllFieldsValid();
  }
  onSealReservoir() {
    this.techcheckCentri.sealReservoir = this.form.value.sealReservoirData;this.checkAllFieldsValid();
  }
  onWearRing() {
    this.techcheckCentri.wearRing = this.form.value.wearRingData;this.checkAllFieldsValid();
  }
  onBearings() {
    this.techcheckCentri.bearings = this.form.value.bearingData;this.checkAllFieldsValid();
  }
  onGasketsSeals() {
    this.techcheckCentri.gaskets = this.form.value.gasketsSealsData;this.checkAllFieldsValid();
  }
  onBallValue() {
    this.techcheckCentri.centrifugalBallValve = this.form.value.ballValueData;this.checkAllFieldsValid();
  }
  onReservoirLevel() {
    this.techcheckCentri.sealResLevel = this.form.value.reservoirLevelData;this.checkAllFieldsValid();
  }
  setData(tech) {
    this.techcheckCentri = this.service.techCheckService.centrifugalPump;
    this.techcheckCentri.bearings =tech.bearings; 
    this.form.setValue({
      txtWRC: !this.techcheckCentri.wearRingClearance ? tech.centrifugalPump.wearRingClearance : this.techcheckCentri.wearRingClearance,
      txtWRGB: !this.techcheckCentri.wearRingGapBefore ? tech.centrifugalPump.wearRingGapBefore : this.techcheckCentri.wearRingGapBefore,
      txtWRGA: !this.techcheckCentri.wearRingGapAfter ? tech.centrifugalPump.wearRingGapAfter : this.techcheckCentri.wearRingGapAfter,
      footMountsData: !this.techcheckCentri.footMounts ? tech.centrifugalPump.footMounts : this.techcheckCentri.footMounts,
      impellerData: !this.techcheckCentri.impeller ? tech.centrifugalPump.impeller : this.techcheckCentri.impeller,
      impellerScrewCapData: !this.techcheckCentri.screwCap ? tech.centrifugalPump.screwCap : this.techcheckCentri.screwCap,
      glandLipSealData: !this.techcheckCentri.lipSeal ? tech.centrifugalPump.lipSeal : this.techcheckCentri.lipSeal,
      sealReservoirData: !this.techcheckCentri.sealReservoir ? tech.centrifugalPump.sealReservoir : this.techcheckCentri.sealReservoir,
      reservoirLevelData: !this.techcheckCentri.sealResLevel ? tech.centrifugalPump.sealResLevel : this.techcheckCentri.sealResLevel,
      wearRingData: !this.techcheckCentri.wearRing ? tech.centrifugalPump.wearRing : this.techcheckCentri.wearRing,
      bearingData: !this.techcheckCentri.bearings ? tech.bearings??'' : this.techcheckCentri.bearings,
      gasketsSealsData: !this.techcheckCentri.gaskets ? tech.centrifugalPump.gaskets : this.techcheckCentri.gaskets,
      ballValueData: !this.techcheckCentri.centrifugalBallValve ? tech.centrifugalPump.centrifugalBallValve : this.techcheckCentri.centrifugalBallValve,
    });
  }
  onSave() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return false;
    }
    const data = new TechCheckModel();
    data.centrifugalPump = new centrifugalPumpModel();
    data.centrifugalPump.wearRingClearance = this.form.value.txtWRC;
    data.centrifugalPump.wearRingGapBefore = this.form.value.txtWRGB;
    data.centrifugalPump.wearRingGapAfter = this.form.value.txtWRGA;
    data.centrifugalPump.footMounts = this.form.value.footMountsData;
    data.centrifugalPump.impeller = this.form.value.impellerData;
    data.centrifugalPump.screwCap = this.form.value.impellerScrewCapData;
    data.centrifugalPump.lipSeal = this.form.value.glandLipSealData;
    data.centrifugalPump.sealResLevel = this.form.value.reservoirLevelData;
    data.centrifugalPump.sealReservoir = this.form.value.sealReservoirData;
    data.centrifugalPump.wearRing = this.form.value.wearRingData;
    this.service.techCheckService.centrifugalPump.bearings = this.form.value.bearingData;
    data.centrifugalPump.bearings = this.form.value.bearingData;
    data.centrifugalPump.gaskets = this.form.value.gasketsSealsData;
    data.centrifugalPump.centrifugalBallValve = this.form.value.ballValueData;
    this.service.techCheckService.centrifugalPump = data.centrifugalPump;
    this.techCheckSave.emit(data);
  }
  private onError(error: any, customMessage?: string) {
    this.errorHandler.handleError(error, "Tech Check", customMessage);
  }
  checkAllFieldsValid() {
    if (this.form.valid) {
      this.checkAllFields.emit(true);
    } else { this.checkAllFields.emit(false); }
  }
  changeMarkAll(event) {
    this.techcheckCentri = this.service.techCheckService.centrifugalPump;
    if (event == true) {
      this.form.controls['footMountsData'].setValue('N/A');
      this.form.controls['impellerData'].setValue('N/A');
      this.form.controls['impellerScrewCapData'].setValue('N/A');
      this.form.controls['glandLipSealData'].setValue('N/A'); 
      this.form.controls['sealReservoirData'].setValue('N/A');
      this.form.controls['reservoirLevelData'].setValue('N/A');
      this.form.controls['wearRingData'].setValue('N/A');
      this.form.controls['bearingData'].setValue('N/A');
      this.form.controls['gasketsSealsData'].setValue('N/A');
      this.form.controls['ballValueData'].setValue('N/A');
       
      this.techcheckCentri.footMounts = 'N/A';
      this.techcheckCentri.impeller = 'N/A';
      this.techcheckCentri.screwCap = 'N/A';
      this.techcheckCentri.lipSeal = 'N/A';
      this.techcheckCentri.sealResLevel = 'N/A';
      this.techcheckCentri.sealReservoir = 'N/A';
      this.techcheckCentri.wearRing = 'N/A';
      this.techcheckCentri.bearings = 'N/A';
      this.techcheckCentri.gaskets = 'N/A';
      this.techcheckCentri.centrifugalBallValve = 'N/A';
      
    } else {
      this.form.controls['footMountsData'].setValue('');
      this.form.controls['impellerData'].setValue('');
      this.form.controls['impellerScrewCapData'].setValue('');
      this.form.controls['glandLipSealData'].setValue('');
      this.form.controls['impellerData'].setValue('');
      this.form.controls['sealReservoirData'].setValue('');
      this.form.controls['reservoirLevelData'].setValue('');
      this.form.controls['wearRingData'].setValue('');
      this.form.controls['bearingData'].setValue('');
      this.form.controls['gasketsSealsData'].setValue('');
      this.form.controls['ballValueData'].setValue('');
       
      this.techcheckCentri.footMounts = '';
      this.techcheckCentri.impeller = '';
      this.techcheckCentri.screwCap = '';
      this.techcheckCentri.lipSeal = '';
      this.techcheckCentri.sealResLevel = '';
      this.techcheckCentri.sealReservoir = '';
      this.techcheckCentri.wearRing = '';
      this.techcheckCentri.bearings = '';
      this.techcheckCentri.gaskets = '';
      this.techcheckCentri.centrifugalBallValve = '';
    }
    this.checkAllFields.emit(event);
  }
}
