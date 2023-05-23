import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { orderBy, SortDescriptor } from '@progress/kendo-data-query';
import {
  ProjectQuoteListRequestModel,
  QuoteSaveRequestModel,
  QuoteMultiplierApplyModel,
  QuotePartDropDownRequestModel,
  QuoteChangePeriodModel, QuotesPrintRequestModel
} from '../projects.model';
import { ProjectService } from '../projects.service';
import { DropdownService } from '../../../core/services/dropdown.service';
import { UtilityService } from '../../../core/services/utility.service';
import { Qoute } from './../../../core/models/enum-model';
import {
  viewColumnsProjectQuotes,
  monthlyData,
  shiftData,
  proposalData,
  orderTypeData, quoteTypeData,
} from '../../../../data/projectdata';
import { NetworkDirectoryService } from '../../../layout/networkdirectory/networkdirectorypage/networkdirectory.service';
import { saveAs } from 'file-saver';
import { FleetInfoService } from '../../../../../src/app/layout/admin/IT/paul/fleet/fleet-info/fleet-info.service';
import { HRRequests } from '../../../../../src/app/layout/tools/hr-requests/hr-requests.service';
import { MenuService } from 'src/app/core/helper/menu.service';
import * as fileSaver from 'file-saver';
@Component({
  selector: 'app-projects-quotes',
  templateUrl: './projects-quotes.component.html',
  styleUrls: ['./projects-quotes.component.scss'],
})
export class ProjectsQuotesComponent implements OnInit {
  form: FormGroup;
  displaydeepWellBudget: boolean = false;
  displayWellpointBudget: boolean = false;
  displayBypassBudget: boolean = false;
  displayTermsNConditionsBudget: boolean = false;
  displayMonthly: boolean = false;
  displayAddKit: boolean = false;
  proposalTypeData: [];
  orderTypeData: any = orderTypeData;
  quoteTypeData: any = quoteTypeData;
  opened: boolean = false;
  openedMultilier: boolean = false;
  openedAdd: boolean = false;
  copyOpened: boolean = false;
  copyChange: boolean = false;
  diplayitemDrp: boolean = false;
  jobNumber: number;
  projectQuoteListRequestModel: ProjectQuoteListRequestModel;
  quotePartDropDownRequestModel: QuotePartDropDownRequestModel;
  quoteMultiplierApplyModel: QuoteMultiplierApplyModel;
  quoteChangePeriodModel: QuoteChangePeriodModel;
  quotesPrintRequestModel: QuotesPrintRequestModel;
  proposalData: any = proposalData;
  changeNumber: number;
  gridView: any[];
  errorMessage: string = '';
  isErrorMessage: boolean = false;
  isOpenMultiplier: boolean = false;
  isNewOrder: boolean = false;
  itemCodeNumber: string = '';
  itemCodeDescription: string = '';
  isDisabled: boolean = true;
  salesTaxPerc: string = '';
  complete: boolean;
  printNotes: boolean;
  isCreateOrder: boolean;
  selectedChangeOrder: number;
  note: string = '';
  totalEquipment: number;
  totalOther: number;
  hasUsage: boolean;
  displayContinuous: boolean = false;
  qoutebranch: string;
  qoutePriceDetails: any = [];
  shift: string = 'Continous';
  period: string;
  rate: number = 0;
  selectedQuoteType: string;
  qoutesEnum: Qoute;
  qouteType: string = '';
  searchText: string = '';
  isvisible: boolean = false;
  newChangeOrderNumber: number;
  projectqoutesNewAddedData: any = [];
  public orderListData: any = [{ id: 1, value: 1 }];
  public viewColumns: any = viewColumnsProjectQuotes;
  public projectQuotesData: any = [];
  public monthlyData: any = monthlyData;
  public shiftdata: any = shiftData;
  data: any;
  qouteTypeNumber: number;
  partId: number;
  isNewChangeOrderCreated: boolean = false;
  currentUser: string = '';
  currentUserEmail: string = '';
  selectedBranch: string = '';
  path: any;
  isOverWritePeriod: boolean = false;
  isDwQuoteTool: boolean = false;
  isWpQuoteTool: boolean = false;
  isBPQuoteTool: boolean = false;
  public sort: SortDescriptor[] = [
    {
      field: 'id',
      dir: 'asc',
    },
    {
      field: 'inventory',
      dir: 'asc',
    },
    {
      field: 'description',
      dir: 'asc',
    },
    {
      field: 'qty',
      dir: 'asc',
    },
    {
      field: 'rate',
      dir: 'asc',
    },
    {
      field: 'total',
      dir: 'asc',
    },
  ];
  FilterValue = {
    LookupNumber: null,
    CurrentBranch: null,
    customerName: null,
    am: null, jobNumer: null, projectContact: null, projectNumber: null, projectName: null, pmEmail: null, changeNumber: null,
    CurrentBranchName: null, globalBranch: null, customerRep: null, custAddress: null, jobLocation: null, branchCode: null
  };
  qoutesDetails: any = {
    complete: false,
    notes: '',
    printNotes: '',
    quoteType: '',
    salesTaxPercentage: '',
    shiftType: '',
    timeFrame: '',
    totalEquipment: '',
    totalOther: '',
  };
  public mySelection: number[] = [0];
  public itemCodeSelection: number[] = [];
  @Output() backButtonEvent = new EventEmitter();
  valuesFile = {
    directoryPath:
      '\\\\192.168.0.2\\Mersino\\02  Operations\\QUOTE TOOLS\\Quotes Templates\\Bypass Pumping Quotes\\BP Labor Budget Excel.xltx',
  } as any;
  pathFile = {
    directoryPath:
      '\\\\192.168.0.2\\Mersino\\01  Administration\\MDI\\Trenching\\Trenching Budget Excel.xlsx',
  } as any;
  termsAndConditionsFile = {
    directoryPath:
      '\\\\192.168.0.2\\Mersino\\01  Administration\\Organizational Material\\Corporate Forms\\01  Administrative Services\\01  Accounts Receivable\\Project Forms\\Rental Agreement Terms and Conditions (for Pump or Generator or Equipment) AAR-091-000-F.181212.pdf',
  } as any;
  isCreateProposal: boolean;
  globalSelectedBranch: string = '';
  isQuoteTypeVisible: boolean = false;
  isPrintPIF: boolean = false;
  state: string;
  constructor(
    private formBuilder: FormBuilder,
    public projectService: ProjectService,
    public dropdownService: DropdownService,
    public utilityService: UtilityService,
    public networkService: NetworkDirectoryService,
    public fleetInfoService: FleetInfoService,
    public hrService: HRRequests,
    public menuService: MenuService
  ) {
    this.menuService.checkUserBySubmoduleRights('Quotes');
    this.isDwQuoteTool = this.menuService.isDwQuoteTool;
    this.isWpQuoteTool = this.menuService.isWPQuoteTool;
    this.isBPQuoteTool = this.menuService.isBPQuoteTool;
  }
  ngOnInit() {
    this.initForm();
    var usr = JSON.parse(localStorage.getItem('currentUser'));
    if (usr != null) {
      this.currentUser = usr.userName;
      this.currentUserEmail = usr.email;
    }
    this.changeNumber = 0;
    this.qoutesEnum = new Qoute();
    this.projectQuoteListRequestModel = new ProjectQuoteListRequestModel();
    this.quotePartDropDownRequestModel = new QuotePartDropDownRequestModel();
    this.quoteMultiplierApplyModel = new QuoteMultiplierApplyModel();
    this.quoteChangePeriodModel = new QuoteChangePeriodModel();
    this.getDefaultLocationByUsername();
  }

  initForm(): void {
    this.form = this.formBuilder.group({
      itemCode: [''],
      multiplier: [''],
      jobNumber: [''],
      proposalType: [],
      orderType: [],
      orderList: [],
      monthlyType: [],
      itemType: [],
      quantity: [],
      changeNumber: [],
      description: [],
    });
  }
  onDeepWellBudget() {
    if (this.isDwQuoteTool) {
      this.displaydeepWellBudget = !this.displaydeepWellBudget;
    } else {
      this.utilityService.toast.error(
        'You do not have permissions to access this part of the system. Please contact your supervisor so they can request them from IT.'
      );
    }
  }
  onBypassBudget() {
    if (this.isBPQuoteTool) {
      this.networkService
        .DownloadFile(encodeURI(this.valuesFile.directoryPath))
        .subscribe(
          (data) => {
            saveAs(data, 'BP Labor Budget Excel.xltx');
          },
          (error) => {
            console.log('Something went wrong');
          }
        );
    } else {
      this.utilityService.toast.error(
        'You do not have permissions to access this part of the system. Please contact your supervisor so they can request them from IT.'
      );
    }
  }
  onTrenchingBudget() {
    this.networkService
      .DownloadFile(encodeURI(this.pathFile.directoryPath))
      .subscribe(
        (data) => {
          saveAs(data, 'Trenching Budget Excel.xlsx');
        },
        (error) => {
          console.log('Something went wrong');
        }
      );
  }
  onWellpointBudget() {
    if (this.isWpQuoteTool) {
      this.displayWellpointBudget = !this.displayWellpointBudget;
    } else {
      this.utilityService.toast.error(
        'You do not have permissions to access this part of the system. Please contact your supervisor so they can request them from IT.'
      );
    }
  }
  onNewOrder() {
    this.isCreateOrder = true;this.period='Select Type';
    this.isQuoteTypeVisible = true;
  }

  public close(status) {
    if (status == 'yes') {
      this.opened = !this.opened;
      this.onNewOrderYesClick();
    } else if (status == 'no') {
      this.opened = !this.opened;
    } else {
      this.opened = !this.opened;
    }
  }
  onCopyOrder() {
    this.copyOpened = true;
  }
  closeCopyorder(status) {
    if (status == 'copy') {
      this.copyOpened = !this.copyOpened;
      this.copyChangeOrder();
    } else if (status == 'no') {
      this.copyOpened = !this.copyOpened;
    } else {
      this.copyOpened = !this.copyOpened;
    }
  }

  closeCopyChangeorder(status) {
    if (status == 'yes') {
      this.copyChange = !this.copyChange;
    } else if (status == 'no') {
      this.copyChange = !this.copyChange;
    } else {
      this.copyChange = !this.copyChange;
    }
  }
  onMonthly() {
    this.displayMonthly = !this.displayMonthly;
  }
  addkit() {
    this.displayAddKit = !this.displayAddKit;
  }
  onItem() {
    this.itemCodeSelection = [];
    this.diplayitemDrp = !this.diplayitemDrp;
  }

  addItem() {
    this.displayAddKit = !this.displayAddKit;
  }
  onContinous() {
    this.displayContinuous = !this.displayContinuous;
  }

  onApply() {
    if (this.projectQuotesData.length == 0) {
      this.utilityService.toast.info('No items listed to be Multiplied.');
      return false;
    }
    if (
      this.form.get('multiplier').value == '' ||
      this.form.get('multiplier').value === undefined ||
      this.form.get('multiplier').value == null
    ) {
      this.openedAdd = !this.openedAdd;
      this.errorMessage = 'Multiplier must be a number value.';
      this.form.controls['multiplier'].setValue('');
    } else if (
      this.form.get('multiplier').value < 0.68 ||
      this.form.get('multiplier').value > 1
    ) {
      this.openedAdd = !this.openedAdd;
      this.errorMessage = 'Multiplier must be a between 0.68 and 1';
      this.form.controls['multiplier'].setValue('');
    } else {
      this.errorMessage =
        'Do you want to save and apply a' +
        ' ' +
        this.form.controls['multiplier'].value +
        ' ' +
        'modifier to all items?';
      this.isOpenMultiplier = !this.isOpenMultiplier;
    }
  }
  public closeAdd(status) {
    if (status == 'yes') {
      this.openedAdd = !this.openedAdd;
    } else {
      this.openedAdd = !this.openedAdd;
    }
  }

  public closeMultilier(status) {
    if (status == 'yes') {
      this.openedMultilier = !this.openedMultilier;
    } else {
      this.openedMultilier = !this.openedMultilier;
    }
  }
  AddItem() {
    this.diplayitemDrp = !this.diplayitemDrp;
  }
  closepopup() {
    this.diplayitemDrp = !this.diplayitemDrp;
  }
  onFilter(value) { }
  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.data = {
      data: orderBy(this.projectQuotesData, this.sort),
      total: this.projectQuotesData.length,
    };
    this.projectQuotesData = this.data.data;
  }

  //#region get Form Details
  getFormDetails(data) {
    this.jobNumber = data.jobNumber;
    this.qoutebranch = data.branch;
    this.state = data.jobState;
    this.FilterValue.CurrentBranchName = data.branchName; this.FilterValue.CurrentBranch = data.branch; this.FilterValue.customerName = data.customerName; this.FilterValue.am = data.accountManager; this.FilterValue.jobNumer = data.jobNumber; this.FilterValue.projectContact = data.repPhone; this.FilterValue.projectNumber = data.jobNumber; this.FilterValue.projectName = data.jobName; this.FilterValue.pmEmail = this.currentUserEmail; this.FilterValue.changeNumber = this.changeNumber;
    this.FilterValue.globalBranch = this.globalSelectedBranch;
    this.FilterValue.customerRep = data.customerRep; this.FilterValue.custAddress = data.custAddress; this.FilterValue.jobLocation = data.jobLocation; this.getChangeDropdown();
  }
  //#endregion

  resetData(){this.qoutesDetails={};this.isvisible=false;
    this.FilterValue = {
      LookupNumber: null,
      CurrentBranch: null,
      customerName: null,
      am: null, jobNumer: null, projectContact: null, projectNumber: null, projectName: null, pmEmail: null, changeNumber: null,
      CurrentBranchName: null, globalBranch: null, customerRep: null, custAddress: null, jobLocation: null, branchCode: null
    };
    this.projectQuotesData = [];
  }
  //#region Bind Qoutes Grid
  GetQuoteList() {
    this.projectQuotesData = [];
    this.projectService
      .GetQuoteList(this.jobNumber, this.changeNumber)
      .subscribe((res) => {
        if (res.length > 0) {
          this.isvisible = true; this.isQuoteTypeVisible = false; this.selectedQuoteType = '';
          this.projectQuotesData = res;
          console.log(this.projectQuotesData);
          this.period = this.projectQuotesData[0].period;
        } else {
          this.isvisible = false;
          this.isQuoteTypeVisible = true;
        }
      });
  }
  //#endregion

  //#region get Grid List Model
  createProjectQuoteListRequestModel() {
    this.projectQuoteListRequestModel = new ProjectQuoteListRequestModel();
    this.projectQuoteListRequestModel.JobNumber = this.jobNumber;
    this.projectQuoteListRequestModel.ChangeOrder = this.changeNumber;
  }
  //#endregion
  //#region select Change Order
  onValueChange(event) {
    this.changeNumber = event; this.selectedQuoteType = '';
    this.projectQuoteListRequestModel.ChangeOrder = this.changeNumber;
    this.GetQuoteList();
  }
  //#endregion

  //#region get Change Dropdown list
  getChangeDropdown() {
    this.orderTypeData = [];
    this.dropdownService.getChangeOrder(this.jobNumber).subscribe((res) => {
      this.orderTypeData = res;
      if (this.orderTypeData.length > 0) {
        if (this.isNewChangeOrderCreated) {
          this.changeNumber = this.newChangeOrderNumber;
        } else {
          this.changeNumber = res[0].changeNumber;
        }
        this.isNewChangeOrderCreated = false;

        this.form.controls['changeNumber'].setValue(this.changeNumber);
        this.GetQuoteList();
        this.getQoutesDetails();
      } else {
        this.form.controls['changeNumber'].setValue('');
        this.projectQuotesData = [];
        this.qoutesDetails = [];
      }
    });
  }
  //#endregion

  //#region Bind Item Code
  getItemCode() {
    this.gridView = [];
    this.createQuotePartDropDownRequestModel();
    this.projectService
      .GetQuotePartDropdownList(this.quotePartDropDownRequestModel)
      .subscribe((res) => {
        this.gridView = res;
      });
  }
  onSearchClick() {
    this.searchText = this.form.get('description').value;
    this.getItemCode();
  }
  //#endregion

  //#region Bind Qoutes Details
  getQoutesDetails() {
    this.qoutesDetails = [];
    this.projectService
      .getQoutesDetails(this.jobNumber, this.changeNumber)
      .subscribe((res) => {
        if (res.length > 0) {
          this.qoutesDetails = res[0];
          console.log(res);
          this.salesTaxPerc = this.qoutesDetails.salesTaxPercentage;
          this.complete = this.qoutesDetails.complete;
          this.printNotes = this.qoutesDetails.printNotes;
          this.note = this.qoutesDetails.notes;
          this.totalEquipment = this.qoutesDetails.totalEquipment;
          this.totalOther = this.qoutesDetails.totalOther;
          this.qouteType = this.qoutesDetails.quoteType;
          this.getItemCode();
        } else {
          this.salesTaxPerc = '0';
          this.complete = false;
          this.printNotes = false;
          this.note = 'testtt';
          this.totalEquipment = 0;
          this.totalOther = 0;
          this.form.controls['changeNumber'].setValue(0);
        }
      });
  }
  createQuotePartDropDownRequestModel() {
    this.quotePartDropDownRequestModel = new QuotePartDropDownRequestModel();
    this.getQouteTypeNumber();
    this.quotePartDropDownRequestModel.QuoteType = this.qouteTypeNumber;
    this.quotePartDropDownRequestModel.SearchText = this.searchText;
  }
  //#endregion

  //#region onApplyClick()
  onApplyMultuplierClick(status) {
    if (status == 'yes') {
      this.isOpenMultiplier = !this.isOpenMultiplier;
      this.applyMultiplier();
      this.form.controls['multiplier'].setValue('');
    } else {
      this.isOpenMultiplier = !this.isOpenMultiplier;
      this.form.controls['multiplier'].setValue('');
    }
  }
  applyMultiplier() {
    this.quoteMultiplierApplyModel = new QuoteMultiplierApplyModel();
    this.quoteMultiplierApplyModel.Multiplier =
      this.form.get('multiplier').value;
    this.quoteMultiplierApplyModel.JobNumber = this.jobNumber;
    this.quoteMultiplierApplyModel.ChangeOrder = this.changeNumber;
    this.projectService
      .addMultiplier(this.quoteMultiplierApplyModel)
      .subscribe((res) => {
        if (res['status'] == 200) {
          this.utilityService.toast.success(res.message);
          this.GetQuoteList();
          this.backButtonEvent.emit();
        } else {
          this.utilityService.toast.error(res.message);
        }
      });
  }
  //#endregion

  //#region New Order Yes Click
  onNewOrderYesClick() {
    this.isNewOrder = !this.isNewOrder;
  }
  //#endregion

  //#region Add Item Click
  onAddItem() {
    if (
      this.itemCodeNumber == '' ||
      this.itemCodeNumber === undefined ||
      this.itemCodeNumber == null
    ) {
      this.errorMessage = 'Please Select an item';

      this.openedAdd = !this.openedAdd;
    } else if (
      this.form.get('itemCode').value == '' ||
      this.form.get('itemCode').value === undefined ||
      this.form.get('itemCode').value == null
    ) {
      this.errorMessage = 'Quantity must be a numeric.';

      this.openedAdd = !this.openedAdd;
    } else {
      this.displayContinuous = false;
      this.projectService
        .GetQuotePriceDetails(this.itemCodeNumber, this.qoutebranch)
        .subscribe((res) => {
          if (res.length > 0) {
            this.qoutePriceDetails = res;
            this.setPrice();
            this.setRate();
            var objData = {
              inventoryType: this.itemCodeNumber,
              description: this.itemCodeDescription,
              qty: this.form.controls['itemCode'].value,
              rate: this.rate,
              total: this.form.controls['itemCode'].value * this.rate,
            };
            var objNewData = {
              InventoryType: this.itemCodeNumber,
              Description: this.itemCodeDescription,
              Quantity: this.form.controls['itemCode'].value,
              Rate: this.rate,
              Total: this.form.controls['itemCode'].value * this.rate,
              Usage: this.hasUsage,
              PartNumber: this.partId,
            };
            this.projectQuotesData.push(objData);
            this.projectqoutesNewAddedData.push(objNewData);
            this.itemCodeNumber = '';
            this.form.controls['itemCode'].setValue('');
          }
        });
    }
  }
  //#endregion

  //#region item code grid click
  itemCodeClick(event) {
    this.diplayitemDrp = !this.diplayitemDrp;
    this.itemCodeNumber = event.invType;
    this.itemCodeDescription = event.description;
    this.hasUsage = event.hasUsage;
    this.partId = event.partId;

    if (event.hasUsage) {
      this.hasUsage = true; this.qoutesDetails.shiftType = 'Continous';
      this.displayContinuous = true;
    } else
      this.displayContinuous = false;
  }
  //#endregion

  //#region On Edit Click
  onEditClick() {
    this.isDisabled = false;
  }
  //#endregion

  //#region On Cancel Click
  onCancelClick() {
    this.isDisabled = true;
    this.itemCodeNumber = '';
    this.hasUsage = false;
  }
  //#endregion

  //#region On Save Click

  //#endregion

  //#region create New Order
  createNewOrder(status) {
    if (status == 'yes') {
      this.isNewChangeOrderCreated = true;
      this.isCreateOrder = !this.isCreateOrder;
      this.onCreateNewOrderYesClick();
    } else {
      this.isCreateOrder = !this.isCreateOrder;
    }
  }

  onCreateNewOrderYesClick() {
    this.projectService.addChangeOrder(this.jobNumber).subscribe((res) => {
      if (res['status'] == 200) {
        this.utilityService.toast.success(res.message);
        this.changeNumber = res.result.newChangeOrderNumber;
        this.newChangeOrderNumber = this.changeNumber;
        this.form.controls['changeNumber'].setValue(this.newChangeOrderNumber);
        this.getChangeDropdown();
      } else {
        this.utilityService.toast.error(res.message);
      }
    });
  }
  //#endregion

  //#region copy Change Order
  copyChangeOrder() {
    this.isNewChangeOrderCreated = true;
    this.projectService
      .copyChangeOrder(this.jobNumber, this.selectedChangeOrder)
      .subscribe((res) => {
        if (res['status'] == 200) {
          this.utilityService.toast.success(res.message);
          this.changeNumber = res.result.newChangeOrderNumber;
          this.newChangeOrderNumber = this.changeNumber;
          this.form.controls['changeNumber'].setValue(this.changeNumber);
          this.getChangeDropdown();
        } else {
          this.utilityService.toast.error(res.message);
          this.isNewChangeOrderCreated = false;
        }
      });
  }
  onChangeOrderValueChange(event) {
    this.selectedChangeOrder = event;
  }
  //#endregion

  //#region refresh change Order Dropdown
  refreshChangeOrder() {
    this.dropdownService.getChangeOrder(this.jobNumber).subscribe((res) => {
      this.orderTypeData = res;
    });
  }
  //#endregion

  //#region status changes
  onShiftStatus(event) {
    this.shift = event;
  }
  //#endregion
  onProposalStatus(event) {
    console.log('event', event);
    this.isCreateProposal = true;
    if (event) {
      this.FilterValue.LookupNumber = event;
      // this.projectService
      //   .getExportToExcelProposalTemplate(this.FilterValue)
      //   .subscribe((res) => {
      //     if (res && res.size > 0) {
      //       let data = new Blob([res], {
      //         type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;',
      //       });
      //       fileSaver.saveAs(
      //         data,
      //         'ProjectQuote' + new Date().toLocaleDateString('en-US') + '.xlsx'
      //       );
      //     }
      //   });
    }
  }
  //#region Set Price
  setPrice() {
    if (this.qoutesDetails.quoteType == 'R') {
      if (this.period.trim() == 'Monthly') {
        this.rate = this.qoutePriceDetails[0].monthlyRate;
      } else if (this.period == 'Daily') {
        this.rate = this.qoutePriceDetails[0].dailyRate;
      } else if (this.period == 'Weekly') {
        this.rate = this.qoutePriceDetails.weeklyRate;
      }
    } else if (this.qoutesDetails.quoteType == 'S') {
      this.rate = this.qoutePriceDetails[0].listPrice;
    }
  }
  setRate() {
    if (this.hasUsage) {
      if (this.shift == 'Continous') {
        this.rate = this.rate * 2;
      }
    }
  }
  //#endregion

  //#region on Period Change
  onPeriodChange(event) {
    if (event == 1) {
      this.period = 'Monthly';
    } else if (event == 2) {
      this.period = 'Daily';
    } else if (event == 3) {
      this.period = 'Weekly';
    }
    this.isOverWritePeriod = true;
  }
  onOverWritePeriodChange(data) {
    if (data == 'yes') {
      this.isOverWritePeriod = !this.isOverWritePeriod;
      this.changePeriod();
    } else if (data == 'No') {
      this.isOverWritePeriod = !this.isOverWritePeriod;
    } else {
      this.isOverWritePeriod = !this.isOverWritePeriod;
    }
  }
  changePeriod() {
    this.quoteChangePeriodModel = new QuoteChangePeriodModel();
    this.quoteChangePeriodModel.Period = this.period;
    this.quoteChangePeriodModel.JobNumber = this.jobNumber;
    this.quoteChangePeriodModel.ChangeOrder = this.changeNumber;
    this.projectService
      .changePeriod(this.quoteChangePeriodModel)
      .subscribe((res) => {
        console.log(res);
        if (res['status'] == 200) {
          this.utilityService.toast.success(res.message);
          this.GetQuoteList();
        } else {
          this.utilityService.toast.error(res.message);
        }
      });
  }
  //#endregion

  //#region onSave()
  onSaveClick() {
    var saveModal = new QuoteSaveRequestModel();
    saveModal = this.createSaveModel();
    this.projectService.saveQoutes(saveModal).subscribe((res) => {
      if (res['status'] == 200) {this.displayContinuous=false;
        this.utilityService.toast.success(res.message);
        this.GetQuoteList();
        this.projectqoutesNewAddedData = [];
      } else {
        this.utilityService.toast.error(res.message);
        this.projectqoutesNewAddedData = [];
      }
    });
    this.isDisabled = true;
  }
  createSaveModel() {
    var saveModal = new QuoteSaveRequestModel();
    this.getQouteTypeNumber();
    saveModal.JobNumber = this.jobNumber;
    saveModal.ChangeNumber = this.changeNumber;
    saveModal.Completed = this.complete;
    saveModal.PrintNote = this.printNotes;
    saveModal.Notes = this.note;
    saveModal.Period = this.period?.trim();
    // this.qouteType == 'R' ? this.qoutesEnum.Rental : this.qoutesEnum.Sales;
    saveModal.QuoteType = this.qouteTypeNumber;
    saveModal.Items = this.projectqoutesNewAddedData;
    return saveModal;
  }

  getQouteTypeNumber() {
    if (this.qouteType == 'R') {
      this.qouteTypeNumber = 1;
    } else if (this.qouteType == 'S') {
      this.qouteTypeNumber = 0;
    }
  }
  //#endregion

  //#region

  getDefaultLocationByUsername() {
    this.hrService
      .getDefaultLocationByUserName(this.currentUser)
      .subscribe((res) => {
        this.selectedBranch = res.result.defaultLocation;
        this.GetPath();
      });
  }
  GetPath() {
    var utilityValue = 'TAC-' + this.selectedBranch;
    this.fleetInfoService
      .GetUtilityDetail(61, utilityValue)
      .subscribe((res) => {
        console.log(res);
        this.path = res[0].utilityValue;
      });
  }
  onTermsNConditions() {
    // directoryPath: '\\\\192.168.0.2\\Mersino\\01  Administration\\MDI\\Trenching\\Trenching Budget Excel.xlsx',
    // var cleanStr = this.path.replace(/Reagan/g, '192.168.0.2');
    // this.path = cleanStr;
    this.networkService.DownloadFile(encodeURI(this.termsAndConditionsFile.directoryPath)).subscribe(
      (data) => {
        saveAs(
          data,
          'TermsNConditions' + new Date().toLocaleDateString('en-US') + '.pdf'
        );
      },
      (error) => {
        console.log('Something went wrong');
      }
    );
  }
  //#endregion
  backButtonEvents($event) {
    this.onDeepWellBudget();
  }
  backButtonWellPOint($event) {
    this.onWellpointBudget();
  }
  createProp(status) {
    if (status == 'yes') {
      this.FilterValue.branchCode = this.selectedBranch;
      this.isCreateProposal = false;
      if (this.FilterValue.LookupNumber == 190) {
        //this.FilterValue.LookupNumber = this.FilterValue.LookupNumber;        
        this.FilterValue.globalBranch = JSON.parse(localStorage.getItem('selectedBranch'))[0].code;
        this.projectService
          .getExportToExcelProposalPIFTemplate(this.FilterValue)
          .subscribe((res) => {
            if (res && res!='NO FILE' && res.size > 0) {
              let data = new Blob([res], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
              });
              fileSaver.saveAs(
                data,
                'ProposalPIF_' + new Date().toLocaleDateString('en-US') + '.xlsx'
              );
            } 
            else
            {
              this.utilityService.toast.error(
                'No File.'
              );
            }
          });
      }
      else {
        if (this.FilterValue.LookupNumber) {
          //this.FilterValue.LookupNumber = event;
          this.FilterValue.globalBranch = JSON.parse(localStorage.getItem('selectedBranch'))[0].code;
          this.projectService
            .getExportToExcelProposalTemplate(this.FilterValue)
            .subscribe((res) => {
              if (res && res!='NO FILE' && res.size > 0) {
                let data = new Blob([res], {
                  type: 'application/msword',
                });
                fileSaver.saveAs(
                  data,
                  'ProjectQuote' + new Date().toLocaleDateString('en-US') + '.doc'
                );
              } 
              else
              {
                this.utilityService.toast.error(
                  'No File.'
                );
              }
            });
        }
      }
    }
    else {
      this.isCreateProposal = false;
    }
  }
  onQuoteTypeChange(event) {this.period='Select Type';
    if (event != undefined) {
      this.isvisible = true;
      this.qoutesDetails.quoteType = (event == 0 ? 'S' : (event == 1 ? 'R' : ''));
      // if (event == 1) {
      //   this.displayMonthly=true;
      // }
    }
    else
      this.isvisible = false;
  }
  onPrintQuote() {
    if (this.projectQuotesData.length == 0) {
      this.utilityService.toast.info('No items listed to Print.');
      return false;
    }
    if (this.qoutesDetails.quoteType == 'R')
      this.isPrintPIF = true;
    else {
      this.quotesPrintRequestModel = new QuotesPrintRequestModel();
      this.quotesPrintRequestModel.Branch = this.selectedBranch;
      this.quotesPrintRequestModel.ChangeOrder = this.changeNumber;
      this.quotesPrintRequestModel.IsTaxed = 'yes';
      this.quotesPrintRequestModel.JobNumber = this.jobNumber.toString();
      this.quotesPrintRequestModel.PrintPIF = false;
      this.quotesPrintRequestModel.QuoteType = this.qoutesDetails.quoteType == 'S' ? 'Sales' : (this.qoutesDetails.quoteType == 'R' ? 'Rental' : 'Rental');
      this.quotesPrintRequestModel.State = this.state;
      this.isPrintPIF = false;
      this.projectService
        .getQuotePrint(this.quotesPrintRequestModel)
        .subscribe((res) => {
          if (res && res.size > 0) {
            let data = new Blob([res], {
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });
            fileSaver.saveAs(
              data,
              'Quote_' + new Date().toLocaleDateString('en-US') + '.xlsx'
            );
          }
        });
    }
  }
  createPrintPIF(status) {
    this.quotesPrintRequestModel = new QuotesPrintRequestModel();
    this.quotesPrintRequestModel.Branch = this.selectedBranch;
    this.quotesPrintRequestModel.ChangeOrder = this.changeNumber;
    this.quotesPrintRequestModel.IsTaxed = 'yes';
    this.quotesPrintRequestModel.JobNumber = this.jobNumber.toString();
    this.quotesPrintRequestModel.PrintPIF = false;
    this.quotesPrintRequestModel.QuoteType = this.qoutesDetails.quoteType == 'S' ? 'Sales' : (this.qoutesDetails.quoteType == 'R' ? 'Rental' : 'Rental');
    this.quotesPrintRequestModel.State = this.state;
    this.isPrintPIF = false;
    if (status == 'yes') {
      this.projectService
        .getExportToExcelProposalPIFTemplate(this.FilterValue)
        .subscribe((res) => {
          if (res && res.size > 0) {
            let data = new Blob([res], {
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });
            fileSaver.saveAs(
              data,
              'ProposalPIF_' + new Date().toLocaleDateString('en-US') + '.xlsx'
            );
          }
        });
      this.projectService
        .getQuotePrint(this.quotesPrintRequestModel)
        .subscribe((res) => {
          if (res && res.size > 0) {
            let data = new Blob([res], {
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });
            fileSaver.saveAs(
              data,
              'Quote_' + new Date().toLocaleDateString('en-US') + '.xlsx'
            );
          }
        });
    } else if (status == 'No') {
      this.projectService
        .getQuotePrint(this.quotesPrintRequestModel)
        .subscribe((res) => {
          if (res && res.size > 0) {
            let data = new Blob([res], {
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });
            fileSaver.saveAs(
              data,
              'Quote_' + new Date().toLocaleDateString('en-US') + '.xlsx'
            );
          }
        });
    }
  }
}
