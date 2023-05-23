import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { TabStripComponent } from '@progress/kendo-angular-layout';
import { ErrorMessages } from 'src/app/core/constant';
import { ErrorHandlerService } from 'src/app/core/services';
import { DropdownService } from 'src/app/core/services/dropdown.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { ServiceOrderService } from '../../service-order/service-order.service';
import { BatteryTechCheckComponent } from '../../serviceorderpage/tech-check-popup/battery/battery-techcheck.component';
import { CentralpumpTechCheckComponent } from '../../serviceorderpage/tech-check-popup/centalpump/centalpump-techcheck.component';
import { CommentsTechCheckComponent } from '../../serviceorderpage/tech-check-popup/comments/comments-techcheck.component';

import { CompressorTechCheckComponent } from '../../serviceorderpage/tech-check-popup/compressor/compressor-techcheck.component';
import { CoolingTechCheckComponent } from '../../serviceorderpage/tech-check-popup/cooling/cooling-techcheck.component';

import { CouplerTechCheckComponent } from '../../serviceorderpage/tech-check-popup/coupler/coupler-techcheck.component';
import { ElectrickTechCheckComponent } from '../../serviceorderpage/tech-check-popup/electrical/electrical-techcheck.component';
import { EngineTechCheckComponent } from '../../serviceorderpage/tech-check-popup/engine/engine-techcheck.component';
import { EnvironBoxTechCheckComponent } from '../../serviceorderpage/tech-check-popup/environbox/environbox-techcheck.component';
import { ExcaustTechCheckComponent } from '../../serviceorderpage/tech-check-popup/exhaust/exhaust-techcheck.component';
import { FuelOilTechCheckComponent } from '../../serviceorderpage/tech-check-popup/fuel-oil/fuel-oil-techcheck.component';
import { fuelIolModel, TechCheckModel } from '../../serviceorderpage/tech-check-popup/techCheck.model';
import { TrailerTechCheckComponent } from '../../serviceorderpage/tech-check-popup/trailer/trailer-techcheck.component';

@Component({
  selector: 'app-tech-check-list',
  templateUrl: './tech-check-list.component.html',
  styleUrls: ['./tech-check-list.component.scss']
})
export class TechCheckListComponent implements OnInit {
  @ViewChild('tabstrip') public tabstrip: TabStripComponent;
  @Output() closeChecklistPopup: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild(FuelOilTechCheckComponent) fuelOil: FuelOilTechCheckComponent;
  @ViewChild(CoolingTechCheckComponent) cooling: CoolingTechCheckComponent;
  @ViewChild(BatteryTechCheckComponent) battery: BatteryTechCheckComponent;
  @ViewChild(ElectrickTechCheckComponent) electrical: ElectrickTechCheckComponent;
  @ViewChild(EngineTechCheckComponent) engine: EngineTechCheckComponent;
  @ViewChild(CentralpumpTechCheckComponent) centri: CentralpumpTechCheckComponent;
  @ViewChild(CompressorTechCheckComponent) compressor: CompressorTechCheckComponent;
  @ViewChild(CouplerTechCheckComponent) couplerAlign: CouplerTechCheckComponent;
  @ViewChild(EnvironBoxTechCheckComponent) environ: EnvironBoxTechCheckComponent;
  @ViewChild(ExcaustTechCheckComponent) exhaust: ExcaustTechCheckComponent;
  @ViewChild(TrailerTechCheckComponent) trailer: TrailerTechCheckComponent;
  @ViewChild(CommentsTechCheckComponent) comments: CommentsTechCheckComponent;

  selectedTab: any = 'FUEL/IOL';
  supervisorApprovalData: any;
  supervisorApprovalList: any;
  displaySupervisorApproval: boolean = false;
  mgmtApprove: boolean = false;
  techComplete: boolean = false;
  isGenerator: boolean = false;
  constructor(public dropdownService: DropdownService, public service: ServiceOrderService, private utils: UtilityService, public errorHandler: ErrorHandlerService) { }

  modelTechCheck: TechCheckModel;
  ngOnInit(): void {
    var id = localStorage.getItem('serviceNumber');
    if (this.service.blGen == true) {
      this.isGenerator = true;
    } else {
      this.isGenerator = false;
    }
    this.loadSupervisor();
    this.service.GetTechCheckList(id).subscribe(
      (res) => {
        const data = new TechCheckModel();
        this.modelTechCheck = res;
        this.modelTechCheck.soNumber = id;
        this.mgmtApprove = this.modelTechCheck.mgmtApprove;
        this.techComplete = this.modelTechCheck.techComplete;
        this.service.techCheckService.fuelInfo = this.modelTechCheck.fuelIol;
        this.service.techCheckService.cooling = this.modelTechCheck.cooling;
        //this.service.techCheckService.cooling.coolantReservoir = this.modelTechCheck.coolantReservoir;

        this.service.techCheckService.battery = this.modelTechCheck.batteryModel;
        this.service.techCheckService.battery.battery = this.modelTechCheck.battery;
        this.service.techCheckService.electrical = this.modelTechCheck.electrical;
        this.service.techCheckService.enginePanel = this.modelTechCheck.enginePanel;
        this.service.techCheckService.centrifugalPump = this.modelTechCheck.centrifugalPump;
        this.service.techCheckService.compressor = this.modelTechCheck.compressor;
        this.service.techCheckService.couplerAlignCheckValve = this.modelTechCheck.couplerAlignCheckValve;
        this.service.techCheckService.enviornBox = this.modelTechCheck.enviornBox;
        this.service.techCheckService.exhaustVactest = this.modelTechCheck.exhaustVactest;
        this.service.techCheckService.comments = this.modelTechCheck.comments;
        this.service.techCheckService.trailer = this.modelTechCheck.trailer;
        this.fuelOil.setData(res);
        this.engine.setData(res);
        this.compressor.setData(res.compressor);
        this.environ.setData(res.enviornBox);
        this.couplerAlign.setData(res.couplerAlignCheckValve);
        this.trailer.setData(res);
        this.exhaust.setData(res.exhaustVactest);
        this.centri.setData(res.centrifugalPump);
        this.checkAllFields(data);
        //this.cooling.setData(res.cooling);
        if (this.techComplete) {
          this.fuelOil.form.disable();
          this.cooling.form.disable();
          this.battery.form.disable();
          this.electrical.form.disable();
          this.engine.form.disable();
          this.centri.form.disable();
          this.compressor.form.disable();
          this.couplerAlign.form.disable();
          this.environ.form.disable();
          this.exhaust.form.disable();
          this.trailer.form.disable();
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
  isAllFilled: boolean = false;
  isAllCoolFilled: boolean = false;
  isAllBattryFilled: boolean = false;
  isAllElectFilled: boolean = false;
  isAllExhaustFilled: boolean = false;
  isAllEnvironFilled: boolean = false;
  isAllCouplerFilled: boolean = false;
  isAllCompFilled: boolean = false;
  isAllCentriFilled: boolean = false;
  isAllEngineFilled: boolean = false;
  isAllTrailerFilled: boolean = false;
  isAllCommentsField: boolean = false;
  public onTabSelect(e) {
    this.selectedTab = e.title;

    if (this.selectedTab == 'FUEL/IOL') {
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
    } else if (this.selectedTab == 'ENGINE/ PANEL') {
      setTimeout(() => {
        this.engine.setData(this.modelTechCheck);
      }, 200);
    } else if (this.selectedTab == 'CENTRIFUGAL PUMP') {
      setTimeout(() => {
        this.centri.setData(this.modelTechCheck);
      }, 200);
    } else if (this.selectedTab == 'COMPRESSOR') {
      setTimeout(() => {
        this.compressor.setData(this.modelTechCheck.compressor);
      }, 200);
    } else if (this.selectedTab == 'COUPLER/ALIGN/CHECK VALVE') {
      setTimeout(() => {
        this.couplerAlign.setData(this.modelTechCheck.couplerAlignCheckValve);
      }, 200);
    } else if (this.selectedTab == 'ENVIRON BOX/SUCTION SPOOL') {
      setTimeout(() => {
        this.environ.setData(this.modelTechCheck.enviornBox);
      }, 200);
    }
    else if (this.selectedTab == 'EXHAUST/VAC TEST') {
      setTimeout(() => {
        this.exhaust.setData(this.modelTechCheck.exhaustVactest);
      }, 200);
    } else if (this.selectedTab == 'TRAILER') {
      setTimeout(() => {
        this.trailer.setData(this.modelTechCheck);
      }, 200);
    } else if (this.selectedTab == 'COMMENTS') {
      setTimeout(() => {
        this.comments.setData(this.modelTechCheck.comments);
      }, 200);
    }
  }
  onSave() {
    if (this.selectedTab == 'FUEL/IOL') {
      this.fuelOil.onSave();
    } else if (this.selectedTab == 'COOLING') {
      this.cooling.onSave();
    } else if (this.selectedTab == 'BATTERY') {
      this.battery.onSave();
    } else if (this.selectedTab == 'ELECTRICAL') {
      this.electrical.onSave();
    } else if (this.selectedTab == 'ENGINE/ PANEL') {
      this.engine.onSave();
    } else if (this.selectedTab == 'CENTRIFUGAL PUMP') {
      this.centri.onSave();
    } else if (this.selectedTab == 'COMPRESSOR') {
      this.compressor.onSave();
    } else if (this.selectedTab == 'COUPLER/ALIGN/CHECK VALVE') {
      this.couplerAlign.onSave();
    } else if (this.selectedTab == 'ENVIRON BOX/SUCTION SPOOL') {
      this.environ.onSave();
    }
    else if (this.selectedTab == 'EXHAUST/VAC TEST') {
      this.exhaust.onSave();
    } else if (this.selectedTab == 'COMMENTS') {
      this.comments.onSave();
    } else if (this.selectedTab == 'TRAILER') {
      this.trailer.onSave();
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

    if (!this.isGenerator) {
      if (this.centri.form.invalid) {
        this.tabstrip.selectTab(5); isFilled = false;
      } else
        this.modelTechCheck.centrifugalPump = this.service.techCheckService.centrifugalPump;
    } else {
      this.modelTechCheck.centrifugalPump = this.service.techCheckService.centrifugalPump;
    }

    if (!this.isGenerator) {
      if (this.compressor.form.invalid) {
        this.tabstrip.selectTab(6); isFilled = false;
      } else
        this.modelTechCheck.compressor = this.service.techCheckService.compressor;
    } else
      this.modelTechCheck.compressor = this.service.techCheckService.compressor;
    if (!this.isGenerator) {
      if (this.couplerAlign.form.invalid) {
        this.tabstrip.selectTab(7); isFilled = false;
      } else
        this.modelTechCheck.couplerAlignCheckValve = this.service.techCheckService.couplerAlignCheckValve;
    } else
      this.modelTechCheck.couplerAlignCheckValve = this.service.techCheckService.couplerAlignCheckValve;
    if (!this.isGenerator) {
      if (this.environ.form.invalid) {
        this.tabstrip.selectTab(8); isFilled = false;
      } else
        this.modelTechCheck.enviornBox = this.service.techCheckService.enviornBox;
    } else
      this.modelTechCheck.enviornBox = this.service.techCheckService.enviornBox;
    if (this.exhaust.form.invalid) {
      this.tabstrip.selectTab(this.isGenerator ? 5 : 9); isFilled = false;
    } else
      this.modelTechCheck.exhaustVactest = this.service.techCheckService.exhaustVactest;

    if (this.trailer.form.invalid) {
      this.tabstrip.selectTab(this.isGenerator ? 6 : 10); isFilled = false;
    } else
      this.modelTechCheck.trailer = this.service.techCheckService.trailer;
    if (this.comments.form.invalid) {
      this.tabstrip.selectTab(this.isGenerator ? 7 : 11); isFilled = false;
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
  checkFields(obj) {
    if (this.selectedTab == 'FUEL/IOL') {
      if (obj == true)
        this.isAllFilled = true;
      else
        this.isAllFilled = false;
    } else if (this.selectedTab == 'COOLING') {
      if (obj == true)
        this.isAllCoolFilled = true;
      else {
        this.isAllCoolFilled = false;
      }
    } else if (this.selectedTab == 'BATTERY') {

      if (obj == true)
        this.isAllBattryFilled = true;
      else {
        this.isAllBattryFilled = false;
      }
    } else if (this.selectedTab == 'ELECTRICAL') {
      if (obj == true)
        this.isAllElectFilled = true;
      else {
        this.isAllElectFilled = false;
      }
    } else if (this.selectedTab == 'ENGINE/ PANEL') {
      if (obj == true)
        this.isAllEngineFilled = true;
      else {
        this.isAllEngineFilled = false;
      }
    } else if (this.selectedTab == 'CENTRIFUGAL PUMP') {
      if (obj == true)
        this.isAllCentriFilled = true;
      else {
        this.isAllCentriFilled = false;
      }
    } else if (this.selectedTab == 'COMPRESSOR') {
      if (obj == true)
        this.isAllCompFilled = true;
      else {
        this.isAllCompFilled = false;
      }
    } else if (this.selectedTab == 'COUPLER/ALIGN/CHECK VALVE') {
      if (obj == true)
        this.isAllCouplerFilled = true;
      else {
        this.isAllCouplerFilled = false;
      }
    } else if (this.selectedTab == 'ENVIRON BOX/SUCTION SPOOL') {
      if (obj == true)
        this.isAllEnvironFilled = true;
      else {
        this.isAllEnvironFilled = false;
      }
    }
    else if (this.selectedTab == 'EXHAUST/VAC TEST') {
      if (obj == true)
        this.isAllExhaustFilled = true;
      else {
        this.isAllExhaustFilled = false;
      }
    } else if (this.selectedTab == 'TRAILER') {
      if (obj == true)
        this.isAllTrailerFilled = true;
      else {
        this.isAllTrailerFilled = false;
      }
    }

  }
  checkAllFields(obj) {
    var isFalse = false;
    if (this.fuelOil.form.valid)
      this.isAllFilled = true;
    else
      this.isAllFilled = false;


    Object.keys(this.modelTechCheck.cooling).forEach(prop => {
      if (this.modelTechCheck.cooling[prop]) {
        this.isAllCoolFilled = true;
      } else {
        this.isAllCoolFilled = false;
      }
    });
    Object.keys(this.modelTechCheck.batteryModel).forEach(prop => {
      if (this.modelTechCheck.batteryModel[prop]) {
        this.isAllBattryFilled = true;
      } else {
        this.isAllBattryFilled = false;
      }
    });
    Object.keys(this.modelTechCheck.electrical).forEach(prop => {
      if (this.modelTechCheck.electrical[prop]) {
        this.isAllElectFilled = true;
      } else {
        this.isAllElectFilled = false;
      }
    });


    if (this.engine.form.valid)
      this.isAllEngineFilled = true;
    else
      this.isAllEngineFilled = false;

    if (!this.isGenerator && this.centri.form.valid)
      this.isAllCentriFilled = true;
    else
      this.isAllCentriFilled = false;

    if (!this.isGenerator && this.compressor.form.valid)
      this.isAllCompFilled = true;
    else
      this.isAllCompFilled = false;
    if (!this.isGenerator && this.couplerAlign.form.valid)
      this.isAllCouplerFilled = true;
    else
      this.isAllCouplerFilled = false;

    if (!this.isGenerator && this.environ.form.valid)
      this.isAllEnvironFilled = true;
    else
      this.isAllEnvironFilled = false;

    if (this.exhaust.form.valid)
      this.isAllExhaustFilled = true;
    else
      this.isAllExhaustFilled = false;
    if (this.trailer.form.valid)
      this.isAllTrailerFilled = true;
    else
      this.isAllTrailerFilled = false;
    Object.keys(this.modelTechCheck.comments).forEach(prop => {
      if (this.modelTechCheck.comments[prop]) {
        this.isAllCommentsField = true;
      } else {
        this.isAllCommentsField = false;
      }
    });

  }
  private onError(error: any, customMessage?: string) {
    this.errorHandler.handleError(error, "Tech Check", customMessage);
  }
}
