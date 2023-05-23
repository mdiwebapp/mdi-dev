import { Component, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileRestrictions } from '@progress/kendo-angular-upload';
import { saveAs, encodeBase64 } from '@progress/kendo-file-saver';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { DropdownService } from '../../../core/services/dropdown.service';
import { UtilityService } from '../../../core/services/utility.service';
import { FilemanagerService } from './filemanager.service';
import {
  EditEvent,
  RemoveEvent,
  ExpandEvent,
} from '@progress/kendo-angular-treelist';
import { ErrorHandlerService } from '../../../core/services';
import { ErrorMessages, ModuleNames } from '../../../core/constant';

const is = (fileName: string, ext: string) =>
  new RegExp(`.${ext}\$`).test(fileName);
@Component({
  selector: 'app-filemanager',
  templateUrl: './filemanager.component.html',
  styleUrls: ['./filemanager.component.scss'],
})
export class FilemanagerComponent implements OnInit {
  form: FormGroup;
  data: any; /// = [{ id: 0, name: 'All', parent: 0, items: [] }];
  folderName: string = '';
  selectedKeys: any[] = ['0_0'];
  addFolder: boolean = false;
  myFiles: Array<File>;
  loader: any;
  keys: string[] = [];
  isEdit: boolean = false;
  deletedId: number = 0;
  selected: any;
  public opened = false;
  @Output() dialogOpened: boolean = false;
  @Output() errorMsg: any;

  myRestrictions: FileRestrictions = {
    allowedExtensions: [
      '.jpg',
      '.png',
      'jpeg',
      '.doc',
      '.docx',
      '.xls',
      '.xlsx',
      '.pdf',
      '.txt',
    ],
  };

  SaveChange: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(
    private formBuilder: FormBuilder,
    public service: FilemanagerService,
    public utils: UtilityService,
    public dropdownservice: DropdownService,
    public errorHandler: ErrorHandlerService
  ) {}
  initForm(): void {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      fileType: ['', Validators.required],
      userName: [''],
      parent: [0],
      size: [0],
    });
  }
  ngOnInit(): void {
    this.initForm();
    this.loadItems();
  }
  private loadItems(): void {
    //this.loader = true;
    this.service.GetAllList().subscribe(
      (res) => {
        this.data = [{ id: 0, name: 'All Files', parent: 0, items: res }];
        //this.loader = false;
      },
      (error) => this.onError(error, ErrorMessages.file_manager.get_all_list)
    );
  }

  public handleCollapse(selectedItm): void {
    if (selectedItm.items.length > 0 && this.selected != selectedItm) {
      this.selected = selectedItm;
      this.SaveChange.next(this.selected.id);
    }
  }
  btnAdd(): void {
    this.saveData();
  }
  showAddFolder(): void {
    if (this.selected) {
      this.addFolder = true;
    } else {
      this.utils.toast.error('Please select folder to add.');
    }
  }
  bindAddFolder(item): void {
    this.isEdit = true;
    this.addFolder = true;
    const data = this.form.value;
    data.id = item.id;
    data.name = item.name;
    data.parent = item.parent == null ? 0 : item.parent;
    this.folderName = item.name;
  }
  hideAddFolder(): void {
    this.addFolder = false;
    this.folderName = '';
  }
  clearModel(): void {
    this.myFiles = null;
  }
  saveData(): void {
    if (this.selected) {
      const data = this.form.value;
      data.name = this.folderName;
      data.fileType = 'Directory';
      data.size = 0;
      data.userName = '';
      if (this.isEdit == true) {
        data.parent = this.selected.parent;
      } else data.parent = this.selected.id;
      this.service.save(data).subscribe(
        (res) => {
          if (res['status'] == 200) this.utils.toast.success(res['message']);
          else this.utils.toast.error(res['message']);
          this.SaveChange.next(this.selected.id);
          this.form.reset();
          this.hideAddFolder();
          this.loadItems();
        },
        (error) => this.onError(error, ErrorMessages.file_manager.save)
      );
    } else {
      this.utils.toast.error('Please select folder to add.');
    }
  }

  uploadFiles(): void {
    const formData = new FormData();
    for (var i = 0; i < this.myFiles.length; i++) {
      formData.append('files', this.myFiles[i]);
    }
    this.service.uploadFiles(this.selected.id, formData).subscribe(
      (res) => {
        this.myFiles = null;
        this.utils.toast.success('File uploded successfully.');
        this.SaveChange.next(this.selected.id);
        this.loadItems();
      },
      (failed) => {
        this.onError(failed, ErrorMessages.file_manager.upload_files);
      }
    );
  }

  private expandedIds: number[] = [0];
  public isExpanded = (dataItem: any): boolean => {
    return this.expandedIds.indexOf(dataItem.id) > -1;
  };
  public onCollapse(args: ExpandEvent): void {
    this.expandedIds = this.expandedIds.filter((id) => id !== args.dataItem.id);
  }

  public onExpand(args: ExpandEvent): void {
    this.expandedIds.push(args.dataItem.id);
  }
  public editHandler({ sender, dataItem }: EditEvent): void {
    this.bindAddFolder(dataItem);
  }
  public removeHandler({ sender, dataItem, parent }: RemoveEvent): void {
    this.opened = true;
    this.deletedId = dataItem.id;
    ///this.deleteFolder(dataItem);
  }

  public iconClass({ name, items }: any): any {
    if (name.split('.').length > 1) {
      return {
        'k-i-file-pdf': is(name, 'pdf'),
        'k-i-file-txt': is(name, 'txt'),
        'k-i-file-xls': is(name, 'xlsx|xls'),
        'k-i-file-doc': is(name, 'docx|doc'),
        'k-i-image': is(name, 'jpg|png|jpeg'),
        //"k-i-html": is(name, "html"),
        'k-icon': true,
      };
    } else {
      return { 'k-i-folder': items.length !== undefined, 'k-icon': true };
    }
  }

  deleteFolder(id: number) {
    this.loadItems();
  }

  private onError(error: any, customMessage?: string) {
    this.errorHandler.handleError(
      error,
      ModuleNames.file_manager,
      customMessage
    );
  }
}
