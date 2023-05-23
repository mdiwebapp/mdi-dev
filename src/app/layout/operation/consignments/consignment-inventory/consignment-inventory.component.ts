import { Component, Input, OnInit } from '@angular/core';
import { ThemeService } from '@progress/kendo-angular-charts';
import { CancelEvent } from '@progress/kendo-angular-grid';
import {
  Resource,
  SchedulerComponent,
  SchedulerEvent,
  SlotClickEvent,
} from '@progress/kendo-angular-scheduler';
import { orderBy, SortDescriptor } from '@progress/kendo-data-query';
import moment from 'moment';
import { ErrorHandlerService } from 'src/app/core/services';
import { UtilityService } from 'src/app/core/services/utility.service';
import {
  inventoryColumns,
  inventoryData,
  jobInventoryData,
  jobInventoryColumns,
  subinvoiceData,
  subinvoiceColumns,
  utilizationCalColumns,
} from 'src/data/consitement.data';
import { ConsignmentService } from '../consignment.service';

@Component({
  selector: 'app-consignment-inventory',
  templateUrl: './consignment-inventory.component.html',
  styleUrls: ['./consignment-inventory.component.scss'],
})
export class ConsignmentInventoryComponent implements OnInit {
  @Input() jobs = [];
  data: any = [];
  sort: SortDescriptor[] = [{ field: 'jobId', dir: 'asc' }];
  public selectedDate: Date = new Date();
  pdcData: any = [];

  selections: number[] = [0];
  inventorySelections: number[] = [0];
  skip: number = 0;
  multiple: boolean = false;
  columns: any = [];
  invoices: any = [];
  invoiceColumns: any = [];
  inventories: any[];
  inventoryColumns: any[];
  jobInventoryData: any[];
  jobInventoryColumns: any[];
  isCalenderVisible: boolean = false;
  events: SchedulerEvent[] = [];
  jobNumber: any;
  utilizationCalColumns: any[];
  utilizationcalendarData = [];
  invNumber: string = '';
  datepickerdate: any = new Date();
  selectedLog: any = [];
  confirm_title: string = '';
  confirm_message: string = '';
  isConfirmDialogVisible: boolean = false;
  currentStatus: string = '';
  toggle = true;
  status = 'OFF RENT';
  eventDate: Date = new Date();
  selectedActions: string = '';
  allEvents = [];
  isNoActionVisible: boolean = false;
  offrentStatus: string = '';
  visible: boolean = false;

  constructor(
    public service: ConsignmentService,
    public errorHandler: ErrorHandlerService,
    private utilityService: UtilityService
  ) {
    //this.inventories = inventoryData;
    this.inventoryColumns = inventoryColumns;
    //this.jobInventoryData = jobInventoryData;
    this.jobInventoryColumns = jobInventoryColumns;
    this.invoices = subinvoiceData;
    this.invoiceColumns = subinvoiceColumns;
    this.utilizationCalColumns = utilizationCalColumns;
  }

  ngOnInit(): void {}

  GetInventoryList(jobNum) {
    if (jobNum) {
      this.jobNumber = jobNum;
      this.service.GetInventoryList(jobNum).subscribe(
        (res) => {
          if (res != null && res.length > 0) {
            this.inventories = res;
            this.jobInventoryData = [];
            if(this.isCalenderVisible) {
              this.onSelectionChange(this.inventories[this.selections[0]]);
            }else {
              this.selections = [0]
              this.onSelectionChange(this.inventories[0]);
            }
          } else {
            this.inventories = [];
            this.onSelectionChange(null);
          }
        },
        (error) => {
          this.onError(error, 'Consignment inventory list bind');
        }
      );
    } else {
      this.inventories = [];
      this.onSelectionChange(null);
    }
  }
  onResizeColumn(event) {}

  onSelectionChange(event) {
    if (event) {
      this.selectedLog = event;
      this.service
        .GetInventoryTransList(event.inventoryNumber, this.jobNumber)
        .subscribe(
          (res) => {
            if (res != null && res.length > 0) {
              this.jobInventoryData = res;
            } else {
              this.jobInventoryData = [];
            }
          },
          (error) => {
            this.onError(error, 'Consignment inventory list bind');
          }
        );
    } else {
      this.jobInventoryData = [];
    }
  }

  onSortChange(sort: SortDescriptor[]) {
    this.sort = sort;
    this.jobInventoryData = orderBy(this.jobInventoryData, sort);
    this.utilizationCalColumns = orderBy(this.utilizationCalColumns, sort);
  }

  onReOrderColumns(event) {}

  onDataStateChange(event) {}

  onTabChange(event) {}

  onChangeOffRentCheck(event, invNumber, rowIndex) {
    this.selectedLog = this.inventories[rowIndex];
    event.target.checked = !event.target.checked;
    this.selections = [rowIndex];
    this.invNumber = invNumber;
    this.GetUtilizationCalenderList();
    this.isCalenderVisible = true;
    this.onSelectionChange(this.inventories[this.selections[0]])
  }

  onHandleDialog(type) {
    switch (type) {
      case 'save':
        this.confirm_title = 'MDI3.0';
        this.confirm_message =
          'Do you want to submit these changes? This will overwrite the existing ON/OFF values';
        this.isConfirmDialogVisible = true;
        this.selectedActions = 'save';
        break;
      case 'reload':
        this.confirm_title = 'MDI3.0';
        this.confirm_message =
          'Do you want to reload the screen? All changes not submitted will be lost.';
        this.isConfirmDialogVisible = true;
        this.selectedActions = 'reload';
        break;
      case 'close-calendar':
        this.isCalenderVisible = false;
        this.utilizationcalendarData = [];
        break;
      case 'close':
        this.isConfirmDialogVisible = !this.isConfirmDialogVisible;
        break;
      case 'confirm':
        this.isConfirmDialogVisible = !this.isConfirmDialogVisible;
        if (this.selectedActions === 'save') {
          this.onloadSave();
        } else if (this.selectedActions === 'reload') {
          this.events = this.allEvents;
          this.utilizationcalendarData = [];
        }
        this.selectedActions = '';
        this.selectedDate = new Date();
        break;
      case 'month':
        this.isNoActionVisible = !this.isNoActionVisible;
        break;
      default:
        break;
    }
  }
  private onError(error: any, customMessage?: string) {
    this.errorHandler.handleError(error, 'Consignment', error.message);
  }

  //utilization Calender//

  dateChangeHandler(sender) {
    if (this.selectedDate != sender.selectedDate) {
      this.selectedDate = sender.selectedDate;
      this.GetUtilizationCalenderList();
    }
  }
  public cancelHandler({ sender }: CancelEvent): void {}
  private closeEditor(scheduler: SchedulerComponent): void {
    scheduler.closeEvent();
  }
  datechange(event) {
    this.selectedDate = event;
    this.GetUtilizationCalenderList();
  }
  setCurrentDate() {
    this.selectedDate = new Date();
    this.datepickerdate = this.selectedDate;
    // this.GetUtilizationCalenderList();
  }
  setPrevMonth() {
    if (!this.utilizationcalendarData.length) {
      this.selectedDate = new Date(
        this.selectedDate.setMonth(this.selectedDate.getMonth() - 1)
      );
      this.datepickerdate = this.selectedDate;
      this.GetUtilizationCalenderList();
    } else {
      this.isNoActionVisible = !this.isNoActionVisible;
    }
  }
  setNextMonth() {
    if (!this.utilizationcalendarData.length) {
      this.selectedDate = new Date(
        this.selectedDate.setMonth(this.selectedDate.getMonth() + 1)
      );
      this.datepickerdate = this.selectedDate;
      this.GetUtilizationCalenderList();
    } else {
      this.isNoActionVisible = !this.isNoActionVisible;
    }
  }

  GetUtilizationCalenderList() {
    var data = {
      inventoryNumber: this.invNumber,
      userName: JSON.parse(this.utilityService.storage.getItem('currentUser'))
        .userName,
      year: this.selectedDate.getFullYear(),
      month: this.selectedDate.getMonth() + 1,
    };
    this.service.GetUtilizationCalenderList(data).subscribe(
      (res) => {
        {
          this.events = [];
          res.monthList.forEach((element) => {
            this.events.push({
              title: { ...element, label: `Job: ${element.job}` },
              start: new Date(element.date),
              end: new Date(element.date), //new Date("2022-06-22T09:30:00"),
              isAllDay: false,
            });
            this.offrentStatus = res?.currentStatus;
            this.allEvents = this.events;
            // this.isCalenderVisible = !this.isCalenderVisible;
          });
        }
      },
      (error) => {
        this.onError(error, 'Utilization Calender List bind');
      }
    );
  }

  onloadSave() {
    var data = {
      currentstatus: this.offrentStatus,
      userName: JSON.parse(this.utilityService.storage.getItem('currentUser'))
        .userName,
      monthList: this.utilizationcalendarData,
    };
    if (data?.monthList.length) {
      this.service.onloadSave(data).subscribe((result) => {
        {
          if (result?.status === 200) {
            this.utilityService.toast.success(result?.message);
            this.selectedDate = new Date();
            this.utilizationcalendarData = [];
            this.GetUtilizationCalenderList();
            this.GetInventoryList(data.monthList[0]?.job)
          } else if (this.selectedActions === 'reload') {
            this.selectedActions = '';
            this.selectedDate = new Date();
            this.utilizationcalendarData = [];
          }
        }
      });
    }
  }

  enableDisableRule() {
    this.offrentStatus =
      this.offrentStatus === 'OffRent' ? 'OnRent' : 'OffRent';
  }

  onSlotClick(event) {
    let tempEvents = [...this.events];
    const eventIndex = tempEvents.findIndex(
      (item: any) =>
        item.title.job === event.job &&
        item.title.inventoryNumber === event?.inventoryNumber &&
        item.title.date === event?.date
    );

    const gridIndex = this.utilizationcalendarData.findIndex(
      (item: any) =>
        item.job === event.job &&
        item.inventoryNumber === event?.inventoryNumber &&
        item.date === event.date
    );

    if (gridIndex < 0) {
      this.utilizationcalendarData.push({ ...event, offRent: !event?.offRent });
    } else {
      this.utilizationcalendarData.splice(gridIndex, 1);
    }

    const updatedGridIndex = this.utilizationcalendarData.findIndex(
      (item: any) =>
        item.job === event.job &&
        item.inventoryNumber === event?.inventoryNumber &&
        item.date === event.date
    );

    if (eventIndex > -1) {
      tempEvents[eventIndex] = {
        ...tempEvents[eventIndex],
        title: {
          ...event,
          offRent: !event?.offRent,
          label:
            updatedGridIndex > -1
              ? !event.offRent
                ? 'Changed Off Rent'
                : 'Changed On Rent'
              : `Job: ${event.job}`,
        },
      };
    }

    this.events = [...tempEvents];
  }

  getCalendarDate(date) {
    if (moment(this.selectedDate).isSame(date, 'month')) {
      return moment(date).format('DD');
    } else {
      ('');
    }
  }
}
