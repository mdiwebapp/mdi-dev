import { Component, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilityService } from 'src/app/core/services/utility.service';
import { PageChangeEvent } from '@progress/kendo-angular-grid';
import { orderBy, process, SortDescriptor } from '@progress/kendo-data-query';
import { ComponentsService } from '../components/components.service';
import { ErrorHandlerService } from 'src/app/core/services';
import { ModuleNames, ErrorMessages } from 'src/app/core/constant';

@Component({
  selector: 'app-components-notes',
  templateUrl: './components-notes.component.html',
  styleUrls: ['./components-notes.component.scss'],
})
export class ComponentsNotesComponent implements OnInit {
  form: FormGroup;
  id: number = 0;
  data: any;
  vendorId: any;
  skip: number;
  isAdd: boolean = false;
  isAddRight: boolean = true;
  public sort: SortDescriptor[] = [
    {
      field: 'id',
      dir: 'desc',
    },
    
  ];
  vendor: any;
  isSave: boolean = true;
  isCancel: boolean = true;
  isEdit: boolean = true;
  loader: boolean;
  note: any[];
  @Output() dialogOpened: boolean = false;
  @Output() errorMsg: any;
  public mySelection: number[] = [0];
  

  constructor(
    private formBuilder: FormBuilder,
    public service: ComponentsService,
    private utils: UtilityService,
    public errorHandler: ErrorHandlerService
  ) {
    if (localStorage.getItem('isAdmin') == 'true') {
    } else {
      const rights = JSON.parse(localStorage.getItem('Rights'));
      this.isAddRight = rights.some(
        (c) =>
          c.subModuleName == 'Notes' &&
          c.moduleName == 'Maintain Components' &&
          c.tabName == 'ADD'
      );
    }
  }

  ngOnInit(): void {
    this.initForm();
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
      this.vendorId = res;
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
    data.invNumber = this.vendorId;
    data.userName = JSON.parse(localStorage.getItem('currentUser')).userName;
    data.user_PK = JSON.parse(localStorage.getItem('currentUser')).id;
     
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
      (error) => this.onError(error, ErrorMessages.components.save_note)
    );
  }

  editNoteClick(id) {
    this.id = id;
    // this.service.GetNoteById(id).subscribe(
    //   (res) => {
    //     if (res) {
    this.setValue(id);
    //       this.isEdit = false;
    //       this.isAdd = false;
    //     }
    //   },
    //   (error) => this.onError(error, ErrorMessages.components.get_note_by_id)
    // );
  }

  NoteList() {  
    this.service.GetNoteList(this.vendorId).subscribe(
      (res) => {
        if (res) {this.data=[];
          this.data = orderBy(res, this.sort);
          this.note = this.data; 
          if(res.length > 0) {
          this.mySelection = [0];
          this.setValue(this.data[0]);
          }
          else {
            this.data = [];
            this.note = [];
            this.mySelection = [0];
            this.form.reset();
          }
        } else {
          this.data = [];
          this.note = [];
          this.mySelection = [0];
          this.form.reset();
        }
      },
      (error) => this.onError(error, ErrorMessages.components.get_note_list)
    );
  }

  setValue(data: any) {
    this.form.setValue({
      subject: data.subject,
      note: data.note,
    });
  }

  btnCancel() {
    this.setValue(this.data[0]);
    this.form.disable();
    this.disbaleBtn();
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
            field: 'noteDate',
            operator: 'contains',
            value: inputValue,
          },
          {
            field: 'createdBy',
            operator: 'contains',
            value: inputValue,
          },
        ],
      },
    }).data;

    //this.dataBinding.skip = 0;
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
    this.errorHandler.handleError(
      error,
      ModuleNames.components_notes,
      customMessage
    );
  }
}
