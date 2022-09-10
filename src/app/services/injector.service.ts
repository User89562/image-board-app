import { HydrusFile } from './../entities/hydrus-file';
import { UserFiles } from './../entities/archive-delete-filter';
import { EventEmitter, Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class InjectorService {
  constructor() {}

  // Observable  sources
  private processingSource = new EventEmitter<Map<string, string>>();
  private overlaySource = new Subject<string>();
  private fullscreenOverlaySource = new Subject<{files: HydrusFile[], currentIndex: number, currentFileChanges?: UserFiles, dialogOnClose?: boolean}>();
  private sendFilesSource = new Subject<{files: UserFiles, makeChanges: boolean, continueFilter: boolean}>();


  // Observable streams
  proccessingFound$ = this.processingSource.asObservable();
  overlaySourceFound$ = this.overlaySource.asObservable();
  fullscreenOverlaySourceFound$ = this.fullscreenOverlaySource.asObservable();
  sendFilesSourceFound$ = this.sendFilesSource.asObservable();


  announceProcessing(message: Map<string, string>): void {
    this.processingSource.emit(message);
  }

  announceFullscreenOverlay(files: {files: HydrusFile[], currentIndex: number, currentFileChanges?: UserFiles, dialogOnClose?: boolean}): void {
    this.fullscreenOverlaySource.next(files);
  }



  closeFullscreenOverlay(files: {files: UserFiles, makeChanges: boolean, continueFilter: boolean}): void {
    this.sendFilesSource.next(files);
  }

  closeOverlay(msg: string): void {
    this.overlaySource.next(msg);
  }
}
