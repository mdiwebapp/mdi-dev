import { Component, OnInit } from '@angular/core';
import {
  DataStateChangeEvent,
  GroupKey,
  GroupRowArgs,
  PageChangeEvent
} from '@progress/kendo-angular-grid';
import {
  orderBy,
  process,
  SortDescriptor,
  State,
} from '@progress/kendo-data-query';
import { LastInvoicedService } from './last-invoiced.service';
import { LastInvoicedRequestModel } from './last-invoiced.model';
import { DropdownService } from 'src/app/core/services/dropdown.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ErrorHandlerService, PagerService } from 'src/app/core/services';
import * as fileSaver from 'file-saver';
@Component({
  selector: 'app-last-invoiced',
  templateUrl: './last-invoiced.component.html',
  styleUrls: ['./last-invoiced.component.scss'],
})
export class LastInvoicedComponent implements OnInit {
  data: any = [];
  state: State = {
    group: [{ field: 'branchName' }, { field: 'accountManager' }],
  };
  selections: any = [];
  multiple: boolean = false;
  sort: SortDescriptor[] = [
    {
      field: 'projectNumber',
      dir: 'asc',
    },
    {
      field: 'projectStatus',
      dir: 'asc',
    },
    {
      field: 'custName',
      dir: 'asc',
    },
    {
      field: 'projectName',
      dir: 'asc',
    },
    {
      field: 'branchName',
      dir: 'asc',
    },
    {
      field: 'accountManager',
      dir: 'asc',
    },
    {
      field: 'jobValue',
      dir: 'asc',
    },
    {
      field: 'lastInvoiced',
      dir: 'asc',
    },
    {
      field: 'lastInvoicedAmount',
      dir: 'asc',
    },
    {
      field: 'totalInvoicedAmount',
      dir: 'asc',
    },
    {
      field: 'dateActivated',
      dir: 'asc',
    },
    {
      field: 'column1',
      dir: 'asc',
    },
    {
      field: 'laborCost',
      dir: 'asc',
    },
    {
      field: 'laborToRev',
      dir: 'asc',
    },
    {
      field: 'jobType',
      dir: 'asc',
    },
    {
      field: 'type',
      dir: 'asc',
    },
  ];

  expandedGroupKeys: Array<GroupKey> = [];
  selectedTicket: any = null;
  jobsColums: any = [
    {
      Name: 'projectNumber',
      isCheck: true,
      Text: 'Project Number',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'projectStatus',
      isCheck: true,
      Text: 'Project Status',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'custName',
      isCheck: true,
      Text: 'Customer Name',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'projectName',
      isCheck: true,
      Text: 'Project Name',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'branchName',
      isCheck: true,
      Text: 'Branch',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'accountManager',
      isCheck: true,
      Text: 'Account Manager',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'jobValue',
      isCheck: true,
      Text: 'Job Value',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'column3',
      isCheck: true,
      Text: 'Last Invoiced',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'lastinvoicedAmount',
      isCheck: true,
      Text: 'Last Invoiced Amount',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'totalinvoiceAMount',
      isCheck: true,
      Text: 'Total Invoice Amount',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'dateActivated',
      isCheck: true,
      Text: 'Activated Date',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'column5',
      isCheck: true,
      Text: 'Last Worked Date',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'laborCost',
      isCheck: true,
      Text: 'Labor Cost',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'laborToRev',
      isCheck: true,
      Text: 'Labor To Rev',
      isDisable: false,
      index: 0,
      width: 100,
    },

    {
      Name: 'jobType',
      isCheck: true,
      Text: 'Project Type',
      isDisable: false,
      index: 0,
      width: 100,
    },
  ];
  lastInvoicedForm: FormGroup;
  jobs: any = [];
  groupData: any = [];
  groupcolumn: any = [];
  group: any = [];
  group_by_filter_btn: string = 'All';
  isGroupVisible: boolean = false;
  rowSticky: any = [];
  initiallyExpanded = false;
  lastInvoicedRequestModel: LastInvoicedRequestModel;
  customer: any = [];
  customerData:any;
  branchData:any;
  branch: any = [];
  selectedAM: string;
  selectedBranch: string;
  searchText: string;
  expandAll: boolean = false;
  visible:boolean ;
  public totalData: number = 0;
  public pageSize = 100;
  public skip = 0;
  pageNumber = 1;
  empData :any;
  tempEmployee:any;
  pageSizeList: any = [
    { id: 0, value: 100 },
    { id: 0, value: 300 },
    { id: 0, value: 500 },
  ];
  constructor(
    public lastInvoicedService: LastInvoicedService,
    public dropdownService: DropdownService,
    private formBuilder: FormBuilder,
    public pagerService: PagerService,
  ) {}

  ngOnInit(): void {
    this.onInitLastInvoicedForm();
    this.jobs = this.data;
    this.selectedAM = '%';
    this.selectedBranch = '%';
    this.getAM();
    this.getBranch();
    this.getGridData();
  }
  onInitLastInvoicedForm() {
    this.lastInvoicedForm = this.formBuilder.group({
      description: [],
    });
  }
  onResizeColumn(event) {}

  onRowSelect(event) {}

  onSortChange(sort: SortDescriptor[]) {
    // this.sort = sort;
    // if(this.expandAll)
    // {
    //   this.jobs = orderBy(this.data, sort);
    // }
    // else
    // {
    //   this.jobs = orderBy(this.jobs, sort);
    // }
    if(this.expandAll)
    {
      this.sort = sort;
      this.empData = {
        data: orderBy(this.tempEmployee, this.sort),
        total: this.tempEmployee.length,
      };
      this.jobs = this.empData.data;
    }
    else
    {
      this.sort = sort;
      this.empData = {
        data: orderBy(this.tempEmployee, this.sort),
        total: this.tempEmployee.length,
      };
      this.jobs = this.empData.data;
    }
   
  }

  onReOrderColumns(event) {}

  onDataStateChange(state: DataStateChangeEvent) {
    this.state = state;
    this.jobs = process(this.data, this.state);
  }

  groupChange() {}

  onGroupChange(event) {
    this.expandAll = event.target.checked;
    if (this.expandAll) {
      this.jobs = this.data;
      this.empData = this.jobs;
      this.tempEmployee = this.jobs;
    } else {
      this.jobs = process(this.data, this.state);
      this.empData = this.jobs;
      this.tempEmployee = this.jobs;
    }
  }

  onHandleFilters(value) {
    switch (value) {
      case 'group':
        this.isGroupVisible = !this.isGroupVisible;
        break;
      default:
        break;
    }
  }

  public isGroupExpanded = (rowArgs: GroupRowArgs): boolean => {
    const matchKey = this.expandedGroupKeys.some(
      (groupKey) =>
        groupKey.field === rowArgs.group.field &&
        groupKey.value === rowArgs.group.value
    );

    return (
      (this.initiallyExpanded && !matchKey) ||
      (!this.initiallyExpanded && matchKey)
    );
  };

  toggleGroup(rowArgs: GroupRowArgs): void {
    const keyIndex = this.expandedGroupKeys.findIndex(
      (groupKey) =>
        groupKey.field === rowArgs.group.field &&
        groupKey.value === rowArgs.group.value
    );

    if (keyIndex === -1) {
      this.expandedGroupKeys.push({
        field: rowArgs.group.field,
        value: rowArgs.group.value,
      });
    } else {
      this.expandedGroupKeys.splice(keyIndex, 1);
    }
  }

  onExpandAll(event) {
    this.initiallyExpanded = event.target.checked ? true : false;
    this.expandedGroupKeys = [];
  }

  //#region Bind Grid
  createLastInvoicedRequestModel() {
    this.lastInvoicedRequestModel = new LastInvoicedRequestModel();
    this.lastInvoicedRequestModel.AM = this.selectedAM;
    this.lastInvoicedRequestModel.Branch = this.selectedBranch;
    this.lastInvoicedRequestModel.PageNumber = this.pagerService.start;
    this.lastInvoicedRequestModel.PageSize = this.pageSize ;
    // this.lastInvoicedRequestModel.SortColumn;
    this.lastInvoicedRequestModel.SortDesc = true;
    this.lastInvoicedRequestModel.Search = this.searchText;
  }

  getGridData() {
    this.visible = false;
    this.visible = true;
    this.createLastInvoicedRequestModel();
    this.lastInvoicedService
      .getLastInvoiced(this.lastInvoicedRequestModel)
      .subscribe((res) => {
      if(res.length > 0)
      {
        if(this.expandAll)
        {
          console.log(this.expandAll);
          this.totalData = res[0].totalRecords;
            this.jobs = res;
            this.data = res;
            this.visible = true;
            this.visible = false;
            this.tempEmployee = this.data;
            this.empData = this.data;
        }
        else
        {
          this.totalData = res[0].totalRecords;
          this.jobs = res;
          this.data = res;
          this.jobs = process(this.data, this.state);
          this.visible = true;
          this.visible = false;
          this.tempEmployee = this.jobs;
          this.empData = this.jobs;
        }
      }
      else
      {
        this.jobs = [];
        this.data = [];
        this.totalData = 0;
        this.visible = true;
        this.visible = false;
      }
       
      });
  }
  //#endregion

  //#region Change Events
  onAMValueChange(event) {
    this.selectedAM = event;
    if(this.selectedAM == "0" || this.selectedAM == "All" || this.selectedAM === undefined)
    {
      this.selectedAM = '%';
    }
    this.getGridData();
  }
  onBranchValueChange(event) {
    this.selectedBranch = event;
    if(this.selectedBranch == "0" || this.selectedBranch == "All" || event === undefined)
    {
      this.selectedBranch = '%';
    }
    this.getGridData();
  }
  //#endregion

  //#region
  getAM() {
    this.dropdownService.getAmEmployee().subscribe((res) => {
      this.customer = res;
      this.customer.unshift({ name: 'All', employeeNumber: 'All', value: 'All' });
      this.customer = this.customer;
      this.customerData = res;
    });
  }
  getBranch() {
    this.dropdownService.GetBranchList().subscribe((res) => {
      this.branch = res;
      var index = this.branch.findIndex((c) => c.value == 'SSG');
      this.branch.splice(index, 1);
      this.branch.unshift({ code: 'All', id: 0, value: 'All' });
      this.branch = this.branch;
      this.branchData = this.branch;
    });
  }
  //#endregion
  //#region
  onSearchClick() {
      this.searchText = this.lastInvoicedForm.get('description').value;
      this.getGridData();
  }
  public onPageChange(e: PageChangeEvent): void {
    this.skip = e.skip;
    this.pageSize = e.take;
    this.pagerService.start =
      this.skip == 0 ? 0 : (this.skip / this.pageSize + 1);
      if(this.pagerService.start == 0)
      {
        this.pagerService.start = 1;
      }

    this.getGridData();
  }
  onPageSizechange(pagesize) {
    this.pageSize = pagesize;
    this.getGridData();
  }
  //#endregion

  //#region Export To Excel
  exportToExcel() {
    this.lastInvoicedService.exportToExcel(this.lastInvoicedRequestModel).subscribe(
      (res) => {

        if(res.size> 0)
        {
          let data = new Blob([res], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;',
          });
          fileSaver.saveAs(
            data,
            'LastInvoiced' + new Date().toLocaleDateString('en-US') + '.xlsx'
          );
          this.visible = true;
          this.visible = false;
        }
        else{
          this.visible = true;
          this.visible = false;
        }

        
      }
    )
  }
  //#endregion

  employeehandleFilter(value) {
    this.customer = this.customerData.filter(
      (s) => s.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }
  branchHandleFilter(value)
  {
    this.branch = this.branchData.filter(
      (s)=>s.value.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }
}
