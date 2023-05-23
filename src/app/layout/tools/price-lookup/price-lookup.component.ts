import { Component, OnInit } from '@angular/core';
import { PageChangeEvent } from '@progress/kendo-angular-grid';
import { orderBy, SortDescriptor } from '@progress/kendo-data-query';
import { PaginationRequest, PaginationWithSortRequest } from 'src/app/core/models/pagination.model';
import { PagerService } from 'src/app/core/services/pager.service';
import {PriceLookupService} from '../../../../app/layout/tools/price-lookup/price-lookup.service'
import { FormBuilder, FormGroup } from '@angular/forms';
import { UtilityService } from 'src/app/core/services/utility.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-price-lookup',
  templateUrl: './price-lookup.component.html',
  styleUrls: ['./price-lookup.component.scss']
})
export class PriceLookupComponent implements OnInit {
  public sort: SortDescriptor[] = [
    {
      field: 'invType',
      dir: 'asc',
    },
    {
      field: 'description',
      dir: 'asc',
    },
    {
      field: 'dailyRate',
      dir: 'asc',
    },
    {
      field: 'weeklyRate',
      dir: 'asc',
    },
    {
      field: 'monthlyRate',
      dir: 'asc',
    },
    {
      field: 'listPrice',
      dir: 'asc',
    },
  ];
  form: FormGroup;
  public totalData = 0;
  public pageSize = 100;
  isPagesizeChange: boolean = false;
  request =  new PaginationWithSortRequest<any>();
  public skip =0;
  selections: any = [];
  pageSizeList: any = [
    { id: 0, value: 100 },
    { id: 0, value: 300 },
    { id: 0, value: 500 },
  ];
  multiple: boolean = false;
  searchText: string = '';
  visible:boolean;
  priceLookupcolumns = [
    {
    Name: 'invType',
    isCheck: true,
    Text: 'InvType ',
    isDisable: false,
    index: 0,
    width: 100,
  },
  {
    Name: 'description',
    isCheck: true,
    Text: 'Description ',
    isDisable: false,
    index: 0,
    width: 300,
  },
  {
    Name: 'dailyRate',
    isCheck: true,
    Text: 'DailyRate',
    isDisable: false,
    index: 0,
    width: 100,
  },
  {
    Name: 'weeklyRate',
    isCheck: true,
    Text: 'WeeklyRate',
    isDisable: false,
    index: 0,
    width: 100,
  },
  {
    Name: 'monthlyRate',
    isCheck: true,
    Text: 'MonthlyRate',
    isDisable: false,
    index: 0,
    width: 100,
  },
  {
    Name: 'listPrice',
    isCheck: true,
    Text: 'ListPrice',
    isDisable: false,
    index: 0,
    width: 100,
  },
];
priceLookupData = [];
message: any;
clickEventsubscription: Subscription;
branch: any;

  constructor(
    private service:PriceLookupService,
    public pagerService: PagerService,
    private formBuilder: FormBuilder,
    private utility: UtilityService,
    ) { }

  ngOnInit(): void {
    this.clickEventsubscription = this.utility.getClickEvent().subscribe((a) => {
      this.message = a;
      this.callBack(this.message);
    });
    this.initForm();
    this.branch = JSON.parse(this.utility.storage.getItem('selectedBranch'))[0].code;
    this.GetPriceLookUpData();
  }

  initForm()
  {
    this.form = this.formBuilder.group({
      
    });
  }

  onDataStateChange(event) {

  }

  onReOrderColumns(event){

  }

  onSortChange(sort: SortDescriptor[]) {
    this.sort = sort;
    //this.priceLookupData = orderBy(this.priceLookupData, sort);
    this.GetPriceLookUpData();
  }

  onSelectionChange(event) {}

  onResizeColumn(event) {}

  // onFilterPriceLookupData() {
  //   var filter = {branch:"MI", searchText: this.searchText};
  //   this.service.GetPriceLookupData(filter).subscribe(data=>{
  //     this.priceLookupData=data;
  //   });
  // }

  GetPriceLookUpData() {
    this.visible = false;
    this.visible = true;
    var branch = '%';
    var selectedbranch = this.branch;
    // if(selectedbranch == 'All') {
    //   branch = '%'
    // }
    // else {
    //   branch = this.branch;
    // }
    var filter = {branch: selectedbranch, searchText: this.searchText}
    this.totalData = 0;

    
    this.request.pageSize = this.pagerService.pageSize;
    if (this.searchText) {
      this.request.pageNumber = 1;
    } else {
      this.request.pageNumber = this.pagerService.start + 1;
    }

    // if(this.isPagesizeChange) {
    //   this.request.pageNumber = this.pagerService.end -1 ;
    // }
    this.request.sortColumn = this.sort[0].field;
    this.request.sortDesc = this.sort[0].dir == 'desc' ? true : false;
    this.request.request = filter

    this.service.GetPriceLookupData(this.request).subscribe(res=>{
      if(res.totalRecords>0)
      {
        this.priceLookupData=res.data;
        this.totalData = res.totalRecords;
        this.visible = true;
        this.visible = false;
      }
      else
      {
        this.priceLookupData = [];
        this.totalData = res.totalRecords;
        this.visible = true;
        this.visible = false;
      }
      
     
    });
  }

  public onPageChange(e: PageChangeEvent): void {
    this.skip = e.skip;
    this.pageSize = e.take;
    this.pagerService.start = this.skip == 0 ? 0 : this.skip / this.pageSize;
    // this.filterCollection.pageSize = this.pageSize;
    // this.tempPageNo = this.pagerService.start;

    this.GetPriceLookUpData();
  }

  onPageSizechange(e) {
    this.pagerService.pageSize = e;
    this.pagerService.start = Math.floor(this.skip == 0 ? 0 : this.skip / this.pageSize);
    this.isPagesizeChange = true;
    this.GetPriceLookUpData();
  }

  callBack(value) {
    var valueId = '';
    var valueName = [];
    value.forEach((element) => {
      valueId = (element.code);
      valueName.push(element.code);
    });
    this.priceLookupData = [];
    this.branch = valueName.toString();
    this.GetPriceLookUpData();

  }
}
