import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TreeviewSearchService {
  expandedKeys: string[];
  lstItems: any = [];
  constructor() { }
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
      } 
      else if (item.subDirectories && item.subDirectories.length > 0) {
        const newItems = this.search(item.subDirectories, term);
        if (newItems.length > 0) {
          acc.push(
            {
              id: item.id,
              name: item.name,
              parent: 0,
              subDirectories: newItems,
              fileType: item.fileType,
              filePath: item.filePath,
            }
          );
          if (!this.expandedKeys) {
            this.expandedKeys = [];
          }
          this.expandedKeys.push(item.name);
        }else{
          const newItemsFiles = this.search(item.subDirectories[0].files, term);
          if (newItemsFiles.length > 0) {
            acc.push(
              {
                id: item.id,
                name: item.name,
                parent: 0,
                subDirectories: newItemsFiles,
                fileType: item.fileType,
                filePath: item.filePath,
              }
            );
            if (!this.expandedKeys) {
              this.expandedKeys = [];
            }
            this.expandedKeys.push(item.name);
          }
        }
      }      
      else if (item.files && item.files.length > 0) {
        const newItems = this.search(item.files, term);
        if (newItems.length > 0) {
           
          //acc.push({ name: item.name, items: newItems });
          acc.push({
            id: item.id,
            name: item.name,
            parent: 0,
            files: newItems,
            fileType: item.fileType,
            filePath: item.filePath,
          });
          if (!this.expandedKeys) {
            this.expandedKeys = [];
          }
          this.expandedKeys.push(item.name);
        }
      }
      return acc;
    }, []);
    return datas;
  }

}
