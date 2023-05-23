import { Component, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilityService } from 'src/app/core/services/utility.service';
import { PageChangeEvent } from '@progress/kendo-angular-grid';
import { orderBy, process, SortDescriptor } from '@progress/kendo-data-query';
import { DevicesService } from '../devices/devices.service';
import { ModuleNames, ErrorMessages } from 'src/app/core/constant';
import { ErrorHandlerService } from 'src/app/core/services';

@Component({
  selector: 'app-devices-notes',
  templateUrl: './devices-notes.component.html',
  styleUrls: ['./devices-notes.component.scss'],
})
export class DevicesNotesComponent implements OnInit {
  form: FormGroup;
  id: number = 0;
  data: any;
  deviceId: any;
  skip: number;
  isAdd: boolean = false;
  isdisable:boolean=true;
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
  vendor: any;
  isSave: boolean = true;
  isCancel: boolean = true;
  isEdit: boolean = true;
  loader: boolean;
  note: any[];
  @Output() dialogOpened: boolean = false;
  @Output() errorMsg: any;
  constructor(
    private formBuilder: FormBuilder,
    public service: DevicesService,
    private utils: UtilityService,
    public errorHandler: ErrorHandlerService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.mySelection=[0]
  }

  initForm(): void {
    this.form = this.formBuilder.group({
      subject: [null, Validators.required],
      note: [null],
    });
  }
  onEdit(res) {
    if (res) {
      this.deviceId = res.id;
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
    data.deviceId = this.deviceId;
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
        this.onError(error, ErrorMessages.devices.save_note);
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
        this.onError(error, ErrorMessages.devices.get_note_by_id);
      }
    );
  }

  NoteList() {
    this.service.GetNoteList(this.deviceId).subscribe(
      (res) => {
        if (res) {
         
          this.data = res;
          this.note = res;     
          this.mySelection = [0];
          this.getNoteDetails(this.data[0]);    
        } else {
          this.data = [];
          this.note = [];
          this.form.setValue({
            subject: '',
            note: '',
          });
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.devices.get_note_list);
      }
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
    this.getNoteDetails(this.data[this.mySelection[0]]);  
  }

  btnAdd() {
    this.isdisable=false
    this.enableBtn();
    this.form.enable();
    this.form.reset();
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
    this.mySelection=[0]
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
      dir: "asc"
    };
    this.data = this.data.data;
  }

  private onError(error: any, customMessage?: string) {
    this.errorHandler.handleError(
      error,
      ModuleNames.devices_notes,
      customMessage
    );
  }
  getNoteDetails(data) {
    // this.service.GetNoteById(id).subscribe(
    //   (res) => {
    //     if (res) {
           this.setValue(data);
    //     }
    //     else {
    //       this.setValue('');
    //     }
    //   },
    //   (error) => {
    //     this.onError(error, ErrorMessages.fleet.get_note_by_id);
    //   }
    // );
  }
}
