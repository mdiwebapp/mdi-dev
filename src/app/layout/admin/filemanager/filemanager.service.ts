import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CacheService } from 'src/app/core/services/cache.service';
import { BaseApiService } from '../../../core/services/base-api.service';
import { DataService } from '../../../core/services/data.service';
import { FileManagerModel } from './filemanager.model';

@Injectable({
  providedIn: 'root'
})
export class FilemanagerService extends BaseApiService<FileManagerModel> {

  constructor(protected dataService: DataService, protected cache: CacheService) {
    super('fileManager', dataService, cache);
  }
  GetList(fileType: string, parentId: number): Observable<any> {
    return this.dataService.get<any>(`FileManager/${parentId}`);
  }
  GetAllList(): Observable<any> {
    return this.dataService.get<any>(`FileManager/GetStaticFolderData`);
  }
  deleteFiles(selectedFiles): Observable<any> {
    return this.dataService.post<any>(`FileManager/DeleteFileManager/`, selectedFiles);
  }
  uploadFiles(id, selectedFiles): Observable<any> {

    return this.dataService.post<any>(`FileManager/UploadDocuments/${id}`, selectedFiles);
  }
}
