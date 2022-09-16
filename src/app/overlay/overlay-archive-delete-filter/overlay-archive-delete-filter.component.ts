import { FileService } from './../../services/file.service';
import { Subscription } from "rxjs";
import { trigger, transition, animate, keyframes } from "@angular/animations";
import { Component, ElementRef, HostListener, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { UserFiles } from "src/app/entities/archive-delete-filter";
import { HydrusFile } from "src/app/entities/hydrus-file";
import { InjectorService } from "src/app/services/injector.service";
import { DialogMessageUtils } from "src/app/utilities/dialog-message-util";
import { EnumUtil } from "src/app/utilities/enum-util";
import * as kf from "./keyframes";

@Component({
  selector: "app-overlay-archive-delete-filter",
  templateUrl: "./overlay-archive-delete-filter.component.html",
  styleUrls: ["./overlay-archive-delete-filter.component.scss"],
  animations: [
    trigger("cardAnimator", [
      transition("* => slideOutLeft", animate(855, keyframes(kf.slideOutLeft))),
      transition(
        "* => slideOutRight",
        animate(855, keyframes(kf.slideOutRight))
      ),
    ]),
  ],
})
export class OverlayArchiveDeleteFilterComponent implements OnInit {
  hydrusFiles: HydrusFile[];
  currentFileIndex: number;
  loading = true;
  fileChanges: UserFiles;
  currentFile!: HydrusFile;
  enumUtil = EnumUtil;
  complete = false;
  animationState: string;
  dialogUtils: DialogMessageUtils;
  subscriptions: Subscription[];
  dialogOnClose = true;

  @ViewChild('videoPlayer') videoPlayer!: ElementRef;

  constructor(private injectorService: InjectorService, dialog: MatDialog, private fileService: FileService) {
    this.animationState = "";
    this.fileChanges = new UserFiles();
    this.dialogUtils = new DialogMessageUtils(dialog);
    this.subscriptions = [];
    this.hydrusFiles = [];
    this.currentFileIndex = 0;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  ngOnInit(): void {
    this.loading = true;
    this.subscriptions.push(
      this.injectorService.fullscreenOverlaySourceFound$.subscribe((info) => {
        this.hydrusFiles = info.files;
        this.currentFileIndex = info.currentIndex;
        this.currentFile = this.hydrusFiles[this.currentFileIndex];
        if (info.currentFileChanges) {
          this.fileChanges = info.currentFileChanges;
        }
        if (info.dialogOnClose === false) {
          this.dialogOnClose = false;
        }
      })
    );
  }
  onSwipe(e: any): void {
    if (e.direction === this.enumUtil.swipeDirection.DIRECTION_LEFT) {
      // right - archive
      this.sendToArchive();
    } else if (e.direction === this.enumUtil.swipeDirection.DIRECTION_RIGHT) {
      // left - delete
      this.sendToDelete();
    }/* else if (e.direction === this.enumUtil.swipeDirection.DIRECTION_UP) {
      // down - previous
      this.sendToPrevious();
    } else if (e.direction === this.enumUtil.swipeDirection.DIRECTION_DOWN) {
      // up - skip
      this.sendToSkip();
    }*/
  }

  onLoad(): void {
    this.loading = false;
  }

  sendToDelete(): void {
    this.fileChanges.delete.push(this.currentFile);

    if (this.currentFileIndex + 1 < this.hydrusFiles.length) {
      setTimeout(() => this.nextImage(), 500);
    } else {
      this.sendSelectedFiles();
    }
  }

  sendToArchive(): void {
    this.fileChanges.archive.push(this.currentFile);
    if (this.currentFileIndex + 1 < this.hydrusFiles.length) {
      setTimeout(() => this.nextImage(), 500);
    } else {
      this.sendSelectedFiles();
    }
  }

  sendToSkip(): void {
    this.fileChanges.skipped.push(this.currentFile);

    if (this.currentFileIndex + 1 < this.hydrusFiles.length) {
      setTimeout(() => this.nextImage(), 500);
    } else {
      this.sendSelectedFiles();
    }
  }

  sendToPrevious(): void {
    if (this.currentFileIndex - 1 >= 0) {
      this.currentFileIndex--;
      this.currentFile = this.hydrusFiles[this.currentFileIndex];
    }
    //reset image
    if (this.fileChanges.archive.includes(this.currentFile)) {
      this.fileChanges.archive.splice(
        this.fileChanges.archive.indexOf(this.currentFile),
        1
      );
    } else if (this.fileChanges.delete.includes(this.currentFile)) {
      this.fileChanges.delete.splice(
        this.fileChanges.delete.indexOf(this.currentFile),
        1
      );
    } else if (this.fileChanges.skipped.includes(this.currentFile)) {
      this.fileChanges.skipped.splice(
        this.fileChanges.skipped.indexOf(this.currentFile),
        1
      );
    }
  }

  nextImage(): void {
    this.loading = true;
    this.currentFile = this.hydrusFiles[this.currentFileIndex + 1];
    this.currentFileIndex++;
  }

  closeFullscreen(): void {
    if ((this.fileChanges.archive.length > 0 || this.fileChanges.delete.length > 0) && this.dialogOnClose) {
      //dialog to save current changes or cancel
      const dialogConfirmRef = this.dialogUtils.displayConfirmation(
        "Would you like to commit current changes?",
        "Filtering Cancelled"
      );

      dialogConfirmRef.afterClosed().subscribe((confirmation) => {
        if (confirmation) {
          this.injectorService.closeFullscreenOverlay({
            files: this.fileChanges,
            makeChanges: true,
            continueFilter: false,
          });
        } else {
          this.injectorService.closeFullscreenOverlay({
            files: this.fileChanges,
            makeChanges: false,
            continueFilter: false,
          });
        }
      });
    } else {
      this.injectorService.closeFullscreenOverlay({
        files: this.fileChanges,
        makeChanges: false,
        continueFilter: false,
      });
    }
  }

  sendSelectedFiles(): void {
    this.loading = true;
    //dialog to save current changes or cancel
    const dialogConfirmRef = this.dialogUtils.displayFilterConfirmation(
      "Would you like to commit current changes?",
      "Filtering Complete"
    );

    dialogConfirmRef.afterClosed().subscribe((confirmation) => {
      if (this.dialogOnClose) {
        if (confirmation === "continue") {
          this.injectorService.closeFullscreenOverlay({
            files: this.fileChanges,
            makeChanges: true,
            continueFilter: true,
          });
        } else if (confirmation === "commit") {
          this.injectorService.closeFullscreenOverlay({
            files: this.fileChanges,
            makeChanges: true,
            continueFilter: false,
          });
        } else {
          this.injectorService.closeFullscreenOverlay({
            files: this.fileChanges,
            makeChanges: false,
            continueFilter: false,
          });
        }

      } else {
        this.injectorService.closeFullscreenOverlay({
          files: this.fileChanges,
          makeChanges: true,
          continueFilter: false,
        });
      }

    });
  }

  startAnimation(state: any) {
    if (!this.animationState) {
      this.animationState = state;
    }
  }

  resetAnimationState(state: any) {
    this.animationState = "";
  }

  imageType(mime?: string): boolean {
    if (mime?.includes("video")) {
      return false;
    }
    return true;
  }

  playVideo(): void {
    this.videoPlayer.nativeElement.play();
  }

  downloadFile(file: HydrusFile): void {
    this.fileService.downloadFile(file).subscribe({
      next: (fileBlob) => {
        const a = document.createElement("a");
        document.body.appendChild(a);
        let url = window.URL.createObjectURL(fileBlob);
        a.href = url;
        let fileName = file.hash;
        //filename + file extension from mime
        a.download = `${fileName}.${file.mime.substring(file.mime.indexOf("\\") + 1)}`;
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();

        window.open(url);
      },
    });
  }

  /* interferes with video controls
  @HostListener("window:keydown", ["$event"])
  handleKeyDown(event: KeyboardEvent) {
    event.preventDefault();
    if (event.key === "ArrowDown") {
      this.sendToPrevious();
    } else if (event.key === "ArrowUp") {
      this.sendToSkip();
    } else if (event.key === "ArrowRight") {
      this.sendToArchive();
    } else if (event.key === "ArrowLeft") {
      this.sendToDelete();
    } else if (event.key === "Escape") {
      this.closeFullscreen();
    }
  }*/
}
