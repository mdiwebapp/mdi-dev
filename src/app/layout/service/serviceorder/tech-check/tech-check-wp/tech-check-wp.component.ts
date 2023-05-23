import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { TabStripComponent } from '@progress/kendo-angular-layout';
import { ErrorMessages } from 'src/app/core/constant';
import { ErrorHandlerService } from 'src/app/core/services';
import { DropdownService } from 'src/app/core/services/dropdown.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { ServiceOrderService } from '../../service-order/service-order.service';
import { AirSeparationComponent } from '../../serviceorderpage/tech-check-popup/air-separation/air-separation.component';
import { BatteryTechCheckComponent } from '../../serviceorderpage/tech-check-popup/battery/battery-techcheck.component';
import { CentrifugalPumpComponent } from '../../serviceorderpage/tech-check-popup/centrifugal-pump/centrifugal-pump.component';
import { CommentsTechCheckComponent } from '../../serviceorderpage/tech-check-popup/comments/comments-techcheck.component';

//import { CompressorTechCheckComponent } from '../../serviceorderpage/tech-check-popup/compressor/compressor-techcheck.component';
import { CoolingTechCheckComponent } from '../../serviceorderpage/tech-check-popup/cooling/cooling-techcheck.component';
import { CouplerAlignCheckComponent } from '../../serviceorderpage/tech-check-popup/coupler-align-check/coupler-align-check.component';

import { CouplerTechCheckComponent } from '../../serviceorderpage/tech-check-popup/coupler/coupler-techcheck.component';
import { ElectrickTechCheckComponent } from '../../serviceorderpage/tech-check-popup/electrical/electrical-techcheck.component';
import { EngineTechCheckComponent } from '../../serviceorderpage/tech-check-popup/engine/engine-techcheck.component';
import { EnvironBoxTechCheckComponent } from '../../serviceorderpage/tech-check-popup/environbox/environbox-techcheck.component';
import { ExcaustTechCheckComponent } from '../../serviceorderpage/tech-check-popup/exhaust/exhaust-techcheck.component';
import { FuelOilTechCheckComponent } from '../../serviceorderpage/tech-check-popup/fuel-oil/fuel-oil-techcheck.component';
import { airSeperationReclaimerTankModel, fuelIolModel, TechCheckModel } from '../../serviceorderpage/tech-check-popup/techCheck.model';
import { TestVaccumPumpComponent } from '../../serviceorderpage/tech-check-popup/test-vaccum-pump/test-vaccum-pump.component';
import { TrailerTechCheckComponent } from '../../serviceorderpage/tech-check-popup/trailer/trailer-techcheck.component';

@Component({
  selector: 'app-tech-check-wp',
  templateUrl: './tech-check-wp.component.html',
  styleUrls: ['./tech-check-wp.component.scss']
})
export class TechCheckWpComponent implements OnInit {
  @ViewChild('tabstrip') public tabstrip: TabStripComponent;
  @Output() closeChecklistPopup: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild(FuelOilTechCheckComponent) fuelOil: FuelOilTechCheckComponent;
  @ViewChild(CoolingTechCheckComponent) cooling: CoolingTechCheckComponent;
  @ViewChild(BatteryTechCheckComponent) battery: BatteryTechCheckComponent;
  @ViewChild(ElectrickTechCheckComponent) electrical: ElectrickTechCheckComponent;
  @ViewChild(EngineTechCheckComponent) engine: EngineTechCheckComponent;
  @ViewChild(CentrifugalPumpComponent) centrifugal: CentrifugalPumpComponent;
  //@ViewChild(CompressorTechCheckComponent) compressor: CompressorTechCheckComponent;
  @ViewChild(CouplerAlignCheckComponent) couplerAlign: CouplerAlignCheckComponent;
  // @ViewChild(EnvironBoxTechCheckComponent) environ: EnvironBoxTechCheckComponent;
  @ViewChild(ExcaustTechCheckComponent) exhaust: ExcaustTechCheckComponent;
  @ViewChild(TrailerTechCheckComponent) trailer: TrailerTechCheckComponent;
  @ViewChild(AirSeparationComponent) airSeparation: AirSeparationComponent;
  @ViewChild(TestVaccumPumpComponent) testVaccum: TestVaccumPumpComponent;
  @ViewChild(CommentsTechCheckComponent) comments: CommentsTechCheckComponent;
  selectedTab: any = 'FUEL/OIL';
  constructor(public dropdownService: DropdownService, public service: ServiceOrderService, private utils: UtilityService, public errorHandler: ErrorHandlerService) { }

  modelTechCheck: TechCheckModel;
  displaySupervisorApproval: boolean = false;
  supervisorApprovalData: any;
  supervisorApprovalList: any;
  mgmtApprove: boolean = false;
  techComplete: boolean = false;
  isAllFilled: boolean = false;
  isCOOLINGFilled: boolean = false;
  isBATTERYFilled: boolean = false;
  isELECTRICALFilled: boolean = false;
  isENGINEFilled: boolean = false;
  isCENTRIFUGALFilled: boolean = false;
  isTRAILERFilled: boolean = false;
  isCOUPLERFilled: boolean = false;
  isEXHAUSTFilled: boolean = false;
  isCOMMENTSFilled: boolean = false;
  isAIRFilled: boolean = false;
  isTESTFilled: boolean = false;
  ngOnInit(): void {
    var id = localStorage.getItem('serviceNumber');
    this.loadSupervisor();
    this.service.GetTechCheckList(id).subscribe(
      (res) => {
        const data = new TechCheckModel();
        this.modelTechCheck = res;
        this.modelTechCheck.soNumber = id;
        this.techComplete = this.modelTechCheck.techComplete;
        this.mgmtApprove = this.modelTechCheck.mgmtApprove;
        this.service.techCheckService.fuelInfo = this.modelTechCheck.fuelIol;
        this.service.techCheckService.cooling = this.modelTechCheck.cooling;
        this.service.techCheckService.battery = this.modelTechCheck.batteryModel;
        this.service.techCheckService.electrical = this.modelTechCheck.electrical;
        this.service.techCheckService.enginePanel = this.modelTechCheck.enginePanel;
        this.service.techCheckService.centrifugalPump = this.modelTechCheck.centrifugalPump;
        this.service.techCheckService.trailer = this.modelTechCheck.trailer;
        this.service.techCheckService.couplerAlignCheckValve = this.modelTechCheck.couplerAlignCheckValve;
        //this.service.techCheckService.enviornBox = this.modelTechCheck.enviornBox;
        this.service.techCheckService.exhaustVactest = this.modelTechCheck.exhaustVactest;
        this.service.techCheckService.airSeperationReclaimerTank = this.modelTechCheck.airSeperationReclaimerTank;
        this.service.techCheckService.testVacuumPump = this.modelTechCheck.testVacuumPump;
        this.service.techCheckService.comments = this.modelTechCheck.comments;
        this.fuelOil.setData(res);
        this.engine.setData(res);
        this.couplerAlign.setData(res.couplerAlignCheckValve);
        this.trailer.setData(res);
        this.checkAllFields(data)
        if (this.techComplete) {
          this.fuelOil.form.disable();
          this.cooling.form.disable();
          this.battery.form.disable();
          this.electrical.form.disable();
          this.engine.form.disable();
          this.centrifugal.form.disable(); 
          this.couplerAlign.form.disable();
          this.exhaust.form.disable();
          this.trailer.form.disable();
          this.airSeparation.form.disable();
          this.testVaccum.form.disable();
          this.comments.form.disable();
        }
      },
      (error) => {
        //this.onError(error, ErrorMessages.vendor.add_vendor_data);
      }
    );
  }
  loadSupervisor() {
    this.dropdownService.GetSupervisonList('All').subscribe(
      (res) => {
        this.supervisorApprovalList = res;
      },
      (error) => {
        //this.onError(error, ErrorMessages.vendor.add_vendor_data);
      }
    );
  }
  public onTabSelect(e) {
    this.selectedTab = e.title;
    //  this.service.techCheckService.fuelInfo=this.modelTechCheck.fuelIol ;
    //  this.service.techCheckService.cooling=this.modelTechCheck.cooling;
    // this.service.techCheckService.battery=this.modelTechCheck.battery;
    // this.service.techCheckService.electrical=this.modelTechCheck.electrical;
    // this.service.techCheckService.enginePanel=this.modelTechCheck.enginePanel;
    // this.service.techCheckService.centrifugalPump=this.modelTechCheck.centrifugalPump;
    // this.service.techCheckService.compressor=this.modelTechCheck.compressor;
    // this.service.techCheckService.couplerAlignCheckValve=this.modelTechCheck.couplerAlignCheckValve;
    // this.service.techCheckService.enviornBox=this.modelTechCheck.enviornBox;
    // this.service.techCheckService.exhaustVactest=this.modelTechCheck.exhaustVactest;
    if (this.selectedTab == 'FUEL/OIL') {
      setTimeout(() => {
        this.fuelOil.setData(this.modelTechCheck);
      }, 200);
    } else if (this.selectedTab == 'COOLING') {
      setTimeout(() => {
        this.cooling.setData(this.modelTechCheck);
      }, 200);
    }
    else if (this.selectedTab == 'BATTERY') {
      setTimeout(() => {
        this.battery.setData(this.modelTechCheck);
      }, 200);
    }
    else if (this.selectedTab == 'ELECTRICAL') {
      setTimeout(() => {
        this.electrical.setData(this.modelTechCheck.electrical);
      }, 200);
    } else if (this.selectedTab == 'ENGINE PANEL') {
      setTimeout(() => {
        this.engine.setData(this.modelTechCheck);
        if (this.engine.form.valid)
          this.isENGINEFilled = true;
        else
          this.isENGINEFilled = false;
      }, 200);
    } else if (this.selectedTab == 'CENTRIFUGAL PUMP') {
      setTimeout(() => {
        this.centrifugal.setData(this.modelTechCheck);
      }, 200);
    }
    // else if (this.selectedTab == 'COMPRESSOR') {
    //   setTimeout(() => {
    //     this.compressor.setData(this.modelTechCheck.compressor);
    //   }, 200);
    // } 
    else if (this.selectedTab == 'COUPLER/ALIGN/CHECK VALVE') {
      setTimeout(() => {
        this.couplerAlign.setData(this.modelTechCheck.couplerAlignCheckValve);
      }, 200);
    }
    // else if (this.selectedTab == 'ENVIORN BOX/SUCTION SPOOL') {
    //   setTimeout(() => {
    //     this.environ.setData(this.modelTechCheck.enviornBox);
    //   }, 200);
    // }
    else if (this.selectedTab == 'EXHAUST/VAC TEST') {
      setTimeout(() => {
        this.exhaust.setData(this.modelTechCheck.exhaustVactest);
      }, 200);
    } else if (this.selectedTab == 'TRAILER') {
      setTimeout(() => {
        this.trailer.setData(this.modelTechCheck);
        if (this.trailer.form.valid)
          this.isTRAILERFilled = true;
        else
          this.isTRAILERFilled = false;
      }, 200);
    } else if (this.selectedTab == 'AIR SEPERATION/RECLAIMER TANK') {
      setTimeout(() => {
        this.airSeparation.setData(this.modelTechCheck.airSeperationReclaimerTank);
      }, 500);
    }
    else if (this.selectedTab == 'TEST/VACCUM PUMP') {
      setTimeout(() => {
        this.testVaccum.setData(this.modelTechCheck);
      }, 200);
    } else if (this.selectedTab == 'COMMENTS') {
      setTimeout(() => {
        this.comments.setData(this.modelTechCheck.comments);
      }, 200);
    }
  }
  onSave() {
    if (this.selectedTab == 'FUEL/OIL') {
      this.fuelOil.onSave();
    } else if (this.selectedTab == 'COOLING') {
      this.cooling.onSave();
    } else if (this.selectedTab == 'BATTERY') {
      this.battery.onSave();
    } else if (this.selectedTab == 'ELECTRICAL') {
      this.electrical.onSave();
    } else if (this.selectedTab == 'ENGINE PANEL') {
      this.engine.onSave();
    } else if (this.selectedTab == 'CENTRIFUGAL PUMP') {
      this.centrifugal.onSave();
    } else if (this.selectedTab == 'COMPRESSOR') {
      //this.compressor.onSave();
    } else if (this.selectedTab == 'COUPLER/ALIGN/CHECK VALVE') {
      this.couplerAlign.onSave();
    } else if (this.selectedTab == 'EXHAUST/VAC TEST') {
      this.exhaust.onSave();
    } else if (this.selectedTab == 'TRAILER') {
      this.trailer.onSave();
    } else if (this.selectedTab == 'AIR SEPERATION/RECLAIMER TANK') {
      this.airSeparation.onSave();
    } else if (this.selectedTab == 'TEST/VACCUM PUMP') {
      this.testVaccum.onSave();
    } else if (this.selectedTab == 'COMMENTS') {
      this.comments.onSave();
    }
  }
  saveTechcheck(data) {
    var isFilled = true;
    if (this.fuelOil.form.invalid) {
      this.tabstrip.selectTab(0); isFilled = false;
    } else
      this.modelTechCheck.fuelIol = this.service.techCheckService.fuelInfo;

    if (this.cooling.form.invalid) {
      this.tabstrip.selectTab(1); isFilled = false;
    } else
      this.modelTechCheck.cooling = this.service.techCheckService.cooling;

    if (this.battery.form.invalid) {
      this.tabstrip.selectTab(2); isFilled = false;
    } else
      this.modelTechCheck.batteryModel = this.service.techCheckService.battery;

    if (this.electrical.form.invalid) {
      this.tabstrip.selectTab(3); isFilled = false;
    } else
      this.modelTechCheck.electrical = this.service.techCheckService.electrical;

    if (this.engine.form.invalid) {
      this.tabstrip.selectTab(4); isFilled = false;
    } else
      this.modelTechCheck.enginePanel = this.service.techCheckService.enginePanel;

    if (this.centrifugal.form.invalid) {
      this.tabstrip.selectTab(5); isFilled = false;
    } else
      this.modelTechCheck.centrifugalPump = this.service.techCheckService.centrifugalPump;


    this.modelTechCheck.compressor = this.service.techCheckService.compressor;
    if (this.couplerAlign.form.invalid) {
      this.tabstrip.selectTab(7); isFilled = false;
    } else
      this.modelTechCheck.couplerAlignCheckValve = this.service.techCheckService.couplerAlignCheckValve;


    this.modelTechCheck.enviornBox = this.service.techCheckService.enviornBox;
    if (this.exhaust.form.invalid) {
      this.tabstrip.selectTab(8); isFilled = false;
    } else
      this.modelTechCheck.exhaustVactest = this.service.techCheckService.exhaustVactest;

    if (this.trailer.form.invalid) {
      this.tabstrip.selectTab(6); isFilled = false;
    } else
      this.modelTechCheck.trailer = this.service.techCheckService.trailer;

    if (this.airSeparation.form.invalid) {
      this.tabstrip.selectTab(10); isFilled = false;
    } else
      this.modelTechCheck.airSeperationReclaimerTank = this.service.techCheckService.airSeperationReclaimerTank;

    if (this.testVaccum.form.invalid) {
      this.tabstrip.selectTab(11); isFilled = false;
    } else
      this.modelTechCheck.testVacuumPump = this.service.techCheckService.testVacuumPump;

    if (this.comments.form.invalid) {
      this.tabstrip.selectTab(9); isFilled = false;
    } else
      this.modelTechCheck.comments = this.service.techCheckService.comments;


    if (this.supervisorApprovalData) {
      this.modelTechCheck.mgmtApprove = true;
      this.modelTechCheck.manager = this.supervisorApprovalData;
    }
    if (isFilled) {
      this.modelTechCheck.oilLeaks = this.service.techCheckService.fuelInfo.oilLeaks;
      this.modelTechCheck.fuelLeaks = this.service.techCheckService.fuelInfo.fuelLeaks;
      this.modelTechCheck.coolantReservoir = this.service.techCheckService.cooling.coolantReservoir;
      this.modelTechCheck.battery = this.service.techCheckService.battery.battery;

      this.modelTechCheck.tirePSILF = this.service.techCheckService.trailer.tirePSILF;
      this.modelTechCheck.tirePSILR = this.service.techCheckService.trailer.tirePSILR;
      this.modelTechCheck.tirePSIRF = this.service.techCheckService.trailer.tirePSIRF;
      this.modelTechCheck.tirePSIRR = this.service.techCheckService.trailer.tirePSIRR;
      this.modelTechCheck.tireTreadLF = this.service.techCheckService.trailer.tireTreadLF;
      this.modelTechCheck.tireTreadLR = this.service.techCheckService.trailer.tireTreadLR;
      this.modelTechCheck.tireTreadRF = this.service.techCheckService.trailer.tireTreadRF;
      this.modelTechCheck.tireTreadRR = this.service.techCheckService.trailer.tireTreadRR;
      this.modelTechCheck.pintleHitch = this.service.techCheckService.trailer.pintleHitch;
      this.modelTechCheck.brakeActuator = this.service.techCheckService.trailer.brakeActuator;
      this.modelTechCheck.safetyLatches = this.service.techCheckService.trailer.safetyLatchesData;
      this.modelTechCheck.trailer.wheel = this.service.techCheckService.trailer.wheel;
      this.modelTechCheck.beltCondition = this.service.techCheckService.testVacuumPump.beltCondition;
      this.modelTechCheck.bearings = this.service.techCheckService.centrifugalPump.bearings;
      this.modelTechCheck.techComplete = true;
      this.service.SaveTechCheck(this.modelTechCheck).subscribe(
        (res) => {
          if (res['status'] == 200) {
            this.utils.toast.success(res['message']);
            // this.SaveEditClick.emit(res);
          } else this.utils.toast.error(res['message']);
          this.service.resetTechCheck();
          this.closeChecklistPopup.emit(true);
        },
        (error) => {
          this.onError(error, ErrorMessages.vendor.add_vendor_data);
        }
      );
    }
  }

  private onError(error: any, customMessage?: string) {
    this.errorHandler.handleError(error, "Tech Check", customMessage);
  }
  checkFields(obj) {
    if (this.selectedTab == 'FUEL/IOL' || this.selectedTab == 'FUEL/OIL') {
      if (obj == true)
        this.isAllFilled = true;
      else {
        this.isAllFilled = false;
      }
    } else if (this.selectedTab == 'COOLING') {
      if (obj == true)
        this.isCOOLINGFilled = true;
      else {
        this.isCOOLINGFilled = false;
      }
    } else if (this.selectedTab == 'BATTERY') {
      if (obj == true)
        this.isBATTERYFilled = true;
      else {
        this.isBATTERYFilled = false;
      }
    } else if (this.selectedTab == 'ELECTRICAL') {
      if (obj == true)
        this.isELECTRICALFilled = true;
      else {
        this.isELECTRICALFilled = false;
      }
    } else if (this.selectedTab == 'ENGINE PANEL') {
      if (obj == true)
        this.isENGINEFilled = true;
      else {
        this.isENGINEFilled = false;
      }
    } else if (this.selectedTab == 'CENTRIFUGAL PUMP') {
      if (obj == true)
        this.isCENTRIFUGALFilled = true;
      else {
        this.isCENTRIFUGALFilled = false;
      }
    } else if (this.selectedTab == 'TRAILER') {
      if (obj == true)
        this.isTRAILERFilled = true;
      else {
        this.isTRAILERFilled = false;
      }
    } else if (this.selectedTab == 'COUPLER/ALIGN/CHECK VALVE') {
      if (obj == true)
        this.isCOUPLERFilled = true;
      else {
        this.isCOUPLERFilled = false;
      }
    } else if (this.selectedTab == 'EXHAUST/VAC TEST') {
      if (obj == true)
        this.isEXHAUSTFilled = true;
      else {
        this.isEXHAUSTFilled = false;
      }
    } else if (this.selectedTab == 'COMMENTS') {
      if (obj == true)
        this.isCOMMENTSFilled = true;
      else {
        this.isCOMMENTSFilled = false;
      }
    } else if (this.selectedTab == 'AIR SEPERATION/RECLAIMER TANK') {
      if (obj == true)
        this.isAIRFilled = true;
      else {
        this.isAIRFilled = false;
      }
    } else if (this.selectedTab == 'TEST/VACCUM PUMP') {
      if (obj == true)
        this.isTESTFilled = true;
      else {
        this.isTESTFilled = false;
      }
    }
  }
  checkAllFields(obj) {
    
    if (this.fuelOil.form.valid)
      this.isAllFilled = true;
    else
      this.isAllFilled = false;
    if (this.engine.form.valid)
      this.isENGINEFilled = true;
    else
      this.isENGINEFilled = false;
    if (this.trailer.form.valid)
      this.isTRAILERFilled = true;
    else
      this.isTRAILERFilled = false;
    if (this.couplerAlign.form.valid)
      this.isCOUPLERFilled = true;
    else
      this.isCOUPLERFilled = false;

   

    Object.keys(this.modelTechCheck.cooling).forEach(prop => {
      if (this.modelTechCheck.cooling[prop]) {
        this.isCOOLINGFilled = true;
      } else {
        this.isCOOLINGFilled = false;
      }
    });
    Object.keys(this.modelTechCheck.batteryModel).forEach(prop => {
      if (this.modelTechCheck.batteryModel[prop]) {
        this.isBATTERYFilled = true;
      } else {
        this.isBATTERYFilled = false;
      }
    });
    Object.keys(this.modelTechCheck.electrical).forEach(prop => {
      if (this.modelTechCheck.electrical[prop]) {
        this.isELECTRICALFilled = true;
      } else {
        this.isELECTRICALFilled = false;
      }
    });
    Object.keys(this.modelTechCheck.centrifugalPump).forEach(prop => {
      if (this.modelTechCheck.centrifugalPump[prop]) {
        this.isCENTRIFUGALFilled = true;
      } else {
        this.isCENTRIFUGALFilled = false;
      }
    });
    Object.keys(this.modelTechCheck.exhaustVactest).forEach(prop => {
      if (this.modelTechCheck.exhaustVactest[prop]) {
        this.isEXHAUSTFilled = true;
      } else {
        this.isEXHAUSTFilled = false;
      }
    });
    Object.keys(this.modelTechCheck.comments).forEach(prop => {
      if (this.modelTechCheck.comments[prop]) {
        this.isCOMMENTSFilled = true;
      } else {
        this.isCOMMENTSFilled = false;
      }
    });
    Object.keys(this.modelTechCheck.airSeperationReclaimerTank).forEach(prop => {
      if (this.modelTechCheck.airSeperationReclaimerTank[prop]) {
        this.isAIRFilled = true;
      } else {
        this.isAIRFilled = false;
      }
    });
    Object.keys(this.modelTechCheck.testVacuumPump).forEach(prop => {
      if (this.modelTechCheck.testVacuumPump[prop]) {
        this.isTESTFilled = true;
      } else {
        this.isTESTFilled = false;
      }
    });
  }
}
