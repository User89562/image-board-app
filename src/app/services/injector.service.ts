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
  private newReleasesFoundSource = new Subject<string>();
  private torrentSelectionSource = new EventEmitter<string>();

  // Observable streams
  proccessingFound$ = this.processingSource.asObservable();
  overlaySourceFound$ = this.overlaySource.asObservable();
  newReleasesFound$ = this.newReleasesFoundSource.asObservable();
  torrentSelectionFound$ = this.torrentSelectionSource.asObservable();

  announceProcessing(message: Map<string, string>): void {
    this.processingSource.emit(message);
  }

  // Service message commands
  announceNewReleases(mission: string) {
    this.newReleasesFoundSource.next(mission);
  }

  announceTorrentSelection(message: string): void {
    this.torrentSelectionSource.emit(message);
  }

  closeOverlay(msg: string): void {
    this.overlaySource.next(msg);
  }
}
