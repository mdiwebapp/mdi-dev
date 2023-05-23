import { Component, OnInit } from '@angular/core';
import {
  ViewColumns,
  ServiceBOMData,
} from '../../../../../data/service-bom-data';
@Component({
  selector: 'app-service-bom',
  templateUrl: './service-bom.component.html',
  styleUrls: ['./service-bom.component.scss'],
})
export class ServiceBOMComponent implements OnInit {
  public viewColumns: any;

  serviceBOMData: any;
  constructor() {}

  ngOnInit() {
    this.viewColumns = ViewColumns;
    this.serviceBOMData = ServiceBOMData;
  }
}
