import { Component, OnInit } from '@angular/core';
import { SortDescriptor, process } from '@progress/kendo-data-query';
import { JobCostingService } from './job-costing.service';
import { JobCostingViewRequestModel } from './job-costing.model';
import { PageChangeEvent } from '@progress/kendo-angular-grid';
import * as fileSaver from 'file-saver';
import { UtilityService } from 'src/app/core/services/utility.service';
import { MenuService } from 'src/app/core/helper/menu.service';
import { ErrorHandlerService } from 'src/app/core/services';

@Component({
  selector: 'app-job-costing',
  templateUrl: './job-costing.component.html',
  styleUrls: ['./job-costing.component.scss'],
})
export class JobCostingComponent implements OnInit {
  data: any = [];
  sort: SortDescriptor[] = [];
  selections: any = [];
  skip: number = 0;
  isJobVisible: boolean = false;
  jobs_btn: string = '';
  jobsColumns: any = [
    {
      Name: 'jobNumber',
      isCheck: true,
      Text: 'Ticket No',
      isDisable: false,
      index: 0,
      width: 50,
    },
    {
      Name: 'jobName',
      isCheck: true,
      Text: 'Description',
      isDisable: false,
      index: 0,
      width: 100,
    },
  ];
  jobData: any = [];
  filterJobCosting: any;
  tempJobCosting: any;
  gettempJobCosting: any;
  visible: boolean;
  filterJobcostingData: string = '';
  public pageSize = 100;
  public pageNumber = 1;
  public currentPage = 1;
  tempPageNo: number;
  pageSizeList: any = [
    { id: 0, value: 100 },
    { id: 0, value: 300 },
    { id: 0, value: 500 },
  ];
  jobCostingViewRequestModel: JobCostingViewRequestModel;
  public totalData = 0;
  constructor(
    public jobCostingService: JobCostingService,
    public menuService: MenuService,
    private utility: UtilityService,
    public errorHandler: ErrorHandlerService
  ) {
    if (localStorage.getItem('isAdmin') == 'true') {
    } else {
      let acc = this.menuService.checkUserViewRights('Job Costing');
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
    this.getJobCostingList();
  }
  onResizeColumn(event) {}
  private onError(error: any, customMessage?: string) {
    this.errorHandler.handleError(error, 'Document search', customMessage);
  }
  onSortChange(event) {}

  onReOrderColumns(event) {}

  onDataStateChange(event) {}

  onRowSelect(event, type) {
    switch (type) {
      case 'jobs':
        this.jobs_btn = event.selectedRows?.[0]?.dataItem.jobNumber;
        this.isJobVisible = false;
        this.exportToExcel();
        break;
      default:
        break;
    }
  }

  onHandleDialog(type) {
    switch (type) {
      case 'job':
        this.isJobVisible = !this.isJobVisible;
        if (this.isJobVisible == false) {
          this.filterJobcostingData = '';
          this.OnFilterJobCostData();
        }
        break;
      default:
        break;
    }
  }

  OnFilterJobCostData() {
    this.visible = false;
    this.visible = true;
    this.jobCostingViewRequestModel = new JobCostingViewRequestModel();
    this.skip = 0;
    this.jobCostingViewRequestModel.PageNumber = 1;
    this.jobCostingViewRequestModel.PageSize = this.pageSize;
    this.jobCostingViewRequestModel.SearchText = this.filterJobcostingData;
    this.jobCostingService
      .getjobCostingList(this.jobCostingViewRequestModel)
      .subscribe((res) => {
        if (res.length > 0) {
          this.jobData = res;
          this.tempJobCosting = res;
          this.totalData = res[0].totalRecords;
          this.visible = true;
          this.visible = false;
        } else {
          this.jobData = res;
          this.totalData = 0;
          this.visible = true;
          this.visible = false;
        }
      });
  }

  getJobCostingList() {
    this.visible = false;
    this.visible = true;
    this.createjobCostingViewRequestModel();
    this.jobCostingService
      .getjobCostingList(this.jobCostingViewRequestModel)
      .subscribe(
        (res) => {
          if (res.length > 0) {
            this.jobData = res;
            this.tempJobCosting = res;
            this.totalData = res[0].totalRecords;
            this.visible = true;
            this.visible = false;
          } else {
            this.visible = true;
            this.visible = false;
          }
        },
        (error) => {
          this.onError(error, 'Error getting Doc. Search data.');
        }
      );
  }
  exportToExcel() {
    this.visible = false;
    this.visible = true;
    this.jobCostingService.exportToExcel(this.jobs_btn).subscribe((res) => {
      if (res.size > 0) {
        let data = new Blob([res], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;',
        });
        fileSaver.saveAs(
          data,
          'JobCosting' + new Date().toLocaleDateString('en-US') + '.xlsx'
        );
        this.visible = true;
        this.visible = false;
        this.filterJobcostingData = '';
        this.getJobCostingList();
      } else {
        this.visible = true;
        this.visible = false;
      }
    });
    this.selections = [];
    this.jobs_btn = '';
  }
  public onFilterJobCosting(inputValue: string): void {
    this.filterJobCosting = process(this.tempJobCosting, {
      filter: {
        logic: 'or',
        filters: [
          {
            field: 'jobNumber',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'jobName',
            operator: 'contains',
            value: inputValue,
          },
        ],
      },
    }).data;

    this.jobData = this.filterJobCosting;
  }
  public onPageChange(e: PageChangeEvent): void {
    this.skip = e.skip;
    this.pageSize = e.take;
    this.jobCostingViewRequestModel.PageNumber =
      this.skip == 0 ? 0 : this.skip / this.pageSize + 1;
    if (this.jobCostingViewRequestModel.PageNumber == 0) {
      this.jobCostingViewRequestModel.PageNumber = 1;
    }
    this.jobCostingViewRequestModel.PageSize = this.pageSize;
    this.pageNumber = this.jobCostingViewRequestModel.PageNumber;
    // this.currentPage = this.pageNumber;
    //this.skip = event.skip;
    this.getJobCostingList();
  }
  onPageSizechange(pagesize) {
    this.pageSize = pagesize;
    this.jobCostingViewRequestModel.PageNumber = 1;
    this.skip = 0;
    this.jobCostingViewRequestModel.PageSize = this.pageSize;
    this.getJobCostingList();
  }

  createjobCostingViewRequestModel() {
    this.jobCostingViewRequestModel = new JobCostingViewRequestModel();
    this.jobCostingViewRequestModel.PageNumber = this.pageNumber;
    this.jobCostingViewRequestModel.PageSize = this.pageSize;
    this.jobCostingViewRequestModel.SearchText = this.filterJobcostingData;
  }
}
