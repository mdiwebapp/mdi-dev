import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { SortDescriptor } from '@progress/kendo-data-query';
import { MenuService } from 'src/app/core/helper/menu.service';
import { LoaderService } from 'src/app/core/loader/loader.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { VendorService } from '../../vendor/vendor/vendor.service';

@Component({
  selector: 'app-binslist',
  templateUrl: './binslist.component.html',
  styleUrls: ['./binslist.component.scss'],
})
export class BinslistComponent implements OnInit {
  public mySelection: number[] = [0];
  public pageSize = 5;
  public skip = 0;
  multiple: boolean = false;
  loader: any;
  isSave: boolean = true;
  isCancel: boolean = true;
  isEdit: boolean = false;
  isAdd: boolean = false;
  isAddRight: boolean = false;
  isUpdateRight: boolean = false;

  data: any;

  id: number;
  cdate: any;
  status: boolean = true;
  inactive: boolean = true;
  tabActive: boolean = true;
  isDisabled: boolean = true;
  cInfos: any;
  selectedTab = 0;
  tempvendor: any;
  tempId: number;
  filterText: string;
  branches: any = [];
  show: boolean;
  toggleText: string;
  isTab1: boolean = false;
  isTab2: boolean = false;

  constructor(
    public service: VendorService,
    public menuService: MenuService,
    public utils: UtilityService,
    public router: Router,
    public loaderService: LoaderService
  ) {
    // if (localStorage.getItem('isAdmin') == 'true') {
    //   this.isTab1 = false;
    // } else {
    //   let acc = this.menuService.checkUserViewRights('Maintain Bins');
    //   if (acc) {
    //     //this.utils.toast.error("User does not have rights to access " + name + " module.");Z
    //   } else {
    //     this.router.navigate(['dashboard']);
    //   }
    const rights = JSON.parse(localStorage.getItem('Rights'));
    if (rights) {
      this.isTab1 = !rights.some(
        (c) =>
          c.subModuleName == 'Maintain Bins' &&
          c.moduleName == 'Maintain Bins' &&
          c.tabName == 'VIEW'
      );
      this.isTab2 = !rights.some(
        (c) =>
          c.subModuleName == 'Maintain Tags' &&
          c.moduleName == 'Maintain Bins' &&
          c.tabName == 'VIEW'
      );
      console.log('istab', rights);
      // }
    }

    this.menuService.checkUserBySubmoduleRights('Maintain Bins');
    this.isAddRight = this.menuService.isAddRight;
    this.isUpdateRight = this.menuService.isEditRight;
  }

  ngOnInit(): void {}

  public sort: SortDescriptor[] = [
    {
      field: 'vendorName',
      dir: 'asc',
    },
  ];
  VendorInActive(event) {
    // this.data = this.vendor.filter(x => x.inactive == event);
    this.status = event;
    this.id = 0;
    this.mySelection = [0];
    //this.loadItems();
  }
  editClick(id: number) {}
  public sortChange(sort: SortDescriptor[]): void {
    // this.sort = sort;
    // this.data = {
    //   data: orderBy(this.tempvendor, this.sort),
    //   total: this.tempvendor.length,
    // };
    this.data = this.data.data;
  }
  public dataStateChange(state: DataStateChangeEvent): void {
    // this.state = state;
    // this.data = process(this.vendor, this.state);
  }

  btnAdd() {
    this.enableBtn();
    this.isDisabled = false;
    this.isEdit = true;
    this.isAdd = true;
  }
  btnEdit() {
    this.isDisabled = false;
    this.enableBtn();
    this.isEdit = true;
    this.isAdd = true;
  }
  btnCancel() {
    this.isDisabled = true;
    this.isCancel = true;
    this.isAdd = false;
    this.isEdit = false;
    this.isSave = true;
  }
  enableBtn() {
    this.isSave = false;
    this.isCancel = false;
    this.isAdd = true;
    this.isEdit = true;
  }
  disbaleBtn() {
    this.isSave = true;
    this.isCancel = true;
    this.isAdd = false;
    this.isEdit = false;
  }
  onSave() {}
  public onToggle(): void {
    this.show = !this.show;
    this.toggleText = this.show ? 'Hidе' : 'Show';
    // let aaa = this.columns.filter(x => x.isCheck == true);
    // if (aaa.length == 1) {
    //   this.columns.forEach(element => {
    //     if (element.Name != aaa[0].Name) {
    //       this.temphiddenColumns.push(element.Name);
    //     }
    //   });
    //   this.isDisabledColumn(aaa[0].Name);
    // }
  }
  closepopup() {
    this.show = !this.show;
  }
  resetpopup() {}
  columnApply() {}
}
