import { Component,EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { thumbnailsDownIcon } from '@progress/kendo-svg-icons';
import { ErrorHandlerService } from 'src/app/core/services';
import { AIRFILTERCONDITION_List, COMPRESSORBELT_List, COMPRESSOROILCONDITION_List, COMPRESSOROILLEVEL_List, POPOFFVALVE_List, PULLEY_List, VENTURIHOSES_List, VENTURI_Rings_List } from '../../../../../../../data/serviceorderpage-data';
import { ServiceOrderService } from '../../../service-order/service-order.service';
import { compressorModel, TechCheckModel } from '../techCheck.model';


@Component({
  selector: 'app-compressor-techcheck',
  templateUrl: './compressor-techcheck.component.html',
  styleUrls: ['./compressor-techcheck.component.scss'],
})
export class CompressorTechCheckComponent implements OnInit {
  @Output() techCheckSave: EventEmitter<any> = new EventEmitter<any>();
  @Output() checkAllFields: EventEmitter<any> = new EventEmitter<any>();

  form: FormGroup;
  displayHoseFitting: boolean = false;
  displayVenturiOriginsBtn: boolean = false;
  displayPulleyBtn: boolean = false;
  displayAirFilterBtn: boolean = false;
  displayOilLevelBtn: boolean = false;
  displayCompressorOilBtn: boolean = false;
  displayPopOffValueBtn: boolean = false;
  displayCompressorBeltBtn: boolean = false;
  displaySupervisorApproval: boolean = false;
  hoseFittingList = VENTURIHOSES_List;
  venturiOringsList = VENTURI_Rings_List;
  pulleyList = PULLEY_List;
  airFilterList = AIRFILTERCONDITION_List;
  oilLevelList = COMPRESSOROILLEVEL_List;
  compressorOilList = COMPRESSOROILCONDITION_List;
  popOffValueList = POPOFFVALVE_List;
  compressorBeltList = COMPRESSORBELT_List;
  techcheckComp: any;
  markAll: boolean = false;
  constructor(private formBuilder: FormBuilder,public service: ServiceOrderService,public errorHandler: ErrorHandlerService,) { }

  ngOnInit() {
    this.techcheckComp = this.service.techCheckService.compressor;
    this.initForm();
  }

  initForm(): void {
    this.form = this.formBuilder.group({
      txtVOSB: [],
      txtVOSA: [],
      txtBPR: [],
      hoseFittingData:['', Validators.required],
      venturiOringsData: ['', Validators.required],
      pulleyData: ['', Validators.required],
      airFilterData: ['', Validators.required],
      oilLevelData: ['', Validators.required],
      compressorOilData:['', Validators.required],
      popOffValueData:['', Validators.required],
      compressorBeltData:['', Validators.required],
    });
  }
  get f() {
    return this.form.controls;
  }
  onVOSB(){this.techcheckComp.venturiSizeBefore = this.form.value.txtVOSB;}
  onVOSA(){this.techcheckComp.venturiSizeAfter = this.form.value.txtVOSA;}
  onBPR(){this.techcheckComp.backPressureReading = this.form.value.txtBPR;}
  onHoseFitting() {
    this.techcheckComp.venturiHose = this.form.value.hoseFittingData;this.checkAllFieldsValid();
  }
  onVenturiOrings() {
    this.techcheckComp.venturiViton = this.form.value.venturiOringsData;this.checkAllFieldsValid();
  }
  onPulley() {
    this.techcheckComp.pulley = this.form.value.pulleyData;this.checkAllFieldsValid();
  }
  onAirFilter() {
    this.techcheckComp.airFilterCondition = this.form.value.airFilterData;this.checkAllFieldsValid();
  }
  onOilLevel() {
    this.techcheckComp.compOilLevel = this.form.value.oilLevelData;this.checkAllFieldsValid();
  }
  onCompressorOil() {
    this.techcheckComp.compOilCond = this.form.value.compressorOilData;this.checkAllFieldsValid();
  }
  onPopOffValue() {
    this.techcheckComp.popOffValve = this.form.value.popOffValueData;this.checkAllFieldsValid();
  }
  onCompressorBelt() {
    this.techcheckComp.compAirFilter = this.form.value.compressorBeltData;this.checkAllFieldsValid();
  }
  // onCompreessorBelt() {
  //   this.techcheckComp.coolantReservoir = this.form.value.coolantLevel;
  //   this.displayCompressorBeltBtn = !this.displayCompressorBeltBtn;
  // }
  setData(compressor) {
    this.techcheckComp = this.service.techCheckService.compressor;
    this.form.setValue({
      txtVOSB:!this.techcheckComp.venturiSizeBefore ?compressor.venturiSizeBefore: this.techcheckComp.venturiSizeBefore,
      txtVOSA:!this.techcheckComp.venturiSizeAfter ?compressor.venturiSizeAfter: this.techcheckComp.venturiSizeAfter,
      txtBPR:!this.techcheckComp.backPressureReading ?compressor.backPressureReading: this.techcheckComp.backPressureReading,
      hoseFittingData:!this.techcheckComp.venturiHose ?compressor.venturiHose: this.techcheckComp.venturiHose,
       venturiOringsData:!this.techcheckComp.venturiViton ?compressor.venturiViton: this.techcheckComp.venturiViton,
      pulleyData:!this.techcheckComp.pulley ?compressor.pulley: this.techcheckComp.pulley,
      airFilterData:!this.techcheckComp.airFilterCondition ?compressor.airFilterCondition: this.techcheckComp.airFilterCondition,
      oilLevelData:!this.techcheckComp.compOilCond ?compressor.compOilCond: this.techcheckComp.compOilCond,
      compressorOilData:!this.techcheckComp.compOilLevel ?compressor.compOilLevel: this.techcheckComp.compOilLevel,
      popOffValueData:!this.techcheckComp.popOffValve ?compressor.popOffValve: this.techcheckComp.popOffValve,
      compressorBeltData:!this.techcheckComp.compAirFilter ?compressor.compAirFilter : this.techcheckComp.compAirFilter,
    });
  }
  onSave() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return false;
    }
    const data = new TechCheckModel();
    data.compressor = new compressorModel();
    data.compressor.venturiSizeBefore = this.form.value.txtVOSB;
    data.compressor.venturiSizeAfter = this.form.value.txtVOSA;
    data.compressor.backPressureReading = this.form.value.txtBPR;
    data.compressor.venturiHose = this.form.value.hoseFittingData;
    data.compressor.venturiViton = this.form.value.venturiOringsData;
    data.compressor.pulley = this.form.value.pulleyData;
    data.compressor.airFilterCondition = this.form.value.airFilterData;
    data.compressor.compOilCond = this.form.value.oilLevelData;
    data.compressor.compOilLevel = this.form.value.compressorOilData;
    data.compressor.popOffValve = this.form.value.popOffValueData;
    data.compressor.compAirFilter = this.form.value.compressorBeltData;
    this.service.techCheckService.compressor = data.compressor;
    this.techCheckSave.emit(data);
  }
  private onError(error: any, customMessage?: string) {
    this.errorHandler.handleError(error, "Tech Check", customMessage);
  }
  checkAllFieldsValid(){
    if (this.form.valid) {
      this.checkAllFields.emit(true);
    }else{this.checkAllFields.emit(false);}
  }
  changeMarkAll(event) {
    this.techcheckComp = this.service.techCheckService.compressor;
    if (event == true) {
      this.form.controls['hoseFittingData'].setValue('N/A');
      this.form.controls['venturiOringsData'].setValue('N/A');
      this.form.controls['pulleyData'].setValue('N/A');
      this.form.controls['airFilterData'].setValue('N/A');
      this.form.controls['oilLevelData'].setValue('N/A');
      this.form.controls['compressorOilData'].setValue('N/A');
      this.form.controls['popOffValueData'].setValue('N/A');
      this.form.controls['compressorBeltData'].setValue('N/A');
      this.techcheckComp.venturiHose = 'N/A';
      this.techcheckComp.venturiViton = 'N/A';
      this.techcheckComp.pulley = 'N/A';
      this.techcheckComp.airFilterCondition = 'N/A';
      this.techcheckComp.compOilCond = 'N/A';
      this.techcheckComp.compOilLevel = 'N/A';
      this.techcheckComp.popOffValve = 'N/A';
      this.techcheckComp.compAirFilter = 'N/A';
    } else {
      this.form.controls['hoseFittingData'].setValue('');
      this.form.controls['venturiOringsData'].setValue('');
      this.form.controls['pulleyData'].setValue('');
      this.form.controls['airFilterData'].setValue('');
      this.form.controls['oilLevelData'].setValue('');
      this.form.controls['compressorOilData'].setValue('');
      this.form.controls['popOffValueData'].setValue('');
      this.form.controls['compressorBeltData'].setValue('');
      this.techcheckComp.venturiHose = '';
      this.techcheckComp.venturiViton = '';
      this.techcheckComp.pulley = '';
      this.techcheckComp.airFilterCondition = '';
      this.techcheckComp.compOilCond = '';
      this.techcheckComp.compOilLevel = '';
      this.techcheckComp.popOffValve = '';
      this.techcheckComp.compAirFilter = '';
    }
    this.checkAllFields.emit(event);
  }
}
