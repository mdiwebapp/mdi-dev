import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  ViewColumnsOtherInfo,
  ViewDataOtherInfo,
} from './../../../../../../../data/fleet-data';
import {
  AggregateDescriptor,
  DataResult,
  process,
  State,
} from '@progress/kendo-data-query';

import { DataStateChangeEvent } from '@progress/kendo-angular-grid';

@Component({
  selector: 'app-fleet-other-info',
  templateUrl: './fleet-other-info.component.html',
  styleUrls: ['./fleet-other-info.component.scss'],
})
export class FleetOtherInfoComponent implements OnInit {
  form: FormGroup;
  viewData: any;
  viewColumns: any;

  public state: State = {
    skip: 0,
    take: 5,
    group: [{ field: 'Name' }],
  };
  constructor(private formBuilder: FormBuilder) {}
  ngOnInit(): void {
    this.viewData = ViewDataOtherInfo;
    this.viewColumns = ViewColumnsOtherInfo;
    this.initForm();
  }

  initForm(): void {
    this.form = this.formBuilder.group({});
  }
  public viewGridColumns = [
    {
      Name: 'ProductName',
      isCheck: true,
      Text: 'Product Name',
      isDisable: false,
      index: 0,
      width: 50,
    },
    {
      Name: 'Status',
      isCheck: true,
      Text: 'Status',
      isDisable: false,
      index: 1,
      width: 50,
    },
  ];
  public gridData = [
    { id: 1, ProductName: 'Trailer Package', Status: 'No', Name: 'Other' },
    { id: 1, ProductName: 'Skid', Status: 'No', Name: 'Other' },
    { id: 1, ProductName: 'Sound Attenuation', Status: 'No', Name: 'Other' },
    { id: 1, ProductName: 'Stainlesssteel', Status: 'No', Name: 'Other' },
    { id: 1, ProductName: 'CD4', Status: 'No', Name: 'Other' },
    { id: 1, ProductName: 'Engine Registration', Status: 'No', Name: 'Other' },
    { id: 1, ProductName: 'Other 1', Status: 'belt 080660', Name: 'Other' },
  ];
}
