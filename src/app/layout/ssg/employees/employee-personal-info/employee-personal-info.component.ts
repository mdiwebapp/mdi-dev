import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SortDescriptor } from '@progress/kendo-data-query';
import { thumbnailsUpIcon } from '@progress/kendo-svg-icons';
import { event } from 'jquery';
import { stateData } from 'src/data/employee-data';

@Component({
  selector: 'app-employee-personal-info',
  templateUrl: './employee-personal-info.component.html',
  styleUrls: ['./employee-personal-info.component.scss'],
})
export class EmployeePersonalInfoComponent implements OnInit {
  sort: SortDescriptor[] = [];
  selections: any = [];
  skip: number = 0;
  multiple: any = [];
  @Input() employee: FormGroup;
  @Input() disableEmployee: boolean;
  @Output('onSaveForm') onSaveForm: EventEmitter<any> = new EventEmitter();
  isAddressDialogVisible: boolean = false;
  isContactDialogVisible: boolean = false;
  isDateVisible: boolean = false;
  date_btn: string;
  linceState_btn: string;
  rehireDate_btn: string;
  linceState: any = [];
  isStateVisible: any = false;
  states: any = [];
  isLinceStateVisible: boolean = false;
  isRehireDateVisible: boolean = false;
  isMaritalStatusVisible: boolean = false;
  isgenderVisible: boolean = false;
  isVeteranStatusVisible: boolean = false;
  isRaceVisible: boolean = false;
  addressForm: FormGroup;
  open = false;

  maritalStatus: any = [
    {
      label: 'D-Divorced',
      value: 'D',
    },
    {
      label: 'M-Married',
      value: 'M',
    },
    {
      label: 'S-Single',
      value: 'S',
    },
    {
      label: 'W-Widowed',
      value: 'W',
    },
  ];
  gender: any = [
    {
      label: 'Male',
      value: 'M',
    },
    {
      label: 'Female',
      value: 'F',
    },
  ];
  veteranStatus: any = [
    {
      label: 'Other Veteran',
      value: 'other veteran',
    },
    {
      label: 'Special Disabled Vet',
      value: 'special disabled vet',
    },
  ];
  race: any = [
    {
      label: 'American Indian/Alaskan Native',
      value: 'american indian/alaskan native',
    },
    {
      label: 'Asian/Pacific Islander',
      value: 'Asian/Pacific Islander',
    },
    {
      label: 'Black',
      value: 'black',
    },
    {
      label: 'Hispanic',
      value: 'Hispanic',
    },
    {
      label: 'White',
      value: 'white',
    },
  ];

  constructor(private formBuilder: FormBuilder) {
    this.states = stateData;
  }
  close() {
    this.open = false;
  }
  ngOnInit(): void {
    this.onInitAddressForm(this.employee);
  }
  onResizeColumn(event) {}

  onSortChange(event) {}

  onReOrderColumns(event) {}

  onDataStateChange(event) {}

  onSelectionChange(type, event) {
    switch (type) {
      case 'marital_status':
        this.employee.setValue({
          ...this.employee.value,
          maritalStatus: event,
        });
        this.isMaritalStatusVisible = !this.isMaritalStatusVisible;
        break;
      case 'gender':
        this.employee.setValue({
          ...this.employee.value,
          gender: event,
        });
        this.isgenderVisible = !this.isgenderVisible;
        break;
      case 'veteran_statusdata':
        this.employee.setValue({
          ...this.employee.value,
          veteranStatus: event,
        });
        this.isVeteranStatusVisible = !this.isVeteranStatusVisible;
        break;
      case 'race':
        this.employee.setValue({
          ...this.employee.value,
          race: event,
        });
        this.isRaceVisible = !this.isRaceVisible;
        break;
      default:
        break;
    }
  }

  onHandleFilters(value) {
    switch (value) {
      case 'state':
        this.isStateVisible = !this.isStateVisible;
        break;
      case 'rehireDate':
        this.isRehireDateVisible = !this.isRehireDateVisible;
        break;
      default:
        break;
    }
  }

  onRowSelect(event, type) {
    switch (type) {
      case 'state':
        if (this.isAddressDialogVisible) {
          this.employee.setValue({
            ...this.employee.value,
            state: event.selectedRows[0].dataItem.name,
          });
        } else {
          this.employee.setValue({
            ...this.employee.value,
            licenseState: event.selectedRows[0].dataItem.name,
          });
        }
        // this.linceState_btn = event.selectedRows[0].dataItem.type;
        this.isStateVisible = false;
        break;
      default:
        break;
    }
  }

  onHandleOperation(type, event = null) {
    switch (type) {
      case 'address':
        this.isAddressDialogVisible = !this.isAddressDialogVisible;
        break;
      case 'contact':
        this.isContactDialogVisible = !this.isContactDialogVisible;
        break;
      case 'save_address':
        // this.onSaveForm.emit();
        this.isAddressDialogVisible = false;
        this.isContactDialogVisible = false;
        break;
      case 'rehire_date':
        this.employee.setValue({
          ...this.employee.value,
          rehireDate: event,
        });
        break;
      case 'date':
        this.employee.setValue({
          ...this.employee.value,
          dob: event,
        });
        break;
      case 'marital_status':
        this.isMaritalStatusVisible = !this.isMaritalStatusVisible;
        break;
      case 'gender':
        this.isgenderVisible = !this.isgenderVisible;
        break;
      case 'veteran_status':
        this.isVeteranStatusVisible = !this.isVeteranStatusVisible;
        break;
      case 'race':
        this.isRaceVisible = !this.isRaceVisible;
        break;
      default:
        break;
    }
  }

  onInitAddressForm(form) {
    this.addressForm = this.formBuilder.group({
      address: form?.address || '',
      state: form?.state || '',
      city: form?.city || '',
      zipcode: form?.zipcode || '',
      phone: form?.phone || '',
      emergencyContact: form?.emergencyContact || '',
      relationship: form?.relationship || '',
      maritalStatus: form?.matmaritalStatus || '',
    });
  }

  copyContent() {
    window.open(
      'https://www.google.com/maps?q=loc:' + this.employee.get('address').value,
      '_blank'
    );
  }
}
