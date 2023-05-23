import {
  Component,
  Input,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  DataBindingDirective,
  PageChangeEvent,
} from '@progress/kendo-angular-grid';
import { orderBy, process, SortDescriptor } from '@progress/kendo-data-query';
import { UtilityService } from 'src/app/core/services/utility.service';
import { EmployeenotesService } from './employeenotes.service';
import { ModuleNames, ErrorMessages } from 'src/app/core/constant';
import { ErrorHandlerService } from 'src/app/core/services';

@Component({
  selector: 'app-employee-notes',
  templateUrl: './employee-notes.component.html',
  styleUrls: ['./employee-notes.component.scss'],
})
export class EmployeeNotesComponent implements OnInit {
  @ViewChild(DataBindingDirective) dataBinding: DataBindingDirective;
  @Input() onChange;
  @Output() onAddNotes = new EventEmitter();
  multiple: boolean = false;
  isEdit: boolean = false;
  form: FormGroup;
  id: number;
  data: any;
  skip: number;
  subjectData: any = [
    { id: '1', text: 'IT' },
    { id: '2', text: 'Visa' },
  ];
  isSave: boolean = true;
  isCancel: boolean = true;
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
  action: string = '';
  note: any;
  employeeId: any;
  isAdd: boolean = true;
  isDisable: boolean = true;
  selections: number[] = [0];
  public defaultSort: SortDescriptor[] = [{
    field: 'createdDate',
    dir: 'desc',
  },]
  @Output() dialogOpened: boolean = false;
  @Output() errorMsg: any;
  constructor(
    private formBuilder: FormBuilder,
    public service: EmployeenotesService,
    private utils: UtilityService,
    public errorHandler: ErrorHandlerService
  ) { }
  ngOnInit(): void {
    this.initForm({});
    // this.onChange.subscribe(res => {
    //   if (res) {
    //     this.employeeId = res.id;
    //     this.NoteList();
    //   }
    // });

    this.form.disable();
  }
  btnEdit(id) {
    this.id = id;
    this.form.enable();
    this.enableBtn();
  }
  btnCancel() {
    this.id == 0;
    this.form.reset();
    this.isAdd = false;
  }
  enableBtn() {
    this.isSave = false;
    this.isCancel = false;
  }
  btnAdd(id) {
    this.onAddNotes.emit();
    // this.employee.isEdit = true;
    // this.id = id;
    // this.form.reset();
    // this.enableBtn();
    // this.form.enable();
  }
  initForm(value): void {
    this.form = this.formBuilder.group({
      subject: value?.subject || '' || [null, Validators.required],
      note: value?.note || '' || [null, Validators.required],
      userName: [''],
      employeeId: value?.id,
    });
  }

  onSave() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return true;
    }
    else {
      const data = this.form.value;
      data.userName = JSON.parse(localStorage.getItem('currentUser')).userName;
      data.employeeId = this.id;
      this.service.saveNote(data).subscribe(
        (res) => {
          if (res['status'] == 200) {
            this.utils.toast.success(res['message']);
            this.form.reset();
            this.form.disable();
            this.selections = [0];
            this.action = 'save';
            this.isEdit = false
            this.NoteList(this.id);
            this.onAddNotes.emit();
            this.isDisable = !this.isDisable;
            return false;
          } else this.utils.toast.error(res['message']);
          this.disbaleBtn();
          this.form.reset();
          this.form.disable();
        },
        (error) => {
          this.onError(error, ErrorMessages.employee.save_note);
        }
      );
    }

  }
  onSelectionChange(event) {
    this.initForm(event.selectedRows[0]?.dataItem);
  }
  NoteList(id) {
    this.id = id;
    this.service.GetNoteList(id).subscribe(
      (res) => {
        if (res) {
           this.selections =[0]
           this.data = orderBy(res, this.defaultSort);
           this.note = res;
           this.initForm(this.data[0]);
        } else {
          this.data = [];
          this.initForm({});
          this.note = this.data;
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.employee.get_note_list);
      }
    );
  }
  onHanleOperation(type) {
    switch (type) {
      case 'new':
        this.onAddNotes.emit();
        this.isEdit = true;
        this.isDisable = !this.isDisable;
        this.action = 'new';
        this.initForm({});
        break;
      case 'save':
        this.onSave();
        break;
      case 'cancel':
        this.isDisable = !this.isDisable;
        this.selections = [0]
        this.isEdit = false
        this.initForm(this.data[this.selections[0]]);
        this.onAddNotes.emit();
        break;
      default:
        break;
    }
  }
  disbaleBtn() {
    this.isSave = true;
    this.isCancel = true;
  }

  public onFilter(inputValue: string): void {
    this.data = process(this.note, {
      filter: {
        logic: 'or',
        filters: [
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
          {
            field: 'subject',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'notetext',
            operator: 'contains',
            value: inputValue,
          },
        ],
      },
    }).data;

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
  }

  private onError(error: any, customMessage?: string) {
    this.errorHandler.handleError(
      error,
      ModuleNames.employee_notes,
      customMessage
    );
  }
}
