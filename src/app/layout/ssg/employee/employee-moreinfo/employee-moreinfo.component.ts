import { process } from '@progress/kendo-data-query';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { EmployeeMoreInfoModel } from './employee-moreinfo.model';
import { EmployeeMoreinfoService } from './employee-moreinfo.service';
import { UtilityService } from '../../../../../../src/app/core/services/utility.service';
import { CustomAddress } from '../../../../../../src/app/layout/ssg/google-map-address/address.model';
import { DropdownService } from '../../../../../../src/app/core/services/dropdown.service';
import {
  ModuleNames,
  ErrorMessages,
} from '../../../../../../src/app/core/constant';
import { ErrorHandlerService } from '../../../../../../src/app/core/services';
import { stateData } from 'src/data/employee-data';
import { DatePipe } from '@angular/common';
import { MenuService } from 'src/app/core/helper/menu.service';

@Component({
  selector: 'app-employee-moreinfo',
  templateUrl: './employee-moreinfo.component.html',
  styleUrls: ['./employee-moreinfo.component.scss'],
})
export class EmployeeMoreinfoComponent implements OnInit {
  @Output() SaveEditClick = new EventEmitter<number>();
  @Input() onChange;
  form: FormGroup;
  id: number = 0;
  isDisabled: boolean = true;
  isSSNRight: boolean = false;
  isLicenseRight: boolean = false;
  states: any = [];
  constructor(
    private formBuilder: FormBuilder,
    public service: EmployeeMoreinfoService,
    private utils: UtilityService,
    public dropdownservice: DropdownService,
    public errorHandler: ErrorHandlerService,
    public menuService: MenuService,
    public datepipe: DatePipe
  ) {
    this.menuService.checkUserBySubmoduleRights('Personal Details');
  
    this.isSSNRight = this.menuService.isSSNRight;
    this.isLicenseRight = this.menuService.isLicenseRight;
    this.states = stateData;
  }
  employee: EmployeeMoreInfoModel;
  isAdd: boolean = false;
  isSave: boolean = true;
  isCancel: boolean = true;
  RehireDateisDisabled: boolean = true;
  EContactDisable: boolean = true;
  isEdit: boolean = true;
  employeeId: any;
  SaveChange: BehaviorSubject<any> = new BehaviorSubject(null);
  fullAdressLable: string;
  fullAddress: string;
  isExpanded: boolean = false;
  stateList: any;
  stateData: any;
  isAddressDialogVisible: boolean = false;
  isContactDialogVisible: boolean = false;
  isMaritalStatusVisible: boolean = false;
  isgenderVisible: boolean = false;
  isVeteranStatusVisible: boolean = false;
  isRaceVisible: boolean = false;
  isStateVisible: boolean = false;
  isRehireDateVisible: boolean = false;
  selections: any = [];
  disableButton: boolean = true;
  disableDateButton: boolean = true;
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
      value: 'A',
    },
    {
      label: 'Asian/Pacific Islander',
      value: 'I',
    },
    {
      label: 'Black',
      value: 'B',
    },
    {
      label: 'Hispanic',
      value: 'H',
    },
    {
      label: 'White',
      value: 'W',
    },
  ];
  public viewColumns = [
    {
      Name: 'value',
      isCheck: true,
      Text: 'State',
      isDisable: false,
      index: 0,
      width: 50,
    },
  ];
  source: any;

  linceState_btn: string;
  @Output() dialogOpened: boolean = false;
  @Output() errorMsg: any;
  ngOnInit(): void {
    this.initForm();
    this.GetState();
    // this.onChange.subscribe(res => {
    //   if (res != null && res.type == 'add') {

    //   }
    //   else
    //     this.editClick(res);

    // });
    this.form.disable();
  }
  initForm(): void {
    this.form = this.formBuilder.group({
      id: [0],
      ssNumber: [null, Validators.required],
      driversLicenseNumber: [null],
      licenseState: [null],
      birthDate: [null],
      address: [null, Validators.required],
      address2: [null],
      state: [null],
      city: [null],
      zipCode: [null,[Validators.required, Validators.maxLength(10)]],
      homePhone: [null, Validators.required],
      inactive: [null],
      email: [null, Validators.required],
      maritalStatus: [null],
      gender: [null],
      veteranStatus: [null],
      race: [null],
      emergencyContact: [null],
      relationship: [null],
      phone: [null],
      dob: [null, Validators.required],
      rehireDate: [null],
      emergencyPhone: [null],
    });
  }
  GetState() {
    this.dropdownservice.GetLookupList('States').subscribe(
      (res) => {
        if (res) {
          this.source = res;
          this.stateList = res.sort((a, b) => a.value.localeCompare(b.value));
          this.stateData = res.sort((a, b) => a.value.localeCompare(b.value));
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.drop_down.states);
      }
    );
  }

  onSave(formdata, active) {
    if (this.form.invalid) {
      this.form.markAllAsTouched(); 
      if ( this.form.value.zipCode === ' ' || this.form.value.zipCode === null || this.form.value.zipCode.length > 10) {
        this.isExpanded = !this.isExpanded;
      }
      return true;
    }
    const data = this.form.value;
    data.firstName = formdata.sData.firstName;
    data.lastName = formdata.sData.lastName;
    data.emergencyRelationship = this.form.value.relationship;
    data.startdate = this.datepipe.transform(
      formdata.sData.startDate,
      'MM/dd/yyyy'
    );
    var rehireDateData = this.form?.value?.rehireDate;
    data.rehireDate = this.datepipe.transform(rehireDateData, 'MM/dd/yyyy');
    var dob = this.form?.value?.dob;
    data.birthDate = this.datepipe.transform(dob, 'MM/dd/yyyy');
    data.inactive = active;
    if (this.id == null || this.id == 0) data.id = 0;
    else data.id = this.id;
    //data.workInfo = [];
    this.service.save(data).subscribe(
      (res) => {
        if (res['status'] == 200) {
          this.utils.toast.success(res['message']);
          this.disbaleBtn();
          this.form.disable();
          this.isDisabled = true;
          this.RehireDateisDisabled = true;
          this.isEdit = false;
          this.isAdd = false;
          this.isDisabled = true;
          this.isExpanded = false;
          this.EContactDisable = true;
        } else this.utils.toast.error(res['message']);
      },
      (error) => {
        this.onError(error, ErrorMessages.employee.save);
      }
    );
    this.disableButton = true;
  }

  //editClick(data: EmployeeMoreInfoModel) {
  editClick(data: any) {
    if (data) {
      this.id = data.id;
      this.isAdd = false;
      this.isEdit = false;
      this.isSave = true;
      this.isCancel = true;
      this.isDisabled = true;
      this.form.disable();
      this.setValue(data);
    }
  }

  setValue(data: EmployeeMoreInfoModel) {
    //this.employeeId = data.id;
    // this.form.controls.firstName.setValue(data.firstName);
    // this.form.controls.lastName.setValue(data.lastName);
    let fulladdarray = [data.address, data.address2, data.city, data.state];
    let zipcode =
      data.zipCode == null || data.zipCode == '' || data.zipCode == undefined
        ? ''
        : '-' + data.zipCode;
    this.fullAdressLable =
      fulladdarray.filter((x) => x != '' && x != null).join(', ') + zipcode;
    let addarray = [data.address]; //, data.city, data.state
    this.fullAddress = addarray.filter(Boolean).join(', '); // + "-" + data.zip;
    this.form.controls.ssNumber.setValue(data.ssNumber);
    this.form.controls.birthDate.setValue(
      data.birthDate != null ? new Date(data.birthDate) : null
    );
    this.form.controls.driversLicenseNumber.setValue(data.driversLicenseNumber);
    this.form.controls.licenseState.setValue(data.licenseState);
    this.form.controls.address.setValue(this.fullAddress);
    this.form.controls.address2.setValue(data.address2);
    this.form.controls.state.setValue(data.state);
    this.form.controls.city.setValue(data.city);
    this.form.controls.zipCode.setValue(data.zipCode);
    this.form.controls.homePhone.setValue(data.homePhone);
    this.form.controls.inactive.setValue(data.inactive);
    this.form.controls.email.setValue(data.workInfo.email);
    this.form.controls.dob.setValue(
      this.datepipe.transform(data.birthDate, 'MM/dd/yyyy')
    );
    this.form.controls.rehireDate.setValue(
      this.datepipe.transform(data.workInfo.rehireDate, 'MM/dd/yyyy')
    );
    this.form.controls.maritalStatus.setValue(data.workInfo.maritalStatus);
    this.form.controls.gender.setValue(data.workInfo.gender);
    this.form.controls.veteranStatus.setValue(data.workInfo.veteranStatus);
    this.form.controls.race.setValue(data.workInfo.race);
    this.form.controls.emergencyContact.setValue(
      data.workInfo.emergencyContact
    );
    this.form.controls.emergencyPhone.setValue(data.workInfo.emergencyPhone);
    this.form.controls.relationship.setValue(
      data.workInfo.emergencyRelationship
    );
  }

  btnCancel() {
    this.form.reset();
    this.disableButton = true;
    this.RehireDateisDisabled = true;
    this.EContactDisable = true;
    this.isExpanded = false;
    this.isgenderVisible=false;
    this.isVeteranStatusVisible=false;
    this.isRaceVisible=false;
    this.isMaritalStatusVisible=false;
  }
  handleFilterState(inputValue: string): void {
    if (inputValue) {
      this.stateList = process(this.source, {
        filter: {
          logic: 'or',
          filters: [
            {
              field: 'value',
              operator: 'contains',
              value: inputValue,
            },
          ],
        },
      }).data;
    }
    // else {
    //   this.stateList = this.stateList
    // }
  }
  btnAdd() {
    this.enableBtn();
    this.form.reset();
    this.form.enable();
    this.isEdit = true;
    this.id = 0;
    this.disableButton = false;
    this.isDisabled = false;
    this.fullAddress = '';
    this.fullAdressLable = '';
    this.disableDateButton = false;
    this.RehireDateisDisabled = false;
    this.EContactDisable = false;
  }

  btnEdit() {
    this.form.enable();
    this.enableBtn();
    this.isEdit = true;
    this.isDisabled = false;
    this.disableButton = false;
    this.RehireDateisDisabled = false;
    this.EContactDisable = false;
  }

  enableBtn() {
    this.isSave = false;
    this.isCancel = false;
  }
  disbaleBtn() {
    this.isSave = true;
    this.isCancel = true;
  }
  GetAddress(data: CustomAddress) {
    if (data.flag) {
      this.form.patchValue({
        address: '',
        address2: '',
        city: '',
        state: '',
        zip: '',
      });
      let zipcode =
        data.postalcode == null ||
        data.postalcode == '' ||
        data.postalcode == undefined
          ? ''
          : '-' + data.postalcode;
      let fulladdarray = [data.address1, data.address2, data.city, data.state];
      this.fullAdressLable =
        fulladdarray.filter((x) => x != '' && x != null).join(', ') + zipcode;
      let addarray = [data.address1, data.address2]; //, data.city, data.state
      this.fullAddress = addarray.join(', '); // + "-" + data.postalcode;
      this.form.patchValue({
        address: this.fullAddress != undefined ? this.fullAddress : '',
        // address2: data.address2 != undefined ? data.address2 : "",
        city: data.city != undefined ? data.city : '',
        state: data.state != undefined ? data.state : '',
        zip: data.state != undefined ? data.postalcode : '',
      });
    } else {
      let olddata = this.form.value;
      this.form.patchValue({
        address: data.address1 != undefined ? data.address1 : '',
      });

      let fulladdarray = [
        data.address1,
        olddata.address2,
        olddata.city,
        olddata.state,
      ];
      this.fullAdressLable = fulladdarray.join(', ') + '-' + olddata.zip;
      let addarray = [data.address1, data.address2];
      if (
        data.address2 != '' &&
        data.address2 != undefined &&
        data.address2 != null
      )
        this.fullAddress = addarray.join(', ');
      else this.fullAddress = data.address1;
    }
    this.form.markAsDirty();
  }

  private onError(error: any, customMessage?: string) {
    this.errorHandler.handleError(
      error,
      ModuleNames.employee_more_info,
      customMessage
    );
  }
  copyContent() {
    window.open(
      'https://www.google.com/maps?q=loc:' + this.form.get('address').value,
      '_blank'
    );
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
        this.form.setValue({
          ...this.form.value,
          rehireDate: event,
        });
        break;
      case 'date':
        this.form.setValue({
          ...this.form.value,
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
  onSelectionChange(type, event) {
    switch (type) {
      case 'marital_status':
        this.form.setValue({
          ...this.form.value,
          maritalStatus: event,
        });
        this.isMaritalStatusVisible = !this.isMaritalStatusVisible;
        break;
      case 'gender':
        this.form.setValue({
          ...this.form.value,
          gender: event,
        });
        this.isgenderVisible = !this.isgenderVisible;
        break;
      case 'veteran_statusdata':
        this.form.setValue({
          ...this.form.value,
          veteranStatus: event,
        });
        this.isVeteranStatusVisible = !this.isVeteranStatusVisible;
        break;
      case 'race':
        this.form.setValue({
          ...this.form.value,
          race: event,
        });
        this.isRaceVisible = !this.isRaceVisible;
        break;
      default:
        break;
    }
  }
  onResizeColumn(event) {}

  onSortChange(event) {}

  onReOrderColumns(event) {}

  onDataStateChange(event) {}

  onRowSelect(event, type) {
    switch (type) {
      case 'state':
        this.form.controls['licenseState'].setValue(
          event.selectedRows[0].dataItem.value
        );
        this.isStateVisible = !this.isStateVisible;
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
  statehandleFilter(value) {
    this.stateList = this.stateData.filter(
      (s) => s.value.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }
}
