import { Subscription } from "rxjs";
import { HydrusFile } from "../entities/hydrus-file";
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  HostListener,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { ViewportRuler } from "@angular/cdk/scrolling";

@Component({
  selector: "app-image-display-chunk",
  templateUrl: "./image-display-chunk.component.html",
  styleUrls: ["./image-display-chunk.component.scss"],
})
//TODO: itemSize
export class ImageDisplayChunkComponent implements OnInit, OnDestroy {
  @Input() hydrusFiles!: HydrusFile[];
  chunkSize: number;
  itemSet: [][] = [];
  itemHeight: number;
  itemWidth: number;
  private viewportChangeSub!: Subscription;

  constructor(
    private readonly viewportRuler: ViewportRuler,
    private readonly ngZone: NgZone
  ) {
    this.itemHeight =230;
    this.itemWidth = 265;
    this.chunkSize = 1;
  }

  ngOnInit(): void {
   // this.getItemDimensions();
    this.calcChunkSize();
    this.generateDataChunk(this.hydrusFiles);

    //https://stackoverflow.com/questions/35527456/angular-window-resize-event
    this.viewportChangeSub = this.viewportRuler
      .change(200)
      .subscribe(() =>
        this.ngZone.run(() => this.generateDataChunk(this.hydrusFiles))
      );
  }

  ngOnDestroy() {
    this.viewportChangeSub.unsubscribe();
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

  getItemDimensions(): void {
    //get inital dimensions from local storage
    this.itemHeight = 230;
    this.itemWidth = 265;
  }

  calcChunkSize(): void {
    let w = window.innerWidth;
    this.chunkSize = Math.floor(w / (this.itemWidth+50)) - 1;
  }
}
