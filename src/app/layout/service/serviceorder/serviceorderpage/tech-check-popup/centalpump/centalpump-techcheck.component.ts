import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ErrorHandlerService } from 'src/app/core/services';
import { BALLVALVE_List, BEARINGS_List, FOOTMOUNTS_List, GASKETS_List, GLANDLIPSEAL_List, IMPELLERSCREWCAP_List, IMPELLER_List, SEALRESERVOIRCONDITION_List, WEARRINGGAPS_List } from '../../../../../../../data/serviceorderpage-data';
import { ServiceOrderService } from '../../../service-order/service-order.service';
import { centrifugalPumpModel, TechCheckModel } from '../techCheck.model';
@Component({
  selector: 'app-centalpump-techcheck',
  templateUrl: './centalpump-techcheck.component.html',
  styleUrls: ['./centalpump-techcheck.component.scss'],
})
export class CentralpumpTechCheckComponent implements OnInit {  
  @Output() techCheckSave: EventEmitter<any> = new EventEmitter<any>();
  @Output() checkAllFields: EventEmitter<any> = new EventEmitter<any>();

  form: FormGroup;
  displayFootMountsBtn: boolean = false;
  displayImpellerScrewCapBtn: boolean = false;
  displayGlandLipSealBtn: boolean = false;
  displayImpellerBtn: boolean = false;
  displaySealReservoirBtn: boolean = false;
  displayReservoirLevelBtn: boolean = false;
  displayWearRingBtn: boolean = false;
  displayBearingBtn: boolean = false;
  displayGasketsSealsBtn: boolean = false;
  displayBallValueBtn: boolean = false;
  displaySupervisorApproval: boolean = false; 
  footMountsList = FOOTMOUNTS_List;
  impellerScrewList = IMPELLERSCREWCAP_List;
  glandLipSealList = GLANDLIPSEAL_List;
  impellerList = IMPELLER_List;
  sealReservoirList = SEALRESERVOIRCONDITION_List;
  reservoirLevelList = [];
  wearRingList = WEARRINGGAPS_List;
  bearingList = BEARINGS_List;
  gasketsSealsList = GASKETS_List;
  ballValueList = BALLVALVE_List;
  techcheckCentralPump: any;
  markAll: boolean = false;
  constructor(private formBuilder: FormBuilder,public errorHandler: ErrorHandlerService, public service: ServiceOrderService) { }

  ngOnInit() {
    this.techcheckCentralPump = this.service.techCheckService.centrifugalPump;
    this.initForm();
  }
 
  initForm(): void {
    this.form = this.formBuilder.group({
      txtWRC: [],
      txtWRGB: [],
      txtWRGA: [],
      footMountsData: ['', Validators.required],
      impellerScrewCapData: ['', Validators.required],
      glandLipSealData:['', Validators.required],
      impellerData: ['', Validators.required],
      sealReservoirData: ['', Validators.required],
      reservoirLevelData: ['', Validators.required],
      wearRingData:['', Validators.required],
      bearingData: ['', Validators.required],
      gasketsSealsData: ['', Validators.required],
      ballValueData: ['', Validators.required],
    });
  }
  get f() {
    return this.form.controls;
  }
  onWRC(){this.techcheckCentralPump.wearRingClearance = this.form.value.txtWRC;}
  onWRGB(){this.techcheckCentralPump.wearRingGapBefore = this.form.value.txtWRGB;}
  onWRGA(){this.techcheckCentralPump.wearRingGapAfter = this.form.value.txtWRGA;}
  onFootMounts() {
    this.techcheckCentralPump.footMounts = this.form.value.footMountsData;this.checkAllFieldsValid();
  }
  onImpellerScrewCap() {
    this.techcheckCentralPump.screwCap = this.form.value.impellerScrewCapData;this.checkAllFieldsValid();
  }
  onGlandLipSeal() {
    this.techcheckCentralPump.lipSeal = this.form.value.glandLipSealData;this.checkAllFieldsValid();
  }
  onImpeller() {
    this.techcheckCentralPump.impeller = this.form.value.impellerData;this.checkAllFieldsValid();
  }
  onSealReservoir() {
    this.techcheckCentralPump.sealReservoir = this.form.value.sealReservoirData;this.checkAllFieldsValid();
  }
  onReservoirLevel() {
    this.techcheckCentralPump.sealResLevel = this.form.value.reservoirLevelData;this.checkAllFieldsValid();
  }
  onWearRing() {
    this.techcheckCentralPump.wearRing = this.form.value.wearRingData;this.checkAllFieldsValid();
  }
  onBearings() {
    this.techcheckCentralPump.bearings = this.form.value.bearingData;this.checkAllFieldsValid();
  }
  onGasketsSeals() {
    this.techcheckCentralPump.gaskets = this.form.value.gasketsSealsData;this.checkAllFieldsValid();
  }
  onBallValue() {
    this.techcheckCentralPump.centrifugalBallValve = this.form.value.ballValueData;this.checkAllFieldsValid();
  }

  setData(data) {
    this.techcheckCentralPump = this.service.techCheckService.centrifugalPump;
    this.techcheckCentralPump.bearings=data.bearings;
    this.form.setValue({
      txtWRC:!this.techcheckCentralPump.wearRingClearance ?data.centrifugalPump.wearRingClearance: this.techcheckCentralPump.wearRingClearance,
      txtWRGB:!this.techcheckCentralPump.wearRingGapBefore ?data.centrifugalPump.wearRingGapBefore: this.techcheckCentralPump.wearRingGapBefore,
      txtWRGA:!this.techcheckCentralPump.wearRingGapAfter ?data.centrifugalPump.wearRingGapAfter: this.techcheckCentralPump.wearRingGapAfter,
      footMountsData:!this.techcheckCentralPump.footMounts ?data.centrifugalPump.footMounts: this.techcheckCentralPump.footMounts,
      impellerData:!this.techcheckCentralPump.impeller ?data.centrifugalPump.impeller: this.techcheckCentralPump.impeller,
      impellerScrewCapData:!this.techcheckCentralPump.screwCap ?data.centrifugalPump.screwCap: this.techcheckCentralPump.screwCap,
      glandLipSealData:!this.techcheckCentralPump.lipSeal ?data.centrifugalPump.lipSeal: this.techcheckCentralPump.lipSeal,
      sealReservoirData:!this.techcheckCentralPump.sealResLevel ?data.centrifugalPump.sealResLevel: this.techcheckCentralPump.sealResLevel,
      reservoirLevelData:!this.techcheckCentralPump.sealReservoir ?data.centrifugalPump.sealReservoir: this.techcheckCentralPump.sealReservoir,
      wearRingData:!this.techcheckCentralPump.wearRing ?data.centrifugalPump.wearRing: this.techcheckCentralPump.wearRing,
      bearingData:!this.techcheckCentralPump.bearings ?data.bearings??'': this.techcheckCentralPump.bearings,
      gasketsSealsData:!this.techcheckCentralPump.gaskets ?data.centrifugalPump.gaskets: this.techcheckCentralPump.gaskets,
      ballValueData:!this.techcheckCentralPump.centrifugalBallValve ?data.centrifugalPump.centrifugalBallValve: this.techcheckCentralPump.centrifugalBallValve,
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
    data.centrifugalPump.sealResLevel = this.form.value.sealReservoirData;
    data.centrifugalPump.sealReservoir = this.form.value.reservoirLevelData;
    data.centrifugalPump.wearRing = this.form.value.wearRingData;
    data.centrifugalPump.bearings = this.form.value.bearingData;
    this.service.techCheckService.centrifugalPump.bearings = this.form.value.bearingData;
    data.centrifugalPump.gaskets = this.form.value.gasketsSealsData;
    data.centrifugalPump.centrifugalBallValve = this.form.value.ballValueData;
    this.service.techCheckService.centrifugalPump = data.centrifugalPump;
    this.techCheckSave.emit(data);
  }
  changeMarkAll(event) {
    this.techcheckCentralPump = this.service.techCheckService.centrifugalPump;
    if (event == true) {
      this.form.controls['footMountsData'].setValue('N/A');
      this.form.controls['impellerScrewCapData'].setValue('N/A');
      this.form.controls['glandLipSealData'].setValue('N/A');
      this.form.controls['impellerData'].setValue('N/A');
      this.form.controls['sealReservoirData'].setValue('N/A');
      this.form.controls['reservoirLevelData'].setValue('N/A');
      this.form.controls['wearRingData'].setValue('N/A');
      this.form.controls['bearingData'].setValue('N/A');
      this.form.controls['gasketsSealsData'].setValue('N/A');
      this.form.controls['ballValueData'].setValue('N/A');
       
      this.techcheckCentralPump.footMounts = 'N/A';
      this.techcheckCentralPump.impeller = 'N/A';
      this.techcheckCentralPump.screwCap = 'N/A';
      this.techcheckCentralPump.lipSeal = 'N/A';
      this.techcheckCentralPump.sealResLevel = 'N/A';
      this.techcheckCentralPump.sealReservoir = 'N/A';
      this.techcheckCentralPump.wearRing = 'N/A';
      this.techcheckCentralPump.bearings = 'N/A';
      this.techcheckCentralPump.gaskets = 'N/A';
      this.techcheckCentralPump.centrifugalBallValve = 'N/A';
      
    } else {
      this.form.controls['footMountsData'].setValue('');
      this.form.controls['impellerScrewCapData'].setValue('');
      this.form.controls['glandLipSealData'].setValue('');
      this.form.controls['impellerData'].setValue('');
      this.form.controls['sealReservoirData'].setValue('');
      this.form.controls['reservoirLevelData'].setValue('');
      this.form.controls['wearRingData'].setValue('');
      this.form.controls['bearingData'].setValue('');
      this.form.controls['gasketsSealsData'].setValue('');
      this.form.controls['ballValueData'].setValue('');
       
      this.techcheckCentralPump.footMounts = '';
      this.techcheckCentralPump.impeller = '';
      this.techcheckCentralPump.screwCap = '';
      this.techcheckCentralPump.lipSeal = '';
      this.techcheckCentralPump.sealResLevel = '';
      this.techcheckCentralPump.sealReservoir = '';
      this.techcheckCentralPump.wearRing = '';
      this.techcheckCentralPump.bearings = '';
      this.techcheckCentralPump.gaskets = '';
      this.techcheckCentralPump.centrifugalBallValve = '';
    }
    this.checkAllFields.emit(event);
  }
  
  checkAllFieldsValid(){
    if (this.form.valid) {
      this.checkAllFields.emit(true);
    }else{this.checkAllFields.emit(false);}
  }

  
}
