import { UserFiles } from "./../entities/archive-delete-filter";
import { InjectorService } from "./../services/injector.service";
import { OverlayUtil } from "./../utilities/overlay-util";
import { NavigationEnd, Router } from "@angular/router";
import { HydrusFile } from "./../entities/hydrus-file";
import { FileService } from "./../services/file.service";
import { ApiService } from "./../services/api.service";
import { forkJoin, Subscription } from "rxjs";
import { environment } from "./../../environments/environment.prod";
import { Title } from "@angular/platform-browser";
import { Component, OnDestroy, OnInit, ViewContainerRef } from "@angular/core";

import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";

import { Overlay } from "@angular/cdk/overlay";

@Component({
  selector: "app-file-search",
  templateUrl: "./file-search.component.html",
  styleUrls: ["./file-search.component.scss"],
})

//TODO: show recently changed files in a seperate area
export class FileSearchComponent implements OnInit, OnDestroy {
  searchTags: string[];
  sortType: number;
  sortDir: boolean;
  initalTags: string[];
  subscriptions: Subscription[];
  hydrusFiles: HydrusFile[];
  searchParams!: URLSearchParams;
  loading = true;
  mobileView = false;
  overlayUtil: OverlayUtil;
  filterStyle: string;
  recentlyChangedFileIds: number[];
  continueFilter: boolean;

  constructor(
    titleService: Title,
    private apiService: ApiService,
    private fileService: FileService,
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    viewContainerRef: ViewContainerRef,
    overlay: Overlay,
    private injectorService: InjectorService
  ) {
    this.sortType = 2; //import time
    this.sortDir = true;
    this.subscriptions = [];
    this.hydrusFiles = [];
    this.recentlyChangedFileIds = [];
    this.continueFilter = false;
    this.initalTags = ["system:limit = 35", "system:inbox"];
    this.searchTags = this.initalTags;
    this.overlayUtil = new OverlayUtil(viewContainerRef, overlay);
    this.filterStyle = "select-list";
    titleService.setTitle("File Search | " + environment.app_name);

    //check if mobile view
    this.breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.Tablet])
      .subscribe({
        next: (r) => {
          if (r.matches) {
            this.mobileView = true;
            this.filterStyle = "full-screen";
          }
        },
      });

    this.subscriptions.push(
      this.router.events.subscribe((e: any) => {
        if (e instanceof NavigationEnd) {
          if (e.url.includes("?")) {
            this.searchParams = new URLSearchParams(
              e.url.slice(e.url.indexOf("?"))
            );
            this.saveSearchParams();
            let tempSplit = this.searchParams.get("tags")?.split(",");
            if (tempSplit) {
              this.searchTags = tempSplit;
            }

            let s = this.searchParams.get("sortType");
            if (s) {
              this.sortType = +s;
            }

            if (this.searchParams.get("sortDir") === "false") {
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

  ngOnInit(): void {}

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
      this.fileService
        .getFileWithMetadataFromSearch(
          this.searchTags,
          this.sortType.toString(),
          this.sortDir.toString()
        )
        .subscribe({
          next: (files) => {
            this.hydrusFiles = files;
            this.loading = false;
            if (this.continueFilter) {
              setTimeout(
                () =>
                  this.injectorService.announceFullscreenOverlay({
                    files: this.hydrusFiles,
                    currentIndex: 0,
                  }),
                300
              );
            }
          },
        })
    );
    this.setSearchParams();
    this.saveSearchParams();
  }

  deleteFile(fileId: number): void {
    this.apiService.deleteFileById(fileId).subscribe({
      next: (result) => {
        // console.log(result);
      },
    });
  }

  startFilter(): void {
    //if mobile view use fullscreen overlay filter
    if (this.mobileView) {
      this.overlayUtil.createMobileOverlay();
    } else {
      if (this.filterStyle === "full-screen") {
        this.overlayUtil.createFullscreenOverlay();
      } else if (this.filterStyle === "select-list") {
        this.router.navigate(["/archive-delete-filter-selection"], {
          state: {
            files: this.hydrusFiles,
            tags: this.searchTags,
            sortDir: this.sortDir,
            sortType: this.sortType,
          },
        });
      }
    }

    if (this.filterStyle === "full-screen") {
      //send files to overlay
      setTimeout(
        () =>
          this.injectorService.announceFullscreenOverlay({
            files: this.hydrusFiles,
            currentIndex: 0,
          }),
        300
      );

      //retrieve files from overlay and whether to commit them
      this.subscriptions.push(
        this.injectorService.sendFilesSourceFound$.subscribe((msg) => {
          if (!msg.continueFilter) {
            this.overlayUtil.closeOverlay();
            this.continueFilter = false;
          } else {
            this.continueFilter = true;
          }

          if (msg.makeChanges) {
            this.updateFileStatuses(msg.files);
          } else {
            console.log("no changes");
          }
        })
      );
    }
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

  updateFileStatuses(userFiles: UserFiles): void {
    let archiveIds = userFiles.archive.map((a) => a.file_id);
    let deleteIds = userFiles.delete.map((a) => a.file_id);

    this.recentlyChangedFileIds = archiveIds.concat(deleteIds);

    if (archiveIds.length > 0 && deleteIds.length > 0) {
      this.subscriptions.push(
        forkJoin([
          this.apiService.archiveMultipleFilesById(archiveIds), // result[0]
          this.apiService.deleteMultipleFilesById(deleteIds), // result[1]
        ]).subscribe({
          next: (result) => {
            this.searchFiles();
          },
          error: (e) => {
            console.log(e);
          },
        })
      );
    } else if (deleteIds.length > 0) {
      this.apiService.deleteMultipleFilesById(deleteIds).subscribe({
        next: (delResult) => {
          this.searchFiles();
        },
        error: (e) => {
          console.log(e);
        },
      });
    } else if (archiveIds.length > 0) {
      this.apiService.archiveMultipleFilesById(archiveIds).subscribe({
        next: (delResult) => {
          this.searchFiles();
        },
        error: (e) => {
          console.log(e);
        },
      });
    }
  }

  viewRecentlyChanged(): void {
    console.log(this.recentlyChangedFileIds);
  }

  noRecentlyChangedFiles(): boolean {
    if (this.recentlyChangedFileIds.length > 0) {
      return false;
    }
    return true;
  }
}
