import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MainAutoMailersService } from '../../main-auto-mailers/main-auto-mailers.service'
import { orderBy, process, SortDescriptor } from '@progress/kendo-data-query';
import { MainAutoMailerITModel } from '../main-auto-mailer.model'
import { UtilityService } from 'src/app/core/services/utility.service';

@Component({
  selector: 'app-main-auto-it',
  templateUrl: './main-auto-it.component.html',
  styleUrls: ['./main-auto-it.component.scss'],
})
export class MainAutoItComponent implements OnInit, OnChanges {
  @Input() isSavebuttonclick = false;
  @Input() isAddbuttonclick = false;
  @Input() isCancelbuttonclick = false;
  @Input() isEditbuttonclick = false;
  @Output() isITDataSaved = new EventEmitter<boolean>();
  @Output() isITDatanotSaved = new EventEmitter<boolean>();
  maintainITForm: FormGroup;
  data: any = [];
  sort: SortDescriptor[] = [];
  selections: any = [];
  skip: number = 0;
  multiple: boolean = false;
  isReportVisible: boolean = false;
  isCurrentReportVisible: boolean = false;
  report_btn: string = '';
  visible: boolean = false;
  searchText: string = '';
  isReportTypeVisible: boolean = false;
  public isSelectionVisible: any = false;
  reportTypeList: any = [
    {
      label: 'Auto Report',
      value: 'Auto Report'
    },
    {
      label: 'MDI Mobile',
      value: 'MDI Mobile'
    },
    {
      label: 'Push Button',
      value: 'Push Button'
    },
    {
      label: 'Transactional',
      value: 'Transactional'
    },
  ];
  reportTypeSelection: any = []
  tempReportTypeList: any = this.reportTypeList;
  selectedpk: any;
  isMaintainITForm: boolean
  tempselectedpk: any;
  itcolumns = [
    {
      Name: 'pk',
      isCheck: true,
      Text: 'PK',
      isDisable: false,
      index: 0,
      width: 20,
    },
    {
      Name: 'subject',
      isCheck: true,
      Text: 'Subject',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'branchSpecific',
      isCheck: true,
      Text: 'BranchSpecific',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'description',
      isCheck: true,
      Text: 'Description',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'reportType',
      isCheck: true,
      Text: 'ReportType',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'skip',
      isCheck: true,
      Text: 'Skip',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'autoReport',
      isCheck: true,
      Text: 'AutoReport',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'inactive',
      isCheck: true,
      Text: 'InActive',
      isDisable: false,
      index: 0,
      width: 100,
    },
  ];

  itData = [];
  tempitData = [];
  reportData = [
    {
      name: 'Auto report',
    },
    {
      name: 'MDI Mobile',
    },
    {
      name: 'Push Button',
    },
    {
      name: 'Transactional',
    },
  ];

  constructor(private formBuilder: FormBuilder,
    private service: MainAutoMailersService,
    private utility: UtilityService,) { }

  ngOnInit(): void {
    var x = this.isSavebuttonclick;
    this.onInitForm({});
    this.loadMainAutoITData();


  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.isSavebuttonclick) {
      if (changes.isSavebuttonclick.currentValue && !changes.isSavebuttonclick.previousValue) {
        this.AddUpdateAutoMailer();
      }
    }
    if (changes.isAddbuttonclick) {
      if (changes.isAddbuttonclick.currentValue && !changes.isAddbuttonclick.previousValue) {
        this.isMaintainITForm = true;
        this.isSelectionVisible = true;
        this.selectedpk = 0;
        this.report_btn = "Report Type:";
        this.selections = [];
        this.reportTypeSelection = [];
        this.maintainITForm.reset();
        this.maintainITForm.setValue({
          ...this.maintainITForm.value,
          isActive: true,
        });
      }
    }

    if (changes.isEditbuttonclick) {
      if (changes.isEditbuttonclick.currentValue && !changes.isEditbuttonclick.previousValue) {
        this.isMaintainITForm = true;
        this.isSelectionVisible = true;
      }
    }

    if (changes.isCancelbuttonclick) {
      if (changes.isCancelbuttonclick.currentValue && !changes.isCancelbuttonclick.previousValue) {
        this.isMaintainITForm = false;
        this.isSelectionVisible = false;
        if (this.tempselectedpk > 0) {
          var dataItem = this.itData.find(x => x.pk == this.tempselectedpk);
          this.onInitForm(dataItem);
        }
        else {
          this.onInitForm(this.itData[0]);
        }
      }
    }
  }

  AddUpdateAutoMailer() {
    if (this.maintainITForm.invalid) {
      this.maintainITForm.markAllAsTouched();
      this.isITDatanotSaved.emit(false);
      return false;
    }

    this.visible = false;
    this.visible = true;
    const auto_mailer = new MainAutoMailerITModel();
    auto_mailer.autoReport = this.maintainITForm.value.functionName
    auto_mailer.branchSpecific = this.maintainITForm.value.isBranchspecific == true ? true : false
    auto_mailer.description = this.maintainITForm.value.description
    // auto_mailer.id = this.maintainITForm.value.functionName
    auto_mailer.inactive = !this.maintainITForm.value.isActive == true ? true : false;
    auto_mailer.reportType = this.maintainITForm.value.reportType
    auto_mailer.skip = this.maintainITForm.value.isSkip == true ? true : false;
    auto_mailer.subject = this.maintainITForm.value.subject
    auto_mailer.userName = JSON.parse(localStorage.getItem('currentUser')).userName
    auto_mailer.user_PK = JSON.parse(localStorage.getItem('currentUser')).id
    if (this.selectedpk > 0) {
      auto_mailer.id = this.selectedpk;
    }
    else {
      auto_mailer.id = 0;
    }
    this.service.AddUpdateAutoMailer(auto_mailer).subscribe((res) => {
      if (res['status'] == 200) {
        this.visible = true;
        this.visible = false;
        this.utility.toast.success(res['message']);
        this.loadMainAutoITData();
        this.isITDataSaved.emit(true);
        this.isSelectionVisible = false;
      } else {
        this.visible = true;
        this.visible = false;
        this.utility.toast.error(res['message']);
      }
    })
  }

  loadMainAutoITData() {
    this.visible = false;
    this.visible = true;
    this.service.GetMainAutoMailersITData().subscribe((res) => {
      if (res.length > 0) {
        this.itData = res;
        this.tempitData = res;
        if (this.selectedpk > 0) {
          var dataItem = this.itData.find(x => x.pk == this.selectedpk);
          this.isMaintainITForm = false;
          this.onInitForm(dataItem);
          this.tempselectedpk = dataItem.pk;
          this.isSavebuttonclick = false;
        }
        else {
          this.selections = [0];
          this.isMaintainITForm = false;
          this.onInitForm(res[0]);
          this.tempselectedpk = res[0].pk;
        }
      }
      else {
        this.itData = [];
        this.tempitData = [];
      }
      this.visible = true;
      this.visible = false;
    })
  }

  public onFilter(inputValue: string): void {
    this.selections = [0];
    this.searchText = inputValue;
    this.itData = process(this.tempitData, {
      filter: {
        logic: 'or',
        filters: [
          {
            field: 'pk',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'subject',
            operator: 'contains',
            value: inputValue,
          },
        ],
      },
    }).data;
    this.maintainITForm.reset();
    if (this.itData.length > 0)
      this.onInitForm(this.itData[0]);
  }

  onSelectionChange(event) {
    this.isMaintainITForm = false;
    this.onInitForm(event.selectedRows[0].dataItem);
  }

  // onSelectionChange(type, event) {
  //   switch (type) {
  //     case 'report_type':
  //       this.maintainITForm.setValue({
  //         ...this.maintainITForm.value,
  //         report_type: event,
  //       });
  //       this.isReportVisible = !this.isReportVisible;
  //       break;
  //     case 'current_report':
  //       this.maintainITForm.setValue({
  //         ...this.maintainITForm.value,
  //         current_report: event,
  //       });
  //       this.isCurrentReportVisible = !this.isCurrentReportVisible;
  //       break;
  //     case 'submit':
  //       this.maintainITForm.setValue({
  //         ...this.maintainITForm.value,
  //         submit: event,
  //       });
  //       this.isVeteranStatusVisible = !this.isVeteranStatusVisible;
  //       break;
  //     case 'associated':
  //       this.maintainITForm.setValue({
  //         ...this.maintainITForm.value,
  //         associated: event,
  //       });
  //       this.isRaceVisible = !this.isRaceVisible;
  //       break;
  //     case 'description':
  //       this.maintainITForm.setValue({
  //         ...this.maintainITForm.value,
  //         description: event,
  //       });
  //       this.isRaceVisible = !this.isRaceVisible;
  //       break;
  //     default:
  //       break;
  //   }
  // }

  onInitForm(value) {
    this.maintainITForm = this.formBuilder.group({
      pk: value?.pk || '',
      subject: [value?.subject || '', [Validators.required]],
      functionName: [value?.autoReport || '', [Validators.required]],
      description: [value?.description || '', [Validators.required]],
      isBranchspecific: value?.branchSpecific || false,
      isSkip: value?.skip || false,
      reportType: [value?.reportType || '', [Validators.required]],
      isActive: !value?.inactive || false
      // report_type: value?.report_type || '',
      // current_report: value?.current_report || 'All',
      // submit: value?.submit || '',
      // associated: value?.associated || '',
      // description: value?.description || '',
    });

    var lbltype = 'Auto Reports';
    if (value?.reportType == '1') {
      lbltype = 'Push Button'
    } else if (value?.reportType == '2') {
      lbltype = 'Transactional';
    } else if (value?.reportType == '3') {
      lbltype = 'MDI Mobile';
    }
    if (value?.reportType != '' || value?.reportType != null) {
      this.report_btn = lbltype;
    }
    if (value?.reportType === null) {
      this.report_btn = "Report Type:"
    }
    if (value?.pk > 0) {
      this.selectedpk = value.pk;
      this.tempselectedpk = value.pk;
    }
  }

  onResizeColumn(event) { }

  onSortChange(event) { }

  onReOrderColumns(event) { }

  onDataStateChange(event) { }

  onRowSelect(event, type) {
    var lbltype = 'Auto Reports';
    switch (type) {
      case 'report_type':
        if (event.selectedRows?.[0]?.dataItem.label == '1') {
          lbltype = 'Push Button'
        } else if (event.selectedRows?.[0]?.dataItem.label == '2') {
          lbltype = 'Transactional';
        } else if (event.selectedRows?.[0]?.dataItem.label == '3') {
          lbltype = 'MDI Mobile';
        }
        this.report_btn = "Report Type: " + lbltype;
        this.maintainITForm.setValue({
          ...this.maintainITForm.value,
          reportType: `${event.selectedRows[0].dataItem.label}`,
        });
        this.isReportTypeVisible = false;
        break;
      default:
        break;
    }
  }

  onHandleOperation(value) {
    switch (value) {
      case 'report_type':
        this.isReportTypeVisible = !this.isReportTypeVisible;
        break;
      default:
        break;
    }
  }

  onfilterReportType(value: any) {
    
    this.reportTypeList = process(this.tempReportTypeList, {
      filter: {
        logic: 'or',
        filters: [
          {
            field: 'label',
            operator: 'contains',
            value: value,
          },
        ],
      },
    }).data;
    
  }

}
