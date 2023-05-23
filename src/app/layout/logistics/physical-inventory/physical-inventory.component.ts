import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  ViewData,
  ViewColumnsItems,
  ItemData,
  ViewColumns,
} from '../../../../data/physical-inventory-data';
import { Subscription } from 'rxjs';
import { UtilityService } from 'src/app/core/services/utility.service';
import { ErrorHandlerService } from 'src/app/core/services';
import { PhysicalInventoryService } from './physical-inventory.service';
import { ErrorMessages, ModuleNames } from 'src/app/core/constant';
import { PhysicalInventoryModel } from './physicalInvenotry.model';
import { orderBy, SortDescriptor, process } from '@progress/kendo-data-query';
import { NetworkDirectoryComponent } from '../../networkdirectory/networkdirectorypage/networkdirectory.component';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { MenuService } from 'src/app/core/helper/menu.service';
import { Router } from '@angular/router';
import { LoaderService } from 'src/app/core/loader/loader.service';

@Component({
  selector: 'app-physical-inventory',
  templateUrl: './physical-inventory.component.html',
  styleUrls: ['./physical-inventory.component.scss'],
})
export class PhysicalInvenotryComponent implements OnInit {
  @ViewChild(DataBindingDirective) dataBinding: DataBindingDirective;
  multiple: boolean = false;
  form: FormGroup;
  physicalInventoryData: any = [];
  tempphysicalInventoryData: any = [];
  openInventoryType: boolean = false;
  viewColumnsItems: any;
  itemData: any;
  show: boolean = false;
  showSubmit: boolean = true;
  viewColumns: any;
  branchList = [];
  branch: any[] = [];
  branchData: any;
  branchCode: string = '';
  clickEventsubscription: Subscription;
  message: any;
  gridView: any[];
  tempList: any[];
  tempInvList: any[];
  selectedRow: any;

  data: any;
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
  constructor(
    private formBuilder: FormBuilder,
    public service: PhysicalInventoryService,
    public errorHandler: ErrorHandlerService,
    private utility: UtilityService,
    public menuService: MenuService,
    public router: Router,
    public loaderService: LoaderService
  ) {
    if (localStorage.getItem('isAdmin') != 'true') {
      let acc = this.menuService.checkUserViewRights('physical inventory');
      if (acc) {
        const rights = JSON.parse(localStorage.getItem('Rights'));
        if (rights) {
          this.showSubmit = rights.some(
            (c) =>
              c.subModuleName == 'Maintain Physical Inventory' &&
              c.moduleName == 'Physical Inventory' &&
              c.tabName == 'Submit'
          ); 
        }
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
    } else {
    }
  }
  @ViewChild(NetworkDirectoryComponent)
  networkDirectory: NetworkDirectoryComponent;
  ngOnInit(): void {
    this.clickEventsubscription = this.utility
      .getClickEvent()
      .subscribe((a) => {
        this.message = a;
        this.callBack(this.message);
      });
    this.branch = JSON.parse(this.utility.storage.getItem('selectedBranch'));
    if (this.branch[0].id == 0) {
      this.GetBranch();
    }
    //this.physicalInventoryData = ViewData;
    this.itemData = ItemData;
    this.viewColumnsItems = ViewColumnsItems;
    this.viewColumns = ViewColumns;
    //  this.loadInventory();
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
    this.physicalInventoryData = [];
    this.tempphysicalInventoryData = [];

    // value.forEach((element) => {
    //   valueId.push(element.id);
    //   valueId1.push(element.userId);
    // });
    //if (value.length > 0) { this.branchCode = value[value.length - 1].code; }
    // this.loadCyclecount(this.branchCode);
  }
  GetBranch() {
    this.branch = this.utility.storage.CurrentUser.userBranch;
    var index = this.branch.findIndex((c) => c.value == 'SSG');
    this.branch.splice(index, 1);
    //this.branch.unshift({ "code": "All", "id": 0, "value": "All" });
    this.branchData = this.branch;
  }
  initForm(): void {
    this.form = this.formBuilder.group({
      countedText: [],
      SearchTxt: [],
      quantity: [],
      comments: ['', [Validators.required]],
      approved: [false],
      branch: [],
    });
  }
  onToggle() {
    this.show = !this.show;
  }
  closePopup() {
    this.show = !this.show;
  }
  onInventoryType() {
    this.gridView = this.tempInvList;
    this.mySelection = [];
    if (this.branchCode != '' && this.branchCode != 'All')
      this.openInventoryType = !this.openInventoryType;
    else this.utility.toast.error('Please select branch.');
  }
  onSubmit() {
    const formValues = this.form.value;
    if (!this.branchCode || this.branchCode == 'All') {
      this.utility.toast.error('Please select branch.');
      return false;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return false;
    }
    this.tempphysicalInventoryData = this.physicalInventoryData;
    // let checkOnHand = this.tempphysicalInventoryData.find(
    //   (c) => c.onHandQty == '' || c.onHandQty == null || c.onHandQty <= 0
    // );
    // if(checkOnHand){
    //   this.utility.toast.error('Please select inventory having on hand qty.'); 
    //   return false;
    // }
    let nullData = this.tempphysicalInventoryData.find(
      (c) => c.countedQty == '' || c.countedQty == null || c.countedQty <= 0
    );
    let nullOnHaneData= this.tempphysicalInventoryData.find(
      (c) =>  c.onHandQty  > 0 && c.countedQty > 0
    );
    
    if (nullData) {
      this.utility.toast.error('Please enter all counted qty.');
      return false;
    }
    let data = this.tempphysicalInventoryData.map((c) => {
      return {
        ...c,
        countedQty: Number(c.countedQty),
      };
    });
    // let data = this.tempphysicalInventoryData.filter((c) => c.countedQty > 0);
    // if (data.length <= 0) {
    //   this.utility.toast.error(
    //     'There is no data to process. Please enter counted qty.'
    //   );
    //   return false;
    // }

    if (data.length > 0) {
      const cycle_data = new PhysicalInventoryModel();
      cycle_data.branch = this.branchCode;
      cycle_data.userName = JSON.parse(
        localStorage.getItem('currentUser')
      ).userName;
      cycle_data.selectedInventories = data;      
      cycle_data.approved = this.form.value.approved;
      cycle_data.comment = this.form.value.comments;
      
      this.service.SubmitPhysicalInventory(cycle_data).subscribe(
        (res) => {
          if (res['status'] == 200) {
            this.utility.toast.success(res['message']);
            this.form.reset();
            this.form.setValue({
              ...this.form.value,
              approved: false,
            });
            this.physicalInventoryData = [];
          } else this.utility.toast.error(res['message']);
        },
        (error) => this.onError(error, error.error.message)
      );
    }
  }
  loadInventory() {
    this.physicalInventoryData = [];
    this.tempphysicalInventoryData = [];
    if (this.branchCode == '%') {
      this.branchCode = 'SSG';
    }
    this.service.GetInventoryTypes(this.branchCode).subscribe(
      (res) => {
        if (res) {
          this.gridView = res;
          this.tempInvList = res;
          this.mySelection = [];
          this.loaderService.hide();
        }
      },
      (error) => this.onError(error, ErrorMessages.drop_down.get_vendor_list)
    );
  }
  onGridSelectionChange($event) {
    this.selectedRow = $event.selectedRows[0].dataItem;
    this.loadPhysicalData();
  }
  loadPhysicalData() {
    this.service.GetPhysicalInventory(1).subscribe(
      (res) => {
        if (res) {
          this.physicalInventoryData = res;
          this.tempphysicalInventoryData = res;
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
  resetPopup() {}

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
      // if (formGroup.value.countedQty > 1) {
      //   this.utility.toast.error(
      //     'Load Qty. should not be greater than 1 for serialized item.'
      //   );
      //   formGroup.value.countedQty = 1;
      // }
      //else { //(formGroup.value.countedQty <= dataItem.onHandQty) {

      dataItem.countedQty = formGroup.value.countedQty;
      //}
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
  errorMsg: string = '';
  selectionChange() {
    this.errorMsg = '';
  }
  addInventoryItem() {
    var inv = this.gridView[this.mySelection[0]];
    if (!inv) {
      return false;
    }
    var isExist = this.physicalInventoryData.find(
      (c) => c.inventoryType == inv.invType
    );
    if (isExist) {
      this.errorMsg = inv.invType + ' already added.';
      //this.utility.toast.error(inv.invType + ' already added.');
      return false;
    }

    this.service.GetInventoryDetail(this.branchCode, inv.invType).subscribe(
      (res) => {
        if (res) {
          if (res.length > 0) {
            this.physicalInventoryData.unshift({
              inventoryType: inv.invType,
              inventoryNumber: res[0].invNumber,
              description: inv.description,
              onHandQty: res[0].quantity,
              countedQty: null,
            });
          } else {
            this.physicalInventoryData.unshift({
              inventoryType: inv.invType,
              inventoryNumber: inv.invType,
              description: inv.description,
              onHandQty: 0,
              countedQty: null,
            });
          }
          this.mySelection = [];
          this.openInventoryType = false;
        }
      },
      (error) => this.onError(error, ErrorMessages.drop_down.get_vendor_list)
    );
    // this.physicalInventoryData.unshift({ inventoryType: inv.invType, inventoryNumber: inv.invType, description: inv.description, onHandQty: 0, countedQty: 0 });
    // this.openInventoryType = false;
    // this.mySelection = [];
  }
  removeItem($event) {
    const index = this.physicalInventoryData.indexOf($event);
    if (index > -1) {
      this.physicalInventoryData.splice(index, 1);
    }
    //this.physicalInventoryData.splice($event);
  }
  showFolder: boolean;
  toggleText: string;
  public onFolderToggle(): void {
    this.showFolder = !this.showFolder;
    this.toggleText = this.showFolder ? 'Hidе' : 'Show';

    setTimeout(() => {
      this.networkDirectory.loadFolderByPhysicalInv();
    }, 200);
  }

  private onError(error: any, customMessage?: string) {
    this.errorHandler.handleError(
      error,
      ModuleNames.physical_inventory,
      customMessage
    );
  }
  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.data = {
      data: orderBy(this.physicalInventoryData, this.sort),
      total: this.physicalInventoryData.length,
    };
    this.physicalInventoryData = this.data.data;
  }
  dblClickEvent(event) {
    this.addInventoryItem();
  }
}
