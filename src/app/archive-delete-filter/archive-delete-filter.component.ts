import { forkJoin, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { HydrusFile } from '../entities/hydrus-file';
import { ApiService } from '../services/api.service';
import { FileService } from '../services/file.service';

@Component({
  selector: 'app-archive-delete-filter',
  templateUrl: './archive-delete-filter.component.html',
  styleUrls: ['./archive-delete-filter.component.scss']
})
export class ArchiveDeleteFilterComponent implements OnInit, OnDestroy {
  hydrusFiles: HydrusFile[];
  filesToArchive: HydrusFile[];
  filesToDelete: HydrusFile[];
  filesSkipped: HydrusFile[];
  searchTags!: string[];
  sortType!: number;
  sortDir: boolean = true;
  searchParams!: URLSearchParams;
  subscriptions: Subscription[];
  loading = true;

  constructor(private router: Router, titleService: Title, private apiService: ApiService, private fileService: FileService,) {
    titleService.setTitle('Archive/Delete | ' + environment.app_name);
    this.hydrusFiles = [];
    this.filesSkipped = [];
    this.filesToArchive = [];
    this.filesToDelete = [];
    this.subscriptions = [];

    if (this.router.getCurrentNavigation()?.extras.state) {
      this.hydrusFiles = this.router.getCurrentNavigation()?.extras.state?.["files"];
      this.searchTags = this.router.getCurrentNavigation()?.extras.state?.["tags"];
      if (this.router.getCurrentNavigation()?.extras.state?.["sortDir"] === 'false') {
        this.sortDir = false;
      }
      this.sortType = this.router.getCurrentNavigation()?.extras.state?.["sortType"];
      this.setSearchParams();
      this.saveSearchParams();
      this.loading = false;
    }
    
    this.subscriptions.push(
      this.router.events.subscribe((e: any) => {
        if (e instanceof NavigationEnd) {
          if (e.url.includes("?")) {
            this.searchParams = new URLSearchParams(
              e.url.slice(e.url.indexOf("?"))
            );
            this.saveSearchParams();
            let tempSplit =this.searchParams.get('tags')?.split(',');
            if (tempSplit) {
              this.searchTags = tempSplit;
            }

            let s =this.searchParams.get("sortType");
            if (s) {
              this.sortType = +s;
            }
           
            if (this.searchParams.get('sortDir') === 'false') {
              this.sortDir = false;
            }
          }
        }
      })
    );
   }
  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  ngOnInit(): void {
    if (this.hydrusFiles.length === 0 ){
      this.searchFiles();
    }    
  }

  selectFile(file: HydrusFile): void {
    if (this.filesToArchive.includes(file)) {
      this.filesToArchive.splice(this.filesToArchive.indexOf(file), 1);
    } else {
      this.filesToArchive.push(file);
    }
  }

  searchFiles(): void {
    this.loading = true;
    this.hydrusFiles = [];
    this.subscriptions.push(
      this.apiService.getFilesSearch(this.searchTags, this.sortType.toString(), this.sortDir.toString()).subscribe({
        next: (searchResult) => {
          this.fileService.getThumbnailAndMetadata(searchResult.file_ids).subscribe({
            next: (files)=> {
              this.hydrusFiles = files;
              this.loading = false;
            }
          })          
        }
      })
    );
    this.setSearchParams();
    this.saveSearchParams();
  }

  isFileSelected(file: HydrusFile): boolean {
    if (this.filesToArchive.includes(file)) {
      return true;
    }
    return false;
  }

  
  setSearchParams(): void {
    let searchUrl = `?tags=${this.searchTags.flat()}&sortType=${
      this.sortType
    }&sortDir=${this.sortDir}`;
    this.searchParams = new URLSearchParams(searchUrl);
  }

  saveSearchParams(): void {
    var newRelativePathQuery =
      window.location.pathname + "?" + this.searchParams.toString();
    history.pushState(null, "", newRelativePathQuery);
  }

  updateFiles(): void {
    //some files were skipped
    if (this.filesSkipped) {
      //remove files that were skipped
      let filesToUpdate = this.hydrusFiles.filter(files => !this.filesSkipped.map(s => s.file_id).includes(files.file_id));
      //filter any files not makred to be archived from remaining files
      this.filesToDelete = filesToUpdate.filter(files => !this.filesToArchive.map(a => a.file_id).includes(files.file_id));
    } else { // no files were skipped
      this.filesToDelete = this.hydrusFiles.filter(files => !this.filesToArchive.map(a => a.file_id).includes(files.file_id));
    }

    //extract only file ids
    let archiveIds = this.filesToArchive.map(a => a.file_id);
    let deleteIds = this.filesToDelete.map(a => a.file_id);


    //TODO:put overlay for update
    
    this.subscriptions.push(
      forkJoin([
        this.apiService.archiveMultipleFilesById(archiveIds), // result[0]
        this.apiService.deleteMultipleFilesById(deleteIds), // result[1]
      ]).subscribe({
        next: (result) => {
          let changedFileIds =this.hydrusFiles.filter(files => !this.filesSkipped.map(s => s.file_id).includes(files.file_id)).map(f => f.file_id);
        },
        error: (e) => {
          
        },
      })
    );

  }

}
