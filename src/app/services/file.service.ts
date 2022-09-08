import { Observable, map, of, tap, switchMap } from "rxjs";
import { ApiService } from "./api.service";
import { Injectable } from "@angular/core";
import { HydrusFile } from "../entities/hydrus-file";

@Injectable({
  providedIn: "root",
})
export class FileService {
  constructor(private apiService: ApiService) {}

  getFileWithMetadataFromSearch(
    tags: string[],
    sortType: string,
    sortDir: string
  ): Observable<HydrusFile[]> {
    return this.apiService
      .getFilesSearch(tags, sortType, sortDir)
      .pipe(switchMap((f) => this.getThumbnailAndMetadata(f.file_ids)));
  }

  getThumbnailAndMetadata(fileIds: number[]): Observable<HydrusFile[]> {
    if (fileIds.length === 0) {
      return of([]);
    }
    return this.apiService.getFileMetadata(fileIds).pipe(
      map((m) =>
        m.metadata.map((i) => ({
          ...i,
          thumbnail_url: this.apiService.getThumbnailURLFromHash(i.hash),
          file_url: this.apiService.getFileURLFromHash(i.hash),
        }))
      )
    );
    /*
    this.apiService.getFileMetadata(fileIds).subscribe({
      next: (metadata) => {
        fileIds.forEach(id => {
          let f = metadata.metadata.find(m => m.file_id === id) as HydrusFile;
          f.thumbnail_url = this.apiService.getThumbnailURLFromId(id);
          files.push(f);
        });
      }
    });
    return of(files);*/
  }
}
