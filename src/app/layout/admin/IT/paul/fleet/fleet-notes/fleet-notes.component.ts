import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  DataBindingDirective,
  PageChangeEvent,
} from '@progress/kendo-angular-grid';
import { orderBy, process, SortDescriptor } from '@progress/kendo-data-query';
import { BehaviorSubject } from 'rxjs';
import { UtilityService } from 'src/app/core/services/utility.service';
import { FleetNotesModel } from './fleet-notes.model';
import { FleetNotesService } from './fleet-notes.service';
import { ModuleNames, ErrorMessages } from 'src/app/core/constant';
import { ErrorHandlerService } from 'src/app/core/services';
@Component({
  selector: 'app-fleet-notes',
  templateUrl: './fleet-notes.component.html',
  styleUrls: ['./fleet-notes.component.scss'],
})
export class FleetNotesComponent implements OnInit {
  @ViewChild(DataBindingDirective) dataBinding: DataBindingDirective;
  @Output() SaveEditClick = new EventEmitter<number>();
  @Input() onChange;
  SaveChange: BehaviorSubject<any> = new BehaviorSubject(null);

  form: FormGroup;
  id: number = 0;
  data: any = [];
  fleetId: any;
  skip: number;
  isAdd: boolean = false;
  public sort: SortDescriptor[] = [
    {
      field: 'subject',
      dir: 'asc',
    },
    {
      field: 'createdDate',
      dir: 'asc',
    },
    {
      field: 'note',
      dir: 'asc',
    },
  ];
  fleets: FleetNotesModel;
  isSave: boolean = true;
  isCancel: boolean = true;
  isEdit: boolean = true;
  loader: boolean;
  note: any[];
  @Output() dialogOpened: boolean = false;
  @Output() errorMsg: any;
  isAddRight: boolean = true;
  disableButton: boolean = true
  constructor(
    private formBuilder: FormBuilder,
    public service: FleetNotesService,
    private utils: UtilityService,
    public errorHandler: ErrorHandlerService
  ) {
    if (localStorage.getItem('isAdmin') == 'true') {
    } else {
      const rights = JSON.parse(localStorage.getItem('Rights'));
      this.isAddRight = rights.some(
        (c) =>
          c.subModuleName == 'Notes' &&
          c.moduleName == 'Maintain Fleet' &&
          c.tabName == 'ADD'
      );
    }
  }
  public mySelection: number[] = [0];
  ngOnInit(): void {
    this.initForm({});
    // this.form.disable();
  }

  initForm(value): void {
    this.form = this.formBuilder.group({
      subject: [value?.subject || '', Validators.required],
      note: [value?.note || ''],
    });
  }

  onEdit(res) {
    if (res) {
      this.isCancel = true;
      this.isAdd = false;
      this.isSave = true;
      this.fleetId = res.id;
      this.form.reset();
      this.NoteList(this.fleetId);
    }
  }
  onSave() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return true;
    }
    this.createNotes(
      this.fleetId,
      this.form.value.subject,
      this.form.value.notes
    );
  }

  editNoteClick(id) {
    this.id = id;
    this.service.GetNoteById(id).subscribe(
      (res) => {
        if (res) {
          this.setValue(res);
          this.isEdit = false;
          this.isAdd = false;
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.fleet.get_note_by_id);
      }
    );
  }

  NoteList(invNumber) {this.form.reset();
    this.fleetId = invNumber;
    this.service.GetNoteList(this.fleetId).subscribe(
      (res) => {
        if (res) {
          this.data = res;
          this.note = res;
          this.mySelection = [0];
          this.disableButton = true
          if(this.data.length > 0) {
            this.initForm(this.data[0])
          }      
        } else {
          this.data = [];
          this.note = [];
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.fleet.get_note_list);
      }
    );
  }

  setValue(data: FleetNotesModel) {
    this.form.setValue({
      subject: data.subject,
      note: data.note,
    });
  }

  btnCancel() {
    this.form.reset();
    // this.form.disable();
    this.disbaleBtn();
  }

  btnAdd() {
    this.form.reset();
    this.enableBtn();
    this.form.enable();
  }

  btnEdit() {
    this.form.enable();
    this.enableBtn();
    this.isEdit = true;
    this.isAdd = true;
  }

  enableBtn() {
    this.isAdd = true;
    this.isSave = false;
    this.isCancel = false;
  }
  disbaleBtn() {
    this.isAdd = false;
    this.isSave = true;
    this.isCancel = true;
  }

  public onFilter(inputValue: string): void {
    this.mySelection = [0];
    this.data = process(this.note, {
      filter: {
        logic: 'or',
        filters: [
          {
            field: 'subject',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'note',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'createdDate',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'userName',
            operator: 'contains',
            value: inputValue,
          },
        ],
      },
    }).data;
    this.form.reset();
    if (this.data.length > 0)
      this.setValue(this.data[0]);
    this.dataBinding.skip = 0;
  }

  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
  }
  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.data = {
      data: orderBy(this.note, this.sort),
      total: this.note.length,
    };
    this.data = this.data.data;
  }

  private onError(error: any, customMessage?: string) {
    this.errorHandler.handleError(error, ModuleNames.fleet, customMessage);
  }

  createNotes(invNumber, subject, strNotes) {
    const data = this.form.value;
    data.id = this.id;
    data.fleetId = invNumber;
    data.subject = subject;
    data.notes = strNotes;
    data.userName = JSON.parse(localStorage.getItem('currentUser')).userName;
    this.service.saveNote(data).subscribe(
      (res) => {
        if (res['status'] == 200) {
          this.utils.toast.success(res['message']);
          this.form.reset();
          // this.form.disable();
          this.NoteList(this.fleetId);
        } else this.utils.toast.error(res['message']);
        this.disbaleBtn();
        this.id = 0;
        this.disableButton = true
      },
      (error) => {
        this.onError(error, ErrorMessages.fleet.save_note);
      }
    );
  }

  onHandleOperation(type) {
    switch(type) {
      case 'new':
        this.initForm({})
        this.disableButton = false
        break;
      case 'cancel':
        this.data[this.mySelection[0]]
        this.initForm(this.data[this.mySelection[0]])
        this.disableButton = true
        break;
      case 'save':
        if (this.form.invalid) {
          this.form.markAllAsTouched();
          return true;
        }
        this.createNotes(
          this.fleetId,
          this.form.value.subject,
          this.form.value.notes
        );
        break;
      default:
    }
  }

  onSelectionChange(event) {
    if(event) {
      this.initForm(event)
      this.disableButton = true
    }else{
      this.initForm({})
    }
  }
}
