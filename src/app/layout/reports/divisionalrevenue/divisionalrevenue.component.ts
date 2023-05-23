import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DivisionalRevenueService } from './divisionalrevenue.service';
import {
  DivisionalRevenueModel,
  DivisionalRevenueViewModel,
  DivisionalRevenueEeidModel,
  DivisionalRevenueDateModel,
} from './divisionalrevenue.model';
import {
  DashType,
  LegendLabelsContentArgs,
  SeriesLabels,
  ValueAxisLabels,
} from '@progress/kendo-angular-charts';
import {
  groupBy,
  GroupResult,
  process,
  State,
  SortDescriptor,
  orderBy,
} from '@progress/kendo-data-query';
import { IntlService } from '@progress/kendo-angular-intl';
import { UtilityService } from 'src/app/core/services/utility.service';
import { DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { BranchService } from '../../admin/branch/branch.service';
import { MenuService } from 'src/app/core/helper/menu.service';
import { Router } from '@angular/router';
import * as fileSaver from 'file-saver';
import { ModuleNames, ErrorMessages } from 'src/app/core/constant';
import { ErrorHandlerService } from 'src/app/core/services';

@Component({
  selector: 'app-divisionalrevenue',
  templateUrl: './divisionalrevenue.component.html',
  styleUrls: ['./divisionalrevenue.component.scss'],
})
export class DivisionalRevenueComponent implements OnInit {
  public data: any;
  level1ByPassDevision: DivisionalRevenueViewModel[] = [];
  level1DewateringDevision: DivisionalRevenueViewModel[] = [];
  isLevel1DataLoad: boolean = true;
  public dashType: DashType = 'solid';
  breadcrumb = [
    { text: 'Division', id: 0 },
    { text: '', id: 0 },
    { text: '', id: 0 },
  ];
  public sortInventory: SortDescriptor[] = [
    {
      field: 'inventoryType',
      dir: 'asc',
    },
    {
      field: 'description',
      dir: 'asc',
    },
    {
      field: 'inventoryType',
      dir: 'asc',
    },
    {
      field: 'tranDate',
      dir: 'asc',
    },
    {
      field: 'direction',
      dir: 'asc',
    },
    {
      field: 'invoiceDate',
      dir: 'asc',
    },
    {
      field: 'quantity',
      dir: 'asc',
    },
  ];
  public sortLabor: SortDescriptor[] = [
    {
      field: 'workDate',
      dir: 'asc',
    },
    {
      field: 'ee',
      dir: 'asc',
    },
    {
      field: 'laborType',
      dir: 'asc',
    },
    {
      field: 'totalHours',
      dir: 'asc',
    },
  ];
  public sortInvoice: SortDescriptor[] = [
    {
      field: 'invoiceNumber',
      dir: 'asc',
    },
    {
      field: 'transType',
      dir: 'asc',
    },
    {
      field: 'invoiceDate',
      dir: 'asc',
    },
    {
      field: 'qty',
      dir: 'asc',
    },
    {
      field: 'openBalance',
      dir: 'asc',
    },
    {
      field: 'lineTotal',
      dir: 'asc',
    },
  ];
  reportTitle: string;
  level2Devision: GroupResult[];
  level2Categories: any;
  selectedLevel2Model: DivisionalRevenueModel;
  selectedLevel1Model: DivisionalRevenueModel;
  selectedchart: number = 1;
  pieChartHeader: any;
  level3GridData: any;
  gridData: any;
  templevel2Devision: any;
  branch: any;
  selectedLevel3Model: DivisionalRevenueEeidModel;
  dateModel: DivisionalRevenueDateModel;
  AlljobType: any;
  selectedRegion: any;
  @Input() displayRegion: boolean;
  displayYtd: boolean;
  selectedSection: any = 'Invoiced';
  displayInvoicedSec: boolean = true;
  displayLaborSec: boolean = false;
  displayInventorySec: boolean = false;
  isVisible: boolean = false;
  level2Data: any;
  JobId = 'All';
  jobDetails = { dataItem: { job: '' } };
  selectedJob: any;
  selectedCustomer: any;
  reportTitle2: any;
  reportTitle3: string;
  sumOfLineTotal: number;
  getmonth: any;
  constructor(
    public service: DivisionalRevenueService,
    public branchService: BranchService,
    private intl: IntlService,
    public utils: UtilityService,
    public menuService: MenuService,
    public router: Router,
    public errorHandler: ErrorHandlerService
  ) {
    if (localStorage.getItem('isAdmin') != 'true') {
      this.menuService.checkUserBySubmoduleRights('Divisional Revenue');
      if (!this.menuService.isViewRight) {
        this.utils.toast.error(
          'User does not have rights to access this module.'
        );
        this.router.navigate(['dashboard']);
      } else {
        this.SetLevel1Model();
      }
    } else {
      this.SetLevel1Model();
    }
    this.labelContent = this.labelContent.bind(this);
  }

  public seriesLabelsActualVsForecast: SeriesLabels = {
    visible: true,
    align: 'left',
    padding: -25,
    background: 'transparent',
    color: 'white',
    content: (e: any) => {
      let a = this.utils.formatLongNumberWithFloat(e);
      return `${a} - ${e.dataItem.l2R}%`;
    },
  };

  ngOnInit() {
    this.getmonth = this.getlastmonth();
    this.GetBranch();
    this.reportTitle =
      'Revenue By Division for' +
      ' ' +
      this.getmonth.toLocaleString('default', { month: 'long' }) +
      ' ' +
      this.getmonth.getFullYear();
    this.displayYtd = false;
  }

  GetBranch() {
    this.branchService.GetList(true).subscribe(
      (res) => {
        if (res) {
          this.branch = res;
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.branch.list);
      }
    );
  }

  dateModelData() {
    this.dateModel = new DivisionalRevenueDateModel();
    var x = new Date();
    if (x.getMonth() === 0) {
      this.dateModel.month = 12;
      this.dateModel.year = x.getFullYear() - 1;
    } else {
      if (this.displayYtd) {
        this.dateModel.month = 0;
        this.dateModel.year = x.getFullYear();
      } else {
        this.dateModel.month = x.getMonth();
        this.dateModel.year = x.getFullYear();
      }
    }
  }

  SetLevel1Model() {
    this.isVisible = true;
    return;
    this.selectedLevel1Model = new DivisionalRevenueModel();
    this.selectedLevel1Model.branchName = '1';
    this.dateModelData();
    this.selectedLevel1Model.month = this.dateModel.month;
    this.selectedLevel1Model.year = this.dateModel.year;
    this.selectedLevel1Model.jobType = '';
    this.GetByPassData(this.selectedLevel1Model);
  }

  GetByPassData(data) {
    if (this.selectedchart == 1) {
      this.GetCharData(data);
    }
    if (this.selectedchart == 2) {
      this.GetLevel2CharData(data);
    }
  }

  divisionBackClick($event) {
    this.selectedchart = 1;
    this.displayRegion = false;
    if ($event.ytd) {
      this.ytdClick();
    } else {
      this.lastMonthClick();
    }
  }

  GetCharData(data) {
    this.selectedchart = 0;
    this.service.GetList(data).subscribe(
      (res) => {
        let ByPass = res['bypass'];
        let Dewatering = res['dewatering'];
        this.level1ByPassDevision = [];
        this.level1DewateringDevision = [];
        if (ByPass.length > 0) {
          this.level1ByPassDevision.push(ByPass[1]);
          this.level1DewateringDevision.push(ByPass[0]);
        }
        if (ByPass.length > 0) {
          this.level1ByPassDevision.push(Dewatering[1]);
          this.level1DewateringDevision.push(Dewatering[0]);
        }
        this.isLevel1DataLoad = true;
        this.selectedchart = 1;
      },
      (error) => {
        this.onError(error, ErrorMessages.divisional_revenue.get_list);
      }
    );
  }

  ytdClick() {
    this.displayYtd = true;
    this.dateModelData();
    if (this.displayRegion) {
      this.displayYtd = true;
    } else {
      if (this.selectedchart == 1) {
        this.selectedLevel1Model.branchName = '1';
        this.selectedLevel1Model.month = this.dateModel.month;
        this.selectedLevel1Model.year = this.dateModel.year;
        this.reportTitle =
          'Revenue By Division for' + ' ' + this.selectedLevel1Model.year;
        this.selectedLevel1Model.jobType = 'ByPass';
        this.GetCharData(this.selectedLevel1Model);
      }
      if (this.selectedchart == 2) {
        this.reportTitle2 =
          this.AlljobType +
          ' Revenue By Branch for ' +
          ' ' +
          this.selectedLevel1Model.year;
        this.selectedLevel2Model.month = this.dateModel.month;
        this.selectedLevel2Model.year = this.dateModel.year;
        this.GetLevel2CharData(this.selectedLevel2Model);
      }
      if (this.selectedchart == 3) {
        this.reportTitle3 =
          //  'Revenue of ' +
          this.breadcrumb[2].text;
        // ' for ' +
        // this.selectedLevel1Model.year;
        this.selectedLevel3Model.month = this.dateModel.month;
        this.selectedLevel3Model.year = this.dateModel.year;
        this.GetLevel3CharData(this.selectedLevel3Model);
      }
    }
  }

  lastMonthClick() {
    this.displayYtd = false;
    this.dateModelData();
    this.getmonth = this.getlastmonth();
    if (this.displayRegion) {
      this.displayYtd = false;
    } else {
      if (this.selectedchart == 1) {
        if (this.getmonth.getMonth() === 0) {
          this.getmonth.setMonth(12);
          this.selectedLevel1Model.month = this.dateModel.month;
          this.selectedLevel1Model.year = this.dateModel.year;
        } else {
          this.selectedLevel1Model.month = this.dateModel.month;
          this.selectedLevel1Model.year = this.dateModel.year;
        }
        this.reportTitle =
          'Revenue By Division for' +
          ' ' +
          this.getmonth.toLocaleString('default', { month: 'long' }) +
          ' ' +
          this.selectedLevel1Model.year;
        this.GetByPassData(this.selectedLevel1Model);
      }
      if (this.selectedchart == 2) {
        // x.setMonth(x.getMonth() - 1);
        this.reportTitle2 =
          this.AlljobType +
          ' Revenue By Branch for ' +
          this.getmonth.toLocaleString('default', { month: 'long' }) +
          ' ' +
          this.selectedLevel1Model.year;
        this.selectedLevel2Model.month = this.dateModel.month;
        this.selectedLevel2Model.year = this.dateModel.year;
        this.selectedLevel2Model.region = this.selectedRegion;
        this.GetLevel2CharData(this.selectedLevel2Model);
      }
    }
  }

  GetLevel2CharData(data) {
    this.service.DivisionalRevenueLevel2(data).subscribe(
      (res) => {
        this.level2Devision = groupBy(res, [{ field: 'employeeName' }]);

        this.level2Devision = this.level2Devision;
        this.level2Categories = [...new Set(res.map((item) => item.name))];
        this.selectedchart = 2;
      },
      (error) => {
        this.onError(
          error,
          ErrorMessages.divisional_revenue.divisional_revenue_level2
        );
      }
    );
  }

  public valueAxisLables: ValueAxisLabels = {
    visible: true, // Note that visible defaults to false
    background: 'transparent',
    content: (e: any) => {
      let aa = this.utils.formatLongNumber(e);
      return aa.toString();
    },
  };

  level1Click(data) {
    this.dateModelData();
    this.selectedLevel2Model = new DivisionalRevenueModel();
    this.selectedLevel2Model.branchName = '2';
    this.getmonth = this.getlastmonth();
    if (this.displayYtd) {
      this.selectedLevel2Model.month = this.dateModel.month;
      this.selectedLevel2Model.year = this.dateModel.year;
    } else {
      this.selectedLevel2Model.month = this.dateModel.month;
      this.selectedLevel2Model.year = this.dateModel.year;
    }
    this.selectedLevel2Model.level = 2;
    this.selectedLevel2Model.jobType = data?.category;
    this.AlljobType = data?.category;
    this.selectedRegion = data?.dataItem?.region;
    this.selectedLevel2Model.region = data?.dataItem?.region;
    this.breadcrumb[1].text =
      data?.category + '(Region ' + data?.dataItem?.region + ')';

    if (this.displayYtd) {
      this.reportTitle2 =
        this.AlljobType +
        ' Revenue By Branch for ' +
        ' ' +
        this.selectedLevel1Model.year;
    } else {
      this.reportTitle2 =
        this.AlljobType +
        ' Revenue By Branch for ' +
        this.getmonth.toLocaleString('default', { month: 'long' }) +
        ' ' +
        this.selectedLevel1Model.year;
    }

    this.GetLevel2CharData(this.selectedLevel2Model);
    this.selectedchart = 2;
  }

  GoBackLevel1() {
    this.selectedchart = 2;
    this.GetByPassData(this.selectedLevel2Model);
  }

  public pieData: any[] = [];
  public labelContent(args: LegendLabelsContentArgs): string {
    return `#${args.dataItem.Job} - ${args.dataItem.Cname} - $${args.dataItem.value} - ${args.dataItem.L2R}`;
  }

  convertData(dataItem) {
    return this.utils.formatLongNumberWithFloat(dataItem);
  }
  public aggregates: any[] = [{ field: 'value', aggregate: 'sum' }];

  public state: State = {
    skip: 0,
    take: 100,
    group: [
      { field: 'job', aggregates: this.aggregates },
      { field: 'invoiceNumber', aggregates: this.aggregates },
    ],
  };

  // public Level3Data = []; //ToDo: AT delete after testing

  public dataStateChange(state: DataStateChangeEvent): void {
    if (state && state.group) {
      state.group.map((group) => (group.aggregates = this.aggregates));
    }
    this.state = state;
    this.gridData = process(this.level3GridData, this.state);
  }

  level2Click(data) {
    this.level2Data = data;
    this.dateModelData();
    // var x = new Date();
    this.selectedLevel3Model = new DivisionalRevenueEeidModel();
    this.getmonth = this.getlastmonth();
    if (this.displayYtd) {
      this.selectedLevel3Model.month = this.dateModel.month;
      this.selectedLevel3Model.year = this.dateModel.year;
    } else {
      this.selectedLevel3Model.month = this.dateModel.month;
      this.selectedLevel3Model.year = this.dateModel.year;
    }
    // this.selectedLevel3Model.level = 2;
    this.selectedLevel3Model.jobType = this.AlljobType;
    this.selectedLevel3Model.region = this.selectedRegion;
    // this.breadcrumb[1].text = data ?.category + "(Region " + data ?.dataItem ?.region + ")";

    this.selectedchart = 3;
    this.pieChartHeader = data;
    this.templevel2Devision = this.level2Devision.find(
      (x) =>
        x.items[0]['name'] == data.category &&
        x.items[0]['value'] == data.dataItem?.value
    ).items[0];
    this.selectedLevel3Model.eeid = data.dataItem.eeid;
    this.breadcrumb[2].text = this.templevel2Devision?.employeeName;
    this.breadcrumb[2].id = this.templevel2Devision?.eeid;
    this.GetLevel3CharData(this.selectedLevel3Model);
    if (this.displayYtd) {
      this.reportTitle3 =
        //  'Revenue of ' +
        this.breadcrumb[2].text;
      //' for ' +
      //this.selectedLevel1Model.year;
    } else {
      this.reportTitle3 =
        //'Revenue of ' +
        this.breadcrumb[2].text;
      //' for ' +
      //x.toLocaleString('default', { month: 'long' }) +
      //' ' +
      //this.selectedLevel1Model.year;
    }
  }

  GetLevel3CharData(data) {
    var JobId;
    if (data.dataItem == undefined) {
      JobId = 'All';
    } else {
      JobId = data.dataItem.job;
    }
    this.service.DivisionalRevenueLevel3(data).subscribe(
      (res) => {
        this.displayInventorySec = false;
        this.displayInvoicedSec = true;
        this.displayLaborSec = false;
        this.level3GridData = res['grid'];
        this.gridData = this.level3GridData;
        this.pieData = res['chart'];
        this.selectedchart = 3;
      },
      (error) => {
        this.onError(
          error,
          ErrorMessages.divisional_revenue.divisional_revenue_level3
        );
      }
    );
  }

  regionClick() {
    this.displayRegion = true;
  }

  level3Click(data: any) {
    if (data.sender != undefined) {
      data.sender.options.series[0].data.forEach((element) => {
        if (element.job === data.dataItem.job) {
          element.explode = true;
        } else {
          element.explode = false;
        }
      });
      data.sender.refresh();
    }
    if (data.dataItem.job != '') {
      this.selectedJob = data.dataItem.job;
      this.selectedCustomer = data.dataItem.custName;
    }
    if (this.selectedSection === 'Labor') {
      this.service.DivisionalRevenueLevel3LaborList(this.selectedJob).subscribe(
        (res) => {
          this.level3GridData = res;
          this.gridData = this.level3GridData;
          this.selectedchart = 3;
        },
        (error) => {
          this.onError(
            error,
            ErrorMessages.divisional_revenue
              .divisional_revenue_level3_labor_list
          );
        }
      );
    } else if (this.selectedSection === 'Inventory') {
      this.service
        .DivisionalRevenueLevel3InventoryList(this.selectedJob)
        .subscribe(
          (res) => {
            this.displayInventorySec = true;
            this.displayInvoicedSec = false;
            this.displayLaborSec = false;
            this.level3GridData = res;
            this.gridData = this.level3GridData;
            this.selectedchart = 3;
          },
          (error) => {
            this.onError(
              error,
              ErrorMessages.divisional_revenue
                .divisional_revenue_level3_inventory_list
            );
          }
        );
    } else {
      this.service
        .DivisionalRevenueLevel3InvoiceList(this.selectedJob)
        .subscribe(
          (res) => {
            this.displayInventorySec = false;
            this.displayInvoicedSec = true;
            this.displayLaborSec = false;
            this.level3GridData = res;
            this.gridData = this.level3GridData;
            this.sumOfLineTotal = this.gridData.reduce(
              (prev, next) => prev + next.lineTotal,
              0
            );
            this.selectedchart = 3;
          },
          (error) => {
            this.onError(
              error,
              ErrorMessages.divisional_revenue
                .divisional_revenue_level3_invoice_list
            );
          }
        );
      // this.GetLevel3CharData(data);
    }
  }
  GoAccountManagerSection(value) {
    this.gridData = [];
    this.selectedSection = value;
    // if (this.jobDetails.dataItem.job === '') {
    //   this.jobDetails.dataItem.job = 'All';
    // }
    this.level3Click(this.jobDetails);
  }
  public sortChangeInvoice(sort: SortDescriptor[]): void {
    this.sortInvoice = sort;
    this.data = {
      data: orderBy(this.gridData, this.sortInvoice),
      total: this.gridData.length,
    };
    this.gridData = this.data.data;
  }
  public sortChangeLabor(sort: SortDescriptor[]): void {
    this.sortLabor = sort;
    this.data = {
      data: orderBy(this.gridData, this.sortLabor),
      total: this.gridData.length,
    };
    this.gridData = this.data.data;
  }
  public sortChangeInventory(sort: SortDescriptor[]): void {
    this.sortInventory = sort;
    this.data = {
      data: orderBy(this.gridData, this.sortInventory),
      total: this.gridData.length,
    };
    this.gridData = this.data.data;
  }
  downloadFile(selectedJob, selectedSection) {
    selectedJob = this.selectedJob;
    this.service.downloadDivisonalData(selectedJob, selectedSection).subscribe(
      (res) => {
        let data = new Blob([res], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;',
        });
        if (selectedSection === 'Invoiced')
          fileSaver.saveAs(data, 'Division-Invoice.xlsx');
        if (selectedSection === 'Labor')
          fileSaver.saveAs(data, 'Division-Labor.xlsx');
        if (selectedSection === 'Inventory')
          fileSaver.saveAs(data, 'Division-Inventory.xlsx');
      },
      (error) => {
        this.onError(
          error,
          ErrorMessages.divisional_revenue.download_divisional_data
        );
      }
    );
  }
  getlastmonth() {
    var x = new Date();
    if (x.getMonth() === 0) {
      x.setMonth(12);
      x.setFullYear(x.getFullYear() - 1);
    } else {
      x.setMonth(x.getMonth() - 1);
    }
    return x;
  }

  private onError(error: any, customMessage?: string) {
    this.errorHandler.handleError(
      error,
      ModuleNames.divisional_revenue,
      customMessage
    );
  }
  close(){
    this.router.navigate(['/dashboard']);
  }
}
