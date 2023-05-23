import { Component, OnInit } from '@angular/core';
import { process,SortDescriptor } from '@progress/kendo-data-query';
import { DropDownModel, EmployeeType } from 'src/app/core/models/drop-down.model';
import { DropdownService } from 'src/app/core/services/dropdown.service';
import { FleetService } from '../../admin/IT/paul/fleet/fleet/fleet.service';
import { ErrorHandlerService, PagerService } from 'src/app/core/services';
import { ModuleNames, ErrorMessages } from 'src/app/core/constant';
import * as fileSaver from 'file-saver';
import { FleetInfoService } from '../../admin/IT/paul/fleet/fleet-info/fleet-info.service';
import { saveAs } from 'file-saver';
import { UtilityService } from 'src/app/core/services/utility.service';
import { MenuService } from 'src/app/core/helper/menu.service';


@Component({
  selector: 'app-pipeline-reports',
  templateUrl: './pipeline-reports.component.html',
  styleUrls: ['./pipeline-reports.component.scss'],
})
export class PipelineReportsComponent implements OnInit {
  sort: SortDescriptor[] = [];
  skip: number = 0;
  multiple: boolean = false;
  branchselections: any = [];
  AMselections: any = [];
  branch_btn: string = 'ALL';
  branchList: DropDownModel[];
  branchData: any = [];
  tempbranchData: any = [];
  account_btn: string = 'ALL';
  accountData: any = [];
  tempaccountData: any = [];
  accountList: EmployeeType[];
  doit_btn: any = [];
  selectedBranch: any = 'All';
  viewData: any = [];

  selectedAccount: any = 'All';
  isbranchVisible: boolean = false;
  isaccountVisible: boolean = false;
  visible:boolean;
  selectedBranchname: any = 'All';
  selectedAccountname: any = 'All';
  filterbranch: any = '';
  filterAM: any = '';
  // isdoitVisible: boolean = false;

  constructor(
    public dropdownservice: DropdownService,
    public errorHandler: ErrorHandlerService,
    public fleetservice: FleetService,public menuService: MenuService, private utility: UtilityService,
    public fleetinfoservice: FleetInfoService
  ) {
    if (localStorage.getItem('isAdmin') == 'true') {
     
    } else {
      let acc = this.menuService.checkUserViewRights('Pipeline report');
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
    this.GetBranch();
    this.GetAccoutnManager();
   }

  onResizeColumn() { }

  onRowSelect(event, type) {
    if (type === 'branch') {
      this.selectedBranchname = event.selectedRows[0].dataItem.value;
      this.selectedBranch = event.selectedRows[0].dataItem.code;
      this.isbranchVisible = false;
    } else if (type === 'account_manager') {
      this.selectedAccountname = event.selectedRows[0].dataItem.name;
      this.selectedAccount = event.selectedRows[0].dataItem.id == 0 ? 'All': event.selectedRows[0].dataItem.id; 
      this.isaccountVisible = false;
    }
  }

  onSortChange() { }

  onReOrderColumns() { }

  onDataStateChange() { }

  onHandleFilters(value) {
    debugger;
    switch (value) {
      case 'branch':
        this.isbranchVisible = !this.isbranchVisible;
        break;
      case 'account':
        this.isaccountVisible = !this.isaccountVisible;
        break;
      // case 'doit':
      //   this.isdoitVisible = !this.isdoitVisible;
      //   break;
      case 'doit':
        this.visible=false;
        this.visible = true;
        var request = {branch: this.selectedBranch , account_manager: this.selectedAccount, report_type: 'PIPELINE'};
        this.fleetinfoservice.ExportToExcelDoIt(request).subscribe(
          (res) => {
            // let data = new Blob([res], {
            //   type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;',
            // });
            // this.visible=false;
            // fileSaver.saveAs(data, 'PipeLineReport.xlsx');
            if(res.size > 0) {
              saveAs(res, 'PipeLineReport.xlsx');
              this.filterAM = '';
              this.filterbranch = '';
              this.OnfilterAM(this.filterAM);
              this.OnfilterBranch(this.filterbranch);
              this.AMselections = this.selectedAccount == "All" ? [0] : [this.accountData.findIndex(x => x.id == this.selectedAccount)];
              this.branchselections = [this.branchData.findIndex(x => x.code == this.selectedBranch)];
              this.visible=true;
              this.visible=false;
              }
              else
              {
                this.visible = true;
                this.visible = false;
              }
          },
          (error) => {
            this.visible=false;
            this.onError(error, ErrorMessages.fleet.download_pipeline_data);
          }
        );
        break;
      default:
        break;
    }
  }

  GetBranch() {
    // this.dropdownservice.GetBranchList().subscribe(
    //   (res) => {
    //     if (res) {
    //       this.branchList = res.sort((a, b) => a.value.localeCompare(b.value));
    //       this.branchData = res.sort((a, b) => a.value.localeCompare(b.value));
    //       var index = this.branchData.findIndex((c) => c.value == 'SSG');
    //       this.branchData.splice(index, 1);
    //       this.branchData.unshift({ code: 'All', id: 0, value: 'All' });
    //       this.branchData = this.branchData;
    //       // debugger;
    //       this.selectedBranch = this.branchData[0];
    //     }
    //   },
    //   (error) => this.onError(error, ErrorMessages.drop_down.branch_list)
    // );
    this.visible = false;
    this.visible = true;
    this.dropdownservice.GetBranchList().subscribe((result) => {
      this.branchData = this.tempbranchData = [
        { code: 'All', value: 'All' },
        ...result,
      ];
      this.tempbranchData = this.branchData;
      this.visible = true;
      this.visible = false;
    },(error) => {
      this.visible = true;
      this.visible = false;
    });
  }

  OnfilterBranch(data: any) {
    this.filterbranch = data;
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
          }, 
        ],
      },
    }).data;
}

OnfilterAM(data: any) {
  this.filterAM = data;
  this.accountData = process(this.tempaccountData, {
    filter: {
      logic: 'or',
      filters: [
        {
          field: 'name',
          operator: 'contains',
          value: data,
        },    
        {
          field: 'id',
          operator: 'contains',
          value: data,
        }, 
      ],
    },
  }).data;
}

  private onError(error: any, customMessage?: string) {
    this.errorHandler.handleError(error, ModuleNames.fleet, customMessage);
  }


  GetAccoutnManager() {
    // this.dropdownservice.GetAccountManagerList().subscribe(
    //   (res) => {
    //     if (res) {
    //       this.accountList = res.sort((a, b) => a.name.localeCompare(b.name));
    //       this.accountData = res.sort((a, b) => a.name.localeCompare(b.name));
    //       var index = 0;
    //       this.accountData.splice(index, 1);
    //       this.accountData.unshift({ id: 0, name: 'All' });
    //       this.accountData = this.accountData;
    //       // debugger;
    //       this.selectedAccount = this.accountData[0];
    //     }
    //   },
    //   (error) => this.onError(error, ErrorMessages.drop_down.account_manager_list)
    // );
    this.visible = false;
    this.visible = true;
    this.dropdownservice.GetAccountManagerList().subscribe((result) => {
      this.accountData = this.tempaccountData = [
        { id: '0', name: 'All' },
        ...result,
      ];
      this.tempaccountData = this.accountData;
      this.visible = true;
      this.visible = false;
    },(error) => {
      this.visible = true;
      this.visible = false;
    });
  }
}

// export const accountData_ignore = [
//   {
//     name: 'All',
//   },
//   {
//     name: 'Marsion , Marco',
//   },
//   {
//     name: 'Marsion , Gino',
//   },
//   {
//     name: 'Marsion , Dominic',
//   },
// ];
