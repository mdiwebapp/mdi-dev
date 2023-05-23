import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SortDescriptor } from '@progress/kendo-data-query';
import { ErrorHandlerService } from 'src/app/core/services';
import { ConsignmentService } from '../consignment.service';
import * as fileSaver from 'file-saver';
import { UtilityService } from 'src/app/core/services/utility.service';
import { ErrorMessages } from 'src/app/core/constant';
@Component({
  selector: 'app-consignment-reports',
  templateUrl: './consignment-reports.component.html',
  styleUrls: ['./consignment-reports.component.scss'],
})
export class ConsignmentReportsComponent implements OnInit {
  data: any = [];
  sort: SortDescriptor[] = [];
  selections: any = [];
  skip: number = 0;
  multiple: boolean = false;
  messenger_by_filter_btn: string = 'All';
  invoice_by_filter_btn: string = 'All';
  messengerreport_by_filter_btn: string = 'All';
  runinvoice_by_filter_btn: string = 'All';
  runinventory_by_filter_btn: string = 'All';
  // selectedEmployee: string = '';
  isConfirmationDialog: boolean = false;
  isMessengerVisible: boolean = false;
  isInvoiceVisible: boolean = false;
  isMessengerReportVisible: boolean = false;
  isrunInvoiceVisible: boolean = false;
  isrunInventoryVisible: boolean = false;
  consignmentReportsForm: FormGroup;
  currentDate: Date = new Date();
  jobNumber: any;
  fromDate: Date = new Date(new Date().setDate(-7));
  toDate: Date = new Date();
  constructor(
    private formBuilder: FormBuilder,
    private utility: UtilityService,
    public service: ConsignmentService,
    public errorHandler: ErrorHandlerService
  ) {}

  ngOnInit(): void { 
    this.jobNumber = this.service.GetJobNumber();
    this.onInitForm();
  }
  onResizeColumn(event) {}

  onSelectionChange(event) {}

  onSortChange(event) {}

  onReOrderColumns(event) {}

  onDataStateChange(event) {}

  onToggleFilter() {}

  onFilterData(value) {}

  onTabChange(event) {}

  onSetFilter() {}

  onInitForm() {
    this.consignmentReportsForm = this.formBuilder.group({
      dateRange: '30',
      from: new Date(),
      to: new Date(),
      filter: 'all',
      sort: 'asc',
      branch: 'all',
    });
  }
  onHandlePrint() {
    console.log(this.consignmentReportsForm);
  }
  getOffRentReport() {
    this.service.GetOffRentReport().subscribe(
      (res) => {
        let data = new Blob([res], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;',
        });
        fileSaver.saveAs(data, 'OffRentOnJob.xlsx');
      },
      (error) => {
        this.onError(error, 'Consignment inventory list bind');
      }
    );
  }
  onHandleDialog(value) {
    // this.utility.toast.error('Report in progress.');
    switch (value) {
      case 'messenger':
        this.isMessengerVisible = !this.isMessengerVisible;
        debugger;
        break;
      // case 'invoice':
      //   this.isInvoiceVisible = !this.isInvoiceVisible;
      //   break;
      case 'messengerreport':
        this.isMessengerReportVisible = !this.isMessengerReportVisible;
        break;
      case 'run-invoice':
        this.isrunInvoiceVisible = !this.isrunInvoiceVisible;
        break;
      // case 'run-inventory':
      //   this.isrunInventoryVisible = !this.isrunInventoryVisible;
      //   break;
      case 'run-report':
        this.isrunInvoiceVisible = !this.isrunInvoiceVisible;
      default:
        break;
    }
  }
  onRunDayByDayMessenger() {
    var data = {
      fromDate: this.fromDate,
      toDate: this.toDate
    }
    this.service.GetExcelRunDayByDayMessenger(data).subscribe(
      (res) => {
        let data = new Blob([res], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;',
        });
        fileSaver.saveAs(data, 'RunDayByDayMessengerInvoicing.xlsx');
      },
      (error) => {
        this.onError(
          error,
          ErrorMessages.consignment.get_run_day_by_day_messenger_invoicing
        );
      }
    );
  }

  private onError(error: any, customMessage?: string) {
    this.errorHandler.handleError(error, 'Consignment', error.message);
  }

  onRunNeedInvoice(status) {
    if (status == 'YES') {
      this.jobNumber = this.service.GetJobNumber();
      this.service.GetExcelRunNeedInvoicing(this.jobNumber).subscribe(
        (res) => {
          let data = new Blob([res], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;',
          });
          fileSaver.saveAs(data, 'RunNeedInvoicing.xlsx');
        },
        (error) => {
          this.onError(error, ErrorMessages.consignment.get_run_need_invoicing);
        }
      );
    } else {
      this.service.GetExcelRunNeedInvoicing('ALL').subscribe(
        (res) => {
          let data = new Blob([res], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;',
          });
          fileSaver.saveAs(data, 'RunNeedInvoicing.xlsx');
        },
        (error) => {
          this.onError(error, ErrorMessages.consignment.get_run_need_invoicing);
        }
      );
    }
    this.isrunInvoiceVisible = !this.isrunInvoiceVisible;
  }
}
