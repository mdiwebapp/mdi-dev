import { Component, OnInit } from '@angular/core';
import { FleetBomService } from './fleet-bom.service';
import {
  orderBy,
  process,
  SortDescriptor,
  State,
} from '@progress/kendo-data-query';

@Component({
  selector: 'app-fleet-bom',
  templateUrl: './fleet-bom.component.html',
  styleUrls: ['./fleet-bom.component.scss'],
})

export class FleetBomComponent implements OnInit {
  history: any;
  temphistory: any;



  constructor(public service: FleetBomService) { }

  public data: any[];
  public adorsBOM: any = [
    { id: 1, report: null, parentPart: '510040000000', childPart: '510040000000', description: 'SKID BASE KIT, GROUP C T3' },
    { id: 2, report: 1, parentPart: '510040000000', childPart: '201896200000', description: 'BATTERY BOX, WELDMENT, 4D' },
    { id: 3, report: 1, parentPart: '510040000000', childPart: '124303056000', description: 'BATTERY BOX, COVER, 4D' },
    { id: 4, report: 1, parentPart: '510040000000', childPart: '326837000000', description: 'FUEL FILL, CAP' },
    { id: 5, report: 1, parentPart: '510040000000', childPart: '326838000000', description: 'FUEL FILL, STRAINER, STAINLESS STEEL' },
    {
      id: 6, report: 1, parentPart: '510040000000', childPart: '344087000000',
      description: 'FUEL GAUGE, ROCHESTER GAUGE MODEL 8680, 9" DEPTH , 1-1/2" MALE NPT, NITRILE RUBBER FLOAT'
    },
    { id: 7, report: 1, parentPart: '510040000000', childPart: '201716200002', description: 'LIFTING BAIL, GROUP C MODULAR SKID, TIER 3' },
    { id: 8, report: null, parentPart: '502034000000', childPart: '502034000000', description: 'WET END SUBASSEMBLY, 6GT, CAST IRON' },
    { id: 9, report: 8, parentPart: '502034000000', childPart: '000081001001', description: 'CASING, 6GST, 6GHT' },
    { id: 10, report: 8, parentPart: '502034000000', childPart: '000083001001', description: 'STUFFING BOX COVER, 6GST, 6GHT' },
    { id: 11, report: 8, parentPart: '502034000000', childPart: '000088001001', description: 'GLAND, 6GT, CAST IRON' },
  ];
  ngOnInit() {

  }
  /*
  historyList(data) {
    
    this.service.GetHistoryByVendorId(data.id).subscribe((res) => {
      ;
      if (res.length > 0) {
        this.history = res;
        this.temphistory = res;
        }
     
    });
  }
  */

  public onFilter(inputValue: string): void {

    this.data = process(this.temphistory, {
      filter: {
        logic: "or",
        filters: [
          {
            field: "createdBy",
            operator: "contains",
            value: inputValue,
          },
          {
            field: "field",
            operator: "contains",
            value: inputValue,
          },
          {
            field: "oldValue",
            operator: "contains",
            value: inputValue,
          },
          {
            field: "newValue",
            operator: "contains",
            value: inputValue,
          },
          {
            field: "createdDate",
            operator: "contains",
            value: inputValue,
          }
        ],
      },
    }).data;

    this.history = this.data;
    // this.editContactClick(this.data[0].id);

  }
}
