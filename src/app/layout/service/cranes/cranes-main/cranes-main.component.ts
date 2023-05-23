import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TimeSelectorComponent } from '@progress/kendo-angular-dateinputs';
import { orderBy, process, SortDescriptor } from '@progress/kendo-data-query';
import { DataService } from 'src/app/core/services';
import { DropdownService } from 'src/app/core/services/dropdown.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { branchData, cranesColumns, cranesData } from 'src/data/cranes-data';
import { CraneActivityComponent } from '../crane-activity/crane-activity.component';
import { CraneInfoComponent } from '../crane-info/crane-info.component';
import { CraneNotesComponent } from '../crane-notes/crane-notes.component';
import { CraneHistoryComponent } from '../crane-history/crane-history.component';
import { craneTabs } from '../../../../../app/core/models/enum-model';
import { MenuService } from 'src/app/core/helper/menu.service';

@Component({
  selector: 'app-cranes-main',
  templateUrl: './cranes-main.component.html',
  styleUrls: ['./cranes-main.component.scss'],
})
export class CranesMainComponent implements OnInit {
  @ViewChild(CraneInfoComponent) info: CraneInfoComponent;
  @ViewChild(CraneActivityComponent) activity: CraneActivityComponent;
  @ViewChild(CraneNotesComponent) notes: CraneNotesComponent;
  @ViewChild(CraneHistoryComponent) history: CraneHistoryComponent;
  cranesForm: FormGroup;
  isDisable: boolean = false;
  isDisabledCraneVehicle: boolean = false;
  selectedAction: string = '';
  sort: SortDescriptor[] = [];
  selections: any = [];
  skip: number = 0;
  multiple: any = [];
  isCreatable: boolean = false;
  isEditable: boolean = false;
  selectable: boolean = true;
  cranes: any = [];
  cranesSort: SortDescriptor[] = [];
  cranesSelection: number[] = [0];
  branch_filter_btn: string = 'All';
  isBranchVisible: boolean = false;
  allBranches: any = [];
  branches: any = [];
  cranecolumns: any = [];
  disableCranes: boolean = true;

  confirm_title: string = '';
  confirm_message: string = '';
  isConfirmDialogVisible: boolean = false;
  filterForm: FormGroup;
  // notes: any = [];
  histories: any = [];
  annualInspections: any = [];
  monthlyInspections: any = [];
  branchColumns: any = [
    {
      Name: 'code',
      isCheck: true,
      Text: 'Branch',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'value',
      isCheck: true,
      Text: 'Branch',
      isDisable: false,
      index: 0,
      width: 100,
    },
  ];
  selectedCrane: any = null;
  tabs = craneTabs;
  selectedTab: string = this.tabs.craneInfo;
  isTab1: boolean = false;
  isTab2: boolean = false;
  isTab3: boolean = false;
  isTab4: boolean = false;
  isAdd: boolean = false;
  isEdit: boolean = false;
  isDisabled: boolean = true;
  isCancel: boolean = true;
  isSave: boolean = true;
  branchfullName: string = 'All';
  isActiveDisabled: boolean = true;
  vehicleNumberValue: string = 'N/A';
  tempId: any = '';
  craneNumbersort: SortDescriptor[] = [
    {
      field: 'craneNumber',
      dir: 'desc',
    },
  ];
  branchFilter: string = '';
  constructor(
    private formBuilder: FormBuilder,
    private dropdownService: DropdownService,
    private dataService: DataService,
    public menuService: MenuService,
    private utilityService: UtilityService
  ) {
    this.cranecolumns = cranesColumns;
    if (localStorage.getItem('isAdmin') == 'true') {
      this.isTab1 = false;
      this.isTab2 = false;
      this.isTab3 = false;
      this.isTab4 = false;
    } else {
      let acc = this.menuService.checkUserViewRights('Cranes');
      if (acc) {
        //this.utils.toast.error("User does not have rights to access " + name + " module.");Z
      } else {
        this.utilityService.toast.error(
          'You do not have permissions to access this part of the system. Please contact your supervisor so they can request them from IT.'
        );
        setTimeout(() => {
          var url = '/dashboard';
          location.href = url;
        }, 1000);
      }
      this.menuService.checkUserBySubmoduleRights('Crane Info');
      const rights = JSON.parse(localStorage.getItem('Rights'));
      this.isTab1 = !rights.some(
        (c) =>
          c.subModuleName == 'Crane Info' &&
          c.moduleName == 'Cranes' &&
          c.tabName == 'VIEW'
      );
      this.isTab2 = !rights.some(
        (c) =>
          c.subModuleName == 'Activity' &&
          c.moduleName == 'Cranes' &&
          c.tabName == 'VIEW'
      );
      this.isTab3 = !rights.some(
        (c) =>
          c.subModuleName == 'Notes' &&
          c.moduleName == 'Cranes' &&
          c.tabName == 'VIEW'
      );
      this.isTab4 = !rights.some(
        (c) =>
          c.subModuleName == 'History' &&
          c.moduleName == 'Cranes' &&
          c.tabName == 'VIEW'
      );
    }
  }

  ngOnInit(): void {
    this.onInitForm({});
    this.OnInitFilterForm();
    this.onLoadBranch();
    this.onLoadCranes();
  }
  onResizeColumn(event) {}

  onSelectionChange(event) {
    this.tempId = event.selectedRows[0].dataItem.pk;
    this.selectedCrane = event.selectedRows[0].dataItem;
    // this.onInitForm(event.selectedRows[0].dataItem);
    this.onLoadCraneDetails(this.selectedCrane.pk);
  }

  onReOrderColumns(event) {}

  onDataStateChange(event) {}

  onSortChange(sort: SortDescriptor[]) {
    this.cranesSort = sort;
    this.cranes = orderBy(this.cranes, sort);
  }

  onRowSelect(event, type) {
    switch (type) {
      case 'branch':
        this.filterForm.setValue({
          ...this.filterForm.value,
          branch:
            event.selectedRows?.[0]?.dataItem.code === 'ALL'
              ? ''
              : event.selectedRows?.[0]?.dataItem.code,
        });
        this.branchfullName = event.selectedRows?.[0]?.dataItem.value;
        this.isBranchVisible = !this.isBranchVisible;
        this.onLoadCranes();
        break;
      default:
        break;
    }
  }
  enableButton() {
    if (this.selectedTab === 'Activity') {
      this.isEdit = true;
    } else {
      this.isEdit = false;
    }
    this.isAdd = false;
    this.isCancel = true;
    this.isSave = true;
  }
  disableButton() {
    this.isEdit = true;
    this.isAdd = true;
    this.isCancel = false;
    this.isSave = false;
  }
  onHandleOperation(type) {
    switch (type) {
      case 'new':
        this.isDisable = true;
        if (this.selectedTab === 'Crane Info') {
          this.info.disableCraneVehicle();
        }

        if (this.selectedTab === 'Activity') {
          this.activity.onInitActivityForm({});
        }
        this.disableButton();
        this.selectedAction = 'new';
        this.onInitForm({});
        this.selectable = false;
        this.vehicleNumberValue = '';
        this.isActiveDisabled = true;
        break;
      case 'edit':
        this.disableButton();
        this.isDisable = true;
        this.info.enableCraneVehicle();
        this.selectable = false;
        this.selectedAction = 'edit';
        this.isActiveDisabled = false;
        break;
      case 'cancel':
        this.isDisable = false;
        this.selectable = true;
        this.enableButton();
        if (this.selectable == true) {
          this.activity;
        }

        // this.cranesSelection = [0];
        // this.onInitForm(this.cranes[0]);
        // this.vehicleNumberValue = this.cranes[0].vehicleNumber == 0? "N/A": this.cranes[0].vehicleNumber;
        this.onLoadCranes();
        this.selectedAction = '';
        this.isActiveDisabled = true;

        if (this.selectedTab === 'Activity') {
          ``;
          this.activity.onInitActivityForm({});
          this.isEdit = true;
        }

        if (this.selectedTab === 'Crane Info') {
          this.info.disableCraneVehicle();
          this.info.onResetInfo();
          this.info.disableCraneVehicle();
        }
        break;
      case 'save':
        if (this.selectedTab === 'Activity') {
          this.activity.onSaveActivity();
          this.enableButton();
          this.cranesSelection = [...this.cranesSelection];
          this.selectable = true;
        } else {
          let check = this.onCheckValues(this.cranesForm.value);
          if (check) {
            this.onSaveCrane();
            this.enableButton();
          } else {
            this.disableButton();
          }
        }
        break;
      case 'branch':
        this.isBranchVisible = !this.isBranchVisible;
        break;
      case 'folder':
        this.confirm_title = 'Test Environment';
        this.confirm_message = 'Cannot access folder in Test Environment';
        this.isConfirmDialogVisible = true;
        break;
      case 'picture':
        this.confirm_title = 'MDI3.0';
        this.confirm_message = 'No Picture on file for this crane.';
        this.isConfirmDialogVisible = true;
        break;
      case 'confirm':
        this.isConfirmDialogVisible = !this.isConfirmDialogVisible;
        break;
      default:
        break;
    }
  }

  onCheckValues(value) {
    if (!value.branchName) {
      this.confirm_title = 'MDI3.0';
      this.confirm_message = 'Must enter a Branch ';
      this.isConfirmDialogVisible = true;
      return false;
    } else if (!value.craneType) {
      this.confirm_title = 'MDI3.0';
      this.confirm_message = 'Must enter a Crane Type';
      this.isConfirmDialogVisible = true;
      return false;
    }
    // else if (!value.craneNumber) {
    //   this.confirm_title = 'MDI3.0';
    //   this.confirm_message = 'Must enter a Crane';
    //   this.isConfirmDialogVisible = true;
    //   return false;
    // }
    else if (!value.serialNumber) {
      this.confirm_title = 'MDI3.0';
      this.confirm_message = 'Must enter a Serial Number';
      this.isConfirmDialogVisible = true;
      return false;
    } else if (!value.make) {
      this.confirm_title = 'MDI3.0';
      this.confirm_message = 'Must enter a Make';
      this.isConfirmDialogVisible = true;
      return false;
    } else if (!value.model) {
      this.confirm_title = 'MDI3.0';
      this.confirm_message = 'Must enter a Model';
      this.isConfirmDialogVisible = true;
      return false;
    } else if (!value.location) {
      this.confirm_title = 'MDI3.0';
      this.confirm_message = 'Must enter a Location';
      this.isConfirmDialogVisible = true;
      return false;
    } else if (!value.description) {
      this.confirm_title = 'MDI3.0';
      this.confirm_message = 'Must enter a Description';
      this.isConfirmDialogVisible = true;
      return false;
    } else {
      return true;
    }
  }

  onInitForm(value) {
    this.cranesForm = this.formBuilder.group({
      active: !value?.inactive || false,
      branchCode: value?.branch || '',
      branchName: value?.branchName || '',
      craneType: value?.craneType || '',
      craneNumber: value?.craneNumber || '',
      serialNumber: value?.serialNumber || '',
      make: value?.make || '',
      model: value?.model || '',
      vehicleNumber: value?.vehicleNumber || '',
      description: value?.description || '',
      location: value?.location || '',
      inactiveReason: value?.inactiveReason || '',
      lastAnnual: value?.lastAnnual || '',
      lastMonthly: value?.lastMonthly || '',
    });
  }

  OnInitFilterForm() {
    this.filterForm = this.formBuilder.group({
      branch: '',
      status: true,
      searchText: '',
    });
  }

  onLoadBranch() {
    this.dropdownService.GetBranchList().subscribe((result) => {
      this.branches = this.allBranches = [
        { code: 'ALL', value: 'All' },
        ...result,
      ];
    });
  }

  onLoadCranes() {
    this.dataService
      .post('Crane/List', this.filterForm.value)
      .subscribe((result) => {
        this.cranes = result;
        if (this.tempId != '') {
          this.cranesSelection =
            this.cranes.findIndex((x) => x.pk == this.tempId) == -1
              ? [0]
              : [this.cranes.findIndex((x) => x.pk == this.tempId)];
          this.selectedCrane =
            this.cranes.filter((x) => x.pk == this.tempId).length > 0
              ? this.cranes.filter((x) => x.pk == this.tempId)[0]
              : this.cranes[0];
          this.tempId = this.selectedCrane.pk;
          this.onLoadCraneDetails(this.selectedCrane.pk);
        } else {
          this.selectedCrane = result[0];
          this.cranesSelection = [0];
          this.tempId = this.selectedCrane.pk;
          // this.onInitForm(result[0]);
          this.onLoadCraneDetails(this.selectedCrane.pk);
        }
      });
  }

  onSearchBranch(value) {
    this.branchFilter = value;
    if (!value) {
      this.branches = this.allBranches;
    } else {
      this.branches = process(this.branches, {
        filter: {
          logic: 'or',
          filters: [
            {
              field: 'value',
              operator: 'contains',
              value: value,
            },
            {
              field: 'code',
              operator: 'contains',
              value: value,
            },
          ],
        },
      }).data;
    }
  }

  onStatusChange(value) {
    this.filterForm.setValue({ ...this.filterForm.value, status: value });
    this.onLoadCranes();
  }

  onSearchCranes(event) {
    this.filterForm.setValue({
      ...this.filterForm.value,
      searchText: event,
    });
    this.onLoadCranes();
  }

  onSaveCrane() {
    let formValues = this.cranesForm.value;
    let payload = {
      id: this.selectedAction === 'new' ? 0 : this.selectedCrane.pk,
      userName: JSON.parse(this.utilityService.storage.getItem('currentUser'))
        .userName,
      user_PK: JSON.parse(this.utilityService.storage.getItem('currentUser'))
        .id,
      craneNumber: formValues?.craneNumber,
      craneType: formValues?.craneType,
      description: formValues?.description,
      branch: formValues?.branchCode,
      location: formValues?.location,
      vehicleNumber: formValues?.vehicleNumber,
      make: formValues?.make,
      model: formValues?.model,
      serialNumber: formValues?.serialNumber,
      inactive: !formValues?.active,
      inactiveReason: formValues?.inactiveReason,
    };
    if (this.selectedAction === 'new') {
      this.dataService.post('Crane/info/Add', payload).subscribe((result) => {
        this.utilityService.toast.success(
          'Cranes has been created successfully!'
        );
        this.selectedAction = '';
        this.cranesForm.reset();
        this.tempId = '';
        this.onLoadCranes();
        this.isDisable = false;
        this.info.disableCraneVehicle();
        this.cranesSelection = [0];
        this.selectable = true;
      });
    } else if (this.selectedAction === 'edit') {
      this.dataService
        .patch('Crane/info/Update', payload)
        .subscribe((result: any) => {
          if (result?.status === 200) {
            this.utilityService.toast.success(
              'Cranes has been updated successfully!'
            );
            this.selectedAction = '';
            this.cranesForm.reset();
            this.onLoadCranes();
            this.isDisable = false;
            this.info.disableCraneVehicle();
            this.cranesSelection = [this.cranesSelection[0]];
            this.selectable = true;
            this.isActiveDisabled = true;
          }
        });
    }
  }

  onLoadCraneDetails(id) {
    this.dataService.get(`Crane/Info/Details/${id}`).subscribe((res: any) => {
      if (res?.result) {
        this.onInitForm({
          ...this.selectedCrane,
          lastMonthly: res?.result?.lastMonthly,
          lastAnnual: res?.result?.lastAnnual,
        });
        this.vehicleNumberValue =
          res?.result?.vehicleNumber == '0'
            ? 'N/A'
            : res?.result?.vehicleNumber;
      }
    });
  }

  onTabChange(event) {
    this.selectedTab = event.title;
    if (
      this.selectedTab == 'Activity' ||
      this.selectedTab == 'Notes' ||
      this.selectedTab == 'History'
    ) {
      this.isAdd = false;
      this.isEdit = true;
      this.isCancel = true;
      this.isSave = true;
    } else {
      // this.isAdd=false;
      // this.isEdit=false;
      this.isDisable = false;
      // this.info.DisableCraneVehicle();
      this.selectable = true;
      this.enableButton();
      this.cranesSelection = [this.cranesSelection[0]];
      this.isActiveDisabled = true;
    }
  }

  onLoadData() {
    if (this.selectedTab === this.tabs.craneInfo) {
      this.onLoadCraneDetails(this.selectedCrane.pk);
    } else if (this.selectedTab === this.tabs.activity) {
      // this.activity.onLoadAnnualInspection();
      // this.activity.onLoadMonthlyInspection();
    } else if (this.selectedTab === this.tabs.notes) {
      // this.notes.onLoadNotes();
    } else if (this.selectedTab === this.tabs.history) {
      // this.history.onLoadHistory();
    }
  }

  generateNewCraneNumber(lastCraneNumber: string) {
    var newCraneNumber = Number(lastCraneNumber.split('C')[1]) + 1;
    var len = 3 - ('' + newCraneNumber).length;
    var z = (len > 0 ? new Array(++len).join('0') : '') + newCraneNumber;
    return 'C' + z;
  }
}
