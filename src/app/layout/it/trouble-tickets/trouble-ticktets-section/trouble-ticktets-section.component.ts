import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SortDescriptor } from '@progress/kendo-data-query';

@Component({
  selector: 'app-trouble-ticktets-section',
  templateUrl: './trouble-ticktets-section.component.html',
  styleUrls: ['./trouble-ticktets-section.component.scss'],
})
export class TroubleTicktetsSectionComponent implements OnInit {
  @Input() disable: boolean;
  troubleTickets: any = [];
  sort: SortDescriptor[] = [];
  selections: any = [0];
  skip: number = 0;
  multiple: boolean = false;
  troubleTicketsColumns: any = [
    {
      Name: 'itRequestsPK',
      isCheck: true,
      Text: 'IT Requests PK',
      isDisable: false,
      index: 0,
      width: 120,
    },
    {
      Name: 'branch',
      isCheck: true,
      Text: 'Branch',
      isDisable: false,
      index: 0,
      width: 60,
    },
    {
      Name: 'closed',
      isCheck: true,
      Text: 'Closed',
      isDisable: false,
      index: 0,
      width: 100,
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
      Name: 'userInput',
      isCheck: true,
      Text: 'User Input',
      isDisable: false,
      index: 0,
      width: 100,
    },
  ];
  selectedTicket: any = null;
  // isEditable: boolean = true;
  ticketForm: FormGroup;
  error_title: string = '';
  error_message: string = '';
  isErrorVisible: boolean = false;
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
  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.troubleTickets = [
      {
        itRequestsPK: '12687',
        branch: 'GPC',
        closed: true,
        createdBy: 'Chris Hudson',
        userInput: 'Can we get a MDI login',
        createdAt: new Date(),
        screenshots: [],
      },
      {
        itRequestsPK: '1750',
        branch: 'GPC',
        closed: false,
        createdBy: 'Ron Tearto',
        userInput: 'Need to get Email Fixed',
        createdAt: new Date(),
        screenshots: [],
      },
    ];

    this.selectedTicket = this.troubleTickets[0];
    this.onInitForm(this.troubleTickets[0]);
  }

  onResizeColumn(event) {}

  onSelectionChange(event) {
    this.selectedTicket = event.selectedRows[0].dataItem;
    this.onInitForm(event.selectedRows[0].dataItem);
  }

  onSortChange(event) {}

  onReOrderColumns(event) {}

  onDataStateChange(event) {}

  onHandleTickets(type) {
    switch (type) {
      // case 'edit':
      //   this.isEditable = !this.isEditable;
      //   break;
      case 'reply':
        if (!this.ticketForm.get('response').value) {
          this.error_title = 'MDI';
          this.error_message = 'Must have a reply Email Message';
          this.isErrorVisible = true;
        }
        break;
      case 'close':
        if (!this.ticketForm.get('response').value) {
          this.error_title = 'MDI';
          this.error_message = 'Must have a closing Email Message';
          this.isErrorVisible = true;
        }
        break;
      case 'error':
        this.isErrorVisible = !this.isErrorVisible;
        break;
      case 'elevate':
        this.ticketForm.setValue({
          ...this.ticketForm.value,
          notes: `Date: ${new Date().toISOString()} This trouble ticket has been elevated.`,
        });
      default:
        break;
    }
  }

  onInitForm(value) {
    this.ticketForm = this.formBuilder.group({
      userInput: value?.userInput || '',
      response: value?.response || '',
      notes: value?.notes || '',
    });
  }

  onSubmit() {}
}
