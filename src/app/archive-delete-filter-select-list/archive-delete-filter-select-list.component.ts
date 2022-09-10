import { UserFiles } from "src/app/entities/archive-delete-filter";
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewContainerRef } from "@angular/core";
import { HydrusFile } from "src/app/entities/hydrus-file";
import { Title } from "@angular/platform-browser";
import { Router, NavigationEnd } from "@angular/router";
import { Subscription, forkJoin } from "rxjs";
import { environment } from "src/environments/environment.prod";
import { ApiService } from "../services/api.service";
import { FileService } from "../services/file.service";
import { InjectorService } from "../services/injector.service";
import { EnumUtil } from "../utilities/enum-util";
import { Overlay } from "@angular/cdk/overlay";
import { OverlayUtil } from "../utilities/overlay-util";

@Component({
  selector: "app-archive-delete-filter-select-list",
  templateUrl: "./archive-delete-filter-select-list.component.html",
  styleUrls: ["./archive-delete-filter-select-list.component.scss"],
})
export class ArchiveDeleteFilterSelectListComponent implements OnInit, OnDestroy {
  hydrusFiles: HydrusFile[];
  fileChanges: UserFiles;
  searchTags!: string[];
  sortType!: number;
  sortDir: boolean = true;
  searchParams!: URLSearchParams;
  subscriptions: Subscription[];
  loading = true;
  enumUtil = EnumUtil;
  mobileCurrentImage!: HydrusFile;
  currentIndex: number;
  overlayUtil: OverlayUtil;
  continueFilter: boolean;
  

  constructor(
    private router: Router,
    titleService: Title,
    private apiService: ApiService,
    private fileService: FileService,
    private injectorService: InjectorService,
    viewContainerRef: ViewContainerRef,
    overlay: Overlay,
  ) {
    titleService.setTitle("Archive/Delete | " + environment.app_name);
    this.hydrusFiles = [];
    this.fileChanges = new UserFiles();
    this.subscriptions = [];
    this.currentIndex = 0;
    this.overlayUtil = new OverlayUtil(viewContainerRef, overlay);
    this.continueFilter = false;

    if (this.router.getCurrentNavigation()?.extras.state) {
      this.hydrusFiles =
        this.router.getCurrentNavigation()?.extras.state?.["files"];
      this.searchTags =
        this.router.getCurrentNavigation()?.extras.state?.["tags"];
      if (this.router.getCurrentNavigation()?.extras.state?.["sortDir"] === "false" ) {
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

  ngOnInit(): void {
    if (this.hydrusFiles.length === 0) {
      this.searchFiles();
    }
  //  this.injectorService.announceFullscreen("disabled");
  }

  searchFiles(): void {
    this.loading = true;
    this.hydrusFiles = [];
    this.subscriptions.push(
      this.apiService
        .getFilesSearch(
          this.searchTags,
          this.sortType.toString(),
          this.sortDir.toString()
        )
        .subscribe({
          next: (searchResult) => {
            this.fileService
              .getThumbnailAndMetadata(searchResult.file_ids)
              .subscribe({
                next: (files) => {
                  this.hydrusFiles = files;
                  this.mobileCurrentImage = this.hydrusFiles[0];
                  this.loading = false;
                },
              });
          },
        })
    );
    this.setSearchParams();
    this.saveSearchParams();
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

  selectFile(file:HydrusFile, e: any): void {
    this.currentIndex = this.hydrusFiles.indexOf(file);
    if (this.fileChanges.archive.includes(file)) {
      this.fileChanges.archive.splice(this.fileChanges.archive.indexOf(file), 1);
    } else {
      this.fileChanges.archive.push(file);
    }
  }

  isFileSelected(file: HydrusFile): string {
    if (this.fileChanges.archive.includes(file)) {
      return "8px solid #00e676";
    } else if (this.fileChanges.skipped.includes(file)) {
      return "8px solid  #007ac1";
    }
    return "8px solid transparent";
  }

  // middle mouse = aux-click - middle mouse = 1, rightclick = 2
  onAuxClick(file: HydrusFile, e: any): void {
    this.currentIndex = this.hydrusFiles.indexOf(file);
    if (e.button === 1) {
      if (this.fileChanges.skipped.includes(file)) {
        this.fileChanges.skipped.splice(this.fileChanges.archive.indexOf(file), 1);
        
      } else {
        this.fileChanges.skipped.push(file);
      }
    }     
  }

  fullscreenView(file: HydrusFile): void {
    this.overlayUtil.createFullscreenOverlay();
    this.setupFileChanges();

    //send files to overlay
    setTimeout(
      () =>
        this.injectorService.announceFullscreenOverlay({
          files: this.hydrusFiles,
          currentIndex: this.hydrusFiles.indexOf(file),
          currentFileChanges: this.fileChanges,
          dialogOnClose: false
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

        //check to see if all files have been filtered and compare to 'hydrusFiles'
        let finishedFiltering = msg.files.archive.length + msg.files.delete.length + msg.files.skipped.length;

        if (msg.makeChanges && finishedFiltering === this.hydrusFiles.length) {
          this.updateFileStatuses(msg.files);
        } else {
          this.fileChanges = msg.files;
        }
      })
    );
  }

  determineInboxStatus(file: HydrusFile): string {
    if (this.fileChanges.archive.includes(file)){
      return 'archive'
    }
    if (file.is_inbox) {
      return 'mail';
    }
    return 'archive';
  }

  determineDeleteStatus(file: HydrusFile): string {
    if (this.fileChanges.delete.includes(file) || file.is_trashed){
      return 'delete'
    }
    return '';
  }

  //determine files to be trashed
  setupFileChanges(): void {
    this.fileChanges.delete = [];
    if (this.fileChanges.archive.length > 0 && this.fileChanges.skipped.length > 0) {
      //remove archive files from all files
      this.fileChanges.delete = this.hydrusFiles.filter(
        (files) =>
          !this.fileChanges.archive.map((s) => s.file_id).includes(files.file_id)
      ); 
      // remove skipped files from first filter result
      this.fileChanges.delete = this.fileChanges.delete.filter(
        (files) =>
          !this.fileChanges.skipped.map((s) => s.file_id).includes(files.file_id)
      ); 
    } else if (this.fileChanges.archive.length > 0) {
      this.fileChanges.delete = this.hydrusFiles.filter(
        (files) =>
          !this.fileChanges.archive.map((s) => s.file_id).includes(files.file_id)
      );
    } else if (this.fileChanges.skipped.length > 0) {
      this.fileChanges.delete = this.hydrusFiles.filter(
        (files) =>
          !this.fileChanges.skipped.map((s) => s.file_id).includes(files.file_id)
      );
    } else {
      this.fileChanges.delete = this.hydrusFiles;
    }

  //  this.updateFileStatuses(this.fileChanges);
  }

  submitFiles(): void {
    this.setupFileChanges();
    this.updateFileStatuses(this.fileChanges);
  }


  updateFileStatuses(userFiles: UserFiles): void {
    let archiveIds = userFiles.archive.map((a) => a.file_id);
    let deleteIds = userFiles.delete.map((a) => a.file_id);

   // this.recentlyChangedFileIds = archiveIds.concat(deleteIds);

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

  isPlayable(file: HydrusFile): boolean {
    if (file.mime.includes('video') || file.mime.includes('gif')){
      return true;
    }
    return false;
  }
}
