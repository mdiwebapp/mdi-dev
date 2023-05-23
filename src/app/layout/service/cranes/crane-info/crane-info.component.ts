import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataService } from 'src/app/core/services';
import { process, SortDescriptor } from '@progress/kendo-data-query';
import { DropdownService } from 'src/app/core/services/dropdown.service';

import { vehicleData } from 'src/data/cranes-data';

@Component({
  selector: 'app-crane-info',
  templateUrl: './crane-info.component.html',
  styleUrls: ['./crane-info.component.scss'],
})
export class CraneInfoComponent implements OnInit, OnChanges {
  @Input() cranes: FormGroup;
  @Input() disableCranes: boolean;
  @Input() branches: any = [];
  @Input() craneType: any = [];
  @Input() vehicleNumberValue: any;
  @Input() disabledCranesVehicle: boolean;
  sort: SortDescriptor[] = [];
  selections: any = [];
  skip: number = 0;
  multiple: any = [];
  isBranchVisible: boolean = false;
  isCraneVisible: boolean = false;
  isMakeVisible: boolean = false;
  isCraneTypeVisible: boolean = false;
  isSerialVisible: boolean = false;
  isModelVisible: boolean = false;
  isVehicleVisible: boolean = false;
  vehicle: any = [];
  vehicle_btn: string;

  craneTypes: any = [
    {
      label: 'Fixed OverHead',
      value: 'Fixed OverHead',
    },
    {
      label: 'Jib',
      value: 'Jib',
    },
    {
      label: 'Mounted Mobile Jib',
      value: 'Mounted Mobile Jib',
    },
    {
      label: 'Portable Gantry',
      value: 'Portable Gantry',
    },
  ];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.cranes.value.branchCode) {
      this.onLoadVehicle(this.cranes.value.branchCode);
    }
  }

  onSelectionChange(event, type) {
    switch (type) {
      case 'branch':
        this.cranes.setValue({
          ...this.cranes.value,
          branchName: event.value,
          branchCode: event.code,
        });
        this.disabledCranesVehicle = false;
        this.onLoadVehicle(event.code);
        this.isBranchVisible = !this.isBranchVisible;
        break;
      case 'crane_type':
        this.cranes.setValue({
          ...this.cranes.value,
          craneType: event,
        });
        this.isCraneTypeVisible = !this.isCraneTypeVisible;
        break;
      case 'vehicle':
        this.cranes.setValue({
          ...this.cranes.value,
          vehicleNumber: event.selectedRows[0].dataItem.vehicleNumber,
        });
        this.vehicleNumberValue =
          event.selectedRows[0].dataItem.vehicleNumber == '0'
            ? 'N/A'
            : event.selectedRows[0].dataItem.vehicleNumber;
        this.isVehicleVisible = false;
        break;
      default:
        break;
    }
  }

  onHandleOperation(type, event = null) {
    switch (type) {
      case 'branch':
        this.isBranchVisible = !this.isBranchVisible;
        break;
      case 'crane':
        this.isCraneVisible = !this.isCraneVisible;
        break;
      case 'make':
        this.isMakeVisible = !this.isMakeVisible;
        break;
      case 'cranetype':
        this.isCraneTypeVisible = !this.isCraneTypeVisible;
        break;
      case 'serial':
        this.isSerialVisible = !this.isSerialVisible;
        break;
      case 'model':
        this.isModelVisible = !this.isModelVisible;
        break;
      case 'vehicle':
        this.isVehicleVisible = !this.isVehicleVisible;
        break;
      default:
        break;
    }
  }

  onResizeColumn() {}

  onSortChange() {}

  onReOrderColumns() {}

  onDataVehicleChange() {}

  onLoadVehicle(branch) {
    this.dataService
      .post(`DropDown/Crane/Info/VehicleNumber/${branch}`, {})
      .subscribe((result) => {
        this.vehicle = result;
      });
  }

  onResetInfo() {
    this.isBranchVisible = false;
    this.isCraneVisible = false;
    this.isMakeVisible = false;
    this.isCraneTypeVisible = false;
    this.isSerialVisible = false;
    this.isModelVisible = false;
    this.isVehicleVisible = false;
  }

  disableCraneVehicle() {
    this.disabledCranesVehicle = true;
  }

  enableCraneVehicle() {
    this.disabledCranesVehicle = false;
  }
}
