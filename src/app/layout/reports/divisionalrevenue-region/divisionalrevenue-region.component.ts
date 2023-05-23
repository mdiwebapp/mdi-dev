import {
  Component,
  OnInit,
  ViewChild,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { DivisionalRevenueService } from './../divisionalrevenue/divisionalrevenue.service';
import {
  DivisionalRevenueDateModel,
  DivisionalRevenueRegion1Model,
  DivisionalRevenueViewModel,
  DivisionalRevenueRegion2Model,
  DivisionalRevenueEeidModel,
} from './../divisionalrevenue/divisionalrevenue.model';
import {
  LegendLabelsContentArgs,
  SeriesLabels,
  ValueAxisLabels,
} from '@progress/kendo-angular-charts';
import {
  groupBy,
  GroupResult,
  process,
  State,
} from '@progress/kendo-data-query';
import { IntlService } from '@progress/kendo-angular-intl';
import { UtilityService } from 'src/app/core/services/utility.service';
import { DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { BranchService } from '../../admin/branch/branch.service';
import { AnimationPlayer } from '@angular/animations';
import * as fileSaver from 'file-saver';
import { ModuleNames, ErrorMessages } from 'src/app/core/constant';
import { ErrorHandlerService } from 'src/app/core/services';

@Component({
  selector: 'app-divisionalrevenue-region',
  templateUrl: './divisionalrevenue-region.component.html',
  styleUrls: ['./divisionalrevenue-region.component.scss'],
})
export class DivisionalRevenueRegionComponent implements OnInit {
  @Input() displayYtd: boolean;
  reportTitle: string;
  selectedLevel1Model: DivisionalRevenueDateModel;
  selectedchart: number = 1;
  branch: any;
  levelRevenue: GroupResult[];
  @Output() DivisionClick = new EventEmitter<any>();
  selectedLevel3Model: DivisionalRevenueRegion2Model;
  breadcrumb = [
    { text: 'Revenue', id: 0 },
    { text: '', id: 0 },
    { text: '', id: 0 },
    { text: '', id: 0 },
  ];
  selectedLevel2Model: DivisionalRevenueRegion1Model;
  dateModel: DivisionalRevenueRegion1Model;
  AlljobType: any;
  selectedRegion: any;
  level2Region: GroupResult[];
  level3Region: GroupResult[];
  level4Region: GroupResult[];
  ReturnData = { level: 1, ytd: false };
  pieChartHeader: any;
  templevel3Region: any;
  templevel4Region: any[] = [];
  level3GridData: any;
  gridData: any;
  level2Devision: GroupResult[];
  public aggregates: any[] = [{ field: 'value', aggregate: 'sum' }];
  reportTitle2: string;
  reportTitle3: string;
  selectedBranch: any;
  selectedJob: any;
  selectedCustomer: any;
  selectedSection: any = 'Invoiced';
  displayInvoicedSec: boolean = true;
  displayLaborSec: boolean = false;
  displayInventorySec: boolean = false;
  selectedLevel4Model: DivisionalRevenueEeidModel;
  level3Data: any;
  JobId = 'All';
  jobDetails = { dataItem: { job: '' } };
  sumOfLineTotal: number;
  getmonth: any;
  constructor(
    public service: DivisionalRevenueService,
    public branchService: BranchService,
    private intl: IntlService,
    public utils: UtilityService,
    public errorHandler: ErrorHandlerService
  ) {}
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
    this.GetBranch();
    this.getData();
  }

  public valueAxisLables: ValueAxisLabels = {
    visible: true, // Note that visible defaults to false
    background: 'transparent',
    content: (e: any) => {
      let aa = this.utils.formatLongNumber(e);
      return aa.toString();
    },
  };

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

  public pieData: any[] = [];
  public state: State = {
    skip: 0,
    take: 100,
    group: [
      { field: 'job', aggregates: this.aggregates },
      { field: 'invoiceNumber', aggregates: this.aggregates },
    ],
  };

  getData() {
    this.selectedLevel1Model = new DivisionalRevenueDateModel();
    this.dateModelData();
    // var x = new Date();
    this.getmonth = this.getlastmonth();
    if (this.displayYtd == false) {
      if (this.getmonth.getMonth() === 0) {
        this.selectedLevel1Model.month = this.dateModel.month;
        this.selectedLevel1Model.year = this.dateModel.year;
      } else {
        this.selectedLevel1Model.month = this.dateModel.month;
        this.selectedLevel1Model.year = this.dateModel.year;
      }
      this.reportTitle =
        ' Revenue By Region for ' +
        this.getmonth.toLocaleString('default', { month: 'long' }) +
        ' ' +
        this.selectedLevel1Model.year;
    } else {
      this.selectedLevel1Model.month = this.dateModel.month;
      this.selectedLevel1Model.year = this.dateModel.year;
      this.reportTitle =
        ' Revenue By Region for ' + ' ' + this.selectedLevel1Model.year;
      // this.selectedLevel1Model.month = 5;
      // this.selectedLevel1Model.year = 2021;
      // this.selectedLevel1Model.year = new Date().getFullYear() - 1;
    }
    this.GetCharData(this.selectedLevel1Model);
  }

  GetCharData(data) {
    this.selectedchart = 1;
    this.service.DivisionalRevenueRegionLevel(data).subscribe(
      (res) => {
        let a = [];
        let aaa = 0;
        res.grid.forEach((element) => {
          aaa++;
          a.push({
            value: element.bypass_Value,
            l2R: element.bypass_L2R,
            region: element.bypass_Region,
            temp: 'Bypass',
            color: '#3469a9',
          });

          a.push({
            value: element.dewatering_Value,
            l2R: element.dewatering_L2R,
            region: element.dewatering_Region,
            temp: 'dewatering',
            color: '#d94542',
          });
        });
        this.levelRevenue = groupBy(a, [{ field: 'temp' }]);
        this.levelRevenue = this.levelRevenue;
      },
      (error) => {
        this.onError(
          error,
          ErrorMessages.divisional_revenue.divisional_revenue_region_level
        );
      }
    );
  }

  convertData(dataItem) {
    return this.utils.formatLongNumberWithFloat(dataItem);
  }

  level1Click(data) {
    this.dateModelData();
    this.selectedLevel2Model = new DivisionalRevenueRegion1Model();
    this.AlljobType = data?.category;
    this.selectedRegion = data?.dataItem?.region;
    this.selectedLevel2Model.region = this.selectedRegion;
    this.breadcrumb[1].text = data?.category + '(Region)';
    this.getmonth = this.getlastmonth();
    if (this.displayYtd == false) {
      if (this.getmonth.getMonth() === 0) {
        // this.selectedLevel2Model.month = 12;
        // this.selectedLevel2Model.year = x.getFullYear() - 1;
        this.selectedLevel2Model.month = this.dateModel.month;
        this.selectedLevel2Model.year = this.dateModel.year;
      } else {
        // this.selectedLevel2Model.month = x.getMonth();
        this.selectedLevel2Model.month = this.dateModel.month;
        this.selectedLevel2Model.year = this.dateModel.year;
      }
      this.reportTitle2 =
        'Region #' +
        this.AlljobType +
        "'s Revenue By Branch for " +
        this.getmonth.toLocaleString('default', { month: 'long' }) +
        ' ' +
        this.selectedLevel2Model.year;
    } else {
      // this.selectedLevel2Model.month = 0;
      // this.selectedLevel2Model.year = x.getFullYear();
      this.selectedLevel2Model.month = this.dateModel.month;
      this.selectedLevel2Model.year = this.dateModel.year;
      this.reportTitle2 =
        'Region #' +
        this.selectedRegion +
        "'s Revenue By Branch for " +
        this.selectedLevel2Model.year;
    }

    this.GetLevel2CharData(this.selectedLevel2Model);
    this.selectedchart = 2;
  }

  level2Click(data) {
    this.selectedLevel3Model = new DivisionalRevenueRegion2Model();
    this.dateModelData();
    if (this.displayYtd) {
      this.selectedLevel3Model.month = this.dateModel.month;
      this.selectedLevel3Model.year = this.dateModel.year;
    } else {
      this.selectedLevel3Model.month = this.dateModel.month;
      this.selectedLevel3Model.year = this.dateModel.year;
    }
    // this.selectedLevel3Model.level = 2;
    this.selectedLevel3Model.branch = data?.category;
    this.selectedBranch = data?.category;
    this.selectedRegion = data?.dataItem?.region;
    this.selectedLevel3Model.region = this.selectedRegion;
    this.breadcrumb[2].text = data?.category + '(Region)';
    this.pieChartHeader = data;
    this.GetLevel3CharData(this.selectedLevel3Model);
  }

  dateModelData() {
    this.dateModel = new DivisionalRevenueRegion1Model();
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

  GetLevel2CharData(model: DivisionalRevenueRegion1Model) {
    let a = [];
    this.level2Region = groupBy(a, [{ field: 'temp' }]);
    this.service.DivisionalRevenueRegionLevel2(model).subscribe(
      (res) => {
        res.grid.forEach((element) => {
          a.push({
            value: element.bypass_Value,
            l2R: element.bypass_L2R,
            region: element.bypass_Region,
            branch: element.bypass_BranchName,
            temp: 'Bypass',
            color: '#3469a9',
          });

          a.push({
            value: element.dewatering_Value,
            l2R: element.dewatering_L2R,
            region: element.dewatering_Region,
            branch: element.dewatering_BranchName,
            temp: 'dewatering',
            color: '#d94542',
          });

          this.level2Region = groupBy(a, [{ field: 'temp' }]);
        });
        // console.log(this.level2Devision);
        // this.level2Devision = this.level2Devision;
        // this.level2Categories = [...new Set(res.map(item => item.name))];
        // this.selectedchart = 2;
      },
      (error) => {
        this.onError(
          error,
          ErrorMessages.divisional_revenue.divisional_revenue_region_level2
        );
      }
    );
  }

  GetLevel3CharData(data) {
    this.selectedchart = 3;
    // var x = new Date(); //ToDo: AT delete after testing
    this.getmonth = this.getlastmonth();
    if (this.displayYtd == false) {
      // x.setMonth(x.getMonth() - 1); //ToDo: AT delete after testing
      this.reportTitle3 =
        this.selectedBranch +
        "'s Revenue By Account Manager for \n " +
        this.getmonth.toLocaleString('default', { month: 'long' }) +
        ' ' +
        this.selectedLevel2Model.year;
    } else {
      this.reportTitle3 =
        this.selectedBranch +
        "'s Revenue By Account Manager for \n " +
        this.selectedLevel2Model.year;
    }
    let a = [];
    this.level3Region = groupBy(a, [{ field: 'temp' }]);
    this.service.DivisionalRevenueRegionLevel3(data).subscribe(
      (res) => {
        res.grid.forEach((element) => {
          a.push({
            value: element.bypass_Value,
            l2R: element.bypass_L2R,
            region: element.bypass_Region,
            branch: element.bypass_BranchName,
            am: element.bypass_AM,
            eeid: element.bypass_AccountManager,
            temp: 'Bypass',
            color: '#3469a9',
          });

          a.push({
            value: element.dewatering_Value,
            l2R: element.dewatering_L2R,
            region: element.dewatering_Region,
            branch: element.bypass_BranchName,
            am: element.dewatering_AM,
            eeid: element.bypass_AccountManager,
            temp: 'Dewatering',
            color: '#d94542',
          });
          this.level3Region = groupBy(a, [{ field: 'temp' }]);
        });
      },
      (error) => {
        this.onError(
          error,
          ErrorMessages.divisional_revenue.divisional_revenue_region_level3
        );
      }
    );
  }

  GetLevel4CharData(data) {
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
        this.selectedchart = 4;
      },
      (error) => {
        this.onError(
          error,
          ErrorMessages.divisional_revenue.divisional_revenue_level3
        );
      }
    );
  }

  lastMonthClick() {
    this.displayYtd = false;
    this.getmonth = this.getlastmonth();
    if (this.selectedchart == 1) {
      this.getData();
    }
    if (this.selectedchart == 2) {
      this.selectedLevel2Model.month = this.getmonth.getmonth();
      this.selectedLevel2Model.year = this.dateModel.year;
      this.selectedLevel2Model.region = this.selectedRegion;
      this.reportTitle2 =
        'Region ' +
        this.AlljobType +
        '# Revenue By Branch for ' +
        this.getmonth.toLocaleString('default', { month: 'long' }) +
        ' ' +
        this.selectedLevel2Model.year;

      this.GetLevel2CharData(this.selectedLevel2Model);
    }
    if (this.selectedchart == 3) {
      this.dateModelData();
      this.selectedLevel3Model.month = this.dateModel.month;
      this.selectedLevel3Model.year = this.dateModel.year;
      this.selectedLevel3Model.region = this.selectedRegion;
      this.selectedLevel3Model.branch = this.selectedBranch;
      // x.setMonth(x.getMonth() - 1); // ToDo: AT delete after testing
      this.reportTitle3 =
        'Region ' +
        this.AlljobType +
        '# Revenue By Branch for ' +
        this.getmonth.toLocaleString('default', { month: 'long' }) +
        ' ' +
        this.selectedLevel2Model.year;

      this.GetLevel3CharData(this.selectedLevel3Model);
    }
  }

  ytdClick() {
    this.displayYtd = true;
    if (this.selectedchart == 1) {
      this.reportTitle =
        ' Revenue By Region for ' + ' ' + this.selectedLevel1Model.year;
      this.getData();
    }
    if (this.selectedchart == 2) {
      this.dateModelData();
      this.selectedLevel2Model.month = this.dateModel.month;
      this.selectedLevel2Model.year = this.dateModel.year;
      this.selectedLevel2Model.region = this.selectedRegion;
      this.reportTitle2 =
        'Region ' +
        this.selectedRegion +
        '# Revenue By Branch for ' +
        this.selectedLevel2Model.year;

      this.GetLevel2CharData(this.selectedLevel2Model);
    }
    if (this.selectedchart == 3) {
      this.dateModelData();
      this.selectedLevel3Model.month = this.dateModel.month;
      this.selectedLevel3Model.year = this.dateModel.year;
      this.selectedLevel3Model.region = this.selectedRegion;
      this.selectedLevel3Model.branch = this.selectedBranch;
      this.reportTitle = 'Region' + ' ' + this.selectedLevel3Model.year;

      this.GetLevel3CharData(this.selectedLevel3Model);
    }
  }

  divisionClick() {
    this.ReturnData.level = this.selectedchart;
    this.ReturnData.ytd = this.displayYtd;

    this.DivisionClick.emit(this.ReturnData);
  }

  level3Click(data: any) {
    this.level3Data = data;
    this.dateModelData();
    this.selectedLevel4Model = new DivisionalRevenueEeidModel();
    if (this.displayYtd) {
      this.selectedLevel4Model.month = this.dateModel.month;
      this.selectedLevel4Model.year = this.dateModel.year;
    } else {
      this.selectedLevel4Model.month = this.dateModel.month;
      this.selectedLevel4Model.year = this.dateModel.year;
    }
    // this.selectedLevel3Model.level = 2;
    this.selectedLevel4Model.jobType = this.AlljobType;
    this.selectedLevel4Model.region = this.selectedRegion;
    // this.breadcrumb[1].text = data ?.category + "(Region " + data ?.dataItem ?.region + ")";

    this.selectedchart = 4;
    this.pieChartHeader = data;
    this.templevel4Region = [];
    this.level3Region.forEach((element) => {
      element.items.forEach((element1) => {
        this.templevel4Region.push(element1);
      });
    });
    this.templevel3Region = this.templevel4Region.find(
      (x) => x.am == data.category && x.value == data.dataItem?.value
    );
    this.selectedLevel4Model.eeid = this.templevel3Region?.eeid;
    this.breadcrumb[3].text = this.templevel3Region?.am;
    this.breadcrumb[3].id = 1;
    this.GetLevel4CharData(this.selectedLevel4Model);
    if (this.displayYtd) {
      this.reportTitle3 =
        // 'Revenue of ' +
        this.breadcrumb[3].text;
      //' for ' +
      //this.selectedLevel1Model.year;
    } else {
      this.reportTitle3 =
        //'Revenue of ' +
        this.breadcrumb[3].text;
      //' for ' +
      //x.toLocaleString('default', { month: 'long' }) +
      //' ' +
      //this.selectedLevel1Model.year;
    }
  }

  level4Click(data: any) {
    if (data.dataItem.job != '') {
      this.selectedJob = data.dataItem.job;
      this.selectedCustomer = data.dataItem.custName;
    }
    if (this.selectedJob != undefined) {
      if (this.selectedSection === 'Labor') {
        this.service
          .DivisionalRevenueLevel3LaborList(this.selectedJob)
          .subscribe(
            (res) => {
              this.level3GridData = res;
              this.gridData = this.level3GridData;
              this.selectedchart = 4;
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
              this.selectedchart = 4;
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
              this.selectedchart = 4;
            },
            (error) => {
              this.onError(
                error,
                ErrorMessages.divisional_revenue
                  .divisional_revenue_level3_invoice_list
              );
            }
          );
      }
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
    }
  }

  GoAccountManagerSection(value) {
    this.gridData = [];
    this.selectedSection = value;
    this.level4Click(this.jobDetails);
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
      ModuleNames.divisional_revenue_region,
      customMessage
    );
  }
}
