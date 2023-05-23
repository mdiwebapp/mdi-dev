import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { orderBy, SortDescriptor } from '@progress/kendo-data-query';
import moment from 'moment';
import { BuildingTicketsService } from './building-tickets.service';
import {
  BuildingRequestTicketsViewFilterModel,
  BuildingRequestTicketsUpdateRequestModel,
} from './building-tickets.model';
import { UtilityService } from '../../../core/services/utility.service';
import * as fileSaver from 'file-saver';
import { BuildingRequestStatusEnum } from '../../../core/models/enum-model';
import { MenuService } from 'src/app/core/helper/menu.service';
@Component({
  selector: 'app-building-tickets',
  templateUrl: './building-tickets.component.html',
  styleUrls: ['./building-tickets.component.scss'],
})
export class BuildingTicketsComponent implements OnInit {
  isCreatable: boolean = false;
  isEditable: boolean = false;
  isDisable: boolean = true;
  isDisableComboBox: boolean = false;
  isDisableReply: boolean = true;
  isOpen: boolean = true;
  searchText: string = '';
  replyText: string = '';
  notesText: string = '';
  buildingRequestTicketsViewFilterModel =
    new BuildingRequestTicketsViewFilterModel();
  buildingRequestTicketsUpdateRequestModel =
    new BuildingRequestTicketsUpdateRequestModel();
  tickets: any = [];
  ticketsSort: SortDescriptor[] = [];
  ticketsSelection: number[] = [0];
  tempRequestData: any;
  buildingRequest = new BuildingRequestStatusEnum();
  ticketsColumns: any = [
    {
      Name: 'ticketNumber',
      isCheck: true,
      Text: 'Ticket#',
      isDisable: false,
      index: 0,
      width: 50,
    },
    {
      Name: 'branchName',
      isCheck: true,
      Text: 'Branch',
      isDisable: false,
      index: 0,
      width: 50,
    },
    {
      Name: 'createdBy',
      isCheck: true,
      Text: 'Created By',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'type',
      isCheck: true,
      Text: 'Type',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'building',
      isCheck: true,
      Text: 'Building',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'submitDate',
      isCheck: true,
      Text: 'Submit Date',
      isDisable: false,
      index: 0,
      width: 50,
    },
    {
      Name: 'message',
      isCheck: true,
      Text: 'Message',
      isDisable: false,
      index: 0,
      width: 200,
    },
  ];
  skip: number = 0;
  multiple: boolean = false;
  selectedTicket: any = null;
  filters: any = [
    {
      label: 'Open',
      value: 'Open',
    },
    {
      label: 'Close',
      value: 'Close',
    },
    {
      label: 'Elevate',
      value: 'Elevate',
    },
    {
      label: 'assigned to',
      value: 'assigned to',
    },
  ];
  ticketForm: FormGroup;
  titleValue: any;
  visible: boolean;
  requestData: any;
  public sortTicket: SortDescriptor[] = [
    {
      field: 'ticketNumber',
      dir: 'asc',
    },
    {
      field: 'branch',
      dir: 'asc',
    },
    {
      field: 'createdBy',
      dir: 'asc',
    },
    {
      field: 'type',
      dir: 'asc',
    },
    {
      field: 'building',
      dir: 'asc',
    },
    {
      field: 'submitDate',
      dir: 'asc',
    },
    {
      field: 'message',
      dir: 'asc',
    },
  ];
  constructor(
    private formBuilder: FormBuilder,
    public buildingTicketsService: BuildingTicketsService,
    public utilityService: UtilityService,
    public menuService: MenuService
  ) {
    if (localStorage.getItem('isAdmin') == 'true') {
    } else {
      let acc = this.menuService.checkUserViewRights('Building Tickets');
      if (acc) {
        //this.utils.toast.error("User does not have rights to access " + name + " module.");Z
      } else {
        this.utilityService.toast.error(
          'You do not have permissions to access this part of the system. Please contact your supervisor so they can request them from IT.'
        );
        setTimeout(() => {
          var url = '/dashboard';
          location.href = url;
        }, 1000);
      }
      this.menuService.checkUserBySubmoduleRights('Building Tickets');
    }
    
  }

  ngOnInit(): void {
    this.buildingRequestTicketsViewFilterModel =
      new BuildingRequestTicketsViewFilterModel();
    this.buildingRequest = new BuildingRequestStatusEnum();
    this.buildingRequestTicketsUpdateRequestModel =
      new BuildingRequestTicketsUpdateRequestModel();
    this.buildingRequestTicketsViewFilterModel.Status =
      this.buildingRequest.Open;
    this.getBuildingTicketRequest();
    this.onInitForm({});
  }

  onHandleOperation(type) {
    switch (type) {
      case 'edit':
        this.isDisable = false;
        this.isDisableComboBox = true;
        this.isDisableButtons();
        break;
      case 'save':
        this.isDisable = true;
        this.isDisableComboBox = false;
        this.isDisableReply = true;
        this.onSave();
        break;
      case 'cancel':
        this.isDisable = true;
        this.isDisableComboBox = false;
        this.isDisableReply = true;
        break;
      case 'reply':
        this.isDisable = true;
        this.isDisableComboBox = false;
        this.isDisableReply = true;
        this.onReply();
        break;
      case 'close':
        this.isDisable = true;
        this.isDisableComboBox = false;
        this.isDisableReply = true;
        this.onReplyAndClose();
        break;

      default:
        break;
    }
  }

  onResizeColumn(event) {}

  onSelectionChange(event) {
    this.selectedTicket = event.selectedRows[0].dataItem;
    this.onInitForm(event.selectedRows[0].dataItem);
    this.getBuildingRequestTicketDetails();
  }

  onSortChange(sort: SortDescriptor[]) {
    this.ticketsSort = sort;
    this.tickets = orderBy(this.tickets, sort);
  }

  onReOrderColumns(event) {}

  onDataStateChange(event) {}

  onInitForm(values) {
    this.ticketForm = this.formBuilder.group({
      message: values?.message || '',
      reply: values?.reply || '',
      notes: values?.notes || '',

      title: values?.ticketNumber
        ? `${values?.ticketNumber} - Re: ${values?.createdBy} - ${
            values?.branch
          } - ${moment(values?.submitDate).format('MM/DD/YYYY')}`
        : '',
      description: this.searchText || '',
    });
    this.titleValue = this.ticketForm.value.title;
  }

  getBuildingTicketRequest() {
    this.tickets = [];
    this.visible = false;
    this.visible = true;
    this.buildingTicketsService
      .getBuildingTicketRequest(this.buildingRequestTicketsViewFilterModel)
      .subscribe((res) => {
        // if(res.length > 0)
        // {
        this.tickets = res;
        this.tempRequestData = this.tickets;
        this.ticketsSelection = [0];
        this.selectedTicket = this.tickets[0];
        this.onInitForm(this.tickets[0]);
        this.getBuildingRequestTicketDetails();
        // }
        // else
        // {
        //   this.titleValue = '';
        // }
      });
    this.visible = true;
    this.visible = false;
  }
  onChangeValue(data) {
    if (data == 'assigned to') {
      this.buildingRequestTicketsViewFilterModel.Status =
        this.buildingRequest.AssignedTo;
    } else if (data == 'Open') {
      this.buildingRequestTicketsViewFilterModel.Status =
        this.buildingRequest.Open;
    } else if (data == 'Close') {
      this.buildingRequestTicketsViewFilterModel.Status =
        this.buildingRequest.Close;
    } else if (data == 'Elevate') {
      this.buildingRequestTicketsViewFilterModel.Status =
        this.buildingRequest.Elevate;
    }
    this.getBuildingTicketRequest();
  }
  onSearchClick() {
    this.searchText = this.ticketForm.get('description').value;
    this.buildingRequestTicketsViewFilterModel.SearchText = this.searchText;
    this.getBuildingTicketRequest();
  }
  getBuildingRequestTicketDetails() {
    this.buildingTicketsService
      .getBuildingRequestTicketDetails(this.selectedTicket.ticketNumber)
      .subscribe((res) => {
        this.ticketForm.controls['notes'].setValue(res.result.notes);
        this.ticketForm.controls['reply'].setValue(res.result.closingEmail);
      });
  }
  onReply() {
    this.replyText = this.ticketForm.get('reply').value;
    if (
      this.replyText === '' ||
      this.replyText == null ||
      this.replyText === undefined
    ) {
      this.utilityService.toast.error('Must have a reply Email message.');
    } else {
      this.buildingRequestTicketsUpdateRequestModel.ClosingEmail =
        this.replyText;
      this.buildingRequestTicketsUpdateRequestModel.IsClosed = false;
      this.buildingRequestTicketsUpdateRequestModel.IsSendEmail = true;
      this.onSaveClick();
    }
  }
  onReplyAndClose() {
    this.replyText = this.ticketForm.get('reply').value;
    if (
      this.replyText === '' ||
      this.replyText == null ||
      this.replyText === undefined
    ) {
      this.utilityService.toast.error('Must have a closing Email message.');
    } else {
      this.buildingRequestTicketsUpdateRequestModel.ClosingEmail =
        this.replyText;
      this.buildingRequestTicketsUpdateRequestModel.IsClosed = true;
      this.buildingRequestTicketsUpdateRequestModel.IsSendEmail = true;
      this.onSaveClick();
    }
  }
  onSave() {
    this.notesText = this.ticketForm.get('notes').value;
    this.replyText = this.ticketForm.get('reply').value;
    this.buildingRequestTicketsUpdateRequestModel.Notes = this.notesText;
    this.buildingRequestTicketsUpdateRequestModel.ClosingEmail = this.replyText;
    this.buildingRequestTicketsUpdateRequestModel.IsClosed = false;
    this.buildingRequestTicketsUpdateRequestModel.IsSendEmail = false;
    this.onSaveClick();
  }
  onSaveClick() {
    this.buildingRequestTicketsUpdateRequestModel.Id =
      this.selectedTicket.ticketNumber;
    this.buildingTicketsService
      .saveTickets(this.buildingRequestTicketsUpdateRequestModel)
      .subscribe((res) => {
        if ((res['status'] = 200)) {
          this.utilityService.toast.success(res.message);
          this.getBuildingTicketRequest();
        } else {
          this.utilityService.toast.error(res.message);
        }
      });
    this.ticketForm.controls['reply'].setValue(null);
    this.ticketForm.controls['notes'].setValue(null);
  }
  exportToExcel() {
    this.visible = false;
    this.visible = true;
    this.buildingTicketsService
      .exportToExcel(this.buildingRequestTicketsViewFilterModel)
      .subscribe((res) => {
        let data = new Blob([res], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;',
        });
        fileSaver.saveAs(
          data,
          'BuildingRequest_' + new Date().toLocaleDateString('en-US') + '.xlsx'
        );
        this.visible = true;
        this.visible = false;
      });
  }
  isDisableButtons() {
    if (this.buildingRequestTicketsViewFilterModel.Status == 1) {
      this.isDisableReply = true;
    } else {
      this.isDisableReply = false;
    }
  }
  public sortGridChange(sort: SortDescriptor[]): void {
    this.sortTicket = sort;
    this.requestData = {
      data: orderBy(this.tickets, this.sortTicket),
      total: this.tempRequestData.length,
    };
    this.tickets = this.requestData.data;
  }
}
