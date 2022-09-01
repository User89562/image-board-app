import { Observable, map, of } from 'rxjs';
import { ApiService } from './api.service';
import { Injectable } from '@angular/core';
import { HydrusFile } from '../entities/hydrus-file';

@Injectable({
  providedIn: 'root'
})
export class FileService {


  constructor(private apiService: ApiService) { 
  }

  getThumbnailAndMetadata(fileIds: number[]): Observable<HydrusFile[]> {
    let files: HydrusFile[] = [];
    if (fileIds.length === 0) { return of([])}
    this.apiService.getFileMetadata(fileIds).subscribe({
      next: (metadata) => {
        fileIds.forEach(id => {
          let f = metadata.metadata.find(m => m.file_id === id) as HydrusFile;
          f.thumbnail_url = this.apiService.getThumbnailURLFromId(id);
          files.push(f);
        });
      }
    });
    return of(files);
  }
}
