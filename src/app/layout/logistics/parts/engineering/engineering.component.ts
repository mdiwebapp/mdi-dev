import { Component, OnInit } from '@angular/core';
import { orderBy, process, SortDescriptor } from '@progress/kendo-data-query';
import { PartsService } from '../partlist/parts.service';
import { ModuleNames, ErrorMessages } from 'src/app/core/constant';
import { ErrorHandlerService } from 'src/app/core/services';

@Component({
  selector: 'app-engineering',
  templateUrl: './engineering.component.html',
  styleUrls: ['./engineering.component.scss'],
})
export class EngineeringComponent implements OnInit {
  data: any = [];
  isDisabled: boolean = true;
  VendorType = ['A', 'B', 'C'];
  filterStatus: any = [];
  public pageSize = 5;
  public skip = 0;
  loader: any;
  public sort: SortDescriptor[] = [
    {
      field: 'vendorName',
      dir: 'asc',
    },
  ];
  public mySelection: number[] = [0];
  bomList: any[];
  tempbomList: any[];

  constructor(
    public service: PartsService,
    public errorHandler: ErrorHandlerService
  ) { }

  vendor: any;
  branchId: any;
  branch: any;

  ngOnInit(): void { }
  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.data = {
      data: orderBy(this.tempbomList, this.sort),
      total: this.tempbomList.length,
    };
    this.bomList = this.data.data;
  }
  BOMList(data) {
    this.bomList = [];
    this.tempbomList = [];
    if(data){
       this.service.GetBOMList(data).subscribe(
      (res) => {
        if (res && res.length > 0) {
          this.bomList = res;
          this.tempbomList = res;
        }
      },
      (error) => this.onError(error, ErrorMessages.parts.get_BOM_list)
    );
    }
   
  }

  public onFilter(inputValue: string): void {
    this.data = process(this.tempbomList, {
      filter: {
        logic: 'or',
        filters: [
          {
            field: 'parentPart',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'description',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'quantity',
            operator: 'contains',
            value: inputValue,
          },
        ],
      },
    }).data;

    this.bomList = this.data;
    // this.editContactClick(this.data[0].id);
  }

  private onError(error: any, customMessage?: string) {
    this.errorHandler.handleError(
      error,
      ModuleNames.parts_engineering,
      customMessage
    );
  }
}
