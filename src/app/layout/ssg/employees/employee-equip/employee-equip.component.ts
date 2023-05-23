import { Component, OnInit } from '@angular/core';
import { SortDescriptor } from '@progress/kendo-data-query';

@Component({
  selector: 'app-employee-equip',
  templateUrl: './employee-equip.component.html',
  styleUrls: ['./employee-equip.component.scss'],
})
export class EmployeeEquipComponent implements OnInit {
  equips: any = [];
  equipSort: SortDescriptor[] = [];
  equipSelection: number[] = [];
  equipColumns: any = [
    {
      Name: 'name',
      isCheck: true,
      Text: '',
      isDisable: false,
      index: 0,
      width: 100,
      hide: true,
    },
    {
      Name: 'info',
      isCheck: true,
      Text: 'Info',
      isDisable: false,
      index: 0,
      width: 100,
      hide: true,
    },
    {
      Name: 'assigned',
      isCheck: true,
      Text: 'Assigned',
      isDisable: false,
      index: 0,
      width: 100,
      hide: true,
    },
    {
      Name: 'returned',
      isCheck: true,
      Text: 'Returned',
      isDisable: false,
      index: 0,
      width: 100,
      hide: true,
    },
  ];
  skip: number = 0;
  multiple: boolean = false;

  constructor() {
    this.equips = [
      { name: 'Computer', info: 'MDI-204', assigned: '', returned: '' },
      { name: 'Phone', info: '', assigned: '', returned: '' },
      { name: 'Hot Spot', info: 'MDI-204', assigned: '', returned: '' },
      { name: 'Tablet', info: 'MDI-204', assigned: '', returned: '' },
    ];
  }

  ngOnInit(): void {}

  onResizeColumn(event) {}

  onSelectionChange(event) {}

  onSortChange(event) {}

  onReOrderColumns(event) {}

  onDataStateChange(event) {}
}
