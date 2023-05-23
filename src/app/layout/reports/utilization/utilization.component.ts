import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DivisionalRevenueService } from '../divisionalrevenue/divisionalrevenue.service';
import {
  UtilizationRegionLeve2ViewRequestModel,
  UtilizationRegionLevelViewRequestModel,
  UtilizationRegionLevel3ViewRequestModel,
  UtilizationRegionLevel4ViewRequestModel,
  UtilizationRegionLevel5ViewRequestModel,
} from '../utilization/utilization.model';
import { SeriesLabels, ValueAxisLabels } from '@progress/kendo-angular-charts';
import { groupBy, GroupResult, State } from '@progress/kendo-data-query';
import { UtilityService } from 'src/app/core/services/utility.service';
import { BranchService } from '../../admin/branch/branch.service';
import { DatePipe } from '@angular/common';
import { UtilizationService } from '../utilization/utilization.service';
import { LoaderService } from '../../../core/loader/loader.service';
@Component({
  selector: 'app-utilization-region',
  templateUrl: './utilization.component.html',
  styleUrls: ['./utilization.component.scss'],
})
export class UtilizationComponent implements OnInit {
  reportTitle: string;
  selectedchart: number = 1;
  branch: any;
  levelRevenue: GroupResult[];
  breadcrumb = [
    { text: 'Revenue', id: 0 },
    { text: '', id: 0 },
    { text: '', id: 0 },
    { text: '', id: 0 },
    { text: '', id: 0 },
  ];
  color = 'primary';
  mode = 'indeterminate';
  value = 50;
  visible: boolean;
  selectedLevel5Model: UtilizationRegionLevel5ViewRequestModel;
  selectedLevel4Model: UtilizationRegionLevel4ViewRequestModel;
  selectedLevel2Model: UtilizationRegionLeve2ViewRequestModel;
  selectedLevel3Model: UtilizationRegionLevel3ViewRequestModel;
  datePickerModel: UtilizationRegionLevelViewRequestModel;
  selectedRegion: any;
  level1Region: GroupResult[];
  level2Region: GroupResult[];
  level3Region: GroupResult[];
  level4Region: GroupResult[];
  level5Region: GroupResult[];
  public aggregates: any[] = [{ field: 'value', aggregate: 'sum' }];
  reportTitle2: string;
  reportTitle3: string;
  reportTitle4: string;
  reportTitle5: string;
  getmonth: any;
  displaydatepicker: boolean = false;
  fromDate: string = '';
  toDate: string = '';
  customFromDate: string = '';
  customToDate: string = '';
  data: any;
  todayclick: boolean = false;
  lastMonth: boolean = false;
  lastThreeMonth: boolean = false;
  lastSixMonth: boolean = false;
  lastTwelveMonth: boolean = false;
  customDateRange: boolean = false;
  currentDate: boolean = false;
  maxValueLevel1: number;
  maxValueLevel2: number;
  maxValueLevel3: number;
  maxValueLevel4: number;
  maxValueLevel5: number;
  loader: any;
  modelGroups: string;
  RealTime: boolean;
  constructor(
    public service: DivisionalRevenueService,
    public branchService: BranchService,
    public utils: UtilityService,
    public datepipe: DatePipe,
    public utilizationservice: UtilizationService
  ) {}
  public seriesLabelsActualVsForecast: SeriesLabels = {
    visible: true,
    align: 'left',
    padding: -25,
    background: 'transparent',
    color: 'white',
    content: (e: any) => {
      let a = this.utils.formatLongNumberWithFloat(e);
      return `${e.dataItem.utilizationRate}%`;
    },
  };

  // //this.datepipe.transform(
  //   this.customFromDate,
  //   'MM-dd-yyyy'
  // );

  ngOnInit() {
    this.getmonth = this.getlastmonth();

    this.GetBranch();
    console.log('Branch List :' + this.branch);
    this.loader = true;
    this.getData();
    this.loader = true;
    this.visible = false;
  }

  public valueAxisLables: ValueAxisLabels = {
    visible: true, // Note that visible defaults to false
    background: 'transparent',
    content: (e: any) => {
      let aa = this.utils.formatLongNumberPercentage(e);
      return aa.toString();
    },
  };

  public pieData: any[] = [];
  public state: State = {
    skip: 0,
    take: 100,
    group: [
      { field: 'job', aggregates: this.aggregates },
      { field: 'invoiceNumber', aggregates: this.aggregates },
    ],
  };

  GetBranch() {
    this.branchService.GetList(true).subscribe((res) => {
      if (res) {
        this.branch = res;
      }
    });
  }

  getData() {
    this.displaydatepicker = false;
    this.datePickerModel = new UtilizationRegionLevelViewRequestModel();
    this.lastMonth = true;
    this.setDate();
    this.datePickerModel.FromDate = this.fromDate;
    this.datePickerModel.ToDate = this.toDate;
    this.UtilizationChartData(this.datePickerModel);
    this.reportTitle =
      'Utilization Rate By Region' +
      ' ' +
      '(' +
      ' ' +
      this.fromDate +
      ' ' +
      'To' +
      ' ' +
      this.toDate +
      ' )';
  }

  lastMonthClick() {
    this.displaydatepicker = false;
    this.todayclick = false;
    this.lastMonth = true;
    this.lastThreeMonth = false;
    this.lastSixMonth = false;
    this.lastTwelveMonth = false;
    this.customDateRange = false;
    this.currentDate = false;
    this.RealTime = false;
    this.datePickerModel = new UtilizationRegionLevelViewRequestModel();
    this.setDate();
    this.datePickerModel.FromDate = this.fromDate;
    this.datePickerModel.ToDate = this.toDate;
    // this.reportTitle = 'Utilization Rate By Region';
    this.SetSelectedRegion();
    // if (this.selectedchart == 1) {
    //   this.UtilizationChartData(this.datePickerModel);
    // } else if (this.selectedchart == 2) {
    //   this.selectedLevel2Model.FromDate = this.fromDate;
    //   this.selectedLevel2Model.ToDate = this.toDate;
    //   this.selectedLevel2Model.Region = this.selectedRegion;
    //   this.UtilizationChartDataForRegion2(this.selectedLevel2Model);
    // } else if (this.selectedchart == 3) {
    //   this.selectedLevel3Model.FromDate = this.fromDate;
    //   this.selectedLevel3Model.ToDate = this.toDate;
    //   this.selectedLevel3Model.Region = this.selectedRegion;
    //   this.UtilizationChartDataForRegion3(this.selectedLevel3Model);
    // }
  }

  CurrentDateClick() {
    this.displaydatepicker = false;
    this.todayclick = true;
    this.lastMonth = false;
    this.lastThreeMonth = false;
    this.lastSixMonth = false;
    this.lastTwelveMonth = false;
    this.customDateRange = false;
    this.RealTime = true;
    this.datePickerModel = new UtilizationRegionLevelViewRequestModel();
    this.setDate();
    this.datePickerModel.FromDate = this.fromDate;
    this.datePickerModel.ToDate = this.toDate;
    this.datePickerModel.RealTime = this.RealTime;
    // this.reportTitle = 'Utilization Rate By Region';
    this.SetSelectedRegion();
  }

  lastThreeMonthClick() {
    this.displaydatepicker = false;
    this.todayclick = false;
    this.lastMonth = false;
    this.lastThreeMonth = true;
    this.lastSixMonth = false;
    this.lastTwelveMonth = false;
    this.customDateRange = false;
    this.RealTime = false;
    this.datePickerModel = new UtilizationRegionLevelViewRequestModel();
    this.setDate();
    this.datePickerModel.FromDate = this.fromDate;
    this.datePickerModel.ToDate = this.toDate;
    this.SetSelectedRegion();
    // if (this.selectedchart == 1) {
    //   this.UtilizationChartData(this.datePickerModel);
    // } else if (this.selectedchart == 2) {
    //   this.selectedLevel2Model.FromDate = this.fromDate;
    //   this.selectedLevel2Model.ToDate = this.toDate;
    //   this.selectedLevel2Model.Region = this.selectedRegion;
    //   this.UtilizationChartDataForRegion2(this.selectedLevel2Model);
    // } else if (this.selectedchart == 3) {
    //   this.selectedLevel3Model.FromDate = this.fromDate;
    //   this.selectedLevel3Model.ToDate = this.toDate;
    //   this.selectedLevel3Model.Region = this.selectedRegion;
    //   this.UtilizationChartDataForRegion3(this.selectedLevel3Model);
    // }
  }

  lastSixMonthClick() {
    this.displaydatepicker = false;
    this.todayclick = false;
    this.lastMonth = false;
    this.lastThreeMonth = false;
    this.lastSixMonth = true;
    this.lastTwelveMonth = false;
    this.customDateRange = false;
    this.RealTime = false;
    this.datePickerModel = new UtilizationRegionLevelViewRequestModel();
    this.setDate();
    this.datePickerModel.FromDate = this.fromDate;
    this.datePickerModel.ToDate = this.toDate;
    // this.UtilizationChartData(this.datePickerModel);
    this.SetSelectedRegion();
  }

  lasttwelveMonthClick() {
    this.displaydatepicker = false;
    this.todayclick = false;
    this.lastMonth = false;
    this.lastThreeMonth = false;
    this.lastSixMonth = false;
    this.lastTwelveMonth = true;
    this.customDateRange = false;
    this.RealTime = false;
    this.datePickerModel = new UtilizationRegionLevelViewRequestModel();
    this.setDate();
    this.datePickerModel.FromDate = this.fromDate;
    this.datePickerModel.ToDate = this.toDate;
    // this.UtilizationChartData(this.datePickerModel);
    this.SetSelectedRegion();
  }

  CustomeDateRangeClick() {
    this.displaydatepicker = true;
    // this.todayclick = false;
    // this.lastMonth = false;
    // this.lastThreeMonth = false;
    // this.lastSixMonth = false;
    // this.lastTwelveMonth = false;
    // this.RealTime = false;
    // this.customDateRange = true;
    this.customFromDate = null;
    this.customToDate = null;
  }

  closepopup() {
    this.displaydatepicker = false;
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

  UtilizationChartData(data) {
    let a = [];
    let maxValues = [];

    if (this.RealTime) {
      this.reportTitle = 'Utilization Rate By Region';
    } else {
      this.reportTitle =
        'Utilization Rate By Region  \n' +
        ' ' +
        '(' +
        ' ' +
        this.fromDate +
        ' ' +
        'To' +
        ' ' +
        this.toDate +
        ' )';
    }

    this.selectedchart = 1;
    this.levelRevenue = groupBy(a, [{ field: 'temp' }]);
    this.visible = false;
    this.visible = true;
    this.utilizationservice.UtilizationRegionLevel1(data).subscribe((res) => {
      if (res) {
        this.data = res;
        res.grid.forEach((element) => {
          a.push({
            daysTotal: element.daysTotal,
            region: element.region,
            utilizationRate: element.utilizationRate,
            temp: 'Utilization Region 1',
            color: '#3469a9',
          });
          maxValues.push(element.utilizationRate);

          this.levelRevenue = groupBy(a, [{ field: 'temp' }]);
        });
        this.selectedchart = 1;
        this.visible = true;
        this.visible = false;
        let max = maxValues.reduce((a, b) => Math.max(a, b)) + 20;
        if (max > 100) {
          this.maxValueLevel1 = maxValues.reduce((a, b) => Math.max(a, b));
        } else {
          this.maxValueLevel1 = max;
        }
        //this.maxValueLevel1 = Math.ceil(this.maxValueLevel1 / 10) * 10;
      }
    });
  }

  level1Click(data) {
    this.setDate();
    this.breadcrumb[1].text = data?.category + '(Branch)';
    this.selectedLevel2Model = new UtilizationRegionLeve2ViewRequestModel();
    this.selectedLevel2Model.FromDate = this.fromDate;
    this.selectedLevel2Model.ToDate = this.toDate;
    this.selectedRegion = data?.dataItem?.region;
    this.selectedLevel2Model.Region = this.selectedRegion;
    this.selectedLevel2Model.RealTime = this.RealTime;
    // this.reportTitle = 'Utilization Rate By Region';
    //  this.visible = false;
    this.UtilizationChartDataForRegion2(this.selectedLevel2Model);
    // this.visible = false;
    this.selectedchart = 2;
  }

  level2Click(data) {
    this.setDate();
    this.breadcrumb[2].text = data?.category + '(ModelGroup)';
    this.selectedLevel3Model = new UtilizationRegionLevel3ViewRequestModel();
    this.selectedLevel3Model.FromDate = this.fromDate;
    this.selectedLevel3Model.ToDate = this.toDate;
    this.selectedRegion = data?.dataItem?.region;
    this.selectedLevel3Model.Region = this.selectedRegion;
    let branch = this.branch.find(
      (i) => i.branchName == data.dataItem.branchName
    );
    this.selectedLevel3Model.Branch = branch.branchCode;
    this.selectedLevel3Model.RealTime = this.RealTime;
    if (this.RealTime) {
      this.reportTitle3 =
        data?.category + "'s" + ' Utilization Rate by Model Group';
    } else {
      this.reportTitle3 =
        data?.category +
        "'s" +
        ' Utilization Rate by Model Group  \n' +
        ' ( ' +
        this.fromDate +
        ' ' +
        'To' +
        ' ' +
        this.toDate +
        ' )';
    }
    this.UtilizationChartDataForRegion3(this.selectedLevel3Model);
    // this.reportTitle = 'Utilization Rate By Region';
    this.selectedchart = 3;
  }

  level3Click(data) {
    this.setDate();
    this.breadcrumb[3].text = data?.category + '(InvType)';
    this.selectedLevel4Model = new UtilizationRegionLevel4ViewRequestModel();
    this.selectedLevel4Model.FromDate = this.fromDate;
    this.selectedLevel4Model.ToDate = this.toDate;
    let branch = this.branch.find(
      (i) => i.branchName == data.dataItem.branchName
    );
    this.selectedLevel4Model.Branch = branch.branchCode;
    this.selectedLevel4Model.ModelGroup = data?.category;
    this.selectedLevel4Model.RealTime = this.RealTime;
    if (this.RealTime) {
      this.reportTitle4 = data?.category + "'s" + ' Utilization Rate by Models';
    } else {
      this.reportTitle4 =
        data?.category +
        "'s" +
        ' Utilization Rate by Models  \n' +
        ' ( ' +
        this.fromDate +
        ' ' +
        'To' +
        ' ' +
        this.toDate +
        ' )';
    }
    this.UtilizationChartDataForRegion4(this.selectedLevel4Model);
  }
  level4Click(data) {
    this.setDate();
    this.breadcrumb[4].text = data?.category + '(InvNumber)';
    this.selectedLevel5Model = new UtilizationRegionLevel5ViewRequestModel();
    this.selectedLevel5Model.FromDate = this.fromDate;
    this.selectedLevel5Model.ToDate = this.toDate;
    let branch = this.branch.find(
      (i) => i.branchName == data.dataItem.branchName
    );
    if (!this.RealTime) this.selectedLevel5Model.Branch = branch.branchCode;
    else this.selectedLevel5Model.Branch = data.dataItem.branchName;
    this.selectedLevel5Model.InvType = data?.category;
    this.selectedLevel5Model.RealTime = this.RealTime;
    if (this.RealTime) {
      this.reportTitle5 =
        data?.category + "'s" + ' Utilization Rate by Inv Type';
    } else {
      this.reportTitle5 =
        data?.category +
        "'s" +
        ' Utilization Rate by Inv Type  \n' +
        ' ( ' +
        this.fromDate +
        ' ' +
        'To' +
        ' ' +
        this.toDate +
        ' )';
    }
    this.UtilizationChartDataForRegion5(this.selectedLevel5Model);
  }

  UtilizationChartDataForRegion2(data) {
    let a = [];
    let maxValues = [];
    if (this.RealTime) {
      this.reportTitle2 =
        'Region #' + data.Region + "'s" + ' Utilization Rate by Branch';
    } else {
      this.reportTitle2 =
        'Region #' +
        data.Region +
        "'s" +
        ' Utilization Rate by Branch  \n' +
        ' (' +
        this.fromDate +
        ' ' +
        'To' +
        ' ' +
        this.toDate +
        ' )';
    }

    this.level2Region = null;
    this.visible = false;
    this.visible = true;
    this.utilizationservice.UtilizationRegionLevel2(data).subscribe((res) => {
      if (res) {
        this.data = res;
        res.grid.forEach((element) => {
          a.push({
            branchName: element.branchName,
            region: element.region,
            daysTotal: element.daysTotal,
            utilizationRate: element.utilizationRate,
            temp: 'Utilization Region 1',
            color: '#3469a9',
          });
          maxValues.push(element.utilizationRate);
          this.level2Region = groupBy(a, [{ field: 'temp' }]);
        });
        maxValues.push();
        this.selectedchart = 2;
        this.visible = true;
        this.visible = false;
        let max = maxValues.reduce((a, b) => Math.max(a, b)) + 20;
        if (max > 100) {
          this.maxValueLevel2 = maxValues.reduce((a, b) => Math.max(a, b));
        } else {
          this.maxValueLevel2 = max;
        }
        // this.maxValueLevel2 = Math.ceil(this.maxValueLevel2 / 10) * 10;
      }
    });
  }

  UtilizationChartDataForRegion3(data) {
    let a = [];
    let maxValues = [];
    // if (this.RealTime) {
    //   this.reportTitle3 =
    //     chartheader + "'s" + ' Utilization Rate by Model Group';
    // } else {
    //   this.reportTitle3 =
    //     'Region #' +
    //     data.Region +
    //     "'s" +
    //     ' Utilization Rate by Model Group  \n' +
    //     ' ( ' +
    //     this.fromDate +
    //     ' ' +
    //     'To' +
    //     ' ' +
    //     this.toDate +
    //     ' )';
    // }

    this.level3Region = null;
    this.visible = false;
    this.visible = true;
    this.utilizationservice.UtilizationRegionLevel3(data).subscribe((res) => {
      if (res) {
        this.data = res;
        res.grid.forEach((element) => {
          a.push({
            modelGroup: element.modelGroup,
            branchName: element.branchName,
            utilizationRate: element.utilizationRate,
            temp: 'Utilization Region 1',
            color: '#3469a9',
          });
          maxValues.push(element.utilizationRate);
          this.level3Region = groupBy(a, [{ field: 'temp' }]);
          this.modelGroups = element.modelGroup;
        });
        this.selectedchart = 3;
        this.visible = true;
        this.visible = false;
        let max = maxValues.reduce((a, b) => Math.max(a, b)) + 20;
        if (max > 100) {
          this.maxValueLevel3 = 100;
        } else {
          this.maxValueLevel3 = max;
        }
        // this.maxValueLevel3 = Math.ceil(this.maxValueLevel3 / 10) * 10;
      }
    });
  }

  bindChartData() {
    if (!this.customFromDate && !this.customToDate) {
      this.utils.toast.error('Please select Fromdate-Todate');
      return false;
    }
    this.todayclick = false;
    this.lastMonth = false;
    this.lastThreeMonth = false;
    this.lastSixMonth = false;
    this.lastTwelveMonth = false;
    this.RealTime = false;
    this.customDateRange = true;
    this.displaydatepicker = true;
    this.closepopup();
    var getCustomfromDate = new Date(this.customFromDate);
    var getCustomtoDate = new Date(this.customToDate);
    this.customFromDate = this.datepipe.transform(
      this.customFromDate,
      'MM-dd-yyyy'
    );
    this.customToDate = this.datepipe.transform(
      this.customToDate,
      'MM-dd-yyyy'
    );
    this.datePickerModel = new UtilizationRegionLevelViewRequestModel();

    this.datePickerModel.FromDate = this.customFromDate;
    this.datePickerModel.ToDate = this.customToDate;
    this.fromDate = this.customFromDate;
    this.toDate = this.customToDate;
    if (
      this.customFromDate != null &&
      this.customFromDate !== '' &&
      this.customFromDate !== undefined &&
      this.customToDate != null &&
      this.customToDate !== '' &&
      this.customToDate !== undefined
    ) {
      if (getCustomfromDate.getTime() > getCustomtoDate.getTime()) {
        this.utils.toast.error('Fromdate should be greater than Todate .');
        return false;
      }
      this.SetSelectedRegion();
      //this.UtilizationChartData(this.datePickerModel);
    }
  }

  setDate() {
    if (this.todayclick) {
      var date = new Date();
      var firstDay = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      );
      var lastDay = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      );
      this.fromDate = this.datepipe.transform(firstDay, 'MM-dd-yyyy');
      this.toDate = this.datepipe.transform(lastDay, 'MM-dd-yyyy');
    } else if (this.lastMonth) {
      var date = new Date();
      var firstDay = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() - 30
      );
      var lastDay = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      );
      var firstdate = this.datepipe.transform(firstDay, 'MM-dd-yyyy');
      var lastdate = this.datepipe.transform(lastDay, 'MM-dd-yyyy');
      this.fromDate = firstdate;
      this.toDate = lastdate;
    } else if (this.lastThreeMonth) {
      this.selectedLevel2Model = new UtilizationRegionLeve2ViewRequestModel();
      var date = new Date();
      var firstDay = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() - 90
      );
      var lastDay = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      );
      var firstdate = this.datepipe.transform(firstDay, 'MM-dd-yyyy');
      var lastdate = this.datepipe.transform(lastDay, 'MM-dd-yyyy');

      this.fromDate = firstdate;
      this.toDate = lastdate;
    } else if (this.lastSixMonth) {
      this.selectedLevel2Model = new UtilizationRegionLeve2ViewRequestModel();
      var date = new Date();
      var firstDay = new Date(
        date.getFullYear(),
        date.getMonth() - 6,
        date.getDate()
      );
      var lastDay = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      );
      var firstdate = this.datepipe.transform(firstDay, 'MM-dd-yyyy');
      var lastdate = this.datepipe.transform(lastDay, 'MM-dd-yyyy');

      this.fromDate = firstdate;
      this.toDate = lastdate;
    } else if (this.lastTwelveMonth) {
      var date = new Date();
      var firstDay = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() - 365
      );
      var lastDay = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      );
      var firstdate = this.datepipe.transform(firstDay, 'MM-dd-yyyy');
      var lastdate = this.datepipe.transform(lastDay, 'MM-dd-yyyy');

      this.fromDate = firstdate;
      this.toDate = lastdate;
    } else if (this.customDateRange) {
      this.fromDate = this.customFromDate;
      this.toDate = this.customToDate;
    }
  }
  SetSelectedRegion() {
    if (this.selectedchart == 1) {
      this.datePickerModel.RealTime = this.RealTime;
      this.UtilizationChartData(this.datePickerModel);
    } else if (this.selectedchart == 2) {
      this.selectedLevel2Model.FromDate = this.fromDate;
      this.selectedLevel2Model.ToDate = this.toDate;
      this.selectedLevel2Model.Region = this.selectedRegion;
      this.selectedLevel2Model.RealTime = this.RealTime;
      this.UtilizationChartDataForRegion2(this.selectedLevel2Model);
    } else if (this.selectedchart == 3) {
      this.selectedLevel3Model.FromDate = this.fromDate;
      this.selectedLevel3Model.ToDate = this.toDate;
      this.selectedLevel3Model.Region = this.selectedRegion;
      this.selectedLevel3Model.RealTime = this.RealTime;
      this.UtilizationChartDataForRegion3(this.selectedLevel3Model);
    } else if (this.selectedchart == 4) {
      this.selectedLevel4Model.FromDate = this.fromDate;
      this.selectedLevel4Model.ToDate = this.toDate;
      this.selectedLevel4Model.RealTime = this.RealTime;
      this.UtilizationChartDataForRegion4(this.selectedLevel4Model);
    } else if (this.selectedchart == 5) {
      this.selectedLevel5Model.FromDate = this.fromDate;
      this.selectedLevel5Model.ToDate = this.toDate;
      this.selectedLevel5Model.RealTime = this.RealTime;
      this.UtilizationChartDataForRegion5(this.selectedLevel5Model);
    }
  }
  UtilizationChartDataForRegion4(data) {
    let a = [];
    let maxValues = [];
    // if (this.RealTime) {
    //   this.reportTitle4 =
    //     'Region #' + this.selectedRegion + "'s" + ' Utilization Rate by Models';
    // } else {
    //   this.reportTitle4 =
    //     'Region #' +
    //     this.selectedRegion +
    //     "'s" +
    //     ' Utilization Rate by Models  \n' +
    //     ' ( ' +
    //     this.fromDate +
    //     ' ' +
    //     'To' +
    //     ' ' +
    //     this.toDate +
    //     ' )';
    // }

    this.level4Region = null;
    this.visible = false;
    this.visible = true;
    this.utilizationservice.UtilizationRegionLevel4(data).subscribe((res) => {
      if (res) {
        this.data = res;
        res.grid.forEach((element) => {
          a.push({
            invType: element.invType,
            branchName: element.branchName,
            utilizationRate: element.utilizationRate,
            temp: 'Utilization Region 1',
            color: '#3469a9',
          });
          maxValues.push(element.utilizationRate);
          this.level4Region = groupBy(a, [{ field: 'temp' }]);
        });
        this.selectedchart = 4;
        this.visible = true;
        this.visible = false;
        let max = maxValues.reduce((a, b) => Math.max(a, b)) + 20;
        if (max > 100) {
          this.maxValueLevel4 = 100;
        } else {
          this.maxValueLevel4 = max;
        }
        // this.maxValueLevel3 = Math.ceil(this.maxValueLevel3 / 10) * 10;
      }
    });
  }

  UtilizationChartDataForRegion5(data) {
    let a = [];
    let maxValues = [];
    if (this.RealTime) {
      this.reportTitle5 =
        'Region #' +
        this.selectedRegion +
        "'s" +
        ' Utilization Rate by Inv Type';
    } else {
      this.reportTitle5 =
        'Region #' +
        this.selectedRegion +
        "'s" +
        ' Utilization Rate by Inv Type  \n' +
        ' ( ' +
        this.fromDate +
        ' ' +
        'To' +
        ' ' +
        this.toDate +
        ' )';
    }

    this.level5Region = null;
    this.visible = false;
    this.visible = true;
    this.utilizationservice.UtilizationRegionLevel5(data).subscribe((res) => {
      if (res) {
        this.data = res;
        this.level5Region = res.grid;
        this.selectedchart = 5;
        this.visible = true;
        this.visible = false;
      }
    });
  }
}
