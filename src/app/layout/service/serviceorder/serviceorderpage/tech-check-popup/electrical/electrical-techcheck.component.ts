import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ErrorHandlerService } from 'src/app/core/services';
import { UtilityService } from 'src/app/core/services/utility.service';
import {
  ALTERNATOR_List,
  BREAKERS_FUSES_List,
  CONNECTIONS_List,
  CONTROLPANEL_LIST,
  STARTERCONNECTIONS_List,
  WIRINGCONDITION_List,
} from '../../../../../../../data/serviceorderpage-data';
import { ServiceOrderService } from '../../../service-order/service-order.service';
import { electricalModel, TechCheckModel } from '../techCheck.model';
@Component({
  selector: 'app-electrical-techcheck',
  templateUrl: './electrical-techcheck.component.html',
  styleUrls: ['./electrical-techcheck.component.scss'],
})
export class ElectrickTechCheckComponent implements OnInit {
  @Output() techCheckSave: EventEmitter<any> = new EventEmitter<any>();
  @Output() checkAllFields: EventEmitter<any> = new EventEmitter<any>();
  markAll: boolean = false;
  form: FormGroup;
  displayWiringBtn: boolean = false;
  displayElectricalConditionBtn: boolean = false;
  displayStartConnectionBtn: boolean = false;
  // displayRelayBtn: boolean = true;
  displayControlPanelbtn: boolean = false;
  displayAlternatorBtn: boolean = false;
  displayFusesBtn: boolean = false;
  displaySupervisorApproval: boolean = false;
  wiringList = WIRINGCONDITION_List;
  electricalConditionList = CONNECTIONS_List;
  startConnectionList = STARTERCONNECTIONS_List;
  // relayList = [];
  controlPanelList = CONTROLPANEL_LIST;
  alternatorList = ALTERNATOR_List;
  fusesList = BREAKERS_FUSES_List;
  techcheckElectric: any;
  isGenerator: boolean = false;
  isControlPanel: boolean = false;
  constructor(private formBuilder: FormBuilder, public service: ServiceOrderService,
    private utils: UtilityService, public errorHandler: ErrorHandlerService) { }

  ngOnInit() {

    this.initForm();
    if (this.service.blGen == true) {
      this.isGenerator = true;
      this.isControlPanel = false;
      this.form.controls['relayLevel'].clearValidators();
      this.form.controls['controlPanelShutdown'].setValidators([Validators.required]);
    } else {
      this.isControlPanel = true; this.isGenerator = false;
      this.form.controls['controlPanelShutdown'].clearValidators();
      this.form.controls['relayLevel'].setValidators([Validators.required]);
    }
    this.techcheckElectric = this.service.techCheckService.electrical;
  }

  initForm(): void {
    this.form = this.formBuilder.group({
      alternatorLoadTest: ['', Validators.required],
      starterLoadTest: ['', Validators.required],
      wiringLevel: ['', Validators.required],
      electricalConditionLevel: ['', Validators.required],
      startConnectionLevel: ['', Validators.required],
      relayLevel: [''],
      alternatorLevel: ['', Validators.required],
      fusesLevel: ['', Validators.required],
      controlPanelShutdown: [''],
    });
  }
  get f() {
    return this.form.controls;
  }
  onalternatorLoadTest() {
    this.techcheckElectric.alternatorTest = this.form.value.alternatorLoadTest;this.checkAllFieldsValid();
  }
  onstarterLoadTest() {
    this.techcheckElectric.starterLoadTest = this.form.value.starterLoadTest;this.checkAllFieldsValid();
  }
  onWiringLevel() {
    this.techcheckElectric.wireCondition = this.form.value.wiringLevel;
    this.checkAllFieldsValid();
  }
  onElecticalCondition() {
    this.techcheckElectric.connections = this.form.value.electricalConditionLevel;
    this.checkAllFieldsValid();
  }
  onStartConnections() {
    this.techcheckElectric.starterConnections = this.form.value.startConnectionLevel;
    this.checkAllFieldsValid();
  }
  onRelays() {
    this.techcheckElectric.relays = this.form.value.relayLevel;
  }
  onControlPanel() {
    this.techcheckElectric.controlPanelShutdown = this.form.value.controlPanelShutdown;
    this.checkAllFieldsValid();
  }
  onAlternaor() {
    this.techcheckElectric.alternator = this.form.value.alternatorLevel;
    this.checkAllFieldsValid();
  }
  onFuses() {
    this.techcheckElectric.fuse = this.form.value.fusesLevel;
    this.checkAllFieldsValid();
  }
  checkAllFieldsValid() {
    if (this.form.valid) {
      this.checkAllFields.emit(true);
    } else { this.checkAllFields.emit(false); }
  }
  setData(electrical) {
    this.techcheckElectric = this.service.techCheckService.electrical;
    this.techcheckElectric.relays = electrical.relays;
    this.form.setValue({
      alternatorLoadTest: !this.techcheckElectric.alternatorTest ? electrical.alternatorTest : this.techcheckElectric.alternatorTest,
      starterLoadTest: !this.techcheckElectric.starterLoadTest ? electrical.starterLoadTest : this.techcheckElectric.starterLoadTest,
      wiringLevel: !this.techcheckElectric.wireCondition ? electrical.wireCondition : this.techcheckElectric.wireCondition,
      electricalConditionLevel: !this.techcheckElectric.connections ? electrical.connections : this.techcheckElectric.connections,
      startConnectionLevel: !this.techcheckElectric.starterConnections ? electrical.starterConnections : this.techcheckElectric.starterConnections,
      relayLevel: !this.techcheckElectric.relays ? electrical.relays : this.techcheckElectric.relays,
      alternatorLevel: !this.techcheckElectric.alternator ? electrical.alternator : this.techcheckElectric.alternator,
      fusesLevel: !this.techcheckElectric.fuse ? electrical.fuse : this.techcheckElectric.fuse,
      controlPanelShutdown: !this.techcheckElectric.controlPanelShutdown ? electrical.controlPanelShutdown : this.techcheckElectric.controlPanelShutdown,
    });
  }
  onSave() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return false;
    }
    const data = new TechCheckModel();
    data.electrical = new electricalModel();
    data.electrical.alternatorTest = this.form.value.alternatorLoadTest;
    data.electrical.starterLoadTest = this.form.value.starterLoadTest;
    data.electrical.wireCondition = this.form.value.wiringLevel;
    data.electrical.connections = this.form.value.electricalConditionLevel;
    data.electrical.starterConnections = this.form.value.startConnectionLevel;
    data.electrical.relays = this.form.value.relayLevel;
    this.service.techCheckService.electrical.relays = this.form.value.relayLevel;
    data.electrical.alternator = this.form.value.alternatorLevel;
    data.electrical.fuse = this.form.value.fusesLevel;
    data.electrical.controlPanelShutdown = this.form.value.controlPanelShutdown;
    this.service.techCheckService.electrical = data.electrical;
    this.techCheckSave.emit(data);
  }
  private onError(error: any, customMessage?: string) {
    this.errorHandler.handleError(error, "Tech Check", customMessage);
  }
  changeMarkAll(event) {
    this.techcheckElectric = this.service.techCheckService.electrical;
    if (event == true) {
      this.form.controls['wiringLevel'].setValue('N/A');
      this.form.controls['electricalConditionLevel'].setValue('N/A');
      this.form.controls['startConnectionLevel'].setValue('N/A');
      this.form.controls['relayLevel'].setValue('N/A');
      this.form.controls['alternatorLevel'].setValue('N/A');
      this.form.controls['fusesLevel'].setValue('N/A');
      this.form.controls['controlPanelShutdown'].setValue('N/A');
      this.techcheckElectric.wireCondition = 'N/A';
      this.techcheckElectric.connections = 'N/A';
      this.techcheckElectric.starterConnections = 'N/A';
      this.techcheckElectric.controlPanelShutdown = 'N/A';
      this.techcheckElectric.alternator = 'N/A';
      this.techcheckElectric.fuse = 'N/A';

    } else {
      this.form.controls['wiringLevel'].setValue('');
      this.form.controls['electricalConditionLevel'].setValue('');
      this.form.controls['startConnectionLevel'].setValue('');
      this.form.controls['relayLevel'].setValue('');
      this.form.controls['alternatorLevel'].setValue('');
      this.form.controls['fusesLevel'].setValue('');
      this.form.controls['controlPanelShutdown'].setValue('');
      this.form.controls['alternatorLoadTest'].setValue('');
      this.form.controls['starterLoadTest'].setValue('');

      this.techcheckElectric.wireCondition = '';
      this.techcheckElectric.connections = '';
      this.techcheckElectric.starterConnections = '';
      this.techcheckElectric.controlPanelShutdown = '';
      this.techcheckElectric.alternator = '';
      this.techcheckElectric.fuse = '';

    }
    this.checkAllFieldsValid();
  }
}
