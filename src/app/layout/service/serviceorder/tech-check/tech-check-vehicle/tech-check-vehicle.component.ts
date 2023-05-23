import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { TabStripComponent } from '@progress/kendo-angular-layout';
import { ErrorMessages } from 'src/app/core/constant';
import { ErrorHandlerService } from 'src/app/core/services';
import { DropdownService } from 'src/app/core/services/dropdown.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { ServiceOrderService } from '../../service-order/service-order.service';
import { AdditionalItemsComponent } from '../../serviceorderpage/tech-check-popup/additional-items/additional-items.component';
import { FluidLevelsComponent } from '../../serviceorderpage/tech-check-popup/fluid-levels/fluid-levels.component';
import { FrontDifferentialComponent } from '../../serviceorderpage/tech-check-popup/front-differential/front-differential.component';
import { InteriorComponent } from '../../serviceorderpage/tech-check-popup/interior/interior.component';
import { LightsComponent } from '../../serviceorderpage/tech-check-popup/lights/lights.component';
import { RearDifferentialComponent } from '../../serviceorderpage/tech-check-popup/rear-differential/rear-differential.component';
import { TechCheckModel } from '../../serviceorderpage/tech-check-popup/techCheck.model';
import { TrasmissionTransferCaseComponent } from '../../serviceorderpage/tech-check-popup/trasmission-transfer-case/trasmission-transfer-case.component';
import { VehicleEngineComponent } from '../../serviceorderpage/tech-check-popup/vehicle-engine/vehicle-engine.component';

@Component({
  selector: 'app-tech-check-vehicle',
  templateUrl: './tech-check-vehicle.component.html',
  styleUrls: ['./tech-check-vehicle.component.scss']
})
export class TechCheckVehicleComponent implements OnInit {
  @ViewChild('tabstrip') public tabstrip: TabStripComponent;

  @Output() closeChecklistPopup: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild(RearDifferentialComponent) rearDiff: RearDifferentialComponent;
  @ViewChild(LightsComponent) lights: LightsComponent;
  @ViewChild(InteriorComponent) interior: InteriorComponent;
  @ViewChild(AdditionalItemsComponent) additionalItems: AdditionalItemsComponent;
  @ViewChild(FluidLevelsComponent) fluiedLevel: FluidLevelsComponent;
  @ViewChild(VehicleEngineComponent) engine: VehicleEngineComponent;
  @ViewChild(TrasmissionTransferCaseComponent) transmission: TrasmissionTransferCaseComponent;
  @ViewChild(FrontDifferentialComponent) frontDiff: FrontDifferentialComponent;

  selectedTab: any = 'REAR/DIFFERENTIAL';

  constructor(public dropdownService: DropdownService, public service: ServiceOrderService, private utils: UtilityService, public errorHandler: ErrorHandlerService) { }
  modelTechCheck: TechCheckModel;
  displaySupervisorApproval: true;
  supervisorApprovalData: any;
  supervisorApprovalList: any;
  mgmtApprove: boolean = false;
  techComplete: boolean = false;
  isRearDiffFilled: boolean = false;
  isLightsFilled: boolean = false;
  isInteriorFilled: boolean = false;
  isAdditionalItemsFilled: boolean = false;
  isFluiedLevelFilled: boolean = false;
  isEngineFilled: boolean = false;
  isTransmissionFilled: boolean = false;
  isFrontDiffFilled: boolean = false;

  ngOnInit(): void {
    var id = localStorage.getItem('serviceNumber');
    this.loadSupervisor();
    this.service.GetTechCheckList(id).subscribe(
      (res) => {
        const data = new TechCheckModel();
        this.modelTechCheck = res;
        this.techComplete = this.modelTechCheck.techComplete;
        this.mgmtApprove = this.modelTechCheck.mgmtApprove;
        this.service.techCheckService.vehicleRearDiffrential = this.modelTechCheck.vehicleRearDiffrential;
        this.service.techCheckService.vehicleLights = this.modelTechCheck.vehicleLights;
        this.service.techCheckService.vehicleInterior = this.modelTechCheck.vehicleInterior;
        this.service.techCheckService.vehicleAdditionalItems = this.modelTechCheck.vehicleAdditionalItems;
        this.service.techCheckService.vehicleFluidLevels = this.modelTechCheck.vehicleFluidLevels;
        this.service.techCheckService.vehicleEngine = this.modelTechCheck.vehicleEngine;
        this.service.techCheckService.vehicleTransmissionTransferCase = this.modelTechCheck.vehicleTransmissionTransferCase;
        this.service.techCheckService.vehicleFrontDiffrential = this.modelTechCheck.vehicleFrontDiffrential;
        this.modelTechCheck.soNumber = id;
        this.rearDiff.setData(res.vehicleRearDiffrential);
        //this.cooling.setData(res.cooling);
        this.checkAllFields(data);
        if (this.techComplete) {
          this.rearDiff.form.disable();
          this.lights.form.disable();
          this.interior.form.disable();
          this.additionalItems.form.disable();
          this.fluiedLevel.form.disable();
          this.engine.form.disable();
          this.transmission.form.disable();
          this.frontDiff.form.disable();
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
    if (this.selectedTab == 'REAR/DIFFERENTIAL') {
      setTimeout(() => {
        if (this.rearDiff)
          this.rearDiff.setData(this.modelTechCheck.vehicleRearDiffrential);
      }, 200);
    }
    else if (this.selectedTab == 'LIGHTS') {
      setTimeout(() => {
        if (this.lights)
          this.lights.setData(this.modelTechCheck);
      }, 200);
    }
    else if (this.selectedTab == 'INTERIOR') {
      setTimeout(() => {
        if (this.interior)
          this.interior.setData(this.modelTechCheck.vehicleInterior);
      }, 200);
    }
    else if (this.selectedTab == 'ADDITIONAL ITEMS') {
      setTimeout(() => {
        if (this.additionalItems)
          this.additionalItems.setData(this.modelTechCheck.vehicleAdditionalItems);
      }, 200);
    }
    else if (this.selectedTab == 'FLUID LEVELS') {
      setTimeout(() => {
        if (this.fluiedLevel)
          this.fluiedLevel.setData(this.modelTechCheck);
      }, 200);
    }
    else if (this.selectedTab == 'ENGINE') {
      setTimeout(() => {
        if (this.engine)
          this.engine.setData(this.modelTechCheck);
      }, 200);
    }
    else if (this.selectedTab == 'TRANSMISSION/TRANSFER CASE') {
      setTimeout(() => {
        if (this.transmission)
          this.transmission.setData(this.modelTechCheck.vehicleTransmissionTransferCase);
      }, 200);
    }
    else if (this.selectedTab == 'FRONT/DIFFERENTIAL') {
      setTimeout(() => {
        if (this.frontDiff)
          this.frontDiff.setData(this.modelTechCheck.vehicleFrontDiffrential);
      }, 200);
    }
  }
  onSave() {
    if (this.selectedTab == 'REAR/DIFFERENTIAL') {
      this.rearDiff.onSave();
    }
    else if (this.selectedTab == 'LIGHTS') {
      this.lights.onSave();
    }
    else if (this.selectedTab == 'INTERIOR') {
      this.interior.onSave();
    }
    else if (this.selectedTab == 'ADDITIONAL ITEMS') {
      this.additionalItems.onSave();
    }
    else if (this.selectedTab == 'FLUID LEVELS') {
      this.fluiedLevel.onSave();
    }
    else if (this.selectedTab == 'ENGINE') {
      this.engine.onSave();
    }
    else if (this.selectedTab == 'TRANSMISSION/TRANSFER CASE') {
      this.transmission.onSave();
    }
    else if (this.selectedTab == 'FRONT/DIFFERENTIAL') {
      this.frontDiff.onSave();
    }
  }
  saveTechcheck(data) {
    var isFilled = true;
    if (this.rearDiff.form.invalid) {
      this.tabstrip.selectTab(0); isFilled = false;
    } else
      this.modelTechCheck.vehicleRearDiffrential = this.service.techCheckService.vehicleRearDiffrential;

    if (this.lights.form.invalid) {
      this.tabstrip.selectTab(1); isFilled = false;
    } else
      this.modelTechCheck.vehicleLights = this.service.techCheckService.vehicleLights;

    if (this.interior.form.invalid) {
      this.tabstrip.selectTab(2); isFilled = false;
    } else
      this.modelTechCheck.vehicleInterior = this.service.techCheckService.vehicleInterior;

    if (this.additionalItems.form.invalid) {
      this.tabstrip.selectTab(3); isFilled = false;
    } else
      this.modelTechCheck.vehicleAdditionalItems = this.service.techCheckService.vehicleAdditionalItems;

    if (this.fluiedLevel.form.invalid) {
      this.tabstrip.selectTab(4); isFilled = false;
    } else
      this.modelTechCheck.vehicleFluidLevels = this.service.techCheckService.vehicleFluidLevels;

    if (this.engine.form.invalid) {
      this.tabstrip.selectTab(5); isFilled = false;
    } else
      this.modelTechCheck.vehicleEngine = this.service.techCheckService.vehicleEngine;

    if (this.transmission.form.invalid) {
      this.tabstrip.selectTab(6); isFilled = false;
    } else
      this.modelTechCheck.vehicleTransmissionTransferCase = this.service.techCheckService.vehicleTransmissionTransferCase;

    if (this.frontDiff.form.invalid) {
      this.tabstrip.selectTab(7); isFilled = false;
    } else
      this.modelTechCheck.vehicleFrontDiffrential = this.service.techCheckService.vehicleFrontDiffrential;



    this.modelTechCheck.techComplete = true;

    if (this.supervisorApprovalData) {
      this.modelTechCheck.mgmtApprove = true;
      this.modelTechCheck.manager = this.supervisorApprovalData;
    } 
    if (isFilled) {
      this.modelTechCheck.vehicleLights.lightCleanliness = this.service.techCheckService.vehicleLights.lightCleanliness;
      this.modelTechCheck.brakeLights = this.service.techCheckService.vehicleLights.brakeLights;
      this.modelTechCheck.battery = this.service.techCheckService.vehicleEngine.battery;
      this.modelTechCheck.oilLeaks = this.service.techCheckService.vehicleEngine.oilLeaks;
      this.modelTechCheck.fuelLeaks = this.service.techCheckService.vehicleEngine.fuelLeaks;
      this.modelTechCheck.coolantReservoir = this.service.techCheckService.vehicleFluidLevels.coolantReservoir;
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
  onSupervisorApproval() {
    this.displaySupervisorApproval != this.displaySupervisorApproval;
  }
  checkFields(obj) {
    if (this.selectedTab == 'REAR/DIFFERENTIAL') {
      if (obj == true)
        this.isRearDiffFilled = true;
      else
        this.isRearDiffFilled = false;
    } else if (this.selectedTab == 'LIGHTS') {
      if (obj == true)
        this.isLightsFilled = true;
      else
        this.isLightsFilled = false;
    } else if (this.selectedTab == 'INTERIOR') {
      if (obj == true)
        this.isInteriorFilled = true;
      else
        this.isInteriorFilled = false;
    } else if (this.selectedTab == 'ADDITIONAL ITEMS') {
      if (obj == true)
        this.isAdditionalItemsFilled = true;
      else
        this.isAdditionalItemsFilled = false;
    } else if (this.selectedTab == 'FLUID LEVELS') {
      if (obj == true)
        this.isFluiedLevelFilled = true;
      else
        this.isFluiedLevelFilled = false;
    } else if (this.selectedTab == 'ENGINE') {
      if (obj == true)
        this.isEngineFilled = true;
      else
        this.isEngineFilled = false;
    } else if (this.selectedTab == 'TRANSMISSION/TRANSFER CASE') {
      if (obj == true)
        this.isTransmissionFilled = true;
      else
        this.isTransmissionFilled = false;
    } else if (this.selectedTab == 'FRONT/DIFFERENTIAL') {
      if (obj == true)
        this.isFrontDiffFilled = true;
      else
        this.isFrontDiffFilled = false;
    }
  }
  checkAllFields(obj) {
    Object.keys(this.modelTechCheck.vehicleRearDiffrential).forEach(prop => {
      if (this.modelTechCheck.vehicleRearDiffrential[prop]) {
        this.isRearDiffFilled = true;
      } else {
        this.isRearDiffFilled = false;
      }
    });
    Object.keys(this.modelTechCheck.vehicleLights).forEach(prop => {
      if (this.modelTechCheck.vehicleLights[prop]) {
        this.isLightsFilled = true;
      } else {
        this.isLightsFilled = false;
      }
    });
    Object.keys(this.modelTechCheck.vehicleInterior).forEach(prop => {
      if (this.modelTechCheck.vehicleInterior[prop]) {
        this.isInteriorFilled = true;
      } else {
        this.isInteriorFilled = false;
      }
    });
    Object.keys(this.modelTechCheck.vehicleAdditionalItems).forEach(prop => {
      if (this.modelTechCheck.vehicleAdditionalItems[prop]) {
        this.isAdditionalItemsFilled = true;
      } else {
        this.isAdditionalItemsFilled = false;
      }
    });
    Object.keys(this.modelTechCheck.vehicleFluidLevels).forEach(prop => {
      if (this.modelTechCheck.vehicleFluidLevels[prop]) {
        this.isFluiedLevelFilled = true;
      } else {
        this.isFluiedLevelFilled = false;
      }
    });
    Object.keys(this.modelTechCheck.vehicleEngine).forEach(prop => {
      if (this.modelTechCheck.vehicleEngine[prop]) {
        this.isEngineFilled = true;
      } else {
        this.isEngineFilled = false;
      }
    });
    Object.keys(this.modelTechCheck.vehicleTransmissionTransferCase).forEach(prop => {
      if (this.modelTechCheck.vehicleTransmissionTransferCase[prop]) {
        this.isTransmissionFilled = true;
      } else {
        this.isTransmissionFilled = false;
      }
    });
    Object.keys(this.modelTechCheck.vehicleFrontDiffrential).forEach(prop => {
      if (this.modelTechCheck.vehicleFrontDiffrential[prop]) {
        this.isFrontDiffFilled = true;
      } else {
        this.isFrontDiffFilled = false;
      }
    });
  }
  private onError(error: any, customMessage?: string) {
    this.errorHandler.handleError(error, "Tech Check", customMessage);
  }
}
