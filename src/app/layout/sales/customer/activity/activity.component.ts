import {
  Component,
  OnInit,
  OnChanges,
  SimpleChanges,
  Input,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SortDescriptor } from '@progress/kendo-data-query';
import { DataService } from 'src/app/core/services';
import {
  activityColumns,
  activityData,
} from '../../../../../data/customer-data';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss'],
})
export class ActivityComponent implements OnInit, OnChanges {
  @Input() selectedCustomer: any;
  // filterForm: FormGroup;
  sort: SortDescriptor[] = [];
  selections: any = [];
  skip: number = 0;
  multiple: boolean = false;
  activityColumns: any = [];
  activities: any = [];
  allActivities: any = [];
  activityFilters: any = {
    salesCall: true,
    notes: true,
    allJobs: true,
    activeJobs: true,
  };

  constructor(
    private router: Router,
    private dataService: DataService // private formBuilder: FormBuilder
  ) {
    this.activityColumns = activityColumns;
  }

  ngOnInit(): void {
    // this.allActivities = this.activityFilters;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.onLoadActivities();
  }

  // onFilterInitForm() {
  //   this.filterForm = this.formBuilder.group({
  //     salesCall: '',
  //     notes: '',
  //     allJobs: '',
  //     activeJobs: '',
  //   });
  // }

  onResizeColumn(event) {}

  onSelectionChange(event) {}

  onSortChange(event) {}

  onReOrderColumns(event) {}

  onDataStateChange(event) {}

  onLoadActivities() {
    if (this.selectedCustomer != null && this.selectedCustomer.id) {
      this.dataService
        .get(`Customer/${this.selectedCustomer?.id}/activities`)
        .subscribe((result: any) => {
          if (result?.length) {
            this.activities = this.allActivities = result;
          } else {
            this.activities = this.allActivities = [];
          }
        });
    } else {
      this.activities = this.allActivities = [];
    }
  }

  onHandleFilters(type) {
    switch (type) {
      case 'sales-call':
        this.activityFilters.salesCall = !this.activityFilters.salesCall;
        break;
      case 'notes':
        this.activityFilters.notes = !this.activityFilters.notes;
        break;
      case 'all-jobs':
        this.activityFilters.allJobs = !this.activityFilters.allJobs;
        break;
      case 'active-jobs':
        this.activityFilters.activeJobs = !this.activityFilters.activeJobs;
        break;
      default:
        break;
    }
    this.filterActivities();
  }

  filterActivities() {
    let temp = [];
    if (this.activityFilters.salesCall) {
      temp.push(
        ...this.allActivities.filter((item) => item.activityType == 'Call Log')
      );
    }

    if (this.activityFilters.notes) {
      temp.push(
        ...this.allActivities.filter((item) => item.activityType == 'Notes')
      );
    }

    if (this.activityFilters.allJobs) {
      temp.push(
        ...this.allActivities.filter(
          (item) => item.id.charAt(0) == 'J' && item.status == null
        )
      );
    }

    if (this.activityFilters.activeJobs) {
      temp.push(
        ...this.allActivities.filter(
          (item) => item.id.charAt(0) == 'J' && item.status != null
        )
      );
    }

    this.activities = temp;
  }

  callLogDetail(data) {
    if (data?.activityType === 'Call Log') {
      this.router
        .navigate([])
        .then(() => window.open('/calllogs?callLogId=' + data.id, '_blank'));
    }
  }
}
