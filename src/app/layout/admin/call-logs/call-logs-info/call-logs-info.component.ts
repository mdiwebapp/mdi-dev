import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SortDescriptor, process } from '@progress/kendo-data-query';
import { DropdownService } from 'src/app/core/services/dropdown.service';
import { NetworkDirectoryService } from 'src/app/layout/networkdirectory/networkdirectorypage/networkdirectory.service';
import {
  usersData,
  callerTypesData,
  stateData,
} from '../../../../../data/call-logs-data';
import { saveAs } from 'file-saver';
@Component({
  selector: 'app-call-logs-info',
  templateUrl: './call-logs-info.component.html',
  styleUrls: ['./call-logs-info.component.scss'],
})
export class CallLogsInfoComponent implements OnInit, OnChanges {
  adminFilterForm: FormGroup;
  @Input() disable: boolean;
  @Input() selectedLog: any = null;
  @Input() allEmployees: any;
  @Input() stateList: any;
  @Input() form: FormGroup;
  @Input() validation: any;
  @Input() isSaveCallLogs: boolean = false;
  isEmployeeVisible: boolean = false;
  sort: SortDescriptor[] = [];
  selections: any = [];
  skip: number = 0;
  employees: any = usersData;
  tmpemployees: any = [];
  employeeSearch: string = '';
  //stateList = [];
  employeeSelectedData: any;
  emp_btn: any = {
    name: 'Select Employee',
    no: '',
  };
  cc_1_btn: any = {
    name: 'Select Employee',
    no: '',
  };
  cc_2_btn: any = {
    name: 'Select Employee',
    no: '',
  };
  cc_3_btn: any = {
    name: 'Select Employee',
    no: '',
  };
  cc_4_btn: any = {
    name: 'Select Employee',
    no: '',
  };
  currentUserDetail = {
    userName: JSON.parse(localStorage.getItem('currentUser')).userName,
  };
  active_btn: string = '';
  call_type_btn: string = 'Caller Type';
  state_type_btn: string = 'Select State';
  isCallerTypeVisible: boolean = false;
  // callerTypes: any = callerTypesData;
  isStateVisible: boolean = false;
  states: any = stateData;
  columns = [
    {
      Name: 'id',
      isCheck: true,
      Text: 'EE#',
      isDisable: false,
      index: 0,
      width: 50,
    },
    {
      Name: 'value',
      isCheck: true,
      Text: 'Name',
      isDisable: false,
      index: 0,
      width: 100,
    },
  ];
  CallerTypeData: any = [
    {
      label: 'Customer',
      value: 'Customer',
    },
    {
      label: 'Internal',
      value: 'Internal',
    },
    {
      label: 'Pump Rental',
      value: 'Pump Rental',
    },
    {
      label: 'Repair',
      value: 'Repair',
    },
    {
      label: 'Vendor',
      value: 'Vendor',
    },
  ];
  public extraEmployees = [
    {
      eeid: 99999,
      email: '',
      emergencyContact: '',
      emergencyPhone: '',
      homePhone: '',
      id: 99999,
      name: 'ap@mersino.com',
      value: 'ap@mersino.com',
    },
    {
      eeid: 99998,
      email: '',
      emergencyContact: '',
      emergencyPhone: '',
      homePhone: '',
      id: 99998,
      name: 'ar@mersino.com',
      value: 'ar@mersino.com',
    },
    {
      eeid: 99997,
      email: '',
      emergencyContact: '',
      emergencyPhone: '',
      homePhone: '',
      id: 99997,
      name: 'hr@mersino.com',
      value: 'hr@mersino.com',
    },
    {
      eeid: 99996,
      email: '',
      emergencyContact: '',
      emergencyPhone: '',
      homePhone: '',
      id: 99996,
      name: 'partssale@mersino.com',
      value: 'partssale@mersino.com',
    },
    {
      eeid: 99995,
      email: '',
      emergencyContact: '',
      emergencyPhone: '',
      homePhone: '',
      id: 99995,
      name: 'repairs@mersino.com',
      value: 'repairs@mersino.com',
    },
  ];

  // stateColumns = [
  //   {
  //     Name: 'code',
  //     isCheck: true,
  //     Text: 'Code',
  //     isDisable: false,
  //     index: 0,
  //     width: 50,
  //   },
  //   {
  //     Name: 'state',
  //     isCheck: true,
  //     Text: 'State',
  //     isDisable: false,
  //     index: 0,
  //     width: 100,
  //   },
  // ];
  pathFile = {
    directoryPath:
      '\\\\192.168.0.2\\Mersino\\01  Administration\\Organizational Material\\Corporate Forms\\01  Administrative Services\\00  General Forms\\Resource List.pdf',
  } as any;
  constructor(
    private formBuilder: FormBuilder,
    private dropdownService: DropdownService,
    private networkService: NetworkDirectoryService
  ) {
     }
  public mask = '(000) 000-0000';
  ngOnInit(): void {
    this.OnInitFilterForm();
    //this.onLoadEmployee();   
    //this.getStateDropDown();
  }
  getStateDropDown() {
    this.dropdownService.GetLookupList('States').subscribe(
      (res) => {
        if (res) {
          this.stateList = res;
        }
      },
      (error) => {
        // this.onError(error, ErrorMessages.drop_down.states);
      }
    );
  }
  onLoadEmployee() {
    this.dropdownService.GetEmployee().subscribe((result) => {
      this.employees = this.allEmployees = [
        // { id: 'All', value: 'All' },
        ...result.result,
      ];
      this.tmpemployees = this.allEmployees = [
        // { id: 'All', value: 'All' },
        ...result.result,
      ];
      let mainEmployeeGird = this.allEmployees;
      let extraEmployees = this.extraEmployees;
      for (let i = 0; i < extraEmployees.length; i++) {
        let payload = {
          eeid: extraEmployees[i].eeid,
          email: extraEmployees[i].email,
          emergencyContact: extraEmployees[i].emergencyContact,
          emergencyPhone: extraEmployees[i].emergencyPhone,
          homePhone: extraEmployees[i].homePhone,
          id: extraEmployees[i].id,
          name: extraEmployees[i].name,
          value: extraEmployees[i].value,
        };
        mainEmployeeGird.push(payload);
      }
      this.allEmployees = mainEmployeeGird;
    });
  }
  onValueChange(type, event) {
    switch (type) {
      case 'stateSelectBy':
        this.isStateVisible = !this.isStateVisible;
        break;
      case 'caller':
        this.isCallerTypeVisible = !this.isCallerTypeVisible;
      default:
        break;
    }
  }

  onHandleFilters(value) {
    switch (value) {
      case 'stateBy':
        this.isStateVisible = !this.isStateVisible;
        break;
      case 'caller':
        this.isCallerTypeVisible = !this.isCallerTypeVisible;
      default:
        break;
    }
  }

  OnInitFilterForm() {
    this.adminFilterForm = this.formBuilder.group({});
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.isSaveCallLogs) {
      if (
        changes.isSaveCallLogs.currentValue &&
        !changes.isSaveCallLogs.previousValue
      ) {
        this.isCallerTypeVisible = false;
        this.isStateVisible = false;
      }
    }
  }
  handleEmployeeDialog(value: string) {
    this.active_btn = value;
    this.isEmployeeVisible = !this.isEmployeeVisible;
    this.employeeSearch = '';
    this.selections = [];this.tmpemployees = this.allEmployees;
    this.filterEmployee();
  }

  handleCallerTypeDialog() {
    this.isCallerTypeVisible = !this.isCallerTypeVisible;
  }

  onResizeColumn(event) {}

  onSelectionChange(event) {
    this.employeeSelectedData = event.selectedRows[0].dataItem;
    switch (this.active_btn) {
      case 'emp_btn':
        this.form.setValue({
          ...this.form.value,
          assignTo: event.selectedRows?.[0]?.dataItem,
        });
        this.validation.assignTo = false;
        this.isEmployeeVisible = !this.isEmployeeVisible;
        break;
      case 'cc_1_btn':
        this.form.setValue({
          ...this.form.value,
          cC1: event.selectedRows?.[0]?.dataItem,
        });
        this.validation.cC1 = false;
        this.isEmployeeVisible = !this.isEmployeeVisible;
        break;
      case 'cc_2_btn':
        this.form.setValue({
          ...this.form.value,
          cC2: event.selectedRows?.[0]?.dataItem,
        });
        this.validation.cC2 = false;
        this.isEmployeeVisible = !this.isEmployeeVisible;
        break;
      case 'cc_3_btn':
        this.form.setValue({
          ...this.form.value,
          cC3: event.selectedRows?.[0]?.dataItem,
        });
        this.validation.cC3 = false;
        this.isEmployeeVisible = !this.isEmployeeVisible;
        break;
      case 'cc_4_btn':
        this.form.setValue({
          ...this.form.value,
          cC4: event.selectedRows?.[0]?.dataItem,
        });
        this.validation.cC4 = false;
        this.isEmployeeVisible = !this.isEmployeeVisible;
        break;
      case 'callerType':
        this.form.setValue({
          ...this.form.value,
          callerType: event.selectedRows?.[0]?.dataItem,
        });
        this.isCallerTypeVisible = !this.isCallerTypeVisible;
        break;
      case 'state':
        this.form.setValue({
          ...this.form.value,
          state: event.selectedRows?.[0]?.dataItem,
        });
        this.isStateVisible = !this.isStateVisible;
        break;
      default:
        break;
    }
    this.active_btn = '';
  }

  onSortChange(event) {}

  onReOrderColumns(event) {}

  onDataStateChange(event) {}

  onSelectCallerType(event) {
    this.call_type_btn = event.selectedRows?.[0]?.dataItem.type;
    this.isCallerTypeVisible = !this.isCallerTypeVisible;
  }

  handleStateDialog() {
    this.isStateVisible = !this.isStateVisible;
  }

  onSelectState(event) {
    this.state_type_btn = event.selectedRows?.[0]?.dataItem.state;
    this.isStateVisible = !this.isStateVisible;
  }

  onDownloadResourceList() {
    this.networkService
      .DownloadFile(encodeURI(this.pathFile.directoryPath))
      .subscribe(
        (data) => {
          saveAs(data, 'Resource List Excel.pdf');
        },
        (error) => {}
      );
  }
  filterEmployee() {
    this.allEmployees = process(this.tmpemployees, {
      filter: {
        logic: 'or',
        filters: [
          {
            field: 'id',
            operator: 'contains',
            value: this.employeeSearch,
          },
          {
            field: 'value',
            operator: 'contains',
            value: this.employeeSearch,
          },
        ],
      },
    }).data;
  }
}
