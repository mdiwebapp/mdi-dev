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
import { PurchasingNotesModel } from './purchasing-notes.model';
import { PurchasingService } from '../purchasing.service';
import { ModuleNames, ErrorMessages } from 'src/app/core/constant';
import { ErrorHandlerService } from 'src/app/core/services';

@Component({
  selector: 'app-purchasing-notes',
  templateUrl: './purchasing-notes.component.html',
  styleUrls: ['./purchasing-notes.component.scss'],
})
export class PurchasingNotesComponent implements OnInit {
  @ViewChild(DataBindingDirective) dataBinding: DataBindingDirective;
  @Output() SaveEditClick = new EventEmitter<number>();
  @Input() onChange;
  SaveChange: BehaviorSubject<any> = new BehaviorSubject(null);

  form: FormGroup;
  id: number = 0;
  poNumber: string;
  data: any;
  dataFleet: any = [];
  vehicleId: any;
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
  vehicle: PurchasingNotesModel;
  isSave: boolean = true;
  isCancel: boolean = true;
  isEdit: boolean = true;
  loader: boolean;
  note: any[];
  @Output() dialogOpened: boolean = false;
  @Output() errorMsg: any;
  isAddRight: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    public service: PurchasingService,
    private utils: UtilityService,
    public errorHandler: ErrorHandlerService
  ) {
    const rights = JSON.parse(localStorage.getItem('Rights'));
    if (rights) {
    var pageModuleRights = rights.filter(
      (x) => x.subModuleName == 'Notes' && x.moduleName == 'Maintain POR'
    );
    this.isAddRight = pageModuleRights.find(
      (x) => x.tabName.toLowerCase() == 'add'
    );}else{
      this.isAddRight =true;
    }
  }
  public mySelection: number[] = [0];
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
      this.vehicleId = res.id;
      this.form.reset();
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
    data.poNumber = this.poNumber;
    data.userName = JSON.parse(localStorage.getItem('currentUser')).userName;
    this.service.saveNote(data).subscribe(
      (res) => {
        if (res['status'] == 200) {
          this.utils.toast.success(res['message']);
          this.NoteList();
          this.form.reset();
          this.form.disable();
        } else this.utils.toast.error(res['message']);
        this.disbaleBtn();
        this.id = 0;
      },
      (error) => {
        this.onError(error, ErrorMessages.fleet.save_note);
      }
    );
  }

  editNoteClick(PONumber) {
    this.poNumber = PONumber;
    this.NoteList();
  }

  getNoteDetails(data) {
    this.id = data.id;
    this.setValue(data);
    // this.service.GetNotesById(id).subscribe(
    //   (res) => {
    //     if (res) {
    //       this.setValue(res);
    //       console.log('data', this.dataFleet);
    //     }
    //   },
    //   (error) => {
    //     this.onError(error, ErrorMessages.fleet.get_note_by_id);
    //   }
    // );
  }

  NoteList() {
    this.service.GetNotesListByPONumber(this.poNumber).subscribe(
      (res) => {
        if (res) {
          this.data = res;
          this.note = res;
          this.mySelection = [0];
          this.getNoteDetails(this.data[0]);
        } else {
          this.data = [];
          this.note = [];
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.vehicle.get_note_list);
      }
    );
  }

  setValue(data: PurchasingNotesModel) {
    this.form.setValue({
      subject: data.subject,
      note: data.note,
    });
  }

  btnCancel() {
    this.form.reset();
    this.form.disable();
    this.disbaleBtn();
    this.getNoteDetails(this.data.find(c => c.id == this.id));
  }

  btnAdd() {
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
    this.errorHandler.handleError(
      error,
      ModuleNames.vehicle_notes,
      customMessage
    );
  }
}
