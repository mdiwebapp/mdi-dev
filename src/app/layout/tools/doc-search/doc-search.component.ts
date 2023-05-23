import { Component, OnInit } from '@angular/core';
import { PageChangeEvent } from '@progress/kendo-angular-grid';
import { orderBy, SortDescriptor } from '@progress/kendo-data-query';
import { PaginationWithSortRequest } from 'src/app/core/models/pagination.model';
import { ErrorHandlerService, PagerService } from 'src/app/core/services';
import { DocSearchService } from './doc-search.service';
import { saveAs } from 'file-saver';
import { NetworkDirectoryService } from '../../networkdirectory/networkdirectorypage/networkdirectory.service';
import { UtilityService } from '../../../core/services/utility.service';

@Component({
  selector: 'app-doc-search',
  templateUrl: './doc-search.component.html',
  styleUrls: ['./doc-search.component.scss'],
})
export class DocSearchComponent implements OnInit {
  sort: SortDescriptor[] = [
    {
      field: 'fileName',
      dir: 'asc',
    },
  ];
  total: number;
  selections: any = [];
  skip: number = 0;
  multiple: boolean = false;
  filterchange: boolean = false;
  public pageSize = 100;
  public pageNumber = 1;
  public currentPage = 1;
  tempPageNo: number;
  openFilePath:any;
  pageSizeList: any = [
    { id: 0, value: 100 },
    { id: 0, value: 300 },
    { id: 0, value: 500 },
  ];
  docSearchcolumns = [
    {
      Name: 'fileName',
      isCheck: true,
      Text: 'FileName ',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'fileType',
      isCheck: true,
      Text: 'Path',
      isDisable: false,
      index: 0,
      width: 300,
    },

    // {
    //   Name: 'filePath',
    //   isCheck: true,
    //   Text: 'FilePath ',
    //   isDisable: false,
    //   index: 0,
    //   width: 500,
    // },
  ];

  docSearchData = [
    // {
    //   filename: '00. POCKET Material Selection Guide.pdf',
    //   filepath: '\\reagan\\marketing\\PUBLIC_ACCESS\\001 ENGINEERING CATALOG\\00.POCKET Material Selection Guide.pdf'
    // },
    // {
    //   filename: '00. POCKET_007 ZChemical Resistance Chart.pdf',
    //   filepath: '\\regan\\marketing\\PUBLIC_ACCESS\\001 ENGINEERING CATALOG\\00. POCKET_007 ZChemical Resistance Chart.pdf'
    // },
    // {
    //   filename: '001 Pump Questionnaire.pdf',
    //   filepath: '\\regan\\marketing\\PUBLIC_ACESS\\001 ENGINEERING CATALOG\\001 Pump Questionnaire.pdf'
    // }
  ];
  filterCollection: any = {
    fileNameAnd1: '',
    fileNameAnd2: '',
    fileNameOr1: '',
    fileNameOr2: '',
  };
  visible: boolean = false;
  constructor(
    public service: DocSearchService,
    public pagerService: PagerService,
    public errorHandler: ErrorHandlerService,
    public NetworkDirectoryService: NetworkDirectoryService,
    public utility: UtilityService,

  ) {}

  ngOnInit(): void {
    this.pagerService.start = 1;
    this.pagerService.pageSize = 100;
    this.loadData();
  }

  loadData() {
    this.visible = true;
    var request = new PaginationWithSortRequest<any>();
    request.pageNumber = this.pagerService.start;
    request.pageSize = this.pagerService.pageSize;
    request.sortColumn = this.sort[0].field;
    request.sortDesc = this.sort[0].dir == 'desc' ? true : false;
    request.request = this.filterCollection;

    this.service.getList(request).subscribe(
      (res) => {
        this.docSearchData = res.data;
        this.total = res.totalRecords;
        this.visible = false;
      },
      (error) => {
        this.onError(error, 'Error getting Doc. Search data.');
      }
    );
  }
  clearSearch() {
    this.filterCollection = {
      fileNameAnd1: '',
      fileNameAnd2: '',
      fileNameOr1: '',
      fileNameOr2: '',
    };
    this.pagerService.start = 1;
    this.loadData();
  }
  onDataStateChange(event) {}

  onReOrderColumns(event) {}
  public onPageChange(e: PageChangeEvent): void {
    this.skip = e.skip;
    this.pagerService.pageSize = e.take;
    this.pagerService.start =
      this.skip == 0 ? 1 : this.skip / this.pagerService.pageSize + 1;
    this.loadData();
  }
  onSortChange(sort: SortDescriptor[]) {
    this.sort = sort;
    this.loadData();
    //this.docSearchData = orderBy(this.docSearchData, sort);
  }

  onSelectionChange(event) {}

  onResizeColumn(event) {}
  private onError(error: any, customMessage?: string) {
    this.errorHandler.handleError(error, 'Document search', customMessage);
  }
  downloadDocsFile(data) {
    this.visible = false;
    this.visible = true;
    var path = data.fileType.replace('reagan', '192.168.0.2');
    this.NetworkDirectoryService.DownloadFile(encodeURI(path)).subscribe(
      (res) => {
        if (res.size > 0) {  
          var extension = path.slice(path.lastIndexOf('.') + 1).toLowerCase();
          if(extension == "pdf") {
            let file = new Blob([res], { type: 'application/pdf' });      
            //"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,"      
            var fileURL = URL.createObjectURL(file);
            window.open(fileURL);
          }
          else {
            saveAs(res, data.fileName);
          }
          //saveAs(res, data.fileName);
          this.visible = true;
          this.visible = false;
        } else {
          this.visible = true;
          this.visible = false;
        }
      
      },
      (error) => {
        console.log('Something went wrong');   
        setTimeout(() => {
          this.loadData();
        }, 2000);  
        this.utility.toast.error(
          'You do not have permissions to access this Doc search of the system.'
        );     
      }
    );
  }
  OnChangeFilter(data: any) {
    if (data) {
      this.filterchange = true;
      this.filterCollection.fileNameOr1 = '';
      this.filterCollection.fileNameOr2 = '';
      this.loadData();
    } else {
      this.filterchange = false;
      this.filterCollection.fileNameAnd1 = '';
      this.filterCollection.fileNameAnd2 = '';
      this.loadData();
    }
  }
  onPageSizechange(pagesize) {
    this.pagerService.pageSize = pagesize;
    this.pagerService.start =
      this.skip == 0 ? 1 : this.skip / this.pagerService.pageSize + 1;
     this.loadData();
  }
  filterData(){
    this.pagerService.start = 1;
    this.skip = 0;
    this.loadData();
  }
}
