import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { TabStripComponent } from '@progress/kendo-angular-layout';
import { ErrorMessages } from 'src/app/core/constant';
import { ErrorHandlerService } from 'src/app/core/services';
import { DropdownService } from 'src/app/core/services/dropdown.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { ServiceOrderService } from '../../service-order/service-order.service';
import { BreaksHitchLatchComponent } from '../../serviceorderpage/tech-check-popup/breaks-hitch-latch/breaks-hitch-latch.component';
import { CommentsTechCheckComponent } from '../../serviceorderpage/tech-check-popup/comments/comments-techcheck.component';

import { DeckingComponent } from '../../serviceorderpage/tech-check-popup/decking/decking.component';
import { ElectricalSystemComponent } from '../../serviceorderpage/tech-check-popup/electrical-system/electrical-system.component';
import { RegulatoryRequirementComponent } from '../../serviceorderpage/tech-check-popup/regulatory-requirement/regulatory-requirement.component';
import { TechCheckModel } from '../../serviceorderpage/tech-check-popup/techCheck.model';
import { TiresAxleComponent } from '../../serviceorderpage/tech-check-popup/tires-axle/tires-axle.component';

@Component({
  selector: 'app-tech-check-trailer',
  templateUrl: './tech-check-trailer.component.html',
  styleUrls: ['./tech-check-trailer.component.scss']
})
export class TechCheckTrailerComponent implements OnInit {
  @ViewChild('tabstrip') public tabstrip: TabStripComponent;

  @Output() closeChecklistPopup: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild(TiresAxleComponent) tiresAxle: TiresAxleComponent;
  @ViewChild(BreaksHitchLatchComponent) brakes: BreaksHitchLatchComponent;
  @ViewChild(ElectricalSystemComponent) electrical: ElectricalSystemComponent;
  @ViewChild(DeckingComponent) decking: DeckingComponent;
  @ViewChild(RegulatoryRequirementComponent) regulatory: RegulatoryRequirementComponent;
  @ViewChild(CommentsTechCheckComponent) comments: CommentsTechCheckComponent;

  selectedTab: any = 'TIRES/AXLE';
  supervisorApprovalData: any;
  supervisorApprovalList: any;
  mgmtApprove: boolean = false;
  techComplete: boolean = false;
  isTiresFilled: boolean = false;
  isBrakesFilled: boolean = false;
  isElectricalFilled: boolean = false;
  isDECKINGFilled: boolean = false;
  isREGULATORYFilled: boolean = false;
  isCOMMENTSFilled: boolean = false;

  constructor(public dropdownService: DropdownService, public service: ServiceOrderService, private utils: UtilityService, public errorHandler: ErrorHandlerService) { }
  modelTechCheck: TechCheckModel;
  displaySupervisorApproval: true;

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
        this.service.techCheckService.trailerTires = this.modelTechCheck.trailerTires;
        this.service.techCheckService.trailerBrakes = this.modelTechCheck.trailerBrakes;
        this.service.techCheckService.trailerElectricalSystem = this.modelTechCheck.trailerElectricalSystem;
        this.service.techCheckService.trailerDecking = this.modelTechCheck.trailerDecking;
        this.service.techCheckService.trailerRegulatory = this.modelTechCheck.trailerRegulatory;
        this.service.techCheckService.comments = this.modelTechCheck.comments;
        this.tiresAxle.setData(res);
        this.checkAllFields(data);
        //this.cooling.setData(res.cooling); 
        if(this.techComplete){
          this.tiresAxle.form.disable();
          this.brakes.form.disable();
          this.electrical.form.disable();
          this.decking.form.disable();
          this.regulatory.form.disable();
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
    if (this.selectedTab == 'TIRES/AXLE') {
      setTimeout(() => {
        if (this.tiresAxle)
          this.tiresAxle.setData(this.modelTechCheck);
      }, 200);
    }
    else if (this.selectedTab == 'BRAKES/HITCH AND LITCH') {
      setTimeout(() => {
        if (this.brakes)
          this.brakes.setData(this.modelTechCheck);
      }, 200);
    }
    else if (this.selectedTab == 'ELECTRICAL SYSTEM') {
      setTimeout(() => {
        if (this.electrical)
          this.electrical.setData(this.modelTechCheck);
      }, 200);
    }
    else if (this.selectedTab == 'DECKING') {
      setTimeout(() => {
        if (this.decking)
          this.decking.setData(this.modelTechCheck.trailerDecking);
      }, 200);
    }
    else if (this.selectedTab == 'REGULATORY/REQUIREMENT') {
      setTimeout(() => {
        if (this.regulatory)
          this.regulatory.setData(this.modelTechCheck.trailerRegulatory);
      }, 200);
    } else if (this.selectedTab == 'COMMENTS') {
      setTimeout(() => {
        if (this.comments)
          this.comments.setData(this.modelTechCheck.comments);
      }, 200);
    }
  }
  onSave() {
    if (this.selectedTab == 'TIRES/AXLE') {
      this.tiresAxle.onSave();
    } else if (this.selectedTab == 'BRAKES/HITCH AND LITCH') {
      this.brakes.onSave();
    } else if (this.selectedTab == 'ELECTRICAL SYSTEM') {
      this.electrical.onSave();
    } else if (this.selectedTab == 'DECKING') {
      this.decking.onSave();
    } else if (this.selectedTab == 'REGULATORY/REQUIREMENT') {
      this.regulatory.onSave();
    } else if (this.selectedTab == 'COMMENTS') {
      this.comments.onSave();
    }
  }
  saveTechcheck(data) {
    var isFilled = true;
    if (this.tiresAxle.form.invalid) {
      this.tabstrip.selectTab(0); isFilled = false;
    } else
      this.modelTechCheck.trailerTires = this.service.techCheckService.trailerTires;

    if (this.brakes.form.invalid) {
      this.tabstrip.selectTab(1); isFilled = false;
    } else
      this.modelTechCheck.trailerBrakes = this.service.techCheckService.trailerBrakes;

    if (this.electrical.form.invalid) {
      this.tabstrip.selectTab(2); isFilled = false;
    } else
      this.modelTechCheck.trailerElectricalSystem = this.service.techCheckService.trailerElectricalSystem;

    if (this.decking.form.invalid) {
      this.tabstrip.selectTab(3); isFilled = false;
    } else
      this.modelTechCheck.trailerDecking = this.service.techCheckService.trailerDecking;

    if (this.regulatory.form.invalid) {
      this.tabstrip.selectTab(4); isFilled = false;
    } else
      this.modelTechCheck.trailerRegulatory = this.service.techCheckService.trailerRegulatory;
    if (this.comments.form.invalid) {
      this.tabstrip.selectTab(5); isFilled = false;
    } else
      this.modelTechCheck.comments = this.service.techCheckService.comments;
 
    this.modelTechCheck.techComplete = true;
    if (this.supervisorApprovalData) {
      this.modelTechCheck.mgmtApprove = true;
      this.modelTechCheck.manager = this.supervisorApprovalData;
    }
    
    if (isFilled) {
      this.modelTechCheck.tires = this.service.techCheckService.trailerTires.tires;
      this.modelTechCheck.bearings = this.service.techCheckService.trailerTires.bearings;
      this.modelTechCheck.hubs = this.service.techCheckService.trailerTires.seal; 
      this.modelTechCheck.brakeLights = this.service.techCheckService.trailerElectricalSystem.brakeLights; 
      this.modelTechCheck.brakeActuator =this.service.techCheckService.trailerBrakes.brakeActuator;
      this.modelTechCheck.pintleHitch =this.service.techCheckService.trailerBrakes.pintleHitch;
      
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
    if (this.selectedTab == 'TIRES/AXLE') {
      if (obj == true)
        this.isTiresFilled = true;
      else
        this.isTiresFilled = false;
    } else if (this.selectedTab == 'BRAKES/HITCH AND LITCH') {
      if (obj == true)
        this.isBrakesFilled = true;
      else
        this.isBrakesFilled = false;
    } else if (this.selectedTab == 'ELECTRICAL SYSTEM') {
      if (obj == true)
        this.isElectricalFilled = true;
      else
        this.isElectricalFilled = false;
    } else if (this.selectedTab == 'DECKING') {
      if (obj == true)
        this.isDECKINGFilled = true;
      else
        this.isDECKINGFilled = false;
    } else if (this.selectedTab == 'REGULATORY/REQUIREMENT') {
      if (obj == true)
        this.isREGULATORYFilled = true;
      else
        this.isREGULATORYFilled = false;
    } else if (this.selectedTab == 'COMMENTS') {
      if (obj == true)
        this.isCOMMENTSFilled = true;
      else
        this.isCOMMENTSFilled = false;
    }
  }

  checkAllFields(obj) {
    Object.keys(this.modelTechCheck.trailerTires).forEach(prop => {
      if (this.modelTechCheck.trailerTires[prop]) {
        this.isTiresFilled = true;
      } else {
        this.isTiresFilled = false;
      }
    });
    Object.keys(this.modelTechCheck.trailerBrakes).forEach(prop => {
      if (this.modelTechCheck.trailerBrakes[prop]) {
        this.isBrakesFilled = true;
      } else {
        this.isBrakesFilled = false;
      }
    });
    Object.keys(this.modelTechCheck.trailerElectricalSystem).forEach(prop => {
      if (this.modelTechCheck.trailerElectricalSystem[prop]) {
        this.isElectricalFilled = true;
      } else {
        this.isElectricalFilled = false;
      }
    });
    Object.keys(this.modelTechCheck.trailerDecking).forEach(prop => {
      if (this.modelTechCheck.trailerDecking[prop]) {
        this.isDECKINGFilled = true;
      } else {
        this.isDECKINGFilled = false;
      }
    });
    Object.keys(this.modelTechCheck.trailerRegulatory).forEach(prop => {
      if (this.modelTechCheck.trailerRegulatory[prop]) {
        this.isREGULATORYFilled = true;
      } else {
        this.isREGULATORYFilled = false;
      }
    });
    Object.keys(this.modelTechCheck.comments).forEach(prop => {
      if (this.modelTechCheck.comments[prop]) {
        this.isCOMMENTSFilled = true;
      } else {
        this.isCOMMENTSFilled = false;
      }
    });
  }
  private onError(error: any, customMessage?: string) {
    this.errorHandler.handleError(error, "Tech Check", customMessage);
  }
}
