import {
  Component,
  OnInit,
  OnChanges,
  SimpleChanges,
  Input,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SortDescriptor,orderBy } from '@progress/kendo-data-query';
import { DataService } from 'src/app/core/services';
import { UtilityService } from 'src/app/core/services/utility.service';

@Component({
  selector: 'app-customer-notes',
  templateUrl: './customer-notes.component.html',
  styleUrls: ['./customer-notes.component.scss'],
})
export class CustomerNotesComponent implements OnInit, OnChanges {
  @Input() selectedCustomer: any;
  notes: any = [];
  notesSort: SortDescriptor[] = [];
  notesSelection: number[] = [];
  isNewNotes: boolean = false;
  skip: number = 0;
  multiple: boolean = false;
  notesForm: FormGroup;
  notesColumns = [
    {
      Name: 'userName',
      isCheck: true,
      Text: 'User Name',
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
  isAddRight: boolean = false;
  public defaultSort: SortDescriptor[] = [{
    field: 'createdDate',
    dir: 'desc',
  },]

  constructor(
    private dataService: DataService,
    private formBuilder: FormBuilder,
    private utilityService: UtilityService
  ) {
    const rights = JSON.parse(localStorage.getItem('Rights'));
    if (rights) {
    var pageModuleRights = rights.filter(
      (x) => x.subModuleName == 'Notes' && x.moduleName == 'Customer'
    );
    this.isAddRight = pageModuleRights.find(
      (x) => x.tabName.toLowerCase() == 'add'
    );}else{
      this.isAddRight =true;
    }
  }

  ngOnInit(): void {
    this.onInitNotesForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.onInitNotesForm();
    this.getCustomerNotes();
  }

  onResizeColumn(event) {}

  onSelectionChange(event) {}

  onSortChange(event) {}

  onReOrderColumns(event) {}

  onDataStateChange(event) {}

  onNewNote() {
    this.isNewNotes = !this.isNewNotes;
  }

  getCustomerNotes() {
    this.dataService
      .get(`Customer/${this.selectedCustomer?.id}/Notes`)
      .subscribe((result: any) => {
        if (result?.length) {
          this.notes = orderBy(result, this.defaultSort);
        } else {
          this.notes = [];
        }
      });
  }

  onInitNotesForm() {
    this.notesForm = this.formBuilder.group({
      subject: '',
      note: '',
    });
  }

  onSaveNote() {
    let payload = {
      id: 0,
      userName: JSON.parse(this.utilityService.storage.getItem('currentUser'))
        .userName,
      user_PK: JSON.parse(this.utilityService.storage.getItem('currentUser'))
        .id,
      customerId: this.selectedCustomer?.id,
      ...this.notesForm.value,
    };

    this.dataService.post('Customer/Note', payload).subscribe((result) => {
      if (result) {
        this.utilityService.toast.success('Notes saved successfully');
        this.getCustomerNotes();
        this.isNewNotes = false;
        this.notesForm.reset();
      }
    });
  }

  onCancelNote() {
    this.isNewNotes = !this.isNewNotes;
    this.onInitNotesForm();
  }
}
