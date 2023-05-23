import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { orderBy, SortDescriptor } from '@progress/kendo-data-query';
import { MenuService } from 'src/app/core/helper/menu.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import {
  // branchcolumns,
  branchData,
  employeeData,
} from '../../../../../data/employee-data';

@Component({
  selector: 'app-employee-info',
  templateUrl: './employee-info.component.html',
  styleUrls: ['./employee-info.component.scss'],
})
export class EmployeeInfoComponent implements OnInit {
  sort: SortDescriptor[] = [];
  selections: any = [];
  skip: number = 0;
  multiple: any = [];
  isCreatable: boolean = false;
  isEditable: boolean = false;
  employeeForm: FormGroup;
  isActiveConfirmation: boolean = false;
  isActiveConfirmed: boolean = false;
  branch_btn: string;
  branches: any = [];
  statuses: any = [
    { label: 'All', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
  ];
  // branchcolumns: any = [];
  isbranchVisible: boolean = false;
  disableEmployee: boolean = true;

  employees: any = [];
  employeesColumns: any = [
    {
      Name: 'name',
      isCheck: true,
      Text: 'Name',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'branch',
      isCheck: true,
      Text: 'Branch',
      isDisable: false,
      index: 0,
      width: 50,
    },
  ];
  employeeSort: SortDescriptor[] = [];
  employeeSelection: number[] = [0];
  isTab1: boolean = false;
  isTab2: boolean = false;
  isTab3: boolean = false;
  isTab4: boolean = false;
  isTab5: boolean = false;
  isTab6: boolean = false;
  isTab7: boolean = false;

  constructor(private formBuilder: FormBuilder, public menuService: MenuService, private utility: UtilityService) {
    this.employees = employeeData;
    this.branches = branchData;
    if (localStorage.getItem('isAdmin') == 'true') {

    } else {
      let acc = this.menuService.checkUserViewRights('Employee');
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

        const rights = JSON.parse(localStorage.getItem('Rights'));

        if (rights) {
          this.isTab1 = !rights.some(
            (c) =>
              c.subModuleName == 'Personal Info' &&
              c.moduleName == 'Employee' &&
              c.tabName == 'VIEW'
          );
          this.isTab2 = !rights.some(
            (c) =>
              c.subModuleName == 'Work Info' &&
              c.moduleName == 'Employee' &&
              c.tabName == 'VIEW'
          );
          this.isTab3 = !rights.some(
            (c) =>
              c.subModuleName == 'PTO/Activity' &&
              c.moduleName == 'Employee' &&
              c.tabName == 'VIEW'
          );
          this.isTab4 = !rights.some(
            (c) =>
              c.subModuleName == 'Notes' &&
              c.moduleName == 'Employee' &&
              c.tabName == 'VIEW'
          );
          this.isTab5 = !rights.some(
            (c) =>
              c.subModuleName == 'History' &&
              c.moduleName == 'Employee' &&
              c.tabName == 'VIEW'
          );
          this.isTab6 = !rights.some(
            (c) =>
              c.subModuleName == 'Certs' &&
              c.moduleName == 'Employee' &&
              c.tabName == 'VIEW'
          );
          this.isTab7 = !rights.some(
            (c) =>
              c.subModuleName == 'Equip' &&
              c.moduleName == 'Employee' &&
              c.tabName == 'VIEW'
          );
        }
        this.menuService.checkUserBySubmoduleRights('Employee');
      }
    }



  }

  ngOnInit(): void {
    this.onInitForm(this.employees[0]);
  }

  onResizeColumn(event) { }

  onSelectionChange(event) {
    this.onInitForm(event.selectedRows[0].dataItem);
  }
  onStatusChange(event) {
    if (!event) {
      this.isActiveConfirmation = true;
    }
  }

  onSortChange(sort: SortDescriptor[]) {
    this.employeeSort = sort;
    this.employees = orderBy(this.employees, sort);
  }

  onReOrderColumns(event) { }

  onDataStateChange(event) { }

  onHandleOperation(type, value = null) {
    switch (type) {
      case 'new':
        this.isCreatable = !this.isCreatable;
        this.isEditable = !this.isEditable;
        this.disableEmployee = false;
        this.onInitForm({});
        break;
      case 'edit':
        this.isCreatable = !this.isCreatable;
        this.isEditable = !this.isEditable;
        this.disableEmployee = false;
        break;
      case 'cancel':
        this.isCreatable = !this.isCreatable;
        this.isEditable = !this.isEditable;
        this.disableEmployee = true;
        break;
      case 'save':
        this.isCreatable = !this.isCreatable;
        this.isEditable = !this.isEditable;
        this.disableEmployee = true;
        break;
      case 'active_confirmation':
        this.isActiveConfirmation = !this.isActiveConfirmation;
        break;
      case 'active_confirmed':
        this.isActiveConfirmation = false;
        this.isActiveConfirmed = !this.isActiveConfirmed;
        break;
      case 'start_date':
        this.employeeForm.setValue({
          ...this.employeeForm.value,
          startDate: value,
        });
        break;
      default:
        break;
    }
  }

  onInitForm(value) {
    this.employeeForm = this.formBuilder.group({
      name: value?.name || '',
      firstName: value?.firstName || '',
      lastName: value?.lastName || '',
      branch: value?.branch || '',
      address: value?.address || '',
      address2: value?.address2 || '',
      city: value?.city || '',
      state: value?.state || '',
      zipcode: value?.zipcode || '',
      email: value?.email || '',
      code: value?.code || '',
      startDate: value?.startDate || '',
      phone: value?.phone || '',
      ss: value?.ss || '',
      license: value?.license || '',
      contact: value?.contact || '',
      dob: value?.dob || '',
      licenseState: value?.licenseState || '',
      maritalStatus: value?.maritalStatus || '',
      gender: value?.gender || '',
      veteranStatus: value?.veteranStatus || '',
      race: value?.race || '',
      rehireDate: value?.rehireDate || '',
      emergencyContact: value?.emergencyContact || '',
      beginning: value?.beginning || '',
      used: value?.used || '',
      relationship: value?.relationship || '',
      account: value?.account || '',
      employer: value?.employer || '',
      department: value?.department || '',
      title: value?.title || '',
      usesMDI: value?.usesMDI || '',
      adp: value?.adp || '',
      accountManager: value?.accountManager || '',
      qbRep: value?.qbRep || '',
      unionLabor: value?.unionLabor || '',
      yardEE: value?.yardEE || '',
      contractLabor: value?.contractLabor || '',
      hourlyEE: value?.hourlyEE || '',
      eVerifyCompleted: value?.eVerifyCompleted || '',
      inactive: value?.inactive || '',
      hourly: value?.hourly || '',
    });
  }

  onSaveForm() { }

  onHandleFilters(type) {
    switch (type) {
      case 'branch':
        this.isbranchVisible = !this.isbranchVisible;
        break;

      default:
        break;
    }
  }

  onRowSelect(event, type) {
    switch (type) {
      case 'branch':
        this.branch_btn = event.selectedRows[0].dataItem.type;
        this.isbranchVisible = false;
        break;

      default:
        break;
    }
  }
}
