import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  GroupDescriptor,
  process,
  SortDescriptor,
  State,
  orderBy,
} from '@progress/kendo-data-query';

import { saveAs } from 'file-saver';

import {
  DataStateChangeEvent,
  GridDataResult,
  GroupKey,
} from '@progress/kendo-angular-grid';
import { TreeViewService } from '../../../shared/service/treeView.service';
import { TreeviewSearchService } from '../../../core/services/treeview-search.service';
import {
  safetyColumns,
  safetyData,
} from '../../../../../src/data/request-ticket-data';
import { UtilityService } from '../../../core/services/utility.service';
import { NodeClickEvent } from '@progress/kendo-angular-treeview';
import { Observable, of } from 'rxjs';
import { SafetyService } from '../safety/safety.service';
import { NetworkDirectoryService } from '../../../../app/layout/networkdirectory/networkdirectorypage/networkdirectory.service';
import { ExtensionModel } from '../../../shared/models/extension.model';
import { MenuService } from 'src/app/core/helper/menu.service';
const is = (fileName: string, ext: string) =>
  new RegExp(`.${ext}\$`).test(fileName);

@Component({
  selector: 'app-safety',
  templateUrl: './safety.component.html',
  styleUrls: ['./safety.component.scss'],
})
export class SafetyComponent implements OnInit {
  state: State = {
    group: [{ field: 'safety' }, { field: 'type' }],
  };
  safetyForm: FormGroup;
  visible: boolean;
  requestsTickets: any = [];
  safety: any = safetyData;
  selections: any = [];
  lstItems: any = [];
  multiple: boolean = false;
  safetyColumns: any = safetyColumns;

  expandedGroupKeys: Array<GroupKey> = [];
  public expandedNames: any[];
  public data: any[];
  public subDirData: any[];
  public files: any[];
  public tempData: any = [];
  filterFormat: any = '';
  Formatfilter: any = '';
  formatList: any = [];
  filterExtension: boolean = false;
  isExtensionVisible: boolean = false;
  extensionData: any = [];
  tempextensionData: any = [];
  sort: SortDescriptor[] = [
    {
      field: 'extension',
      dir: 'asc',
    },
    {
      field: 'description',
      dir: 'asc',
    },
  ];
  defaultSort: SortDescriptor[] = [
    {
      field: 'extension',
      dir: 'asc',
    },
  ];
  Extensionselections: any = [];
  searchExtension: any = '';
  addExtensionRights: boolean = false;
  isAddRight: any;
  expandedKeys: string[];

  constructor(
    private formBuilder: FormBuilder,
    public treeViewService: TreeViewService,
    public utility: UtilityService,
    private service: SafetyService,
    public menuService: MenuService,public treeviewSearch:TreeviewSearchService,
    public NetworkDirectoryService: NetworkDirectoryService
  ) {
    if (localStorage.getItem('isAdmin') == 'true') {
      this.addExtensionRights = true;
    } else {
      let acc = this.menuService.checkUserViewRights('Safety');
      if (acc) {
        const rights = JSON.parse(localStorage.getItem('Rights'));
        if (rights) {
          var pageModuleRights = rights.filter(
            (x) => x.subModuleName == 'Safety' && x.moduleName == 'Safety'
          );
          this.addExtensionRights = pageModuleRights.find(
            (x) => x.tabName.toLowerCase() == 'extension'
          );
        } else {
          this.addExtensionRights = false;
        }
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
      //this.addExtensionRights = false;
    }
  }
  ngOnInit(): void {
    this.subDirData = [];
    // this.Formatfilter = this.formatList[0];
    // this.filterFormat = this.formatList[0].value;
    this.onInitRequestTicketForm();
    this.getFormatList();
    // this.getTreeViewData();
    this.loadNetworkFiles();
  }

  onInitRequestTicketForm() {
    this.safetyForm = this.formBuilder.group({
      extension: [
        '',
        [Validators.required, Validators.pattern('^([.]+)([a-zA-Z0-9]+)')],
      ],
      description: '',
    });
  }

  groupChange(): void { }

  getTreeViewData() {
    this.treeViewService
      .getTreeViewList(752, 'Safety_ToolBoxTalks')
      .subscribe((res) => {
        console.log(res, 'res');
      });
  }

  loadNetworkFiles() {
    this.visible = true;
    this.treeViewService.getTreeViewList(752, 'Safety_ToolBoxTalks').subscribe(
      (res) => {
        this.tempData = res;
        res.forEach((element) => {
          if (element.name == null) {
            element.name = 'Safety';
            this.expandedNames = ['Safety'];
          }
          this.subdirectory(element);
        });
        this.data = res;
        this.lstItems = this.data;
        this.filesubDirectory(res[0]);
        this.subdirectory(res[0]);
        this.files = res[0].files;
        this.selectedFiles(res[0]);
        this.visible = false;
      },
      (failed) => {
        this.utility.toast.error("You don't have permission to access ");
      }
    );
  }

  subdirectory(res) {
    res.subDirectories.forEach((element) => {
      this.changeElementDisplayName(element);
      this.filesubDirectory(element);
      this.subdirectory(element);
    });
  }

  filesubDirectory(res) {
    res.files.forEach((element) => {
      this.changeElementDisplayName(element);
    });
  }

  changeElementDisplayName(element) {
    if (element.name.startsWith('\\')) {
      element.name = element.name.substring(1);
    }
  }
  selectedFiles(e) {
    e.files.forEach((element) => {
      this.changeElementDisplayName(element);
    });
    this.files = e.files;
    if (e.subDirectories.length > 0) {
      this.subDirData = e.subDirectories;
    } else {
      this.subDirData = [];
    }
  }
  public onNodeDblClick(event: NodeClickEvent): void {
    let ext = event.item.dataItem.path.split('.').pop();
    if (ext != 'jpg') {
    } else {
    }
  }

  // public children = (dataitem: any): Observable<any[]> => of(this.getItems(dataitem,this.filterFormat));

  // getItems(dataitem,filter) {
  //   let arr = [];
  //   if(this.filterFormat == 'All') {
  //   if (dataitem.subDirectories) {
  //     arr = arr.concat(dataitem.subDirectories);
  //   }

  //   if (dataitem.files) {

  //     arr = arr.concat(dataitem.files.filter(e => this.formatList.some(el => e.name.includes(el.value))));
  //   }
  //   return arr;

  // }
  // else {
  //   if (dataitem.subDirectories) {
  //     arr = arr.concat(dataitem.subDirectories);
  //   }

  //   if (dataitem.files) {

  //     arr = arr.concat(dataitem.files.filter(e => e.name.includes(filter)));
  //   }
  //   return arr;
  // }
  // }

  // public hasChildren = (dataitem: any): boolean => !!dataitem.subDirectories || !!dataitem.files ;

  downloadSafetyFile(data: any) {
    this.visible = false;
    this.visible = true;

    this.NetworkDirectoryService.DownloadFile(encodeURI(data.path)).subscribe(
      (res) => {
        if (res.size > 0) {
          saveAs(res, data.name);
          this.visible = true;
          this.visible = false;
        } else {
          this.visible = true;
          this.visible = false;
        }
      },
      (error) => {
        console.log('Something went wrong');
      }
    );
  }

  // OnChangeFormat(data:any) {
  //   this.loadNetworkFiles();
  //   this.filterFormat = data != undefined ?  data.value : this.formatList[0].value;
  //   this.children = (dataitem: any): Observable<any[]> => of(this.getItems(dataitem,this.filterFormat));
  //   this.hasChildren = (dataitem: any): boolean => !!dataitem.subDirectories || !!dataitem.files ;
  // }

  getFormatList() {
    this.visible = true;
    this.treeViewService.getExtensionList().subscribe(
      (res) => {
        if (res.length > 0) {
          this.sort = this.defaultSort;
          this.extensionData = orderBy(res, this.sort);
          this.tempextensionData = this.extensionData;
        } else {
          this.extensionData = [];
        }
        this.visible = false;
      },
      (error) => {
        console.log('Something went wrong');
        this.visible = false;
      }
    );
  }

  public children = (dataitem: any): Observable<any[]> =>
    of(this.getItems(dataitem, this.filterExtension));

  getItems(dataitem, filter) {
    let arr = [];
    if (this.filterExtension == false) {
      if (dataitem.subDirectories) {
        arr = arr.concat(dataitem.subDirectories);
      }

      if (dataitem.files) {
        arr = arr.concat(
          dataitem.files.filter(
            (e) =>
              this.extensionData.some(
                (el) =>
                  '.' +
                  e.name.slice(e.name.lastIndexOf('.') + 1).toLowerCase() ==
                  el.extension.toLowerCase() &&
                  el.extension.toLowerCase() != '.db' &&
                  el.extension.toLowerCase() != '.lnk'
              ) &&
              e.name.charAt(0) != '~' &&
              e.name.charAt(1) != '$' &&
              e.name.toLowerCase() != 'sync.ffs_db'
          )
        );
      }
      return arr;
    } else {
      if (dataitem.subDirectories) {
        arr = arr.concat(dataitem.subDirectories);
      }

      if (dataitem.files) {
        arr = arr.concat(
          dataitem.files.filter(
            (e) =>
              e.name.charAt(0) != '~' &&
              e.name.charAt(1) != '$' &&
              e.name.toLowerCase() != 'sync.ffs_db' &&
              '.' + e.name.slice(e.name.lastIndexOf('.') + 1).toLowerCase() !=
              '.db' &&
              '.' + e.name.slice(e.name.lastIndexOf('.') + 1).toLowerCase() !=
              '.lnk'
          )
        );
      }
      return arr;
    }
  }

  public hasChildren = (dataitem: any): boolean =>
    !!dataitem.subDirectories || !!dataitem.files;

  OnChangeFormat(data: any) {
    this.filterExtension = data;
    this.loadNetworkFiles();
    this.children = (dataitem: any): Observable<any[]> =>
      of(this.getItems(dataitem, this.filterExtension));
    this.hasChildren = (dataitem: any): boolean =>
      !!dataitem.subDirectories || !!dataitem.files;
  }

  onHandleOperation(type: any) {
    switch (type) {
      case 'Extension':
        this.isExtensionVisible = !this.isExtensionVisible;
    }
  }

  onExtensionDataFilter(data: any) {
    this.searchExtension = data;
    this.extensionData = process(this.tempextensionData, {
      filter: {
        logic: 'or',
        filters: [
          {
            field: 'extension',
            operator: 'contains',
            value: data,
          },
          {
            field: 'description',
            operator: 'contains',
            value: data,
          },
        ],
      },
    }).data;
  }

  onRowSelect(event, type) { }

  onResizeColumn(event) { }

  onReOrderColumns(event) { }

  onDataStateChange(event) { }

  onExtensionSortChange(sort: SortDescriptor[]) {
    this.sort = sort;
    this.extensionData = orderBy(this.tempextensionData, this.sort);
  }

  AddExtension() {
    if (this.safetyForm.invalid) {
      this.safetyForm.markAllAsTouched();
      return false;
    }
    this.visible = true;
    const extension = new ExtensionModel();
    extension.userName = JSON.parse(
      localStorage.getItem('currentUser')
    ).userName;
    extension.extension = this.safetyForm.value.extension;
    extension.description = this.safetyForm.value.description;
    this.treeViewService.AddExtension(extension).subscribe((res) => {
      if (res['status'] == 200) {
        this.utility.toast.success(res['message']);
        this.safetyForm.reset();
        this.searchExtension = '';
        this.getFormatList();
        this.OnChangeFormat(this.filterExtension);
      } else {
        this.visible = false;
        this.utility.toast.error(res['message']);
      }
    });
  }

  public iconClass(text: string): any {
    return {
      'k-icon': true,
      'k-i-file-pdf': is(text, 'pdf'),
      'k-i-file-ppt': is(text, 'pptx'),
      'k-i-file-excel': is(text, 'xlsx'),
      'k-i-file-word': is(text, 'docx'),
      //
    };
  }
  deleteExtension(data: any) {
    this.treeViewService.DeleteExtension(data).subscribe((res) => {
      if (res['status'] == 200) {
        this.utility.toast.success(res['message']);
        this.searchExtension = '';
        this.Extensionselections = [];
        this.getFormatList();
        this.OnChangeFormat(this.filterExtension);
      } else {
        this.visible = false;
        this.utility.toast.error(res['message']);
      }
    });
  }
  public handleFilter(value: string): void {
    this.data = this.treeviewSearch.search(this.lstItems[0].subDirectories, value);   
    if(!value){
      this.data=this.lstItems;
    } 
  }
  
}
