import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { SortDescriptor } from '@progress/kendo-data-query';
import { MenuService } from 'src/app/core/helper/menu.service';
import { DropdownService } from 'src/app/core/services/dropdown.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { BranchService } from 'src/app/layout/admin/branch/branch.service';
import { TitlesService } from '../titles.service';

@Component({
  selector: 'app-title-routing',
  templateUrl: './title-routing.component.html',
  styleUrls: ['./title-routing.component.scss'],
})
export class TitleRoutingComponent implements OnInit {
  @Output() PORrouteClick = new EventEmitter<number>();
  employees = [];
  branch = [];
  isEmpBtn: boolean = false;
  isBranch: boolean = false;
  bomEmployee: any;
  timeApprovalEmployee: any;
  employeeFilterOptions: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'startsWith',
  };
  employeeFilterOptions2: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'startsWith',
  };
  homeBranch: string = "";
  selectedBranch: string = "";
  titlesColumns = [
    {
      Name: 'employeeName',
      isCheck: true,
      Text: 'Employee Name',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'title',
      isCheck: true,
      Text: 'Title',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'approvalValue',
      isCheck: true,
      Text: 'Value',
      isDisable: false,
      index: 0,
      width: 100,
    },
    // {
    //   Name: 'reportTOName',
    //   isCheck: true,
    //   Text: 'Report To',
    //   isDisable: false,
    //   index: 0,
    //   width: 100,
    // },
  ];
  titlesData = [
    {
      name: 'Alex Dolmage',
      title: 'Administration - Recruiter',
      value: 0,
      employeeNumber: 3766,
      reportTOName: ''
    },
  ];

  employeeColumns = [
    {
      Name: 'header_1',
      isCheck: true,
      Text: 'Header-1',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'header_2',
      isCheck: true,
      Text: 'Header-2',
      isDisable: false,
      index: 0,
      width: 100,
    },
  ];
  employeeData = [
    {
      header_1: 'Branch',
      header_2: '',
    },
    {
      header_1: 'Department',
      header_2: '',
    },
    {
      header_1: 'Title',
      header_2: '',
    },
  ];

  branchColumns = [
    {
      Name: 'time',
      isCheck: true,
      Text: 'Time',
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
      width: 100,
    },
  ];
  jobData = [
  ];
  titlesSort: SortDescriptor[] = [];
  titlesSelections = [];
  approverSelections = [];
  skip: number = 0;
  employeeInfoColumns = [
    {
      Name: 'header_1',
      isCheck: true,
      Text: 'Header-1',
      isDisable: false,
      index: 0,
      width: 50,
    },
    {
      Name: 'header_2',
      isCheck: true,
      Text: 'Header-2',
      isDisable: false,
      index: 0,
      width: 150,
    },
  ];

  employeeInfoData = [{
    header_1: 'Approver',
    header_2: '',
  },
  {
    header_1: 'Branch',
    header_2: '',
  },
  {
    header_1: 'Dept',
    header_2: '',
  },
  {
    header_1: 'Title',
    header_2: '',
  },
  {
    header_1: 'Title2',
    header_2: '',
  },
  {
    header_1: 'Title3',
    header_2: '',
  },
  {
    header_1: 'Title4',
    header_2: '',
  },
  {
    header_1: 'Title5',
    header_2: '',
  },
  {
    header_1: 'Title6',
    header_2: '',
  },
  ];
  selectedEmployee: any = null;
  strTitle: any;
  reportingIssue: string;
  constructor(private dropdownService: DropdownService, private formBuilder: FormBuilder, private utility: UtilityService,
    public menuService: MenuService, public branchService: BranchService, public titleService: TitlesService) {
    if (localStorage.getItem('isAdmin') == 'true') {
    } else {
      this.menuService.checkUserBySubmoduleRights('Routing');
    }
  }

  ngOnInit(): void {
    this.getEmployees();
    // this.GetLoadApproverForTitle();
  }

  getEmployees() {
    this.dropdownService.GetEmployee().subscribe((res) => {
      if (res?.result?.length) {
        this.employees = [{ eeid: 'All', value: 'All' }, ...res.result];

      } else {
        this.employees = [];
      }
    });
  }
  GetBranch() {
    this.branchService.GetBranchDropdown().subscribe(
      (res) => {
        if (res) {
          this.branch = res;
          //this.branchData = res;
        }
      },
      // (error) => {
      //   this.onError(error, ErrorMessages.branch.dropdown);
      // }
    );
  }
  GetEEInfo() {
    this.titleService.GetEEInfo(this.selectedEmployee.id).subscribe((res) => {
      if (res?.length) {
        this.homeBranch = res[0].b;
        this.employeeData[0].header_2 = res[0].b;
        this.employeeData[1].header_2 = res[1].b;
        this.employeeData[2].header_2 = res[2].b;

        this.GetJobListingUsingEEBranch();
      } else {

      }
    });
  }
  GetEEInfoDetails() {
    this.titleService.GetEEInfoDetails(this.selectedEmployee.id).subscribe((res) => {
      if (res?.length) {
        this.employeeInfoData[0].header_2 = res[0].name;
        this.employeeInfoData[1].header_2 = res[0].employer;
        this.employeeInfoData[2].header_2 = res[0].department;
        this.employeeInfoData[3].header_2 = res[0].title;
        this.employeeInfoData[4].header_2 = res[1]?.title || "";
        this.employeeInfoData[5].header_2 = res[2]?.title || "";
        this.employeeInfoData[6].header_2 = res[3]?.title || "";
        this.employeeInfoData[7].header_2 = res[4]?.title || "";
      } else {

      }
    });
  }
  GetJobListingUsingEEBranch() {
    this.titleService.GetJobListingUsingEEBranch(this.homeBranch).subscribe((res) => {
      if (res?.length) {
        var lst = [];
        res.forEach(element => {
          lst.push({ branch: element.branch + ' - ' + element.time, time: element.time });
        });
        this.jobData = lst;
        setTimeout(() => {
          this.selectedBranch = "Home Branch";
        }, 700);
      } else {
        //this.employees = [];
      }
    });
  }
  GetLoadApproverForTitle() {
    this.titleService.GetLoadApproverForTitle().subscribe((res) => {
      if (res?.length) {
        this.titlesData = res;
      } else {
        this.titlesData = [];
      }
    });
  }
  GetTimeApprovalOverride() {
    this.titleService.GetTimeApprovalOverride().subscribe((res) => {
      if (res?.result?.length) {
        //this.employees = [{ eeid: 'All', value: 'All' }, ...res.result];
      } else {
        //this.employees = [];
      }
    });
  }
  onValueChange(event) {
    this.selectedEmployee = event;
    this.GetEEInfo();
    this.GetEEInfoDetails();
    //this.onBOMEmployeeValueChange(event);
    this.isEmpBtn = !this.isEmpBtn;
  }
  onValueJobChange(event) {
    this.homeBranch = event.branch.split('-')[0];
    this.getEEInfoUsingJob(event);
    //this.GetEEInfoDetails();
  }
  onBOMEmployeeValueChange(event) {
    var id = 0;
    if (event && event.id) {
      id = event.id;
      this.bomEmployee = event;
    }
    this.titleService.GetTitleList(id).subscribe((res) => {
      if (res?.length) {
        this.titlesData = res;
      } else {

      }
    });
  }
  onToggleEmployeeButton() {
    this.isEmpBtn = !this.isEmpBtn;
  }
  onToggleBranchButton() {
    this.isBranch = !this.isBranch;
  }

  onResizeColumn(event) { }

  onSelectionChange(event) { }

  onSortChange(event) { }

  onDataStateChange(event) { }

  onRefresh() {
    if (!this.bomEmployee) {
      this.onBOMEmployeeValueChange(null);
    } else {
      //var obj = { id: (this.selectedEmployee ? this.selectedEmployee.value : this.bomEmployee.eeid) }
      this.onBOMEmployeeValueChange(this.bomEmployee);
    }
  }

  public onTabSelect(e) {
    this.PORrouteClick.emit(e.title);
    if (e.title == 'POR Routing') {
      this.onBOMEmployeeValueChange(this.bomEmployee);
    }
  }
  public cellClickHandler({
    sender,
    rowIndex,
    columnIndex,
    dataItem,
    isEdited,
  }) {
    if (!isEdited && this.isEdit == false) {
      sender.editCell(rowIndex, columnIndex, this.createFormGroup(dataItem));
    } else {
      // dataItem.loadQty = 1;
    }
  }
  public createFormGroup(dataItem: any): FormGroup {
    return this.formBuilder.group({
      approvalValue: [
        dataItem.approvalValue,
        Validators.compose([
          Validators.required,
          Validators.pattern('^[0-9]{1,3}'),
        ]),
      ]
    });
  }
  public cellCloseHandler(args: any) {
    const { formGroup, dataItem } = args;
    if (formGroup.value.approvalValue) {
      dataItem.approvalValue = formGroup.value.approvalValue;
      var isItemExist = this.lstUpdatedItem.find(c => c.titlePK == dataItem.titlePK);
      if (isItemExist) {
        isItemExist.value = formGroup.value.approvalValue;
      } else {
        this.lstUpdatedItem.push(dataItem);
      }
    }
    // if (!formGroup.valid) {
    //   args.preventDefault();
    // } else if (formGroup.dirty) {
    //   if (!formGroup.value.approvalValue) {
    //     this.utility.toast.error(
    //       'Approval value should not be null.'
    //     );
    //   }
    //   else {
    //     if (dataItem.reportTo && this.isEdit == false) {
    //       var loadQty = {
    //         eeid: dataItem.eeid,
    //         employeeName: dataItem.employeeName,
    //         title: dataItem.title,
    //         reportTOName: dataItem.reportTOName,
    //         approvalValue: formGroup.value.approvalValue,
    //         reportTo: dataItem.reportTo
    //       };
    //       this.titleService.updateTitle([loadQty]).subscribe((res) => {
    //         this.onBOMEmployeeValueChange(this.bomEmployee); this.isEdit = true;
    //         this.utility.toast.success(res.message);
    //       });
    //     }
    //   }
    // }
  }
  public changeReportTo(dataItem, eeid) {
    var itm = this.employees;
    var isExist = itm.find(c => c.eeid == eeid);
    dataItem.reportTo = eeid;
    dataItem.reportTOName = isExist.value;
    var isItemExist = this.lstUpdatedItem.find(c => c.titlePK == dataItem.titlePK);
    if (isItemExist) {
      isItemExist.reportTo = eeid;
      isItemExist.reportTOName = isExist.value;
    } else {
      this.lstUpdatedItem.push(dataItem);
    }
    // if (!dataItem.approvalValue) {
    //   this.utility.toast.error(
    //     'Approval value should not be null.'
    //   );
    //   return false;
    // }
    // if (isExist) {
    //   this.titleService.updateTitle([dataItem]).subscribe((res) => {
    //     this.onBOMEmployeeValueChange(this.bomEmployee);
    //     this.utility.toast.success(res.message);
    //   });
    // } else {
    //   dataItem.reportTo = '';
    //   dataItem.reportTOName = ''; 
    // }
  }
  isEdit: boolean = true;
  btnEdit() {
    this.isEdit = false;
  }
  btnCancel() {
    this.isEdit = true; this.lstUpdatedItem = [];
    this.onBOMEmployeeValueChange(this.bomEmployee);
  }
  getEEInfoUsingJob(data) {
    var data1 = {
      time: data.time,
      branch: data.branch.split('-')[0].trim(),
      eeid: this.selectedEmployee.eeid
    }
    this.titleService.getEEInfoUsingJob(data1).subscribe((res) => {
      this.reportingIssue = res.message;
      if (res.result?.length) {
        if (res.result.length == 1) {

          this.strTitle = res.message;

          this.employeeInfoData[0].header_2 = res.result[0].name;

          this.employeeInfoData[1].header_2 = res.result[0].employer;

          this.employeeInfoData[2].header_2 = res.result[0]?.department || "(Account Manager)";

          this.employeeInfoData[3].header_2 = res.result[0]?.title || "";

          this.employeeInfoData[4].header_2 = "";

          this.employeeInfoData[5].header_2 = "";

          this.employeeInfoData[6].header_2 = "";

          this.employeeInfoData[7].header_2 = "";

        } else {

          this.strTitle = res.message;

          this.employeeInfoData[0].header_2 = res.result[0].name;

          this.employeeInfoData[1].header_2 = res.result[0].employer;

          this.employeeInfoData[2].header_2 = res.result[0].department;

          this.employeeInfoData[3].header_2 = res.result[0].title;

          this.employeeInfoData[4].header_2 = res.result[1]?.title || "";

          this.employeeInfoData[5].header_2 = res.result[2]?.title || "";

          this.employeeInfoData[6].header_2 = res.result[3]?.title || "";

          this.employeeInfoData[7].header_2 = res.result[4]?.title || "";

        }
      }
      else {

        this.employeeInfoData[0].header_2 = "";

        this.employeeInfoData[1].header_2 = "";

        this.employeeInfoData[2].header_2 = "";

        this.employeeInfoData[3].header_2 = "";

        this.employeeInfoData[4].header_2 = "";

        this.employeeInfoData[5].header_2 = "";

        this.employeeInfoData[6].header_2 = "";

        this.employeeInfoData[7].header_2 = "";

      }
    });

  }
  lstUpdatedItem: any = [];
  onSave() {
    var dataItem = [];
    var dataItemRejected = [];
    this.lstUpdatedItem.forEach(element => {
      if (element.reportTo && element.approvalValue) { dataItem.push(element); }
      else {
        dataItemRejected.push(element);
      }
    });
    if (dataItemRejected.length > 0) {
      this.utility.toast.error('Records will not be save which has Approval value or Report to name is blank.');
    }
    if (this.lstUpdatedItem.length > 0) {
      this.titleService.updateTitle(dataItem).subscribe((res) => {
        this.lstUpdatedItem = [];
        this.onBOMEmployeeValueChange(this.bomEmployee); this.isEdit = true;
        this.utility.toast.success(res.message);
      });
    } else {
      this.utility.toast.error('No data is edited to save. Try again.');
    }
  }
}
