import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { FormsModule, NgModel } from '@angular/forms';
import { IconsModule } from '@progress/kendo-angular-icons';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { IntlModule } from '@progress/kendo-angular-intl';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { FloatingLabelModule } from '@progress/kendo-angular-label';
import { PagerModule } from '@progress/kendo-angular-pager';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { GridModule } from '@progress/kendo-angular-grid';
import { ChartsModule } from '@progress/kendo-angular-charts';
import { SharedModule } from './../../../../src/app/shared/shared.module';
import { ServiceOrderPageComponent } from './serviceorder/serviceorderpage/serviceorderpage.component';
import { ServiceOrderComponent } from './serviceorder/service-order/service-order.component';
import { ServiceHistoryComponent } from './serviceorder/service-history/service-history.component';
import { ServiceEstimateComponent } from './serviceorder/service-estimate/service-estimate.component';
import { ServiceBOMComponent } from './serviceorder/service-bom/service-bom.component';
import { ServiceOrderRoutingModule } from './serviceorder-routing.module';
import { FuelOilTechCheckComponent } from './serviceorder/serviceorderpage/tech-check-popup/fuel-oil/fuel-oil-techcheck.component';
import { BatteryTechCheckComponent } from './serviceorder/serviceorderpage/tech-check-popup/battery/battery-techcheck.component';
import { CoolingTechCheckComponent } from './serviceorder/serviceorderpage/tech-check-popup/cooling/cooling-techcheck.component';
import { CouplerTechCheckComponent } from './serviceorder/serviceorderpage/tech-check-popup/coupler/coupler-techcheck.component';
import { ElectrickTechCheckComponent } from './serviceorder/serviceorderpage/tech-check-popup/electrical/electrical-techcheck.component';
import { EnvironBoxTechCheckComponent } from './serviceorder/serviceorderpage/tech-check-popup/environbox/environbox-techcheck.component';
import { ExcaustTechCheckComponent } from './serviceorder/serviceorderpage/tech-check-popup/exhaust/exhaust-techcheck.component';
import { CommentsTechCheckComponent } from './serviceorder/serviceorderpage/tech-check-popup/comments/comments-techcheck.component';
import { EngineTechCheckComponent } from './serviceorder/serviceorderpage/tech-check-popup/engine/engine-techcheck.component';
import { CentralpumpTechCheckComponent } from './serviceorder/serviceorderpage/tech-check-popup/centalpump/centalpump-techcheck.component';
import { CompressorTechCheckComponent } from './serviceorder/serviceorderpage/tech-check-popup/compressor/compressor-techcheck.component';
import { TrailerTechCheckComponent } from './serviceorder/serviceorderpage/tech-check-popup/trailer/trailer-techcheck.component';
import { ServiceCommmonHistoryComponent } from './serviceorder/history/service-history.component';
import { ServiceOrderNotesComponent } from './serviceorder/notes/notes.component';
import { SparePartsComponent } from './spareparts/spareparts.component';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { CentrifugalPumpComponent } from './serviceorder/serviceorderpage/tech-check-popup/centrifugal-pump/centrifugal-pump.component';
import { TrailerCheckComponent } from './serviceorder/serviceorderpage/tech-check-popup/trailer-check/trailer-check.component';
import { CouplerAlignCheckComponent } from './serviceorder/serviceorderpage/tech-check-popup/coupler-align-check/coupler-align-check.component';
import { AirSeparationComponent } from './serviceorder/serviceorderpage/tech-check-popup/air-separation/air-separation.component';
import { TestVaccumPumpComponent } from './serviceorder/serviceorderpage/tech-check-popup/test-vaccum-pump/test-vaccum-pump.component';
import { TechCheckModelComponent } from './serviceorder/tech-check/tech-check-model/tech-check-model.component';
import { TechCheckWpComponent } from './serviceorder/tech-check/tech-check-wp/tech-check-wp.component';
import { TechCheckTrailerComponent } from './serviceorder/tech-check/tech-check-trailer/tech-check-trailer.component';
import { TechCheckListComponent } from './serviceorder/tech-check/tech-check-list/tech-check-list.component';
import { TiresAxleComponent } from './serviceorder/serviceorderpage/tech-check-popup/tires-axle/tires-axle.component';
import { BreaksHitchLatchComponent } from './serviceorder/serviceorderpage/tech-check-popup/breaks-hitch-latch/breaks-hitch-latch.component';
import { ElectricalSystemComponent } from './serviceorder/serviceorderpage/tech-check-popup/electrical-system/electrical-system.component';
import { DeckingComponent } from './serviceorder/serviceorderpage/tech-check-popup/decking/decking.component';
import { RegulatoryRequirementComponent } from './serviceorder/serviceorderpage/tech-check-popup/regulatory-requirement/regulatory-requirement.component';
import { NetworkDirectoryModule } from '../networkdirectory/networkdirectory.module';
import { CranesMainComponent } from './cranes/cranes-main/cranes-main.component';
import { CraneInfoComponent } from './cranes/crane-info/crane-info.component';
import { CraneActivityComponent } from './cranes/crane-activity/crane-activity.component';
import { CraneNotesComponent } from './cranes/crane-notes/crane-notes.component';
import { CraneHistoryComponent } from './cranes/crane-history/crane-history.component';
import { TechCheckVehicleComponent } from './serviceorder/tech-check/tech-check-vehicle/tech-check-vehicle.component';
import { RearDifferentialComponent } from './serviceorder/serviceorderpage/tech-check-popup/rear-differential/rear-differential.component';
import { FrontDifferentialComponent } from './serviceorder/serviceorderpage/tech-check-popup/front-differential/front-differential.component';
import { LightsComponent } from './serviceorder/serviceorderpage/tech-check-popup/lights/lights.component';
import { InteriorComponent } from './serviceorder/serviceorderpage/tech-check-popup/interior/interior.component';
import { AdditionalItemsComponent } from './serviceorder/serviceorderpage/tech-check-popup/additional-items/additional-items.component';
import { FluidLevelsComponent } from './serviceorder/serviceorderpage/tech-check-popup/fluid-levels/fluid-levels.component';
import { VehicleEngineComponent } from './serviceorder/serviceorderpage/tech-check-popup/vehicle-engine/vehicle-engine.component';
import { TrasmissionTransferCaseComponent } from './serviceorder/serviceorderpage/tech-check-popup/trasmission-transfer-case/trasmission-transfer-case.component';
import { FieldNotesComponent } from './field-notes/field-notes.component';
import { FieldFailureComponent } from './field-failure/field-failure.component';
import { ServiceDocsComponent } from './service-docs/service-docs.component';
import { TreeViewModule } from '@progress/kendo-angular-treeview';
@NgModule({
  imports: [
    CommonModule,
    ServiceOrderRoutingModule,
    FormsModule,
    LayoutModule,
    IconsModule,
    InputsModule,
    LabelModule,
    ButtonsModule,
    DropDownsModule,
    IntlModule,
    DateInputsModule,
    CommonModule,
    ChartsModule,
    TooltipModule,
    GridModule,
    FloatingLabelModule,
    PagerModule,
    SharedModule,
    IndicatorsModule,
    NetworkDirectoryModule,
    TreeViewModule
  ],
  declarations: [
    ServiceOrderPageComponent,
    ServiceOrderComponent,
    ServiceHistoryComponent,
    ServiceEstimateComponent,
    ServiceBOMComponent,
    FuelOilTechCheckComponent,
    BatteryTechCheckComponent,
    CoolingTechCheckComponent,
    CouplerTechCheckComponent,
    ElectrickTechCheckComponent,
    EnvironBoxTechCheckComponent,
    ExcaustTechCheckComponent,
    CommentsTechCheckComponent,
    EngineTechCheckComponent,
    CentralpumpTechCheckComponent,
    CompressorTechCheckComponent,
    TrailerTechCheckComponent,
    ServiceCommmonHistoryComponent,
    ServiceOrderNotesComponent,
    SparePartsComponent,
    CentrifugalPumpComponent,
    TrailerCheckComponent,
    CouplerAlignCheckComponent,
    AirSeparationComponent,
    TestVaccumPumpComponent,
    TechCheckModelComponent,
    TechCheckWpComponent,
    TechCheckTrailerComponent,
    TechCheckListComponent,
    TiresAxleComponent,
    BreaksHitchLatchComponent,
    ElectricalSystemComponent,
    DeckingComponent,
    RegulatoryRequirementComponent,
    CranesMainComponent,
    CraneInfoComponent,
    CraneActivityComponent,
    CraneNotesComponent,
    CraneHistoryComponent,
    AirSeparationComponent,
    TechCheckVehicleComponent,
    RearDifferentialComponent,
    FrontDifferentialComponent,
    LightsComponent,
    InteriorComponent,
    AdditionalItemsComponent,
    FluidLevelsComponent,
    VehicleEngineComponent,
    TrasmissionTransferCaseComponent,
    FieldFailureComponent,
    FieldNotesComponent,
    ServiceDocsComponent,
  ],
  bootstrap: [ServiceOrderPageComponent],
})
export class ServiceOrderModule {}
