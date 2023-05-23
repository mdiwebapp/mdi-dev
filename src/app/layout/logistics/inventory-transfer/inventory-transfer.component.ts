import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import {
  ViewData,
  ViewColumns,
  ViewData1,
  ViewColumns1,
} from './../../../../data/inventory-transfer-data';
import { CellClickEvent, GridComponent } from '@progress/kendo-angular-grid';
import { Subscription } from 'rxjs';
import {
  orderBy,
  process,
  SortDescriptor,
  State,
} from '@progress/kendo-data-query';
import { InventoryTransferService } from './inventory-transfer.service';
import { ErrorHandlerService, PagerService } from 'src/app/core/services';
import { UtilityService } from 'src/app/core/services/utility.service';
import { ErrorMessages, ModuleNames } from 'src/app/core/constant';
import { PaginationRequest } from 'src/app/core/models/pagination.model';
import { PageChangeEvent } from '@progress/kendo-angular-pager';
import { MenuService } from 'src/app/core/helper/menu.service';
import { InvTransferExcelRequestModel } from './inventory-transfer.model';
import * as fileSaver from 'file-saver';
import { NetworkDirectoryComponent } from 'src/app/layout/networkdirectory/networkdirectorypage/networkdirectory.component';
import { Router } from '@angular/router';
const createFormGroup = (dataItem) =>
  new FormGroup({
    searchText: new FormControl(''),
    invTransferNumber: new FormControl(''),
    status: new FormControl('NEW'),
    ProductName: new FormControl(dataItem.ProductName),
    fromBranch: new FormControl(dataItem.fromBranch),
    toBranch: new FormControl(dataItem.toBranch),
  });
@Component({
  selector: 'app-inventory-transfer',
  templateUrl: './inventory-transfer.component.html',
  styleUrls: ['./inventory-transfer.component.scss'],
})
export class InventoryTransferComponent implements OnInit {
  @ViewChild(NetworkDirectoryComponent)
  networkDirectory: NetworkDirectoryComponent;
  form: FormGroup;
  message: any;
  invTransferData: any;
  viewColumns: any;
  invTransferData1: any;
  viewColumns1: any;
  invList: any = [];
  isAdd: boolean = true;
  diplayitemDrp: boolean = false;
  opened: boolean = false;
  openedAddLineInvalid: boolean = false;
  displayAddNote: boolean = false;
  displayReceive: boolean = false;
  displayTransferConfirm: boolean = false;
  displayTransferConfirmSent: boolean = false;
  displayTransferPicture: boolean = false;
  disabledSend: boolean = true;
  disabledRowAdd: boolean = false;
  disabledOverride: boolean = true;
  disabledReceive: boolean = true;
  selectedRow: any;
  public pageSize = 100;
  show: boolean;
  showFolder: boolean;
  toggleText: string;
  available: any = '';
  recQty: any = '';
  status: boolean = true;
  statusList: any = [];
  data: any;
  data1: any;
  displaySendRecQty: boolean = false;
  @ViewChild(GridComponent)
  private grid: GridComponent;
  public view: unknown[];
  public formGroup: FormGroup;
  private editedRowIndex: number;
  fromBranchList: any = [];
  toBranchList: any = [];
  invTransferExcelRequestModel: InvTransferExcelRequestModel;
  public sortInv: SortDescriptor[] = [
    {
      field: 'invType',
      dir: 'asc',
    },
  ];
  public mySelection: number[] = [];
  public mySelectionItem: number[] = [];
  public mySelection1: number[] = [];
  private docClickSubscription: Subscription = new Subscription();
  private isNew: boolean;
  gridView: any;
  filterCollection: any = {
    status: 'NEW',
    branchName: 'All',
    searchText: '',
    pageNumber: 0,
    pageSize: 0,
    sortColumn: '',
    sortDesc: true,
  };
  totalData: any;
  headerTotalData: any;
  searchText: string = '';
  searchInvText: string = '';
  clickEventsubscription: Subscription;
  isAvailable: boolean = false;
  constructor(private formBuilder: FormBuilder, public service: InventoryTransferService,
    public errorHandler: ErrorHandlerService, public pagerService: PagerService,
    public menuService: MenuService,public router: Router,
    private utility: UtilityService,) {
    if (localStorage.getItem('isAdmin') == 'true') {

    } else {
      let acc = this.menuService.checkUserViewRights('Inventory Transfer');
      if (acc) {
        //this.utils.toast.error("User does not have rights to access " + name + " module.");Z
      } else {
        this.utility.toast.error(
          'You do not have permissions to access this part of the system. Please contact your supervisor so they can request them from IT.'
        );
        setTimeout(() => {
          var url = '/dashboard';
          location.href = url;
        }, 1000);
      }
      this.menuService.checkUserBySubmoduleRights('Inventory Transfer');
    }
  }

  ngOnInit() {
    this.clickEventsubscription = this.utility.getClickEvent().subscribe((a) => {
      this.message = a;
      this.callBack(this.message);
    });

    //this.invTransferData = ViewData;
    this.viewColumns = ViewColumns;
    //this.invTransferData1 = ViewData1;
    this.viewColumns1 = ViewColumns1;
    this.pagerService.start = 1;
    this.initForm(); this.InventoryTransHeader(); this.GetInventoryTransferSelectItem();
    this.GetBranch();
  }
  GetBranch() {
    var branches = this.utility.storage.CurrentUser.userBranch;
    var index = branches.findIndex((c) => c.value == 'SSG');
    branches.splice(index, 1);
    this.fromBranchList = branches;
    this.toBranchList = branches;
  }
  public sort: SortDescriptor[] = [
    {
      field: 'invTransferNumber',
      dir: 'asc',
    },
    {
      field: 'status',
      dir: 'asc',
    },
    {
      field: 'fromBranch',
      dir: 'asc',
    },
    {
      field: 'toBranch',
      dir: 'asc',
    },
  ];
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
      field: 'description',
      dir: 'asc',
    },
    {
      field: 'qty',
      dir: 'asc',
    },
    {
      field: 'recQty',
      dir: 'asc',
    },
  ];
  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    //this.InventoryTransHeader();
    this.data = {
      data: orderBy(this.invTransferData, this.sort),
      total: this.invTransferData.length,
    };
    this.invTransferData = this.data.data;
  }
  public sortChange1(sort: SortDescriptor[]): void {
    this.sort1 = sort;
    this.data = {
      data: orderBy(this.invTransferData1, this.sort1),
      total: this.invTransferData1.length,
    };
    this.invTransferData1 = this.data.data;

  }
  public invSortChange(sort: SortDescriptor[]): void {
    this.sortInv = sort;
    this.GetInventoryTransferSelectItem();
    // this.data = {
    //   data: orderBy(this.gridView, this.sort),
    //   total: this.gridView.length,
    // };
    // this.gridView = this.data.data;
  }
  initForm(): void {
    this.form = this.formBuilder.group({
      invStatus: ['OPEN'],
      branchStatus: ['All'],
      receiveQty: [false],
      invNumber: [],
      addLineText: [],
      quantity: [1],
      NotesText: [],
      toBranch: [],
      fromBranch: [],
      status: [''],
      invTransferNumber: [],
    });
  }
  onFilter() {
    //this.searchText = event;
    this.InventoryTransHeader();
  }

  onFilter1(value) { }
  onItem() {
    this.diplayitemDrp = !this.diplayitemDrp;
  }
  AddItem() {
    var sel = this.gridView[this.mySelectionItem[0]];
    // this.invTransferData1.push({
    //   "invTransferNumber": this.selectedRow.invTransferNumber,
    //   "invType": sel.invType,
    //   "invNumber": sel.invType,
    //   "description": sel.description,
    //   "quantity": this.form.value.quantity,
    //   "recQty": 0,
    //   "pk": 0,
    //   "available": 0
    // });  
    if (sel.available < this.form.value.quantity) {
      this.isAvailable = true;
      //this.utility.toast.error('There is not enough inventory.');
      return false;
    }
    this.isAvailable = false;
    var obj = {
      "type": sel.invType,
      "number": sel.invType,
      "quantity": this.form.value.quantity,
      "transfer": this.selectedRow.invTransferNumber
    }
    this.service.AddLine(obj).subscribe(
      (res) => {
        if (res.status == 200) {
          this.form.controls['quantity'].setValue(1);
          this.searchInvText = '';
          this.utility.toast.success(res.message);
          this.mySelectionItem = [];
          this.GetInvTransferDetails(this.selectedRow); this.GetInventoryTransferSelectItem();
        }
      },
      (error) => this.onError(error, 'Error in  Get Inventory Trans. Header')
    );

    this.diplayitemDrp = !this.diplayitemDrp;
  }
  closePopup() {
    this.searchInvText = '';
    this.GetInventoryTransferSelectItem();
    this.diplayitemDrp = !this.diplayitemDrp;
  }
  addLine() {
    if (
      this.form.value.addLineText == '' ||
      this.form.value.addLineText == null
    ) {
      this.opened = !this.opened;
    } else {
      this.openedAddLineInvalid = !this.openedAddLineInvalid;
    }
  }
  public close(status) {
    if (status == 'Ok') {
      this.opened = !this.opened;
    } else if (status == 'Cancel') {
      this.opened = !this.opened;
    } else {
      this.opened = !this.opened;
    }
  }
  public closeAddLineInvalid(status) {
    if (status == 'Ok') {
      this.openedAddLineInvalid = !this.openedAddLineInvalid;
    } else if (status == 'Cancel') {
      this.openedAddLineInvalid = !this.openedAddLineInvalid;
    } else {
      this.openedAddLineInvalid = !this.openedAddLineInvalid;
    }
  }
  openAddNote() {
    this.displayAddNote = !this.displayAddNote;
  }
  public closeAddNote(status) {
    if (status == 'Ok') {
      this.displayAddNote = !this.displayAddNote;
    } else if (status == 'Cancel') {
      this.displayAddNote = !this.displayAddNote;
    } else {
      this.displayAddNote = !this.displayAddNote;
    }
  }
  openReceive() {
    let data = this.invTransferData1.filter((c) => c.recQty > 0);
    if (data.length <= 0) {
      this.displayReceive = true;
      return false;
    }
    var recData = [];
    data.forEach(element => {
      var obj = {
        "primaryKey": this.selectedRow.ipk,
        "invTransferNumber": this.selectedRow.invTransferNumber,
        "status": this.selectedRow.status,
        "from": this.selectedRow.fromBranch,
        "to": this.selectedRow.toBranch,
        "inventoryType": element.invType,
        "inventoryNumber": element.invNumber,
        "quantity": element.quantity,
        "recQty": parseInt(element.recQty),
        "lineNumber": "",
        "description": element.description,
        "available": element.available,
        "userName": JSON.parse(localStorage.getItem('currentUser')).userName,
        "invTranDate": new Date() //this.selectedRow.receivedDate
      }
      recData.push(obj);
    });
    this.InvTranDetailsReceive(recData);
  }
  closeReceive(status) {
    if (status == 'Ok') {
      this.displayReceive = !this.displayReceive;
    } else if (status == 'Cancel') {
      this.displayReceive = !this.displayReceive;
    } else {
      this.displayReceive = !this.displayReceive;
    }
  }
  openTransferConfirmation() {
    if (this.invTransferData1.length == 0) {
      this.utility.toast.error('Please add inventory item.');
      return false;
    }
    this.displaySendRecQty = !this.displaySendRecQty;
    if (this.selectedRow == undefined) {
      this.displayTransferConfirm = !this.displayTransferConfirm;
    } else {
      this.displayTransferPicture = !this.displayTransferPicture;
    }
  }
  closeTransferConfirmation(status) {
    if (status == 'Ok') {
      this.displayTransferConfirm = !this.displayTransferConfirm;
      this.displayTransferConfirmSent = !this.displayTransferConfirmSent;
    } else if (status == 'Cancel') {
      this.displayTransferConfirm = !this.displayTransferConfirm;
    } else {
      this.displayTransferConfirm = !this.displayTransferConfirm;
    }
  }
  closeTransferConfirmationSent(status) {
    if (status == 'Ok') {
      this.displayTransferConfirmSent = !this.displayTransferConfirmSent;
    } else {
      this.displayTransferConfirmSent = !this.displayTransferConfirmSent;
    }
  }
  closeTransferPicture(status) {
    if (status == 'Ok') {
      this.displayTransferPicture = !this.displayTransferPicture;
      this.InvTranDetailsSend();
    } else {
      this.displayTransferPicture = !this.displayTransferPicture;
    }
  }
  onGridSelection($event) {
    this.selectedRow = $event.selectedRows[0].dataItem;


    this.GetInvTransferDetails(this.selectedRow);
  }
  onRightRowSelection($event) {
    this.mySelection1 = $event.selectedRows[0].dataItem;
  }
  public onToggle(): void {
    this.show = !this.show;
    this.toggleText = this.show ? 'Hidе' : 'Show';
  }
  closePopup1() {
    this.show = !this.show;
  }
  resetPopup1() { }
  columnApply() { }
  public addHandler(): void {

    //if (this.form.controls['invStatus'].value=='All') {
    //} else {
    if (!this.disabledRowAdd) {
      //if (!this.disabledOverride && !this.disabledReceive && !this.disabledSend) {
      this.closeEditor();
      this.isNew = true;
      this.disabledOverride = true;
      this.disabledReceive = true;
      this.disabledSend = true;
      this.getNextNumber();
      this.disabledRowAdd = true;
      this.invTransferData1 = [];
      this.selectedRow = {};
      // this.grid.addRow(this.formGroup);

    } else {
      // this.closeEditor();
      this.invTransferData.splice(0, 1);
      this.disabledOverride = false;
      this.disabledReceive = false;
      this.disabledSend = false;
      this.form.reset();
      this.form.controls['invStatus'].setValue('OPEN');
      this.disabledRowAdd = false; this.mySelection = [0];
      this.selectedRow = this.invTransferData[0]; this.GetInvTransferDetails(this.selectedRow);
    }
    //}
  }
  getNextNumber() {
    this.service.GetNextInvNumber().subscribe(
      (res) => {
        if (res.status == 200) {
          this.invTransferData.unshift({
            invTransferNumber: res.message,
            status: 'NEW',
            ProductName: '',
            fromBranch: '',
            toBranch: '',
          });
        }
      },
      (error) => this.onError(error, 'Error in  Get Inventory Trans. Header')
    );
  }
  addTransfer() {
    if (!this.form.value.fromBranch || !this.form.value.toBranch) {
      this.utility.toast.error('Please select From branch and To branch.');
      return false;
    }
    if (this.form.value.fromBranch == this.form.value.toBranch) {
      this.utility.toast.error('From branch and To branch should not be same.');
      return false;
    }
    var obj = {
      "userName": JSON.parse(localStorage.getItem('currentUser')).userName,
      "fromBranch": this.form.value.fromBranch,
      "toBranch": this.form.value.toBranch,
      "invTranNumber": this.invTransferData[0].invTransferNumber,
      "status": "NEW"
    }
    this.service.AddInventoryTransfer(obj).subscribe(
      (res) => {
        if (res.status == 200)
          this.disabledRowAdd = false;this.searchText='';
        this.utility.toast.success(res.message);
        this.InventoryTransHeader();
        //this.isNew = true;
        //this.form.reset();
        this.form.controls['fromBranch'].setValue('');
        this.form.controls['toBranch'].setValue('');
        this.form.controls['invTransferNumber'].setValue('');
        // this.form.controls['invStatus'].setValue('OPEN');
        // this.form.controls['branchStatus'].setValue('All');
        this.disabledOverride = false;
        this.disabledReceive = false;
        this.disabledSend = false;

      },
      (error) => this.onError(error, 'Error in  Get Inventory Trans. Header')
    );
  }
  private closeEditor(): void {
    this.grid.closeRow(this.editedRowIndex);

    this.isNew = false;
    this.editedRowIndex = undefined;
    this.formGroup = undefined;
  }
  addSwap() {
    let data = this.invTransferData.find(
      (x, index) => x.invTransferNumber == this.selectedRow.invTransferNumber
    );
    let index = data.id - 1;
    this.invTransferData.splice(index, 1);
    this.invTransferData.push(data);
  }

  InventoryTransHeader() {
    this.invTransferData = []; this.mySelection = []; this.headerTotalData = 0;
    this.filterCollection.pageNumber = this.pagerService.start;
    this.filterCollection.pageSize = this.pageSize;
    this.filterCollection.status = this.form.value.invStatus;
    this.filterCollection.branchName = this.form.value.branchStatus ?? 'All';
    this.filterCollection.searchText = this.searchText;
    this.filterCollection.sortColumn = this.sort[0].field;
    this.filterCollection.sortDesc = this.sort[0].dir == "asc" ? false : true;

    this.service.GetInventoryTransHeader(this.filterCollection).subscribe(
      (res) => {
        if (res && res.length > 0) {
          this.invTransferData = res;
          this.headerTotalData = res[0].totalRecords;
          this.mySelection = [0];
          this.selectedRow = this.invTransferData[0];
          this.GetInvTransferDetails(this.selectedRow);
        }
      },
      (error) => this.onError(error, 'Error in  Get Inventory Trans. Header')
    );
  }

  GetInventoryTransferSelectItem() {
    if (this.searchInvText) {
      this.pagerService.start = 1;
    }
    var obj = {
      "pageNumber": this.pagerService.start,
      "pageSize": this.pageSize,
      "sortColumn": this.sortInv[0].field,
      "sortDesc": this.sortInv[0].dir == 'asc' ? false : true,
      "request": {
        "searchText": this.searchInvText
      }
    }
    this.service.GetInventoryTransferSelectItem(obj).subscribe(
      (res) => {
        if (res) {
          this.gridView = res;
          this.totalData = res.length > 0 ? res[0].totalRecords : 0;
        }
      },
      (error) => this.onError(error, 'Error in  Get Inventory Trans. Header')
    );
  }

  public skip = 0;
  public onPageChange(e: PageChangeEvent): void {
    this.skip = e.skip;
    this.pageSize = e.take;
    this.pagerService.start =
      (this.skip == 0 ? 1 : ((this.skip + this.pageSize) / this.pageSize));
    this.filterCollection.pageSize = this.pageSize;
    //this.tempPageNo = this.pagerService.start;    
    this.GetInventoryTransferSelectItem();
  }
  public onHeaderPageChange(e: PageChangeEvent): void {
    if (!this.disabledRowAdd) {
      this.skip = e.skip;
      this.pageSize = e.take;
      this.pagerService.start =
        (this.skip == 0 ? 1 : ((this.skip + this.pageSize) / this.pageSize));
      this.filterCollection.pageSize = this.pageSize;
      //this.tempPageNo = this.pagerService.start;    
      this.InventoryTransHeader();
    }

  }
  GetInvTransferDetails(item) {
    if (this.selectedRow.status == 'NEW') {
      this.disabledSend = false;
      this.disabledOverride = false;
      this.disabledReceive = true;
      this.form.controls['receiveQty'].disable();
    }
    if (this.selectedRow.status == 'RECEIVED' || this.selectedRow.status == 'VOID') {
      this.disabledSend = true;
      this.disabledOverride = true;
      this.disabledReceive = true;
      this.form.controls['receiveQty'].disable();
    }
    if (this.selectedRow.status == 'SENT') {
      this.disabledSend = true;
      this.disabledOverride = true;
      this.disabledReceive = false;
      this.form.controls['receiveQty'].enable();
    }
    this.invTransferData1 = [];
    var data = {
      InvTransferNumber: item.invTransferNumber,
      BranchName: item.fromBranch
    }
    this.service.GetInvTransferDetails(data).subscribe(
      (res) => {
        if (res) {
          this.invTransferData1 = res;
          this.invTransferData1.forEach(x => x.recQty != null ? x.recQty : null);
        }
      },
      (error) => this.onError(error, 'Error in  Get Inventory Trans. Header')
    );
  }
  setReceiveQty(value) {
    if (value == false) {
      this.invTransferData1.forEach(x => x.recQty = null);
    } else {
      this.invTransferData1.forEach(x => x.recQty = x.quantity);
    }
  }
  SetInvTransferService() {
    if (this.invTransferData1.length == 0) {
      this.utility.toast.error('Please add inventory item.');
      return false;
    }
    var invNyumber = this.selectedRow.invTransferNumber;
    this.service.SetInvTransferService(invNyumber).subscribe(
      (res) => {
        if (res) {
          this.utility.toast.success(res.message);
          //this.gridView = res; 
        }
      },
      (error) => this.onError(error, 'Error in  Get Inventory Trans. Header')
    );
  }

  InvTranDetailsReceive(data) {
    this.service.InvTranDetailsReceive(data).subscribe(
      (res) => {
        if (res) {
          this.GetInvTransferDetails(this.selectedRow);
          this.utility.toast.success(res.message);
          //this.gridView = res; 
          this.InventoryTransHeader();
          this.service.SendMailAfterRecQty(data).subscribe(
            (resv) => {
              if (resv) {
              }
            },
            (error) => this.onError(error, 'Error in  Get Inventory Trans. Header')
          );
        }
      },
      (error) => this.onError(error, 'Error in  Get Inventory Trans. Header')
    );
  }

  SendMailAfterRecQty() {
    var invNyumber = '0';
    this.service.SendMailAfterRecQty(invNyumber).subscribe(
      (res) => {
        if (res) {
          if (res.status == 200)
            this.utility.toast.success(res.message);
          //this.gridView = res; 
        }
      },
      (error) => this.onError(error, 'Error in  Get Inventory Trans. Header')
    );
  }

  InvTranDetailsSend() {
    let dataItem = this.invTransferData1;//.filter((c) => c.recQty > 0);
    // if (dataItem.length <= 0) {
    //   this.displayReceive = true;
    //   return false;
    // }
    // debugger
    var listItem = [];
    dataItem.forEach(element => {
      if (!element.invNumber) {
        this.utility.toast.error('Please select Inventory Number.');
        return false;
      }
      var data = {
        "inventoryNumber": element.invNumber,
        "inventoryType": element.invType,
        "qty": parseInt(element.quantity ?? 0),
        "detailInvCount": 0,
        "invTransferNumber": this.selectedRow.invTransferNumber,
        "userName": JSON.parse(localStorage.getItem('currentUser')).userName,
        "pk": element.pk
      }
      listItem.push(data);
    });

    this.service.GetInventoryTransCheckTrnDetails(listItem).subscribe(
      (res) => {
        if (res) {
          this.InventoryTransHeader();
          this.utility.toast.success(res.message);
          //this.gridView = res; 
          var listData = [];
          dataItem.forEach(element => {
            var obj = {
              "primaryKey": this.selectedRow.ipk,
              "invTransferNumber": this.selectedRow.invTransferNumber,
              "status": this.selectedRow.status,
              "from": this.selectedRow.fromBranch,
              "to": this.selectedRow.toBranch,
              "inventoryType": element.inventoryType,
              "inventoryNumber": element.inventoryNumber,
              "quantity": element.quantity,
              "recQty": parseInt(element.recQty ?? 0),
              "lineNumber": "",
              "description": element.description,
              "available": element.available,
              "userName": JSON.parse(localStorage.getItem('currentUser')).userName,
              "invTranDate": new Date() //this.selectedRow.receivedDate
            }
            listData.push(obj);
          })

          this.service.SendMailAfterSend(listData).subscribe(
            (resv) => {
              if (resv) {
              }
            },
            (error) => this.onError(error, 'Error in  Get Inventory Trans. Header')
          );
        }
      },
      (error) => this.onError(error, 'Error in  Get Inventory Trans. Header')
    );
  }
  callBack(value) {
    var valueId = '';
    var valueName = [];
    value.forEach((element) => {
      valueId = (element.code);
      valueName.push(element.value);
    });
    this.invTransferData1 = [];
    this.selectedRow = {};
    this.form.controls['branchStatus'].setValue(valueName.toString());
    this.InventoryTransHeader();

  }
  filterStatus(value) {
    if (value == false) {
      //this.isAdd=false;
      this.form.controls['invStatus'].setValue('All');
    } else {//this.isAdd=true;
      this.form.controls['invStatus'].setValue('OPEN');////this.form.value.invStatus = 'OPEN';
    } this.InventoryTransHeader();
  }
  checkBranch(value) {
    if (this.form.value.fromBranch == this.form.value.toBranch) {
      this.utility.toast.error('From branch and To branch should not be same.');
      this.form.controls['toBranch'].setValue('');
    }
  }
  public cellClickHandler({
    sender,
    rowIndex,
    columnIndex,
    dataItem,
    isEdited,
  }) {
    if (!isEdited && this.selectedRow.status != 'NEW') {
      sender.editCell(rowIndex, columnIndex, this.createFormGroup(dataItem));
    } else {
      // dataItem.loadQty = 1;
    }
  }
  public cellCloseHandler(args: any) {
    const { formGroup, dataItem } = args;

    if (!formGroup.valid) {
      this.utility.toast.error(
        'Received value not accepted. Please use a positive whole number.'
      );
      // prevent closing the edited cell if there are invalid values.
      formGroup.value.recQty.setValue(0);
      args.preventDefault();
    } else if (formGroup.dirty) {
      if (dataItem.serialized == true && formGroup.value.recQty > 1) {
        this.utility.toast.error(
          'Rec. Qty. should not be greater than 1 for serialized item.'
        );
        formGroup.value.recQty = 1;
      }
      // if (formGroup.value.recQty <= dataItem.available) {
      dataItem.recQty = formGroup.value.recQty;
      // } else {
      //   this.utility.toast.error(
      //     'Rec. Qty. should not be greater than the Available Qty.'
      //   );
      // }
    }
  }
  public createFormGroup(dataItem: any): FormGroup {
    if (this.selectedRow.status == 'SENT' || this.selectedRow.status == 'NEW') {
      return this.formBuilder.group({
        recQty: [
          dataItem.recQty,
          Validators.compose([Validators.pattern('^[0-9]{1,7}')]),
        ],
      });
    }
  }
  private onError(error: any, customMessage?: string) {
    this.errorHandler.handleError(
      error,
      ModuleNames.components_notes,
      customMessage
    );
  }
  removeItem(data: any) {
    this.service.deleteInventory(data.pk).subscribe(
      (res) => {
        this.utility.toast.success(res.message);
        this.GetInvTransferDetails(this.selectedRow);
      });
  }
  public changeInvNumber(dataItem, invNumber) {
    var itm = this.invTransferData1;
    var isExist = itm.find(c => c.invNumber == invNumber);
    if (!isExist) {
      dataItem.invNumber = invNumber;
    } else {
      dataItem.invNumber = '';
      this.utility.toast.error('Already selected.');
    }
  }
  exportToExcel() {
    if (this.invTransferData1.length > 0) {
      this.createInvTransferExcelRequestModel();
      this.service.exportToExcel(this.invTransferExcelRequestModel).subscribe(
        (res) => {

          if (res.size > 0) {
            let data = new Blob([res], {
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;',
            });
            fileSaver.saveAs(
              data,
              this.selectedRow.invTransferNumber + new Date().toLocaleDateString('en-US') + '.xlsx'
            );
          }
          else {
            this.utility.toast.error(res);
            console.log("No Records fro this inv number");
          }
        }
      )
    }
    else {
      this.utility.toast.error('No records for current inventory transfer number.');
    }
  }

  createInvTransferExcelRequestModel() {
    this.invTransferExcelRequestModel = new InvTransferExcelRequestModel();
    this.invTransferExcelRequestModel.InvTransferNumber = this.selectedRow.invTransferNumber;
    this.invTransferExcelRequestModel.FromBranchName = this.selectedRow.fromBranch;
    this.invTransferExcelRequestModel.ToBranchName = this.selectedRow.toBranch;
  }
  selectionchange() {
    this.isAvailable = false;
  }
  public onFolderToggle(): void {
    this.showFolder = !this.showFolder;
    this.toggleText = this.showFolder ? 'Hidе' : 'Show';
    setTimeout(() => {
      this.networkDirectory.loadFolderByInventoryTransfer(this.selectedRow.invTransferNumber);
    }, 200);
  }
}
