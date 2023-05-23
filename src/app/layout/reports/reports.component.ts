import { Component, OnInit, ViewChild } from '@angular/core';
import { Series, SeriesComponent, SeriesDefaults, SeriesDefaultsLabels, SeriesLabels, SeriesLabelsVisualArgs, ValueAxisLabels } from '@progress/kendo-angular-charts';
import { geometry, Layout, Rect, Group, Text, Path, LinearGradient, GradientOptions, GradientStop, ShapeOptions } from "@progress/kendo-drawing";
import { AxisLabelVisualArgs } from '@progress/kendo-angular-charts';
import { GroupResult, groupBy } from '@progress/kendo-data-query';
import { TabStripComponent } from '@progress/kendo-angular-layout';
import { MenuService } from 'src/app/core/helper/menu.service';
import { Router } from '@angular/router';
import { UtilityService } from 'src/app/core/services/utility.service';
@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  @ViewChild('tabstrip') public tabstrip: TabStripComponent;
  constructor(public menuService: MenuService,
    public router: Router,
    public utils: UtilityService,
  ) {
    if (localStorage.getItem("isAdmin") != 'true') {
      this.menuService.checkUserBySubmoduleRights('Executive Dashboard');
      if (!this.menuService.isViewRight) {
        this.utils.toast.error("User does not have rights to access this module.");
        this.router.navigate(['dashboard']);
      }
    }

  }

  ngOnInit(): void {
    console.log(this.actualVsForecastDataStacked);

  }
  testData = [{
    date: 1999,
    percent: 0.23,
    number: 4271
  },
  {
    date: 2000,
    percent: 0.41,
    number: 7624
  },
  {
    date: 2001,
    percent: 0.55,
    number: 9987
  }]

  public labelsVisual = (e) => {

    const index = e.series.index;
    const color = e.options.markers.background;
    const labelColor = e.options.labels.color;
    const rect = new geometry.Rect([0, 0], [120, 50]);
    const layout = new Layout(rect, {
      spacing: 5,
      alignItems: "center"
    });

    const overlay = new Rect(layout.bbox(), {
      fill: {
        color: "#fff",
        opacity: 0
      },
      stroke: {
        color: "none"
      },
      cursor: "pointer"
    });
    const label = new Text(e.series.name, [0, 0], {
      font: e.options.labels.font,
      fill: {
        color: labelColor
      }
    });

    if (index === 0) {  //to hide the marker for "Days in Progress" legend
      var marker = new Rect(new geometry.Rect([0, 0], [0, 0]), {
        fill: {
          color: "white"
        },
        stroke: null
      });
    }


    layout.append(label, label);
    layout.reflow();
    return layout;
    //const group = new Group().append(layout, overlay);
    //return group;
  }

  public seriesLabelsActualVsForecast: SeriesLabels = {
    visible: true,
    align: 'left',
    padding: -100,
    background: "transparent",
    content: (e: any) => { return `${'$' + e.value}` }
    //visual: this.labelsVisual
  };

  public MainSeriesLables = {
    template: "#= stackValue #"
  }





  public valueAxisLables: ValueAxisLabels = {
    visible: true, // Note that visible defaults to false
    background: "transparent",
    content: (e: any) => { return this.formatLongNumber(e) }
  }

  formatLongNumber(e) {
    var xAxisValue = e.value;
    if (xAxisValue == 0) {
      return 0;
    }
    else {
      // for testing
      //value = Math.floor(Math.random()*1001);

      // hundreds
      if (xAxisValue <= 999) {
        return xAxisValue;
      }
      // thousands
      else if (xAxisValue >= 1000 && xAxisValue <= 999999) {
        return (xAxisValue / 1000) + 'K';
      }
      // millions
      else if (xAxisValue >= 1000000 && xAxisValue <= 999999999) {
        return (xAxisValue / 1000000) + 'M';
      }
      // billions
      else if (xAxisValue >= 1000000000 && xAxisValue <= 999999999999) {
        return (xAxisValue / 1000000000) + 'B';
      }
      else
        return xAxisValue;
    }
  }

  public labelContentActualVsForecast(e: any): string {

    return `${'$' + e.dataItem.title}`;
  }


  public actualVsForecastAxisData = ['CHI', 'ATL', 'BALT'];
  public actualVsForecastAMData = ['Allan Schmitz', 'Bradley Flood', 'Daniel Powell'];
  public actualvsforecastSeriesdata = [
    { mb: 110, ma: 245751, yb: 245751, ya: 245751, ab: 245751, ap: 245751 },
    { mb: 10, ma: 245751, yb: 245751, ya: 245751, ab: 245751, ap: 245751 },
    { mb: 200, ma: 245751, yb: 245751, ya: 245751, ab: 245751, ap: 245751 }
  ]


  series: [
    { stack: { group: "a" }, data5: [1, 2] },
    { stack: { group: "b" }, data6: [3, 4] },
    { stack: { group: "c" }, data7: [5, 6] }
  ]

  public actualVsForecastData = [
    {
      name: "Branch 1",
      title: "Monthly Budget",
      stack: 'a',
      value: 737300,
      type: 'Budget'
    },
    {
      name: "Branch 1",
      title: "Monthly Actual",
      stack: 'a',
      value: 2714140,
      type: 'Annual'
    },
    {
      name: "Branch 1",
      title: "YTD Budget",
      stack: 'b',
      value: 1919000,
      type: 'Budget'
    },
    {
      name: "Branch 1",
      title: "YTD Actual",
      stack: 'b',
      value: 2208909,
      type: 'Annual'
    },
    {
      name: "Branch 1",
      title: "Annual Budget",
      stack: 'c',
      value: 2208909,
      type: 'Budget'
    },
    {
      name: "Branch 1",
      title: "Annual Pace",
      stack: 'c',
      value: 2208909,
      type: 'Annual'
    },
    {
      name: "Branch 2",
      title: "Monthly Budget",
      stack: 'a',
      value: 737300,
      type: 'Budget'
    },
    {
      name: "Branch 2",
      title: "Monthly Actual",
      stack: 'a',
      value: 2714140,
      type: 'Annual'
    },
    {
      name: "Branch 2",
      title: "YTD Budget",
      stack: 'b',
      value: 1919000,
      type: 'Budget'
    },
    {
      name: "Branch 2",
      title: "YTD Actual",
      stack: 'b',
      value: 2208909,
      type: 'Annual'
    },
    {
      name: "Branch 2",
      title: "Annual Budget",
      stack: 'c',
      value: 2208909,
      type: 'Budget'
    },
    {
      name: "Branch 2",
      title: "Annual Pace",
      stack: 'c',
      value: 2208909,
      type: 'Annual'
    },
    {
      name: "Branch 3",
      title: "Monthly Budget",
      stack: 'a',
      value: 737300,
      type: 'Budget'
    },
    {
      name: "Branch 3",
      title: "Monthly Actual",
      stack: 'a',
      value: 2714140,
      type: 'Annual'
    },
    {
      name: "Branch 3",
      title: "YTD Budget",
      stack: 'b',
      value: 1919000,
      type: 'Budget'
    },
    {
      name: "Branch 3",
      title: "YTD Actual",
      stack: 'b',
      value: 2208909,
      type: 'Annual'
    },
    {
      name: "Branch 3",
      title: "Annual Budget",
      stack: 'c',
      value: 2208909,
      type: 'Budget'
    },
    {
      name: "Branch 3",
      title: "Annual Pace",
      stack: 'c',
      value: 2208909,
      type: 'Annual'
    }
  ]

  public actualVsForecastDataStacked = groupBy(this.actualVsForecastData, [{ field: 'title' }]);

  public data1: any[] = [
    {
      kind: "IPC",
      mnth: 271.600,
      ytd: 271.414,
      share: 0.50,
    },
    {
      kind: "# of quotes",
      mnth: 271.411,
      ytd: 271.414,
      share: 0.250,
    },
    {
      kind: "Activated",
      mnth: 271.412,
      ytd: 271.414,
      share: 0.50,
    },
    {
      kind: "Strike",
      mnth: 271.500,
      ytd: 271.414,
      share: 0.150,
    },
  ];





  public data2: any[] = [
    {
      kind: "L2R%",
      mnth: 271.100,
      ytd: 271.114,
      share: 0.150,
    },
    {
      kind: "O/H Hours",
      mnth: 271.200,
      ytd: 271.214,
      share: 0.150,
    },
    {
      kind: "Tot Hrs",
      mnth: 271.300,
      ytd: 271.314,
      share: 0.150,
    },
    {
      kind: "O/H Ratio",
      mnth: 271.400,
      ytd: 271.414,
      share: 0.150,
    },
  ];

  public labelContent1(e: any): string {
    return `${e.category}:`;
  }

  public model = [
    {
      stat: "Accuracy ",
      count: 434823,
      color: "#0e5a7e",
    },
    {
      stat: "Pipeline Rev",
      count: 356854,
      color: "#166f99",
    },
    {
      stat: "100%",
      count: 280022,
      color: "#2185b4",
    },
    {
      stat: "75%",
      count: 190374,
      color: "#319fd2",
    },
    {
      stat: "50%",
      count: 120392,
      color: "#3eaee2",
    },
  ];

  public actualVsForecastAxisData1 = ['branch 1', 'branch 2', 'branch 3', 'branch 4'];



  public weatherData = [
    { month: "January", min: 0, max: 11 },
    { month: "February", min: 0, max: 13 },
    { month: "March", min: 0, max: 15 },
    { month: "April", min: 0, max: 19 },
  ];
  public accData = [
    { month: "current", min: 0, max: 470 },
    { month: "30-60", min: 0, max: 487 },
    { month: "60-90", min: 0, max: 161 },
    { month: "90+", min: 0, max: 146 },
  ];

  public listBranches: Array<string> = [
    'branch 1', 'branch 2', 'branch 3', 'branch 4', 'branch 5', 'branch 6', 'branch 7', 'branch 8', 'branch 9', 'branch 10', 'branch 11', 'branch 12', 'branch 13', 'branch 14', 'branch 15'
  ];


  public branchDetails = [
    {
      name: 'branch 1',
      month_budget: '$737300',
      month_actual: '$1241414'
    },
    {
      name: 'branch 3',
      month_budget: '$737300',
      month_actual: '$8271414'
    },
    {
      name: 'branch 4',
      month_budget: '$737300',
      month_actual: '$86234'
    },
  ];

  isShow: boolean = true;

  show() {
    this.isShow = true;
    this.tabstrip.selectTab(1);

  }

  /* public model2: any[] = internetGrowthData;*/

  public labelContent2(e: any): string {
    return `${e.category}: \n ${e.value}$`;
  }


}

export const internetGrowthData = [
  {
    name: "Account Recievable",
    data: [
      {
        category: "Current",
        value: 790347,
        color: "#9de219",
      },
      {
        category: "30-60",
        value: 631788,
        color: "#90cc38",
      },
      {
        category: "60-90",
        value: 246925,
        color: "#068c35",
      },
      {
        category: "90+",
        value: 1679222,
        color: "#006634",
      },
      {
        category: "Total A/R",
        value: 3366283,
        color: "#004d38",
      },
      {
        category: "90 + %",
        value: 50.55,
        color: "#033939",
      },
    ],
  },

]
