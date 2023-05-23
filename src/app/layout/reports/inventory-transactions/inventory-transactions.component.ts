import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as fileSaver from 'file-saver';
import { ModuleNames, ErrorMessages } from 'src/app/core/constant';
import { MenuService } from 'src/app/core/helper/menu.service';
import { ErrorHandlerService } from 'src/app/core/services';
import { DropdownService } from 'src/app/core/services/dropdown.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { InventoryTransactionService } from './inventory-transactions.service';
import {
  process,
  SortDescriptor,
  State,
  orderBy,
} from '@progress/kendo-data-query';

@Component({
  selector: 'app-inventory-transactions',
  templateUrl: './inventory-transactions.component.html',
  styleUrls: ['./inventory-transactions.component.scss'],
})
export class InventoryTransactionsComponent implements OnInit {
  inventoryTransactionForm: FormGroup;
  currenttoDate: any;
  currentfromDate: any;
  disableFromDate: boolean = true;
  disableToDate: boolean = true;
  branchList: any = [];
  public sort: SortDescriptor[] = [
    {
      field: 'ALL',
      dir: 'asc',
    },
  ];
  filters: any = [
    {
      label: 'ALL',
      value: 'All',
    },
    {
      label: 'Cycle Count',
      value: 'Cycle Count',
    },
    {
      label: 'Inter-Company Inventory Transfer',
      value: 'Inter-Company Inventory Transfer',
    },
    {
      label: 'Inventory',
      value: 'Inventory',
    },
    {
      label: 'Inventory Sold',
      value: 'Inventory Sold',
    },
    {
      label: 'Part Used',
      value: 'Part Used',
    },
    {
      label: 'Physical Inventory',
      value: 'Physical Inventory',
    },
    {
      label: 'Product Received',
      value: 'Product Received',
    },
    {
      label: 'Project Inventory',
      value: 'Project Inventory',
    },
    {
      label: 'Shipping',
      value: 'Shipping',
    },
  ];
  constructor(
    private formBuilder: FormBuilder,
    public errorHandler: ErrorHandlerService,
    public service: InventoryTransactionService,
    public dropdownservice: DropdownService,
    public menuService: MenuService,
    private utility: UtilityService
  ) {
    if (localStorage.getItem('isAdmin') == 'true') {
    } else {
      let acc = this.menuService.checkUserSubMenuViewRights(
        'Inventory Transactions'
      );
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
    }
  }

  ngOnInit(): void {
    this.onInitForm();
    this.GetBranch();
  }
  onSortChange(sort: SortDescriptor[]) {
    this.sort = sort;
    // this.corrections = orderBy(this.corrections, sort);
    // this.loadPipelinecorrectData();
  }

  GetBranch() {
    this.dropdownservice.GetBranchList().subscribe(
      (res) => {
        if (res) {
          this.branchList = res.sort((a, b) => a.value.localeCompare(b.value));
          var index = this.branchList.findIndex((c) => c.value == 'SSG');
          this.branchList.splice(index, 1);
          this.branchList.unshift({ code: 'All', id: 0, value: 'All' });
          this.branchList = this.branchList;
          this.inventoryTransactionForm.controls['branch'].setValue(
            this.branchList[0].code
          );
        }
      },
      (error) => this.onError(error, ErrorMessages.drop_down.branch_list)
    );
  }

  onInitForm() {
    var x = new Date();
    x.setDate(x.getDate() - 30);
    this.inventoryTransactionForm = this.formBuilder.group({
      dateRange: '30',
      from: x,
      to: new Date(),
      filter: 'All',
      sort: 'asc',
      branch: 'All',
    });
  }

  onHandlePrint() {
    console.log(this.inventoryTransactionForm);
    var formValues = this.inventoryTransactionForm.value;
    this.service
      .ExportToExcelInventoryTransactionView(
        formValues.from.toLocaleDateString('en-US'),
        formValues.to.toLocaleDateString('en-US'),
        formValues.branch,
        formValues.filter,
        formValues.sort
      )
      .subscribe(
        (res) => {
          let data = new Blob([res], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;',
          });
          fileSaver.saveAs(data, 'InventoryInformationReport.xlsx');
        },
        (error) => {
          this.onError(
            error,
            ErrorMessages.inventory_transfer_report
              .download_inventory_transfer_data
          );
        }
      );
  }
  private onError(error: any, customMessage?: string) {
    this.errorHandler.handleError(
      error,
      ModuleNames.inventory_transfer_report,
      customMessage
    );
  }
  onDateRangeRadioChange(value) {
    this.inventoryTransactionForm.controls['dateRange'].setValue(value);
    switch (value) {
      case '30':
        this.setDate('30');
        break;
      case '60':
        this.setDate('60');
        break;
      case '90':
        this.setDate('90');
        break;
      case 'ytd':
        var x = new Date();
        var x1 = new Date();
        this.inventoryTransactionForm.controls['to'].setValue(x);
        x1.setMonth(0);
        x1.setDate(1);
        debugger;
        this.inventoryTransactionForm.controls['from'].setValue(x1);
        this.disableToDate = true;
        this.disableFromDate = true;
        break;
      default:
        this.disableToDate = false;
        this.disableFromDate = false;
        break;
    }
  }
  onSortingRadioChange(value) {
    this.inventoryTransactionForm.controls['sort'].setValue(value);
  }
  setDate(value) {
    var y = new Date();
    var z = new Date();
    this.inventoryTransactionForm.controls['to'].setValue(y);
    z.setDate(z.getDate() - value);
    this.inventoryTransactionForm.controls['from'].setValue(z);
    this.disableToDate = true;
    this.disableFromDate = true;
  }
}
