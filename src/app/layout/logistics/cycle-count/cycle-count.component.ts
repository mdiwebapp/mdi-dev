import { Component, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {
  DataBindingDirective,
  GridComponent,
} from '@progress/kendo-angular-grid';
import { ErrorMessages, ModuleNames } from 'src/app/core/constant';
import { ErrorHandlerService } from 'src/app/core/services';
import { UtilityService } from 'src/app/core/services/utility.service';
import { SortDescriptor, process, orderBy } from '@progress/kendo-data-query';
import {
  ViewData,
  ViewColumns,
  ItemData,
  ViewColumnsItems,
} from '../../../../data/cycle-count-data';
import { CycleCountModel } from './cycle-count.model';
import { CycleCountService } from './cycle-count.service';
import * as fileSaver from 'file-saver';
import { Subscription } from 'rxjs';
import { MenuService } from 'src/app/core/helper/menu.service';

@Component({
  selector: 'app-cycle-count',
  templateUrl: './cycle-count.component.html',
  styleUrls: ['./cycle-count.component.scss'],
})
export class CycleCountComponent implements OnInit {
  @ViewChild(GridComponent) private grid: GridComponent;
  @ViewChild(DataBindingDirective) dataBinding: DataBindingDirective;
  form: FormGroup;
  public viewColumns: any;
  public cycleCountData: any;
  public tempcycleCountData: any;
  public itemData: any;
  public viewColumnsItems: any;
  opened: boolean = false;
  openedConfirmed: boolean = false;
  openedDone: boolean = false;
  openInventoryType: boolean = false;
  disabledAddCount: boolean = true;
  openedNoDialog: boolean = false;
  openedTextDialog: boolean = false;
  openedExcelDialog: boolean = false;
  branchList: any;
  gridView: any[];
  tempList: any[];
  tempInvList: any[];
  branchCode: string = '';
  errorMsg: string = '';
  branchAll = [
    {
      id: 0,
      value: 'All',
      code: 'All',
    },
  ];
  branch: any[] = [];
  mySelectionitem: any[];
  branchData: any;
  clickEventsubscription: Subscription;
  message: any;
  showSubmitCount: boolean = true;
  data: any;
  visible: boolean;
  public sort: SortDescriptor[] = [
    {
      field: 'inventoryType',
      dir: 'asc',
    },
    {
      field: 'inventoryNumber',
      dir: 'asc',
    },
    {
      field: 'description',
      dir: 'asc',
    },
    {
      field: 'onHandQty',
      dir: 'asc',
    },
    {
      field: 'countedQty',
      dir: 'asc',
    },
  ];
  public mySelection: number[] = [0];
  public mainSelection: number[] = [0];
  isLoading: boolean = false;
  multiple: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    public service: CycleCountService,
    public errorHandler: ErrorHandlerService,
    private utility: UtilityService,
    public menuService: MenuService
  ) {
    if (localStorage.getItem('isAdmin') == 'true') {
      this.showSubmitCount = true;
    } else {
      let acc = this.menuService.checkUserViewRights('cycle counts');
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
        //this.router.navigate(['/dashboard']);
        // this.utility.toast.error(
        //   'You do not have permissions to access this part of the system. Please contact your supervisor so they can request them from IT.'
        // );
      }
      const rights = JSON.parse(localStorage.getItem('Rights'));
      if (rights) {
        this.showSubmitCount = rights.some(
          (c) =>
            c.subModuleName == 'Maintain Cycle Counts' &&
            c.moduleName == 'Cycle Counts' &&
            c.tabName == 'Submit'
        );
        console.log(this.showSubmitCount);
      }
    }
  }

  ngOnInit(): void {
    this.clickEventsubscription = this.utility
      .getClickEvent()
      .subscribe((a) => {
        this.message = a;
        this.callBack(this.message);
      });
    this.viewColumns = ViewColumns;
    this.cycleCountData = []; // ViewData;
    this.itemData = ItemData;
    this.viewColumnsItems = ViewColumnsItems;
    this.branch = JSON.parse(this.utility.storage.getItem('selectedBranch'));
    if (this.branch[0].id == 0) {
      this.GetBranch();
    }
    //this.branchCode = 'All';
    //this.GetBranch();
    this.loadInventory();
    this.initForm();
  }
  callBack(value) {
    var valueId = [];
    var valueId1 = [];
    this.branchData = value;
    this.branch = value;
    this.branchCode = '';
    if (value.length > 0) {
      let ssg = value.findIndex((c) => c.value == 'SSG');
      if (value[0].id == 0 || ssg > 0) {
        this.GetBranch();
      }
    }
    this.cycleCountData = [];
    this.tempList = [];
    // value.forEach((element) => {
    //   valueId.push(element.id);
    //   valueId1.push(element.userId);
    // });
    // if (value.length > 0) { this.branchCode = value[value.length - 1].code; }
    // this.loadCyclecount(this.branchCode);
  }
  initForm(): void {
    this.form = this.formBuilder.group({
      addCountItem: [false],
      partSearchTxt: [],
      countedText: [],
      branch: [],
    });
  }
  onInventoryType() {
    this.gridView = this.tempInvList;
    this.mySelection = [];
    if (this.branchCode && this.branchCode != 'All')
      this.openInventoryType = !this.openInventoryType;
    else this.utility.toast.error('Please select branch.');
  }
  GetBranch() {
    this.branch = this.utility.storage.CurrentUser.userBranch; //this.branchAll.concat(
    //);
    var index = this.branch.findIndex((c) => c.value == 'SSG');
    this.branch.splice(index, 1);
    //this.branch.unshift({ "code": "All", "id": 0, "value": "All" });
    this.branchData = this.branch;
  }
  loadCyclecount(bcode) {
    this.cycleCountData = [];
    this.tempList = [];
    // if (!this.branchCode) {
    //   this.branchCode = 'All';
    // }
    // if (this.branchCode == '%') {
    //   bcode = 'SSG';
    // }

    this.visible = true;
    this.service.GetCyclecount(bcode).subscribe(
      (res) => {
        this.visible = false;
        if (res) {
          this.cycleCountData = res;
          this.tempList = res;
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.drop_down.get_vendor_list);
        this.visible = false;
      }
    );
  }
  loadInventory() {
    this.service.GetInventoryTypes().subscribe(
      (res) => {
        if (res) {
          this.gridView = res;
          this.tempInvList = res;
        }
      },
      (error) => this.onError(error, ErrorMessages.drop_down.get_vendor_list)
    );
  }
  selectionChange() {
    this.errorMsg = '';
  }
  addInventoryItem() {
    var inv = this.gridView[this.mySelection[0]];
    if (!inv) {
      return false;
    }
    var isExist = this.cycleCountData.find(
      (c) => c.inventoryType == inv.invType
    );
    if (isExist) {
      this.errorMsg = inv.invType + ' already added.';
      //
      //this.utility.toast.error(inv.invType + ' already added.');
      return false;
    }
    this.service.GetInventoryDetail(this.branchCode, inv.invType).subscribe(
      (res) => {
        if (res) {
          if (res.length > 0) {
            this.cycleCountData.unshift({
              inventoryType: inv.invType,
              inventoryNumber: res[0].invNumber,
              description: inv.description,
              onHandQty: res[0].quantity,
              countedQty: 0,
              cycleCountClass: '',
              pk: 0,
              serialized: inv.serialized,
              lastCounted: new Date(),
            });
          } else {
            this.cycleCountData.unshift({
              inventoryType: inv.invType,
              inventoryNumber: inv.invType,
              description: inv.description,
              onHandQty: 0,
              countedQty: 0,
              cycleCountClass: '',
              pk: 0,
              serialized: inv.serialized,
              lastCounted: new Date(),
            });
          }
          this.mySelection = [];
          this.openInventoryType = false;
        }
      },
      (error) => this.onError(error, ErrorMessages.drop_down.get_vendor_list)
    );
  }
  public close(status) {
    if (status == 'cancel') {
      this.openInventoryType = !this.openInventoryType;
    } else {
      this.openInventoryType = !this.openInventoryType;
    }
  }
  onSubmit() {
    if (!this.branchCode || this.branchCode == 'All') {
      this.utility.toast.error('Please select branch.');
      return false;
    }
    this.tempcycleCountData = this.cycleCountData;
    let data = this.tempcycleCountData.filter((c) => c.countedQty > 0);
    let nullData = this.tempcycleCountData.find(
      (c) => c.countedQty == '' || c.countedQty == null || c.countedQty < 0
    );
    if (nullData) {
      this.utility.toast.error('Please enter all counted qty.');
      return false;
    }
    if (data.length <= 0) {
      this.utility.toast.error(
        'There is no data to process. Please enter counted qty.'
      );
      return false;
    }
    this.opened = !this.opened;
  }
  public closeSubmit(status) {
    if (status == 'Yes') {
      this.opened = !this.opened;

      this.closeConfirmed('Ok');
      //this.openedConfirmed = !this.openedConfirmed;
    } else {
      this.closeConfirmed('');
      this.opened = !this.opened;
    }
  }
  closeConfirmed(status) {
    if (status == 'Ok') {
      //this.openedConfirmed = !this.openedConfirmed;
      //this.openedDone = !this.openedDone;
      this.tempcycleCountData = this.cycleCountData;

      let data = this.tempcycleCountData; //this.tempcycleCountData.filter((c) => c.countedQty > 0);
      if (data.length > 0) {
        this.isLoading = true;
        const cycle_data = new CycleCountModel();
        cycle_data.branch = this.branchCode;
        cycle_data.userName = JSON.parse(
          localStorage.getItem('currentUser')
        ).userName;
        cycle_data.selectedInventories = data;
        this.service.SubmitCyclecount(cycle_data).subscribe(
          (res) => {
            if (res['status'] == 200) {
              this.utility.toast.success(res['message']);
              this.loadCyclecount(this.branchCode);
              this.openedDone = !this.openedDone;
              this.isLoading = false;
            } else this.utility.toast.error(res['message']);
            this.isLoading = false;
          },
          (error) => {
            this.onError(error, ErrorMessages.drop_down.get_vendor_list);
            this.isLoading = false;
          }
        );
      }
    } else {
      this.openedDone = !this.openedDone;
    }
  }
  closeDone(status) {
    if (status == 'Ok') {
      this.openedDone = !this.openedDone;
    } else {
      this.openedDone = !this.openedDone;
    }
  }
  onAddCount() {
    this.disabledAddCount = !this.disabledAddCount;
  }

  onKeyDown(ev) {
    if (ev.keyCode == 48 && ev.keyCode == 49) {
    } else if (ev.keyCode < 67 && ev.keyCode > 122) {
      this.openedNoDialog = !this.openedNoDialog;
    } else if (ev.keyCode > 50 && ev.keyCode < 57) {
      this.openedTextDialog = !this.openedTextDialog;
    } else {
      this.openedNoDialog = !this.openedNoDialog;
    }
  }
  closeNoDialog() {
    this.openedNoDialog = !this.openedNoDialog;
  }
  closeTextDialog() {
    this.openedTextDialog = !this.openedTextDialog;
  }
  openExcel() {
    if (!this.branchCode || this.branchCode == 'All') {
      this.utility.toast.error('Please select branch.');
      return false;
    }
    this.openedExcelDialog = !this.openedExcelDialog;
  }
  ExportCyclesheetData() {
    var data = [];
    if (!this.branchCode || this.branchCode == 'All') {
      this.utility.toast.error('Please select branch.');
      return false;
    }
    this.cycleCountData.forEach((element) => {
      data.push({
        inventoryType: element.inventoryType,
        inventoryNumber: element.inventoryNumber,
        description: element.description,
        onHandQty: element.onHandQty,
        countedQty: element.countedQty == '' ? 0 : element.countedQty,
        serialized: element.serialized,
      });
    });
    this.service.ExportCyclecount(data, this.branchCode).subscribe(
      (res) => {
        let data = new Blob([res], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;',
        });
        fileSaver.saveAs(
          data,
          this.branchCode +
            '-CycleCount-' +
            new Date().toLocaleDateString('en-US') +
            '.xlsx'
        );
        this.openedExcelDialog = false;
      },
      (error) => this.onError(error, ErrorMessages.drop_down.get_vendor_list)
    );
  }
  ExportPumpsData() {
    if (!this.branchCode || this.branchCode == 'All') {
      this.utility.toast.error('Please select branch.');
      return false;
    }
    this.isLoading = true;
    this.service.ExportPumpsAndGens(this.branchCode).subscribe(
      (res) => {
        let data = new Blob([res], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;',
        });
        fileSaver.saveAs(
          data,
          this.branchCode +
            '-Pumps_and_Gens-' +
            new Date().toLocaleDateString('en-US') +
            '.xlsx'
        );
        this.openedExcelDialog = false;
        this.isLoading = false;
      },
      (error) => this.onError(error, ErrorMessages.drop_down.get_vendor_list)
    );
    this.isLoading = false;
  }
  ExportTrailersData() {
    if (!this.branchCode || this.branchCode == 'All') {
      this.utility.toast.error('Please select branch.');
      return false;
    }
    this.isLoading = true;
    this.service.ExportTrailers(this.branchCode).subscribe(
      (res) => {
        let data = new Blob([res], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;',
        });
        fileSaver.saveAs(
          data,
          this.branchCode +
            '-Trailers-' +
            new Date().toLocaleDateString('en-US') +
            '.xlsx'
        );
        this.openedExcelDialog = false;
        this.isLoading = false;
      },
      (error) => this.onError(error, ErrorMessages.drop_down.get_vendor_list)
    );
    this.isLoading = false;
  }
  ExportSubmersiblesData() {
    if (!this.branchCode || this.branchCode == 'All') {
      this.utility.toast.error('Please select branch.');
      return false;
    }
    this.isLoading = true;
    this.service.ExportSubsAndCords(this.branchCode).subscribe(
      (res) => {
        let data = new Blob([res], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;',
        });
        fileSaver.saveAs(
          data,
          this.branchCode +
            'Sub_and_Cords' +
            new Date().toLocaleDateString('en-US') +
            '.xlsx'
        );
        this.openedExcelDialog = false;
        this.isLoading = false;
      },
      (error) => this.onError(error, ErrorMessages.drop_down.get_vendor_list)
    );
    this.isLoading = false;
  }
  public cellClickHandler({
    sender,
    rowIndex,
    columnIndex,
    dataItem,
    isEdited,
  }) {
    if (!isEdited) {
      sender.editCell(rowIndex, columnIndex, this.createFormGroup(dataItem));
    } else {
      // dataItem.loadQty = 1;
    }
  }
  public cellCloseHandler(args: any) {
    const { formGroup, dataItem } = args;

    if (!formGroup.valid) {
      this.utility.toast.error(
        'Counted value not accepted. Please use a positive whole number.'
      );
      // prevent closing the edited cell if there are invalid values.
      formGroup.value.countedQty.setValue(0);
      args.preventDefault();
    } else if (formGroup.dirty) {
      if (dataItem.serialized == true && formGroup.value.countedQty > 1) {
        this.utility.toast.error(
          'The counted qty should not be greater than 1 for serialized items.'
        );
        //formGroup.value.countedQty = 1;
      } else {
        //(formGroup.value.countedQty <= dataItem.onHandQty) {
        dataItem.countedQty = formGroup.value.countedQty;
      }
      // else {
      //   this.utility.toast.error(
      //     'Load Qty. should not be greater than the On Hand Qty.'
      //   );
      // }
    }
  }
  public createFormGroup(dataItem: any): FormGroup {
    return this.formBuilder.group({
      countedQty: [
        dataItem.countedQty,
        Validators.compose([Validators.pattern('^[0-9]{1,7}')]),
      ],
    });
  }
  public onFilter(inputValue: string): void {
    this.gridView = process(this.tempInvList, {
      filter: {
        logic: 'or',
        filters: [
          {
            field: 'invType',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'description',
            operator: 'contains',
            value: inputValue,
          },
        ],
      },
    }).data;
    this.dataBinding.skip = 0;
  }
  private onError(error: any, customMessage?: string) {
    this.errorHandler.handleError(
      error,
      ModuleNames.components_notes,
      customMessage
    );
  }
  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.data = {
      data: orderBy(this.cycleCountData, this.sort),
      total: this.cycleCountData.length,
    };
    this.cycleCountData = this.data.data;
  }
  dblClickEvent(event) {
    this.addInventoryItem();
  }
}
