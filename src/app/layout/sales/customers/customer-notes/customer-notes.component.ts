import { Component, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerNotesService } from './customer-notes.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { orderBy, process, SortDescriptor } from '@progress/kendo-data-query';
import { ModuleNames, ErrorMessages } from 'src/app/core/constant';
import { ErrorHandlerService } from 'src/app/core/services';

@Component({
  selector: 'app-customer-notes',
  templateUrl: './customer-notes.component.html',
  styleUrls: ['./customer-notes.component.scss'],
})
export class CustomerNotesComponent implements OnInit {
  @Input() onChange;
  data: any = [];
  skip: number;
  form: FormGroup;
  id: number = 0;
  isSave: boolean = true;
  isCancel: boolean = true;
  note: any;
  customerId: any;
  isAdd: boolean;
  public sort: SortDescriptor[] = [
    {
      field: 'subject',
      dir: 'asc',
    },
  ];
  noteFilter: any;
  mySelection: number[] = [0];
  @Output() dialogOpened: boolean = false;
  @Output() errorMsg: any;
  constructor(
    private formBuilder: FormBuilder,
    public service: CustomerNotesService,
    private utils: UtilityService,
    public errorHandler: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.onChange.subscribe((res) => {
      if (res) {
        this.customerId = res.id;
        this.data = res.notes;
        this.note = res.notes;
        this.noteFilter = res.notes;
      }
      //this.editClick(res);}
    });
    this.form.disable();
  }
  initForm(): void {
    this.form = this.formBuilder.group({
      subject: [null, Validators.required],
      note: [null],
    });
  }
  editClick(data: any) {
    if (data) {
      // this.form.disable();
      // this.id = data.id;
      // this.isEdit = false;
      // this.isAdd = false;
      // this.isSave = true;
      // this.isCancel = true;
      this.setValue(data);
    }
  }
  setValue(data: any) {}
  btnCancel() {
    this.form.reset();
    this.isAdd = false;
  }
  enableBtn() {
    this.isSave = false;
    this.isCancel = false;
  }
  btnAdd() {
    this.enableBtn();
    this.form.enable();
  }

  btnEdit() {
    this.form.enable();
    this.enableBtn();
    this.isAdd = true;
  }
  onSave() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return true;
    }
    const data = this.form.value;
    data.customerId = this.customerId;
    this.service.saveNote(data).subscribe(
      (res) => {
        if (res['status'] == 200) {
          this.utils.toast.success(res['message']);
          this.NoteList();
        } else this.utils.toast.error(res['message']);
        //this.disbaleBtn();
        this.form.reset();
        this.form.disable();
        this.id = 0;
      },
      (error) => {
        this.onError(error, ErrorMessages.customer.save_note);
      }
    );
  }

  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.data = {
      data: orderBy(this.note, this.sort),
      total: this.note.length,
    };
    this.data = this.data.data;
    //this.loadProducts();
  }

  NoteList() {
    this.service.GetNoteList(this.customerId).subscribe(
      (res) => {
        if (res) {
          this.data = res;
          this.note = res;
          this.noteFilter = res;
        } else {
          this.data = [];
          this.note = this.data;
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.customer.get_note_list);
      }
    );
  }
  public onFilter(inputValue: string): void {
    this.data = process(this.noteFilter, {
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
        ],
      },
    }).data;
    this.mySelection = [0];
    this.note = this.data;
    ///this.dataBinding.skip = 0;
  }

  private onError(error: any, customMessage?: string) {
    this.errorHandler.handleError(
      error,
      ModuleNames.customer_notes,
      customMessage
    );
  }
}
