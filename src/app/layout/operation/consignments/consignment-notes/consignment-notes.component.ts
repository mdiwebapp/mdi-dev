import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { orderBy, SortDescriptor } from '@progress/kendo-data-query';
import { DataService } from 'src/app/core/services';
import { UtilityService } from 'src/app/core/services/utility.service';

@Component({
  selector: 'app-consignment-notes',
  templateUrl: './consignment-notes.component.html',
  styleUrls: ['./consignment-notes.component.scss'],
})
export class ConsignmentNotesComponent implements OnInit, OnChanges {
  @Input() jobNumber: string;
  notes: any = [];
  notesColumns: any = [
    {
      Name: 'userName',
      isCheck: true,
      Text: 'User name',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'subject',
      isCheck: true,
      Text: 'Subject',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'note',
      isCheck: true,
      Text: 'Note',
      isDisable: false,
      index: 0,
      width: 100,
    },
  ];

  sort: SortDescriptor[] = [
    {
      field: 'createdDate',
      dir: 'asc',
    },
    {
      field: 'username',
      dir: 'asc',
    },
    {
      field: 'subject',
      dir: 'asc',
    },
    {
      field: 'note',
      dir: 'asc',
    },
  ];
  selections: number[] = [0];
  skip: number = 0;
  multiple: boolean = false;
  isDisable: boolean = true;
  notesForm: FormGroup;
  isAdd: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private utilityService: UtilityService
  ) {
    const rights = JSON.parse(localStorage.getItem('Rights'));
    if (rights) {
      var pageModuleRights = rights.filter(
        (x) => x.subModuleName == 'Notes' && x.moduleName == 'Consignments'
      );
      this.isAdd = pageModuleRights.find(
        (x) => x.tabName.toLowerCase() == 'add'
      );
    } else {
      this.isAdd = true;
    }
  }

  ngOnInit(): void {
    this.onInitForm({});
    // this.onLoadNotes();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.onLoadNotes();
  }

  onResizeColumn(event) {}

  onSelectionChange(event) {
    this.onInitForm(event.selectedRows[0]?.dataItem);
  }

  onSortChange(sort: SortDescriptor[]) {
    this.sort = sort;
    this.notes = orderBy(this.notes, sort);
  }

  onReOrderColumns(event) {}

  onDataStateChange(event) {}

  onHanleOperation(type) {
    switch (type) {
      case 'new':
        this.isDisable = !this.isDisable;
        this.onInitForm({});
        break;
      case 'save':
        this.isDisable = !this.isDisable;
        this.onLoadSave();
        break;
      case 'cancel':
        this.isDisable = !this.isDisable;
        this.onInitForm(this.notes[this.selections[0]]);
        break;
      default:
        break;
    }
  }

  onInitForm(value) {
    this.notesForm = this.formBuilder.group({
      subject: value?.subject || '',
      note: value?.note || '',
    });
  }

  onLoadNotes() {
    this.dataService
      .get(`Project/${this.jobNumber}/Notes`)
      .subscribe((data: any) => {
        if (data?.length) {
          this.notes = data;
          this.onInitForm(data[0]);
        } else {
          this.notes = [];
          this.onInitForm({});
        }
      });
  }

  onLoadSave() {
    {
      this.dataService
        .post('Project/Notes', {
          ...this.notesForm.value,
          jobNumber: this.jobNumber,
          userName: JSON.parse(
            this.utilityService.storage.getItem('currentUser')
          ).userName,
          user_PK: JSON.parse(
            this.utilityService.storage.getItem('currentUser')
          ).id,
        })
        .subscribe((result: any) => {
          if (result?.status === 200) {
            // this.notesForm.reset();
            // this.isDisable = false;
            this.utilityService.toast.success(result?.message);
            this.onLoadNotes();
          }
        });
    }
  }
}
