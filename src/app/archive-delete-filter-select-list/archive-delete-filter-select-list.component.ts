import { UserFiles } from "src/app/entities/archive-delete-filter";
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewContainerRef,
} from "@angular/core";
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
import { LocalStorageUtil } from "../utilities/local-storage-util";

@Component({
  selector: "app-archive-delete-filter-select-list",
  templateUrl: "./archive-delete-filter-select-list.component.html",
  styleUrls: ["./archive-delete-filter-select-list.component.scss"],
})

//TODO: create image-display-chunk-select-list -> move all components related to it there
export class ArchiveDeleteFilterSelectListComponent
  implements OnInit, OnDestroy
{
  hydrusFiles: HydrusFile[];
  searchTags!: string[];
  sortType!: number;
  sortDir: boolean = true;
  searchParams!: URLSearchParams;
  subscriptions: Subscription[];
  loading = true;
  enumUtil = EnumUtil;
  currentIndex: number;
  overlayUtil: OverlayUtil;
  continueFilter: boolean;
  processing: boolean = false;
  localStorageUtil = LocalStorageUtil;
  thumbnailHeight: number;
  thumbnailWidth: number;
  continue: boolean;

  constructor(
    private router: Router,
    titleService: Title,
    private apiService: ApiService,
    private fileService: FileService,
    private injectorService: InjectorService,
    viewContainerRef: ViewContainerRef,
    overlay: Overlay
  ) {
    titleService.setTitle("Archive/Delete | " + environment.app_name);
    this.hydrusFiles = [];
    this.subscriptions = [];
    this.currentIndex = 0;
    this.overlayUtil = new OverlayUtil(viewContainerRef, overlay);
    this.continueFilter = false;
    this.thumbnailWidth = 365;
    this.thumbnailHeight = 330;
    this.continue = true;

    if (this.router.getCurrentNavigation()?.extras.state) {
      this.hydrusFiles =
        this.router.getCurrentNavigation()?.extras.state?.["files"];
      this.searchTags =
        this.router.getCurrentNavigation()?.extras.state?.["tags"];
      if (
        this.router.getCurrentNavigation()?.extras.state?.["sortDir"] ===
        "false"
      ) {
        this.sortDir = false;
      }
      this.sortType =
        this.router.getCurrentNavigation()?.extras.state?.["sortType"];

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
    let dim = this.localStorageUtil.retrieveThumbnailDimensions();
    if (dim) {
      let parsed = JSON.parse(dim);
      this.thumbnailHeight = parsed.height;
      this.thumbnailWidth = parsed.width;
    } else {
      this.localStorageUtil.addToStorage(
        this.thumbnailHeight,
        this.thumbnailWidth
      );
    }
  }

  searchFiles(): void {
    if (this.continue) {
      this.processing = false;
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
                    this.loading = false;
                  },
                });
            },
          })
      );
      this.setSearchParams();
      this.saveSearchParams();
    } else {
      this.router.navigate(["/file-search"]);
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
    this.processing = true;
    this.loading = true;
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

  submitFiles(): void {
    //
  }

  updateHeight(e: any): void {
    this.localStorageUtil.addToStorage(e, this.thumbnailWidth);
    //emit to child
  }

  updateWidth(e: any): void {
    this.localStorageUtil.addToStorage(this.thumbnailHeight, e);
    //emit to child
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}
