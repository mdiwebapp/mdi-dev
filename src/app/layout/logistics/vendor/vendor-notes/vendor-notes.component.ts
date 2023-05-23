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
import { VendorNotesModel } from './vendor-notes.model';
import { VendorNotesService } from './vendor-notes.service';
import { ModuleNames, ErrorMessages } from 'src/app/core/constant';
import { ErrorHandlerService } from 'src/app/core/services';
@Component({
  selector: 'app-vendor-notes',
  templateUrl: './vendor-notes.component.html',
  styleUrls: ['./vendor-notes.component.scss'],
})
export class VendorNotesComponent implements OnInit {
  @ViewChild(DataBindingDirective) dataBinding: DataBindingDirective;
  @Output() SaveEditClick = new EventEmitter<number>();
  @Input() onChange;
  SaveChange: BehaviorSubject<any> = new BehaviorSubject(null);
  @Output() dialogOpened: boolean = false;
  @Output() errorMsg: any;
  form: FormGroup;
  id: number = 0;
  data: any;
  vendorId: any;
  skip: number;
  isAdd: boolean = false;
  isAddRight: boolean = false;
  public mySelection: number[] = [0];
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
  vendor: VendorNotesModel;
  isSave: boolean = true;
  isCancel: boolean = true;
  isEdit: boolean = true;
  loader: boolean;
  note: any[];

  constructor(
    private formBuilder: FormBuilder,
    public service: VendorNotesService,
    private utils: UtilityService,
    public errorHandler: ErrorHandlerService
  ) {
    const rights = JSON.parse(localStorage.getItem('Rights'));
    if (rights) {
      var pageModuleRights = rights.filter(
        (x) => x.subModuleName == 'Notes' && x.moduleName == 'Vendor'
      );
      this.isAddRight = pageModuleRights.find(
        (x) => x.tabName.toLowerCase() == 'add'
      );
    } else {
      this.isAddRight = true;
    }
  }

  ngOnInit(): void {
    this.initForm();
    // this.onChange.subscribe(res => {
    //   if (res) {
    //     this.vendorId = res.id;
    //     this.NoteList();
    //   }
    // });

    this.form.disable();
  }

  initForm(): void {
    this.form = this.formBuilder.group({
      subject: [null, Validators.required],
      note: [null],
    });
  }
  onEdit(res) {
    if (res) {
      this.isCancel = true;
      this.isAdd = false;
      this.isSave = true;
      this.vendorId = res.id;this.form.reset();
      this.NoteList();
    }
  }
  onSave() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return true;
    }
    const data = this.form.value;
    data.id = this.id;
    data.vendorId = this.vendorId;
    data.userName = JSON.parse(localStorage.getItem('currentUser')).userName;
    this.service.saveNote(data).subscribe(
      (res) => {
        if (res['status'] == 200) {
          this.utils.toast.success(res['message']);
          this.NoteList();
        } else this.utils.toast.error(res['message']);
        this.disbaleBtn();
        this.form.reset();
        this.form.disable();
        this.id = 0;
      },
      (error) => {
        this.onError(error, ErrorMessages.vendor.save_note);
      }
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
        this.onError(error, ErrorMessages.vendor.get_note_by_id);
      }
    );
  }

  NoteList() {
    this.service.GetNoteList(this.vendorId).subscribe(
      (res) => {
        if (res) {
          this.data = res;
          this.note = res;debugger
          if (this.data.length > 0)
            this.editClick(this.data[0]);this.mySelection=[0];
        } else {
          this.data = [];
          this.note = [];
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.vendor.get_note_list);
      }
    );
  }

  setValue(data: VendorNotesModel) {
    this.form.setValue({
      subject: data.subject,
      note: data.note,
    });
  }

  btnCancel() {
    this.form.reset();
    this.form.disable();
    this.disbaleBtn();
    this.editClick(this.data.find(c => c.id == this.id));
  }

  btnAdd() {
    this.enableBtn();this.form.reset();
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
    this.setValue(this.data[0]); this.mySelection=[0];
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
  editClick(data) {
    this.id = data.id;
    this.setValue(data);
    if (this.id > 0)
      this.isEdit = false;
    else this.isEdit = true;
    this.isAdd = false;
    this.isSave = true;
    this.isCancel = true;
  }
  private onError(error: any, customMessage?: string) {
    this.errorHandler.handleError(
      error,
      ModuleNames.vendor_notes,
      customMessage
    );
  }
}
