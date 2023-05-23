import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {MainAutoMailersService} from '../main-auto-mailers.service';
import {process, orderBy, SortDescriptor, State } from '@progress/kendo-data-query';
import { UtilityService } from 'src/app/core/services/utility.service';
import {
  DataStateChangeEvent,
  GridDataResult,
  GroupKey,
} from "@progress/kendo-angular-grid";
import { TreeListModule } from '@progress/kendo-angular-treelist';
import { error } from 'jquery';
@Component({
  selector: 'app-main-report-routing',
  templateUrl: './main-report-routing.component.html',
  styleUrls: ['./main-report-routing.component.scss'],
})
export class MainReportRoutingComponent implements OnInit {
  maintainAutoMailersForm: FormGroup;
  data: any = [];
  sort: SortDescriptor[] = [];
  selections: any = [];
  skip: number = 0;
  multiple: boolean = false;
  select_report_btn: string = 'Select Report: ';
  branch_btn: string = '';
  replace_btn: string = '';
  isselectReportVisible: boolean = false;
  isbranchVisible: boolean = false;
  isReplaceVisible: boolean = false;
  isRecipientsVisible: boolean = false;
  isConfirmationDialog: boolean = false;
  isCloseDialog: boolean = false;
  issetAllbranchVisible: boolean = false;
  visible: boolean = false;
  selectedReportId: any = '';
  selectedbranchCode: any = '%';
  selectedoldrecipient: any = '';
  selectednewrecipient: any = '';
  selectedautomailer: any = '';
  selectedremoveEEID: any = '';
  isreplaceAlldialogVisible: boolean = false;
  oldrecipientname: string = '';
  newrecipientname: string = '';
  Toselections: any = [];
  CCselections: any = [];
  branchselections: any = [];
  branchsort: SortDescriptor[] = [];
  autoMailersort: SortDescriptor[] = [];
  AutoMailerGridData: any = [];
  tempAutoMailerGridData: any = [];
  autoMailerselections: any = [];
  isToLeftbtndisabled: boolean = true;
  isToRightbtndisabled: boolean = true;
  isCCLeftbtndisabled: boolean = true;
  isCCRightbtndisabled: boolean = true;
  isSetAllBranchbtndisabled: boolean = true;
  automailersearch: string = ''
  branchSpecificTitle: string = 'Branch Specific';
  isBranchbtndisabled: boolean = false;
  branchSpecificClass: string = '';
  autoMailerColumns: any = [
    {
      Name: 'branch',
      isCheck: true,
      Text: 'Branch',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'eeid',
      isCheck: true,
      Text: 'EEID',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'firstName',
      isCheck: true,
      Text: 'FirstName',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'name',
      isCheck: true,
      Text: 'Name',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'type',
      isCheck: true,
      Text: 'Type',
      isDisable: false,
      index: 0,
      width: 100,
    },
  ]
  state: State = {
    group: [{ field: 'type' }],
  };
  expandedGroupKeys: Array<GroupKey> = [];
  
  Tosort: SortDescriptor[] = [{
    field: 'name',
    dir: 'asc',
  },];
  CCsort: SortDescriptor[] = [{
    field: 'name',
    dir: 'asc',
  },];
  reportColumn: any = [
    {
      Name: 'pk',
      isCheck: true,
      Text: 'PK',
      isDisable: false,
      index: 0,
      width: 100,
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
    }
  ];
  ReportData: any = [];
  tempReportData: any = [];
  branchData : any = [] ;
  tempbranchData: any [];
  branchColumns: any = [
    {
      Name: 'code',
      isCheck: true,
      Text: 'Code',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'id',
      isCheck: true,
      Text: 'Id',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'value',
      isCheck: true,
      Text: 'Value',
      isDisable: false,
      index: 0,
      width: 100,
    },
  ]
  ReplaceData = [
    {
      name: 'Benjamin Abbey',
    },
    {
      name: 'Kevin Abernathy',
    },
    {
      name: 'Carl Adams',
    },
  ];
  ToData: any = [];
  tempToData: any = [];
  ToColumns: any = [
    {
      Name: 'branch',
      isCheck: true,
      Text: 'Branch',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'cc',
      isCheck: true,
      Text: 'CC',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'email',
      isCheck: true,
      Text: 'Email',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'name',
      isCheck: true,
      Text: 'Name',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'pk',
      isCheck: true,
      Text: 'PK',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'sort',
      isCheck: true,
      Text: 'Sort',
      isDisable: false,
      index: 0,
      width: 100,
    },
  ];
  tempCCData: any = [];
  CCData: any = [];
  CCColumns: any = [{
    Name: 'branch',
    isCheck: true,
    Text: 'Branch',
    isDisable: false,
    index: 0,
    width: 100,
  },
  {
    Name: 'cc',
    isCheck: true,
    Text: 'CC',
    isDisable: false,
    index: 0,
    width: 100,
  },
  {
    Name: 'email',
    isCheck: true,
    Text: 'Email',
    isDisable: false,
    index: 0,
    width: 100,
  },
  {
    Name: 'name',
    isCheck: true,
    Text: 'Name',
    isDisable: false,
    index: 0,
    width: 100,
  },
  {
    Name: 'pk',
    isCheck: true,
    Text: 'PK',
    isDisable: false,
    index: 0,
    width: 100,
  },
  {
    Name: 'sort',
    isCheck: true,
    Text: 'Sort',
    isDisable: false,
    index: 0,
    width: 100,
  },];
  isoldrecipientVisible: boolean = false;
  oldRecipientData: any = [];
  tempoldRecipientData: any = [];
  oldrecipientsort: SortDescriptor[] = [];
  oldrecipientselections: any = [];
  oldrecipientColumns = [
    {
      Name: 'branch',
      isCheck: true,
      Text: 'Branch',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'eeid',
      isCheck: true,
      Text: 'EEID',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'lastName',
      isCheck: true,
      Text: 'LastName',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'name',
      isCheck: true,
      Text: 'Name',
      isDisable: false,
      index: 0,
      width: 100,
    },
  ]
  isnewrecipientVisible: boolean = false;
  newRecipientData: any = [];
  tempnewRecipientData: any = [];
  newrecipientsort: SortDescriptor[] = [];
  newrecipientselections: any = [];
  newrecipientColumns: any = [
    {
      Name: 'branch',
      isCheck: true,
      Text: 'Branch',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'eeid',
      isCheck: true,
      Text: 'EEID',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'lastName',
      isCheck: true,
      Text: 'LastName',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'name',
      isCheck: true,
      Text: 'Name',
      isDisable: false,
      index: 0,
      width: 100,
    },
  ]

  filterReports: any = '';
  filterBranch: any = '';
  filterOldRecipient: any = '';
  filterNewRecipient: any = '';

  constructor(private formBuilder: FormBuilder,
    private service: MainAutoMailersService,
    private utility: UtilityService) {}

  ngOnInit(): void {
    this.onInitForm();
    this.loadReportList();
    this.loadBranchList();
    this.loadOldRecipientData();
  }

  onInitForm() {
    this.maintainAutoMailersForm = this.formBuilder.group({
      select_report: '',
      branch: '',
      replace: '',
      reportId: '',
      branchCode: ''
    });
  }

  onRowSelect(event, type) {
    
    switch (type) {
      case 'select_report':
        this.select_report_btn ="Report: " + event.selectedRows?.[0]?.dataItem.pk + " " + event.selectedRows?.[0]?.dataItem.subject ;
        this.maintainAutoMailersForm.setValue({
          ...this.maintainAutoMailersForm.value,
          reportId: event.selectedRows[0].dataItem.pk,
        });
        this.selectedReportId = event.selectedRows[0].dataItem.pk;
        var isbranchSpecific =  event.selectedRows?.[0]?.dataItem.branchSpecific == true? "Yes": "No";
        this.branchSpecificTitle = "Branch Specific: " + isbranchSpecific;
        this.isBranchbtndisabled = !event.selectedRows?.[0]?.dataItem.branchSpecific;
        this.branchSpecificClass = event.selectedRows?.[0]?.dataItem.branchSpecific == true? "Yes": "No";
        // this.selectedbranchCode = '%';
        this.isselectReportVisible = false;
        this.loadToAndCCData();
        this.isSetAllBranchbtndisabled = !event.selectedRows?.[0]?.dataItem.branchSpecific;
        break;
      case 'branch':
        this.maintainAutoMailersForm.setValue({
          ...this.maintainAutoMailersForm.value,
          branchCode: event.selectedRows[0].dataItem.code,
        });
        this.branch_btn = event.selectedRows?.[0]?.dataItem.value;
        this.selectedbranchCode = event.selectedRows?.[0]?.dataItem.code;
        this.loadToAndCCData();
        this.isbranchVisible = false;
        break;
      case 'replace':
        this.replace_btn = event.selectedRows?.[0]?.dataItem.code;
        this.isReplaceVisible = false;
        break;
      case 'oldrecipient':
        this.selectedoldrecipient = event.selectedRows?.[0]?.dataItem.eeid;
        this.isoldrecipientVisible = false;
        this.loadnewRecipient();
        this.isnewrecipientVisible = true;
        this.oldrecipientname = event.selectedRows?.[0]?.dataItem.name;
        break;
      case 'newrecipient':
        this.newrecipientname = event.selectedRows?.[0]?.dataItem.name;
        this.selectednewrecipient = event.selectedRows?.[0]?.dataItem.eeid;
        this.isnewrecipientVisible = false;
        this.isreplaceAlldialogVisible = true;
        break;
      case 'automailer':
        this.Toselections = [];
        this.CCselections = [];
        this.selectedautomailer = event.selectedRows?.[0]?.dataItem.eeid;
        this.isToLeftbtndisabled = true;
        this.isCCLeftbtndisabled = true;
        this.isToRightbtndisabled = false;
        this.isCCRightbtndisabled = false;      
        break;
      default:
        break;
    }
  }

  onResizeColumn(event) {}

  onSortChange(event) {}

  onReOrderColumns(event) {}

  onDataStateChange(event) {}

  onSelectionChange(event) {}

  onHandleOperation(value) {
    
    switch (value) {
      case 'reports':
        this.isselectReportVisible = !this.isselectReportVisible;
        break;
      case 'branch':
        this.isbranchVisible = !this.isbranchVisible;
        break;
      case 'oldrecipient':
        this.isoldrecipientVisible = !this.isoldrecipientVisible;
        if(!this.isoldrecipientVisible) {
          this.oldrecipientselections = [];
        }
        break;
      case 'newrecipient':
          this.isnewrecipientVisible = !this.isnewrecipientVisible;
          if(!this.isnewrecipientVisible) {
            this.newrecipientselections = [];
            this.oldrecipientselections = [];
          }
          break;
      case 'replace':
        this.isReplaceVisible = !this.isReplaceVisible;
        break;
      case 'recipients':
        this.isRecipientsVisible = !this.isRecipientsVisible;
        this.isConfirmationDialog = false;
        break;
      default:
        break;
    }
  }

  loadReportList() {
    this.visible = false;
    this.visible = true;
    var request = true;
    this.service.GetReportList(request).subscribe((res) => {
      
      if(res.length > 0) {
      this.ReportData = res;
      this.tempReportData = res;
      this.visible = true;
      this.visible = false;
      }
      else {
        this.ReportData = [];
        this.tempReportData = [];
        this.visible = true;
        this.visible = false;      
      }
    },(error) => {
      this.visible = true;
      this.visible = false;
    });

  }

  onFilterReportList(data: any) {
    this.filterReports = data;
    this.ReportData = process(this.tempReportData, {
      filter: {
        logic: 'or',
        filters: [
          {
            field: 'pk',
            operator: 'contains',
            value: data,
          },
          {
            field: 'subject',
            operator: 'contains',
            value: data,
          }
          
        ],
      },
    }).data;
  }

  loadAutoMailerGridData() {
   this.visible = false;
   this.visible = true;
   var request = {branch: this.selectedbranchCode};
   this.service.GetMainAutoMailerData(request).subscribe((res) => {
    
    if(res.length > 0) {
    this.tempAutoMailerGridData = res
    this.AutoMailerGridData = process(res,this.state);
    var toDatapk = this.ToData.map(x => Number(x.email));
    var ccDatapk = this.CCData.map(x => Number(x.email));
    this.tempAutoMailerGridData = res.filter((x) => !toDatapk.includes(x.eeid)).filter((x) => !ccDatapk.includes(x.eeid));
    this.AutoMailerGridData = process(this.tempAutoMailerGridData,this.state);
    this.OnFilterAutoMailerGridData(this.automailersearch);
    this.visible = true;
    this.visible = false;
    }
    else {
      this.tempAutoMailerGridData = [];
      this.AutoMailerGridData = [];
      this.visible = true;
      this.visible = false;
    }
   },(error) => {
    this.visible = true;
    this.visible = false;
  })

  }

  OnFilterAutoMailerGridData(data: any) {
    this.automailersearch = data;
    this.AutoMailerGridData = process(this.tempAutoMailerGridData, {
      filter: {
        logic: 'or',
        filters: [
          {
            field: 'name',
            operator: 'contains',
            value: this.automailersearch,
          },
          
        ],
      },
    }).data;
    this.AutoMailerGridData = process(this.AutoMailerGridData,this.state);
  }

  loadToAndCCData() {
    this.visible = false;
    this.visible = true;
    var request = {reportID: this.selectedReportId, branchCode: this.selectedbranchCode}
    this.service.GetToandCCList(request).subscribe((res) => {
      
      if(res.length > 0) {
      this.ToData = res.filter(x => x.cc == false) 
      this.CCData = res.filter(x => x.cc == true)
      this.tempToData = res.filter(x => x.cc == false) 
      this.tempCCData = res.filter(x => x.cc == true)
      this.ToData = orderBy(this.tempToData, this.Tosort);
      this.CCData = orderBy(this.tempCCData, this.CCsort);
      this.visible = true;
      this.visible = false;     
      this.loadAutoMailerGridData(); 
    }
    else {
      this.ToData = [];
      this.tempToData = [];
      this.CCData = [];
      this.tempCCData = [];
      this.visible = true;
      this.visible = false;
    }
  },(error) => {
    this.visible = true;
    this.visible = false;
  })
  }

  onToSelectionChange(data: any) {
    this.autoMailerselections = [];
    this.CCselections = [];
    this.isToRightbtndisabled = true;
    this.isCCRightbtndisabled = true;
    this.isCCLeftbtndisabled = true;
    this.isToLeftbtndisabled = false;
    this.selectedremoveEEID = data.selectedRows?.[0]?.dataItem.pk;
  }

  onCCSelectionChange(data: any) {
    this.autoMailerselections = [];
    this.Toselections = [];
    this.isToRightbtndisabled = true;
    this.isCCRightbtndisabled = true;
    this.isCCLeftbtndisabled = false;
    this.isToLeftbtndisabled = true;
    this.selectedremoveEEID = data.selectedRows?.[0]?.dataItem.pk;
  }

  onToSortChange(sort: SortDescriptor[])
  {
    
   this.Tosort = sort;
   this.ToData = orderBy(this.tempToData, sort);
  }

  onCCsortChange(sort: SortDescriptor[]) {
    this.CCsort = sort;
    this.CCData = orderBy(this.tempCCData, sort);
  }

  loadBranchList() {
    this.visible = false;
    this.visible = true;
    this.service.GetBranchList().subscribe((res) => {
      if(res.length > 0) {
      this.branchData = res;
      this.tempbranchData = res;
      this.visible = true;
      this.visible = false
      }
      else {
        this.branchData = [];
        this.tempbranchData = [];
        this.visible = true;
        this.visible = false;
      }
    },(error) => {
      this.visible = true;
      this.visible = false;
    })
  }

  onBranchFilter(data: any) {
    this.filterBranch = data;
    this.branchData = process(this.tempbranchData, {
      filter: {
        logic: 'or',
        filters: [
          {
            field: 'code',
            operator: 'contains',
            value: data,
          },
          {
            field: 'value',
            operator: 'contains',
            value: data,
          }
          
        ],
      },
    }).data;
  }

  loadOldRecipientData() {
    this.visible = false;
    this.visible = true;
    var EE = 0;
    this.service.GetAutoMailerEmployeeList(EE).subscribe((res) => {
      
      if(res.length > 0){
      this.oldRecipientData = res;
      this.tempoldRecipientData = res;
      this.visible = true;
      this.visible = false;
      }
      else {
        this.oldRecipientData = [];
        this.tempoldRecipientData = [];
        this.visible = true;
        this.visible = false;
      }
    },(error) => {
      this.visible = true;
      this.visible = false;
    })
  }

  onoldRecipientFilter(data: any) {
    this.filterOldRecipient = data;
    this.oldRecipientData = process(this.tempoldRecipientData, {
      filter: {
        logic: 'or',
        filters: [
          {
            field: 'name',
            operator: 'contains',
            value: data,
          },
        ],
      },
    }).data;
  }

  loadnewRecipient() {
    this.visible = false;
    this.visible = true;
    var EE = this.selectedoldrecipient;
    this.service.GetAutoMailerEmployeeList(EE).subscribe((res) => {
      
      if(res.length > 0){
      this.newRecipientData = res;
      this.tempnewRecipientData = res;
      this.visible = true;
      this.visible = false;
      }
      else {
        this.newRecipientData = [];
        this.tempnewRecipientData = [];
        this.visible = true;
        this.visible = false;
      }
    },(error) => {
      this.visible = true;
      this.visible = false;
    })
  }

  onnewRecipientFilter(data: any) {
    this.filterNewRecipient = data;
    this.newRecipientData = process(this.tempnewRecipientData, {
      filter: {
        logic: 'or',
        filters: [
          {
            field: 'name',
            operator: 'contains',
            value: data,
          },
        ],
      },
    }).data;
  }

  closereplaceAlldialog(data: any) {
    if(data == 'no') {
      this.isreplaceAlldialogVisible = false;
      this.filterOldRecipient = ''
      this.filterNewRecipient = '';
      this.onoldRecipientFilter(this.filterOldRecipient);
      this.onnewRecipientFilter(this.filterNewRecipient);
      this.oldrecipientselections = [];
      this.newrecipientselections = [];
      this.selectedoldrecipient = '';
      this.selectedoldrecipient = '';
    }
    if(data == 'yes') {
      this.visible = false;
      this.visible = true;
      var request = {ee: this.selectedoldrecipient, eer: this.selectednewrecipient, userName: JSON.parse(localStorage.getItem('currentUser')).userName, user_PK: JSON.parse(localStorage.getItem('currentUser')).id };
      this.service.ReplaceAllAutoMailer(request).subscribe((res) => {
        
        
        if(res['status'] == 200) {
        this.utility.toast.success(res['message']);
        this.select_report_btn = "Select Report: ";
        this.selectedReportId = "";
        this.selectedbranchCode = '%';
        this.branch_btn = "";
        this.selectedoldrecipient = "";
        this.selectednewrecipient = "";
        this.ToData = [];
        this.CCData = [];
        this.tempToData =[];
        this.tempCCData = [];
        this.selections = [];
        this.branchselections = [];
        this.Toselections = [];
        this.CCselections = [];
        this.oldrecipientselections = [];
        this.newrecipientselections = [];
        this.AutoMailerGridData = [];
        this.tempAutoMailerGridData = [];
        this.isToLeftbtndisabled = true;
        this.isToRightbtndisabled = true;
        this.isCCLeftbtndisabled = true;
        this.isCCRightbtndisabled = true;
        this.selectedautomailer = '';
        this.selectedremoveEEID = '';
        this.branchSpecificClass = '';
        this.maintainAutoMailersForm.reset();
        this.isreplaceAlldialogVisible = false;
        this.isSetAllBranchbtndisabled = true;
        this.branchSpecificTitle = "Branch Specific" 
        this.isBranchbtndisabled = false;
        this.branchSpecificClass = '';
        this.filterReports = '';
        this.filterOldRecipient = '';
        this.onoldRecipientFilter(this.filterOldRecipient)
        this.filterNewRecipient = '';
        this.onnewRecipientFilter(this.filterNewRecipient);
        this.onFilterReportList(this.filterReports);
        this.filterBranch = '';
        this.onBranchFilter(this.filterBranch);
        this.visible = true;
        this.visible = false;
        }
        else {
          this.utility.toast.error(res['message']);
          this.visible = true;
          this.visible = false;
        }
      },(error) => {
        this.visible = true;
        this.visible = false;
      })
    }
  }

  groupChange() {}

  AddEmail(data:boolean) {
    this.visible = false;
    this.visible = true;
    var request = {reportID: this.selectedReportId, ee:this.selectedautomailer, branch: this.selectedbranchCode, cc: data,
      userName: JSON.parse(localStorage.getItem('currentUser')).userName, user_PK: JSON.parse(localStorage.getItem('currentUser')).id};
    this.service.AddEmailData(request).subscribe((res) => {
      if(res['status'] == 200) {
      this.utility.toast.success(res['message']);
      this.autoMailerselections = [];
      this.Toselections = [];
      this.CCselections = [];
      this.loadToAndCCData();
      this.selectedautomailer = '';
      this.isToLeftbtndisabled = true;
      this.isCCLeftbtndisabled = true;
      this.isToRightbtndisabled = true;
      this.isCCRightbtndisabled = true;
      this.visible = true;
      this.visible = false;
      }
      else {
        this.utility.toast.error(res['message']);
        this.visible = true;
        this.visible = false;
      }
    },(error) => {
      this.visible = true;
      this.visible = false;
    })
  }

  RemoveEmail() {
    this.visible = false;
    this.visible = true;
    var request = {eeId: this.selectedremoveEEID,userName: JSON.parse(localStorage.getItem('currentUser')).userName, user_PK: JSON.parse(localStorage.getItem('currentUser')).id}
    this.service.RemoveEmailData(request).subscribe((res) => {
      if(res['status'] == 200) {
        this.utility.toast.success(res['message']);
        this.autoMailerselections = [];
        this.Toselections = [];
        this.CCselections = [];
        this.loadToAndCCData();
        this.selectedremoveEEID = '';
        this.isToLeftbtndisabled = true;
        this.isCCLeftbtndisabled = true;
        this.isToRightbtndisabled = true;
        this.isCCRightbtndisabled = true;
        this.visible = true;
        this.visible = false;
        }
        else {
          this.utility.toast.error(res['message']);
          this.visible = true;
          this.visible = false;
        }
    },(error) => {
      this.visible = true;
      this.visible = false;
    })
  }

  setallBranch() {
    this.issetAllbranchVisible = true;
  }
  closesetAllbranch(data:any) {
    if(data == 'no') {
      this.issetAllbranchVisible = false;
    }

    if(data == 'yes') {
     this.visible = false;
     this.visible = true;
     var request = {reportID: this.selectedReportId, branch: this.selectedbranchCode,userName: JSON.parse(localStorage.getItem('currentUser')).userName, user_PK: JSON.parse(localStorage.getItem('currentUser')).id};
     this.service.SetAllBranchRecipient(request).subscribe((res) => {
      if(res['status'] == 200) {
        this.issetAllbranchVisible = false;
        this.utility.toast.success(res['message']);
        this.filterReports = '';
        this.onFilterReportList(this.filterReports);
        this.selections = [this.ReportData.findIndex(x => x.pk == this.selectedReportId)];
        this.filterBranch = '';
        this.onBranchFilter(this.filterBranch);
        this.branchselections = [this.branchData.findIndex(x => x.code == this.selectedbranchCode)];
        this.filterOldRecipient = '';
        this.onoldRecipientFilter(this.filterOldRecipient)
        this.filterNewRecipient = '';
        this.onnewRecipientFilter(this.filterNewRecipient);
        this.autoMailerselections = [];
        this.Toselections = [];
        this.CCselections = [];
        this.selectedremoveEEID = '';
        this.isToLeftbtndisabled = true;
      this.isCCLeftbtndisabled = true;
      this.isToRightbtndisabled = true;
      this.isCCRightbtndisabled = true;
      this.selectedoldrecipient = "";
        this.selectednewrecipient = "";
        this.oldrecipientselections = [];
        this.newrecipientselections = [];
      this.visible = true;
      this.visible = false;
      }
      else {
        this.utility.toast.error(res['message']);
        this.visible = true;
        this.visible = false;
      }
     },(error) => {
      this.visible = true;
      this.visible = false;
    })
    }
  }
}
