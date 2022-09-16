import { Overlay, ViewportRuler } from "@angular/cdk/overlay";
import {
  Component,
  EventEmitter,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  ViewContainerRef,
} from "@angular/core";
import { Subscription } from "rxjs";
import { UserFiles } from "src/app/entities/archive-delete-filter";
import { HydrusFile } from "src/app/entities/hydrus-file";
import { InjectorService } from "src/app/services/injector.service";
import { LocalStorageUtil } from "src/app/utilities/local-storage-util";
import { OverlayUtil } from "src/app/utilities/overlay-util";

@Component({
  selector: "app-image-display-chunk-select-list",
  templateUrl: "./image-display-chunk-select-list.component.html",
  styleUrls: ["./image-display-chunk-select-list.component.scss"],
})
export class ImageDisplayChunkSelectListComponent implements OnInit, OnDestroy {
  @Input() hydrusFiles!: HydrusFile[];
  @Output() filesChanged = new EventEmitter<UserFiles>();
  localStorageUtil = LocalStorageUtil;
  overlayUtil: OverlayUtil;
  currentIndex: number;
  fileChanges: UserFiles;
  subscriptions: Subscription[];
  continueFilter: boolean;
  continue: boolean;
  chunkSize: number;
  itemSet: [][] = [];
  @Input() itemHeight!: number;
  @Input() itemWidth!: number;
  private viewportChangeSub!: Subscription;
  h = 0;

  constructor(
    viewContainerRef: ViewContainerRef,
    overlay: Overlay,
    private injectorService: InjectorService,
    private readonly viewportRuler: ViewportRuler,
    private readonly ngZone: NgZone
  ) {
    this.overlayUtil = new OverlayUtil(viewContainerRef, overlay);
    this.currentIndex = 0;
    this.fileChanges = new UserFiles();
    this.subscriptions = [];
    this.continueFilter = false;
    this.continue = true;
    this.chunkSize = 1;
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
    this.viewportChangeSub.unsubscribe();
  }

  ngOnInit(): void {
    let dim = this.localStorageUtil.retrieveThumbnailDimensions();
    if (dim) {
      let parsed = JSON.parse(dim);
      this.itemHeight = parsed.height;
      this.itemWidth = parsed.width;
    } else {
      this.localStorageUtil.addToStorage(this.itemHeight, this.itemWidth);
    }
    this.calcChunkSize();
    this.generateDataChunk(this.hydrusFiles);

    //https://stackoverflow.com/questions/35527456/angular-window-resize-event
    this.viewportChangeSub = this.viewportRuler
      .change(200)
      .subscribe(() =>
        this.ngZone.run(() => this.generateDataChunk(this.hydrusFiles))
      );
  }

  // https://stackoverflow.com/questions/57476762/angular-material-cdk-virtual-scroll-viewport-how-to-render-multiple-items-per-r
  generateDataChunk(data: any) {
    this.calcChunkSize();
    let index: number;
    let dataChunk: [][] = [];
    for (index = 0; index < data.length; index += this.chunkSize) {
      dataChunk.push(data.slice(index, index + this.chunkSize));
    }
    this.itemSet = dataChunk;
  }

  /*
  getItemDimensions(): void {
    //get inital dimensions from local storage
    this.itemHeight = 230;
    this.itemWidth = 265;
  }*/

  calcChunkSize(): void {
    let w = window.innerWidth;
    this.chunkSize = Math.floor(w / (this.itemWidth+50));
    this.h = Math.ceil(this.hydrusFiles.length / this.chunkSize) * (this.itemHeight+155);
  }

  fullscreenView(file: HydrusFile): void {
    //emit to parent to go fullscreen(?)
    this.overlayUtil.createFullscreenOverlay();
    this.currentIndex = this.hydrusFiles.indexOf(file);
    this.setupFileChanges();

    //send files to overlay
    setTimeout(
      () =>
        this.injectorService.announceFullscreenOverlay({
          files: this.hydrusFiles,
          currentIndex: this.hydrusFiles.indexOf(file),
          currentFileChanges: this.fileChanges,
          dialogOnClose: false,
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
        let finishedFiltering =
          msg.files.archive.length +
          msg.files.delete.length +
          msg.files.skipped.length;

        if (msg.makeChanges && finishedFiltering === this.hydrusFiles.length) {
          //emit to parent
          this.filesChanged.emit(this.fileChanges);
          // this.updateFileStatuses(msg.files);
        } else {
          this.fileChanges = msg.files;
        }
      })
    );
  }

  isPlayable(file: HydrusFile): boolean {
    if (file.mime.includes("video") || file.mime.includes("gif")) {
      return true;
    }
    return false;
  }

  // middle mouse = aux-click - middle mouse = 1, rightclick = 2
  onAuxClick(file: HydrusFile, e: any): void {
    this.currentIndex = this.hydrusFiles.indexOf(file);
    if (e.button === 2) {
      if (this.fileChanges.skipped.includes(file)) {
        this.fileChanges.skipped.splice(
          this.fileChanges.archive.indexOf(file),
          1
        );
      } else {
        this.fileChanges.skipped.push(file);
      }
      if (this.fileChanges.archive.includes(file)) {
        this.fileChanges.archive.splice(
          this.fileChanges.archive.indexOf(file),
          1
        );
      }
    }
  }

  selectFile(file: HydrusFile, e: any): void {
    this.currentIndex = this.hydrusFiles.indexOf(file);
    if (this.fileChanges.archive.includes(file)) {
      this.fileChanges.archive.splice(
        this.fileChanges.archive.indexOf(file),
        1
      );
    } else {
      this.fileChanges.archive.push(file);
    }

    if (this.fileChanges.skipped.includes(file)) {
      this.fileChanges.skipped.splice(
        this.fileChanges.skipped.indexOf(file),
        1
      );
    }
  }

  //remove
  isFileSelected(file: HydrusFile): string {
    if (this.fileChanges.archive.includes(file)) {
      return "8px solid #00e676";
    } else if (this.fileChanges.skipped.includes(file)) {
      return "8px solid  #007ac1";
    }
    return "8px solid #424242";
  }

  //determine files to be trashed
  setupFileChanges(): void {
    let f: HydrusFile[] = [];

    if (this.currentIndex != this.hydrusFiles.length - 1) {
      f = this.hydrusFiles.slice(0, this.currentIndex);
    } else {
      f = this.hydrusFiles;
    }

    this.fileChanges.delete = [];
    if (
      this.fileChanges.archive.length > 0 &&
      this.fileChanges.skipped.length > 0
    ) {
      //remove archive files from all files
      this.fileChanges.delete = f.filter(
        (files) =>
          !this.fileChanges.archive
            .map((s) => s.file_id)
            .includes(files.file_id)
      );
      // remove skipped files from first filter result
      this.fileChanges.delete = this.fileChanges.delete.filter(
        (files) =>
          !this.fileChanges.skipped
            .map((s) => s.file_id)
            .includes(files.file_id)
      );
    } else if (this.fileChanges.archive.length > 0) {
      this.fileChanges.delete = f.filter(
        (files) =>
          !this.fileChanges.archive
            .map((s) => s.file_id)
            .includes(files.file_id)
      );
    } else if (this.fileChanges.skipped.length > 0) {
      this.fileChanges.delete = f.filter(
        (files) =>
          !this.fileChanges.skipped
            .map((s) => s.file_id)
            .includes(files.file_id)
      );
    } else {
      this.fileChanges.delete = f;
    }

    //  this.updateFileStatuses(this.fileChanges);
  }

  submitFiles(): void {
    this.setupFileChanges();
    this.filesChanged.emit(this.fileChanges);
  }
}
