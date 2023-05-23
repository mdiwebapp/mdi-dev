import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { SortDescriptor, process } from '@progress/kendo-data-query';
import { VehicleService } from '../vehicle.service';
import { InventoryService } from '../../inventory.service';
import {
  DataBindingDirective,
  GridComponent,
} from '@progress/kendo-angular-grid';
import { UtilityService } from 'src/app/core/services/utility.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModuleNames, ErrorMessages } from 'src/app/core/constant';
import { ErrorHandlerService } from 'src/app/core/services';
@Component({
  selector: 'app-vehicle-inventory',
  templateUrl: './vehicle-inventory.component.html',
  styleUrls: ['./vehicle-inventory.component.scss'],
})
export class VehicleInventoryComponent implements OnInit {
  @ViewChild(DataBindingDirective) dataBinding: DataBindingDirective;
  @ViewChild(GridComponent) private grid: GridComponent;
  @Output() popupitem = new EventEmitter<any>();
  loadItems: any = [];
  unloadItems: any = [];
  lstParts: any = [];
  gridView: any[];
  tempInventoryNumber: string;
  show: boolean;
  toggleText: string;
  PartItem: any;
  vehicleNum: string;
  loadingDate: Date;
  public mySelection: number[] = [0];
  public loadSelection: number[] = [];
  public unloadSelection: number[] = [];

  quantity: number = 0;
  public sort: SortDescriptor[] = [
    {
      field: 'vendorName',
      dir: 'asc',
    },
  ];
  public opened = false;
  public openedOffload = false;
  public lblAlert = 'Are you sure';
  inventoryNumber: any;
  allRowsSelected: boolean;
  constructor(
    public service: VehicleService,
    public inventoryService: InventoryService,
    private utils: UtilityService,
    private formBuilder: FormBuilder,
    public errorHandler: ErrorHandlerService
  ) { }
  public formGroup: FormGroup;
  private editedRowIndex: number;
  private isNew = false;
  branchCode: any;
  ngOnInit(): void {
  }
  setVehicleId(id, branchcode) {
    
    this.closepopup();
    this.lstParts = [];
    this.gridView = [];
    this.branchCode = branchcode;
    //if (this.lstParts.length <= 0) {
    this.bindPartsItem(branchcode);
    //}
    this.vehicleNum = id;
    this.GetPicklist(id);
    this.popupitem.emit(false);
  }
  public onToggle(): void {
    this.gridView = this.lstParts;
    this.show = !this.show;
    this.toggleText = this.show ? 'Hidе' : 'Show';
    this.popupitem.emit(this.show);
  }
  bindPartsItem(branchCode) {
    this.inventoryService.GetInventoryTypes(branchCode).subscribe(
      (res) => {
        if (res) {
          this.lstParts = res;
          this.gridView = res;
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.inventory.get_inventory_types);
      }
    );
  }
  public onFilter(inputValue: string): void {
    this.gridView = process(this.lstParts, {
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
  AddPart() {
    if (this.quantity <= 0) {
      this.utils.toast.error('Please enter quantity.');
      return false;
    }
    var itm = this.gridView[this.mySelection[0]];
    var obj = {
      inventoryType: itm.invType,
      //inventoryNumber: itm.inventoryNumber,
      quantity: this.quantity,
      location_Number: this.vehicleNum,
    };
    this.service.LoadPicklist(obj).subscribe(
      (res) => {
        if (res) {
          this.closepopup();
          this.quantity = 0;
          this.GetPicklist(this.vehicleNum);
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.vehicle.load_picklist);
      }
    );
  }
  closepopup() {
    this.show = false;
    this.mySelection = [];
    this.popupitem.emit(this.show);
  }

  GetPicklist(id) {
    this.service.GetLoadPicklist(id).subscribe(
      (res) => {
        if (res) {
          this.loadItems = res;
          this.unloadItems = [];
          this.listSelected = [];
          this.loadSelection = [];
          this.GetLoadedItems(id);
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.vehicle.get_load_picklist);
      }
    );
  }
  GetLoadedItems(id) {
    var allBranch = JSON.parse(this.utils.storage.getItem('selectedBranch'));
    //this.branchCode = allBranch[0].code;
    var data = {
      InvTransferNumber: id,
      BranchName: this.branchCode
    }
    this.inventoryService.LoadInvenotry(data).subscribe(
      (res) => {
        if (res) {
          this.listunloaded = [];
          this.unloadItems = res;
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.inventory.load_invenotry);
      }
    );
  }
  loadOnVehicle() {
    var itm = this.loadItems[0];
    if (!this.loadingDate) {
      this.utils.toast.error('Please select date.');
      return false;
    }
    if (!itm.invNumber) {
      this.utils.toast.error('Please select inventory number.');
      return false;
    }
    const currentFuture = new Date();
    const currentPast = new Date();
    // currentFuture.setDate(currentFuture.getDate() + 1)
    if (this.loadingDate > currentFuture) {
      this.utils.toast.error('Date too far in future.');
      return false;
    }
    currentPast.setDate(currentPast.getDate() - 30);
    if (this.loadingDate < currentPast) {
      this.utils.toast.error('Date too far in future.');
      return false;
    }
    if (itm.quantity > itm.available) {
      this.utils.toast.error(
        'Load Qty. should not be greater than the On Hand Qty.'
      );
      return false;
    }
    if (!this.loadingDate) {
      this.utils.toast.error('Please select date.');
      return false;
    }

    this.loadItems.forEach((element) => {
      var objItem = {
        picklistId: element.pk,
        inventoryType: element.invType,
        inventoryNumber: element.invNumber,
        availableQty: element.available,
        quantity: element.quantity,
        serialized: element.serialized,
      };

      if (element.quantity > 0) {
        this.listSelected.push(objItem);
      }
    });
    if (this.listSelected.length <= 0) {
      this.utils.toast.error('Please add load Qty.');
      return false;
    }
    var obj = {
      id: 0,
      userName: JSON.parse(localStorage.getItem('currentUser')).userName,
      // inventoryType: itm.inventoryType,
      // inventoryNumber: itm.inventoryNumber,
      // quantity: itm.quantity,
      locationNumber: this.vehicleNum,
      selectedDate: this.loadingDate,
      branchCode: this.branchCode,
      inventorytypes: this.listSelected,
    };
    this.inventoryService.LoadOnVehicle(obj).subscribe(
      (res) => {
        if (res) {
          this.loadingDate = null;

          // this.loadSelection.forEach(element => {

          //   this.deleteOnloadSelected(this.loadItems[element]);
          // });
          this.loadSelection = [];
          this.listSelected = [];
          this.GetPicklist(this.vehicleNum);
          this.bindPartsItem(this.branchCode);
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.inventory.load_on_vehicle);
      }
    );
  }
  unloadOnVehicle() {
    console.log('....');
    var itm = this.unloadItems[0];
    if (!this.loadingDate) {
      this.utils.toast.error('Please select date.');
      return false;
    }
    if (!this.loadingDate) {
      this.utils.toast.error('Please select date.');
      return false;
    }
    const currentFuture = new Date();
    const currentPast = new Date();
    // currentFuture.setDate(currentFuture.getDate() + 1)
    if (this.loadingDate > currentFuture) {
      this.utils.toast.error('Date too far in future.');
      return false;
    }
    currentPast.setDate(currentPast.getDate() - 30);
    if (this.loadingDate < currentPast) {
      this.utils.toast.error('Date too far in future.');
      return false;
    }
    // this.loadItems.push(itm);
    // this.unloadItems.splice(this.unloadSelection[0], 1);
    // this.unloadSelection = [];
    this.unloadItems.forEach((element) => {
      var objunload = {
        picklistId: element.pk,
        inventoryType: element.invType,
        inventoryNumber: element.invNumber,
        availableQty: element.quantity,
        quantity: element.returnQty,
        serialized: element.serialized,
      };
      if (element.returnQty > 0) {
        this.listunloaded.push(objunload);
      }
    });
    if (this.listunloaded.length <= 0) {
      this.utils.toast.error('Please add return Qty.');
      return false;
    }
    var obj = {
      id: 0,
      userName: JSON.parse(localStorage.getItem('currentUser')).userName,
      // inventoryType: itm.inventoryType,
      // inventoryNumber: itm.inventoryNumber,
      // quantity: itm.returnQty,
      locationNumber: this.vehicleNum,
      selectedDate: this.loadingDate,
      branchCode: this.branchCode,
      inventorytypes: this.listunloaded,
    };
    this.inventoryService.UnLoadOnVehicle(obj).subscribe(
      (res) => {
        if (res) {
          this.loadingDate = null;
          this.listunloaded = [];
          this.unloadSelection = [];
          this.utils.toast.success(res.message);
          //this.GetLoadedItems(this.vehicleNum);
          this.GetPicklist(this.vehicleNum);
          this.bindPartsItem(this.branchCode);
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.inventory.unload_on_vehicle);
      }
    );
  }
  unloadAllVehicle() {
    if (this.unloadItems.length > 0) {
      var lstUnload = [];
      if (!this.loadingDate) {
        this.utils.toast.error('Please select date.');
        return false;
      }
      const currentFuture = new Date();
      const currentPast = new Date();
      //currentFuture.setDate(currentFuture.getDate() + 1)
      if (this.loadingDate > currentFuture) {
        this.utils.toast.error('Date too far in future.');
        return false;
      }
      currentPast.setDate(currentPast.getDate() - 30);
      if (this.loadingDate < currentPast) {
        this.utils.toast.error('Date too far in future.');
        return false;
      }
      for (var i = 0; i < this.unloadItems.length; i++) {
        //this.loadItems.push(this.unloadItems[i]);
        var objdata = {
          picklistId: this.unloadItems[i].pk,
          inventoryType: this.unloadItems[i].invType,
          inventoryNumber: this.unloadItems[i].invNumber,
          availableQty: this.unloadItems[i].available,
          quantity: this.unloadItems[i].quantity,
          serialized: this.unloadItems[i].serialized,
        };
        lstUnload.push(objdata);
      }
      var obj = {
        id: 0,
        userName: JSON.parse(localStorage.getItem('currentUser')).userName,
        locationNumber: this.vehicleNum,
        selectedDate: this.loadingDate,
        branchCode: this.branchCode,
        inventorytypes: lstUnload,
      };
      this.inventoryService.OffloadVehicle(obj).subscribe(
        (res) => {
          if (res) {
            lstUnload = [];
            this.loadingDate = null;
            this.GetPicklist(this.vehicleNum);
          }
        },
        (error) => {
          this.onError(error, ErrorMessages.inventory.offload_vehicle);
        }
      );
      this.unloadItems = [];
    }
  }
  // deleteOnloadSelected(itm) {
  //   //var itm = this.loadItems[this.loadSelection[0]];
  //   this.service.deletePicklist(this.vehicleNum, itm.pk, false).subscribe((res) => {
  //     if (res) {
  //       this.loadSelection = [];
  //       this.listSelected = [];
  //       //this.utils.toast.success(res["message"]);
  //       this.GetPicklist(this.vehicleNum);
  //     }
  //   });
  // }
  deleteSelected() {
    var itm = this.loadItems[this.loadSelection[0]];
    var obj = {
      id: itm.pk,
      deleteAll: false,
      location_Number: this.vehicleNum,
    };
    this.service.deletePicklist(obj).subscribe((res) => {
      if (res) {
        this.loadSelection = [];
        //this.utils.toast.success(res["message"]);
        this.GetPicklist(this.vehicleNum);
      }
    });
  }
  deleteAll() {
    var obj = {
      id: 0,
      deleteAll: true,
      location_Number: this.vehicleNum,
    };
    this.service.deletePicklist(obj).subscribe(
      (res) => {
        if (res) {
          this.utils.toast.success(res['message']);
          this.GetPicklist(this.vehicleNum);
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.vehicle.delete_picklist);
      }
    );
  }
  public close(status) {
    console.log(`Dialog result: ${status}`);
    if (status == 'yes') {
      if (this.alertType == 0) {
        this.deleteAll();
      } else if (this.alertType == 1) {
        this.deleteSelected();
      }
    }
    this.opened = false;
  }
  alertType: number;
  public open(type) {
    this.alertType = type;
    if (type == 1) {
      var itm = this.loadItems[this.loadSelection[0]];
      this.lblAlert =
        'Are you sure you want to remove ' +
        itm.invType +
        ' from the Pick list?';
    } else if (type == 0) {
      this.lblAlert =
        'Are you sure you want to remove all items from the Pick list?';
    }
    this.opened = true;
  }
  public openOffload() {
    this.openedOffload = true;
  }
  public closeOffload(status) {
    if (status == 'yes') {
      this.unloadAllVehicle();
    }
    this.openedOffload = false;
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
      // prevent closing the edited cell if there are invalid values.
      args.preventDefault();
    } else if (formGroup.dirty) {
      if (dataItem.serialized == true && formGroup.value.quantity > 1) {
        this.utils.toast.error(
          'Load Qty. should not be greater than 1 for serialized item.'
        );
        formGroup.value.quantity = 1;
      }
      if (formGroup.value.quantity <= dataItem.available) {
        var loadQty = {
          id: dataItem.pk,
          invNumber: dataItem.invNumber,
          loadQty: formGroup.value.quantity,
        };
        this.service.LoadQuantity(loadQty).subscribe(
          (res) => {
            if (res) {
              this.GetPicklist(this.vehicleNum);
            }
          },
          (error) => {
            this.onError(error, ErrorMessages.vehicle.load_quantity);
          }
        );
      } else {
        this.utils.toast.error(
          'Load Qty. should not be greater than the On Hand Qty.'
        );
      }
    }
  }
  public createFormGroup(dataItem: any): FormGroup {
    return this.formBuilder.group({
      quantity: [
        dataItem.quantity,
        Validators.compose([
          Validators.required,
          Validators.pattern('^[0-9]{1,3}'),
        ]),
      ],
    });
  }

  /// ============ unload vehicle edit ==================
  public unloadCellClickHandler({
    sender,
    rowIndex,
    columnIndex,
    dataItem,
    isEdited,
  }) {
    if (!isEdited) {
      sender.editCell(
        rowIndex,
        columnIndex,
        this.createUnloadFormGroup(dataItem)
      );
    }
  }
  public unloadCellCloseHandler(args: any) {
    const { formGroup, dataItem } = args;

    if (!formGroup.valid) {
      // prevent closing the edited cell if there are invalid values.
      args.preventDefault();
    } else if (formGroup.dirty) {
      if (formGroup.value.returnQty <= dataItem.quantity) {
        var loadQty = {
          id: dataItem.pk,
          invNumber: dataItem.invNumber,
          loadQty: formGroup.value.returnQty,
        };
        var itm = this.unloadItems.find((c) => c.pk == dataItem.pk);
        itm.returnQty = formGroup.value.returnQty;
        this.unloadSelection = [];
      } else {
        this.utils.toast.error(
          'Unload Qty. can not be greater than the On Vehicle Qty.'
        );
      }
    }
  }
  public createUnloadFormGroup(dataItem: any): FormGroup {
    return this.formBuilder.group({
      returnQty: [
        dataItem.returnQty,
        Validators.compose([Validators.pattern('^[0-9]{1,3}')]),
      ],
    });
  }

  public changeInvNumber(dataItem, invNumber) {
    var isExist = this.loadItems.find((c) => c.invNumber == invNumber);
    var itm = this.loadItems.find((c) => c.pk == dataItem.pk);
    itm.invNumber = invNumber;
    if (isExist) {
      itm.invNumber = null;
      this.utils.toast.error(invNumber + ' is already selected.');
      return false;
    }

    itm.quantity = 1;
    var loadQty = {
      id: dataItem.pk,
      invNumber: invNumber,
      loadQty: dataItem.quantity,
    };
    this.service.LoadQuantity(loadQty).subscribe(
      (res) => {
        if (res) {
          // var itm = this.loadItems.find(c => c.pk == dataItem.pk);
          // itm.inventoryNumber = dataItem.inventoryNumbery;
          //this.GetPicklist(this.vehicleNum);
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.vehicle.load_quantity);
      }
    );
  }
  handleFilter(value, data) {
    if (!this.tempInventoryNumber) {
      this.tempInventoryNumber = data.inventoryNumberList;
    } else {
      data.inventoryNumberList = this.tempInventoryNumber;
    }
    if (value) {
      data.inventoryNumberList = data.inventoryNumberList
        .toString()
        .split(',')
        .filter((s) => s.toLowerCase().indexOf(value.toLowerCase()) !== -1);
    } else {
      data.inventoryNumberList = this.tempInventoryNumber;
    }
  }
  listSelected: any = [];
  selectedRowChange(data) {
    var selected =
      data.selectedRows.length > 0 ? data.selectedRows[0].dataItem : null;
    var deselected =
      data.deselectedRows.length > 0 ? data.deselectedRows[0].dataItem : null;
    if (selected) {
      var obj = {
        picklistId: selected.pk,
        inventoryType: selected.invType,
        invNumber: selected.invNumber,
        availableQty: selected.available,
        quantity: selected.quantity,
        serialized: selected.serialized,
      };

      if (selected.quantity > 0) {
        this.listSelected.push(obj);
      } else {
        this.loadSelection = this.loadSelection.splice(
          data.selectedRows[0].index,
          1
        );
      }
    }

    if (deselected) {
      var del = this.listSelected.find(
        (c) =>
          c.invType == deselected.invType && c.invNumber == deselected.invNumber
      );
      if (del) {
        this.listSelected.splice(del, 1);
      }
    }
  }

  listunloaded: any = [];
  unloadselectedRowChange(data) {
    var selected =
      data.selectedRows.length > 0 ? data.selectedRows[0].dataItem : null;
    var deselected =
      data.deselectedRows.length > 0 ? data.deselectedRows[0].dataItem : null;
    if (selected) {
      var obj = {
        picklistId: selected.pk,
        inventoryType: selected.invType,
        invNumber: selected.invNumber,
        availableQty: selected.quantity,
        quantity: selected.returnQty,
        serialized: selected.serialized,
      };

      if (selected.returnQty > 0) {
        this.listunloaded.push(obj);
      } else {
        this.unloadSelection = this.unloadSelection.splice(
          data.selectedRows[0].index,
          1
        );
      }
    }

    if (deselected) {
      var del = this.listunloaded.find(
        (c) =>
          c.inventoryType == deselected.invType &&
          c.quantity == deselected.quantity
      );
      if (del) {
        this.listunloaded.splice(del, 1);
      }
      //this.listunloaded = [];
    }
  }

  private onError(error: any, customMessage?: string) {
    this.errorHandler.handleError(
      error,
      ModuleNames.vehicle_inventory,
      customMessage
    );
  }
}
