import { Component, OnInit } from '@angular/core';
import { GridDataResult, GroupKey } from '@progress/kendo-angular-grid';
import {
  orderBy,
  process,
  SortDescriptor,
  State,
} from '@progress/kendo-data-query';
import { certificationData } from 'src/data/employee-data';

@Component({
  selector: 'app-employee-certification',
  templateUrl: './employee-certification.component.html',
  styleUrls: ['./employee-certification.component.scss'],
})
export class EmployeeCertificationComponent implements OnInit {
  state: State = {
    group: [{ field: 'certification' }],
  };
  certifications: GridDataResult;
  certificationsColumns: any = [
    {
      Name: 'certification',
      isCheck: true,
      Text: 'Certification',
      isDisable: false,
      index: 0,
      width: 100,
      hide: true,
    },
    {
      Name: 'dataType',
      isCheck: true,
      Text: 'Data Type',
      isDisable: false,
      index: 0,
      width: 100,
      hide: true,
    },
    {
      Name: 'date',
      isCheck: true,
      Text: 'Date',
      isDisable: false,
      index: 0,
      width: 100,
      hide: true,
    },
  ];
  certificationSelection: number[] = [];
  certificationSort: SortDescriptor[] = [];
  skip: number = 0;
  multiple: boolean = false;
  expandedGroupKeys: Array<GroupKey> = [];

  constructor() {
    this.certifications = process(certificationData, this.state);
  }

  ngOnInit(): void {}

  onResizeColumn(event) {}

  onSelectionChange(event) {}

  onSortChange(sort: SortDescriptor[]) {
    this.certificationSort = sort;
    // this.certifications = orderBy(certificationData, sort);
  }

  onReOrderColumns(event) {}

  onDataStateChange(event) {
    this.state = event;
    this.certifications = process(certificationData, this.state);
  }

  groupChange() {
    this.expandedGroupKeys = [];
  }
}
