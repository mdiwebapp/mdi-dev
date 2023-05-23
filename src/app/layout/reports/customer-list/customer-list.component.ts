import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ErrorMessages, ModuleNames } from 'src/app/core/constant';
import { ErrorHandlerService } from 'src/app/core/services';
import { DropdownService } from 'src/app/core/services/dropdown.service';
import { BranchService } from '../../admin/branch/branch.service';
import { CustomerListService } from '../customer-list/customer-list.service';
import * as fileSaver from 'file-saver';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss'],
})
export class CustomerListComponent implements OnInit {
  customerListForm: FormGroup;
  customerTypes: any = [];
  tempcustomerTypes: any = [];

  branches: any = [];
  tempbranches: any = [];

  accountManagers: any = [];
  tempaccountManagers: any = [];
  opened:boolean;
  constructor(
    private formBuilder: FormBuilder,
    private customerListService: CustomerListService,
    private branchService: BranchService,
    private dropdownService: DropdownService,
    public errorHandler: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.GetCustTypeList();
    this.GetBranch();
    this.getAccountManager();
  }

  initForm(): void {
    this.customerListForm = this.formBuilder.group({
      customerType: 'All',
      branch: '%',
      accountManager: '%',
    });
  }
  viewReport() {
    let customerType = this.customerListForm.value.customerType;
    if(customerType == 'All')
    {
      this.customerListForm.value.customerType = '%';
    }
    this.customerListService
      .ExportToExcelCRMCustList(this.customerListForm.value)
      .subscribe(
        (res) => {
          if(res != null)
          {
            let data = new Blob([res], {
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;',
            });
            fileSaver.saveAs(data, 'CRMCustList.xlsx');
          }
          else
          {
            this.opened = true;
          }
          

        },
        (error) => {
          this.onError(
            error,
            ErrorMessages.crmCustList.download_crmcustlist_data
          );
        }
      );
  }
  GetBranch() {
    this.branchService.GetBranchDropdown().subscribe(
      (res) => {
        if (res) {
          this.branches = res;

          var index = this.branches.findIndex((c) => c.value == 'SSG');
          this.branches.splice(index, 1);
          this.branches.unshift({ code: '%', id: 0, value: 'All' });
          this.branches = this.branches;
          this.tempbranches = res;
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.branch.dropdown);
      }
    );
  }
  private onError(error: any, customMessage?: string) {
    this.errorHandler.handleError(error, ModuleNames.transfer, customMessage);
  }
  getAccountManager() {
    this.dropdownService.GetEmployee().subscribe(
      (result) => {
        if (result?.result?.length) {
          this.accountManagers = [
            {
              eeid: 0,
              email: null,
              emergencyContact: null,
              emergencyPhone: null,
              homePhone: null,
              id: 1,
              name: 'All',
              value: '%',
            },
            {
              eeid: 0,
              email: null,
              emergencyContact: null,
              emergencyPhone: null,
              homePhone: null,
              id: 1,
              name: 'InActive',
              value: 'INACTIVE',
            },
            {
              eeid: 0,
              email: null,
              emergencyContact: null,
              emergencyPhone: null,
              homePhone: null,
              id: 1,
              name: 'None',
              value: 'NONE',
            },
            ...result?.result,
          ];
          this.tempaccountManagers = [
            {
              eeid: 0,
              email: null,
              emergencyContact: null,
              emergencyPhone: null,
              homePhone: null,
              id: 1,
              name: 'All',
              value: '%',
            },
            {
              eeid: 0,
              email: null,
              emergencyContact: null,
              emergencyPhone: null,
              homePhone: null,
              id: 1,
              name: 'InActive',
              value: 'INACTIVE',
            },
            {
              eeid: 0,
              email: null,
              emergencyContact: null,
              emergencyPhone: null,
              homePhone: null,
              id: 1,
              name: 'None',
              value: 'NONE',
            },
            ...result?.result,
          ];
        } else {
          this.accountManagers = [];
          this.tempaccountManagers = [];
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.drop_down.account_manager_list);
      }
    );
  }

  GetCustTypeList() {
    this.customerListService.GetCRMCustTypeList().subscribe(
      (res) => {
        if (res) {
          this.customerTypes = res;
          this.customerTypes.unshift({ lookUpCode: '%', lookupValue: 'All' });
          this.customerTypes = this.customerTypes;
          this.tempcustomerTypes = res;
          // this.tempcustomerTypes.unshift({
          //   lookUpCode: '%',
          //   // lookupValue: 'All',
          // });
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.drop_down.crm_customer_type);
      }
    );
  }
  customerListFilter(value) {
    this.customerTypes = this.tempcustomerTypes.filter(
      (s) => s.lookupValue.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }
  branchListFilter(value) {
    debugger;
    this.branches = this.tempbranches.filter(
      (s) => s.value.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }
  accountManagersListFilter(value) {
    this.accountManagers = this.tempaccountManagers.filter(
      (s) => s.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }
  openPopup()
  {
    this.opened = !this.opened;
  }

}
