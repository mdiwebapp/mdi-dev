import { Component, OnInit } from '@angular/core';
import { GroupKey } from '@progress/kendo-angular-grid';
import { orderBy, SortDescriptor, State } from '@progress/kendo-data-query';
import { ErrorHandlerService } from 'src/app/core/services';
import {
  invoiceData,
  invoiceColumns,
  rentData,
  rentColumns,
  subinvoiceData,
  subinvoiceColumns,
} from 'src/data/consitement.data';
import { ConsignmentService } from '../consignment.service';

@Component({
  selector: 'app-consignment-invoice',
  templateUrl: './consignment-invoice.component.html',
  styleUrls: ['./consignment-invoice.component.scss'],
})
export class ConsignmentInvoiceComponent implements OnInit {
  state: State = {
    group: [{ field: 'branch' }, { field: 'projectManager' }],
  };
  data: any = [];
  sort: SortDescriptor[] = [{ field: 'invType', dir: 'asc' }];
  selections: any = [];
  skip: number = 0;
  multiple: boolean = false;
  columns: any = [];
  invoicesData: any[];
  invoicesColumns: any[];
  rentData: any[];
  rentColumns: any[];
  subinvoiceData: any[];
  subinvoiceColumns: any[];
  expandedGroupKeys: Array<GroupKey> = [];
  subInvoices: any = [];
  subInvoicesColumns: any = [];
  jobNumber: any;
  public consignmentGrid: boolean = true;

  constructor(
    public service: ConsignmentService,
    public errorHandler: ErrorHandlerService
  ) {
    // this.invoicesData = invoiceData;
    this.invoicesColumns = invoiceColumns;
    //this.rentData = rentData;
    this.rentColumns = rentColumns;
    // this.subInvoices = subinvoiceData;
    this.subInvoicesColumns = subinvoiceColumns;
  }

  ngOnInit(): void {}
  onResizeColumn(event) {}

  onSelectionChange(event) {
    this.service
      .GetInvoiceList(event.inventoryNumber, this.jobNumber)
      .subscribe(
        (res) => {
          if (res != null && res.length > 0) {
            this.invoicesData = res;
          } else {
            this.invoicesData = [];
          }
        },
        (error) => {
          this.onError(error, 'Consignment inventory list bind');
        }
      );
    this.service
      .GetInvoiceRentList(event.inventoryNumber, this.jobNumber)
      .subscribe(
        (res) => {
          if (res != null && res.length > 0) {
            this.rentData = res;
          } else {
            this.rentData = [];
          }
        },
        (error) => {
          this.onError(error, 'Consignment inventory list bind');
        }
      );
    console.log('this.rentData', this.rentData);
  }
  GetInvoiceList(jobNum) {
    this.jobNumber = jobNum;
    this.service.GetInventorySmallList(jobNum).subscribe(
      (res) => {
        this.rentData = [];
        this.invoicesData = [];
        if (res != null && res.length > 0) {
          this.subInvoices = res;
        } else {
          this.subInvoices = [];
        }
      },
      (error) => {
        this.onError(error, 'Consignment inventory list bind');
      }
    );
  }
  onSortChange(sort: SortDescriptor[]) {
    this.sort = sort;
    this.invoicesData = orderBy(this.invoicesData, sort);
  }

  onReOrderColumns(event) {}

  onDataStateChange(event) {}

  onTabChange(event) {}

  onRowSelect(event) {}

  groupChange() {}
  private onError(error: any, customMessage?: string) {
    this.errorHandler.handleError(error, 'Consignment', error.message);
  }
}
