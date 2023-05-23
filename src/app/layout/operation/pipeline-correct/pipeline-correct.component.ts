import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { GroupKey, PageChangeEvent } from '@progress/kendo-angular-grid';
import {
  process,
  SortDescriptor,
  State,
  orderBy,
} from '@progress/kendo-data-query';
import moment from 'moment';
import { DataService } from 'src/app/core/services';
import { DropdownService } from 'src/app/core/services/dropdown.service';
import { PaginationWithSortRequest } from 'src/app/core/models/pagination.model';
import { PagerService } from 'src/app/core/services/pager.service';
import { PipelineCorrectService } from '../pipeline-correct/pipeline-correct.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { saveAs } from 'file-saver';
import { DatePipe } from '@angular/common';
import { MenuService } from 'src/app/core/helper/menu.service';

@Component({
  selector: 'app-pipeline-correct',
  templateUrl: './pipeline-correct.component.html',
  styleUrls: ['./pipeline-correct.component.scss'],
})
export class PipelineCorrectComponent implements OnInit {
  pipelineFilterOptions: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'startsWith',
  };
  pageSizeList: any = [
    { id: 0, value: 100 },
    { id: 0, value: 300 },
    { id: 0, value: 500 },
  ];
  checkDate: Date = new Date(2022, 12, 11);
  tempjobs: any[];
  public totalData = 0;
  public pageSize = 100;
  public skip = 0;
  public pageNumber = 1;
  visible: boolean;
  tempPageNo: number;
  searchText: string = '';
  Logs: string = '';
  request = new PaginationWithSortRequest<any>();
  branch: string = '';
  AM: string = '';
  // data: any = [
  //   {
  //     branch: 'Atlanta',
  //     am: 'Richard Eady Jr',
  //     alertDesc: 'Project Value may be to low.',
  //     jobNumber: '40820',
  //     jobName: 'GA Savannah',
  //     estValue: '$800.00',
  //     invoiced: '$840.00',
  //     estStartDate: moment().format('MM/DD/YYYY'),
  //     estEndDate: moment().format('MM/DD/YYYY'),
  //     customerName: 'Vortex Companies LLC',
  //     jobStatus: 'Active',
  //     closeJob: false,
  //   },
  //   {
  //     branch: 'Baltimore',
  //     am: 'Ryan Keadle',
  //     alertDesc: 'Start Date has passed',
  //     jobNumber: '47484',
  //     jobName: 'Hurlock Waterwaste',
  //     estValue: '$2400.00',
  //     invoiced: '$2200.00',
  //     estStartDate: moment().format('MM/DD/YYYY'),
  //     estEndDate: moment().format('MM/DD/YYYY'),
  //     customerName: 'Planholders List',
  //     jobStatus: 'Active',
  //     closeJob: false,
  //   },
  // ];
  data: any = [];
  corrections: any = [];
  multiple: boolean = false;
  jobNumber: any;
  jobStatus: any;
  opened: boolean = false;
  closeevent: any;
  closeactiveevent: any;
  public sort: SortDescriptor[] = [
    {
      field: 'branchName',
      dir: 'asc',
    },
    {
      field: 'am',
      dir: 'asc',
    },
    {
      field: 'alertDesc',
      dir: 'asc',
    },
    {
      field: 'jobNumber',
      dir: 'asc',
    },
    {
      field: 'jobName',
      dir: 'asc',
    },
    {
      field: 'estValue',
      dir: 'asc',
    },
    {
      field: 'invoiced',
      dir: 'asc',
    },
    {
      field: 'estStartDate',
      dir: 'asc',
    },
    {
      field: 'estEndDate',
      dir: 'asc',
    },
    {
      field: 'custName',
      dir: 'asc',
    },
    {
      field: 'jobStatus',
      dir: 'asc',
    },
  ];
  columns: any = [
    {
      Name: 'branchName',
      isCheck: true,
      Text: 'Branch',
      isDisable: false,
      index: 0,
      width: 100,
      hide: true,
    },
    {
      Name: 'am',
      isCheck: true,
      Text: 'AM',
      isDisable: false,
      index: 0,
      width: 100,
      hide: true,
    },
    {
      Name: 'alertDesc',
      isCheck: true,
      Text: 'Alert Desc',
      isDisable: false,
      index: 0,
      width: 100,
      hide: true,
    },
    {
      Name: 'jobNumber',
      isCheck: true,
      Text: 'Job Number',
      isDisable: false,
      index: 0,
      width: 100,
      hide: true,
    },
    {
      Name: 'jobName',
      isCheck: true,
      Text: 'Job Name',
      isDisable: false,
      index: 0,
      width: 100,
      hide: true,
    },
    {
      Name: 'estValue',
      isCheck: true,
      Text: 'Est. Value',
      isDisable: false,
      index: 0,
      width: 100,
      hide: true,
    },
    {
      Name: 'invoiced',
      isCheck: true,
      Text: 'Invoiced',
      isDisable: false,
      index: 0,
      width: 100,
      hide: true,
    },
    {
      Name: 'estStartDate',
      isCheck: true,
      Text: 'Est. Start Date',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'objestStartDate',
      isCheck: true,
      Text: 'Est. Start Date',
      isDisable: false,
      index: 0,
      width: 100,
      hide: true,
    },
    {
      Name: 'estEndDate',
      isCheck: true,
      Text: 'Est. End Date',
      isDisable: false,
      index: 0,
      width: 100,
      hide: true,
    },
    {
      Name: 'objestEndDate',
      isCheck: true,
      Text: 'Est. End Date',
      isDisable: false,
      index: 0,
      width: 100,
      hide: true,
    },
    {
      Name: 'custName',
      isCheck: true,
      Text: 'Customer Name',
      isDisable: false,
      index: 0,
      width: 100,
      hide: true,
    },
    {
      Name: 'jobStatus',
      isCheck: true,
      Text: 'Job Status',
      isDisable: false,
      index: 0,
      width: 100,
      hide: true,
    },
    {
      Name: 'objestValue',
      isCheck: true,
      Text: 'Job Status',
      isDisable: false,
      index: 0,
      width: 100,
      hide: true,
    },
  ];
  selections: any = [];
  isgroupData: boolean = false;
  activejob: boolean = false;
  state: State = {
    group: [{ field: 'branchName' }, { field: 'am' }],
  };
  filterForm: FormGroup;
  branches: any = [];
  allBranches: any = [];
  accounts: any = [];
  allAccounts: any = [];
  expandedGroupKeys: Array<GroupKey> = [];
  isDisable: boolean = true;
  isPrint: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private dropdownService: DropdownService,
    public pagerService: PagerService,
    public service: PipelineCorrectService,
    private utility: UtilityService,
    public datepipe: DatePipe,
    public menuService: MenuService
  ) {
    this.corrections = this.data;
    if (localStorage.getItem('isAdmin') == 'true') {
    } else {
      let acc = this.menuService.checkUserViewRights('Pipeline Correct');
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
      }
    }
  }

  ngOnInit(): void {
    this.onInitFilterForm();
    this.pagerService.start = this.pageNumber;
    this.loadPipelinecorrectData();
    this.onLoadBranches();
    this.onLoadAccounts();
  }

  loadPipelinecorrectData() {
    this.data = [];
    this.corrections = [];
    this.visible = false;
    this.visible = true;
    var filter = {
      branch: this.branch || '',
      AM: this.AM || '',
      searchText: this.searchText,
    };
    this.request.pageNumber = this.pagerService.start;
    this.request.pageSize = this.pageSize;
    this.request.sortColumn = this.sort[0].field;
    this.request.sortDesc = this.sort[0].dir == 'desc' ? true : false;
    this.request.request = filter;
    this.service.GetPipelineCorrectData(this.request).subscribe(
      (res) => {
        if (res.totalRecords > 0) {
          if (!this.isgroupData) {
            this.totalData = res.totalRecords;
            this.corrections = res.data.map((x) => {
              return {
                objestEndDate: new Date(x.estEndDate),
                objestStartDate: new Date(x.estStartDate),
                objestValue:
                  x.estValue != null ? parseFloat(x.estValue.toFixed(2)) : null,
                ...x,
              };
            });
            this.data = res.data.map((x) => {
              return {
                objestEndDate: new Date(x.estEndDate),
                objestStartDate: new Date(x.estStartDate),
                objestValue:
                  x.estValue != null ? parseFloat(x.estValue.toFixed(2)) : null,
                ...x,
              };
            });
            // this.corrections = res.data;
            // this.data = res.data;
            this.visible = true;
            this.visible = false;
          } else {
            this.data = res.data.map((x) => {
              return {
                objestEndDate: new Date(x.estEndDate),
                objestStartDate: new Date(x.estStartDate),
                objestValue:
                  x.estValue != null ? parseFloat(x.estValue.toFixed(2)) : null,
                ...x,
              };
            });
            this.corrections = process(this.data, this.state);
            this.totalData = res.totalRecords;
            this.visible = true;
            this.visible = false;
          }
        } else {
          this.corrections = [];
          this.data = [];
          this.totalData = 0;
          this.visible = true;
          this.visible = false;
        }
      },
      (error) => {
        this.visible = true;
        this.visible = false;
      }
    );
  }

  onResizeColumn($event) {}

  onSelectionChange($event) {}

  onSortChange(sort: SortDescriptor[]) {
    this.sort = sort;
    // this.corrections = orderBy(this.corrections, sort);
    this.loadPipelinecorrectData();
  }
  onReOrderColumns(event) {}

  onDataStateChange(event) {}

  groupChange() {}

  onInitFilterForm() {
    this.filterForm = this.formBuilder.group({
      branch: '',
      account: '',
    });
  }

  onLoadBranches() {
    this.dropdownService.GetBranchList().subscribe((result) => {
      if (result) {
        this.branches = this.allBranches = [
          { code: 'ALL', value: 'All' },
          ...result,
        ];
      }
    });
  }

  onLoadAccounts() {
    this.dropdownService.getAmEmployee().subscribe((result) => {
      if (result) {
        this.accounts = this.allAccounts = [
          { employeeNumber: 'ALL', name: 'All' },
          ...result,
        ];
      }
    });
  }

  onGroupUnGroupBranch(event) {
    if (event) {
      // this.corrections = process(this.data, this.state);
      this.isgroupData = true;
    } else {
      // this.corrections = this.data;
      this.isgroupData = false;
    }
    this.loadPipelinecorrectData();
  }

  public onPageChange(e: PageChangeEvent): void {
    this.skip = e.skip;
    this.pageSize = e.take;
    this.pagerService.start =
      this.skip == 0 ? 0 : this.skip / this.pageSize + 1;
    if (this.pagerService.start == 0) {
      this.pagerService.start = 1;
    }
    this.tempPageNo = this.pagerService.start;
    //this.skip = event.skip;
    this.loadPipelinecorrectData();
  }

  onPageSizechange(pagesize) {
    this.pageSize = pagesize;
    this.pagerService.start =
      Math.floor(this.skip == 0 ? 0 : this.skip / this.pageSize) + 1;
    this.loadPipelinecorrectData();
  }

  onSearchPipelineData(data: any) {
    this.searchText = data;
    this.loadPipelinecorrectData();
  }

  onCloseJob(jobNumber: any, jobStatus: any, data: any) {
    if (data.target.checked) {
      this.closeevent = data;
      this.opened = true;
      this.jobNumber = jobNumber;
      this.jobStatus = jobStatus;
    }
  }

  onCloseActiveJob(data: any) {
    this.activejob = true;
    this.closeactiveevent = data;
  }

  closeactivejob() {
    this.activejob = false;
    this.closeactiveevent.target.checked = false;
  }

  ExportExcel() {
    this.visible = false;
    this.visible = true;
    var data = {
      branch: this.branch,
      AM: this.AM,
      searchText: this.searchText,
    };
    this.service.ExporttoExcel(data).subscribe(
      (res) => {
        if (res.size > 0) {
          saveAs(res, 'PipeLineCorrectionReport.xlsx');
          this.visible = true;
          this.visible = false;
        } else {
          this.visible = true;
          this.visible = false;
        }
      },
      (error) => {
        console.log('Something went wrong');
      }
    );
  }

  public close(data) {
    if (data == 'yes') {
      this.visible = false;
      this.visible = true;
      var Request = {
        jobNumber: this.jobNumber,
        userName: JSON.parse(localStorage.getItem('currentUser')).userName,
      };
      this.service.CloseJob(Request).subscribe(
        (res) => {
          if (res['status'] == 200) {
            this.Logs = this.Logs + res.message + '\n';
            this.loadPipelinecorrectData();
          } else {
            this.utility.toast.error(res['message']);
          }
          this.jobNumber = null;
          this.jobStatus = null;
          this.opened = false;
          this.visible = true;
          this.visible = false;
        },
        (error) => {
          this.visible = true;
          this.visible = false;
        }
      );
    }
    if (data == 'no') {
      this.jobNumber = null;
      this.jobStatus = null;
      this.closeevent.target.checked = false;
      this.opened = false;
    }
    if (data == 'cancel') {
      this.jobNumber = null;
      this.jobStatus = null;
      this.opened = false;
      this.closeevent.target.checked = false;
    }
  }

  onBranchChange(data: any) {
    this.branch = data?.code;
    this.loadPipelinecorrectData();
  }

  onAccountChange(data: any) {
    this.AM = data?.name;
    this.loadPipelinecorrectData();
  }

  onChangeDetail(jobNumber: any, startDate: any, endDate: any, estValue: any) {
    this.visible = false;
    this.visible = true;
    var request = {
      jobNumber: jobNumber,
      estValue: estValue,
      estStartDate: this.datepipe.transform(startDate, 'MM/dd/yyyy'),
      estEndDate: this.datepipe.transform(endDate, 'MM/dd/yyyy'),
      userName: JSON.parse(localStorage.getItem('currentUser')).userName,
    };
    this.service.ChangePipelineCorrectDetail(request).subscribe(
      (res) => {
        if (res['status'] == 200) {
          this.utility.toast.success(res['message']);
          this.visible = true;
          this.visible = false;
          this.Logs = this.Logs + res['message'] + '\n';
          this.loadPipelinecorrectData();
        } else {
          this.utility.toast.error(res['message']);
          this.visible = true;
          this.visible = false;
        }
      },
      (error) => {
        this.visible = true;
        this.visible = false;
      }
    );
  }
}
