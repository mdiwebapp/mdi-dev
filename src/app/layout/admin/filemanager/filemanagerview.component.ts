import { Component, OnInit, ViewChild } from '@angular/core';
import { FilemanagerService } from './filemanager.service';
import { ContextMenuComponent } from '@progress/kendo-angular-menu';
import { process } from '@progress/kendo-data-query';
import { BehaviorSubject } from 'rxjs';
// import fileJson from "../../../../assets/response_1640264921173.json";

const is = (fileName: string, ext: string) =>
  new RegExp(`.${ext}\$`).test(fileName);

@Component({
  selector: 'app-filemanagerview',
  templateUrl: './filemanagerview.component.html',
  styleUrls: ['./filemanagerview.component.scss'],
})
export class FilemanagerviewComponent implements OnInit {
  @ViewChild('treemenu')
  public treeContextMenu: ContextMenuComponent;
  viewer = 'google';
  DemoDoc =
    'http://Y://02 Operations//JOB BOOKS//20919//13 - SAFETY//JSA Home Depot 1-2-18.pdf'; //"http://www.africau.edu/images/default/sample.pdf";
  data: any;
  constructor(public service: FilemanagerService) {}
  SaveChange: BehaviorSubject<any> = new BehaviorSubject(null);
  public expandedKeys: any[] = ['All Files'];

  public items: any[] = [
    { text: 'Open Location', icon: 'folder-open' },
    { text: 'Preview', icon: 'eye' },
  ];
  //
  private contextItem: any;
  UserPhoto: any;
  lstItems: any = [];
  ngOnInit(): void {
    //this.loadItems();
    // var image =fileJson.files[0].fileContent;
    // this.lstItems =fileJson.directories;
    // this.UserPhoto= 'data:image/jpeg;base64,' + image;
  }
  private loadItems(): void {
    this.service.GetAllList().subscribe((res) => {
      this.data = [
        {
          id: 0,
          name: 'All Files',
          parent: 0,
          items: res,
          fileType: 'Directory',
          filePath: '',
        },
      ];
      this.lstItems = this.data;
    });
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
  public onNodeClick(e: any): void {
    if (e.type === 'contextmenu') {
      const originalEvent = e.originalEvent;
      originalEvent.preventDefault();
      this.contextItem = e.item.dataItem;
      this.treeContextMenu.show({
        left: originalEvent.pageX,
        top: originalEvent.pageY,
      });
    }
  }
  public handleFilter(value: string): void {
    this.data = this.search(this.data, value);
  }
  public contains(text: string, term: string): boolean {
    return text.toLowerCase().indexOf((term || '').toLowerCase()) >= 0;
  }
  public search(items: any[], term: string): any[] {
    if (term == '') {
      this.expandedKeys = ['All Files'];
      return this.lstItems;
    }
    const datas = items.reduce((acc, item) => {
      if (this.contains(item.name, term)) {
        acc.push(item);

        //this.expandedKeys.push(item.id);
      } else if (item.items && item.items.length > 0) {
        const newItems = this.search(item.items, term);
        if (newItems.length > 0) {
          //acc.push({ name: item.name, items: newItems });
          acc.push({
            id: item.id,
            name: item.name,
            parent: 0,
            items: newItems,
            fileType: item.fileType,
            filePath: item.filePath,
          });
          this.expandedKeys.push(item.name);
        }
      }
      return acc;
    }, []);
    // datas.forEach(element => {
    //   if (element.items != null) {
    //     let index = element.items.findIndex(x => x.items.length > 0);
    //     this.expandedKeys.push(index);
    //   }
    // });
    return datas;
  }
  isImage: boolean = false;
  public previewSelectedFile(data) {
    this.SaveChange.next(null);
    this.DemoDoc = '';
    this.isImage = true;
    let path = data;
    var ext = path.filePath.split('.').pop();

    if (ext != 'png' && ext != 'jpg') {
      this.DemoDoc = path.filePath;
      this.isImage = false;
    } else {
      this.DemoDoc = path.filePath;
      this.isImage = true;
    }
  }
  public previewFile(data) {
    if (data.item.text == 'Preview') {
      this.SaveChange.next(null);
      this.DemoDoc = '';
      this.isImage = true;
      let path = this.contextItem;
      var ext = path.filePath.split('.').pop();
      if (ext != 'png' && ext != 'jpg') {
        this.DemoDoc = path.filePath;
        this.isImage = false;
      } else {
        this.DemoDoc = path.filePath;
        this.isImage = true;
      }
    }
  }

  clickCount = 0;
  clickFile(data) {
    this.clickCount++;
    setTimeout(() => {
      if (this.clickCount === 1) {
        this.previewSelectedFile(data);
      } else if (this.clickCount === 2) {
        // double
        window.open(data.filePath, '_blank');
        //window.location.href = data.filePath;
      }
      this.clickCount = 0;
    }, 250);
  }
}
