import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import moment from 'moment';
import { DropdownService } from 'src/app/core/services/dropdown.service';
import { VacationDaysService } from './vacation-days.service';
import { DatePipe } from '@angular/common';
import * as fileSaver from 'file-saver';
import { SelectionRange } from '@progress/kendo-angular-dateinputs';
import { Day, nextDayOfWeek, prevDayOfWeek } from '@progress/kendo-date-math';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { Subscription } from 'rxjs';
import { UtilityService } from 'src/app/core/services/utility.service';
import { DataService } from 'src/app/core/services';
@Component({
  selector: 'app-vacation-days-reports',
  templateUrl: './vacation-days-reports.component.html',
  styleUrls: ['./vacation-days-reports.component.scss'],
})
export class VacationDaysReportsComponent implements OnInit {
  vacationDaysReportForm: FormGroup;
  employees: any = [
    // { name: 'All' },
    // { name: 'Abata, Benjamin' },
    // { name: 'Adams, Carl' },
    // { name: 'Allen, Nathan' },
  ];
  visible: boolean = false;
  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'startsWith',
  };
  clickEventsubscription: Subscription;
  selectedBranch: any;
  constructor(
    private formBuilder: FormBuilder,
    private utility: UtilityService,
    public service: VacationDaysService,
    public datepipe: DatePipe,
    public dropdownaService: DropdownService,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    const branch = JSON.parse(
      this.utility.storage.getItem('selectedBranch')
    )[0];
    this.getAMEmployeeByBranch(branch);
    this.onInitForm();
    this.setWeekDate();
    this.clickEventsubscription = this.utility
      .getClickEvent()
      .subscribe((e) => {
        this.getAMEmployeeByBranch(e[0]);
      });
  }

  getAMEmployeeByBranch(branch) {
    this.dataService
      .post(`Dropdown/Employees/${branch.code}`, {})
      .subscribe((res: any) => {
        if (res?.result) {
          this.employees = res?.result;
          this.employees.unshift({ eeid: 'All', name: 'All' });
          this.vacationDaysReportForm.value.employeeNumber = 'All';
          this.vacationDaysReportForm.controls['employeeNumber'].setValue(
            'All'
          );
        } else {
          this.employees = [];
        }
      });
  }

  onInitForm() {
    this.vacationDaysReportForm = this.formBuilder.group({
      start: [moment().toDate(), Validators.required],
      end: [moment().add(3, 'days').toDate(), Validators.required],
      employeeNumber: ['All', Validators.required],
    });
  }
  getReport() {
    if (this.vacationDaysReportForm.invalid) {
      this.vacationDaysReportForm.markAllAsTouched();
      return false;
    }
    var obj = {
      start: this.datepipe.transform(
        this.vacationDaysReportForm.value.start,
        'MM/dd/yyyy'
      ),
      end: this.datepipe.transform(
        this.vacationDaysReportForm.value.end,
        'MM/dd/yyyy'
      ),
      employeeNumber:
        this.vacationDaysReportForm.value.employeeNumber == 'All'
          ? '%'
          : this.vacationDaysReportForm.value.employeeNumber,
      branchCode: JSON.parse(localStorage.getItem('selectedBranch')).map(
        (item) => item.code
      ),
    };
    this.service.getDataList(obj).subscribe((res) => {
      this.visible = false;
      let data = new Blob([res], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;',
      });
      fileSaver.saveAs(data, 'VacationDaysReport.xlsx');
    });
  }
  setWeekDate() {
    var weekday = new Array(7);
    weekday[0] = 'Sun';
    weekday[1] = 'Mon';
    weekday[2] = 'Tue';
    weekday[3] = 'Wed';
    weekday[4] = 'Thu';
    weekday[5] = 'Fri';
    weekday[6] = 'Sat';

    var currentDate = this.range.start;
    var day = weekday[currentDate.getDay()];
    var startIndex = weekday.indexOf(day);
    var indexOfDay = weekday.indexOf('Mon');
    if (startIndex != indexOfDay) {
      var newdate = this.range.start;
      if (startIndex == 0) {
        newdate.setDate(currentDate.getDate() - 6);
      } else if (startIndex == 2) {
        newdate.setDate(currentDate.getDate() - 1);
      } else if (startIndex == 3) {
        newdate.setDate(currentDate.getDate() - 2);
      } else if (startIndex == 4) {
        newdate.setDate(currentDate.getDate() - 3);
      } else if (startIndex == 5) {
        newdate.setDate(currentDate.getDate() - 4);
      } else if (startIndex == 6) {
        newdate.setDate(currentDate.getDate() - 5);
      }

      var endDate = new Date();

      this.vacationDaysReportForm.controls['start'].setValue(newdate);
      this.range.start = newdate;
      this.handleSelectionRange(this.range);
      // var dt = endDate.setDate(newdate.getDate() + 6);
      // this.vacationDaysReportForm.controls['endDate'].setValue(new Date(dt));
    } else {
      this.range.start = currentDate;
      this.handleSelectionRange(this.range);
      // var endDate: Date = currentDate;
      // var newdate = new Date();
      // this.vacationDaysReportForm.controls['start'].setValue(newdate);
      // var dt = endDate.setDate(newdate.getDate() + 6);
      // this.vacationDaysReportForm.controls['endDate'].setValue(new Date(dt));
    }
  }
  public handleSelectionRange(range: SelectionRange): void {
    const firstWeekDay = prevDayOfWeek(range.start, Day.Monday);
    const lastWeekDay = nextDayOfWeek(firstWeekDay, Day.Sunday);
    this.vacationDaysReportForm.controls['start'].setValue(firstWeekDay);
    this.vacationDaysReportForm.controls['end'].setValue(lastWeekDay);
    //this.range = { start: firstWeekDay, end: lastWeekDay };
  }
  public range = {
    start: new Date(),
    end: new Date(),
  };
}
