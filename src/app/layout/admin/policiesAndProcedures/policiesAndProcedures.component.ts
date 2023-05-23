import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  GroupDescriptor,
  process,
  SortDescriptor,
  State,
  orderBy,
} from '@progress/kendo-data-query';

import {
  DataStateChangeEvent,
  GridDataResult,
  GroupKey,
} from '@progress/kendo-angular-grid';
import { PoliciesColumns, PoliciesData } from '../../../../data/admin-data';
import { NodeClickEvent } from '@progress/kendo-angular-treeview';
import { Observable, of } from 'rxjs';
import { saveAs } from 'file-saver';
import { UtilityService } from 'src/app/core/services/utility.service';
import { TreeViewService } from 'src/app/shared/service/treeView.service';
import { NetworkDirectoryService } from '../../../../app/layout/networkdirectory/networkdirectorypage/networkdirectory.service';
import { MenuService } from 'src/app/core/helper/menu.service';
import { ExtensionModel } from 'src/app/shared/models/extension.model';
import { TreeviewSearchService } from 'src/app/core/services/treeview-search.service';
@Component({
  selector: 'app-policiesAndProcedures',
  templateUrl: './policiesAndProcedures.component.html',
  styleUrls: ['./policiesAndProcedures.component.scss'],
})
export class PoliciesAndProceduresComponent implements OnInit {
  state: State = {
    group: [{ field: 'procedures' }, { field: 'type' }, { field: 'group' }],
  };
  policiesForm: FormGroup;
  requestsTickets: any = [];
  safety: GridDataResult = process(PoliciesData, this.state);
  selections: any = [];
  multiple: boolean = false;
  safetyColumns: any = PoliciesColumns;
  expandedGroupKeys: Array<GroupKey> = [];
  public subDirData: any[];
  public files: any[];
  public expandedNames: any[];
  public data: any[];
  visible: boolean;
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

  constructor(
    private formBuilder: FormBuilder,
    public treeViewService: TreeViewService,
    public utility: UtilityService,
    public menuService: MenuService,public treeviewSearch:TreeviewSearchService,
    public NetworkDirectoryService: NetworkDirectoryService
  ) {
    if (localStorage.getItem('isAdmin') == 'true') {
      this.addExtensionRights = true;
    } else {
      let acc = this.menuService.checkUserViewRights('Policies and Procedures');
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
      this.menuService.checkUserBySubmoduleRights('Policies and Procedures');
      this.addExtensionRights = false;
    }
  }
  ngOnInit(): void {
    this.onInitRequestTicketForm();
    this.getFormatList();
    this.loadNetworkFiles();
  }
  onInitRequestTicketForm() {
    this.subDirData = [];
    this.policiesForm = this.formBuilder.group({
      extension: [
        '',
        [Validators.required, Validators.pattern('^([.]+)([a-zA-Z0-9]+)')],
      ],
      description: '',
    });
  }
  onDataStateChange(state: DataStateChangeEvent) {}

  groupChange(): void {}

  loadNetworkFiles() {
    this.treeViewService.getTreeViewList(50, 'PolicyPath').subscribe(
      (res) => {
        res.forEach((element) => {
          if (element.name == null) {
            element.name = 'Policies and Procedures';
            this.expandedNames = ['Policies and Procedures'];
          }
          this.subdirectory(element);
        });
        this.data = res;
        this.lstItems = this.data;
        this.filesubDirectory(res[0]);
        this.subdirectory(res[0]);
        this.files = res[0].files;
        this.selectedFiles(res[0]);
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

  // public children = (dataitem: any): Observable<any[]> =>
  //   of(this.getItems(dataitem));

  // getItems(dataitem) {
  //   let arr = [];

  //   if (dataitem.subDirectories) {
  //     arr = arr.concat(dataitem.subDirectories);
  //   }

  //   if (dataitem.files) {
  //     arr = arr.concat(dataitem.files.filter((e) => e.name != 'Thumbs.db'));
  //   }

  //   return arr;
  // }

  // public hasChildren = (dataitem: any): boolean =>
  //   !!dataitem.subDirectories || !!dataitem.files;

  downloadPolicyandProcedureFile(data: any) {
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
                  el.extension.toLowerCase() != '.db'  &&
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

  onExtensionSortChange(sort: SortDescriptor[]) {
    this.sort = sort;
    this.extensionData = orderBy(this.tempextensionData, this.sort);
  }

  AddExtension() {
    if (this.policiesForm.invalid) {
      this.policiesForm.markAllAsTouched();
      return false;
    }
    this.visible = true;
    const extension = new ExtensionModel();
    extension.userName = JSON.parse(
      localStorage.getItem('currentUser')
    ).userName;
    extension.extension = this.policiesForm.value.extension;
    extension.description = this.policiesForm.value.description;
    this.treeViewService.AddExtension(extension).subscribe((res) => {
      if (res['status'] == 200) {
        this.utility.toast.success(res['message']);
        this.policiesForm.reset();
        this.searchExtension = '';
        this.getFormatList();
        this.OnChangeFormat(this.filterExtension);
      } else {
        this.visible = false;
        this.utility.toast.error(res['message']);
      }
    });
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
  lstItems: any = [];
  public handleFilter(value: string): void {
    this.data = this.treeviewSearch.search(this.lstItems[0].subDirectories, value);   
    if(!value){
      this.data=this.lstItems;
    } 
  }
}
