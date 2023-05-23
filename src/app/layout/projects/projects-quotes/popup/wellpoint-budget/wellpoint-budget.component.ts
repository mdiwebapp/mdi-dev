import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LineItemtoRentalQuoteModel, QuoteBudgetViewRequestModel, WellpointBudgetModel } from './../../../projects.model';
import { ProjectService } from './../../../projects.service';
import {
  preDrillingData,
  fuelCubeData,
  pumpSizedataWP,
  dischargeTypeData,
  pipeSizeData,
  containmentData,
  provideFilterDataWP,
  holePunchData,
  excavatorData,
} from '../../../../../../data/projectdata';
import { UtilityService } from 'src/app/core/services/utility.service';
import { NetworkDirectoryService } from 'src/app/layout/networkdirectory/networkdirectorypage/networkdirectory.service';
import * as fileSaver from 'file-saver';

@Component({
  selector: 'app-wellpoint-budget',
  templateUrl: './wellpoint-budget.component.html',
  styleUrls: ['./wellpoint-budget.component.scss'],
})
export class WellpointBudgetComponent implements OnInit {
  form: FormGroup;
  provideData: any = provideFilterDataWP;
  holePunchData: any = holePunchData;
  preDrillingData: any = preDrillingData;
  pumpSizeData: any = pumpSizedataWP;
  fuelCubeData: any = fuelCubeData;
  containmentData: any = containmentData;
  sedimentationtrapData: [];
  dischargeData: any = dischargeTypeData;
  pipeSizeData: any = pipeSizeData;
  excavatorData:any=excavatorData;
  public opened = false;
  seletedRow: any;
  public lblAlert = 'Are you sure';
  public lbltitle = '';
  fileList = [
    {
      fileName: 'Wisdom.Pump.txt',
    },
  ];
  quoteBudgetViewRequestModel: QuoteBudgetViewRequestModel;
  lineItemtoRentalQuoteModel: LineItemtoRentalQuoteModel;
  wellpointBudgetModel: WellpointBudgetModel;
  displayPreDrilingType: boolean = false;
  displayFuelText: boolean = false; 
  wellpoints: number;
  daysOfInstallation: number;
  daysOfPickup: number;
  driveTime: number;
  outOfTown: string = '';
  daysPerTruckLoad: number;
  footage: number;
  wellsspacing: number;
  poDrill: number;
  prodInstall: number;
  hours: number=0;
  dblHours: number=0;
  modHours: number=0;
  outOfTownJobs: string = '';
  lowBoyFloats: number;
  miles: number=0;
  colorCode: string = '';
  openedCalculate: boolean = false;
  showCreateBudget: boolean = false;
  isLoaded: boolean = false;
  CalculateMeassage: string = 'Calculate';
  calculateButtonColor: string = '';
  isDisabled: boolean = false;
  nothingToLoad: boolean = false;
  tractorLoads: number;
  dischargeTypeSelected: string = '';
  provideType: string = '';
  isErrorMessage: boolean = false;
  errorMessage: string = '';
  visible: boolean;
  isLoaderVisible: boolean=false;
  isDisplayeHoseSize: boolean;
  @Input() detailJobNumber: number;
  @Input() detailBranch: string;;
  @Output() backButtonEvent = new EventEmitter();
  wellpointData: any;
  jobBranch:string;
  valuesFile = {
    directoryPath: '\\\\192.168.0.9\\Mersino\\03  Logistics\\FLEET BOOKS',
    userName: 'MERSINO\\jagdip.joshi',
    password: 'oPDe8GP!SW83HNJS',
  } as any;
  constructor(
    private formBuilder: FormBuilder,
    public projectService: ProjectService, public utility: UtilityService, public networkService: NetworkDirectoryService
  ) { }
  ngOnInit() {
    this.initForm();this.createQuoteBudgetViewRequestModel();
  }

  initForm(): void {
    this.form = this.formBuilder.group({
      milesToTheJob: [],
      headerFootageText: [],
      pointSpacingText: [],
      provideType: [],
      holePunchType: [],
      preDrillingType: [],
      jettingText: [],
      HoursDayText: [],
      txtTractorLoads: [],
      crewSetupText: [],
      crewPickupText: [],
      pumpSizeType: [],
      fuelCubeType: [],
      containmentType: [],
      sedimentationtrapType: [],
      dischargeFootageText: [],
      dischargeType: [],
      fusesHourText: [],
      pipeSizeType: [],
      excavatorType: [],
    });
  }

  onRefreshFileList() { this.getFileList(); }
  getFileList() {
    this.isLoaderVisible = true;
    this.valuesFile.directoryPath =
      '\\\\192.168.0.2\\Mersino\\02  Operations\\JOB BOOKS\\' + this.detailJobNumber + '\\03 - SPREADSHEET & COST ANALYSIS\\';
    this.networkService.GetDirectoryDetails(this.valuesFile).subscribe(
      (res) => {
        this.isLoaderVisible = false;
        this.fileList = res[0].files;

      },
      (error) => {
        //this.disablePicturesList = true;
      }
    );
  }
  public close(status) {
    if (status == 'yes') {
      this.opened = !this.opened;
      this.lineItemtoRentalQuoteModel = new LineItemtoRentalQuoteModel();
      if (this.seletedRow && this.seletedRow.name.toString().includes(this.detailJobNumber + '-WP Budget')) {
        this.lineItemtoRentalQuoteModel.path = this.seletedRow.path;
        this.lineItemtoRentalQuoteModel.jobNumber = this.wellpointData.jobNumber;
        this.lineItemtoRentalQuoteModel.quoteNumber = 0;
        this.projectService
          .addLineItemstoQuotes(this.lineItemtoRentalQuoteModel)
          .subscribe((res) => {
            if (res.status == 200) {
              this.utility.toast.success(res.message);
            }
          });
      } else {
        this.utility.toast.error('Please select any other file.');
      }
    } else if (status == 'no') {
      this.opened = !this.opened;
    } else {
      this.opened = !this.opened;
    }
  }
  alertType: number;
  onGridSelect($event) {
    this.seletedRow = $event.selectedRows[0].dataItem;
  }
  public onRentalQuote() {
    if (this.seletedRow != undefined) {
      this.lbltitle = 'Add Items To Rental';
      this.lblAlert =
        'Do you want to add the Line Items from the selected Excel file into the Rental Tab?';
    } else {
      this.lbltitle = 'MDI3.0';
      this.lblAlert =
        'You must select an Excel file from the list to load into the Maintain Projects Rental Tab';
    }
    this.opened = !this.opened;
  }
  onBack() {
    this.backButtonEvent.emit();
  }

  onCalculate() {
    // if(!this.isLoaded)
    // {
    //   this.openedCalculate = !this.openedCalculate;
    // }
    // else
    // {
    this.getformErrors();
    //}
    this.showCreateBudget = !this.showCreateBudget;
  }
  closeErrorMessage() {
    this.isErrorMessage = !this.isErrorMessage;
  }
  onCreateBudget() {
    this.wellpointBudgetModel = new WellpointBudgetModel();
    this.wellpointBudgetModel.id = this.wellpointData ? this.wellpointData.pk : 0;
    this.wellpointBudgetModel.budgetType = 'WP';
    this.wellpointBudgetModel.userName = JSON.parse(localStorage.getItem('currentUser')).userName;
    this.wellpointBudgetModel.user_PK = JSON.parse(localStorage.getItem('currentUser')).id;
    this.wellpointBudgetModel.quoteType = "WP";
    this.wellpointBudgetModel.quoteNumber = this.wellpointData ? this.wellpointData.quoteNumber : 0;
    this.wellpointBudgetModel.miles = this.form.value.milesToTheJob;
    this.wellpointBudgetModel.branch = this.jobBranch;
    // if (this.form.value.wellsQty)
    //   this.wellpointBudgetModel.wellsQTY = this.form.value.wellsQty;
    // else
    //   this.wellpointBudgetModel.wellsQTY = null;
    // if (!this.form.value.wellsQty) {
      this.wellpointBudgetModel.wellsFootage = this.form.value.headerFootageText;
      this.wellpointBudgetModel.wellsSpacing = this.form.value.pointSpacingText;
    // } else {
    //   this.wellpointBudgetModel.wellsFootage = null;
    //   this.wellpointBudgetModel.wellsSpacing = null;
    // }
    this.wellpointBudgetModel.wellsDepth = this.form.value.depthWellsText;
    this.wellpointBudgetModel.filter = this.form.value.provideFilterType == null ? false : (this.form.value.provideFilterType == 'NO' ? false : true);
    this.wellpointBudgetModel.drillRig = this.form.value.drillRigType;
    this.wellpointBudgetModel.pumpSize = this.form.value.pumpSizeType;
    this.wellpointBudgetModel.fuelCubes = this.form.value.fuelCubeType == null ? false : (this.form.value.fuelCubeType == 'NO' ? false : true);
    this.wellpointBudgetModel.containment = this.form.value.containmentType == null ? false : (this.form.value.containmentType == 'NO' ? false : true);
    this.wellpointBudgetModel.power = this.form.value.providingPowerType == null ? false : (this.form.value.providingPowerType == 'NO' ? false : true);
    this.wellpointBudgetModel.gen1Qty = this.form.value.gen1Text;
    this.wellpointBudgetModel.gen1ItemCode = this.form.value.gen1Type;
    this.wellpointBudgetModel.gen2Qty = this.form.value.gen2Text;
    this.wellpointBudgetModel.gen2ItemCode = this.form.value.gen2Type;
    this.wellpointBudgetModel.gen3Qty = this.form.value.gen3Text;
    this.wellpointBudgetModel.gen3ItemCode = this.form.value.gen3Type;
    this.wellpointBudgetModel.dischargeFootage = this.form.value.dischargeFootageText;
    this.wellpointBudgetModel.hdpePipe = this.form.value.dischargeType;
    this.wellpointBudgetModel.fusesPerHour = this.form.value.fusesHourText;
    this.wellpointBudgetModel.pipeSize = this.form.value.pipeSizeType;
    this.wellpointBudgetModel.sedTrap = this.form.value.sedimentationtrapType;
    this.wellpointBudgetModel.prodDrill = this.daysOfInstallation;
    this.wellpointBudgetModel.prodInstall = null;
    this.wellpointBudgetModel.hoursPerDay = this.form.value.HoursDayText;
    this.wellpointBudgetModel.tractorLoads = this.form.value.txtTractorLoads;
    this.wellpointBudgetModel.loader = this.form.value.excavatorType == 'YES' ? true : (this.form.value.excavatorType == 'NO' ? false : false);
    this.wellpointBudgetModel.preDrill = this.form.value.preDrillingType == 'YES' ? true : false;
    this.wellpointBudgetModel.punch = this.wellpointData ? this.wellpointData.punch == null ? false : (this.form.value.punch == 'NO' ? false : true) : false;
    this.wellpointBudgetModel.fork = this.form.value.forkliftnOperatorType == null ? false : (this.form.value.forkliftnOperatorType == 'NO' ? false : true);
    this.wellpointBudgetModel.crewSize = this.form.value.crewSetupText;
    this.wellpointBudgetModel.pickUpCrewSize = this.form.value.crewPickupText;
    this.wellpointBudgetModel.createdDate = new Date().toISOString();
    this.wellpointBudgetModel.createdBy = JSON.parse(localStorage.getItem('currentUser')).userId;
    this.wellpointBudgetModel.jobNumber = this.detailJobNumber;
    this.wellpointBudgetModel.truckDaysPerLoad = Number.isNaN(this.daysPerTruckLoad) ? 0 : this.daysPerTruckLoad;///
    this.wellpointBudgetModel.driveTime = this.driveTime;
    this.wellpointBudgetModel.lowboyFloats = this.lowBoyFloats;
    this.wellpointBudgetModel.prodRemove = this.daysOfPickup;
    this.wellpointBudgetModel.perdiem = this.outOfTownJobs;
    this.wellpointBudgetModel.pumpSizeIndex = this.pumpSizeData.findIndex(x => x.value == this.form.value.pumpSizeType);
    this.wellpointBudgetModel.numbersOfWells = this.wellpoints;
    this.wellpointBudgetModel.pipeSizeIndex = this.pipeSizeData.findIndex(x => x.value == this.form.value.pipeSizeType);;
    this.wellpointBudgetModel.hdpePipeSizeIndex = this.dischargeData.findIndex(x => x.value == this.form.value.dischargeType);;    
    this.wellpointBudgetModel.stickBoomCasings='';
    this.wellpointBudgetModel.stickBoomPumps='';
    this.wellpointBudgetModel.modHours=this.modHours;
    this.wellpointBudgetModel.filterSizeIndex = this.form.value.provideType =='None'?0:(this.form.value.provideType =='Sand'?1:(this.form.value.provideType =='Aggregate'?2:null));
    this.wellpointBudgetModel.jettingText=this.form.value.jettingText;
    this.wellpointBudgetModel.pumpIndex=this.form.value.holePunchType=='YES'?1:0;
    
    this.isLoaderVisible=true;
    this.projectService
      .createWellpointBudget(this.wellpointBudgetModel)
      .subscribe((res) => {
        this.isLoaderVisible=false;
        //this.utility.toast.success('Please wait, file will be downloaded.');
        if (res.size > 0) {
          let data = new Blob([res], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;',
          });
          fileSaver.saveAs(
            data, this.detailJobNumber
            + '- WP budget -' +
            new Date().toLocaleDateString('en-US') +
          '.xlsx'
          );

        }
      });
  }
  changepreDrillingType(value) {
    if (value == 'YES') {
      this.displayPreDrilingType = true;
    } else {
      this.displayPreDrilingType = false;
    }
  }
  changeFuelCubesType(value) {
    if (value == 'YES') {
      this.displayFuelText = true;
    } else {
      this.displayFuelText = false;
    }
  }
  closeCalcualte() {
    this.openedCalculate = !this.openedCalculate;
  }
  closeNothingToLoad() {
    this.nothingToLoad = !this.nothingToLoad;
  }
  //#region Bind Form
  getDetails() {
    this.createQuoteBudgetViewRequestModel();
    this.projectService
      .getDeepWell(this.quoteBudgetViewRequestModel)
      .subscribe((res) => {
        console.log(res);
        if (res.length > 0) {
          this.setFormValues(res[0]);
        }
        else {
          this.nothingToLoad = !this.nothingToLoad;
        }
      });
  }
  createQuoteBudgetViewRequestModel() {
    this.quoteBudgetViewRequestModel = new QuoteBudgetViewRequestModel();
    this.quoteBudgetViewRequestModel.QuoteType = 'WP';
    this.quoteBudgetViewRequestModel.JobNumber = this.detailJobNumber;
    this.jobBranch  = this.detailBranch;
  }

  //#endregion
  //#region
  onLoadLastInput() {
    this.getDetails();
  }
  setFormValues(data) {
    this.wellpointData = data;
    this.footage = data.wellsFootage;
    this.wellsspacing = data.wellsSpacing;
    this.poDrill = data.prodDrill;
    this.hours = data.hoursPerDay;
    this.miles = data.miles;
    this.tractorLoads = data.tractorLoads;
    this.dischargeTypeSelected = data.hdpePipe;
    this.provideType = data.filter;
    this.form.setValue({
      milesToTheJob: data.miles,
      headerFootageText: data.wellsFootage,
      pointSpacingText: data.wellsSpacing,
      provideType: data.filter,
      holePunchType: data.punch == true ? 'YES' : 'NO',
      preDrillingType: data.preDrill == true ? 'YES' : 'NO',
      jettingText: data.prodDrill,
      HoursDayText: data.hoursPerDay,
      txtTractorLoads: data.tractorLoads,
      crewSetupText: data.crewSize,
      crewPickupText: data.pickUpCrewSize,
      excavatorType: data.loader== true ? 'YES' : 'NO',
      pumpSizeType: data.pumpSize,
      fuelCubeType: data.fuelCubes == true ? 'YES' : 'NO',
      containmentType: data.containment == true ? 'YES' : 'NO',
      sedimentationtrapType: data.sedTrap ?? 0,
      dischargeFootageText: data.dischargeFootage,
      dischargeType: data.hdpePipe,
      fusesHourText: data.fusesPerHour,
      pipeSizeType: data.pipeSize,
    });
    if(data.preDrill == true){
       this.displayPreDrilingType = true;
    }else{
       this.displayPreDrilingType = false;
    }
    this.isLoaded = true;
    this.ProvideFilter();
    this.visiblity();
    this.visiblePipeHoseSize();
    this.getFileList();
  }
  //#endregion

  //#region Calculate 
  Calculate() {
    this.CalculateMeassage = 'Unlock'
    this.calculateButtonColor = 'lightgreen';
    this.isDisabled = true;
    this.getFormControlValues();
    this.getHoursValues();   
    this.wellpoints = ((this.footage / this.wellsspacing) + 1);
    this.daysOfInstallation =Math.floor(this.wellpoints / this.poDrill);
    if (this.daysOfInstallation > 3) {
      this.daysOfInstallation = this.daysOfInstallation + 0.5;
    }
    else {
      this.daysOfInstallation = this.daysOfInstallation;
    }
    this.daysOfPickup = 1;

  }
  getHoursValues() {
    if (this.hours >= 8) {
      this.dblHours = this.hours - 8
    }
    else {
      this.dblHours = 0;
    }
    this.dblHours = this.dblHours * 1.5
    if (this.hours >= 8) {
      this.modHours = 8 + this.dblHours;
    }
    else {
      this.modHours = this.hours + this.dblHours;
    }
    this.dblHours = this.miles / 60;
    if (this.dblHours > 2) {
      this.driveTime = this.modHours;
    }
    else {
      this.driveTime = Math.ceil((this.dblHours * 2) + 0.5);
      //  ((this.dblHours * 2 + 0.5 ) ); // need to correct 
    }

    if (this.dblHours > 2) {
      this.outOfTownJobs = 'YES';
    }
    else {
      this.outOfTownJobs = 'NO';
    }
    this.daysPerTruckLoad = Math.ceil(this.driveTime / this.hours + 0.5)
    this.lowBoyFloats = 0;


  }
  resetFeild() {
    this.CalculateMeassage = 'Calculate'
    this.calculateButtonColor = 'yellow';
    this.isDisabled = false;
    this.wellpoints = null;
    this.daysOfInstallation = null;
    this.daysOfPickup = null;
    this.driveTime = null;
    this.daysPerTruckLoad = null;
    this.outOfTownJobs = '';
    this.lowBoyFloats = null;
  }
  getFormControlValues() {

    if (this.form.get('milesToTheJob').value != null || this.form.get('milesToTheJob').value != undefined || this.form.get('milesToTheJob').value != ' ') {
      this.miles = this.form.get('milesToTheJob').value;
    }
    if (this.form.get('headerFootageText').value != null || this.form.get('headerFootageText').value != undefined || this.form.get('headerFootageText').value != ' ') {
      this.footage = this.form.get('headerFootageText').value;
    }
    if (this.form.get('pointSpacingText').value != null || this.form.get('pointSpacingText').value != undefined || this.form.get('pointSpacingText').value != ' ') {
      this.wellsspacing = this.form.get('pointSpacingText').value;
    }
    if (this.form.get('jettingText').value != null || this.form.get('jettingText').value != undefined || this.form.get('jettingText').value != ' ') {
      this.poDrill = this.form.get('jettingText').value;
    }
    if (this.form.get('HoursDayText').value != null || this.form.get('HoursDayText').value != undefined || this.form.get('HoursDayText').value != ' ') {
      this.hours = this.form.get('HoursDayText').value;
    }
  }
  //#endregion
  //#region Provide Filter
  ProvideFilter() {
    if (this.provideType) {
      this.form.controls['provideType'].setValue('Sand')
    }
    else if (!this.provideType) {
      this.form.controls['provideType'].setValue('Aggregate')
    }
    else {
      this.form.controls['provideType'].setValue('None')
    }
  }
  //#endregion

  //#region getformErrors()
  getformErrors() {
    // if(this.form.controls['milesToTheJob'].value === undefined ||this.form.controls['milesToTheJob'].value == null  || this.form.controls['milesToTheJob'].value == " " )
    // {
    //   this.isErrorMessage = true;
    //   this.errorMessage = 'You must enter the miles to the jobsite.';
    // }
    if (this.form.controls['headerFootageText'].value === undefined || this.form.controls['headerFootageText'].value == null || this.form.controls['headerFootageText'].value == "") {
      this.isErrorMessage = true;
      this.errorMessage = 'You must enter the Lineal Footage of header pipe.';
    }
    else if (this.form.controls['pointSpacingText'].value === undefined || this.form.controls['pointSpacingText'].value == null || this.form.controls['pointSpacingText'].value == "") {
      this.isErrorMessage = true;
      this.errorMessage = 'You must enter the Lineal feet between Wellpoints.';
    }
    // else if (this.form.controls['sedimentationtrapType'].value === undefined ||this.form.controls['sedimentationtrapType'].value == null  || this.form.controls['sedimentationtrapType'].value == "" )
    // {
    //   this.isErrorMessage = true;
    //   this.errorMessage = 'You must enter the Lineal feet between Wellpoints.';
    // }
    else if (this.form.controls['jettingText'].value === undefined || this.form.controls['jettingText'].value == null || this.form.controls['jettingText'].value == "") {
      this.isErrorMessage = true;
      this.errorMessage = 'You must enter how many points are being jetted each day.';
    }
    else if (this.form.controls['HoursDayText'].value === undefined || this.form.controls['HoursDayText'].value == null || this.form.controls['HoursDayText'].value == "") {
      this.isErrorMessage = true;
      this.errorMessage = 'You must enter the expected hours to work per day.';
    }
    else if (this.form.controls['txtTractorLoads'].value === undefined || this.form.controls['txtTractorLoads'].value == null || this.form.controls['txtTractorLoads'].value == "") {
      this.isErrorMessage = true;
      this.errorMessage = 'You must enter the estimated number of tractor loads.';
    }
    else if (this.form.controls['crewSetupText'].value === undefined || this.form.controls['crewSetupText'].value == null || this.form.controls['crewSetupText'].value == "") {
      this.isErrorMessage = true;
      this.errorMessage = 'You must enter the number of people in the install crew.';
    }
    else if (this.form.controls['crewPickupText'].value === undefined || this.form.controls['crewPickupText'].value == null || this.form.controls['crewPickupText'].value == "") {
      this.isErrorMessage = true;
      this.errorMessage = 'You must enter the number of people in the install crew.';
    }
    else if (this.form.controls['dischargeFootageText'].value === undefined || this.form.controls['dischargeFootageText'].value == null || this.form.controls['dischargeFootageText'].value == "") {
      this.isErrorMessage = true;
      this.errorMessage = 'You must enter the total lineal footage of discharge.';
    }
    else if ((this.form.controls['fusesHourText'].value === undefined || this.form.controls['fusesHourText'].value == null || this.form.controls['fusesHourText'].value == "") && this.visible) {
      this.isErrorMessage = true;
      this.errorMessage = 'You must select the diameter of the pipe.';
    }
    else if (this.CalculateMeassage == 'Calculate') {
      this.Calculate();
    }
    else if (this.CalculateMeassage == 'Unlock') {
      this.resetFeild();
    }
  }

  visiblity() {
    if (this.dischargeTypeSelected == 'HDPE') {
      this.visible = true;
    }
    else {
      this.visible = false;
    }
  }
  onDischargeTypeChange(event) {
    this.dischargeTypeSelected = event;
    this.visiblity();
    this.visiblePipeHoseSize();
  }
  visiblePipeHoseSize() {
    if (this.dischargeTypeSelected == 'HDPE' || this.dischargeTypeSelected == 'QD') {
      this.isDisplayeHoseSize = true;
      if(this.dischargeTypeSelected == 'HDPE'){
        this.pipeSizeData=[
          { id: 1, value: '8 Inch' },
          { id: 2, value: '12 Inch' },
          { id: 3, value: '18 Inch' },
          { id: 4, value: '24 Inch' },
          { id: 5, value: '36 Inch' },
        ]
      }else if(this.dischargeTypeSelected == 'QD'){
        this.pipeSizeData=[
          { id: 1, value: '6 Inch' },
          { id: 2, value: '8 Inch' },
          { id: 3, value: '12 Inch' },
        ]
      }
    }
    else {
      this.isDisplayeHoseSize = false;this.pipeSizeData=[];
    }
  }
  //#endregion
}
