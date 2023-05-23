import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { orderBy, process, SortDescriptor } from '@progress/kendo-data-query';
import { ViewColumns, ProjectNotesData, Sort, } from '../../../../../data/service-order-notes-data';
import { ErrorHandlerService } from 'src/app/core/services';
import { ModuleNames, ErrorMessages } from 'src/app/core/constant';
import { UtilityService } from 'src/app/core/services/utility.service';
import { ServiceOrderService } from '../service-order/service-order.service';
import { PageChangeEvent } from '@progress/kendo-angular-grid';

@Component({
  selector: 'app-service-order-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss'],
})
export class ServiceOrderNotesComponent implements OnInit {
  form: FormGroup;
  public viewColumns: any;
  public projectNotesData: any;
  id: number = 0;
  data: any;
  vendorId: any;
  invNo: any;
  skip: number;
  isAdd: boolean = false;
  isSave: boolean = true;
  isCancel: boolean = true;
  isEdit: boolean = true;
  loader: boolean;
  note: any[];
  public sort: SortDescriptor[] = [
    {
      field: 'subject',
      dir: 'asc',
    },
    {
      field: 'noteDate',
      dir: 'asc',
    },
    {
      field: 'note',
      dir: 'asc',
    },
    {
      field: 'createdBy',
      dir: 'asc',
    }
  ];
  public mySelection: number[] = [0];

  constructor(private formBuilder: FormBuilder, public service: ServiceOrderService,
    private utils: UtilityService,
    public errorHandler: ErrorHandlerService) { }

  ngOnInit(): void {
    // this.viewColumns = ViewColumns;
    // this.projectNotesData = ProjectNotesData;

    this.initForm(); this.form.disable();
  }

  initForm(): void {
    this.form = this.formBuilder.group({
      subject: [null, Validators.required],
      note: [null],
    });
  }

  onEdit(res, invNo) {
    this.form.reset();
    if (res) {
      this.isCancel = true;
      this.isAdd = false;
      this.isSave = true;
      this.vendorId = res;
      this.invNo = invNo;
      this.NoteList();
    }
  }
  onSave() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return false;
    }
    const data = this.form.value;
    data.id = this.id;
    data.serviceHeaderId = this.vendorId;
    data.userName = JSON.parse(localStorage.getItem('currentUser')).userName;
    data.user_PK = JSON.parse(localStorage.getItem('currentUser')).id;
    data.inventoryNumber = this.invNo;
    data.reportedBy = JSON.parse(localStorage.getItem('currentUser')).userName;

    this.service.SaveNotes(data).subscribe(
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

  editNoteClick(data) {
    this.id = data.id;
    // this.service.GetNoteById(id).subscribe(
    //   (res) => {
    //     if (res) {
    this.setValue(data);
    //       this.isEdit = false;
    //       this.isAdd = false;
    //     }
    //   },
    //   (error) => this.onError(error, ErrorMessages.components.get_note_by_id)
    // );
  }

  NoteList() {
    this.service.GetNotesList(this.vendorId).subscribe(
      (res) => {
        if (res) {
          this.data = res;
          this.note = res; 
          debugger;
          this.mySelection = [0];
          this.setValue(this.data[0]);
        } else {
          this.data = [];
          this.note = [];
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
    this.form.reset();
    this.form.disable();
    this.disbaleBtn();
    this.editNoteClick(this.data.find(c => c.id == this.id));
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
