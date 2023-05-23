import { Component, OnInit } from '@angular/core';
import { UtilityService } from 'src/app/core/services/utility.service';
import { EmployeeEquipService } from './employee-equip.service';
import { ModuleNames, ErrorMessages } from 'src/app/core/constant';
import { ErrorHandlerService } from 'src/app/core/services';
import { DatePipe } from '@angular/common';
import moment from 'moment';
import { process } from '@progress/kendo-data-query';

@Component({
  selector: 'app-employee-equip',
  templateUrl: './employee-equip.component.html',
  styleUrls: ['./employee-equip.component.scss'],
})
export class EmployeeEquipComponent implements OnInit {
  data: any;
  EquipFilter: any;
  dialogOpened: boolean;
  selectedDoor: any;
  doorValue: any;
  multiple: boolean = false;
  currentDate: any;
  equipCheck: string = null;
  equipmentChackBox: boolean = true;
  deviceIdData: boolean = true;
  isEverifyCalendar: boolean = false;
  doreCodeVisibale: boolean = false;
  isI9DateAlert: boolean = false;
  doorCodeValue: string = '';
  doorCodeTextBoxValue: string = '';
  equipDate: any;
  public selectedDate: Date = new Date();
  isEdit: boolean=false;

  constructor(
    public employeeEquipService: EmployeeEquipService,
    private utils: UtilityService,
    public errorHandler: ErrorHandlerService,
    private datePipe: DatePipe
  ) {
    const newDate = new Date();
    this.equipDate = this.datePipe.transform(newDate, 'MM/dd/yyyy');
  }

  ngOnInit(): void {}
  GetEquip(id) {
    this.employeeEquipService.GetEquipment(id).subscribe(
      (res) => {
        if (res) {
          this.data = res;
          this.EquipFilter = res;
        } else {
          this.data = [];
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.employee.get_equipment);
      }
    );
  }
  slotClickHandler(event) {
    this.equipDate = moment(event.start).format('MM-DD-YYYY');
  }
  onClick(event, dataItem) {
    if (event.target.checked == true) {
      if (
        dataItem.field == 'CLC' ||
        dataItem.field == 'Uniforms' ||
        dataItem.field == 'CreditCard'
      ) {
        this.deviceIdData = false;
        dataItem.dEviceID = 'Yes';
        const newDate = new Date();
        dataItem.issuedDate = this.datePipe.transform(newDate, 'MM/dd/yyyy');
      } else if (dataItem.field == 'FuelCard') {
        dataItem.dEviceID = 'Yes';
      } else if (dataItem.field == 'DoorCode') {
        // event.target.checked == false
        this.doreCodeVisibale = !this.doreCodeVisibale;
      } else {
        return false;
      }
    } else {
      dataItem.issuedDate = null;
      dataItem.dEviceID = null;
      this.equipCheck = null;
      this.currentDate = null;
    }
  }
  onSinglClick(event, dataItem) {
    if (
      dataItem.field == 'Computer' ||
      dataItem.field == 'GateCode' ||
      dataItem.field == 'keys' ||
      dataItem.field == 'Other' ||
      dataItem.field == 'Tablet' ||
      dataItem.field == 'Phone'
    ) {
    } else {
      dataItem.issuedDate = this.equipDate;
    }
  }
  onAssignedClick(event, dataItem) {
    // if(this.isEverifyCalendar == false)
    // {
    // this.isEverifyCalendar = true
    // }
    // else{
    // this.isEverifyCalendar = false
    // this.data.dataItem.issuedDate = this.equipDate
    // }
    // this.isEverifyCalendar = false
    // dataItem.issuedDate = null;
    // this.isEverifyCalendar = true;
  }
  DateConvert(date) {
    if (date != null) return new Date(date);
    // else {
    //   let date = new Date();
    //   return new Date(date);
    // }
  }

  public DoorAction(status) {
    if (status == 'cancel') {
      this.data.find(
        (x) => x.equipment == this.selectedDoor.equipment
      ).equipmentType = '';
    } else {
      debugger;
      this.data.find(
        (x) => x.equipment == this.selectedDoor.equipment
      ).equipmentType = this.doorValue;
    }
    this.dialogOpened = false;
  }

  public open(component, data) {
    if (data.isCheckboxValue) {
      this[component + 'Opened'] = true;
      this.selectedDoor = data;
    }
  }

  public SerializeCheckBoxChange(data) {
    if (data.isCheckboxValue) {
      this.data.find((x) => x.equipment == data.equipment).equipmentType =
        'Yes';
      this.data.find((x) => x.equipment == data.equipment).equipmentAssignDate =
        new Date();
    } else {
      this.data.find((x) => x.equipment == data.equipment).equipmentType = '';
      this.data.find((x) => x.equipment == data.equipment).equipmentAssignDate =
        null;
    }
  }
  getCalendarDate(date) {
    if (moment().isSame(date, 'month')) {
      return moment(date).format('DD');
    } else {
      ('');
    }
  }
  onHandleOperations(type, dataItem) {
    switch (type) {
      case 'everifyCalendar':
        this.isI9DateAlert = true;
        break;
      case 'alertClose':
        this.isI9DateAlert = false;
        this.isEverifyCalendar = true;
        break;
      case 'calanderExit':
        this.isI9DateAlert = false;
        this.isEverifyCalendar = true;
        break;
      case 'calanderCancle':
        this.isI9DateAlert = false;
        this.isEverifyCalendar = true;
        break;
      case 'completeionSelectedDate':
        this.isEverifyCalendar = false;
        // this.isEverifyCalendar = false;
        // this.i9Notes = null;
        // this.isEverifyConfirmVisible = true;
        break;
      case 'doorCodeClose':
        this.doreCodeVisibale = !this.doreCodeVisibale;
        break;
      case 'dooreCodeExit':
        this.doorCodeTextBoxValue = this.doorCodeValue;
        this.doorCodeValue = null;
        this.doreCodeVisibale = !this.doreCodeVisibale;
        break;
      case 'dooreCodeCancel':
        this.doorCodeValue = null;
        this.doreCodeVisibale = !this.doreCodeVisibale;
        break;
    }
  }
  datechange(event) {
    this.selectedDate = event;
  }
  setPrevMonth() {
    this.selectedDate = new Date(
      this.selectedDate.setMonth(this.selectedDate.getMonth() - 1)
    );
  }
  setNextMonth() {
    this.selectedDate = new Date(
      this.selectedDate.setMonth(this.selectedDate.getMonth() + 1)
    );
  }
  public close(component) {
    this[component + 'Opened'] = false;
  }

  onSave() {
    // this.employeeEquipService.SaveEquipList(this.data).subscribe(
    //   (res) => {
    //     if (res) {
    //       if (res['status'] == 200) {
    //         this.utils.toast.success(res['message']);
    //         return false;
    //       }
    //     } else {
    //       this.data = [];
    //     }
    //   },
    //   (error) => {
    //     this.onError(error, ErrorMessages.employee.save_equipment_list);
    //   }
    // );
  }

  private onError(error: any, customMessage?: string) {
    this.errorHandler.handleError(
      error,
      ModuleNames.employee_equip,
      customMessage
    );
  }
  public onFilter(inputValue: string): void {
    this.data = process(this.EquipFilter, {
      filter: {
        logic: 'or',
        filters: [
          {
            field: 'dEviceID',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'field',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'issuedDate',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'type',
            operator: 'contains',
            value: inputValue,
          },
         
        ],
      },
    }).data;
  }
  btnEdit() {
    this.isEdit = true;
  }
  btnCancel() {
    this.isEdit = false;
  }
}
