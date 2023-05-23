import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { orderBy, process, SortDescriptor } from '@progress/kendo-data-query';
import { ProjectService } from '../projects.service';
import { ProjectNotesAddRequestModel } from './../projects.model';
import { UtilityService } from 'src/app/core/services/utility.service';
import { ErrorMessages } from 'src/app/core/constant';
import {
  DataBindingDirective,
  PageChangeEvent,
} from '@progress/kendo-angular-grid';
@Component({
  selector: 'app-projects-notes',
  templateUrl: './projects-notes.component.html',
  styleUrls: ['./projects-notes.component.scss'],
})
export class ProjectsNotesComponent implements OnInit {
  @ViewChild(DataBindingDirective) dataBinding: DataBindingDirective;
  form: FormGroup;
  jobNumber: number;
  subject: string;
  note: string;
  userName: string;
  currentUser: string = '';
  isAdd: boolean = false;
  isSave: boolean = false;
  isCancel: boolean = false;
  disabled: boolean;
  projectNotesAddRequestModel: ProjectNotesAddRequestModel;

  public mySelection: number[] = [0];

  public viewColumns = [
    {
      Name: 'createdDate',
      isCheck: true,
      Text: 'Created Date',
      isDisable: false,
      index: 0,
      width: 50,
    },
    {
      Name: 'userName',
      isCheck: true,
      Text: 'User Name',
      isDisable: false,
      index: 1,
      width: 50,
    },
    {
      Name: 'subject',
      isCheck: true,
      Text: 'Subject',
      isDisable: false,
      index: 2,
      width: 100,
    },
    {
      Name: 'note',
      isCheck: true,
      Text: 'Note',
      isDisable: false,
      index: 3,
      width: 100,
    },
  ];
  projectNotesData = [];
  id: number = 0;
  data: any;
  vendorId: any;
  skip: number;

  public sort: SortDescriptor[] = [

    {
      field: 'createdDate',
      dir: 'desc',
    },

  ];

  isEdit: boolean;
  loader: boolean;
  notes: any[];
  dropDownService: any;
  onError: any;

  constructor(
    private formBuilder: FormBuilder,
    public projectService: ProjectService,
    private utils: UtilityService
  ) {
    const rights = JSON.parse(localStorage.getItem('Rights'));
    if (rights) {
      var pageModuleRights = rights.filter(
        (x) => x.subModuleName == 'Notes' && x.moduleName == 'Maintain Projects'
      );
      this.isAdd = pageModuleRights.find(
        (x) => x.tabName.toLowerCase() == 'add'
      );
    } else {
      this.isAdd = true;
    }
  }

  ngOnInit(): void {
    this.initForm();
    //this.isAdd = true;
    //this.disableEnableButtons();
    this.projectNotesAddRequestModel = new ProjectNotesAddRequestModel();
    var usr = JSON.parse(localStorage.getItem('currentUser'));
    if (usr != null) {
      this.currentUser = usr.userName;
    }
    console.log(usr);
  }

  initForm(): void {
    this.form = this.formBuilder.group({
      subject: ['', Validators.required],
      note: ['', Validators.required],
    });
  }
  //#region get Notes Details
  selectedRow(event) {
    console.log(event);
  }
  getNotesDetail(data) {
    this.id = data.id;
    this.setValue(data);
  }
  setValue(data) {
    this.form.setValue({
      subject: data.subject,
      note: data.note,
    });
  }

  getNotesDetailsByJobNumber(data) {
    this.jobNumber = data;
    this.projectNotesData = [];
    this.projectService.GetProjectNotesList(this.jobNumber).subscribe((res) => {
      if (res) {
        //this.projectNotesData = res;
        this.notes = res;
        this.data = {
          data: orderBy(this.notes, this.sort),
          total: this.notes.length,
        };
        this.projectNotesData = this.data.data;

        if (this.projectNotesData.length > 0) {
          this.id = this.projectNotesData[0].id;
          this.getNotesDetail(this.projectNotesData[0]);this.mySelection=[0];
        }
      } else {
        this.data = [];
        this.notes = [];
        this.projectNotesData = [];
        this.initForm();
      }
    });
  }

  //#endregion

  //#region onAdd

  createNotesModel() {
    this.projectNotesAddRequestModel = new ProjectNotesAddRequestModel();
    this.projectNotesAddRequestModel.JobNumber = this.jobNumber;
    this.projectNotesAddRequestModel.Subject = this.subject;
    this.projectNotesAddRequestModel.Note = this.note;
    this.projectNotesAddRequestModel.userName = this.currentUser;
  }
  //#endregion

  //#region
  onAddClick() {
    this.isAdd = false;
    this.form.reset();
    this.disableEnableButtons();
  }
  onSave() {    
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return true;
    }
    this.isAdd = true;
    this.disableEnableButtons();
    const data = this.form.value;
    data.jobNumber = this.jobNumber;
    data.userName = JSON.parse(localStorage.getItem('currentUser')).userName;
    this.projectService.addNotes(data).subscribe((res) => {
      if (res['status'] == 200) {
        this.utils.toast.success(res.message);
        this.form.reset();
        this.getNotesDetailsByJobNumber(this.jobNumber);
      } else {
        this.utils.toast.error(res.message);
      }
    });
  }
  onCancelClick() {
    this.isAdd = true;
    this.disableEnableButtons();
    if (this.id)
      this.getNotesDetail(this.projectNotesData.find(c => c.id == this.id));
    //this.mySelection = [0];
  }
  //#endregion

  //#region disableEnable Buttons
  disableEnableButtons() {
    if (this.isAdd) {
      this.isSave = false;
      this.isCancel = false;
      this.disabled = true;
    } else if (!this.isAdd) {
      this.isSave = true;
      this.isCancel = true;
      this.disabled = false;
    }
  }
  //#endregion

  //#region Search notes record
  public onFilter(inputValue: string): void {
    this.data = process(this.notes, {
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
    this.projectNotesData = this.data;
    this.setValue(this.projectNotesData[0]); this.mySelection=[0];
  }
  //#endregion

  //#region sorting
  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.data = {
      data: orderBy(this.notes, this.sort),
      total: this.notes.length,
    };
    this.projectNotesData = this.data.data;
    if (this.projectNotesData.length > 0)
      this.getNotesDetail(this.projectNotesData[0].id);
  }

  resetData() {
    this.form.reset();
    this.data = [];
    this.notes = [];
    this.projectNotesData = [];
  }
  //#endregion
}
