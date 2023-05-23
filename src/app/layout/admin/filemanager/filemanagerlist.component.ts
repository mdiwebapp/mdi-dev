import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { orderBy, process, SortDescriptor } from '@progress/kendo-data-query';
import { BehaviorSubject } from 'rxjs';
import { UtilityService } from 'src/app/core/services/utility.service';
import { BasicsettingService } from '../../../core/services/basicsetting.service';
import { FileManagerModel } from './filemanager.model';
import { FilemanagerService } from './filemanager.service';
import { ErrorHandlerService } from '../../../core/services';
import { ErrorMessages, ModuleNames } from '../../../core/constant';

@Component({
  selector: 'app-filemanagerlist',
  templateUrl: './filemanagerlist.component.html',
  styleUrls: ['./filemanagerlist.component.scss'],
})
export class FilemanagerlistComponent implements OnInit {
  @ViewChild(DataBindingDirective) dataBinding: DataBindingDirective;
  SaveChange: BehaviorSubject<any> = new BehaviorSubject(null);
  @Output() DeleteFolder = new EventEmitter<any>();
  status: boolean = true;
  public pageSize = 5;
  public skip = 0;
  loader: any;
  public columns: any = [
    { Name: 'check', isCheck: true },
    { Name: 'actions', isCheck: true },
    { Name: 'name', isCheck: true },
    { Name: 'size', isCheck: true },
  ];
  data: any;
  tempData: [{ id: 0; name: ''; parent: 0 }];
  public selectedId = 0;
  public parentId = 0;
  public opened = false;
  fileMgr: FileManagerModel[];
  public sort: SortDescriptor[] = [
    {
      field: 'name',
      dir: 'asc',
    },
    {
      field: 'size',
      dir: 'asc',
    },
  ];
  @Input() onChange;
  @Output() dialogOpened: boolean = false;
  @Output() errorMsg: any;
  constructor(
    public service: FilemanagerService,
    public settingService: BasicsettingService,
    public utils: UtilityService,
    public errorHandler: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    this.loadItems();
    this.onChange.subscribe((res) => {
      this.selectedId = res;
      this.loadItems();
    });
  }
  private loadItems(): void {
    //this.loader = true;
    this.service
      .GetList('Directory', this.selectedId == null ? 0 : this.selectedId)
      .subscribe(
        (res) => {
          this.data = res;
          this.fileMgr = res;
          if (this.data != undefined) {
            if (this.tempData != undefined) {
              this.data.forEach((element) => {
                this.tempData.push({
                  id: element.id,
                  name: element.name,
                  parent: element.parent,
                });
              });
            } else {
              this.tempData = this.data;
            }
          }

          // this.loader = false;
        },
        (error) => this.onError(error, ErrorMessages.file_manager.get_list)
      );
  }
  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.data = {
      data: orderBy(this.fileMgr, this.sort),
      total: this.fileMgr.length,
    };
    this.data = this.data.data;
  }
  viewClick(id, parent): void {
    this.selectedId = id;
    this.parentId = parent;
    this.loadItems();
  }
  goUpFolder(): void {
    var fData = this.tempData.find(
      (c) => c.id == this.tempData[this.tempData.length - 1].parent
    );
    if (fData) {
      this.selectedId = fData.parent;
    }
    if (this.data == null) {
      this.selectedId = this.tempData[this.tempData.length - 1].parent;
    }
    this.loadItems();
  }
  public onFilter(inputValue: string): void {
    this.data = process(this.fileMgr, {
      filter: {
        logic: 'or',
        filters: [
          {
            field: 'name',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'size',
            operator: 'contains',
            value: inputValue,
          },
        ],
      },
    }).data;

    this.dataBinding.skip = 0;
  }
  gridViewAdd: any = [];
  selectItem(e) {
    const index: number = this.gridViewAdd.indexOf(e);
    if (index !== -1) {
      this.gridViewAdd.splice(index, 1);
    } else {
      this.gridViewAdd.push(e);
    }
  }

  selectAllItemChange(e): void {
    // switch inactive checked value
    this.gridViewAdd = [];
    if (e.target.checked) {
      for (let i = 0; i < this.data.length; i++) {
        if (this.data[i].count <= 0) {
          this.gridViewAdd.push(this.data[i].id);
          this.data[i].check = true;
        }
      }
    } else {
      for (let i = 0; i < this.data.length; i++) {
        this.data[i].check = false;
      }
    }
  }

  deleteFolder(item): void {
    this.opened = true;
  }
  public close(status) {
    if (status == 'yes') {
      this.service.deleteFiles(this.gridViewAdd).subscribe(
        (res) => {
          if (res['status'] == 200) this.utils.toast.success(res['message']);
          else this.utils.toast.error(res['message']);
          this.SaveChange.next(res);
          this.gridViewAdd = [];
          this.loadItems();
          this.DeleteFolder.emit(res);
        },
        (error) => this.onError(error, ErrorMessages.file_manager.delete_files)
      );
    }
    this.opened = false;
  }
  units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  niceBytes(x) {
    let l = 0,
      n = parseInt(x, 10) || 0;
    while (n >= 1024 && ++l) {
      n = n / 1024;
    }
    return n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + this.units[l];
  }

  private onError(error: any, customMessage?: string) {
    this.errorHandler.handleError(
      error,
      ModuleNames.file_manager,
      customMessage
    );
  }
}
