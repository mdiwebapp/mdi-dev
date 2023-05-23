import { Component,EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SETSCREWS_List, FLAPPERVALVE_List, ELEMENTS_List, VACUUMGAUGE_List } from '../../../../../../../data/serviceorderpage-data';
import { ServiceOrderService } from '../../../service-order/service-order.service';
import {  couplerAlignCheckValveModel, TechCheckModel } from '../techCheck.model';

@Component({
  selector: 'app-coupler-techcheck',
  templateUrl: './coupler-techcheck.component.html',
  styleUrls: ['./coupler-techcheck.component.scss'],
})
export class CouplerTechCheckComponent implements OnInit {
  @Output() techCheckSave: EventEmitter<any> = new EventEmitter<any>();
  @Output() checkAllFields: EventEmitter<any> = new EventEmitter<any>();

  form: FormGroup;
  displayBotsBtn: boolean = false;
  displayElectricalConditionBtn: boolean = false;
  displayFlangesBtn: boolean = false;
  displayFlapperBtn: boolean = false;
  displayPressureGuageBtn: boolean = false;
  displaySupervisorApproval: boolean = false;
  botsList = SETSCREWS_List;
  electricalConditionList=ELEMENTS_List;
  flangsList = FLAPPERVALVE_List;
  flapperList=FLAPPERVALVE_List;
  pressureGuageList=VACUUMGAUGE_List;
  techcheckCoupler: any;
  markAll: boolean = false;
  constructor(private formBuilder: FormBuilder,public service: ServiceOrderService) { }

  ngOnInit() {
    this.techcheckCoupler = this.service.techCheckService.couplerAlignCheckValve;
    this.initForm();
  }

  initForm(): void {
    this.form = this.formBuilder.group({
      alignmentBefore:[],
      alignmentAfter:[],
      bolts:  ['', Validators.required],
      elements:  ['', Validators.required],
      flanges:  ['', Validators.required],
      flapperValve:  ['', Validators.required],
      flapperWeight:  [''],
      sealPlate:  [''],
      pressureGauge: ['', Validators.required],
    });
  }
  get f() {
    return this.form.controls;
  }
  onalignmentBefore(){this.techcheckCoupler.alignmentBefore = this.form.value.alignmentBefore;}
  onalignmentAfter(){this.techcheckCoupler.alignmentAfter = this.form.value.alignmentAfter;}
  onBots() {
    this.techcheckCoupler.bolts = this.form.value.bolts; this.checkAllFieldsValid();
  }
  onElecticalCondition() {
    this.techcheckCoupler.elements = this.form.value.elements;this.checkAllFieldsValid();
  }
  onFlanges() {
    this.techcheckCoupler.flanges = this.form.value.flanges;this.checkAllFieldsValid();
  }
  onFlapper() {
    this.techcheckCoupler.flapperValve = this.form.value.flapperValve;this.checkAllFieldsValid();
  }
  onPressureGuage() {
    this.techcheckCoupler.pressureGauge = this.form.value.pressureGauge;this.checkAllFieldsValid();
  }
  setData(compressor) {
    this.techcheckCoupler = this.service.techCheckService.couplerAlignCheckValve;
    this.form.setValue({
      alignmentBefore:!this.techcheckCoupler.alignmentBefore ?compressor.alignmentBefore: this.techcheckCoupler.alignmentBefore,
      alignmentAfter:!this.techcheckCoupler.alignmentAfter ?compressor.alignmentAfter: this.techcheckCoupler.alignmentAfter,
      bolts:!this.techcheckCoupler.bolts ?compressor.bolts: this.techcheckCoupler.bolts,
      elements:!this.techcheckCoupler.elements ?compressor.elements: this.techcheckCoupler.elements,
      flanges:!this.techcheckCoupler.flanges ?compressor.flanges: this.techcheckCoupler.flanges,
      flapperValve:!this.techcheckCoupler.flapperValve ?compressor.flapperValve: this.techcheckCoupler.flapperValve,
      flapperWeight:!this.techcheckCoupler.flapperWeight ?compressor.flapperWeight: this.techcheckCoupler.flapperWeight,
      sealPlate:!this.techcheckCoupler.sealPlate ?compressor.sealPlate: this.techcheckCoupler.sealPlate,
      pressureGauge:!this.techcheckCoupler.pressureGauge ?compressor.pressureGauge: this.techcheckCoupler.pressureGauge,
    });
  }
  onSave() {if (this.form.invalid) {
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
  checkAllFieldsValid(){
    if (this.form.valid) {
      this.checkAllFields.emit(true);
    }else{this.checkAllFields.emit(false);}
  }
  changeMarkAll(event) {
    this.techcheckCoupler = this.service.techCheckService.couplerAlignCheckValve;
    if (event == true) {
      this.form.controls['bolts'].setValue('N/A');
      this.form.controls['elements'].setValue('N/A');
      this.form.controls['flanges'].setValue('N/A');
      this.form.controls['flapperValve'].setValue('N/A');
      this.form.controls['flapperWeight'].setValue('N/A');
      this.form.controls['sealPlate'].setValue('N/A');
      this.form.controls['pressureGauge'].setValue('N/A'); 
      this.techcheckCoupler.bolts = 'N/A';
      this.techcheckCoupler.elements = 'N/A';
      this.techcheckCoupler.flanges = 'N/A';
      this.techcheckCoupler.flapperValve = 'N/A';
      this.techcheckCoupler.flapperWeight = 'N/A';
      this.techcheckCoupler.sealPlate = 'N/A';
      this.techcheckCoupler.pressureGauge = 'N/A'; 
    } else {
      this.form.controls['bolts'].setValue('');
      this.form.controls['elements'].setValue('');
      this.form.controls['flanges'].setValue('');
      this.form.controls['flapperValve'].setValue('');
      this.form.controls['flapperWeight'].setValue('');
      this.form.controls['sealPlate'].setValue('');
      this.form.controls['pressureGauge'].setValue(''); 
      this.techcheckCoupler.bolts = '';
      this.techcheckCoupler.elements = '';
      this.techcheckCoupler.flanges = '';
      this.techcheckCoupler.flapperValve = '';
      this.techcheckCoupler.flapperWeight = '';
      this.techcheckCoupler.sealPlate = '';
    }
    this.checkAllFields.emit(event);
  }
}
