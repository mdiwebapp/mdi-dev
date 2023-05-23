import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { GridDataResult, GroupKey } from '@progress/kendo-angular-grid';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilityService } from 'src/app/core/services/utility.service';
import { FleetInfoService } from './fleet-info.service';
import { FleetInfoModel } from './fleet-info.model';
import { BehaviorSubject } from 'rxjs';
//import { CustomAddress } from 'src/app/layout/ssg/google-map-address/address.model';
import { DropdownService } from 'src/app/core/services/dropdown.service';
import { ClipboardService } from 'ngx-clipboard';
import { MenuService } from 'src/app/core/helper/menu.service';
import { MultiSelectComponent } from '@progress/kendo-angular-dropdowns';
import { delay, switchMap, map, tap } from 'rxjs/operators';
import { from } from 'rxjs';
import { ModuleNames, ErrorMessages } from 'src/app/core/constant';
import {
  ViewData,
  ViewColumns,
  ViewColumns1,
  ViewGridColumnsComponents,
  ActivateInventoryColumns,
} from '../../../../../../../data/fleet-data';
import { PageChangeEvent } from '@progress/kendo-angular-grid';
import { DatePipe } from '@angular/common';
import {
  orderBy,
  process,
  SortDescriptor,
  State,
} from '@progress/kendo-data-query';
import { NetworkDirectoryService } from 'src/app/layout/networkdirectory/networkdirectorypage/networkdirectory.service';
import { ErrorHandlerService, PagerService } from 'src/app/core/services';
import { DomSanitizer } from '@angular/platform-browser';
import { FleetNotesComponent } from '../fleet-notes/fleet-notes.component';
import { FleetNotesService } from '../fleet-notes/fleet-notes.service';
export interface Item {
  title?: string;
  url?: string;
}

const randomInt = (min, max): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

@Component({
  selector: 'app-fleet-info',
  templateUrl: './fleet-info.component.html',
  styleUrls: ['./fleet-info.component.scss'],
})
export class FleetInfoComponent implements OnInit {
  @ViewChild(FleetNotesComponent) fleetNotes: FleetNotesComponent;
  @Output() fleetEvent = new EventEmitter();
  isSavedData: boolean = false;
  isAddData: boolean = false;
  @Output() isDataSaved = new EventEmitter<any>();
  // @Output() isAddorEdit = new EventEmitter<any>();
  InvDescription: string = '';
  valuesFile = {
    directoryPath: '\\\\192.168.0.9\\Mersino\\03  Logistics\\FLEET BOOKS',
    userName: 'MERSINO\\jagdip.joshi',
    password: 'oPDe8GP!SW83HNJS',
  } as any;
  source: any;
  multiple: boolean = false;
  picturesList: any;
  movementList: any;
  curveList: any;
  buildSheetList: any;
  disablePicturesList: boolean = true;
  disableMovementList: boolean = true;
  disableCurveList: boolean = true;
  disableBuildSheetList: boolean = true;
  public width = '100%';
  public height = '500px';
  lblLastInv: any;
  lblYTD: any;
  lblCostYTD: any;
  state: State = {
    group: [{ field: 'name' }],
  };
  purchaseDate: any;
  displayImage: boolean;
  imageName: string = '';
  expandedGroupKeys: Array<GroupKey> = [];
  @Output() SaveEditClick = new EventEmitter<number>();
  @Output() AddClick = new EventEmitter<number>();
  form: FormGroup;
  id: number = 0;
  data = [{ id: 0, name: 'All', parent: 0, items: [] }];
  strSend: string;
  data1: any;
  isdisableSN: boolean = true;
  isDisabled: boolean = false;
  @Input() onChange;
  isExpanded: boolean = false;
  isMoreDisabled: boolean = false;
  isMoreViewRight: boolean = false;
  isMoreAddRight: boolean = false;
  isMoreUpdateRight: boolean = false;
  isClone: boolean = false;
  invData: any = [];
  invColumn: any;
  invGridData: any;
  invUnitInfoData: any;
  invUnitInfoComponent: any;
  invUnitInfoComponentList: any[] = [];
  invGridColumn: any;
  displayInvDialog: boolean = false;
  displaybuildSheetDialog: boolean = false;
  displayMajorRepairNeededDiv: boolean = false;
  displayMovementDialog: boolean = false;
  displayBuildSheetDialog: boolean = false;
  displayImageDialog: boolean = false;
  selectedRow: any;
  InvType: any = 'Select Inv. Type';
  partNumber: any = '';
  InvNumber: any = '';
  location: any = '';
  branchLocation: any = '';
  imagUrl: any;
  public pageable: boolean = true;
  invLastInvoicedData: any;
  activateInventories: any = [];
  activateInventoriesList: any = [];
  activateInventoriesAllList: any = [];
  activateInventoryColumns: any;
  invComponentCheck: any;
  fleetSellInacComp: any;
  strFirst: any;
  strSecond: any;
  strMessage: any;
  lstInvNumber: string = '';
  intOut: number = 0;
  textInvNumber: any = '';
  searchText: any = '';
  visible: boolean = false;
  jobName: string;
  public sort: SortDescriptor[] = [
    {
      field: 'description',
      dir: 'asc',
    },
    {
      field: 'hours',
      dir: 'asc',
    },
    {
      field: 'tranDate',
      dir: 'asc',
    },
    {
      field: 'job',
      dir: 'asc',
    },
  ];
  public defaultsort: SortDescriptor[] = [{
    field: 'tranDate',
    dir: 'desc',
  }];
  displayAssignToFleet: boolean = false;
  public previewImg: number;
  componentListData: GridDataResult = process(
    this.invUnitInfoComponentList,
    this.state
  );
  customerName: string = '';
  componentId: any;
  indexCount: number = 0;
  viewGridColumnsComponents: any;
  selectedBranch: '';
  public mySelection: number[] = [0];
  invServiceYTDData: any;
  isActivateInventoryDialogVisible: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private clipboardApi: ClipboardService,
    public menuService: MenuService,
    public service: FleetInfoService,
    private utils: UtilityService,
    public dropdownservice: DropdownService,
    private networkService: NetworkDirectoryService,
    public errorHandler: ErrorHandlerService,
    private utility: UtilityService,
    private sanitizer: DomSanitizer,
    public datepipe: DatePipe,
    public pagerService: PagerService,
    private serviceNotes: FleetNotesService
  ) {
    this.getUtilityValue(74, 'EmailNewEquipment');
    this.isMoreViewRight = this.menuService.isMoreViewRight;
    this.isMoreAddRight = this.menuService.isMoreAddRight;
    this.isMoreUpdateRight = this.menuService.isMoreEditRight;
    this.invColumn = ViewColumns;
    this.invGridColumn = ViewColumns1;
    this.viewGridColumnsComponents = ViewGridColumnsComponents;
    this.activateInventoryColumns = ActivateInventoryColumns;
  }
  searchInvText = '';
  blMajor: boolean = false;
  blEdit: boolean = false;
  blAdd: boolean = false;
  public viewGridColumns = [
    {
      Name: 'ProductName',
      isCheck: true,
      Text: 'Product Name',
      isDisable: false,
      index: 0,
      width: 50,
    },
    {
      Name: 'value',
      isCheck: true,
      Text: 'Value',
      isDisable: false,
      index: 1,
      width: 50,
    },
  ];
  public gridData = [
    { id: 1, ProductName: 'Air Filter', value: '340868000000' },
    { id: 1, ProductName: 'Air Filter2', value: '340869000000' },
    { id: 1, ProductName: 'Enq Make', value: 'PERKINS' },
    { id: 1, ProductName: 'Enq Model', value: '3454 - GEN ENGINE' },
    { id: 1, ProductName: 'Oil FIlter', value: '340868000000' },
    { id: 1, ProductName: 'Primary Fuel Number', value: '7000068000000' },
    { id: 1, ProductName: 'Serial Number', value: 'R002878X' },
    { id: 1, ProductName: 'Tier', value: '3' },
    { id: 1, ProductName: 'Type', value: 'Diesel' },
  ];
  public value: any = [''];
  networkform: FormGroup;
  public totalData = 0;
  public pageSize = 100;
  public pageNumber = 1;
  public skip = 0;
  public currentPage = 1;
  tempPageNo: number;
  ViewColumnsFleetList: any;
  pageSizeList: any = [
    { id: 0, value: 100 },
    { id: 0, value: 300 },
    { id: 0, value: 500 },
  ];
  filter = {
    pageNumber: this.pageNumber,
    pageSize: this.pageSize,
    SearchText: this.searchInvText,
  };
  ngOnInit(): void {
    this.initForm();
    this.networkform = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      drivePath: ['', Validators.required],
    });
  }
  initForm(): void {
    this.form = this.formBuilder.group({
      invNumber: [''],
      invType: ['', Validators.required],
      make: ['', Validators.required],
      model: [''],
      modelNumber: [''],
      serialNumber: ['', Validators.required],
      ref1: [''],
      location: [''],
      sold: [''],
      majorRepairs: [false],
      lastInvoiced: [''],
      pictures: [null],
      picturesDate: [null],
      salesTax: [false],
      salesTaxDate: [''],
      insured: [false],
      insuredDate: [''],
      registerCA: [false],
      registerCADate: [''],
      inProductionDate: [''],
      RDDate: [''],
      correctDate: [''],
      inActive: [false],
      inActiveReason: [''],
      soldReason: [''],
      majorReason: [''],
      comments: [''],
      activeText: [''],
      selectedDate: [],
      soNumberText: [''],
      qbNumberText: [''],
      priceNumberText: [''],
      dateInactiveReason: [''],
      active: [false],
      soldSwitch: [false],
      salesTaxPaid: [true],
      Registered: [false],
      RD: [false],
      inProduction: [false],
      correct: [false],
      userName: JSON.parse(localStorage.getItem('currentUser')).userName,
    });
  }
  setValue(data: any) {
    this.form.reset();
    this.InvDescription = data.description;
    this.InvNumber = data.invNumber;
    this.InvType = data.invType;
    this.location = data.location;
    this.branchLocation = data.branchLocation;
    this.customerName = data.custName;
    this.jobName = data.jobName
    this.purchaseDate = data.purchaseDate || 'N/A';
    if (data.majorRepairs) {
      this.displayMajorRepairNeededDiv = true;
    } else {
      this.displayMajorRepairNeededDiv = false;
    }
    if (data.invNumber.includes('NONE ASSIGNED')) {
      this.displayAssignToFleet = true;
    } else
      this.displayAssignToFleet = false;
    this.form.setValue({
      invNumber: data.invNumber,
      invType: data.invType,
      make: data.make,
      model: data.model,
      modelNumber: data.modelNumber,
      serialNumber: data.serialNumber,
      ref1: data.ref1,
      location: data.location,
      sold: data.sold,
      majorRepairs: data.majorRepairs,
      lastInvoiced: '',
      pictures: data.pictures,
      picturesDate:
        data.picturesDate == null ? null : new Date(data.picturesDate),
      salesTax: data.salesTax,
      salesTaxDate:
        data.salesTaxDate == null ? null : new Date(data.salesTaxDate),
      insured: data.insured,
      insuredDate: data.insuredDate == null ? null : new Date(data.insuredDate),
      registerCA: '',
      registerCADate: '',
      inProductionDate: '',
      RDDate: '',
      correctDate: data.correctDate == null ? null : new Date(data.correctDate),
      inActive: data.inActive,
      inActiveReason: data.inActiveReason,
      soldReason: '',
      majorReason: '',
      comments: data.comments,
      activeText: '',
      selectedDate: '',
      soNumberText: '',
      qbNumberText: '',
      priceNumberText: '',
      dateInactiveReason: '',
      active: '',
      soldSwitch: data.sold,
      salesTaxPaid: data.salesTax,
      Registered: data.registered,
      RD: data.rd,
      inProduction: data.inProduction,
      correct: data.correct,
      userName: JSON.parse(localStorage.getItem('currentUser')).userName,
    });
  }
  btnCancel() {
    this.isExpanded = false;
    this.blEdit = false;
    this.blAdd = false;
    this.form.reset();
    this.form.disable();
  }

  btnAdd() {
    this.isExpanded = true;
    this.blAdd = true;
    this.customerName = '';
    this.InvType = 'Select Inv. Type';
    this.location = 'YARD';
    this.lblLastInv = 'Last Invoiced: N/A';
    this.lblYTD = 'Invoiced YTD: N/A';
    this.lblCostYTD = 'Service YTD: $0.0';
    this.purchaseDate = 'N/A';
    this.invGridData = [];
    this.branchLocation = '';
    this.jobName = '';
    this.InvNumber = '';
    this.displayMajorRepairNeededDiv = false;
    this.form.reset();
    this.form.enable();
    this.isDisabled = false;
  }

  btnEdit() {
    this.isExpanded = true;
    this.form.enable();
    this.isDisabled = true;
    this.blEdit = true;
    if (localStorage.getItem('isAdmin') == 'true') {

    } else {
      const rights = JSON.parse(localStorage.getItem('Rights'));
      var isdis = rights.find(
        (x) => (x.subModuleName == 'Unit Info' && x.tabName.toLowerCase() == ' update sn')
      );

      if (isdis) {
        this.isdisableSN = false
      }
      else {
        this.form.controls['serialNumber'].disable();
        this.isdisableSN = true
      }
    }
  }

  btnSave() {
    this.btnCancel();
  }

  btnMajor() {
    this.blMajor = this.form.value.majorRepairs;
  }

  DisplayInvBtn() {
    this.displayInvDialog = !this.displayInvDialog;
  }
  public close(status) {
    if (status == 'Ok') {
      this.displayInvDialog = !this.displayInvDialog;
    } else if (status == 'Cancel') {
      this.displayInvDialog = !this.displayInvDialog;
    } else {
      this.displayInvDialog = !this.displayInvDialog;
    }
    this.searchInvText = '';
    this.getInvType();
  }
  changeMajorRepairNeeded(value) {
    this.form.value.majorRepairs = value;
    this.displayMajorRepairNeededDiv = !this.displayMajorRepairNeededDiv;
  }
  onOpenMovementDialog() {
    this.displayMovementDialog = !this.displayMovementDialog;
  }
  closeMovementDialog(status) {
    if (status == 'Ok') {
      this.displayMovementDialog = !this.displayMovementDialog;
    } else if (status == 'Cancel') {
      this.displayMovementDialog = !this.displayMovementDialog;
    } else {
      this.displayMovementDialog = !this.displayMovementDialog;
    }
  }
  onOpenBuildSheetDialog() {
    this.displayBuildSheetDialog = !this.displayBuildSheetDialog;
  }
  closeBuildSheetDialog(status) {
    if (status == 'Ok') {
      this.displayBuildSheetDialog = !this.displayBuildSheetDialog;
    } else if (status == 'Cancel') {
      this.displayBuildSheetDialog = !this.displayBuildSheetDialog;
    } else {
      this.displayBuildSheetDialog = !this.displayBuildSheetDialog;
    }
  }
  onOpenPicsDialog() {
    this.displayImageDialog = !this.displayImageDialog;
  }
  closePicsDialog(status) {
    if (status == 'Ok') {
      this.displayImageDialog = !this.displayImageDialog;
    } else if (status == 'Cancel') {
      this.displayImageDialog = !this.displayImageDialog;
    } else {
      this.displayImageDialog = !this.displayImageDialog;
    }
  }
  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.data1 = {
      data: orderBy(this.invGridData, this.sort),
      total: this.invGridData.length,
    };
    this.invGridData = this.data1.data;
  }

  getInvType() {

    this.service.GetFleetPartViewInvType(this.filter).subscribe((res) => {
      this.invData = [];
      this.invData = res;
      this.totalData = this.invData[0].totalRecords;
    });
  }
  getFleetUnitInfoAdorsHours(invNumber) {

    this.service.GetFleetUnitInfoAdorsHours(invNumber).subscribe((res) => {

      if (res.length > 0) {
        this.data1 = {
          data: orderBy(res, this.defaultsort),
          total: res.length,
        };
        this.invGridData = this.data1.data;
      }
      else {
        this.invGridData = [];
      }
    });
  }
  getFleetAdorsUnitInfo(invNumber) {
    // this.service.GetFleetAdorsUnitInfo(invNumber).subscribe((res) => {
    //   this.invUnitInfoData = res[0];
    //   this.setValue(this.invUnitInfoData);
    // });
  }
  getFleetAdorsComponent(invNumber) {
    this.service.GetFleetAdorsComponent(invNumber).subscribe((res) => {

      this.invUnitInfoComponent = res;
      this.invUnitInfoComponentList = [];

      this.invUnitInfoComponent.forEach((element) => {

        Object.keys(element).map((key) => {

          if (element[key] != null && element[key] != '') {
            if (key.includes('chassis')) {
              this.getComponent('Chassis', key, element[key]);
            }
            if (key.includes('priming')) {
              this.getComponent(
                'Priming System',
                key.replace('primingSystem', ''),
                element[key]
              );
            }
            if (key.includes('control')) {
              this.getComponent(
                'Control Panel',
                key.replace('controlpanel', ''),
                element[key]
              );
            }
            if (key.includes('pump')) {
              this.getComponent(
                'Pump End',
                key.replace('pumpEnd', ''),
                element[key]
              );
            }
            if (key.includes('vac')) {
              this.getComponent(
                'Vaccum Pump',
                key.replace('vaccum', ''),
                element[key]
              );
            }
            if (key.includes('engine')) {
              this.getComponent(
                'Engine',
                key.replace('engine', ''),
                element[key]
              );
            }
            if (key.includes('gear')) {
              this.getComponent(
                'Gear Box',
                key.replace('gear', ''),
                element[key]
              );
            }
            if (key.includes('messenger')) {
              this.getComponent(
                'Messenger',
                key.replace('messengerID', 'Messenger ID'),
                element[key]
              );
            }
          }
        });
      });

      this.componentListData = process(
        this.invUnitInfoComponentList,
        this.state
      );
    });
  }
  getComponent(name, key, value) {
    this.invUnitInfoComponentList.push({
      name: name,
      type: key,
      value: value,
    });
  }
  onGridSelectionChange($event) {
    this.selectedRow = $event.selectedRows[0].dataItem;
    this.InvType = this.selectedRow.invType;
    this.partNumber = this.selectedRow.pk;
    this.form.controls['invType'].setValue(this.InvType);
    this.displayInvDialog = !this.displayInvDialog;
  }
  // getFleetUnitInfoPartsServiceComponent(invNumber) {
  //   this.service
  //     .GetFleetUnitInfoPartsServiceComponent(invNumber)
  //     .subscribe((res) => {
  //       this.gridPartsServiceData = res;
  //     });
  // }
  groupChange(): void {
    this.expandedGroupKeys = [];
  }

  loadPicturesFiles(invNumber) {
    this.valuesFile.directoryPath =
      '\\\\192.168.0.2\\Mersino\\03  Logistics\\FLEET BOOKS\\' +
      invNumber +
      '\\01 - Pictures';
    this.networkService.GetDirectoryDetails(this.valuesFile).subscribe(
      (res) => {
        this.picturesList = res[0].files;
        if (this.picturesList.length > 0) {
          this.disablePicturesList = false;
        } else {
          this.disablePicturesList = true;
        }
      },
      (error) => {
        this.disablePicturesList = true;
      }
    );
  }
  displayPicturesFiles() {
    if (this.picturesList.length > 0) {
      this.displayImageDialog = true;
      this.previewImage(this.picturesList[0]);
    }
  }
  loadMovementFiles(invNumber) {
    this.valuesFile.directoryPath =
      '\\\\192.168.0.2\\Mersino\\03  Logistics\\FLEET BOOKS\\' +
      invNumber +
      '\\14 - Movement';
    this.networkService.GetDirectoryDetails(this.valuesFile).subscribe(
      (res) => {
        this.movementList = res[0].files;
        if (this.movementList.length > 0) {
          this.disableMovementList = false;
        } else {
          this.disableMovementList = true;
        }
      },
      (error) => {
        this.disableMovementList = true;
      }
    );
  }
  displayMovementFiles() {
    if (this.movementList.length > 0) {
      this.displayMovementDialog = true;
      this.imageName = 'MDI3.0';
      this.previewImage(this.movementList[0]);
    }
  }
  loadCurveFiles(invNumber) {
    this.valuesFile.directoryPath =
      '\\\\192.168.0.2\\Mersino\\03  Logistics\\FLEET BOOKS\\' +
      invNumber +
      '\\02 - Curves';
    this.networkService.GetDirectoryDetails(this.valuesFile).subscribe(
      (res) => {
        this.curveList = res[0].files;
        if (this.curveList.length > 0) {
          this.disableCurveList = false;
        } else {
          this.disableCurveList = true;
        }
      },
      (error) => {
        this.disableCurveList = true;
      }
    );
  }
  displayCurveFiles() {
    if (this.curveList.length > 0) {
      this.previewImage(this.curveList[0]);
    }
  }
  loadBuildSheetFiles(invNumber) {
    this.valuesFile.directoryPath =
      '\\\\192.168.0.2\\Mersino\\03  Logistics\\FLEET BOOKS\\' +
      invNumber +
      '\\04 - Build Sheet and OIS';
    this.networkService.GetDirectoryDetails(this.valuesFile).subscribe(
      (res) => {
        this.buildSheetList = res[0].files;
        if (this.buildSheetList.length > 0) {
          this.disableBuildSheetList = false;
        } else {
          this.disableBuildSheetList = true;
        }
      },
      (error) => {
        this.disableBuildSheetList = true;
      }
    );
  }

  displayBuildSheetFiles() {
    if (this.buildSheetList.length > 0) {
      this.previewImage(this.buildSheetList[0]);
    } else {
      this.onOpenBuildSheetDialog();
    }
  }
  onEdit(res) {
    this.setValue(res);
  }
  onSave(isInavtive, selectedBranch) {

    if (
      (this.form.value.majorRepairs && this.form.value.comments == null) ||
      (this.form.value.majorRepairs && this.form.value.comments == '')
    ) {
      this.utility.toast.error('Enter major Repair Info before saving');
    } else if (this.form.value.sold && !this.form.value.inActive == null) {
      this.utility.toast.error('Sold unit must be marked Inactive.');
    } else if (this.form.value.sold && !this.form.value.inActive == null) {
      this.utility.toast.error('Sold unit must be marked Inactive.');
    } else {

      this.form.value.createdBy = JSON.parse(
        localStorage.getItem('currentUser')
      ).userName;
      this.form.value.quantity = 1;
      this.form.value.location = 'YARD';

      // var currentBramch = 'ALL';
      // if (currentBramch == 'ALL') {
      //   if (this.form.value.branchLocation != 'MI') {
      //     this.form.value.branchLocation = currentBramch;
      //   }
      // }

      this.form.value.inActive = isInavtive;
      // this.form.value.active = isInavtive==false?true:false;
      if (isInavtive) {
        this.form.value.inActiveReason = 'Fleet Inactivated';
        this.form.value.inActiveDate = new Date();
      }


      if (this.form.invalid) {
        this.form.markAllAsTouched();
        return false;
      }
      this.visible = true;
      if (this.blAdd) {
        if (selectedBranch[0].code == 'All') {
          this.visible = false;
          this.utils.toast.error('Please select branch.');
          return false;
        }
        this.form.value.branchLocation = selectedBranch[0].code;
        var username = JSON.parse(localStorage.getItem('currentUser')).userName;
        this.form.value.invNumber =
          'NONE ASSIGNED - ' +
          username.substring(0, 2) +
          '' +
          Math.random().toFixed(5).replace(/\d\./, '');
        this.InvNumber = this.form.value.invNumber;
        this.form.value.InfoInventoryNumber = this.form.value.invNumber;
        var data = {
          PartNumber: this.partNumber,
          InventoryNumber: this.form.value.invNumber,
          Quantity: this.form.value.quantity,
          InventoryType: this.form.value.invType,
          Location: this.form.value.location,
          CreatedBy: this.form.value.createdBy,
          CreatedDate: new Date(),
          branchLocation: this.form.value.branchLocation,
          inActiveReason: this.form.value.inActiveReason,
          inactiveDate: this.form.value.inActiveDate,
          inActive: this.form.value.inActive,
          picturesDate: this.datepipe.transform(this.form.value.picturesDate, 'MM/dd/yyyy'),
          make: this.form.value.make,
          model: this.form.value.model,
          modelNumber: this.form.value.modelNumber,
          serialNumber: this.form.value.serialNumber,
          ref1: this.form.value.ref1,
          comments: this.form.value.comments,
          insured: this.form.value.insured == true ? true : false,
          registered: this.form.value.registered == true ? true : false,
          correct: this.form.value.correct == true ? true : false,
          inProduction: this.form.value.inProduction,
          rD: this.form.value.rD == true ? true : false
        };
        this.addUnitInfo(data);
        var Addobj = { "isAdd": true, "inventoryNumber": '' }
        return true;
        // this.isAddorEdit.emit(Addobj);
      } else {
        this.editUnitInfo();
        var Editobj = { "isAdd": false, "inventoryNumber": this.form.value.invNumber };
        return true;
        // this.isAddorEdit.emit(Editobj);
      }
    }
  }
  sendMail(msg1, invNumberMsg, invNumberMsg1, msg2, email, id) {
    var data = {
      toEmail: msg1,
      subject: invNumberMsg,
      body: invNumberMsg1,
      body1: msg2,
      fromEmail: email,
      id: id,
    };
    this.service.sendFleetMail(data).subscribe(
      (res) => {
        this.data = res;
        if (res.length > 0) {
          this.strSend = res[0].UtilityValue;
        }
      },
      (failed) => { }
    );
  }

  getUtilityValue(id, value) {
    this.service.GetUtilityDetail(id, value).subscribe(
      (res) => {
        this.data = res;
        if (res.length > 0) {
          if (res[0].UtilityValue != undefined) {
            this.strSend = res[0].UtilityValue;
          } else {
            this.strSend = 'jeff.dinnan@mersino.com';
          }
        }
      },
      (failed) => { }
    );
  }

  public selectedKeys: any[] = ['0'];

  public next() {
    if (parseInt(this.selectedKeys[0]) < this.picturesList.length) {
      this.previewImg = parseInt(this.selectedKeys[0]) + 1;
      this.selectedKeys = [this.previewImg];
      this.previewImage(this.picturesList[this.previewImg]);
    }
  }

  public previous() {
    if (parseInt(this.selectedKeys[0]) > 0) {
      this.previewImg = parseInt(this.selectedKeys[0]) - 1;
      this.selectedKeys = [this.previewImg];
      this.previewImage(this.picturesList[this.previewImg]);
    }
  }

  previewImage(dataItem) {
    let unsafeImageUrl;
    this.imageName = dataItem.name;
    let ext = dataItem.path.split('.').pop();
    this.networkService.DownloadFile(encodeURI(dataItem.path)).subscribe(
      (data) => {
        let thefile = new Blob([data], { type: data.type });
        unsafeImageUrl = URL.createObjectURL(thefile);
        this.imagUrl = this.sanitizer.bypassSecurityTrustUrl(unsafeImageUrl);
        this.displayImage = true; // !this.show;
        if (
          ext != 'JPEG' &&
          ext != 'jpeg' &&
          ext != 'jpg' &&
          ext != 'JPG' &&
          ext != 'png' &&
          ext != 'PNG'
        ) {
          this.displayImage = false;
          if (ext != 'pdf') {
          }
        }
        if (ext == 'pdf' || ext == 'PDF') {
          var a = document.createElement('a');
          document.body.appendChild(a);
          // thefile = new Blob([data], { type: data.type }),
          //   error => {};
          let url = window.URL.createObjectURL(thefile);
          a.href = url;
          a.download = this.imageName;
          // a.target = '_blank';
          a.click();
        }
      },
      (error) => {
        console.log('Something went wrong');
      }
    );
  }


  GetFleetUnitInfoLastInvoiced(invNumber) {
    this.service.GetFleetLastInvoiced(invNumber).subscribe((res) => {
      this.invLastInvoicedData = res;
      if (this.invLastInvoicedData.length > 0) {
        if (
          this.invLastInvoicedData[0].lastInvoiced != 'null' &&
          this.invLastInvoicedData[0].lastInvoiced != null
        ) {
          this.lblLastInv =
            'Last Invoiced: ' +
            this.datepipe.transform(
              this.invLastInvoicedData[0].lastInvoiced,
              'MM/dd/yyyy'
            );
        } else {
          this.lblLastInv = 'Last Invoiced: N/A';
        }
        this.lblYTD =
          'Invoiced YTD: $' + this.invLastInvoicedData[0].ytd.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          });
      } else {
        this.lblLastInv = 'Last Invoiced: N/A';
        this.lblYTD = 'Invoiced YTD: N/A';
      }
    });
  }

  GetFleetUnitInfoServiceYTD(invNumber) {
    this.service.GetFleetServiceYTD(invNumber).subscribe((res) => {
      this.invServiceYTDData = res;
      this.lblCostYTD =
        'Service YTD: $' + this.invServiceYTDData[0].total.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });
    });
  }

  onHandleActivateInventoryDialog(status) {
    if (status == 'yes') {
      this.isActivateInventoryDialogVisible =
        !this.isActivateInventoryDialogVisible;
      this.getActiveInvNumber();
      this.getActiveInvNumberList();
    } else {
      this.isActivateInventoryDialogVisible =
        !this.isActivateInventoryDialogVisible;
    }
  }
  getActiveInvNumber() {
    this.service
      .GetFleetActiveInvListDetails(this.InvNumber, this.InvType)
      .subscribe((res) => {
        this.activateInventories = res;
      });
  }
  getActiveInvNumberList() {
    this.service.GetFleetActiveInvList(this.InvType).subscribe((res) => {
      this.activateInventoriesAllList = res;
      console.log('activateInventoriesList', this.activateInventoriesAllList);
    });
  }
  onResizeColumn(event) { }

  onSelectionChange(event) {
    this.lstInvNumber = event.selectedRows[0].dataItem.invNumber;
  }

  onSortChange(event) { }

  onReOrderColumns(event) { }

  onDataStateChange(event) { }

  onUnAssigned(value) {
    this.displayAssignToFleet = value;
  }

  getAllActiveInvNumber() {
    this.service.GetFleetActiveInvAllList(this.InvType).subscribe(
      (res) => {
        this.activateInventoriesAllList = res;
        if (this.activateInventoriesAllList.length > 0) {
          this.lstInvNumber = this.activateInventoriesAllList[0].invNumber;
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.fleet.get_inactive_fleet);
      }
    );
  }
  getComponentCheck(invNumber) {
    this.service.GetFleetComponentCheck(invNumber).subscribe((res) => {
      this.invComponentCheck = res;
    });
  }
  getFleetSellInacComponent(invNumber, qb, ir, salesNumber, userName, sold) {
    this.service
      .GetFleetSellInacComponent(invNumber, qb, ir, salesNumber, userName, sold)
      .subscribe((res) => {
        this.fleetSellInacComp = res;
      });
  }

  addInvInfo(add, date, by, invNumber) {
    var data = {
      add: add,
      date: date,
      by: by,
      invNumber: invNumber,
    };
    this.service.addFleetInvInfo(data).subscribe(
      (res) => {
        if (res['status'] == 200) {
          this.utils.toast.success(res['message']);
          this.blAdd = false;
          this.blEdit = false;
          this.btnCancel();
          this.createNotes(
            invNumber,
            '***NEW UNIT ' + invNumber + '***',
            '***NEW UNIT ' + invNumber + '***'
          );
        } else this.utils.toast.error(res['message']);
      },
      (error) => {
        this.onError(error, ErrorMessages.fleet.add_inventory_info);
      }
    );
  }

  generateINVNumber() {
    if (this.lstInvNumber != '' && this.lstInvNumber != null) {
      this.textInvNumber = this.lstInvNumber.substring(
        Number(this.lstInvNumber.length) - 1
      );
      var strWork1 = this.lstInvNumber.substring(
        0,
        this.lstInvNumber.length - 1
      );
      var strWork2 = Number(this.textInvNumber) + 1;
      this.textInvNumber = strWork1 + strWork2;
    } else {
      this.textInvNumber = 1;
    }
  }

  addUnitInfo(data) {
    this.service.addFleetUnitInfo(data).subscribe(
      (res) => {
        if (res.status === 200) {
          this.getUtilityValue(74, 'EmailNewEquipment');
          if (this.strSend != '') {
            this.sendMail(
              this.strSend,
              'New Equipment Added - ' + this.form.value.invNumber,
              'New Equipment Added - ' +
              this.form.value.invNumber +
              ' - ' +
              this.form.value.invType +
              ' - ' +
              this.form.value.serialNumber +
              ' by ' +
              JSON.parse(localStorage.getItem('currentUser')).userName,
              '',
              JSON.parse(localStorage.getItem('currentUser')).email,
              218
            );
          }
          if (this.form.value.majorRepairs) {
            this.createNotes(
              this.form.value.invNumber,
              'Unit rebuilt, no longer Major Repairs',
              'Old Major Repair Reason: ' +
              this.form.value.comments +
              '   ---  Changed by: ' +
              JSON.parse(localStorage.getItem('currentUser')).userName
            );
            this.sendMail(
              this.strSend,
              'Ready to use ' + this.form.value.invNumber,
              'Ready to use ' + this.form.value.invNumber + ' on ' + new Date(),
              'Major Repairs Unchecked by ' +
              JSON.parse(localStorage.getItem('currentUser')).userName,
              JSON.parse(localStorage.getItem('currentUser')).email,
              217
            );
          }
          if (this.form.value.active) {
            this.getComponentCheck(this.form.value.invNumber);
            if (this.componentListData[0].component) {
              var blSold = '';
              if (this.form.value.sold) {
                blSold = 'sell';
              } else {
                blSold = 'inactivate';
              }
              this.strMessage =
                'The unit you are about to ' +
                blSold +
                " has components. Do you want to mark it's components as " +
                blSold +
                '?';
            }
            this.fleetSellInacComp(
              this.form.value.invNumber,
              this.form.value.qbinvoices,
              '',
              this.form.value.salesNumber,
              JSON.parse(localStorage.getItem('currentUser')).userName,
              this.form.value.sold
            );
          }
          if (this.blAdd) {
            this.addInvInfo(
              true,
              new Date(),
              JSON.parse(localStorage.getItem('currentUser')).userName,
              this.InvNumber
            );
          } else {
            this.addInvInfo(
              true,
              new Date(),
              JSON.parse(localStorage.getItem('currentUser')).userName,
              this.InvNumber
            );
          }

          this.blEdit = false;
          this.blAdd = false;
          this.isSavedData = true;
          this.isAddData = true;
          var obj = { "isSavedData": this.isSavedData, "isAddData": this.isAddData };
          this.isDataSaved.emit(obj);
          this.disableForm();
        }
        else {
          this.isSavedData = false;
          this.isAddData = true
          var obj = { "isSavedData": this.isSavedData, "isAddData": this.isAddData };
          this.isDataSaved.emit(obj);
          this.enableForm();
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.fleet.add_unit_info);
        this.enableForm();
      }
    );
    this.visible = false;
  }
  editUnitInfo() {
    this.form.value.Id = this.InvNumber;
    this.form.value.LastModifiedTime = new Date();
    this.form.value.LastModifiedBy = JSON.parse(
      localStorage.getItem('currentUser')
    ).userName;
this.form.value.picturesDate=this.datepipe.transform(
  this.form.value.picturesDate,
  'MM/dd/yyyy'
);
    this.service.editFleetUnitInfo(this.form.value).subscribe(
      (res) => {
        if (res['status'] == 200) {
          this.utils.toast.success(res['message']);
          this.blAdd = false;
          this.blEdit = false;
          this.isSavedData = true;
          this.isAddData = false;
          var obj = { "isSavedData": this.isSavedData, "isAddData": this.isAddData };
          this.isDataSaved.emit(obj)
          this.disableForm();
        } else {
          this.utils.toast.error(res['message']);
          this.isSavedData = false;
          this.isAddData = false;
          var obj = { "isSavedData": this.isSavedData, "isAddData": this.isAddData }
          this.isDataSaved.emit(obj);
          this.enableForm();
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.fleet.edit_unit_info);
        this.enableForm();
      }
    );
    this.visible = false;
  }

  onPageChange(e: PageChangeEvent): void {
    this.skip = e.skip;
    this.pageSize = e.take;
    this.filter.pageNumber = this.skip == 0 ? 0 : this.skip / this.pageSize + 1;
    if (this.filter.pageNumber == 0) {
      this.filter.pageNumber = 1;
    }
    this.filter.pageSize = this.pageSize;
    this.tempPageNo = this.pagerService.start;
    this.pageNumber = this.filter.pageNumber;

    this.getInvType();
  }

  onPageSizechange(pagesize) {
    this.filter.pageSize = pagesize;
    this.skip = 0;
    this.pagerService.start = 1;
    this.filter.pageNumber = 1
    this.getInvType();
  }

  searchInvType() {
    this.filter.pageSize = 100;
    this.filter.pageNumber = 1;
    this.filter.SearchText = this.searchInvText;
    this.getInvType();
  }
  createNotes(invNumber, subject, strNotes) {
    const data = {
      fleetId: invNumber,
      subject: subject,
      notes: strNotes,
      userName: JSON.parse(localStorage.getItem('currentUser')).userName,
    };
    this.serviceNotes.saveNote(data).subscribe(
      (res) => {
        if (res['status'] == 200) {
          console.log('notes', res['status']);
        } else {
          console.log('notes', res['status']);
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.fleet.save_note);
      }
    );
  }
  acceptAssignToFleet() {
    var data = {
      invNumber: this.InvNumber,
      currentINV: this.textInvNumber,
      userName: JSON.parse(localStorage.getItem('currentUser')).userName,
      serverUserName: this.valuesFile.userName,
      serverPassword: this.valuesFile.password,
    };
    this.service.AssignToFleetAccept(data).subscribe(
      (res) => {
        if (res['status'] == 200) {
          if (res['message'] == 'Duplicate Inventory Number.') {
            this.onHandleActivateInventoryDialog('no');
            this.utility.toast.error(res['message']);
          } else {
            this.fleetEvent.emit();
            this.isActivateInventoryDialogVisible =false;
            this.utility.toast.success(res['message']);
          }
        } else {
          console.log('notes', res['status']);
        }
      },
      (error) => {
        this.utility.toast.error('Error connecting to remote share');
        //this.onError(error, ErrorMessages.fleet.ser_accept_fleet);
      }
    );
  }
  prepareForSale() {
    this.service
      .AddPrepareForSale(
        this.InvNumber,
        JSON.parse(localStorage.getItem('currentUser')).userName
      )
      .subscribe(
        (res) => {
          if (res['status'] == 200) {
            this.fleetEvent.emit();
            this.utility.toast.success(res['message']);
          } else {
            console.log('notes', res['status']);
          }
        },
        (error) => {
          this.onError(error, ErrorMessages.fleet.ser_accept_fleet);
        }
      );
  }

  enableForm() {
    this.form.enable();
    if (localStorage.getItem('isAdmin') == 'true') {

    } else {
      const rights = JSON.parse(localStorage.getItem('Rights'));
      var isdis = rights.find(
        (x) => (x.subModuleName == 'Unit Info' && x.tabName.toLowerCase() == ' update sn')
      );

      if (isdis) {
        this.isdisableSN = false
      }
      else {
        this.form.controls['serialNumber'].disable();
        this.isdisableSN = true
      }
    }
  }

  disableForm() {
    this.form.disable();
  }

  resetData() {
    this.form.reset();
    this.customerName = '';
    this.InvType = 'Select Inv. Type';
    this.location = 'YARD';
    this.lblLastInv = 'Last Invoiced: N/A';
    this.lblYTD = 'Invoiced YTD: N/A';
    this.lblCostYTD = 'Service YTD: $0.0';
    this.purchaseDate = 'N/A';
    this.invGridData = [];
    this.componentListData = null;
    this.branchLocation = '';
    this.jobName = '';
    this.InvNumber = '';
  }

  private onError(error: any, customMessage?: string) {
    this.errorHandler.handleError(error, ModuleNames.fleet, customMessage);
  }
}
