import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { orderBy, SortDescriptor } from '@progress/kendo-data-query';
import { ProjectService } from '../../projects/projects.service';
import {
  ProjectInventoryGetRequestModel,
  ProjectInventorySellToJobModel,
  CallOffRequestModel,
  ToggleOffRentRequestModel,
  PickListDeleteRequestModel,
  PickListAddUpdateRequestModel,
  InventoryLoadUnloadRequestModel,
  ProjectInventoryMovementGetRequestModel,
  InventoryTypesViewRequestModel,
} from '../../projects/projects.model';
import { DocumentList } from 'src/data/projectdata';
import { PaginationRequest } from 'src/app/core/models/pagination.model';
import { UtilityService } from '../../../core/services/utility.service';
import { DropdownService } from '../../../core/services/dropdown.service';
import { DatePipe } from '@angular/common';
import * as fileSaver from 'file-saver';
import { MenuService } from 'src/app/core/helper/menu.service';
import { TreeViewService } from 'src/app/shared/service/treeView.service';
import { NetworkDirectoryService } from '../../networkdirectory/networkdirectorypage/networkdirectory.service';
import { saveAs } from 'file-saver';
@Component({
  selector: 'app-projects-inventory',
  templateUrl: './projects-inventory.component.html',
  styleUrls: ['./projects-inventory.component.scss'],
})
export class ProjectsInventoryComponent implements OnInit {
  @Input() detailCustomer: string;
  customerName:string;
  form: FormGroup;
  displayInvCallOff: boolean = false;
  displayInvInventoryMovement: boolean = false;
  displayInvProjectInventory: boolean = false;
  displayLoadPick: boolean = false;
  documentList: any = DocumentList;
  itemList = [];
  screenList = [];
  displayItem: boolean = false;
  displayDocument: boolean = false;
  lbltitle: string = '';
  lblAlert: string = '';
  lbltitle1: string = '';
  lblAlert1: string = '';
  lbltitle2: string = '';
  lblAlert2: string = '';
  opened: boolean = false;
  openedRemove: boolean = false;
  openedAddLine: boolean = false;
  displayInvCallOffCancel: boolean = false;
  isConfirmDialog: boolean = false;
  confirmDialogTitle: string = '';
  confirmDialogMessage: string = '';
  jobNumber: number;
  selectedRow: any;
  selectedGridRow: any;
  selectedUnloadedGridRow: any;
  currentUser: string;
  currentUserEmail: string;
  projectInventoryGetRequestModel: ProjectInventoryGetRequestModel;
  projectInventorySellToJobModel: ProjectInventorySellToJobModel;
  callOffRequestModel: CallOffRequestModel;
  toggleOffRentRequestModel: ToggleOffRentRequestModel;
  pickListDeleteRequestModel: PickListDeleteRequestModel;
  pickListAddUpdateRequestModel: PickListAddUpdateRequestModel;
  inventoryLoadUnloadRequestModel: InventoryLoadUnloadRequestModel;
  projectInventoryMovementGetRequestModel: ProjectInventoryMovementGetRequestModel;
  inventoryTypesViewRequestModel: InventoryTypesViewRequestModel;
  request = new PaginationRequest<any>();
  calloffDate: string = null;
  projectinventoryData: any = [];
  offRentDate: string = '';
  isSaleCancelled: boolean = false;
  visible: boolean;
  projectinventoryData1 = [];
  data: any;
  isDisplayLocation: boolean = false;
  itemCodeNumber: string = '';
  selectedItem: string = '';
  isDateSelected: boolean = false;
  invalidQuantity: boolean = false;
  quantityForSellToJob: boolean = false;
  sellQuantity: number;
  quantityAssignedToJob: number;
  txtQuantity: number;
  returnAll: boolean = false;
  damageDescirption: string = '';
  public startDateValue: Date = new Date(2000, 0, 1);
  public endDateValue: Date = new Date(new Date().getFullYear(), 11, 31);
  public sort: SortDescriptor[] = [
    {
      field: 'invType',
      dir: 'asc',
    },
    {
      field: 'inv',
      dir: 'asc',
    },
    {
      field: 'description',
      dir: 'asc',
    },
    {
      field: 'quantity',
      dir: 'asc',
    },
  ];
  public mySelection: number[] = [0];
  data1: any;
  public sort1: SortDescriptor[] = [
    {
      field: 'invType',
      dir: 'asc',
    },
    {
      field: 'invNumber',
      dir: 'asc',
    },
    {
      field: 'quantity',
      dir: 'asc',
    },
    {
      field: 'available',
      dir: 'asc',
    },
    {
      field: 'toPick',
      dir: 'asc',
    },
  ];
  public mySelection1: number[] = [0];
  data2: any;
  public sort2: SortDescriptor[] = [
    {
      field: 'invType',
      dir: 'asc',
    },
    {
      field: 'inv',
      dir: 'asc',
    },
    {
      field: 'quantity',
      dir: 'asc',
    },
    {
      field: 'retQty',
      dir: 'asc',
    },
  ];
  public mySelection2: number[] = [];
  inventoryType: string = '';
  inventoryNumber: string = '';
  inventoryQuantity: number;
  inventoryQBInvNumber: string = '';
  inventoryInventory_PK: any;
  message: string = '';
  allBranches: any = [];
  selectedBranchCode: string = null;
  itemCode: any = [];
  itemCodeSelection: number[] = [];
  loadedInventorySelection: number[] = [0];
  unLoadedInventorySelection: number[] = [0];
  loadInventoryPK: number;
  selectedDate: string = '';
  selectedPartNumber: number;
  isDisabled: boolean = true;
  iscloseDispatchToJob: boolean = false;
  loadprojectinventoryNewData: any[] = [];
  unloadprojectinventoryNewData: any[] = [];
  loadprojectinventoryData = [];
  searchText: string = '';
  isOffrentDialogVisible: boolean = false;
  offrentDate: string = null;
  isConfirmOffRent: boolean = false;
  startDate: string = null;
  endDate: string = null;
  validateQtyPK: number;
  jobName: string = '';
  returnAllText = 'Return All';
  isSellToJob: boolean = false;
  isEnterQuantityForSellToJob: boolean = false;
  showDescBox: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    public projectService: ProjectService,
    public utilityService: UtilityService,
    public datepipe: DatePipe,
    public dropdownService: DropdownService,
    public menuService: MenuService,
    public treeViewService: TreeViewService,
    private networkService: NetworkDirectoryService
  ) {
    this.menuService.checkUserBySubmoduleRights('Inventory');
    this.isSellToJob = this.menuService.isSellToJob;
    
  }
  ngOnInit() {
    this.initForm();
    //this.customerName = this.detailCustomer;
    var usr = JSON.parse(localStorage.getItem('currentUser'));
    if (usr != null) {
      this.currentUser = usr.userName;
      this.currentUserEmail = usr.email;
    }
    this.getALlBranches();
  }

  initForm(): void {
    this.form = this.formBuilder.group({
      itemCode: [],
      multiplier: [],
      invDate: [],
      invTime: [],
      invStartDate: [],
      invEndDate: [],
      location: [],
      addLine: [],
      invselectedDate: [],
      document: [],
      item: [],
      screen: [],
      checkOffRent: [false],
      checkOffRent1: [false],
      itemType: [],
      quantity1: [],
      description: [],
      txtQuantity: [],
    });
  }
  onCallOff() {
    this.calloffDate = null;
    this.displayInvCallOff = !this.displayInvCallOff;
  }

  onInventoryMovement() {
    this.displayInvInventoryMovement = !this.displayInvInventoryMovement;

    this.startDate = null;
    this.endDate = null;
  }

  onProjectInventory() {
    this.displayInvProjectInventory = !this.displayInvProjectInventory;
    this.loadedInventorySelection = [0];
    this.unLoadedInventorySelection = [0];
    this.displayItem = false;
  }
  public viewColumns = [
    {
      Name: 'invType',
      isCheck: true,
      Text: 'Inventory Type',
      isDisable: false,
      index: 0,
      width: 50,
    },
    {
      Name: 'invNumber',
      isCheck: true,
      Text: 'Inventory Number',
      isDisable: false,
      index: 1,
      width: 50,
    },
    {
      Name: 'quantity',
      isCheck: true,
      Text: 'Qty',
      isDisable: false,
      index: 2,
      width: 100,
    },
    {
      Name: 'available',
      isCheck: true,
      Text: 'Available',
      isDisable: false,
      index: 3,
      width: 100,
    },
    {
      Name: 'toPick',
      isCheck: true,
      Text: 'To Pick',
      isDisable: false,
      index: 4,
      width: 100,
    },
  ];

  onLoadPickList() {
    this.displayLoadPick = !this.displayLoadPick;
  }
  onLoadItem() {
    if (
      this.selectedBranchCode == null ||
      this.selectedBranchCode == undefined ||
      this.selectedBranchCode == ''
    ) {
      this.isDisplayLocation = true;
    } else {
      this.isDisplayLocation = false;
      this.displayItem = !this.displayItem;
      if (this.displayItem) {

        this.getItemCode();
      }
    }
  }
  closeIsDisplayLocation() {
    this.isDisplayLocation = !this.isDisplayLocation;
  }
  onDocument() {
    this.displayDocument = !this.displayDocument;
  }

  AddItem() {
    this.displayItem = !this.displayItem;
  }
  closepopup() {
    this.displayItem = !this.displayItem;
  }
  onFilter(value) { }
  onDispatchJOb() {
    this.lbltitle = 'MDI';
    this.lblAlert = 'Are you sure you want to Dispatch?';
    this.opened = !this.opened;
  }
  public close(value) {
    if (value == 'NO') {
      this.opened == !this.opened;
    } else if (value == 'YES') {
      this.opened = false;
      this.dispatchToJob();
    } else {
      this.opened = !this.opened;
    }
  }
  onRemoveJob() {
    this.lbltitle1 = 'MDI';
    this.lblAlert1 = 'Are you sure you want to Remove?';
    this.openedRemove = !this.openedRemove;
  }
  public closeRemove(value) {
    if (value == 'NO') {
      this.openedRemove = !this.openedRemove;
    } else if (
      value == 'YES' &&
      this.lbltitle1 != 'Please Choose a Branch to Remove Inventory'
    ) {
      this.lbltitle1 = 'Please Choose a Branch to Remove Inventory';
      this.openedRemove = !this.openedRemove;
      this.removeFromJob();
      return;
    } else {
      this.openedRemove = !this.openedRemove;
    }

  }

  onAddLine() {
    if (
      this.itemCodeNumber == '' ||
      this.itemCodeNumber === undefined ||
      this.itemCodeNumber == null
    ) {
      this.lbltitle2 = 'No Item';
      this.lblAlert2 = 'Select an Item to add to the picklist';
      this.openedAddLine = !this.openedAddLine;
    } else if (
      this.form.controls['addLine'].value == '' ||
      this.form.controls['addLine'].value === undefined ||
      this.form.controls['addLine'].value == null
    ) {
      this.lbltitle2 = 'Invalid Quantity';
      this.lblAlert2 = 'You must enter Quantity';
      this.openedAddLine = !this.openedAddLine;
    } else {
      this.createPickListAddUpdateRequestModel();
      this.projectService
        .addLine(this.pickListAddUpdateRequestModel)
        .subscribe((res) => {
          console.log(res);
          if (res['status'] == 200) {
            this.utilityService.toast.success(res.message);
            this.getLoadedInventoryData();
          } else {
            this.utilityService.toast.error(res.message);
          }
        });
      this.form.controls['addLine'].setValue('');
      this.selectedItem = '';
      this.itemCodeNumber = '';
    }
  }

  createPickListAddUpdateRequestModel() {
    this.pickListAddUpdateRequestModel = new PickListAddUpdateRequestModel();
    this.pickListAddUpdateRequestModel.InventoryType = this.itemCodeNumber;
    this.pickListAddUpdateRequestModel.Location_Number = this.jobNumber;
    this.pickListAddUpdateRequestModel.Quantity =
      this.form.get('addLine').value;
  }
  public closeAddLine() {
    this.openedAddLine = !this.openedAddLine;
  }

  onCallOffClose() {
    this.displayInvCallOff = !this.displayInvCallOff;
    this.displayInvCallOffCancel = !this.displayInvCallOffCancel;
  }
  closePAFCancel() {
    this.displayInvCallOffCancel = !this.displayInvCallOffCancel;
  }
  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.data = {
      data: orderBy(this.projectinventoryData, this.sort),
      total: this.projectinventoryData.length,
    };
    this.projectinventoryData = this.data.data;
  }
  public sortChange1(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.data = {
      data: orderBy(this.loadprojectinventoryData, this.sort),
      total: this.loadprojectinventoryData.length,
    };
    this.loadprojectinventoryData = this.data.data;
  }
  public sortChange2(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.data = {
      data: orderBy(this.projectinventoryData1, this.sort),
      total: this.projectinventoryData1.length,
    };
    this.projectinventoryData1 = this.data.data;
  }

  onSellToJob(event) {
    if (this.isSellToJob) {
      this.inventoryType = event.invType;
      this.inventoryNumber = event.inventoryNumber;
      this.sellQuantity = event.quantity;
      if (this.inventoryNumber == '') {
        this.message = this.inventoryType;
      } else {
        this.message = this.inventoryNumber;
      }
      this.confirmDialogTitle = 'MDI 3.0';
      this.confirmDialogMessage =
        'Are you sure you want to sell' +
        ' ' +
        this.message +
        ' ' +
        'to the job?';
      this.isConfirmDialog = true;
    }
    else {
      this.utilityService.toast.error(
        'You do not have permissions to access this part of the system. Please contact your supervisor so they can request them from IT.'
      );
    }
  }

  onCloseConfirmDialog() {
    this.isConfirmDialog = false;
  }

  //#region Bind Main Grid List
  getList(detailJobNumber, jobName, currentBranch) {
    this.projectinventoryData = [];
    this.loadprojectinventoryData = [];
    this.projectinventoryData1 = [];
    this.jobNumber = detailJobNumber;
    this.jobName = jobName;
    this.createProjectInventoryGetRequestModel();
    this.form.controls['location'].setValue(currentBranch); this.selectedBranchCode = currentBranch;
    this.projectService.getInventory(this.request).subscribe((res) => {
      if (res.data !== null) {
        if (res.data.length > 0) {
          this.mySelection = [0];
          this.projectinventoryData = res.data;
          this.selectedRow = this.projectinventoryData[0];
          this.inventoryNumber = this.selectedRow.inventoryNumber;
          this.inventoryType = this.selectedRow.invType;
          this.inventoryInventory_PK = this.selectedRow.inventory_PK;
          this.inventoryQuantity = this.selectedRow.quantity;


          this.onBranchValueChange(this.form.value.location);
        }
      }
    });
    // this.getLoadedInventoryData();
    // this.getUnloadedInventory();
  }
  createProjectInventoryGetRequestModel() {
    this.projectInventoryGetRequestModel =
      new ProjectInventoryGetRequestModel();
    this.projectInventoryGetRequestModel.JobNumber = this.jobNumber;
    this.request.request = this.projectInventoryGetRequestModel;
  }
  //#endregion

  //#region Inventory Grid Selection
  inventoryGridSelection(event) {
    this.inventoryNumber = '';
    this.inventoryType = '';
    this.selectedRow = event;
    this.inventoryNumber = this.selectedRow.inventoryNumber;
    this.inventoryType = this.selectedRow.invType;
    this.inventoryInventory_PK = this.selectedRow.inventory_PK;
    this.inventoryQuantity = this.selectedRow.quantity;
  }

  //#endregion

  //#region sell To Job Yes Click
  onSellToJobYesClick() {
    this.onEnterQuantityForSellToJob();
  }
  onSellToJobNoClick() {
    this.isConfirmDialog = false;
    this.isSaleCancelled = true;
  }
  onCloseIsSaleCancelled() {
    this.isSaleCancelled = false;
  }
  createProjectInventorySellToJobModel() {
    this.projectInventorySellToJobModel = new ProjectInventorySellToJobModel();
    this.projectInventorySellToJobModel.Inventory_PK =
      this.inventoryInventory_PK;
    this.projectInventorySellToJobModel.Quantity = this.quantityAssignedToJob;
    this.projectInventorySellToJobModel.JobNumber = this.jobNumber;
    this.projectInventorySellToJobModel.UserName = this.currentUser;
  }
  onCloseQuantityCancelled() {
    if (
      this.form.controls['txtQuantity'].value == null ||
      this.form.controls['txtQuantity'].value === undefined ||
      this.form.controls['txtQuantity'].value == ''
    ) {
      this.lblAlert2 = 'Please enter a quantity';
    } else {
      this.lblAlert2 = 'Cannot Sell more than is on the job.';
    }
    this.quantityForSellToJob = !this.quantityForSellToJob;
    this.isEnterQuantityForSellToJob = false;
    this.isConfirmDialog = false;
  }
  onEnterQuantityForSellToJob() {
    this.isEnterQuantityForSellToJob = !this.isEnterQuantityForSellToJob;
    this.isConfirmDialog = false;
  }
  onOKEnterQuantityForSellToJob() {
    let txtQuantity = this.form.get('txtQuantity').value;
    if (this.sellQuantity < txtQuantity) {
      this.onCloseQuantityCancelled();
    } else {
      if (
        txtQuantity == null ||
        txtQuantity === undefined ||
        txtQuantity == ''
      ) {
        this.onCloseQuantityCancelled();
      } else {
        this.visible = false;
        this.visible = true;
        this.quantityAssignedToJob = txtQuantity;
        this.createProjectInventorySellToJobModel();

        this.projectService
          .inventorySellToJob(this.projectInventorySellToJobModel)
          .subscribe((res) => {
            if (res['status'] == 200) {
              this.utilityService.toast.success(res.message);
              this.projectinventoryData = res.result.data;
              this.selectedRow = this.projectinventoryData[0];
              this.inventoryNumber = this.selectedRow.inventoryNumber;
              this.inventoryType = this.selectedRow.invType;
              this.inventoryInventory_PK = this.selectedRow.inventory_PK;
              this.inventoryQuantity = this.selectedRow.quantity;
              this.visible = true;
              this.visible = false;

            } else {
              this.visible = true;
              this.visible = false;
            }
          });
      }
    }
    this.form.controls['txtQuantity'].setValue(null);
    this.isEnterQuantityForSellToJob = !this.isEnterQuantityForSellToJob;
    this.isConfirmDialog = false;
  }
  onCancelEnterQuantityForSellToJob() {
    this.isEnterQuantityForSellToJob = !this.isEnterQuantityForSellToJob;
  }
  //#endregion

  //#region Toggle
  toggle(event) {
    this.visible = false;
    this.visible = true;
    this.offRentDate = this.datepipe.transform(event, 'MM/dd/yyyy');
    this.createToggleOffRentRequestModel();
    if (
      this.offRentDate != null ||
      this.offRentDate !== undefined ||
      this.offRentDate !== ''
    ) {
      this.projectService
        .inventoryOffRentToggle(this.toggleOffRentRequestModel)
        .subscribe((res) => {
          console.log(res);
          if (res.data.length > 0) {
            this.projectinventoryData = res.data;
            this.visible = true;
            this.visible = false;
          } else {
            this.visible = true;
            this.visible = false;
          }
        });
    }
  }
  createToggleOffRentRequestModel() {
    this.toggleOffRentRequestModel = new ToggleOffRentRequestModel();
    this.toggleOffRentRequestModel.Inventory_PK = this.inventoryInventory_PK;
    this.toggleOffRentRequestModel.ToggleDate = this.offRentDate;
    this.toggleOffRentRequestModel.UserName = this.currentUser;
    this.toggleOffRentRequestModel.JobNumber = this.jobNumber;
  }
  //#endregion

  //#region
  onCallOffSubmit() {
    this.displayInvCallOff = !this.displayInvCallOff;
    if (
      this.calloffDate !== null &&
      this.calloffDate !== undefined &&
      this.calloffDate !== ''
    ) {
      this.createCallOffRequestModel();
      this.visible = false;
      this.visible = true;
      this.projectService
        .inventoryCallOff(this.callOffRequestModel)
        .subscribe((res) => {
          console.log(res);
          if (res.data.length > 0) {
            this.projectinventoryData = res.data;
            this.visible = true;
            this.visible = false;
          } else {
            this.visible = true;
            this.visible = false;
          }
        });
    } else {
      this.utilityService.toast.error(
        'Please Select the date to submit call off'
      );
    }
  }
  createCallOffRequestModel() {
    this.callOffRequestModel = new CallOffRequestModel();
    this.callOffRequestModel.JobNumber = this.jobNumber;
    this.callOffRequestModel.UserName = this.currentUser;
    this.callOffRequestModel.CallOffDate = this.datepipe.transform(
      this.calloffDate,
      'MM/dd/yyyy'
    );
  }
  //#endregion

  //#region Project Inventory

  //#region Bind Branches
  getALlBranches() {
    this.dropdownService.GetBranchList().subscribe((res) => {
      this.allBranches = res;
    });
  }

  onBranchValueChange(event) {
    if (event !== undefined || this.form.value.location) {
      this.selectedBranchCode = event.code ?? this.form.value.location;
    } else {
      this.selectedBranchCode = '';
    }
    this.getLoadedInventoryData();
    this.getUnloadedInventory();
  }
  //#endregion

  //#region Bind Item Code
  getItemCode() {
    if (
      this.selectedBranchCode == null ||
      this.selectedBranchCode == undefined ||
      this.selectedBranchCode == ''
    ) {
      this.utilityService.toast.error('Please select a Location');
    } else {
      this.createInventoryTypesViewRequestModel(); this.visible = false; this.visible = true;
      this.projectService
        .getItemCode(this.inventoryTypesViewRequestModel)
        .subscribe((res) => {
          this.visible = true; this.visible = false;
          console.log(res);
          this.itemCode = res;
        });
    }
  }
  itemCodeClick(event) {
    this.displayItem = false;
    this.itemCodeNumber = event.invType;
    this.selectedItem = event.description;
  }
  onSearchClick() {
    this.searchText = this.form.get('description').value;
    this.getItemCode();
  }

  createInventoryTypesViewRequestModel() {
    this.inventoryTypesViewRequestModel = new InventoryTypesViewRequestModel();
    this.inventoryTypesViewRequestModel.SearchText = this.searchText;
    this.inventoryTypesViewRequestModel.BranchCode = this.selectedBranchCode;
  }

  //#endregion

  //#region Bind Loaded Inventory

  //#endregion

  //#region Bind Unloaded Inventory

  //#endregion

  //#region grid Selection
  loadedInventoryGridSelection(event) {
    console.log(event);
    this.loadInventoryPK = event.pk;
    this.selectedGridRow = event;
  }
  unloadedInventoryGridSelection(event) {
    this.selectedUnloadedGridRow = event;

  }
  //#endregion

  //#region Delete
  onDelete(event) {
    var pk = event.pk;
    this.createPickListDeleteRequestModel(pk);
    this.projectService
      .deleteLoadInventory(this.pickListDeleteRequestModel)
      .subscribe((res) => {
        if (res['status'] == 200) {
          this.utilityService.toast.success(res.message);
          this.getLoadedInventoryData();
          this.getUnloadedInventory();
        } else {
          this.utilityService.toast.error(res.message);
        }
      });
  }
  createPickListDeleteRequestModel(pk) {
    this.pickListDeleteRequestModel = new PickListDeleteRequestModel();
    this.pickListDeleteRequestModel.Id = pk;
    this.pickListDeleteRequestModel.DeleteAll = false;
    this.pickListDeleteRequestModel.Location_Number = this.jobNumber;
  }
  //#endregion

  //#region Dispatch To Job


  onDateChange(event) {
    this.selectedDate = this.datepipe.transform(event, 'MM/dd/yyyy');
    this.isDisabled = false;
  }
  closeDispatchToJob() {
    this.iscloseDispatchToJob = !this.iscloseDispatchToJob;
  }

  //#endregion

  //#region Add Line

  onToggleOffRent(data) { 
    if (data === undefined) {
      // var indx = this.projectinventoryData.findIndex(c=> c.pk = this.inventoryInventory_PK);
      // this.projectinventoryData[indx].offRent = false;
      this.isOffrentDialogVisible = !this.isOffrentDialogVisible;
      this.getList(this.jobNumber,this.jobName,this.selectedBranchCode);
    } else {
      this.inventoryInventory_PK = data.pk;
      // console.log(this.isOffrentDialogVisible);
      if (this.isOffrentDialogVisible) {
        this.isConfirmOffRent = true;
        // this.confirmDialogTitle = 'Exit?';
        // this.confirmDialogMessage = 'No Date will be Selected';
        // this.isConfirmDialog = true;
      } else {
        this.isOffrentDialogVisible = !this.isOffrentDialogVisible;
      }
    }
  }

  onSelectOffRentDate(event) {
    this.offrentDate = event;
    this.isOffrentDialogVisible = false;
    this.offRentToggle();
  }

  onToggleOffrentConfirmDialog() {
    this.isConfirmOffRent = !this.isConfirmOffRent;
  }

  onConfirmOffRent() {
    this.isConfirmOffRent = false;
    this.isOffrentDialogVisible = false;
  }
  offRentToggle() {
    this.visible = false;
    this.visible = true;
    this.offRentDate = this.datepipe.transform(this.offrentDate, 'MM/dd/yyyy');
    this.createToggleOffRentRequestModel();
    if (
      this.offRentDate != null ||
      this.offRentDate !== undefined ||
      this.offRentDate !== ''
    ) {
      this.projectService
        .inventoryOffRentToggle(this.toggleOffRentRequestModel)
        .subscribe((res) => {
          console.log(res);
          if (res.data.length > 0) {
            this.projectinventoryData = res.data;
            this.visible = true;
            this.visible = false;
          } else {
            this.visible = true;
            this.visible = false;
          }
        });
    }
  }
  //#endregion

  //#endregion

  //#region Excel Print
  onPrint() {
    this.createProjectInventoryGetRequestModel();
    this.projectService
      .exportToExcelInventory(this.projectInventoryGetRequestModel)
      .subscribe((res) => {
        let data = new Blob([res], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;',
        });
        fileSaver.saveAs(
          data,
          'ProjectInventoryList_' +
          new Date().toLocaleDateString('en-US') +
          '.xlsx'
        );
      });
  }

  exportInventoryMovement() {
    if (this.projectinventoryData.length == 0) {
      this.utilityService.toast.error('No Data found.');
      return false;
    }
    if (
      this.startDateValue === null ||
      this.startDateValue === undefined ||
      this.startDateValue === null
    ) {
      this.lblAlert2 = 'Please select a start date';
      this.isDateSelected = true;
    } else if (
      this.endDateValue === null ||
      this.endDateValue === undefined ||
      this.endDateValue === null
    ) {
      this.lblAlert2 = 'Please select a end date';
      this.isDateSelected = true;
    } else {
      var getCustomfromDate = new Date(this.startDateValue);
      var getCustomtoDate = new Date(this.endDateValue);
      if (getCustomfromDate.getTime() > getCustomtoDate.getTime()) {
        this.lblAlert2 = 'Start date should be greater than End date .';
        this.isDateSelected = true;
      } else {
        this.visible = false;
        this.visible = true;
        this.createProjectInventoryMovementGetRequestModel();
        this.projectService
          .exportToInventoryMovement(
            this.projectInventoryMovementGetRequestModel
          )
          .subscribe((res) => {
            //this.customerName='';
            if (res.size > 0) {
              let data = new Blob([res], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;',
              });
              fileSaver.saveAs(
                data,
                'ProjectInventoryMovementList_' +
                new Date().toLocaleDateString('en-US') +
                '.xlsx'
              );
              this.visible = true;
              this.visible = false;
            }
            else {
              this.visible = true;
              this.visible = false;
            }
          }, (error) => { this.visible = false; }
          );
        this.displayInvInventoryMovement = !this.displayInvInventoryMovement;
      }
    }
  }

  createProjectInventoryMovementGetRequestModel() {
    this.projectInventoryMovementGetRequestModel =
      new ProjectInventoryMovementGetRequestModel();
    this.projectInventoryMovementGetRequestModel.JobNumber = this.jobNumber;
    this.projectInventoryMovementGetRequestModel.customerName = this.customerName;
    this.projectInventoryMovementGetRequestModel.From = this.datepipe.transform(
      this.startDateValue,
      'MM/dd/yyyy'
    );
    this.projectInventoryMovementGetRequestModel.To = this.datepipe.transform(
      this.endDateValue,
      'MM/dd/yyyy'
    );
  }
  closeIsDateSelected() {
    this.isDateSelected = !this.isDateSelected;
  }
  //#endregion

  //#region




  onHandleErrorDialog() {
    if (this.invalidQuantity) {
      this.form.controls[this.validateQtyPK].setValue(null);
      this.invalidQuantity = !this.invalidQuantity;
    }
  }
  //#endregion


  //#region Return ALL
  offloadInventory() {
    // this.UnloadRequestModel();
    // this.projectService
    //   .offLoadInventory(this.inventoryLoadUnloadRequestModel)
    //   .subscribe((res) => {
    //     console.log(res);
    //   });
  }

  onReturnAll() {
    var lstUnload = [];
    if (this.returnAllText == 'Return All') {
      this.returnAllText = 'Return None';
      this.returnAll = true;
    } else if (this.returnAllText == 'Return None') {
      this.returnAllText = 'Return All';
      this.returnAll = false;
    }
    if (
      this.selectedBranchCode == null ||
      this.selectedBranchCode == undefined ||
      this.selectedBranchCode == ''
    ) {
      this.isDisplayLocation = true;
    }
    else if (this.returnAll == true) {
      //this.offLoadRequestModel();
      // this.createUnloadedInventoryLoadUnloadRequestModel();

      for (var i = 0; i < this.projectinventoryData1.length; i++) {
        //this.loadItems.push(this.unloadItems[i]);
        var objdata = {
          picklistId: this.projectinventoryData1[i].pk,
          inventoryType: this.projectinventoryData1[i].invType,
          inventoryNumber: this.projectinventoryData1[i].invNumber,
          availableQty: this.projectinventoryData1[i].quantity,
          quantity: this.projectinventoryData1[i].quantity,
          serialized: this.projectinventoryData1[i].serialized,
        };
        lstUnload.push(objdata);
      }
      var obj = {
        id: 0,
        userName: JSON.parse(localStorage.getItem('currentUser')).userName,
        locationNumber: this.jobNumber,
        selectedDate: this.selectedDate,
        branchCode: this.selectedBranchCode,
        inventorytypes: lstUnload,
      };

      this.projectService.offLoadInventory(obj).subscribe(
        (res) => {
          if (res['status'] == 200) {
            this.utilityService.toast.success(res.message);
          }
          else {
            this.utilityService.toast.error(res.message);
          }
        }
      )
    }
  }
  offLoadRequestModel() {
    this.offLoadGridJson();
    this.inventoryLoadUnloadRequestModel =
      new InventoryLoadUnloadRequestModel();
    this.inventoryLoadUnloadRequestModel.LocationNumber = this.jobNumber;
    this.inventoryLoadUnloadRequestModel.SelectedDate = this.selectedDate;
    this.inventoryLoadUnloadRequestModel.BranchCode = this.selectedBranchCode;
    this.inventoryLoadUnloadRequestModel.Inventorytypes =
      this.unloadprojectinventoryNewData;
  }

  offLoadGridJson() {
    this.unloadprojectinventoryNewData = [];
    var data = this.projectinventoryData1;
    this.projectinventoryData1.forEach(element => {
      var objdata = {
        PicklistId: element.pk,
        InventoryType: element.invType,
        InventoryNumber: element.invNumber,
        Quantity: element.quantity,
      };
      this.unloadprojectinventoryNewData.push(objdata);
    });

  }
  //#endregion

  //#region  Unload Invetory


  getUnloadedInventory() {
    this.projectinventoryData1 = [];
    var obj = { "InvTransferNumber": this.jobNumber, "BranchName": this.selectedBranchCode }
    this.projectService//getInventoryLoadedPicklist(this.jobNumber)
      .getUnLoadedInventoryData(obj)
      .subscribe((res) => {
        if (res.length > 0) {
          this.projectinventoryData1 = res;
          this.selectedUnloadedGridRow = this.projectinventoryData1[0];
          this.unLoadedInventorySelection = [0];
          this.projectinventoryData1.forEach((element) => {
            let exist = this.form.contains(element.pk);
            if (exist) {
              this.form.removeControl(element.pk);
            }
            this.form.addControl(element.pk, new FormControl(''));
          });
        }
      });
  }

  listunloaded: any = [];
  removeFromJob() {
    this.listunloaded = [];
    if (!this.selectedDate) {
      this.utilityService.toast.error('Please select date.');
      return false;
    }

    const currentFuture = new Date();
    const currentPast = new Date();
    // currentFuture.setDate(currentFuture.getDate() + 1)
    if (new Date(this.selectedDate) > currentFuture) {
      this.utilityService.toast.error('Date too far in future.');
      return false;
    }
    currentPast.setDate(currentPast.getDate() - 30);
    if (new Date(this.selectedDate) < currentPast) {
      this.utilityService.toast.error('Date too far in future.');
      return false;
    }
    this.projectinventoryData1.forEach((element) => {
      var objunload = {
        picklistId: element.pk,
        inventoryType: element.invType,
        inventoryNumber: element.invNumber,
        availableQty: element.quantity,
        quantity: element.returnQty,
        serialized: element.serialized ?? false,
        isDamaged: element.damange,
        damageDescription: element.damageDescription ?? ''
      };
      if (element.returnQty > 0) {
        this.listunloaded.push(objunload);
      }
    });
    if (this.listunloaded.length <= 0) {
      this.utilityService.toast.error('Please add return Qty.');
      return false;
    }
    var obj = {
      id: 0,
      userName: JSON.parse(localStorage.getItem('currentUser')).userName,
      // inventoryType: itm.inventoryType,
      // inventoryNumber: itm.inventoryNumber,
      // quantity: itm.returnQty,
      locationNumber: this.jobNumber,
      selectedDate: this.selectedDate,
      branchCode: this.selectedBranchCode,
      inventorytypes: this.listunloaded,
    };

    //this.UnloadRequestModel();
    this.projectService
      .unLoadInventory(obj)
      .subscribe((res) => {
        if (res['status'] == 200) {
          this.utilityService.toast.success(res.message);
          this.getUnloadedInventory();
          this.getLoadedInventoryData();
        }
        else {
          this.utilityService.toast.error(res.message);
        }
      });


  }

  UnloadRequestModel() {
    this.UnLoadedGridJson();
    this.inventoryLoadUnloadRequestModel =
      new InventoryLoadUnloadRequestModel();
    this.inventoryLoadUnloadRequestModel.LocationNumber = this.jobNumber;
    this.inventoryLoadUnloadRequestModel.SelectedDate = this.selectedDate;
    this.inventoryLoadUnloadRequestModel.BranchCode = this.selectedBranchCode;
    this.inventoryLoadUnloadRequestModel.Inventorytypes =
      this.unloadprojectinventoryNewData;
  }

  UnLoadedGridJson() {
    this.unloadprojectinventoryNewData = [];
    var data = this.selectedUnloadedGridRow;
    var objdata = {
      PicklistId: data.pk,
      InventoryType: data.invType,
      InventoryNumber: data.invNumber,
      AvailableQty: data.available == null ? 0 : data.available,
      Quantity: this.txtQuantity == null ? data.quantity : this.txtQuantity == 0 ? data.quantity : this.txtQuantity,
    };
    this.unloadprojectinventoryNewData.push(objdata);

  }

  onReceiveValueChangeForUnload(data, event, id) {
    if (event !== null) {
      this.validateQtyPK = id;
      if (data.quantity < event) {
        this.invalidQuantity = true;
        this.lblAlert2 = "   Cannot receive more than ordered";
      }
      else if (data.quantity == null && event == 0) {
        this.invalidQuantity = true;
        this.lblAlert2 = "Cannot receive zero quantity ordered";
      }
      else if (data.quantity == null) {
        this.invalidQuantity = true;
        this.lblAlert2 = "   Cannot receive more than ordered";
      }
      else if (event == 0) {
        this.invalidQuantity = true;
        this.lblAlert2 = "Cannot receive zero quantity ordered";
      }
      else {
        data.returnQty = event;
      }
    }
  }
  //#endregion

  //#region  Load Inventory
  getLoadedInventoryData() {
    this.visible = true;
    this.loadprojectinventoryData = [];
    // var obj ={
    //   "jobNumber": this.jobNumber,
    //   "branch": this.selectedBranchCode,
    //   "jobLocation": "",
    //   "documentType": ""
    // }
    this.projectService
      .getLoadedInventoryData(this.jobNumber, this.selectedBranchCode)
      .subscribe((res) => {
        this.visible = false;
        if (res.length > 0) {
          this.loadprojectinventoryData = res;
          this.selectedGridRow = this.loadprojectinventoryData[0];
          this.loadprojectinventoryData.forEach((element) => {
            let exist = this.form.contains(element.pk);
            if (exist) {
              this.form.removeControl(element.pk);
            }
            this.form.addControl(element.pk, new FormControl(''));
          });
        }
      });
  }
  listSelected: any = [];
  dispatchToJob() {
    this.listSelected = [];
    // this.createInventoryLoadUnloadRequestModel();
    this.loadprojectinventoryData.forEach((element) => {
      var objItem = {
        picklistId: element.pk,
        inventoryType: element.invType,
        inventoryNumber: element.invNumber,
        availableQty: element.available,
        quantity: element.toPick,
        serialized: element.serialized,
        enteredQuantity:element.quantity
      };

      if (element.toPick > 0) {
        this.listSelected.push(objItem);
      }
    });

    var obj = {
      id: 0,
      userName: JSON.parse(localStorage.getItem('currentUser')).userName,
      // inventoryType: itm.inventoryType,
      // inventoryNumber: itm.inventoryNumber,
      // quantity: itm.quantity,
      locationNumber: this.jobNumber,
      selectedDate: this.selectedDate,
      branchCode: this.selectedBranchCode,
      inventorytypes: this.listSelected,
    };
    if (this.listSelected.length > 0) {
      this.projectService
        .loadInventory(obj)
        .subscribe((res) => {
          console.log(res);
          if (res['status'] == 200) {
            this.utilityService.toast.success(res.message); this.getLoadedInventoryData();
            this.getUnloadedInventory();
          } else {
            this.utilityService.toast.error(res.message);
          }
        });
    }
    else {
      this.closeDispatchToJob();
    }
  }
  onDocumentValueChange(event) {
    var pickupList = [];
    var dispatchList = [];
    if (event != undefined) {
      if (event.value == "Terms") {
        if (this.selectedBranchCode != undefined && this.selectedBranchCode != null && this.selectedBranchCode != "") {
          var branch
          if (this.selectedBranchCode == '%') {
            branch = 'MI'
          }
          else {
            branch = this.selectedBranchCode;
          }
        }
        let utilityValue = "TAC-" + branch;
        this.projectService.getTACPath(61, utilityValue).subscribe(
          (res) => {
            if (res['status'] == 200) {
              let path = res.result.utilityPath.toString().toLowerCase()
                .replace('\\reagan', '\\192.168.0.2');
              this.networkService.DownloadFile(encodeURI(path)).subscribe(
                (res) => {
                  var extension = path.slice(path.lastIndexOf('.') + 1).toLowerCase();
                  if (extension == "pdf") {
                    let file = new Blob([res], { type: 'application/pdf' });
                    //"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,"      
                    var fileURL = URL.createObjectURL(file);
                    window.open(fileURL);
                  }
                  else {
                    saveAs(res, 'TAC.pdf');
                  }
                }
              )
            }
            else {
              this.utilityService.toast.error("No Terms and Conditions on file");
            }
          }
        )
      }
      else {
        if (event.value == "Pickup") {
          // this.projectinventoryData1.forEach(element => {
          pickupList = this.projectinventoryData1;
          // });
        }
        else if (event.value == "Dispatch") {
          dispatchList = this.loadprojectinventoryData;
        }
        var obj = {
          "jobNumber": this.jobNumber,
          "branch": this.selectedBranchCode,
          "jobLocation": "",
          "documentType": event.value,
          "pickupList": pickupList,
          "dispatchList": dispatchList
        }
        this.projectService
          .downloadDocumnet(obj)
          .subscribe((res) => {
            if (res && res.size > 0) {
              let data = new Blob([res], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;',
              });
              fileSaver.saveAs(
                data,
                'ProjectInventoryDocumnet_' +
                new Date().toLocaleDateString('en-US') +
                '.xlsx'
              );

            }
          });
      }

    }

  }


  LoadedGridJson() {
    this.loadprojectinventoryNewData = [];
    var data = this.selectedGridRow;
    var objdata = {
      PicklistId: data.pk,
      InventoryType: data.invType,
      InventoryNumber: data.invNumber,
      AvailableQty: data.available == null ? 0 : data.available,
      Quantity: data.quantity,
    };
    this.loadprojectinventoryNewData.push(objdata);
  }


  onReceiveValueChange(data, event, id) {
    if (event !== null) {
      console.log(data);
      console.log(event);
      console.log(id);
      this.validateQtyPK = id;
      if (data.available < event) {
        this.invalidQuantity = true;
        this.lblAlert2 = "   Cannot receive more than ordered";
      }
      else if (data.available == null && event == 0) {
        this.invalidQuantity = true;
        this.lblAlert2 = "Cannot receive zero quantity ordered";
      }
      else if (data.available == null) {
        this.invalidQuantity = true;
        this.lblAlert2 = "   Cannot receive more than ordered";
      }
      else if (event == 0) {
        this.invalidQuantity = true;
        this.lblAlert2 = "Cannot receive zero quantity ordered";
      } else {
        data.toPick = event;
        // var loadQty = {
        //   id: data.pk,
        //   invNumber: data.invNumber,
        //   loadQty: event,
        // };
        // this.projectService.LoadQuantity(loadQty).subscribe(
        //   (res) => {
        //     if (res) {
        //       this.getLoadedInventoryData();
        //     }
        //   },
        //   (error) => {
        //     //this.onError(error, ErrorMessages.vehicle.load_quantity);
        //   }
        // );
      }
    }
  }
  public changeInvNumber(dataItem, invNumber) {
    dataItem.invNumber = invNumber;
  }
  setDamageData: any;
  openDescriptionBox(data, value) {
    this.setDamageData = data;
    data.damange = value;
    if (value)
      this.showDescBox = true;
  }
  damagedEquipmentDialog(status) {
    if (status == 'Ok') {
      this.setDamageData.damageDescription = this.damageDescirption;
      this.damageDescirption = '';
    }
    this.showDescBox = false;
  }
  resetData() {
    this.projectinventoryData = [];
    this.loadprojectinventoryData = [];
    this.projectinventoryData1 = [];
  }
  //#endregion

}


