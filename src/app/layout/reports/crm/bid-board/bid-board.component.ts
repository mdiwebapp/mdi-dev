import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EventsModule } from '@progress/kendo-angular-common';
import {
  SchedulerEvent,
  SlotClickEvent,
} from '@progress/kendo-angular-scheduler';
import {
  GridDataResult,
  GroupKey,
  GroupRowArgs,
} from '@progress/kendo-angular-grid';
import { DataStateChangeEvent } from '@progress/kendo-angular-treelist';
import { process, SortDescriptor, State } from '@progress/kendo-data-query';
import moment from 'moment';
import { BidBoardService } from './bid-board.service';
import { ErrorMessages, ModuleNames } from 'src/app/core/constant';
import { ErrorHandlerService } from 'src/app/core/services';
import { DropdownService } from 'src/app/core/services/dropdown.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bid-board',
  templateUrl: './bid-board.component.html',
  styleUrls: ['./bid-board.component.scss'],
})
export class BidBoardComponent implements OnInit {
  isBranchVisible: boolean = false;
  branch: string = 'All';
  branchName: string = 'All';
  state: State = {
    group: [{ field: 'bidDate' }],
  };
  tickets: any = [];
  sort: SortDescriptor[] = [];
  skip: number = 0;
  selections: number[] = [];
  multiple: boolean = false;
  displayEventpopup: boolean = false;
  expandedGroupKeys: GroupKey[] = [];
  branches: any = [];
  branchList: any = [];
  selectedEvent: any = [];
  eventsColumns: any = [
    {
      Name: 'bidDate',
      isCheck: true,
      Text: 'Bid Date',
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
      Name: 'branchName',
      isCheck: true,
      Text: 'Branch',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'jobNumber',
      isCheck: true,
      Text: 'Job#',
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
      Name: 'am',
      isCheck: true,
      Text: 'AM',
      isDisable: false,
      index: 0,
      width: 100,
    },
  ];

  columns: any = [
    {
      Name: 'bidDate',
      isCheck: true,
      Text: 'Bid Date',
      isDisable: false,
      index: 0,
      width: 100,
      hide: true,
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
      Name: 'jobNumber',
      isCheck: true,
      Text: 'Job#',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'am',
      isCheck: true,
      Text: 'AM',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'custName',
      isCheck: true,
      Text: 'Customer',
      isDisable: false,
      index: 0,
      width: 100,
    },
  ];
  bidBoardData: GridDataResult;
  tempbidBoardData: any;
  jobNumbers: string;
  public events: SchedulerEvent[] = [];
  public eventsData: any = [];
  eventDate: Date = new Date();
  public selectedDate: Date = new Date();
  public firstDayDate: Date = new Date();
  public lastDayDate: Date = new Date();
  count = 0;
  selectedRecord = {
    branch: '',
    startDate: '',
    lastDate: '',
  };
  constructor(
    private bidService: BidBoardService,
    public errorHandler: ErrorHandlerService,
    private dropdownService: DropdownService,
    public datepipe: DatePipe,
    private router: Router
  ) {
    this.getBranch();
    this.selectedRecord.branch = this.branch;
    this.selectedRecord.startDate = this.datepipe.transform(
      new Date(
        this.selectedDate.getFullYear(),
        this.selectedDate.getMonth(),
        1
      ),
      'MM-dd-yyyy'
    );
    this.selectedRecord.lastDate = this.datepipe.transform(
      new Date(
        this.selectedDate.getFullYear(),
        this.selectedDate.getMonth() + 1,
        0
      ),
      'MM-dd-yyyy'
    );
    this.getData(this.selectedRecord);
  }

  ngOnInit(): void {}

  onResizeColumn(event) {}

  onRowSelect(event) {}

  onSortChange(event) {}

  onReOrderColumns(event) {}

  onDataStateChange(event: DataStateChangeEvent) {
    this.state = event;
  }

  groupChange() {
    this.expandedGroupKeys = [];
  }

  onHandleBranch() {
    this.isBranchVisible = !this.isBranchVisible;
  }

  onBranchChange(event) {
    this.branchName = event.value;
    this.branch = event.code;
    this.selectedRecord.branch = this.branch;
    this.getData(this.selectedRecord);
    this.isBranchVisible = false;
  }

  onSelectDate(event) {
    if (moment().isSame(moment(event.start), 'month')== moment().isSame(moment(this.selectedDate), 'month')) {
      this.expandedGroupKeys = [
        { field: 'bidDate', value: moment(event.start).format('MM/DD/YYYY') },
      ];
      this.selectedDate = event.start;
      //this.tempbidBoardData = this.events;
      this.eventsData = this.tempbidBoardData.filter(
        (c) => c.bidDate == moment(this.selectedDate).format('MM/DD/YYYY')
      );

      // if (this.eventsData.length) {
      //   this.slotDblClickHandler(event);
      // }

      // this.displayEventpopup = true;
      this.expandedGroupKeys = [
        {
          field: 'bidDate',
          value: moment(this.selectedDate).format('MM/DD/YYYY'),
        },
      ];
    }
  }

  setPrevMonth() {
    this.selectedDate = new Date(
      moment(this.selectedDate).subtract(1, 'month').toDate()
    );
    this.selectedRecord.branch = this.branch;
    this.selectedRecord.startDate = this.datepipe.transform(
      new Date(
        this.selectedDate.getFullYear(),
        this.selectedDate.getMonth(),
        1
      ),
      'MM-dd-yyyy'
    );
    this.selectedRecord.lastDate = this.datepipe.transform(
      new Date(
        this.selectedDate.getFullYear(),
        this.selectedDate.getMonth() + 1,
        0
      ),
      'MM-dd-yyyy'
    );
    this.getData(this.selectedRecord);
  }

  setNextMonth() {
    this.selectedDate = new Date(
      moment(this.selectedDate).add(1, 'month').toDate()
    );
    this.selectedRecord.branch = this.branch;
    this.selectedRecord.startDate = this.datepipe.transform(
      new Date(
        this.selectedDate.getFullYear(),
        this.selectedDate.getMonth(),
        1
      ),
      'MM-dd-yyyy'
    );
    this.selectedRecord.lastDate = this.datepipe.transform(
      new Date(
        this.selectedDate.getFullYear(),
        this.selectedDate.getMonth() + 1,
        0
      ),
      'MM-dd-yyyy'
    );
    this.getData(this.selectedRecord);
  }

  getData(data) {
    this.bidService.GetBidBoardDetails(data).subscribe(
      (res) => {
        if (res) {
          this.bidBoardData = process(res, this.state);
          this.tempbidBoardData = res;
          this.events = [];
          res.forEach((element) => {
            this.events.push({
              title: Number(element.jobValue).toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 0,
              }),
              start: new Date(element.bidDate),
              end: new Date(element.bidDate),
            });
          });
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.bidBoard.get_by_branch);
      }
    );
  }
  private onError(error: any, customMessage?: string) {
    this.errorHandler.handleError(error, ModuleNames.bid_board, customMessage);
  }
  getBranch() {
    this.dropdownService.GetBranchList().subscribe(
      (res) => {
        if (res) {
          this.branches = res;
          if (res.length > 0) {
            this.branches.forEach((element) => {
              if (element.value != 'SSG') {
                this.branchList.push(element);
              }
            });
            if (this.branchList.length > 0) {
              this.GetBranches();
            }
          }
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.bidBoard.get_by_branch);
      }
    );
  }
  GetBranches() {
    this.branchList.unshift({ code: 'All', id: 0, value: 'All' });
    this.branches = this.branchList;
  }

  datechange(event) {
    this.selectedDate = event;
    this.getData(this.selectedRecord);
  }
  public slotDblClickHandler({
    sender,
    start,
    end,
    isAllDay,
  }: SlotClickEvent): void {
    // this.eventDate = start;
    if (moment().isSame(moment(start), 'month')== moment().isSame(moment(this.selectedDate), 'month')) {
      var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      if (days[start.getDay()] === 'Sun' || days[start.getDay()] === 'Sat') {
        this.displayEventpopup = false;
        return;
      } else {
        let currentMonth = new Date().getMonth();
        let eventDate = this.eventDate.getMonth();
        // if (currentMonth == eventDate) {
        this.displayEventpopup = true;
        // }

        this.selectedDate = start;
        //this.tempbidBoardData = this.events;
        this.eventsData = this.tempbidBoardData.filter(
          (c) => c.bidDate == moment(this.selectedDate).format('MM/DD/YYYY')
        );
      }
    }
  }
  
  public closeEvent(status) {
    this.displayEventpopup = false;
  }
  getCalendarDate(date) {
    if (moment(this.selectedDate).isSame(date, 'month')) {
      return moment(date).format('DD');
    } else {
      ('');
    }
  }

  onGridSelection(event) {
    this.selectedEvent = event?.selectedRows[0]?.dataItem;
    this.jobNumbers = event?.selectedRows[0]?.dataItem.jobNumber;
  }
  checkTitle(date){
    if(this.tempbidBoardData){
      var isExist = this.tempbidBoardData.find(
        (c) => c.bidDate == moment(date).format('MM/DD/YYYY')
      );
    }   
    return isExist;  
  }
  onRedirectProject(jobnumber) {
    // this.selectedEvent = event?.selectedRows[0]?.dataItem;
    this.jobNumbers = jobnumber;
    if (jobnumber != 0 || jobnumber !== undefined) {
      var jobNumber = this.jobNumbers;
      localStorage.setItem('jobNumber', jobNumber);
      window.open('/projects', '_blank');
    }
    //  console.log(event);
    // if (event?.selectedRows) {
    //   if (
    //     event?.selectedRows?.[0]?.dataItem?.jobNumber !=
    //     selectedEvent?.jobNumber
    //   ) {
    //     this.count = 0;
    //   }
    //   selectedEvent = event?.selectedRows[0]?.dataItem;
    //   this.jobNumbers = event?.selectedRows[0]?.dataItem.jobNumber;
    // }
    // this.count += 1;
    // if (this.count === 2) {
    //   this.count = 0;
    //   // this.router.navigate([`/projects?jobNumber${selectedEvent?.jobNumber}`]);
    //   //this.router.navigate([`/projects`]);
    //   var jobNumber = this.jobNumbers;
    //   localStorage.setItem('jobNumber', jobNumber);
    //   window.open('/projects', '_blank');
    // }
  }
}
