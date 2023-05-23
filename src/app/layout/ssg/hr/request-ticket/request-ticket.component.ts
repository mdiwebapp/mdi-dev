import { Component, OnInit } from '@angular/core';
import {
  DataStateChangeEvent,
  GridDataResult,
  GroupKey,
} from '@progress/kendo-angular-grid';
import {
  GroupDescriptor,
  process,
  SortDescriptor,
  State,
  orderBy,
} from '@progress/kendo-data-query';
import {
  requestTicketColumns,
  requestTicketData,
} from '../../../../../data/request-ticket-data';
import {HRRequestTickets} from './request-ticket.service';
import {HRRequestTicketsViewFilterModel,HRRequestTicketsUpdateRequestModel} from './request-ticket.model';
import { FormBuilder,  FormGroup } from '@angular/forms';
import * as fileSaver from 'file-saver';
import { StringMapWithRename } from '@angular/compiler/src/compiler_facade_interface';
import { UtilityService } from '../../../../../app/core/services/utility.service';
import { MenuService } from 'src/app/core/helper/menu.service';
@Component({
  selector: 'app-request-ticket',
  templateUrl: './request-ticket.component.html',
  styleUrls: ['./request-ticket.component.scss'],
})
export class RequestTicketComponent implements OnInit {
  state: State = {
    group: [{ field: 'weekEnding' }],
  };
  requestTicketForm: FormGroup;
  requestsTickets:any=[];
  tickets: GridDataResult = process(this.requestsTickets, this.state);
  selections: any = [];
  skip: 0;
  multiple: boolean = false;
  ticketsColumns: any = requestTicketColumns;
  sort: SortDescriptor[] = [];
  expandedGroupKeys: Array<GroupKey> = [];
  selectedTicket: any = null;
  isNotesDisabled: boolean = true;
  isNotesSaveDisabled: boolean = true;
  hRRequestTicketsViewFilterModel:HRRequestTicketsViewFilterModel;
  hRRequestTicketsUpdateRequestModel:HRRequestTicketsUpdateRequestModel;
  isOpen:boolean=true;
  searchText:string;
  requestData:any;
  tempRequestData:any;
  notesText:string;
  replyText:string;
  IsClosed:boolean;
  IsSendEmail:boolean;
  visible:boolean;
  isDisableReply:boolean = true;
  message:any;
  public sortGrid: SortDescriptor[] = [
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
      field: 'forEmployee',
      dir: 'asc',
    },
    {
      field: 'category',
      dir: 'asc',
    },
    {
      field: 'submitDate',
      dir: 'asc',
    },
    {
      field: 'weekEnding',
      dir: 'asc',
    },
    {
      field: 'message',
      dir: 'asc',
    }
  ]
  constructor(
    public hrRequestTicketsService:HRRequestTickets,
    private formBuilder: FormBuilder,
    public utility:UtilityService, public menuService: MenuService,
     
  ) {
    if (localStorage.getItem('isAdmin') == 'true') {

    } else {
      let acc = this.menuService.checkUserViewRights('Request Tickets');
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
      this.menuService.checkUserBySubmoduleRights('Request Tickets');
    }
   
  }

  ngOnInit(): void {
    this.onInitRequestTicketForm();
    this.selectedTicket = 0;
 
   
    this.hRRequestTicketsViewFilterModel = new HRRequestTicketsViewFilterModel();
    this.hRRequestTicketsUpdateRequestModel = new HRRequestTicketsUpdateRequestModel();
    this.hRRequestTicketsViewFilterModel.Open = this.isOpen;
    this.getHRRequestTicket();
   
  }
  onInitRequestTicketForm() {
    this.requestTicketForm = this.formBuilder.group({
      description: [],
      notes:[],
      userEmail:[],
    });
  }
  onResizeColumn(event) {}

  onRowSelect(event) {
    this.selectedTicket = event.selectedRows[0].dataItem;
    this.message = this.selectedTicket.message;
   this.getHRRequestTicketDetails();
   
  }

  onSortChange(event) {}

  onReOrderColumns(event) {}

  onDataStateChange(state: DataStateChangeEvent) {
    this.state = state;
    this.tickets = process( this.requestsTickets, this.state);
  }

  groupChange(): void {
    this.expandedGroupKeys = [];
  }

  onHandleNotes(type) {
    switch (type) {
      case 'edit':
        
        this.isNotesDisabled = false;
        this.isNotesSaveDisabled = false;
        this.isDisableButtons();
        break;
      case 'save':
        this.isNotesDisabled = true;
        this.isNotesSaveDisabled = true;
        this.isDisableReply = true;
        this.saveNotes();
        break;
      case 'cancel':
        this.isNotesDisabled = true;
        this.isNotesSaveDisabled = true;
        this.isDisableReply = true;
        break;
      case 'reply':
      this.isNotesDisabled = true;
      this.isNotesSaveDisabled = true;
      this.isDisableReply = true;
      this.onReply();
      break;
      case 'replyAndClose':
      this.isNotesDisabled = true;
      this.isNotesSaveDisabled = true;
      this.isDisableReply = true;
      this.onReplyAndClose();
     break;
      default:
        break;
    }
  }
  getHRRequestTicket()
  {
    this.requestsTickets = [];
  
    this.visible = false;
    this.visible = true;
     this.hrRequestTicketsService.getHRRequestTickests(this.hRRequestTicketsViewFilterModel).subscribe(
      (res)=>{
        if(res.length > 0)
        {
          this.requestsTickets = res
          this.selectedTicket = this.requestsTickets[0];
          this.selections = [0];
         this.tickets = process(res, this.state)
         this.tempRequestData = this.requestsTickets
          this.message =  this.selectedTicket.message
        //  this.onDataStateChange(this.state);
          console.log(res);
          this.getHRRequestTicketDetails();
        }
        else
        {
          this.requestsTickets = [];
          this.tickets = process(res, this.state)
          this.selectedTicket = 0;
          this.requestTicketForm.controls['notes'].setValue('');
          this.requestTicketForm.controls['userEmail'].setValue('');
          this.message = '';
        }
     
        this.visible = true;
        this.visible = false;
      }
     )
   
  }
  onCheckBoxChecked(data)
  {
    if(data.target.checked)
    {
      this.isOpen = data.target.checked;
      this.hRRequestTicketsViewFilterModel.Open = this.isOpen;
      this.getHRRequestTicket();
    }
    else
    {
      this.isOpen = data.target.checked;
      this.hRRequestTicketsViewFilterModel.Open = this.isOpen;
      this.getHRRequestTicket();
    }
    
  }
  onSearchClick() {
    this.searchText = this.requestTicketForm.get('description').value;
    this.hRRequestTicketsViewFilterModel.SearchText = this.searchText
    this.getHRRequestTicket();
   
  }
  public sortGridChange(sort:SortDescriptor[]):void{
    this.sortGrid = sort;
    this.requestData = {
      data: orderBy(this.requestsTickets, this.sortGrid),
      total: this.tempRequestData.length,
    };
    this.tickets = process(this.requestData.data, this.state)
  }
  exportToExcel()
  {
    this.visible = false;
    this.visible = true;
    this.hrRequestTicketsService.exportToExcel(this.hRRequestTicketsViewFilterModel).subscribe(
      (res)=>{
        let data = new Blob([res], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;',
        });
            fileSaver.saveAs(
            data,
            'HRRequest_' 
              + new Date().toLocaleDateString('en-US') +
              '.xlsx'
              
        );
        this.visible = true;
        this.visible = false;
      }
    )
    
  }
  saveNotes()
  {
    this.notesText = this.requestTicketForm.get('notes').value;
    this.replyText =  this.requestTicketForm.get('userEmail').value;
    this.hRRequestTicketsUpdateRequestModel.Notes = this.notesText;
    this.hRRequestTicketsUpdateRequestModel.ClosingEmail = this.replyText;
    this.hRRequestTicketsUpdateRequestModel.IsClosed = false;
    this.hRRequestTicketsUpdateRequestModel.IsSendEmail = false;
    this.OnSaveClick();
   
   
  }
  getHRRequestTicketDetails()
  {
    this.hrRequestTicketsService.getHRRequestTicketDetails(this.selectedTicket.ticketNumber).subscribe(
    (res)=>{
      console.log(res)
      this.requestTicketForm.controls['notes'].setValue(res.result.notes);
      this.requestTicketForm.controls['userEmail'].setValue(res.result.closingEmail);
    }
    )
  }
  onReply()
  {
    
   this.replyText =  this.requestTicketForm.get('userEmail').value;
   if(this.replyText === '' || this.replyText == null || this.replyText === undefined)
   {
    this.utility.toast.error('Must have a reply Email message.')
   }
   else
   {
  
   this.hRRequestTicketsUpdateRequestModel.ClosingEmail = this.replyText;
   this.hRRequestTicketsUpdateRequestModel.IsClosed = false;
   this.hRRequestTicketsUpdateRequestModel.IsSendEmail = true;
   this.OnSaveClick();
   }

  }
  onReplyAndClose()
  {
    this.replyText = this.requestTicketForm.get('userEmail').value;
    if(this.replyText === '' || this.replyText == null || this.replyText === undefined)
    {
        this.utility.toast.error('Must have a closing Email message.')
    }
    else
    {
     this.hRRequestTicketsUpdateRequestModel.ClosingEmail = this.replyText;
     this.hRRequestTicketsUpdateRequestModel.IsClosed = true;
     this.hRRequestTicketsUpdateRequestModel.IsSendEmail = true;
     this.OnSaveClick();
    }
       
  }
  OnSaveClick()
  {
  
    this.hRRequestTicketsUpdateRequestModel.Id = this.selectedTicket.ticketNumber;
    this.hrRequestTicketsService.saveTickets(this.hRRequestTicketsUpdateRequestModel).subscribe(
      (res)=>{
         if(res['status']=200)
         {
          this.utility.toast.success(res.message);
          this.getHRRequestTicket();
         
         }
         else
         {
          this.utility.toast.error(res.message);
         }
      }
     
    )
    this.requestTicketForm.controls['userEmail'].setValue(null);
    this.requestTicketForm.controls['notes'].setValue(null);
  }
  isDisableButtons()
  {
    if(this.selectedTicket.weekEnding == null || this.selectedTicket.weekEnding === undefined || this.selectedTicket.weekEnding === '')
    {
      this.isDisableReply = false;
    }
    else 
    {
      this.isDisableReply = true;
    }
  }
}
