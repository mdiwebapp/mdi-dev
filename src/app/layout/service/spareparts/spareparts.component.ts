import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
//import {ViewData,ViewSubData,ViewScreen,} from './../../../../data/spare-parts-data';
import { SparepartServiceService } from './sparepart-service.service';
import { ErrorHandlerService } from 'src/app/core/services';
import { ErrorMessages, ModuleNames } from 'src/app/core/constant';
import { DropdownService } from 'src/app/core/services/dropdown.service';
import { orderBy, SortDescriptor } from '@progress/kendo-data-query';
import { UserPreferenceModel } from 'src/app/core/models/preference.model';
import { UserPreferenceService } from 'src/app/core/services/user-preference.service';
import * as fileSaver from 'file-saver';
import { MenuService } from 'src/app/core/helper/menu.service';
import { UtilityService } from 'src/app/core/services/utility.service';

@Component({
  selector: 'app-spare-parts',
  templateUrl: './spareparts.component.html',
  styleUrls: ['./spareparts.component.scss'],
})
export class SparePartsComponent implements OnInit {
  form: FormGroup;
  viewData: any;
  gridView: any;
  tempViewSubData: any;
  spareScreenList: any = [];
  tempspareScreenList: any = [];
  inactive = false;
  displayPumpEndDialog: boolean;
  data: any;
  viewSubData: any = [];
  tempParts: any = [];
  public mySelection: number[] = [0];
  public sort: SortDescriptor[] = [
    {
      field: 'parentPart',
      dir: 'asc',
    },
  ];
  public sortSub: SortDescriptor[] = [
    {
      field: 'childPart',
      dir: 'asc',
    },
  ];
  userPreferenceModel: UserPreferenceModel;
  columnWidths: any = [];
  columnWidthSub: any = [];
  public viewColumns = [
    {
      Name: 'parentPart',
      isCheck: true,
      Text: 'Parent Part',
      isDisable: false,
      index: 0,
      width: '',
    },
    {
      Name: 'description',
      isCheck: true,
      Text: 'Description',
      isDisable: false,
      index: 0,
      width: '',
    },
    {
      Name: 'inactive',
      isCheck: true,
      Text: 'Inactive',
      isDisable: false,
      index: 0,
      width: '',
    },
  ];
  public viewColumnSub = [
    {
      Name: 'childPart',
      isCheck: true,
      Text: 'Child Part',
      isDisable: false,
      index: 0,
      width: '',
    },
    {
      Name: 'description',
      isCheck: true,
      Text: 'Description',
      isDisable: false,
      index: 0,
      width: '',
    },
    {
      Name: 'qty',
      isCheck: true,
      Text: 'Qty',
      isDisable: false,
      index: 0,
      width: '',
    },
    {
      Name: 'wearPart',
      isCheck: true,
      Text: 'Wear Part',
      isDisable: false,
      index: 0,
      width: '',
    },
  ];
  public columns = [];
  constructor(
    private formBuilder: FormBuilder,
    public service: SparepartServiceService,
    public errorHandler: ErrorHandlerService,
    private utility: UtilityService,
    public preference: UserPreferenceService,
    public dropdownservice: DropdownService,
    public menuService: MenuService,
    public router: Router
  ) {
    if (localStorage.getItem('isAdmin') != 'true') {
      let acc = this.menuService.checkUserViewRights('Spare Parts');
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
    }
  }
  ngOnInit(): void {
    //this.viewData = ViewData;
    this.viewSubData = [];
    // this.gridView = ViewScreen;
    // this.spareScreenList = ViewScreen;
    this.initForm();
    this.GetSparePartsPumpEnds();
    this.loadItems();
  }

  initForm(): void {
    this.form = this.formBuilder.group({
      active: [true],
      pumpEnd: 'All',
      cD4: [false],
      parts: [false],
      // wearPart: [true],
      // inactive: [true],
      search: [''],
      // qty: [],
      // spareScreenData: [''],
    });
  }
  GetSparePartsPumpEnds() {
    this.dropdownservice.GetLookupList('SparePartsPumpEnds').subscribe(
      (res) => {
        if (res) {
          this.spareScreenList = res;
          this.spareScreenList.unshift({ id: 0, value: 'All' });
          this.tempspareScreenList = this.spareScreenList;
        }
      },
      (error) => this.onError(error, ErrorMessages.drop_down.states)
    );
  }
  loadItems(): void {
    this.mySelection = [];
    var request = {
      active: this.form.value.active,
      cD4: this.form.value.cD4,
      pumpEnd: this.form.value.pumpEnd,
      search: '',
    };
    this.data = [];
    this.tempParts = [];
    this.service.GetSparePartsList(request).subscribe(
      (res) => {
        if (res != null && res.length > 0) {
          this.data = res;
          this.tempParts = res;
          this.mySelection = [0];
          this.getPreference();
          if (this.data.length > 0) {
            this.selectedPart = this.data[0].parentPart;
            this.loadParts();
          }
        } else {
          this.data = [];
          this.viewSubData =[]
        }
      },
      (error) => this.onError(error, ErrorMessages.parts.get_list)
    );
  }
  selectedPart: number;
  partClick(id) {
    this.selectedPart = id;
    this.loadParts();
  }

  loadParts() {
    var request = {
      bom: this.selectedPart,
      part: this.form.value.parts == false ? 'Wear' : 'All',
    };
    this.viewSubData = [];
    this.tempViewSubData = [];
    this.service.GetSparePartsBOMList(request).subscribe(
      (res) => {
        if (res != null && res.length > 0) {
          this.viewSubData = res;
          this.tempViewSubData = res;
          this.getPreferenceSub();
        }
      },
      (error) => this.onError(error, ErrorMessages.parts.get_list)
    );
  }
  onPumpEnd() {
    this.displayPumpEndDialog = !this.displayPumpEndDialog;
  }
  closePopup() {
    this.displayPumpEndDialog = !this.displayPumpEndDialog;
  }
  downloadFile() {
    var obj = {
      bom: this.selectedPart,
      part: this.form.value.parts == false ? 'Wear' : 'All',
    };
    this.service.downloadExcel(obj).subscribe(
      (res) => {
        let data = new Blob([res], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;',
        });
        fileSaver.saveAs(data, 'Spare_part.xlsx');
      },
      (error) => {
        this.onError(error, ErrorMessages.vehicle.download_vehicle_data);
      }
    );
  }
  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.data = {
      data: orderBy(this.data, this.sort),
      total: this.tempParts.length,
    };
    this.data = this.data.data;
    this.mySelection = [0];
    this.savePreference();
  }
  public sortChangeSubgrid(sort: SortDescriptor[]): void {
    this.sortSub = sort;
    this.viewSubData = {
      data: orderBy(this.tempViewSubData, this.sortSub),
      total: this.tempViewSubData.length,
    };
    this.viewSubData = this.viewSubData.data;
    this.savePreferenceSub();
  }
  savePreference() {
    var usr = JSON.parse(localStorage.getItem('currentUser'));
    if (usr) {
      this.userPreferenceModel = new UserPreferenceModel();
      this.userPreferenceModel.userName = usr.userId;
      this.userPreferenceModel.id = 0;
      this.userPreferenceModel.userId = 0;
      this.userPreferenceModel.page = 'Spareparts';
      var objd = {
        columns: [],
        order: this.viewColumns,
        width: this.columnWidths,
        sortBy: this.sort,
      };
      this.userPreferenceModel.preference = objd; //'{ columns: ' + this.hiddenColumns + ', order: ' + this.sort[0].dir + ', width: "", sortBy: ' + this.sort[0].field + '}';
      this.preference
        .SaveUserPreference(this.userPreferenceModel)
        .subscribe((res) => {});
    }
  }
  getPreference() {
    try {
      this.preference.GetUserPreference('Spareparts').subscribe((res) => {
        if (res.result) {
          var userPref = res.result.preference;
          this.viewColumns = userPref.order.filter((c) => c.isCheck == true);
          this.viewColumns.forEach((element) => {
            let col = this.viewColumns.findIndex((c) => c.Name == element.Name);
            this.viewColumns[col].isCheck = true;
          });
          this.sort = userPref.sortBy;
          this.data = {
            data: orderBy(this.tempParts, this.sort),
            total: this.tempParts.length,
          };
          this.data = this.data.data;
        } else {
          this.viewColumns.forEach((element) => {
            let col = this.viewColumns.findIndex((c) => c.Name == element.Name);
            this.viewColumns[col].isCheck = true;
          });
          this.data = this.data;
        }
        this.mySelection = [0];
      });
    } catch (error) {
      this.viewColumns.forEach((element) => {
        let col = this.viewColumns.findIndex((c) => c.Name == element.Name);
        this.viewColumns[col].isCheck = true;
      });
    }
  }
  resizeColumns(eventData) {
    let col = this.viewColumns.findIndex(
      (c) => c.Name == eventData[0].column.field
    );
    this.viewColumns[col].width = eventData[0].newWidth;
    this.savePreference();
  }
  reorderColumns(event) {
    var newIndx = event.newIndex;
    var oldIndx = event.oldIndex;
    var column = event.column.field;
    let cutOut = this.viewColumns.splice(oldIndx, 1)[0]; // cut the element at index 'from'
    this.viewColumns.splice(newIndx, 0, cutOut); // insert it at index 'to'
    this.savePreference();
  }

  savePreferenceSub() {
    var usr = JSON.parse(localStorage.getItem('currentUser'));
    if (usr) {
      this.userPreferenceModel = new UserPreferenceModel();
      this.userPreferenceModel.userName = usr.userId;
      this.userPreferenceModel.id = 0;
      this.userPreferenceModel.userId = 0;
      this.userPreferenceModel.page = 'SparepartsSub';
      var objd = {
        columns: [],
        order: this.viewColumnSub,
        width: this.columnWidthSub,
        sortBy: this.sort,
      };
      this.userPreferenceModel.preference = objd; //'{ columns: ' + this.hiddenColumns + ', order: ' + this.sort[0].dir + ', width: "", sortBy: ' + this.sort[0].field + '}';
      this.preference
        .SaveUserPreference(this.userPreferenceModel)
        .subscribe((res) => {});
    }
  }
  getPreferenceSub() {
    try {
      this.preference.GetUserPreference('SparepartsSub').subscribe((res) => {
        if (res.result) {
          var userPref = res.result.preference;
          this.viewColumnSub = userPref.order.filter((c) => c.isCheck == true);
          this.viewColumnSub.forEach((element) => {
            let col = this.viewColumnSub.findIndex(
              (c) => c.Name == element.Name
            );
            this.viewColumnSub[col].isCheck = true;
          });
          this.sortSub = userPref.sortBy;
          this.viewSubData = {
            data: orderBy(this.tempViewSubData, this.sortSub),
            total: this.tempViewSubData.length,
          };
          this.viewSubData = this.viewSubData.data;
        } else {
          this.viewColumnSub.forEach((element) => {
            let col = this.viewColumnSub.findIndex(
              (c) => c.Name == element.Name
            );
            this.viewColumnSub[col].isCheck = true;
          });
          this.viewSubData = this.viewSubData;
        }
      });
    } catch (error) {
      this.viewColumnSub.forEach((element) => {
        let col = this.viewColumnSub.findIndex((c) => c.Name == element.Name);
        this.viewColumnSub[col].isCheck = true;
      });
    }
  }
  resizeColumnsSub(eventData) {
    let col = this.viewColumnSub.findIndex(
      (c) => c.Name == eventData[0].column.field
    );
    this.viewColumnSub[col].width = eventData[0].newWidth;
    this.savePreferenceSub();
  }
  reorderColumnsSub(event) {
    var newIndx = event.newIndex;
    var oldIndx = event.oldIndex;
    var column = event.column.field;
    let cutOut = this.viewColumnSub.splice(oldIndx, 1)[0]; // cut the element at index 'from'
    this.viewColumnSub.splice(newIndx, 0, cutOut); // insert it at index 'to'
    this.savePreferenceSub();
  }
  PumpEndFilter(value) {
    this.spareScreenList = this.tempspareScreenList.filter(
      (s) => s.value.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  private onError(error: any, customMessage?: string) {
    this.errorHandler.handleError(error, ModuleNames.parts, customMessage);
  }
}
