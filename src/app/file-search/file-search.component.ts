import { NavigationEnd, Router } from '@angular/router';
import { HydrusFile } from './../entities/hydrus-file';
import { FileService } from './../services/file.service';
import { ApiService } from './../services/api.service';
import { Subscription } from 'rxjs';
import { environment } from './../../environments/environment.prod';
import { Title } from '@angular/platform-browser';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { SortDirection } from '@angular/material/sort';

@Component({
  selector: 'app-file-search',
  templateUrl: './file-search.component.html',
  styleUrls: ['./file-search.component.scss']
})
export class FileSearchComponent implements OnInit, OnDestroy {
  searchTags: string[];
  sortType: number;
  sortDir: boolean;
  initalTags: string[];
  subscriptions: Subscription[];
  hydrusFiles: HydrusFile[];
  searchParams!: URLSearchParams;
  loading = true;

  constructor(titleService: Title, private apiService: ApiService, private fileService: FileService, private router:Router) { 
    this.sortType = 2; //import time
    this.sortDir = true;
    this.subscriptions = [];
    this.hydrusFiles = [];
    this.initalTags = ['system:limit = 5', 'system:inbox'];
    this.searchTags = this.initalTags;
    titleService.setTitle('File Search | ' +environment.app_name);


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
    
  }

  tagsChanged(tags: string[]) {
    this.searchTags = tags;
    this.hydrusFiles = [];
    this.searchFiles();
  }

  sortTypeChanged(type: number) {
    this.sortType = type;
    this.searchFiles();
  }

  sortDirChanged(dir: boolean) {
    this.sortDir = dir;
    this.searchFiles();
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

  deleteFile(fileId: number): void {
    this.apiService.deleteFileById(fileId).subscribe({
      next: (result) => {
        console.log(result);
      }
    })
  }

  displayOptions(): void {
    //choose fullscreen or thumbnail selection
    //temp just go to archivefilter as thumbnail selection
    this.router.navigate(["/archive-delete-filter"], {
      state: { files: this.hydrusFiles, tags: this.searchTags, sortDir: this.sortDir, sortType: this.sortType},
    });
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
}
