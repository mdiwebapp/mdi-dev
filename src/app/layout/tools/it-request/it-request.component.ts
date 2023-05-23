import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SortDescriptor } from '@progress/kendo-data-query';

@Component({
  selector: 'app-it-request',
  templateUrl: './it-request.component.html',
  styleUrls: ['./it-request.component.scss'],
})
export class ItRequestComponent implements OnInit {
  itRequestForm: FormGroup;
  isAttachDialogVisible: boolean = false;
  attach_msg: string = '';
  requests: any = [];
  requestsColumns: any = [
    {
      Name: 'ticket',
      isCheck: true,
      Text: 'Ticket No',
      isDisable: false,
      index: 0,
      width: 50,
    },
    {
      Name: 'description',
      isCheck: true,
      Text: 'Description',
      isDisable: false,
      index: 0,
      width: 100,
    },
  ];
  sort: SortDescriptor[] = [];
  selections: number[] = [0];
  skip: number = 0;
  multiple: boolean = false;
  request_btn: string = '';
  isRequestVisible: boolean = false;
  requestData: any = [
    {
      name: 'Email',
    },
    {
      name: 'Internet',
    },
    {
      name: 'MDI',
    },
    {
      name: 'Phone',
    },
    {
      name: 'Printer',
    },
    {
      name: 'Other',
    },
  ];

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.onInitITRequestForm();
  }
  onInitITRequestForm() {
    this.itRequestForm = this.formBuilder.group({
      requestType: '',
      description: '',
    });
  }

  onSubmitITRequest() {}

  onHandleFilters(type) {
    switch (type) {
      case 'attach':
        this.isAttachDialogVisible = !this.isAttachDialogVisible;
        break;
      case 'request':
        this.isRequestVisible = !this.isRequestVisible;
        break;
      default:
        break;
    }
  }

  onSortChange(event) {}

  onReOrderColumns(event) {}

  onSelectionChange(event) {
    this.request_btn = event.selectedRows[0].dataItem.name;
    this.isRequestVisible = false;
  }

  onDataStateChange(event) {}

  onResizeColumn(event) {}
}
