import { Component, OnInit } from '@angular/core';
import { DropdownService } from 'src/app/core/services/dropdown.service';
import { JobReportService } from '../job-report/job-report.service';
import { saveAs } from 'file-saver';
import { process, SortDescriptor } from '@progress/kendo-data-query';

@Component({
  selector: 'app-job-report',
  templateUrl: './job-report.component.html',
  styleUrls: ['./job-report.component.scss'],
})
export class JobReportComponent implements OnInit {
  data: any = [];
  sort: SortDescriptor[] = [];
  selections: any = [];
  skip: number = 0;
  isAmVisible: boolean = false;
  am_btn: string = 'ALL';
  isBranchVisible: boolean = false;
  branch_btn: string = 'ALL';
  isStatusVisible: boolean = false;
  status_btn: string = 'ALL';
  visible: boolean = false;
  statusselections: any = [];
  AMselections: any = [];
  branchselections: any = [];
  selectedStatus: any = 'ALL';
  selectedAM: any = 'ALL';
  selectedBranch: any = 'ALL';
  filterStatus: any = '';
  filterAM: any = '';
  filterBranch: any = '';
  opened: boolean = false;
  statusData = [
    { name: 'ALL' },
    { name: 'Active' },
    { name: 'Open' },
    { name: 'Needs Bid' },
    { name: 'Proposed' },
  ];
  tempstatusData = this.statusData;
  amcolumns = [
    {
      Name: 'employeeNumber',
      isCheck: true,
      Text: 'EE#',
      isDisable: false,
      index: 1,
      width: 50,
    },
    {
      Name: 'name',
      isCheck: true,
      Text: 'Name',
      isDisable: false,
      index: 1,
      width: 50,
    },
  ];
  amData = [];
  tempamData = [];
  branchData = [];
  tempBranchData = [];
  branchColumns = [
    {
      Name: 'code',
      isCheck: true,
      Text: 'Code',
      isDisable: false,
      index: 1,
      width: 50,
    },
    {
      Name: 'value',
      isCheck: true,
      Text: 'Value',
      isDisable: false,
      index: 1,
      width: 50,
    },
  ];
  constructor(
    private service: JobReportService,
    private dropdownService: DropdownService
  ) {}

  ngOnInit(): void {
    // this.loadAMData();
    this.selectedBranch = 'All';
    this.loadBranchData();
  }

  loadAMData() {
    this.visible = false;
    this.visible = true;
    this.dropdownService.getAMEmployeeByBranch(this.selectedBranch).subscribe(
      (res) => {

        this.amData = res;
        if(this.selectedBranch == 'ALL')
        {
          this.amData.unshift({ name: 'ALL', employeeNumber: 0 });
        }
        this.amData = this.amData;
        this.tempamData = this.amData;
        this.visible = true;
        this.visible = false;
      },
      (error) => {
        this.visible = true;
        this.visible = false;
      }
    );
  }

  loadBranchData() {
    this.visible = false;
    this.visible = true;
    this.dropdownService.GetBranchList().subscribe(
      (result) => {
        this.branchData = this.tempBranchData = [
          { code: 'ALL', value: 'ALL' },
          ...result,
        ];
        this.tempBranchData = this.branchData;
        this.visible = true;
        this.visible = false;
        this.loadAMData();
      },
      (error) => {
        this.visible = true;
        this.visible = false;
      }
    );
  }

  onResizeColumn(event) {}

  onSortChange(event) {}

  onReOrderColumns(event) {}

  onDataStateChange(event) {}

  onRowSelect(event, name) {
    switch (name) {
      case 'status':
        this.status_btn = event.selectedRows?.[0]?.dataItem.name;
        this.selectedStatus = event.selectedRows?.[0]?.dataItem.name;
        this.isStatusVisible = false;
        break;
      case 'am':
        this.am_btn = event.selectedRows?.[0]?.dataItem.name;
        this.selectedAM =
          event.selectedRows?.[0]?.dataItem.employeeNumber == 0
            ? 'ALL'
            : event.selectedRows?.[0]?.dataItem.employeeNumber;
        this.isAmVisible = false;
        break;
      case 'branch':
        this.branch_btn = event.selectedRows?.[0]?.dataItem.value;
        this.selectedBranch = event.selectedRows?.[0]?.dataItem.code;
        this.loadAMData();
        this.isBranchVisible = false;
        break;
      default:
        break;
    }
  }

  onHandleDialog(type) {
    switch (type) {
      case 'status':
        this.isStatusVisible = !this.isStatusVisible;
        break;
      case 'am':
        this.isAmVisible = !this.isAmVisible;
        break;
      case 'branch':
        this.isBranchVisible = !this.isBranchVisible;
        break;
      default:
        break;
    }
  }

  ExportJobReport() {
    this.visible = false;
    this.visible = true;
    var request = {
      status: this.selectedStatus,
      am: this.selectedAM,
      branch: this.selectedBranch,
    };
    this.service.ExportJobReport(request).subscribe(
      (res) => {
        if (res == null) {
          this.visible = true;
          this.visible = false;
          this.opened = true;
        }
        if (res.size > 0 || res != null) {
          saveAs(res, 'JobReport.xlsx');
          this.filterAM = '';
          this.filterBranch = '';
          this.filterStatus = '';
          this.OnfilterAM(this.filterAM);
          this.OnfilterBranch(this.filterBranch);
          this.OnfilterStatus(this.filterStatus);
          this.AMselections =
            this.selectedAM == 'ALL'
              ? [0]
              : [
                  this.amData.findIndex(
                    (x) => x.employeeNumber == this.selectedAM
                  ),
                ];
          this.statusselections = [
            this.statusData.findIndex((x) => x.name == this.selectedStatus),
          ];
          this.branchselections = [
            this.branchData.findIndex((x) => x.code == this.selectedBranch),
          ];
          this.visible = true;
          this.visible = false;
        } else {
          this.visible = true;
          this.visible = false;
          this.opened = true;
        }
      },
      (error) => {
        this.visible = true;
        this.visible = false;
        this.opened = true;
      }
    );
  }

  OnfilterStatus(data: any) {
    this.filterStatus = data;
    this.statusData = process(this.tempstatusData, {
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

  OnfilterAM(data: any) {
    this.filterAM = data;
    this.amData = process(this.tempamData, {
      filter: {
        logic: 'or',
        filters: [
          {
            field: 'name',
            operator: 'contains',
            value: data,
          },
          {
            field: 'employeeNumber',
            operator: 'contains',
            value: data,
          },
        ],
      },
    }).data;
  }

  OnfilterBranch(data: any) {
    this.filterBranch = data;
    this.branchData = process(this.tempBranchData, {
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
          },
        ],
      },
    }).data;
  }
  openPopup() {
    this.opened = !this.opened;
  }
}
