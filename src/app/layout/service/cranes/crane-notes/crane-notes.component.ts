import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataService } from 'src/app/core/services';
import { orderBy, SortDescriptor } from '@progress/kendo-data-query';
import { notes, notesData } from 'src/data/cranes-data';
import { UtilityService } from 'src/app/core/services/utility.service';
import { MenuService } from 'src/app/core/helper/menu.service';

@Component({
  selector: 'app-crane-notes',
  templateUrl: './crane-notes.component.html',
  styleUrls: ['./crane-notes.component.scss'],
})
export class CraneNotesComponent implements OnInit, OnChanges {
  notes: any = [];
  @Input() selectedCrane: any;
  // @Output() onLoadNotes: EventEmitter<any> = new EventEmitter();
  isDisable: boolean = false;
  data: any = [];
  sort: SortDescriptor[] = [];
  selections: any = [];
  skip: number = 0;
  multiple: any = [];
  notesColumns: any = [];
  notesSort: SortDescriptor[] = [];
  confirm_title: string = '';
  confirm_message: string = '';
  isConfirmDialogVisible: boolean = false;
  isCreatable: boolean = false;
  isEditable: boolean = false;
  disableCranes: boolean = true;
  isAdd: boolean = false;
  notesForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private utilityService: UtilityService,
    public menuService: MenuService
  ) {
    this.notesColumns = notes;
    // const rights = JSON.parse(localStorage.getItem('Rights'));
    // var pageModuleRights = rights.filter(
    //   (x) => x.subModuleName == 'Notes'  && x.moduleName=='Cranes'
    // );
    // this.isAdd = pageModuleRights.find(
    //   (x) => x.tabName.toLowerCase() == 'add'
    // );
    this.isAdd = false;
  }

  ngOnInit(): void {
    this.OnInitNotesForm({});
    // this.onLoadNotes();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.onLoadNotes();
  }

  onResizeColumn(event) {}

  onSelectionChange(event) {
    this.OnInitNotesForm(event.selectedRows[0].dataItem);
  }

  onReOrderColumns(event) {}

  onDataStateChange(event) {}

  OnInitNotesForm(value) {
    this.notesForm = this.formBuilder.group({
      subject: value?.subject || '',
      note: value?.note || '',
    });
  }

  onSortChange(sort: SortDescriptor[], type) {
    switch (type) {
      case 'notes':
        this.notesSort = sort;
        this.notesSort = orderBy(this.notesSort, sort);
        break;

      default:
        break;
    }
  }

  onHandleOperation(type) {
    switch (type) {
      case 'confirm':
        this.isConfirmDialogVisible = !this.isConfirmDialogVisible;
        break;
      case 'new':
        this.isDisable = true;
        this.OnInitNotesForm({});
        break;
      case 'cancel':
        this.isDisable = false;
        this.OnInitNotesForm(this.notes[0]);
        break;
      case 'save':
        this.onSaveNotes();
        break;
      default:
        break;
    }
  }

  onSaveNotes() {
    if (!this.notesForm.get('subject').value) {
      this.confirm_title = 'Must have a subject';
      this.confirm_message = 'Must have a subject.';
      this.isConfirmDialogVisible = true;
    } else if (!this.notesForm.get('note').value) {
      this.confirm_title = 'Must have a notes';
      this.confirm_message = 'Must have a notes.';
      this.isConfirmDialogVisible = true;
    } else {
      this.dataService
        .post('Crane/Notes', {
          ...this.notesForm.value,
          craneHeaderId: this.selectedCrane?.pk,
          username: JSON.parse(
            this.utilityService.storage.getItem('currentUser')
          ).userName,
        })
        .subscribe((result: any) => {
          if (result?.status === 200) {
            this.notesForm.reset();
            this.isDisable = false;
            this.utilityService.toast.success(result?.message);
            this.onLoadNotes();
          }
        });
    }
  }

  onLoadNotes() {
    this.dataService
      .get(`Crane/${this.selectedCrane.pk}/Notes`)
      .subscribe((result: any) => {
        if (result?.length) {
          this.notes = result;
          this.OnInitNotesForm(result[0]);
          this.selections = [0];
        } else {
          this.notes = [];
          this.OnInitNotesForm({});
        }
      });
  }
}
