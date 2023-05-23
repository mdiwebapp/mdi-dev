import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { orderBy, SortDescriptor } from '@progress/kendo-data-query';
import { PhysicalInventoryService } from '../physical-inventory/physical-inventory.service';
import * as fileSaver from 'file-saver';
import { UtilityService } from 'src/app/core/services/utility.service';
import { Subscription } from 'rxjs';
import { LoaderService } from 'src/app/core/loader/loader.service';
import { MenuService } from 'src/app/core/helper/menu.service';

@Component({
  selector: 'app-physical-inventory-barcode',
  templateUrl: './physical-inventory-barcode.component.html',
  styleUrls: ['./physical-inventory-barcode.component.scss'],
})
export class PhysicalInventoryBarcodeComponent implements OnInit {
  // PhysicalBarcodeForm: FormGroup;
  data: any = [];
  lstPhysicalInv: any = [];
  disable: boolean = false;
  quantity: number = 1;
  barcode: string = '';
  sort: SortDescriptor[] = [
    {
      field: 'invType',
      dir: 'asc',
    },
    {
      field: 'description',
      dir: 'asc',
    },
  ];
  selections: any = [];
  skip: number = 0;
  multiple: boolean = false;
  opened: boolean = false;
  openedQty: boolean = false;
  isValid: number = 0;
  physicalInventoryBarcodecolumns = [
    {
      Name: 'invType',
      isCheck: true,
      Text: 'Inv Type ',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'barcode',
      isCheck: true,
      Text: 'Barcode',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'description',
      isCheck: true,
      Text: 'Description ',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'counted',
      isCheck: true,
      Text: 'Counted',
      isDisable: false,
      index: 0,
      width: 50,
    },
    {
      Name: 'onHand',
      isCheck: true,
      Text: 'OnHand',
      isDisable: false,
      index: 0,
      width: 50,
    },
  ];
  clickEventsubscription: Subscription;
  message: any;
  branchIds: string = 'All';
  branchName: string = 'All';
  visible: boolean;
  enterQty: boolean = false;
  public min = 1;
  public max = 1000000000;
  public autoCorrect = true;
  constructor(
    public service: PhysicalInventoryService,
    private utils: UtilityService,public menuService: MenuService,
    public loaderService: LoaderService
  ) {
    if (localStorage.getItem('isAdmin') == 'true') {
     
    } else {
      let acc = this.menuService.checkUserViewRights('Physical Inventory Barcode');
      if (acc) {
        //this.utils.toast.error("User does not have rights to access " + name + " module.");Z
      } else {
        this.utils.toast.error(
          'You do not have permissions to access this part of the system. Please contact your supervisor so they can request them from IT.'
        );
        setTimeout(() => {
          var url = '/dashboard';
          location.href = url;
        }, 1000);
      }
      this.menuService.checkUserBySubmoduleRights('Physical Inventory Barcode');
    }
  }

  ngOnInit(): void {
    this.clickEventsubscription = this.utils.getClickEvent().subscribe((a) => {
      this.message = a;
      this.callBack(this.message);
    });

    if (this.utils.storage.getItem('selectedBranch')) {
      this.branchIds = JSON.parse(this.utils.storage.getItem('selectedBranch'))[0].code;
      this.branchName=JSON.parse(this.utils.storage.getItem('selectedBranch'))[0].value;
    }
  }

  getLabourType() {
    this.lstPhysicalInv = [];
    if (
      this.branchIds == 'All' ||
      this.branchIds == 'SSG' ||
      this.branchIds == '%'
    ) {
      this.utils.toast.error('Please select branch.');
    } else {
      this.visible = true;
      this.service
        .GetInventoryBarcodeByBranch(this.branchIds)
        .subscribe((res) => {
          this.visible = false;
          if (res.length > 0) {
            this.lstPhysicalInv = res;
            this.loaderService.hide();
          }
        });
    }
  }
  addQty() {
    if (
      this.branchIds == 'All' ||
      this.branchIds == 'SSG' ||
      this.branchIds == '%'
    ) {
      this.utils.toast.error('All/SSG do not have inventory. Please select a different Branch.');
      return false;
    }
   this.checkInvNumber();
   
  }
  removeItem(item) {
    var existCode = this.data.findIndex((c) => c.barcode == item.barcode);
    this.data.splice(existCode, 1);
  }
  exportData() {
    if(this.data.length > 0)
    {
      var lst = [];
      this.data.forEach((element) => {
        var obj = {
          inventoryType: element.invType,
          description: element.description,
          barcode: element.barcode,
          counted: element.counted,
          onHand: element.onHand,
        };
        lst.push(obj);
      });
      this.service.PhysicalInventoryBarcodeExport(lst).subscribe((res) => {
        let data = new Blob([res], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;',
        });
        fileSaver.saveAs(data, 'PhysicalInventory_Barcode.xlsx');
      });
    }
    else
    {
      this.utils.toast.error("No record found to print report");
    }
  }

  saveData() {
    var lst = [];
    var usr = JSON.parse(localStorage.getItem('currentUser'));
    this.data.forEach((element) => {
      var obj = {
        inventoryType: element.invType,
        inventoryNumber: element.invType,
        qty: element.counted,
        branch: this.branchIds,
        userName: usr.userId,
      };
      lst.push(obj);
    });

    this.service.AddPhysicalInventoryBarcode(lst).subscribe((res) => {
      if (res['status'] == 200) {
        this.utils.toast.success(res['message']);
        this.enterQty = false;
        this.data = [];
        this.onValueChange();
        this.disable = false;
        //this.getLabourType();
        // this.SaveEditClick.emit(res);
      }
    });
  }
  onResizeColumn(event) {}

  onSortChange(sort: SortDescriptor[]) {
    this.sort = this.sort;
    this.physicalInventoryBarcodecolumns = orderBy(
      this.physicalInventoryBarcodecolumns,
      sort
    );
  }

  onSelectionChange(event) {}

  onReOrderColumns(event) {}

  onDataStateChange(event) {}

  onValueChange() {
    this.quantity = 1;
    this.disable = !this.disable;
  }
  openConfirm(itm) {
    this.opened = true;
  }
  excQty: number = 0;
  openQtyConfirm() {
    this.excQty = 0;
    var existCode = this.data.find((c) => c.barcode == this.barcode);
    if (existCode) {
      this.excQty = existCode.counted;
      this.openedQty = true;
      //existCode.counted = existCode.counted + this.quantity;
    } else {
      this.addQty();
    }
  }
  public closeSubmit(status) {
    if (status == 'Yes') {
      this.opened = !this.opened;
      this.removeItem(this.selections[0]);
    } else {
      this.opened = !this.opened;
    }
  }
  public closeQuantity(status) {
    if (status == 'Yes') {
      this.openedQty = !this.openedQty;
      this.addQty();
    } else {
      this.enterQty = false;
      this.disable = false;
      this.openedQty = !this.openedQty;
    }
  }
  callBack(value) {
    var valueId = '';
    var valueName = ''; 
    value.forEach((element) => {
      valueId = element.code;
      valueName = element.value;
    });
    this.branchIds = valueId;
    this.branchName = valueName;
    //this.getLabourType();
  }
  onChange(value) {
    this.barcode = value;
    this.addQty();
  }
  checkInvNumber(){
    this.service.GetInventoryBarcodeNumber(this.barcode,this.branchIds).subscribe((res) => {      
      debugger
      var item =res[0];// this.lstPhysicalInv.find((c) => c.barcode == this.barcode);
      if (item) {
        this.isValid = 1;
        var obj = {
          invType: item.invType,
          description: item.description,
          barcode: item.barcode,
          onHand: item.onHand,
          counted: this.quantity,
        };
        var existCode = this.data.find((c) => c.barcode == this.barcode);
        if (existCode) {
          existCode.counted = existCode.counted + this.quantity;
        } else {
          this.data.push(obj);
        }
  
        setTimeout(() => {
          this.isValid = 0;
        }, 500);
        this.quantity = 1;
        this.barcode = '';
        this.enterQty = false;
        this.disable = false;
      } else {
        this.isValid = 2;
        this.utils.toast.error('Barcode not found.');
        this.barcode = '';
        setTimeout(() => {
          this.isValid = 0;
        }, 500);
      }
    });
  }
}
