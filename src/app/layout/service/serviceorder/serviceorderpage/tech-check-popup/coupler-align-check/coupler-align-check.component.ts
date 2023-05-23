import { Component,EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ErrorHandlerService } from 'src/app/core/services';
import { UtilityService } from 'src/app/core/services/utility.service';
import {
  SETSCREWS_List,
  ELEMENTS_List,
  HUBFLANGES_List,
  FLAPPERVALVE_List,
  FLAPPERWEIGHT_List,
  SEALPLATE_List,
} from 'src/data/serviceorderpage-data';
import { ServiceOrderService } from '../../../service-order/service-order.service';
import {  couplerAlignCheckValveModel, TechCheckModel } from '../techCheck.model';

@Component({
  selector: 'app-coupler-align-check',
  templateUrl: './coupler-align-check.component.html',
  styleUrls: ['./coupler-align-check.component.scss'],
})
export class CouplerAlignCheckComponent implements OnInit {
  @Output() techCheckSave: EventEmitter<any> = new EventEmitter<any>();
  @Output() checkAllFields: EventEmitter<any> = new EventEmitter<any>();

  form: FormGroup;
  displayBotsBtn: boolean = false;
  displayElectricalConditionBtn: boolean = false;
  displayHubs: boolean = false;
  displayFlapperValve: boolean = false;
  displayFlapperWight: boolean = false;
  displaysealPlate: boolean = false;
  displaySupervisorApproval: boolean = false;
  botsList = SETSCREWS_List;
  electricalConditionList = ELEMENTS_List;
  hubsList = HUBFLANGES_List;
  flapperValvesList = FLAPPERVALVE_List;
  flapperWeightList = FLAPPERWEIGHT_List;
  sealPlatesList = SEALPLATE_List;
  techcheckCooling: any;
  markAll: boolean = false;
  constructor(private formBuilder: FormBuilder, public service: ServiceOrderService,
    private utils: UtilityService, public errorHandler: ErrorHandlerService) {}

  ngOnInit(): void {
    this.techcheckCooling = this.service.techCheckService.couplerAlignCheckValve;
    this.initForm();
  }

  initForm(): void {
    this.form = this.formBuilder.group({
      alignmentBefore:[],
      alignmentAfter:[],
      bolts: ['', Validators.required],
      elements: ['', Validators.required],
      flanges: ['', Validators.required],
      flapperValve: ['', Validators.required],
      flapperWeight: ['', Validators.required],
      sealPlate: ['', Validators.required],
      pressureGauge:[]
    });
  }
  get f() {
    return this.form.controls;
  }
  onBots() {
    this.techcheckCooling.bolts = this.form.value.bolts;this.checkAllFieldsValid();
  }
  onElecticalCondition() {
    this.techcheckCooling.elements = this.form.value.elements;this.checkAllFieldsValid();
  }
  onHubs() {
    this.techcheckCooling.flanges = this.form.value.flanges;this.checkAllFieldsValid();
  }

  onFlapperValve() {
    this.techcheckCooling.flapperValve = this.form.value.flapperValve;this.checkAllFieldsValid();
  }

  onFlapperWeight() {
    this.techcheckCooling.flapperWeight = this.form.value.flapperWeight;this.checkAllFieldsValid();
  }

  onSealPlate() {
    this.techcheckCooling.sealPlate = this.form.value.sealPlate;this.checkAllFieldsValid();
  }
  setData(compressor) {
    this.form.setValue({
      alignmentBefore:'',
      alignmentAfter:'',
      bolts:!this.techcheckCooling.bolts ?compressor.bolts: this.techcheckCooling.bolts,
      elements:!this.techcheckCooling.elements ?compressor.elements: this.techcheckCooling.elements,
      flanges:!this.techcheckCooling.flanges?compressor.flanges: this.techcheckCooling.flanges,
      flapperValve:!this.techcheckCooling.flapperValve?compressor.flapperValve: this.techcheckCooling.flapperValve,
      flapperWeight:!this.techcheckCooling.flapperWeight?compressor.flapperWeight: this.techcheckCooling.flapperWeight,
      sealPlate:!this.techcheckCooling.sealPlate?compressor.sealPlate: this.techcheckCooling.sealPlate,
      pressureGauge:!this.techcheckCooling.pressureGauge?compressor.pressureGauge: this.techcheckCooling.pressureGauge,
    });
  }
  onSave() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return false;
    }
    const data = new TechCheckModel();
    data.couplerAlignCheckValve = new couplerAlignCheckValveModel();
    data.couplerAlignCheckValve.alignmentBefore = this.form.value.alignmentBefore;
    data.couplerAlignCheckValve.alignmentAfter = this.form.value.alignmentAfter;
    data.couplerAlignCheckValve.bolts = this.form.value.bolts;
    data.couplerAlignCheckValve.elements = this.form.value.elements;
    data.couplerAlignCheckValve.flanges = this.form.value.flanges;
    data.couplerAlignCheckValve.flapperValve = this.form.value.flapperValve;
    data.couplerAlignCheckValve.flapperWeight = this.form.value.flapperWeight;
    data.couplerAlignCheckValve.sealPlate = this.form.value.sealPlate;
    data.couplerAlignCheckValve.pressureGauge = this.form.value.pressureGauge; 
    this.service.techCheckService.couplerAlignCheckValve = data.couplerAlignCheckValve;
    this.techCheckSave.emit(data);
  }
  checkAllFieldsValid() {
    if (this.form.valid) {
      this.checkAllFields.emit(true);
    } else { this.checkAllFields.emit(false); }
  }
  changeMarkAll(event) {
    this.techcheckCooling = this.service.techCheckService.couplerAlignCheckValve;
    if (event == true) {
      this.form.controls['bolts'].setValue('N/A');
      this.form.controls['elements'].setValue('N/A');
      this.form.controls['flanges'].setValue('N/A');
      this.form.controls['flapperValve'].setValue('N/A');
      this.form.controls['flapperWeight'].setValue('N/A');
      this.form.controls['sealPlate'].setValue('N/A');
      this.form.controls['pressureGauge'].setValue('N/A'); 
      this.techcheckCooling.bolts = 'N/A';
      this.techcheckCooling.elements = 'N/A';
      this.techcheckCooling.flanges = 'N/A';
      this.techcheckCooling.flapperValve = 'N/A';
      this.techcheckCooling.flapperWeight = 'N/A';
      this.techcheckCooling.sealPlate = 'N/A';
      this.techcheckCooling.pressureGauge = 'N/A'; 
    } else {
      this.form.controls['bolts'].setValue('');
      this.form.controls['elements'].setValue('');
      this.form.controls['flanges'].setValue('');
      this.form.controls['flapperValve'].setValue('');
      this.form.controls['flapperWeight'].setValue('');
      this.form.controls['sealPlate'].setValue('');
      this.form.controls['pressureGauge'].setValue(''); 
      this.techcheckCooling.bolts = '';
      this.techcheckCooling.elements = '';
      this.techcheckCooling.flanges = '';
      this.techcheckCooling.flapperValve = '';
      this.techcheckCooling.flapperWeight = '';
      this.techcheckCooling.sealPlate = '';
    }
    this.checkAllFields.emit(event);
  }
}
