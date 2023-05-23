import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GroupKey } from '@progress/kendo-angular-grid';
import { DataStateChangeEvent } from '@progress/kendo-angular-treelist';
import { process, SortDescriptor, State } from '@progress/kendo-data-query';
import { checkboxIcon } from '@progress/kendo-svg-icons';
import { MenuService } from 'src/app/core/helper/menu.service';
import { ErrorHandlerService } from 'src/app/core/services';
import { UtilityService } from 'src/app/core/services/utility.service';
import { MaintainUnionsService } from './maintain-unions.service';
@Component({
  selector: 'app-maintain-unions',
  templateUrl: './maintain-unions.component.html',
  styleUrls: ['./maintain-unions.component.scss'],
})
export class MaintainUnionsComponent implements OnInit {
  maintainUnionsForm: FormGroup;
  disable: boolean = false;
  disableLaborType: boolean = false;
  disableUnionCode: boolean = false;
  disableCancelBtn: boolean = false;
  unionCodedisable: boolean = false;
  isDisable: boolean = true;
  active: boolean = true;
  sort: SortDescriptor[] = [];
  selections: any = [];
  selectionsUnion: number[] = [0];
  skip: number = 0;
  multiple: any = [];
  isCreatable: boolean = false;
  isEditable: boolean = false;
  isNewVisible: boolean = false;
  newCloseDialogVisible: boolean = false;
  expandedGroupKeys: Array<GroupKey> = [];
  groupData: any = [];
  groupcolumn: any = [];
  group: any = [];
  group_by_filter_btn: string = 'All';
  isGroupVisible: boolean = false;
  rowSticky: any = [];
  initiallyExpanded = false;
  unions: any = [];
  state: State = {
    group: [{ field: 'unionCode' }],
  };
  labaorTypeColumns = [
    {
      Name: 'laborType',
      isCheck: true,
      Text: 'Labor Type',
      isDisable: false,
      index: 0,
      width: 100,
    },
  ];
  laborTypeData = [];
  tempId: number;
  unionTypeColumns = [
    {
      Name: 'unionCode',
      isCheck: true,
      Text: 'Union Code',
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
    {
      Name: 'type',
      isCheck: true,
      Text: 'Type',
      isDisable: false,
      index: 0,
      width: 50,
    },
    {
      Name: 'rate',
      isCheck: true,
      Text: 'Rate',
      isDisable: false,
      index: 0,
      width: 30,
    },
    // {
    //   Name: 'inactive',
    //   isCheck: true,
    //   Text: 'Active',
    //   isDisable: false,
    //   index: 0,
    //   width: 30,
    // },
  ];

  unionData = [
    // {
    //   unionCode: '000',
    //   description: 'Local318',
    //   type: 'CLASSA',
    //   rate: '$35.65',
    // },
    // {
    //   unionCode: 'LT3',
    //   description: 'Local 3 Utah - travelers',
    //   type: 'GROUP 1',
    //   rate: '$35.31',
    // },
    // {
    //   unionCode: 'LM3',
    //   description: 'Local 3 Utah - Members',
    //   type: 'GROUP 1',
    //   rate: '$35.31',
    // },
  ];
  id: number = 0;
  activeForm: boolean = true;
  TypeList: any = [];

  constructor(
    private formBuilder: FormBuilder,
    public service: MaintainUnionsService,
    public errorHandler: ErrorHandlerService,
    private utility: UtilityService,
    public menuService: MenuService
  ) {
    if (localStorage.getItem('isAdmin') == 'true') {
    } else {
      let acc = this.menuService.checkUserViewRights('Maintain Unions');
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
      this.menuService.checkUserBySubmoduleRights('Maintain Unions');
    }
  }

  ngOnInit(): void {
    this.onInitForm(this.unionData[0]);
    this.getLabourType();
    this.getUnionList();
  }

  onInitForm(value) {
    this.maintainUnionsForm = this.formBuilder.group({
      unionCode: [value?.unionCode || '', Validators.required],
      description: value?.description || '',
      type: [value?.type || '', Validators.required],
      rate: [value?.rate || '', Validators.required],
      active: [!value?.inactive],
    });
  }
  resetForm() {
    this.maintainUnionsForm.setValue({
      description: '',
      type: null,
      rate: null,
      unionCode: this.maintainUnionsForm.value.unionCode,
    });
  }
  getLabourType() {
    this.laborTypeData = [];
    this.service.getLabourTypeList().subscribe((res) => {
      if (res.length > 0) {
        this.laborTypeData = res;
      }
    });
  }

  getUnionList() {
    this.unions = [];
    var obj = {
      searchText: this.searchText,
      active: this.active,
    };
    this.service.getHRUnionList(obj).subscribe((res) => {
      if (res.length > 0) {
        this.unions = res;
        this.unionData = res;
        this.unions = process(this.unionData, this.state);
        if (
          this.tempId == null ||
          this.tempId === undefined ||
          this.tempId == 0
        ) {
          this.onSelectionChange(this.unions?.data[0]?.items?.[0]);
          this.expandedGroupKeys = this.expandedGroupKeys.length
            ? this.expandedGroupKeys
            : [this.unions?.data?.[0]];
        } else {
          this.onSelectionChange(
            this.unions?.data[this.tempId]?.items?.[this.tempId]
          );
          this.expandedGroupKeys = this.expandedGroupKeys.length
            ? this.expandedGroupKeys
            : [this.unions?.data?.[this.tempId]];
        }
      }
    });
  }
  onGroupChange(event) {
    this.active = event;
    this.getUnionList();
  }
  onResizeColumn(event) {}

  onSelectionChange(event) {
    this.disable = false;
    this.unionCodedisable = false;
    this.unionCodedisable = false;
    //var union = this.unions[this.selectionsUnion[0]];
    this.id = event.pk;
    this.tempId = this.id;
    let data = this.service.getUnionDetails(this.id).subscribe((res) => {
      this.onInitForm(res.result);
      this.TypeList = [];
      this.TypeList = res.result.laborTypes;
      this.laborTypeData.forEach((element) => {
        if (res.result.laborTypes.includes(element.laborType)) {
          element.duties = true;
        } else {
          element.duties = false;
        }
      });
      this.activeForm = res.result.inactive == false ? true : false;
    });
  }

  onSortChange(event) {}

  onReOrderColumns(event) {}

  onDataStateChange(event) {}

  groupChange() {
    var union = this.unions[this.selectionsUnion[0]];
  }
  searchText: string;
  onFilter() {
    this.getUnionList();
  }
  onHandleOperation(type, value = null) {
    switch (type) {
      case 'new':
        this.isCreatable = !this.isCreatable;
        this.disable = true;
        this.disableCancelBtn = true;
        this.disableLaborType = false;
        this.unionCodedisable = true;
        this.isEditable = !this.isEditable;
        this.activeForm = true;
        this.id = 0;
        this.laborTypeData.forEach((element) => {
          element.duties = false;
        });
        this.onInitForm({
          unionCode: this.maintainUnionsForm.value.unionCode,
        });
        // this.onInitForm()
        break;
      case 'edit':
        this.isCreatable = !this.isCreatable;
        this.isEditable = !this.isEditable;
        this.disable = true;
        this.disableLaborType = true;
        this.disableCancelBtn = true;
        this.unionCodedisable = true;
        // this.utility.storage.setItem('unionEditMode', 'true');
        break;
      case 'cancel':
        this.disable = false;
        this.isCreatable = !this.isCreatable;
        this.isEditable = !this.isEditable;
        this.disableCancelBtn = false;
        this.disableLaborType = false;
        this.unionCodedisable = false;
        this.laborTypeData.forEach((element) => {
          if (this.TypeList.includes(element.laborType)) {
            element.duties = true;
          } else {
            element.duties = false;
          }
        });

        let allUnions = this.unions.data.reduce(
          (a, b) => (a.push(...b?.items), a),
          []
        );
        this.onSelectionChange(allUnions[this.selectionsUnion[0]]);
        // this.utility.storage.removeItem('unionEditMode', 'false');
        break;
      case 'save':
        this.isCreatable = !this.isCreatable;
        this.isEditable = !this.isEditable;
        this.disableLaborType = false;
        this.saveUnionData();
        break;
      case 'new_btn':
        this.isNewVisible = !this.isNewVisible;
        this.newCloseDialogVisible = false;
        break;
      case 'close':
        this.isNewVisible = !this.isNewVisible;
      default:
        break;
    }
  }
  newUnionCode: string = '';
  saveNew() {
    if (!this.newUnionCode) {
      return false;
    }
    var selectedTypes = [];
    this.laborTypeData.forEach((element) => {
      if (element.duties) {
        selectedTypes.push(element.laborType);
      }
    });
    this.isNewVisible = !this.isNewVisible;
    this.newCloseDialogVisible = true;
    var addNew = {
      unionCode: this.newUnionCode,
      description: 'NEW',
      type: 'NEW',
      rate: 0,
      laborTypes: selectedTypes,
    };
    this.service.addHRUnion(addNew).subscribe(
      (res) => {
        if (res.status == 200) {
          this.utility.toast.success(res.message);
          this.newUnionCode = '';
          this.getUnionList();
        }
      },
      (error) => {
        this.onError(error, 'One or more validation errors occurred.');
      }
    );
  }
  saveUnionData() {
    if (this.maintainUnionsForm.invalid) {
      this.maintainUnionsForm.markAllAsTouched();
      return false;
    }
    var selectedTypes = [];
    this.laborTypeData.forEach((element) => {
      if (element.duties) {
        selectedTypes.push(element.laborType);
      }
    });
    if (this.id == 0) {
      var addNew = {
        unionCode: this.maintainUnionsForm.value.unionCode,
        description: this.maintainUnionsForm.value.description,
        type: this.maintainUnionsForm.value.type,
        rate: this.maintainUnionsForm.value.rate,
        laborTypes: selectedTypes,
        active: this.maintainUnionsForm.value.active,
      };
      this.service.addHRUnion(addNew).subscribe(
        (res) => {
          if (res.status == 200) {
            this.utility.toast.success(res.message);
            this.disable = false;
            this.unionCodedisable = false;
            this.getUnionList();
          }
        },
        (error) => {
          this.onError(error, 'One or more validation errors occurred.');
        }
      );
    } else {
      var update = {
        id: this.id,
        userName: '',
        description: this.maintainUnionsForm.value.description,
        type: this.maintainUnionsForm.value.type,
        rate: this.maintainUnionsForm.value.rate,
        laborTypes: selectedTypes,
        inactive: this.maintainUnionsForm.value.active == true ? false : true,
      };
      this.service.updateHRUnion(update).subscribe(
        (res) => {
          if (res.status == 200) {
            this.utility.toast.success(res.message);
            this.disable = false;
            this.unionCodedisable = false;
            //this.onSelectionChange(update);
            this.getUnionList();
          }
        },
        (error) => {
          this.onError(error, 'One or more validation errors occurred.');
        }
      );
    }
  }
  private onError(error: any, customMessage?: string) {
    this.errorHandler.handleError(error, 'Maintain Union', customMessage);
  }
}
