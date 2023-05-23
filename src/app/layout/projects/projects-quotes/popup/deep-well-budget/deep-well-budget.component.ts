import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProjectService } from './../../../projects.service';
import { DeepWellBudgetModel, LineItemtoRentalQuoteModel, QuoteBudgetViewRequestModel } from './../../../projects.model';
import {
  fuelCubeData,
  containmentData,
  providingPowerData,
  provideFilterData,
  loadernOperatorData,
  forkliftnOperatorData,
  dischargeTypeData,
  pipeSizeData,
  drillRigData,
  pumpSizeData,
  genData
} from '../../../../../../data/projectdata';
import { iframeIsLoaded } from 'ngx-doc-viewer';
import { NetworkDirectoryService } from 'src/app/layout/networkdirectory/networkdirectorypage/networkdirectory.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import * as fileSaver from 'file-saver';

@Component({
  selector: 'app-deep-well-budget',
  templateUrl: './deep-well-budget.component.html',
  styleUrls: ['./deep-well-budget.component.scss'],
})
export class DeepWellBudgetComponent implements OnInit {
  form: FormGroup;
  provideFilterData: any = provideFilterData;
  loadernOperatorData: any = loadernOperatorData;
  forkliftnOperatorData: any = forkliftnOperatorData;
  pumpSizeData: any = pumpSizeData;
  fuelCubeData: any = fuelCubeData;
  containmentData: any = containmentData;
  dischargeTypeData: any = dischargeTypeData;
  pipeSizeData: any = pipeSizeData;
  drillRigData: any = drillRigData;
  public providingPowerData: any = providingPowerData;

  gen1Data: any = genData;
  gen2Data: any = genData;
  gen3Data: any = genData;
  dischargeData: [];
  public opened = false;
  seletedRow: any;
  dislayWellRadio: boolean = false;
  displayProvidignType: boolean = false;
  openedCalculate: boolean = false;
  quoteBudgetViewRequestModel: QuoteBudgetViewRequestModel;
  deepWellBudgetModel: DeepWellBudgetModel;
  lineItemtoRentalQuoteModel: LineItemtoRentalQuoteModel;
  public lblAlert = 'Are you sure';
  public lbltitle = '';
  fileList = [
    // {
    //   fileName: 'Wisdom.Pump.txt',
    // },
  ];
  wellsFootage: number;
  footage: number;
  wellsspacing: number;
  daysOfDrilling: number;
  daysOfSetup: number;
  daysOfTearDown: number;
  driveTime: number;
  outOfTownJobs: string = '';
  daysPerTruckLoad: number;
  stickBoomCasings: string = '';
  stickBoomPumps: string = '';
  lowBoyFloats: number;
  powerRequired: number;
  powerSelected: number;
  approxFlow: number;
  poDrill: number;
  prodInstall: number;
  wellsDepth: number;
  pumpSize: string = '';
  gen1: number;
  gen2: number;
  gen3: number;
  gen1ItemCode: string = '';
  gen2ItemCode: string = '';
  gen3ItemCode: string = '';
  pumpSizeString: string = '';
  colorCode: string = '';
  providingPowerType: string = '';
  CalculateMeassage: string = 'Calculate';
  isLoaded: boolean = false;
  isDisabled: boolean = false;
  calculateButtonColor: string = 'yellow';
  dblHours: number = 0;
  modHours: number = 0;
  hours: number = 0;
  miles: number = 0;
  nothingToLoad: boolean = false;
  wellQty: number;
  errorMessage: string = '';
  isErrorMessage: boolean = false;
  @Input() detailJobNumber: number;
  @Input() detailBranch: string;;
  @Output() backButtonEvent = new EventEmitter();
  showCreateBudget: boolean = false;
  visible: boolean = false;
  deepWellData: any;
  valuesFile = {
    directoryPath: '\\\\192.168.0.9\\Mersino\\03  Logistics\\FLEET BOOKS',
    userName: 'MERSINO\\jagdip.joshi',
    password: 'oPDe8GP!SW83HNJS',
  } as any;
  isFuse_hours: boolean = true;
  isPipeSize: boolean = true;
  jobBranch:string;
  constructor(
    private formBuilder: FormBuilder,
    public projectService: ProjectService,
    public networkService: NetworkDirectoryService, public utility: UtilityService
  ) { }
  ngOnInit() {
    this.initForm();this.createQuoteBudgetViewRequestModel();
  }

  initForm(): void {
    this.form = this.formBuilder.group({
      milesToTheJob: [],
      wells: [],
      depthWellsText: [],
      wellsQty: [],
      footageText: [],
      spacingText: [],
      provideFilterType: [],
      drillRigType: [],
      txtWellDrilling: [],
      txtWellSetup: [],
      txtHoursDay: [],
      txtTractorLoads: [],
      loadernOperatorType: [],
      forkliftnOperatorType: [],
      txtCrewsSetup: [],
      pumpSizeType: [],
      fuelCubeType: [1],
      containmentType: [1],
      providingPowerType: [],
      gen1Text: [],
      gen1Type: [],
      gen2Text: [],
      gen2Type: [],
      gen3Text: [],
      gen3Type: [],
      dischargeFootageText: [],
      dischargeType: [],
      fusesHourText: [],
      pipeSizeType: [],
      sedimentationTrapText: [],
    });
  }

  onRefreshFileList() { this.getFileList(); }
  getFileList() {
    this.visible = true;
    this.valuesFile.directoryPath =
      '\\\\192.168.0.2\\Mersino\\02  Operations\\JOB BOOKS\\' + this.detailJobNumber + '\\03 - SPREADSHEET & COST ANALYSIS\\';
    this.networkService.GetDirectoryDetails(this.valuesFile).subscribe(
      (res) => {
        this.visible = false;
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
      if (this.seletedRow && this.seletedRow.name.toString().includes(this.detailJobNumber + '-DW Budget')) {
        this.lineItemtoRentalQuoteModel.path = this.seletedRow.path;
        this.lineItemtoRentalQuoteModel.jobNumber = this.deepWellData.jobNumber;
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
  onCalculate(): void {
    // if (!this.isLoaded) {
    //   this.openedCalculate = !this.openedCalculate;
    // }
    // else {
    this.getformErrors();
    //}

    //  else if(this.CalculateMeassage == 'Calculate')
    //   {
    //     this.Calculate();
    //   }
    //   else if(this.CalculateMeassage == 'Unlock')
    //   {
    //     this.resetFeild();
    //   }

  }
  changeAnswer($event: any) {
    if ($event.target.value == 'Q') {
      // this.form.controls['wellsQty'].setValue(null);

      this.dislayWellRadio = false;
    } else {
      // this.form.controls['footageText'].setValue(null);
      // this.form.controls['spacingText'].setValue(null);

      this.dislayWellRadio = true;
    }
  }
  changeProvidingType(value) {
    if (value == 'YES') {
      this.displayProvidignType = true;
    } else {
      this.form.controls['gen1Text'].setValue(null);
      this.form.controls['gen1Type'].setValue(null);
      this.form.controls['gen2Text'].setValue(null);
      this.form.controls['gen2Type'].setValue(null);
      this.form.controls['gen3Text'].setValue(null);
      this.form.controls['gen3Type'].setValue(null);
      this.displayProvidignType = false;
    }
  }
  closeCalcualte() {
    this.openedCalculate = !this.openedCalculate;
  }
  closeNothingToLoad() {
    this.nothingToLoad = !this.nothingToLoad;
  }
  closeErrorMessage() {
    this.isErrorMessage = !this.isErrorMessage;
  }
  ngOnChanges() {
    console.log(this.detailJobNumber);
  }

  //#region Bind Form
  getDetails() {
    
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
    this.quoteBudgetViewRequestModel.QuoteType = 'DW';
    this.quoteBudgetViewRequestModel.JobNumber = this.detailJobNumber;
    this.jobBranch  = this.detailBranch;
  }
  //#endregion

  //#region
  onLoadLastInput() {
    this.getDetails();
  }

  setFormValues(data) {
    this.deepWellData = data;
    this.footage = data.wellsFootage;
    this.wellsspacing = data.wellsSpacing;
    this.poDrill = data.prodDrill;
    this.prodInstall = data.prodInstall;
    this.wellsDepth = data.wellsDepth;
    this.pumpSize = data.pumpSize.replace(/\D/g, '');
    this.pumpSizeString = data.pumpSize;
    this.gen1 = data.gen1Qty;
    this.gen2 = data.gen2Qty;
    this.gen3 = data.gen3Qty;
    this.hours = data.hoursPerDay;
    this.miles = data.miles;
    this.wellQty = data.wellsQty;
    if (data.gen1ItemCode !== undefined && data.gen1ItemCode !== null) {
      this.gen1ItemCode = data.gen1ItemCode.replace(/\D/g, '');
    }
    else if (data.gen2ItemCode !== undefined && data.gen2ItemCode !== null) {
      this.gen2ItemCode = data.gen2ItemCode.replace(/\D/g, '');
    }
    else if (data.gen3ItemCode !== undefined && data.gen3ItemCode !== null) {
      this.gen3ItemCode = data.gen3ItemCode.replace(/\D/g, '');
    }
    if (data.power) {
      this.displayProvidignType = true;
    }
    else {
      this.displayProvidignType = false;
    }
    // if(data.wellsQty !== null)
    // {
    //   this.form.controls['wells'].setValue('F');
    // }
    // else
    // {
    //   this.form.controls['wells'].setValue('Q');
    // }
    this.form.setValue({
      wellsQty: data.wellsQty,
      milesToTheJob: data.miles,
      footageText: data.wellsFootage,
      spacingText: data.wellsSpacing,
      depthWellsText: data.wellsDepth,
      provideFilterType: data.filter == true ? 'YES' : 'NO',
      drillRigType: data.drillRig,
      txtWellDrilling: data.prodDrill,
      txtWellSetup: data.prodInstall,
      txtHoursDay: data.hoursPerDay,
      txtTractorLoads: data.tractorLoads,
      loadernOperatorType: data.loader == true ? 'YES' : 'NO',
      forkliftnOperatorType: data.fork == true ? 'YES' : 'NO',
      txtCrewsSetup: data.crewSize,
      pumpSizeType: data.pumpSize,
      fuelCubeType: data.fuelCubes == true ? 'YES' : 'NO',
      containmentType: data.containment == true ? 'YES' : 'NO',
      providingPowerType: data.power == true ? 'YES' : 'NO',
      gen1Text: data.gen1Qty,
      gen2Text: data.gen2Qty,
      gen3Text: data.gen3Qty,
      gen1Type: data.gen1ItemCode,
      gen2Type: data.gen2ItemCode,
      gen3Type: data.gen3ItemCode,
      dischargeFootageText: data.dischargeFootage,
      dischargeType: data.hdpePipe,
      fusesHourText: data.fusesPerHour,
      pipeSizeType: data.pipeSize,
      sedimentationTrapText: data.sedTrap + '',
      wells: data.wellsQty == null ? 'F' : 'Q',
    });
    this.isLoaded = true;
    this.changeEquipmentType(data.hdpePipe);
    this.getFileList();
    if (this.form.get('wells').value == 'Q') {
      this.dislayWellRadio = false;
    }
    else if (this.form.get('wells').value == 'F') {
      this.dislayWellRadio = true;
    }
  }
  //#endregion
  ondischargeType($event) {
     
    this.changeEquipmentType($event);
  }
  changeEquipmentType(data) {this.pipeSizeData=[];
    switch (data) {
      case 'QD':
        this.isFuse_hours = false;this.isPipeSize = true;
        this.pipeSizeData=[
          { id: 1, value: '6 Inch' },
          { id: 2, value: '8 Inch' },
          { id: 3, value: '12 Inch' },
        ]
        break;
      case 'Layflat':
        this.isFuse_hours = false;
        this.isPipeSize = false;
        break;
      case 'HDPE':
        this.isFuse_hours = true;
        this.isPipeSize = true;
        this.pipeSizeData=[
          { id: 1, value: '8 Inch' },
          { id: 2, value: '12 Inch' },
          { id: 3, value: '18 Inch' },
          { id: 4, value: '24 Inch' },
          { id: 5, value: '36 Inch' },
        ]
        break;
      default:
        break;
    }
  }
  //#region Calculate
  Calculate() {
    if (this.form.value.providingPowerType == 'NO' || ((this.form.value.providingPowerType == 'YES' && this.form.value.gen1Text && this.form.value.gen1Type) || (this.form.value.providingPowerType == 'YES' && this.form.value.gen2Text && this.form.value.gen2Type) || (this.form.value.providingPowerType == 'YES' && this.form.value.gen3Text && this.form.value.gen3Type))) {
      this.showCreateBudget = true;
      this.CalculateMeassage = 'Unlock'
      this.calculateButtonColor = 'lightgreen';
      this.isDisabled = true;
      this.getFormControlValues();
      this.getHoursValues();

      if (this.footage !== null && this.footage !== undefined) {
        this.wellsFootage = ((this.footage / this.wellsspacing) + 1);

      }
      else if (this.wellQty != null && this.wellQty !== undefined) {
        this.wellsFootage = (this.wellQty);
      }
      this.daysOfDrilling = this.wellsFootage / this.poDrill + 0.5;
      this.daysOfSetup = this.wellsFootage / this.prodInstall;
      this.daysOfTearDown = this.daysOfSetup;
      if (this.wellsDepth > 50) {
        this.stickBoomCasings = 'YES';
      } else {
        this.stickBoomCasings = 'NO';
      }
      if (parseInt(this.pumpSize) >= 25) {
        this.stickBoomPumps = 'YES';
      } else {
        this.stickBoomPumps = 'NO';
      }
      this.powerRequired = parseInt(this.pumpSize) * this.wellsFootage * 1.25;
      if (this.gen1 != null && this.gen1 !== undefined) {
        this.powerSelected = this.gen1 * parseInt(this.gen1ItemCode);
      } else if (this.gen2 != null && this.gen2 !== undefined) {
        this.powerSelected = this.gen2 * parseInt(this.gen2ItemCode);
      } else if (this.gen3 != null && this.gen3 !== undefined) {
        this.powerSelected = this.gen3 * parseInt(this.gen3ItemCode);
      }
      else {
        this.powerSelected = 0;
      }

      if (this.pumpSizeString == 'PUSU001R') {
        this.approxFlow = this.wellsFootage * 50;
      } else if (this.pumpSizeString == 'PUSU002R') {
        this.approxFlow = this.wellsFootage * 100;
      } else if (this.pumpSizeString == 'PUSU005R') {
        this.approxFlow = this.wellsFootage * 250;
      } else if (this.pumpSizeString == 'PUSU010R') {
        this.approxFlow = this.wellsFootage * 400;
      } else if (this.pumpSizeString == 'PUSU015R') {
        this.approxFlow = this.wellsFootage * 600;
      } else if (this.pumpSizeString == 'PUSU020R') {
        this.approxFlow = this.wellsFootage * 800;
      } else if (this.pumpSizeString == 'PUSU025R') {
        this.approxFlow = this.wellsFootage * 800;
      } else if (this.pumpSizeString == 'PUSU035R') {
        this.approxFlow = this.wellsFootage * 1000;
      } else if (this.pumpSizeString == 'PUSU050R') {
        this.approxFlow = this.wellsFootage * 1200;
      } else if (this.pumpSizeString == 'PUSUTU030R') {
        this.approxFlow = this.wellsFootage * 1000;
      } else if (this.pumpSizeString == 'PUSUTU040R') {
        this.approxFlow = this.wellsFootage * 1250;
      } else if (this.pumpSizeString == 'PUSUTU060R') {
        this.approxFlow = this.wellsFootage * 1500;
      } else if (this.pumpSizeString == 'PUSUTU075R') {
        this.approxFlow = this.wellsFootage * 1500;
      } else if (this.pumpSizeString == 'PUSU003R') {
        this.approxFlow = this.wellsFootage * 100;
      }
      if (this.powerSelected > this.powerRequired) {
        this.colorCode = 'lightgreen';
      } else {
        this.colorCode = 'pink';
      }

    } else {
      if (this.form.value.providingPowerType == 'YES') {
        this.utility.toast.error('How are you providing power?');
        return false;
      }
    }



  }
  getFormControlValues() {
    if (this.form.controls['footageText'].value != null || this.form.controls['footageText'].value != undefined || this.form.controls['footageText'].value != ' ') {
      this.footage = this.form.get('footageText').value;
    }
    if (this.form.controls['wellsQty'].value != null || this.form.controls['wellsQty'].value != undefined || this.form.controls['wellsQty'].value != ' ') {
      this.wellQty = this.form.get('wellsQty').value;
    }
    if (this.form.controls['spacingText'].value != null || this.form.controls['spacingText'].value != undefined || this.form.controls['spacingText'].value != ' ') {
      this.wellsspacing = this.form.get('spacingText').value;
    }
    if (this.form.controls['depthWellsText'].value != null || this.form.controls['depthWellsText'].value != undefined || this.form.controls['depthWellsText'].value != ' ') {
      this.wellsDepth = this.form.get('depthWellsText').value;
    }
    if (this.form.controls['depthWellsText'].value != null || this.form.controls['depthWellsText'].value != undefined || this.form.controls['depthWellsText'].value != ' ') {
      this.poDrill = this.form.get('txtWellDrilling').value;
    }
    if (this.form.controls['depthWellsText'].value != null || this.form.controls['depthWellsText'].value != undefined || this.form.controls['depthWellsText'].value != ' ') {
      this.prodInstall = this.form.get('txtWellSetup').value;
    }
    if (this.form.controls['gen1Text'].value != null || this.form.controls['gen1Text'].value != undefined || this.form.controls['gen1Text'].value != ' ') {
      this.gen1 = this.form.get('gen1Text').value;
    }
    if (this.form.controls['gen2Text'].value != null || this.form.controls['gen2Text'].value != undefined || this.form.controls['gen2Text'].value != ' ') {
      this.gen2 = this.form.get('gen2Text').value;
    }

    if (this.form.controls['gen3Text'].value != null || this.form.controls['gen3Text'].value != undefined || this.form.controls['gen3Text'].value != ' ') {
      this.gen3 = this.form.get('gen3Text').value;
    }
    if (this.form.get('txtHoursDay').value != null || this.form.get('txtHoursDay').value != undefined || this.form.get('HoursDayText').value != ' ') {
      this.hours = this.form.get('txtHoursDay').value;
    }

  }
  onValueChange(event) {
    this.pumpSize = event.replace(/\D/g, '');
    this.pumpSizeString = event;
  }
  //#endregion

  //#region on GenValueChange
  onGen1ValueChange(event) {
    this.gen1ItemCode = event.replace(/\D/g, '');
  }
  onGen2ValueChange(event) {
    this.gen2ItemCode = event.replace(/\D/g, '');
  }
  onGen3ValueChange(event) {
    this.gen3ItemCode = event.replace(/\D/g, '');
  }
  //#endregion

  //#region Reset Feilds
  resetFeild() {
    this.CalculateMeassage = 'Calculate'
    this.calculateButtonColor = 'yellow';
    this.isDisabled = false;
    this.wellsFootage = null;
    this.daysOfDrilling = null;
    this.daysOfSetup = null;
    this.daysOfTearDown = null;
    this.stickBoomCasings = '';
    this.stickBoomPumps = '';
    this.powerRequired = null;
    this.powerSelected = null;
    this.approxFlow = null;
    this.colorCode = '';
    this.driveTime = null;
    this.daysPerTruckLoad = null;
    this.outOfTownJobs = '';
    this.lowBoyFloats = null;
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
      this.driveTime = Math.ceil((this.dblHours * 2) + 0.5);//Math.floor(this.dblHours * 2 + 0.5) ?? 0; //this.dblHours * 2 + 0.5;
    }

    if (this.dblHours > 2) {
      this.outOfTownJobs = 'YES';
    }
    else {
      this.outOfTownJobs = 'NO';
    }
    this.daysPerTruckLoad = Math.ceil(this.driveTime / this.hours + 0.5)
    this.lowBoyFloats = this.form.value.drillRigType=='Gus Pech'?0:(this.form.value.drillRigType=='Casa B125'?1:(this.form.value.drillRigType=='Case B150'?3:null));


  }

  //#endregion
  //#region get Form Errors
  getformErrors() {
    if (this.form.controls['milesToTheJob'].value === undefined || this.form.controls['milesToTheJob'].value == null || this.form.controls['milesToTheJob'].value == '') {
      this.isErrorMessage = true;
      this.errorMessage = 'You must enter the miles to the jobsite.';
    }
    else if ((this.form.controls['wellsQty'].value === undefined || this.form.controls['wellsQty'].value == null || this.form.controls['wellsQty'].value == '') && !this.dislayWellRadio) {
      this.isErrorMessage = true;
      this.errorMessage = 'You must enter the quantity of the wells to be drilled.';
    }
    else if ((this.form.controls['footageText'].value === undefined || this.form.controls['footageText'].value == null || this.form.controls['footageText'].value == '') && this.dislayWellRadio) {
      this.isErrorMessage = true;
      this.errorMessage = 'You must enter the lineal footage to be dewatered.';
    }
    else if ((this.form.controls['spacingText'].value === undefined || this.form.controls['spacingText'].value == null || this.form.controls['spacingText'].value == '') && this.dislayWellRadio) {
      this.isErrorMessage = true;
      this.errorMessage = 'You must enter the lineal feet between deepwells.';
    }
    else if (this.form.controls['depthWellsText'].value === undefined || this.form.controls['depthWellsText'].value == null || this.form.controls['depthWellsText'].value == '') {
      this.isErrorMessage = true;
      this.errorMessage = 'You must enter the depth of the wells.';
    }
    // else if ((this.form.controls['gen1Text'].value === undefined || this.form.controls['gen1Text'].value == null || this.form.controls['gen1Text'].value == '') && this.gen1 !== undefined && this.gen1 !== null) {
    //   this.isErrorMessage = true;
    //   this.errorMessage = 'You must enter the quantity of Gen1.';
    // }
    // else if ((this.form.controls['gen2Text'].value === undefined || this.form.controls['gen2Text'].value == null || this.form.controls['gen2Text'].value == '') && this.gen2 !== undefined && this.gen2 !== null) {
    //   this.isErrorMessage = true;
    //   this.errorMessage = 'You must enter the quantity of Gen2.';
    // }
    // else if ((this.form.controls['gen3Text'].value === undefined || this.form.controls['gen3Text'].value == null || this.form.controls['gen3Text'].value == '') && this.gen3 !== undefined && this.gen3 !== null) {
    //   this.isErrorMessage = true;
    //   this.errorMessage = 'You must enter the quantity of Gen3.';
    // }
    else if (this.form.controls['txtWellDrilling'].value === undefined || this.form.controls['txtWellDrilling'].value == null || this.form.controls['txtWellDrilling'].value == '') {
      this.isErrorMessage = true;
      this.errorMessage = 'You must enter the wells expected to drill per day.';
    }
    else if (this.form.controls['txtWellSetup'].value === undefined || this.form.controls['txtWellSetup'].value == null || this.form.controls['txtWellSetup'].value == '') {
      this.isErrorMessage = true;
      this.errorMessage = 'You must enter the wells expected to be installed per day.';
    }
    else if (this.form.controls['txtHoursDay'].value === undefined || this.form.controls['txtHoursDay'].value == null || this.form.controls['txtHoursDay'].value == '') {
      this.isErrorMessage = true;
      this.errorMessage = 'You must enter the hours expected to work per day.';
    }
    else if (this.form.controls['txtTractorLoads'].value === undefined || this.form.controls['txtTractorLoads'].value == null || this.form.controls['txtTractorLoads'].value == '') {
      this.isErrorMessage = true;
      this.errorMessage = 'You must enter the estimated number of tractor loads.';
    }
    else if (this.form.controls['txtCrewsSetup'].value === undefined || this.form.controls['txtCrewsSetup'].value == null || this.form.controls['txtCrewsSetup'].value == '') {
      this.isErrorMessage = true;
      this.errorMessage = 'You must enter the number of people in the install crew.';
    }
    else if (this.form.controls['txtCrewsSetup'].value === undefined || this.form.controls['txtCrewsSetup'].value == null || this.form.controls['txtCrewsSetup'].value == '') {
      this.isErrorMessage = true;
      this.errorMessage = 'You must enter the number of people in the install crew.';
    }
    else if (this.form.controls['dischargeFootageText'].value === undefined || this.form.controls['dischargeFootageText'].value == null || this.form.controls['dischargeFootageText'].value == '') {
      this.isErrorMessage = true;
      this.errorMessage = 'You must enter the total lineal footage of discharge.';
    }
    else if (this.isFuse_hours && (this.form.controls['fusesHourText'].value === undefined || this.form.controls['fusesHourText'].value == null || this.form.controls['fusesHourText'].value == '')) {
      this.isErrorMessage = true;
      this.errorMessage = 'You must enter the number of fuses expected per hour.';
    }
    else if (this.form.controls['sedimentationTrapText'].value === undefined || this.form.controls['sedimentationTrapText'].value == null || this.form.controls['sedimentationTrapText'].value == '') {
      this.isErrorMessage = true;
      this.errorMessage = 'You must enter the number of sedimentation traps to be supplied,if NONE entered ZERO.';
    }
    else if (this.CalculateMeassage == 'Calculate') {      
      this.Calculate();
    }
    else if (this.CalculateMeassage == 'Unlock') { this.showCreateBudget = false;
      this.resetFeild();
    }
  }
  onCreateBudget() {
    this.deepWellBudgetModel = new DeepWellBudgetModel();
    this.deepWellBudgetModel.id = this.deepWellData ? this.deepWellData.pk : 0;
    this.deepWellBudgetModel.budgetType = 'DW';
    this.deepWellBudgetModel.userName = JSON.parse(localStorage.getItem('currentUser')).userName;
    this.deepWellBudgetModel.user_PK = JSON.parse(localStorage.getItem('currentUser')).id;
    this.deepWellBudgetModel.quoteType = "DW";
    this.deepWellBudgetModel.quoteNumber = this.deepWellData ? this.deepWellData.quoteNumber : 0;
    this.deepWellBudgetModel.miles = this.form.value.milesToTheJob;
    this.deepWellBudgetModel.branch = this.jobBranch;
    if (this.form.value.wellsQty)
      this.deepWellBudgetModel.wellsQTY = this.form.value.wellsQty;
    else
      this.deepWellBudgetModel.wellsQTY = null;
    if (!this.form.value.wellsQty) {
      this.deepWellBudgetModel.wellsFootage = this.form.value.footageText;
      this.deepWellBudgetModel.wellsSpacing = this.form.value.spacingText;
    } else {
      this.deepWellBudgetModel.wellsFootage = null;
      this.deepWellBudgetModel.wellsSpacing = null;
    }
    this.deepWellBudgetModel.wellsDepth = this.form.value.depthWellsText;
    this.deepWellBudgetModel.filter = this.form.value.provideFilterType == null ? false : (this.form.value.provideFilterType == 'NO' ? false : true);
    this.deepWellBudgetModel.drillRig = this.form.value.drillRigType;
    this.deepWellBudgetModel.pumpSize = this.form.value.pumpSizeType;
    this.deepWellBudgetModel.fuelCubes = this.form.value.fuelCubeType == null ? false : (this.form.value.fuelCubeType == 'NO' ? false : true);
    this.deepWellBudgetModel.containment = this.form.value.containmentType == null ? false : (this.form.value.containmentType == 'NO' ? false : true);
    this.deepWellBudgetModel.power = this.form.value.providingPowerType == null ? false : (this.form.value.providingPowerType == 'NO' ? false : true);
    this.deepWellBudgetModel.gen1Qty = this.form.value.gen1Text;
    this.deepWellBudgetModel.gen1ItemCode = this.form.value.gen1Type;
    this.deepWellBudgetModel.gen2Qty = this.form.value.gen2Text;
    this.deepWellBudgetModel.gen2ItemCode = this.form.value.gen2Type;
    this.deepWellBudgetModel.gen3Qty = this.form.value.gen3Text;
    this.deepWellBudgetModel.gen3ItemCode = this.form.value.gen3Type;
    this.deepWellBudgetModel.dischargeFootage = this.form.value.dischargeFootageText;
    this.deepWellBudgetModel.hdpePipe = this.form.value.dischargeType;
    this.deepWellBudgetModel.fusesPerHour = this.form.value.fusesHourText;
    this.deepWellBudgetModel.pipeSize = this.form.value.pipeSizeType;
    this.deepWellBudgetModel.sedTrap = this.form.value.sedimentationTrapText;
    this.deepWellBudgetModel.prodDrill = this.form.value.txtWellDrilling;
    this.deepWellBudgetModel.prodInstall = this.form.value.txtWellSetup;
    this.deepWellBudgetModel.hoursPerDay = this.form.value.txtHoursDay;
    this.deepWellBudgetModel.tractorLoads = this.form.value.txtTractorLoads;
    this.deepWellBudgetModel.loader = this.form.value.loadernOperatorType == null ? false : (this.form.value.loadernOperatorType == 'NO' ? false : true);
    this.deepWellBudgetModel.preDrill = this.deepWellData ? this.deepWellData.preDrill == null ? false : (this.form.value.preDrill == 'NO' ? false : true) : false;
    this.deepWellBudgetModel.punch = this.deepWellData ? this.deepWellData.punch == null ? false : (this.form.value.punch == 'NO' ? false : true) : false;
    this.deepWellBudgetModel.fork = this.form.value.forkliftnOperatorType == null ? false : (this.form.value.forkliftnOperatorType == 'NO' ? false : true);
    this.deepWellBudgetModel.crewSize = this.form.value.txtCrewsSetup;
    this.deepWellBudgetModel.pickUpCrewSize = this.deepWellData ? this.deepWellData.pickUpCrewSize : 0;
    this.deepWellBudgetModel.createdDate = new Date().toISOString();
    this.deepWellBudgetModel.createdBy = JSON.parse(localStorage.getItem('currentUser')).userId;
    this.deepWellBudgetModel.jobNumber = this.detailJobNumber;
    this.deepWellBudgetModel.truckDaysPerLoad = Number.isNaN(this.daysPerTruckLoad) ? 0 : this.daysPerTruckLoad;///
    this.deepWellBudgetModel.driveTime = this.driveTime;
    this.deepWellBudgetModel.lowboyFloats = this.lowBoyFloats;
    this.deepWellBudgetModel.prodRemove = this.daysOfTearDown;
    this.deepWellBudgetModel.perdiem = this.outOfTownJobs;
    this.deepWellBudgetModel.pumpSizeIndex = this.pumpSizeData.findIndex(x => x.value == this.form.value.pumpSizeType);
    this.deepWellBudgetModel.numbersOfWells = this.wellsFootage;
    this.deepWellBudgetModel.pipeSizeIndex = this.pipeSizeData.findIndex(x => x.value == this.form.value.pipeSizeType);;
    this.deepWellBudgetModel.hdpePipeSizeIndex = this.dischargeTypeData.findIndex(x => x.value == this.form.value.dischargeType);;
    this.deepWellBudgetModel.stickBoomCasings=this.stickBoomCasings;
    this.deepWellBudgetModel.stickBoomPumps=this.stickBoomPumps;
    this.deepWellBudgetModel.modHours=this.modHours;
    this.deepWellBudgetModel.daysOfSetup =this.daysOfSetup;
    this.deepWellBudgetModel.daysOfDrilling =this.daysOfDrilling;
    this.visible = true;
    this.projectService
      .createDeepwellBudget(this.deepWellBudgetModel)
      .subscribe((res) => {
        this.visible = false;
        //this.utility.toast.success('Please wait, file will be downloaded.');
        if (res.size > 0) {
          let data = new Blob([res], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;',
          });
          fileSaver.saveAs(
            data, this.detailJobNumber +
            '- DW budget -' +
            new Date().toLocaleDateString('en-US') +
          '.xlsx'
          );

        }
      });
  }

  //#endregion


}
