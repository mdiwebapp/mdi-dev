import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ErrorHandlerService } from 'src/app/core/services';
import { UtilityService } from 'src/app/core/services/utility.service';
import {
  BACKFLOWVALVE_List,
  FLOAT_BALL_LIST,
  GASKETS_LIST,
  HOSES_LIST,
  OIL_CONDITION_LIST,
  OIL_COOLER_LIST,
  OIL_LEVEL_LIST,
  OIL_TANK_LIST,
  PEELAR_COOLER_LIST,
  PEER_VALVE_LIST,
  SMOKE_FILTER_LIST,
  TANK_LIST,
} from 'src/data/serviceorderpage-data';
import { ServiceOrderService } from '../../../service-order/service-order.service';
import { airSeperationReclaimerTankModel, TechCheckModel } from '../techCheck.model';

@Component({
  selector: 'app-air-separation',
  templateUrl: './air-separation.component.html',
  styleUrls: ['./air-separation.component.scss'],
})
export class AirSeparationComponent implements OnInit {
  @Output() techCheckSave: EventEmitter<any> = new EventEmitter<any>();
  @Output() checkAllFields: EventEmitter<any> = new EventEmitter<any>();

  form: FormGroup;
  displayPeelarValve: boolean = false;
  displayFloatBall: boolean = false;
  displayBackFlowValve: boolean = false;
  displayHoses: boolean = false;
  displayPeerlarCooler: boolean = false;
  displayTank: boolean = false;
  displayOilLevel: boolean = false;
  displayOilCondition: boolean = false;
  displaySmokeFilter: boolean = false;
  displayOilTank: boolean = false;
  displayGasket: boolean = false;
  displayOilCooler: boolean = false;

  peelarValvesList: any = PEER_VALVE_LIST;
  floatBallsList: any = FLOAT_BALL_LIST;
  backFlowValvesList: any = BACKFLOWVALVE_List;
  hosessList: any = HOSES_LIST;
  peerlarCoolersList: any = PEELAR_COOLER_LIST;
  tanksList: any = TANK_LIST;
  oilLevelsList: any = OIL_LEVEL_LIST;
  oilConditionsList: any = OIL_CONDITION_LIST;
  smokeFiltersList: any = SMOKE_FILTER_LIST;
  oilTanksList: any = OIL_TANK_LIST;
  gasketsList: any = GASKETS_LIST;
  oilCoolersList: any = OIL_COOLER_LIST;
  techcheckCooling: any;
  markAll: boolean = false;
  constructor(private formBuilder: FormBuilder, public service: ServiceOrderService,
    private utils: UtilityService, public errorHandler: ErrorHandlerService) {}

  ngOnInit(): void {
    this.onInitForm();
    this.techcheckCooling = this.service.techCheckService.airSeperationReclaimerTank;
  }

  onInitForm() {
    this.form = this.formBuilder.group({
      peelarValve: ['', Validators.required],
      floatBall: ['', Validators.required],
      backFlowValve: ['', Validators.required],
      hoses: ['', Validators.required],
      peelarCooler: ['', Validators.required],
      tank: ['', Validators.required],
      oilLevel: ['', Validators.required],
      oilCondition: ['', Validators.required],
      smokeFilter: ['', Validators.required],
      oilTank: ['', Validators.required],
      gasket: ['', Validators.required],
      oilCooler: ['', Validators.required],
    });
  }
  get f() {
    return this.form.controls;
  }
  onHandleOperations(type) {
    switch (type) {
      case 'peelar_valve':
        this.techcheckCooling.peelerValve = this.form.value.peelarValve;this.checkAllFieldsValid();
        break;
      case 'float_ball':
        this.techcheckCooling.floatBall = this.form.value.floatBall;this.checkAllFieldsValid();
        break;
      case 'back_flow_valve': 
        this.techcheckCooling.backFlowValve = this.form.value.backFlowValve;this.checkAllFieldsValid();
        break;
      case 'hoses': 
        this.techcheckCooling.hosesConnections = this.form.value.hoses;this.checkAllFieldsValid();
        break;
      case 'peelar_cooler': 
        this.techcheckCooling.cooler = this.form.value.peelarCooler;this.checkAllFieldsValid();
        break;
      case 'tank':
        this.techcheckCooling.tank = this.form.value.tank;this.checkAllFieldsValid();
        break;
      case 'oil_level':
        this.techcheckCooling.oilLevel = this.form.value.oilLevel;this.checkAllFieldsValid();
        break;
      case 'oil_condition': 
        this.techcheckCooling.oilCondition = this.form.value.oilCondition;this.checkAllFieldsValid();
        break;
      case 'smoke_filter': 
        this.techcheckCooling.smokeFilter = this.form.value.smokeFilter;this.checkAllFieldsValid();
        break;
      case 'oil_tank':
        this.techcheckCooling.oilTank = this.form.value.oilTank;this.checkAllFieldsValid();
        break;
      case 'gasket': 
        this.techcheckCooling.gasketsHoses = this.form.value.gasket;this.checkAllFieldsValid();
        break;
      case 'oil_cooler': 
        this.techcheckCooling.oilCooler = this.form.value.oilCooler;this.checkAllFieldsValid();
        break;

      default:
        break;
    }
  }
  setData(fuelIol) {
    this.form.setValue({
      peelarValve: !this.techcheckCooling.peelerValve ? fuelIol.peelerValve : this.techcheckCooling.peelerValve,
      floatBall: !this.techcheckCooling.floatBall ? fuelIol.floatBall : this.techcheckCooling.floatBall,
      backFlowValve: !this.techcheckCooling.backFlowValve ? fuelIol.backFlowValve : this.techcheckCooling.backFlowValve,
      hoses: !this.techcheckCooling.hosesConnections ? fuelIol.hosesConnections : this.techcheckCooling.hosesConnections,
      peelarCooler: !this.techcheckCooling.cooler ? fuelIol.cooler : this.techcheckCooling.cooler,
      tank: !this.techcheckCooling.tank ? fuelIol.tank : this.techcheckCooling.tank,
      oilLevel: !this.techcheckCooling.oilLevel ? fuelIol.oilLevel : this.techcheckCooling.oilLevel,
      oilCondition: !this.techcheckCooling.oilCondition ? fuelIol.oilCondition : this.techcheckCooling.oilCondition,
      smokeFilter: !this.techcheckCooling.smokeFilter ? fuelIol.smokeFilter : this.techcheckCooling.smokeFilter,
      oilTank: !this.techcheckCooling.oilTank ? fuelIol.oilTank : this.techcheckCooling.oilTank,
      gasket: !this.techcheckCooling.gasketsHoses ? fuelIol.gasketsHoses : this.techcheckCooling.gasketsHoses,
      oilCooler: !this.techcheckCooling.oilCooler ? fuelIol.oilCooler : this.techcheckCooling.oilCooler,
    });    
  }
  onSave() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return false;
    }
    const data = new TechCheckModel();
    data.airSeperationReclaimerTank = new airSeperationReclaimerTankModel();
    data.airSeperationReclaimerTank.peelerValve = this.form.value.peelarValve;
    data.airSeperationReclaimerTank.floatBall = this.form.value.floatBall;
    data.airSeperationReclaimerTank.backFlowValve = this.form.value.backFlowValve;
    data.airSeperationReclaimerTank.hosesConnections = this.form.value.hoses;
    data.airSeperationReclaimerTank.cooler = this.form.value.peelarCooler;
    data.airSeperationReclaimerTank.tank = this.form.value.tank;
    data.airSeperationReclaimerTank.oilLevel = this.form.value.oilLevel;
    data.airSeperationReclaimerTank.oilCondition = this.form.value.oilCondition;
    data.airSeperationReclaimerTank.smokeFilter = this.form.value.smokeFilter;
    data.airSeperationReclaimerTank.oilTank = this.form.value.oilTank;
    data.airSeperationReclaimerTank.gasketsHoses = this.form.value.gasket;
    data.airSeperationReclaimerTank.oilCooler = this.form.value.oilCooler;
    this.service.techCheckService.airSeperationReclaimerTank = data.airSeperationReclaimerTank;
    this.techCheckSave.emit(data);
  }
  changeMarkAll(event) {
    this.techcheckCooling = this.service.techCheckService.airSeperationReclaimerTank;
    if (event == true) {
      this.form.controls['peelarValve'].setValue('N/A');
      this.form.controls['floatBall'].setValue('N/A');
      this.form.controls['backFlowValve'].setValue('N/A');
      this.form.controls['hoses'].setValue('N/A');
      this.form.controls['peelarCooler'].setValue('N/A');
      this.form.controls['tank'].setValue('N/A');
      this.form.controls['oilLevel'].setValue('N/A');
      this.form.controls['oilCondition'].setValue('N/A');
      this.form.controls['smokeFilter'].setValue('N/A');
      this.form.controls['oilTank'].setValue('N/A');
      this.form.controls['gasket'].setValue('N/A');
      this.form.controls['oilCooler'].setValue('N/A');
      this.techcheckCooling.peelerValve = 'N/A';
      this.techcheckCooling.floatBall = 'N/A';
      this.techcheckCooling.backFlowValve = 'N/A';
      this.techcheckCooling.hosesConnections = 'N/A';
      this.techcheckCooling.cooler = 'N/A';
      this.techcheckCooling.tank = 'N/A';
      this.techcheckCooling.oilLevel = 'N/A';
      this.techcheckCooling.oilCondition = 'N/A';
      this.techcheckCooling.smokeFilter = 'N/A';
      this.techcheckCooling.oilTank = 'N/A';
      this.techcheckCooling.gasketsHoses = 'N/A';
      this.techcheckCooling.oilCooler = 'N/A';
    } else {
      this.form.controls['peelarValve'].setValue('');
      this.form.controls['floatBall'].setValue('');
      this.form.controls['backFlowValve'].setValue('');
      this.form.controls['hoses'].setValue('');
      this.form.controls['peelarCooler'].setValue('');
      this.form.controls['tank'].setValue('');
      this.form.controls['oilLevel'].setValue('');
      this.form.controls['oilCondition'].setValue('');
      this.form.controls['smokeFilter'].setValue('');
      this.form.controls['oilTank'].setValue('');
      this.form.controls['gasket'].setValue('');
      this.form.controls['oilCooler'].setValue('');
      this.techcheckCooling.peelerValve = '';
      this.techcheckCooling.floatBall = '';
      this.techcheckCooling.backFlowValve = '';
      this.techcheckCooling.hosesConnections = '';
      this.techcheckCooling.cooler = '';
      this.techcheckCooling.tank = '';
      this.techcheckCooling.oilLevel = '';
      this.techcheckCooling.oilCondition = '';
      this.techcheckCooling.smokeFilter = '';
      this.techcheckCooling.oilTank = '';
      this.techcheckCooling.gasketsHoses = '';
      this.techcheckCooling.oilCooler = '';
    }
    this.checkAllFields.emit(event);
  }
  checkAllFieldsValid() {
    if (this.form.valid) {
      this.checkAllFields.emit(true);
    } else { this.checkAllFields.emit(false); }
  }
  private onError(error: any, customMessage?: string) {
    this.errorHandler.handleError(error, "Tech Check", customMessage);
  }
}
