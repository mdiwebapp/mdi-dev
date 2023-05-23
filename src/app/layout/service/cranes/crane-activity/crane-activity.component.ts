import { DatePipe } from '@angular/common';
import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { orderBy, SortDescriptor, process } from '@progress/kendo-data-query';
import moment from 'moment';
import { DataService } from 'src/app/core/services';
import { DropdownService } from 'src/app/core/services/dropdown.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import {
  annualInspectionColumns,
  inspectioncolumn,
} from 'src/data/cranes-data';

@Component({
  selector: 'app-crane-activity',
  templateUrl: './crane-activity.component.html',
  styleUrls: ['./crane-activity.component.scss'],
})
export class CraneActivityComponent implements OnInit, OnChanges {
  @Input() selectedCrane: any;
  @Input() disableCranes: boolean = false;
  selectedCallLog;
  annualInspections = [];
  monthlyInspections = [];
  activityForm: FormGroup;
  data: any = [];
  sort: SortDescriptor[] = [{ field: 'workDate', dir: 'asc' }];
  employeeSelections = [];
  selections: string = 'monthly';
  skip: number = 0;
  multiple: any = [];
  monthlySelection = [0];
  monthlyInspectionSort: SortDescriptor[] = [];
  annualInspetionSort: SortDescriptor[] = [];
  annualInspectionData: any = [];
  annualInspection = [];
  annualSelection = [];
  inspected_btn: string = '';
  isInspectdVisible: boolean = false;
  inspectedData: any = [];
  tempinspectedData: any = [];
  inspectionColumns: any = [];
  confirm_title: string = '';
  confirm_message: string = '';
  isConfirmDialogVisible: boolean = false;
  inspectedByfilter: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private utilityService: UtilityService,
    private dropdownService: DropdownService,
    public datepipe: DatePipe
  ) {
    this.annualInspection = annualInspectionColumns;
    this.inspectionColumns = inspectioncolumn;
  }

  ngOnInit(): void {
    this.onInitActivityForm({});
    this.onLoadEmployees();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.disableCranes) {
      this.onLoadAnnualInspection();
      this.onLoadMonthlyInspection();
    }
  }

  onResizeColumn(event) {}

  onSelectionChange(event, selection) {
    if (selection === 'monthly') {
      // this.annualInspections[]==null;
      this.onInitActivityForm({
        ...event.selectedRows[0].dataItem,
        inspDate: moment(event.selectedRows[0].dataItem.inspDate).toDate(),
      });
      this.annualSelection = [];
    } else if (selection === 'annual') {
      this.onInitActivityForm({
        ...event.selectedRows[0].dataItem,
        inspDate: moment(event.selectedRows[0].dataItem.inspDate).toDate(),
      });
      this.monthlySelection = [];
    } else {
    }
  }

  onSortChange(sort: SortDescriptor[], type) {
    switch (type) {
      case 'monthly_inspection':
        this.monthlyInspectionSort = sort;
        break;
      case 'annualnspection':
        this.annualInspetionSort = sort;
        this.annualInspections = orderBy(this.annualInspection, sort);
        break;
      default:
        break;
    }
  }

  onRowSelect(event, type) {
    console.log('event', event);
    switch (type) {
      case 'inspected':
        this.activityForm.setValue({
          ...this.activityForm.value,
          inspBy: event?.selectedRows[0].dataItem.name,
        });
        this.isInspectdVisible = false;
        break;
      default:
        break;
    }
  }
  onReOrderColumns(event) {}

  onDataStateChange(event) {}

  onHandleOperation(type) {
    switch (type) {
      case 'inspected':
        this.isInspectdVisible = !this.isInspectdVisible;
        if (this.isInspectdVisible) {
          this.inspectedByfilter = '';
          this.onFilterInspectedBy(this.inspectedByfilter);
        }
        break;
      case 'submit':
        this.onSaveActivity();
        break;
      case 'confirm':
        this.isConfirmDialogVisible = !this.isConfirmDialogVisible;
        break;
      default:
        break;
    }
  }

  onSaveActivity() {
    if (!this.activityForm.get('inspBy').value) {
      this.confirm_title = 'MDI3.0';
      this.confirm_message =
        'Must select the Inspected By that the inspection took place.';
      this.isConfirmDialogVisible = true;
    } else if (!this.activityForm.get('inspDate').value) {
      this.confirm_title = 'MDI3.0';
      this.confirm_message =
        'Must select the Date that the inspection took place.';
      this.isConfirmDialogVisible = true;
    } else if (!this.activityForm.get('note').value) {
      this.confirm_title = 'MDI3.0';
      this.confirm_message =
        'Must select the note that the inspection took place.';
      this.isConfirmDialogVisible = true;
    } else {
      this.dataService
        .post('Crane/Activity/Save', {
          ...this.activityForm.value,
          craneNumber: this.selectedCrane?.craneNumber,
          inspDate: moment(this.activityForm.get('inspDate').value)
            .utc(true)
            .toISOString(),
        })
        .subscribe((result: any) => {
          if (result?.status === 200) {
            this.activityForm.reset();
            this.utilityService.toast.success(result?.message);
            this.onLoadMonthlyInspection();
            this.onLoadAnnualInspection();
          }
        });
    }
  }

  onInitActivityForm(value) {
    this.activityForm = this.formBuilder.group({
      userName: JSON.parse(this.utilityService.storage.getItem('currentUser'))
        .userName,
      craneNumber: this.selectedCrane?.craneNumber,
      inspBy: value?.inspBy || '',
      inspDate: value?.inspDate || '',
      annual: value?.annual || false,
      note: value?.note || '',
    });
  }

  onLoadEmployees() {
    this.dropdownService.GetEmployee().subscribe((res) => {
      this.inspectedData = res.result;
      this.tempinspectedData = res.result;
    });
  }

  onLoadAnnualInspection() {
    if (this.selectedCrane?.craneNumber) {
      this.dataService
        .get(`Crane/Activity/Year/${this.selectedCrane?.craneNumber}`)
        .subscribe((result: any) => {
          if (result?.length) {
            this.annualInspections = result;
            this.setGridSelection();
          } else {
            this.annualInspections = [];
          }
        });
    }
  }

  onLoadMonthlyInspection() {
    if (this.selectedCrane?.craneNumber) {
      this.dataService
        .get(`Crane/Activity/Month/${this.selectedCrane?.craneNumber}`)
        .subscribe((result: any) => {
          if (result?.length) {
            this.monthlyInspections = result;
            this.setGridSelection();
          } else {
            this.monthlyInspections = [];
          }
        });
    }
  }

  onFilterInspectedBy(input: string) {
    this.inspectedByfilter = input;
    this.inspectedData = process(this.tempinspectedData, {
      filter: {
        logic: 'or',
        filters: [
          {
            field: 'eeid',
            operator: 'contains',
            value: input,
          },
          {
            field: 'name',
            operator: 'contains',
            value: input,
          },
        ],
      },
    }).data;
  }

  setGridSelection() {
    if (this.monthlyInspections.length && this.annualInspections.length) {
      this.monthlySelection = [...[0]];
      this.annualSelection = [...[]];
      this.onInitActivityForm({
        ...this.monthlyInspections[0],
        inspDate: moment(this.monthlyInspections[0].inspDate).toDate(),
      });
    } else if (
      !this.monthlyInspections.length &&
      this.annualInspections.length
    ) {
      this.annualSelection = [...[0]];
      this.onInitActivityForm({
        ...this.annualInspections[0],
        inspDate: moment(this.annualInspections[0].inspDate).toDate(),
      });
    } else {
      this.monthlySelection = [];
      this.annualSelection = [];
    }
  }
}
