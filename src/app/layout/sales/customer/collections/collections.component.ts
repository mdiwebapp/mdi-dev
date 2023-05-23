import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { DataService } from 'src/app/core/services';
import { GridDataResult, GroupKey } from '@progress/kendo-angular-grid';
import {
  orderBy,
  process,
  SortDescriptor,
  State,
} from '@progress/kendo-data-query';
import { collectionColumns, collectionData } from 'src/data/customer-data';

@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.scss'],
})
export class CollectionsComponent implements OnInit {
  @Input() selectedCustomer: any;

  state: State = {
    group: [{ field: 'jobNumber' }, { field: 'invoiceNumber' }],
  };
  collections: GridDataResult = process(collectionData, this.state);
  // state: State = {
  //   group: [{ field: 'job' }, { field: 'invoice' }],
  // };
  sort: SortDescriptor[] = [{ field: 'invoice' }];
  selections: any = [];
  skip: number = 0;
  multiple: boolean = false;
  collectionColumns: any = [];
  collection: any = [];

  // collections: any = [];
  expandedGroupKeys: Array<GroupKey> = [];

  constructor(private dataService: DataService) {
    this.collectionColumns = collectionColumns;
    // this.collections = collectionData;
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    this.onLoadCollections();
  }

  onResizeColumn(event) {}

  onSelectionChange(event) {}

  onReOrderColumns(event) {}

  onDataStateChange(state) {
    this.state = state;
    this.collections = process(collectionData, this.state);
  }

  onSortChange(sort: SortDescriptor[]) {
    this.sort = sort;
    this.collectionColumns = orderBy(this.collectionColumns, sort);
  }

  groupChange(): void {
    this.expandedGroupKeys = [];
  }

  onLoadCollections() {
    if (this.selectedCustomer != null) {
      this.dataService
        .get(`Customer/Collection/${this.selectedCustomer?.id}`)
        .subscribe((result: any) => {
          if (result?.length) {
            this.collection = process(result, this.state);
          } else {
            this.collection = [];
          }
        });
    }
    else {
      this.collection = [];
    }
  }
}
